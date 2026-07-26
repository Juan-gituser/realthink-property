"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  PlusCircle,
  FileText,
  Settings,
  ExternalLink,
  LogOut,
  Menu,
  X,
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

  // 2. Handler Logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  // 3. Daftar Navigasi Sidebar
  const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Semua Properti", href: "/admin/properties", icon: Building2 },
    { name: "Tambah Properti", href: "/admin/properties/create", icon: PlusCircle },
    { name: "Kelola Artikel", href: "/admin/articles", icon: FileText },
    { name: "Pengaturan", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 font-sans antialiased">
      {/* Overlay Gelap untuk Tampilan Mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 transition-opacity lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Admin (Kiri) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 transform flex-col justify-between bg-slate-900 text-slate-300 transition-transform duration-300 lg:static ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } h-full shrink-0 border-r border-slate-800`}
      >
        {/* Bagian Atas Sidebar: Logo & Navigasi */}
        <div className="flex h-full flex-col overflow-y-auto">
          {/* Header Brand */}
          <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-800 px-6">
            <Link href="/admin" className="flex items-center gap-3">
              <div className="rounded-lg bg-amber-500 p-2 font-bold text-slate-950 shadow-md shadow-amber-500/20">
                <Building2 className="h-4 w-4" />
              </div>
              <div>
                <h2 className="font-heading text-sm leading-tight font-bold text-white">
                  Realthink
                </h2>
                <span className="text-[10px] font-semibold tracking-wider text-amber-400 uppercase">
                  Admin Panel
                </span>
              </div>
            </Link>

            {/* Tombol Close Sidebar (Mobile) */}
            <button
              className="cursor-pointer text-slate-400 transition-colors hover:text-white lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Menu Navigasi Utama */}
          <nav className="flex-1 space-y-1.5 p-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-amber-500 font-semibold text-slate-950 shadow-sm shadow-amber-500/20"
                      : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <Icon
                    className={`h-4 w-4 shrink-0 ${isActive ? "text-slate-950" : "text-slate-400"}`}
                  />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Bagian Bawah Sidebar: Website Link & Logout dengan Interaksi Halus */}
          <div className="shrink-0 space-y-2 border-t border-slate-800 p-4">
            {/* Tombol Lihat Website */}
            <Link
              href="/"
              target="_blank"
              className="group flex cursor-pointer items-center justify-between rounded-xl border border-slate-800 bg-slate-800/40 px-3.5 py-2.5 text-xs font-medium text-slate-400 transition-all duration-200 hover:bg-slate-800 hover:text-white"
            >
              <span className="flex items-center gap-2">
                <ExternalLink className="h-4 w-4 text-slate-400 transition-colors group-hover:text-amber-400" />
                <span>Lihat Website</span>
              </span>
              <span className="rounded bg-slate-800 px-2 py-0.5 font-mono text-[10px] text-slate-300 transition-colors group-hover:bg-amber-500/20 group-hover:text-amber-300">
                Live
              </span>
            </Link>

            {/* Tombol Logout dengan Animasi Hover & Kursor Pointer */}
            <button
              onClick={handleLogout}
              className="group flex w-full cursor-pointer items-center gap-3 rounded-xl border border-rose-500/20 bg-rose-500/5 px-3.5 py-2.5 text-left text-xs font-semibold text-rose-400 shadow-sm transition-all duration-200 hover:scale-[1.01] hover:border-rose-500/40 hover:bg-rose-500/15 hover:text-rose-300"
            >
              <LogOut className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:-translate-x-0.5" />
              <span>Keluar (Logout)</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Area Konten Utama (Kanan) */}
      <div className="flex h-full min-w-0 flex-1 flex-col overflow-hidden">
        {/* Topbar Header */}
        <header className="z-30 flex h-16 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-6">
          <div className="flex items-center gap-3">
            {/* Tombol Hamburger (Mobile) */}
            <button
              className="cursor-pointer text-gray-600 transition-colors hover:text-gray-950 lg:hidden"
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
            {/* Tombol Pintas Tambah Properti */}
            <Link
              href="/admin/properties/create"
              className="flex items-center gap-2 rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-medium text-white shadow-sm transition-all hover:scale-[1.02] hover:bg-slate-800 sm:text-sm"
            >
              <PlusCircle className="h-4 w-4 text-amber-400" />
              <span className="hidden sm:inline">Tambah Properti</span>
              <span className="sm:hidden">Tambah</span>
            </Link>

            <div className="hidden h-6 w-px bg-gray-200 sm:block" />

            {/* Identitas Admin */}
            <div className="flex items-center gap-3">
              <div className="hidden text-right sm:block">
                <p className="text-xs font-bold text-gray-900">Admin Realthink</p>
                <p className="text-[10px] text-gray-500">Super Administrator</p>
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-xs font-bold text-amber-400 shadow-inner">
                A
              </div>
            </div>
          </div>
        </header>

        {/* Tempat Konten Halaman Dinamis Diberikan */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}
