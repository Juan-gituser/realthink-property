"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { MessageSquare, X, Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function FloatingConsultation() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const isAuthPage = pathname === "/login" || pathname === "/daftar";
  const isAdminPage = pathname?.startsWith("/admin");

  if (isAuthPage || isAdminPage) {
    return null;
  }

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Panel Popup Chat/Konsultasi */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-14 right-0 w-72 sm:w-80 bg-white rounded-2xl shadow-2xl border border-border overflow-hidden mb-2"
          >
            <div className="bg-primary p-3.5 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-secondary/20 flex items-center justify-center text-amber-300">
                  <MessageSquare className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold font-heading">Konsultasi Properti</h3>
                  <p className="text-[10px] text-slate-300">Tim expert kami siap membantu</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-slate-300 hover:text-white transition p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-3 bg-slate-50/50 text-xs">
              <div className="bg-white p-3 rounded-xl border border-border shadow-xs">
                <p className="text-slate-700">
                  Halo! Ada yang bisa kami bantu seputar pilihan properti atau kalkulator KPR di Realthink? 👋
                </p>
              </div>

              <a
                href="https://wa.me/6281234567890" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition shadow-sm cursor-pointer text-xs"
              >
                <Phone className="w-3.5 h-3.5" />
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
        className="flex items-center gap-2 bg-primary text-white py-2 px-3.5 rounded-full shadow-lg shadow-primary/20 hover:bg-primary/95 transition-all text-xs font-semibold cursor-pointer group border border-white/10"
      >
        <div className="w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center text-amber-300 group-hover:bg-secondary/30 transition">
          <MessageSquare className="w-3.5 h-3.5" />
        </div>
        <span className="pr-1">Konsultasi</span>
      </motion.button>
    </div>
  );
}