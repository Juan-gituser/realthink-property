"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Plus, Search, Edit, Trash2, Eye, 
  BookOpen, CheckCircle2, Clock, FileText
} from "lucide-react";

// Data Dummy List Artikel Admin
const INITIAL_ARTICLES = [
  {
    id: "1",
    title: "Tips Membeli Rumah Pertama untuk Generasi Milenial",
    slug: "tips-membeli-rumah-pertama-milenial",
    category: "Panduan Properti",
    status: "published" as const, // published | draft
    author: "Admin Realthink",
    updatedAt: "20 Jul 2026",
    imageUrl: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "2",
    title: "Memahami Biaya Pajak BPHTB dan Notaris dalam Transaksi Jual Beli",
    slug: "memahami-biaya-pajak-bphtb-dan-notaris",
    category: "Legal & Pajak",
    status: "published" as const,
    author: "Tim Hukum",
    updatedAt: "18 Jul 2026",
    imageUrl: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "3",
    title: "Tren Desain Interior Rumah Minimalis Modern Tahun 2026",
    slug: "tren-desain-interior-rumah-minimalis-2026",
    category: "Inspirasi Desain",
    status: "draft" as const,
    author: "Redaksi",
    updatedAt: "15 Jul 2026",
    imageUrl: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=300&q=80",
  },
];

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState(INITIAL_ARTICLES);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [selectedStatus, setSelectedStatus] = useState("Semua");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Filter Data Artikel
  const filteredArticles = useMemo(() => {
    return articles.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "Semua" || item.category === selectedCategory;

      const matchesStatus =
        selectedStatus === "Semua" || item.status === selectedStatus;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [articles, searchQuery, selectedCategory, selectedStatus]);

  // Handler Hapus Artikel
  const handleDelete = (id: string) => {
    setArticles((prev) => prev.filter((a) => a.id !== id));
    setDeleteId(null);
  };

  // Ringkasan Statistik
  const stats = useMemo(() => {
    return {
      total: articles.length,
      published: articles.filter((a) => a.status === "published").length,
      draft: articles.filter((a) => a.status === "draft").length,
    };
  }, [articles]);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* Header & Action Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-gray-900">
            Kelola Artikel & Edukasi
          </h1>
          <p className="text-sm text-gray-500">
            Daftar seluruh artikel berita, wawasan, dan panduan properti.
          </p>
        </div>
        <Link
          href="/admin/articles/create"
          className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white font-semibold px-4 py-2.5 rounded-xl transition shadow-sm text-sm"
        >
          <Plus className="w-4 h-4" /> Tulis Artikel Baru
        </Link>
      </div>

      {/* Ringkasan Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Total Artikel</p>
            <p className="text-xl font-bold text-gray-900">{stats.total}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-3">
          <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Published</p>
            <p className="text-xl font-bold text-gray-900">{stats.published}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-3">
          <div className="p-2.5 bg-amber-50 text-amber-600 rounded-lg">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Draft</p>
            <p className="text-xl font-bold text-gray-900">{stats.draft}</p>
          </div>
        </div>
      </div>

      {/* Panel Filter */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Cari judul artikel atau kata kunci..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm outline-none focus:ring-1 focus:ring-secondary"
            />
          </div>

          {/* Filter Kategori */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full py-2 px-3 border rounded-lg text-sm bg-white outline-none focus:ring-1 focus:ring-secondary"
            >
              <option value="Semua">Semua Kategori</option>
              <option value="Panduan Properti">Panduan Properti</option>
              <option value="Legal & Pajak">Legal & Pajak</option>
              <option value="Inspirasi Desain">Inspirasi Desain</option>
            </select>
          </div>

          {/* Filter Status */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full py-2 px-3 border rounded-lg text-sm bg-white outline-none focus:ring-1 focus:ring-secondary"
            >
              <option value="Semua">Semua Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>

        </div>
      </div>

      {/* Tabel Data Artikel */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase font-semibold text-gray-600 tracking-wider">
                <th className="p-4">Artikel</th>
                <th className="p-4">Kategori</th>
                <th className="p-4">Penulis</th>
                <th className="p-4">Status</th>
                <th className="p-4">Tanggal Update</th>
                <th className="p-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-sm">
              {filteredArticles.length > 0 ? (
                filteredArticles.map((article) => (
                  <tr key={article.id} className="hover:bg-gray-50/80 transition">
                    
                    {/* Thumbnail & Title */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-14 h-14 rounded-lg overflow-hidden border border-gray-200 bg-gray-100 shrink-0">
                          <Image
                            src={article.imageUrl}
                            alt={article.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <p className="font-semibold text-gray-900 line-clamp-2 max-w-xs">
                          {article.title}
                        </p>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="p-4 whitespace-nowrap font-medium text-gray-700">
                      {article.category}
                    </td>

                    {/* Author */}
                    <td className="p-4 whitespace-nowrap text-gray-600 text-xs">
                      {article.author}
                    </td>

                    {/* Status Badge */}
                    <td className="p-4 whitespace-nowrap">
                      {article.status === "published" ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                          Draft
                        </span>
                      )}
                    </td>

                    {/* Date */}
                    <td className="p-4 whitespace-nowrap text-xs text-gray-500">
                      {article.updatedAt}
                    </td>

                    {/* Actions */}
                    <td className="p-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-2">
                        {/* View */}
                        <Link
                          href={`/artikel/${article.slug}`}
                          target="_blank"
                          title="Lihat Artikel"
                          className="p-2 text-gray-500 hover:text-primary hover:bg-gray-100 rounded-lg transition"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>

                        {/* Edit */}
                        <Link
                          href={`/admin/articles/edit/${article.id}`}
                          title="Edit Artikel"
                          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>

                        {/* Delete */}
                        <button
                          onClick={() => setDeleteId(article.id)}
                          title="Hapus Artikel"
                          className="p-2 text-gray-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">
                    Tidak ada artikel yang sesuai kriteria pencarian.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Modal Delete */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-xl">
            <h3 className="text-lg font-bold text-gray-900">Hapus Artikel Ini?</h3>
            <p className="text-sm text-gray-500">
              Artikel akan dihapus secara permanen dari basis data Anda.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-lg transition"
              >
                Batal
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="px-4 py-2 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition shadow"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}