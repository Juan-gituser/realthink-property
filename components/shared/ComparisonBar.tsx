"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, X } from "lucide-react";
import { usePathname } from "next/navigation";

export default function ComparisonBar() {
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsMounted(true);
    const updateCompareState = () => {
      try {
        const stored: string[] = JSON.parse(localStorage.getItem("realthink_compare") || "[]");
        setCompareIds(stored);
      } catch (err) {
        setCompareIds([]);
      }
    };

    updateCompareState();

    window.addEventListener("compareChanged", updateCompareState);
    window.addEventListener("storage", updateCompareState);

    return () => {
      window.removeEventListener("compareChanged", updateCompareState);
      window.removeEventListener("storage", updateCompareState);
    };
  }, []);

  // Jangan render apa pun di server side atau jika kosong / di halaman bandingkan
  if (!isMounted || compareIds.length === 0 || pathname === "/properti/bandingkan") {
    return null;
  }

  const handleClear = () => {
    localStorage.removeItem("realthink_compare");
    setCompareIds([]);
    window.dispatchEvent(new Event("compareChanged"));
  };

  return (
    <div className="fixed bottom-6 left-1/2 z-[9999] -translate-x-1/2 w-[90%] max-w-xl">
      <div className="flex items-center justify-between rounded-2xl bg-slate-900 px-6 py-3.5 text-white shadow-2xl border border-slate-700/80 backdrop-blur-lg">
        <div className="flex items-center gap-3">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-500 text-xs font-bold text-slate-950">
            {compareIds.length}
          </span>
          <div className="text-xs">
            <p className="font-bold">Properti Dipilih</p>
            <p className="text-slate-400">Maksimal 3 properti untuk dibandingkan</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/properti/bandingkan"
            className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-slate-950 transition hover:bg-amber-400 cursor-pointer"
          >
            Bandingkan Sekarang <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <button
            onClick={handleClear}
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-800 hover:text-white cursor-pointer"
            title="Reset Pilihan"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}