"use client";

import { 
  Heart, 
  Calendar, 
  Calculator, 
  MessageSquare, 
  Sparkles,
  Construction
} from "lucide-react";

export default function MemberDashboardPage() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Banner Utama */}
      <div className="relative overflow-hidden rounded-3xl bg-primary text-white p-6 sm:p-8 shadow-xl shadow-primary/10 border border-border/80">
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-secondary/20 blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-secondary border border-secondary/30">
            <Sparkles className="w-3.5 h-3.5" /> Dashboard Member
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading">
            Selamat Datang Kembali 👋
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Pantau properti favorit, jadwal survey, simulasi kalkulator, dan riwayat konsultasi Anda dalam satu panel kendali terpadu.
          </p>
        </div>
      </div>

      {/* Grid Ringkasan Statistik */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Favorit */}
        <div className="bg-card p-5 rounded-2xl border border-border shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground">Daftar Favorit</p>
            <p className="text-2xl font-bold font-heading text-foreground mt-1">0 <span className="text-xs font-normal text-muted-foreground">Unit</span></p>
          </div>
          <div className="p-3 bg-red-500/10 text-red-500 rounded-xl">
            <Heart className="w-5 h-5" />
          </div>
        </div>

        {/* Jadwal Survey */}
        <div className="bg-card p-5 rounded-2xl border border-border shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground">Jadwal Survey</p>
            <p className="text-2xl font-bold font-heading text-foreground mt-1">0 <span className="text-xs font-normal text-muted-foreground">Agenda</span></p>
          </div>
          <div className="p-3 bg-secondary/10 text-secondary rounded-xl">
            <Calendar className="w-5 h-5" />
          </div>
        </div>

        {/* Simulasi Kalkulator */}
        <div className="bg-card p-5 rounded-2xl border border-border shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground">Simulasi KPR</p>
            <p className="text-2xl font-bold font-heading text-foreground mt-1">0 <span className="text-xs font-normal text-muted-foreground">Kalkulasi</span></p>
          </div>
          <div className="p-3 bg-amber-500/10 text-amber-500 rounded-xl">
            <Calculator className="w-5 h-5" />
          </div>
        </div>

        {/* Pesan / Konsultasi */}
        <div className="bg-card p-5 rounded-2xl border border-border shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground">Konsultasi</p>
            <p className="text-2xl font-bold font-heading text-foreground mt-1">0 <span className="text-xs font-normal text-muted-foreground">Pesan</span></p>
          </div>
          <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl">
            <MessageSquare className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Informasi Fitur Khusus Member (Hanya Tulisan) */}
      <div className="bg-card border border-border p-6 sm:p-8 rounded-3xl space-y-4 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 bg-amber-500/10 text-amber-500 rounded-xl">
            <Construction className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold font-heading text-foreground">Fitur Khusus Member</h2>
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed pl-11">
          Seluruh modul dan fitur khusus member saat ini <strong className="text-foreground font-semibold">masih dalam tahap pengembangan</strong>. Pembaruan akan segera dirilis secara bertahap untuk meningkatkan pengalaman Anda pada platform.
        </p>
      </div>
    </div>
  );
}