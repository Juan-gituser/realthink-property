"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, Mail, Phone, MapPin, Calculator, TrendingUp, FileText, Landmark, Sparkles, Star } from "lucide-react";

export default function Footer() {
  const pathname = usePathname();

  // Sembunyikan Footer jika sedang di halaman /login, /daftar, atau halaman admin
  const isAuthPage = pathname === "/login" || pathname === "/daftar";
  const isAdminPage = pathname?.startsWith("/admin");
  
  if (isAuthPage || isAdminPage) {
    return null;
  }

  return (
    <footer className="bg-primary text-white pt-16 pb-12 border-t border-primary/20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Kolom Brand */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-secondary text-primary rounded-xl flex items-center justify-center font-bold shadow-md">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <span className="font-heading font-extrabold text-lg tracking-tight block leading-tight">
                  Realthink
                </span>
                <span className="text-[10px] font-bold text-secondary uppercase tracking-widest block">
                  Property
                </span>
              </div>
            </Link>
            <p className="text-gray-400 text-xs leading-relaxed">
              Platform terpercaya untuk menemukan hunian impian, apartemen, ruko, hingga kalkulasi investasi properti masa depan Anda.
            </p>
          </div>

          {/* Kolom Navigasi Utama */}
          <div className="space-y-3">
            <h4 className="font-heading font-bold text-sm uppercase tracking-wider text-secondary">
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
                <Link href="/properti/bandingkan" className="hover:text-secondary transition-colors">
                  Bandingkan Properti
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
            <h4 className="font-heading font-bold text-sm uppercase tracking-wider text-secondary flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-secondary" /> Fitur Premium
            </h4>
            <ul className="space-y-2 text-xs text-gray-300">
              <li>
                <Link href="/property-financial-planner" className="hover:text-secondary transition-colors flex items-center gap-2">
                  <Calculator className="w-3.5 h-3.5 text-secondary shrink-0" /> Financial Planner
                </Link>
              </li>
              <li>
                <Link href="/properti/rekomendasi" className="hover:text-secondary transition-colors flex items-center gap-2">
                  <Star className="w-3.5 h-3.5 text-secondary shrink-0" /> Rekomendasi Properti
                </Link>
              </li>
            </ul>

            <h4 className="font-heading font-bold text-sm uppercase tracking-wider text-secondary pt-2">
              Tools Properti
            </h4>
            <ul className="space-y-2 text-xs text-gray-300">
              <li>
                <Link href="/kalkulator/kpr" className="hover:text-secondary transition-colors flex items-center gap-1.5">
                  <Calculator className="w-3.5 h-3.5 text-secondary shrink-0" /> Kalkulator KPR
                </Link>
              </li>
              <li>
                <Link href="/kalkulator/roi" className="hover:text-secondary transition-colors flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-secondary shrink-0" /> Kalkulator ROI Investasi
                </Link>
              </li>
              <li>
                <Link href="/kalkulator/pajak" className="hover:text-secondary transition-colors flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-secondary shrink-0" /> Estimasi Pajak (BPHTB)
                </Link>
              </li>
              <li>
                <Link href="/kalkulator/notaris" className="hover:text-secondary transition-colors flex items-center gap-1.5">
                  <Landmark className="w-3.5 h-3.5 text-secondary shrink-0" /> Biaya Notaris
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolom Kontak */}
          <div className="space-y-3">
            <h4 className="font-heading font-bold text-sm uppercase tracking-wider text-secondary">
              Hubungi Kami
            </h4>
            <ul className="space-y-2.5 text-xs text-gray-300">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                <span>DKI Jakarta, Jakarta Timur </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-secondary shrink-0" />
                <span>+62 838-7241-5878</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-secondary shrink-0" />
                <span>realthinkproperty@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-white/10 text-center text-xs text-gray-400">
          <p>&copy; {new Date().getFullYear()} Realthink Property. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}