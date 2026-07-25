"use client";

import { X, Sparkles, CheckCircle2, Zap } from "lucide-react";
import Link from "next/link";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  planType: "smart_buyer" | "investor_pro";
}

export default function UpgradeModal({ isOpen, onClose, planType }: UpgradeModalProps) {
  if (!isOpen) return null;

  const isInvestor = planType === "investor_pro";

  const title = isInvestor ? "Upgrade ke Investor Pro" : "Upgrade ke Smart Buyer";
  const subtitle = isInvestor 
    ? "Buka analisis keuangan tingkat institusional dan prediksi ROI mendalam untuk portofolio Anda."
    : "Nikmati proteksi pembelian menyeluruh, audit legalitas, dan analisis biaya tersembunyi.";
  
  const benefits = isInvestor ? [
    "ROI Calculator & Forecast 5 Tahun Real-time",
    "Market Trend & Perbandingan Regional",
    "Area Insight Pro & Rental Yield Tinggi",
    "AI Advisor Unlimited & Export Excel Lengkap"
  ] : [
    "Smart Decision Hub (Beli vs Sewa berbasis AI)",
    "Property Health Score & Audit Legalitas",
    "Hidden Cost Analyzer (Pajak & Notaris akurat)",
    "Negotiation Estimator & Property Passport PDF"
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#0B132B] border border-amber-500/30 rounded-3xl p-8 shadow-2xl overflow-hidden text-slate-100">
        
        {/* Aksen Background Glow Mewah */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Tombol Close */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors border border-slate-800"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Icon Header */}
        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-6">
          <Sparkles className="w-7 h-7" />
        </div>

        {/* Judul & Deskripsi */}
        <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20 inline-block mb-3">
          Eksklusif Realthink Elite
        </span>
        <h2 className="text-2xl font-bold font-heading text-white">{title}</h2>
        <p className="text-xs text-slate-300 mt-2 leading-relaxed">{subtitle}</p>

        {/* Daftar Manfaat Fitur */}
        <div className="my-6 space-y-3 bg-[#1C2541]/60 border border-slate-800 p-5 rounded-2xl">
          <p className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2">Manfaat Eksklusif:</p>
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-start gap-2.5 text-xs text-slate-200">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>{benefit}</span>
            </div>
          ))}
        </div>

        {/* Tombol Aksi */}
        <div className="space-y-3">
          <Link 
            href={`/api/checkout?plan=${planType}`}
            className="w-full py-3.5 px-4 rounded-xl bg-linear-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs hover:brightness-110 transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 text-center"
          >
            <Zap className="w-4 h-4 fill-slate-950" />
            Upgrade Sekarang
          </Link>

          <button 
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white font-medium text-xs transition-colors border border-slate-800 text-center"
          >
            Nanti Saja
          </button>
        </div>

      </div>
    </div>
  );
}