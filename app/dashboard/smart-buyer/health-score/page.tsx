import { RoleGuard } from "@/components/auth/RoleGuard";
import { ShieldCheck, Activity } from "lucide-react";

export default function SmartBuyerHealthScorePage() {
  return (
    <RoleGuard minRole="smart_buyer">
      <div className="mx-auto max-w-5xl space-y-6 p-6">
        <div>
          <span className="mb-3 inline-block rounded-full border border-blue-500/30 bg-blue-500/20 px-3 py-1 text-[10px] font-bold tracking-widest text-blue-400 uppercase">
            Property Audit
          </span>
          <h1 className="font-heading text-3xl font-extrabold text-white">Property Health Score</h1>
          <p className="mt-1 text-xs text-slate-400">
            Evaluasi tingkat kesehatan fisik bangunan, rekam jejak developer, dan keabsahan dokumen
            properti.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="flex flex-col items-center justify-center space-y-3 rounded-3xl border border-slate-800 bg-[#1C2541]/70 p-6 text-center backdrop-blur-xl">
            <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-emerald-500/30 bg-emerald-500/10 text-2xl font-black text-emerald-400">
              9.4
            </div>
            <h3 className="text-base font-bold text-white">Aset Sangat Sehat & Aman</h3>
            <p className="max-w-xs text-xs text-slate-400">
              Tidak ditemukan indikasi sengketa hukum atau masalah konstruksi pada unit ini.
            </p>
          </div>

          <div className="space-y-3 rounded-3xl border border-slate-800 bg-[#1C2541]/70 p-6 backdrop-blur-xl">
            <h3 className="text-sm font-bold text-white">Parameter Kesehatan Properti</h3>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/50 p-2.5">
                <span className="text-slate-400">Legalitas & Sertifikat</span>
                <span className="font-bold text-emerald-400">10 / 10</span>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/50 p-2.5">
                <span className="text-slate-400">Reputasi Developer</span>
                <span className="font-bold text-emerald-400">9.2 / 10</span>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/50 p-2.5">
                <span className="text-slate-400">Kualitas Struktur Bangunan</span>
                <span className="font-bold text-emerald-400">9.0 / 10</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}
