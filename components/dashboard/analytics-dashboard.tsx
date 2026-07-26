"tsx";
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
      <div className="min-h-100[400px] flex flex-col items-center justify-center space-y-3 text-slate-400">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
        <p className="text-xs">Memuat Dashboard Analytics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header & Filter Period */}
      <div className="flex flex-col items-start justify-between gap-4 rounded-3xl border border-slate-800 bg-[#1C2541]/70 p-6 shadow-xl backdrop-blur-xl sm:flex-row sm:items-center">
        <div>
          <span className="mb-2 inline-block rounded-full border border-amber-500/30 bg-amber-500/20 px-3 py-1 text-[10px] font-bold tracking-widest text-amber-400 uppercase">
            Business Intelligence
          </span>
          <h1 className="font-heading text-2xl font-extrabold text-white">Dashboard Analytics</h1>
          <p className="mt-0.5 text-xs text-slate-300">
            Monitor performa property views, leads, survey, deal, dan revenue secara real-time.
          </p>
        </div>

        {/* Filter Rentang Waktu */}
        <div className="flex items-center gap-2 rounded-2xl border border-slate-800 bg-[#0B132B] p-1.5">
          <CalendarRange className="ml-2 h-4 w-4 text-amber-400" />
          {filterOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setPeriod(opt.value)}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
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
