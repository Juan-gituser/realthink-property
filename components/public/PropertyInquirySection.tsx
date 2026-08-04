"use client";

import { useState } from "react";
import { MessageSquare, Calendar, Loader2, CheckCircle2 } from "lucide-react";

interface PropertyInquirySectionProps {
  propertyId: string;
  propertyTitle: string;
  listingId?: string;
}

export default function PropertyInquirySection({
  propertyId,
  propertyTitle,
  listingId = "N/A",
}: PropertyInquirySectionProps) {
  const [activeTab, setActiveTab] = useState<"inquiry" | "survey">("inquiry");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Form State Tanya Properti
  const [inquiryForm, setInquiryForm] = useState({
    name: "",
    whatsapp: "",
    email: "",
    message: `Halo, saya tertarik dengan properti "${propertyTitle}". Mohon info selengkapnya.`,
  });

  // Form State Survey
  const [surveyForm, setSurveyForm] = useState({
    name: "",
    whatsapp: "",
    date: new Date().toISOString().split("T")[0],
    time: "10:00",
    notes: "",
  });

  // Handle Tanya Properti Submit
  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/public/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "INQUIRY",
          ...inquiryForm,
          property_id: propertyId,
          property_title: propertyTitle,
          listing_id: listingId,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setIsSuccess(true);
      } else {
        setErrorMsg(json.error || "Gagal mengirim permintaan.");
      }
    } catch {
      setErrorMsg("Terjadi kesalahan jaringan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Jadwalkan Survey Submit
  const handleSurveySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/public/surveys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...surveyForm,
          property_id: propertyId,
          property_title: propertyTitle,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setIsSuccess(true);
      } else {
        setErrorMsg(json.error || "Gagal menjadwalkan survey.");
      }
    } catch {
      setErrorMsg("Terjadi kesalahan jaringan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm space-y-5">
      {/* Tabs Switcher */}
      <div className="flex bg-gray-100 p-1 rounded-2xl">
        <button
          onClick={() => {
            setActiveTab("inquiry");
            setIsSuccess(false);
            setErrorMsg("");
          }}
          className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === "inquiry"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <MessageSquare className="h-4 w-4 text-amber-500" /> Tanya Properti Ini
        </button>
        <button
          onClick={() => {
            setActiveTab("survey");
            setIsSuccess(false);
            setErrorMsg("");
          }}
          className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === "survey"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <Calendar className="h-4 w-4 text-blue-500" /> Jadwalkan Survey
        </button>
      </div>

      {/* Success State */}
      {isSuccess ? (
        <div className="py-8 text-center space-y-3">
          <CheckCircle2 className="h-10 w-10 text-emerald-500 mx-auto" />
          <p className="text-xs font-bold text-gray-900">
            Permintaan Anda berhasil dikirim. Tim Realthink Property akan segera menghubungi Anda.
          </p>
          <button
            onClick={() => setIsSuccess(false)}
            className="text-[11px] font-bold text-amber-600 underline cursor-pointer"
          >
            Kirim Pertanyaan Lain
          </button>
        </div>
      ) : (
        <>
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs">
              {errorMsg}
            </div>
          )}

          {/* Form Tanya Properti */}
          {activeTab === "inquiry" && (
            <form onSubmit={handleInquirySubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Nama *</label>
                <input
                  type="text"
                  required
                  placeholder="Nama Lengkap"
                  value={inquiryForm.name}
                  onChange={(e) =>
                    setInquiryForm({ ...inquiryForm, name: e.target.value })
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
                  value={inquiryForm.whatsapp}
                  onChange={(e) =>
                    setInquiryForm({ ...inquiryForm, whatsapp: e.target.value })
                  }
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Email (Opsional)
                </label>
                <input
                  type="email"
                  placeholder="email@example.com"
                  value={inquiryForm.email}
                  onChange={(e) =>
                    setInquiryForm({ ...inquiryForm, email: e.target.value })
                  }
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Pesan</label>
                <textarea
                  rows={3}
                  value={inquiryForm.message}
                  onChange={(e) =>
                    setInquiryForm({ ...inquiryForm, message: e.target.value })
                  }
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 focus:border-amber-500 focus:outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-xl bg-amber-500 py-3 text-xs font-bold text-white hover:bg-amber-600 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                Kirim Pertanyaan
              </button>
            </form>
          )}

          {/* Form Jadwalkan Survey */}
          {activeTab === "survey" && (
            <form onSubmit={handleSurveySubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Nama *</label>
                <input
                  type="text"
                  required
                  placeholder="Nama Lengkap"
                  value={surveyForm.name}
                  onChange={(e) =>
                    setSurveyForm({ ...surveyForm, name: e.target.value })
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
                  value={surveyForm.whatsapp}
                  onChange={(e) =>
                    setSurveyForm({ ...surveyForm, whatsapp: e.target.value })
                  }
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Tanggal *
                  </label>
                  <input
                    type="date"
                    required
                    value={surveyForm.date}
                    onChange={(e) =>
                      setSurveyForm({ ...surveyForm, date: e.target.value })
                    }
                    className="w-full rounded-xl border border-gray-200 px-3 py-2 focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Jam *
                  </label>
                  <input
                    type="time"
                    required
                    value={surveyForm.time}
                    onChange={(e) =>
                      setSurveyForm({ ...surveyForm, time: e.target.value })
                    }
                    className="w-full rounded-xl border border-gray-200 px-3 py-2 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Catatan Tambahan
                </label>
                <textarea
                  rows={2}
                  placeholder="Contoh: Tolong siapkan info sertifikat..."
                  value={surveyForm.notes}
                  onChange={(e) =>
                    setSurveyForm({ ...surveyForm, notes: e.target.value })
                  }
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 focus:border-amber-500 focus:outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-xl bg-blue-600 py-3 text-xs font-bold text-white hover:bg-blue-700 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                Jadwalkan Survey Lokasi
              </button>
            </form>
          )}
        </>
      )}
    </div>
  );
}