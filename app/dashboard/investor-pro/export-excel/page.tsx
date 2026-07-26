import { RoleGuard } from "@/components/auth/RoleGuard";
import { FileSpreadsheet, Download, CheckCircle2 } from "lucide-react";

export default function ExportExcelPage() {
  return (
    <RoleGuard minRole="investor_pro">
      <div className="mx-auto max-w-4xl space-y-6 p-6">
        <div>
          <span className="mb-3 inline-block rounded-full border border-indigo-500/30 bg-indigo-500/20 px-3 py-1 text-[10px] font-bold tracking-widest text-indigo-400 uppercase">
            Data Center
          </span>
          <h1 className="font-heading text-3xl font-extrabold text-white">
            Export Portfolio to Excel
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            Unduh laporan keuangan, cashflow, dan rekapitulasi investasi Anda dalam format
            spreadsheet (.xlsx).
          </p>
        </div>

        <div className="space-y-6 rounded-3xl border border-slate-800 bg-[#1C2541]/70 p-8 text-center backdrop-blur-xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
            <FileSpreadsheet className="h-8 w-8" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-white">Siap Mengunduh Data Portofolio</h3>
            <p className="mx-auto max-w-md text-xs text-slate-400">
              File spreadsheet akan mencakup rincian unit, yield sewa bulanan, riwayat capital gain,
              serta proyeksi pajak.
            </p>
          </div>
          <button className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-xs font-bold text-white shadow-lg shadow-emerald-600/20 transition-colors hover:bg-emerald-500">
            <Download className="h-4 w-4" />
            <span>Generate & Download .XLSX</span>
          </button>
        </div>
      </div>
    </RoleGuard>
  );
}
