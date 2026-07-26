import { RoleGuard } from "@/components/auth/RoleGuard";
import { FileText, Eye, Printer } from "lucide-react";

export default function InvestmentReportPage() {
  return (
    <RoleGuard minRole="investor_pro">
      <div className="mx-auto max-w-5xl space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="mb-3 inline-block rounded-full border border-indigo-500/30 bg-indigo-500/20 px-3 py-1 text-[10px] font-bold tracking-widest text-indigo-400 uppercase">
              Official Document
            </span>
            <h1 className="font-heading text-3xl font-extrabold text-white">
              Comprehensive Investment Report
            </h1>
            <p className="mt-1 text-xs text-slate-400">
              Ringkasan eksekutif performa investasi kuartal ini.
            </p>
          </div>
          <button className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-indigo-500">
            <Printer className="h-3.5 w-3.5" /> Print PDF
          </button>
        </div>

        <div className="space-y-6 rounded-3xl border border-slate-800 bg-[#1C2541]/70 p-8 backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-base font-bold text-white">Q2 2026 Performance Audit</h2>
              <p className="text-[11px] text-slate-400">
                Diterbitkan oleh RealThink Analytics Engine
              </p>
            </div>
            <span className="rounded-lg border border-emerald-500/30 bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-400">
              Verified
            </span>
          </div>
          <div className="grid grid-cols-3 gap-4 text-xs">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4">
              <span className="text-slate-400">Total Portfolio Value</span>
              <p className="mt-1 text-base font-bold text-white">Rp 12.4 Miliar</p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4">
              <span className="text-slate-400">Average Rental Yield</span>
              <p className="mt-1 text-base font-bold text-emerald-400">8.2% / thn</p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4">
              <span className="text-slate-400">Risk Profile</span>
              <p className="mt-1 text-base font-bold text-indigo-300">Moderate-Conservative</p>
            </div>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}
