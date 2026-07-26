// app/admin/layout.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  FileText,
  Settings,
  ExternalLink,
  LogOut,
  Menu,
  X,
  Building
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // 1. Bypass layout admin jika berada di halaman login
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  // 2. Handler Logout Supabase
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  // 3. Daftar Navigasi Sidebar (Tema Terang / Clean Light Theme)
  const navItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Kelola Properti", href: "/admin/properties", icon: Building2 },
    { label: "Kelola Artikel", href: "/admin/articles", icon: FileText },
    { label: "Pengaturan", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 font-sans antialiased">
      {/* Overlay Gelap untuk Tampilan Mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs transition-opacity lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Admin (Tema Terang) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 transform flex-col justify-between bg-white border-r border-gray-200 p-4 transition-transform duration-300 lg:static ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } h-full shrink-0 shadow-sm`}
      >
        {/* Top: Logo & Brand + Navigasi */}
        <div className="flex h-full flex-col overflow-y-auto">
          {/* Header Brand */}
          <div className="flex h-16 shrink-0 items-center justify-between border-b border-gray-100 px-2 pb-4 pt-2">
            <Link href="/admin" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-white shadow-sm">
                <Building className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-heading text-base font-bold text-gray-900 leading-tight">Realthink</h2>
                <span className="text-[10px] font-bold tracking-widest text-amber-600 uppercase">
                  Admin Panel
                </span>
              </div>
            </Link>

            {/* Tombol Close Sidebar (Mobile) */}
            <button
              className="cursor-pointer text-gray-400 transition-colors hover:text-gray-700 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 space-y-1.5 py-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-amber-50 text-amber-600 border border-amber-200/60 shadow-sm"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <Icon className={`h-4 w-4 shrink-0 ${isActive ? "text-amber-600" : "text-gray-500"}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom: Actions & Logout */}
        <div className="shrink-0 space-y-2 border-t border-gray-100 pt-4">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2.5 text-xs font-semibold text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="h-4 w-4 text-gray-500" /> Lihat Website
            </span>
            <span className="rounded-md bg-gray-200/60 px-1.5 py-0.5 text-[10px] font-bold text-gray-600">Live</span>
          </Link>

          <button
            onClick={handleLogout}
            className="flex w-full cursor-pointer items-center gap-2 rounded-xl border border-rose-200 bg-rose-50/50 px-3.5 py-2.5 text-xs font-semibold text-rose-600 transition hover:bg-rose-100/60"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            <span>Keluar (Logout)</span>
          </button>
        </div>
      </aside>

      {/* Area Konten Utama (Kanan) */}
      <div className="flex h-full min-w-0 flex-1 flex-col overflow-hidden">
        {/* Topbar Header */}
        <header className="z-30 flex h-16 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-6 shadow-xs">
          <div className="flex items-center gap-3">
            {/* Tombol Hamburger (Mobile) */}
            <button
              className="cursor-pointer text-gray-600 transition-colors hover:text-gray-900 lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>

            {/* Breadcrumbs / Petunjuk Halaman */}
            <div className="hidden items-center gap-2 text-xs text-gray-500 sm:flex">
              <span className="font-semibold text-gray-700">Area Administrator</span>
              <span>/</span>
              <span className="capitalize">
                {pathname.replace("/admin", "").replace("/", "") || "Dashboard"}
              </span>
            </div>
          </div>

          {/* Aksi Topbar Sebelah Kanan */}
          <div className="flex items-center gap-4">
            {/* Identitas Admin */}
            <div className="flex items-center gap-3">
              <div className="hidden text-right sm:block">
                <p className="text-xs font-bold text-gray-900">Admin Realthink</p>
                <p className="text-[10px] text-gray-500">Super Administrator</p>
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-amber-200 bg-amber-500 text-xs font-bold text-white shadow-xs">
                A
              </div>
            </div>
          </div>
        </header>

        {/* Tempat Konten Halaman Dinamis */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}