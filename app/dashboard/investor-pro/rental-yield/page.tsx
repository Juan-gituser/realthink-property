import { RoleGuard } from "@/components/auth/RoleGuard";
import { Percent, DollarSign, Calculator } from "lucide-react";

export default function RentalYieldPage() {
  return (
    <RoleGuard minRole="investor_pro">
      <div className="space-y-6 max-w-5xl mx-auto p-6">
        <div>
          <span className="bg-indigo-500/20 text-indigo-400 text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full border border-indigo-500/30 inline-block mb-3">Yield Analytics</span>
          <h1 className="text-3xl font-extrabold font-heading text-white">Rental Yield Calculator & Breakdown</h1>
          <p className="text-xs text-slate-400 mt-1">Hitung gross dan net yield sewa properti secara akurat.</p>
        </div>

        <div className="bg-[#1C2541]/70 border border-slate-800 p-6 rounded-3xl backdrop-blur-xl grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white">Parameter Input</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Harga Beli Properti</label>
                <input type="text" defaultValue="Rp 2.000.000.000" className="w-full bg-slate-950/60 border border-slate-800 p-2.5 rounded-xl text-white" />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Pendapatan Sewa Tahunan</label>
                <input type="text" defaultValue="Rp 160.000.000" className="w-full bg-slate-950/60 border border-slate-800 p-2.5 rounded-xl text-white" />
              </div>
            </div>
          </div>

          <div className="bg-slate-950/50 p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-white">Hasil Kalkulasi</h3>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Gross Rental Yield:</span>
                <span className="text-emerald-400 font-bold text-sm">8.0% / thn</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Net Rental Yield (setelah maintenance):</span>
                <span className="text-indigo-400 font-bold text-sm">6.8% / thn</span>
              </div>
            </div>
            <button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2.5 rounded-xl text-xs font-bold transition-colors mt-4">
              Simpan Simulasi
            </button>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}