"use client";

import { useEffect, useState, useCallback, startTransition } from "react";
import { supabase } from "@/lib/supabase";
import {
  Calendar,
  Clock,
  Users,
  Phone,
  Mail,
  CheckCircle2,
  XCircle,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

interface SurveyItem {
  id: string;
  property_title: string;
  full_name: string;
  whatsapp: string;
  email: string;
  survey_date: string;
  survey_time: string;
  num_people: number;
  notes: string;
  status: string;
  created_at: string;
}

export default function AdminSurveysPage() {
  const [surveys, setSurveys] = useState<SurveyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("ALL");

  const fetchSurveys = useCallback(async () => {
    let query = supabase
      .from("property_surveys")
      .select("*")
      .order("created_at", { ascending: false });

    if (filterStatus !== "ALL") {
      query = query.eq("status", filterStatus);
    }

    const { data, error } = await query;
    
    // Membungkus state setter dalam startTransition untuk menghindari cascading renders
    startTransition(() => {
      if (error) {
        console.error("Error fetching surveys:", error);
      } else {
        setSurveys(data || []);
      }
      setLoading(false);
    });
  }, [filterStatus]);

  useEffect(() => {
    fetchSurveys();
  }, [fetchSurveys]);

  const updateStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase
      .from("property_surveys")
      .update({ status: newStatus })
      .eq("id", id);

    if (error) {
      alert("Gagal memperbarui status: " + error.message);
    } else {
      fetchSurveys();
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Menunggu":
        return (
          <span className="flex w-fit items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-semibold text-amber-700">
            <AlertCircle className="h-3 w-3" /> Menunggu
          </span>
        );
      case "Dikonfirmasi":
        return (
          <span className="flex w-fit items-center gap-1 rounded-full bg-blue-100 px-2.5 py-1 text-[11px] font-semibold text-blue-700">
            <CheckCircle2 className="h-3 w-3" /> Dikonfirmasi
          </span>
        );
      case "Selesai":
        return (
          <span className="flex w-fit items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
            <CheckCircle2 className="h-3 w-3" /> Selesai
          </span>
        );
      case "Dibatalkan":
        return (
          <span className="flex w-fit items-center gap-1 rounded-full bg-red-100 px-2.5 py-1 text-[11px] font-semibold text-red-700">
            <XCircle className="h-3 w-3" /> Dibatalkan
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="font-heading text-2xl font-bold text-gray-900">
            Kelola Permintaan Survei
          </h1>
          <p className="text-xs text-gray-500">
            Daftar calon klien yang menjadwalkan kunjungan properti.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="rounded-xl border bg-white px-3 py-2 text-xs font-semibold text-gray-900 outline-none focus:ring-1 focus:ring-amber-500"
          >
            <option value="ALL">Semua Status</option>
            <option value="Menunggu">Menunggu</option>
            <option value="Dikonfirmasi">Dikonfirmasi</option>
            <option value="Selesai">Selesai</option>
            <option value="Dibatalkan">Dibatalkan</option>
          </select>
          <button
            onClick={fetchSurveys}
            className="cursor-pointer rounded-xl border bg-white p-2 text-gray-600 transition hover:bg-gray-50"
            title="Refresh Data"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs text-gray-500">Memuat data survei...</div>
      ) : surveys.length === 0 ? (
        <div className="rounded-2xl border bg-white p-8 text-center text-xs text-gray-500">
          Belum ada permintaan survei yang ditemukan.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {surveys.map((survey) => (
            <div
              key={survey.id}
              className="space-y-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              <div className="flex flex-col justify-between gap-2 border-b pb-3 md:flex-row md:items-center">
                <div>
                  <span className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                    Properti
                  </span>
                  <h4 className="font-heading text-sm font-bold text-gray-900">
                    {survey.property_title}
                  </h4>
                </div>
                <div>{getStatusBadge(survey.status)}</div>
              </div>

              <div className="grid grid-cols-1 gap-4 text-xs md:grid-cols-3">
                <div className="space-y-1">
                  <p className="font-semibold text-gray-400">Pengunjung:</p>
                  <p className="text-sm font-bold text-gray-900">{survey.full_name}</p>
                  <p className="flex items-center gap-1.5 text-gray-600">
                    <Phone className="h-3.5 w-3.5 text-emerald-600" /> {survey.whatsapp}
                  </p>
                  {survey.email && (
                    <p className="flex items-center gap-1.5 text-gray-600">
                      <Mail className="h-3.5 w-3.5 text-blue-600" /> {survey.email}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <p className="font-semibold text-gray-400">Jadwal Kunjungan:</p>
                  <p className="flex items-center gap-1.5 font-semibold text-gray-800">
                    <Calendar className="h-3.5 w-3.5 text-amber-600" /> {survey.survey_date}
                  </p>
                  <p className="flex items-center gap-1.5 font-semibold text-gray-800">
                    <Clock className="h-3.5 w-3.5 text-amber-600" /> {survey.survey_time}
                  </p>
                  <p className="flex items-center gap-1.5 text-gray-600">
                    <Users className="h-3.5 w-3.5 text-amber-600" /> {survey.num_people} Orang
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="font-semibold text-gray-400">Catatan:</p>
                  <p className="min-h-12.5[50px] rounded-xl border border-gray-100 bg-gray-50 p-2.5 text-gray-600">
                    {survey.notes || "-"}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 border-t pt-2">
                <span className="text-[11px] text-gray-400">
                  Dibuat pada: {new Date(survey.created_at).toLocaleString("id-ID")}
                </span>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-gray-700">Ubah Status:</span>
                  <select
                    value={survey.status}
                    onChange={(e) => updateStatus(survey.id, e.target.value)}
                    className="cursor-pointer rounded-lg border bg-white px-2.5 py-1.5 text-xs font-semibold text-gray-900 outline-none focus:ring-1 focus:ring-amber-500"
                  >
                    <option value="Menunggu">Menunggu</option>
                    <option value="Dikonfirmasi">Dikonfirmasi</option>
                    <option value="Selesai">Selesai</option>
                    <option value="Dibatalkan">Dibatalkan</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}