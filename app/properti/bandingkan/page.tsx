"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2, ArrowLeft } from "lucide-react";

interface Property {
  id: string;
  title: string;
  slug: string;
  price: string;
  location: string;
  imageUrl: string;
  category: string;
  status: string;
  bedrooms: number;
  bathrooms: number;
  landArea: number;
  buildingArea: number;
}

export default function ComparePage() {
  const [comparedProperties, setComparedProperties] = useState<Property[]>([]);

  useEffect(() => {
    const compareIds: string[] = JSON.parse(localStorage.getItem("realthink_compare") || "[]");

    import("@/data/properties")
      .then((mod) => {
        const found = mod.ALL_PROPERTIES?.filter((item: Property) => compareIds.includes(item.id)) || [];
        setComparedProperties(found);
      })
      .catch(() => {
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
    <div className="min-h-screen bg-gray-50/50 py-10">
      <div className="container mx-auto space-y-8 px-4">
        <div className="flex items-center justify-between">
          <div>
            <Link
              href="/properti"
              className="mb-2 flex items-center gap-1 text-xs font-semibold text-amber-600"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Kembali ke Katalog
            </Link>
            <h1 className="font-heading text-3xl font-bold text-gray-900">Komparasi Properti</h1>
            <p className="mt-1 text-sm text-gray-500">
              Bandingkan spesifikasi, harga, dan fasilitas properti pilihan Anda berdampingan.
            </p>
          </div>
        </div>

        {comparedProperties.length === 0 ? (
          <div className="space-y-4 rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-sm">
            <p className="font-medium text-gray-700">
              Belum ada properti yang dipilih untuk dibandingkan.
            </p>
            <Link
              href="/properti"
              className="inline-block rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-slate-800"
            >
              Pilih Properti di Katalog
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <table className="min-w-175[700px] w-full border-collapse">
              <thead>
                <tr>
                  <th className="w-1/4 p-4 text-left text-xs font-bold text-gray-400 uppercase">
                    Parameter
                  </th>
                  {comparedProperties.map((prop) => (
                    <th key={prop.id} className="w-1/4 p-4 text-left align-top">
                      <div className="space-y-3">
                        <div className="relative h-36 w-full overflow-hidden rounded-xl bg-gray-100">
                          <Image
                            src={prop.imageUrl}
                            alt={prop.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-amber-600">{prop.price}</span>
                          <h3 className="font-heading mt-0.5 line-clamp-1 text-sm font-bold text-gray-900">
                            {prop.title}
                          </h3>
                          <p className="truncate text-xs text-gray-400">{prop.location}</p>
                        </div>
                        <button
                          onClick={() => handleRemove(prop.id)}
                          className="flex items-center gap-1 pt-1 text-xs font-semibold text-rose-600 hover:text-rose-700"
                        >
                          <Trash2 className="h-3.5 w-3.5" /> Hapus dari Komparasi
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
                    <td key={prop.id} className="p-4 text-gray-800">
                      {prop.category}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-gray-600">Status</td>
                  {comparedProperties.map((prop) => (
                    <td key={prop.id} className="p-4 text-xs font-bold text-amber-600 uppercase">
                      {prop.status}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-gray-600">Kamar Tidur</td>
                  {comparedProperties.map((prop) => (
                    <td key={prop.id} className="p-4 text-gray-800">
                      {prop.bedrooms} Kamar
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-gray-600">Kamar Mandi</td>
                  {comparedProperties.map((prop) => (
                    <td key={prop.id} className="p-4 text-gray-800">
                      {prop.bathrooms} Kamar Mandi
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-gray-600">Luas Tanah</td>
                  {comparedProperties.map((prop) => (
                    <td key={prop.id} className="p-4 text-gray-800">
                      {prop.landArea} m²
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-gray-600">Luas Bangunan</td>
                  {comparedProperties.map((prop) => (
                    <td key={prop.id} className="p-4 text-gray-800">
                      {prop.buildingArea} m²
                    </td>
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