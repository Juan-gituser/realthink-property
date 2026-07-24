export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-extrabold font-heading text-primary mb-2">Syarat & Ketentuan</h1>
      <p className="text-sm text-muted-foreground mb-8">Terakhir diperbarui: 24 Juli 2026</p>

      <div className="space-y-6 text-slate-700 text-sm leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-primary font-heading">1. Ketentuan Umum</h2>
          <p>
            Selamat datang di Realthink Property ("Platform"). Dengan mengakses, mendaftar, atau menggunakan situs web dan layanan kami, Anda menyatakan bahwa Anda telah membaca, memahami, dan menyetujui untuk terikat dengan Syarat & Ketentuan ini. Jika Anda tidak menyetujui bagian dari ketentuan ini, mohon untuk tidak menggunakan layanan kami.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-primary font-heading">2. Pendaftaran Akun</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Anda harus berusia minimal 17 tahun atau memiliki kapasitas hukum yang sah untuk membuat akun di Realthink.</li>
            <li>Anda wajib memberikan informasi yang akurat, terkini, dan lengkap saat melakukan pendaftaran.</li>
            <li>Anda bertanggung jawab penuh atas kerahasiaan akun dan kata sandi (password) serta semua aktivitas yang terjadi di bawah akun Anda.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-primary font-heading">3. Layanan Platform Realthink</h2>
          <p>
            Realthink menyediakan platform informasi listing properti, kalkulator KPR cerdas, data pasar, dan rekomendasi eksklusif. Seluruh informasi mengenai properti disediakan oleh agen, pengembang, atau mitra terpercaya kami. Walaupun kami berupaya menyajikan data seakurat mungkin, Realthink tidak menjamin keakuratan mutlak atas spesifikasi, harga, atau ketersediaan properti pihak ketiga.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-primary font-heading">4. Hak Kekayaan Intelektual</h2>
          <p>
            Seluruh konten, fitur, desain, logo, grafik, dan kode sumber pada platform Realthink adalah milik eksklusif Realthink Property dan dilindungi oleh undang-undang Hak Kekayaan Intelektual yang berlaku di Indonesia. Dilarang keras menyalin, memodifikasi, atau mendistribusikan konten tanpa izin tertulis dari kami.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-primary font-heading">5. Batasan Tanggung Jawab</h2>
          <p>
            Realthink tidak bertanggung jawab atas kerugian finansial, sengketa transaksi, atau kerusakan langsung maupun tidak langsung yang timbul akibat interaksi antara pengguna dengan agen, pengembang, atau pihak ketiga lainnya yang terhubung melalui platform ini.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-primary font-heading">6. Perubahan Ketentuan</h2>
          <p>
            Realthink berhak mengubah atau memperbarui Syarat & Ketentuan ini sewaktu-waktu tanpa pemberitahuan sebelumnya. Perubahan akan berlaku efektif setelah dipublikasikan di halaman ini.
          </p>
        </section>
      </div>
    </div>
  );
}