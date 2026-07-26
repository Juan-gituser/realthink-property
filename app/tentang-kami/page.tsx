import { Building2, ShieldCheck, Award, Users, PhoneCall } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto max-w-5xl space-y-12 px-4">
        {/* Banner Section */}
        <div className="mx-auto max-w-2xl space-y-4 text-center">
          <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold tracking-wider text-amber-600 uppercase">
            Tentang Realthink
          </span>
          <h1 className="font-heading text-3xl font-bold text-gray-900 md:text-4xl">
            Partner Terpercaya Solusi Properti Anda
          </h1>
          <p className="text-sm leading-relaxed text-gray-600 md:text-base">
            Kami hadir untuk membantu Anda menemukan hunian impian dan investasi properti bernilai
            tinggi dengan proses yang transparan dan aman.
          </p>
        </div>

        {/* Keunggulan */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="space-y-3 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 font-bold text-amber-600">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="font-heading font-bold text-gray-900">Legalitas Terjamin</h3>
            <p className="text-xs leading-relaxed text-gray-500">
              Setiap listing properti telah melalui proses verifikasi dokumen dan legalitas yang
              lengkap.
            </p>
          </div>

          <div className="space-y-3 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 font-bold text-amber-600">
              <Award className="h-5 w-5" />
            </div>
            <h3 className="font-heading font-bold text-gray-900">Layanan Profesional</h3>
            <p className="text-xs leading-relaxed text-gray-500">
              Agen berpengalaman kami siap memberikan konsultasi terbaik dari proses survei hingga
              akad.
            </p>
          </div>

          <div className="space-y-3 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 font-bold text-amber-600">
              <Users className="h-5 w-5" />
            </div>
            <h3 className="font-heading font-bold text-gray-900">Transparansi Harga</h3>
            <p className="text-xs leading-relaxed text-gray-500">
              Jaminan harga transparan langsung dari pemilik tanpa biaya tersembunyi.
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="flex flex-col items-center justify-between gap-6 rounded-3xl bg-slate-900 p-8 text-white md:flex-row md:p-10">
          <div className="space-y-2 text-center md:text-left">
            <h2 className="font-heading text-xl font-bold md:text-2xl">
              Punya Pertanyaan Seputar Properti?
            </h2>
            <p className="text-xs text-slate-300 md:text-sm">
              Tim konsultan kami siap membantu menjawab pertanyaan dan kebutuhan properti Anda.
            </p>
          </div>
          <Link
            href="https://wa.me/6283872415878"
            target="_blank"
            className="flex shrink-0 items-center gap-2 rounded-xl bg-amber-500 px-6 py-3 text-sm font-bold text-slate-950 transition hover:bg-amber-600"
          >
            <PhoneCall className="h-4 w-4" /> Hubungi Kami
          </Link>
        </div>
      </div>
    </div>
  );
}
