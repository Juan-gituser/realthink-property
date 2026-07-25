"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Plus, Search, Edit, Trash2, Eye, 
  Building2, CheckCircle2, Clock, Ban, Star, Loader2 
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

export default function AdminPropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedListingStatus, setSelectedListingStatus] = useState("Semua");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const supabase = createClient();

  // Fungsi Mengambil Data dari Supabase
  const fetchProperties = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Gagal memuat data properti:", error.message);
        return;
      }

      if (data) {
        // Mapping kolom database (snake_case) ke state frontend (camelCase jika diperlukan)
        const formattedData: Property[] = data.map((item: any) => ({
          id: item.id,
          title: item.title,
          slug: item.slug,
          price: item.price,
          category: item.category,
          status: item.status || "dijual",
          listingStatus: item.listing_status || "published",
          city: item.city,
          isFeatured: item.is_featured || false,
          updatedAt: new Date(item.updated_at || item.created_at).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }),
          imageUrl: item.image_url || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=300&q=80",
        }));

        setProperties(formattedData);
      }
    } catch (err) {
      console.error("Terjadi kesalahan:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  // Filter Data
  const filteredProperties = useMemo(() => {
    return properties.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.city.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        selectedListingStatus === "Semua" || item.listingStatus === selectedListingStatus;

      const matchesCategory =
        selectedCategory === "Semua" || item.category === selectedCategory;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [properties, searchQuery, selectedListingStatus, selectedCategory]);

  // Handler Hapus Properti dari Supabase
  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("properties")
        .delete()
        .eq("id", id);

      if (error) {
        alert("Gagal menghapus properti: " + error.message);
        return;
      }

      setProperties((prev) => prev.filter((p) => p.id !== id));
      setDeleteId(null);
    } catch (err) {
      console.error("Error deleting property:", err);
    }
  };

  // Handler Toggle Status Unggulan (Featured) di Supabase
  const handleToggleFeatured = async (propertyId: string, currentStatus: boolean) => {
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
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* Header & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-gray-900">
            Kelola Properti
          </h1>
          <p className="text-sm text-gray-500">
            Daftar seluruh listing properti yang terdaftar di database Realthink.
          </p>
        </div>
        <Link
          href="/admin/properties/create"
          className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white font-semibold px-4 py-2.5 rounded-xl transition shadow-sm text-sm"
        >
          <Plus className="w-4 h-4" /> Tambah Properti Baru
        </Link>
      </div>

      {/* Ringkasan Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Total Listing</p>
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

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-3">
          <div className="p-2.5 bg-rose-50 text-rose-600 rounded-lg">
            <Ban className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Terjual / Tersewa</p>
            <p className="text-xl font-bold text-gray-900">{stats.sold}</p>
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
              placeholder="Cari judul properti atau kota..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm outline-none focus:ring-1 focus:ring-secondary"
            />
          </div>

          {/* Filter Status Listing */}
          <div>
            <select
              value={selectedListingStatus}
              onChange={(e) => setSelectedListingStatus(e.target.value)}
              className="w-full py-2 px-3 border rounded-lg text-sm bg-white outline-none focus:ring-1 focus:ring-secondary"
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
              className="w-full py-2 px-3 border rounded-lg text-sm bg-white outline-none focus:ring-1 focus:ring-secondary"
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
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase font-semibold text-gray-600 tracking-wider">
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
                      <Loader2 className="w-6 h-6 animate-spin text-primary" />
                      <p className="text-sm">Memuat data properti...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredProperties.length > 0 ? (
                filteredProperties.map((property) => (
                  <tr key={property.id} className="hover:bg-gray-50/80 transition">
                    
                    {/* Property Thumbnail & Title */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-14 h-14 rounded-lg overflow-hidden border border-gray-200 bg-gray-100 shrink-0">
                          <Image
                            src={property.imageUrl}
                            alt={property.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="space-y-1">
                          <p className="font-semibold text-gray-900 line-clamp-1">
                            {property.title}
                          </p>
                          <p className="text-xs text-gray-500">{property.city}</p>
                          
                          {/* Toggle Featured Button Interaktif */}
                          <button
                            onClick={() => handleToggleFeatured(property.id, property.isFeatured)}
                            className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded transition ${
                              property.isFeatured 
                                ? "bg-amber-100 text-amber-800 hover:bg-amber-200" 
                                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                            }`}
                            title="Klik untuk mengubah status unggulan"
                          >
                            <Star className={`w-3 h-3 ${property.isFeatured ? "fill-amber-600 text-amber-600" : ""}`} />
                            {property.isFeatured ? "Featured" : "Jadikan Featured"}
                          </button>
                        </div>
                      </div>
                    </td>

                    {/* Category & Status */}
                    <td className="p-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <span className="font-medium text-gray-800 block">
                          {property.category}
                        </span>
                        <span className="text-xs text-gray-500 capitalize">
                          Tipe: {property.status}
                        </span>
                      </div>
                    </td>

                    {/* Price */}
                    <td className="p-4 whitespace-nowrap font-semibold text-gray-900">
                      {property.price}
                    </td>

                    {/* Listing Status Badge */}
                    <td className="p-4 whitespace-nowrap">
                      {property.listingStatus === "published" && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          Published
                        </span>
                      )}
                      {property.listingStatus === "draft" && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                          Draft
                        </span>
                      )}
                      {property.listingStatus === "sold" && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-100 text-rose-800">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                          Terjual
                        </span>
                      )}
                    </td>

                    {/* Updated At */}
                    <td className="p-4 whitespace-nowrap text-xs text-gray-500">
                      {property.updatedAt}
                    </td>

                    {/* Action Buttons */}
                    <td className="p-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-2">
                        {/* View */}
                        <Link
                          href={`/properti/${property.slug}`}
                          target="_blank"
                          title="Lihat di situs"
                          className="p-2 text-gray-500 hover:text-primary hover:bg-gray-100 rounded-lg transition"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>

                        {/* Edit */}
                        <Link
                          href={`/admin/properties/edit/${property.id}`}
                          title="Edit Properti"
                          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>

                        {/* Delete Trigger */}
                        <button
                          onClick={() => setDeleteId(property.id)}
                          title="Hapus Properti"
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
                    Tidak ada properti yang sesuai dengan filter pencarian atau database masih kosong.
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
            <h3 className="text-lg font-bold text-gray-900">Hapus Listing Properti?</h3>
            <p className="text-sm text-gray-500">
              Tindakan ini tidak dapat dibatalkan. Properti akan dihapus permanen dari database.
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