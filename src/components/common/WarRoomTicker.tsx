"use client";

import React, { useState } from "react";
import { 
  Radio, 
  AlertTriangle, 
  Activity, 
  Wind, 
  Car, 
  Zap, 
  ShieldCheck, 
  Wifi, 
  ChevronRight,
  Pause,
  Play
} from "lucide-react";
import Link from "next/link";

interface TickerItem {
  id: string;
  type: "critical" | "warning" | "success" | "info";
  prefix: string;
  badge: string;
  message: string;
  detailHref?: string;
}

const DEFAULT_TICKER_ITEMS: TickerItem[] = [
  {
    id: "t1",
    type: "critical",
    prefix: "KORIDOR SUHAT",
    badge: "LOS E • KRITIS",
    message: "Kecepatan 16.5 km/j • Delay +4.2 mnt • Rasio Waktu Tempuh TTR 1.42 • Antrean Simpang Borobudur",
    detailHref: "/traffic",
  },
  {
    id: "t2",
    type: "warning",
    prefix: "SPKU GADANG (SUKUN)",
    badge: "PM2.5 38.4 µg/m³",
    message: "ISPU 72 (Sedang) • Konsentrasi partikulat diesel di arteri selatan +18% di atas rata-rata kota",
    detailHref: "/air-quality",
  },
  {
    id: "t3",
    type: "critical",
    prefix: "DINOYO - MT HARYONO",
    badge: "LOS E • BOTTLENECK",
    message: "Kecepatan 13.2 km/j • V/C Ratio 1.04 • Jam Puncak Perkuliahan Kampus Barat",
    detailHref: "/traffic",
  },
  {
    id: "t4",
    type: "success",
    prefix: "KAYUTANGAN HERITAGE",
    badge: "LOS C • TERKENDALI",
    message: "Kecepatan 17.8 km/j • Sistem Satu Arah (SSA) Klojen stabil • Beban terdistribusi",
    detailHref: "/traffic",
  },
  {
    id: "t5",
    type: "info",
    prefix: "ATCS KOTA MALANG",
    badge: "ONLINE 100%",
    message: "24 Simpang Terkoneksi • Siklus lampu hijau adaptif aktif memotong tundaan jembatan",
    detailHref: "/data-sources",
  },
  {
    id: "t6",
    type: "success",
    prefix: "SPKU IJEN BOULEVARD",
    badge: "ISPU 54 (BAIK-SEDANG)",
    message: "PM2.5 21.0 µg/m³ • Retensi kanopi pohon trembesi koridor hijau menyerap polutan",
    detailHref: "/air-quality",
  },
  {
    id: "t7",
    type: "warning",
    prefix: "JL. AHMAD YANI (BLIMBING)",
    badge: "LOS D • PADAT",
    message: "Kecepatan 22.0 km/j • Arus komuter Gerbang Utara & Terminal Arjosari padat bergerak",
    detailHref: "/traffic",
  },
];

export function WarRoomTicker() {
  const [isPaused, setIsPaused] = useState(false);

  const getTypeStyle = (type: TickerItem["type"]) => {
    switch (type) {
      case "critical":
        return {
          dot: "bg-rose-500 shadow-rose-500/50",
          badge: "bg-rose-500/15 text-rose-300 border-rose-500/30",
          prefix: "text-rose-400",
        };
      case "warning":
        return {
          dot: "bg-amber-400 shadow-amber-400/50",
          badge: "bg-amber-500/15 text-amber-300 border-amber-500/30",
          prefix: "text-amber-300",
        };
      case "success":
        return {
          dot: "bg-emerald-400 shadow-emerald-400/50",
          badge: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
          prefix: "text-emerald-400",
        };
      case "info":
        return {
          dot: "bg-sky-400 shadow-sky-400/50",
          badge: "bg-sky-500/15 text-sky-300 border-sky-500/30",
          prefix: "text-sky-400",
        };
    }
  };

  return (
    <div className="w-full bg-[#0a0e17] border-y border-slate-800/90 text-xs font-mono select-none overflow-hidden relative shadow-inner">
      {/* Background cyber grid effect */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b08_1px,transparent_1px),linear-gradient(to_bottom,#1e293b08_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      <div className="flex items-center">
        {/* Left fixed badge: LIVE FEED */}
        <div className="shrink-0 z-20 flex items-center gap-2.5 bg-gradient-to-r from-[#0d131f] via-[#111827] to-[#0e1624] px-4 py-2 border-r border-slate-800 shadow-md">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500 shadow-sm shadow-rose-500/50" />
            </span>
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-200 flex items-center gap-1.5">
              <Radio className="h-3 w-3 text-rose-500" />
              LIVE FEED
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsPaused(!isPaused)}
            title={isPaused ? "Lanjutkan ticker" : "Jeda ticker"}
            className="text-slate-500 hover:text-slate-300 transition-colors p-0.5 rounded hover:bg-slate-800/60"
          >
            {isPaused ? <Play className="h-3 w-3 text-emerald-400" /> : <Pause className="h-3 w-3" />}
          </button>
        </div>

        {/* Scrolling ticker track */}
        <div 
          className="overflow-hidden flex-1 relative py-2"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div 
            className={`flex items-center gap-8 whitespace-nowrap will-change-transform ${
              isPaused ? "" : "animate-marquee"
            }`}
          >
            {/* Duplicated list for seamless looping */}
            {[...DEFAULT_TICKER_ITEMS, ...DEFAULT_TICKER_ITEMS].map((item, idx) => {
              const styles = getTypeStyle(item.type);
              return (
                <div key={`${item.id}-${idx}`} className="inline-flex items-center gap-2.5 text-[11px]">
                  <span className={`h-1.5 w-1.5 rounded-full shrink-0 shadow-xs ${styles.dot}`} />
                  
                  <span className={`font-bold tracking-wider ${styles.prefix}`}>
                    [{item.prefix}]
                  </span>

                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider ${styles.badge}`}>
                    {item.badge}
                  </span>

                  <span className="text-slate-400">
                    {item.message}
                  </span>

                  {item.detailHref && (
                    <Link
                      href={item.detailHref}
                      className="text-slate-500 hover:text-white transition-colors underline decoration-slate-700 underline-offset-2 ml-1"
                    >
                      Audit &rarr;
                    </Link>
                  )}

                  <span className="text-slate-800 mx-2">///</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right fixed status */}
        <div className="hidden lg:flex shrink-0 items-center gap-3 bg-[#0d131f] px-3.5 py-2 border-l border-slate-800 text-[10px] text-slate-400 font-mono z-20">
          <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            TELEMETRY SYNCED
          </span>
          <span className="text-slate-700">|</span>
          <span className="text-slate-400">7 KORIDOR • 3 SPKU</span>
        </div>
      </div>
    </div>
  );
}
