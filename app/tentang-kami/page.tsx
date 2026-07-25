import { Building2, ShieldCheck, Award, Users, PhoneCall } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-5xl space-y-12">
        
        {/* Banner Section */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="text-xs font-semibold text-amber-600 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full uppercase tracking-wider">
            Tentang Realthink
          </span>
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-gray-900">
            Partner Terpercaya Solusi Properti Anda
          </h1>
          <p className="text-gray-600 text-sm md:text-base leading-relaxed">
            Kami hadir untuk membantu Anda menemukan hunian impian dan investasi properti bernilai tinggi dengan proses yang transparan dan aman.
          </p>
        </div>

        {/* Keunggulan */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-3">
            <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-bold text-gray-900">Legalitas Terjamin</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Setiap listing properti telah melalui proses verifikasi dokumen dan legalitas yang lengkap.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-3">
            <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-bold text-gray-900">Layanan Profesional</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Agen berpengalaman kami siap memberikan konsultasi terbaik dari proses survei hingga akad.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-3">
            <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-bold text-gray-900">Transparansi Harga</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Jaminan harga transparan langsung dari pemilik tanpa biaya tersembunyi.
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-slate-900 text-white p-8 md:p-10 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h2 className="text-xl md:text-2xl font-heading font-bold">
              Punya Pertanyaan Seputar Properti?
            </h2>
            <p className="text-xs md:text-sm text-slate-300">
              Tim konsultan kami siap membantu menjawab pertanyaan dan kebutuhan properti Anda.
            </p>
          </div>
          <Link
            href="https://wa.me/6283872415878"
            target="_blank"
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-6 py-3 rounded-xl transition flex items-center gap-2 text-sm shrink-0"
          >
            <PhoneCall className="w-4 h-4" /> Hubungi Kami
          </Link>
        </div>

      </div>
    </div>
  );
}