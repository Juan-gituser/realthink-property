import { RoleGuard } from "@/components/auth/RoleGuard";
import { Award, ShieldAlert, CheckCircle } from "lucide-react";

export default function InvestmentScorePage() {
  return (
    <RoleGuard minRole="investor_pro">
      <div className="space-y-6 max-w-5xl mx-auto p-6">
        <div>
          <span className="bg-indigo-500/20 text-indigo-400 text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full border border-indigo-500/30 inline-block mb-3">Scoring Engine</span>
          <h1 className="text-3xl font-extrabold font-heading text-white">Property Investment Score Matrix</h1>
          <p className="text-xs text-slate-400 mt-1">Penilaian objektif kelayakan investasi properti berdasarkan 5 parameter utama.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#1C2541]/70 border border-slate-800 p-6 rounded-3xl backdrop-blur-xl flex flex-col items-center justify-center text-center space-y-3">
            <div className="w-24 h-24 rounded-full bg-emerald-500/10 border-4 border-emerald-500/30 flex items-center justify-center text-emerald-400 text-2xl font-black">
              9.2
            </div>
            <h3 className="text-base font-bold text-white">Overall Grade: A+ (Prime Investment)</h3>
            <p className="text-xs text-slate-400 max-w-xs">Properti ini memiliki potensi likuiditas tinggi dan risiko gagal bayar yang sangat rendah.</p>
          </div>

          <div className="bg-[#1C2541]/70 border border-slate-800 p-6 rounded-3xl backdrop-blur-xl space-y-3">
            <h3 className="text-sm font-bold text-white">Parameter Penilaian</h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center p-2 bg-slate-950/50 rounded-xl border border-slate-800">
                <span className="text-slate-400">Likuiditas Kawasan</span>
                <span className="text-emerald-400 font-bold">9.5 / 10</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-slate-950/50 rounded-xl border border-slate-800">
                <span className="text-slate-400">Potensi Rental Yield</span>
                <span className="text-emerald-400 font-bold">9.0 / 10</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-slate-950/50 rounded-xl border border-slate-800">
                <span className="text-slate-400">Legalitas & Developer</span>
                <span className="text-emerald-400 font-bold">9.8 / 10</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}