"use client";

import { Layout, Plus, ExternalLink, Globe, Eye } from "lucide-react";

export default function AdminLandingPages() {
  const pages = [
    { id: "1", title: "Promo Cluster Grand Park Hill", slug: "promo-grand-park", views: 1420, status: "PUBLISHED" },
    { id: "2", title: "Program Smart Buyer Investor 2026", slug: "investor-smart-buyer", views: 890, status: "PUBLISHED" },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col justify-between gap-4 rounded-3xl border border-gray-200 bg-white p-6 shadow-xs sm:flex-row sm:items-center">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">
            <Layout className="h-3.5 w-3.5" /> Landing Builder
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Kelola Landing Page</h1>
          <p className="mt-0.5 text-xs text-gray-500">Buat halaman khusus campaign pemasaran dan promo khusus.</p>
        </div>
        <button className="flex cursor-pointer items-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-amber-600">
          <Plus className="h-4 w-4" /> Buat Landing Page
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-gray-200 bg-gray-50 font-semibold uppercase text-gray-500">
            <tr>
              <th className="px-6 py-4">Judul Landing Page</th>
              <th className="px-6 py-4">URL Slug</th>
              <th className="px-6 py-4">Total Pengunjung</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {pages.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50/50">
                <td className="px-6 py-4 font-bold text-gray-900">{p.title}</td>
                <td className="px-6 py-4 font-mono text-gray-500">/{p.slug}</td>
                <td className="px-6 py-4 font-semibold text-gray-700 flex items-center gap-1">
                  <Eye className="h-3.5 w-3.5 text-amber-500" /> {p.views} views
                </td>
                <td className="px-6 py-4">
                  <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
                    {p.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <a href={`/lp/${p.slug}`} target="_blank" className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 hover:underline">
                    Lihat LP <ExternalLink className="h-3 w-3" />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}