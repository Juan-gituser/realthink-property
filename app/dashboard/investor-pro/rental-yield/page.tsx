import { RoleGuard } from "@/components/auth/RoleGuard";
import { Percent, DollarSign, Calculator } from "lucide-react";

export default function RentalYieldPage() {
  return (
    <RoleGuard minRole="investor_pro">
      <div className="mx-auto max-w-5xl space-y-6 p-6">
        <div>
          <span className="mb-3 inline-block rounded-full border border-indigo-500/30 bg-indigo-500/20 px-3 py-1 text-[10px] font-bold tracking-widest text-indigo-400 uppercase">
            Yield Analytics
          </span>
          <h1 className="font-heading text-3xl font-extrabold text-white">
            Rental Yield Calculator & Breakdown
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            Hitung gross dan net yield sewa properti secara akurat.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 rounded-3xl border border-slate-800 bg-[#1C2541]/70 p-6 backdrop-blur-xl md:grid-cols-2">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white">Parameter Input</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="mb-1 block text-slate-400">Harga Beli Properti</label>
                <input
                  type="text"
                  defaultValue="Rp 2.000.000.000"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950/60 p-2.5 text-white"
                />
              </div>
              <div>
                <label className="mb-1 block text-slate-400">Pendapatan Sewa Tahunan</label>
                <input
                  type="text"
                  defaultValue="Rp 160.000.000"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950/60 p-2.5 text-white"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-950/50 p-6">
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-white">Hasil Kalkulasi</h3>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Gross Rental Yield:</span>
                <span className="text-sm font-bold text-emerald-400">8.0% / thn</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Net Rental Yield (setelah maintenance):</span>
                <span className="text-sm font-bold text-indigo-400">6.8% / thn</span>
              </div>
            </div>
            <button className="mt-4 w-full rounded-xl bg-indigo-600 py-2.5 text-xs font-bold text-white transition-colors hover:bg-indigo-500">
              Simpan Simulasi
            </button>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}
