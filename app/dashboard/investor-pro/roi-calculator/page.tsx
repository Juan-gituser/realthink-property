import { RoleGuard } from "@/components/auth/RoleGuard";
import { Calculator, DollarSign } from "lucide-react";

export default function RoiCalculatorPage() {
  return (
    <RoleGuard minRole="investor_pro">
      <div className="space-y-6 max-w-5xl mx-auto p-6">
        <div>
          <span className="bg-indigo-500/20 text-indigo-400 text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full border border-indigo-500/30 inline-block mb-3">Financial Tool</span>
          <h1 className="text-3xl font-extrabold font-heading text-white">Advanced ROI Calculator</h1>
          <p className="text-xs text-slate-400 mt-1">Kalkulator Return on Investment komprehensif termasuk cicilan KPR dan biaya operasional.</p>
        </div>

        <div className="bg-[#1C2541]/70 border border-slate-800 p-6 rounded-3xl backdrop-blur-xl space-y-4">
          <h3 className="text-sm font-bold text-white">Parameter Kalkulasi ROI</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-slate-400 block mb-1">Down Payment (DP)</label>
              <input type="text" defaultValue="20%" className="w-full bg-slate-950/60 border border-slate-800 p-2.5 rounded-xl text-white" />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Suku Bunga KPR (%)</label>
              <input type="text" defaultValue="7.5%" className="w-full bg-slate-950/60 border border-slate-800 p-2.5 rounded-xl text-white" />
            </div>
          </div>
          <button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl text-xs font-bold transition-colors mt-2">
            Hitung Proyeksi ROI Total
          </button>
        </div>
      </div>
    </RoleGuard>
  );
}