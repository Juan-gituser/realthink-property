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
        className="relative p-2.5 rounded-2xl bg-card border border-border text-foreground hover:border-secondary transition-all cursor-pointer flex items-center justify-center shadow-xs"
        aria-label="Buka Notifikasi"
      >
        <Bell className="w-5 h-5" />
        {/* Titik Indikator Badge */}
        <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-secondary rounded-full ring-2 ring-card animate-pulse" />
      </button>

      {/* Panel Dropdown Notifikasi */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-card border border-border rounded-3xl shadow-2xl shadow-black/30 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {/* Header Dropdown */}
          <div className="px-5 py-4 border-b border-border/60 flex items-center justify-between bg-muted/30">
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold font-heading uppercase tracking-wider text-foreground">
                Notifikasi
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-secondary/15 text-secondary text-[10px] font-semibold">
                Baru
              </span>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-[11px] text-muted-foreground hover:text-foreground transition"
            >
              Tandai semua dibaca
            </button>
          </div>

          {/* Daftar Isi Notifikasi */}
          <div className="max-h-80 overflow-y-auto divide-y divide-border/40">
            {/* Contoh Item Notifikasi (Tahap Pengembangan) */}
            <div className="p-4 hover:bg-muted/50 transition flex gap-3.5 items-start">
              <div className="p-2 bg-secondary/10 text-secondary rounded-xl shrink-0 mt-0.5">
                <Info className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-foreground">
                  Pembaruan Sistem Dashboard
                </p>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Modul fitur khusus member saat ini sedang dalam tahap pengembangan lanjutan.
                </p>
                <span className="text-[10px] text-muted-foreground/70 block pt-1">
                  Baru saja
                </span>
              </div>
            </div>
          </div>

          {/* Footer Dropdown */}
          <div className="p-3 bg-muted/20 border-t border-border/60 text-center">
            <span className="text-[11px] text-muted-foreground font-medium">
              Realthink Property Notification Center
            </span>
          </div>
        </div>
      )}
    </div>
  );
}