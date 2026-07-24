import { type NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
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
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh session jika kedaluwarsa
  const { data: { user } } = await supabase.auth.getUser();
  const pathname = request.nextUrl.pathname;

  // Ambil role user dari tabel profiles
  let userRole = 'guest';
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    
    if (profile) {
      userRole = profile.role;
    }
  }

  // Aturan Proteksi Dashboard Berdasarkan Role
  if (pathname.startsWith('/dashboard/smart-buyer') && !['smart_buyer', 'investor_pro', 'super_admin'].includes(userRole)) {
    return NextResponse.redirect(new URL('/upgrade?plan=smart_buyer', request.url));
  }

  if (pathname.startsWith('/dashboard/investor-pro') && !['investor_pro', 'super_admin'].includes(userRole)) {
    return NextResponse.redirect(new URL('/upgrade?plan=investor_pro', request.url));
  }

  if (pathname.startsWith('/admin') && !['admin', 'super_admin'].includes(userRole)) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};