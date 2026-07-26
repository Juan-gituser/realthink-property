"use client";

import { Heart, Calendar, Calculator, MessageSquare, Sparkles, Construction } from "lucide-react";

export default function MemberDashboardPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-8 pb-12">
      {/* Banner Utama */}
      <div className="bg-primary shadow-primary/10 border-border/80 relative overflow-hidden rounded-3xl border p-6 text-white shadow-xl sm:p-8">
        <div className="bg-secondary/20 pointer-events-none absolute -top-24 -right-24 h-80 w-80 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="text-secondary border-secondary/30 inline-flex items-center gap-2 rounded-full border bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5" /> Dashboard Member
          </div>
          <h1 className="font-heading text-2xl font-bold sm:text-3xl">Selamat Datang Kembali 👋</h1>
          <p className="text-xs leading-relaxed text-slate-300 sm:text-sm">
            Pantau properti favorit, jadwal survey, simulasi kalkulator, dan riwayat konsultasi Anda
            dalam satu panel kendali terpadu.
          </p>
        </div>
      </div>

      {/* Grid Ringkasan Statistik */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Favorit */}
        <div className="bg-card border-border flex items-center justify-between rounded-2xl border p-5 shadow-xs">
          <div>
            <p className="text-muted-foreground text-xs font-medium">Daftar Favorit</p>
            <p className="font-heading text-foreground mt-1 text-2xl font-bold">
              0 <span className="text-muted-foreground text-xs font-normal">Unit</span>
            </p>
          </div>
          <div className="rounded-xl bg-red-500/10 p-3 text-red-500">
            <Heart className="h-5 w-5" />
          </div>
        </div>

        {/* Jadwal Survey */}
        <div className="bg-card border-border flex items-center justify-between rounded-2xl border p-5 shadow-xs">
          <div>
            <p className="text-muted-foreground text-xs font-medium">Jadwal Survey</p>
            <p className="font-heading text-foreground mt-1 text-2xl font-bold">
              0 <span className="text-muted-foreground text-xs font-normal">Agenda</span>
            </p>
          </div>
          <div className="bg-secondary/10 text-secondary rounded-xl p-3">
            <Calendar className="h-5 w-5" />
          </div>
        </div>

        {/* Simulasi Kalkulator */}
        <div className="bg-card border-border flex items-center justify-between rounded-2xl border p-5 shadow-xs">
          <div>
            <p className="text-muted-foreground text-xs font-medium">Simulasi KPR</p>
            <p className="font-heading text-foreground mt-1 text-2xl font-bold">
              0 <span className="text-muted-foreground text-xs font-normal">Kalkulasi</span>
            </p>
          </div>
          <div className="rounded-xl bg-amber-500/10 p-3 text-amber-500">
            <Calculator className="h-5 w-5" />
          </div>
        </div>

        {/* Pesan / Konsultasi */}
        <div className="bg-card border-border flex items-center justify-between rounded-2xl border p-5 shadow-xs">
          <div>
            <p className="text-muted-foreground text-xs font-medium">Konsultasi</p>
            <p className="font-heading text-foreground mt-1 text-2xl font-bold">
              0 <span className="text-muted-foreground text-xs font-normal">Pesan</span>
            </p>
          </div>
          <div className="rounded-xl bg-blue-500/10 p-3 text-blue-500">
            <MessageSquare className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Informasi Fitur Khusus Member (Hanya Tulisan) */}
      <div className="bg-card border-border space-y-4 rounded-3xl border p-6 shadow-sm sm:p-8">
        <div className="flex items-center gap-2.5">
          <div className="rounded-xl bg-amber-500/10 p-2.5 text-amber-500">
            <Construction className="h-5 w-5" />
          </div>
          <h2 className="font-heading text-foreground text-base font-bold">Fitur Khusus Member</h2>
        </div>
        <p className="text-muted-foreground pl-11 text-xs leading-relaxed sm:text-sm">
          Seluruh modul dan fitur khusus member saat ini{" "}
          <strong className="text-foreground font-semibold">masih dalam tahap pengembangan</strong>.
          Pembaruan akan segera dirilis secara bertahap untuk meningkatkan pengalaman Anda pada
          platform.
        </p>
      </div>
    </div>
  );
}
