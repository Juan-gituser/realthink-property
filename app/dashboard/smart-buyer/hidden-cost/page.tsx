import { RoleGuard } from "@/components/auth/RoleGuard";
import CalculatorDisclaimer from "@/components/CalculatorDisclaimer";
import { Calculator, DollarSign } from "lucide-react";

export default function SmartBuyerHiddenCostPage() {
  return (
    <RoleGuard minRole="smart_buyer">
      <div className="mx-auto max-w-5xl space-y-6 p-6">
        <div>
          <span className="mb-3 inline-block rounded-full border border-blue-500/30 bg-blue-500/20 px-3 py-1 text-[10px] font-bold tracking-widest text-blue-400 uppercase">
            Cost Transparency
          </span>
          <h1 className="font-heading text-3xl font-extrabold text-white">
            Hidden Cost Calculator
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            Kalkulasi biaya tersembunyi seperti BPHTB, AJB, balik nama, asuransi jiwa KPR, dan
            provisi bank.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 rounded-3xl border border-slate-800 bg-[#1C2541]/70 p-6 backdrop-blur-xl md:grid-cols-2">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white">Input Harga Properti</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="mb-1 block text-slate-400">Harga Transaksi Rumah</label>
                <input
                  type="text"
                  defaultValue="Rp 1.000.000.000"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950/60 p-2.5 text-white"
                />
              </div>
              <div>
                <label className="mb-1 block text-slate-400">Jenis Pembelian</label>
                <select className="w-full rounded-xl border border-slate-800 bg-slate-950/60 p-2.5 text-white">
                  <option>KPR Bank Pertama</option>
                  <option>Cash Keras</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-950/50 p-6">
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-white">Estimasi Biaya Tambahan</h3>
              <div className="flex justify-between border-b border-slate-800/80 pb-2 text-xs">
                <span className="text-slate-400">BPHTB (5% x [NJOP - NPOPTKP]):</span>
                <span className="font-semibold text-white">Rp 47.500.000</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/80 pb-2 text-xs">
                <span className="text-slate-400">Biaya AJB & Notaris (~1%):</span>
                <span className="font-semibold text-white">Rp 10.000.000</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/80 pb-2 text-xs">
                <span className="text-slate-400">Provisi & Administrasi Bank:</span>
                <span className="font-semibold text-white">Rp 10.000.000</span>
              </div>
              <div className="flex justify-between pt-1 text-xs">
                <span className="font-bold text-slate-300">Total Estimasi Hidden Cost:</span>
                <span className="text-sm font-bold text-emerald-400">Rp 67.500.000</span>
              </div>
            </div>
            <div className="mt-4">
              <CalculatorDisclaimer />
            </div>
            <button className="mt-4 w-full rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white transition-colors hover:bg-blue-500">
              Simpan Rincian Biaya
            </button>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}
