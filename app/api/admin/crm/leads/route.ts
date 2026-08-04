import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

async function getSupabase() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
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

// GET: Fetch Leads with Search, Filters & Joined Properties
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

    // Filter langsung via Query Database
    if (status) query = query.eq("status", status);
    if (source) query = query.eq("source", source);
    if (assignedTo) query = query.eq("assigned_to", assignedTo);

    // Pencarian aman PostgREST Supabase
    if (search) {
      const sanitizedSearch = search.replace(/[%_]/g, "\\$&");
      query = query.or(
        `name.ilike.%${sanitizedSearch}%,whatsapp.ilike.%${sanitizedSearch}%,email.ilike.%${sanitizedSearch}%,lead_id.ilike.%${sanitizedSearch}%`
      );
    }

    const { data: leads, error } = await query;

    if (error) {
      console.error("Supabase GET Leads Error:", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    let filteredLeads = leads || [];

    // Filter tambahan berdasarkan property_id jika diminta
    if (propertyId) {
      filteredLeads = filteredLeads.filter((lead) =>
        lead.lead_properties?.some(
          (lp: { property_id: string }) => lp.property_id === propertyId
        )
      );
    }

    return NextResponse.json({ success: true, data: filteredLeads });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// POST: Create New Lead, Connect Properties & Auto Log Activity
export async function POST(req: NextRequest) {
  try {
    const supabase = await getSupabase();
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
      property_ids = [], // Array UUID properti minat
    } = body;

    // Validasi input wajib
    if (!name || !whatsapp) {
      return NextResponse.json(
        { success: false, error: "Nama dan WhatsApp wajib diisi." },
        { status: 400 }
      );
    }

    // 1. Insert data Lead baru
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
        status: "NEW",
      })
      .select()
      .single();

    if (leadErr) {
      console.error("Supabase Insert Lead Error:", leadErr);
      return NextResponse.json({ success: false, error: leadErr.message }, { status: 400 });
    }

    // 2. Relasikan properti minat jika ada
    if (Array.isArray(property_ids) && property_ids.length > 0) {
      const propertyInserts = property_ids.map((propId: string) => ({
        lead_id: newLead.id,
        property_id: propId,
        interest_status: "INTERESTED",
      }));

      const { error: relErr } = await supabase
        .from("lead_properties")
        .insert(propertyInserts);

      if (relErr) {
        console.error("Supabase Lead Properties Insert Error:", relErr);
      }
    }

    // 3. Catat Log Aktivitas Awal
    await supabase.from("activities").insert({
      lead_id: newLead.id,
      activity_type: "STATUS_CHANGE",
      description: `Lead dibuat dengan status awal NEW dari sumber ${source}.`,
    });

    // 4. Ambil kembali data Lead lengkap dengan relasi properti untuk dikirim ke frontend
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
    const message = err instanceof Error ? err.message : "Failed to create lead";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}