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
  Crown
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
    <div className="space-y-8 pb-12 max-w-7xl mx-auto">
      
      {/* Banner / Hero Section Eksklusif (Diperbaiki agar konsisten gelap & elegan) */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-950 border border-secondary/40 p-8 sm:p-10 shadow-2xl shadow-black/50">
        {/* Efek cahaya ambient */}
        <div className="absolute -right-12 -top-12 w-72 h-72 bg-secondary/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 -bottom-10 w-64 h-64 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-secondary/20 border border-secondary/40 text-secondary text-xs font-bold tracking-wider uppercase backdrop-blur-md">
              <Crown className="w-3.5 h-3.5" /> Realthink Elite Membership Active
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold font-heading text-white tracking-tight">
              Smart Buyer Command Center
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Anda memiliki akses penuh ke seluruh ekosistem alat analisis properti mendalam, proteksi pembelian bebas risiko, audit legalitas, dan estimasi biaya tersembunyi tingkat lanjut.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
            <div className="px-5 py-3.5 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-secondary/30 flex items-center gap-3.5 shadow-xl">
              <div className="p-2.5 bg-secondary/20 rounded-xl text-secondary border border-secondary/20">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Status Proteksi</p>
                <p className="text-xs font-bold text-white">Full Verified & Secure</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold font-heading text-foreground flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-secondary" /> Direktori Fitur Eksklusif Smart Buyer
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Pilih modul analitik di bawah untuk mulai mengoptimalkan keputusan properti Anda.
          </p>
        </div>
        <span className="text-xs font-semibold px-3.5 py-1.5 bg-secondary/10 text-secondary rounded-full border border-secondary/20 w-fit">
          9 Modul Aktif
        </span>
      </div>

      {/* Grid Kartu Fitur Eksklusif */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SMART_BUYER_FEATURES.map((item, index) => {
          const Icon = item.icon;
          return (
            <Link
              key={index}
              href={item.href}
              className="group relative bg-card hover:bg-card/90 border border-border/80 hover:border-secondary/60 rounded-3xl p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-secondary/10 hover:-translate-y-1 flex flex-col justify-between overflow-hidden cursor-pointer"
            >
              <div className="absolute inset-0 bg-linear-to-br from-secondary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

              <div className="space-y-4 relative z-10">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-secondary/10 border border-secondary/20 text-secondary flex items-center justify-center group-hover:scale-110 group-hover:bg-secondary group-hover:text-primary transition-all duration-300 shadow-sm">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full bg-muted text-muted-foreground group-hover:bg-secondary/20 group-hover:text-secondary transition-colors border border-border/40">
                    {item.badge}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-base font-bold text-foreground group-hover:text-secondary transition-colors font-heading flex items-center justify-between">
                    {item.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-border/40 flex items-center justify-between relative z-10">
                <span className="text-xs font-bold text-secondary flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Buka Fitur <ArrowRight className="w-3.5 h-3.5" />
                </span>
                <span className="text-[10px] text-muted-foreground/60 font-medium">
                  Akses VIP
                </span>
              </div>
            </Link>
          );
        })}
      </div>

    </div>
  );
}