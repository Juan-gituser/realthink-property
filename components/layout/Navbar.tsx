"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Building2, ChevronDown, Calculator, FileText, Landmark, TrendingUp, Sparkles, Star, LogIn } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [premiumDropdownOpen, setPremiumDropdownOpen] = useState(false);

  // Jika sedang di halaman auth atau halaman admin, Navbar tidak dirender
  const isAuthPage = pathname === "/login" || pathname === "/daftar";
  const isAdminPage = pathname?.startsWith("/admin");
  
  if (isAuthPage || isAdminPage) {
    return null;
  }

  return (
    <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-border shadow-sm">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        {/* Logo Area */}
        <Link href="/" className="flex items-center gap-2 group">
          <Building2 className="w-8 h-8 text-secondary group-hover:text-primary transition-colors" />
          <span className="font-heading font-bold text-xl text-primary">
            Realthink <span className="text-secondary">Property</span>
          </span>
        </Link>

        {/* Desktop Nav - Ukuran font diperkecil menjadi text-[13px] */}
        <nav className="hidden md:flex items-center gap-6 font-medium text-[13px]">
          <Link href="/" className="text-foreground hover:text-secondary transition-colors">
            Beranda
          </Link>
          <Link href="/properti" className="text-foreground hover:text-secondary transition-colors">
            Katalog Properti
          </Link>
          <Link href="/titip-properti" className="text-foreground hover:text-secondary transition-colors">
            Titip Properti
          </Link>

          {/* Dropdown Fitur Premium */}
          <div className="relative" onMouseLeave={() => setPremiumDropdownOpen(false)}>
            <button
              onMouseEnter={() => setPremiumDropdownOpen(true)}
              onClick={() => setPremiumDropdownOpen(!premiumDropdownOpen)}
              className="flex items-center gap-1.5 text-foreground hover:text-secondary transition-colors py-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Fitur Premium</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${premiumDropdownOpen ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence>
              {premiumDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.98 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="absolute top-full left-0 w-64 bg-white border border-border rounded-2xl shadow-xl p-2 space-y-1 z-50"
                >
                  <Link
                    href="/property-financial-planner"
                    className="flex items-start gap-3 p-3 rounded-xl hover:bg-amber-50/50 transition group"
                    onClick={() => setPremiumDropdownOpen(false)}
                  >
                    <div className="p-2 bg-amber-100 text-amber-700 rounded-lg group-hover:bg-amber-600 group-hover:text-white transition">
                      <Calculator className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-900 group-hover:text-amber-600 transition">
                        Financial Planner
                      </p>
                      <p className="text-[11px] text-muted-foreground">Simulasi KPR & Keuangan Properti</p>
                    </div>
                  </Link>

                  <Link
                    href="/rekomendasi-properti"
                    className="flex items-start gap-3 p-3 rounded-xl hover:bg-amber-50/50 transition group"
                    onClick={() => setPremiumDropdownOpen(false)}
                  >
                    <div className="p-2 bg-amber-100 text-amber-700 rounded-lg group-hover:bg-amber-600 group-hover:text-white transition">
                      <Star className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-900 group-hover:text-amber-600 transition">
                        Rekomendasi Properti
                      </p>
                      <p className="text-[11px] text-muted-foreground">Pilihan terbaik khusus untuk Anda</p>
                    </div>
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Dropdown Tools Properti */}
          <div className="relative" onMouseLeave={() => setDropdownOpen(false)}>
            <button
              onMouseEnter={() => setDropdownOpen(true)}
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-1 text-foreground hover:text-secondary transition-colors py-2 cursor-pointer"
            >
              Tools Properti{" "}
              <ChevronDown className={`w-4 h-4 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.98 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="absolute top-full left-0 w-60 bg-white border border-border rounded-2xl shadow-xl py-2 space-y-1 z-50"
                >
                  <Link
                    href="/kalkulator/kpr"
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-secondary/10 hover:text-secondary transition text-xs font-semibold text-foreground"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <div className="p-2 bg-secondary/10 text-secondary rounded-lg">
                      <Calculator className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold">Kalkulator KPR</p>
                      <p className="text-[10px] text-muted-foreground">Simulasi cicilan bulanan</p>
                    </div>
                  </Link>

                  <Link
                    href="/kalkulator/roi"
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-secondary/10 hover:text-secondary transition text-xs font-semibold text-foreground"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <div className="p-2 bg-secondary/10 text-secondary rounded-lg">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold">Kalkulator ROI</p>
                      <p className="text-[10px] text-muted-foreground">Hitung hasil investasi properti</p>
                    </div>
                  </Link>

                  <Link
                    href="/kalkulator/pajak"
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-secondary/10 hover:text-secondary transition text-xs font-semibold text-foreground"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <div className="p-2 bg-secondary/10 text-secondary rounded-lg">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold">Estimasi Pajak (BPHTB)</p>
                      <p className="text-[10px] text-muted-foreground">Pajak pembeli properti</p>
                    </div>
                  </Link>

                  <Link
                    href="/kalkulator/notaris"
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-secondary/10 hover:text-secondary transition text-xs font-semibold text-foreground"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <div className="p-2 bg-secondary/10 text-secondary rounded-lg">
                      <Landmark className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold">Biaya Notaris</p>
                      <p className="text-[10px] text-muted-foreground">AJB, BBN, & Akta Notaris</p>
                    </div>
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link href="/artikel" className="text-foreground hover:text-secondary transition-colors">
            Artikel & Berita
          </Link>
          <Link href="/tentang-kami" className="text-foreground hover:text-secondary transition-colors">
            Tentang Kami
          </Link>
        </nav>

        {/* Tombol Masuk Desktop (Aesthetic Style) */}
        <div className="hidden md:flex items-center">
          <Link
            href="/login"
            className="flex items-center gap-2 px-5 py-2 rounded-full text-xs font-semibold tracking-wide text-primary bg-primary/5 border border-primary/15 hover:bg-primary hover:text-white hover:border-transparent transition-all duration-300 shadow-sm hover:shadow-md group cursor-pointer"
          >
            <LogIn className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            <span>Masuk</span>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-foreground p-2 cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden absolute top-20 left-0 w-full bg-white border-b border-border py-4 shadow-lg max-h-[calc(100vh-5rem)] overflow-y-auto"
          >
            <div className="container mx-auto px-4 flex flex-col gap-2 text-sm">
              <Link
                href="/"
                className="text-foreground hover:text-secondary font-medium py-2 border-b border-border/50"
                onClick={() => setIsOpen(false)}
              >
                Beranda
              </Link>
              <Link
                href="/properti"
                className="text-foreground hover:text-secondary font-medium py-2 border-b border-border/50"
                onClick={() => setIsOpen(false)}
              >
                Katalog Properti
              </Link>
              <Link
                href="/titip-properti"
                className="text-foreground hover:text-secondary font-medium py-2 border-b border-border/50"
                onClick={() => setIsOpen(false)}
              >
                Titip Properti
              </Link>

              {/* Sub-menu Fitur Premium untuk Mobile */}
              <div className="py-2 border-b border-border/50 flex flex-col gap-2">
                <span className="text-xs font-bold text-amber-600 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> Fitur Premium
                </span>
                <Link
                  href="/property-financial-planner"
                  className="text-foreground hover:text-secondary text-sm font-medium pl-3 py-1 flex items-center gap-2"
                  onClick={() => setIsOpen(false)}
                >
                  <Calculator className="w-4 h-4 text-amber-500" /> Financial Planner
                </Link>
                <Link
                  href="/rekomendasi-properti"
                  className="text-foreground hover:text-secondary text-sm font-medium pl-3 py-1 flex items-center gap-2"
                  onClick={() => setIsOpen(false)}
                >
                  <Star className="w-4 h-4 text-amber-500" /> Rekomendasi Properti
                </Link>
              </div>

              {/* Sub-menu Tools Properti untuk Mobile */}
              <div className="py-2 border-b border-border/50 flex flex-col gap-2">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Tools Properti</span>
                <Link
                  href="/kalkulator/kpr"
                  className="text-foreground hover:text-secondary text-sm font-medium pl-3 py-1 flex items-center gap-2"
                  onClick={() => setIsOpen(false)}
                >
                  <Calculator className="w-4 h-4 text-secondary" /> Kalkulator KPR
                </Link>
                <Link
                  href="/kalkulator/roi"
                  className="text-foreground hover:text-secondary text-sm font-medium pl-3 py-1 flex items-center gap-2"
                  onClick={() => setIsOpen(false)}
                >
                  <TrendingUp className="w-4 h-4 text-secondary" /> Kalkulator ROI
                </Link>
                <Link
                  href="/kalkulator/pajak"
                  className="text-foreground hover:text-secondary text-sm font-medium pl-3 py-1 flex items-center gap-2"
                  onClick={() => setIsOpen(false)}
                >
                  <FileText className="w-4 h-4 text-secondary" /> Estimasi Pajak (BPHTB)
                </Link>
                <Link
                  href="/kalkulator/notaris"
                  className="text-foreground hover:text-secondary text-sm font-medium pl-3 py-1 flex items-center gap-2"
                  onClick={() => setIsOpen(false)}
                >
                  <Landmark className="w-4 h-4 text-secondary" /> Biaya Notaris
                </Link>
              </div>

              <Link
                href="/artikel"
                className="text-foreground hover:text-secondary font-medium py-2 border-b border-border/50"
                onClick={() => setIsOpen(false)}
              >
                Artikel
              </Link>
              <Link
                href="/tentang-kami"
                className="text-foreground hover:text-secondary font-medium py-2 border-b border-border/50"
                onClick={() => setIsOpen(false)}
              >
                Tentang Kami
              </Link>

              {/* Tombol Masuk Mobile (Aesthetic Style) */}
              <Link
                href="/login"
                className="flex items-center justify-center gap-2 bg-primary/5 border border-primary/15 text-primary text-center px-6 py-3 mt-3 rounded-xl font-medium hover:bg-primary hover:text-white transition-all duration-300 shadow-sm"
                onClick={() => setIsOpen(false)}
              >
                <LogIn className="w-4 h-4" /> Masuk
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}