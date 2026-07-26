import { PropertyPerformanceTable } from "@/components/dashboard/property-performance/PropertyPerformanceTable";

export default function PropertyPerformancePage() {
  return (
    <div className="space-y-8">
      {/* Header Halaman */}
      <div>
        <h1 className="font-heading text-2xl font-extrabold tracking-tight text-white">
          Property Performance
        </h1>
        <p className="mt-1 text-xs text-slate-400">
          Pantau interaksi pasar, klik WhatsApp, dan conversion rate masing-masing unit secara
          real-time.
        </p>
      </div>

      {/* Tabel Performa Utama */}
      <PropertyPerformanceTable />
    </div>
  );
}
