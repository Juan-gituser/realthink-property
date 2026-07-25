"tsx"
"import"
import { useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import { AnalyticsDataPoint } from "@/types/analytics";

interface AnalyticsChartViewProps {
  data: AnalyticsDataPoint[];
}

export function AnalyticsChartView({ data }: AnalyticsChartViewProps) {
  const [activeMetric, setActiveMetric] = useState<"all" | "revenue" | "leads">("all");

  return (
    <div className="bg-[#1C2541]/70 border border-slate-800 p-6 rounded-3xl backdrop-blur-xl shadow-xl space-y-6">
      {/* Chart Header & Metric Switcher */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">Grafik Performa & Tren Bisnis</h3>
          <p className="text-xs text-slate-400">Analisis komparatif views, leads, survey, deals, dan perolehan revenue.</p>
        </div>

        <div className="flex items-center gap-2 bg-[#0B132B] p-1.5 rounded-2xl border border-slate-800">
          <button
            onClick={() => setActiveMetric("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeMetric === "all" ? "bg-amber-500 text-slate-950 shadow-md" : "text-slate-400 hover:text-white"
            }`}
          >
            Semua Metrik
          </button>
          <button
            onClick={() => setActiveMetric("revenue")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeMetric === "revenue" ? "bg-amber-500 text-slate-950 shadow-md" : "text-slate-400 hover:text-white"
            }`}
          >
            Revenue
          </button>
          <button
            onClick={() => setActiveMetric("leads")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeMetric === "leads" ? "bg-amber-500 text-slate-950 shadow-md" : "text-slate-400 hover:text-white"
            }`}
          >
            Lead & Survey
          </button>
        </div>
      </div>

      {/* Recharts Container */}
      <div className="h-95[380px] w-full pt-4">
        <ResponsiveContainer width="100%" height="100%">
          {activeMetric === "revenue" ? (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="label" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} tickFormatter={(val) => `${val / 1000000000}M`} />
              <Tooltip
                contentStyle={{ backgroundColor: "#0B132B", borderColor: "#1e293b", borderRadius: "1rem", color: "#fff" }}
                formatter={(val: any) => [`Rp ${(Number(val) / 1000000).toLocaleString("id-ID")} Jt`, "Revenue"]}
              />
              <Bar dataKey="revenue" fill="#f59e0b" radius={[8, 8, 0, 0]} />
            </BarChart>
          ) : (
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="label" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} />
              <Tooltip
                contentStyle={{ backgroundColor: "#0B132B", borderColor: "#1e293b", borderRadius: "1rem", color: "#fff" }}
              />
              <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
              {(activeMetric === "all" || activeMetric === "leads") && (
                <>
                  <Area type="monotone" dataKey="propertyViews" name="Property View" stroke="#10b981" fillOpacity={1} fill="transparent" strokeWidth={2} />
                  <Area type="monotone" dataKey="leads" name="Lead" stroke="#3b82f6" fillOpacity={1} fill="url(#colorLeads)" strokeWidth={2} />
                  <Area type="monotone" dataKey="surveys" name="Survey" stroke="#8b5cf6" fillOpacity={1} fill="transparent" strokeWidth={2} />
                  <Area type="monotone" dataKey="deals" name="Deal" stroke="#ec4899" fillOpacity={1} fill="transparent" strokeWidth={2} />
                </>
              )}
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}