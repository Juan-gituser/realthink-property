"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Calendar, Clock, Users, Phone, Mail, CheckCircle2, XCircle, AlertCircle, RefreshCw } from "lucide-react";

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

  const fetchSurveys = async () => {
    setLoading(true);
    let query = supabase.from("property_surveys").select("*").order("created_at", { ascending: false });
    
    if (filterStatus !== "ALL") {
      query = query.eq("status", filterStatus);
    }

    const { data, error } = await query;
    if (error) {
      console.error("Error fetching surveys:", error);
    } else {
      setSurveys(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSurveys();
  }, [filterStatus]);

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
        return <span className="bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full text-[11px] font-semibold flex items-center gap-1 w-fit"><AlertCircle className="w-3 h-3"/> Menunggu</span>;
      case "Dikonfirmasi":
        return <span className="bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full text-[11px] font-semibold flex items-center gap-1 w-fit"><CheckCircle2 className="w-3 h-3"/> Dikonfirmasi</span>;
      case "Selesai":
        return <span className="bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full text-[11px] font-semibold flex items-center gap-1 w-fit"><CheckCircle2 className="w-3 h-3"/> Selesai</span>;
      case "Dibatalkan":
        return <span className="bg-red-100 text-red-700 px-2.5 py-1 rounded-full text-[11px] font-semibold flex items-center gap-1 w-fit"><XCircle className="w-3 h-3"/> Dibatalkan</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-gray-900">Kelola Permintaan Survei</h1>
          <p className="text-xs text-gray-500">Daftar calon klien yang menjadwalkan kunjungan properti.</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border rounded-xl text-xs font-semibold bg-white outline-none focus:ring-1 focus:ring-amber-500 text-gray-900"
          >
            <option value="ALL">Semua Status</option>
            <option value="Menunggu">Menunggu</option>
            <option value="Dikonfirmasi">Dikonfirmasi</option>
            <option value="Selesai">Selesai</option>
            <option value="Dibatalkan">Dibatalkan</option>
          </select>
          <button
            onClick={fetchSurveys}
            className="p-2 border rounded-xl bg-white hover:bg-gray-50 text-gray-600 transition cursor-pointer"
            title="Refresh Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-xs text-gray-500">Memuat data survei...</div>
      ) : surveys.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl border text-center text-xs text-gray-500">
          Belum ada permintaan survei yang ditemukan.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {surveys.map((survey) => (
            <div key={survey.id} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b pb-3">
                <div>
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Properti</span>
                  <h4 className="font-heading font-bold text-sm text-gray-900">{survey.property_title}</h4>
                </div>
                <div>{getStatusBadge(survey.status)}</div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="space-y-1">
                  <p className="text-gray-400 font-semibold">Pengunjung:</p>
                  <p className="font-bold text-gray-900 text-sm">{survey.full_name}</p>
                  <p className="flex items-center gap-1.5 text-gray-600"><Phone className="w-3.5 h-3.5 text-emerald-600"/> {survey.whatsapp}</p>
                  {survey.email && <p className="flex items-center gap-1.5 text-gray-600"><Mail className="w-3.5 h-3.5 text-blue-600"/> {survey.email}</p>}
                </div>

                <div className="space-y-1">
                  <p className="text-gray-400 font-semibold">Jadwal Kunjungan:</p>
                  <p className="flex items-center gap-1.5 font-semibold text-gray-800"><Calendar className="w-3.5 h-3.5 text-amber-600"/> {survey.survey_date}</p>
                  <p className="flex items-center gap-1.5 font-semibold text-gray-800"><Clock className="w-3.5 h-3.5 text-amber-600"/> {survey.survey_time}</p>
                  <p className="flex items-center gap-1.5 text-gray-600"><Users className="w-3.5 h-3.5 text-amber-600"/> {survey.num_people} Orang</p>
                </div>

                <div className="space-y-1">
                  <p className="text-gray-400 font-semibold">Catatan:</p>
                  <p className="text-gray-600 bg-gray-50 p-2.5 rounded-xl border border-gray-100 min-h-12.5[50px]">
                    {survey.notes || "-"}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t flex flex-wrap items-center justify-between gap-2">
                <span className="text-[11px] text-gray-400">
                  Dibuat pada: {new Date(survey.created_at).toLocaleString("id-ID")}
                </span>
                
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-gray-700">Ubah Status:</span>
                  <select
                    value={survey.status}
                    onChange={(e) => updateStatus(survey.id, e.target.value)}
                    className="px-2.5 py-1.5 border rounded-lg text-xs font-semibold bg-white outline-none focus:ring-1 focus:ring-amber-500 text-gray-900 cursor-pointer"
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