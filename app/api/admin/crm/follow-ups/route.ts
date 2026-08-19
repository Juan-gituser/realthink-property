import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(req: Request) {
  try {
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { searchParams } = new URL(req.url);
    const leadId = searchParams.get("lead_id");
    const status = searchParams.get("status");

    let query = supabaseAdmin
      .from("follow_ups")
      .select("*, leads(name, whatsapp, property_type)")
      .order("created_at", { ascending: false });

    if (leadId) {
      query = query.eq("lead_id", leadId);
    }

    if (status && status !== "ALL") {
      query = query.eq("status", status);
    }

    const { data, error } = await query;
    if (error) throw error;

    return NextResponse.json({ success: true, data: data || [] });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : "Gagal mengambil data follow up" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const body = await req.json();
    const { lead_id, survey_id, notes, status, schedule_date, assigned_to } = body;

    if (!lead_id) {
      return NextResponse.json(
        { success: false, error: "Lead ID wajib diisi." },
        { status: 400 }
      );
    }

    const insertPayload: Record<string, any> = {
      lead_id,
      notes: notes || "",
      status: status || "PENDING",
    };

    if (survey_id) insertPayload.survey_id = survey_id;
    if (schedule_date) insertPayload.schedule_date = schedule_date;
    if (assigned_to) insertPayload.assigned_to = assigned_to;

    const { data: followUp, error: followUpErr } = await supabaseAdmin
      .from("follow_ups")
      .insert(insertPayload)
      .select()
      .single();

    if (followUpErr) {
      console.error("SUPABASE INSERT ERROR:", followUpErr);
      throw new Error(followUpErr.message);
    }

    return NextResponse.json({ success: true, data: followUp });
  } catch (err: unknown) {
    console.error("DETAIL ERROR API FOLLOW-UPS:", err);
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : "Gagal membuat follow up" },
      { status: 500 }
    );
  }
}

// TAMBAHKAN PATCH METHOD INI AGAR TOMBOL "SELESAI" BERFUNGSI
export async function PATCH(req: Request) {
  try {
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const body = await req.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { success: false, error: "ID dan status wajib disertakan." },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("follow_ups")
      .update({ status })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("SUPABASE UPDATE ERROR:", error);
      throw new Error(error.message);
    }

    return NextResponse.json({ success: true, data });
  } catch (err: unknown) {
    console.error("DETAIL ERROR API PATCH FOLLOW-UPS:", err);
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : "Gagal memperbarui status" },
      { status: 500 }
    );
  }
}