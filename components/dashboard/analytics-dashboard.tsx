"tsx"
"use client";

import { useState } from "react";
import { Loader2, CalendarRange } from "lucide-react";
import { AnalyticsFilterPeriod } from "@/types/analytics";
import { useAnalytics } from "@/hooks/useAnalytics";
import { AnalyticsSummaryCards } from "./analytics-summary-cards";
import { AnalyticsChartView } from "./analytics-chart-view";

export function AnalyticsDashboard() {
  const [period, setPeriod] = useState<AnalyticsFilterPeriod>("month");
  const { chartData, summary, isLoading } = useAnalytics(period);

  const filterOptions: { label: string; value: AnalyticsFilterPeriod }[] = [
    { label: "Hari", value: "day" },
    { label: "Minggu", value: "week" },
    { label: "Bulan", value: "month" },
    { label: "Tahun", value: "year" },
  ];

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-400 space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
        <p className="text-xs">Memuat Dashboard Analytics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header & Filter Period */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#1C2541]/70 border border-slate-800 p-6 rounded-3xl backdrop-blur-xl shadow-xl">
        <div>
          <span className="bg-amber-500/20 text-amber-400 text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full border border-amber-500/30 inline-block mb-2">
            Business Intelligence
          </span>
          <h1 className="text-2xl font-extrabold text-white font-heading">Dashboard Analytics</h1>
          <p className="text-xs text-slate-300 mt-0.5">Monitor performa property views, leads, survey, deal, dan revenue secara real-time.</p>
        </div>

        {/* Filter Rentang Waktu */}
        <div className="flex items-center gap-2 bg-[#0B132B] p-1.5 rounded-2xl border border-slate-800">
          <CalendarRange className="w-4 h-4 text-amber-400 ml-2" />
          {filterOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setPeriod(opt.value)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                period === opt.value
                  ? "bg-amber-500 text-slate-950 shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <AnalyticsSummaryCards summary={summary} />

      {/* Chart View */}
      <AnalyticsChartView data={chartData} />
    </div>
  );
}