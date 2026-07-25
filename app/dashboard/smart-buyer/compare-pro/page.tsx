import { RoleGuard } from "@/components/auth/RoleGuard";
import { Scale, CheckCircle2, XCircle } from "lucide-react";

export default function SmartBuyerCompareProPage() {
  return (
    <RoleGuard minRole="smart_buyer">
      <div className="space-y-6 max-w-6xl mx-auto p-6">
        <div>
          <span className="bg-blue-500/20 text-blue-400 text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full border border-blue-500/30 inline-block mb-3">Comparison Tool</span>
          <h1 className="text-3xl font-extrabold font-heading text-white">Compare Pro Properties</h1>
          <p className="text-xs text-slate-400 mt-1">Bandingkan spesifikasi, harga, fasilitas, dan legalitas antar properti incaran Anda secara berdampingan.</p>
        </div>

        <div className="bg-[#1C2541]/70 border border-slate-800 rounded-3xl backdrop-blur-xl p-6 shadow-xl overflow-x-auto">
          <div className="grid grid-cols-3 gap-4 text-xs min-w-150[600px]">
            <div className="font-bold text-slate-400">Parameter Komparasi</div>
            <div className="font-bold text-white text-center bg-slate-950/40 p-3 rounded-xl border border-slate-800">Cluster Harmony Residence</div>
            <div className="font-bold text-white text-center bg-slate-950/40 p-3 rounded-xl border border-slate-800">Apartemen Urban Heights</div>

            <div className="text-slate-400 py-3 border-t border-slate-800 flex items-center">Harga Unit</div>
            <div className="text-emerald-400 text-center py-3 border-t border-slate-800 font-semibold flex items-center justify-center">Rp 1.25 Miliar</div>
            <div className="text-slate-300 text-center py-3 border-t border-slate-800 font-semibold flex items-center justify-center">Rp 850 Juta</div>

            <div className="text-slate-400 py-3 border-t border-slate-800 flex items-center">Sertifikat</div>
            <div className="text-white text-center py-3 border-t border-slate-800 font-semibold flex items-center justify-center">SHM</div>
            <div className="text-white text-center py-3 border-t border-slate-800 font-semibold flex items-center justify-center">SHGB Murni</div>

            <div className="text-slate-400 py-3 border-t border-slate-800 flex items-center">Fasilitas Cluster</div>
            <div className="text-center py-3 border-t border-slate-800 flex justify-center"><CheckCircle2 className="w-4 h-4 text-emerald-400" /></div>
            <div className="text-center py-3 border-t border-slate-800 flex justify-center"><CheckCircle2 className="w-4 h-4 text-emerald-400" /></div>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}