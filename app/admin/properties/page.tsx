"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Building2,
  CheckCircle2,
  Clock,
  Ban,
  Star,
  Loader2,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Property {
  id: string;
  title: string;
  slug: string;
  price: string;
  category: string;
  status: "dijual" | "disewa";
  listingStatus: "published" | "draft" | "sold";
  city: string;
  isFeatured: boolean;
  updatedAt: string;
  imageUrl: string;
}

interface SupabasePropertyRow {
  id: string;
  title: string;
  slug: string;
  price: string;
  category: string;
  status?: "dijual" | "disewa";
  listing_status?: "published" | "draft" | "sold";
  city: string;
  is_featured?: boolean;
  updated_at?: string;
  created_at?: string;
  image_url?: string;
}

// Helper untuk format angka ke Rupiah
const formatRupiah = (amount: number | string) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0);
};

export default function AdminPropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedListingStatus, setSelectedListingStatus] = useState("Semua");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Mengambil data dari Supabase
  useEffect(() => {
    let isMounted = true;
    const supabase = createClient();

    const fetchProperties = async () => {
      try {
        const { data, error } = await supabase
          .from("properties")
          .select("*")
          .order("created_at", { ascending: false });

        if (!isMounted) return;

        if (error) {
          console.error("Gagal memuat data properti:", error.message);
          return;
        }

        if (data) {
          const formattedData: Property[] = (data as SupabasePropertyRow[]).map((item) => ({
            id: item.id,
            title: item.title,
            slug: item.slug,
            price: item.price,
            category: item.category,
            status: item.status || "dijual",
            listingStatus: item.listing_status || "published",
            city: item.city,
            isFeatured: item.is_featured || false,
            updatedAt: new Date(item.updated_at || item.created_at || Date.now()).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "short",
              year: "numeric",
            }),
            imageUrl:
              item.image_url ||
              "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=300&q=80",
          }));

          setProperties(formattedData);
        }
      } catch (err: unknown) {
        if (isMounted) console.error("Terjadi kesalahan:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProperties();

    return () => {
      isMounted = false;
    };
  }, []);

  // Filter Data
  const filteredProperties = useMemo(() => {
    return properties.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.city.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        selectedListingStatus === "Semua" || item.listingStatus === selectedListingStatus;

      const matchesCategory = selectedCategory === "Semua" || item.category === selectedCategory;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [properties, searchQuery, selectedListingStatus, selectedCategory]);

  // Handler Hapus Properti
  const handleDelete = async (id: string) => {
    try {
      const supabase = createClient();
      const { error } = await supabase.from("properties").delete().eq("id", id);

      if (error) {
        alert("Gagal menghapus properti: " + error.message);
        return;
      }

      setProperties((prev) => prev.filter((p) => p.id !== id));
      setDeleteId(null);
    } catch (err: unknown) {
      console.error("Error deleting property:", err);
    }
  };

  // Handler Toggle Status Unggulan (Featured)
  const handleToggleFeatured = async (propertyId: string, currentStatus: boolean) => {
    const supabase = createClient();
    const { error } = await supabase
      .from("properties")
      .update({ is_featured: !currentStatus })
      .eq("id", propertyId);

    if (!error) {
      setProperties((prev) =>
        prev.map((p) => (p.id === propertyId ? { ...p, isFeatured: !currentStatus } : p))
      );
    } else {
      alert("Gagal memperbarui status unggulan: " + error.message);
    }
  };

  // Ringkasan Statistik
  const stats = useMemo(() => {
    return {
      total: properties.length,
      published: properties.filter((p) => p.listingStatus === "published").length,
      draft: properties.filter((p) => p.listingStatus === "draft").length,
      sold: properties.filter((p) => p.listingStatus === "sold").length,
    };
  }, [properties]);

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6">
      {/* Header & Quick Action */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-heading text-2xl font-bold text-gray-900">Kelola Properti</h1>
          <p className="text-sm text-gray-500">
            Daftar seluruh listing properti yang terdaftar di database Realthink.
          </p>
        </div>
        <Link
          href="/admin/properties/create"
          className="bg-primary hover:bg-primary/90 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-xs transition"
        >
          <Plus className="h-4 w-4" /> Tambah Properti Baru
        </Link>
      </div>

      {/* Ringkasan Cards */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-xs">
          <div className="rounded-lg bg-blue-50 p-2.5 text-blue-600">
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500">Total Listing</p>
            <p className="text-xl font-bold text-gray-900">{stats.total}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-xs">
          <div className="rounded-lg bg-emerald-50 p-2.5 text-emerald-600">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500">Published</p>
            <p className="text-xl font-bold text-gray-900">{stats.published}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-xs">
          <div className="rounded-lg bg-amber-50 p-2.5 text-amber-600">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500">Draft</p>
            <p className="text-xl font-bold text-gray-900">{stats.draft}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-xs">
          <div className="rounded-lg bg-rose-50 p-2.5 text-rose-600">
            <Ban className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500">Terjual / Tersewa</p>
            <p className="text-xl font-bold text-gray-900">{stats.sold}</p>
          </div>
        </div>
      </div>

      {/* Panel Filter */}
      <div className="space-y-3 rounded-xl border border-gray-200 bg-white p-4 shadow-xs">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Cari judul properti atau kota..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="focus:ring-secondary w-full rounded-lg border py-2 pr-3 pl-9 text-sm outline-hidden focus:ring-1"
            />
          </div>

          {/* Filter Status Listing */}
          <div>
            <select
              value={selectedListingStatus}
              onChange={(e) => setSelectedListingStatus(e.target.value)}
              className="focus:ring-secondary w-full rounded-lg border bg-white px-3 py-2 text-sm outline-hidden focus:ring-1"
            >
              <option value="Semua">Semua Status Listing</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="sold">Sold (Terjual)</option>
            </select>
          </div>

          {/* Filter Kategori */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="focus:ring-secondary w-full rounded-lg border bg-white px-3 py-2 text-sm outline-hidden focus:ring-1"
            >
              <option value="Semua">Semua Kategori</option>
              <option value="Rumah">Rumah</option>
              <option value="Apartemen">Apartemen</option>
              <option value="Ruko">Ruko</option>
              <option value="Villa">Villa</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabel Data Properti */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-xs font-semibold tracking-wider text-gray-600 uppercase">
                <th className="p-4">Properti</th>
                <th className="p-4">Kategori & Tipe</th>
                <th className="p-4">Harga</th>
                <th className="p-4">Status</th>
                <th className="p-4">Terakhir Diperbarui</th>
                <th className="p-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Loader2 className="text-primary h-6 w-6 animate-spin" />
                      <p className="text-sm">Memuat data properti...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredProperties.length > 0 ? (
                filteredProperties.map((property) => (
                  <tr key={property.id} className="transition hover:bg-gray-50/80">
                    {/* Property Thumbnail & Title */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
                          <Image
                            src={property.imageUrl}
                            alt={property.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="space-y-1">
                          <p className="line-clamp-1 font-semibold text-gray-900">
                            {property.title}
                          </p>
                          <p className="text-xs text-gray-500">{property.city}</p>

                          {/* Toggle Featured Button */}
                          <button
                            onClick={() => handleToggleFeatured(property.id, property.isFeatured)}
                            className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-medium transition ${
                              property.isFeatured
                                ? "bg-amber-100 text-amber-800 hover:bg-amber-200"
                                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                            }`}
                            title="Klik untuk mengubah status unggulan"
                          >
                            <Star
                              className={`h-3 w-3 ${property.isFeatured ? "fill-amber-600 text-amber-600" : ""}`}
                            />
                            {property.isFeatured ? "Featured" : "Jadikan Featured"}
                          </button>
                        </div>
                      </div>
                    </td>

                    {/* Category & Status */}
                    <td className="p-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <span className="block font-medium text-gray-800">{property.category}</span>
                        <span className="text-xs text-gray-500 capitalize">
                          Tipe: {property.status}
                        </span>
                      </div>
                    </td>

                    {/* Price */}
                    <td className="p-4 font-semibold whitespace-nowrap text-gray-900">
                      {formatRupiah(property.price)}
                    </td>

                    {/* Listing Status Badge */}
                    <td className="p-4 whitespace-nowrap">
                      {property.listingStatus === "published" && (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-800">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                          Published
                        </span>
                      )}
                      {property.listingStatus === "draft" && (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-800">
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
                          Draft
                        </span>
                      )}
                      {property.listingStatus === "sold" && (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-100 px-2.5 py-1 text-xs font-medium text-rose-800">
                          <span className="h-1.5 w-1.5 rounded-full bg-rose-500"></span>
                          Terjual
                        </span>
                      )}
                    </td>

                    {/* Updated At */}
                    <td className="p-4 text-xs whitespace-nowrap text-gray-500">
                      {property.updatedAt}
                    </td>

                    {/* Action Buttons */}
                    <td className="p-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-2">
                        {/* View */}
                        <Link
                          href={`/properti/${property.slug}`}
                          target="_blank"
                          title="Lihat di situs"
                          className="hover:text-primary rounded-lg p-2 text-gray-500 transition hover:bg-gray-100"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>

                        {/* Edit (🟢 URL Disesuaikan dengan struktur Next.js) */}
                        <Link
                          href={`/admin/properties/${property.id}/edit`}
                          title="Edit Properti"
                          className="rounded-lg p-2 text-gray-500 transition hover:bg-blue-50 hover:text-blue-600"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>

                        {/* Delete Trigger */}
                        <button
                          onClick={() => setDeleteId(property.id)}
                          title="Hapus Properti"
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
                    Tidak ada properti yang sesuai dengan filter pencarian atau database masih
                    kosong.
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
          <div className="w-full max-w-sm space-y-4 rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-bold text-gray-900">Hapus Listing Properti?</h3>
            <p className="text-sm text-gray-500">
              Tindakan ini tidak dapat dibatalkan. Properti akan dihapus permanen dari database.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteId(null)}
                className="rounded-lg px-4 py-2 text-sm font-semibold text-gray-600 transition hover:bg-gray-100"
              >
                Batal
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white shadow-xs transition hover:bg-rose-700"
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