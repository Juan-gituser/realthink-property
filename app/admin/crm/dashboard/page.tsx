"use client";

import { useState, useEffect } from "react";
import {
  Users,
  UserPlus,
  Clock,
  Calendar,
  TrendingUp,
  BookmarkCheck,
  CheckCircle2,
  XCircle,
  Coins,
  RefreshCw,
  AlertCircle,
  BarChart3,
  Globe,
  Filter,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";

interface KPIData {
  totalLeads: number;
  newLeads: number;
  followUpToday: number;
  upcomingSurvey: number;
  negotiation: number;
  booking: number;
  closed: number;
  lost: number;
  estimatedCommission: number;
}

interface PipelineStage {
  stage: string;
  label: string;
  count: number;
}

interface SourceAnalytic {
  source: string;
  leads: number;
  survey: number;
  closing: number;
  conversionRate: string;
}

interface DashboardData {
  kpi: KPIData;
  pipeline: PipelineStage[];
  sourceAnalytics: SourceAnalytic[];
}

export default function CRMDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/crm/dashboard");
      const json = await res.json();

      if (json.success) {
        setData(json.data);
      } else {
        setError(json.error || "Gagal memuat data dashboard.");
      }
    } catch (err: unknown) {
      setError("Terjadi kesalahan koneksi ke server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchDashboard();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  // Format IDR Currency
  const formatIDR = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Funnel Stage Colors
  const stageColors = [
    "#3B82F6", // NEW - Blue
    "#06B6D4", // CONTACTED - Cyan
    "#8B5CF6", // QUALIFIED - Purple
    "#F59E0B", // SURVEY - Amber
    "#EC4899", // NEGOTIATION - Pink
    "#6366F1", // BOOKING - Indigo
    "#10B981", // CLOSED - Emerald
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        <div>
          <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">
            Executive Summary
          </span>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-amber-500" /> CRM Dashboard
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Pantau ringkasan performa penjualan, pipeline leads, dan analisis sumber prospek.
          </p>
        </div>

        <button
          onClick={fetchDashboard}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-bold text-gray-700 shadow-sm hover:bg-gray-50 transition cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh Data
        </button>
      </div>

      {/* ERROR STATE */}
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 flex items-center justify-between gap-3 text-red-700 text-xs">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={fetchDashboard}
            className="px-3 py-1.5 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 transition cursor-pointer"
          >
            Coba Lagi
          </button>
        </div>
      )}

      {/* LOADING STATE */}
      {loading && !data && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <div
              key={i}
              className="h-24 rounded-2xl border border-gray-100 bg-gray-50 animate-pulse p-4"
            />
          ))}
        </div>
      )}

      {/* MAIN DATA VIEW */}
      {data && (
        <>
          {/* ================================================== */}
          {/* 1. KPI SUMMARY GRID */}
          {/* ================================================== */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {/* Total Leads */}
            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between text-gray-500">
                <span className="text-[11px] font-medium">Total Leads</span>
                <Users className="h-4 w-4 text-blue-500" />
              </div>
              <p className="text-xl font-bold text-gray-900 mt-2">
                {data.kpi.totalLeads}
              </p>
              <p className="text-[10px] text-gray-400 mt-0.5">Semua prospek terdaftar</p>
            </div>

            {/* New Leads */}
            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between text-gray-500">
                <span className="text-[11px] font-medium">New Leads</span>
                <UserPlus className="h-4 w-4 text-cyan-500" />
              </div>
              <p className="text-xl font-bold text-gray-900 mt-2">
                {data.kpi.newLeads}
              </p>
              <p className="text-[10px] text-gray-400 mt-0.5">Belum dihubungi</p>
            </div>

            {/* Follow Up Today */}
            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between text-gray-500">
                <span className="text-[11px] font-medium">Follow Up Today</span>
                <Clock className="h-4 w-4 text-amber-500" />
              </div>
              <p className="text-xl font-bold text-amber-600 mt-2">
                {data.kpi.followUpToday}
              </p>
              <p className="text-[10px] text-gray-400 mt-0.5">Agenda hari ini</p>
            </div>

            {/* Upcoming Survey */}
            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between text-gray-500">
                <span className="text-[11px] font-medium">Upcoming Survey</span>
                <Calendar className="h-4 w-4 text-purple-500" />
              </div>
              <p className="text-xl font-bold text-purple-600 mt-2">
                {data.kpi.upcomingSurvey}
              </p>
              <p className="text-[10px] text-gray-400 mt-0.5">Jadwal survei mendatang</p>
            </div>

            {/* Negotiation */}
            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between text-gray-500">
                <span className="text-[11px] font-medium">Negotiation</span>
                <TrendingUp className="h-4 w-4 text-pink-500" />
              </div>
              <p className="text-xl font-bold text-gray-900 mt-2">
                {data.kpi.negotiation}
              </p>
              <p className="text-[10px] text-gray-400 mt-0.5">Tahap penawaran</p>
            </div>

            {/* Booking */}
            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between text-gray-500">
                <span className="text-[11px] font-medium">Booking</span>
                <BookmarkCheck className="h-4 w-4 text-indigo-500" />
              </div>
              <p className="text-xl font-bold text-gray-900 mt-2">
                {data.kpi.booking}
              </p>
              <p className="text-[10px] text-gray-400 mt-0.5">Sudah bayar UTJ/Booking</p>
            </div>

            {/* Closed */}
            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between text-gray-500">
                <span className="text-[11px] font-medium">Closed</span>
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              </div>
              <p className="text-xl font-bold text-emerald-600 mt-2">
                {data.kpi.closed}
              </p>
              <p className="text-[10px] text-gray-400 mt-0.5">Transaksi berhasil</p>
            </div>

            {/* Lost */}
            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between text-gray-500">
                <span className="text-[11px] font-medium">Lost</span>
                <XCircle className="h-4 w-4 text-red-500" />
              </div>
              <p className="text-xl font-bold text-red-600 mt-2">
                {data.kpi.lost}
              </p>
              <p className="text-[10px] text-gray-400 mt-0.5">Batal / Tidak tertarik</p>
            </div>

            {/* Estimated Commission */}
            <div className="col-span-2 md:col-span-3 lg:col-span-2 rounded-2xl border border-amber-200 bg-linear-to-r from-amber-500/10 via-amber-500/5 to-transparent p-4 shadow-sm">
              <div className="flex items-center justify-between text-amber-800">
                <span className="text-[11px] font-bold uppercase tracking-wider">
                  Est. Commission
                </span>
                <Coins className="h-5 w-5 text-amber-600" />
              </div>
              <p className="text-xl font-extrabold text-amber-900 mt-2">
                {formatIDR(data.kpi.estimatedCommission)}
              </p>
              <p className="text-[10px] text-amber-700 mt-0.5">
                Proyeksi estimasi komisi bersih
              </p>
            </div>
          </div>

          {/* ================================================== */}
          {/* 2. PIPELINE FUNNEL */}
          {/* ================================================== */}
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm space-y-6">
            <div>
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <Filter className="h-5 w-5 text-amber-500" /> Sales Pipeline Funnel
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Visualisasi distribusi prospek berdasarkan tahapan konversi sales.
              </p>
            </div>

            {/* Visual Funnel Cards Flow */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
              {data.pipeline.map((item, idx) => (
                <div
                  key={item.stage}
                  className="rounded-2xl border border-gray-100 p-3 bg-gray-50/50 flex flex-col justify-between"
                >
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    {idx + 1}. {item.stage}
                  </span>
                  <div className="my-2">
                    <span className="text-2xl font-black text-gray-900">
                      {item.count}
                    </span>
                    <span className="text-[10px] text-gray-400 block mt-0.5">
                      {data.kpi.totalLeads > 0
                        ? `${((item.count / data.kpi.totalLeads) * 100).toFixed(0)}%`
                        : "0%"}
                    </span>
                  </div>
                  <div
                    className="h-1.5 w-full rounded-full"
                    style={{ backgroundColor: stageColors[idx % stageColors.length] }}
                  />
                </div>
              ))}
            </div>

            {/* Recharts Bar Chart View */}
            <div className="h-64 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.pipeline}>
                  <XAxis dataKey="stage" tick={{ fontSize: 11 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      fontSize: "12px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                    {data.pipeline.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={stageColors[index % stageColors.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* ================================================== */}
          {/* 3. SOURCE ANALYTICS */}
          {/* ================================================== */}
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
            <div>
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <Globe className="h-5 w-5 text-amber-500" /> Source Analytics
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Efektivitas kanal pemasaran dalam menggaet leads hingga tahap Closing.
              </p>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50 text-gray-500 font-semibold">
                    <th className="p-3 rounded-l-xl">Source / Kanal</th>
                    <th className="p-3">Total Leads</th>
                    <th className="p-3">Surveys</th>
                    <th className="p-3">Closing</th>
                    <th className="p-3 text-right rounded-r-xl">Conversion Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {data.sourceAnalytics.map((row) => (
                    <tr key={row.source} className="hover:bg-gray-50/50 transition">
                      <td className="p-3 font-semibold text-gray-900">{row.source}</td>
                      <td className="p-3 text-gray-700">{row.leads}</td>
                      <td className="p-3 text-gray-700">{row.survey}</td>
                      <td className="p-3 font-semibold text-emerald-600">
                        {row.closing}
                      </td>
                      <td className="p-3 text-right font-bold text-amber-600">
                        {row.conversionRate}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* EMPTY STATE FOR SOURCE ANALYTICS */}
            {data.kpi.totalLeads === 0 && (
              <div className="text-center py-8 text-gray-400 text-xs">
                Belum ada data transaksi/lead untuk dianalisis.
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}