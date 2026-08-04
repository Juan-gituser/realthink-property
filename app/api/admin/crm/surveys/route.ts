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

// GET: Fetch Surveys with Filters (Status, Date, Search)
export async function GET(req: NextRequest) {
  const supabase = await getSupabase();
  const { searchParams } = new URL(req.url);

  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "";
  const date = searchParams.get("date") || "";
  const leadId = searchParams.get("lead_id") || "";
  const propertyId = searchParams.get("property_id") || "";

  try {
    let query = supabase
      .from("surveys")
      .select(`
        *,
        leads (
          id,
          lead_id,
          name,
          whatsapp,
          email,
          status
        ),
        properties (
          id,
          title,
          price,
          address
        )
      `)
      .order("survey_date", { ascending: true });

    if (status) query = query.eq("status", status);
    if (leadId) query = query.eq("lead_id", leadId);
    if (propertyId) query = query.eq("property_id", propertyId);

    if (date) {
      // Filter by specific date (YYYY-MM-DD)
      const startDate = `${date}T00:00:00`;
      const endDate = `${date}T23:59:59`;
      query = query.gte("survey_date", startDate).lte("survey_date", endDate);
    }

    const { data: surveys, error } = await query;

    if (error) throw error;

    let filteredSurveys = surveys || [];

    // Search filter across Lead name, WhatsApp, or Property title
    if (search) {
      const lowerSearch = search.toLowerCase();
      filteredSurveys = filteredSurveys.filter((item: {
        leads?: { name?: string | null; whatsapp?: string | null };
        properties?: { title?: string | null };
        survey_id?: string | null;
      }) => {
        const leadName = item.leads?.name?.toLowerCase() || "";
        const leadWA = item.leads?.whatsapp?.toLowerCase() || "";
        const propTitle = item.properties?.title?.toLowerCase() || "";
        const surveyCode = item.survey_id?.toLowerCase() || "";

        return (
          leadName.includes(lowerSearch) ||
          leadWA.includes(lowerSearch) ||
          propTitle.includes(lowerSearch) ||
          surveyCode.includes(lowerSearch)
        );
      });
    }

    return NextResponse.json({ success: true, data: filteredSurveys });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// POST: Create New Survey
export async function POST(req: NextRequest) {
  const supabase = await getSupabase();

  try {
    const body = await req.json();
    const {
      lead_id,
      property_id,
      survey_date, // Full ISO Timestamp or YYYY-MM-DDTHH:mm
      assigned_to,
      notes,
    } = body;

    if (!lead_id || !property_id || !survey_date) {
      return NextResponse.json(
        { success: false, error: "Lead, Properti, dan Tanggal/Jam survey wajib diisi." },
        { status: 400 }
      );
    }

    // 1. Insert new survey
    const { data: newSurvey, error: surveyErr } = await supabase
      .from("surveys")
      .insert({
        lead_id,
        property_id,
        survey_date,
        assigned_to: assigned_to || null,
        notes: notes || null,
        status: "SCHEDULED",
      })
      .select(`
        *,
        leads ( name, whatsapp ),
        properties ( title )
      `)
      .single();

    if (surveyErr) throw surveyErr;

    // 2. Automatically update Lead Status to "SURVEY" if not already in higher state
    const { data: leadData } = await supabase
      .from("leads")
      .select("status")
      .eq("id", lead_id)
      .single();

    if (leadData && ["NEW", "CONTACTED", "QUALIFIED"].includes(leadData.status)) {
      await supabase
        .from("leads")
        .update({ status: "SURVEY" })
        .eq("id", lead_id);

      // Log Status change activity
      await supabase.from("activities").insert({
        lead_id,
        property_id,
        activity_type: "STATUS_CHANGE",
        description: `Status lead diperbarui menjadi SURVEY karena adanya penjadwalan survey baru.`,
      });
    }

    // 3. Log Survey Scheduled Activity
    const formattedTime = new Date(survey_date).toLocaleString("id-ID", {
      dateStyle: "full",
      timeStyle: "short",
    });

    await supabase.from("activities").insert({
      lead_id,
      property_id,
      activity_type: "SURVEY",
      description: `Survey Scheduled: Dijadwalkan untuk unit "${newSurvey.properties?.title || "Properti"}" pada ${formattedTime}.`,
    });

    return NextResponse.json({ success: true, data: newSurvey });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to create survey";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}