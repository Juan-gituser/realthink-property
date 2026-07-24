import type { Metadata } from "next";
import { supabase } from "@/lib/supabase";
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
    description:
      "Temukan properti idaman Anda dengan fasilitas terbaik dan proses mudah.",
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

// Fungsi Fetch Properti Unggulan dari Supabase dengan Casting Type Status
async function getFeaturedProperties() {
  const { data } = await supabase
    .from("properties")
    .select("*")
    .eq("is_featured", true)
    .limit(3);

  if (!data) return [];

  // Mapping data dengan casting type status yang valid ("dijual" | "disewa")
  return data.map((item: any) => ({
    id: String(item.id),
    title: item.title,
    slug: item.slug,
    price: item.price,
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
      <div className="flex flex-col gap-16 md:gap-24 pb-16">
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