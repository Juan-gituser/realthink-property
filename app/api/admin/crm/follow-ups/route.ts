import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Helper internal untuk menginisialisasi Supabase Server Client
async function createClient() {
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
          } catch {
            // Ditangani jika dipanggil dalam konteks Read-Only
          }
        },
      },
    }
  );
}

// ----------------------------------------------------------------------
// GET: Mengambil daftar Follow Up beserta data Relasi Lead
// ----------------------------------------------------------------------
export async function GET(req: Request) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(req.url);

    const leadId = searchParams.get("lead_id");
    const status = searchParams.get("status");

    let query = supabase
      .from("follow_ups")
      .select("*, leads(name, whatsapp, property_title)")
      .order("date", { ascending: true })
      .order("time", { ascending: true });

    // Filter berdasarkan lead_id jika disediakan
    if (leadId) {
      query = query.eq("lead_id", leadId);
    }

    // Filter berdasarkan status jika disediakan
    if (status && status !== "ALL") {
      query = query.eq("status", status);
    }

    const { data, error } = await query;

    if (error) {
      console.error("[GET_FOLLOW_UPS_ERROR]", error);
      throw error;
    }

    return NextResponse.json({ success: true, data: data || [] });
  } catch (err: unknown) {
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : "Gagal mengambil data follow up",
      },
      { status: 500 }
    );
  }
}

// ----------------------------------------------------------------------
// POST: Membuat jadwal Follow Up baru & mencatat Activity Log
// ----------------------------------------------------------------------
export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const body = await req.json();
    const { lead_id, date, time, notes, pic } = body;

    // Validasi input wajib
    if (!lead_id || !date || !time) {
      return NextResponse.json(
        { success: false, error: "Lead, tanggal, dan jam wajib diisi." },
        { status: 400 }
      );
    }

    // 1. Simpan Follow Up
    const { data: followUp, error: followUpErr } = await supabase
      .from("follow_ups")
      .insert({
        lead_id,
        date,
        time,
        notes: notes || "",
        pic: pic || "Tanpa PIC",
        status: "PENDING",
      })
      .select()
      .single();

    if (followUpErr) {
      console.error("[POST_FOLLOW_UP_ERROR]", followUpErr);
      throw followUpErr;
    }

    // 2. Tambah Activity Log Otomatis
    const { error: activityErr } = await supabase.from("activities").insert({
      lead_id,
      type: "NOTE",
      description: `Follow Up dijadwalkan untuk ${date} pkl ${time} (${pic || "Tanpa PIC"})`,
    });

    if (activityErr) {
      console.warn("[POST_ACTIVITY_LOG_WARN]", activityErr);
    }

    return NextResponse.json({ success: true, data: followUp });
  } catch (err: unknown) {
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : "Gagal membuat follow up",
      },
      { status: 500 }
    );
  }
}

// ----------------------------------------------------------------------
// PATCH: Mengubah status Follow Up (misal: PENDING -> COMPLETED / CANCELLED)
// ----------------------------------------------------------------------
export async function PATCH(req: Request) {
  try {
    const supabase = await createClient();
    const body = await req.json();
    const { id, status, notes } = body;

    if (!id || !status) {
      return NextResponse.json(
        { success: false, error: "ID follow up dan status wajib diisi." },
        { status: 400 }
      );
    }

    // 1. Update status Follow Up
    const { data: updatedFollowUp, error: updateErr } = await supabase
      .from("follow_ups")
      .update({
        status,
        ...(notes !== undefined && { notes }),
      })
      .eq("id", id)
      .select()
      .single();

    if (updateErr) {
      console.error("[PATCH_FOLLOW_UP_ERROR]", updateErr);
      throw updateErr;
    }

    // 2. Catat aktivitas perubahan status secara otomatis
    if (updatedFollowUp) {
      await supabase.from("activities").insert({
        lead_id: updatedFollowUp.lead_id,
        type: "NOTE",
        description: `Status Follow Up diperbarui menjadi: ${status}`,
      });
    }

    return NextResponse.json({ success: true, data: updatedFollowUp });
  } catch (err: unknown) {
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : "Gagal memperbarui status follow up",
      },
      { status: 500 }
    );
  }
}