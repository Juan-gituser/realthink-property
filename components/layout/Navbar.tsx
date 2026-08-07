"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import {
  Menu,
  X,
  Building2,
  ChevronDown,
  Calculator,
  FileText,
  Landmark,
  TrendingUp,
  LogIn,
  User,
  Shield,
  Scale,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // State untuk menyimpan data user login, status admin, dan status loading
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Inisialisasi Supabase client agar tidak re-create di setiap render
  const supabase = useMemo(() => createClient(), []);

  // Pengecekan status login & role di Client Component
  useEffect(() => {
    let isMounted = true;

    const checkUserAndRole = async (currentUser: SupabaseUser | null) => {
      if (!currentUser) {
        if (isMounted) {
          setUser(null);
          setIsAdmin(false);
          setIsLoading(false);
        }
        return;
      }

      if (isMounted) setUser(currentUser);

      // 1. Cek role dari user_metadata
      const metadataRole = currentUser.user_metadata?.role;
      if (metadataRole === "admin" || metadataRole === "super_admin") {
        if (isMounted) {
          setIsAdmin(true);
          setIsLoading(false);
        }
        return;
      }

      // 2. Jika tidak ada di metadata, cek dari tabel profiles
      try {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", currentUser.id)
          .maybeSingle();

        if (isMounted) {
          if (profile?.role === "admin" || profile?.role === "super_admin") {
            setIsAdmin(true);
          } else {
            setIsAdmin(false);
          }
        }
      } catch (error) {
        console.error("Gagal memuat profil role:", error);
        if (isMounted) setIsAdmin(false);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    // Ambil user saat awal render
    const getInitialUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      await checkUserAndRole(user);
    };

    getInitialUser();

    // Listener real-time status auth
    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      await checkUserAndRole(session?.user ?? null);
    });

    return () => {
      isMounted = false;
      authListener.subscription.unsubscribe();
    };
  }, [supabase]);

  // Sembunyikan Navbar jika di halaman auth atau admin
  const isAuthPage = pathname === "/login" || pathname === "/daftar";
  const isAdminPage = pathname?.startsWith("/admin");

  if (isAuthPage || isAdminPage) {
    return null;
  }

  return (
    <header className="border-border fixed top-0 z-50 w-full border-b bg-white/80 shadow-sm backdrop-blur-md">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 lg:px-8">
        
        {/* Logo Area */}
        <Link href="/" className="group flex shrink-0 items-center gap-2">
          <Building2 className="text-secondary group-hover:text-primary h-8 w-8 transition-colors" />
          <span className="font-heading text-primary text-xl font-bold">
            Realthink <span className="text-secondary">Property</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-3.5 text-xs font-medium lg:flex xl:gap-5 xl:text-[13px]">
          <Link href="/" className="text-foreground hover:text-secondary whitespace-nowrap transition-colors">
            Beranda
          </Link>
          <Link href="/properti" className="text-foreground hover:text-secondary whitespace-nowrap transition-colors">
            Katalog Properti
          </Link>
          <Link
            href="/titip-properti"
            className="text-foreground hover:text-secondary whitespace-nowrap transition-colors"
          >
            Titip Properti
          </Link>

          {/* Dropdown Tools Properti */}
          <div className="relative" onMouseLeave={() => setDropdownOpen(false)}>
            <button
              onMouseEnter={() => setDropdownOpen(true)}
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="text-foreground hover:text-secondary flex cursor-pointer items-center gap-1 py-2 whitespace-nowrap transition-colors"
            >
              Tools Properti{" "}
              <ChevronDown
                className={`h-4 w-4 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
              />
            </button>

            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.98 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="border-border absolute top-full left-0 z-50 w-60 space-y-1 rounded-2xl border bg-white py-2 shadow-xl"
                >
                  <Link
                    href="/kalkulator/kpr"
                    className="hover:bg-secondary/10 hover:text-secondary text-foreground flex items-center gap-3 px-4 py-2.5 text-xs font-semibold transition"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <div className="bg-secondary/10 text-secondary rounded-lg p-2">
                      <Calculator className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-bold">Kalkulator KPR</p>
                      <p className="text-muted-foreground text-[10px]">Simulasi cicilan bulanan</p>
                    </div>
                  </Link>

                  <Link
                    href="/properti/bandingkan"
                    className="hover:bg-secondary/10 hover:text-secondary text-foreground flex items-center gap-3 px-4 py-2.5 text-xs font-semibold transition"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <div className="bg-secondary/10 text-secondary rounded-lg p-2">
                      <Scale className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-bold">Bandingkan Properti</p>
                      <p className="text-muted-foreground text-[10px]">Bandingkan fitur dan nilai properti</p>
                    </div>
                  </Link>

                  <Link
                    href="/kalkulator/roi"
                    className="hover:bg-secondary/10 hover:text-secondary text-foreground flex items-center gap-3 px-4 py-2.5 text-xs font-semibold transition"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <div className="bg-secondary/10 text-secondary rounded-lg p-2">
                      <TrendingUp className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-bold">Kalkulator ROI</p>
                      <p className="text-muted-foreground text-[10px]">
                        Hitung hasil investasi properti
                      </p>
                    </div>
                  </Link>

                  <Link
                    href="/kalkulator/pajak"
                    className="hover:bg-secondary/10 hover:text-secondary text-foreground flex items-center gap-3 px-4 py-2.5 text-xs font-semibold transition"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <div className="bg-secondary/10 text-secondary rounded-lg p-2">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-bold">Estimasi Pajak (BPHTB)</p>
                      <p className="text-muted-foreground text-[10px]">Pajak pembeli properti</p>
                    </div>
                  </Link>

                  <Link
                    href="/kalkulator/notaris"
                    className="hover:bg-secondary/10 hover:text-secondary text-foreground flex items-center gap-3 px-4 py-2.5 text-xs font-semibold transition"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <div className="bg-secondary/10 text-secondary rounded-lg p-2">
                      <Landmark className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-bold">Biaya Notaris</p>
                      <p className="text-muted-foreground text-[10px]">AJB, BBN, & Akta Notaris</p>
                    </div>
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link href="/artikel" className="text-foreground hover:text-secondary whitespace-nowrap transition-colors">
            Artikel
          </Link>
          <Link
            href="/tentang-kami"
            className="text-foreground hover:text-secondary whitespace-nowrap transition-colors"
          >
            Tentang Kami
          </Link>
        </nav>

        {/* Tombol Auth / Panel Admin Desktop */}
        <div className="hidden shrink-0 items-center lg:flex">
          {isLoading ? (
            <div className="flex h-9 w-24 items-center justify-center rounded-full bg-slate-100">
              <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
            </div>
          ) : user ? (
            isAdmin ? (
              <Link
                href="/admin"
                className="flex cursor-pointer items-center gap-2 rounded-full border border-amber-500/40 bg-slate-900 px-4 py-2 text-xs font-semibold tracking-wide text-white shadow-sm transition-all duration-300 hover:bg-slate-800 hover:shadow-md"
              >
                <Shield className="h-3.5 w-3.5 text-amber-400" />
                <span>Panel Admin</span>
              </Link>
            ) : (
              <Link
                href="/dashboard/member"
                className="bg-primary hover:bg-primary/90 flex cursor-pointer items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold tracking-wide text-white shadow-sm transition-all duration-300 hover:shadow-md"
              >
                <User className="h-3.5 w-3.5" />
                <span>Dashboard Member</span>
              </Link>
            )
          ) : (
            <Link
              href="/login"
              className="text-primary bg-primary/5 border-primary/15 hover:bg-primary group flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold tracking-wide shadow-sm transition-all duration-300 hover:border-transparent hover:text-white hover:shadow-md"
            >
              <LogIn className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              <span>Masuk</span>
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="text-foreground cursor-pointer p-2 lg:hidden"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Menu"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="border-border absolute top-20 left-0 max-h-[calc(100vh-5rem)] w-full overflow-y-auto border-b bg-white py-4 shadow-lg lg:hidden"
          >
            <div className="container mx-auto flex flex-col gap-2 px-4 text-sm">
              <Link
                href="/"
                className="text-foreground hover:text-secondary border-border/50 border-b py-2 font-medium"
                onClick={() => setIsOpen(false)}
              >
                Beranda
              </Link>
              <Link
                href="/properti"
                className="text-foreground hover:text-secondary border-border/50 border-b py-2 font-medium"
                onClick={() => setIsOpen(false)}
              >
                Katalog Properti
              </Link>
              <Link
                href="/titip-properti"
                className="text-foreground hover:text-secondary border-border/50 border-b py-2 font-medium"
                onClick={() => setIsOpen(false)}
              >
                Titip Properti
              </Link>

              {/* Sub-menu Tools Properti untuk Mobile */}
              <div className="border-border/50 flex flex-col gap-2 border-b py-2">
                <span className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
                  Tools Properti
                </span>
                <Link
                  href="/kalkulator/kpr"
                  className="text-foreground hover:text-secondary flex items-center gap-2 py-1 pl-3 text-sm font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  <Calculator className="text-secondary h-4 w-4" /> Kalkulator KPR
                </Link>
                <Link
                  href="/properti/bandingkan"
                  className="text-foreground hover:text-secondary flex items-center gap-2 py-1 pl-3 text-sm font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  <Scale className="text-secondary h-4 w-4" /> Bandingkan Properti
                </Link>
                <Link
                  href="/kalkulator/roi"
                  className="text-foreground hover:text-secondary flex items-center gap-2 py-1 pl-3 text-sm font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  <TrendingUp className="text-secondary h-4 w-4" /> Kalkulator ROI
                </Link>
                <Link
                  href="/kalkulator/pajak"
                  className="text-foreground hover:text-secondary flex items-center gap-2 py-1 pl-3 text-sm font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  <FileText className="text-secondary h-4 w-4" /> Estimasi Pajak (BPHTB)
                </Link>
                <Link
                  href="/kalkulator/notaris"
                  className="text-foreground hover:text-secondary flex items-center gap-2 py-1 pl-3 text-sm font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  <Landmark className="text-secondary h-4 w-4" /> Biaya Notaris
                </Link>
              </div>

              <Link
                href="/artikel"
                className="text-foreground hover:text-secondary border-border/50 border-b py-2 font-medium"
                onClick={() => setIsOpen(false)}
              >
                Artikel
              </Link>
              <Link
                href="/tentang-kami"
                className="text-foreground hover:text-secondary border-border/50 border-b py-2 font-medium"
                onClick={() => setIsOpen(false)}
              >
                Tentang Kami
              </Link>

              {/* Tombol Auth / Panel Admin Mobile */}
              {isLoading ? (
                <div className="mt-3 flex items-center justify-center py-3">
                  <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
                </div>
              ) : user ? (
                isAdmin ? (
                  <Link
                    href="/admin"
                    className="mt-3 flex items-center justify-center gap-2 rounded-xl border border-amber-500/40 bg-slate-900 px-6 py-3 text-center font-medium text-white shadow-sm transition-all duration-300 hover:bg-slate-800"
                    onClick={() => setIsOpen(false)}
                  >
                    <Shield className="h-4 w-4 text-amber-400" /> Panel Admin
                  </Link>
                ) : (
                  <Link
                    href="/dashboard/member"
                    className="bg-primary hover:bg-primary/90 mt-3 flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-center font-medium text-white shadow-sm transition-all duration-300"
                    onClick={() => setIsOpen(false)}
                  >
                    <User className="h-4 w-4" /> Dashboard Member
                  </Link>
                )
              ) : (
                <Link
                  href="/login"
                  className="bg-primary/5 border-primary/15 text-primary hover:bg-primary mt-3 flex items-center justify-center gap-2 rounded-xl border px-6 py-3 text-center font-medium shadow-sm transition-all duration-300 hover:text-white"
                  onClick={() => setIsOpen(false)}
                >
                  <LogIn className="h-4 w-4" /> Masuk
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}