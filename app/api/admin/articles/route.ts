import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: Request) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const category = searchParams.get("category");
    const query = searchParams.get("query");

    // 1. Ambil kolom artikel + JOIN ke tabel profiles untuk mengambil full_name / name
    // Sesuaikan 'profiles(full_name)' dengan nama tabel & kolom user Anda
    let builder = supabase
      .from("articles")
      .select(`
        id,
        title,
        slug,
        category,
        status,
        published_at,
        created_at,
        cover_image,
        author:profiles(full_name)
      `);

    if (status && status !== "Semua") {
      builder = builder.eq("status", status);
    }

    if (category && category !== "Semua") {
      builder = builder.eq("category", category);
    }

    if (query && query.trim()) {
      builder = builder.ilike("title", `%${query.trim()}%`);
    }

    // 2. Urutkan berdasarkan created_at (karena draft belum punya published_at)
    const { data, error } = await builder.order("created_at", { ascending: false });

    if (error) {
      console.error("[SUPABASE_QUERY_ERROR]", error);
      throw error;
    }

    // 3. Format 'author' agar menjadi String tunggal untuk Komponen React Frontend
    const formattedData = (data || []).map((article: any) => {
      let authorName = "Admin";

      if (typeof article.author === "string") {
        authorName = article.author;
      } else if (article.author && typeof article.author === "object") {
        authorName = article.author.full_name || article.author.name || "Admin";
      }

      return {
        ...article,
        author: authorName,
      };
    });

    return NextResponse.json({ success: true, data: formattedData });
  } catch (err: unknown) {
    console.error("[ADMIN_ARTICLES_GET_ERROR]", err);
    return NextResponse.json(
      { success: false, error: "Gagal memuat daftar artikel dari database." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID artikel diperlukan." },
        { status: 400 }
      );
    }

    const { error } = await supabase.from("articles").delete().eq("id", id);
    if (error) {
      console.error("[SUPABASE_DELETE_ERROR]", error);
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error("[ADMIN_ARTICLES_DELETE_ERROR]", err);
    return NextResponse.json(
      { success: false, error: "Gagal menghapus artikel." },
      { status: 500 }
    );
  }
}