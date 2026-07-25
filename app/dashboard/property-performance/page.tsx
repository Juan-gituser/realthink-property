import { PropertyPerformanceTable } from "@/components/dashboard/property-performance/PropertyPerformanceTable";

export default function PropertyPerformancePage() {
  return (
    <div className="space-y-8">
      {/* Header Halaman */}
      <div>
        <h1 className="text-2xl font-extrabold font-heading text-white tracking-tight">Property Performance</h1>
        <p className="text-xs text-slate-400 mt-1">Pantau interaksi pasar, klik WhatsApp, dan conversion rate masing-masing unit secara real-time.</p>
      </div>

      {/* Tabel Performa Utama */}
      <PropertyPerformanceTable />
    </div>
  );
}