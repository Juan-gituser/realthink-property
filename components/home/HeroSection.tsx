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
    <section className="relative min-h-[85vh] flex items-center justify-center pt-8 pb-16 px-4 bg-linear-to-b from-primary/5 via-background to-background">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/10 border border-secondary/30 text-secondary text-sm font-medium"
          >
            <span>✨ Partner Properti Terpercaya Anda</span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold tracking-tight text-primary leading-tight"
          >
            Temukan Properti Impian & <br className="hidden md:inline" />
            <span className="text-secondary">Investasi Masa Depan</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto"
          >
            Ribuan pilihan rumah, apartemen, ruko, dan tanah terbaik dengan jaminan legalitas serta kemudahan proses KPR.
          </motion.p>

          {/* Search Box Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white p-4 md:p-6 rounded-2xl shadow-xl border border-border mt-8 text-left"
          >
            {/* Tabs */}
            <div className="flex gap-2 mb-6 border-b border-border pb-3">
              <button
                type="button"
                onClick={() => setActiveTab("dijual")}
                className={`px-6 py-2 rounded-lg font-semibold transition-all ${
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
                className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                  activeTab === "disewa"
                    ? "bg-primary text-white shadow-md"
                    : "text-muted-foreground hover:text-primary"
                }`}
              >
                Disewa
              </button>
            </div>

            {/* Form Inputs */}
            <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              {/* Lokasi */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-secondary" /> Lokasi
                </label>
                <input
                  type="text"
                  placeholder="Kota atau area..."
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-secondary/50 text-sm"
                />
              </div>

              {/* Tipe Properti */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                  <Home className="w-4 h-4 text-secondary" /> Tipe Properti
                </label>
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-border bg-white focus:outline-none focus:ring-2 focus:ring-secondary/50 text-sm"
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
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                  <Banknote className="w-4 h-4 text-secondary" /> Kisaran Harga
                </label>
                <select
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-border bg-white focus:outline-none focus:ring-2 focus:ring-secondary/50 text-sm"
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
                className="w-full bg-secondary hover:bg-secondary/90 text-white font-semibold py-3 px-6 rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-secondary/20"
              >
                <Search className="w-5 h-5" /> Cari Properti
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}