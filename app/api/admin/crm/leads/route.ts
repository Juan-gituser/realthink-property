import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Inisialisasi Supabase Client (Mendukung Service Role Key untuk bypass RLS)
async function getSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (serviceRoleKey) {
    return createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false },
    });
  }

  const cookieStore = await cookies();
  return createServerClient(
    supabaseUrl,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {}
        },
      },
    }
  );
}

// Helper ekstraksi pesan eror Supabase
function parseErrorMessage(err: unknown): string {
  if (typeof err === "string") return err;
  if (err && typeof err === "object") {
    if ("message" in err && typeof (err as { message: unknown }).message === "string") {
      return (err as { message: string }).message;
    }
    if ("details" in err && typeof (err as { details: unknown }).details === "string") {
      return (err as { details: string }).details;
    }
  }
  return "Terjadi kesalahan pada server";
}

// GET: Fetch Leads dengan Join Properti Minat
export async function GET(req: NextRequest) {
  try {
    const supabase = await getSupabase();
    const { searchParams } = new URL(req.url);

    const search = searchParams.get("search")?.trim() || "";
    const status = searchParams.get("status") || "";
    const source = searchParams.get("source") || "";
    const assignedTo = searchParams.get("assigned_to") || "";
    const propertyId = searchParams.get("property_id") || "";

    let query = supabase
      .from("leads")
      .select(`
        *,
        lead_properties (
          id,
          interest_status,
          property_id,
          properties (
            id,
            title,
            price,
            address
          )
        )
      `)
      .order("created_at", { ascending: false });

    if (status) query = query.eq("status", status);
    if (source) query = query.eq("source", source);
    if (assignedTo) query = query.eq("assigned_to", assignedTo);

    if (search) {
      const sanitizedSearch = search.replace(/[%_]/g, "\\$&");
      query = query.or(
        `name.ilike.%${sanitizedSearch}%,whatsapp.ilike.%${sanitizedSearch}%,email.ilike.%${sanitizedSearch}%,lead_id.ilike.%${sanitizedSearch}%`
      );
    }

    const { data: leads, error } = await query;

    if (error) {
      console.error("Supabase GET Leads Error:", error);
      return NextResponse.json({ success: false, error: parseErrorMessage(error) }, { status: 400 });
    }

    let filteredLeads = leads || [];

    if (propertyId) {
      filteredLeads = filteredLeads.filter((lead) =>
        lead.lead_properties?.some(
          (lp: { property_id: string }) => lp.property_id === propertyId
        )
      );
    }

    return NextResponse.json({ success: true, data: filteredLeads });
  } catch (err: unknown) {
    return NextResponse.json({ success: false, error: parseErrorMessage(err) }, { status: 500 });
  }
}

// POST: Create New Lead + Relasi Properti + Log Aktivitas
export async function POST(req: NextRequest) {
  const supabase = await getSupabase();

  try {
    const body = await req.json();

    const {
      name,
      whatsapp,
      email,
      source = "Website",
      budget_min,
      budget_max,
      preferred_area,
      property_type,
      notes,
      assigned_to,
      property_ids = [],
      next_follow_up_at,
      status = "NEW",
    } = body;

    if (!name || !whatsapp) {
      return NextResponse.json(
        { success: false, error: "Nama dan WhatsApp wajib diisi." },
        { status: 400 }
      );
    }

    // 1. Insert Lead Baru
    const { data: newLead, error: leadErr } = await supabase
      .from("leads")
      .insert({
        name: name.trim(),
        whatsapp: whatsapp.trim(),
        email: email ? email.trim() : null,
        source,
        budget_min: budget_min ? Number(budget_min) : null,
        budget_max: budget_max ? Number(budget_max) : null,
        preferred_area: preferred_area || null,
        property_type: property_type || null,
        notes: notes || null,
        assigned_to: assigned_to || null,
        status: status,
        next_follow_up_at: next_follow_up_at || null,
      })
      .select()
      .single();

    if (leadErr) {
      console.error("Supabase Insert Lead Error:", leadErr);
      return NextResponse.json({ success: false, error: parseErrorMessage(leadErr) }, { status: 400 });
    }

    // 2. Insert Relasi Properti Minat
    if (Array.isArray(property_ids) && property_ids.length > 0) {
      const cleanPropertyIds: string[] = property_ids
        .map((item) => (typeof item === "object" && item !== null ? item.id : item))
        .filter((val): val is string => typeof val === "string" && val.trim().length > 0);

      if (cleanPropertyIds.length > 0) {
        const propertyInserts = cleanPropertyIds.map((propId: string) => ({
          id: crypto.randomUUID(),
          lead_id: newLead.id,
          property_id: propId,
          interest_status: "INTERESTED",
          created_at: new Date().toISOString(),
        }));

        const { error: relErr } = await supabase
          .from("lead_properties")
          .insert(propertyInserts);

        if (relErr) {
          console.error("Supabase Lead Properties Insert Error:", relErr);
        }
      }
    }

    // 3. Catat Log Aktivitas Awal
    await supabase.from("activities").insert({
      lead_id: newLead.id,
      activity_type: "STATUS_CHANGE",
      description: `Lead dibuat dengan status awal ${status} dari sumber ${source}.`,
    });

    // 4. Ambil kembali data Lead lengkap dengan JOIN properti
    const { data: completeLead } = await supabase
      .from("leads")
      .select(`
        *,
        lead_properties (
          id,
          interest_status,
          property_id,
          properties (
            id,
            title,
            price,
            address
          )
        )
      `)
      .eq("id", newLead.id)
      .single();

    return NextResponse.json({
      success: true,
      data: completeLead || newLead,
    });
  } catch (err: unknown) {
    return NextResponse.json({ success: false, error: parseErrorMessage(err) }, { status: 500 });
  }
}