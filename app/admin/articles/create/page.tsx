"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Save,
  Image as ImageIcon,
  FileText,
  Globe,
  AlertCircle,
} from "lucide-react";

interface ArticleFormState {
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  status: string;
  metaTitle: string;
  metaDescription: string;
}

export default function CreateArticlePage() {
  const router = useRouter();

  const [formData, setFormData] = useState<ArticleFormState>({
    title: "",
    slug: "",
    category: "Panduan Properti",
    excerpt: "",
    content: "",
    imageUrl: "",
    status: "published",
    metaTitle: "",
    metaDescription: "",
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

  // Helper untuk generate slug otomatis saat judul diisi
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    const generatedSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");

    setFormData((prev) => ({
      ...prev,
      title,
      slug: generatedSlug,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    // Validasi Sederhana
    if (!formData.title || !formData.content || !formData.excerpt) {
      setErrorMsg("Mohon isi seluruh bidang wajib (Judul, Ringkasan, & Konten).");
      setLoading(false);
      return;
    }

    try {
      // TODO: Panggil Supabase Client untuk menyimpan data
      // const { error } = await supabase.from('articles').insert([formData]);

      // Simulasi delay request
      await new Promise((resolve) => setTimeout(resolve, 1000));

      router.push("/admin/articles");
    } catch {
      // Menggunakan optional catch binding untuk menghindari unused var warning
      setErrorMsg("Gagal menyimpan artikel. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/articles"
            className="rounded-lg border border-gray-200 p-2 text-gray-600 transition hover:bg-gray-100"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="font-heading text-2xl font-bold text-gray-900">Tulis Artikel Baru</h1>
            <p className="text-xs text-gray-500">
              Buat wawasan, berita, atau panduan edukasi properti untuk pengunjung.
            </p>
          </div>
        </div>
      </div>

      {/* Error Notice */}
      {errorMsg && (
        <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Form Area */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Konten Utama Artikel */}
        <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="flex items-center gap-2 border-b border-gray-100 pb-3 text-base font-bold text-gray-900">
            <FileText className="text-secondary h-5 w-5" /> Informasi Utama
          </h2>

          <div className="space-y-4">
            {/* Judul Artikel */}
            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-700">
                Judul Artikel <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Contoh: Tips Membeli Rumah Pertama untuk Milenial"
                value={formData.title}
                onChange={handleTitleChange}
                className="focus:ring-secondary w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-1"
                required
              />
            </div>

            {/* Slug URL */}
            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-700">
                Slug (URL Identifier)
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full rounded-lg border bg-gray-50 px-3 py-2 font-mono text-sm text-gray-600 outline-none"
              />
            </div>

            {/* Kategori & Status */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-700">Kategori</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="focus:ring-secondary w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none focus:ring-1"
                >
                  <option value="Panduan Properti">Panduan Properti</option>
                  <option value="Legal & Pajak">Legal & Pajak</option>
                  <option value="Inspirasi Desain">Inspirasi Desain</option>
                  <option value="Berita & Tren">Berita & Tren</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-700">
                  Status Dipublikasi
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="focus:ring-secondary w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none focus:ring-1"
                >
                  <option value="published">Published (Langsung Tayang)</option>
                  <option value="draft">Draft (Simpan Sementara)</option>
                </select>
              </div>
            </div>

            {/* Ringkasan / Excerpt */}
            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-700">
                Ringkasan Singkat (Excerpt) <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={2}
                placeholder="Rangkuman singkat artikel untuk ditampilkan di halaman depan/kartu artikel..."
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                className="focus:ring-secondary w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-1"
                required
              />
            </div>

            {/* Konten Lengkap */}
            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-700">
                Isi Konten Artikel <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={10}
                placeholder="Tuliskan isi artikel selengkapnya di sini..."
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="focus:ring-secondary w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-1"
                required
              />
            </div>
          </div>
        </div>

        {/* Media / Gambar Sampul */}
        <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="flex items-center gap-2 border-b border-gray-100 pb-3 text-base font-bold text-gray-900">
            <ImageIcon className="text-secondary h-5 w-5" /> Gambar Utama
          </h2>

          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-700">
              URL Gambar Sampul (Unsplash / Supabase Storage)
            </label>
            <input
              type="text"
              placeholder="https://images.unsplash.com/..."
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              className="focus:ring-secondary w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-1"
            />
          </div>
        </div>

        {/* SEO Meta Data */}
        <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="flex items-center gap-2 border-b border-gray-100 pb-3 text-base font-bold text-gray-900">
            <Globe className="text-secondary h-5 w-5" /> Pengaturan SEO (Opsional)
          </h2>

          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-700">Meta Title</label>
              <input
                type="text"
                placeholder="Judul khusus untuk hasil pencarian Google"
                value={formData.metaTitle}
                onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                className="focus:ring-secondary w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-1"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-700">
                Meta Description
              </label>
              <textarea
                rows={2}
                placeholder="Deskripsi singkat untuk mesin pencari..."
                value={formData.metaDescription}
                onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                className="focus:ring-secondary w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-1"
              />
            </div>
          </div>
        </div>

        {/* Submit Action */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link
            href="/admin/articles"
            className="rounded-xl px-5 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-100"
          >
            Batal
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="bg-primary hover:bg-primary/90 inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold text-white shadow transition disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {loading ? "Menyimpan..." : "Simpan Artikel"}
          </button>
        </div>
      </form>
    </div>
  );
}