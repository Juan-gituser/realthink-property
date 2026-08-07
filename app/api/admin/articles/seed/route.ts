import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Masukkan array data artikel statis Anda di sini
const initialArticles = [
  {
    title: "Tips Membeli Rumah Pertama untuk Milenial",
    slug: "tips-membeli-rumah-pertama",
    category: "Panduan Properti",
    author: "Admin Properti",
    status: "published",
    published_at: new Date().toISOString(),
    cover_image: "/placeholder-property.jpg",
    content: "Isi konten lengkap artikel panduan membeli rumah...", // Tambahkan field konten jika ada
  },
  {
    title: "Memahami Biaya Pajak dan Legalitas Jual Beli Rumah",
    slug: "memahami-biaya-pajak-dan-legalitas",
    category: "Legal & Pajak",
    author: "Tim Hukum",
    status: "published",
    published_at: new Date().toISOString(),
    cover_image: "/placeholder-property.jpg",
    content: "Isi konten lengkap tentang pajak dan sertifikat...",
  },
  {
    title: "5 Tren Desain Interior Rumah Minimalis 2026",
    slug: "5-tren-desain-interior-2026",
    category: "Inspirasi Desain",
    author: "Desainer Interior",
    status: "draft",
    published_at: null,
    cover_image: "/placeholder-property.jpg",
    content: "Isi konten tentang tren interior...",
  },
];

export async function POST() {
  try {
    const supabase = await createClient();

    // Insert data ke tabel articles
    const { data, error } = await supabase
      .from("articles")
      .upsert(initialArticles, { onConflict: "slug" }) // Menghindari duplikasi berdasarkan slug
      .select();

    if (error) {
      console.error("[SEED_ERROR]", error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `${data.length} artikel berhasil dimasukkan ke database!`,
      data,
    });
  } catch (err: unknown) {
    console.error("[SEED_SERVER_ERROR]", err);
    return NextResponse.json(
      { success: false, error: "Gagal memproses seeding database." },
      { status: 500 }
    );
  }
}