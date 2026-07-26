"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import PremiumGuard from "@/components/PremiumGuard";
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  MapPin,
  MessageSquare,
  Loader2,
} from "lucide-react";

interface PropertyResult {
  id: string;
  title: string;
  city: string;
  price: number;
  type: string;
  bedrooms: number;
  landArea: number;
  buildingArea: number;
  score: number;
  badge: "Best Match" | "Highly Recommended" | "Good Choice";
  reasons: string[];
  image: string;
}

const CITIES = [
  "Jakarta Selatan",
  "Jakarta Utara",
  "Tangerang Selatan",
  "Bekasi",
  "Depok",
  "Bogor",
  "Bandung",
  "Surabaya",
];
const PROPERTY_TYPES = ["Rumah", "Apartemen", "Ruko", "Tanah", "Villa", "Gudang"];
const PURPOSES = ["Hunian", "Investasi", "Disewakan"];
const PRIORITIES = [
  "Dekat Tol",
  "Dekat Sekolah",
  "Dekat Stasiun",
  "Dekat Mall",
  "Dekat Rumah Sakit",
  "Dekat Kantor",
];

export default function AIPropertyMatchPage() {
  const [step, setStep] = useState(1);
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<PropertyResult[] | null>(null);

  // Form State
  const [budget, setBudget] = useState(2500000000);
  const [city, setCity] = useState("Tangerang Selatan");
  const [propertyType, setPropertyType] = useState("Rumah");
  const [purpose, setPurpose] = useState("Hunian");
  const [minBedrooms, setMinBedrooms] = useState("3");
  const [minLandArea, setMinLandArea] = useState("120");
  const [minBuildingArea, setMinBuildingArea] = useState("100");
  const [priorities, setPriorities] = useState<string[]>(["Dekat Tol"]);
  const [maxInstallment, setMaxInstallment] = useState("20000000");

  // Step 10: Contact Lead Info
  const [fullName, setFullName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");

  const totalSteps = 10;

  const handlePriorityToggle = (item: string) => {
    if (priorities.includes(item)) {
      setPriorities(priorities.filter((p) => p !== item));
    } else {
      setPriorities([...priorities, item]);
    }
  };

  const handleSubmitAll = async (e: React.FormEvent) => {
    e.preventDefault();
    setAnalyzing(true);

    try {
      // 1. Simpan Lead ke Supabase
      const { error } = await supabase.from("property_leads").insert([
        {
          full_name: fullName,
          whatsapp,
          budget,
          city,
          property_type: propertyType,
          purpose,
          min_bedrooms: parseInt(minBedrooms),
          min_land_area: parseInt(minLandArea) || 0,
          min_building_area: parseInt(minBuildingArea) || 0,
          priorities,
          max_installment: parseFloat(maxInstallment) || 0,
        },
      ]);

      if (error) throw error;

      // 2. Simulasi AI Processing & Matching Result
      setTimeout(() => {
        setAnalyzing(false);
        setResults([
          {
            id: "prop-1",
            title: "Modern Minimalist House BSD Grand",
            city: city,
            price: budget * 0.95,
            type: propertyType,
            bedrooms: parseInt(minBedrooms),
            landArea: parseInt(minLandArea) + 10,
            buildingArea: parseInt(minBuildingArea) + 15,
            score: 98,
            badge: "Best Match",
            reasons: [
              `Cocok karena ${priorities[0] || "lokasi strategis"}.`,
              "Sesuai dengan budget pilihan.",
              "Cicilan masih dalam batas aman.",
            ],
            image:
              "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
          },
          {
            id: "prop-2",
            title: "The Signature Residence & Suites",
            city: city,
            price: budget * 1.05,
            type: propertyType,
            bedrooms: parseInt(minBedrooms),
            landArea: parseInt(minLandArea),
            buildingArea: parseInt(minBuildingArea),
            score: 95,
            badge: "Highly Recommended",
            reasons: ["Fasilitas premium lengkap.", "Potensi kenaikan investasi tinggi."],
            image:
              "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
          },
          {
            id: "prop-3",
            title: "Harmony Green Living Cluster",
            city: city,
            price: budget * 0.85,
            type: propertyType,
            bedrooms: Math.max(1, parseInt(minBedrooms) - 1),
            landArea: parseInt(minLandArea),
            buildingArea: parseInt(minBuildingArea) - 10,
            score: 90,
            badge: "Good Choice",
            reasons: ["Harga di bawah budget maksimal.", "Lingkungan asri dan aman."],
            image:
              "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
          },
        ]);
      }, 2500);
    } catch (err: unknown) {
      alert("Gagal memproses AI Match: " + (err instanceof Error ? err.message : String(err)));
      setAnalyzing(false);
    }
  };

  return (
    <PremiumGuard>
      <div className="min-h-screen bg-gray-50 pt-24 pb-16">
        <div className="container mx-auto max-w-3xl px-4">
          {/* Header Title */}
          <div className="mb-8 space-y-3 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-1.5 text-xs font-bold text-amber-800 shadow-xs">
              <Sparkles className="h-4 w-4" /> AI Property Match Engine
            </div>
            <h1 className="font-heading text-3xl font-bold text-gray-900">
              Temukan Properti Impian Anda dengan AI
            </h1>
            <p className="mx-auto max-w-lg text-sm text-gray-500">
              Jawab beberapa pertanyaan singkat, biarkan sistem cerdas kami mencarikan unit terbaik
              yang paling akurat untuk Anda.
            </p>
          </div>

          {/* Loading / Analyzing State */}
          {analyzing ? (
            <div className="space-y-6 rounded-2xl border bg-white p-12 text-center shadow-sm">
              <Loader2 className="mx-auto h-12 w-12 animate-spin text-amber-600" />
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-gray-900">
                  AI Sedang Menganalisis Ribuan Data...
                </h3>
                <p className="text-xs text-gray-500">
                  Mencocokkan budget, lokasi, preferensi prioritas, dan simulasi cicilan Anda.
                </p>
              </div>
            </div>
          ) : results ? (
            /* Result View */
            <div className="space-y-6">
              <div className="flex items-center justify-between rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">Analisis AI Selesai!</h4>
                    <p className="text-xs text-gray-600">
                      Ditemukan 3 properti terbaik yang paling sesuai dengan profil Anda.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setResults(null);
                    setStep(1);
                  }}
                  className="cursor-pointer rounded-xl border border-emerald-300 bg-white px-3 py-2 text-xs font-bold text-emerald-700 transition hover:bg-emerald-100"
                >
                  Ulangi Tes
                </button>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {results.map((prop) => (
                  <div
                    key={prop.id}
                    className="flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md md:flex-row"
                  >
                    <div className="relative h-48 md:h-auto md:w-72">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={prop.image}
                        alt={prop.title}
                        className="h-full w-full object-cover"
                      />
                      <span
                        className={`absolute top-3 left-3 rounded-full px-3 py-1 text-[11px] font-bold text-white shadow-md ${
                          prop.badge === "Best Match"
                            ? "bg-amber-600"
                            : prop.badge === "Highly Recommended"
                            ? "bg-blue-600"
                            : "bg-purple-600"
                        }`}
                      >
                        {prop.badge}
                      </span>
                    </div>

                    <div className="flex flex-1 flex-col justify-between space-y-4 p-6">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="rounded-lg bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-600">
                            Skor Kecocokan: {prop.score}%
                          </span>
                          <span className="text-base font-bold text-gray-900">
                            Rp {prop.price.toLocaleString("id-ID")}
                          </span>
                        </div>
                        <h3 className="font-heading text-base font-bold text-gray-900">
                          {prop.title}
                        </h3>
                        <p className="flex items-center gap-1 text-xs text-gray-500">
                          <MapPin className="h-3.5 w-3.5 text-amber-600" /> {prop.city}
                        </p>

                        {/* Alasan */}
                        <div className="space-y-1 rounded-xl bg-gray-50 p-3">
                          <p className="text-[11px] font-bold tracking-wider text-gray-400 uppercase">
                            Alasan AI:
                          </p>
                          {prop.reasons.map((reason, idx) => (
                            <p
                              key={idx}
                              className="flex items-center gap-1.5 text-xs text-gray-700"
                            >
                              <span className="h-1.5 w-1.5 rounded-full bg-amber-600"></span>{" "}
                              {reason}
                            </p>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 border-t pt-2">
                        <a
                          href={`https://wa.me/6281234567890?text=Halo,%20saya%20tertarik%20dengan%20rekomendasi%20AI%20properti%20${prop.title}`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-green-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-green-700"
                        >
                          <MessageSquare className="h-3.5 w-3.5" /> Konsultasi WA
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Wizard Multi-Step */
            <div className="space-y-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-gray-500">
                  <span>
                    Langkah {step} dari {totalSteps}
                  </span>
                  <span>{Math.round((step / totalSteps) * 100)}% Selesai</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full bg-amber-600 transition-all duration-300"
                    style={{ width: `${(step / totalSteps) * 100}%` }}
                  ></div>
                </div>
              </div>

              <form
                onSubmit={handleSubmitAll}
                className="min-h-75[300px] flex flex-col justify-between space-y-6"
              >
                {/* STEP 1: Budget Properti */}
                {step === 1 && (
                  <div className="space-y-4">
                    <h3 className="font-heading text-lg font-bold text-gray-900">
                      Berapa budget maksimal properti Anda?
                    </h3>
                    <div className="space-y-3">
                      <div className="text-2xl font-bold text-amber-600">
                        Rp {budget.toLocaleString("id-ID")}
                      </div>
                      <input
                        type="range"
                        min="100000000"
                        max="20000000000"
                        step="100000000"
                        value={budget}
                        onChange={(e) => setBudget(Number(e.target.value))}
                        className="w-full cursor-pointer accent-amber-600"
                      />
                      <div className="flex justify-between text-[11px] font-semibold text-gray-400">
                        <span>Rp100 Juta</span>
                        <span>Rp20 Miliar</span>
                      </div>
                      <div className="pt-2">
                        <label className="mb-1 block text-xs font-semibold text-gray-700">
                          Atau masukkan nominal manual (Rp):
                        </label>
                        <input
                          type="number"
                          value={budget}
                          onChange={(e) => setBudget(Number(e.target.value))}
                          className="w-full rounded-xl border bg-white p-3 text-sm font-semibold outline-none focus:ring-1 focus:ring-amber-500"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 2: Pilih Kota */}
                {step === 2 && (
                  <div className="space-y-4">
                    <h3 className="font-heading text-lg font-bold text-gray-900">
                      Pilih Kota atau Wilayah Tujuan
                    </h3>
                    <div className="relative">
                      <select
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full cursor-pointer rounded-xl border bg-white p-3.5 text-sm font-semibold outline-none focus:ring-1 focus:ring-amber-500"
                      >
                        {CITIES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {/* STEP 3: Jenis Properti */}
                {step === 3 && (
                  <div className="space-y-4">
                    <h3 className="font-heading text-lg font-bold text-gray-900">
                      Jenis Properti apa yang Anda cari?
                    </h3>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {PROPERTY_TYPES.map((type) => (
                        <button
                          type="button"
                          key={type}
                          onClick={() => setPropertyType(type)}
                          className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl border p-4 text-sm font-bold transition ${
                            propertyType === type
                              ? "border-amber-600 bg-amber-50 text-amber-800 shadow-xs"
                              : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* STEP 4: Tujuan Pembelian */}
                {step === 4 && (
                  <div className="space-y-4">
                    <h3 className="font-heading text-lg font-bold text-gray-900">
                      Apa tujuan pembelian properti ini?
                    </h3>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                      {PURPOSES.map((p) => (
                        <button
                          type="button"
                          key={p}
                          onClick={() => setPurpose(p)}
                          className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl border p-4 text-sm font-bold transition ${
                            purpose === p
                              ? "border-amber-600 bg-amber-50 text-amber-800 shadow-xs"
                              : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* STEP 5: Minimal Kamar Tidur */}
                {step === 5 && (
                  <div className="space-y-4">
                    <h3 className="font-heading text-lg font-bold text-gray-900">
                      Minimal Kamar Tidur
                    </h3>
                    <div className="grid grid-cols-5 gap-3">
                      {["1", "2", "3", "4", "5+"].map((bed) => (
                        <button
                          type="button"
                          key={bed}
                          onClick={() => setMinBedrooms(bed)}
                          className={`flex cursor-pointer items-center justify-center rounded-xl border p-4 text-sm font-bold transition ${
                            minBedrooms === bed
                              ? "border-amber-600 bg-amber-50 text-amber-800 shadow-xs"
                              : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          {bed}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* STEP 6: Luas Tanah Minimal */}
                {step === 6 && (
                  <div className="space-y-4">
                    <h3 className="font-heading text-lg font-bold text-gray-900">
                      Luas Tanah Minimal (m2)
                    </h3>
                    <input
                      type="number"
                      value={minLandArea}
                      onChange={(e) => setMinLandArea(e.target.value)}
                      placeholder="Contoh: 120"
                      className="w-full rounded-xl border bg-white p-3.5 text-sm font-semibold outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                )}

                {/* STEP 7: Luas Bangunan Minimal */}
                {step === 7 && (
                  <div className="space-y-4">
                    <h3 className="font-heading text-lg font-bold text-gray-900">
                      Luas Bangunan Minimal (m2)
                    </h3>
                    <input
                      type="number"
                      value={minBuildingArea}
                      onChange={(e) => setMinBuildingArea(e.target.value)}
                      placeholder="Contoh: 90"
                      className="w-full rounded-xl border bg-white p-3.5 text-sm font-semibold outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                )}

                {/* STEP 8: Prioritas */}
                {step === 8 && (
                  <div className="space-y-4">
                    <h3 className="font-heading text-lg font-bold text-gray-900">
                      Pilih Prioritas Lokasi / Fasilitas Utama
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {PRIORITIES.map((item) => {
                        const isSelected = priorities.includes(item);
                        return (
                          <button
                            type="button"
                            key={item}
                            onClick={() => handlePriorityToggle(item)}
                            className={`flex cursor-pointer items-center justify-between rounded-xl border p-3.5 text-xs font-bold transition ${
                              isSelected
                                ? "border-amber-600 bg-amber-50 text-amber-800 shadow-xs"
                                : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                            }`}
                          >
                            <span>{item}</span>
                            {isSelected && <CheckCircle2 className="h-4 w-4 text-amber-600" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* STEP 9: Maksimal Cicilan Bulanan */}
                {step === 9 && (
                  <div className="space-y-4">
                    <h3 className="font-heading text-lg font-bold text-gray-900">
                      Maksimal Cicilan Bulanan yang Diinginkan
                    </h3>
                    <input
                      type="number"
                      value={maxInstallment}
                      onChange={(e) => setMaxInstallment(e.target.value)}
                      placeholder="Contoh: 15000000"
                      className="w-full rounded-xl border bg-white p-3.5 text-sm font-semibold outline-none focus:ring-1 focus:ring-amber-500"
                    />
                    <p className="text-xs text-gray-400">
                      Masukkan angka tanpa titik atau koma (dalam Rupiah).
                    </p>
                  </div>
                )}

                {/* STEP 10: Kontak & Submit */}
                {step === 10 && (
                  <div className="space-y-4">
                    <h3 className="font-heading text-lg font-bold text-gray-900">
                      Data Kontak Anda untuk Hasil AI Match
                    </h3>
                    <div className="space-y-3 text-xs">
                      <div>
                        <label className="mb-1 block font-semibold text-gray-700">
                          Nama Lengkap <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Nama lengkap Anda"
                          className="w-full rounded-xl border bg-white p-3 font-semibold text-gray-900 outline-none focus:ring-1 focus:ring-amber-500"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block font-semibold text-gray-700">
                          Nomor WhatsApp <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          required
                          value={whatsapp}
                          onChange={(e) => setWhatsapp(e.target.value)}
                          placeholder="08123456789"
                          className="w-full rounded-xl border bg-white p-3 font-semibold text-gray-900 outline-none focus:ring-1 focus:ring-amber-500"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between border-t pt-6">
                  {step > 1 ? (
                    <button
                      type="button"
                      onClick={() => setStep(step - 1)}
                      className="flex cursor-pointer items-center gap-2 rounded-xl border border-gray-300 px-5 py-2.5 text-xs font-bold text-gray-700 transition hover:bg-gray-100"
                    >
                      <ArrowLeft className="h-4 w-4" /> Sebelumnya
                    </button>
                  ) : (
                    <div></div>
                  )}

                  {step < totalSteps ? (
                    <button
                      type="button"
                      onClick={() => setStep(step + 1)}
                      className="bg-primary hover:bg-primary/90 flex cursor-pointer items-center gap-2 rounded-xl px-6 py-2.5 text-xs font-bold text-white transition"
                    >
                      Selanjutnya <ArrowRight className="h-4 w-4" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="flex cursor-pointer items-center gap-2 rounded-xl bg-amber-600 px-8 py-3 text-xs font-bold text-white shadow-md transition hover:bg-amber-700"
                    >
                      <Sparkles className="h-4 w-4" /> Temukan Properti AI
                    </button>
                  )}
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </PremiumGuard>
  );
}