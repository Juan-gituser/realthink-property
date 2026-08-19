"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import PropertyMap from "@/components/PropertyMap";
import SurveyModal from "@/components/SurveyModal";
import { 
  MapPin, 
  Calendar, 
  MessageSquare, 
  Phone, 
  Mail, 
  Heart,
  ChevronLeft, 
  ChevronRight 
} from "lucide-react";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function DetailPropertyPage({ propertyId }: { propertyId: string }) {
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSurveyOpen, setIsSurveyOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    async function fetchPropertyDetail() {
      try {
        const { data, error } = await supabase
          .from("properties")
          .select("*")
          .eq("id", propertyId)
          .single();

        if (error) throw error;
        
        // Normalisasi format gambar agar aman dibaca menjadi Array
        let rawImages = data?.images;
        if (typeof rawImages === "string") {
          try {
            // Coba parse jika formatnya JSON string array (misal: '["url1","url2"]')
            rawImages = JSON.parse(rawImages);
          } catch {
            // Jika dipisah koma (misal: 'url1,url2') atau hanya 1 string URL biasa
            rawImages = rawImages.includes(",") ? rawImages.split(",").map((s: string) => s.trim()) : [rawImages];
          }
        }
        
        setProperty({
          ...data,
          images: Array.isArray(rawImages) ? rawImages : []
        });
      } catch (err) {
        console.error("Gagal memuat detail properti:", err);
      } finally {
        setLoading(false);
      }
    }

    if (propertyId) {
      fetchPropertyDetail();
    }
  }, [propertyId]);

  const prevImage = () => {
    if (!property?.images) return;
    setCurrentImageIndex((prev) => 
      prev === 0 ? property.images.length - 1 : prev - 1
    );
  };

  const nextImage = () => {
    if (!property?.images) return;
    setCurrentImageIndex((prev) => 
      prev === property.images.length - 1 ? 0 : prev + 1
    );
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Memuat data properti...</div>;
  }

  if (!property) {
    return <div className="min-h-screen flex items-center justify-center">Properti tidak ditemukan.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="container mx-auto max-w-4xl space-y-8 px-4">
        
        {property.images && property.images.length > 0 ? (
          <div className="relative w-full h-75[300px] md:h-125[500px] overflow-hidden rounded-2xl bg-gray-200 shadow-sm">
            <img 
              src={property.images[currentImageIndex]} 
              alt={`${property.title} - Foto ${currentImageIndex + 1}`} 
              className="w-full h-full object-cover transition-all duration-300"
            />

            {property.images.length > 1 && (
              <>
                <button 
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-md cursor-pointer transition z-10"
                  aria-label="Previous Image"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button 
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-md cursor-pointer transition z-10"
                  aria-label="Next Image"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 px-3 py-1 rounded-full text-white text-xs font-medium z-10">
                  {currentImageIndex + 1} / {property.images.length}
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="w-full h-75[300px] md:h-125[500px] bg-gray-200 rounded-2xl flex items-center justify-center text-gray-400">
            Tidak ada foto tersedia
          </div>
        )}

        <div className="space-y-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <h1 className="font-heading text-2xl font-bold text-gray-900">{property.title}</h1>
              <p className="flex items-center gap-1 text-xs text-gray-500">
                <MapPin className="h-3.5 w-3.5 text-amber-600" /> {property.address}
              </p>
            </div>

            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className={`flex cursor-pointer items-center justify-center rounded-xl border p-3 transition ${
                isFavorite
                  ? "border-red-200 bg-red-50 text-red-600"
                  : "border-gray-200 bg-gray-50 text-gray-500 hover:bg-gray-100"
              }`}
            >
              <Heart className={`h-5 w-5 ${isFavorite ? "fill-red-600" : ""}`} />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3 pt-2 sm:grid-cols-2 md:grid-cols-4">
            <button
              onClick={() => setIsSurveyOpen(true)}
              className="bg-secondary hover:bg-secondary/90 text-primary flex cursor-pointer items-center justify-center gap-2 rounded-xl px-4 py-3 text-xs font-bold shadow-sm transition"
            >
              <Calendar className="h-4 w-4" /> Jadwalkan Survei
            </button>
            <button
              onClick={() => window.open(`https://wa.me/${property.whatsapp}?text=Halo, saya tertarik dengan properti ${property.title}`, "_blank", "noopener,noreferrer")}
              className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-3 text-xs font-bold text-white shadow-sm transition hover:bg-green-700"
            >
              <MessageSquare className="h-4 w-4" /> WhatsApp
            </button>
            <button
              onClick={() => window.location.href = `tel:${property.phone}`}
              className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-xs font-bold text-white shadow-sm transition hover:bg-blue-700"
            >
              <Phone className="h-4 w-4" /> Telepon
            </button>
            <button
              onClick={() => window.location.href = `mailto:${property.email}`}
              className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-gray-800 px-4 py-3 text-xs font-bold text-white shadow-sm transition hover:bg-gray-900"
            >
              <Mail className="h-4 w-4" /> Email
            </button>
          </div>
        </div>

        {property.lat && property.lng && (
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <PropertyMap
              lat={property.lat}
              lng={property.lng}
              address={property.address}
              title={property.title}
            />
          </div>
        )}
      </div>

      <SurveyModal
        isOpen={isSurveyOpen}
        onClose={() => setIsSurveyOpen(false)}
        propertyId={property.id}
        propertyTitle={property.title}
        onSubmitSuccess={() => setIsSurveyOpen(false)}
      />
    </div>
  );
}