export default function PrivacyPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <h1 className="font-heading text-primary mb-2 text-3xl font-extrabold">Kebijakan Privasi</h1>
      <p className="text-muted-foreground mb-8 text-sm">Terakhir diperbarui: 24 Juli 2026</p>

      <div className="space-y-6 text-sm leading-relaxed text-slate-700">
        <section className="space-y-2">
          <h2 className="text-primary font-heading text-lg font-bold">1. Pendahuluan</h2>
          <p>
            Realthink (&quot;Kami&quot;) berkomitmen untuk melindungi dan menghargai privasi Anda. Kebijakan
            Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, menyimpan, dan
            melindungi informasi pribadi Anda saat Anda mengakses platform kami.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-primary font-heading text-lg font-bold">
            2. Informasi yang Kami Kumpulkan
          </h2>
          <p>Kami dapat mengumpulkan jenis informasi berikut:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <strong>Informasi Identifikasi Pribadi:</strong> Nama lengkap, alamat email, nomor
              telepon, dan data akun yang Anda berikan saat mendaftar.
            </li>
            <li>
              <strong>Data Penggunaan & Aktivitas:</strong> Riwayat pencarian properti, properti
              favorit yang disimpan, serta interaksi Anda dengan fitur kalkulator KPR.
            </li>
            <li>
              <strong>Data Teknis:</strong> Alamat IP, jenis peramban (browser), perangkat yang
              digunakan, dan data log sistem secara otomatis.
            </li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-primary font-heading text-lg font-bold">3. Penggunaan Informasi</h2>
          <p>Informasi yang terkumpul digunakan untuk:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>Menyediakan, memelihara, dan meningkatkan kualitas layanan platform Realthink.</li>
            <li>Mempersonalisasi pengalaman Anda, termasuk rekomendasi properti yang relevan.</li>
            <li>
              Mengirimkan notifikasi penting terkait pembaruan akun, penurunan harga properti
              favorit, atau informasi promosi (jika Anda menyetujuinya).
            </li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-primary font-heading text-lg font-bold">4. Keamanan Data</h2>
          <p>
            Kami menerapkan langkah-langkah pengamanan teknis, administratif, dan fisik yang wajar
            untuk melindungi data pribadi Anda dari akses, pengungkapan, atau perubahan yang tidak
            sah. Namun, tidak ada metode transmisi internet yang 100% aman.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-primary font-heading text-lg font-bold">5. Hak Pengguna</h2>
          <p>
            Anda memiliki hak untuk mengakses, memperbarui, atau meminta penghapusan data pribadi
            Anda yang tersimpan di sistem kami dengan menghubungi layanan dukungan pelanggan
            Realthink.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-primary font-heading text-lg font-bold">6. Hubungi Kami</h2>
          <p>
            Jika Anda memiliki pertanyaan atau kekhawatiran terkait Kebijakan Privasi ini, silakan
            hubungi kami melalui email resmi di{" "}
            <span className="text-secondary font-semibold">support@realthink.id</span>.
          </p>
        </section>
      </div>
    </div>
  );
}