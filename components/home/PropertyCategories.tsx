"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Home, Building2, Store, Trees } from "lucide-react";

const categories = [
  { name: "Rumah", count: "1,240+ Unit", icon: Home, slug: "rumah" },
  { name: "Apartemen", count: "850+ Unit", icon: Building2, slug: "apartemen" },
  { name: "Ruko", count: "320+ Unit", icon: Store, slug: "ruko" },
  { name: "Tanah", count: "450+ Unit", icon: Trees, slug: "tanah" },
];

export default function PropertyCategories() {
  return (
    <section className="container mx-auto px-4">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-primary">Kategori Properti</h2>
        <p className="text-muted-foreground mt-2">Jelajahi berbagai jenis aset properti pilihan Anda</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {categories.map((cat, index) => {
          const Icon = cat.icon;
          return (
            <motion.div
              key={cat.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Link
                href={`/listing?kategori=${cat.slug}`}
                className="group flex flex-col items-center p-6 bg-white rounded-xl border border-border hover:border-secondary hover:shadow-xl transition-all duration-300"
              >
                <div className="p-4 rounded-full bg-primary/5 text-primary group-hover:bg-secondary group-hover:text-white transition-colors duration-300 mb-4">
                  <Icon className="w-8 h-8" />
                </div>
                <h3 className="font-semibold text-lg text-primary">{cat.name}</h3>
                <span className="text-xs text-muted-foreground mt-1">{cat.count}</span>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}