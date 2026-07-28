"use client";

import { useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { Lock, Loader2, LogIn, UserPlus } from "lucide-react";

interface PremiumGuardProps {
  children: ReactNode;
}

export default function PremiumGuard({ children }: PremiumGuardProps) {
  const router = useRouter();
  const supabase = createClient();

  const [loadingAuth, setLoadingAuth] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    async function checkUserAccess() {
      // 1. Cek apakah user sudah login
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setUser(null);
        setIsAuthorized(false);
        setLoadingAuth(false);
        return;
      }

      setUser(user);

      // 2. Cek status is_premium di tabel profiles
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("is_premium")
        .eq("id", user.id)
        .single();

      if (profileError || !profile?.is_premium) {
        setIsAuthorized(false);
      } else {
        setIsAuthorized(true);
      }

      setLoadingAuth(false);
    }

    checkUserAccess();
  }, [supabase]);

  // Tampilkan loading saat sedang mengecek sesi & database
  if (loadingAuth) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
      </div>
    );
  }

  // Tampilkan halaman pembatas (gate) jika belum login atau belum premium
  if (!isAuthorized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="container mx-auto max-w-md py-12 text-center">
          <div className="space-y-6 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-amber-100 bg-amber-50 text-amber-600">
              <Lock className="h-7 w-7" />
            </div>

            <div className="space-y-2">
              <h2 className="font-heading text-xl font-bold text-gray-900">
                {user ? "Akses Khusus Premium" : "Login Diperlukan"}
              </h2>
              <p className="text-sm leading-relaxed text-gray-600">
                {user
                  ? "Halaman ini eksklusif dan hanya dapat diakses oleh akun yang sudah berlangganan paket premium Realthink Property."
                  : "Silakan masuk ke akun Anda atau lakukan upgrade untuk menikmati fitur pencocokan properti cerdas menggunakan AI."}
              </p>
            </div>

            <div className="space-y-3 pt-2">
              {!user ? (
                <>
                  <button
                    onClick={() => router.push("/login")}
                    className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-amber-600 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-amber-700"
                  >
                    <LogIn className="h-4 w-4" /> Masuk / Login
                  </button>
                  <button
                    onClick={() => router.push("/daftar")}
                    className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    <UserPlus className="h-4 w-4" /> Belum punya akun? Daftar
                  </button>
                </>
              ) : (
                <button
                  onClick={() => router.push("/upgrade-premium")}
                  className="w-full cursor-pointer rounded-xl bg-amber-600 py-3 text-sm font-medium text-white shadow-md transition-colors hover:bg-amber-700"
                >
                  Upgrade ke Akun Premium
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Jika lolos pengecekan (sudah login & status is_premium = true)
  return <>{children}</>;
}