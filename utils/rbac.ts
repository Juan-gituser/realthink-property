import { createClient } from "@/lib/supabase/server";

export async function checkUserPermission(userId: string, targetPath: string): Promise<boolean> {
  const supabase = await createClient();

  // 1. Ambil role user dari tabel profiles
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();

  const userRole = profile?.role || "guest";

  // Super admin memiliki akses universal
  if (userRole === "super_admin") return true;

  // 2. Ambil aturan rute dari database (`route_permissions`)
  const { data: routeRules } = await supabase
    .from("route_permissions")
    .select("path_prefix, required_role");

  // Cari aturan rute yang paling cocok dengan path saat ini
  const matchedRule = routeRules?.find(rule => targetPath.startsWith(rule.path_prefix));

  if (!matchedRule) return true; // Jika rute tidak diproteksi, izinkan

  // Cek hirarki atau kecocokan role
  if (matchedRule.required_role === userRole) return true;

  // Admin dapat mengakses rute smart_buyer dan investor_pro
  if (userRole === "admin" && ["member", "smart_buyer", "investor_pro"].includes(matchedRule.required_role)) {
    return true;
  }

  return false;
}