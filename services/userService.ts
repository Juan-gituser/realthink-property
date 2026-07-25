import { createClient } from "@/lib/supabase/client";
import { UserProfile } from "@/types/auth";

/**
 * Mengambil detail profil dan role pengguna dari tabel Supabase
 */
export async function fetchUserProfile(userId: string): Promise<UserProfile | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Gagal mengambil profil pengguna:", error.message);
    return null;
  }

  return data;
}