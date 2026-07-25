import { createClient } from "@/lib/supabase/server";
import { Building2, Users, Calendar, DollarSign, TrendingUp, CheckCircle2 } from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { ActivityTimeline } from "@/components/dashboard/activity-timeline";

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
    { data: recentArticles }
  ] = await Promise.all([
    supabase.from("properties").select("*", { count: "exact", head: true }),
    supabase.from("leads").select("*", { count: "exact", head: true }),
    supabase.from("property_surveys").select("*", { count: "exact", head: true }).gte("survey_date", new Date().toISOString().split("T")[0]),
    supabase.from("properties").select("*", { count: "exact", head: true }).eq("status", "sold"),
    supabase.from("properties").select("price").eq("status", "sold"),
    supabase.from("properties").select("id, title, created_at, updated_at").order("created_at", { ascending: false }).limit(3),
    supabase.from("leads").select("id, name, created_at").order("created_at", { ascending: false }).limit(3),
    supabase.from("property_surveys").select("id, property_title, survey_date, created_at").order("created_at", { ascending: false }).limit(3),
    supabase.from("articles").select("id, title, created_at").order("created_at", { ascending: false }).limit(3)
  ]);

  const monthlyRevenue = revenueData?.reduce((acc, curr: any) => acc + (Number(curr.price) || 0), 0) || 0;
  const formattedRevenue = `Rp ${(monthlyRevenue / 1000000).toLocaleString("id-ID")} Juta`;

  const conversionRate = totalLeads && totalLeads > 0 ? ((soldProperties || 0) / totalLeads * 100).toFixed(1) : "0";

  const activities: any[] = [
    ...(recentProperties?.map((p: any) => ({
      id: p.id,
      type: "property_added",
      title: "Property Baru Ditambahkan",
      description: p.title,
      timestamp: new Date(p.created_at).toLocaleDateString("id-ID"),
      rawDate: new Date(p.created_at).getTime()
    })) || []),
    ...(recentLeads?.map((l: any) => ({
      id: l.id,
      type: "lead_new",
      title: "Lead Baru Masuk",
      description: `Kontak dari ${l.name}`,
      timestamp: new Date(l.created_at).toLocaleDateString("id-ID"),
      rawDate: new Date(l.created_at).getTime()
    })) || []),
    ...(recentSurveys?.map((s: any) => ({
      id: s.id,
      type: "survey_new",
      title: "Jadwal Survey Baru",
      description: s.property_title,
      timestamp: new Date(s.created_at).toLocaleDateString("id-ID"),
      rawDate: new Date(s.created_at).getTime()
    })) || []),
    ...(recentArticles?.map((a: any) => ({
      id: a.id,
      type: "article_published",
      title: "Artikel Dipublish",
      description: a.title,
      timestamp: new Date(a.created_at).toLocaleDateString("id-ID"),
      rawDate: new Date(a.created_at).getTime()
    })) || [])
  ].sort((a, b) => b.rawDate - a.rawDate).slice(0, 6);

  return (
    <div className="space-y-8 pb-12">
      <div className="bg-linear-to-r from-[#1C2541] to-[#0B132B] border border-amber-500/20 p-8 rounded-3xl shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="bg-amber-500/20 text-amber-400 text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full border border-amber-500/30 inline-block mb-3">
            Executive Command Center
          </span>
          <h1 className="text-3xl font-extrabold font-heading text-white tracking-tight">Dashboard Utama Admin</h1>
          <p className="text-xs text-slate-300 mt-1">Pantau performa bisnis, data properti, dan aktivitas operasional secara real-time.</p>
        </div>
        <div className="flex items-center gap-2 bg-[#0B132B] px-4 py-2.5 rounded-2xl border border-slate-800">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
          <span className="text-xs font-medium text-slate-200">Supabase Connected</span>
        </div>
      </div>

      <div>
        <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-400"></span> Ringkasan Bisnis
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
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
        <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-400"></span> Quick Actions
        </h2>
        <QuickActions />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ActivityTimeline activities={activities} />
        </div>
        <div className="bg-[#1C2541]/70 border border-slate-800 p-6 rounded-3xl backdrop-blur-xl shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white font-heading mb-2">Performa Sistem Realthink</h3>
            <p className="text-xs text-slate-400 mb-6">Analisis efisiensi pengelolaan listing dan konversi lead broker properti.</p>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-300">Target Properti Terjual</span>
                  <span className="text-amber-400">75%</span>
                </div>
                <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                  <div className="bg-amber-500 h-full rounded-full w-3/4"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-300">Responsif Lead Harian</span>
                  <span className="text-emerald-400">92%</span>
                </div>
                <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                  <div className="bg-emerald-500 h-full rounded-full w-[92%]"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
            <p className="text-[11px] text-amber-300 leading-relaxed font-medium">
              💡 <strong>Tips Eksekutif:</strong> Tingkatkan jadwal follow-up pada lead properti komersial untuk mendongkrak Conversion Rate bulan ini.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}