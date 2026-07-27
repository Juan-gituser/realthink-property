import { createClient } from "@/lib/supabase/server";
import { Building2, Users, Calendar, DollarSign, TrendingUp, CheckCircle2 } from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { ActivityTimeline } from "@/components/dashboard/activity-timeline";

interface RevenueRow {
  price: string | number;
}

interface PropertyItem {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

interface LeadItem {
  id: string;
  name: string;
  created_at: string;
}

interface SurveyItem {
  id: string;
  property_title: string;
  survey_date: string;
  created_at: string;
}

interface ArticleItem {
  id: string;
  title: string;
  created_at: string;
}

interface ActivityItem {
  id: string;
  type: "property_added" | "lead_new" | "survey_new" | "article_published" | "property_updated";
  title: string;
  description: string;
  timestamp: string;
  rawDate: number;
}

export default async function ExecutiveAdminDashboard() {
  const supabase = await createClient();

  const [
    { count: totalProperties },
    { count: totalLeads },
    { count: todaySurveys },
    { count: soldProperties },
    { data: revenueData },
    { data: recentProperties },
    { data: recentLeads },
    { data: recentSurveys },
    { data: recentArticles },
  ] = await Promise.all([
    supabase.from("properties").select("*", { count: "exact", head: true }),
    supabase.from("leads").select("*", { count: "exact", head: true }),
    supabase
      .from("property_surveys")
      .select("*", { count: "exact", head: true })
      .gte("survey_date", new Date().toISOString().split("T")[0]),
    supabase.from("properties").select("*", { count: "exact", head: true }).eq("status", "sold"),
    supabase.from("properties").select("price").eq("status", "sold"),
    supabase
      .from("properties")
      .select("id, title, created_at, updated_at")
      .order("created_at", { ascending: false })
      .limit(3),
    supabase
      .from("leads")
      .select("id, name, created_at")
      .order("created_at", { ascending: false })
      .limit(3),
    supabase
      .from("property_surveys")
      .select("id, property_title, survey_date, created_at")
      .order("created_at", { ascending: false })
      .limit(3),
    supabase
      .from("articles")
      .select("id, title, created_at")
      .order("created_at", { ascending: false })
      .limit(3),
  ]);

  const typedRevenueData = (revenueData as RevenueRow[]) || [];
  const monthlyRevenue =
    typedRevenueData.reduce((acc, curr) => acc + (Number(curr.price) || 0), 0) || 0;
  const formattedRevenue = `Rp ${(monthlyRevenue / 1000000).toLocaleString("id-ID")} Juta`;

  const conversionRate =
    totalLeads && totalLeads > 0 ? (((soldProperties || 0) / totalLeads) * 100).toFixed(1) : "0";

  const typedProperties = (recentProperties as PropertyItem[]) || [];
  const typedLeads = (recentLeads as LeadItem[]) || [];
  const typedSurveys = (recentSurveys as SurveyItem[]) || [];
  const typedArticles = (recentArticles as ArticleItem[]) || [];

  const activities: ActivityItem[] = [
    ...typedProperties.map((p) => ({
      id: p.id,
      type: "property_added" as const,
      title: "Property Baru Ditambahkan",
      description: p.title,
      timestamp: new Date(p.created_at).toLocaleDateString("id-ID"),
      rawDate: new Date(p.created_at).getTime(),
    })),
    ...typedLeads.map((l) => ({
      id: l.id,
      type: "lead_new" as const,
      title: "Lead Baru Masuk",
      description: `Kontak dari ${l.name}`,
      timestamp: new Date(l.created_at).toLocaleDateString("id-ID"),
      rawDate: new Date(l.created_at).getTime(),
    })),
    ...typedSurveys.map((s) => ({
      id: s.id,
      type: "survey_new" as const,
      title: "Jadwal Survey Baru",
      description: s.property_title,
      timestamp: new Date(s.created_at).toLocaleDateString("id-ID"),
      rawDate: new Date(s.created_at).getTime(),
    })),
    ...typedArticles.map((a) => ({
      id: a.id,
      type: "article_published" as const,
      title: "Artikel Dipublish",
      description: a.title,
      timestamp: new Date(a.created_at).toLocaleDateString("id-ID"),
      rawDate: new Date(a.created_at).getTime(),
    })),
  ]
    .sort((a, b) => b.rawDate - a.rawDate)
    .slice(0, 6);

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col items-start justify-between gap-4 rounded-3xl border border-amber-500/20 bg-linear-to-r from-[#1C2541] to-[#0B132B] p-8 shadow-2xl md:flex-row md:items-center">
        <div>
          <span className="mb-3 inline-block rounded-full border border-amber-500/30 bg-amber-500/20 px-3 py-1 text-[10px] font-bold tracking-widest text-amber-400 uppercase">
            Executive Command Center
          </span>
          <h1 className="font-heading text-3xl font-extrabold tracking-tight text-white">
            Dashboard Utama Admin
          </h1>
          <p className="mt-1 text-xs text-slate-300">
            Pantau performa bisnis, data properti, dan aktivitas operasional secara real-time.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-2xl border border-slate-800 bg-[#0B132B] px-4 py-2.5">
          <span className="h-2.5 w-2.5 animate-ping rounded-full bg-emerald-500"></span>
          <span className="text-xs font-medium text-slate-200">Supabase Connected</span>
        </div>
      </div>

      <div>
        <h2 className="mb-4 flex items-center gap-2 text-sm font-bold tracking-wider text-white uppercase">
          <span className="h-2 w-2 rounded-full bg-amber-400"></span> Ringkasan Bisnis
        </h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            title="Total Property"
            value={totalProperties || 0}
            change="+12.4%"
            isIncrease={true}
            icon={Building2}
            sparklineData={[20, 25, 30, 45, 50, 65, totalProperties || 70]}
          />
          <StatCard
            title="Total Lead"
            value={totalLeads || 0}
            change="+8.2%"
            isIncrease={true}
            icon={Users}
            sparklineData={[10, 15, 22, 30, 28, 40, totalLeads || 50]}
          />
          <StatCard
            title="Survey Hari Ini"
            value={todaySurveys || 0}
            change="Hari Ini"
            isIncrease={true}
            icon={Calendar}
            sparklineData={[2, 4, 1, 5, 3, 6, todaySurveys || 3]}
          />
          <StatCard
            title="Property Sold"
            value={soldProperties || 0}
            change="+4.1%"
            isIncrease={true}
            icon={CheckCircle2}
            sparklineData={[5, 8, 12, 10, 15, 18, soldProperties || 20]}
          />
          <StatCard
            title="Revenue Bulan Ini"
            value={formattedRevenue}
            change="+18.5%"
            isIncrease={true}
            icon={DollarSign}
            sparklineData={[30, 50, 45, 70, 85, 90, 110]}
          />
          <StatCard
            title="Conversion Rate"
            value={`${conversionRate}%`}
            change="+2.3%"
            isIncrease={true}
            icon={TrendingUp}
            sparklineData={[12, 14, 15, 18, 17, 20, Number(conversionRate)]}
          />
        </div>
      </div>

      <div>
        <h2 className="mb-4 flex items-center gap-2 text-sm font-bold tracking-wider text-white uppercase">
          <span className="h-2 w-2 rounded-full bg-amber-400"></span> Quick Actions
        </h2>
        <QuickActions />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ActivityTimeline activities={activities} isLoading={false} />
        </div>
        <div className="flex flex-col justify-between rounded-3xl border border-slate-800 bg-[#1C2541]/70 p-6 shadow-xl backdrop-blur-xl">
          <div>
            <h3 className="font-heading mb-2 text-base font-bold text-white">
              Performa Sistem Realthink
            </h3>
            <p className="mb-6 text-xs text-slate-400">
              Analisis efisiensi pengelolaan listing dan konversi lead broker properti.
            </p>

            <div className="space-y-4">
              <div>
                <div className="mb-1 flex justify-between text-xs font-semibold">
                  <span className="text-slate-300">Target Properti Terjual</span>
                  <span className="text-amber-400">75%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full border border-slate-800 bg-slate-900">
                  <div className="h-full w-3/4 rounded-full bg-amber-500"></div>
                </div>
              </div>

              <div>
                <div className="mb-1 flex justify-between text-xs font-semibold">
                  <span className="text-slate-300">Responsif Lead Harian</span>
                  <span className="text-emerald-400">92%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full border border-slate-800 bg-slate-900">
                  <div className="h-full w-[92%] rounded-full bg-emerald-500"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4">
            <p className="text-[11px] leading-relaxed font-medium text-amber-300">
              💡 <strong>Tips Eksekutif:</strong> Tingkatkan jadwal follow-up pada lead properti
              komersial untuk mendongkrak Conversion Rate bulan ini.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}