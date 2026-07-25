import { RoleGuard } from "@/components/auth/RoleGuard";
import { Scale, Building, Check } from "lucide-react";

export default function MarketComparisonPage() {
  return (
    <RoleGuard minRole="investor_pro">
      <div className="space-y-6 max-w-6xl mx-auto p-6">
        <div>
          <span className="bg-indigo-500/20 text-indigo-400 text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full border border-indigo-500/30 inline-block mb-3">Comparative Analysis</span>
          <h1 className="text-3xl font-extrabold font-heading text-white">Market Comparison Engine</h1>
          <p className="text-xs text-slate-400 mt-1">Bandingkan performa antar properti untuk menemukan opsi investasi dengan ROI terbaik.</p>
        </div>

        <div className="bg-[#1C2541]/70 border border-slate-800 rounded-3xl backdrop-blur-xl overflow-hidden shadow-xl p-6">
          <div className="grid grid-cols-3 gap-4 text-xs">
            <div className="font-bold text-slate-400">Parameter</div>
            <div className="font-bold text-white text-center">Apartemen A (SCBD)</div>
            <div className="font-bold text-white text-center">Townhouse B (BSD)</div>

            <div className="text-slate-400 py-2 border-t border-slate-800">Harga per m²</div>
            <div className="text-emerald-400 text-center py-2 border-t border-slate-800 font-semibold">Rp 48 Jt</div>
            <div className="text-slate-300 text-center py-2 border-t border-slate-800 font-semibold">Rp 22 Jt</div>

            <div className="text-slate-400 py-2 border-t border-slate-800">Est. Rental Yield</div>
            <div className="text-slate-300 text-center py-2 border-t border-slate-800 font-semibold">7.5%</div>
            <div className="text-emerald-400 text-center py-2 border-t border-slate-800 font-semibold">9.1%</div>

            <div className="text-slate-400 py-2 border-t border-slate-800">Skor Risiko</div>
            <div className="text-white text-center py-2 border-t border-slate-800 font-semibold">Rendah</div>
            <div className="text-white text-center py-2 border-t border-slate-800 font-semibold">Sedang</div>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}