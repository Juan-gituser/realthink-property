"use client";

import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import PropertyCard from "@/components/shared/PropertyCard";
import { Search, Loader2, Building2, SlidersHorizontal } from "lucide-react";

interface Property {
  id: string;
  title: string;
  slug: string;
  price: string;
  location: string;
  city?: string;
  district?: string;
  bedrooms: number;
  bathrooms: number;
  landArea: number;
  buildingArea: number;
  imageUrl: string;
  status: "dijual" | "disewa";
  category: string;
  isFeatured?: boolean;
}

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter State
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Semua");
  const [status, setStatus] = useState("Semua");

  useEffect(() => {
    async function fetchProperties() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("properties")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;

        if (data) {
          const mapped: Property[] = data.map((item: any) => ({
            id: String(item.id),
            title: item.title,
            slug: item.slug,
            price: item.price,
            location: item.location,
            city: item.city,
            district: item.district,
            bedrooms: item.bedrooms || 0,
            bathrooms: item.bathrooms || 0,
            landArea: item.land_area || 0,
            buildingArea: item.building_area || 0,
            imageUrl: item.image_url || "/placeholder-property.jpg",
            status: item.status === "disewa" ? "disewa" : "dijual",
            category: item.category || "Properti",
            isFeatured: item.is_featured || false,
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

  // Filter Logic
  const filteredProperties = useMemo(() => {
    return properties.filter((item) => {
      const matchSearch =
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.location.toLowerCase().includes(search.toLowerCase());
      const matchCategory = category === "Semua" || item.category === category;
      const matchStatus = status === "Semua" || item.status === status;

      return matchSearch && matchCategory && matchStatus;
    });
  }, [properties, search, category, status]);

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="container mx-auto px-4 space-y-8">
        
        {/* Header */}
        <div className="max-w-2xl">
          <h1 className="text-3xl font-heading font-bold text-gray-900">
            Katalog Properti Pilihan
          </h1>
          <p className="text-gray-600 text-sm mt-2">
            Temukan rumah, apartemen, ruko, dan tanah impian Anda dengan harga dan lokasi terbaik.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 absolute left-3 top-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Cari judul atau lokasi properti..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 border rounded-xl text-sm outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          <div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full py-2.5 px-3 border rounded-xl text-sm bg-white outline-none focus:ring-1 focus:ring-amber-500"
            >
              <option value="Semua">Semua Tipe</option>
              <option value="Rumah">Rumah</option>
              <option value="Apartemen">Apartemen</option>
              <option value="Ruko">Ruko</option>
              <option value="Villa">Villa</option>
              <option value="Tanah">Tanah</option>
            </select>
          </div>

          <div>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full py-2.5 px-3 border rounded-xl text-sm bg-white outline-none focus:ring-1 focus:ring-amber-500"
            >
              <option value="Semua">Semua Status</option>
              <option value="dijual">Dijual</option>
              <option value="disewa">Disewa</option>
            </select>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400 space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
            <p className="text-sm">Memuat daftar properti...</p>
          </div>
        )}

        {/* Kosong */}
        {!loading && filteredProperties.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
            <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-800">
              Tidak ada properti ditemukan
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Coba sesuaikan kata kunci atau filter pencarian Anda.
            </p>
          </div>
        )}

        {/* Grid List Properti */}
        {!loading && filteredProperties.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}