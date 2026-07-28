"use client";

import { useState } from "react";
import Image from "next/image";
import PropertyMap from "@/components/PropertyMap";
import SurveyModal from "@/components/SurveyModal";
import {
  MapPin,
  Calendar,
  MessageSquare,
  Phone,
  Mail,
  Heart,
  Bed,
  Bath,
  Maximize,
  Layers,
  FileText,
  Building2,
} from "lucide-react";

export interface Property {
  id: string | number;
  title: string;
  price: string | number;
  location: string;
  address?: string;
  imageUrl: string;
  bedrooms: number;
  bathrooms: number;
  buildingArea: number;
  landArea?: number;
  whatsapp: string;
  phone: string;
  email: string;
  lat: number;
  lng: number;
  status?: "dijual" | "disewa";
  category?: string;
  legality?: string;
  description?: string;
}

interface DetailPropertiClientProps {
  properti: Property;
}

// Helper Format Rupiah
const formatRupiah = (amount: number | string) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0);
};

export default function DetailPropertiClient({ properti }: DetailPropertiClientProps) {
  const [isSurveyOpen, setIsSurveyOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const trackGAEvent = (action: string, params?: Record<string, unknown>) => {
    if (
      typeof window !== "undefined" &&
      (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag
    ) {
      (window as unknown as { gtag: (...args: unknown[]) => void }).gtag("event", action, params);
    }
  };

  const handleWhatsAppClick = () => {
    trackGAEvent("click_whatsapp", { property_id: properti.id, property_title: properti.title });
    window.open(
      `https://wa.me/${properti.whatsapp}?text=Halo, saya tertarik dengan properti ${properti.title}`,
      "_blank"
    );
  };

  const handlePhoneClick = () => {
    trackGAEvent("click_phone", { property_id: properti.id, property_title: properti.title });
    window.location.href = `tel:${properti.phone}`;
  };

  const handleEmailClick = () => {
    trackGAEvent("click_email", { property_id: properti.id, property_title: properti.title });
    window.location.href = `mailto:${properti.email}?subject=Tertarik dengan ${properti.title}`;
  };

  const handleFavoriteClick = () => {
    const newStatus = !isFavorite;
    setIsFavorite(newStatus);
    trackGAEvent("favorite_property", {
      property_id: properti.id,
      property_title: properti.title,
      status: newStatus ? "added" : "removed",
    });
  };

  const handleSurveyClick = () => {
    trackGAEvent("click_schedule_survey", {
      property_id: properti.id,
      property_title: properti.title,
    });
    setIsSurveyOpen(true);
  };

  const handleConsultationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    trackGAEvent("submit_consultation", {
      property_id: properti.id,
      property_title: properti.title,
    });
    alert("Konsultasi berhasil dikirim!");
  };

  const handleSurveySubmitSuccess = () => {
    trackGAEvent("submit_survey", { property_id: properti.id, property_title: properti.title });
    setIsSurveyOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="container mx-auto max-w-4xl space-y-8 px-4">
        {/* Banner Gambar Utama */}
        <div className="relative h-80 w-full overflow-hidden rounded-2xl bg-gray-100 shadow-sm">
          <Image
            src={properti.imageUrl}
            alt={properti.title}
            fill
            className="object-cover"
            priority
          />
          {properti.status && (
            <span className="absolute top-4 left-4 rounded-xl bg-gray-900/80 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-md">
              {properti.status}
            </span>
          )}
        </div>

        {/* Informasi Utama Properti & Tombol Aksi */}
        <div className="space-y-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              {/* Format Rupiah */}
              <span className="inline-block rounded-xl bg-amber-50 px-4 py-1.5 text-lg font-extrabold text-amber-600 border border-amber-200/60">
                {formatRupiah(properti.price)}
              </span>
              <h1 className="font-heading mt-2 text-2xl font-bold text-gray-900">
                {properti.title}
              </h1>
              <p className="flex items-center gap-1 text-xs text-gray-500">
                <MapPin className="h-3.5 w-3.5 text-amber-600 shrink-0" /> {properti.location}
              </p>
            </div>

            <button
              onClick={handleFavoriteClick}
              className={`flex cursor-pointer items-center justify-center rounded-xl border p-3 transition ${
                isFavorite
                  ? "border-red-200 bg-red-50 text-red-600"
                  : "border-gray-200 bg-gray-50 text-gray-500 hover:bg-gray-100"
              }`}
              title="Favorite Property"
            >
              <Heart className={`h-5 w-5 ${isFavorite ? "fill-red-600 text-red-600" : ""}`} />
            </button>
          </div>

          {/* Spesifikasi Properti Lengkap (4 Kolom) */}
          <div className="grid grid-cols-2 gap-3 border-t border-b border-gray-100 py-4 text-xs font-semibold text-gray-700 sm:grid-cols-4">
            <div className="flex items-center gap-2.5 rounded-xl bg-gray-50 p-3">
              <Bed className="h-4 w-4 text-amber-600 shrink-0" />
              <div>
                <p className="text-[10px] text-gray-400 font-normal">Kamar Tidur</p>
                <p className="text-xs font-bold text-gray-900">{properti.bedrooms} KT</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 rounded-xl bg-gray-50 p-3">
              <Bath className="h-4 w-4 text-amber-600 shrink-0" />
              <div>
                <p className="text-[10px] text-gray-400 font-normal">Kamar Mandi</p>
                <p className="text-xs font-bold text-gray-900">{properti.bathrooms} KM</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 rounded-xl bg-gray-50 p-3">
              <Maximize className="h-4 w-4 text-amber-600 shrink-0" />
              <div>
                <p className="text-[10px] text-gray-400 font-normal">Luas Bangunan</p>
                <p className="text-xs font-bold text-gray-900">{properti.buildingArea} m²</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 rounded-xl bg-gray-50 p-3">
              <Layers className="h-4 w-4 text-amber-600 shrink-0" />
              <div>
                <p className="text-[10px] text-gray-400 font-normal">Luas Tanah</p>
                <p className="text-xs font-bold text-gray-900">{properti.landArea || 0} m²</p>
              </div>
            </div>
          </div>

          {/* Grid Tombol Interaksi & Tracking */}
          <div className="grid grid-cols-1 gap-3 pt-2 sm:grid-cols-2 md:grid-cols-4">
            <button
              onClick={handleSurveyClick}
              className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-amber-600 px-4 py-3 text-xs font-bold text-white shadow-sm transition hover:bg-amber-700"
            >
              <Calendar className="h-4 w-4" /> Jadwalkan Survei
            </button>
            <button
              onClick={handleWhatsAppClick}
              className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-3 text-xs font-bold text-white shadow-sm transition hover:bg-green-700"
            >
              <MessageSquare className="h-4 w-4" /> WhatsApp
            </button>
            <button
              onClick={handlePhoneClick}
              className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-xs font-bold text-white shadow-sm transition hover:bg-blue-700"
            >
              <Phone className="h-4 w-4" /> Telepon
            </button>
            <button
              onClick={handleEmailClick}
              className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-gray-800 px-4 py-3 text-xs font-bold text-white shadow-sm transition hover:bg-gray-900"
            >
              <Mail className="h-4 w-4" /> Email
            </button>
          </div>
        </div>

        {/* Deskripsi & Detail Tambahan Properti */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Deskripsi */}
          <div className="md:col-span-2 space-y-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
              <FileText className="h-5 w-5 text-amber-600" />
              Deskripsi Properti
            </h2>
            <div className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
              {properti.description || "Belum ada deskripsi lengkap untuk properti ini."}
            </div>
          </div>

          {/* Detail Legaltas & Kategori */}
          <div className="space-y-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm h-fit">
            <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
              <Building2 className="h-5 w-5 text-amber-600" />
              Detail Spesifikasi
            </h2>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">Kategori</span>
                <span className="font-bold text-gray-900">{properti.category || "Rumah"}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">Legalitas / Sertifikat</span>
                <span className="font-bold text-gray-900">{properti.legality || "SHM"}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">Status Listing</span>
                <span className="font-bold capitalize text-emerald-600">{properti.status || "dijual"}</span>
              </div>
              {properti.address && (
                <div className="pt-2">
                  <span className="text-gray-500 block mb-1">Alamat Lengkap</span>
                  <span className="font-semibold text-gray-800 leading-normal block">{properti.address}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Form Konsultasi Properti */}
        <div className="space-y-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900">Form Konsultasi Properti</h2>
          <form onSubmit={handleConsultationSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-700">
                Pertanyaan / Pesan Konsultasi
              </label>
              <textarea
                rows={3}
                required
                placeholder="Tuliskan pertanyaan Anda mengenai properti ini..."
                className="w-full rounded-xl border border-gray-300 bg-white p-3 text-sm text-gray-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
              ></textarea>
            </div>
            <button
              type="submit"
              className="cursor-pointer rounded-xl bg-slate-900 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-slate-800"
            >
              Submit Konsultasi
            </button>
          </form>
        </div>

        {/* Peta Interaktif Lokasi Properti */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <PropertyMap
            lat={properti.lat}
            lng={properti.lng}
            address={properti.location}
            title={properti.title}
          />
        </div>
      </div>

      <SurveyModal
        isOpen={isSurveyOpen}
        onClose={() => setIsSurveyOpen(false)}
        propertyId={String(properti.id)}
        propertyTitle={properti.title}
        onSubmitSuccess={handleSurveySubmitSuccess}
      />
    </div>
  );
}