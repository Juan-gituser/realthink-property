"use client";

import { useState } from "react";
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
    router.push(
      `/properti?kategori=${activeTab}&lokasi=${lokasi}&tipe=${tipeProperti}&harga=${kisaranHarga}`
    );
  };

  return (
    <section className="from-secondary/10 relative overflow-hidden bg-linear-to-b via-white to-white pt-32 pb-20 md:pt-40 md:pb-32">
      <div className="relative z-10 container mx-auto px-4">
        <div className="mx-auto mb-10 max-w-3xl space-y-4 text-center">
          <span className="bg-secondary/10 text-secondary rounded-full px-3.5 py-1.5 text-xs font-bold tracking-wider uppercase">
            Platform Properti Terpercaya
          </span>
          <h1 className="font-heading text-primary text-4xl font-bold tracking-tight md:text-5xl">
            Temukan Rumah Impian Anda <br />
            <span className="text-secondary">Dengan Mudah & Cepat</span>
          </h1>
          <p className="text-muted-foreground mx-auto max-w-xl text-sm md:text-base">
            Jelajahi ribuan pilihan properti terbaik mulai dari hunian modern hingga investasi
            komersial di lokasi strategis.
          </p>
        </div>

        {/* Search Box Card */}
        <div className="border-border mx-auto max-w-4xl rounded-2xl border bg-white p-4 shadow-xl md:p-6">
          {/* Tabs Dijual / Disewa */}
          <div className="border-border mb-6 flex gap-2 border-b pb-4">
            <button
              onClick={() => setActiveTab("dijual")}
              className={`rounded-xl px-6 py-2 text-sm font-semibold transition-all ${
                activeTab === "dijual"
                  ? "bg-primary shadow-primary/25 text-white shadow-md"
                  : "text-muted-foreground bg-gray-100 hover:bg-gray-200"
              }`}
            >
              Dijual
            </button>
            <button
              onClick={() => setActiveTab("disewa")}
              className={`rounded-xl px-6 py-2 text-sm font-semibold transition-all ${
                activeTab === "disewa"
                  ? "bg-primary shadow-primary/25 text-white shadow-md"
                  : "text-muted-foreground bg-gray-100 hover:bg-gray-200"
              }`}
            >
              Disewa
            </button>
          </div>

          {/* Filter Grid */}
          <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-4">
            {/* Lokasi */}
            <div className="space-y-1">
              <label className="text-muted-foreground flex items-center gap-1 text-[11px] font-bold tracking-wider uppercase">
                <MapPin className="text-secondary h-3.5 w-3.5" /> Lokasi
              </label>
              <input
                type="text"
                value={lokasi}
                onChange={(e) => setLokasi(e.target.value)}
                placeholder="Kota atau area..."
                className="border-border text-foreground focus:ring-secondary/50 w-full rounded-xl border bg-gray-50 px-3 py-2.5 text-sm font-medium outline-none focus:ring-2"
              />
            </div>

            {/* Custom Dropdown: Tipe Properti */}
            <div className="relative space-y-1">
              <label className="text-muted-foreground flex items-center gap-1 text-[11px] font-bold tracking-wider uppercase">
                <Home className="text-secondary h-3.5 w-3.5" /> Tipe Properti
              </label>
              <button
                type="button"
                onClick={() => {
                  setTipeOpen(!tipeOpen);
                  setHargaOpen(false);
                }}
                className="border-border text-foreground focus:ring-secondary/50 flex w-full items-center justify-between rounded-xl border bg-gray-50 px-3 py-2.5 text-left text-sm font-medium outline-none focus:ring-2"
              >
                <span className="truncate">{tipeProperti}</span>
                <ChevronDown
                  className={`text-muted-foreground h-4 w-4 transition-transform ${tipeOpen ? "rotate-180" : ""}`}
                />
              </button>

              <AnimatePresence>
                {tipeOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 5, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 5, scale: 0.98 }}
                    className="border-border absolute top-full left-0 z-50 mt-1 w-full overflow-hidden rounded-xl border bg-white py-1.5 shadow-xl"
                  >
                    {tipeOptions.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => {
                          setTipeProperti(opt);
                          setTipeOpen(false);
                        }}
                        className={`w-full px-4 py-2 text-left text-xs font-semibold transition-colors ${
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
            <div className="relative space-y-1">
              <label className="text-muted-foreground flex items-center gap-1 text-[11px] font-bold tracking-wider uppercase">
                <DollarSign className="text-secondary h-3.5 w-3.5" /> Kisaran Harga
              </label>
              <button
                type="button"
                onClick={() => {
                  setHargaOpen(!hargaOpen);
                  setTipeOpen(false);
                }}
                className="border-border text-foreground focus:ring-secondary/50 flex w-full items-center justify-between rounded-xl border bg-gray-50 px-3 py-2.5 text-left text-sm font-medium outline-none focus:ring-2"
              >
                <span className="truncate">{kisaranHarga}</span>
                <ChevronDown
                  className={`text-muted-foreground h-4 w-4 transition-transform ${hargaOpen ? "rotate-180" : ""}`}
                />
              </button>

              <AnimatePresence>
                {hargaOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 5, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 5, scale: 0.98 }}
                    className="border-border absolute top-full left-0 z-50 mt-1 w-full overflow-hidden rounded-xl border bg-white py-1.5 shadow-xl"
                  >
                    {hargaOptions.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => {
                          setKisaranHarga(opt);
                          setHargaOpen(false);
                        }}
                        className={`w-full px-4 py-2 text-left text-xs font-semibold transition-colors ${
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
                className="bg-secondary text-primary-foreground hover:bg-secondary/90 shadow-secondary/25 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold shadow-md transition-all"
              >
                <Search className="h-4 w-4" /> Cari Properti
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}