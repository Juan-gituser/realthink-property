"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { 
  Layers, 
  Plus, 
  Search, 
  Pencil, 
  Trash2, 
  FolderOpen, 
  Loader2, 
  X,
  AlertTriangle 
} from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  count?: number;
}

// Inisialisasi client di luar komponen agar tidak re-created pada setiap render
const supabase = createClient();

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
  });

  // Helper Auto-generate Slug dari Nama
  const slugify = (text: string) => {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "")
      .replace(/\-\-+/g, "-");
  };

  // READ: Fetch Data Kategori + Hitung Jumlah Listing Properti
  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      // 1. Ambil data kategori dari Supabase
      const { data: dbCategories, error } = await supabase
        .from("categories")
        .select("*")
        .order("name", { ascending: true });

      if (error) throw error;

      if (dbCategories) {
        // 2. Hitung jumlah properti per kategori (Aman dari error jika tabel properti belum ada)
        const categoriesWithCount = await Promise.all(
          dbCategories.map(async (cat) => {
            let count = 0;
            try {
              const { count: propCount } = await supabase
                .from("properties")
                .select("id", { count: "exact", head: true })
                .or(`category_id.eq.${cat.id},category_slug.eq.${cat.slug}`);
              
              count = propCount || 0;
            } catch {
              count = 0;
            }

            return {
              ...cat,
              count,
            };
          })
        );
        setCategories(categoriesWithCount);
      }
    } catch (err) {
      console.error("Gagal memuat kategori dari Supabase:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Handle Input Form Change
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setFormData((prev) => ({
      ...prev,
      name,
      slug: editingCategory ? prev.slug : slugify(name),
    }));
  };

  // Open Modal Tambah/Edit
  const handleOpenModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        slug: category.slug,
        description: category.description || "",
      });
    } else {
      setEditingCategory(null);
      setFormData({ name: "", slug: "", description: "" });
    }
    setIsModalOpen(true);
  };

  // CREATE & UPDATE: Simpan / Edit Kategori ke Supabase
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.slug.trim()) return;

    setIsSubmitting(true);
    try {
      const cleanSlug = slugify(formData.slug);

      if (editingCategory) {
        // UPDATE
        const { error } = await supabase
          .from("categories")
          .update({
            name: formData.name,
            slug: cleanSlug,
            description: formData.description,
          })
          .eq("id", editingCategory.id);

        if (error) throw error;
      } else {
        // CREATE
        const { error } = await supabase.from("categories").insert([
          {
            name: formData.name,
            slug: cleanSlug,
            description: formData.description,
          },
        ]);

        if (error) throw error;
      }

      setIsModalOpen(false);
      fetchCategories();
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Terjadi kesalahan";
      console.error("Gagal menyimpan kategori:", err);
      alert(`Gagal menyimpan: ${errorMsg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // DELETE: Hapus Kategori dari Supabase
  const handleDelete = async () => {
    if (!deleteTarget) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("categories")
        .delete()
        .eq("id", deleteTarget.id);

      if (error) throw error;

      setDeleteTarget(null);
      fetchCategories();
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Terjadi kesalahan";
      console.error("Gagal menghapus kategori:", err);
      alert(`Gagal menghapus: ${errorMsg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter Search
  const filteredCategories = categories.filter(
    (cat) =>
      cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (cat.description && cat.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      
      {/* Header Card */}
      <div className="flex flex-col justify-between gap-4 rounded-3xl border border-gray-200 bg-white p-6 shadow-xs sm:flex-row sm:items-center">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">
            <Layers className="h-3.5 w-3.5" /> Taksonomi
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Kategori Properti</h1>
          <p className="mt-0.5 text-xs text-gray-500">
            Kelola kelompok dan jenis properti yang tampil di katalog.
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-amber-600 active:scale-95"
        >
          <Plus className="h-4 w-4 stroke-[3]" /> Tambah Kategori
        </button>
      </div>

      {/* Table & Search Container */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xs">
        
        {/* Search Bar */}
        <div className="border-b border-gray-100 bg-gray-50/50 p-4">
          <div className="relative max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Cari kategori..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white py-2 pl-9 pr-4 text-xs font-medium text-gray-900 outline-none transition focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
            />
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-gray-200 bg-gray-50/80 font-semibold uppercase text-gray-500">
              <tr>
                <th className="px-6 py-4">Nama Kategori</th>
                <th className="px-6 py-4">Slug URL</th>
                <th className="px-6 py-4">Deskripsi</th>
                <th className="px-6 py-4">Jumlah Listing</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-400">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="h-5 w-5 animate-spin text-amber-500" />
                      <span>Memuat data dari Supabase...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-gray-400">
                    Tidak ada kategori yang ditemukan.
                  </td>
                </tr>
              ) : (
                filteredCategories.map((cat) => (
                  <tr key={cat.id} className="transition-colors hover:bg-amber-50/30">
                    <td className="px-6 py-4 font-bold text-gray-900">
                      <div className="flex items-center gap-2">
                        <FolderOpen className="h-4 w-4 text-amber-500 shrink-0" />
                        <span>{cat.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-gray-500">
                      /{cat.slug}
                    </td>
                    <td className="px-6 py-4 text-gray-600 max-w-xs truncate">
                      {cat.description || "-"}
                    </td>
                    <td className="px-6 py-4 font-semibold text-amber-700">
                      {cat.count ?? 0} Properti
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenModal(cat)}
                          title="Edit Kategori"
                          className="rounded-lg p-1.5 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(cat)}
                          title="Hapus Kategori"
                          className="rounded-lg p-1.5 text-rose-500 transition hover:bg-rose-50 hover:text-rose-600 cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL TAMBAH / EDIT KATEGORI */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-gray-100">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <h2 className="text-base font-bold text-gray-900">
                {editingCategory ? "Edit Kategori" : "Tambah Kategori Baru"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700">
                  Nama Kategori
                </label>
                <input
                  type="text"
                  required
                  placeholder="Misal: Rumah Residensial"
                  value={formData.name}
                  onChange={handleNameChange}
                  className="mt-1.5 w-full rounded-xl border border-gray-200 px-3 py-2 text-xs text-gray-900 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700">
                  Slug URL
                </label>
                <div className="mt-1.5 flex items-center rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-mono text-gray-500">
                  <span>/</span>
                  <input
                    type="text"
                    required
                    placeholder="rumah-residensial"
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData({ ...formData, slug: slugify(e.target.value) })
                    }
                    className="w-full bg-transparent pl-1 font-mono text-xs text-gray-900 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700">
                  Deskripsi
                </label>
                <textarea
                  rows={3}
                  placeholder="Deskripsi singkat kategori..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="mt-1.5 w-full rounded-xl border border-gray-200 px-3 py-2 text-xs text-gray-900 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-white transition hover:bg-amber-600 disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  {editingCategory ? "Simpan Perubahan" : "Tambah Kategori"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL KONFIRMASI HAPUS */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl border border-gray-100 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-600">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-base font-bold text-gray-900">
              Hapus Kategori?
            </h3>
            <p className="mt-1 text-xs text-gray-500">
              Apakah Anda yakin ingin menghapus kategori <strong>"{deleteTarget.name}"</strong>? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-50 cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                disabled={isSubmitting}
                className="flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-rose-700 disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}