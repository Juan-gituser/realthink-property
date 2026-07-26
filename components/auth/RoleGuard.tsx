"use client";

import { useUserRole } from "@/hooks/useUserRole";
import { UserRole, roleHierarchy } from "@/types/auth";
import { Loader2 } from "lucide-react";
import React from "react";

interface RoleGuardProps {
  minRole: UserRole;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function RoleGuard({ minRole, children, fallback }: RoleGuardProps) {
  const { data: profile, isLoading } = useUserRole();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-6 text-xs text-slate-400">
        <Loader2 className="mr-2 h-4 w-4 animate-spin text-emerald-400" />
        Memverifikasi hak akses...
      </div>
    );
  }

  const userRole = profile?.role || "guest";
  const hasAccess = roleHierarchy[userRole] >= roleHierarchy[minRole];

  // Jika level role user di bawah ketentuan minimum, tampilkan fallback atau pesan blokir
  if (!hasAccess) {
    return (
      fallback || (
        <div className="space-y-2 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 text-center backdrop-blur-xl">
          <h3 className="text-xs font-bold text-white">
            Akses Terbatas ({minRole.toUpperCase()} Required)
          </h3>
          <p className="text-[11px] text-slate-400">
            Upgrade keanggotaan Anda untuk membuka fitur eksklusif ini.
          </p>
        </div>
      )
    );
  }

  return <>{children}</>;
}
