"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
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
  icon: any;
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
      <div className="lg:hidden flex items-center justify-between bg-[#0B132B] border-b border-slate-800 px-4 py-3 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileOpen(true)}
            className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-extrabold text-white text-sm tracking-wider font-heading">
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
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 lg:hidden"
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
        className={`fixed top-0 bottom-0 left-0 z-50 bg-[#0B132B] border-r border-slate-800 flex flex-col shadow-2xl lg:translate-x-0 overflow-hidden`}
      >
        {/* Sidebar Brand Header */}
        <div className="p-5 flex items-center justify-between border-b border-slate-800/80">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-2xl bg-linear-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-extrabold shrink-0 shadow-lg shadow-amber-500/20">
              RT
            </div>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col truncate"
              >
                <span className="font-extrabold text-white text-sm tracking-tight font-heading truncate">
                  REALTHINK
                </span>
                <span className="text-[10px] text-amber-400 font-semibold uppercase tracking-widest">
                  Property Admin
                </span>
              </motion.div>
            )}
          </div>

          {/* Close button for Mobile */}
          <button
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden text-slate-400 hover:text-white p-1.5 rounded-lg bg-slate-800/50"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Collapse Toggle for Desktop */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-all shadow-md"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Scrollable Area */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 custom-scrollbar">
          {menuGroups.map((group, groupIdx) => (
            <div key={groupIdx} className="space-y-1.5">
              {!isCollapsed && (
                <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400/80 mb-2">
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
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-medium transition-all group relative ${
                      isActive
                        ? "bg-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/25"
                        : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                        isActive ? "text-slate-950" : "text-amber-400"
                      }`}
                    />
                    {!isCollapsed && <span className="truncate">{item.title}</span>}

                    {/* Tooltip for collapsed state */}
                    {isCollapsed && (
                      <div className="absolute left-full ml-3 px-3 py-1.5 bg-slate-900 text-white text-xs rounded-xl shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 border border-slate-800">
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
          <div className="p-4 border-t border-slate-800/80 bg-slate-900/40 m-3 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-xs">
                A
              </div>
              <div className="flex flex-col truncate">
                <span className="text-xs font-bold text-white truncate">Administrator</span>
                <span className="text-[10px] text-emerald-400 truncate">System Online</span>
              </div>
            </div>
          </div>
        )}
      </motion.aside>
    </>
  );
}