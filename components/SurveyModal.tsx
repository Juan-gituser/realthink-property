"use client";

import { useState, FormEvent } from "react";
import {
  X,
  Calendar,
  Clock,
  Users,
  User,
  Phone,
  Mail,
  FileText,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

interface SurveyModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyId: string;
  propertyTitle: string;
  onSubmitSuccess?: () => void;
}

export default function SurveyModal({
  isOpen,
  onClose,
  propertyId,
  propertyTitle,
  onSubmitSuccess,
}: SurveyModalProps) {
  // Form State
  const [fullName, setFullName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [surveyDate, setSurveyDate] = useState("");
  const [surveyTime, setSurveyTime] = useState("");
  const [numPeople, setNumPeople] = useState("1");
  const [notes, setNotes] = useState("");

  // Status & Feedback State
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMessage, setSuccessMessage] = useState(false);

  if (!isOpen) return null;

  const resetForm = () => {
    setFullName("");
    setWhatsapp("");
    setEmail("");
    setSurveyDate("");
    setSurveyTime("");
    setNumPeople("1");
    setNotes("");
    setErrorMsg("");
    setSuccessMessage(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      if (!fullName || !whatsapp || !surveyDate || !surveyTime) {
        throw new Error("Harap isi semua kolom yang wajib (*)");
      }

      // Simpan data ke tabel 'property_surveys'
      const { error } = await supabase.from("property_surveys").insert([
        {
          property_id: propertyId,
          property_title: propertyTitle,
          full_name: fullName,
          whatsapp,
          email: email || null,
          survey_date: surveyDate,
          survey_time: surveyTime,
          num_people: parseInt(numPeople) || 1,
          notes: notes || null,
          status: "Menunggu",
        },
      ]);

      // Jika ada error dari Supabase, lempar pesan error spesifiknya
      if (error) {
        throw new Error(error.message || "Gagal menyimpan data ke Supabase.");
      }

      setSuccessMessage(true);

      if (onSubmitSuccess) {
        onSubmitSuccess();
      }

      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (err: unknown) {
      // Ambil pesan error dengan aman
      const message =
        err instanceof Error
          ? err.message
          : typeof err === "object" && err !== null && "message" in err
          ? String((err as { message: unknown }).message)
          : "Terjadi kesalahan saat mengirim jadwal survei.";

      console.error("Gagal mengirim survei:", message, err);
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      {/* Container Modal */}
      <div className="relative flex w-full max-w-lg max-h-[90vh] flex-col rounded-3xl bg-white shadow-2xl overflow-hidden">
        
        {/* HEADER MODAL */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 bg-white sticky top-0 z-10 shrink-0">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Jadwalkan Survei</h2>
            <p className="text-xs font-medium text-gray-500 truncate max-w-70[280px] sm:max-w-xs">
              {propertyTitle}
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* ISI FORM */}
        <div className="flex-1 overflow-y-auto p-6">
          {successMessage ? (
            <div className="flex flex-col items-center justify-center py-8 text-center space-y-3">
              <CheckCircle2 className="h-12 w-12 text-emerald-600 animate-bounce" />
              <h4 className="text-base font-bold text-gray-900">
                Berhasil Mengirim Jadwal Survei!
              </h4>
              <p className="text-xs text-gray-500">
                Permintaan Anda sedang diproses. Tim kami akan segera menghubungi Anda.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Notifikasi Error */}
              {errorMsg && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-700">
                  ⚠️ {errorMsg}
                </div>
              )}

              {/* Nama Lengkap */}
              <div>
                <label className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-gray-700">
                  <User className="h-3.5 w-3.5 text-amber-600" />
                  Nama Lengkap <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  disabled={loading}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Contoh: Juan"
                  className="w-full rounded-xl border border-gray-200 px-3.5 py-2 text-xs text-gray-900 focus:border-amber-500 focus:outline-none"
                />
              </div>

              {/* WhatsApp & Email */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-gray-700">
                    <Phone className="h-3.5 w-3.5 text-amber-600" />
                    WhatsApp <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    disabled={loading}
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="085717312516"
                    className="w-full rounded-xl border border-gray-200 px-3.5 py-2 text-xs text-gray-900 focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-gray-700">
                    <Mail className="h-3.5 w-3.5 text-amber-600" />
                    Email (Opsional)
                  </label>
                  <input
                    type="email"
                    disabled={loading}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="w-full rounded-xl border border-gray-200 px-3.5 py-2 text-xs text-gray-900 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Tanggal & Waktu Survei */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-gray-700">
                    <Calendar className="h-3.5 w-3.5 text-amber-600" />
                    Tanggal Survei <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    disabled={loading}
                    value={surveyDate}
                    onChange={(e) => setSurveyDate(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-3.5 py-2 text-xs text-gray-900 focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-gray-700">
                    <Clock className="h-3.5 w-3.5 text-amber-600" />
                    Waktu Survei <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="time"
                    required
                    disabled={loading}
                    value={surveyTime}
                    onChange={(e) => setSurveyTime(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-3.5 py-2 text-xs text-gray-900 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Jumlah Orang */}
              <div>
                <label className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-gray-700">
                  <Users className="h-3.5 w-3.5 text-amber-600" />
                  Jumlah Orang
                </label>
                <input
                  type="number"
                  min="1"
                  disabled={loading}
                  value={numPeople}
                  onChange={(e) => setNumPeople(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-3.5 py-2 text-xs text-gray-900 focus:border-amber-500 focus:outline-none"
                />
              </div>

              {/* Catatan Tambahan */}
              <div>
                <label className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-gray-700">
                  <FileText className="h-3.5 w-3.5 text-amber-600" />
                  Catatan Tambahan (Opsional)
                </label>
                <textarea
                  rows={2}
                  disabled={loading}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Contoh: Saya pakai mobil"
                  className="w-full rounded-xl border border-gray-200 px-3.5 py-2 text-xs text-gray-900 focus:border-amber-500 focus:outline-none"
                />
              </div>

              {/* Tombol Submit */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-amber-600 py-3 text-xs font-bold text-white shadow-md transition hover:bg-amber-700 active:scale-98 disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Mengirim Jadwal...
                    </>
                  ) : (
                    "Kirim Jadwal Survei"
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}