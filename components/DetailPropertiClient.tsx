"use client";

import { useState } from "react";
import Image from "next/image";
import PropertyMap from "@/components/PropertyMap";
import SurveyModal from "@/components/SurveyModal";
import { MapPin, Calendar, MessageSquare, Phone, Mail, Heart, Bed, Bath, Maximize } from "lucide-react";

export default function DetailPropertiClient({ properti }: { properti: any }) {
  const [isSurveyOpen, setIsSurveyOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const trackGAEvent = (action: string, params?: Record<string, unknown>) => {
    if (typeof window !== "undefined" && (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag) {
      (window as unknown as { gtag: (...args: unknown[]) => void }).gtag("event", action, params);
    }
  };

  const handleWhatsAppClick = () => {
    trackGAEvent("click_whatsapp", { property_id: properti.id, property_title: properti.title });
    window.open(`https://wa.me/${properti.whatsapp}?text=Halo, saya tertarik dengan properti ${properti.title}`, "_blank");
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
      status: newStatus ? "added" : "removed" 
    });
  };

  const handleSurveyClick = () => {
    trackGAEvent("click_schedule_survey", { property_id: properti.id, property_title: properti.title });
    setIsSurveyOpen(true);
  };

  const handleConsultationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    trackGAEvent("submit_consultation", { property_id: properti.id, property_title: properti.title });
    alert("Konsultasi berhasil dikirim!");
  };

  const handleSurveySubmitSuccess = () => {
    trackGAEvent("submit_survey", { property_id: properti.id, property_title: properti.title });
    setIsSurveyOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-4xl space-y-8">
        
        {/* Banner Gambar Utama */}
        <div className="relative h-80 w-full rounded-2xl overflow-hidden shadow-sm bg-gray-100">
          <Image
            src={properti.imageUrl}
            alt={properti.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Informasi Utama Properti & Tombol Aksi */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
          <div className="flex justify-between items-start gap-4">
            <div className="space-y-2">
              <span className="text-sm font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
                {properti.price}
              </span>
              <h1 className="text-2xl font-heading font-bold text-gray-900 mt-2">
                {properti.title}
              </h1>
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-amber-600" /> {properti.location}
              </p>
            </div>
            
            <button
              onClick={handleFavoriteClick}
              className={`p-3 rounded-xl border transition flex items-center justify-center cursor-pointer ${
                isFavorite 
                  ? "bg-red-50 border-red-200 text-red-600" 
                  : "bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100"
              }`}
              title="Favorite Property"
            >
              <Heart className={`w-5 h-5 ${isFavorite ? "fill-red-600" : ""}`} />
            </button>
          </div>

          {/* Spesifikasi Properti */}
          <div className="grid grid-cols-3 gap-4 py-3 border-t border-b border-gray-100 text-xs text-gray-700 font-semibold">
            <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-xl">
              <Bed className="w-4 h-4 text-amber-600" />
              <span>{properti.bedrooms} Kamar Tidur</span>
            </div>
            <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-xl">
              <Bath className="w-4 h-4 text-amber-600" />
              <span>{properti.bathrooms} Kamar Mandi</span>
            </div>
            <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-xl">
              <Maximize className="w-4 h-4 text-amber-600" />
              <span>{properti.buildingArea} m² Luas Bangunan</span>
            </div>
          </div>

          {/* Grid Tombol Interaksi & Tracking */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2">
            <button
              onClick={handleSurveyClick}
              className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-4 py-3 rounded-xl transition shadow-sm flex items-center justify-center gap-2 text-xs cursor-pointer"
            >
              <Calendar className="w-4 h-4" /> Jadwalkan Survei
            </button>
            <button
              onClick={handleWhatsAppClick}
              className="bg-green-600 hover:bg-green-700 text-white font-bold px-4 py-3 rounded-xl transition shadow-sm flex items-center justify-center gap-2 text-xs cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" /> WhatsApp
            </button>
            <button
              onClick={handlePhoneClick}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-3 rounded-xl transition shadow-sm flex items-center justify-center gap-2 text-xs cursor-pointer"
            >
              <Phone className="w-4 h-4" /> Telepon
            </button>
            <button
              onClick={handleEmailClick}
              className="bg-gray-800 hover:bg-gray-900 text-white font-bold px-4 py-3 rounded-xl transition shadow-sm flex items-center justify-center gap-2 text-xs cursor-pointer"
            >
              <Mail className="w-4 h-4" /> Email
            </button>
          </div>
        </div>

        {/* Form Konsultasi Properti */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-gray-900">Form Konsultasi Properti</h2>
          <form onSubmit={handleConsultationSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Pertanyaan / Pesan Konsultasi</label>
              <textarea 
                rows={3} 
                required 
                placeholder="Tuliskan pertanyaan Anda mengenai properti ini..."
                className="w-full text-sm p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white text-gray-900"
              ></textarea>
            </div>
            <button 
              type="submit"
              className="bg-slate-900 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition hover:bg-slate-800 cursor-pointer"
            >
              Submit Konsultasi
            </button>
          </form>
        </div>

        {/* Peta Interaktif Lokasi Properti */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
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
        propertyId={properti.id}
        propertyTitle={properti.title}
        onSubmitSuccess={handleSurveySubmitSuccess}
      />
    </div>
  );
}