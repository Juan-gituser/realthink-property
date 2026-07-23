import Link from "next/link";
import { Building2, Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-primary text-white pt-16 pb-8">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        {/* Brand */}
        <div className="space-y-4">
          <Link href="/" className="flex items-center gap-2">
            <Building2 className="w-8 h-8 text-secondary" />
            <span className="font-heading font-bold text-2xl text-white">
              Realthink <span className="text-secondary">Property</span>
            </span>
          </Link>
          <p className="text-gray-300 text-sm leading-relaxed">
            Platform properti profesional dan terpercaya. Temukan rumah impian dan peluang investasi terbaik bersama kami.
          </p>
        </div>

        {/* Menu */}
        <div>
          <h4 className="font-heading font-semibold text-lg mb-4 text-secondary">Menu Cepat</h4>
          <ul className="space-y-3 text-gray-300 text-sm">
            <li><Link href="/" className="hover:text-white transition">Home</Link></li>
            <li><Link href="/listing" className="hover:text-white transition">Cari Properti</Link></li>
            <li><Link href="/artikel" className="hover:text-white transition">Artikel & Berita</Link></li>
            <li><Link href="/tentang-kami" className="hover:text-white transition">Tentang Kami</Link></li>
          </ul>
        </div>

        {/* Kalkulator */}
        <div>
          <h4 className="font-heading font-semibold text-lg mb-4 text-secondary">Alat Properti</h4>
          <ul className="space-y-3 text-gray-300 text-sm">
            <li><Link href="/kalkulator/kpr" className="hover:text-white transition">Kalkulator KPR</Link></li>
            <li><Link href="/kalkulator/pajak" className="hover:text-white transition">Estimasi Pajak (BPHTB)</Link></li>
            <li><Link href="/kalkulator/notaris" className="hover:text-white transition">Biaya Notaris</Link></li>
          </ul>
        </div>

        {/* Kontak */}
        <div>
          <h4 className="font-heading font-semibold text-lg mb-4 text-secondary">Hubungi Kami</h4>
          <ul className="space-y-4 text-gray-300 text-sm">
            <li className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-secondary shrink-0" />
              <span>Jl. Contoh Alamat No. 123, Jakarta Selatan, Indonesia</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-secondary shrink-0" />
              <span>+62 812 3456 7890</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-secondary shrink-0" />
              <span>info@realthinkproperty.com</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="container mx-auto px-4 pt-8 border-t border-white/10 text-center text-sm text-gray-400">
        <p>&copy; {new Date().getFullYear()} Realthink Property. All rights reserved.</p>
      </div>
    </footer>
  );
}