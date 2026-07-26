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
    <div className="min-h-screen bg-slate-950 px-6 py-16 text-slate-100">
      <div className="mx-auto max-w-6xl space-y-12">
        {/* Header */}
        <div className="space-y-4 text-center">
          <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs font-bold tracking-widest text-amber-400 uppercase">
            Fleksibel & Transparan
          </span>
          <h1 className="font-heading text-4xl font-extrabold text-white">
            Pilih Paket Langganan Realthink
          </h1>
          <p className="mx-auto max-w-xl text-sm text-slate-400">
            Upgrade atau downgrade paket Anda kapan saja sesuai kebutuhan investasi dan pencarian
            properti Anda.
          </p>

          {/* Toggle Bulanan / Tahunan */}
          <div className="flex items-center justify-center gap-3 pt-4">
            <span
              className={`text-xs font-semibold ${billingCycle === "monthly" ? "text-white" : "text-slate-400"}`}
            >
              Bulanan
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === "monthly" ? "annually" : "monthly")}
              className="relative h-8 w-14 rounded-full border border-slate-700 bg-slate-800 p-1 transition-colors"
            >
              <div
                className={`h-6 w-6 rounded-full bg-amber-500 transition-transform ${billingCycle === "annually" ? "translate-x-6" : "translate-x-0"}`}
              ></div>
            </button>
            <span
              className={`text-xs font-semibold ${billingCycle === "annually" ? "text-white" : "text-slate-400"}`}
            >
              Tahunan{" "}
              <span className="ml-1 rounded bg-emerald-500/10 px-1.5 py-0.5 text-[10px] text-emerald-400">
                Hemat 2 Bulan
              </span>
            </span>
          </div>
        </div>

        {/* Kartu Harga */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {plans.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.id}
                className={`relative flex flex-col justify-between rounded-3xl border bg-slate-900/60 p-8 backdrop-blur-md transition-all ${
                  p.popular
                    ? "border-amber-500/50 shadow-xl shadow-amber-500/5"
                    : "border-slate-800"
                }`}
              >
                {p.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-linear-to-r from-amber-500 to-orange-500 px-3 py-1 text-[10px] font-extrabold tracking-widest text-slate-950 uppercase">
                    Paling Populer
                  </span>
                )}

                <div>
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-amber-500/20 bg-amber-500/10 text-amber-400">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white">{p.name}</h3>
                  <p className="mt-1 text-xs text-slate-400">{p.desc}</p>

                  <div className="my-6">
                    <span className="text-3xl font-extrabold text-white">
                      {billingCycle === "monthly" ? p.priceMonthly : p.priceAnnually}
                    </span>
                    <span className="text-xs text-slate-400">
                      {" "}
                      / {billingCycle === "monthly" ? "bulan" : "tahun"}
                    </span>
                  </div>

                  <div className="space-y-3 border-t border-slate-800/80 pt-4">
                    {p.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8">
                  <Link
                    href={p.href}
                    className={`block w-full rounded-xl py-3 text-center text-xs font-bold transition-all ${
                      p.popular
                        ? "bg-linear-to-r from-amber-500 to-orange-500 text-slate-950 shadow-lg shadow-amber-500/20 hover:opacity-95"
                        : "bg-slate-800 text-white hover:bg-slate-700"
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
        <div className="overflow-x-auto rounded-3xl border border-slate-800 bg-slate-900/60 p-8">
          <h2 className="mb-6 text-xl font-bold text-white">Perbandingan Detail Fitur</h2>
          <table className="min-w-150[600px] w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-800 text-xs text-slate-400">
                <th className="px-4 py-3">Fitur Utama</th>
                <th className="px-4 py-3">Free Member</th>
                <th className="px-4 py-3">Smart Buyer</th>
                <th className="px-4 py-3">Investor Pro</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs text-slate-300">
              <tr>
                <td className="px-4 py-3.5 font-medium text-white">
                  Audit Legalitas & Health Score
                </td>
                <td className="px-4 py-3.5 text-slate-500">-</td>
                <td className="px-4 py-3.5 font-bold text-emerald-400">✔</td>
                <td className="px-4 py-3.5 font-bold text-emerald-400">✔</td>
              </tr>
              <tr>
                <td className="px-4 py-3.5 font-medium text-white">Hidden Cost & Pajak Analisis</td>
                <td className="px-4 py-3.5 text-slate-500">-</td>
                <td className="px-4 py-3.5 font-bold text-emerald-400">✔</td>
                <td className="px-4 py-3.5 font-bold text-emerald-400">✔</td>
              </tr>
              <tr>
                <td className="px-4 py-3.5 font-medium text-white">
                  ROI Forecast & Tren Pasar 5 Tahun
                </td>
                <td className="px-4 py-3.5 text-slate-500">-</td>
                <td className="px-4 py-3.5 text-slate-500">-</td>
                <td className="px-4 py-3.5 font-bold text-emerald-400">✔</td>
              </tr>
              <tr>
                <td className="px-4 py-3.5 font-medium text-white">AI Property Advisor</td>
                <td className="px-4 py-3.5 text-slate-500">Dasar</td>
                <td className="px-4 py-3.5 text-slate-300">Standar</td>
                <td className="px-4 py-3.5 font-bold text-emerald-400">Unlimited</td>
              </tr>
              <tr>
                <td className="px-4 py-3.5 font-medium text-white">Export Excel & PDF Laporan</td>
                <td className="px-4 py-3.5 text-slate-500">-</td>
                <td className="px-4 py-3.5 text-slate-500">PDF Saja</td>
                <td className="px-4 py-3.5 font-bold text-emerald-400">PDF & Excel Lengkap</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
