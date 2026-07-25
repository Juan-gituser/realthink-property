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
      <div className="flex justify-center items-center p-6 text-slate-400 text-xs">
        <Loader2 className="w-4 h-4 animate-spin text-emerald-400 mr-2" />
        Memverifikasi hak akses...
      </div>
    );
  }

  const userRole = profile?.role || "guest";
  const hasAccess = roleHierarchy[userRole] >= roleHierarchy[minRole];

  // Jika level role user di bawah ketentuan minimum, tampilkan fallback atau pesan blokir
  if (!hasAccess) {
    return fallback || (
      <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl text-center space-y-2 backdrop-blur-xl">
        <h3 className="text-white font-bold text-xs">Akses Terbatas ({minRole.toUpperCase()} Required)</h3>
        <p className="text-[11px] text-slate-400">Upgrade keanggotaan Anda untuk membuka fitur eksklusif ini.</p>
      </div>
    );
  }

  return <>{children}</>;
}