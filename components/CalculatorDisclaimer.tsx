export default function CalculatorDisclaimer() {
  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-4 text-sm text-amber-900">
      <p className="font-semibold">Catatan penting</p>
      <p className="mt-1 leading-relaxed">
        Hasil perhitungan di bawah ini hanya simulasi kasar berdasarkan asumsi umum dan standar
        yang sering dipakai di Indonesia. Nilai aktual bisa berbeda tergantung lokasi, jenis
        properti, kebijakan bank/notaris, serta aturan terbaru yang berlaku.
      </p>
    </div>
  );
}
