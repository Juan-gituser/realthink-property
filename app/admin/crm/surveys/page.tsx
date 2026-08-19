"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Calendar,
  Clock,
  Search,
  Building2,
  User,
  Phone,
  AlertCircle,
  RefreshCw,
  X,
  ChevronRight,
  Send,
} from "lucide-react";

export type SurveyStatus =
  | "SCHEDULED"
  | "CONFIRMED"
  | "COMPLETED"
  | "RESCHEDULED"
  | "CANCELLED"
  | "NO_SHOW";

interface LeadData {
  id: string;
  lead_id: string;
  name: string;
  whatsapp: string;
  email?: string;
  status: string;
}

interface PropertyData {
  id: string;
  title: string;
  price: number;
  address?: string;
}

interface SurveyItem {
  id: string;
  lead_id: string;
  property_id: string;
  property_title?: string;
  survey_date: string;
  status: SurveyStatus;
  assigned_to?: string;
  notes?: string;
  feedback?: string;
  created_at: string;
  leads?: LeadData;
  properties?: PropertyData;
}

const STATUS_BADGES: Record<
  SurveyStatus,
  { label: string; bg: string; text: string; border: string }
> = {
  SCHEDULED: { label: "SCHEDULED", bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  CONFIRMED: { label: "CONFIRMED", bg: "bg-teal-50", text: "text-teal-700", border: "border-teal-200" },
  COMPLETED: { label: "COMPLETED", bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  RESCHEDULED: { label: "RESCHEDULED", bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
  CANCELLED: { label: "CANCELLED", bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200" },
  NO_SHOW: { label: "NO SHOW", bg: "bg-gray-100", text: "text-gray-700", border: "border-gray-300" },
};

export default function AdminCRMSurveysPage() {
  const [surveys, setSurveys] = useState<SurveyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter & Search
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Drawer / Modal State
  const [selectedSurveyId, setSelectedSurveyId] = useState<string | null>(null);

  // Fetch Daftar Survey
  const fetchSurveys = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (statusFilter) params.set("status", statusFilter);

      const res = await fetch(`/api/admin/crm/surveys?${params.toString()}`);

      if (!res.ok) {
        throw new Error(`Gagal memuat data (HTTP ${res.status})`);
      }

      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Respon server bukan format JSON valid.");
      }

      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Gagal mengambil data survey");

      setSurveys(data.data || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan sistem");
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchSurveys();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [fetchSurveys]);

  // Quick Status Update (Direct PATCH)
  const handleQuickStatusChange = async (surveyId: string, newStatus: SurveyStatus) => {
    try {
      const res = await fetch(`/api/admin/crm/surveys/${surveyId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error);

      // Update State Lokal
      setSurveys((prev) =>
        prev.map((item) => (item.id === surveyId ? { ...item, status: newStatus } : item))
      );
      
      alert("Status survey berhasil diperbarui!");
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Gagal memperbarui status survey");
    }
  };

  const formatRupiah = (val?: number) => {
    if (!val) return "-";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col justify-between gap-4 rounded-3xl border border-gray-200 bg-white p-6 shadow-xs sm:flex-row sm:items-center">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">
            <Calendar className="h-3.5 w-3.5" /> Survey & Visit Schedule
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Jadwal Survey Properti</h1>
          <p className="mt-0.5 text-xs text-gray-500">
            Pantau dan kelola konfirmasi, hasil kunjungan, serta penjadwalan ulang survey lokasi buyer.
          </p>
        </div>
        <button
          onClick={fetchSurveys}
          className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-bold text-gray-700 shadow-xs transition hover:bg-gray-50"
        >
          <RefreshCw className="h-4 w-4" /> Refresh Data
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-xs sm:items-center">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Cari nama buyer, ID Lead, atau nama properti..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-gray-200 pl-10 pr-4 py-2 text-xs focus:border-amber-500 focus:outline-none"
          />
        </div>

        <div className="w-full sm:w-60 shrink-0">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full rounded-xl border border-gray-200 pl-3 pr-8 py-2 text-xs text-gray-700 focus:border-amber-500 focus:outline-none cursor-pointer bg-white"
          >
            <option value="">Semua Status Survey</option>
            {Object.keys(STATUS_BADGES).map((st) => (
              <option key={st} value={st}>
                {STATUS_BADGES[st as SurveyStatus].label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabel Data Survey */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xs">
        {loading ? (
          <div className="p-12 text-center text-xs text-gray-400">Memuat jadwal survey...</div>
        ) : error ? (
          <div className="flex items-center justify-center gap-2 p-8 text-xs text-rose-500">
            <AlertCircle className="h-4 w-4" /> {error}
          </div>
        ) : surveys.length === 0 ? (
          <div className="p-12 text-center text-xs text-gray-500">
            Belum ada data survey yang ditemukan.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-gray-200 bg-gray-50 font-semibold uppercase text-gray-500">
                <tr>
                  <th className="px-5 py-4">Waktu Survey</th>
                  <th className="px-4 py-4">Buyer / Lead</th>
                  <th className="px-4 py-4">Properti Unit</th>
                  <th className="px-4 py-4">Status</th>
                  <th className="px-4 py-4">Petugas</th>
                  <th className="px-5 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {surveys.map((survey) => {
                  const badge = STATUS_BADGES[survey.status] || STATUS_BADGES.SCHEDULED;

                  return (
                    <tr key={survey.id} className="hover:bg-gray-50/60 transition">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5 font-bold text-amber-700 text-xs">
                          <Calendar className="h-3.5 w-3.5" />
                          {survey.survey_date
                            ? new Date(survey.survey_date).toLocaleDateString("id-ID", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })
                            : "-"}
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-gray-500 mt-0.5">
                          <Clock className="h-3 w-3" />
                          {survey.survey_date
                            ? new Date(survey.survey_date).toLocaleTimeString("id-ID", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "-"}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="font-bold text-gray-900 text-xs">
                          {survey.leads?.name || "Klien Tanpa Nama"}
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-500 text-[11px] mt-0.5">
                          <Phone className="h-3 w-3 text-emerald-600" /> {survey.leads?.whatsapp || "-"}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="font-semibold text-gray-800 text-xs flex items-center gap-1">
                          <Building2 className="h-3.5 w-3.5 text-amber-500" />
                          {survey.properties?.title || "Properti ID: " + survey.property_id}
                        </div>
                        <div className="text-[11px] font-mono text-gray-500 mt-0.5">
                          {formatRupiah(survey.properties?.price)}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <select
                          value={survey.status}
                          onChange={(e) =>
                            handleQuickStatusChange(survey.id, e.target.value as SurveyStatus)
                          }
                          className={`rounded-full border pl-2.5 pr-6 py-1 text-[10px] font-bold focus:outline-none cursor-pointer ${badge.bg} ${badge.text} ${badge.border}`}
                        >
                          {Object.keys(STATUS_BADGES).map((st) => (
                            <option key={st} value={st}>
                              {STATUS_BADGES[st as SurveyStatus].label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-4 text-gray-600 text-xs">
                        {survey.assigned_to ? (
                          <span className="inline-flex items-center gap-1">
                            <User className="h-3 w-3 text-gray-400" /> {survey.assigned_to}
                          </span>
                        ) : (
                          <span className="text-gray-400 italic">Belum ditugaskan</span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => setSelectedSurveyId(survey.id)}
                          className="inline-flex items-center gap-1 rounded-xl bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-700 hover:bg-amber-100 transition cursor-pointer"
                        >
                          Kelola <ChevronRight className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Drawer / Modal Detail & Update */}
      {selectedSurveyId && (
        <SurveyDetailDrawer
          surveyId={selectedSurveyId}
          onClose={() => setSelectedSurveyId(null)}
          onUpdated={fetchSurveys}
        />
      )}
    </div>
  );
}

/* ====================================================================
   SUB-COMPONENT: SURVEY DETAIL & UPDATE DRAWER
==================================================================== */
function SurveyDetailDrawer({
  surveyId,
  onClose,
  onUpdated,
}: {
  surveyId: string;
  onClose: () => void;
  onUpdated: () => void;
}) {
  const [detail, setDetail] = useState<SurveyItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [convertingToFollowUp, setConvertingToFollowUp] = useState(false);

  // Form edit states
  const [status, setStatus] = useState<SurveyStatus>("SCHEDULED");
  const [surveyDate, setSurveyDate] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [notes, setNotes] = useState("");
  const [feedback, setFeedback] = useState("");

  const fetchDetail = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/crm/surveys/${surveyId}`);
      if (!res.ok) return;
      const data = await res.json();
      if (data.success && data.data) {
        const item: SurveyItem = data.data;
        setDetail(item);
        setStatus(item.status);

        if (item.survey_date) {
          const datePart = item.survey_date.split("T")[0];
          // @ts-expect-error handling dynamic property from database
          const timePart = item.survey_time || "07:00"; 
          setSurveyDate(`${datePart}T${timePart}`);
        } else {
          setSurveyDate("");
        }

        setAssignedTo(item.assigned_to || "");
        setNotes(item.notes || "");
        setFeedback(item.feedback || "");
      }
    } catch (e) {
      console.error("Gagal memuat detail survey", e);
    } finally {
      setLoading(false);
    }
  }, [surveyId]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchDetail();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [fetchDetail]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let formattedDate = undefined;
    let formattedTime = undefined;
    if (surveyDate) {
      const parts = surveyDate.split("T");
      formattedDate = parts[0]; 
      if (parts[1]) {
        formattedTime = parts[1].length === 5 ? `${parts[1]}:00` : parts[1]; 
      }
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/admin/crm/surveys/${surveyId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          survey_date: formattedDate,
          survey_time: formattedTime,
          assigned_to: assignedTo,
          notes,
          feedback,
        }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Gagal memperbarui survey");

      alert("Data survey berhasil diperbarui!");
      await onUpdated();
      onClose();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Gagal memperbarui survey");
    } finally {
      setSubmitting(false);
    }
  };

  // Fungsi khusus untuk melempar / mencatat data ke modul Follow-Up
  const handleSendToFollowUp = async () => {
    if (!detail) return;

    // Coba ambil ID Lead yang sudah ada
    let finalLeadId = detail.lead_id || detail.leads?.id || null;

    setConvertingToFollowUp(true);

    try {
      // JIKA LEAD BELUM ADA, BUAT OTOMATIS
      if (!finalLeadId) {
        const confirmCreate = window.confirm(
          "Data survey ini belum terhubung dengan Lead/Buyer manapun di database.\n\n" +
          "Apakah Anda ingin sistem otomatis mendaftarkan klien ini sebagai Lead baru dan meneruskannya ke Follow-Up?"
        );
        
        if (!confirmCreate) {
          setConvertingToFollowUp(false);
          return; // Batal jika user tidak setuju
        }

        // 1A. Siapkan data untuk Lead baru
        const leadName = detail.leads?.name || "Klien Survey";
        const leadPhone = detail.leads?.whatsapp || "-";

        // 1B. Panggil API untuk membuat Lead baru
        const createLeadRes = await fetch("/api/admin/crm/leads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: leadName,
            whatsapp: leadPhone,
            status: "NEW", // Status default lead
            source: "Survey Location" 
          }),
        });

        const leadJson = await createLeadRes.json();
        
        // Ambil ID Lead yang baru dibuat (antisipasi format data object atau array)
        const newLeadId = leadJson.data?.id || (Array.isArray(leadJson.data) ? leadJson.data[0]?.id : null);

        if (!leadJson.success || !newLeadId) {
           throw new Error(leadJson.error || "Gagal mendaftarkan Lead baru di database.");
        }

        finalLeadId = newLeadId;

        // 1C. Update tabel Survey agar terikat permanen dengan Lead yang baru
        await fetch(`/api/admin/crm/surveys/${surveyId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          // Kirim lead_id baru untuk disimpan
          body: JSON.stringify({ lead_id: finalLeadId }),
        });
      }

      // 2. LANJUTKAN LEMPAR KE FOLLOW-UP (Disesuaikan dengan schedule_date & assigned_to)
      const nextDay = new Date();
      nextDay.setDate(nextDay.getDate() + 1);

      const payload = {
        lead_id: finalLeadId,
        survey_id: surveyId,
        schedule_date: `${nextDay.toISOString().split("T")[0]}T10:00:00`,
        notes: `Follow-up hasil survey unit: ${detail.properties?.title || "-"}. Catatan: ${feedback || notes || "Lanjutkan penawaran."}`,
        assigned_to: assignedTo || "Admin CRM",
        status: "PENDING",
      };

      const res = await fetch("/api/admin/crm/follow-ups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.success) {
        alert("Berhasil! Jadwal survey ini telah diteruskan ke daftar Follow-Up.");
        onUpdated(); // Me-refresh tabel di background agar status sinkron
        onClose();   // Tutup modal drawer
      } else {
        alert(`Gagal meneruskan ke follow-up: ${json.error || "Terjadi kesalahan di database."}`);
      }
    } catch (err) {
      console.error("Error pada handleSendToFollowUp:", err);
      alert(err instanceof Error ? err.message : "Terjadi kesalahan sistem saat mengirim data.");
    } finally {
      setConvertingToFollowUp(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-white shadow-2xl flex flex-col h-full overflow-hidden animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 bg-gray-50">
          <div>
            <span className="font-mono text-[10px] font-bold text-amber-600 uppercase">
              Detail Survey Location
            </span>
            <h2 className="text-base font-bold text-gray-900">
              {detail?.properties?.title || "Update Jadwal Survey"}
            </h2>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 text-gray-400 hover:bg-gray-200 cursor-pointer">
            <X className="h-5 w-5" />
          </button>
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs text-gray-400">Memuat detail survey...</div>
        ) : (
          <form onSubmit={handleUpdate} className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
            {/* Informational Cards */}
            <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-amber-900 text-xs">Informasi Buyer & Properti</h3>
                
                {/* Tombol Lempar ke Follow Up */}
                <button
                  type="button"
                  disabled={convertingToFollowUp}
                  onClick={handleSendToFollowUp}
                  className="inline-flex items-center gap-1 bg-amber-500 hover:bg-amber-600 text-white px-2.5 py-1 rounded-xl font-bold text-[10px] transition cursor-pointer disabled:opacity-50"
                >
                  <Send className="h-3 w-3" /> {convertingToFollowUp ? "Mengirim..." : "Lempar ke Follow-Up"}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-700">
                <div>
                  <span className="text-gray-400">Buyer:</span>{" "}
                  <p className="font-semibold text-gray-900">{detail?.leads?.name || "-"}</p>
                </div>
                <div>
                  <span className="text-gray-400">WhatsApp:</span>{" "}
                  <p className="font-semibold text-gray-900">{detail?.leads?.whatsapp || "-"}</p>
                </div>
                {detail?.properties?.address && (
                  <div className="col-span-2">
                    <span className="text-gray-400">Alamat Properti:</span>{" "}
                    <p className="font-semibold text-gray-900">{detail.properties.address}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Status Field */}
            <div>
              <label className="font-bold text-gray-700 block mb-1">Status Survey</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as SurveyStatus)}
                className="w-full rounded-xl border border-gray-200 pl-3 pr-8 py-2.5 text-xs font-semibold focus:border-amber-500 focus:outline-none bg-white cursor-pointer"
              >
                {Object.keys(STATUS_BADGES).map((st) => (
                  <option key={st} value={st}>
                    {STATUS_BADGES[st as SurveyStatus].label}
                  </option>
                ))}
              </select>
            </div>

            {/* Schedule Date & Time */}
            <div>
              <label className="font-bold text-gray-700 block mb-1">Jadwal / Re-Schedule Date</label>
              <input
                type="datetime-local"
                value={surveyDate}
                onChange={(e) => setSurveyDate(e.target.value)}
                className="w-full rounded-xl border border-gray-200 p-2.5 text-xs focus:border-amber-500 focus:outline-none"
              />
            </div>

            {/* Assigned Staff */}
            <div>
              <label className="font-bold text-gray-700 block mb-1">Petugas / Agen Pendamping</label>
              <input
                type="text"
                placeholder="Nama agen pendamping..."
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                className="w-full rounded-xl border border-gray-200 p-2.5 text-xs focus:border-amber-500 focus:outline-none"
              />
            </div>

            {/* Internal Notes */}
            <div>
              <label className="font-bold text-gray-700 block mb-1">Catatan Internal / Persiapan</label>
              <textarea
                rows={2}
                placeholder="Catatan seperti: Klien minta dijemput di stasiun..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full rounded-xl border border-gray-200 p-2.5 text-xs focus:border-amber-500 focus:outline-none"
              />
            </div>

            {/* Feedback / Hasil Survey */}
            <div>
              <label className="font-bold text-gray-700 block mb-1">Hasil & Feedback Klien</label>
              <textarea
                rows={3}
                placeholder="Feedback dari buyer setelah survey (misal: Suka dengan layout, pertimbangkan negosiasi harga)..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="w-full rounded-xl border border-gray-200 p-2.5 text-xs focus:border-amber-500 focus:outline-none"
              />
            </div>

            {/* Submit Action */}
            <div className="pt-4 border-t flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl px-4 py-2.5 font-bold text-gray-500 hover:bg-gray-100 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="rounded-xl bg-amber-500 px-5 py-2.5 font-bold text-white hover:bg-amber-600 transition cursor-pointer"
              >
                {submitting ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}