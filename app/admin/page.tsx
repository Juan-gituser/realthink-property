"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Building2, PlusCircle, TrendingUp, ArrowRight, Loader2 } from "lucide-react";

export default function AdminDashboardPage() {
  const [propertyCount, setPropertyCount] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function getStats() {
      try {
        const { count, error } = await supabase
          .from("properties")
          .select("*", { count: "exact", head: true });

        if (!error && count !== null) {
          setPropertyCount(count);
        }
      } catch {
        // Menggunakan optional catch binding untuk menghindari unused var warning
      } finally {
        setLoading(false);
      }
    }

    getStats();
  }, []);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Title */}
      <div>
        <h1 className="font-heading text-2xl font-bold text-gray-900">Ringkasan Dashboard</h1>
        <p className="text-sm text-gray-500">
          Selamat datang kembali di panel kontrol Realthink Property.
        </p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {/* Card 1: Total Listing */}
        <div className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="space-y-1">
            <p className="text-xs font-semibold tracking-wider text-gray-500 uppercase">
              Total Listing Properti
            </p>
            <div className="text-2xl font-bold text-gray-900">
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
              ) : (
                (propertyCount ?? 0)
              )}
            </div>
          </div>
          <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
            <Building2 className="h-6 w-6" />
          </div>
        </div>

        {/* Card 2: Akses Cepat Tambah */}
        <div className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="space-y-1">
            <p className="text-xs font-semibold tracking-wider text-gray-500 uppercase">
              Listing Baru
            </p>
            <Link
              href="/admin/properties/create"
              className="text-primary mt-1 flex items-center gap-1 text-sm font-semibold hover:underline"
            >
              + Tambah Sekarang <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
            <PlusCircle className="h-6 w-6" />
          </div>
        </div>

        {/* Card 3: Status Sistem */}
        <div className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="space-y-1">
            <p className="text-xs font-semibold tracking-wider text-gray-500 uppercase">
              Koneksi Supabase
            </p>
            <p className="flex items-center gap-1.5 text-sm font-bold text-emerald-600">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500"></span>
              Terhubung
            </p>
          </div>
          <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
            <TrendingUp className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Quick Actions Panel */}
      <div className="space-y-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="border-b pb-3 text-base font-bold text-gray-900">Aksi Cepat Manajemen</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Link
            href="/admin/properties/create"
            className="group flex items-center gap-4 rounded-xl border border-gray-200 p-4 transition hover:border-amber-500 hover:bg-amber-50/30"
          >
            <div className="rounded-xl bg-amber-500 p-3 text-white transition group-hover:scale-105">
              <PlusCircle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">Input Properti Baru</h3>
              <p className="text-xs text-gray-500">Unggah foto dan data spesifikasi unit baru.</p>
            </div>
          </Link>

          <Link
            href="/admin/properties"
            className="group flex items-center gap-4 rounded-xl border border-gray-200 p-4 transition hover:border-slate-800 hover:bg-slate-50"
          >
            <div className="rounded-xl bg-slate-900 p-3 text-white transition group-hover:scale-105">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">Kelola Daftar Properti</h3>
              <p className="text-xs text-gray-500">
                Lihat, ubah status, atau hapus listing properti.
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}