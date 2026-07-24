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

  const removeItem = (id: string) => {
    const updated = compareList.filter((item) => item !== id);
    localStorage.setItem("realthink_compare", JSON.stringify(updated));
    setCompareList(updated);
    window.dispatchEvent(new Event("compareChanged"));
  };

  if (compareList.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-6 py-3.5 rounded-2xl shadow-2xl flex items-center gap-6 border border-slate-800 animate-fade-in max-w-lg w-full mx-4">
      <div className="flex items-center gap-2.5">
        <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl">
          <Scale className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs font-semibold text-white">Bandingkan Properti</p>
          <p className="text-[11px] text-slate-400">{compareList.length} dari 3 dipilih</p>
        </div>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        <Link
          href="/properti/bandingkan"
          className="bg-amber-500 hover:bg-amber-600 text-slate-950 px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm"
        >
          Bandingkan Sekarang
        </Link>
        <button
          onClick={() => {
            localStorage.removeItem("realthink_compare");
            setCompareList([]);
            window.dispatchEvent(new Event("compareChanged"));
          }}
          className="text-slate-400 hover:text-white p-1"
          title="Reset"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}