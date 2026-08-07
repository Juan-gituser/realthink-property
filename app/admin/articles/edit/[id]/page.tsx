"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { FileText, ImagePlus, X, Save, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

interface EditArticlePageProps {
  params: {
    id: string;
  };
}

export default function EditArticlePage({ params }: EditArticlePageProps) {
  const router = useRouter();
  const { id } = params;

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Tips Properti");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<"published" | "draft">("published");

  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string>("");
  const [currentCoverUrl, setCurrentCoverUrl] = useState<string>("");

  useEffect(() => {
    const loadArticle = async () => {
      try {
        const { data, error } = await supabase
          .from("articles")
          .select("title,category,content,status,cover_image")
          .eq("id", id)
          .single();

        if (error || !data) {
          throw error ?? new Error("Artikel tidak ditemukan.");
        }

        setTitle(data.title ?? "");
        setCategory(data.category ?? "Tips Properti");
        setContent(data.content ?? "");
        setStatus(data.status ?? "draft");
        setCurrentCoverUrl(data.cover_image ?? "");
      } catch (err) {
        console.error(err);
        setErrorMsg("Gagal memuat data artikel. Silakan kembali dan coba lagi.");
      } finally {
        setInitialLoading(false);
      }
    };

    loadArticle();
  }, [id]);

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  const handleRemoveCover = () => {
    setCoverFile(null);
    setCoverPreview("");
    setCurrentCoverUrl("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      let coverImageUrl = currentCoverUrl || null;

      if (coverFile) {
        const coverExt = coverFile.name.split(".").pop();
        const coverFileName = `cover-${Date.now()}-${Math.random().toString(36).substring(2)}.${coverExt}`;
        const coverPath = `articles/${coverFileName}`;

        const { error: coverUploadError } = await supabase.storage
          .from("properties")
          .upload(coverPath, coverFile);

        if (coverUploadError) throw coverUploadError;

        const { data: coverUrlData } = supabase.storage
          .from("properties")
          .getPublicUrl(coverPath);

        coverImageUrl = coverUrlData.publicUrl;
      }

      const { error: dbError } = await supabase
        .from("articles")
        .update({
          title,
          category,
          content,
          status,
          cover_image: coverImageUrl,
        })
        .eq("id", id);

      if (dbError) throw dbError;

      alert("Artikel berhasil diperbarui!");
      router.push("/admin/articles");
      router.refresh();
    } catch (err: unknown) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : "Terjadi kesalahan saat menyimpan artikel.";
      setErrorMsg(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="mx-auto max-w-4xl p-6 text-center text-gray-600">
        <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin text-primary" />
        Memuat data artikel...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <div className="flex flex-col gap-4 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/articles"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-gray-50 text-gray-600 transition hover:bg-gray-100"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <span className="mb-1 inline-block rounded-full bg-amber-50 px-3 py-1 text-[10px] font-bold tracking-widest text-amber-600 uppercase border border-amber-200">
              Edit Artikel
            </span>
            <h1 className="font-heading text-2xl font-bold text-gray-900">Sunting Artikel</h1>
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-semibold text-rose-700 shadow-sm">
          ⚠️ {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
            <div className="rounded-xl bg-amber-50 p-2.5 text-amber-600">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-900">Konten Artikel</h2>
              <p className="text-xs text-gray-500">Perbarui judul, kategori, status, dan isi artikel.</p>
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

        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
            <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-600">
              <ImagePlus className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-900">Foto Sampul</h2>
              <p className="text-xs text-gray-500">Ganti atau hapus foto sampul artikel jika diperlukan.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_auto]">
            <div className="space-y-3">
              <input type="file" accept="image/*" onChange={handleCoverChange} className="block w-full text-xs text-gray-600" />
              {coverPreview ? (
                <div className="relative overflow-hidden rounded-3xl border border-gray-200 bg-gray-100 p-2">
                  <img src={coverPreview} alt="Preview Sampul" className="h-44 w-full rounded-3xl object-cover" />
                </div>
              ) : currentCoverUrl ? (
                <div className="relative overflow-hidden rounded-3xl border border-gray-200 bg-gray-100 p-2">
                  <img src={currentCoverUrl} alt="Cover Saat Ini" className="h-44 w-full rounded-3xl object-cover" />
                </div>
              ) : (
                <div className="flex h-44 items-center justify-center rounded-3xl border border-dashed border-gray-300 bg-gray-50 text-sm text-gray-500">
                  Tidak ada foto sampul saat ini.
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={handleRemoveCover}
              className="h-fit rounded-3xl border border-gray-200 bg-white px-4 py-3 text-xs font-semibold text-gray-700 transition hover:bg-gray-100"
            >
              <X className="mr-2 inline-block h-4 w-4" /> Hapus Cover
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Link
            href="/admin/articles"
            className="inline-flex items-center justify-center rounded-3xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            Batal
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center rounded-3xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Simpan Perubahan
          </button>
        </div>
      </form>
    </div>
  );
}
