"use client";

import { useEffect, useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import PropertyCard, { PropertyData } from "@/components/shared/PropertyCard";
import { Search, Loader2, Building2 } from "lucide-react";

// Interface untuk baris data mentah dari database Supabase
interface PropertyRow {
  id: string | number;
  title: string;
  slug?: string;
  price: string | number;
  location?: string;
  city?: string;
  district?: string;
  bedrooms?: number;
  bathrooms?: number;
  land_area?: number;
  landArea?: number;
  building_area?: number;
  buildingArea?: number;
  image_url?: string;
  imageUrl?: string;
  images?: string[];
  status?: string;
  listing_status?: string; // Ditambahkan
  category?: string;
  is_featured?: boolean;
  isFeatured?: boolean;
}

// Interface untuk data Kategori dari tabel 'categories'
interface CategoryOption {
  id: string | number;
  name: string;
}

function CatalogContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "Semua";

  const [properties, setProperties] = useState<PropertyData[]>([]);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter State
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(initialCategory);
  const [status, setStatus] = useState("Semua");

  // Synchronize state kategori jika URL parameter berubah
  useEffect(() => {
    const categoryFromUrl = searchParams.get("category");
    if (categoryFromUrl) {
      setCategory(categoryFromUrl);
    }
  }, [searchParams]);

  // 1. Fetch Kategori dari tabel 'categories' Supabase
  useEffect(() => {
    async function fetchCategories() {
      try {
        const { data, error } = await supabase
          .from("categories")
          .select("id, name")
          .order("name", { ascending: true });

        if (error) throw error;
        if (data) {
          setCategories(data);
        }
      } catch (err) {
        console.error("Gagal mengambil data kategori:", err);
      }
    }

    fetchCategories();
  }, []);

  // 2. Fetch Properti dari tabel 'properties' Supabase (Hanya yang 'published')
  useEffect(() => {
    async function fetchProperties() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("properties")
          .select("*")
          .eq("listing_status", "published") // <-- FILTER UTAMA: Hanya mengambil data berstatus published
          .order("created_at", { ascending: false });

        if (error) throw error;

        if (data) {
          const mapped: PropertyData[] = (data as PropertyRow[]).map((item) => ({
            id: String(item.id),
            title: item.title,
            slug: item.slug,
            price: item.price,
            location: item.location || "",
            bedrooms: item.bedrooms || 0,
            bathrooms: item.bathrooms || 0,
            landArea: item.land_area ?? item.landArea ?? 0,
            buildingArea: item.building_area ?? item.buildingArea ?? 0,
            imageUrl: item.image_url || item.imageUrl || "/placeholder-property.jpg",
            images: item.images,
            status: item.status === "disewa" ? "disewa" : "dijual",
            category: item.category || "Properti",
            isFeatured: item.is_featured ?? item.isFeatured ?? false,
          }));

          setProperties(mapped);
        }
      } catch (err) {
        console.error("Gagal mengambil data properti:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchProperties();
  }, []);

  // Filter Logic pada Client
  const filteredProperties = useMemo(() => {
    return properties.filter((item) => {
      const matchSearch =
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        (item.location && item.location.toLowerCase().includes(search.toLowerCase()));
      const matchCategory = category === "Semua" || item.category === category;
      const matchStatus = status === "Semua" || item.status === status;

      return matchSearch && matchCategory && matchStatus;
    });
  }, [properties, search, category, status]);

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="container mx-auto space-y-8 px-4">
        {/* Header */}
        <div className="max-w-2xl">
          <h1 className="font-heading text-3xl font-bold text-gray-900">
            Katalog Properti Pilihan
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Temukan rumah, apartemen, ruko, dan tanah impian Anda dengan harga dan lokasi terbaik.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="grid grid-cols-1 gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-xs md:grid-cols-4">
          <div className="relative md:col-span-2">
            <Search className="absolute top-3.5 left-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Cari judul atau lokasi properti..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-gray-200 py-2.5 pr-3 pl-9 text-sm text-gray-900 outline-hidden focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
            />
          </div>

          {/* Dropdown Kategori Dinamis */}
          <div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full cursor-pointer rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium text-gray-700 outline-hidden focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
            >
              <option value="Semua">Semua Tipe</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full cursor-pointer rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium text-gray-700 outline-hidden focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
            >
              <option value="Semua">Semua Status</option>
              <option value="dijual">Dijual</option>
              <option value="disewa">Disewa</option>
            </select>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center space-y-3 py-20 text-gray-400">
            <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
            <p className="text-sm">Memuat daftar properti...</p>
          </div>
        )}

        {/* Kosong */}
        {!loading && filteredProperties.length === 0 && (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-white py-20 text-center">
            <Building2 className="mx-auto mb-3 h-12 w-12 text-gray-300" />
            <h3 className="text-lg font-semibold text-gray-800">Tidak ada properti ditemukan</h3>
            <p className="mt-1 text-sm text-gray-500">
              Coba sesuaikan kata kunci atau filter pencarian Anda.
            </p>
          </div>
        )}

        {/* Grid List Properti */}
        {!loading && filteredProperties.length > 0 && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function PropertiesPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-gray-50 text-gray-400">
          <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
        </div>
      }
    >
      <CatalogContent />
    </Suspense>
  );
}