"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, Save, Image as ImageIcon, 
  FileText, Globe, CheckCircle, AlertCircle 
} from "lucide-react";

export default function CreateArticlePage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
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

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

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

  const handleSubmit = async (e: React.FormEvent) => {
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
    } catch (err) {
      setErrorMsg("Gagal menyimpan artikel. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/articles"
            className="p-2 border border-gray-200 rounded-lg hover:bg-gray-100 transition text-gray-600"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-heading font-bold text-gray-900">
              Tulis Artikel Baru
            </h1>
            <p className="text-xs text-gray-500">
              Buat wawasan, berita, atau panduan edukasi properti untuk pengunjung.
            </p>
          </div>
        </div>
      </div>

      {/* Error Notice */}
      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Form Area */}
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Konten Utama Artikel */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
            <FileText className="w-5 h-5 text-secondary" /> Informasi Utama
          </h2>

          <div className="space-y-4">
            {/* Judul Artikel */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Judul Artikel <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Contoh: Tips Membeli Rumah Pertama untuk Milenial"
                value={formData.title}
                onChange={handleTitleChange}
                className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-1 focus:ring-secondary"
                required
              />
            </div>

            {/* Slug URL */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Slug (URL Identifier)
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm bg-gray-50 font-mono text-gray-600 outline-none"
              />
            </div>

            {/* Kategori & Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Kategori
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-sm bg-white outline-none focus:ring-1 focus:ring-secondary"
                >
                  <option value="Panduan Properti">Panduan Properti</option>
                  <option value="Legal & Pajak">Legal & Pajak</option>
                  <option value="Inspirasi Desain">Inspirasi Desain</option>
                  <option value="Berita & Tren">Berita & Tren</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Status Dipublikasi
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-sm bg-white outline-none focus:ring-1 focus:ring-secondary"
                >
                  <option value="published">Published (Langsung Tayang)</option>
                  <option value="draft">Draft (Simpan Sementara)</option>
                </select>
              </div>
            </div>

            {/* Ringkasan / Excerpt */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Ringkasan Singkat (Excerpt) <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={2}
                placeholder="Rangkuman singkat artikel untuk ditampilkan di halaman depan/kartu artikel..."
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-1 focus:ring-secondary"
                required
              />
            </div>

            {/* Konten Lengkap */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Isi Konten Artikel <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={10}
                placeholder="Tuliskan isi artikel selengkapnya di sini..."
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-1 focus:ring-secondary"
                required
              />
            </div>
          </div>
        </div>

        {/* Media / Gambar Sampul */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-secondary" /> Gambar Utama
          </h2>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              URL Gambar Sampul (Unsplash / Supabase Storage)
            </label>
            <input
              type="text"
              placeholder="https://images.unsplash.com/..."
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-1 focus:ring-secondary"
            />
          </div>
        </div>

        {/* SEO Meta Data */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
            <Globe className="w-5 h-5 text-secondary" /> Pengaturan SEO (Opsional)
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Meta Title
              </label>
              <input
                type="text"
                placeholder="Judul khusus untuk hasil pencarian Google"
                value={formData.metaTitle}
                onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-1 focus:ring-secondary"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Meta Description
              </label>
              <textarea
                rows={2}
                placeholder="Deskripsi singkat untuk mesin pencari..."
                value={formData.metaDescription}
                onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-1 focus:ring-secondary"
              />
            </div>
          </div>
        </div>

        {/* Submit Action */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link
            href="/admin/articles"
            className="px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition"
          >
            Batal
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-semibold px-6 py-2.5 rounded-xl transition shadow disabled:opacity-50 text-sm"
          >
            <Save className="w-4 h-4" />
            {loading ? "Menyimpan..." : "Simpan Artikel"}
          </button>
        </div>

      </form>
    </div>
  );
}