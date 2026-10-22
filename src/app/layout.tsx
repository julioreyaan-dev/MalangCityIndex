import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WarRoomTicker } from "@/components/common/WarRoomTicker";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Malang City Index — Urban Mobility & Air Quality Index",
  description:
    "Platform index perkotaan data-driven untuk pemantauan kinerja koridor transportasi, dispersi kualitas udara, dan simulasi skenario kebijakan di Kota Malang, Jawa Timur.",
  keywords: [
    "Malang City Index",
    "Kota Malang",
    "Urban Mobility Index",
    "Kualitas Udara ISPU",
    "Transportasi Kota Malang",
    "Dishub Kota Malang",
    "DLH Kota Malang",
  ],
  authors: [{ name: "Malang City Index Initiative" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${jakarta.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen flex flex-col text-slate-100 antialiased font-sans selection:bg-amber-400 selection:text-slate-950 overflow-x-hidden">
        <Navbar />
        <WarRoomTicker />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
