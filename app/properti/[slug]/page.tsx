import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server"; // Gunakan server client untuk Server Component
import DetailPropertiClient from "@/components/DetailPropertiClient";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Fungsi increment view count ke Supabase
async function incrementViewCount(propertyId: string) {
  const supabase = await createClient();
  await supabase.rpc("increment_views", { property_id: propertyId });
}

// Fungsi mengambil data properti dari Supabase
async function getPropertyBySlug(slug: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) {
    console.error("Gagal mengambil data properti:", error?.message);
    return null;
  }

  return {
    id: String(data.id),
    title: data.title || "Tanpa Judul",
    slug: data.slug,
    price: data.price || data.raw_price || 0,
    location:
      data.location ||
      [data.district, data.city].filter(Boolean).join(", ") ||
      "Lokasi tidak spesifik",
    address: data.address || "",
    bedrooms: Number(data.bedrooms) || 0,
    bathrooms: Number(data.bathrooms) || 0,
    buildingArea: Number(data.building_area) || 0,
    landArea: Number(data.land_area) || 0,
    imageUrl:
      data.image_url ||
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
    
    // 🟢 PERBAIKAN UTAMA: Ambil array images dari database, 
    // fallback ke array yang berisi imageUrl jika kolom images kosong/null
    images: Array.isArray(data.images) && data.images.length > 0
      ? data.images 
      : [data.image_url || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80"],

    status: (data.status === "disewa" ? "disewa" : "dijual") as "dijual" | "disewa",
    category: data.category || "Rumah",
    legality: data.legality || "SHM",
    description: data.description || "Belum ada deskripsi rinci untuk properti ini.",
    lat: Number(data.lat) || -6.2,
    lng: Number(data.lng) || 106.8166,
    whatsapp: data.whatsapp || "6281234567890",
    phone: data.phone || "+6221555888",
    email: data.email || "info@properti.com",
  };
}

export default async function DetailPropertiPage({ params }: PageProps) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  const properti = await getPropertyBySlug(slug);

  if (!properti) {
    notFound();
  }

  // Tambahkan view count secara otomatis
  await incrementViewCount(properti.id);

  return <DetailPropertiClient properti={properti} />;
}