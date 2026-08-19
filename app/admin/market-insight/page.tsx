"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { 
  Compass, 
  LineChart as LineChartIcon, 
  MapPin, 
  Layers, 
  ArrowUpRight,
  Filter,
  Loader2,
  DollarSign
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from "recharts";

interface MarketInsightState {
  averagePricePerSqm: number;
  marketDemandIndex: number;
  activeListingsCount: number;
  priceGrowthRate: number;
  priceTrend: { month: string; hargaRataRata: number; indeksPasar: number }[];
  regionDemand: { region: string; demand: number }[];
  propertyTypes: { name: string; value: number; color: string }[];
}

export default function MarketInsightPage() {
  const [timeframe, setTimeframe] = useState("1y");
  const [loading, setLoading] = useState(true);
  const [marketStats, setMarketStats] = useState<MarketInsightState>({
    averagePricePerSqm: 0,
    marketDemandIndex: 0,
    activeListingsCount: 0,
    priceGrowthRate: 0,
    priceTrend: [],
    regionDemand: [],
    propertyTypes: [],
  });

  const supabase = createClient();

  const fetchMarketInsight = useCallback(async () => {
    setLoading(true);
    try {
      // 1. Ambil data asli dari tabel properties untuk kalkulasi saat ini
      const { data: properties, count: activeCount } = await supabase
        .from("properties")
        .select("price, land_area, building_area, category, location, created_at", { count: "exact" });

      const activeListingsCount = activeCount || properties?.length || 0;

      // 2. Ambil data historis tren pasar asli dari database (tabel market_trends)
      const { data: trendData } = await supabase
        .from("market_trends")
        .select("month_date, avg_price_per_sqm, total_active_listings")
        .order("month_date", { ascending: true })
        .limit(6);

      // 3. Ambil data log interaksi/peminatan asli (tabel user_interest_logs)
      const { data: interestData } = await supabase
        .from("user_interest_logs")
        .select("id");

      const totalInterests = interestData?.length || 0;

      // Kalkulasi Rata-rata Harga per m² murni dari data properti aktif saat ini
      let totalSqmPrice = 0;
      let validCount = 0;
      const regionMap: Record<string, number> = {};
      const typeMap: Record<string, number> = {};

      properties?.forEach((p) => {
        const price = Number(p.price || 0);
        const area = Number(p.building_area || p.land_area || 0);
        if (price > 0 && area > 0) {
          totalSqmPrice += price / area;
          validCount++;
        }

        // Mapping Wilayah/Lokasi dari data asli
        const loc = p.location ? String(p.location) : "Lainnya";
        regionMap[loc] = (regionMap[loc] || 0) + 1;

        // Mapping Tipe/Kategori Properti dari data asli
        const cat = p.category ? String(p.category) : "Lainnya";
        typeMap[cat] = (typeMap[cat] || 0) + 1;
      });

      const averagePricePerSqm = validCount > 0 ? Math.round(totalSqmPrice / validCount) : 0;
      
      // Indeks permintaan murni dihitung dari total interaksi user berbanding listing aktif
      const marketDemandIndex = activeListingsCount > 0 
        ? Number(((totalInterests / activeListingsCount) * 10).toFixed(1)) 
        : 0;

      // Hitung pertumbuhan harga riil jika data tren historis tersedia minimal 2 bulan
      let priceGrowthRate = 0;
      if (trendData && trendData.length >= 2) {
        const latest = Number(trendData[trendData.length - 1].avg_price_per_sqm);
        const previous = Number(trendData[0].avg_price_per_sqm);
        if (previous > 0) {
          priceGrowthRate = Number((((latest - previous) / previous) * 100).toFixed(1));
        }
      }

      // Format Data Tren Harga Pasar dari Database Historis
      const priceTrendData = trendData?.map((item) => ({
        month: new Date(item.month_date).toLocaleDateString("id-ID", { month: "short", year: "2-digit" }),
        hargaRataRata: Number(item.avg_price_per_sqm),
        indeksPasar: Number(item.total_active_listings),
      })) || [];

      // Format Data Permintaan Berdasarkan Wilayah dari data asli properti
      const regionDemandData = Object.keys(regionMap).map((reg) => ({
        region: reg,
        demand: regionMap[reg],
      })).sort((a, b) => b.demand - a.demand);

      // Format Data Komposisi Tipe Properti dari data asli properti
      const colors = ["#d97706", "#f59e0b", "#fcd34d", "#92400e", "#b45309", "#78350f"];
      const propertyTypesData = Object.keys(typeMap).map((key, idx) => ({
        name: key,
        value: typeMap[key],
        color: colors[idx % colors.length],
      }));

      setMarketStats({
        averagePricePerSqm,
        marketDemandIndex,
        activeListingsCount,
        priceGrowthRate,
        priceTrend: priceTrendData,
        regionDemand: regionDemandData,
        propertyTypes: propertyTypesData,
      });
    } catch (error) {
      console.error("Gagal mengambil data market insight asli dari Supabase:", error);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchMarketInsight();
  }, [fetchMarketInsight, timeframe]);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      
      {/* Header Card */}
      <div className="flex flex-col justify-between gap-4 rounded-3xl border border-gray-200 bg-white p-6 shadow-xs sm:flex-row sm:items-center">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">
            <Compass className="h-3.5 w-3.5" /> Analisis Industri Properti (Data Real-time)
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Market Insight</h1>
          <p className="mt-0.5 text-xs text-gray-500">Tren harga makro, tingkat permintaan wilayah, dan likuiditas pasar berdasarkan database operasional.</p>
        </div>

        {/* Filter Periode Waktu */}
        <div className="flex items-center gap-1 rounded-xl border border-gray-200 bg-gray-50/50 p-1">
          <Filter className="ml-2 h-3.5 w-3.5 text-gray-400" />
          {[
            { id: "6m", label: "6 Bulan" },
            { id: "1y", label: "1 Tahun" },
            { id: "all", label: "Historis" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setTimeframe(item.id)}
              className={`rounded-lg px-3 py-1 text-xs font-semibold transition-all ${
                timeframe === item.id
                  ? "bg-white text-gray-900 shadow-xs"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Rata-rata Harga / m²", val: `Rp ${marketStats.averagePricePerSqm.toLocaleString("id-ID")}`, icon: DollarSign, change: "Data Real" },
          { label: "Indeks Permintaan Pasar", val: `${marketStats.marketDemandIndex} / 100`, icon: Compass, change: "Berdasarkan Aktivitas" },
          { label: "Total Listing Terindeks", val: marketStats.activeListingsCount.toLocaleString("id-ID"), icon: Layers, change: "Aktif di DB" },
          { label: "Pertumbuhan Harga", val: `${marketStats.priceGrowthRate}%`, icon: LineChartIcon, change: "Historis" },
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs">
              <div className="flex items-center justify-between text-gray-500">
                <span className="text-xs font-semibold">{stat.label}</span>
                <div className="rounded-xl bg-amber-50 p-2 text-amber-600">
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              {loading ? (
                <div className="mt-3 flex items-center gap-2 text-gray-400">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span className="text-xs">Memuat...</span>
                </div>
              ) : (
                <>
                  <p className="mt-3 text-xl font-extrabold text-gray-900">{stat.val}</p>
                  <p className="mt-1 flex items-center text-[11px] font-bold text-emerald-600">
                    <ArrowUpRight className="h-3 w-3" /> {stat.change}
                  </p>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Main Charts Section */}
      <div className="grid gap-6 lg:grid-cols-3">
        
        {/* Line Chart: Tren Pertumbuhan Harga Rata-rata */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs lg:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-gray-900">Proyeksi & Tren Harga Rata-rata Pasar</h2>
              <p className="text-xs text-gray-500">Pergerakan harga historis per meter persegi (m²)</p>
            </div>
            <div className="flex items-center gap-3 text-xs font-medium">
              <span className="flex items-center gap-1.5 text-gray-600">
                <span className="h-2.5 w-2.5 rounded-full bg-amber-500 inline-block" /> Harga / m² (Rp)
              </span>
            </div>
          </div>

          <div className="h-72 w-full">
            {marketStats.priceTrend.length === 0 && !loading ? (
              <div className="flex h-full items-center justify-center text-xs text-gray-400">
                Belum ada data historis tren harga di database.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={marketStats.priceTrend}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis 
                    stroke="#94a3b8" 
                    fontSize={11} 
                    tickLine={false} 
                    axisLine={false} 
                    tickFormatter={(val) => `${val / 1000000}jt`}
                  />
                  <Tooltip contentStyle={{ borderRadius: "12px", borderColor: "#e2e8f0" }} />
                  <Line type="monotone" dataKey="hargaRataRata" stroke="#d97706" strokeWidth={3} dot={{ fill: "#d97706", r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Donut Chart: Komposisi Tipe Properti di Pasar */}
        <div className="flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-6 shadow-xs">
          <div>
            <h2 className="text-base font-bold text-gray-900">Komposisi Tipe Properti</h2>
            <p className="text-xs text-gray-500">Distribusi penawaran tipe properti di market</p>
          </div>

          <div className="relative my-4 flex h-48 w-full items-center justify-center">
            {marketStats.propertyTypes.length === 0 && !loading ? (
              <div className="text-xs text-gray-400">Tidak ada data tipe properti.</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={marketStats.propertyTypes} cx="50%" cy="50%" innerRadius={55} outerRadius={78} paddingAngle={4} dataKey="value">
                    {marketStats.propertyTypes.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xl font-extrabold text-gray-900">{marketStats.activeListingsCount}</span>
              <span className="text-[10px] font-semibold text-gray-400">Total Unit</span>
            </div>
          </div>

          <div className="space-y-2 border-t border-gray-100 pt-3 max-h-32 overflow-y-auto">
            {marketStats.propertyTypes.map((type) => (
              <div key={type.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 font-medium text-gray-600">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: type.color }} />
                  {type.name}
                </span>
                <span className="font-bold text-gray-900">{type.value} Unit</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Bar Chart: Permintaan Berdasarkan Wilayah */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs">
        <div className="mb-2 flex items-center gap-2">
          <MapPin className="h-4 w-4 text-amber-600" />
          <h2 className="text-base font-bold text-gray-900">Tingkat Permintaan Wilayah (Regional Demand)</h2>
        </div>
        <p className="mb-4 text-xs text-gray-500">Volume listing properti terbanyak berdasarkan wilayah operasional di database</p>
        
        <div className="h-72 w-full">
          {marketStats.regionDemand.length === 0 && !loading ? (
            <div className="flex h-full items-center justify-center text-xs text-gray-400">
              Belum ada data wilayah yang terekam di database.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={marketStats.regionDemand} 
                layout="vertical" 
                margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis 
                  dataKey="region" 
                  type="category" 
                  stroke="#475569" 
                  fontSize={11} 
                  tickLine={false} 
                  axisLine={false} 
                  width={140}
                  tickFormatter={(value) => (value.length > 20 ? `${value.substring(0, 18)}...` : value)}
                />
                <Tooltip contentStyle={{ borderRadius: "12px", borderColor: "#e2e8f0", fontSize: "12px" }} />
                <Bar dataKey="demand" fill="#f59e0b" radius={[0, 6, 6, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

    </div>
  );
}