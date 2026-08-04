"use client";

import { TrendingUp, Users, Building2, MousePointerClick, ArrowUpRight } from "lucide-react";

export default function AdminAnalyticsPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-xs">
        <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">
          <TrendingUp className="h-3.5 w-3.5" /> Metrik Kinerja
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Analitik</h1>
        <p className="mt-0.5 text-xs text-gray-500">Ringkasan performa lalu lintas, leads, dan konversi properti.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Pengunjung", val: "12,480", icon: Users, change: "+14%" },
          { label: "Leads Terkumpul", val: "342", icon: MousePointerClick, change: "+8%" },
          { label: "Properti Dilihat", val: "45,210", icon: Building2, change: "+22%" },
          { label: "Tingkat Konversi", val: "2.7%", icon: TrendingUp, change: "+0.4%" },
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs">
              <div className="flex items-center justify-between text-gray-500">
                <span className="text-xs font-semibold">{stat.label}</span>
                <div className="rounded-xl bg-amber-50 p-2 text-amber-600"><Icon className="h-4 w-4" /></div>
              </div>
              <p className="mt-3 text-2xl font-extrabold text-gray-900">{stat.val}</p>
              <p className="mt-1 flex items-center text-[11px] font-bold text-emerald-600">
                <ArrowUpRight className="h-3 w-3" /> {stat.change} bulan ini
              </p>
            </div>
          );
        })}
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-xs">
        <p className="text-sm font-semibold text-gray-500">Grafik analitik real-time siap dihubungkan dengan Google Analytics / Supabase Event Logs.</p>
      </div>
    </div>
  );
}