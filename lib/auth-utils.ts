import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { User } from "@supabase/supabase-js";
import { hasPermission, Permission, Role } from "./permissions";
import { redirect } from "next/navigation";

// Inisialisasi Supabase Server Client secara mandiri
async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Diabaikan jika dipanggil dari Server Component yang tidak bisa set cookie
          }
        },
      },
    }
  );
}

// Mengambil role user yang sedang aktif (menggunakan tipe data User, bebas dari 'any')
async function getCurrentUserRole(): Promise<{ user: User | null; role: Role }> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { user: null, role: "guest" };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  return { user, role: (profile?.role as Role) || "member" };
}

// Fungsi proteksi halaman (otomatis redirect jika tidak punya izin)
export async function requirePermission(permission: Permission, redirectTo = "/upgrade") {
  const { user, role } = await getCurrentUserRole();

  if (!hasPermission(role, permission)) {
    redirect(redirectTo);
  }

  return { user, role };
}

// Fungsi pengecekan boolean (mengembalikan true/false tanpa redirect)
export async function checkPermission(permission: Permission): Promise<boolean> {
  const { role } = await getCurrentUserRole();
  return hasPermission(role, permission);
}
