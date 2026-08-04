"use client";

import { useState } from "react";
import { MessageCircle, X, Loader2, CheckCircle2 } from "lucide-react";

export default function FloatingConsultation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    whatsapp: "",
    email: "",
    intent: "Membeli Properti",
    budget: "",
    area: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/public/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "CONSULTATION",
          ...formData,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setIsSuccess(true);
        setFormData({
          name: "",
          whatsapp: "",
          email: "",
          intent: "Membeli Properti",
          budget: "",
          area: "",
          message: "",
        });
      } else {
        setErrorMsg(json.error || "Gagal mengirim formulir.");
      }
    } catch {
      setErrorMsg("Terjadi kesalahan jaringan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => {
            setIsOpen(true);
            setIsSuccess(false);
            setErrorMsg("");
          }}
          className="flex items-center gap-2 rounded-full bg-amber-500 px-5 py-3.5 text-xs font-bold text-white shadow-xl hover:bg-amber-600 transition-all hover:scale-105 cursor-pointer"
        >
          <MessageCircle className="h-5 w-5" />
          <span>Konsultasi Sekarang</span>
        </button>
      </div>

      {/* Consultation Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl space-y-4 my-8">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            {isSuccess ? (
              <div className="py-8 text-center space-y-3">
                <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto" />
                <h3 className="text-lg font-bold text-gray-900">Terima Kasih!</h3>
                <p className="text-xs text-gray-600 max-w-xs mx-auto">
                  Permintaan Anda berhasil dikirim. Tim Realthink Property akan segera menghubungi Anda.
                </p>
                <button
                  onClick={() => setIsOpen(false)}
                  className="mt-4 px-6 py-2.5 bg-gray-900 text-white font-bold text-xs rounded-xl hover:bg-gray-800 transition cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            ) : (
              <>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Konsultasi Properti Gratis
                  </h3>
                  <p className="text-xs text-gray-500">
                    Isi form berikut dan tim konsultan kami siap membantu Anda.
                  </p>
                </div>

                {errorMsg && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs">
                    {errorMsg}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-3 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">
                        Nama Lengkap *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: Budi Santoso"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full rounded-xl border border-gray-200 px-3 py-2 focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">
                        WhatsApp *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="0812xxxxxxx"
                        value={formData.whatsapp}
                        onChange={(e) =>
                          setFormData({ ...formData, whatsapp: e.target.value })
                        }
                        className="w-full rounded-xl border border-gray-200 px-3 py-2 focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">
                      Email (Opsional)
                    </label>
                    <input
                      type="email"
                      placeholder="budi@example.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full rounded-xl border border-gray-200 px-3 py-2 focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">
                      Saya Ingin *
                    </label>
                    <select
                      value={formData.intent}
                      onChange={(e) =>
                        setFormData({ ...formData, intent: e.target.value })
                      }
                      className="w-full rounded-xl border border-gray-200 px-3 py-2 focus:border-amber-500 focus:outline-none bg-white"
                    >
                      <option value="Membeli Properti">Membeli Properti</option>
                      <option value="Menjual Properti">Menjual Properti</option>
                      <option value="Menyewa">Menyewa</option>
                      <option value="Investasi">Investasi</option>
                      <option value="Konsultasi KPR">Konsultasi KPR</option>
                      <option value="Lainnya">Lainnya</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">
                        Budget
                      </label>
                      <input
                        type="text"
                        placeholder="Contoh: 500 Juta - 1 Miliar"
                        value={formData.budget}
                        onChange={(e) =>
                          setFormData({ ...formData, budget: e.target.value })
                        }
                        className="w-full rounded-xl border border-gray-200 px-3 py-2 focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">
                        Area Lokasi
                      </label>
                      <input
                        type="text"
                        placeholder="Contoh: Bintaro, Jakarta Selatan"
                        value={formData.area}
                        onChange={(e) =>
                          setFormData({ ...formData, area: e.target.value })
                        }
                        className="w-full rounded-xl border border-gray-200 px-3 py-2 focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">
                      Pesan / Keterangan
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Tuliskan detail kebutuhan Anda..."
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      className="w-full rounded-xl border border-gray-200 px-3 py-2 focus:border-amber-500 focus:outline-none resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-xl bg-amber-500 py-3 text-xs font-bold text-white shadow-md hover:bg-amber-600 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                    Kirim Permintaan Konsultasi
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}