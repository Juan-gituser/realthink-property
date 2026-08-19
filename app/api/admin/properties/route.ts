import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase"; // Sesuaikan lokasi client Supabase Anda

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("properties")
      .select("id, title, price");

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data: data || [],
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}