import { RoleGuard } from "@/components/auth/RoleGuard";
import { TrendingUp, DollarSign, Calendar } from "lucide-react";

export default function CapitalGainPage() {
  return (
    <RoleGuard minRole="investor_pro">
      <div className="mx-auto max-w-6xl space-y-6 p-6">
        <div>
          <span className="mb-3 inline-block rounded-full border border-indigo-500/30 bg-indigo-500/20 px-3 py-1 text-[10px] font-bold tracking-widest text-indigo-400 uppercase">
            Portfolio Valuation
          </span>
          <h1 className="font-heading text-3xl font-extrabold text-white">
            Capital Gain Projections
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            Estimasi kenaikan nilai aset properti Anda dalam jangka panjang berdasarkan tren
            historis kawasan.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-4 rounded-3xl border border-slate-800 bg-[#1C2541]/70 p-6 backdrop-blur-xl">
            <h3 className="text-sm font-bold text-white">Simulasi Proyeksi 5 Tahun</h3>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between rounded-xl border border-slate-800 bg-slate-950/50 p-3">
                <span className="text-slate-400">Nilai Awal Pembelian</span>
                <span className="font-bold text-white">Rp 2.500.000.000</span>
              </div>
              <div className="flex justify-between rounded-xl border border-slate-800 bg-slate-950/50 p-3">
                <span className="text-slate-400">Proyeksi Nilai Tahun ke-5</span>
                <span className="font-bold text-emerald-400">Rp 4.150.000.000</span>
              </div>
              <div className="flex justify-between rounded-xl border border-slate-800 bg-slate-950/50 p-3">
                <span className="text-slate-400">Estimasi Total Keuntungan</span>
                <span className="font-bold text-indigo-400">+Rp 1.650.000.000 (66%)</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-between rounded-3xl border border-slate-800 bg-[#1C2541]/70 p-6 backdrop-blur-xl">
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-white">Faktor Pendorong Utama</h3>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  ✓ Pembangunan infrastruktur LRT/MRT tahap berikutnya
                </li>
                <li className="flex items-center gap-2">
                  ✓ Peningkatan komersial area sekitar 30%
                </li>
                <li className="flex items-center gap-2">
                  ✓ Tingkat suplai tanah kosong yang semakin menipis
                </li>
              </ul>
            </div>
            <button className="mt-6 w-full rounded-xl bg-indigo-600 py-3 text-xs font-bold text-white transition-colors hover:bg-indigo-500">
              Unduh Laporan Valuasi Lengkap
            </button>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}
