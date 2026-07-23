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
    <div className="min-h-screen bg-primary flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-primary/10 rounded-full text-secondary mb-2">
            <Building2 className="w-10 h-10" />
          </div>
          <h1 className="text-2xl font-bold text-primary font-heading">Realthink Admin</h1>
          <p className="text-xs text-muted-foreground">Masuk untuk mengelola portal properti Anda</p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 text-red-600 border border-red-200 text-xs rounded-lg text-center">
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
                className="w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:ring-1 focus:ring-secondary outline-none"
              />
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
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
                className="w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:ring-1 focus:ring-secondary outline-none"
              />
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90 transition flex justify-center items-center gap-2 shadow-md"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin text-secondary" /> : "Masuk ke Dashboard"}
          </button>
        </form>
      </div>
    </div>
  );
}