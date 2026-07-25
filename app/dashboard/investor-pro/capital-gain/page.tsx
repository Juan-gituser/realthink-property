import { RoleGuard } from "@/components/auth/RoleGuard";
import { TrendingUp, DollarSign, Calendar } from "lucide-react";

export default function CapitalGainPage() {
  return (
    <RoleGuard minRole="investor_pro">
      <div className="space-y-6 max-w-6xl mx-auto p-6">
        <div>
          <span className="bg-indigo-500/20 text-indigo-400 text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full border border-indigo-500/30 inline-block mb-3">Portfolio Valuation</span>
          <h1 className="text-3xl font-extrabold font-heading text-white">Capital Gain Projections</h1>
          <p className="text-xs text-slate-400 mt-1">Estimasi kenaikan nilai aset properti Anda dalam jangka panjang berdasarkan tren historis kawasan.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#1C2541]/70 border border-slate-800 p-6 rounded-3xl backdrop-blur-xl space-y-4">
            <h3 className="text-sm font-bold text-white">Simulasi Proyeksi 5 Tahun</h3>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between p-3 bg-slate-950/50 rounded-xl border border-slate-800">
                <span className="text-slate-400">Nilai Awal Pembelian</span>
                <span className="text-white font-bold">Rp 2.500.000.000</span>
              </div>
              <div className="flex justify-between p-3 bg-slate-950/50 rounded-xl border border-slate-800">
                <span className="text-slate-400">Proyeksi Nilai Tahun ke-5</span>
                <span className="text-emerald-400 font-bold">Rp 4.150.000.000</span>
              </div>
              <div className="flex justify-between p-3 bg-slate-950/50 rounded-xl border border-slate-800">
                <span className="text-slate-400">Estimasi Total Keuntungan</span>
                <span className="text-indigo-400 font-bold">+Rp 1.650.000.000 (66%)</span>
              </div>
            </div>
          </div>

          <div className="bg-[#1C2541]/70 border border-slate-800 p-6 rounded-3xl backdrop-blur-xl flex flex-col justify-between">
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-white">Faktor Pendorong Utama</h3>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2">✓ Pembangunan infrastruktur LRT/MRT tahap berikutnya</li>
                <li className="flex items-center gap-2">✓ Peningkatan komersial area sekitar 30%</li>
                <li className="flex items-center gap-2">✓ Tingkat suplai tanah kosong yang semakin menipis</li>
              </ul>
            </div>
            <button className="mt-6 w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl text-xs font-bold transition-colors">
              Unduh Laporan Valuasi Lengkap
            </button>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}