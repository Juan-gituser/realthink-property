import { RoleGuard } from "@/components/auth/RoleGuard";
import { Scale, CheckCircle2, XCircle } from "lucide-react";

export default function SmartBuyerCompareProPage() {
  return (
    <RoleGuard minRole="smart_buyer">
      <div className="mx-auto max-w-6xl space-y-6 p-6">
        <div>
          <span className="mb-3 inline-block rounded-full border border-blue-500/30 bg-blue-500/20 px-3 py-1 text-[10px] font-bold tracking-widest text-blue-400 uppercase">
            Comparison Tool
          </span>
          <h1 className="font-heading text-3xl font-extrabold text-white">
            Compare Pro Properties
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            Bandingkan spesifikasi, harga, fasilitas, dan legalitas antar properti incaran Anda
            secara berdampingan.
          </p>
        </div>

        <div className="overflow-x-auto rounded-3xl border border-slate-800 bg-[#1C2541]/70 p-6 shadow-xl backdrop-blur-xl">
          <div className="min-w-150[600px] grid grid-cols-3 gap-4 text-xs">
            <div className="font-bold text-slate-400">Parameter Komparasi</div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3 text-center font-bold text-white">
              Cluster Harmony Residence
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3 text-center font-bold text-white">
              Apartemen Urban Heights
            </div>

            <div className="flex items-center border-t border-slate-800 py-3 text-slate-400">
              Harga Unit
            </div>
            <div className="flex items-center justify-center border-t border-slate-800 py-3 text-center font-semibold text-emerald-400">
              Rp 1.25 Miliar
            </div>
            <div className="flex items-center justify-center border-t border-slate-800 py-3 text-center font-semibold text-slate-300">
              Rp 850 Juta
            </div>

            <div className="flex items-center border-t border-slate-800 py-3 text-slate-400">
              Sertifikat
            </div>
            <div className="flex items-center justify-center border-t border-slate-800 py-3 text-center font-semibold text-white">
              SHM
            </div>
            <div className="flex items-center justify-center border-t border-slate-800 py-3 text-center font-semibold text-white">
              SHGB Murni
            </div>

            <div className="flex items-center border-t border-slate-800 py-3 text-slate-400">
              Fasilitas Cluster
            </div>
            <div className="flex justify-center border-t border-slate-800 py-3 text-center">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="flex justify-center border-t border-slate-800 py-3 text-center">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            </div>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}
