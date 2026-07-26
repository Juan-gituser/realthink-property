import { RoleGuard } from "@/components/auth/RoleGuard";
import { Calculator, DollarSign } from "lucide-react";

export default function RoiCalculatorPage() {
  return (
    <RoleGuard minRole="investor_pro">
      <div className="mx-auto max-w-5xl space-y-6 p-6">
        <div>
          <span className="mb-3 inline-block rounded-full border border-indigo-500/30 bg-indigo-500/20 px-3 py-1 text-[10px] font-bold tracking-widest text-indigo-400 uppercase">
            Financial Tool
          </span>
          <h1 className="font-heading text-3xl font-extrabold text-white">
            Advanced ROI Calculator
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            Kalkulator Return on Investment komprehensif termasuk cicilan KPR dan biaya operasional.
          </p>
        </div>

        <div className="space-y-4 rounded-3xl border border-slate-800 bg-[#1C2541]/70 p-6 backdrop-blur-xl">
          <h3 className="text-sm font-bold text-white">Parameter Kalkulasi ROI</h3>
          <div className="grid grid-cols-1 gap-4 text-xs md:grid-cols-2">
            <div>
              <label className="mb-1 block text-slate-400">Down Payment (DP)</label>
              <input
                type="text"
                defaultValue="20%"
                className="w-full rounded-xl border border-slate-800 bg-slate-950/60 p-2.5 text-white"
              />
            </div>
            <div>
              <label className="mb-1 block text-slate-400">Suku Bunga KPR (%)</label>
              <input
                type="text"
                defaultValue="7.5%"
                className="w-full rounded-xl border border-slate-800 bg-slate-950/60 p-2.5 text-white"
              />
            </div>
          </div>
          <button className="mt-2 w-full rounded-xl bg-indigo-600 py-3 text-xs font-bold text-white transition-colors hover:bg-indigo-500">
            Hitung Proyeksi ROI Total
          </button>
        </div>
      </div>
    </RoleGuard>
  );
}
