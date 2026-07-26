import Link from "next/link";
import { ShieldAlert, CheckCircle2, Zap } from "lucide-react";

export default function UpgradePage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 p-6 text-slate-100">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 p-8 text-center shadow-2xl">
        <div className="absolute top-0 left-0 h-1.5 w-full bg-linear-to-r from-amber-500 to-orange-500"></div>

        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-amber-500/20 bg-amber-500/10 text-amber-400">
          <ShieldAlert className="h-8 w-8" />
        </div>

        <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs font-bold tracking-widest text-amber-400 uppercase">
          Akses Terbatas
        </span>

        <h1 className="font-heading mt-4 text-2xl font-bold text-white">Upgrade ke Smart Buyer</h1>
        <p className="mt-2 text-xs leading-relaxed text-slate-400">
          Masa langganan Anda telah berakhir atau Anda belum berlangganan paket Smart Buyer untuk
          membuka analisis properti mendalam.
        </p>

        <div className="my-6 space-y-2.5 rounded-2xl border border-slate-800 bg-slate-950/60 p-4 text-left">
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
            <span>Property Health Score & Audit Legalitas</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
            <span>Hidden Cost Analyzer (Pajak & Notaris)</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
            <span>Negotiation Estimator Berbasis AI</span>
          </div>
        </div>

        <div className="space-y-3">
          <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-amber-500 to-orange-500 px-4 py-3 text-xs font-bold text-slate-950 shadow-lg shadow-amber-500/20 transition-opacity hover:opacity-95">
            <Zap className="h-4 w-4" />
            Berlangganan Rp79.000 / bulan
          </button>

          <Link
            href="/"
            className="block w-full rounded-xl bg-slate-800 px-4 py-2.5 text-xs font-medium text-slate-300 transition-colors hover:bg-slate-700"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
