import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/client";
import HeroSection from "@/components/home/HeroSection";
import PropertyCategories from "@/components/home/PropertyCategories";
import FeaturedProperties from "@/components/home/FeaturedProperties";
import LatestProperties from "@/components/home/LatestProperties";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import LatestArticles from "@/components/home/LatestArticles";
import CallToAction from "@/components/home/CallToAction";

export const metadata: Metadata = {
  title: "Realthink Property | Solusi Properti Modern & Terpercaya",
  description:
    "Cari dan temukan rumah, apartemen, ruko, dan tanah impian Anda di Realthink Property. Listing terlengkap, harga transparan, dan simulasi KPR akurat.",
  openGraph: {
    title: "Realthink Property | Solusi Properti Modern & Terpercaya",
    description: "Temukan properti idaman Anda dengan fasilitas terbaik dan proses mudah.",
    url: "https://realthinkproperty.com",
    siteName: "Realthink Property",
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Realthink Property",
    description: "Listing Properti Cerdas & Terpercaya di Indonesia",
  },
  alternates: {
    canonical: "https://realthinkproperty.com",
  },
};

interface PropertyRow {
  id: string | number;
  title: string;
  slug: string;
  price: number | string;
  location: string;
  city: string;
  district: string;
  bedrooms?: number;
  bathrooms?: number;
  land_area?: number;
  building_area?: number;
  image_url?: string;
  status: string;
  category?: string;
  is_featured?: boolean;
}

// Fungsi Fetch Properti Unggulan dari Supabase dengan createClient terbaru
async function getFeaturedProperties() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("is_featured", true)
    .order("created_at", { ascending: false })
    .limit(6); // Batasi jumlah properti unggulan yang tampil

  if (error) {
    console.error("Gagal memuat properti unggulan:", error);
    return [];
  }

  if (!data) return [];

  // Mapping data dengan konversi price menjadi string
  return (data as PropertyRow[]).map((item) => ({
    id: String(item.id),
    title: item.title,
    slug: item.slug,
    price: String(item.price || 0),
    location: item.location,
    city: item.city,
    district: item.district,
    bedrooms: item.bedrooms || 0,
    bathrooms: item.bathrooms || 0,
    landArea: item.land_area || 0,
    buildingArea: item.building_area || 0,
    imageUrl: item.image_url || "/placeholder-property.jpg",
    status: (item.status === "disewa" ? "disewa" : "dijual") as "dijual" | "disewa",
    category: item.category || "Properti",
    isFeatured: item.is_featured || false,
  }));
}

export default async function Home() {
  const featuredProperties = await getFeaturedProperties();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: "Realthink Property",
    image: "https://realthinkproperty.com/logo.png",
    description: "Platform listing properti terpercaya di Indonesia.",
    url: "https://realthinkproperty.com",
    telephone: "+6281234567890",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Jl. Contoh Alamat No. 123, Jakarta Selatan",
      addressLocality: "Jakarta Selatan",
      addressRegion: "DKI Jakarta",
      postalCode: "12190",
      addressCountry: "ID",
    },
    priceRange: "$$$",
  };

  return (
    <>
      {/* Schema Structured Data JSON-LD untuk SEO Real Estate Agent */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Main Landing Page Realthink Property */}
      <div className="flex flex-col gap-16 pb-16 md:gap-24">
        <HeroSection />
        <PropertyCategories />
        <FeaturedProperties properties={featuredProperties} />
        <WhyChooseUs />
        <LatestProperties />
        <LatestArticles />
        <CallToAction />
      </div>
    </>
  );
}