"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ComparisonBar from "@/components/shared/ComparisonBar";
import FloatingConsultation from "@/components/FloatingConsultation";
import PageWrapper from "@/components/PageWrapper";

export default function MainLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Deteksi rute dashboard atau auth
  const isDashboard = pathname.startsWith("/dashboard");
  const isAuthPage = pathname === "/login" || pathname === "/daftar";
  const hidePublicElements = isDashboard || isAuthPage;

  // Jika berada di dashboard/auth: Sembunyikan SEMUA elemen publik dan hapus padding PageWrapper
  if (hidePublicElements) {
    return <>{children}</>;
  }

  // Untuk halaman publik biasa (Beranda, Katalog, Artikel, dll.)
  return (
    <>
      {/* Navbar */}
      <Navbar />

      {/* PageWrapper untuk mengatur padding dinamis secara otomatis */}
      <PageWrapper>{children}</PageWrapper>

      {/* Bar Komparasi Properti */}
      <ComparisonBar />

      {/* Tombol Floating Konsultasi */}
      <FloatingConsultation />

      {/* Footer */}
      <Footer />
    </>
  );
}
