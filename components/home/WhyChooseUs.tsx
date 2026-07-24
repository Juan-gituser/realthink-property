"use client";

import { ShieldCheck, Zap, Calculator, Award } from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "Legalitas Terjamin",
    desc: "Setiap unit listing telah diverifikasi dokumen sertifikatnya.",
  },
  {
    icon: Zap,
    title: "Proses Cepat & Ringan",
    desc: "Platform responsif tanpa *lag* untuk pengalaman pencarian yang nyaman.",
  },
  {
    icon: Calculator,
    title: "Kalkulator KPR Akurat",
    desc: "Hitung estimasi angsuran, pajak BPHTB, dan notaris secara langsung.",
  },
  {
    icon: Award,
    title: "Tim Profesional",
    desc: "Didampingi agen berpengalaman dari konsultasi hingga serah terima.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="bg-primary/5 py-16">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-bold text-primary">Mengapa Realthink Property?</h2>
          <p className="text-muted-foreground mt-2">
            Kami berkomitmen memberikan standar pelayanan terbaik dalam bertransaksi properti.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {features.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className="bg-white p-6 rounded-xl border border-border text-center space-y-3">
                <div className="w-12 h-12 mx-auto rounded-lg bg-secondary/10 flex items-center justify-center text-secondary">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-lg text-primary">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}