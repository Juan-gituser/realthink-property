"use client";

import { useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Lock, Loader2, LogIn, UserPlus } from "lucide-react";

interface PremiumGuardProps {
  children: ReactNode;
}

export default function PremiumGuard({ children }: PremiumGuardProps) {
  const router = useRouter();
  const supabase = createClient();

  const [loadingAuth, setLoadingAuth] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    async function checkUserAccess() {
      // 1. Cek apakah user sudah login
      const { data: { user }, error: userError } = await supabase.auth.getUser();

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
        <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
      </div>
    );
  }

  // Tampilkan halaman pembatas (gate) jika belum login atau belum premium
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="container mx-auto py-12 text-center max-w-md">
          <div className="bg-white border border-gray-200 rounded-2xl p-8 space-y-6 shadow-sm">
            <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto border border-amber-100">
              <Lock className="w-7 h-7" />
            </div>
            
            <div className="space-y-2">
              <h2 className="font-heading font-bold text-xl text-gray-900">
                {user ? "Akses Khusus Premium" : "Login Diperlukan"}
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">
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
                    className="w-full py-3 bg-amber-600 text-white rounded-xl font-medium text-sm hover:bg-amber-700 transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <LogIn className="w-4 h-4" /> Masuk / Login
                  </button>
                  <button
                    onClick={() => router.push("/register")}
                    className="w-full py-3 bg-white border border-gray-300 text-gray-700 rounded-xl font-medium text-sm hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <UserPlus className="w-4 h-4" /> Belum punya akun? Daftar
                  </button>
                </>
              ) : (
                <button
                  onClick={() => router.push("/upgrade-premium")}
                  className="w-full py-3 bg-amber-600 text-white rounded-xl font-medium text-sm hover:bg-amber-700 transition-colors shadow-md cursor-pointer"
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