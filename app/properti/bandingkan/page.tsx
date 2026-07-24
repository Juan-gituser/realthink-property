"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2, ArrowLeft, Check, Minus } from "lucide-react";

export default function ComparePage() {
  const [comparedProperties, setComparedProperties] = useState<any[]>([]);

  useEffect(() => {
    const compareIds: string[] = JSON.parse(localStorage.getItem("realthink_compare") || "[]");
    
    // Ambil data dari ALL_PROPERTIES atau API/Supabase Anda
    // Contoh mengambil dari penyimpanan lokal atau array dummy yang sama seperti di /properti
    // Untuk demo, kita ambil contoh data mock:
    import("@/data/properties").then((mod) => {
      // Asumsi data properti tersimpan di file terpusat, atau sesuaikan sumber data Anda
      const found = mod.ALL_PROPERTIES?.filter((item: any) => compareIds.includes(item.id)) || [];
      setComparedProperties(found);
    }).catch(() => {
      setComparedProperties([]);
    });
  }, []);

  const handleRemove = (id: string) => {
    const compareIds: string[] = JSON.parse(localStorage.getItem("realthink_compare") || "[]");
    const updated = compareIds.filter((item) => item !== id);
    localStorage.setItem("realthink_compare", JSON.stringify(updated));
    setComparedProperties(comparedProperties.filter((item) => item.id !== id));
    window.dispatchEvent(new Event("compareChanged"));
  };

  return (
    <div className="bg-gray-50/50 min-h-screen py-10">
      <div className="container mx-auto px-4 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <Link href="/properti" className="text-xs font-semibold text-amber-600 flex items-center gap-1 mb-2">
              <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Katalog
            </Link>
            <h1 className="text-3xl font-heading font-bold text-gray-900">
              Komparasi Properti
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Bandingkan spesifikasi, harga, dan fasilitas properti pilihan Anda berdampingan.
            </p>
          </div>
        </div>

        {comparedProperties.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-gray-200 text-center space-y-4 shadow-sm">
            <p className="text-gray-700 font-medium">Belum ada properti yang dipilih untuk dibandingkan.</p>
            <Link
              href="/properti"
              className="inline-block bg-slate-900 text-white text-xs px-5 py-2.5 rounded-xl font-semibold hover:bg-slate-800 transition"
            >
              Pilih Properti di Katalog
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <table className="w-full border-collapse min-w-175[700px]">
              <thead>
                <tr>
                  <th className="p-4 text-left text-xs font-bold text-gray-400 uppercase w-1/4">Parameter</th>
                  {comparedProperties.map((prop) => (
                    <th key={prop.id} className="p-4 text-left w-1/4 align-top">
                      <div className="space-y-3">
                        <div className="relative h-36 w-full rounded-xl overflow-hidden bg-gray-100">
                          <Image src={prop.imageUrl} alt={prop.title} fill className="object-cover" />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-amber-600">{prop.price}</span>
                          <h3 className="font-heading font-bold text-gray-900 text-sm line-clamp-1 mt-0.5">{prop.title}</h3>
                          <p className="text-xs text-gray-400 truncate">{prop.location}</p>
                        </div>
                        <button
                          onClick={() => handleRemove(prop.id)}
                          className="text-xs text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1 pt-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Hapus dari Komparasi
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                <tr>
                  <td className="p-4 font-semibold text-gray-600">Kategori</td>
                  {comparedProperties.map((prop) => (
                    <td key={prop.id} className="p-4 text-gray-800">{prop.category}</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-gray-600">Status</td>
                  {comparedProperties.map((prop) => (
                    <td key={prop.id} className="p-4 uppercase text-xs font-bold text-amber-600">{prop.status}</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-gray-600">Kamar Tidur</td>
                  {comparedProperties.map((prop) => (
                    <td key={prop.id} className="p-4 text-gray-800">{prop.bedrooms} Kamar</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-gray-600">Kamar Mandi</td>
                  {comparedProperties.map((prop) => (
                    <td key={prop.id} className="p-4 text-gray-800">{prop.bathrooms} Kamar Mandi</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-gray-600">Luas Tanah</td>
                  {comparedProperties.map((prop) => (
                    <td key={prop.id} className="p-4 text-gray-800">{prop.landArea} m²</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-gray-600">Luas Bangunan</td>
                  {comparedProperties.map((prop) => (
                    <td key={prop.id} className="p-4 text-gray-800">{prop.buildingArea} m²</td>
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