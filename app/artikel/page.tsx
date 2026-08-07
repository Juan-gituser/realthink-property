"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Calendar, ArrowRight, User, Search, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { ARTICLES } from "@/data/articles";

export default function ArticlesPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const categories = ["Semua", ...Array.from(new Set(ARTICLES.map((article) => article.category)))];

  // Handler input pencarian
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1); // Reset halaman ke 1 saat pencarian berubah
  };

  // Handler filter kategori
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(1); // Reset halaman ke 1 saat kategori berubah
  };

  const filteredArticles = useMemo(() => {
    return ARTICLES.filter((article) => {
      const matchesSearch = `${article.title} ${article.excerpt} ${article.category}`
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesCategory =
        selectedCategory === "Semua" || article.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [search, selectedCategory]);

  const totalPages = Math.max(1, Math.ceil(filteredArticles.length / itemsPerPage));
  
  // Pastikan currentPage tidak melebihi totalPages tanpa menggunakan useEffect
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const startIndex = (safeCurrentPage - 1) * itemsPerPage;
  const paginatedArticles = filteredArticles.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="container mx-auto space-y-8 px-4">
        <div className="max-w-3xl">
          <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold tracking-wider text-amber-600 uppercase">
            Edukasi & Tips
          </span>
          <h1 className="font-heading mt-3 text-3xl font-bold text-gray-900">
            Wawasan & Artikel Properti
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Temukan panduan lengkap, informasi legalitas, dan tren terbaru seputar dunia properti di Indonesia.
          </p>
        </div>

        <div className="rounded-3xl border border-gray-200 bg-white p-4 shadow-sm md:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex-1">
              <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Search className="h-4 w-4 text-amber-600" /> Cari artikel
              </label>
              <div className="flex items-center rounded-2xl border border-gray-200 bg-gray-50 px-3 py-2.5">
                <input
                  type="text"
                  value={search}
                  onChange={handleSearchChange}
                  placeholder="Cari topik seperti KPR, investasi, desain..."
                  className="w-full bg-transparent text-sm text-gray-700 outline-none"
                />
              </div>
            </div>

            <div className="lg:min-w-64">
              <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Filter className="h-4 w-4 text-amber-600" /> Filter topik
              </label>
              <select
                value={selectedCategory}
                onChange={handleCategoryChange}
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-700 outline-none"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Menampilkan <span className="font-semibold text-gray-900">{filteredArticles.length}</span> artikel
          </p>
        </div>

        {filteredArticles.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center text-sm text-gray-600">
            Tidak ada artikel yang sesuai dengan pencarian atau filter saat ini.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {paginatedArticles.map((article) => (
              <article
                key={article.id}
                className="flex flex-col overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg"
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
        )}

        {totalPages > 1 && (
          <div className="flex flex-col items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-4 shadow-sm sm:flex-row">
            <p className="text-sm text-gray-600">
              Halaman <span className="font-semibold text-gray-900">{safeCurrentPage}</span> dari {totalPages}
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={safeCurrentPage === 1}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-600 transition hover:border-amber-400 hover:text-amber-600 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Halaman sebelumnya"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold transition ${
                    safeCurrentPage === page
                      ? "bg-amber-600 text-white"
                      : "border border-gray-200 text-gray-700 hover:border-amber-400 hover:text-amber-600"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={safeCurrentPage === totalPages}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-600 transition hover:border-amber-400 hover:text-amber-600 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Halaman berikutnya"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}