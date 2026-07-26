import { RoleGuard } from "@/components/auth/RoleGuard";
import { LineChart, Sparkles } from "lucide-react";

export default function RoiForecastPage() {
  return (
    <RoleGuard minRole="investor_pro">
      <div className="mx-auto max-w-5xl space-y-6 p-6">
        <div>
          <span className="mb-3 inline-block rounded-full border border-indigo-500/30 bg-indigo-500/20 px-3 py-1 text-[10px] font-bold tracking-widest text-indigo-400 uppercase">
            AI Prediction
          </span>
          <h1 className="font-heading text-3xl font-extrabold text-white">10-Year ROI Forecast</h1>
          <p className="mt-1 text-xs text-slate-400">
            Proyeksi pengembalian investasi jangka panjang menggunakan algoritma prediktif berbasis
            machine learning.
          </p>
        </div>

        <div className="space-y-6 rounded-3xl border border-slate-800 bg-[#1C2541]/70 p-8 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/10 p-3 text-indigo-400">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Prediksi Compound Annual Growth Rate (CAGR)
              </h3>
              <p className="text-xs text-slate-400">
                Estimasi tingkat pertumbuhan tahunan gabungan sebesar{" "}
                <strong className="text-emerald-400">11.8%</strong>.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4 text-center text-xs">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4">
              <span className="mb-1 block text-slate-400">Tahun 3</span>
              <span className="text-sm font-bold text-white">134% ROI</span>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4">
              <span className="mb-1 block text-slate-400">Tahun 5</span>
              <span className="text-sm font-bold text-white">178% ROI</span>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4">
              <span className="mb-1 block text-slate-400">Tahun 7</span>
              <span className="text-sm font-bold text-white">240% ROI</span>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4">
              <span className="mb-1 block text-slate-400">Tahun 10</span>
              <span className="text-sm font-bold text-emerald-400">315% ROI</span>
            </div>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}
