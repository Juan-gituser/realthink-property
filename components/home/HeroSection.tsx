"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, MapPin, Home, Banknote } from "lucide-react";
import { useRouter } from "next/navigation";

export default function HeroSection() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"dijual" | "disewa">("dijual");
  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [priceRange, setPriceRange] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const queryParams = new URLSearchParams({
      status: activeTab,
      lokasi: location,
      tipe: propertyType,
      harga: priceRange,
    });
    router.push(`/listing?${queryParams.toString()}`);
  };

  return (
    <section className="from-primary/5 via-background to-background relative flex min-h-[85vh] items-center justify-center bg-linear-to-b px-4 pt-8 pb-16">
      <div className="container mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl space-y-6 text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-secondary/10 border-secondary/30 text-secondary inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium"
          >
            <span>✨ Partner Properti Terpercaya Anda</span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-primary text-4xl leading-tight font-bold tracking-tight md:text-6xl"
          >
            Temukan Properti Impian & <br className="hidden md:inline" />
            <span className="text-secondary">Investasi Masa Depan</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-muted-foreground mx-auto max-w-2xl text-lg md:text-xl"
          >
            Ribuan pilihan rumah, apartemen, ruko, dan tanah terbaik dengan jaminan legalitas serta
            kemudahan proses KPR.
          </motion.p>

          {/* Search Box Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="border-border mt-8 rounded-2xl border bg-white p-4 text-left shadow-xl md:p-6"
          >
            {/* Tabs */}
            <div className="border-border mb-6 flex gap-2 border-b pb-3">
              <button
                type="button"
                onClick={() => setActiveTab("dijual")}
                className={`rounded-lg px-6 py-2 font-semibold transition-all ${
                  activeTab === "dijual"
                    ? "bg-primary text-white shadow-md"
                    : "text-muted-foreground hover:text-primary"
                }`}
              >
                Dijual
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("disewa")}
                className={`rounded-lg px-6 py-2 font-semibold transition-all ${
                  activeTab === "disewa"
                    ? "bg-primary text-white shadow-md"
                    : "text-muted-foreground hover:text-primary"
                }`}
              >
                Disewa
              </button>
            </div>

            {/* Form Inputs */}
            <form
              onSubmit={handleSearch}
              className="grid grid-cols-1 items-end gap-4 md:grid-cols-4"
            >
              {/* Lokasi */}
              <div className="space-y-2">
                <label className="text-muted-foreground flex items-center gap-1 text-xs font-semibold tracking-wider uppercase">
                  <MapPin className="text-secondary h-4 w-4" /> Lokasi
                </label>
                <input
                  type="text"
                  placeholder="Kota atau area..."
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="border-border focus:ring-secondary/50 w-full rounded-lg border px-3 py-2.5 text-sm focus:ring-2 focus:outline-none"
                />
              </div>

              {/* Tipe Properti */}
              <div className="space-y-2">
                <label className="text-muted-foreground flex items-center gap-1 text-xs font-semibold tracking-wider uppercase">
                  <Home className="text-secondary h-4 w-4" /> Tipe Properti
                </label>
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="border-border focus:ring-secondary/50 w-full rounded-lg border bg-white px-3 py-2.5 text-sm focus:ring-2 focus:outline-none"
                >
                  <option value="">Semua Tipe</option>
                  <option value="rumah">Rumah</option>
                  <option value="apartemen">Apartemen</option>
                  <option value="ruko">Ruko</option>
                  <option value="tanah">Tanah</option>
                </select>
              </div>

              {/* Rentang Harga */}
              <div className="space-y-2">
                <label className="text-muted-foreground flex items-center gap-1 text-xs font-semibold tracking-wider uppercase">
                  <Banknote className="text-secondary h-4 w-4" /> Kisaran Harga
                </label>
                <select
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="border-border focus:ring-secondary/50 w-full rounded-lg border bg-white px-3 py-2.5 text-sm focus:ring-2 focus:outline-none"
                >
                  <option value="">Semua Harga</option>
                  <option value="0-500m">&lt; Rp 500 Juta</option>
                  <option value="500m-1b">Rp 500 Jt - 1 Miliar</option>
                  <option value="1b-3b">Rp 1 M - 3 Miliar</option>
                  <option value="3b+">&gt; Rp 3 Miliar</option>
                </select>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="bg-secondary hover:bg-secondary/90 shadow-secondary/20 flex w-full items-center justify-center gap-2 rounded-lg px-6 py-3 font-semibold text-white shadow-lg transition-all"
              >
                <Search className="h-5 w-5" /> Cari Properti
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
