"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function MainLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Cek apakah halaman yang dibuka adalah area admin atau halaman masuk
  const isAdminArea = pathname?.startsWith("/admin");
  const isLogin = pathname === "/login";

  if (isAdminArea) {
    // Jika di area Admin, langsung render isinya tanpa Navbar & Footer publik
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      {/* Jika di halaman /masuk, gunakan pt-0 agar tidak ada ruang kosong di atas */}
      <main className={`grow ${isLogin ? "pt-0" : "pt-20"}`}>{children}</main>
      <Footer />
    </>
  );
}
