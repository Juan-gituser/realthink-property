import { RoleGuard } from "@/components/auth/RoleGuard";
import { Handshake } from "lucide-react";

export default function SmartBuyerNegotiationPage() {
  return (
    <RoleGuard minRole="smart_buyer">
      <div className="mx-auto max-w-5xl space-y-6 p-6">
        <div>
          <span className="mb-3 inline-block rounded-full border border-blue-500/30 bg-blue-500/20 px-3 py-1 text-[10px] font-bold tracking-widest text-blue-400 uppercase">
            Strategy Guide
          </span>
          <h1 className="font-heading text-3xl font-extrabold text-white">
            Smart Negotiation Assistant
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            Dapatkan skrip negosiasi harga terbaik dan analisis nilai wajar pasaran sebelum menawar
            properti.
          </p>
        </div>

        <div className="space-y-4 rounded-3xl border border-slate-800 bg-[#1C2541]/70 p-6 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-blue-500/20 bg-blue-500/10 p-3 text-blue-400">
              <Handshake className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Rekomendasi Penawaran Aman</h3>
              <p className="text-xs text-slate-400">
                Berdasarkan data transaksi terakhir di area ini, penawaran wajar adalah{" "}
                <strong className="text-emerald-400">88% - 92%</strong> dari harga buka pemilik.
              </p>
            </div>
          </div>
          <div className="space-y-2 rounded-2xl border border-slate-800 bg-slate-950/50 p-4 text-xs">
            <span className="block font-bold text-blue-400">Contoh Skrip Pesan Penawaran:</span>
            <p className="text-slate-300 italic">
              &quot;Halo, saya berminat dengan unit di [Nama Perumahan]. Berdasarkan hasil cek pasaran
              dan kesiapan dana cash/KPR pre-approved, apakah berkenan di angka [Harga Penawaran]?&quot;
            </p>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}