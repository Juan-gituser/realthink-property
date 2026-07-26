"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Building2, Mail, Lock, User, Eye, EyeOff, ArrowLeft, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const supabase = createClient();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Daftarkan user baru ke Supabase Auth
      // Database Trigger di Supabase akan otomatis membuat profil di tabel 'profiles'
      const { error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (authError) {
        alert("Registrasi gagal: " + authError.message);
        setIsLoading(false);
        return;
      }

      alert("Registrasi berhasil! Silakan masuk ke akun Anda.");
      router.push("/login");
    } catch (err) {
      console.error("Terjadi kesalahan:", err);
      alert("Terjadi kesalahan sistem saat mendaftar.");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-slate-50">
      {/* Kolom Kiri: Branding & Ilustrasi */}
      <div className="bg-primary relative hidden flex-col justify-between overflow-hidden p-12 text-white lg:flex lg:w-1/2">
        <div className="bg-secondary/20 pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full blur-3xl" />
        <div className="pointer-events-none absolute -right-24 -bottom-24 h-96 w-96 rounded-full bg-amber-500/10 blur-3xl" />

        <div className="relative z-10">
          <Link href="/" className="group inline-flex items-center gap-2 text-white">
            <div className="rounded-xl bg-white/15 p-2 backdrop-blur-md transition group-hover:bg-white/25">
              <ArrowLeft className="h-5 w-5" />
            </div>
            <span className="text-sm font-medium">Kembali ke Beranda</span>
          </Link>
        </div>

        <div className="relative z-10 max-w-lg space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-medium text-amber-300 backdrop-blur-md">
            <Building2 className="h-3.5 w-3.5" /> Bergabung dengan Realthink
          </div>
          <h1 className="font-heading text-4xl leading-tight font-extrabold tracking-tight">
            Mulai Perjalanan Investasi Properti Anda Hari Ini.
          </h1>
          <p className="text-sm leading-relaxed text-slate-300">
            Dapatkan akses penuh ke fitur AI Smart Advisor, kalkulator finansial mendalam, dan
            jaringan properti terkurasi.
          </p>

          <div className="space-y-3 border-t border-white/10 pt-4">
            <div className="flex items-center gap-3 text-sm text-slate-200">
              <CheckCircle2 className="text-secondary h-4 w-4 shrink-0" />
              <span>Pendaftaran Gratis & Cepat</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-200">
              <CheckCircle2 className="text-secondary h-4 w-4 shrink-0" />
              <span>Akses Dashboard Khusus Berdasarkan Kebutuhan</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-xs text-slate-400">
          &copy; {new Date().getFullYear()} Realthink Property. All rights reserved.
        </div>
      </div>

      {/* Kolom Kanan: Form Registrasi */}
      <div className="flex w-full items-center justify-center p-6 sm:p-12 lg:w-1/2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="border-border/60 w-full max-w-md space-y-6 rounded-3xl border bg-white p-8 shadow-xl shadow-slate-200/50 sm:p-10"
        >
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

          <div className="space-y-2">
            <h2 className="font-heading text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Buat Akun Baru 🚀
            </h2>
            <p className="text-muted-foreground text-sm">
              Lengkapi data di bawah ini untuk mendaftarkan akun Anda.
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            {/* Input Nama Lengkap */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold tracking-wide text-slate-700 uppercase">
                Nama Lengkap
              </label>
              <div className="relative">
                <div className="text-muted-foreground pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                  <User className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Nama Lengkap Anda"
                  className="border-border focus:ring-primary/20 focus:border-primary w-full rounded-xl border bg-slate-50/50 py-3 pr-4 pl-10 text-sm transition focus:bg-white focus:ring-2 focus:outline-none"
                />
              </div>
            </div>

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
              <label className="text-xs font-bold tracking-wide text-slate-700 uppercase">
                Password
              </label>
              <div className="relative">
                <div className="text-muted-foreground pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 karakter"
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

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="bg-primary hover:bg-primary/90 shadow-primary/25 mt-2 flex w-full cursor-pointer items-center justify-center rounded-xl px-4 py-3 text-sm font-medium text-white shadow-lg transition-all disabled:opacity-70"
            >
              {isLoading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                "Daftar Sekarang"
              )}
            </button>
          </form>

          <p className="text-muted-foreground pt-2 text-center text-xs">
            Sudah punya akun Realthink?{" "}
            <Link href="/login" className="text-secondary font-semibold hover:underline">
              Masuk di sini
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
