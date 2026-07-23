import Link from "next/link";
import Image from "next/image";
import { Calendar, ArrowRight, BookOpen } from "lucide-react";

// Data Dummy Artikel & Edukasi Properti
const LATEST_ARTICLES = [
  {
    id: "1",
    title: "Tips Membeli Rumah Pertama untuk Generasi Milenial",
    slug: "tips-membeli-rumah-pertama-milenial",
    category: "Panduan Properti",
    date: "20 Juli 2026",
    imageUrl:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80",
    excerpt:
      "Panduan lengkap memilih lokasi prospektif, simulasi KPR akurat, dan perencanaan keuangan jangka panjang.",
  },
  {
    id: "2",
    title: "Memahami Biaya Pajak BPHTB dan Notaris dalam Transaksi Jual Beli",
    slug: "memahami-biaya-pajak-bphtb-dan-notaris",
    category: "Legal & Pajak",
    date: "18 Juli 2026",
    imageUrl:
      "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80",
    excerpt:
      "Ketahui rincian biaya tambahan dan kelengkapan legalitas dokumen sebelum melakukan transaksi properti.",
  },
  {
    id: "3",
    title: "Tren Desain Interior Rumah Minimalis Modern Tahun 2026",
    slug: "tren-desain-interior-rumah-minimalis-2026",
    category: "Inspirasi Desain",
    date: "15 Juli 2026",
    imageUrl:
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80",
    excerpt:
      "Inspirasi penataan ruang, pencahayaan alami, dan pemilihan furnitur hemat tempat untuk hunian impian Anda.",
  },
];

export default function LatestArticles() {
  return (
    <section className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <span className="text-secondary font-semibold text-sm uppercase tracking-wider flex items-center gap-1.5">
            <BookOpen className="w-4 h-4" /> Artikel & Wawasan
          </span>
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-primary mt-1">
            Edukasi & Tips Properti Terbaru
          </h2>
        </div>
        <Link
          href="/artikel"
          className="text-primary hover:text-secondary font-semibold text-sm transition-colors flex items-center gap-1 group"
        >
          Lihat Semua Artikel{" "}
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {/* Grid Artikel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {LATEST_ARTICLES.map((article) => (
          <article
            key={article.id}
            className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col group"
          >
            {/* Image Thumbnail */}
            <div className="relative h-48 w-full overflow-hidden bg-muted">
              <Image
                src={article.imageUrl}
                alt={article.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-3 left-3 bg-primary/90 text-primary-foreground text-xs font-medium px-2.5 py-1 rounded-md backdrop-blur-sm">
                {article.category}
              </span>
            </div>

            {/* Content Body */}
            <div className="p-5 flex flex-col flex-1 justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Calendar className="w-3.5 h-3.5 text-secondary" />
                  <time>{article.date}</time>
                </div>

                <Link href={`/artikel/${article.slug}`}>
                  <h3 className="font-heading font-bold text-lg text-primary hover:text-secondary transition-colors line-clamp-2 leading-snug">
                    {article.title}
                  </h3>
                </Link>

                <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                  {article.excerpt}
                </p>
              </div>

              <Link
                href={`/artikel/${article.slug}`}
                className="text-sm font-semibold text-secondary hover:underline inline-flex items-center gap-1 mt-2"
              >
                Baca Selengkapnya &rarr;
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}