"use client";

import PropertyCard, { PropertyProps } from "@/components/shared/PropertyCard";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

// Dummy Data untuk tahap inisialisasi / preview mandiri
const dummyFeatured: PropertyProps[] = [
  {
    id: "1",
    title: "Rumah Mewah Modern Minimalis di BSD City",
    slug: "rumah-mewah-modern-minimalis-bsd",
    price: "Rp 2,850,000,000",
    location: "BSD City, Tangerang Selatan",
    bedrooms: 4,
    bathrooms: 3,
    landArea: 150,
    buildingArea: 180,
    imageUrl: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
    isFeatured: true,
    status: "dijual",
  },
  {
    id: "2",
    title: "Apartemen Premium View Kota Jakarta Selatan",
    slug: "apartemen-premium-view-kota-jaksel",
    price: "Rp 1,400,000,000",
    location: "Kuningan, Jakarta Selatan",
    bedrooms: 2,
    bathrooms: 1,
    landArea: 0,
    buildingArea: 65,
    imageUrl: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80",
    isFeatured: true,
    status: "dijual",
  },
  {
    id: "3",
    title: "Ruko Strategis Pusat Bisnis Bintaro",
    slug: "ruko-strategis-pusat-bisnis-bintaro",
    price: "Rp 3,200,000,000",
    location: "Bintaro, Tangerang Selatan",
    bedrooms: 1,
    bathrooms: 2,
    landArea: 90,
    buildingArea: 210,
    imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
    isFeatured: true,
    status: "dijual",
  },
];

interface FeaturedPropertiesProps {
  properties?: PropertyProps[];
}

export default function FeaturedProperties({ properties }: FeaturedPropertiesProps) {
  // Gunakan data dari props jika ada, jika tidak gunakan dummyFeatured
  const displayProperties = properties && properties.length > 0 ? properties : dummyFeatured;

  return (
    <section className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <span className="text-xs font-semibold text-amber-600 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full uppercase tracking-wider">
            Pilihan Utama
          </span>
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-gray-900 mt-2">
            Properti Unggulan
          </h2>
          <p className="text-sm text-gray-500 mt-1">Pilihan properti eksklusif dengan nilai investasi terbaik</p>
        </div>
        <Link
          href="/properti"
          className="text-amber-600 font-semibold hover:underline flex items-center gap-1 text-sm"
        >
          Lihat Semua Unggulan <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {displayProperties.length === 0 ? (
        <p className="text-sm text-gray-500">Belum ada properti unggulan saat ini.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {displayProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </section>
  );
}