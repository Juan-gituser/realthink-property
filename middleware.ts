import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // PENTING: Jangan letakkan logika apa pun di antara createServerClient dan supabase.auth.getUser()
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // 1. Jika mencoba mengakses dashboard tanpa login
  if (!user && pathname.startsWith("/dashboard")) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  // 2. Jika user login dan mengakses dashboard, lakukan cek otorisasi role & permission
  if (user && pathname.startsWith("/dashboard")) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    const role = profile?.role || "member";

    // Super Admin bebas akses ke semua rute dashboard
    if (role !== "super_admin") {
      // Ambil aturan proteksi rute langsung dari tabel database (Tanpa Hardcode)
      const { data: routeRules } = await supabase
        .from("route_permissions")
        .select("path_prefix, required_role");

      const matchedRule = routeRules?.find((rule) =>
        pathname.startsWith(rule.path_prefix)
      );

      if (matchedRule) {
        let isAllowed = false;
        if (matchedRule.required_role === role) isAllowed = true;
        if (role === "admin") isAllowed = true; // Admin memiliki akses istimewa

        if (!isAllowed) {
          const upgradeUrl = request.nextUrl.clone();
          upgradeUrl.pathname = "/upgrade";
          upgradeUrl.searchParams.set("plan", matchedRule.required_role);
          return NextResponse.redirect(upgradeUrl);
        }
      }
    }
  }

  // Mengembalikan response lengkap dengan cookie session Supabase yang sudah diperbarui
  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};