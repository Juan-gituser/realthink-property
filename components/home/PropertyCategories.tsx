"use client";

import Link from "next/link";
import { 
  Home, 
  Building2, 
  Store, 
  Trees, 
  Warehouse, 
  Briefcase, 
  Hotel, 
  FolderOpen 
} from "lucide-react";
import type { CategoryItem } from "@/app/page";

interface PropertyCategoriesProps {
  categories: CategoryItem[];
}

// Mapping Ikon Otomatis berdasarkan Slug atau Nama Kategori
const getCategoryIcon = (slug: string = "", name: string = "") => {
  const text = `${slug} ${name}`.toLowerCase();
  
  if (text.includes("rumah")) return Home;
  if (text.includes("apartemen")) return Building2;
  if (text.includes("ruko") || text.includes("usaha")) return Store;
  if (text.includes("tanah") || text.includes("kavling")) return Trees;
  if (text.includes("gudang") || text.includes("pabrik")) return Warehouse;
  if (text.includes("kantor") || text.includes("perkantoran")) return Briefcase;
  if (text.includes("villa") || text.includes("resort") || text.includes("kost")) return Hotel;
  
  return FolderOpen;
};

export default function PropertyCategories({ categories }: PropertyCategoriesProps) {
  if (!categories || categories.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
            Jelajahi Katalog
          </span>
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Kategori Properti
          </h2>
        </div>
        <Link
          href="/properti"
          className="text-xs font-bold text-amber-600 hover:text-amber-700 hover:underline"
        >
          Lihat Semua Katalog &rarr;
        </Link>
      </div>

      {/* Grid Kartu Kategori Dinamis */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4">
        {categories.map((cat) => {
          const IconComponent = getCategoryIcon(cat.slug, cat.name);

          return (
            <Link
              key={cat.id}
              href={`/properti?category=${encodeURIComponent(cat.name)}`}
              className="group flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-5 shadow-xs transition hover:-translate-y-1 hover:border-amber-400 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600 transition group-hover:bg-amber-500 group-hover:text-white">
                  <IconComponent className="h-6 w-6" />
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-sm font-bold text-gray-900 group-hover:text-amber-600">
                  {cat.name}
                </h3>
                <p className="mt-1 text-xs text-gray-500">
                  {cat.count ?? 0} Listing Properti
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}