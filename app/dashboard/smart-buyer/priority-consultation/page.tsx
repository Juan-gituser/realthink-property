import { RoleGuard } from "@/components/auth/RoleGuard";
import { Calendar, UserCheck } from "lucide-react";

export default function SmartBuyerPriorityConsultationPage() {
  return (
    <RoleGuard minRole="smart_buyer">
      <div className="mx-auto max-w-5xl space-y-6 p-6">
        <div>
          <span className="mb-3 inline-block rounded-full border border-blue-500/30 bg-blue-500/20 px-3 py-1 text-[10px] font-bold tracking-widest text-blue-400 uppercase">
            Expert Access
          </span>
          <h1 className="font-heading text-3xl font-extrabold text-white">
            Priority Property Consultation
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            Jadwalkan sesi konsultasi eksklusif 1-on-1 dengan agen properti senior dan konsultan
            hukum KPR.
          </p>
        </div>

        <div className="space-y-6 rounded-3xl border border-slate-800 bg-[#1C2541]/70 p-8 text-center backdrop-blur-xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-500/10 text-blue-400">
            <UserCheck className="h-8 w-8" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-white">Jadwal Konsultasi Tersedia</h3>
            <p className="mx-auto max-w-md text-xs text-slate-400">
              Sebagai Smart Buyer, Anda berhak mendapatkan 2 sesi konsultasi gratis per bulan dengan
              pakar real estate kami.
            </p>
          </div>
          <button className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-xs font-bold text-white shadow-lg shadow-blue-600/20 transition-colors hover:bg-blue-500">
            <Calendar className="h-4 w-4" />
            <span>Pilih Jadwal Konsultasi</span>
          </button>
        </div>
      </div>
    </RoleGuard>
  );
}
