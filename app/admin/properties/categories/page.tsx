"use client";

import { useState } from "react";
import { Layers, Plus, Search, Edit3, Trash2, FolderOpen } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  count: number;
  description: string;
}

export default function AdminCategoriesPage() {
  const [categories] = useState<Category[]>([
    { id: "1", name: "Rumah Residensial", slug: "rumah-residensial", count: 24, description: "Properti hunian keluarga tapak" },
    { id: "2", name: "Apartemen & Kondominium", slug: "apartemen", count: 12, description: "Hunian vertikal di pusat kota" },
    { id: "3", name: "Ruko & Komersial", slug: "ruko-komersial", count: 8, description: "Tempat usaha dan pertokoan" },
    { id: "4", name: "Tanah Kavling", slug: "tanah-kavling", count: 15, description: "Lahan siap bangun untuk investasi" },
  ]);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col justify-between gap-4 rounded-3xl border border-gray-200 bg-white p-6 shadow-xs sm:flex-row sm:items-center">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">
            <Layers className="h-3.5 w-3.5" /> Taksonomi
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Kategori Properti</h1>
          <p className="mt-0.5 text-xs text-gray-500">Kelola kelompok dan jenis properti yang tampil di katalog.</p>
        </div>
        <button className="flex cursor-pointer items-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-amber-600">
          <Plus className="h-4 w-4" /> Tambah Kategori
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-gray-200 bg-gray-50 font-semibold uppercase text-gray-500">
            <tr>
              <th className="px-6 py-4">Nama Kategori</th>
              <th className="px-6 py-4">Slug URL</th>
              <th className="px-6 py-4">Deskripsi</th>
              <th className="px-6 py-4">Jumlah Listing</th>
              <th className="px-6 py-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-gray-50/50">
                <td className="px-6 py-4 font-bold text-gray-900 flex items-center gap-2">
                  <FolderOpen className="h-4 w-4 text-amber-500" />
                  {cat.name}
                </td>
                <td className="px-6 py-4 font-mono text-gray-500">/{cat.slug}</td>
                <td className="px-6 py-4 text-gray-600">{cat.description}</td>
                <td className="px-6 py-4 font-semibold text-amber-700">{cat.count} Properti</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100"><Edit3 className="h-4 w-4" /></button>
                    <button className="rounded-lg p-1.5 text-rose-500 hover:bg-rose-50"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}