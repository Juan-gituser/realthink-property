import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function GET(req: Request) {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll: () => cookieStore.getAll() } }
    );

    const { searchParams } = new URL(req.url);
    const leadId = searchParams.get("lead_id");

    let query = supabase
      .from("follow_ups")
      .select("*, leads(name, whatsapp, property_title)")
      .order("date", { ascending: true })
      .order("time", { ascending: true });

    if (leadId) {
      query = query.eq("lead_id", leadId);
    }

    const { data, error } = await query;
    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : "Gagal mengambil data follow up" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll: () => cookieStore.getAll() } }
    );

    const body = await req.json();
    const { lead_id, date, time, notes, pic } = body;

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
        notes,
        pic,
        status: "PENDING",
      })
      .select()
      .single();

    if (followUpErr) throw followUpErr;

    // 2. Tambah Activity Log Otomatis
    await supabase.from("activities").insert({
      lead_id,
      type: "NOTE",
      description: `Follow Up dijadwalkan untuk ${date} pkl ${time} (${pic || "Tanpa PIC"})`,
    });

    return NextResponse.json({ success: true, data: followUp });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : "Gagal membuat follow up" },
      { status: 500 }
    );
  }
}