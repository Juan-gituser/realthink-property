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
        getAll() { return cookieStore.getAll(); },
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

export async function GET(req: NextRequest) {
  const supabase = await getSupabase();
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") || "";

  try {
    let query = supabase
      .from("property_surveys")
      .select("*")
      .order("survey_date", { ascending: true });

    if (status) query = query.eq("status", status);

    const { data: surveys, error: surveyError } = await query;
    if (surveyError) throw surveyError;

    if (!surveys || surveys.length === 0) {
      return NextResponse.json({ success: true, data: [] });
    }

    const { data: leadsData } = await supabase.from("leads").select("*");
    const { data: propData } = await supabase.from("properties").select("*");

    let leadsMap: Record<string, any> = {};
    if (leadsData) {
      leadsData.forEach((l: any) => {
        const resolvedName = 
          l.full_name || 
          l.name || 
          l.buyer_name || 
          l.client_name || 
          l.nama || 
          l.username || 
          l.contact_name || 
          "Tanpa Nama";

        const resolvedPhone = 
          l.whatsapp || 
          l.phone || 
          l.phone_number || 
          l.telp || 
          l.no_hp || 
          l.handphone || 
          "-";

        leadsMap[l.id] = {
          ...l,
          name: resolvedName,
          whatsapp: resolvedPhone,
        };
      });
    }

    let propertiesMap: Record<string, any> = {};
    if (propData) {
      propData.forEach((p: any) => {
        propertiesMap[p.id] = {
          ...p,
          title: p.title || p.name || p.property_title || "Properti",
        };
      });
    }

    let formattedSurveys = surveys.map((item: any) => {
      const possibleLeadId = item.lead_id || item.buyer_id || item.client_id || item.user_id;
      const possiblePropId = item.property_id || item.prop_id || item.unit_id;

      const directName = item.name || item.full_name || item.buyer_name || item.client_name;
      const directPhone = item.whatsapp || item.phone || item.no_hp;

      const matchedLead = leadsMap[possibleLeadId];

      // PERBAIKAN UTAMA: Gabungkan survey_date dan survey_time untuk konsistensi frontend
      let combinedDateTime = item.survey_date || "";
      if (item.survey_date) {
        const datePart = item.survey_date.split("T")[0];
        const timePart = item.survey_time ? item.survey_time.substring(0, 5) : "07:00";
        combinedDateTime = `${datePart}T${timePart}`;
      }

      return {
        ...item,
        survey_date: combinedDateTime, // Timpa dengan format gabungan yang aman dari UTC shift
        leads: {
          name: matchedLead?.name || directName || "Klien Tanpa Nama",
          whatsapp: matchedLead?.whatsapp || directPhone || "-",
        },
        properties: propertiesMap[possiblePropId] || { title: item.property_title || "Properti", price: 0 }
      };
    });

    return NextResponse.json({ success: true, data: formattedSurveys });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    console.error("[GET_SURVEYS_ERROR]", message);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}