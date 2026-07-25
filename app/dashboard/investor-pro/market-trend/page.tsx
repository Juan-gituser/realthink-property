import { RoleGuard } from "@/components/auth/RoleGuard";
import { TrendingUp, BarChart3, Activity } from "lucide-react";

export default function MarketTrendPage() {
  return (
    <RoleGuard minRole="investor_pro">
      <div className="space-y-6 max-w-5xl mx-auto p-6">
        <div>
          <span className="bg-indigo-500/20 text-indigo-400 text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full border border-indigo-500/30 inline-block mb-3">Macroeconomics</span>
          <h1 className="text-3xl font-extrabold font-heading text-white">Real Estate Market Trends</h1>
          <p className="text-xs text-slate-400 mt-1">Pantau pergerakan suku bunga KPR, indeks kepercayaan konsumen, dan tren suplai properti nasional.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#1C2541]/70 border border-slate-800 p-6 rounded-3xl backdrop-blur-xl space-y-2">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Suku Bunga Acuan BI</span>
            <h3 className="text-xl font-extrabold text-white">6.00%</h3>
            <p className="text-[10px] text-emerald-400">Stabil dari bulan lalu</p>
          </div>
          <div className="bg-[#1C2541]/70 border border-slate-800 p-6 rounded-3xl backdrop-blur-xl space-y-2">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Indeks Permintaan KPR</span>
            <h3 className="text-xl font-extrabold text-white">+14.2%</h3>
            <p className="text-[10px] text-emerald-400">Tren bullish kuartal ini</p>
          </div>
          <div className="bg-[#1C2541]/70 border border-slate-800 p-6 rounded-3xl backdrop-blur-xl space-y-2">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Inflasi Properti</span>
            <h3 className="text-xl font-extrabold text-white">3.4%</h3>
            <p className="text-[10px] text-emerald-400">Terkendali</p>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}