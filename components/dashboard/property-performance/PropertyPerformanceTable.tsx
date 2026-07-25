"tsx"
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
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortOrder === "asc" 
          ? aValue.localeCompare(bValue) 
          : bValue.localeCompare(aValue);
      }

      return sortOrder === "asc" 
        ? (Number(aValue) - Number(bValue)) 
        : (Number(bValue) - Number(aValue));
    });

    return result;
  }, [properties, searchQuery, filterType, sortField, sortOrder]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 text-slate-400 text-xs">
        <Loader2 className="w-5 h-5 animate-spin text-emerald-400 mr-2" />
        Memuat data performa properti dari database...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-xs">
        Gagal memuat data: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Panel Kontrol: Search & Filter */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-[#1C2541]/70 border border-slate-800 p-4 rounded-2xl backdrop-blur-xl">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nama property..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950/60 border border-slate-800 text-white placeholder-slate-500 text-xs rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-emerald-500/50 transition-all"
          />
        </div>

        {/* Filter Dropdown */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-slate-950/60 border border-slate-800 text-white text-xs rounded-xl px-4 py-2.5 focus:outline-none focus:border-emerald-500/50 transition-all w-full md:w-auto"
          >
            <option value="all">Semua Properti</option>
            <option value="high-conversion">Konversi Tinggi (&ge; 5%)</option>
            <option value="high-views">Views Tinggi (&ge; 1.000)</option>
          </select>
        </div>
      </div>

      {/* Tabel Data Responsif */}
      <div className="bg-[#1C2541]/70 border border-slate-800 rounded-3xl backdrop-blur-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] uppercase tracking-wider text-slate-400 bg-slate-950/40">
                <th className="py-4 px-6 font-bold cursor-pointer hover:text-white transition-colors" onClick={() => handleSort("property_name")}>
                  <div className="flex items-center gap-1.5">Nama Property <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th className="py-4 px-4 font-bold cursor-pointer hover:text-white transition-colors text-right" onClick={() => handleSort("views")}>
                  <div className="flex items-center justify-end gap-1.5">View <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th className="py-4 px-4 font-bold cursor-pointer hover:text-white transition-colors text-right" onClick={() => handleSort("favorites")}>
                  <div className="flex items-center justify-end gap-1.5">Favorite <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th className="py-4 px-4 font-bold cursor-pointer hover:text-white transition-colors text-right" onClick={() => handleSort("whatsapp_clicks")}>
                  <div className="flex items-center justify-end gap-1.5">WhatsApp <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th className="py-4 px-4 font-bold cursor-pointer hover:text-white transition-colors text-right" onClick={() => handleSort("surveys")}>
                  <div className="flex items-center justify-end gap-1.5">Survey <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th className="py-4 px-4 font-bold cursor-pointer hover:text-white transition-colors text-right" onClick={() => handleSort("deals")}>
                  <div className="flex items-center justify-end gap-1.5">Deal <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th className="py-4 px-4 font-bold cursor-pointer hover:text-white transition-colors text-right" onClick={() => handleSort("ctr")}>
                  <div className="flex items-center justify-end gap-1.5">CTR <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th className="py-4 px-6 font-bold cursor-pointer hover:text-white transition-colors text-right" onClick={() => handleSort("conversion_rate")}>
                  <div className="flex items-center justify-end gap-1.5">Conversion Rate <ArrowUpDown className="w-3 h-3" /></div>
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
                  <tr key={item.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-4 px-6 font-bold text-white flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="truncate max-w-xs">{item.property_name}</span>
                    </td>
                    <td className="py-4 px-4 text-right text-slate-300 font-medium">{item.views.toLocaleString("id-ID")}</td>
                    <td className="py-4 px-4 text-right text-slate-300 font-medium">{item.favorites.toLocaleString("id-ID")}</td>
                    <td className="py-4 px-4 text-right text-emerald-400 font-semibold">{item.whatsapp_clicks.toLocaleString("id-ID")}</td>
                    <td className="py-4 px-4 text-right text-slate-300 font-medium">{item.surveys.toLocaleString("id-ID")}</td>
                    <td className="py-4 px-4 text-right text-blue-400 font-bold">{item.deals.toLocaleString("id-ID")}</td>
                    <td className="py-4 px-4 text-right text-slate-300 font-medium">{item.ctr}%</td>
                    <td className="py-4 px-6 text-right">
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border ${
                        item.conversion_rate >= 5 
                          ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" 
                          : "bg-slate-800 text-slate-400 border-slate-700"
                      }`}>
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