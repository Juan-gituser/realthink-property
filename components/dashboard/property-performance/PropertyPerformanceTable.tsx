"tsx";
"use client";

import { useState, useMemo } from "react";
import { usePropertyPerformance } from "@/hooks/usePropertyPerformance";
import { PropertyPerformanceItem, SortField, SortOrder } from "@/types/property-performance";
import { Search, ArrowUpDown, Filter, Loader2, Sparkles } from "lucide-react";

export function PropertyPerformanceTable() {
  const { data: properties = [], isLoading, error } = usePropertyPerformance();

  // State untuk Search, Filter, dan Sorting
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [sortField, setSortField] = useState<SortField>("views");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  // Handler untuk mengubah kolom atau arah sorting
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  // Logika Filter, Search, dan Sorting yang dioptimalkan menggunakan useMemo
  const filteredAndSortedData = useMemo(() => {
    let result = [...properties];

    // 1. Logika Search berdasarkan Nama Property
    if (searchQuery.trim()) {
      result = result.filter((item) =>
        item.property_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // 2. Logika Filtering Kategori
    if (filterType === "high-conversion") {
      result = result.filter((item) => item.conversion_rate >= 5);
    } else if (filterType === "high-views") {
      result = result.filter((item) => item.views >= 1000);
    }

    // 3. Logika Sorting (Ascending / Descending)
    result.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortOrder === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      }

      return sortOrder === "asc"
        ? Number(aValue) - Number(bValue)
        : Number(bValue) - Number(aValue);
    });

    return result;
  }, [properties, searchQuery, filterType, sortField, sortOrder]);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center text-xs text-slate-400">
        <Loader2 className="mr-2 h-5 w-5 animate-spin text-emerald-400" />
        Memuat data performa properti dari database...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-xs text-red-400">
        Gagal memuat data: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Panel Kontrol: Search & Filter */}
      <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-[#1C2541]/70 p-4 backdrop-blur-xl md:flex-row">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nama property..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-800 bg-slate-950/60 py-2.5 pr-4 pl-10 text-xs text-white placeholder-slate-500 transition-all focus:border-emerald-500/50 focus:outline-none"
          />
        </div>

        {/* Filter Dropdown */}
        <div className="flex w-full items-center gap-2 md:w-auto">
          <Filter className="h-4 w-4 text-slate-400" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-2.5 text-xs text-white transition-all focus:border-emerald-500/50 focus:outline-none md:w-auto"
          >
            <option value="all">Semua Properti</option>
            <option value="high-conversion">Konversi Tinggi (&ge; 5%)</option>
            <option value="high-views">Views Tinggi (&ge; 1.000)</option>
          </select>
        </div>
      </div>

      {/* Tabel Data Responsif */}
      <div className="overflow-hidden rounded-3xl border border-slate-800 bg-[#1C2541]/70 shadow-xl backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/40 text-[11px] tracking-wider text-slate-400 uppercase">
                <th
                  className="cursor-pointer px-6 py-4 font-bold transition-colors hover:text-white"
                  onClick={() => handleSort("property_name")}
                >
                  <div className="flex items-center gap-1.5">
                    Nama Property <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th
                  className="cursor-pointer px-4 py-4 text-right font-bold transition-colors hover:text-white"
                  onClick={() => handleSort("views")}
                >
                  <div className="flex items-center justify-end gap-1.5">
                    View <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th
                  className="cursor-pointer px-4 py-4 text-right font-bold transition-colors hover:text-white"
                  onClick={() => handleSort("favorites")}
                >
                  <div className="flex items-center justify-end gap-1.5">
                    Favorite <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th
                  className="cursor-pointer px-4 py-4 text-right font-bold transition-colors hover:text-white"
                  onClick={() => handleSort("whatsapp_clicks")}
                >
                  <div className="flex items-center justify-end gap-1.5">
                    WhatsApp <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th
                  className="cursor-pointer px-4 py-4 text-right font-bold transition-colors hover:text-white"
                  onClick={() => handleSort("surveys")}
                >
                  <div className="flex items-center justify-end gap-1.5">
                    Survey <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th
                  className="cursor-pointer px-4 py-4 text-right font-bold transition-colors hover:text-white"
                  onClick={() => handleSort("deals")}
                >
                  <div className="flex items-center justify-end gap-1.5">
                    Deal <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th
                  className="cursor-pointer px-4 py-4 text-right font-bold transition-colors hover:text-white"
                  onClick={() => handleSort("ctr")}
                >
                  <div className="flex items-center justify-end gap-1.5">
                    CTR <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th
                  className="cursor-pointer px-6 py-4 text-right font-bold transition-colors hover:text-white"
                  onClick={() => handleSort("conversion_rate")}
                >
                  <div className="flex items-center justify-end gap-1.5">
                    Conversion Rate <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {filteredAndSortedData.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    Tidak ada data properti yang cocok dengan pencarian Anda.
                  </td>
                </tr>
              ) : (
                filteredAndSortedData.map((item) => (
                  <tr key={item.id} className="transition-colors hover:bg-slate-900/40">
                    <td className="flex items-center gap-2 px-6 py-4 font-bold text-white">
                      <Sparkles className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
                      <span className="max-w-xs truncate">{item.property_name}</span>
                    </td>
                    <td className="px-4 py-4 text-right font-medium text-slate-300">
                      {item.views.toLocaleString("id-ID")}
                    </td>
                    <td className="px-4 py-4 text-right font-medium text-slate-300">
                      {item.favorites.toLocaleString("id-ID")}
                    </td>
                    <td className="px-4 py-4 text-right font-semibold text-emerald-400">
                      {item.whatsapp_clicks.toLocaleString("id-ID")}
                    </td>
                    <td className="px-4 py-4 text-right font-medium text-slate-300">
                      {item.surveys.toLocaleString("id-ID")}
                    </td>
                    <td className="px-4 py-4 text-right font-bold text-blue-400">
                      {item.deals.toLocaleString("id-ID")}
                    </td>
                    <td className="px-4 py-4 text-right font-medium text-slate-300">{item.ctr}%</td>
                    <td className="px-6 py-4 text-right">
                      <span
                        className={`rounded-lg border px-2.5 py-1 text-[10px] font-bold ${
                          item.conversion_rate >= 5
                            ? "border-emerald-500/30 bg-emerald-500/20 text-emerald-400"
                            : "border-slate-700 bg-slate-800 text-slate-400"
                        }`}
                      >
                        {item.conversion_rate}%
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
