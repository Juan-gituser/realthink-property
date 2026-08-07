import Link from "next/link";
import { ArrowLeft, BookOpen, Calendar, User, ExternalLink } from "lucide-react";
import type { Metadata } from "next";
import { ARTICLES, getArticleBySlug } from "@/data/articles";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    return {
      title: "Artikel Tidak Ditemukan | Realthink Property",
      description: "Artikel properti yang Anda cari tidak tersedia.",
    };
  }

  return {
    title: `${article.title} | Realthink Property`,
    description: article.description,
    keywords: [
      "artikel properti",
      article.title.toLowerCase(),
      "edukasi properti",
      "tips properti",
    ],
  };
}

export default async function ArticleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  const relatedArticles = ARTICLES.filter((item) => item.slug !== slug)
    .filter((item) => item.category === article?.category || !article)
    .slice(0, 3);

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-16">
        <div className="mx-auto max-w-3xl rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <h1 className="font-heading text-2xl font-bold text-gray-900">Artikel Tidak Ditemukan</h1>
          <p className="mt-2 text-sm text-gray-600">
            Artikel yang Anda cari belum tersedia. Kembali ke daftar artikel untuk melihat konten lain.
          </p>
          <Link href="/artikel" className="mt-5 inline-flex items-center text-sm font-semibold text-amber-600">
            Kembali ke daftar artikel
          </Link>
        </div>
      </div>
    );
  }

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    articleSection: article.category,
    author: {
      "@type": "Person",
      name: article.author,
    },
    publisher: {
      "@type": "Organization",
      name: "Realthink Property",
      url: "https://realthinkproperty.com",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://realthinkproperty.com/artikel/${article.slug}`,
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Beranda",
        item: "https://realthinkproperty.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Artikel",
        item: "https://realthinkproperty.com/artikel",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: article.title,
        item: `https://realthinkproperty.com/artikel/${article.slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="min-h-screen bg-gray-50 py-10">
        <div className="container mx-auto max-w-4xl px-4">
          <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="font-semibold text-amber-600 hover:text-amber-700">
              Beranda
            </Link>
            <span>/</span>
            <Link href="/artikel" className="font-semibold text-amber-600 hover:text-amber-700">
              Artikel
            </Link>
            <span>/</span>
            <span className="text-gray-500">{article.title}</span>
          </nav>

          <Link href="/artikel" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-amber-600 hover:text-amber-700">
            <ArrowLeft className="h-4 w-4" /> Kembali ke Artikel
          </Link>

        <article className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
          <div className="relative h-72 w-full bg-gray-100">
            <img src={article.imageUrl} alt={article.title} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-linear-to-t from-slate-950/70 via-slate-900/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <span className="inline-flex rounded-full bg-amber-500/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
                {article.category}
              </span>
              <h1 className="font-heading mt-3 text-3xl font-bold leading-tight">{article.title}</h1>
            </div>
          </div>

          <div className="space-y-6 p-6 md:p-8">
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-2"><User className="h-4 w-4" /> {article.author}</span>
              <span className="flex items-center gap-2"><Calendar className="h-4 w-4" /> {article.date}</span>
            </div>

            <p className="text-lg leading-relaxed text-gray-700">{article.description}</p>

            <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4 text-sm text-amber-900">
              <div className="flex items-center gap-2 font-semibold">
                <BookOpen className="h-4 w-4" /> Ringkasan inti
              </div>
              <p className="mt-2 leading-relaxed">{article.excerpt}</p>
            </div>

            <div className="space-y-4">
              {article.content.map((paragraph, index) => (
                <p key={index} className="leading-8 text-gray-700">{paragraph}</p>
              ))}
            </div>

            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
              <h2 className="font-heading text-lg font-bold text-gray-900">Sumber data</h2>
              <ul className="mt-3 space-y-2 text-sm text-gray-700">
                {article.sources.map((source) => (
                  <li key={source.name} className="flex items-center gap-2">
                    <ExternalLink className="h-4 w-4 text-amber-600" />
                    <a href={source.url} target="_blank" rel="noreferrer" className="text-amber-700 hover:underline">
                      {source.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {relatedArticles.length > 0 && (
              <div className="rounded-2xl border border-gray-200 bg-white p-5">
                <h2 className="font-heading text-lg font-bold text-gray-900">Artikel terkait</h2>
                <div className="mt-4 grid gap-4 md:grid-cols-3">
                  {relatedArticles.map((item) => (
                    <Link
                      key={item.slug}
                      href={`/artikel/${item.slug}`}
                      className="rounded-2xl border border-gray-200 p-4 transition hover:border-amber-400 hover:shadow-sm"
                    >
                      <p className="text-xs font-semibold uppercase tracking-wide text-amber-600">
                        {item.category}
                      </p>
                      <h3 className="mt-2 font-semibold text-gray-900">{item.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-gray-600 line-clamp-3">
                        {item.excerpt}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </article>
      </div>
    </div>
    </>
  );
}
