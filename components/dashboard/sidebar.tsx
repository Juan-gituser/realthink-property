"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Building2,
  PlusCircle,
  Layers,
  Users,
  MessageSquare,
  Calendar,
  FileText,
  Layout,
  Award,
  Zap,
  TrendingUp,
  Compass,
  Shield,
  Settings,
  Database,
  Activity,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";

interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const menuGroups: NavGroup[] = [
  {
    label: "Dashboard",
    items: [{ title: "Dashboard", href: "/dashboard/admin", icon: LayoutDashboard }],
  },
  {
    label: "PROPERTY",
    items: [
      { title: "Semua Property", href: "/dashboard/admin/properties", icon: Building2 },
      { title: "Tambah Property", href: "/dashboard/admin/properties/create", icon: PlusCircle },
      { title: "Kategori", href: "/dashboard/admin/properties/categories", icon: Layers },
    ],
  },
  {
    label: "LEAD",
    items: [
      { title: "Lead Center", href: "/dashboard/admin/leads", icon: Users },
      { title: "Konsultasi", href: "/dashboard/admin/consultations", icon: MessageSquare },
      { title: "Survey", href: "/dashboard/admin/surveys", icon: Calendar },
    ],
  },
  {
    label: "CONTENT",
    items: [
      { title: "Artikel", href: "/dashboard/admin/articles", icon: FileText },
      { title: "Landing Page", href: "/dashboard/admin/landing-pages", icon: Layout },
    ],
  },
  {
    label: "MEMBERSHIP",
    items: [
      { title: "Member", href: "/dashboard/admin/members", icon: Users },
      { title: "Smart Buyer", href: "/dashboard/admin/smart-buyer", icon: Award },
      { title: "Investor Pro", href: "/dashboard/admin/investor-pro", icon: Zap },
    ],
  },
  {
    label: "ANALYTICS",
    items: [
      { title: "Dashboard", href: "/dashboard/admin/analytics", icon: TrendingUp },
      { title: "Market Insight", href: "/dashboard/admin/market-insight", icon: Compass },
    ],
  },
  {
    label: "SYSTEM",
    items: [
      { title: "Admin", href: "/dashboard/admin/system/admins", icon: Shield },
      { title: "Pengaturan", href: "/dashboard/admin/settings", icon: Settings },
      { title: "Backup", href: "/dashboard/admin/backup", icon: Database },
      { title: "Log Aktivitas", href: "/dashboard/admin/logs", icon: Activity },
    ],
  },
];

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Header Toggle */}
      <div className="sticky top-0 z-50 flex items-center justify-between border-b border-slate-800 bg-[#0B132B] px-4 py-3 lg:hidden">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileOpen(true)}
            className="rounded-xl bg-slate-800 p-2 text-slate-300 hover:text-white"
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="font-heading text-sm font-extrabold tracking-wider text-white">
            REALTHINK <span className="text-amber-400">ADMIN</span>
          </span>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileOpen(false)}
            className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Container */}
      <motion.aside
        initial={false}
        animate={{
          width: isCollapsed ? "80px" : "280px",
          x: isMobileOpen ? 0 : "-100%",
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col overflow-hidden border-r border-slate-800 bg-[#0B132B] shadow-2xl lg:translate-x-0`}
      >
        {/* Sidebar Brand Header */}
        <div className="flex items-center justify-between border-b border-slate-800/80 p-5">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-amber-400 to-amber-600 font-extrabold text-slate-950 shadow-lg shadow-amber-500/20">
              RT
            </div>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col truncate"
              >
                <span className="font-heading truncate text-sm font-extrabold tracking-tight text-white">
                  REALTHINK
                </span>
                <span className="text-[10px] font-semibold tracking-widest text-amber-400 uppercase">
                  Property Admin
                </span>
              </motion.div>
            )}
          </div>

          {/* Close button for Mobile */}
          <button
            onClick={() => setIsMobileOpen(false)}
            className="rounded-lg bg-slate-800/50 p-1.5 text-slate-400 hover:text-white lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Collapse Toggle for Desktop */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden rounded-xl border border-slate-800 bg-slate-900 p-1.5 text-slate-400 shadow-md transition-all hover:border-slate-700 hover:text-white lg:flex"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Navigation Scrollable Area */}
        <div className="custom-scrollbar flex-1 space-y-6 overflow-y-auto px-3 py-4">
          {menuGroups.map((group, groupIdx) => (
            <div key={groupIdx} className="space-y-1.5">
              {!isCollapsed && (
                <p className="mb-2 px-3 text-[10px] font-bold tracking-wider text-slate-400/80 uppercase">
                  {group.label}
                </p>
              )}
              {group.items.map((item, itemIdx) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={itemIdx}
                    href={item.href}
                    onClick={() => setIsMobileOpen(false)}
                    className={`group relative flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-xs font-medium transition-all ${
                      isActive
                        ? "bg-amber-500 font-bold text-slate-950 shadow-lg shadow-amber-500/25"
                        : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
                    }`}
                  >
                    <Icon
                      className={`h-4 w-4 shrink-0 transition-transform group-hover:scale-110 ${
                        isActive ? "text-slate-950" : "text-amber-400"
                      }`}
                    />
                    {!isCollapsed && <span className="truncate">{item.title}</span>}

                    {/* Tooltip for collapsed state */}
                    {isCollapsed && (
                      <div className="pointer-events-none absolute left-full z-50 ml-3 rounded-xl border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs whitespace-nowrap text-white opacity-0 shadow-xl transition-opacity group-hover:opacity-100">
                        {item.title}
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </div>

        {/* User Footer Profile Mini / Status */}
        {!isCollapsed && (
          <div className="m-3 rounded-2xl border-t border-slate-800/80 bg-slate-900/40 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-amber-500/30 bg-amber-500/20 text-xs font-bold text-amber-400">
                A
              </div>
              <div className="flex flex-col truncate">
                <span className="truncate text-xs font-bold text-white">Administrator</span>
                <span className="truncate text-[10px] text-emerald-400">System Online</span>
              </div>
            </div>
          </div>
        )}
      </motion.aside>
    </>
  );
}