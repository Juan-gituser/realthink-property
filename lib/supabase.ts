import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Peringatan: Supabase URL atau Anon Key belum terpasang di file .env.local");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);