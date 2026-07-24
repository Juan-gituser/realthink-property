"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { 
  Building2, PlusCircle, FileText, 
  TrendingUp, ArrowRight, Loader2 
} from "lucide-react";

export default function AdminDashboardPage() {
  const [propertyCount, setPropertyCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getStats() {
      try {
        const { count, error } = await supabase
          .from("properties")
          .select("*", { count: "exact", head: true });

        if (!error && count !== null) {
          setPropertyCount(count);
        }
      } catch (err) {
        console.error("Gagal memuat statistik:", err);
      } finally {
        setLoading(false);
      }
    }

    getStats();
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-heading font-bold text-gray-900">
          Ringkasan Dashboard
        </h1>
        <p className="text-sm text-gray-500">
          Selamat datang kembali di panel kontrol Realthink Property.
        </p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        
        {/* Card 1: Total Listing */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Total Listing Properti
            </p>
            <div className="text-2xl font-bold text-gray-900">
              {loading ? <Loader2 className="w-5 h-5 animate-spin text-gray-400" /> : propertyCount ?? 0}
            </div>
          </div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <Building2 className="w-6 h-6" />
          </div>
        </div>

        {/* Card 2: Akses Cepat Tambah */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Listing Baru
            </p>
            <Link
              href="/admin/properties/create"
              className="text-sm font-semibold text-primary hover:underline flex items-center gap-1 mt-1"
            >
              + Tambah Sekarang <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <PlusCircle className="w-6 h-6" />
          </div>
        </div>

        {/* Card 3: Status Sistem */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Koneksi Supabase
            </p>
            <p className="text-sm font-bold text-emerald-600 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Terhubung
            </p>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Quick Actions Panel */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-gray-900 border-b pb-3">
          Aksi Cepat Manajemen
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/admin/properties/create"
            className="p-4 rounded-xl border border-gray-200 hover:border-amber-500 hover:bg-amber-50/30 transition flex items-center gap-4 group"
          >
            <div className="p-3 bg-amber-500 text-white rounded-xl group-hover:scale-105 transition">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-gray-900">Input Properti Baru</h3>
              <p className="text-xs text-gray-500">Unggah foto dan data spesifikasi unit baru.</p>
            </div>
          </Link>

          <Link
            href="/admin/properties"
            className="p-4 rounded-xl border border-gray-200 hover:border-slate-800 hover:bg-slate-50 transition flex items-center gap-4 group"
          >
            <div className="p-3 bg-slate-900 text-white rounded-xl group-hover:scale-105 transition">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-gray-900">Kelola Daftar Properti</h3>
              <p className="text-xs text-gray-500">Lihat, ubah status, atau hapus listing properti.</p>
            </div>
          </Link>
        </div>
      </div>

    </div>
  );
}