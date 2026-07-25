import { RoleGuard } from "@/components/auth/RoleGuard";
import { LineChart, Sparkles } from "lucide-react";

export default function RoiForecastPage() {
  return (
    <RoleGuard minRole="investor_pro">
      <div className="space-y-6 max-w-5xl mx-auto p-6">
        <div>
          <span className="bg-indigo-500/20 text-indigo-400 text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full border border-indigo-500/30 inline-block mb-3">AI Prediction</span>
          <h1 className="text-3xl font-extrabold font-heading text-white">10-Year ROI Forecast</h1>
          <p className="text-xs text-slate-400 mt-1">Proyeksi pengembalian investasi jangka panjang menggunakan algoritma prediktif berbasis machine learning.</p>
        </div>

        <div className="bg-[#1C2541]/70 border border-slate-800 p-8 rounded-3xl backdrop-blur-xl space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl text-indigo-400">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Prediksi Compound Annual Growth Rate (CAGR)</h3>
              <p className="text-xs text-slate-400">Estimasi tingkat pertumbuhan tahunan gabungan sebesar <strong className="text-emerald-400">11.8%</strong>.</p>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4 text-center text-xs">
            <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800">
              <span className="text-slate-400 block mb-1">Tahun 3</span>
              <span className="text-white font-bold text-sm">134% ROI</span>
            </div>
            <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800">
              <span className="text-slate-400 block mb-1">Tahun 5</span>
              <span className="text-white font-bold text-sm">178% ROI</span>
            </div>
            <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800">
              <span className="text-slate-400 block mb-1">Tahun 7</span>
              <span className="text-white font-bold text-sm">240% ROI</span>
            </div>
            <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800">
              <span className="text-slate-400 block mb-1">Tahun 10</span>
              <span className="text-emerald-400 font-bold text-sm">315% ROI</span>
            </div>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}