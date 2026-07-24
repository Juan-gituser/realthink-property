"use client";

import { useState } from "react";
import PropertyMap from "@/components/PropertyMap";
import SurveyModal from "@/components/SurveyModal";
import { MapPin, Calendar, MessageSquare, Phone, Mail, Heart } from "lucide-react";

export default function DetailPropertiPage() {
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
  const trackGAEvent = (action: string, params?: Record<string, any>) => {
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", action, params);
    }
  };

  // 1. Handler Klik WhatsApp
  const handleWhatsAppClick = () => {
    trackGAEvent("click_whatsapp", { property_id: properti.id, property_title: properti.title });
    window.open(`https://wa.me/${properti.whatsapp}?text=Halo, saya tertarik dengan properti ${properti.title}`, "_blank");
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
      status: newStatus ? "added" : "removed" 
    });
  };

  // 5. Handler Klik Jadwalkan Survei
  const handleSurveyClick = () => {
    trackGAEvent("click_schedule_survey", { property_id: properti.id, property_title: properti.title });
    setIsSurveyOpen(true);
  };

  // 6. Handler Submit Konsultasi
  const handleConsultationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    trackGAEvent("submit_consultation", { property_id: properti.id, property_title: properti.title });
    alert("Konsultasi berhasil dikirim!");
  };

  // 7. Handler Submit Survei (Dihandle ketika modal survei sukses mengirim data)
  const handleSurveySubmitSuccess = () => {
    trackGAEvent("submit_survey", { property_id: properti.id, property_title: properti.title });
    setIsSurveyOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-4xl space-y-8">
        
        {/* Informasi Utama Properti & Tombol Aksi */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
          <div className="flex justify-between items-start gap-4">
            <div className="space-y-2">
              <h1 className="text-2xl font-heading font-bold text-gray-900">
                {properti.title}
              </h1>
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-amber-600" /> {properti.address}
              </p>
            </div>
            
            {/* Tombol Favorite Property */}
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

          {/* Grid Tombol Interaksi & Tracking */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2">
            <button
              onClick={handleSurveyClick}
              className="bg-secondary hover:bg-secondary/90 text-primary font-bold px-4 py-3 rounded-xl transition shadow-sm flex items-center justify-center gap-2 text-xs cursor-pointer"
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

        {/* Form Konsultasi Properti (Submit Konsultasi) */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-gray-900">Form Konsultasi Properti</h2>
          <form onSubmit={handleConsultationSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Pertanyaan / Pesan Konsultasi</label>
              <textarea 
                rows={3} 
                required 
                placeholder="Tuliskan pertanyaan Anda mengenai properti ini..."
                className="w-full text-sm p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
              ></textarea>
            </div>
            <button 
              type="submit"
              className="bg-primary text-white font-bold px-6 py-2.5 rounded-xl text-sm transition hover:bg-primary/90 cursor-pointer"
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