import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CallToAction() {
  return (
    <section className="container mx-auto px-4">
      <div className="bg-primary rounded-2xl p-8 md:p-12 text-white text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-8 shadow-2xl">
        <div className="space-y-3 max-w-2xl">
          <h2 className="text-3xl font-bold text-white">Ingin Menjual atau Menyewakan Properti Anda?</h2>
          <p className="text-gray-300">
            Titipkan listing properti Anda pada Belijon Property. Dapatkan paparan calon pembeli potensial lebih cepat.
          </p>
        </div>
        <Link
          href="/dashboard"
          className="bg-secondary hover:bg-secondary/90 text-white font-semibold px-8 py-4 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap shadow-lg shadow-secondary/20"
        >
          Titip Properti Sekarang <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </section>
  );
}