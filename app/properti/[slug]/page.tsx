import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import DetailPropertiClient from "@/components/DetailPropertiClient";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Fungsi increment view count ke Supabase
async function incrementViewCount(propertyId: string) {
  const supabase = createClient();
  await supabase.rpc("increment_views", { property_id: propertyId });
}

// Fungsi mengambil data properti tunggal berdasarkan slug dari Supabase
async function getPropertyBySlug(slug: string) {
  const supabase = createClient();

  const { data, error } = await supabase.from("properties").select("*").eq("slug", slug).single();

  if (error || !data) {
    return null;
  }

  // Mapping data database ke format komponen
  return {
    id: String(data.id),
    title: data.title,
    slug: data.slug,
    price: data.price,
    rawPrice: data.raw_price || 0,
    location: data.location || data.city,
    city: data.city,
    district: data.district || "",
    bedrooms: data.bedrooms || 0,
    bathrooms: data.bathrooms || 0,
    landArea: data.land_area || 0,
    buildingArea: data.building_area || 0,
    imageUrl:
      data.image_url ||
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
    status: (data.status === "disewa" ? "disewa" : "dijual") as "dijual" | "disewa",
    category: data.category || "Properti",
    isFeatured: data.is_featured || false,
    lat: data.lat || -6.2,
    lng: data.lng || 106.8166,
    whatsapp: data.whatsapp || "6281234567890",
    phone: data.phone || "+6221555888",
    email: data.email || "info@properti.com",
  };
}

export default async function DetailPropertiPage({ params }: PageProps) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  // Ambil data properti asli dari Supabase
  const properti = await getPropertyBySlug(slug);

  if (!properti) {
    notFound();
  }

  // Tambahkan view count secara otomatis
  await incrementViewCount(properti.id);

  return <DetailPropertiClient properti={properti} />;
}