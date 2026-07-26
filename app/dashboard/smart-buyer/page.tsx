"use client";

import Link from "next/link";
import {
  Compass,
  Activity,
  Target,
  Calculator,
  FileSearch,
  Bell,
  Scale,
  Sparkles,
  MessageSquareCheck,
  ArrowRight,
  ShieldCheck,
  Crown,
} from "lucide-react";

const SMART_BUYER_FEATURES = [
  {
    title: "Smart Decision Hub",
    description: "Matriks keputusan strategis beli vs sewa berbasis kecerdasan buatan.",
    icon: Compass,
    href: "/dashboard/smart-buyer/decision-hub",
    badge: "AI Core",
  },
  {
    title: "Property Health Score",
    description: "Audit mendalam legalitas, struktur fisik, & reputasi pengembang properti.",
    icon: Activity,
    href: "/dashboard/smart-buyer/health-score",
    badge: "Audit VIP",
  },
  {
    title: "Negotiation Estimator",
    description: "Rekomendasi harga wajar dan limit penawaran optimal berbasis data pasar.",
    icon: Target,
    href: "/dashboard/smart-buyer/negotiation",
    badge: "Smart Tool",
  },
  {
    title: "Hidden Cost Analyzer",
    description: "Kalkulasi transparan total pajak, BPHTB, biaya KPR, & notaris akurat.",
    icon: Calculator,
    href: "/dashboard/smart-buyer/hidden-cost",
    badge: "Finansial",
  },
  {
    title: "Property Passport",
    description: "Unduh laporan komprehensif profil properti pilihan berformat dokumen eksekutif.",
    icon: FileSearch,
    href: "/dashboard/smart-buyer/passport",
    badge: "Dokumen",
  },
  {
    title: "Price Alert System",
    description: "Sistem pemantauan dan notifikasi otomatis saat harga target properti turun.",
    icon: Bell,
    href: "/dashboard/smart-buyer/price-alert",
    badge: "Real-time",
  },
  {
    title: "Smart Compare Pro",
    description: "Komparasi head-to-head multi-properti dengan matriks investasi mendalam.",
    icon: Scale,
    href: "/dashboard/smart-buyer/compare-pro",
    badge: "Pro Matrix",
  },
  {
    title: "AI Property Advisor",
    description: "Konsultasi privat interaktif dengan asisten virtual ahli properti cerdas.",
    icon: Sparkles,
    href: "/dashboard/smart-buyer/ai-advisor",
    badge: "AI Expert",
  },
  {
    title: "Priority Consultation",
    description: "Akses jalur prioritas langsung terhubung dengan konsultan properti senior.",
    icon: MessageSquareCheck,
    href: "/dashboard/smart-buyer/priority-consultation",
    badge: "VIP Service",
  },
];

export default function SmartBuyerDashboardPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-8 pb-12">
      {/* Banner / Hero Section Eksklusif (Diperbaiki agar konsisten gelap & elegan) */}
      <div className="border-secondary/40 relative overflow-hidden rounded-3xl border bg-slate-950 p-8 shadow-2xl shadow-black/50 sm:p-10">
        {/* Efek cahaya ambient */}
        <div className="bg-secondary/15 pointer-events-none absolute -top-12 -right-12 h-72 w-72 rounded-full blur-3xl" />
        <div className="bg-primary/20 pointer-events-none absolute -bottom-10 left-1/3 h-64 w-64 rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div className="max-w-2xl space-y-3">
            <div className="bg-secondary/20 border-secondary/40 text-secondary inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-bold tracking-wider uppercase backdrop-blur-md">
              <Crown className="h-3.5 w-3.5" /> Realthink Elite Membership Active
            </div>
            <h1 className="font-heading text-2xl font-extrabold tracking-tight text-white sm:text-4xl">
              Smart Buyer Command Center
            </h1>
            <p className="text-sm leading-relaxed text-slate-300 sm:text-base">
              Anda memiliki akses penuh ke seluruh ekosistem alat analisis properti mendalam,
              proteksi pembelian bebas risiko, audit legalitas, dan estimasi biaya tersembunyi
              tingkat lanjut.
            </p>
          </div>

          <div className="flex shrink-0 flex-col items-start gap-3 sm:flex-row sm:items-center">
            <div className="border-secondary/30 flex items-center gap-3.5 rounded-2xl border bg-slate-900/80 px-5 py-3.5 shadow-xl backdrop-blur-md">
              <div className="bg-secondary/20 text-secondary border-secondary/20 rounded-xl border p-2.5">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                  Status Proteksi
                </p>
                <p className="text-xs font-bold text-white">Full Verified & Secure</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section Header */}
      <div className="border-border/60 flex flex-col justify-between gap-4 border-b pb-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="font-heading text-foreground flex items-center gap-2 text-lg font-bold sm:text-xl">
            <Sparkles className="text-secondary h-5 w-5" /> Direktori Fitur Eksklusif Smart Buyer
          </h2>
          <p className="text-muted-foreground mt-0.5 text-xs">
            Pilih modul analitik di bawah untuk mulai mengoptimalkan keputusan properti Anda.
          </p>
        </div>
        <span className="bg-secondary/10 text-secondary border-secondary/20 w-fit rounded-full border px-3.5 py-1.5 text-xs font-semibold">
          9 Modul Aktif
        </span>
      </div>

      {/* Grid Kartu Fitur Eksklusif */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {SMART_BUYER_FEATURES.map((item, index) => {
          const Icon = item.icon;
          return (
            <Link
              key={index}
              href={item.href}
              className="group bg-card hover:bg-card/90 border-border/80 hover:border-secondary/60 hover:shadow-secondary/10 relative flex cursor-pointer flex-col justify-between overflow-hidden rounded-3xl border p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
            >
              <div className="from-secondary/5 pointer-events-none absolute inset-0 bg-linear-to-br via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

              <div className="relative z-10 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="bg-secondary/10 border-secondary/20 text-secondary group-hover:bg-secondary group-hover:text-primary flex h-12 w-12 items-center justify-center rounded-2xl border shadow-sm transition-all duration-300 group-hover:scale-110">
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="bg-muted text-muted-foreground group-hover:bg-secondary/20 group-hover:text-secondary border-border/40 rounded-full border px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase transition-colors">
                    {item.badge}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-foreground group-hover:text-secondary font-heading flex items-center justify-between text-base font-bold transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground line-clamp-2 text-xs leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="border-border/40 relative z-10 mt-6 flex items-center justify-between border-t pt-6">
                <span className="text-secondary flex items-center gap-1 text-xs font-bold transition-transform group-hover:translate-x-1">
                  Buka Fitur <ArrowRight className="h-3.5 w-3.5" />
                </span>
                <span className="text-muted-foreground/60 text-[10px] font-medium">Akses VIP</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
