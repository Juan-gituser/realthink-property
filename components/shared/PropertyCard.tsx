"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Bed, Bath, Square, MapPin, ChevronLeft, ChevronRight, Heart, Star, Scale } from "lucide-react";

export interface PropertyData {
  id: string;
  title: string;
  slug?: string;
  price: number | string;
  status: "dijual" | "disewa" | string;
  location?: string;
  bedrooms?: number;
  bathrooms?: number;
  landArea?: number;
  land_area?: number;
  buildingArea?: number;
  building_area?: number;
  imageUrl?: string;
  image_url?: string;
  images?: string[];
  isFeatured?: boolean;
  is_featured?: boolean;
}

// Helper Format Currency Rupiah
const formatRupiah = (amount: number | string) => {
  const numericPrice = typeof amount === "string" ? parseFloat(amount.replace(/\D/g, "")) : amount;
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(numericPrice || 0);
};

export default function PropertyCard({ property }: { property: PropertyData }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isCompared, setIsCompared] = useState(false);

  // Sinkronisasi status perbandingan dengan localStorage dan event global
  useEffect(() => {
    const checkCompareStatus = () => {
      const compareIds: string[] = JSON.parse(localStorage.getItem("realthink_compare") || "[]");
      setIsCompared(compareIds.includes(property.id));
    };

    // Cek saat pertama kali dimuat
    checkCompareStatus();

    // Dengar perubahan event compareChanged (sinkron dengan ComparisonBar & halaman lain)
    window.addEventListener("compareChanged", checkCompareStatus);
    return () => {
      window.removeEventListener("compareChanged", checkCompareStatus);
    };
  }, [property.id]);

  // Normalisasi data gambar (Mendukung array 'images' maupun gambar tunggal 'imageUrl'/'image_url')
  const rawImages = property.images && property.images.length > 0
    ? property.images
    : [property.imageUrl || property.image_url || "/placeholder-property.jpg"];

  // Normalisasi properti opsional (Mendukung camelCase & snake_case)
  const isFeatured = property.isFeatured ?? property.is_featured ?? false;
  const buildingArea = property.buildingArea ?? property.building_area ?? 0;
  const landArea = property.landArea ?? property.land_area ?? 0;
  const bedrooms = property.bedrooms ?? 0;
  const bathrooms = property.bathrooms ?? 0;
  const detailSlug = property.slug || property.id;

  // Handler Navigasi Slider Kiri
  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? rawImages.length - 1 : prev - 1));
  };

  // Handler Navigasi Slider Kanan
  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === rawImages.length - 1 ? 0 : prev + 1));
  };

  // Handler Toggle Favorit
  const handleToggleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  // Handler Toggle Bandingkan Properti
  const handleToggleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    let compareIds: string[] = JSON.parse(localStorage.getItem("realthink_compare") || "[]");

    if (compareIds.includes(property.id)) {
      // Hapus dari daftar jika sudah ada
      compareIds = compareIds.filter((id) => id !== property.id);
    } else {
      // Batasi maksimal 3 properti sekaligus agar tabel perbandingan rapi
      if (compareIds.length >= 3) {
        alert("Maksimal 3 properti dapat dibandingkan sekaligus.");
        return;
      }
      compareIds.push(property.id);
    }

    localStorage.setItem("realthink_compare", JSON.stringify(compareIds));
    
    // Trigger event agar ComparisonBar dan komponen kartu lain tahu terjadi perubahan
    window.dispatchEvent(new Event("compareChanged"));
  };

  return (
    <div className="group relative flex flex-col h-full overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <Link href={`/properti/${detailSlug}`} className="flex flex-col h-full">
        
        {/* ================= AREA SLIDER FOTO ================= */}
        <div className="relative aspect-16/10 w-full overflow-hidden bg-gray-100">
          <img
            src={rawImages[currentIndex]}
            alt={`${property.title} - Foto ${currentIndex + 1}`}
            className="h-full w-full object-cover transition-all duration-500 group-hover:scale-105"
          />

          {/* Overlay Gradient Halus */}
          <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-black/20 opacity-60" />

          {/* BADGE STATUS & FEATURED */}
          <div className="absolute left-3 top-3 flex items-center gap-1.5 z-10">
            <span className="rounded-lg bg-black/75 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white backdrop-blur-md shadow-xs">
              {property.status}
            </span>
            {isFeatured && (
              <span className="flex items-center gap-1 rounded-lg bg-amber-500 px-2.5 py-1 text-[10px] font-bold text-white shadow-xs">
                <Star className="h-3 w-3 fill-current" /> Featured
              </span>
            )}
          </div>

          {/* TOMBOL AKSI KANAN ATAS (FAVORIT & BANDINGKAN) */}
          <div className="absolute right-3 top-3 z-10 flex items-center gap-2">
            {/* Tombol Pilih Bandingkan */}
            <button
              type="button"
              onClick={handleToggleCompare}
              className={`flex items-center gap-1 rounded-xl px-2.5 py-1.5 text-xs font-semibold shadow-md backdrop-blur-md transition cursor-pointer ${
                isCompared
                  ? "bg-amber-600 text-white hover:bg-amber-700"
                  : "bg-white/90 text-gray-700 hover:bg-white"
              }`}
              title={isCompared ? "Batalkan Perbandingan" : "Pilih untuk Bandingkan"}
            >
              <Scale className="h-3.5 w-3.5" />
              <span className="text-[10px]">{isCompared ? "Dibandingkan" : "Bandingkan"}</span>
            </button>

            {/* Tombol Favorit (Heart) */}
            <button
              type="button"
              onClick={handleToggleLike}
              className={`flex h-7 w-7 items-center justify-center rounded-full shadow-md backdrop-blur-md transition hover:scale-110 cursor-pointer ${
                isLiked ? "bg-white text-rose-500" : "bg-white/80 text-gray-700 hover:bg-white"
              }`}
              title="Tambah ke Favorit"
            >
              <Heart
                className={`h-4 w-4 transition-colors ${
                  isLiked ? "fill-rose-500 text-rose-500" : "text-gray-600"
                }`}
              />
            </button>
          </div>

          {/* SLIDER CONTROLS (Tampil jika foto > 1) */}
          {rawImages.length > 1 && (
            <>
              {/* Hitungan Foto (Misal: 1/4) */}
              <div className="absolute right-3 bottom-3 z-10 rounded-md bg-black/60 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-xs">
                {currentIndex + 1}/{rawImages.length}
              </div>

              {/* Tombol Panah Prev / Next */}
              <button
                type="button"
                onClick={handlePrev}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white/80 text-gray-800 shadow-md backdrop-blur-xs opacity-0 group-hover:opacity-100 hover:bg-white transition cursor-pointer"
                title="Foto Sebelumnya"
              >
                <ChevronLeft className="h-4 w-4 stroke-[2.5]" />
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white/80 text-gray-800 shadow-md backdrop-blur-xs opacity-0 group-hover:opacity-100 hover:bg-white transition cursor-pointer"
                title="Foto Selanjutnya"
              >
                <ChevronRight className="h-4 w-4 stroke-[2.5]" />
              </button>

              {/* Dots Indicator */}
              <div className="absolute bottom-2.5 left-1/2 z-10 flex -translate-x-1/2 gap-1">
                {rawImages.map((_, idx) => (
                  <span
                    key={idx}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      idx === currentIndex ? "w-4 bg-white" : "w-1.5 bg-white/50"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* ================= AREA KONTEN & DETAIL ================= */}
        <div className="flex grow flex-col justify-between p-4 sm:p-5">
          <div>
            {/* Harga Properti */}
            <div className="text-amber-700 font-heading text-xl font-black tracking-tight">
              {formatRupiah(property.price)}
            </div>

            {/* Judul Properti */}
            <h3 className="mt-1 font-heading text-base font-bold text-gray-900 transition-colors group-hover:text-amber-600 line-clamp-1">
              {property.title}
            </h3>

            {/* Lokasi */}
            {property.location && (
              <div className="mt-2 flex items-center gap-1.5 text-xs font-medium text-gray-500">
                <MapPin className="h-3.5 w-3.5 shrink-0 text-amber-500" />
                <span className="line-clamp-1">{property.location}</span>
              </div>
            )}
          </div>

          {/* ================= GRID SPESIFIKASI PROPERTI ================= */}
          <div className="mt-4 border-t border-gray-100 pt-3 text-xs font-semibold text-gray-600">
            <div className="grid grid-cols-3 gap-2">
              <div className="flex items-center gap-1.5" title="Kamar Tidur">
                <Bed className="h-4 w-4 text-amber-500" />
                <span>{bedrooms} KT</span>
              </div>
              <div className="flex items-center gap-1.5" title="Kamar Mandi">
                <Bath className="h-4 w-4 text-amber-500" />
                <span>{bathrooms} KM</span>
              </div>
              <div className="flex items-center gap-1.5" title="Luas Bangunan / Tanah">
                <Square className="h-4 w-4 text-amber-500" />
                <span>
                  {buildingArea > 0 ? `LB ${buildingArea}m²` : landArea > 0 ? `LT ${landArea}m²` : "-"}
                </span>
              </div>
            </div>
          </div>

        </div>
      </Link>
    </div>
  );
}