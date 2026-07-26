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

  useEffect(() => {
    async function checkAdminRole() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

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

  // Jangan tampilkan jika sedang berada di area admin, masih loading, atau bukan admin
  if (pathname?.startsWith("/admin") || loading || !isAdmin) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 z-40">
      <Link
        href="/admin"
        className="group flex cursor-pointer items-center gap-1.5 rounded-xl border border-amber-500/40 bg-slate-900/90 px-3 py-2 text-[11px] font-medium text-white shadow-lg backdrop-blur-md transition-all duration-200 hover:border-amber-400 hover:bg-slate-900"
      >
        <div className="rounded-lg bg-amber-500 p-1 font-bold text-slate-950 shadow-xs">
          <Shield className="h-3 w-3" />
        </div>
        <span>Panel Admin</span>
        <ArrowRight className="h-3 w-3 text-amber-400 transition-transform duration-200 group-hover:translate-x-0.5" />
      </Link>
    </div>
  );
}