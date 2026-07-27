// app/admin/articles/create/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { FileText, ImagePlus, X, Save, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

export default function CreateArticlePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Form State
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Tips Properti");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<"published" | "draft">("published");

  // State untuk Foto Sampul (Single)
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string>("");

  // State untuk Foto Lain / Galeri Artikel (Multiple)
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);

  // Helper untuk slug URL dari judul
  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  // Handler Foto Sampul
  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  const handleRemoveCover = () => {
    setCoverFile(null);
    setCoverPreview("");
  };

  // Handler Foto Lain / Galeri
  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const filesArray = Array.from(e.target.files);
    setGalleryFiles((prev) => [...prev, ...filesArray]);
    const newPreviews = filesArray.map((file) => URL.createObjectURL(file));
    setGalleryPreviews((prev) => [...prev, ...newPreviews]);
  };

  const handleRemoveGalleryItem = (index: number) => {
    setGalleryFiles((prev) => prev.filter((_, i) => i !== index));
    setGalleryPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // Handler Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      if (!coverFile) {
        throw new Error("Silakan pilih Foto Sampul artikel terlebih dahulu.");
      }

      // 1. Upload Foto Sampul ke Storage
      const coverExt = coverFile.name.split(".").pop();
      const coverFileName = `cover-${Date.now()}-${Math.random().toString(36).substring(2)}.${coverExt}`;
      const coverPath = `articles/${coverFileName}`;

      const { error: coverUploadError } = await supabase.storage
        .from("properties") // Menggunakan bucket storage yang sama (pastikan bucket sudah ada)
        .upload(coverPath, coverFile);

      if (coverUploadError) throw coverUploadError;

      const { data: coverUrlData } = supabase.storage
        .from("properties")
        .getPublicUrl(coverPath);

      const coverImageUrl = coverUrlData.publicUrl;

      // 2. Upload Foto Tambahan / Galeri (Jika ada)
      const galleryUrls: string[] = [];
      for (const file of galleryFiles) {
        const fileExt = file.name.split(".").pop();
        const fileName = `gallery-${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `articles/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("properties")
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from("properties")
          .getPublicUrl(filePath);

        galleryUrls.push(publicUrlData.publicUrl);
      }

      // 3. Buat Slug
      const slug = `${generateSlug(title)}-${Date.now().toString().slice(-4)}`;

      // 4. Simpan ke database tabel 'articles'
      const { error: dbError } = await supabase.from("articles").insert([
        {
          title,
          slug,
          category,
          content,
          status,
          cover_image: coverImageUrl, // URL Foto Sampul
          images: galleryUrls,        // Array URL Foto Tambahan
        },
      ]);

      if (dbError) throw dbError;

      alert("Artikel berhasil ditambahkan!");
      router.push("/admin/articles");
      router.refresh();
    } catch (err: unknown) {
      console.error(err);
      const errorMessage =
        err instanceof Error ? err.message : "Terjadi kesalahan saat menyimpan artikel.";
      setErrorMsg(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header Halaman */}
      <div className="flex flex-col justify-between gap-4 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/articles"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-gray-50 text-gray-600 transition hover:bg-gray-100"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <span className="mb-1 inline-block rounded-full bg-amber-50 px-3 py-1 text-[10px] font-bold tracking-widest text-amber-600 uppercase border border-amber-200">
              Manajemen Artikel
            </span>
            <h1 className="font-heading text-2xl font-bold text-gray-900">Tambah Artikel Baru</h1>
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-semibold text-rose-700 shadow-sm">
          ⚠️ {errorMsg}
        </div>
      )}

      {/* Form Tambah Artikel */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informasi Utama Artikel */}
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
            <div className="rounded-xl bg-amber-50 p-2.5 text-amber-600">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-900">Konten Artikel</h2>
              <p className="text-xs text-gray-500">Masukkan judul, kategori, dan isi artikel Anda.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-semibold text-gray-700">
                Judul Artikel <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: Tips Membeli Rumah Pertama Agar Tidak Tertipu"
                className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs text-gray-900 focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-gray-700">Kategori</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs text-gray-900 bg-white focus:border-amber-500 focus:outline-none"
              >
                <option value="Tips Properti">Tips Properti</option>
                <option value="Berita & Tren">Berita & Tren</option>
                <option value="Hukum & Legalitas">Hukum & Legalitas</option>
                <option value="Desain Interior">Desain Interior</option>
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-gray-700">Status Publikasi</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as "published" | "draft")}
                className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs text-gray-900 bg-white focus:border-amber-500 focus:outline-none"
              >
                <option value="published">Publikasikan (Published)</option>
                <option value="draft">Simpan Sebagai Draft</option>
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-gray-700">
              Isi Artikel <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={8}
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Tulis isi artikel selengkap mungkin di sini..."
              className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs text-gray-900 focus:border-amber-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Section 1: Upload Foto Sampul (Single) */}
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
            <div className="rounded-xl bg-amber-50 p-2.5 text-amber-600">
              <ImagePlus className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-900">Foto Sampul (Cover)</h2>
              <p className="text-xs text-gray-500">Foto utama yang akan tampil sebagai banner atau thumbnail artikel.</p>
            </div>
          </div>

          {!coverPreview ? (
            <div>
              <label className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50/50 p-6 text-center cursor-pointer transition hover:bg-gray-100/50">
                <div className="flex flex-col items-center space-y-2">
                  <div className="rounded-xl bg-amber-100 p-3 text-amber-600">
                    <ImagePlus className="h-6 w-6" />
                  </div>
                  <p className="text-xs font-bold text-gray-700">Klik untuk pilih foto sampul</p>
                  <p className="text-[10px] text-gray-400">PNG, JPG, JPEG (Maks. 1 file)</p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverChange}
                  className="hidden"
                />
              </label>
            </div>
          ) : (
            <div className="relative aspect-video max-h-60 rounded-xl overflow-hidden border border-gray-200 bg-gray-100 shadow-xs">
              <img src={coverPreview} alt="Cover Preview" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={handleRemoveCover}
                className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-rose-600 text-white shadow-md transition hover:bg-rose-700 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
              <span className="absolute bottom-3 left-3 rounded-md bg-black/60 px-2 py-1 text-[10px] font-bold text-white">
                Foto Sampul Utama
              </span>
            </div>
          )}
        </div>

        {/* Section 2: Upload Foto Lain / Galeri Tambahan (Multiple) */}
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
            <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600">
              <ImagePlus className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-900">Foto Tambahan / Galeri Artikel (Opsional)</h2>
              <p className="text-xs text-gray-500">Unggah beberapa foto pendukung yang bisa disisipkan di dalam isi artikel.</p>
            </div>
          </div>

          <div>
            <label className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50/50 p-6 text-center cursor-pointer transition hover:bg-gray-100/50">
              <div className="flex flex-col items-center space-y-2">
                <div className="rounded-xl bg-blue-100 p-3 text-blue-600">
                  <ImagePlus className="h-6 w-6" />
                </div>
                <p className="text-xs font-bold text-gray-700">Klik untuk pilih foto tambahan atau seret file ke sini</p>
                <p className="text-[10px] text-gray-400">PNG, JPG, JPEG (Bisa pilih lebih dari satu)</p>
              </div>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleGalleryChange}
                className="hidden"
              />
            </label>
          </div>

          {galleryPreviews.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-bold text-gray-700">Foto Tambahan Terpilih ({galleryPreviews.length}):</p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {galleryPreviews.map((src, index) => (
                  <div key={index} className="relative group aspect-square rounded-xl overflow-hidden border border-gray-200 bg-gray-100 shadow-xs">
                    <img src={src} alt={`Gallery Preview ${index}`} className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveGalleryItem(index)}
                      className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-rose-600 text-white shadow-md transition hover:bg-rose-700 cursor-pointer"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Tombol Simpan */}
        <div className="flex justify-end gap-3">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 rounded-xl bg-gray-900 px-6 py-3 text-xs font-bold text-white shadow-sm transition hover:bg-gray-800 disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-amber-400" />
                Mengunggah & Menyimpan...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 text-amber-400" />
                Simpan Artikel
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}