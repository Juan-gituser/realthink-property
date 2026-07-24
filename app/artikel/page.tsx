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
    excerpt: "Langkah-langkah strategis mengatur keuangan dan memilih properti pertama agar tidak salah pilih.",
    author: "Tim Realthink",
    date: "20 Jul 2026",
    imageUrl: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "2",
    title: "Memahami Biaya Pajak BPHTB dan Notaris dalam Transaksi Jual Beli",
    slug: "memahami-biaya-pajak-bphtb-dan-notaris",
    category: "Legal & Pajak",
    excerpt: "Rincian biaya legalitas yang wajib Anda siapkan saat membeli rumah agar transaksi berjalan lancar.",
    author: "Tim Realthink",
    date: "18 Jul 2026",
    imageUrl: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "3",
    title: "Tren Desain Interior Rumah Minimalis Modern Tahun 2026",
    slug: "tren-desain-interior-rumah-minimalis-2026",
    category: "Inspirasi Desain",
    excerpt: "Inspirasi penataan ruang rumah minimalis yang nyaman, estetik, dan tetap fungsional.",
    author: "Tim Realthink",
    date: "15 Jul 2026",
    imageUrl: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=600&q=80",
  },
];

export default function ArticlesPage() {
  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="container mx-auto px-4 space-y-8">
        
        {/* Header */}
        <div className="max-w-2xl">
          <span className="text-xs font-semibold text-amber-600 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full uppercase tracking-wider">
            Edukasi & Tips
          </span>
          <h1 className="text-3xl font-heading font-bold text-gray-900 mt-3">
            Wawasan & Artikel Properti
          </h1>
          <p className="text-gray-600 text-sm mt-2">
            Panduan lengkap, informasi legalitas, dan tren seputar dunia properti di Indonesia.
          </p>
        </div>

        {/* Grid Artikel */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ARTICLES.map((article) => (
            <article
              key={article.id}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col"
            >
              <div className="relative h-48 w-full bg-gray-100">
                <Image
                  src={article.imageUrl}
                  alt={article.title}
                  fill
                  className="object-cover"
                />
                <span className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-xs px-2.5 py-1 rounded-md font-medium">
                  {article.category}
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5" /> {article.author}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> {article.date}
                    </span>
                  </div>
                  <h2 className="font-heading font-bold text-gray-900 text-base line-clamp-2 hover:text-amber-600 transition">
                    {article.title}
                  </h2>
                  <p className="text-xs text-gray-500 line-clamp-3 leading-relaxed">
                    {article.excerpt}
                  </p>
                </div>

                <Link
                  href={`/artikel/${article.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-600 hover:text-amber-700 pt-2"
                >
                  Baca Selengkapnya <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>

      </div>
    </div>
  );
}