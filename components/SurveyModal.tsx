"use client";

import { useState, FormEvent } from "react";
import { X, Calendar, Clock, Users, User, Phone, Mail, FileText, CheckCircle2, Loader2 } from "lucide-react";
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
  const [fullName, setFullName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [surveyDate, setSurveyDate] = useState("");
  const [surveyTime, setSurveyTime] = useState("");
  const [numPeople, setNumPeople] = useState("1");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
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

      if (error) throw error;

      setSuccessMessage(true);

      if (onSubmitSuccess) {
        onSubmitSuccess();
      }

      setTimeout(() => {
        setSuccessMessage(false);
        onClose();
        setFullName("");
        setWhatsapp("");
        setEmail("");
        setSurveyDate("");
        setSurveyTime("");
        setNumPeople("1");
        setNotes("");
      }, 2500);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      alert("Gagal mengirim jadwal survei: " + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="h-5 w-5" />
        </button>

        <h3 className="mb-1 text-lg font-bold text-gray-900">
          Jadwalkan Survei
        </h3>
        <p className="mb-4 text-xs text-gray-500">{propertyTitle}</p>

        {successMessage ? (
          <div className="flex flex-col items-center justify-center py-10 text-center space-y-3">
            <CheckCircle2 className="h-12 w-12 text-green-600" />
            <h4 className="text-base font-bold text-gray-900">Berhasil Mengirim Jadwal Survei!</h4>
            <p className="text-xs text-gray-500">Permintaan Anda sedang diproses. Mohon tunggu sebentar.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 flex items-center gap-1.5 text-xs font-medium text-gray-700">
                <User className="h-3.5 w-3.5 text-amber-600" /> Nama Lengkap
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Masukkan nama lengkap Anda"
                className="w-full rounded-xl border border-gray-300 p-3 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 flex items-center gap-1.5 text-xs font-medium text-gray-700">
                  <Phone className="h-3.5 w-3.5 text-amber-600" /> WhatsApp
                </label>
                <input
                  type="text"
                  required
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="08123456789"
                  className="w-full rounded-xl border border-gray-300 p-3 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 flex items-center gap-1.5 text-xs font-medium text-gray-700">
                  <Mail className="h-3.5 w-3.5 text-amber-600" /> Email (Opsional)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@example.com"
                  className="w-full rounded-xl border border-gray-300 p-3 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 flex items-center gap-1.5 text-xs font-medium text-gray-700">
                  <Calendar className="h-3.5 w-3.5 text-amber-600" /> Tanggal Survei
                </label>
                <input
                  type="date"
                  required
                  value={surveyDate}
                  onChange={(e) => setSurveyDate(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 p-3 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 flex items-center gap-1.5 text-xs font-medium text-gray-700">
                  <Clock className="h-3.5 w-3.5 text-amber-600" /> Waktu Survei
                </label>
                <input
                  type="time"
                  required
                  value={surveyTime}
                  onChange={(e) => setSurveyTime(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 p-3 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 flex items-center gap-1.5 text-xs font-medium text-gray-700">
                <Users className="h-3.5 w-3.5 text-amber-600" /> Jumlah Orang
              </label>
              <input
                type="number"
                min="1"
                required
                value={numPeople}
                onChange={(e) => setNumPeople(e.target.value)}
                className="w-full rounded-xl border border-gray-300 p-3 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 flex items-center gap-1.5 text-xs font-medium text-gray-700">
                <FileText className="h-3.5 w-3.5 text-amber-600" /> Catatan Tambahan (Opsional)
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Tuliskan catatan khusus..."
                className="w-full rounded-xl border border-gray-300 p-3 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-600 py-3 text-sm font-bold text-white transition hover:bg-amber-700 disabled:opacity-50"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? "Mengirim..." : "Kirim Jadwal Survei"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}