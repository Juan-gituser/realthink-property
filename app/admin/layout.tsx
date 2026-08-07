"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Building2,
  PlusCircle,
  Layers,
  Users,
  MessageSquare,
  Calendar,
  Clock,
  Coins,
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
  ExternalLink,
  LogOut,
  Building,
  Loader2,
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

const INACTIVITY_TIMEOUT = 15 * 60 * 1000;

const menuGroups: NavGroup[] = [
  {
    label: "Dashboard",
    items: [{ title: "Dashboard", href: "/admin", icon: LayoutDashboard }],
  },
  {
    label: "PROPERTI",
    items: [
      { title: "Semua Properti", href: "/admin/properties", icon: Building2 },
      { title: "Tambah Properti", href: "/admin/properties/create", icon: PlusCircle },
      { title: "Kategori", href: "/admin/properties/categories", icon: Layers },
    ],
  },
  {
    label: "CRM & INTERAKSI",
    items: [
      { title: "Lead Center", href: "/admin/crm/leads", icon: Users },
      { title: "Kelola Survei", href: "/admin/crm/surveys", icon: Calendar },
      { title: "Follow Ups", href: "/admin/crm/follow-ups", icon: Clock },
      { title: "Commissions", href: "/admin/crm/commissions", icon: Coins },
      { title: "Konsultasi", href: "/admin/consultations", icon: MessageSquare },
    ],
  },
  {
    label: "KONTEN",
    items: [
      { title: "Artikel", href: "/admin/articles", icon: FileText },
      { title: "Landing Page", href: "/admin/landing-page", icon: Layout },
    ],
  },
  {
    label: "MEMBERSHIP",
    items: [
      { title: "Member", href: "/admin/members", icon: Users },
      { title: "Smart Buyer", href: "/admin/smart-buyer", icon: Award },
      { title: "Investor Pro", href: "/admin/investor-pro", icon: Zap },
    ],
  },
  {
    label: "ANALITIK",
    items: [
      { title: "Dashboard Analitik", href: "/admin/analytics", icon: TrendingUp },
      { title: "Market Insight", href: "/admin/market-insight", icon: Compass },
    ],
  },
  {
    label: "SISTEM",
    items: [
      { title: "Admin", href: "/admin/system/admins", icon: Shield },
      { title: "Pengaturan", href: "/admin/settings", icon: Settings },
      { title: "Backup Data", href: "/admin/backup", icon: Database },
      { title: "Log Aktivitas", href: "/admin/logs", icon: Activity },
    ],
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const pathname = usePathname();
  const router = useRouter();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const isAuthPage = pathname === "/admin/login";

  // Handler Logout Supabase
  const handleLogout = useCallback(async () => {
    await supabase.auth.signOut();
    router.replace("/admin/login");
  }, [router]);

  // 1. Verifikasi Autentikasi yang Aman & Stabil
  useEffect(() => {
    if (isAuthPage) {
      setIsCheckingAuth(false);
      return;
    }

    let isMounted = true;

    // Cek langsung session saat awal render
    const checkInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!isMounted) return;

        if (!session) {
          router.replace("/admin/login");
        } else {
          setIsCheckingAuth(false);
        }
      } catch (err) {
        if (isMounted) router.replace("/admin/login");
      }
    };

    checkInitialSession();

    // Pantau perubahan sesi autentikasi real-time
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!isMounted) return;

      if (event === "SIGNED_OUT" || (!session && event !== "INITIAL_SESSION")) {
        router.replace("/admin/login");
      } else if (session) {
        setIsCheckingAuth(false);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [isAuthPage, router]);

  // Reset Timer Inaktivitas
  const resetInactivityTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      handleLogout();
    }, INACTIVITY_TIMEOUT);
  }, [handleLogout]);

  // Listener Auto Logout karena Inaktivitas
  useEffect(() => {
    if (isAuthPage || isCheckingAuth) return;

    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];

    resetInactivityTimer();
    events.forEach((event) => {
      window.addEventListener(event, resetInactivityTimer);
    });

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      events.forEach((event) => {
        window.removeEventListener(event, resetInactivityTimer);
      });
    };
  }, [isAuthPage, isCheckingAuth, resetInactivityTimer]);

  // Bypass layout jika berada di halaman login admin
  if (isAuthPage) {
    return <>{children}</>;
  }

  // Tampilkan loading spinner jika sedang memverifikasi autentikasi
  if (isCheckingAuth) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
          <p className="text-xs font-semibold text-gray-500">Memeriksa Akses Admin...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 font-sans antialiased">
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileOpen(false)}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* SIDEBAR CONTAINER */}
      <motion.aside
        initial={false}
        animate={{
          width: isCollapsed ? "80px" : "280px",
          x: isMobileOpen ? 0 : undefined,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col overflow-hidden border-r border-gray-200 bg-white text-gray-700 shadow-sm transition-transform lg:static lg:translate-x-0 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header Brand Sidebar */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-gray-100 px-4">
          <Link href="/admin" className="flex items-center gap-3 overflow-hidden">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-amber-500 text-white shadow-sm shadow-amber-200">
              <Building className="h-5 w-5" />
            </div>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col truncate"
              >
                <span className="font-heading truncate text-sm font-extrabold tracking-tight text-gray-900">
                  REALTHINK
                </span>
                <span className="text-[10px] font-bold tracking-widest text-amber-600 uppercase">
                  Admin Panel
                </span>
              </motion.div>
            )}
          </Link>

          <button
            onClick={() => setIsMobileOpen(false)}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden rounded-xl border border-gray-200 bg-white p-1.5 text-gray-500 shadow-xs transition-all hover:bg-gray-50 hover:text-gray-900 lg:flex"
            title={isCollapsed ? "Buka Sidebar" : "Tutup Sidebar"}
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        {/* Scrollable Navigasi */}
        <div className="custom-scrollbar flex-1 space-y-6 overflow-y-auto px-3 py-4">
          {menuGroups.map((group, groupIdx) => (
            <div key={groupIdx} className="space-y-1.5">
              {!isCollapsed && (
                <p className="mb-2 px-3 text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                  {group.label}
                </p>
              )}
              {group.items.map((item, itemIdx) => {
                const Icon = item.icon;
                const isActive =
                  item.href === "/admin"
                    ? pathname === "/admin"
                    : pathname.startsWith(item.href);

                return (
                  <Link
                    key={itemIdx}
                    href={item.href}
                    onClick={() => setIsMobileOpen(false)}
                    className={`group relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all ${
                      isActive
                        ? "border border-amber-200/80 bg-amber-50 text-amber-700 shadow-xs"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                  >
                    <Icon
                      className={`h-4 w-4 shrink-0 transition-transform group-hover:scale-110 ${
                        isActive ? "text-amber-600" : "text-gray-400 group-hover:text-amber-600"
                      }`}
                    />
                    {!isCollapsed && <span className="truncate">{item.title}</span>}

                    {isCollapsed && (
                      <div className="pointer-events-none absolute left-full z-50 ml-3 rounded-xl border border-gray-200 bg-gray-900 px-3 py-1.5 text-xs whitespace-nowrap text-white opacity-0 shadow-xl transition-opacity group-hover:opacity-100">
                        {item.title}
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer Sidebar */}
        <div className="space-y-2 border-t border-gray-100 p-3">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50/60 px-3 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-100 hover:text-gray-900"
          >
            <span className="flex items-center gap-2 truncate">
              <ExternalLink className="h-4 w-4 shrink-0 text-gray-400" />
              {!isCollapsed && <span>Lihat Website</span>}
            </span>
            {!isCollapsed && (
              <span className="rounded-md bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700">
                Live
              </span>
            )}
          </Link>

          <button
            onClick={handleLogout}
            className="flex w-full cursor-pointer items-center justify-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50/60 px-3 py-2 text-xs font-semibold text-rose-600 transition hover:bg-rose-100"
            title="Keluar (Logout)"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {!isCollapsed && <span>Keluar</span>}
          </button>
        </div>
      </motion.aside>

      {/* AREA KONTEN UTAMA */}
      <div className="flex h-full min-w-0 flex-1 flex-col overflow-hidden">
        {/* Topbar Header */}
        <header className="z-30 flex h-16 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-6 shadow-xs">
          <div className="flex items-center gap-3">
            <button
              className="cursor-pointer text-gray-600 transition-colors hover:text-gray-900 lg:hidden"
              onClick={() => setIsMobileOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>

            <div className="hidden items-center gap-2 text-xs text-gray-500 sm:flex">
              <span className="font-semibold text-gray-700">Area Administrator</span>
              <span>/</span>
              <span className="capitalize">
                {pathname.replace("/admin", "").replace("/", "") || "Dashboard"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-xs font-bold text-gray-900">Admin Realthink</p>
              <p className="text-[10px] text-gray-500">Super Administrator</p>
            </div>
            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-amber-200 bg-amber-500 text-xs font-bold text-white shadow-xs">
              A
            </div>
          </div>
        </header>

        {/* Konten Halaman Dinamis */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}