"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { hasPermission, Permission, Role } from "@/lib/permissions";

interface CanProps {
  permission: Permission;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function Can({ permission, children, fallback = null }: CanProps) {
  const [allowed, setAllowed] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function checkUserAccess() {
      const { data: { user } } = await supabase.auth.getUser();
      
      let role: Role = "guest";
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();
        if (profile) role = profile.role as Role;
      }

      setAllowed(hasPermission(role, permission));
      setLoading(false);
    }

    checkUserAccess();
  }, [permission]);

  if (loading) return null; // Atau spinner kecil
  return allowed ? <>{children}</> : <>{fallback}</>;
}