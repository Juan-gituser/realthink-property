"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  Calculator,
  TrendingUp,
  FileText,
  Landmark,
  Sparkles,
  Star,
} from "lucide-react";

export default function Footer() {
  const pathname = usePathname();

  // Sembunyikan Footer jika sedang di halaman /login, /daftar, atau halaman admin
  const isAuthPage = pathname === "/login" || pathname === "/daftar";
  const isAdminPage = pathname?.startsWith("/admin");

  if (isAuthPage || isAdminPage) {
    return null;
  }

  return (
    <footer className="bg-primary border-primary/20 border-t pt-16 pb-12 text-white">
      <div className="container mx-auto px-4">
        <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Kolom Brand */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="group flex items-center gap-2">
              <div className="bg-secondary text-primary flex h-10 w-10 items-center justify-center rounded-xl font-bold shadow-md">
                <Building2 className="h-5 w-5" />
              </div>
              <div>
                <span className="font-heading block text-lg leading-tight font-extrabold tracking-tight">
                  Realthink
                </span>
                <span className="text-secondary block text-[10px] font-bold tracking-widest uppercase">
                  Property
                </span>
              </div>
            </Link>
            <p className="text-xs leading-relaxed text-gray-400">
              Platform terpercaya untuk menemukan hunian impian, apartemen, ruko, hingga kalkulasi
              investasi properti masa depan Anda.
            </p>
          </div>

          {/* Kolom Navigasi Utama */}
          <div className="space-y-3">
            <h4 className="font-heading text-secondary text-sm font-bold tracking-wider uppercase">
              Navigasi Utama
            </h4>
            <ul className="space-y-2 text-xs text-gray-300">
              <li>
                <Link href="/" className="hover:text-secondary transition-colors">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/properti" className="hover:text-secondary transition-colors">
                  Katalog Properti
                </Link>
              </li>
              <li>
                <Link href="/titip-properti" className="hover:text-secondary transition-colors">
                  Titip Jual / Sewa
                </Link>
              </li>
              <li>
                <Link href="/artikel" className="hover:text-secondary transition-colors">
                  Artikel & Berita
                </Link>
              </li>
              <li>
                <Link href="/tentang-kami" className="hover:text-secondary transition-colors">
                  Tentang Kami
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolom Fitur Premium & Tools Properti */}
          <div className="space-y-3">
            <h4 className="font-heading text-secondary flex items-center gap-1.5 text-sm font-bold tracking-wider uppercase">
              <Sparkles className="text-secondary h-3.5 w-3.5" /> Fitur Premium
            </h4>
            <ul className="space-y-2 text-xs text-gray-300">
              <li>
                <Link
                  href="/property-financial-planner"
                  className="hover:text-secondary flex items-center gap-2 transition-colors"
                >
                  <Calculator className="text-secondary h-3.5 w-3.5 shrink-0" /> Financial Planner
                </Link>
              </li>
              <li>
                <Link
                  href="/properti/rekomendasi"
                  className="hover:text-secondary flex items-center gap-2 transition-colors"
                >
                  <Star className="text-secondary h-3.5 w-3.5 shrink-0" /> Rekomendasi Properti
                </Link>
              </li>
            </ul>

            <h4 className="font-heading text-secondary pt-2 text-sm font-bold tracking-wider uppercase">
              Tools Properti
            </h4>
            <ul className="space-y-2 text-xs text-gray-300">
              <li>
                <Link
                  href="/kalkulator/kpr"
                  className="hover:text-secondary flex items-center gap-1.5 transition-colors"
                >
                  <Calculator className="text-secondary h-3.5 w-3.5 shrink-0" /> Kalkulator KPR
                </Link>
              </li>
              <li>
                <Link
                  href="/kalkulator/roi"
                  className="hover:text-secondary flex items-center gap-1.5 transition-colors"
                >
                  <TrendingUp className="text-secondary h-3.5 w-3.5 shrink-0" /> Kalkulator ROI
                  Investasi
                </Link>
              </li>
              <li>
                <Link
                  href="/kalkulator/pajak"
                  className="hover:text-secondary flex items-center gap-1.5 transition-colors"
                >
                  <FileText className="text-secondary h-3.5 w-3.5 shrink-0" /> Estimasi Pajak
                  (BPHTB)
                </Link>
              </li>
              <li>
                <Link
                  href="/kalkulator/notaris"
                  className="hover:text-secondary flex items-center gap-1.5 transition-colors"
                >
                  <Landmark className="text-secondary h-3.5 w-3.5 shrink-0" /> Biaya Notaris
                </Link>
              </li>
              <li>
                <Link
                  href="/properti/bandingkan"
                  className="hover:text-secondary flex items-center gap-1.5 transition-colors"
                >
                  <Star className="text-secondary h-3.5 w-3.5 shrink-0" /> Bandingkan Properti
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolom Kontak */}
          <div className="space-y-3">
            <h4 className="font-heading text-secondary text-sm font-bold tracking-wider uppercase">
              Hubungi Kami
            </h4>
            <ul className="space-y-2.5 text-xs text-gray-300">
              <li className="flex items-start gap-2">
                <MapPin className="text-secondary mt-0.5 h-4 w-4 shrink-0" />
                <span>DKI Jakarta, Jakarta Timur </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="text-secondary h-4 w-4 shrink-0" />
                <span>+62 838-7241-5878</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="text-secondary h-4 w-4 shrink-0" />
                <span>realthinkproperty@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/10 pt-8 text-center text-xs text-gray-400">
          <p>&copy; {new Date().getFullYear()} Realthink Property. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
