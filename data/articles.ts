export interface ArticleItem {
  id: string;
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  author: string;
  date: string;
  imageUrl: string;
  description: string;
  content: string[];
  sources: Array<{ name: string; url: string }>;
}

export const ARTICLES: ArticleItem[] = [
  {
    id: "1",
    slug: "tips-membeli-rumah-pertama-milenial",
    title: "Tips Membeli Rumah Pertama untuk Generasi Milenial",
    category: "Panduan Properti",
    excerpt:
      "Panduan praktis membeli rumah pertama dengan strategi finansial, pemilihan lokasi, dan langkah aman sebelum booking.",
    author: "Tim Realthink",
    date: "20 Jul 2026",
    imageUrl:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80",
    description:
      "Membeli rumah pertama bukan sekadar mencari rumah yang menarik, tetapi juga memastikan keputusan finansial aman dan sesuai kebutuhan jangka panjang.",
    content: [
      "Membeli rumah pertama adalah momen penting yang sering kali disertai rasa bingung. Untuk menghindari keputusan yang terburu-buru, fokuslah pada tiga hal utama: kesiapan finansial, lokasi, dan tujuan kepemilikan jangka panjang.",
      "Sebelum memutuskan, pastikan Anda sudah memiliki simulasi cicilan yang realistis. Jangan hanya melihat kemampuan bayar saat ini, tetapi juga mempertimbangkan biaya lain seperti pajak, notaris, pemeliharaan, dan potensi kenaikan biaya hidup. Banyak pembeli yang terlalu fokus pada DP dan lupa bahwa biaya administrasi serta perawatan juga akan membebani anggaran bulanan.",
      "Pilih lokasi yang mendukung kebutuhan sehari-hari Anda, seperti akses ke tempat kerja, sekolah, fasilitas kesehatan, dan transportasi. Rumah yang strategis biasanya lebih mudah dijual kembali di masa depan karena kebutuhan pasar terhadap wilayah yang terhubung baik cenderung lebih tinggi.",
      "Bila masih ragu, bandingkan beberapa opsi properti dan gunakan kalkulator KPR serta estimasi biaya tambahan sebelum menandatangani surat pemesanan. Jika memungkinkan, lihat juga prospek perkembangan wilayah dalam 3 sampai 5 tahun ke depan agar properti yang Anda pilih tetap relevan.",
      "Yang tidak kalah penting adalah memastikan Anda benar-benar siap secara emosional. Membeli rumah bukan sekadar transaksi, tetapi komitmen jangka panjang terhadap tempat tinggal dan finansial keluarga.",
    ],
    sources: [
      { name: "Bank Indonesia", url: "https://www.bi.go.id" },
      { name: "Otoritas Jasa Keuangan", url: "https://www.ojk.go.id" },
    ],
  },
  {
    id: "2",
    slug: "memahami-biaya-pajak-bphtb-dan-notaris",
    title: "Memahami Biaya Pajak BPHTB dan Notaris dalam Transaksi Jual Beli",
    category: "Legal & Pajak",
    excerpt:
      "Pelajari biaya BPHTB, biaya notaris, dan biaya administrasi lain yang biasanya muncul saat transaksi properti.",
    author: "Tim Realthink",
    date: "18 Jul 2026",
    imageUrl:
      "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1200&q=80",
    description:
      "Biaya transaksi properti tidak hanya sebatas harga rumah. Ada sejumlah komponen lain yang perlu dipahami agar pembeli tidak kaget saat proses akad.",
    content: [
      "Dalam transaksi jual beli properti, pembeli biasanya perlu menyiapkan biaya tambahan selain harga rumah. Salah satu yang paling sering diperhatikan adalah BPHTB, yaitu pajak pembeli yang dihitung atas dasar transaksi. Tarif dan pengenaan pajaknya dapat berbeda tergantung nilai transaksi dan kebijakan daerah.",
      "Selain itu, ada biaya notaris dan PPAT untuk pembuatan akta jual beli, serta biaya balik nama sertifikat. Komponen ini penting karena bisa memengaruhi total dana yang harus disiapkan sebelum akad berlangsung.",
      "Untuk memperkirakan kebutuhan dana, Anda dapat menggunakan kalkulator pajak dan kalkulator notaris yang tersedia di situs ini sebagai gambaran awal. Hal ini membantu Anda menghindari kejutan finansial saat proses transaksi sudah berjalan.",
      "Karena setiap wilayah dan kasus transaksi bisa berbeda, hasil hitungan ini sebaiknya diperlakukan sebagai simulasi kasar, bukan acuan resmi. Untuk kepastian, Anda tetap disarankan berkonsultasi dengan notaris, PPAT, atau konsultan properti yang memahami aturan lokal.",
      "Memahami komponen biaya sejak awal juga membuat proses negosiasi menjadi lebih sehat, terutama saat Anda ingin memastikan bahwa harga yang disepakati benar-benar sesuai dengan total pengeluaran yang akan Anda tanggung.",
    ],
    sources: [
      { name: "Direktorat Jenderal Pajak", url: "https://www.pajak.go.id" },
      { name: "Kementerian ATR/BPN", url: "https://www.atrbpn.go.id" },
    ],
  },
  {
    id: "3",
    slug: "tren-desain-interior-rumah-minimalis-2026",
    title: "Tren Desain Interior Rumah Minimalis Modern Tahun 2026",
    category: "Inspirasi Desain",
    excerpt:
      "Simak tren warna, material, dan tata letak yang paling banyak dipilih untuk rumah minimalis modern di Indonesia.",
    author: "Tim Realthink",
    date: "15 Jul 2026",
    imageUrl:
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80",
    description:
      "Desain interior rumah minimalis modern terus berkembang dengan fokus pada kenyamanan, pencahayaan alami, dan fungsi ruang yang lebih optimal.",
    content: [
      "Tahun 2026, tren rumah minimalis modern cenderung menggabungkan kesederhanaan visual dengan nuansa hangat. Warna netral seperti putih gading, beige, dan cokelat muda masih sangat populer karena memberi kesan bersih, lega, dan tidak cepat usang.",
      "Material alami seperti kayu, batu alam, dan linen semakin sering digunakan untuk memberi kesan hangat tanpa menghilangkan nuansa modern. Penggabungan material ini membuat rumah terasa lebih nyaman dan personal.",
      "Ruang yang fungsional tetap menjadi prioritas. Penyimpanan tersembunyi, furniture multifungsi, dan pencahayaan yang baik membantu rumah terasa luas meski ukurannya tidak besar. Ini sangat penting terutama untuk rumah dengan lahan terbatas.",
      "Bagi pemilik rumah, merombak desain interior secara bertahap bisa menjadi pilihan yang lebih hemat dan fleksibel daripada renovasi besar-besaran. Strategi ini membantu Anda menyesuaikan estetika dengan kebutuhan rutinitas sehari-hari.",
      "Selain estetika, kenyamanan visual juga penting. Tata cahaya, tekstur, dan pemilihan furnitur yang tepat dapat membuat rumah terasa lebih hidup tanpa terasa penuh.",
    ],
    sources: [
      { name: "ArchDaily", url: "https://www.archdaily.com" },
      { name: "The Spruce", url: "https://www.thespruce.com" },
    ],
  },
  {
    id: "4",
    slug: "cara-memilih-lokasi-rumah-yang-pas",
    title: "Cara Memilih Lokasi Rumah yang Pas untuk Keluarga",
    category: "Panduan Properti",
    excerpt:
      "Faktor apa saja yang perlu dipertimbangkan saat memilih lokasi rumah agar nilainya tetap terjaga dari waktu ke waktu.",
    author: "Tim Realthink",
    date: "10 Jul 2026",
    imageUrl:
      "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1200&q=80",
    description:
      "Lokasi adalah salah satu faktor penentu nilai properti. Memilih lokasi yang tepat dapat membantu rumah tetap menarik untuk ditinggali maupun dijual kembali.",
    content: [
      "Saat memilih lokasi rumah, pertimbangkan akses ke tempat kerja, sekolah, pusat kesehatan, dan fasilitas umum. Konektivitas sangat memengaruhi kenyamanan sehari-hari serta efisiensi waktu perjalanan Anda.",
      "Perhatikan juga rencana pengembangan wilayah seperti pembangunan jalan baru, transportasi umum, dan fasilitas komersial. Wilayah yang berkembang sering kali memiliki prospek lebih baik karena daya tariknya cenderung meningkat dari waktu ke waktu.",
      "Jangan lupa mengecek kondisi lingkungan, kebisingan, potensi banjir, dan tata ruang sekitar. Detail kecil ini bisa berdampak besar pada kualitas hidup dan nilai properti, terutama saat Anda ingin menjual kembali di masa depan.",
      "Selain faktor teknis, lihat juga kualitas komunitas sekitar. Lingkungan yang aman, aktif, dan memiliki fasilitas sosial yang baik akan membuat rumah terasa lebih layak untuk ditinggali jangka panjang.",
    ],
    sources: [
      { name: "World Bank", url: "https://www.worldbank.org" },
      { name: "Badan Pusat Statistik", url: "https://www.bps.go.id" },
    ],
  },
  {
    id: "5",
    slug: "strategi-investasi-properti-untuk-pemula",
    title: "Strategi Investasi Properti untuk Pemula yang Aman",
    category: "Investasi",
    excerpt:
      "Panduan sederhana untuk pemula yang ingin mulai berinvestasi properti tanpa mengambil risiko yang terlalu besar.",
    author: "Tim Realthink",
    date: "8 Jul 2026",
    imageUrl:
      "https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=1200&q=80",
    description:
      "Investasi properti bisa dimulai dengan pendekatan yang hati-hati, terutama bagi pemula yang masih belajar memahami pasar.",
    content: [
      "Pemula sebaiknya mulai dengan mempelajari pasar lokal, tren harga, dan potensi pertumbuhan kawasan. Jangan terjebak dengan janji keuntungan instan atau tawaran yang terlalu bagus untuk menjadi kenyataan.",
      "Pilih properti yang memiliki nilai sewa atau potensi kenaikan harga jangka panjang. Lokasi yang dekat dengan pusat aktivitas biasanya lebih stabil, dan permintaan penyewa maupun pembeli cenderung konsisten.",
      "Jangan lupa menghitung semua biaya tambahan sebelum membeli, termasuk pajak, perawatan, biaya operasional, dan kemungkinan biaya renovasi. Keuntungan yang terlihat besar bisa lenyap bila biaya tersembunyi tidak diperhitungkan sejak awal.",
      "Investasi properti yang aman biasanya dibangun dari pemahaman pasar yang realistis, bukan dari rasa ingin cepat untung. Kesabaran dan perencanaan adalah kunci.",
    ],
    sources: [
      { name: "Bank Indonesia", url: "https://www.bi.go.id" },
      { name: "CEIC Data", url: "https://www.ceicdata.com" },
    ],
  },
  {
    id: "6",
    slug: "mengenal-jenis-kpr-dan-cara-memilih-yang-tepat",
    title: "Mengenal Jenis KPR dan Cara Memilih yang Tepat",
    category: "KPR & Keuangan",
    excerpt:
      "Pahami perbedaan KPR fixed, floating, dan syariah sebelum mengajukan kredit rumah.",
    author: "Tim Realthink",
    date: "5 Jul 2026",
    imageUrl:
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&q=80",
    description:
      "Jenis KPR yang berbeda punya karakteristik dan risiko yang berbeda, sehingga penting dipahami sebelum mengajukan pinjaman.",
    content: [
      "KPR fixed biasanya memberikan cicilan tetap untuk jangka waktu tertentu, sehingga lebih mudah diprediksi. Sementara KPR floating bisa berubah mengikuti suku bunga pasar, sehingga cicilan Anda dapat naik atau turun sesuai kondisi ekonomi.",
      "Untuk pembeli yang ingin stabilitas angsuran, skema fixed bisa terasa lebih aman. Namun untuk mereka yang ingin fleksibilitas dan bunga awal lebih rendah, floating bisa saja menarik jika mereka siap menghadapi perubahan suku bunga.",
      "Jika Anda ingin menilai kemampuan finansial, gunakan kalkulator KPR untuk melihat dampak bunga dan tenor terhadap cicilan bulanan. Jangan lupa mempertimbangkan juga pendapatan bulanan, kebutuhan tabungan, dan cicilan lain yang sudah ada.",
      "Sebelum mengajukan kredit, bandingkan penawaran dari beberapa bank dan baca semua syarat yang berlaku, termasuk biaya provisi, asuransi, dan denda keterlambatan.",
    ],
    sources: [
      { name: "Otoritas Jasa Keuangan", url: "https://www.ojk.go.id" },
      { name: "Bank Indonesia", url: "https://www.bi.go.id" },
    ],
  },
  {
    id: "7",
    slug: "apa-itu-rumah-tapak-vs-apartemen",
    title: "Apa Itu Rumah Tapak dan Apartemen? Mana yang Lebih Cocok?",
    category: "Panduan Properti",
    excerpt:
      "Bandingkan karakteristik rumah tapak dan apartemen dari sisi biaya, privasi, dan fleksibilitas hidup.",
    author: "Tim Realthink",
    date: "2 Jul 2026",
    imageUrl:
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80",
    description:
      "Memilih antara rumah tapak dan apartemen sangat bergantung pada kebutuhan gaya hidup, anggaran, dan skema kepemilikan.",
    content: [
      "Rumah tapak biasanya cocok untuk keluarga yang membutuhkan ruang lebih luas, privasi, dan area halaman. Sementara apartemen cocok bagi mereka yang ingin tinggal di pusat kota dengan akses yang lebih praktis, terutama jika mobilitas dan lokasi kerja menjadi prioritas.",
      "Dari sisi biaya, apartemen sering kali memiliki biaya perawatan bersama, sedangkan rumah tapak biasanya memiliki tanggung jawab pemeliharaan pribadi yang lebih besar. Ini memengaruhi anggaran bulanan Anda secara langsung.",
      "Pertimbangkan juga kebutuhan jangka panjang, termasuk potensi kenaikan nilai, fleksibilitas saat ingin pindah, dan kenyamanan untuk pertumbuhan keluarga. Tidak ada pilihan yang benar-benar terbaik untuk semua orang, karena tiap tipe hunian punya kelebihan dan trade-off-nya masing-masing.",
      "Dalam banyak kasus, keputusan terbaik adalah yang paling sesuai dengan pola hidup Anda, bukan yang paling populer di pasar.",
    ],
    sources: [
      { name: "Badan Pusat Statistik", url: "https://www.bps.go.id" },
      { name: "Colliers Indonesia", url: "https://www.colliers.com/id-id" },
    ],
  },
  {
    id: "8",
    slug: "cara-merenovasi-rumah-tanpa-boros",
    title: "Cara Merenovasi Rumah Tanpa Boros dan Tetap Estetik",
    category: "Renovasi",
    excerpt:
      "Tips renovasi hemat yang membantu rumah terasa lebih modern tanpa menguras anggaran secara berlebihan.",
    author: "Tim Realthink",
    date: "28 Jun 2026",
    imageUrl:
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80",
    description:
      "Renovasi yang terencana dapat meningkatkan kenyamanan dan nilai properti tanpa membuat pengeluaran melonjak.",
    content: [
      "Sebelum memulai renovasi, tentukan prioritas: area yang paling sering dipakai, bagian yang terlihat paling penting, dan elemen yang benar-benar memberi nilai tambah. Renovasi yang baik dimulai dari kebutuhan, bukan sekadar tren.",
      "Pilih material yang tahan lama dan efisien secara biaya. Kadang perubahan kecil seperti cat, pencahayaan, dan penataan furniture sudah cukup memberi efek besar tanpa harus mengubah struktur rumah secara keseluruhan.",
      "Buat anggaran rinci dan sisihkan cadangan dana untuk biaya tak terduga, terutama untuk pekerjaan struktural atau kelistrikan. Perencanaan yang matang membantu Anda menghindari pembengkakan biaya saat proyek berjalan.",
      "Jika Anda ingin meningkatkan nilai properti, fokuslah pada elemen yang memberi dampak visual dan fungsional sekaligus, seperti dapur, kamar mandi, dan area penerima tamu.",
    ],
    sources: [
      { name: "The Spruce", url: "https://www.thespruce.com" },
      { name: "HomeAdvisor", url: "https://www.homeadvisor.com" },
    ],
  },
  {
    id: "9",
    slug: "kenapa-nilai-properti-bisa-naik",
    title: "Kenapa Nilai Properti Bisa Naik dan Bagaimana Menjaganya",
    category: "Pasar Properti",
    excerpt:
      "Pelajari faktor-faktor yang mendorong kenaikan nilai properti serta cara menjaga aset tetap bernilai tinggi.",
    author: "Tim Realthink",
    date: "24 Jun 2026",
    imageUrl:
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80",
    description:
      "Nilai properti bisa meningkat karena faktor lokasi, infrastruktur, dan kualitas pengelolaan aset. Mengetahui faktor ini membantu Anda membuat keputusan yang lebih cerdas.",
    content: [
      "Nilai properti sering naik seiring berkembangnya infrastruktur, akses transportasi, dan fasilitas umum di sekitar lokasi. Wilayah yang mulai terbuka dengan jalan baru, transportasi publik, atau pusat bisnis biasanya menjadi lebih menarik.",
      "Perawatan rutin, desain yang relevan, dan akses yang baik juga berkontribusi pada daya tarik properti di pasar. Properti yang terlihat terawat biasanya lebih mudah menarik minat pembeli maupun penyewa.",
      "Pemilik properti yang aktif memantau tren pasar bisa mengambil keputusan yang lebih baik untuk jual, sewa, atau renovasi. Memahami tren pasar membantu Anda menyesuaikan strategi sebelum nilai aset berubah drastis.",
      "Secara umum, menjaga nilai properti bukan hanya soal menunggu pasar naik, tetapi juga soal melakukan perawatan dan keputusan yang konsisten dari waktu ke waktu.",
    ],
    sources: [
      { name: "Colliers Indonesia", url: "https://www.colliers.com/id-id" },
      { name: "Knight Frank Indonesia", url: "https://www.knightfrank.com/id-id" },
    ],
  },
  {
    id: "10",
    slug: "cara-menilai-potensi-properti-sebelum-membeli",
    title: "Cara Menilai Potensi Properti Sebelum Membeli",
    category: "Panduan Properti",
    excerpt:
      "Langkah praktis menilai potensi properti sebelum memutuskan membeli agar tidak salah pilih.",
    author: "Tim Realthink",
    date: "20 Jun 2026",
    imageUrl:
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1200&q=80",
    description:
      "Menilai potensi properti sebelum membeli membantu Anda menghindari risiko dan memastikan keputusan sesuai kebutuhan jangka panjang.",
    content: [
      "Sebelum membeli, periksa faktor lokasi, akses, konektivitas, dan perkembangan wilayah di sekitar properti. Semua elemen ini menentukan apakah properti itu akan tetap menarik dari waktu ke waktu.",
      "Bandingkan harga pasar dengan kemampuan finansial Anda, lalu pertimbangkan pula potensi sewa dan nilai jual kembali. Jangan hanya melihat nominal saat ini, tetapi pikirkan bagaimana properti tersebut bisa berkembang di masa depan.",
      "Cek pula dokumen legalitas, status lahan, dan potensi biaya tambahan yang mungkin muncul. Informasi ini penting agar Anda tidak mengalami masalah administrasi setelah transaksi selesai.",
      "Dengan pendekatan yang sistematis, Anda bisa memutuskan dengan lebih percaya diri dan menghindari keputusan impulsif.",
    ],
    sources: [
      { name: "Bank Indonesia", url: "https://www.bi.go.id" },
      { name: "Badan Pusat Statistik", url: "https://www.bps.go.id" },
    ],
  },
];

export const LATEST_ARTICLES = ARTICLES.slice(0, 3);

export function getArticleBySlug(slug: string) {
  return ARTICLES.find((article) => article.slug === slug);
}
