import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CallToAction() {
  return (
    <section className="container mx-auto px-4">
      <div className="bg-primary flex flex-col items-center justify-between gap-8 rounded-2xl p-8 text-center text-white shadow-2xl md:flex-row md:p-12 md:text-left">
        <div className="max-w-2xl space-y-3">
          <h2 className="text-3xl font-bold text-white">
            Ingin Menjual atau Menyewakan Properti Anda?
          </h2>
          <p className="text-gray-300">
            Titipkan listing properti Anda pada Realthink Property. Dapatkan paparan calon pembeli
            potensial lebih cepat.
          </p>
        </div>
        <Link
          href="/dashboard"
          className="bg-secondary hover:bg-secondary/90 shadow-secondary/20 flex items-center gap-2 rounded-xl px-8 py-4 font-semibold whitespace-nowrap text-white shadow-lg transition-all"
        >
          Titip Properti Sekarang <ArrowRight className="h-5 w-5" />
        </Link>
      </div>
    </section>
  );
}
