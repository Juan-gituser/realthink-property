"use client";

import { useState } from "react";
import PropertyMap from "@/components/PropertyMap";
import SurveyModal from "@/components/SurveyModal";
import { MapPin, Calendar, MessageSquare, Phone, Mail, Heart } from "lucide-react";

export default function DetailPropertyPage() {
  const [isSurveyOpen, setIsSurveyOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  // Contoh data properti
  const properti = {
    id: "prop-001",
    title: "Modern Minimalist House BSD",
    address: "Jl. Grand Boulevard No. 10, BSD City, Tangerang Selatan",
    lat: -6.2995,
    lng: 106.6518,
    whatsapp: "6281234567890",
    phone: "+6221555888",
    email: "info@properti.com",
  };

  // Helper function untuk Google Analytics Event Tracking (gtag)
  const trackGAEvent = (action: string, params?: Record<string, unknown>) => {
    if (
      typeof window !== "undefined" &&
      (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag
    ) {
      (window as unknown as { gtag: (...args: unknown[]) => void }).gtag("event", action, params);
    }
  };

  // 1. Handler Klik WhatsApp
  const handleWhatsAppClick = () => {
    trackGAEvent("click_whatsapp", { property_id: properti.id, property_title: properti.title });
    window.open(
      `https://wa.me/${properti.whatsapp}?text=Halo, saya tertarik dengan properti ${properti.title}`,
      "_blank"
    );
  };

  // 2. Handler Klik Telepon
  const handlePhoneClick = () => {
    trackGAEvent("click_phone", { property_id: properti.id, property_title: properti.title });
    window.location.href = `tel:${properti.phone}`;
  };

  // 3. Handler Klik Email
  const handleEmailClick = () => {
    trackGAEvent("click_email", { property_id: properti.id, property_title: properti.title });
    window.location.href = `mailto:${properti.email}?subject=Tertarik dengan ${properti.title}`;
  };

  // 4. Handler Favorite Property
  const handleFavoriteClick = () => {
    const newStatus = !isFavorite;
    setIsFavorite(newStatus);
    trackGAEvent("favorite_property", {
      property_id: properti.id,
      property_title: properti.title,
      status: newStatus ? "added" : "removed",
    });
  };

  // 5. Handler Klik Jadwalkan Survei
  const handleSurveyClick = () => {
    trackGAEvent("click_schedule_survey", {
      property_id: properti.id,
      property_title: properti.title,
    });
    setIsSurveyOpen(true);
  };

  // 6. Handler Submit Konsultasi
  const handleConsultationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    trackGAEvent("submit_consultation", {
      property_id: properti.id,
      property_title: properti.title,
    });
    alert("Konsultasi berhasil dikirim!");
  };

  // 7. Handler Submit Survei (Dihandle ketika modal survei sukses mengirim data)
  const handleSurveySubmitSuccess = () => {
    trackGAEvent("submit_survey", { property_id: properti.id, property_title: properti.title });
    setIsSurveyOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="container mx-auto max-w-4xl space-y-8 px-4">
        {/* Informasi Utama Properti & Tombol Aksi */}
        <div className="space-y-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <h1 className="font-heading text-2xl font-bold text-gray-900">{properti.title}</h1>
              <p className="flex items-center gap-1 text-xs text-gray-500">
                <MapPin className="h-3.5 w-3.5 text-amber-600" /> {properti.address}
              </p>
            </div>

            {/* Tombol Favorite Property */}
            <button
              onClick={handleFavoriteClick}
              className={`flex cursor-pointer items-center justify-center rounded-xl border p-3 transition ${
                isFavorite
                  ? "border-red-200 bg-red-50 text-red-600"
                  : "border-gray-200 bg-gray-50 text-gray-500 hover:bg-gray-100"
              }`}
              title="Favorite Property"
            >
              <Heart className={`h-5 w-5 ${isFavorite ? "fill-red-600" : ""}`} />
            </button>
          </div>

          {/* Grid Tombol Interaksi & Tracking */}
          <div className="grid grid-cols-1 gap-3 pt-2 sm:grid-cols-2 md:grid-cols-4">
            <button
              onClick={handleSurveyClick}
              className="bg-secondary hover:bg-secondary/90 text-primary flex cursor-pointer items-center justify-center gap-2 rounded-xl px-4 py-3 text-xs font-bold shadow-sm transition"
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

        {/* Form Konsultasi Properti (Submit Konsultasi) */}
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
                className="w-full rounded-xl border border-gray-300 p-3 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
              ></textarea>
            </div>
            <button
              type="submit"
              className="bg-primary hover:bg-primary/90 cursor-pointer rounded-xl px-6 py-2.5 text-sm font-bold text-white transition"
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
            address={properti.address}
            title={properti.title}
          />
        </div>
      </div>

      {/* Modal Survei (Submit Survei) */}
      <SurveyModal
        isOpen={isSurveyOpen}
        onClose={() => setIsSurveyOpen(false)}
        propertyId={properti.id}
        propertyTitle={properti.title}
        onSubmitSuccess={handleSurveySubmitSuccess}
      />
    </div>
  );
}