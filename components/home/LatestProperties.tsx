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
          // Mengganti tipe any dengan Record<string, unknown> untuk mematuhi aturan ESLint
          const mappedProperties: Property[] = data.map((item: Record<string, unknown>) => ({
            id: String(item.id),
            title: item.title as string,
            slug: item.slug as string,
            price: item.price as string,
            location: item.location as string,
            city: item.city as string | undefined,
            district: item.district as string | undefined,
            bedrooms: (item.bedrooms as number) || 0,
            bathrooms: (item.bathrooms as number) || 0,
            landArea: (item.land_area as number) || 0,
            buildingArea: (item.building_area as number) || 0,
            imageUrl: (item.image_url as string) || "/placeholder-property.jpg",
            status: item.status === "disewa" ? "disewa" : "dijual",
            category: (item.category as string) || "Properti",
            isFeatured: (item.is_featured as boolean) || false,
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
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <span className="text-secondary text-sm font-semibold tracking-wider uppercase">
            Listing Terbaru
          </span>
          <h2 className="font-heading text-primary mt-1 text-2xl font-bold md:text-3xl">
            Properti Terbaik dari Realthink
          </h2>
        </div>
        <Link
          href="/properti"
          className="text-primary hover:text-secondary flex items-center gap-1 text-sm font-semibold transition-colors"
        >
          Lihat Semua Properti &rarr;
        </Link>
      </div>

      {/* State Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center space-y-3 py-16 text-gray-400">
          <Loader2 className="text-secondary h-8 w-8 animate-spin" />
          <p className="text-sm">Memuat data properti terbaru...</p>
        </div>
      )}

      {/* State Kosong (Belum ada data di database) */}
      {!loading && properties.length === 0 && (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 py-16 text-center">
          <Building2 className="mx-auto mb-3 h-12 w-12 text-gray-300" />
          <h3 className="text-base font-semibold text-gray-700">Belum Ada Properti</h3>
          <p className="mt-1 text-sm text-gray-500">
            Tambahkan listing pertama Anda melalui halaman Admin.
          </p>
        </div>
      )}

      {/* Grid Properti Live */}
      {!loading && properties.length > 0 && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </section>
  );
}