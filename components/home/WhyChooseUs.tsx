"use client";

import { ShieldCheck, Zap, Calculator, Award } from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "Verifikasi Dokumen",
    desc: "Setiap listing melalui tahap pengecekan kelengkapan berkas dan kejelasan legalitas.",
  },
  {
    icon: Zap,
    title: "Akses Informasi Praktis",
    desc: "Platform responsif yang dirancang untuk memudahkan pencarian properti Anda.",
  },
  {
    icon: Calculator,
    title: "Simulasi KPR Transparan",
    desc: "Bantu kalkulasi gambaran angsuran, estimasi BPHTB, serta estimasi biaya notaris.",
  },
  {
    icon: Award,
    title: "Pendampingan Transaksi",
    desc: "Tim agen kami siap memberikan konsultasi dan asistensi selama proses transaksi.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="bg-primary/5 py-16">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="text-primary text-3xl font-bold">Mengapa Realthink Property?</h2>
          <p className="text-muted-foreground mt-2">
            Kami hadir untuk membantu mempermudah dan mendampingi setiap langkah pencarian properti Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {features.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="border-border space-y-3 rounded-xl border bg-white p-6 text-center"
              >
                <div className="bg-secondary/10 text-secondary mx-auto flex h-12 w-12 items-center justify-center rounded-lg">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-primary text-lg font-semibold">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}