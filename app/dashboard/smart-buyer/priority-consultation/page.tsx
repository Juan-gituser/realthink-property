import { RoleGuard } from "@/components/auth/RoleGuard";
import { Calendar, UserCheck } from "lucide-react";

export default function SmartBuyerPriorityConsultationPage() {
  return (
    <RoleGuard minRole="smart_buyer">
      <div className="space-y-6 max-w-5xl mx-auto p-6">
        <div>
          <span className="bg-blue-500/20 text-blue-400 text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full border border-blue-500/30 inline-block mb-3">Expert Access</span>
          <h1 className="text-3xl font-extrabold font-heading text-white">Priority Property Consultation</h1>
          <p className="text-xs text-slate-400 mt-1">Jadwalkan sesi konsultasi eksklusif 1-on-1 dengan agen properti senior dan konsultan hukum KPR.</p>
        </div>

        <div className="bg-[#1C2541]/70 border border-slate-800 p-8 rounded-3xl backdrop-blur-xl space-y-6 text-center">
          <div className="w-16 h-16 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center mx-auto text-blue-400">
            <UserCheck className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-white">Jadwal Konsultasi Tersedia</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">Sebagai Smart Buyer, Anda berhak mendapatkan 2 sesi konsultasi gratis per bulan dengan pakar real estate kami.</p>
          </div>
          <button className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-2 shadow-lg shadow-blue-600/20">
            <Calendar className="w-4 h-4" />
            <span>Pilih Jadwal Konsultasi</span>
          </button>
        </div>
      </div>
    </RoleGuard>
  );
}