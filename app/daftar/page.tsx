"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { 
  Building2, 
  Mail, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  ArrowLeft, 
  CheckCircle2 
} from "lucide-react";
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
    <div className="min-h-screen w-full flex bg-slate-50">
      {/* Kolom Kiri: Branding & Ilustrasi */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-primary text-white p-12 flex-col justify-between overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-secondary/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-2 group text-white">
            <div className="p-2 bg-white/15 rounded-xl backdrop-blur-md group-hover:bg-white/25 transition">
              <ArrowLeft className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium">Kembali ke Beranda</span>
          </Link>
        </div>

        <div className="relative z-10 max-w-lg space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-medium text-amber-300">
            <Building2 className="w-3.5 h-3.5" /> Bergabung dengan Realthink
          </div>
          <h1 className="text-4xl font-extrabold font-heading tracking-tight leading-tight">
            Mulai Perjalanan Investasi Properti Anda Hari Ini.
          </h1>
          <p className="text-slate-300 text-sm leading-relaxed">
            Dapatkan akses penuh ke fitur AI Smart Advisor, kalkulator finansial mendalam, dan jaringan properti terkurasi.
          </p>

          <div className="space-y-3 pt-4 border-t border-white/10">
            <div className="flex items-center gap-3 text-sm text-slate-200">
              <CheckCircle2 className="w-4 h-4 text-secondary shrink-0" />
              <span>Pendaftaran Gratis & Cepat</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-200">
              <CheckCircle2 className="w-4 h-4 text-secondary shrink-0" />
              <span>Akses Dashboard Khusus Berdasarkan Kebutuhan</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-xs text-slate-400">
          &copy; {new Date().getFullYear()} Realthink Property. All rights reserved.
        </div>
      </div>

      {/* Kolom Kanan: Form Registrasi */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md space-y-6 bg-white p-8 sm:p-10 rounded-3xl shadow-xl shadow-slate-200/50 border border-border/60"
        >
          <div className="flex items-center justify-between lg:hidden mb-2">
            <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4" /> Beranda
            </Link>
            <div className="flex items-center gap-2">
              <Building2 className="w-6 h-6 text-secondary" />
              <span className="font-heading font-bold text-lg text-primary">Realthink</span>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900 tracking-tight">
              Buat Akun Baru 🚀
            </h2>
            <p className="text-sm text-muted-foreground">
              Lengkapi data di bawah ini untuk mendaftarkan akun Anda.
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            {/* Input Nama Lengkap */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                Nama Lengkap
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Nama Lengkap Anda"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50/50 border border-border rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                />
              </div>
            </div>

            {/* Input Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50/50 border border-border rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                />
              </div>
            </div>

            {/* Input Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 karakter"
                  className="w-full pl-10 pr-10 py-3 bg-slate-50/50 border border-border rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 bg-primary text-white py-3 px-4 rounded-xl font-medium text-sm hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 disabled:opacity-70 flex items-center justify-center cursor-pointer"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                "Daftar Sekarang"
              )}
            </button>
          </form>

          <p className="text-center text-xs text-muted-foreground pt-2">
            Sudah punya akun Realthink?{" "}
            <Link href="/login" className="font-semibold text-secondary hover:underline">
              Masuk di sini
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}