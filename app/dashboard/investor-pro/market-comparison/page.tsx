import { RoleGuard } from "@/components/auth/RoleGuard";
import { Scale, Building, Check } from "lucide-react";

export default function MarketComparisonPage() {
  return (
    <RoleGuard minRole="investor_pro">
      <div className="mx-auto max-w-6xl space-y-6 p-6">
        <div>
          <span className="mb-3 inline-block rounded-full border border-indigo-500/30 bg-indigo-500/20 px-3 py-1 text-[10px] font-bold tracking-widest text-indigo-400 uppercase">
            Comparative Analysis
          </span>
          <h1 className="font-heading text-3xl font-extrabold text-white">
            Market Comparison Engine
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            Bandingkan performa antar properti untuk menemukan opsi investasi dengan ROI terbaik.
          </p>
        </div>

        <div className="overflow-hidden rounded-3xl border border-slate-800 bg-[#1C2541]/70 p-6 shadow-xl backdrop-blur-xl">
          <div className="grid grid-cols-3 gap-4 text-xs">
            <div className="font-bold text-slate-400">Parameter</div>
            <div className="text-center font-bold text-white">Apartemen A (SCBD)</div>
            <div className="text-center font-bold text-white">Townhouse B (BSD)</div>

            <div className="border-t border-slate-800 py-2 text-slate-400">Harga per m²</div>
            <div className="border-t border-slate-800 py-2 text-center font-semibold text-emerald-400">
              Rp 48 Jt
            </div>
            <div className="border-t border-slate-800 py-2 text-center font-semibold text-slate-300">
              Rp 22 Jt
            </div>

            <div className="border-t border-slate-800 py-2 text-slate-400">Est. Rental Yield</div>
            <div className="border-t border-slate-800 py-2 text-center font-semibold text-slate-300">
              7.5%
            </div>
            <div className="border-t border-slate-800 py-2 text-center font-semibold text-emerald-400">
              9.1%
            </div>

            <div className="border-t border-slate-800 py-2 text-slate-400">Skor Risiko</div>
            <div className="border-t border-slate-800 py-2 text-center font-semibold text-white">
              Rendah
            </div>
            <div className="border-t border-slate-800 py-2 text-center font-semibold text-white">
              Sedang
            </div>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}
