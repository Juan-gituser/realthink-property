import { RoleGuard } from "@/components/auth/RoleGuard";
import { Calculator, DollarSign } from "lucide-react";

export default function SmartBuyerHiddenCostPage() {
  return (
    <RoleGuard minRole="smart_buyer">
      <div className="space-y-6 max-w-5xl mx-auto p-6">
        <div>
          <span className="bg-blue-500/20 text-blue-400 text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full border border-blue-500/30 inline-block mb-3">Cost Transparency</span>
          <h1 className="text-3xl font-extrabold font-heading text-white">Hidden Cost Calculator</h1>
          <p className="text-xs text-slate-400 mt-1">Kalkulasi biaya tersembunyi seperti BPHTB, AJB, balik nama, asuransi jiwa KPR, dan provisi bank.</p>
        </div>

        <div className="bg-[#1C2541]/70 border border-slate-800 p-6 rounded-3xl backdrop-blur-xl grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white">Input Harga Properti</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Harga Transaksi Rumah</label>
                <input type="text" defaultValue="Rp 1.000.000.000" className="w-full bg-slate-950/60 border border-slate-800 p-2.5 rounded-xl text-white" />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Jenis Pembelian</label>
                <select className="w-full bg-slate-950/60 border border-slate-800 p-2.5 rounded-xl text-white">
                  <option>KPR Bank Pertama</option>
                  <option>Cash Keras</option>
                </select>
              </div>
            </div>
          </div>

<div className="bg-slate-950/50 p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-white">Estimasi Biaya Tambahan</h3>
              <div className="flex justify-between text-xs border-b border-slate-800/80 pb-2">
                <span className="text-slate-400">BPHTB (5% x [NJOP - NPOPTKP]):</span>
                <span className="text-white font-semibold">Rp 47.500.000</span>
              </div>
              <div className="flex justify-between text-xs border-b border-slate-800/80 pb-2">
                <span className="text-slate-400">Biaya AJB & Notaris (~1%):</span>
                <span className="text-white font-semibold">Rp 10.000.000</span>
              </div>
              <div className="flex justify-between text-xs border-b border-slate-800/80 pb-2">
                <span className="text-slate-400">Provisi & Administrasi Bank:</span>
                <span className="text-white font-semibold">Rp 10.000.000</span>
              </div>
              <div className="flex justify-between text-xs pt-1">
                <span className="text-slate-300 font-bold">Total Estimasi Hidden Cost:</span>
                <span className="text-emerald-400 font-bold text-sm">Rp 67.500.000</span>
              </div>
            </div>
            <button className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-xl text-xs font-bold transition-colors mt-4">
              Simpan Rincian Biaya
            </button>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}