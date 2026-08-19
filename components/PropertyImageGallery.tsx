"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Images } from "lucide-react";

interface PropertyImageGalleryProps {
  // Menerima array URL foto atau string tunggal
  images: string[] | string;
  title?: string;
  status?: string;
}

export default function PropertyImageGallery({
  images,
  title = "Properti",
  status = "DIJUAL",
}: PropertyImageGalleryProps) {
  // Normalisasi data agar selalu berbentuk Array
  const imageList = Array.isArray(images)
    ? images.filter(Boolean)
    : images
    ? [images]
    : ["/placeholder-property.jpg"];

  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? imageList.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === imageList.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="space-y-3">
      {/* Gambar Utama (Main Viewer) */}
      <div className="relative aspect-16/9 w-full overflow-hidden rounded-2xl bg-gray-100 shadow-md">
        <Image
          src={imageList[currentIndex]}
          alt={`${title} - Foto ${currentIndex + 1}`}
          fill
          priority
          className="object-cover transition-all duration-300"
        />

        {/* Badge Status */}
        {status && (
          <span className="absolute top-4 left-4 rounded-lg bg-gray-900/80 px-3 py-1.5 text-xs font-bold text-white uppercase backdrop-blur-xs">
            {status}
          </span>
        )}

        {/* Indikator Jumlah Foto */}
        <div className="absolute bottom-4 right-4 flex items-center gap-1.5 rounded-lg bg-black/60 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-xs">
          <Images className="h-4 w-4" />
          <span>
            {currentIndex + 1} / {imageList.length}
          </span>
        </div>

        {/* Tombol Navigasi Panah (Hanya tampil jika foto > 1) */}
        {imageList.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute top-1/2 left-3 -translate-y-1/2 rounded-full bg-white/80 p-2 text-gray-800 shadow-lg backdrop-blur-xs transition hover:bg-white hover:scale-110 active:scale-95"
              aria-label="Foto Sebelumnya"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={handleNext}
              className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full bg-white/80 p-2 text-gray-800 shadow-lg backdrop-blur-xs transition hover:bg-white hover:scale-110 active:scale-95"
              aria-label="Foto Selanjutnya"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {/* Grid Thumbnail Pilihan Foto (Slider Bawah) */}
      {imageList.length > 1 && (
        <div className="custom-scrollbar flex gap-2.5 overflow-x-auto pb-2">
          {imageList.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`relative h-20 w-28 shrink-0 overflow-hidden rounded-xl transition-all ${
                currentIndex === idx
                  ? "ring-2 ring-amber-500 ring-offset-2 opacity-100 scale-95"
                  : "opacity-60 hover:opacity-100"
              }`}
            >
              <Image
                src={img}
                alt={`Thumbnail ${idx + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}