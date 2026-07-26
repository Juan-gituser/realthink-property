// app/admin/page.tsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useExecutiveDashboard } from "@/hooks/useExecutiveDashboard";
import { ActivityTimeline } from "@/components/dashboard/activity-timeline";
import { 
  Building2, 
  PlusCircle, 
  Users, 
  Calendar, 
  CheckCircle2, 
  DollarSign, 
  Target, 
  RefreshCw,
  Building,
  FilePlus
} from "lucide-react";

export default function AdminDashboardPage() {
  const { data, isLoading, refetch } = useExecutiveDashboard();

  const metrics = data?.metrics;
  const activities = data?.activities || [];

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Header Bar (Clean & Professional) */}
      <div className="flex flex-col items-start justify-between gap-4 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center">
        <div>
          <span className="mb-2 inline-block rounded-full bg-amber-50 px-3 py-1 text-[10px] font-bold tracking-widest text-amber-600 uppercase border border-amber-200">
            Executive Control Center
          </span>
          <h1 className="font-heading text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="mt-0.5 text-xs text-gray-500">
            Ringkasan performa bisnis, aktivitas operasional, dan manajemen properti Realthink.
          </p>
        </div>

        <button
          onClick={() => refetch()}
          className="flex items-center gap-2 rounded-xl bg-gray-100 px-4 py-2.5 text-xs font-bold text-gray-700 transition hover:bg-gray-200"
        >
          <RefreshCw className="h-4 w-4" /> Refresh Data
        </button>
      </div>

      {/* Metrics Cards Grid (Executive Summary di Atas) */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {/* Card 1: Total Property */}
        <div className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="space-y-1">
            <p className="text-xs font-semibold tracking-wider text-gray-500 uppercase">
              Total Property
            </p>
            <div className="text-2xl font-bold text-gray-900">
              {isLoading ? (
                <RefreshCw className="h-5 w-5 animate-spin text-gray-400" />
              ) : (
                metrics?.totalProperties ?? 0
              )}
            </div>
          </div>
          <div className="rounded-xl bg-amber-50 border border-amber-100 p-3 text-amber-600">
            <Building className="h-6 w-6" />
          </div>
        </div>

        {/* Card 2: Total Lead */}
        <div className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="space-y-1">
            <p className="text-xs font-semibold tracking-wider text-gray-500 uppercase">
              Total Lead
            </p>
            <div className="text-2xl font-bold text-gray-900">
              {isLoading ? (
                <RefreshCw className="h-5 w-5 animate-spin text-gray-400" />
              ) : (
                metrics?.totalLeads ?? 0
              )}
            </div>
          </div>
          <div className="rounded-xl bg-blue-50 border border-blue-100 p-3 text-blue-600">
            <Users className="h-6 w-6" />
          </div>
        </div>

        {/* Card 3: Survey Hari Ini */}
        <div className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="space-y-1">
            <p className="text-xs font-semibold tracking-wider text-gray-500 uppercase">
              Survey Hari Ini
            </p>
            <div className="text-2xl font-bold text-gray-900">
              {isLoading ? (
                <RefreshCw className="h-5 w-5 animate-spin text-gray-400" />
              ) : (
                metrics?.surveysToday ?? 0
              )}
            </div>
          </div>
          <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-3 text-emerald-600">
            <Calendar className="h-6 w-6" />
          </div>
        </div>

        {/* Card 4: Property Sold */}
        <div className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="space-y-1">
            <p className="text-xs font-semibold tracking-wider text-gray-500 uppercase">
              Property Sold
            </p>
            <div className="text-2xl font-bold text-gray-900">
              {isLoading ? (
                <RefreshCw className="h-5 w-5 animate-spin text-gray-400" />
              ) : (
                metrics?.propertiesSold ?? 0
              )}
            </div>
          </div>
          <div className="rounded-xl bg-indigo-50 border border-indigo-100 p-3 text-indigo-600">
            <CheckCircle2 className="h-6 w-6" />
          </div>
        </div>

        {/* Card 5: Revenue Bulan Ini */}
        <div className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="space-y-1">
            <p className="text-xs font-semibold tracking-wider text-gray-500 uppercase">
              Revenue Bulan Ini
            </p>
            <div className="text-xl font-bold text-gray-900">
              {isLoading ? (
                <RefreshCw className="h-5 w-5 animate-spin text-gray-400" />
              ) : (
                new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  maximumFractionDigits: 0,
                }).format(metrics?.monthlyRevenue ?? 0)
              )}
            </div>
          </div>
          <div className="rounded-xl bg-purple-50 border border-purple-100 p-3 text-purple-600">
            <DollarSign className="h-6 w-6" />
          </div>
        </div>

        {/* Card 6: Conversion Rate */}
        <div className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="space-y-1">
            <p className="text-xs font-semibold tracking-wider text-gray-500 uppercase">
              Conversion Rate
            </p>
            <div className="text-2xl font-bold text-gray-900">
              {isLoading ? (
                <RefreshCw className="h-5 w-5 animate-spin text-gray-400" />
              ) : (
                `${metrics?.conversionRate ?? 0}%`
              )}
            </div>
          </div>
          <div className="rounded-xl bg-rose-50 border border-rose-100 p-3 text-rose-600">
            <Target className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Quick Actions Panel */}
      <div className="space-y-4 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="border-b border-gray-100 pb-3 text-base font-bold text-gray-900">Aksi Cepat Manajemen</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            href="/admin/properties/create"
            className="group flex items-center gap-4 rounded-2xl border border-gray-200 bg-gray-50/50 p-4 transition hover:border-amber-500 hover:bg-amber-50/30"
          >
            <div className="rounded-xl bg-amber-500 p-3 text-white transition group-hover:scale-105 shadow-sm">
              <PlusCircle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">Tambah Properti</h3>
              <p className="text-xs text-gray-500">Listing unit properti baru.</p>
            </div>
          </Link>

          <Link
            href="/admin/properties"
            className="group flex items-center gap-4 rounded-2xl border border-gray-200 bg-gray-50/50 p-4 transition hover:border-gray-900 hover:bg-gray-100/50"
          >
            <div className="rounded-xl bg-gray-900 p-3 text-white transition group-hover:scale-105 shadow-sm">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">Kelola Properti</h3>
              <p className="text-xs text-gray-500">Update status & harga unit.</p>
            </div>
          </Link>

          <Link
            href="/admin/articles/new"
            className="group flex items-center gap-4 rounded-2xl border border-gray-200 bg-gray-50/50 p-4 transition hover:border-purple-500 hover:bg-purple-50/30"
          >
            <div className="rounded-xl bg-purple-600 p-3 text-white transition group-hover:scale-105 shadow-sm">
              <FilePlus className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">Tambah Artikel</h3>
              <p className="text-xs text-gray-500">Tulis artikel & insight baru.</p>
            </div>
          </Link>

          <Link
            href="/admin/leads"
            className="group flex items-center gap-4 rounded-2xl border border-gray-200 bg-gray-50/50 p-4 transition hover:border-emerald-500 hover:bg-emerald-50/30"
          >
            <div className="rounded-xl bg-emerald-600 p-3 text-white transition group-hover:scale-105 shadow-sm">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">Kelola Lead</h3>
              <p className="text-xs text-gray-500">Pipeline & konversi klien.</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Activity Timeline Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <ActivityTimeline activities={activities} isLoading={isLoading} />
      </motion.div>
    </div>
  );
}