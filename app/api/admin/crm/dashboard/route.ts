import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

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
            // Read-only context
          }
        },
      },
    }
  );
}

export async function GET() {
  try {
    const supabase = await createClient();
    const todayStr = new Date().toISOString().split("T")[0];

    // 1. Ambil seluruh data Leads
    const { data: leads, error: leadsErr } = await supabase
      .from("leads")
      .select("id, status, source");

    if (leadsErr) throw leadsErr;

    // 2. Ambil data Follow Up Hari Ini
    const { count: followUpTodayCount, error: fuErr } = await supabase
      .from("follow_ups")
      .select("id", { count: "exact", head: true })
      .eq("date", todayStr)
      .neq("status", "CANCELLED");

    if (fuErr) throw fuErr;

    // 3. Ambil data Upcoming Surveys
    const { count: upcomingSurveyCount, error: surveyErr } = await supabase
      .from("surveys")
      .select("id", { count: "exact", head: true })
      .gte("survey_date", todayStr)
      .in("status", ["SCHEDULED", "CONFIRMED"]);

    if (surveyErr) throw surveyErr;

    // 4. Ambil Estimasi Komisi (dari komisi aktif/disetujui/pending)
    const { data: commissions, error: commErr } = await supabase
      .from("commissions")
      .select("net_commission")
      .neq("status", "CANCELLED");

    if (commErr) throw commErr;

    const totalEstimatedCommission = (commissions || []).reduce(
      (sum, item) => sum + (Number(item.net_commission) || 0),
      0
    );

    // ==================================================
    // KALKULASI KPI & PIPELINE
    // ==================================================
    const allLeads = leads || [];
    const totalLeads = allLeads.length;

    const pipelineCounts = {
      NEW: 0,
      CONTACTED: 0,
      QUALIFIED: 0,
      SURVEY: 0,
      NEGOTIATION: 0,
      BOOKING: 0,
      CLOSED: 0,
      LOST: 0,
    };

    allLeads.forEach((l) => {
      if (l.status && pipelineCounts[l.status as keyof typeof pipelineCounts] !== undefined) {
        pipelineCounts[l.status as keyof typeof pipelineCounts]++;
      }
    });

    const kpi = {
      totalLeads,
      newLeads: pipelineCounts.NEW,
      followUpToday: followUpTodayCount || 0,
      upcomingSurvey: upcomingSurveyCount || 0,
      negotiation: pipelineCounts.NEGOTIATION,
      booking: pipelineCounts.BOOKING,
      closed: pipelineCounts.CLOSED,
      lost: pipelineCounts.LOST,
      estimatedCommission: totalEstimatedCommission,
    };

    // ==================================================
    // KALKULASI SOURCE ANALYTICS
    // ==================================================
    const sourcesList = [
      "Website",
      "Instagram",
      "TikTok",
      "Facebook",
      "WhatsApp",
      "Google",
      "Referral",
      "Agent",
      "Freelancer",
      "Other",
    ];

    // Inisialisasi map source
    const sourceStatsMap: Record<
      string,
      { leadsCount: number; surveyCount: number; closingCount: number }
    > = {};

    sourcesList.forEach((src) => {
      sourceStatsMap[src] = { leadsCount: 0, surveyCount: 0, closingCount: 0 };
    });

    allLeads.forEach((l) => {
      const srcName = sourcesList.includes(l.source) ? l.source : "Other";
      if (!sourceStatsMap[srcName]) {
        sourceStatsMap[srcName] = { leadsCount: 0, surveyCount: 0, closingCount: 0 };
      }

      sourceStatsMap[srcName].leadsCount++;

      // Jika lead sudah melewati atau berada di stage SURVEY / NEGOTIATION / BOOKING / CLOSED
      if (
        ["SURVEY", "NEGOTIATION", "BOOKING", "CLOSED"].includes(l.status)
      ) {
        sourceStatsMap[srcName].surveyCount++;
      }

      // Jika lead sudah mencapai status CLOSED
      if (l.status === "CLOSED") {
        sourceStatsMap[srcName].closingCount++;
      }
    });

    const sourceAnalytics = sourcesList.map((src) => {
      const stats = sourceStatsMap[src];
      const conversionRate =
        stats.leadsCount > 0
          ? ((stats.closingCount / stats.leadsCount) * 100).toFixed(1)
          : "0.0";

      return {
        source: src,
        leads: stats.leadsCount,
        survey: stats.surveyCount,
        closing: stats.closingCount,
        conversionRate: `${conversionRate}%`,
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        kpi,
        pipeline: [
          { stage: "NEW", label: "New Leads", count: pipelineCounts.NEW },
          { stage: "CONTACTED", label: "Contacted", count: pipelineCounts.CONTACTED },
          { stage: "QUALIFIED", label: "Qualified", count: pipelineCounts.QUALIFIED },
          { stage: "SURVEY", label: "Survey", count: pipelineCounts.SURVEY },
          { stage: "NEGOTIATION", label: "Negotiation", count: pipelineCounts.NEGOTIATION },
          { stage: "BOOKING", label: "Booking", count: pipelineCounts.BOOKING },
          { stage: "CLOSED", label: "Closed", count: pipelineCounts.CLOSED },
        ],
        sourceAnalytics,
      },
    });
  } catch (err: unknown) {
    console.error("[CRM_DASHBOARD_GET_ERROR]", err);
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : "Gagal mengambil data dashboard CRM",
      },
      { status: 500 }
    );
  }
}