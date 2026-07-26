"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { MessageSquare, X, Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function FloatingConsultation() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Sembunyikan tombol jika berada di halaman login, daftar, atau admin
  const isAuthPage = pathname === "/login" || pathname === "/daftar";
  const isAdminPage = pathname?.startsWith("/admin");

  if (isAuthPage || isAdminPage) {
    return null;
  }

  return (
    <div className="fixed right-5 bottom-5 z-50">
      {/* Panel Popup Chat/Konsultasi */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="border-border absolute right-0 bottom-14 mb-2 w-72 overflow-hidden rounded-2xl border bg-white shadow-2xl sm:w-80"
          >
            <div className="bg-primary flex items-center justify-between p-3.5 text-white">
              <div className="flex items-center gap-2">
                <div className="bg-secondary/20 flex h-7 w-7 items-center justify-center rounded-full text-amber-300">
                  <MessageSquare className="h-3.5 w-3.5" />
                </div>
                <div>
                  <h3 className="font-heading text-xs font-bold">Konsultasi Properti</h3>
                  <p className="text-[10px] text-slate-300">Tim expert kami siap membantu</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="cursor-pointer p-1 text-slate-300 transition hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3 bg-slate-50/50 p-4 text-xs">
              <div className="border-border rounded-xl border bg-white p-3 shadow-xs">
                <p className="text-slate-700">
                  Halo! Ada yang bisa kami bantu seputar pilihan properti atau kalkulator KPR di
                  Realthink? 👋
                </p>
              </div>

              <a
                href="https://wa.me/6283872415878"
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700"
              >
                <Phone className="h-3.5 w-3.5" />
                Chat via WhatsApp
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="bg-primary shadow-primary/20 hover:bg-primary/95 group flex cursor-pointer items-center gap-2 rounded-full border border-white/10 px-3.5 py-2 text-xs font-semibold text-white shadow-lg transition-all"
      >
        <div className="bg-secondary/20 group-hover:bg-secondary/30 flex h-6 w-6 items-center justify-center rounded-full text-amber-300 transition">
          <MessageSquare className="h-3.5 w-3.5" />
        </div>
        <span className="pr-1">Konsultasi</span>
      </motion.button>
    </div>
  );
}
