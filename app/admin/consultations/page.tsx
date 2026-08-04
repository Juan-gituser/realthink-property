"use client";

import { MessageSquare, Calendar, Phone, CheckCircle2, Clock, User } from "lucide-react";

export default function AdminConsultationsPage() {
  const consultations = [
    { id: "1", client: "Budi Santoso", topic: "Konsultasi KPR & Legalitas", date: "02 Agu 2026", time: "10:00 WIB", status: "PENDING", phone: "08123456789" },
    { id: "2", client: "Siti Rahma", topic: "Sesi Tanya Jawab Smart Buyer", date: "03 Agu 2026", time: "14:00 WIB", status: "CONFIRMED", phone: "08987654321" },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-xs">
        <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">
          <MessageSquare className="h-3.5 w-3.5" /> Layanan Konsultasi
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Jadwal Konsultasi Klien</h1>
        <p className="mt-0.5 text-xs text-gray-500">Daftar permintaan sesi diskusi properti dan konsultasi keuangan.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {consultations.map((item) => (
          <div key={item.id} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs transition hover:border-amber-200">
            <div className="flex items-center justify-between">
              <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                item.status === "CONFIRMED" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-amber-50 text-amber-700 border border-amber-200"
              }`}>
                {item.status === "CONFIRMED" ? "Terjadwal" : "Menunggu Konfirmasi"}
              </span>
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <Calendar className="h-3.5 w-3.5" /> {item.date} • {item.time}
              </span>
            </div>
            <h3 className="mt-3 font-bold text-gray-900 flex items-center gap-2">
              <User className="h-4 w-4 text-amber-500" /> {item.client}
            </h3>
            <p className="mt-1 text-xs text-gray-600">{item.topic}</p>
            <div className="mt-4 flex items-center gap-2 border-t border-gray-100 pt-3">
              <a href={`https://wa.me/${item.phone}`} target="_blank" className="flex items-center gap-1 rounded-xl bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100">
                <Phone className="h-3.5 w-3.5" /> Hubungi via WA
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}