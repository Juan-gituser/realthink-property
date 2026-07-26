"use client";

import Link from "next/link";
import Image from "next/image";
import { BookOpen, Calendar, ArrowRight, User } from "lucide-react";

// Sample Data Artikel (Bisa diintegrasikan ke Supabase tabel articles nantinya)
const ARTICLES = [
  {
    id: "1",
    title: "Tips Membeli Rumah Pertama untuk Generasi Milenial",
    slug: "tips-membeli-rumah-pertama-milenial",
    category: "Panduan Properti",
    excerpt:
      "Langkah-langkah strategis mengatur keuangan dan memilih properti pertama agar tidak salah pilih.",
    author: "Tim Realthink",
    date: "20 Jul 2026",
    imageUrl:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "2",
    title: "Memahami Biaya Pajak BPHTB dan Notaris dalam Transaksi Jual Beli",
    slug: "memahami-biaya-pajak-bphtb-dan-notaris",
    category: "Legal & Pajak",
    excerpt:
      "Rincian biaya legalitas yang wajib Anda siapkan saat membeli rumah agar transaksi berjalan lancar.",
    author: "Tim Realthink",
    date: "18 Jul 2026",
    imageUrl:
      "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "3",
    title: "Tren Desain Interior Rumah Minimalis Modern Tahun 2026",
    slug: "tren-desain-interior-rumah-minimalis-2026",
    category: "Inspirasi Desain",
    excerpt: "Inspirasi penataan ruang rumah minimalis yang nyaman, estetik, dan tetap fungsional.",
    author: "Tim Realthink",
    date: "15 Jul 2026",
    imageUrl:
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=600&q=80",
  },
];

export default function ArticlesPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="container mx-auto space-y-8 px-4">
        {/* Header */}
        <div className="max-w-2xl">
          <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold tracking-wider text-amber-600 uppercase">
            Edukasi & Tips
          </span>
          <h1 className="font-heading mt-3 text-3xl font-bold text-gray-900">
            Wawasan & Artikel Properti
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Panduan lengkap, informasi legalitas, dan tren seputar dunia properti di Indonesia.
          </p>
        </div>

        {/* Grid Artikel */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {ARTICLES.map((article) => (
            <article
              key={article.id}
              className="flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
            >
              <div className="relative h-48 w-full bg-gray-100">
                <Image src={article.imageUrl} alt={article.title} fill className="object-cover" />
                <span className="absolute top-3 left-3 rounded-md bg-slate-900/80 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-md">
                  {article.category}
                </span>
              </div>

              <div className="flex flex-1 flex-col justify-between space-y-4 p-5">
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <User className="h-3.5 w-3.5" /> {article.author}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" /> {article.date}
                    </span>
                  </div>
                  <h2 className="font-heading line-clamp-2 text-base font-bold text-gray-900 transition hover:text-amber-600">
                    {article.title}
                  </h2>
                  <p className="line-clamp-3 text-xs leading-relaxed text-gray-500">
                    {article.excerpt}
                  </p>
                </div>

                <Link
                  href={`/artikel/${article.slug}`}
                  className="inline-flex items-center gap-1.5 pt-2 text-xs font-semibold text-amber-600 hover:text-amber-700"
                >
                  Baca Selengkapnya <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
