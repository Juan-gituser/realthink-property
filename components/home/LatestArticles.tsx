import Link from "next/link";
import Image from "next/image";
import { Calendar, ArrowRight, BookOpen } from "lucide-react";
import { LATEST_ARTICLES } from "@/data/articles";

export default function LatestArticles() {
  return (
    <section className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <span className="text-secondary flex items-center gap-1.5 text-sm font-semibold tracking-wider uppercase">
            <BookOpen className="h-4 w-4" /> Artikel & Wawasan
          </span>
          <h2 className="font-heading text-primary mt-1 text-2xl font-bold md:text-3xl">
            Edukasi & Tips Properti Terbaru
          </h2>
        </div>
        <Link
          href="/artikel"
          className="text-primary hover:text-secondary group flex items-center gap-1 text-sm font-semibold transition-colors"
        >
          Lihat Semua Artikel{" "}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {/* Grid Artikel */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {LATEST_ARTICLES.map((article) => (
          <article
            key={article.id}
            className="bg-card border-border group flex flex-col overflow-hidden rounded-xl border transition-all duration-300 hover:shadow-lg"
          >
            {/* Image Thumbnail */}
            <div className="bg-muted relative h-48 w-full overflow-hidden">
              <Image
                src={article.imageUrl}
                alt={article.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <span className="bg-primary/90 text-primary-foreground absolute top-3 left-3 rounded-md px-2.5 py-1 text-xs font-medium backdrop-blur-sm">
                {article.category}
              </span>
            </div>

            {/* Content Body */}
            <div className="flex flex-1 flex-col justify-between gap-4 p-5">
              <div className="space-y-2">
                <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
                  <Calendar className="text-secondary h-3.5 w-3.5" />
                  <time>{article.date}</time>
                </div>

                <Link href={`/artikel/${article.slug}`}>
                  <h3 className="font-heading text-primary hover:text-secondary line-clamp-2 text-lg leading-snug font-bold transition-colors">
                    {article.title}
                  </h3>
                </Link>

                <p className="text-muted-foreground line-clamp-2 text-sm leading-relaxed">
                  {article.excerpt}
                </p>
              </div>

              <Link
                href={`/artikel/${article.slug}`}
                className="text-secondary mt-2 inline-flex items-center gap-1 text-sm font-semibold hover:underline"
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
