import { RoleGuard } from "@/components/auth/RoleGuard";
import { FileText, Eye, Printer } from "lucide-react";

export default function InvestmentReportPage() {
  return (
    <RoleGuard minRole="investor_pro">
      <div className="space-y-6 max-w-5xl mx-auto p-6">
        <div className="flex justify-between items-center">
          <div>
            <span className="bg-indigo-500/20 text-indigo-400 text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full border border-indigo-500/30 inline-block mb-3">Official Document</span>
            <h1 className="text-3xl font-extrabold font-heading text-white">Comprehensive Investment Report</h1>
            <p className="text-xs text-slate-400 mt-1">Ringkasan eksekutif performa investasi kuartal ini.</p>
          </div>
          <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-2">
            <Printer className="w-3.5 h-3.5" /> Print PDF
          </button>
        </div>

        <div className="bg-[#1C2541]/70 border border-slate-800 p-8 rounded-3xl backdrop-blur-xl space-y-6">
          <div className="border-b border-slate-800 pb-4 flex justify-between items-center">
            <div>
              <h2 className="text-base font-bold text-white">Q2 2026 Performance Audit</h2>
              <p className="text-[11px] text-slate-400">Diterbitkan oleh RealThink Analytics Engine</p>
            </div>
            <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-lg text-xs font-bold">Verified</span>
          </div>
          <div className="grid grid-cols-3 gap-4 text-xs">
            <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800">
              <span className="text-slate-400">Total Portfolio Value</span>
              <p className="text-base font-bold text-white mt-1">Rp 12.4 Miliar</p>
            </div>
            <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800">
              <span className="text-slate-400">Average Rental Yield</span>
              <p className="text-base font-bold text-emerald-400 mt-1">8.2% / thn</p>
            </div>
            <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800">
              <span className="text-slate-400">Risk Profile</span>
              <p className="text-base font-bold text-indigo-300 mt-1">Moderate-Conservative</p>
            </div>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}