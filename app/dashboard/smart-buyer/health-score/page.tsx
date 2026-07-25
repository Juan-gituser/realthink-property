import { RoleGuard } from "@/components/auth/RoleGuard";
import { ShieldCheck, Activity } from "lucide-react";

export default function SmartBuyerHealthScorePage() {
  return (
    <RoleGuard minRole="smart_buyer">
      <div className="space-y-6 max-w-5xl mx-auto p-6">
        <div>
          <span className="bg-blue-500/20 text-blue-400 text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full border border-blue-500/30 inline-block mb-3">Property Audit</span>
          <h1 className="text-3xl font-extrabold font-heading text-white">Property Health Score</h1>
          <p className="text-xs text-slate-400 mt-1">Evaluasi tingkat kesehatan fisik bangunan, rekam jejak developer, dan keabsahan dokumen properti.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#1C2541]/70 border border-slate-800 p-6 rounded-3xl backdrop-blur-xl flex flex-col items-center justify-center text-center space-y-3">
            <div className="w-24 h-24 rounded-full bg-emerald-500/10 border-4 border-emerald-500/30 flex items-center justify-center text-emerald-400 text-2xl font-black">
              9.4
            </div>
            <h3 className="text-base font-bold text-white">Aset Sangat Sehat & Aman</h3>
            <p className="text-xs text-slate-400 max-w-xs">Tidak ditemukan indikasi sengketa hukum atau masalah konstruksi pada unit ini.</p>
          </div>

          <div className="bg-[#1C2541]/70 border border-slate-800 p-6 rounded-3xl backdrop-blur-xl space-y-3">
            <h3 className="text-sm font-bold text-white">Parameter Kesehatan Properti</h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center p-2.5 bg-slate-950/50 rounded-xl border border-slate-800">
                <span className="text-slate-400">Legalitas & Sertifikat</span>
                <span className="text-emerald-400 font-bold">10 / 10</span>
              </div>
              <div className="flex justify-between items-center p-2.5 bg-slate-950/50 rounded-xl border border-slate-800">
                <span className="text-slate-400">Reputasi Developer</span>
                <span className="text-emerald-400 font-bold">9.2 / 10</span>
              </div>
              <div className="flex justify-between items-center p-2.5 bg-slate-950/50 rounded-xl border border-slate-800">
                <span className="text-slate-400">Kualitas Struktur Bangunan</span>
                <span className="text-emerald-400 font-bold">9.0 / 10</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}