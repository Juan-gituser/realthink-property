import Link from "next/link";
import { ShieldAlert, CheckCircle2, Zap } from "lucide-react";

export default function UpgradePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-linear-to-r from-amber-500 to-orange-500"></div>
        
        <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <span className="text-xs font-bold uppercase tracking-widest text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
          Akses Terbatas
        </span>

        <h1 className="text-2xl font-bold font-heading text-white mt-4">Upgrade ke Smart Buyer</h1>
        <p className="text-xs text-slate-400 mt-2 leading-relaxed">
          Masa langganan Anda telah berakhir atau Anda belum berlangganan paket Smart Buyer untuk membuka analisis properti mendalam.
        </p>

        <div className="my-6 p-4 bg-slate-950/60 rounded-2xl border border-slate-800 text-left space-y-2.5">
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Property Health Score & Audit Legalitas</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Hidden Cost Analyzer (Pajak & Notaris)</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Negotiation Estimator Berbasis AI</span>
          </div>
        </div>

        <div className="space-y-3">
          <button className="w-full py-3 px-4 rounded-xl bg-linear-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-xs hover:opacity-95 transition-opacity shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2">
            <Zap className="w-4 h-4" />
            Berlangganan Rp79.000 / bulan
          </button>
          
          <Link 
            href="/" 
            className="block w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs transition-colors"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}