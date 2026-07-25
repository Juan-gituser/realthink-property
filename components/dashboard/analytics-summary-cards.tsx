"tsx"
import { Eye, Users, Calendar, Award, TrendingUp } from "lucide-react";
import { AnalyticsSummary } from "@/types/analytics";

interface AnalyticsSummaryCardsProps {
  summary: AnalyticsSummary;
}

export function AnalyticsSummaryCards({ summary }: AnalyticsSummaryCardsProps) {
  const formatRupiah = (val: number) => {
    if (val >= 1000000000) {
      return `Rp ${(val / 1000000000).toFixed(1)} Miliar`;
    }
    return `Rp ${(val / 1000000).toLocaleString("id-ID")} Jt`;
  };

  const cards = [
    { title: "Total Property Views", value: summary.totalViews.toLocaleString("id-ID"), icon: Eye, color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
    { title: "Total Leads", value: summary.totalLeads.toLocaleString("id-ID"), icon: Users, color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
    { title: "Total Survey", value: summary.totalSurveys.toLocaleString("id-ID"), icon: Calendar, color: "text-purple-400 bg-purple-500/10 border-purple-500/20" },
    { title: "Total Deals", value: summary.totalDeals.toLocaleString("id-ID"), icon: Award, color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
    { title: "Total Revenue", value: formatRupiah(summary.totalRevenue), icon: TrendingUp, color: "text-pink-400 bg-pink-500/10 border-pink-500/20" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div key={idx} className="bg-[#1C2541]/70 border border-slate-800 p-5 rounded-3xl backdrop-blur-xl shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-slate-400">{card.title}</span>
              <div className={`p-2.5 rounded-xl border ${card.color}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-white tracking-tight">{card.value}</h3>
              <p className="text-[10px] text-emerald-400 mt-1 font-semibold flex items-center gap-1">
                ↑ +{summary.growthRate}% dari periode lalu
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}