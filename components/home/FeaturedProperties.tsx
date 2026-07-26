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
    imageUrl:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
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
    imageUrl:
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80",
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
    imageUrl:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
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
      <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
        <div>
          <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold tracking-wider text-amber-600 uppercase">
            Pilihan Utama
          </span>
          <h2 className="font-heading mt-2 text-2xl font-bold text-gray-900 md:text-3xl">
            Properti Unggulan
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Pilihan properti eksklusif dengan nilai investasi terbaik
          </p>
        </div>
        <Link
          href="/properti"
          className="flex items-center gap-1 text-sm font-semibold text-amber-600 hover:underline"
        >
          Lihat Semua Unggulan <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {displayProperties.length === 0 ? (
        <p className="text-sm text-gray-500">Belum ada properti unggulan saat ini.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {displayProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </section>
  );
}
