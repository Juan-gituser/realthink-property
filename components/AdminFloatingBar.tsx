"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function AdminFloatingBar() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const supabase = createClient();

  // Jangan tampilkan jika sedang berada di dalam area admin
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  useEffect(() => {
    async function checkAdminRole() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setIsAdmin(false);
          setLoading(false);
          return;
        }

        // Cek dari user_metadata
        const metadataRole = user.user_metadata?.role;
        if (metadataRole === "admin" || metadataRole === "super_admin") {
          setIsAdmin(true);
          setLoading(false);
          return;
        }

        // Cek dari tabel profiles
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        if (profile?.role === "admin" || profile?.role === "super_admin") {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error("Gagal memeriksa role admin:", error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    }

    checkAdminRole();
  }, [supabase]);

  // Jangan tampilkan jika masih loading atau bukan admin
  if (loading || !isAdmin) return null;

  return (
    <div className="fixed bottom-4 left-4 z-40">
      <Link
        href="/admin"
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900/90 backdrop-blur-md text-white shadow-lg border border-amber-500/40 hover:bg-slate-900 hover:border-amber-400 transition-all duration-200 group text-[11px] font-medium cursor-pointer"
      >
        <div className="p-1 rounded-lg bg-amber-500 text-slate-950 font-bold shadow-xs">
          <Shield className="w-3 h-3" />
        </div>
        <span>Panel Admin</span>
        <ArrowRight className="w-3 h-3 text-amber-400 transition-transform duration-200 group-hover:translate-x-0.5" />
      </Link>
    </div>
  );
}