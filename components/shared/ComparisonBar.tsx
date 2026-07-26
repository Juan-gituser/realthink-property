"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Scale, X } from "lucide-react";

export default function ComparisonBar() {
  const [compareList, setCompareList] = useState<string[]>([]);

  useEffect(() => {
    const updateCompareState = () => {
      const stored = JSON.parse(localStorage.getItem("realthink_compare") || "[]");
      setCompareList(stored);
    };

    updateCompareState();
    window.addEventListener("storage", updateCompareState);

    // Custom event untuk update state dalam tab yang sama
    window.addEventListener("compareChanged", updateCompareState as EventListener);

    return () => {
      window.removeEventListener("storage", updateCompareState);
      window.removeEventListener("compareChanged", updateCompareState as EventListener);
    };
  }, []);

  if (compareList.length === 0) return null;

  return (
    <div className="animate-fade-in fixed bottom-6 left-1/2 z-50 mx-4 flex w-full max-w-lg -translate-x-1/2 items-center gap-6 rounded-2xl border border-slate-800 bg-slate-900 px-6 py-3.5 text-white shadow-2xl">
      <div className="flex items-center gap-2.5">
        <div className="rounded-xl bg-amber-500/10 p-2 text-amber-400">
          <Scale className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs font-semibold text-white">Bandingkan Properti</p>
          <p className="text-[11px] text-slate-400">{compareList.length} dari 3 dipilih</p>
        </div>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <Link
          href="/properti/bandingkan"
          className="rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-slate-950 shadow-sm transition hover:bg-amber-600"
        >
          Bandingkan Sekarang
        </Link>
        <button
          onClick={() => {
            localStorage.removeItem("realthink_compare");
            setCompareList([]);
            window.dispatchEvent(new Event("compareChanged"));
          }}
          className="p-1 text-slate-400 hover:text-white"
          title="Reset"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}