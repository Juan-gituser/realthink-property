"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { fetchUserProfile } from "@/services/userService";
import { UserProfile } from "@/types/auth";

export function useUserRole() {
  const supabase = createClient();

  return useQuery<UserProfile | null, Error>({
    queryKey: ["userProfile"],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return null;
      return fetchUserProfile(user.id);
    },
    staleTime: 1000 * 60 * 10, // Cache berlaku selama 10 menit
  });
}
