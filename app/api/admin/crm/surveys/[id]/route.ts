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

// GET: Fetch Survey Detail
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await getSupabase();

  try {
    const { data: survey, error } = await supabase
      .from("property_surveys")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !survey) {
      return NextResponse.json({ success: false, error: "Survey tidak ditemukan" }, { status: 404 });
    }

    // Ambil data properti
    let propertyData = null;
    if (survey.property_id) {
      const { data } = await supabase
        .from("properties")
        .select("*")
        .eq("id", survey.property_id)
        .single();
      propertyData = data;
    }

    // Ambil data lead/buyer agar nama & WA valid di frontend
    let leadData = null;
    if (survey.lead_id) {
      const { data } = await supabase
        .from("leads")
        .select("*")
        .eq("id", survey.lead_id)
        .single();
      leadData = data;
    }

    // Gabungkan survey_date dan survey_time agar dibaca datetime-local frontend
    let combinedDateTime = survey.survey_date || "";
    if (survey.survey_date) {
      const datePart = survey.survey_date.split("T")[0];
      const timePart = survey.survey_time ? survey.survey_time.substring(0, 5) : "07:00";
      combinedDateTime = `${datePart}T${timePart}`;
    }

    const formattedSurvey = {
      ...survey,
      survey_date: combinedDateTime,
      leads: leadData ? {
        id: leadData.id,
        lead_id: leadData.lead_id || "-",
        name: leadData.name || "Tanpa Nama",
        whatsapp: leadData.whatsapp || "-",
        email: leadData.email || "-",
        status: leadData.status || "-",
      } : {
        // Fallback jika tidak ada di tabel leads
        id: survey.lead_id || null, 
        lead_id: survey.lead_id || "-",
        name: survey.full_name || "Tanpa Nama",
        whatsapp: survey.whatsapp || "-",
        email: survey.email || "-",
        status: survey.status || "-",
      },
      properties: propertyData || {
        id: survey.property_id,
        title: survey.property_title || "Properti",
        price: 0,
        address: "-",
      },
    };

    return NextResponse.json({ success: true, data: formattedSurvey });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error fetching survey";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// PATCH: Update Survey Status / Reschedule / Notes / Assigned To / Lead ID
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await getSupabase();

  try {
    const body = await req.json();
    // Menambahkan lead_id ke dalam ekstrak body request
    const { status, survey_date, survey_time, assigned_to, notes, feedback, lead_id } = body; 

    const { data: currentSurvey, error: fetchError } = await supabase
      .from("property_surveys")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError || !currentSurvey) {
      return NextResponse.json({ success: false, error: "Survey not found" }, { status: 404 });
    }

    const updates: Record<string, unknown> = {};
    if (status) updates.status = status;
    
    // Menambahkan penanganan update lead_id jika dikirim dari frontend
    if (lead_id !== undefined) {
      updates.lead_id = lead_id;
    }

    if (survey_date) {
      if (typeof survey_date === "string" && survey_date.includes("T")) {
        const [datePart, timePart] = survey_date.split("T");
        updates.survey_date = datePart;
        if (timePart) {
          updates.survey_time = timePart.substring(0, 5);
        }
      } else {
        const dateObj = new Date(survey_date);
        if (!isNaN(dateObj.getTime())) {
          updates.survey_date = dateObj.toISOString().split("T")[0];
        }
      }
    }

    if (survey_time !== undefined) {
      updates.survey_time = survey_time;
    }

    if (assigned_to !== undefined) {
      updates.assigned_to = assigned_to;
    }

    let combinedNotes = notes || "";
    if (feedback) {
      combinedNotes = combinedNotes ? `${combinedNotes} | Feedback: ${feedback}` : `Feedback: ${feedback}`;
    }
    if (combinedNotes) {
      updates.notes = combinedNotes;
    }

    const { error: updateError } = await supabase
      .from("property_surveys")
      .update(updates)
      .eq("id", id);

    if (updateError) {
      console.error("SUPABASE UPDATE ERROR DETAIL:", updateError);
      return NextResponse.json({ success: false, error: updateError.message }, { status: 400 });
    }

    let propTitle = currentSurvey.property_title || "Properti";
    if (currentSurvey.property_id) {
      const { data: propData } = await supabase
        .from("properties")
        .select("title")
        .eq("id", currentSurvey.property_id)
        .single();
      if (propData?.title) propTitle = propData.title;
    }

    if (status && status !== currentSurvey.status) {
      let activityText = "";
      switch (status) {
        case "CONFIRMED":
          activityText = `Survey Confirmed: Jadwal survey unit "${propTitle}" telah dikonfirmasi oleh buyer.`;
          break;
        case "COMPLETED":
          activityText = `Survey Completed: Survey lokasi unit "${propTitle}" telah selesai dilaksanakan.`;
          break;
        case "RESCHEDULED": {
          const newTime = survey_date
            ? new Date(survey_date).toLocaleString("id-ID", { dateStyle: "full", timeStyle: "short" })
            : "Waktu baru";
          activityText = `Survey Rescheduled: Dijadwalkan ulang ke ${newTime} untuk unit "${propTitle}".`;
          break;
        }
        case "CANCELLED":
          activityText = `Survey Cancelled: Survey unit "${propTitle}" dibatalkan. Catatan: ${combinedNotes || "-"}`;
          break;
        case "NO_SHOW":
          activityText = `Survey No Show: Buyer tidak hadir pada jadwal survey unit "${propTitle}".`;
          break;
        default:
          activityText = `Survey status diubah menjadi ${status}.`;
      }

      try {
        await supabase.from("activities").insert({
          property_id: currentSurvey.property_id,
          activity_type: "SURVEY",
          description: activityText,
        });
      } catch {}
    }

    const { data: updatedSurvey } = await supabase
      .from("property_surveys")
      .select("*")
      .eq("id", id)
      .single();

    // Fetch data properti & lead kembali setelah di-update
    let propertyData = null;
    if (updatedSurvey?.property_id) {
      const { data } = await supabase
        .from("properties")
        .select("*")
        .eq("id", updatedSurvey.property_id)
        .single();
      propertyData = data;
    }

    let leadData = null;
    if (updatedSurvey?.lead_id) {
      const { data } = await supabase
        .from("leads")
        .select("*")
        .eq("id", updatedSurvey.lead_id)
        .single();
      leadData = data;
    }

    let updatedCombinedDateTime = updatedSurvey?.survey_date || "";
    if (updatedSurvey?.survey_date) {
      const datePart = updatedSurvey.survey_date.split("T")[0];
      const timePart = updatedSurvey.survey_time ? updatedSurvey.survey_time.substring(0, 5) : "07:00";
      updatedCombinedDateTime = `${datePart}T${timePart}`;
    }

    const formattedUpdatedSurvey = {
      ...updatedSurvey,
      survey_date: updatedCombinedDateTime,
      leads: leadData ? {
        id: leadData.id,
        lead_id: leadData.lead_id || "-",
        name: leadData.name || "Tanpa Nama",
        whatsapp: leadData.whatsapp || "-",
        email: leadData.email || "-",
        status: leadData.status || "-",
      } : {
        id: updatedSurvey?.lead_id || null,
        lead_id: updatedSurvey?.lead_id || "-",
        name: updatedSurvey?.full_name || "Tanpa Nama",
        whatsapp: updatedSurvey?.whatsapp || "-",
        email: updatedSurvey?.email || "-",
        status: updatedSurvey?.status || "-",
      },
      properties: propertyData || {
        id: updatedSurvey?.property_id,
        title: updatedSurvey?.property_title || "Properti",
        price: 0,
        address: "-",
      },
    };

    return NextResponse.json({ success: true, data: formattedUpdatedSurvey });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Update survey failed";
    console.error("CRITICAL PATCH ERROR:", message);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}