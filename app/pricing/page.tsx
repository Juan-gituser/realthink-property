"use client";

import { useState } from "react";
import { Check, Shield, Zap, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annually">("monthly");

  const plans = [
    {
      id: "free",
      name: "Free Member",
      priceMonthly: "Rp 0",
      priceAnnually: "Rp 0",
      desc: "Cocok untuk pencari properti pemula.",
      icon: Shield,
      popular: false,
      buttonText: "Mulai Gratis",
      href: "/dashboard",
      features: [
        "Pencarian Properti Standar",
        "Simulasi KPR Dasar",
        "Simpan Favorit Terbatas",
        "Akses Artikel Properti",
      ],
    },
    {
      id: "smart_buyer",
      name: "Smart Buyer",
      priceMonthly: "Rp 79.000",
      priceAnnually: "Rp 790.000",
      desc: "Proteksi penuh dan audit legalitas properti.",
      icon: Zap,
      popular: true,
      buttonText: "Upgrade ke Smart Buyer",
      href: "/api/checkout?plan=smart_buyer&cycle=" + billingCycle,
      features: [
        "Semua Fitur Free",
        "Smart Decision Hub",
        "Property Health Score (Audit Legalitas)",
        "Hidden Cost Analyzer (Pajak & Notaris)",
        "Negotiation Estimator Berbasis AI",
        "Property Passport PDF",
      ],
    },
    {
      id: "investor_pro",
      name: "Investor Pro",
      priceMonthly: "Rp 249.000",
      priceAnnually: "Rp 2.490.000",
      desc: "Analisis keuangan mendalam tingkat institusional.",
      icon: TrendingUp,
      popular: false,
      buttonText: "Upgrade ke Investor Pro",
      href: "/api/checkout?plan=investor_pro&cycle=" + billingCycle,
      features: [
        "Semua Fitur Smart Buyer",
        "ROI Calculator & Forecast 5 Tahun",
        "Market Trend & Comparison Regional",
        "Area Insight Pro & Rental Yield",
        "Capital Gain Projection",
        "AI Advisor Unlimited & Export Excel",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-16 px-6">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <span className="bg-amber-500/10 text-amber-400 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-amber-500/20">
            Fleksibel & Transparan
          </span>
          <h1 className="text-4xl font-extrabold font-heading text-white">Pilih Paket Langganan Realthink</h1>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            Upgrade atau downgrade paket Anda kapan saja sesuai kebutuhan investasi dan pencarian properti Anda.
          </p>

          {/* Toggle Bulanan / Tahunan */}
          <div className="flex justify-center items-center gap-3 pt-4">
            <span className={`text-xs font-semibold ${billingCycle === "monthly" ? "text-white" : "text-slate-400"}`}>Bulanan</span>
            <button 
              onClick={() => setBillingCycle(billingCycle === "monthly" ? "annually" : "monthly")}
              className="w-14 h-8 bg-slate-800 rounded-full p-1 relative transition-colors border border-slate-700"
            >
              <div className={`w-6 h-6 bg-amber-500 rounded-full transition-transform ${billingCycle === "annually" ? "translate-x-6" : "translate-x-0"}`}></div>
            </button>
            <span className={`text-xs font-semibold ${billingCycle === "annually" ? "text-white" : "text-slate-400"}`}>
              Tahunan <span className="text-emerald-400 text-[10px] bg-emerald-500/10 px-1.5 py-0.5 rounded ml-1">Hemat 2 Bulan</span>
            </span>
          </div>
        </div>

        {/* Kartu Harga */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((p) => {
            const Icon = p.icon;
            return (
              <div 
                key={p.id}
                className={`relative rounded-3xl p-8 bg-slate-900/60 backdrop-blur-md border flex flex-col justify-between transition-all ${
                  p.popular ? "border-amber-500/50 shadow-xl shadow-amber-500/5" : "border-slate-800"
                }`}
              >
                {p.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-linear-to-r from-amber-500 to-orange-500 text-slate-950 text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full">
                    Paling Populer
                  </span>
                )}
                
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-6">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white">{p.name}</h3>
                  <p className="text-xs text-slate-400 mt-1">{p.desc}</p>
                  
                  <div className="my-6">
                    <span className="text-3xl font-extrabold text-white">
                      {billingCycle === "monthly" ? p.priceMonthly : p.priceAnnually}
                    </span>
                    <span className="text-xs text-slate-400"> / {billingCycle === "monthly" ? "bulan" : "tahun"}</span>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-slate-800/80">
                    {p.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8">
                  <Link
                    href={p.href}
                    className={`block w-full py-3 text-center rounded-xl font-bold text-xs transition-all ${
                      p.popular 
                        ? "bg-linear-to-r from-amber-500 to-orange-500 text-slate-950 hover:opacity-95 shadow-lg shadow-amber-500/20" 
                        : "bg-slate-800 hover:bg-slate-700 text-white"
                    }`}
                  >
                    {p.buttonText}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Tabel Komparasi Fitur Lengkap */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 overflow-x-auto">
          <h2 className="text-xl font-bold text-white mb-6">Perbandingan Detail Fitur</h2>
          <table className="w-full text-left border-collapse min-w-150[600px]">
            <thead>
              <tr className="border-b border-slate-800 text-xs text-slate-400">
                <th className="py-3 px-4">Fitur Utama</th>
                <th className="py-3 px-4">Free Member</th>
                <th className="py-3 px-4">Smart Buyer</th>
                <th className="py-3 px-4">Investor Pro</th>
              </tr>
            </thead>
            <tbody className="text-xs divide-y divide-slate-800/60 text-slate-300">
              <tr>
                <td className="py-3.5 px-4 font-medium text-white">Audit Legalitas & Health Score</td>
                <td className="py-3.5 px-4 text-slate-500">-</td>
                <td className="py-3.5 px-4 text-emerald-400 font-bold">✔</td>
                <td className="py-3.5 px-4 text-emerald-400 font-bold">✔</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-medium text-white">Hidden Cost & Pajak Analisis</td>
                <td className="py-3.5 px-4 text-slate-500">-</td>
                <td className="py-3.5 px-4 text-emerald-400 font-bold">✔</td>
                <td className="py-3.5 px-4 text-emerald-400 font-bold">✔</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-medium text-white">ROI Forecast & Tren Pasar 5 Tahun</td>
                <td className="py-3.5 px-4 text-slate-500">-</td>
                <td className="py-3.5 px-4 text-slate-500">-</td>
                <td className="py-3.5 px-4 text-emerald-400 font-bold">✔</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-medium text-white">AI Property Advisor</td>
                <td className="py-3.5 px-4 text-slate-500">Dasar</td>
                <td className="py-3.5 px-4 text-slate-300">Standar</td>
                <td className="py-3.5 px-4 text-emerald-400 font-bold">Unlimited</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-medium text-white">Export Excel & PDF Laporan</td>
                <td className="py-3.5 px-4 text-slate-500">-</td>
                <td className="py-3.5 px-4 text-slate-500">PDF Saja</td>
                <td className="py-3.5 px-4 text-emerald-400 font-bold">PDF & Excel Lengkap</td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}