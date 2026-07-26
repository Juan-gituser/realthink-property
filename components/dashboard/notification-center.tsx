"tsx";
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
        className="group relative flex items-center justify-center rounded-2xl border border-slate-800 bg-[#1C2541]/70 p-2.5 text-slate-300 shadow-md transition-all hover:border-amber-500/40 hover:text-white"
        aria-label="Notification Center"
      >
        <Bell className="h-5 w-5 transition-transform group-hover:rotate-12" />

        {/* Unread Badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 animate-pulse items-center justify-center rounded-full border-2 border-[#0B132B] bg-amber-500 text-[10px] font-extrabold text-slate-950 shadow-lg">
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
            className="max-h-125[500px] absolute right-0 z-50 mt-3 flex w-80 flex-col overflow-hidden rounded-3xl border border-slate-800 bg-[#1C2541] shadow-2xl backdrop-blur-xl sm:w-96"
          >
            {/* Dropdown Header */}
            <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/40 p-4">
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-extrabold tracking-wider text-white uppercase">
                  Notifikasi
                </h3>
                {unreadCount > 0 && (
                  <span className="rounded-full border border-amber-500/30 bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-400">
                    {unreadCount} baru
                  </span>
                )}
              </div>

              {unreadCount > 0 && (
                <button
                  onClick={() => markAllAsRead()}
                  className="flex items-center gap-1 text-[11px] font-semibold text-amber-400 transition-colors hover:text-amber-300"
                >
                  <CheckCheck className="h-3.5 w-3.5" /> Tandai semua dibaca
                </button>
              )}
            </div>

            {/* Notification List Area */}
            <div className="custom-scrollbar flex-1 overflow-y-auto">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center space-y-2 py-12 text-slate-400">
                  <Loader2 className="h-6 w-6 animate-spin text-amber-500" />
                  <p className="text-xs">Memuat notifikasi...</p>
                </div>
              ) : notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center space-y-2 px-4 py-12 text-center text-slate-400">
                  <Bell className="mb-1 h-8 w-8 text-slate-600" />
                  <p className="text-xs font-medium text-slate-300">Belum ada notifikasi</p>
                  <p className="text-[11px] text-slate-500">
                    Semua aktivitas sistem terbaru akan muncul di sini secara real-time.
                  </p>
                </div>
              ) : (
                notifications.map((item) => (
                  <NotificationCard key={item.id} notification={item} onRead={markAsRead} />
                ))
              )}
            </div>

            {/* Dropdown Footer */}
            <div className="border-t border-slate-800 bg-slate-900/60 p-3 text-center">
              <span className="text-[10px] font-medium text-slate-400">
                Sinkronisasi Realtime Supabase Aktif ⚡
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
