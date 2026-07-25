"tsx"
"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, CheckCheck, Loader2 } from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";
import { NotificationCard } from "./notification-item";

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { notifications, unreadCount, isLoading, markAsRead, markAllAsRead } = useNotifications();

  // Menutup dropdown saat klik di luar area
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
      {/* Bell Icon Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 rounded-2xl bg-[#1C2541]/70 border border-slate-800 text-slate-300 hover:text-white hover:border-amber-500/40 transition-all shadow-md flex items-center justify-center group"
        aria-label="Notification Center"
      >
        <Bell className="w-5 h-5 transition-transform group-hover:rotate-12" />
        
        {/* Unread Badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-950 font-extrabold text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#0B132B] shadow-lg animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Modern Dropdown Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute right-0 mt-3 w-80 sm:w-96 bg-[#1C2541] border border-slate-800 rounded-3xl shadow-2xl backdrop-blur-xl z-50 overflow-hidden flex flex-col max-h-125[500px]"
          >
            {/* Dropdown Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/40">
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-extrabold text-white uppercase tracking-wider">Notifikasi</h3>
                {unreadCount > 0 && (
                  <span className="bg-amber-500/20 text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-500/30">
                    {unreadCount} baru
                  </span>
                )}
              </div>

              {unreadCount > 0 && (
                <button
                  onClick={() => markAllAsRead()}
                  className="text-[11px] font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
                >
                  <CheckCheck className="w-3.5 h-3.5" /> Tandai semua dibaca
                </button>
              )}
            </div>

            {/* Notification List Area */}
            <div className="overflow-y-auto flex-1 custom-scrollbar">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-12 text-slate-400 space-y-2">
                  <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
                  <p className="text-xs">Memuat notifikasi...</p>
                </div>
              ) : notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-slate-400 space-y-2 text-center px-4">
                  <Bell className="w-8 h-8 text-slate-600 mb-1" />
                  <p className="text-xs font-medium text-slate-300">Belum ada notifikasi</p>
                  <p className="text-[11px] text-slate-500">Semua aktivitas sistem terbaru akan muncul di sini secara real-time.</p>
                </div>
              ) : (
                notifications.map((item) => (
                  <NotificationCard
                    key={item.id}
                    notification={item}
                    onRead={markAsRead}
                  />
                ))
              )}
            </div>

            {/* Dropdown Footer */}
            <div className="p-3 border-t border-slate-800 bg-slate-900/60 text-center">
              <span className="text-[10px] text-slate-400 font-medium">
                Sinkronisasi Realtime Supabase Aktif ⚡
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}