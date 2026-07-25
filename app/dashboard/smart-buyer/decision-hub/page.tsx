import { RoleGuard } from "@/components/auth/RoleGuard";
import { Compass, CheckSquare, ArrowRight } from "lucide-react";

export default function SmartBuyerDecisionHubPage() {
  return (
    <RoleGuard minRole="smart_buyer">
      <div className="space-y-6 max-w-5xl mx-auto p-6">
        <div>
          <span className="bg-blue-500/20 text-blue-400 text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full border border-blue-500/30 inline-block mb-3">Decision Center</span>
          <h1 className="text-3xl font-extrabold font-heading text-white">Smart Buyer Decision Hub</h1>
          <p className="text-xs text-slate-400 mt-1">Panduan langkah demi langkah dan checklist kesiapan finansial sebelum Anda memutuskan membeli rumah.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#1C2541]/70 border border-slate-800 p-6 rounded-3xl backdrop-blur-xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-blue-400" /> Checklist Kesiapan Membeli
            </h3>
            <div className="space-y-2 text-xs text-slate-300">
              <label className="flex items-center gap-2 p-2.5 bg-slate-950/50 rounded-xl border border-slate-800 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded accent-blue-600" />
                <span>Dana Darurat Terkumpul (Minimal 6x pengeluaran)</span>
              </label>
              <label className="flex items-center gap-2 p-2.5 bg-slate-950/50 rounded-xl border border-slate-800 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded accent-blue-600" />
                <span>DP & Biaya Lainnya (BPHTB, Notaris) Siap</span>
              </label>
              <label className="flex items-center gap-2 p-2.5 bg-slate-950/50 rounded-xl border border-slate-800 cursor-pointer">
                <input type="checkbox" className="rounded accent-blue-600" />
                <span>Skor BI Checking / SLIK OJK Bersih</span>
              </label>
            </div>
          </div>

          <div className="bg-[#1C2541]/70 border border-slate-800 p-6 rounded-3xl backdrop-blur-xl flex flex-col justify-between">
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-white">Rekomendasi Keputusan AI</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Berdasarkan profil finansial Anda saat ini, Anda berada di jalur yang tepat untuk mengambil KPR dengan plafon hingga <strong className="text-emerald-400">Rp 1.5 Miliar</strong> dengan cicilan aman 30% dari penghasilan bulanan.
              </p>
            </div>
            <button className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl text-xs font-bold transition-colors mt-6 flex items-center justify-center gap-2">
              <span>Mulai Simulasi KPR Lanjutan</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}