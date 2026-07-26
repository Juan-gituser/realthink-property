"use client";

import { useState, useRef, useEffect } from "react";
import { Bell, CheckCheck, Info } from "lucide-react";

export default function NotificationButton() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Menutup dropdown jika pengguna mengklik di luar area tombol/panel
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Tombol Utama */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-card border-border text-foreground hover:border-secondary relative flex cursor-pointer items-center justify-center rounded-2xl border p-2.5 shadow-xs transition-all"
        aria-label="Buka Notifikasi"
      >
        <Bell className="h-5 w-5" />
        {/* Titik Indikator Badge */}
        <span className="bg-secondary ring-card absolute top-2 right-2 h-2.5 w-2.5 animate-pulse rounded-full ring-2" />
      </button>

      {/* Panel Dropdown Notifikasi */}
      {isOpen && (
        <div className="bg-card border-border animate-in fade-in zoom-in-95 absolute right-0 z-50 mt-3 w-80 overflow-hidden rounded-3xl border shadow-2xl shadow-black/30 duration-150 sm:w-96">
          {/* Header Dropdown */}
          <div className="border-border/60 bg-muted/30 flex items-center justify-between border-b px-5 py-4">
            <div className="flex items-center gap-2">
              <h3 className="font-heading text-foreground text-xs font-bold tracking-wider uppercase">
                Notifikasi
              </h3>
              <span className="bg-secondary/15 text-secondary rounded-full px-2 py-0.5 text-[10px] font-semibold">
                Baru
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-muted-foreground hover:text-foreground text-[11px] transition"
            >
              Tandai semua dibaca
            </button>
          </div>

          {/* Daftar Isi Notifikasi */}
          <div className="divide-border/40 max-h-80 divide-y overflow-y-auto">
            {/* Contoh Item Notifikasi (Tahap Pengembangan) */}
            <div className="hover:bg-muted/50 flex items-start gap-3.5 p-4 transition">
              <div className="bg-secondary/10 text-secondary mt-0.5 shrink-0 rounded-xl p-2">
                <Info className="h-4 w-4" />
              </div>
              <div className="space-y-1">
                <p className="text-foreground text-xs font-bold">Pembaruan Sistem Dashboard</p>
                <p className="text-muted-foreground text-[11px] leading-relaxed">
                  Modul fitur khusus member saat ini sedang dalam tahap pengembangan lanjutan.
                </p>
                <span className="text-muted-foreground/70 block pt-1 text-[10px]">Baru saja</span>
              </div>
            </div>
          </div>

          {/* Footer Dropdown */}
          <div className="bg-muted/20 border-border/60 border-t p-3 text-center">
            <span className="text-muted-foreground text-[11px] font-medium">
              Realthink Property Notification Center
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
