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
      <body className="min-h-screen flex flex-col bg-[#060a12] text-slate-100 antialiased font-sans selection:bg-amber-400 selection:text-slate-950 relative overflow-x-hidden">
        {/* Ambient Background Glows & Subtle Grid Layer */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
          {/* Subtle technical dot grid pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:32px_32px] opacity-60" />
          
          {/* Soft top gradient glow (Cyan/Sky) */}
          <div className="absolute -top-[15%] left-1/2 -translate-x-1/2 w-[1100px] h-[550px] rounded-full bg-gradient-to-b from-sky-500/12 via-cyan-500/6 to-transparent blur-3xl" />
          
          {/* Soft right glow (Indigo/Violet) */}
          <div className="absolute top-[25%] -right-[15%] w-[650px] h-[650px] rounded-full bg-indigo-600/6 blur-[130px]" />
          
          {/* Soft left glow (Emerald) */}
          <div className="absolute top-[60%] -left-[15%] w-[650px] h-[650px] rounded-full bg-emerald-600/5 blur-[130px]" />
        </div>

        <div className="relative z-10 flex flex-col min-h-screen">
          <Navbar />
          <WarRoomTicker />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
