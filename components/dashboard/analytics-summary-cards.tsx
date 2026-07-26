"tsx";
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
    {
      title: "Total Property Views",
      value: summary.totalViews.toLocaleString("id-ID"),
      icon: Eye,
      color: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    },
    {
      title: "Total Leads",
      value: summary.totalLeads.toLocaleString("id-ID"),
      icon: Users,
      color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    },
    {
      title: "Total Survey",
      value: summary.totalSurveys.toLocaleString("id-ID"),
      icon: Calendar,
      color: "text-purple-400 bg-purple-500/10 border-purple-500/20",
    },
    {
      title: "Total Deals",
      value: summary.totalDeals.toLocaleString("id-ID"),
      icon: Award,
      color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    },
    {
      title: "Total Revenue",
      value: formatRupiah(summary.totalRevenue),
      icon: TrendingUp,
      color: "text-pink-400 bg-pink-500/10 border-pink-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="space-y-3 rounded-3xl border border-slate-800 bg-[#1C2541]/70 p-5 shadow-xl backdrop-blur-xl"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase">{card.title}</span>
              <div className={`rounded-xl border p-2.5 ${card.color}`}>
                <Icon className="h-4 w-4" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-extrabold tracking-tight text-white">{card.value}</h3>
              <p className="mt-1 flex items-center gap-1 text-[10px] font-semibold text-emerald-400">
                ↑ +{summary.growthRate}% dari periode lalu
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
