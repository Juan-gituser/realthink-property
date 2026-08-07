"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  BookOpen,
  CheckCircle2,
  Clock,
  Calendar,
} from "lucide-react";

interface AdminArticleItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  author: string;
  status: "published" | "draft";
  published_at: string | null;
  cover_image: string | null;
}

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<AdminArticleItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [selectedStatus, setSelectedStatus] = useState("Semua");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [, setDeleteLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const query = new URLSearchParams();
      if (selectedStatus !== "Semua") {
        query.set("status", selectedStatus);
      }
      if (selectedCategory !== "Semua") {
        query.set("category", selectedCategory);
      }
      if (searchQuery.trim()) {
        query.set("query", searchQuery.trim());
      }

      const response = await fetch(`/api/admin/articles?${query.toString()}`);

      // Mencegah throw error jika response status bukan OK (misal 404/500)
      if (!response.ok) {
        const errorJson = await response.json().catch(() => null);
        setError(
          errorJson?.error || `Gagal memuat artikel. (Status: ${response.status})`
        );
        return;
      }

      const json = await response.json();

      if (!json.success) {
        setError(json.error || "Gagal memuat daftar artikel.");
        return;
      }

      setArticles(json.data ?? []);
    } catch (err) {
      console.error(err);
      setError("Terjadi kesalahan koneksi saat memuat artikel.");
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedCategory, selectedStatus]);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      await fetchArticles();
    };

    if (isMounted) {
      loadData();
    }

    return () => {
      isMounted = false;
    };
  }, [fetchArticles]);

  const formatPublishedDate = (publishedAt: string | null) => {
    if (!publishedAt) return "-";
    try {
      return new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(new Date(publishedAt));
    } catch {
      return publishedAt;
    }
  };

  // Filter Data
  const filteredArticles = useMemo(() => {
    return articles.filter((item) => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "Semua" || item.category === selectedCategory;
      const matchesStatus = selectedStatus === "Semua" || item.status === selectedStatus;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [articles, searchQuery, selectedCategory, selectedStatus]);

  // Handler Hapus
  const handleDelete = async (id: string | null) => {
    if (!id) return;

    setDeleteLoading(true);
    setError(null);

    try {
      const query = new URLSearchParams({ id });
      const response = await fetch(`/api/admin/articles?${query.toString()}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorJson = await response.json().catch(() => null);
        setError(errorJson?.error || "Gagal menghapus artikel.");
        return;
      }

      const json = await response.json();

      if (!json.success) {
        setError(json.error || "Gagal menghapus artikel.");
        return;
      }

      setArticles((prev) => prev.filter((a) => a.id !== id));
      setDeleteId(null);
    } catch (err) {
      console.error(err);
      setError("Gagal menghapus artikel. Silakan coba lagi.");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6">
      {/* Header & Button */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-heading text-2xl font-bold text-gray-900">
            Kelola Artikel & Edukasi
          </h1>
          <p className="text-sm text-gray-500">
            Publikasikan panduan, wawasan pasar, dan tips properti untuk pengunjung.
          </p>
        </div>
        <Link
          href="/admin/articles/create"
          className="bg-primary hover:bg-primary/90 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition"
        >
          <Plus className="h-4 w-4" /> Tulis Artikel Baru
        </Link>
      </div>

      {/* Ringkasan Ringkas */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="rounded-lg bg-blue-50 p-2.5 text-blue-600">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500">Total Artikel</p>
            <p className="text-xl font-bold text-gray-900">{articles.length}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="rounded-lg bg-emerald-50 p-2.5 text-emerald-600">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500">Published</p>
            <p className="text-xl font-bold text-gray-900">
              {articles.filter((a) => a.status === "published").length}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="rounded-lg bg-amber-50 p-2.5 text-amber-600">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500">Draft</p>
            <p className="text-xl font-bold text-gray-900">
              {articles.filter((a) => a.status === "draft").length}
            </p>
          </div>
        </div>
      </div>

      {/* Filter Panel */}
      <div className="grid grid-cols-1 gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm md:grid-cols-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Cari judul artikel..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="focus:ring-secondary w-full rounded-lg border py-2 pr-3 pl-9 text-sm outline-none focus:ring-1"
          />
        </div>

        {/* Filter Kategori */}
        <div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="focus:ring-secondary w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none focus:ring-1"
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
            className="focus:ring-secondary w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none focus:ring-1"
          >
            <option value="Semua">Semua Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      {/* Tabel Artikel */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-xs font-semibold tracking-wider text-gray-600 uppercase">
                <th className="p-4">Artikel</th>
                <th className="p-4">Kategori</th>
                <th className="p-4">Penulis</th>
                <th className="p-4">Status</th>
                <th className="p-4">Tanggal Tanggal</th>
                <th className="p-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">
                    Memuat artikel...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-red-500">
                    {error}
                  </td>
                </tr>
              ) : filteredArticles.length > 0 ? (
                filteredArticles.map((article) => (
                  <tr key={article.id} className="transition hover:bg-gray-50/80">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
                          <Image
                            src={article.cover_image || "/placeholder-property.jpg"}
                            alt={article.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <p className="line-clamp-2 max-w-md font-semibold text-gray-900">
                          {article.title}
                        </p>
                      </div>
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <span className="rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
                        {article.category}
                      </span>
                    </td>
                    <td className="p-4 whitespace-nowrap text-gray-600">{article.author}</td>
                    <td className="p-4 whitespace-nowrap">
                      {article.status === "published" ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-800">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                          Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-800">
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
                          Draft
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-xs whitespace-nowrap text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-gray-400" />
                        {formatPublishedDate(article.published_at)}
                      </div>
                    </td>
                    <td className="p-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-2">
                        <Link
                          href={`/artikel/${article.slug}`}
                          target="_blank"
                          title="Lihat Artikel"
                          className="hover:text-primary rounded-lg p-2 text-gray-500 transition hover:bg-gray-100"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <Link
                          href={`/admin/articles/edit/${article.id}`}
                          title="Edit Artikel"
                          className="rounded-lg p-2 text-gray-500 transition hover:bg-blue-50 hover:text-blue-600"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => setDeleteId(article.id)}
                          title="Hapus Artikel"
                          className="rounded-lg p-2 text-gray-500 transition hover:bg-rose-50 hover:text-rose-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">
                    Tidak ada artikel yang ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Hapus */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm space-y-4 rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-bold text-gray-900">Hapus Artikel Ini?</h3>
            <p className="text-sm text-gray-500">Artikel yang dihapus tidak dapat dikembalikan.</p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteId(null)}
                className="rounded-lg px-4 py-2 text-sm font-semibold text-gray-600 transition hover:bg-gray-100"
              >
                Batal
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-rose-700"
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