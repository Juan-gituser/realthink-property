import { RoleGuard } from "@/components/auth/RoleGuard";
import { Handshake, MessageSquare } from "lucide-react";

export default function SmartBuyerNegotiationPage() {
  return (
    <RoleGuard minRole="smart_buyer">
      <div className="space-y-6 max-w-5xl mx-auto p-6">
        <div>
          <span className="bg-blue-500/20 text-blue-400 text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full border border-blue-500/30 inline-block mb-3">Strategy Guide</span>
          <h1 className="text-3xl font-extrabold font-heading text-white">Smart Negotiation Assistant</h1>
          <p className="text-xs text-slate-400 mt-1">Dapatkan skrip negosiasi harga terbaik dan analisis nilai wajar pasaran sebelum menawar properti.</p>
        </div>

        <div className="bg-[#1C2541]/70 border border-slate-800 p-6 rounded-3xl backdrop-blur-xl space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-2xl text-blue-400">
              <Handshake className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Rekomendasi Penawaran Aman</h3>
              <p className="text-xs text-slate-400">Berdasarkan data transaksi terakhir di area ini, penawaran wajar adalah <strong className="text-emerald-400">88% - 92%</strong> dari harga buka pemilik.</p>
            </div>
          </div>
          <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs">
            <span className="text-blue-400 font-bold block">Contoh Skrip Pesan Penawaran:</span>
            <p className="text-slate-300 italic">"Halo, saya berminat dengan unit di [Nama Perumahan]. Berdasarkan hasil cek pasaran dan kesiapan dana cash/KPR pre-approved, apakah berkenan di angka [Harga Penawaran]?"</p>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}