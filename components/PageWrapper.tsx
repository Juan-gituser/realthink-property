"use client";

import { usePathname } from "next/navigation";

export default function PageWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Cek apakah ini halaman auth atau halaman admin
  const isAuthPage = pathname === "/login" || pathname === "/daftar";
  const isAdminPage = pathname?.startsWith("/admin");

  // Jika di halaman auth atau admin, hilangkan padding atas
  const removePadding = isAuthPage || isAdminPage;

  return (
    <main className={removePadding ? "" : "pt-16"}>
      {children}
    </main>
  );
}