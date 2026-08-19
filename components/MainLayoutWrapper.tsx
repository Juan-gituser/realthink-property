"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ComparisonBar from "@/components/shared/ComparisonBar"; // Sesuaikan path foldernya jika berbeda
import FloatingConsultation from "@/components/FloatingConsultation";
import PageWrapper from "@/components/PageWrapper";
import PageTransition from "@/components/PageTransition";

export default function MainLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Deteksi rute dashboard atau auth
  const isDashboard = pathname.startsWith("/dashboard");
  const isAuthPage = pathname === "/login" || pathname === "/daftar";
  const hidePublicElements = isDashboard || isAuthPage;

  // Jika berada di dashboard/auth: Sembunyikan SEMUA elemen publik dan hapus padding PageWrapper
  if (hidePublicElements) {
    return <PageTransition>{children}</PageTransition>;
  }

  // Untuk halaman publik biasa (Beranda, Katalog, Artikel, dll.)
  return (
    <>
      {/* Navbar */}
      <Navbar />

      {/* PageWrapper untuk mengatur padding dinamis secara otomatis */}
      <PageWrapper>{children}</PageWrapper>

      {/* Tombol Floating Konsultasi */}
      <FloatingConsultation />

      {/* Bilah Navigasi Perbandingan Properti */}
      <ComparisonBar />

      {/* Footer */}
      <Footer />
    </>
  );
}