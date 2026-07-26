"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Building2, Lock, Mail, Loader2 } from "lucide-react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMsg("Email atau kata sandi tidak valid.");
      setLoading(false);
    } else {
      router.push("/admin");
      router.refresh();
    }
  };

  return (
    <div className="bg-primary flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6 rounded-2xl bg-white p-8 shadow-2xl">
        <div className="space-y-2 text-center">
          <div className="bg-primary/10 text-secondary mb-2 inline-flex rounded-full p-3">
            <Building2 className="h-10 w-10" />
          </div>
          <h1 className="text-primary font-heading text-2xl font-bold">Realthink Admin</h1>
          <p className="text-muted-foreground text-xs">
            Masuk untuk mengelola portal properti Anda
          </p>
        </div>

        {errorMsg && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-center text-xs text-red-600">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-700 uppercase">Email Admin</label>
            <div className="relative mt-1">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@realthink.com"
                className="focus:ring-secondary w-full rounded-lg border py-2.5 pr-4 pl-10 text-sm outline-none focus:ring-1"
              />
              <Mail className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-700 uppercase">Kata Sandi</label>
            <div className="relative mt-1">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="focus:ring-secondary w-full rounded-lg border py-2.5 pr-4 pl-10 text-sm outline-none focus:ring-1"
              />
              <Lock className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-primary hover:bg-primary/90 flex w-full items-center justify-center gap-2 rounded-lg py-3 font-semibold text-white shadow-md transition"
          >
            {loading ? (
              <Loader2 className="text-secondary h-5 w-5 animate-spin" />
            ) : (
              "Masuk ke Dashboard"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
