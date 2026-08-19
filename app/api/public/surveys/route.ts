import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import {
  scheduleSurveySchema,
  sanitizeWhatsApp,
} from "@/lib/validations/public-lead";

function getAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const supabase = getAdminClient();

    const parsed = scheduleSurveySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { name, whatsapp, date, time, notes, property_id, property_title } =
      parsed.data;
    const cleanWa = sanitizeWhatsApp(whatsapp);

    // 1. Cek apakah lead sudah ada
    const { data: existingLead } = await supabase
      .from("leads")
      .select("id")
      .eq("whatsapp", cleanWa)
      .maybeSingle();

    let leadId = existingLead?.id;

    if (!leadId) {
      // Jika belum ada, buat Lead baru
      const { data: newLead, error: createLeadErr } = await supabase
        .from("leads")
        .insert({
          name,
          whatsapp: cleanWa,
          source: "Website",
          status: "NEW",
          property_title: property_title || null,
        })
        .select("id")
        .single();

      if (createLeadErr) throw createLeadErr;
      leadId = newLead.id;
    }

    // 2. Buat Record Survey (Ubah dari "surveys" ke "property_surveys")
    const { data: survey, error: surveyErr } = await supabase
      .from("property_surveys") // <-- Diubah di sini
      .insert({
        lead_id: leadId,
        property_id,
        survey_date: date,
        survey_time: time,
        notes: notes || "",
        status: "SCHEDULED",
      })
      .select("id")
      .single();

    if (surveyErr) throw surveyErr;

    // 3. Catat Aktivitas
    await supabase.from("activities").insert({
      lead_id: leadId,
      property_id,
      type: "SURVEY",
      description: `Jadwal Survey diajukan publik untuk ${date} Pkl ${time}. Catatan: ${notes || "-"}`,
    });

    return NextResponse.json({
      success: true,
      message:
        "Permintaan Anda berhasil dikirim. Tim Realthink Property akan segera menghubungi Anda.",
      data: survey,
    });
  } catch (err: unknown) {
    console.error("[PUBLIC_SURVEY_SUBMIT_ERROR]", err);
    return NextResponse.json(
      {
        success: false,
        error: "Gagal menjadwalkan survey. Silakan coba beberapa saat lagi.",
      },
      { status: 500 }
    );
  }
}