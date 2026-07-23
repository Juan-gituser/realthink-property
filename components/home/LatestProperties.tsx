import Link from "next/link";
import PropertyCard from "@/components/shared/PropertyCard";

// Data Dummy Properti Terbaru (ditambahkan 'as const' pada status)
const LATEST_PROPERTIES = [
  {
    id: "1",
    title: "Rumah Minimalis Modern Premium",
    slug: "rumah-minimalis-modern-premium",
    price: "Rp 1.250.000.000",
    location: "Cilandak, Jakarta Selatan",
    city: "Jakarta Selatan",
    district: "Cilandak",
    bedrooms: 3,
    bathrooms: 2,
    landArea: 120,
    buildingArea: 90,
    imageUrl: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
    status: "dijual" as const,
    category: "Rumah",
    isFeatured: false,
  },
  {
    id: "2",
    title: "Apartemen View Kota Modern",
    slug: "apartemen-view-kota-modern",
    price: "Rp 850.000.000",
    location: "Coblong, Bandung",
    city: "Bandung",
    district: "Coblong",
    bedrooms: 2,
    bathrooms: 1,
    landArea: 45,
    buildingArea: 45,
    imageUrl: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80",
    status: "disewa" as const,
    category: "Apartemen",
    isFeatured: false,
  },
  {
    id: "3",
    title: "Ruko 3 Lantai Strategis BSD",
    slug: "ruko-3-lantai-strategis-bsd",
    price: "Rp 3.500.000.000",
    location: "Serpong, Tangerang Selatan",
    city: "Tangerang Selatan",
    district: "Serpong",
    bedrooms: 1,
    bathrooms: 3,
    landArea: 150,
    buildingArea: 300,
    imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
    status: "dijual" as const,
    category: "Ruko",
    isFeatured: false,
  },
];

export default function LatestProperties() {
  return (
    <section className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <span className="text-secondary font-semibold text-sm uppercase tracking-wider">
            Listing Terbaru
          </span>
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-primary mt-1">
            Properti Teranyar dari Realthink
          </h2>
        </div>
        <Link
          href="/properti"
          className="text-primary hover:text-secondary font-semibold text-sm transition-colors flex items-center gap-1"
        >
          Lihat Semua Properti &rarr;
        </Link>
      </div>

      {/* Grid Properti */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {LATEST_PROPERTIES.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </section>
  );
}