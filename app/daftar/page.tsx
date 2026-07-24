"use client";

import { useState } from "react";
import Link from "next/link";
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
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulasi proses pendaftaran
    setTimeout(() => {
      setIsLoading(false);
      alert(`Pendaftaran berhasil untuk akun: ${email}`);
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full flex bg-slate-50">
      {/* Kolom Kiri: Ilustrasi / Branding (Desktop Only) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-primary text-white p-12 flex-col justify-between overflow-hidden">
        {/* Background Decorative Gradient/Shapes */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-secondary/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

        {/* Top: Logo & Back Link */}
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-2 group text-white">
            <div className="p-2 bg-white/10 rounded-xl backdrop-blur-md group-hover:bg-white/20 transition">
              <ArrowLeft className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium">Kembali ke Beranda</span>
          </Link>
        </div>

        {/* Center: Quote / Value Proposition */}
        <div className="relative z-10 max-w-lg space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-medium text-amber-300">
            <Building2 className="w-3.5 h-3.5" /> Realthink Property Platform
          </div>
          <h1 className="text-4xl font-extrabold font-heading tracking-tight leading-tight">
            Mulai Perjalanan Investasi & Kepemilikan Properti Anda Hari Ini.
          </h1>
          <p className="text-slate-300 text-sm leading-relaxed">
            Daftar gratis dan nikmati akses penuh ke kalkulator KPR cerdas, data pasar properti terkini, serta rekomendasi eksklusif.
          </p>

          <div className="space-y-3 pt-4 border-t border-white/10">
            <div className="flex items-center gap-3 text-sm text-slate-200">
              <CheckCircle2 className="w-4 h-4 text-secondary shrink-0" />
              <span>Pendaftaran Cepat & Tanpa Biaya Tersembunyi</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-200">
              <CheckCircle2 className="w-4 h-4 text-secondary shrink-0" />
              <span>Simpan & Pantau Portofolio Properti Favorit Anda</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-200">
              <CheckCircle2 className="w-4 h-4 text-secondary shrink-0" />
              <span>Dapatkan Notifikasi Penurunan Harga & Promo Menarik</span>
            </div>
          </div>
        </div>

        {/* Bottom: Copyright */}
        <div className="relative z-10 text-xs text-slate-400">
          &copy; {new Date().getFullYear()} Realthink Property. All rights reserved.
        </div>
      </div>

      {/* Kolom Kanan: Form Pendaftaran */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md space-y-6 bg-white p-8 sm:p-10 rounded-3xl shadow-xl shadow-slate-200/50 border border-border/60"
        >
          {/* Mobile Back Button & Logo */}
          <div className="flex items-center justify-between lg:hidden mb-2">
            <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4" /> Beranda
            </Link>
            <div className="flex items-center gap-2">
              <Building2 className="w-6 h-6 text-secondary" />
              <span className="font-heading font-bold text-lg text-primary">Realthink</span>
            </div>
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900 tracking-tight">
              Buat Akun Baru 🚀
            </h2>
            <p className="text-sm text-muted-foreground">
              Lengkapi data di bawah ini untuk mulai menggunakan platform Realthink.
            </p>
          </div>

          {/* Form Pendaftaran (Dipindah ke Atas) */}
          <form onSubmit={handleSubmit} className="space-y-4">
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
                  value={name}
                  onChange={(e) => setName(e.target.value)}
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
                  placeholder="Minimal 8 karakter"
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

            {/* Syarat & Ketentuan */}
            <div className="flex items-start gap-2 text-xs pt-1">
              <input
                type="checkbox"
                required
                id="terms"
                className="mt-0.5 w-4 h-4 rounded border-border text-primary focus:ring-primary/20 cursor-pointer"
              />
              <label htmlFor="terms" className="text-slate-600 select-none cursor-pointer">
                Saya menyetujui{" "}
                <Link href="/syarat-ketentuan" className="text-secondary font-semibold hover:underline">
                  Syarat & Ketentuan
                </Link>{" "}
                serta{" "}
                <Link href="/kebijakan-privasi" className="text-secondary font-semibold hover:underline">
                  Kebijakan Privasi
                </Link>{" "}
                Realthink.
              </label>
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

          {/* Divider */}
          <div className="flex items-center my-4">
            <div className="grow border-t border-border"></div>
            <span className="px-3 text-xs text-muted-foreground uppercase font-medium">Atau</span>
            <div className="grow border-t border-border"></div>
          </div>

          {/* Google Sign Up Button (Dipindah ke Bawah) */}
          <button
            type="button"
            onClick={() => alert("Fitur Daftar dengan Google")}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-border rounded-xl text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 transition active:scale-[0.99] shadow-sm cursor-pointer"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
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
            Daftar dengan Google
          </button>

          {/* Login Link */}
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