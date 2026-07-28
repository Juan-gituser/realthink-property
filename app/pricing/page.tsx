"use client";

import { useState } from "react";
import { Check, Shield, Zap, Sparkles } from "lucide-react";
import Link from "next/link";

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annually">("monthly");

  const plans = [
    {
      id: "free",
      name: "Free Member",
      priceMonthly: "Rp 0",
      priceAnnually: "Rp 0",
      desc: "Cocok untuk pencari properti pemula yang baru mulai mencari tempat tinggal.",
      icon: Shield,
      popular: false,
      buttonText: "Mulai Gratis",
      href: "/dashboard",
      features: [
        "Pencarian Properti Standar",
        "Simulasi KPR Dasar",
        "Simpan Favorit Terbatas",
        "Akses Artikel & Edukasi Properti",
      ],
    },
    {
      id: "smart_buyer",
      name: "Smart Buyer",
      priceMonthly: "Rp 79.000",
      priceAnnually: "Rp 790.000",
      desc: "Proteksi penuh legalitas dan transparansi total biaya pembeli.",
      icon: Zap,
      popular: true,
      buttonText: "Upgrade ke Smart Buyer",
      href: `/api/checkout?plan=smart_buyer&cycle=${billingCycle}`,
      features: [
        "Semua Fitur Free Member",
        "Smart Decision Hub",
        "Property Health Score (Audit Legalitas)",
        "Hidden Cost Analyzer (Estimasi Pajak & Notaris)",
        "Negotiation Estimator Berbasis AI",
        "Property Passport PDF Report",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-16 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-12">
        {/* Header */}
        <div className="space-y-4 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3.5 py-1 text-xs font-bold tracking-widest text-amber-700 uppercase">
            <Sparkles className="h-3.5 w-3.5 text-amber-600" /> Transparan & Tanpa Biaya Tersembunyi
          </span>
          <h1 className="font-heading text-3xl font-extrabold text-slate-900 sm:text-4xl md:text-5xl">
            Pilih Paket Solusi Properti Anda
          </h1>
          <p className="mx-auto max-w-2xl text-sm text-slate-600 md:text-base">
            Gunakan tools analisis cerdas untuk membantu Anda membeli rumah idaman tanpa ragu dan terhindar dari potensi masalah legalitas.
          </p>

          {/* Toggle Bulanan / Tahunan */}
          <div className="flex items-center justify-center gap-3 pt-6">
            <span
              className={`text-xs font-semibold sm:text-sm ${
                billingCycle === "monthly" ? "text-slate-900" : "text-slate-500"
              }`}
            >
              Bulanan
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === "monthly" ? "annually" : "monthly")}
              className="relative h-8 w-14 cursor-pointer rounded-full border border-slate-300 bg-slate-200 p-1 transition-colors"
              aria-label="Toggle Siklus Pembayaran"
            >
              <div
                className={`h-6 w-6 rounded-full bg-amber-600 shadow-md transition-transform ${
                  billingCycle === "annually" ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
            <span
              className={`text-xs font-semibold sm:text-sm ${
                billingCycle === "annually" ? "text-slate-900" : "text-slate-500"
              }`}
            >
              Tahunan{" "}
              <span className="ml-1 rounded-md border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                Hemat 2 Bulan
              </span>
            </span>
          </div>
        </div>

        {/* Kartu Harga */}
        <div className="mx-auto grid max-w-3xl grid-cols-1 gap-8 md:grid-cols-2">
          {plans.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.id}
                className={`relative flex flex-col justify-between rounded-3xl border bg-white p-8 shadow-xs transition-all duration-300 hover:shadow-md ${
                  p.popular
                    ? "border-amber-500 shadow-amber-500/10 ring-2 ring-amber-500/20"
                    : "border-slate-200"
                }`}
              >
                {p.popular && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-linear-to-r from-amber-500 to-amber-600 px-3.5 py-1 text-[10px] font-extrabold tracking-widest text-white uppercase shadow-md">
                    Paling Populer Pembeli
                  </span>
                )}

                <div>
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-amber-200 bg-amber-50 text-amber-600">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">{p.name}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-600">{p.desc}</p>

                  <div className="my-6">
                    <span className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
                      {billingCycle === "monthly" ? p.priceMonthly : p.priceAnnually}
                    </span>
                    <span className="text-xs text-slate-500">
                      {" "}
                      / {billingCycle === "monthly" ? "bulan" : "tahun"}
                    </span>
                  </div>

                  <div className="space-y-3 border-t border-slate-100 pt-6">
                    {p.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-3 text-xs text-slate-700">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                        <span className="leading-tight">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-4">
                  <Link
                    href={p.href}
                    className={`block w-full rounded-xl py-3 text-center text-xs font-bold transition-all ${
                      p.popular
                        ? "bg-linear-to-r from-amber-500 to-amber-600 text-white shadow-md hover:opacity-95"
                        : "bg-slate-900 text-white hover:bg-slate-800"
                    }`}
                  >
                    {p.buttonText}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Tabel Komparasi Fitur */}
        <div className="mx-auto max-w-3xl overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-xs sm:p-8">
          <h2 className="mb-6 text-xl font-bold text-slate-900">Perbandingan Fitur Pengguna</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-200 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <th className="px-4 py-3">Fitur Utama</th>
                  <th className="px-4 py-3 text-center">Free Member</th>
                  <th className="px-4 py-3 text-center">Smart Buyer</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                <tr>
                  <td className="px-4 py-4 font-medium text-slate-900">
                    Audit Legalitas & Health Score Properti
                  </td>
                  <td className="px-4 py-4 text-center text-slate-400">-</td>
                  <td className="px-4 py-4 text-center font-bold text-emerald-600">✔ (Lengkap)</td>
                </tr>
                <tr>
                  <td className="px-4 py-4 font-medium text-slate-900">Hidden Cost & Estimasi Biaya Pajak/Notaris</td>
                  <td className="px-4 py-4 text-center text-slate-400">-</td>
                  <td className="px-4 py-4 text-center font-bold text-emerald-600">✔</td>
                </tr>
                <tr>
                  <td className="px-4 py-4 font-medium text-slate-900">Negotiation Estimator AI</td>
                  <td className="px-4 py-4 text-center text-slate-400">-</td>
                  <td className="px-4 py-4 text-center font-bold text-emerald-600">✔</td>
                </tr>
                <tr>
                  <td className="px-4 py-4 font-medium text-slate-900">AI Property Advisor</td>
                  <td className="px-4 py-4 text-center text-slate-500">Dasar (3x/hari)</td>
                  <td className="px-4 py-4 text-center font-bold text-emerald-600">Lengkap (20x/hari)</td>
                </tr>
                <tr>
                  <td className="px-4 py-4 font-medium text-slate-900">Export Format Laporan</td>
                  <td className="px-4 py-4 text-center text-slate-400">-</td>
                  <td className="px-4 py-4 text-center font-bold text-emerald-600">PDF Passport Report</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}