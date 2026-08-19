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

// Helper ekstraksi pesan eror Supabase (PostgrestError/Error)
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

// GET: Lead Detail + Attached Properties + Activities + Surveys + Commissions
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await getSupabase();

  try {
    const { data: lead, error: leadErr } = await supabase
      .from("leads")
      .select(`
        *,
        lead_properties (
          id,
          interest_status,
          notes,
          property_id,
          properties (
            id,
            title,
            price
          )
        )
      `)
      .eq("id", id)
      .single();

    if (leadErr || !lead) {
      return NextResponse.json(
        { success: false, error: leadErr?.message || "Lead tidak ditemukan" },
        { status: 404 }
      );
    }

    // Fetch activities
    const { data: activities } = await supabase
      .from("activities")
      .select("*")
      .eq("lead_id", id)
      .order("created_at", { ascending: false });

    // Fetch surveys summary
    const { data: surveys } = await supabase
      .from("surveys")
      .select("*")
      .eq("lead_id", id)
      .order("survey_date", { ascending: false });

    // Fetch commissions summary
    const { data: commissions } = await supabase
      .from("commissions")
      .select("*")
      .eq("lead_id", id);

    return NextResponse.json({
      success: true,
      data: {
        ...lead,
        activities: activities || [],
        surveys: surveys || [],
        commissions: commissions || [],
      },
    });
  } catch (err: unknown) {
    return NextResponse.json({ success: false, error: parseErrorMessage(err) }, { status: 500 });
  }
}

// PATCH: Update Lead Status / PIC / Follow up / Properti Minat & Log Activity
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await getSupabase();

  try {
    const body = await req.json();
    const {
      status,
      assigned_to,
      notes,
      next_follow_up_at,
      last_contact_at,
      budget_min,
      budget_max,
      property_ids,
      interest_status,
    } = body;

    // 1. Update relasi properti minat jika property_ids dikirim
    if (Array.isArray(property_ids)) {
      // Normalisasi payload: pastikan hanya berisi array string ID
      const cleanPropertyIds: string[] = property_ids
        .map((item) => (typeof item === "object" && item !== null ? item.id : item))
        .filter((val): val is string => typeof val === "string" && val.trim().length > 0);

      // Hapus relasi lama pada tabel lead_properties
      const { error: deleteErr } = await supabase
        .from("lead_properties")
        .delete()
        .eq("lead_id", id);

      if (deleteErr) {
        console.error("Gagal DELETE lead_properties:", deleteErr);
        throw deleteErr;
      }

      // Insert relasi baru jika array tidak kosong
      if (cleanPropertyIds.length > 0) {
        // Menggunakan "INTERESTED" (uppercase) sesuai dengan check constraint DB
        const defaultStatus =
          typeof interest_status === "string"
            ? interest_status.toUpperCase()
            : "INTERESTED";

        const rowsToInsert = cleanPropertyIds.map((propertyId: string) => ({
          id: crypto.randomUUID(),
          lead_id: id,
          property_id: propertyId,
          interest_status: defaultStatus,
          created_at: new Date().toISOString(),
        }));

        const { error: insertErr } = await supabase
          .from("lead_properties")
          .insert(rowsToInsert);

        if (insertErr) {
          console.error("Gagal INSERT lead_properties:", insertErr);
          throw insertErr;
        }
      }
    }

    // 2. Ambil state lama jika ada perubahan status untuk log
    let currentLead = null;
    if (status !== undefined) {
      const { data } = await supabase
        .from("leads")
        .select("status, assigned_to")
        .eq("id", id)
        .single();
      currentLead = data;
    }

    // 3. Susun data update untuk tabel leads
    const updates: Record<string, unknown> = {};
    if (status !== undefined) updates.status = status;
    if (assigned_to !== undefined) updates.assigned_to = assigned_to;
    if (notes !== undefined) updates.notes = notes;
    if (next_follow_up_at !== undefined) updates.next_follow_up_at = next_follow_up_at;
    if (last_contact_at !== undefined) updates.last_contact_at = last_contact_at;
    if (budget_min !== undefined) updates.budget_min = budget_min;
    if (budget_max !== undefined) updates.budget_max = budget_max;

    let updatedLead = null;

    if (Object.keys(updates).length > 0) {
      const { data, error } = await supabase
        .from("leads")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("Gagal UPDATE leads:", error);
        throw error;
      }
      updatedLead = data;
    }

    // 4. Log Activity jika status berubah
    if (status && currentLead && currentLead.status !== status) {
      await supabase.from("activities").insert({
        lead_id: id,
        activity_type: "STATUS_CHANGE",
        description: `Status diubah dari ${currentLead.status} menjadi ${status}.`,
      });
    }

    return NextResponse.json({ success: true, data: updatedLead });
  } catch (err: unknown) {
    console.error("PATCH Lead Internal Error:", err);
    return NextResponse.json({ success: false, error: parseErrorMessage(err) }, { status: 500 });
  }
}