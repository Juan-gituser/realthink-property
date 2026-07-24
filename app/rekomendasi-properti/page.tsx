"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import PremiumGuard from "@/components/PremiumGuard";
import { 
  Sparkles, ArrowRight, ArrowLeft, CheckCircle2, Building2, 
  MapPin, ShieldCheck, Heart, MessageSquare, Calendar, Sliders, Loader2 
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

const CITIES = ["Jakarta Selatan", "Jakarta Utara", "Tangerang Selatan", "Bekasi", "Depok", "Bogor", "Bandung", "Surabaya"];
const PROPERTY_TYPES = ["Rumah", "Apartemen", "Ruko", "Tanah", "Villa", "Gudang"];
const PURPOSES = ["Hunian", "Investasi", "Disewakan"];
const PRIORITIES = ["Dekat Tol", "Dekat Sekolah", "Dekat Stasiun", "Dekat Mall", "Dekat Rumah Sakit", "Dekat Kantor"];

export default function AIPropertyMatchPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
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
            reasons: [`Cocok karena ${priorities[0] || "lokasi strategis"}.`, "Sesuai dengan budget pilihan.", "Cicilan masih dalam batas aman."],
            image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
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
            image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
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
            image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
          },
        ]);
      }, 2500);

    } catch (err: any) {
      alert("Gagal memproses AI Match: " + err.message);
      setAnalyzing(false);
    }
  };

  return (
    <PremiumGuard>
      <div className="min-h-screen bg-gray-50 pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-3xl">
          
          {/* Header Title */}
          <div className="text-center space-y-3 mb-8">
            <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-4 py-1.5 rounded-full text-xs font-bold shadow-xs">
              <Sparkles className="w-4 h-4" /> AI Property Match Engine
            </div>
            <h1 className="text-3xl font-heading font-bold text-gray-900">
              Temukan Properti Impian Anda dengan AI
            </h1>
            <p className="text-sm text-gray-500 max-w-lg mx-auto">
              Jawab beberapa pertanyaan singkat, biarkan sistem cerdas kami mencarikan unit terbaik yang paling akurat untuk Anda.
            </p>
          </div>

          {/* Loading / Analyzing State */}
          {analyzing ? (
            <div className="bg-white p-12 rounded-2xl border shadow-sm text-center space-y-6">
              <Loader2 className="w-12 h-12 text-amber-600 animate-spin mx-auto" />
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-gray-900">AI Sedang Menganalisis Ribuan Data...</h3>
                <p className="text-xs text-gray-500">Mencocokkan budget, lokasi, preferensi prioritas, dan simulasi cicilan Anda.</p>
              </div>
            </div>
          ) : results ? (
            /* Result View */
            <div className="space-y-6">
              <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">Analisis AI Selesai!</h4>
                    <p className="text-xs text-gray-600">Ditemukan 3 properti terbaik yang paling sesuai dengan profil Anda.</p>
                  </div>
                </div>
                <button 
                  onClick={() => { setResults(null); setStep(1); }}
                  className="text-xs font-bold text-emerald-700 bg-white px-3 py-2 rounded-xl border border-emerald-300 hover:bg-emerald-100 transition cursor-pointer"
                >
                  Ulangi Tes
                </button>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {results.map((prop) => (
                  <div key={prop.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col md:flex-row">
                    <div className="md:w-72 h-48 md:h-auto relative">
                      <img src={prop.image} alt={prop.title} className="w-full h-full object-cover" />
                      <span className={`absolute top-3 left-3 px-3 py-1 rounded-full text-[11px] font-bold text-white shadow-md ${
                        prop.badge === "Best Match" ? "bg-amber-600" : prop.badge === "Highly Recommended" ? "bg-blue-600" : "bg-purple-600"
                      }`}>
                        {prop.badge}
                      </span>
                    </div>

                    <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg">
                            Skor Kecocokan: {prop.score}%
                          </span>
                          <span className="text-base font-bold text-gray-900">
                            Rp {prop.price.toLocaleString("id-ID")}
                          </span>
                        </div>
                        <h3 className="font-heading font-bold text-base text-gray-900">{prop.title}</h3>
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-amber-600" /> {prop.city}
                        </p>

                        {/* Alasan */}
                        <div className="bg-gray-50 p-3 rounded-xl space-y-1">
                          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Alasan AI:</p>
                          {prop.reasons.map((reason, idx) => (
                            <p key={idx} className="text-xs text-gray-700 flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span> {reason}
                            </p>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-2 border-t">
                        <a 
                          href={`https://wa.me/6281234567890?text=Halo,%20saya%20tertarik%20dengan%20rekomendasi%20AI%20properti%20${prop.title}`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition flex items-center justify-center gap-1.5"
                        >
                          <MessageSquare className="w-3.5 h-3.5" /> Konsultasi WA
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Wizard Multi-Step */
            <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6">
              
              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-gray-500">
                  <span>Langkah {step} dari {totalSteps}</span>
                  <span>{Math.round((step / totalSteps) * 100)}% Selesai</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-amber-600 h-full transition-all duration-300"
                    style={{ width: `${(step / totalSteps) * 100}%` }}
                  ></div>
                </div>
              </div>

              <form onSubmit={handleSubmitAll} className="space-y-6 min-h-75[300px] flex flex-col justify-between">
                
                {/* STEP 1: Budget Properti */}
                {step === 1 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-heading font-bold text-gray-900">Berapa budget maksimal properti Anda?</h3>
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
                        className="w-full accent-amber-600 cursor-pointer"
                      />
                      <div className="flex justify-between text-[11px] text-gray-400 font-semibold">
                        <span>Rp100 Juta</span>
                        <span>Rp20 Miliar</span>
                      </div>
                      <div className="pt-2">
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Atau masukkan nominal manual (Rp):</label>
                        <input 
                          type="number"
                          value={budget}
                          onChange={(e) => setBudget(Number(e.target.value))}
                          className="w-full p-3 border rounded-xl text-sm font-semibold outline-none focus:ring-1 focus:ring-amber-500 bg-white"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 2: Pilih Kota */}
                {step === 2 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-heading font-bold text-gray-900">Pilih Kota atau Wilayah Tujuan</h3>
                    <div className="relative">
                      <select
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full p-3.5 border rounded-xl text-sm font-semibold outline-none focus:ring-1 focus:ring-amber-500 bg-white cursor-pointer"
                      >
                        {CITIES.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {/* STEP 3: Jenis Properti */}
                {step === 3 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-heading font-bold text-gray-900">Jenis Properti apa yang Anda cari?</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {PROPERTY_TYPES.map((type) => (
                        <button
                          type="button"
                          key={type}
                          onClick={() => setPropertyType(type)}
                          className={`p-4 rounded-xl border text-sm font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                            propertyType === type 
                              ? "bg-amber-50 border-amber-600 text-amber-800 shadow-xs" 
                              : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
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
                    <h3 className="text-lg font-heading font-bold text-gray-900">Apa tujuan pembelian properti ini?</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {PURPOSES.map((p) => (
                        <button
                          type="button"
                          key={p}
                          onClick={() => setPurpose(p)}
                          className={`p-4 rounded-xl border text-sm font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                            purpose === p 
                              ? "bg-amber-50 border-amber-600 text-amber-800 shadow-xs" 
                              : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
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
                    <h3 className="text-lg font-heading font-bold text-gray-900">Minimal Kamar Tidur</h3>
                    <div className="grid grid-cols-5 gap-3">
                      {["1", "2", "3", "4", "5+"].map((bed) => (
                        <button
                          type="button"
                          key={bed}
                          onClick={() => setMinBedrooms(bed)}
                          className={`p-4 rounded-xl border text-sm font-bold transition flex items-center justify-center cursor-pointer ${
                            minBedrooms === bed 
                              ? "bg-amber-50 border-amber-600 text-amber-800 shadow-xs" 
                              : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
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
                    <h3 className="text-lg font-heading font-bold text-gray-900">Luas Tanah Minimal ($m^2$)</h3>
                    <input
                      type="number"
                      value={minLandArea}
                      onChange={(e) => setMinLandArea(e.target.value)}
                      placeholder="Contoh: 120"
                      className="w-full p-3.5 border rounded-xl text-sm font-semibold outline-none focus:ring-1 focus:ring-amber-500 bg-white"
                    />
                  </div>
                )}

                {/* STEP 7: Luas Bangunan Minimal */}
                {step === 7 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-heading font-bold text-gray-900">Luas Bangunan Minimal ($m^2$)</h3>
                    <input
                      type="number"
                      value={minBuildingArea}
                      onChange={(e) => setMinBuildingArea(e.target.value)}
                      placeholder="Contoh: 90"
                      className="w-full p-3.5 border rounded-xl text-sm font-semibold outline-none focus:ring-1 focus:ring-amber-500 bg-white"
                    />
                  </div>
                )}

                {/* STEP 8: Prioritas */}
                {step === 8 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-heading font-bold text-gray-900">Pilih Prioritas Lokasi / Fasilitas Utama</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {PRIORITIES.map((item) => {
                        const isSelected = priorities.includes(item);
                        return (
                          <button
                            type="button"
                            key={item}
                            onClick={() => handlePriorityToggle(item)}
                            className={`p-3.5 rounded-xl border text-xs font-bold transition flex items-center justify-between cursor-pointer ${
                              isSelected 
                                ? "bg-amber-50 border-amber-600 text-amber-800 shadow-xs" 
                                : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                            }`}
                          >
                            <span>{item}</span>
                            {isSelected && <CheckCircle2 className="w-4 h-4 text-amber-600" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* STEP 9: Maksimal Cicilan Bulanan */}
                {step === 9 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-heading font-bold text-gray-900">Maksimal Cicilan Bulanan yang Diinginkan</h3>
                    <input
                      type="number"
                      value={maxInstallment}
                      onChange={(e) => setMaxInstallment(e.target.value)}
                      placeholder="Contoh: 15000000"
                      className="w-full p-3.5 border rounded-xl text-sm font-semibold outline-none focus:ring-1 focus:ring-amber-500 bg-white"
                    />
                    <p className="text-xs text-gray-400">Masukkan angka tanpa titik atau koma (dalam Rupiah).</p>
                  </div>
                )}

                {/* STEP 10: Kontak & Submit */}
                {step === 10 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-heading font-bold text-gray-900">Data Kontak Anda untuk Hasil AI Match</h3>
                    <div className="space-y-3 text-xs">
                      <div>
                        <label className="block font-semibold text-gray-700 mb-1">Nama Lengkap <span className="text-red-500">*</span></label>
                        <input 
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Nama lengkap Anda"
                          className="w-full p-3 border rounded-xl font-semibold text-gray-900 bg-white outline-none focus:ring-1 focus:ring-amber-500"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-gray-700 mb-1">Nomor WhatsApp <span className="text-red-500">*</span></label>
                        <input 
                          type="tel"
                          required
                          value={whatsapp}
                          onChange={(e) => setWhatsapp(e.target.value)}
                          placeholder="08123456789"
                          className="w-full p-3 border rounded-xl font-semibold text-gray-900 bg-white outline-none focus:ring-1 focus:ring-amber-500"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between pt-6 border-t">
                  {step > 1 ? (
                    <button
                      type="button"
                      onClick={() => setStep(step - 1)}
                      className="px-5 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-100 transition flex items-center gap-2 cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" /> Sebelumnya
                    </button>
                  ) : <div></div>}

                  {step < totalSteps ? (
                    <button
                      type="button"
                      onClick={() => setStep(step + 1)}
                      className="bg-primary text-white px-6 py-2.5 rounded-xl text-xs font-bold hover:bg-primary/90 transition flex items-center gap-2 cursor-pointer"
                    >
                      Selanjutnya <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="bg-amber-600 text-white px-8 py-3 rounded-xl text-xs font-bold hover:bg-amber-700 transition flex items-center gap-2 cursor-pointer shadow-md"
                    >
                      <Sparkles className="w-4 h-4" /> Temukan Properti AI
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