"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

// Tentukan durasi inaktif dalam milidetik (misal: 5 menit = 5 * 60 * 1000)
const INACTIVITY_TIMEOUT = 5 * 60 * 1000;

export default function AutoLogout() {
  const router = useRouter();
  const supabase = createClient();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  const resetTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      handleLogout();
    }, INACTIVITY_TIMEOUT);
  };

  useEffect(() => {
    // Event yang menandakan aktivitas pengguna
    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];

    // Set timer awal & pasang event listener
    resetTimer();
    events.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });

    // Cleanup saat unmount
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      events.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, []);

  return null;
}