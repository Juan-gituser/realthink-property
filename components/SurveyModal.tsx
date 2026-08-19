"use client";

import { useState, useEffect, FormEvent } from "react";
import {
  X,
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  FileText,
  CheckCircle2,
  Loader2,
} from "lucide-react";

interface SurveyEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  surveyId: string | null;
  onSubmitSuccess?: () => void;
}

export default function SurveyEditModal({
  isOpen,
  onClose,
  surveyId,
  onSubmitSuccess,
}: SurveyEditModalProps) {
  // Form State
  const [propertyTitle, setPropertyTitle] = useState("");
  const [buyerName, setBuyerName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("SCHEDULED");
  const [surveyDate, setSurveyDate] = useState("");
  const [notes, setNotes] = useState("");
  const [feedback, setFeedback] = useState("");

  // UI State
  const [fetching, setFetching] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMessage, setSuccessMessage] = useState(false);

  // Ambil detail data survey saat modal dibuka
  useEffect(() => {
    if (isOpen && surveyId) {
      fetchSurveyDetail();
    }
  }, [isOpen, surveyId]);

  const fetchSurveyDetail = async () => {
    try {
      setFetching(true);
      setErrorMsg("");
      const res = await fetch(`/api/admin/crm/surveys/${surveyId}`);
      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error || "Gagal memuat detail survey");
      }

      const data = json.data;
      setPropertyTitle(data.properties?.title || data.property_title || "Properti");
      setBuyerName(data.leads?.name || data.full_name || "");
      setWhatsapp(data.leads?.whatsapp || data.whatsapp || "");
      setEmail(data.leads?.email || data.email || "");
      setStatus(data.status || "SCHEDULED");
      
      // Format tanggal untuk input date (YYYY-MM-DD)
      if (data.survey_date) {
        const formattedDate = data.survey_date.split("T")[0];
        const timePart = data.survey_time ? data.survey_time.substring(0, 5) : "00:00";
        setSurveyDate(`${formattedDate}T${timePart}`);
      } else {
        setSurveyDate("");
      }

      setNotes(data.notes || "");
      setFeedback(data.feedback || "");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Terjadi kesalahan";
      setErrorMsg(message);
    } finally {
      setFetching(false);
    }
  };

  if (!isOpen) return null;

  const handleClose = () => {
    setSuccessMessage(false);
    setErrorMsg("");
    onClose();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const response = await fetch(`/api/admin/crm/surveys/${surveyId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          survey_date: surveyDate,
          notes,
          feedback,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Gagal memperbarui survey");
      }

      setSuccessMessage(true);

      // Trigger refresh data di tabel utama dan *Follow Up*
      if (onSubmitSuccess) {
        onSubmitSuccess();
      }

      // Tutup modal otomatis setelah 1.5 detik
      setTimeout(() => {
        handleClose();
      }, 1500);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Update survey failed";
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="relative flex w-full max-w-lg max-h-[90vh] flex-col rounded-3xl bg-white shadow-2xl overflow-hidden">
        
        {/* HEADER MODAL */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 bg-white sticky top-0 z-10 shrink-0">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Kelola Survei</h2>
            <p className="text-xs font-medium text-gray-500 truncate max-w-[280px] sm:max-w-xs">
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
          {fetching ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-2">
              <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
              <p className="text-xs text-gray-500">Memuat data...</p>
            </div>
          ) : successMessage ? (
            <div className="flex flex-col items-center justify-center py-8 text-center space-y-3">
              <CheckCircle2 className="h-12 w-12 text-emerald-600 animate-bounce" />
              <h4 className="text-base font-bold text-gray-900">
                Perubahan Berhasil Disimpan!
              </h4>
              <p className="text-xs text-gray-500">
                Data berhasil diperbarui dan tercatat ke sistem Follow Up.
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

              {/* Informasi Singkat Buyer */}
              <div className="rounded-2xl bg-amber-50/60 p-3 border border-amber-100 text-xs space-y-1">
                <p className="font-bold text-gray-900">Informasi Buyer & Kontak</p>
                <div className="text-gray-600 grid grid-cols-2 gap-1 pt-1">
                  <p>Nama: <span className="font-semibold text-gray-800">{buyerName || "-"}</span></p>
                  <p>WhatsApp: <span className="font-semibold text-gray-800">{whatsapp || "-"}</span></p>
                </div>
              </div>

              {/* Status Survey */}
              <div>
                <label className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-gray-700">
                  Status Survey
                </label>
                <select
                  disabled={loading}
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-3.5 py-2 text-xs text-gray-900 focus:border-amber-500 focus:outline-none bg-white"
                >
                  <option value="SCHEDULED">Scheduled / Menunggu</option>
                  <option value="CONFIRMED">Confirmed</option>
                  <option value="COMPLETED">Completed (Selesai)</option>
                  <option value="RESCHEDULED">Rescheduled</option>
                  <option value="CANCELLED">Cancelled</option>
                  <option value="NO_SHOW">No Show</option>
                </select>
              </div>

              {/* Tanggal & Waktu Survei */}
              <div>
                <label className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-gray-700">
                  <Calendar className="h-3.5 w-3.5 text-amber-600" />
                  Jadwal / Re-Schedule Date
                </label>
                <input
                  type="datetime-local"
                  disabled={loading}
                  value={surveyDate}
                  onChange={(e) => setSurveyDate(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-3.5 py-2 text-xs text-gray-900 focus:border-amber-500 focus:outline-none"
                />
              </div>

              {/* Catatan Internal */}
              <div>
                <label className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-gray-700">
                  <FileText className="h-3.5 w-3.5 text-amber-600" />
                  Catatan Internal / Persiapan
                </label>
                <textarea
                  rows={2}
                  disabled={loading}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Catatan tambahan untuk tim..."
                  className="w-full rounded-xl border border-gray-200 px-3.5 py-2 text-xs text-gray-900 focus:border-amber-500 focus:outline-none"
                />
              </div>

              {/* Hasil & Feedback Klien */}
              <div>
                <label className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-gray-700">
                  Hasil & Feedback Klien
                </label>
                <textarea
                  rows={2}
                  disabled={loading}
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Feedback dari buyer setelah survey (misal: Suka dengan layout, pertimbangkan negosiasi harga)..."
                  className="w-full rounded-xl border border-gray-200 px-3.5 py-2 text-xs text-gray-900 focus:border-amber-500 focus:outline-none"
                />
              </div>

              {/* Tombol Aksi */}
              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={loading}
                  className="flex-1 rounded-xl bg-gray-100 py-3 text-xs font-bold text-gray-600 hover:bg-gray-200 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 rounded-xl bg-amber-600 py-3 text-xs font-bold text-white shadow-md transition hover:bg-amber-700 active:scale-98 disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Menyimpan...
                    </>
                  ) : (
                    "Simpan Perubahan"
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