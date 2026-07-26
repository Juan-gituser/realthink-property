import { RoleGuard } from "@/components/auth/RoleGuard";
import { TrendingUp, BarChart3, Activity } from "lucide-react";

export default function MarketTrendPage() {
  return (
    <RoleGuard minRole="investor_pro">
      <div className="mx-auto max-w-5xl space-y-6 p-6">
        <div>
          <span className="mb-3 inline-block rounded-full border border-indigo-500/30 bg-indigo-500/20 px-3 py-1 text-[10px] font-bold tracking-widest text-indigo-400 uppercase">
            Macroeconomics
          </span>
          <h1 className="font-heading text-3xl font-extrabold text-white">
            Real Estate Market Trends
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            Pantau pergerakan suku bunga KPR, indeks kepercayaan konsumen, dan tren suplai properti
            nasional.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="space-y-2 rounded-3xl border border-slate-800 bg-[#1C2541]/70 p-6 backdrop-blur-xl">
            <span className="text-[10px] font-bold text-slate-400 uppercase">
              Suku Bunga Acuan BI
            </span>
            <h3 className="text-xl font-extrabold text-white">6.00%</h3>
            <p className="text-[10px] text-emerald-400">Stabil dari bulan lalu</p>
          </div>
          <div className="space-y-2 rounded-3xl border border-slate-800 bg-[#1C2541]/70 p-6 backdrop-blur-xl">
            <span className="text-[10px] font-bold text-slate-400 uppercase">
              Indeks Permintaan KPR
            </span>
            <h3 className="text-xl font-extrabold text-white">+14.2%</h3>
            <p className="text-[10px] text-emerald-400">Tren bullish kuartal ini</p>
          </div>
          <div className="space-y-2 rounded-3xl border border-slate-800 bg-[#1C2541]/70 p-6 backdrop-blur-xl">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Inflasi Properti</span>
            <h3 className="text-xl font-extrabold text-white">3.4%</h3>
            <p className="text-[10px] text-emerald-400">Terkendali</p>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}
