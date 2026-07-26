import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import MainLayoutWrapper from "@/components/MainLayoutWrapper";
import FloatingConsultation from "@/components/FloatingConsultation";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Realthink Property | Think Smart, Own Better",
  description: "Platform listing properti profesional, modern, dan terpercaya di Indonesia.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${inter.variable} ${poppins.variable}`} suppressHydrationWarning>
      <body
        className="bg-background flex min-h-screen flex-col antialiased"
        suppressHydrationWarning
      >
        <MainLayoutWrapper>{children}</MainLayoutWrapper>

        {/* Tombol Floating Konsultasi (Otomatis hilang jika di /admin) */}
        <FloatingConsultation />
      </body>
    </html>
  );
}
