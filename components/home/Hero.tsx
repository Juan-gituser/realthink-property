"use client";

import { useState, useRef, useEffect } from "react";
import { Search, MapPin, Home, DollarSign, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

export default function Hero() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"dijual" | "disewa">("dijual");
  
  // State untuk nilai filter
  const [lokasi, setLokasi] = useState("");
  const [tipeProperti, setTipeProperti] = useState("Semua Tipe");
  const [kisaranHarga, setKisaranHarga] = useState("Semua Harga");

  // State untuk kontrol buka/tutup custom dropdown
  const [tipeOpen, setTipeOpen] = useState(false);
  const [hargaOpen, setHargaOpen] = useState(false);

  const tipeOptions = ["Semua Tipe", "Rumah", "Apartemen", "Ruko", "Tanah"];
  const hargaOptions = ["Semua Harga", "< Rp 500 Juta", "Rp 500 Juta - 1 Miliar", "> Rp 1 Miliar"];

  const handleSearch = () => {
    router.push(`/properti?kategori=${activeTab}&lokasi=${lokasi}&tipe=${tipeProperti}&harga=${kisaranHarga}`);
  };

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 bg-linear-to-b from-secondary/10 via-white to-white overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-10">
          <span className="bg-secondary/10 text-secondary text-xs font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider">
            Platform Properti Terpercaya
          </span>
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-primary tracking-tight">
            Temukan Rumah Impian Anda <br />
            <span className="text-secondary">Dengan Mudah & Cepat</span>
          </h1>
          <p className="text-muted-foreground text-sm md:text-base max-w-xl mx-auto">
            Jelajahi ribuan pilihan properti terbaik mulai dari hunian modern hingga investasi komersial di lokasi strategis.
          </p>
        </div>

        {/* Search Box Card */}
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl border border-border p-4 md:p-6">
          {/* Tabs Dijual / Disewa */}
          <div className="flex gap-2 mb-6 border-b border-border pb-4">
            <button
              onClick={() => setActiveTab("dijual")}
              className={`px-6 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeTab === "dijual"
                  ? "bg-primary text-white shadow-md shadow-primary/25"
                  : "bg-gray-100 text-muted-foreground hover:bg-gray-200"
              }`}
            >
              Dijual
            </button>
            <button
              onClick={() => setActiveTab("disewa")}
              className={`px-6 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeTab === "disewa"
                  ? "bg-primary text-white shadow-md shadow-primary/25"
                  : "bg-gray-100 text-muted-foreground hover:bg-gray-200"
              }`}
            >
              Disewa
            </button>
          </div>

          {/* Filter Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
            {/* Lokasi */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-muted-foreground flex items-center gap-1 uppercase tracking-wider">
                <MapPin className="w-3.5 h-3.5 text-secondary" /> Lokasi
              </label>
              <input
                type="text"
                value={lokasi}
                onChange={(e) => setLokasi(e.target.value)}
                placeholder="Kota atau area..."
                className="w-full px-3 py-2.5 bg-gray-50 border border-border rounded-xl text-sm font-medium text-foreground outline-none focus:ring-2 focus:ring-secondary/50"
              />
            </div>

            {/* Custom Dropdown: Tipe Properti */}
            <div className="space-y-1 relative">
              <label className="text-[11px] font-bold text-muted-foreground flex items-center gap-1 uppercase tracking-wider">
                <Home className="w-3.5 h-3.5 text-secondary" /> Tipe Properti
              </label>
              <button
                type="button"
                onClick={() => {
                  setTipeOpen(!tipeOpen);
                  setHargaOpen(false);
                }}
                className="w-full px-3 py-2.5 bg-gray-50 border border-border rounded-xl text-sm font-medium text-foreground flex items-center justify-between outline-none focus:ring-2 focus:ring-secondary/50 text-left"
              >
                <span className="truncate">{tipeProperti}</span>
                <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${tipeOpen ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {tipeOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 5, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 5, scale: 0.98 }}
                    className="absolute top-full left-0 w-full mt-1 bg-white border border-border rounded-xl shadow-xl py-1.5 z-50 overflow-hidden"
                  >
                    {tipeOptions.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => {
                          setTipeProperti(opt);
                          setTipeOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-xs font-semibold transition-colors ${
                          tipeProperti === opt
                            ? "bg-secondary/10 text-secondary font-bold"
                            : "text-foreground hover:bg-gray-100"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Custom Dropdown: Kisaran Harga */}
            <div className="space-y-1 relative">
              <label className="text-[11px] font-bold text-muted-foreground flex items-center gap-1 uppercase tracking-wider">
                <DollarSign className="w-3.5 h-3.5 text-secondary" /> Kisaran Harga
              </label>
              <button
                type="button"
                onClick={() => {
                  setHargaOpen(!hargaOpen);
                  setTipeOpen(false);
                }}
                className="w-full px-3 py-2.5 bg-gray-50 border border-border rounded-xl text-sm font-medium text-foreground flex items-center justify-between outline-none focus:ring-2 focus:ring-secondary/50 text-left"
              >
                <span className="truncate">{kisaranHarga}</span>
                <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${hargaOpen ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {hargaOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 5, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 5, scale: 0.98 }}
                    className="absolute top-full left-0 w-full mt-1 bg-white border border-border rounded-xl shadow-xl py-1.5 z-50 overflow-hidden"
                  >
                    {hargaOptions.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => {
                          setKisaranHarga(opt);
                          setHargaOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-xs font-semibold transition-colors ${
                          kisaranHarga === opt
                            ? "bg-secondary/10 text-secondary font-bold"
                            : "text-foreground hover:bg-gray-100"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Tombol Cari */}
            <div className="pt-5">
              <button
                onClick={handleSearch}
                className="w-full bg-secondary text-primary-foreground font-bold py-3 rounded-xl hover:bg-secondary/90 transition-all shadow-md shadow-secondary/25 flex items-center justify-center gap-2 text-sm"
              >
                <Search className="w-4 h-4" /> Cari Properti
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}