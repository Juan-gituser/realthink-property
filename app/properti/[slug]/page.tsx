"use client";

import { useState, useMemo } from "react";
import PropertyCard from "@/components/shared/PropertyCard";
import { Search, SlidersHorizontal, RotateCcw } from "lucide-react";

// Data Dummy Properti
const ALL_PROPERTIES = [
  {
    id: "1",
    title: "Rumah Minimalis Modern Premium",
    slug: "rumah-minimalis-modern-premium",
    price: "Rp 1.250.000.000",
    rawPrice: 1250000000,
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
    isFeatured: true,
  },
  {
    id: "2",
    title: "Apartemen View Kota Modern",
    slug: "apartemen-view-kota-modern",
    price: "Rp 850.000.000",
    rawPrice: 850000000,
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
    rawPrice: 3500000000,
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
    isFeatured: true,
  },
  {
    id: "4",
    title: "Villa Tropis Asri dengan Kolam Renang",
    slug: "villa-tropis-asri-kolam-renang",
    price: "Rp 4.200.000.000",
    rawPrice: 4200000000,
    location: "Ubud, Bali",
    city: "Gianyar",
    district: "Ubud",
    bedrooms: 4,
    bathrooms: 4,
    landArea: 500,
    buildingArea: 350,
    imageUrl: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80",
    status: "dijual" as const,
    category: "Villa",
    isFeatured: true,
  },
  {
    id: "5",
    title: "Rumah Cluster Asri Hook BSD",
    slug: "rumah-cluster-asri-hook-bsd",
    price: "Rp 1.800.000.000",
    rawPrice: 1800000000,
    location: "Serpong, Tangerang Selatan",
    city: "Tangerang Selatan",
    district: "Serpong",
    bedrooms: 4,
    bathrooms: 3,
    landArea: 160,
    buildingArea: 130,
    imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    status: "dijual" as const,
    category: "Rumah",
    isFeatured: false,
  },
  {
    id: "6",
    title: "Sewa Studio Apartemen Premium Sudirman",
    slug: "sewa-studio-apartemen-sudirman",
    price: "Rp 65.000.000 / thn",
    rawPrice: 65000000,
    location: "Karet, Jakarta Pusat",
    city: "Jakarta Pusat",
    district: "Setiabudi",
    bedrooms: 1,
    bathrooms: 1,
    landArea: 32,
    buildingArea: 32,
    imageUrl: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
    status: "disewa" as const,
    category: "Apartemen",
    isFeatured: false,
  },
];

export default function PropertiesPage() {
  // State Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [selectedStatus, setSelectedStatus] = useState("Semua");
  const [maxPrice, setMaxPrice] = useState<number | "">("");

  // Handler Reset Filter
  const handleReset = () => {
    setSearchQuery("");
    setSelectedCategory("Semua");
    setSelectedStatus("Semua");
    setMaxPrice("");
  };

  // Logika Filter
  const filteredProperties = useMemo(() => {
    return ALL_PROPERTIES.filter((item) => {
      // Filter kata kunci (Judul & Lokasi)
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location.toLowerCase().includes(searchQuery.toLowerCase());

      // Filter Kategori
      const matchesCategory =
        selectedCategory === "Semua" || item.category === selectedCategory;

      // Filter Status (Dijual / Disewa)
      const matchesStatus =
        selectedStatus === "Semua" || item.status === selectedStatus.toLowerCase();

      // Filter Maksimal Harga
      const matchesPrice =
        maxPrice === "" || item.rawPrice <= Number(maxPrice);

      return matchesSearch && matchesCategory && matchesStatus && matchesPrice;
    });
  }, [searchQuery, selectedCategory, selectedStatus, maxPrice]);

  return (
    <div className="bg-gray-50/50 min-h-screen py-10">
      <div className="container mx-auto px-4 space-y-8">
        
        {/* Header */}
        <div>
          <h1 className="text-3xl font-heading font-bold text-primary">
            Katalog Properti
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Temukan hunian, apartemen, ruko, dan investasi properti terbaik sesuai kriteria Anda.
          </p>
        </div>

        {/* Panel Filter */}
        <div className="bg-white p-6 rounded-xl border border-border shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-border pb-3 text-primary font-semibold">
            <SlidersHorizontal className="w-5 h-5 text-secondary" />
            <span>Filter Pencarian</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Input Search */}
            <div className="relative">
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Kata Kunci / Lokasi</label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari BSD, Jakarta, Minimalis..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm focus:ring-1 focus:ring-secondary outline-none"
                />
              </div>
            </div>

            {/* Select Kategori */}
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Kategori</label>
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
                <option value="Tanah">Tanah</option>
              </select>
            </div>

            {/* Select Status */}
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Status Listing</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full py-2 px-3 border rounded-lg text-sm bg-white outline-none focus:ring-1 focus:ring-secondary"
              >
                <option value="Semua">Dijual & Disewa</option>
                <option value="Dijual">Dijual</option>
                <option value="Disewa">Disewa</option>
              </select>
            </div>

            {/* Max Price */}
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Harga Maksimal (Rp)</label>
              <input
                type="number"
                placeholder="Contoh: 2000000000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : "")}
                className="w-full py-2 px-3 border rounded-lg text-sm outline-none focus:ring-1 focus:ring-secondary"
              />
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <span className="text-xs text-muted-foreground">
              Menampilkan <strong className="text-primary">{filteredProperties.length}</strong> properti
            </span>
            <button
              onClick={handleReset}
              className="text-xs font-semibold text-red-600 hover:text-red-700 flex items-center gap-1.5 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset Filter
            </button>
          </div>
        </div>

        {/* Output Grid Properti */}
        {filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl border border-border">
            <p className="text-lg font-semibold text-gray-700">Properti Tidak Ditemukan</p>
            <p className="text-sm text-muted-foreground mt-1">
              Coba sesuaikan kata kunci atau atur ulang filter pencarian Anda.
            </p>
            <button
              onClick={handleReset}
              className="mt-4 bg-primary text-white text-xs px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition"
            >
              Reset Filter
            </button>
          </div>
        )}

      </div>
    </div>
  );
}