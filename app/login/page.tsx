"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client"; // Sesuaikan path utils/lib Supabase Anda
import { Building2, Mail, Lock, Eye, EyeOff, ArrowLeft, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 1. Authenticate login ke Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        alert("Login gagal: " + authError.message);
        setIsLoading(false);
        return;
      }

      if (!authData.user) {
        alert("Login gagal: User tidak ditemukan.");
        setIsLoading(false);
        return;
      }

      // 2. Ambil role user dari tabel profiles
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", authData.user.id)
        .maybeSingle();

      const role = profile?.role || "member";

      // 3. Tentukan rute dashboard berdasarkan role
      let targetPath = "/dashboard/member"; // Default langsung ke dashboard member

      if (role === "admin" || role === "super_admin") {
        targetPath = "/dashboard/admin";
      } else if (role === "smart_buyer") {
        targetPath = "/dashboard/smart-buyer";
      } else if (role === "investor_pro") {
        targetPath = "/dashboard/investor";
      }

      // 4. Redirect ke dashboard tujuan
      window.location.href = targetPath;
    } catch (err) {
      console.error("Terjadi kesalahan:", err);
      alert("Terjadi kesalahan sistem saat mencoba masuk.");
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      alert("Gagal login dengan Google: " + error.message);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-slate-50">
      {/* Kolom Kiri: Ilustrasi / Branding (Desktop Only) */}
      <div className="bg-primary relative hidden flex-col justify-between overflow-hidden p-12 text-white lg:flex lg:w-1/2">
        {/* Background Decorative Gradient/Shapes */}
        <div className="bg-secondary/20 pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full blur-3xl" />
        <div className="pointer-events-none absolute -right-24 -bottom-24 h-96 w-96 rounded-full bg-amber-500/10 blur-3xl" />

        {/* Top: Logo & Back Link */}
        <div className="relative z-10">
          <Link href="/" className="group inline-flex items-center gap-2 text-white">
            <div className="rounded-xl bg-white/10 p-2 backdrop-blur-md transition group-hover:bg-white/20">
              <ArrowLeft className="h-5 w-5" />
            </div>
            <span className="text-sm font-medium">Kembali ke Beranda</span>
          </Link>
        </div>

        {/* Center: Quote / Value Proposition */}
        <div className="relative z-10 max-w-lg space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-medium text-amber-300 backdrop-blur-md">
            <Building2 className="h-3.5 w-3.5" /> Realthink Property Platform
          </div>
          <h1 className="font-heading text-4xl leading-tight font-extrabold tracking-tight">
            Temukan dan Kelola Properti Impian Anda dengan Lebih Cerdas.
          </h1>
          <p className="text-sm leading-relaxed text-slate-300">
            Akses kalkulator finansial properti eksklusif, rekomendasi berbasis AI, dan manajemen
            portofolio investasi dalam satu genggaman.
          </p>

          <div className="space-y-3 border-t border-white/10 pt-4">
            <div className="flex items-center gap-3 text-sm text-slate-200">
              <CheckCircle2 className="text-secondary h-4 w-4 shrink-0" />
              <span>Analisis KPR & ROI Real-time yang Akurat</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-200">
              <CheckCircle2 className="text-secondary h-4 w-4 shrink-0" />
              <span>Rekomendasi Properti Eksklusif Sesuai Budget</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-200">
              <CheckCircle2 className="text-secondary h-4 w-4 shrink-0" />
              <span>Konsultasi Langsung dengan Agen Profesional</span>
            </div>
          </div>
        </div>

        {/* Bottom: Copyright */}
        <div className="relative z-10 text-xs text-slate-400">
          &copy; {new Date().getFullYear()} Realthink Property. All rights reserved.
        </div>
      </div>

      {/* Kolom Kanan: Form Login */}
      <div className="flex w-full items-center justify-center p-6 sm:p-12 lg:w-1/2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="border-border/60 w-full max-w-md space-y-6 rounded-3xl border bg-white p-8 shadow-xl shadow-slate-200/50 sm:p-10"
        >
          {/* Mobile Back Button & Logo */}
          <div className="mb-2 flex items-center justify-between lg:hidden">
            <Link
              href="/"
              className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-xs font-semibold"
            >
              <ArrowLeft className="h-4 w-4" /> Beranda
            </Link>
            <div className="flex items-center gap-2">
              <Building2 className="text-secondary h-6 w-6" />
              <span className="font-heading text-primary text-lg font-bold">Realthink</span>
            </div>
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <h2 className="font-heading text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Selamat Datang Kembali 👋
            </h2>
            <p className="text-muted-foreground text-sm">
              Silakan masukkan detail akun Anda untuk masuk ke sistem.
            </p>
          </div>

          {/* Form Utama */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Input Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold tracking-wide text-slate-700 uppercase">
                Email
              </label>
              <div className="relative">
                <div className="text-muted-foreground pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  className="border-border focus:ring-primary/20 focus:border-primary w-full rounded-xl border bg-slate-50/50 py-3 pr-4 pl-10 text-sm transition focus:bg-white focus:ring-2 focus:outline-none"
                />
              </div>
            </div>

            {/* Input Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold tracking-wide text-slate-700 uppercase">
                  Password
                </label>
                <Link
                  href="/lupa-password"
                  className="text-secondary text-xs font-semibold hover:underline"
                >
                  Lupa password?
                </Link>
              </div>
              <div className="relative">
                <div className="text-muted-foreground pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="border-border focus:ring-primary/20 focus:border-primary w-full rounded-xl border bg-slate-50/50 py-3 pr-10 pl-10 text-sm transition focus:bg-white focus:ring-2 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-muted-foreground hover:text-foreground absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3.5"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center justify-between pt-1 text-sm">
              <label className="flex cursor-pointer items-center gap-2 select-none">
                <input
                  type="checkbox"
                  className="border-border text-primary focus:ring-primary/20 h-4 w-4 cursor-pointer rounded"
                />
                <span className="text-xs font-medium text-slate-600">
                  Ingat saya di perangkat ini
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="bg-primary hover:bg-primary/90 shadow-primary/25 mt-2 flex w-full cursor-pointer items-center justify-center rounded-xl px-4 py-3 text-sm font-medium text-white shadow-lg transition-all disabled:opacity-70"
            >
              {isLoading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                "Masuk Sekarang"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-4 flex items-center">
            <div className="border-border grow border-t"></div>
            <span className="text-muted-foreground px-3 text-xs font-medium uppercase">Atau</span>
            <div className="border-border grow border-t"></div>
          </div>

          {/* Google SSO Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="border-border flex w-full cursor-pointer items-center justify-center gap-3 rounded-xl border bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 active:scale-[0.99]"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.13 0-5.78-2.11-6.73-4.96H1.18v3.15C3.15 21.32 7.22 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.27 14.24c-.25-.72-.38-1.5-.38-2.24s.13-1.52.38-2.24V6.61H1.18C.43 8.13 0 9.87 0 11.76s.43 3.63 1.18 5.15l4.09-2.67z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.22 0 3.15 2.68 1.18 6.61l4.09 3.15c.95-2.85 3.6-4.96 6.73-4.96z"
              />
            </svg>
            Masuk dengan Google
          </button>

          {/* Register Link */}
          <p className="text-muted-foreground pt-2 text-center text-xs">
            Belum punya akun Realthink?{" "}
            <Link href="/daftar" className="text-secondary font-semibold hover:underline">
              Daftar gratis
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
