"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import PropertyCard from "@/components/shared/PropertyCard";
import { Loader2, Building2 } from "lucide-react";

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

export default function LatestProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProperties() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("properties")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(6);

        if (error) {
          console.error("Gagal mengambil data properti:", error.message);
          return;
        }

        if (data) {
          // Mapping data snake_case Supabase ke camelCase komponen
          const mappedProperties: Property[] = data.map((item: any) => ({
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

          setProperties(mappedProperties);
        }
      } catch (err) {
        console.error("Terjadi kesalahan:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchProperties();
  }, []);

  return (
    <section className="container mx-auto px-4 py-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <span className="text-secondary font-semibold text-sm uppercase tracking-wider">
            Listing Terbaru
          </span>
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-primary mt-1">
            Properti Terbaik dari Realthink
          </h2>
        </div>
        <Link
          href="/properti"
          className="text-primary hover:text-secondary font-semibold text-sm transition-colors flex items-center gap-1"
        >
          Lihat Semua Properti &rarr;
        </Link>
      </div>

      {/* State Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400 space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-secondary" />
          <p className="text-sm">Memuat data properti terbaru...</p>
        </div>
      )}

      {/* State Kosong (Belum ada data di database) */}
      {!loading && properties.length === 0 && (
        <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
          <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-gray-700">Belum Ada Properti</h3>
          <p className="text-sm text-gray-500 mt-1">
            Tambahkan listing pertama Anda melalui halaman Admin.
          </p>
        </div>
      )}

      {/* Grid Properti Live */}
      {!loading && properties.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </section>
  );
}