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

  const benefits = isInvestor
    ? [
        "ROI Calculator & Forecast 5 Tahun Real-time",
        "Market Trend & Perbandingan Regional",
        "Area Insight Pro & Rental Yield Tinggi",
        "AI Advisor Unlimited & Export Excel Lengkap",
      ]
    : [
        "Smart Decision Hub (Beli vs Sewa berbasis AI)",
        "Property Health Score & Audit Legalitas",
        "Hidden Cost Analyzer (Pajak & Notaris akurat)",
        "Negotiation Estimator & Property Passport PDF",
      ];

  return (
    <div className="animate-fadeIn fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-amber-500/30 bg-[#0B132B] p-8 text-slate-100 shadow-2xl">
        {/* Aksen Background Glow Mewah */}
        <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl"></div>

        {/* Tombol Close */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 rounded-xl border border-slate-800 bg-slate-900/80 p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Icon Header */}
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-500/30 bg-amber-500/10 text-amber-400">
          <Sparkles className="h-7 w-7" />
        </div>

        {/* Judul & Deskripsi */}
        <span className="mb-3 inline-block rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-[10px] font-bold tracking-widest text-amber-400 uppercase">
          Eksklusif Realthink Elite
        </span>
        <h2 className="font-heading text-2xl font-bold text-white">{title}</h2>
        <p className="mt-2 text-xs leading-relaxed text-slate-300">{subtitle}</p>

        {/* Daftar Manfaat Fitur */}
        <div className="my-6 space-y-3 rounded-2xl border border-slate-800 bg-[#1C2541]/60 p-5">
          <p className="mb-2 text-xs font-semibold tracking-wider text-amber-400 uppercase">
            Manfaat Eksklusif:
          </p>
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-start gap-2.5 text-xs text-slate-200">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
              <span>{benefit}</span>
            </div>
          ))}
        </div>

        {/* Tombol Aksi */}
        <div className="space-y-3">
          <Link
            href={`/api/checkout?plan=${planType}`}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-amber-500 to-amber-600 px-4 py-3.5 text-center text-xs font-bold text-slate-950 shadow-lg shadow-amber-500/20 transition-all hover:brightness-110"
          >
            <Zap className="h-4 w-4 fill-slate-950" />
            Upgrade Sekarang
          </Link>

          <button
            onClick={onClose}
            className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-center text-xs font-medium text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
          >
            Nanti Saja
          </button>
        </div>
      </div>
    </div>
  );
}
