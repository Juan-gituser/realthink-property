import { RoleGuard } from "@/components/auth/RoleGuard";
import { Compass, CheckSquare, ArrowRight } from "lucide-react";

export default function SmartBuyerDecisionHubPage() {
  return (
    <RoleGuard minRole="smart_buyer">
      <div className="mx-auto max-w-5xl space-y-6 p-6">
        <div>
          <span className="mb-3 inline-block rounded-full border border-blue-500/30 bg-blue-500/20 px-3 py-1 text-[10px] font-bold tracking-widest text-blue-400 uppercase">
            Decision Center
          </span>
          <h1 className="font-heading text-3xl font-extrabold text-white">
            Smart Buyer Decision Hub
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            Panduan langkah demi langkah dan checklist kesiapan finansial sebelum Anda memutuskan
            membeli rumah.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-4 rounded-3xl border border-slate-800 bg-[#1C2541]/70 p-6 backdrop-blur-xl">
            <h3 className="flex items-center gap-2 text-sm font-bold text-white">
              <CheckSquare className="h-4 w-4 text-blue-400" /> Checklist Kesiapan Membeli
            </h3>
            <div className="space-y-2 text-xs text-slate-300">
              <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-800 bg-slate-950/50 p-2.5">
                <input type="checkbox" defaultChecked className="rounded accent-blue-600" />
                <span>Dana Darurat Terkumpul (Minimal 6x pengeluaran)</span>
              </label>
              <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-800 bg-slate-950/50 p-2.5">
                <input type="checkbox" defaultChecked className="rounded accent-blue-600" />
                <span>DP & Biaya Lainnya (BPHTB, Notaris) Siap</span>
              </label>
              <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-800 bg-slate-950/50 p-2.5">
                <input type="checkbox" className="rounded accent-blue-600" />
                <span>Skor BI Checking / SLIK OJK Bersih</span>
              </label>
            </div>
          </div>

          <div className="flex flex-col justify-between rounded-3xl border border-slate-800 bg-[#1C2541]/70 p-6 backdrop-blur-xl">
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-white">Rekomendasi Keputusan AI</h3>
              <p className="text-xs leading-relaxed text-slate-300">
                Berdasarkan profil finansial Anda saat ini, Anda berada di jalur yang tepat untuk
                mengambil KPR dengan plafon hingga{" "}
                <strong className="text-emerald-400">Rp 1.5 Miliar</strong> dengan cicilan aman 30%
                dari penghasilan bulanan.
              </p>
            </div>
            <button className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-xs font-bold text-white transition-colors hover:bg-blue-500">
              <span>Mulai Simulasi KPR Lanjutan</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}
