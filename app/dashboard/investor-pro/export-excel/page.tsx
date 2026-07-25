import { RoleGuard } from "@/components/auth/RoleGuard";
import { FileSpreadsheet, Download, CheckCircle2 } from "lucide-react";

export default function ExportExcelPage() {
  return (
    <RoleGuard minRole="investor_pro">
      <div className="space-y-6 max-w-4xl mx-auto p-6">
        <div>
          <span className="bg-indigo-500/20 text-indigo-400 text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full border border-indigo-500/30 inline-block mb-3">Data Center</span>
          <h1 className="text-3xl font-extrabold font-heading text-white">Export Portfolio to Excel</h1>
          <p className="text-xs text-slate-400 mt-1">Unduh laporan keuangan, cashflow, dan rekapitulasi investasi Anda dalam format spreadsheet (.xlsx).</p>
        </div>

        <div className="bg-[#1C2541]/70 border border-slate-800 p-8 rounded-3xl backdrop-blur-xl space-y-6 text-center">
          <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto text-emerald-400">
            <FileSpreadsheet className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-white">Siap Mengunduh Data Portofolio</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">File spreadsheet akan mencakup rincian unit, yield sewa bulanan, riwayat capital gain, serta proyeksi pajak.</p>
          </div>
          <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-2 shadow-lg shadow-emerald-600/20">
            <Download className="w-4 h-4" />
            <span>Generate & Download .XLSX</span>
          </button>
        </div>
      </div>
    </RoleGuard>
  );
}