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
      <div className="mb-10 text-center">
        <h2 className="text-primary text-3xl font-bold">Kategori Properti</h2>
        <p className="text-muted-foreground mt-2">
          Jelajahi berbagai jenis aset properti pilihan Anda
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
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
                className="group border-border hover:border-secondary flex flex-col items-center rounded-xl border bg-white p-6 transition-all duration-300 hover:shadow-xl"
              >
                <div className="bg-primary/5 text-primary group-hover:bg-secondary mb-4 rounded-full p-4 transition-colors duration-300 group-hover:text-white">
                  <Icon className="h-8 w-8" />
                </div>
                <h3 className="text-primary text-lg font-semibold">{cat.name}</h3>
                <span className="text-muted-foreground mt-1 text-xs">{cat.count}</span>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
