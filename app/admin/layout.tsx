"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, Building2, PlusCircle, FileText, 
  Settings, ExternalLink, LogOut, Menu, X 
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      
      {/* Overlay Gelap untuk Tampilan Mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Admin (Kiri) */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-slate-900 text-slate-300 flex flex-col justify-between transition-transform duration-300 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } border-r border-slate-800 shrink-0 h-full`}
      >
        {/* Bagian Atas Sidebar: Logo & Navigasi */}
        <div className="flex flex-col h-full overflow-y-auto">
          {/* Header Brand */}
          <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800 shrink-0">
            <Link href="/admin" className="flex items-center gap-3">
              <div className="p-2 bg-amber-500 text-slate-950 rounded-lg font-bold">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-heading font-bold text-white text-sm leading-tight">
                  Realthink
                </h2>
                <span className="text-[10px] text-amber-400 font-semibold uppercase tracking-wider">
                  Admin Panel
                </span>
              </div>
            </Link>
            
            {/* Tombol Close Sidebar (Mobile) */}
            <button 
              className="lg:hidden text-slate-400 hover:text-white"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Menu Navigasi Utama */}
          <nav className="p-4 space-y-1.5 flex-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
                    isActive
                      ? "bg-amber-500 text-slate-950 font-semibold shadow-sm"
                      : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Bagian Bawah Sidebar: Website Link & Logout */}
          <div className="p-4 border-t border-slate-800 space-y-2 shrink-0">
            <Link
              href="/"
              target="_blank"
              className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition"
            >
              <span className="flex items-center gap-2">
                <ExternalLink className="w-4 h-4" /> Lihat Website
              </span>
              <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
                Live
              </span>
            </Link>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium text-rose-400 hover:bg-rose-500/10 transition text-left"
            >
              <LogOut className="w-4 h-4" /> Keluar (Logout)
            </button>
          </div>
        </div>
      </aside>

      {/* Area Konten Utama (Kanan) */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        
        {/* Topbar Header */}
        <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between shrink-0 z-30">
          
          <div className="flex items-center gap-3">
            {/* Tombol Hamburger (Mobile) */}
            <button
              className="lg:hidden text-gray-600 hover:text-gray-900"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Breadcrumbs / Petunjuk Halaman */}
            <div className="hidden sm:flex items-center gap-2 text-xs text-gray-500">
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
              className="bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm px-3.5 py-2 rounded-xl font-medium flex items-center gap-2 transition shadow-sm"
            >
              <PlusCircle className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">Tambah Properti</span>
              <span className="sm:hidden">Tambah</span>
            </Link>

            <div className="h-6 w-px bg-gray-200 hidden sm:block" />

            {/* Identitas Admin */}
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-gray-900">Admin Realthink</p>
                <p className="text-[10px] text-gray-500">Super Administrator</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-slate-900 text-amber-400 flex items-center justify-center font-bold text-xs border border-slate-700">
                A
              </div>
            </div>

          </div>
        </header>

        {/* Tempat Konten Halaman Dinamis Diberikan */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-gray-50">
          {children}
        </main>

      </div>

    </div>
  );
}