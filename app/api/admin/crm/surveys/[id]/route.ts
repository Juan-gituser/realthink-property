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
      .from("surveys")
      .select(`
        *,
        leads ( id, lead_id, name, whatsapp, email, status ),
        properties ( id, title, price, address )
      `)
      .eq("id", id)
      .single();

    if (error || !survey) {
      return NextResponse.json({ success: false, error: "Survey tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: survey });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error fetching survey";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// PATCH: Update Survey Status / Reschedule / Notes & Log Activity
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await getSupabase();

  try {
    const body = await req.json();
    const { status, survey_date, assigned_to, notes, feedback } = body;

    // Fetch existing survey state
    const { data: currentSurvey } = await supabase
      .from("surveys")
      .select(`
        *,
        properties ( title )
      `)
      .eq("id", id)
      .single();

    if (!currentSurvey) {
      return NextResponse.json({ success: false, error: "Survey not found" }, { status: 404 });
    }

    const updates: Record<string, unknown> = {};
    if (status) updates.status = status;
    if (survey_date) updates.survey_date = survey_date;
    if (assigned_to !== undefined) updates.assigned_to = assigned_to;
    if (notes !== undefined) updates.notes = notes;
    if (feedback !== undefined) updates.feedback = feedback;

    const { data: updatedSurvey, error } = await supabase
      .from("surveys")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    // Create Activity Log based on action performed
    let activityText = "";
    const propTitle = currentSurvey.properties?.title || "Properti";

    if (status && status !== currentSurvey.status) {
      switch (status) {
        case "CONFIRMED":
          activityText = `Survey Confirmed: Jadwal survey unit "${propTitle}" telah dikonfirmasi oleh buyer.`;
          break;
        case "COMPLETED":
          activityText = `Survey Completed: Survey lokasi unit "${propTitle}" telah selesai dilaksanakan.`;
          break;
        case "RESCHEDULED":
          const newTime = survey_date
            ? new Date(survey_date).toLocaleString("id-ID", { dateStyle: "full", timeStyle: "short" })
            : "Waktu baru";
          activityText = `Survey Rescheduled: Dijadwalkan ulang ke ${newTime} untuk unit "${propTitle}".`;
          break;
        case "CANCELLED":
          activityText = `Survey Cancelled: Survey unit "${propTitle}" dibatalkan. Catatan: ${notes || "-"}`;
          break;
        case "NO_SHOW":
          activityText = `Survey No Show: Buyer tidak hadir pada jadwal survey unit "${propTitle}".`;
          break;
        default:
          activityText = `Survey status diubah menjadi ${status}.`;
      }

      await supabase.from("activities").insert({
        lead_id: currentSurvey.lead_id,
        property_id: currentSurvey.property_id,
        activity_type: "SURVEY",
        description: activityText,
      });
    }

    return NextResponse.json({ success: true, data: updatedSurvey });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Update survey failed";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}