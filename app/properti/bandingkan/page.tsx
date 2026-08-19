"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2, ArrowLeft, Loader2, Building2, Plus, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Property {
  id: string;
  title: string;
  slug: string;
  price: string | number;
  location: string;
  imageUrl: string;
  category: string;
  status: string;
  bedrooms: number;
  bathrooms: number;
  landArea: number;
  buildingArea: number;
}

interface PropertyRow {
  id: string | number;
  title: string;
  slug: string;
  price: string | number;
  location: string;
  image_url?: string;
  category?: string;
  status?: string;
  bedrooms?: number;
  bathrooms?: number;
  land_area?: number;
  building_area?: number;
}

// Helper Format Rupiah yang aman
const formatRupiah = (amount: string | number) => {
  const numericPrice = typeof amount === "string" ? parseFloat(amount.replace(/\D/g, "")) : amount;
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(numericPrice || 0);
};

export default function ComparePage() {
  const [comparedProperties, setComparedProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchComparedProperties() {
      try {
        setLoading(true);
        const compareIds: string[] = JSON.parse(localStorage.getItem("realthink_compare") || "[]");

        if (compareIds.length === 0) {
          setComparedProperties([]);
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from("properties")
          .select("*")
          .in("id", compareIds);

        if (error) throw error;

        if (data) {
          const mapped: Property[] = (data as PropertyRow[]).map((item) => ({
            id: String(item.id),
            title: item.title,
            slug: item.slug,
            price: item.price,
            location: item.location,
            imageUrl: item.image_url || "/placeholder-property.jpg",
            category: item.category || "Properti",
            status: item.status || "dijual",
            bedrooms: item.bedrooms || 0,
            bathrooms: item.bathrooms || 0,
            landArea: item.land_area || 0,
            buildingArea: item.building_area || 0,
          }));
          setComparedProperties(mapped);
        }
      } catch (err) {
        console.error("Gagal mengambil data pembanding properti:", err);
        setComparedProperties([]);
      } finally {
        setLoading(false);
      }
    }

    fetchComparedProperties();

    // Listener untuk memperbarui data jika terjadi perubahan dari tab/komponen lain
    const handleStorageChange = () => {
      fetchComparedProperties();
    };

    window.addEventListener("compareChanged", handleStorageChange);
    return () => {
      window.removeEventListener("compareChanged", handleStorageChange);
    };
  }, []);

  const handleRemove = (id: string) => {
    const compareIds: string[] = JSON.parse(localStorage.getItem("realthink_compare") || "[]");
    const updated = compareIds.filter((item) => item !== id);
    localStorage.setItem("realthink_compare", JSON.stringify(updated));
    setComparedProperties((prev) => prev.filter((item) => item.id !== id));
    
    // Memicu event agar komponen lain (seperti ComparisonBar) ikut memperbarui state
    window.dispatchEvent(new Event("compareChanged"));
  };

  return (
    <div className="min-h-screen bg-gray-50/60 py-10">
      <div className="container mx-auto max-w-7xl space-y-8 px-4">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <Link
              href="/properti"
              className="group mb-3 inline-flex items-center gap-1.5 text-xs font-semibold text-amber-600 transition hover:text-amber-700"
            >
              <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" /> Kembali ke Katalog
            </Link>
            <h1 className="font-heading text-3xl font-extrabold tracking-tight text-gray-900">
              Bandingkan Properti
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Bandingkan spesifikasi, harga, dan fasilitas properti pilihan Anda secara berdampingan.
            </p>
          </div>

          {comparedProperties.length > 0 && (
            <div className="flex items-center gap-2 rounded-2xl border border-amber-200/60 bg-amber-50 px-4 py-2.5 text-xs font-semibold text-amber-800">
              <CheckCircle2 className="h-4 w-4 text-amber-600" />
              <span>{comparedProperties.length} dari 3 Properti Dibandingkan</span>
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center space-y-3 rounded-3xl border border-gray-200 bg-white py-24 text-gray-400 shadow-xs">
            <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
            <p className="text-sm font-medium">Memuat data perbandingan...</p>
          </div>
        ) : comparedProperties.length === 0 ? (
          <div className="space-y-4 rounded-3xl border border-gray-200 bg-white p-16 text-center shadow-xs">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
              <Building2 className="h-8 w-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-gray-900">Belum ada properti dipilih</h3>
              <p className="mx-auto max-w-sm text-sm text-gray-500">
                Anda belum memilih properti untuk dikomparasi. Silakan pilih hingga 3 properti dari halaman katalog.
              </p>
            </div>
            <Link
              href="/properti"
              className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-6 py-3 text-xs font-bold text-white shadow-md transition hover:bg-slate-800"
            >
              Pilih Properti di Katalog
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-3xl border border-gray-200 bg-white shadow-sm">
            <table className="w-full min-w-[750px] border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/75">
                  <th className="w-1/4 p-6 text-left text-xs font-bold uppercase tracking-wider text-gray-400">
                    Parameter
                  </th>
                  {comparedProperties.map((prop) => (
                    <th key={prop.id} className="w-1/4 p-6 text-left align-top">
                      <div className="space-y-3">
                        <div className="relative aspect-16/10 w-full overflow-hidden rounded-2xl border border-gray-100 bg-gray-100 shadow-xs">
                          <Image
                            src={prop.imageUrl}
                            alt={prop.title}
                            fill
                            className="object-cover transition-transform duration-300 hover:scale-105"
                          />
                        </div>
                        <div>
                          <span className="text-xs font-extrabold text-amber-600">
                            {formatRupiah(prop.price)}
                          </span>
                          <h3 className="font-heading mt-1 line-clamp-1 text-sm font-bold text-gray-900" title={prop.title}>
                            {prop.title}
                          </h3>
                          <p className="mt-0.5 truncate text-xs text-gray-400">{prop.location}</p>
                        </div>
                        <button
                          onClick={() => handleRemove(prop.id)}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-600 transition hover:bg-rose-100 cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" /> Hapus dari Bandingkan
                        </button>
                      </div>
                    </th>
                  ))}

                  {/* Slot Kosong jika properti < 3 */}
                  {Array.from({ length: 3 - comparedProperties.length }).map((_, idx) => (
                    <th key={idx} className="w-1/4 border-l border-dashed border-gray-200 bg-gray-50/30 p-6 text-center align-middle">
                      <div className="flex flex-col items-center justify-center space-y-2 py-10">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200/70 text-gray-400">
                          <Plus className="h-5 w-5" />
                        </div>
                        <span className="text-xs font-medium text-gray-400">Slot Kosong</span>
                        <Link
                          href="/properti"
                          className="text-xs font-semibold text-amber-600 hover:underline"
                        >
                          + Tambah Properti
                        </Link>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                <tr className="transition-colors hover:bg-gray-50/50">
                  <td className="p-5 font-semibold text-gray-600">Kategori</td>
                  {comparedProperties.map((prop) => (
                    <td key={prop.id} className="p-5 font-medium text-gray-800">
                      {prop.category}
                    </td>
                  ))}
                  {Array.from({ length: 3 - comparedProperties.length }).map((_, idx) => (
                    <td key={idx} className="border-l border-dashed border-gray-100 p-5"></td>
                  ))}
                </tr>
                <tr className="transition-colors hover:bg-gray-50/50">
                  <td className="p-5 font-semibold text-gray-600">Status</td>
                  {comparedProperties.map((prop) => (
                    <td key={prop.id} className="p-5">
                      <span className="inline-block rounded-lg bg-amber-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-700">
                        {prop.status}
                      </span>
                    </td>
                  ))}
                  {Array.from({ length: 3 - comparedProperties.length }).map((_, idx) => (
                    <td key={idx} className="border-l border-dashed border-gray-100 p-5"></td>
                  ))}
                </tr>
                <tr className="transition-colors hover:bg-gray-50/50">
                  <td className="p-5 font-semibold text-gray-600">Kamar Tidur</td>
                  {comparedProperties.map((prop) => (
                    <td key={prop.id} className="p-5 font-medium text-gray-800">
                      {prop.bedrooms} Kamar
                    </td>
                  ))}
                  {Array.from({ length: 3 - comparedProperties.length }).map((_, idx) => (
                    <td key={idx} className="border-l border-dashed border-gray-100 p-5"></td>
                  ))}
                </tr>
                <tr className="transition-colors hover:bg-gray-50/50">
                  <td className="p-5 font-semibold text-gray-600">Kamar Mandi</td>
                  {comparedProperties.map((prop) => (
                    <td key={prop.id} className="p-5 font-medium text-gray-800">
                      {prop.bathrooms} Kamar Mandi
                    </td>
                  ))}
                  {Array.from({ length: 3 - comparedProperties.length }).map((_, idx) => (
                    <td key={idx} className="border-l border-dashed border-gray-100 p-5"></td>
                  ))}
                </tr>
                <tr className="transition-colors hover:bg-gray-50/50">
                  <td className="p-5 font-semibold text-gray-600">Luas Tanah</td>
                  {comparedProperties.map((prop) => (
                    <td key={prop.id} className="p-5 font-medium text-gray-800">
                      {prop.landArea} m²
                    </td>
                  ))}
                  {Array.from({ length: 3 - comparedProperties.length }).map((_, idx) => (
                    <td key={idx} className="border-l border-dashed border-gray-100 p-5"></td>
                  ))}
                </tr>
                <tr className="transition-colors hover:bg-gray-50/50">
                  <td className="p-5 font-semibold text-gray-600">Luas Bangunan</td>
                  {comparedProperties.map((prop) => (
                    <td key={prop.id} className="p-5 font-medium text-gray-800">
                      {prop.buildingArea} m²
                    </td>
                  ))}
                  {Array.from({ length: 3 - comparedProperties.length }).map((_, idx) => (
                    <td key={idx} className="border-l border-dashed border-gray-100 p-5"></td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}