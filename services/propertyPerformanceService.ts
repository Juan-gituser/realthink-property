import { createClient } from "@/lib/supabase/client";
import { PropertyPerformanceItem } from "@/types/property-performance";

/**
 * Mengambil data performa properti dari database Supabase
 */
export async function fetchPropertyPerformances(): Promise<PropertyPerformanceItem[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("property_performance") // Ganti dengan nama tabel/view Anda di Supabase
    .select("*");

  if (error) {
    console.error("Gagal mengambil data performance:", error.message);
    throw new Error(error.message);
  }

  return data || [];
}