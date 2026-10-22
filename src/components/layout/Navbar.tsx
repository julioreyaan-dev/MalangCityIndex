"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  BarChart3, 
  Route, 
  Wind, 
  Map as MapIcon, 
  CalendarRange, 
  SlidersHorizontal, 
  Database, 
  HelpCircle, 
  Menu, 
  X,
  Radio,
  ArrowUpRight,
  Lightbulb
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  tag?: string;
  activeColor: string;
  activeIcon: string;
  tagColor?: string;
}

const NAV_ITEMS: NavItem[] = [
  { 
    name: "Overview", 
    href: "/", 
    icon: BarChart3, 
    activeColor: "bg-blue-600 text-white shadow-sm shadow-blue-500/30 ring-1 ring-blue-700 font-bold",
    activeIcon: "text-white"
  },
  { 
    name: "Analisis & Rekomendasi", 
    href: "/analysis", 
    icon: Lightbulb, 
    tag: "Wawasan",
    activeColor: "bg-amber-600 text-white shadow-sm shadow-amber-500/30 ring-1 ring-amber-700 font-bold",
    activeIcon: "text-white",
    tagColor: "bg-amber-800 text-amber-100"
  },
  { 
    name: "Historis", 
    href: "/history", 
    icon: CalendarRange, 
    activeColor: "bg-amber-600 text-white shadow-sm shadow-amber-500/30 ring-1 ring-amber-700 font-bold",
    activeIcon: "text-white"
  },
  { 
    name: "Simulator", 
    href: "/simulator", 
    icon: SlidersHorizontal, 
    tag: "Simulasi", 
    activeColor: "bg-purple-600 text-white shadow-sm shadow-purple-500/30 ring-1 ring-purple-700 font-bold",
    activeIcon: "text-white",
    tagColor: "bg-purple-800 text-purple-100"
  },
  { 
    name: "Sumber Data", 
    href: "/data-sources", 
    icon: Database, 
    activeColor: "bg-teal-600 text-white shadow-sm shadow-teal-500/30 ring-1 ring-teal-700 font-bold",
    activeIcon: "text-white"
  },
  { 
    name: "Metodologi", 
    href: "/about", 
    icon: HelpCircle, 
    activeColor: "bg-cyan-700 text-white shadow-sm shadow-cyan-600/30 ring-1 ring-cyan-800 font-bold",
    activeIcon: "text-white"
  },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/90 bg-[#090e17]/95 backdrop-blur-md">
      {/* Top telemetry bar */}
      <div className="hidden md:flex h-7 items-center justify-between border-b border-slate-800/80 bg-[#060a12] px-4 sm:px-6 lg:px-8 xl:px-10 text-[11px] text-slate-400 font-mono">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 font-medium text-emerald-400">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            LIVE OBSERVATORY
          </span>
          <span className="text-slate-800">|</span>
          <span className="text-slate-300">WILAYAH: KOTA MALANG (5 KECAMATAN)</span>
          <span className="text-slate-800">|</span>
          <span className="text-slate-400">SINKRONISASI: OPEN-METEO CAMS & DISHUB</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-slate-300">ZONA: ASIA/JAKARTA (WIB)</span>
          <span className="text-slate-800">|</span>
          <Link href="/data-sources" className="text-slate-400 hover:text-white transition-colors underline decoration-slate-700 underline-offset-2">
            AUDIT DATA
          </Link>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="mx-auto flex h-16 max-w-[1720px] items-center justify-between px-4 sm:px-6 lg:px-8 xl:px-10">
        {/* Brand */}
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-3 group">
            {/* Architectural GIS grid emblem */}
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 text-cyan-400 font-mono text-sm font-extrabold tracking-tight shadow-md ring-1 ring-slate-700/80 transition-transform group-hover:scale-95">
              MCI
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-100 text-base sm:text-lg tracking-tight font-sans">
                  MALANG CITY INDEX
                </span>
                <span className="hidden sm:inline-block rounded px-1.5 py-0.5 text-[9px] font-mono font-bold bg-slate-800/90 text-cyan-400 border border-slate-700">
                  OBSERVATORY
                </span>
              </div>
              <p className="text-[10px] text-slate-400 tracking-wider font-mono uppercase">
                URBAN MOBILITY & AIR QUALITY OBSERVATORY
              </p>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1 bg-[#0d1420] p-1 rounded-xl border border-slate-800/90 shadow-inner">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200",
                  isActive
                    ? item.activeColor
                    : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                )}
              >
                <Icon className={cn("h-3.5 w-3.5 transition-colors", isActive ? item.activeIcon : "text-slate-400")} />
                <span>{item.name}</span>
                {item.tag && (
                  <span className={cn(
                    "rounded px-1 py-0.2 text-[9px] font-mono font-bold transition-colors",
                    isActive ? (item.tagColor || "bg-white/20 text-white") : "bg-slate-800 text-slate-300 border border-slate-700"
                  )}>
                    {item.tag}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right side actions */}
        <div className="hidden lg:flex items-center gap-2">
          <Link
            href="/simulator"
            className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-slate-800/90 border border-slate-700 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 hover:text-white transition-colors shadow-xs"
          >
            <span>Uji Skenario</span>
            <ArrowUpRight className="h-3.5 w-3.5 text-slate-400" />
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex items-center justify-center rounded-lg p-2 text-slate-300 hover:bg-slate-800 focus:outline-none border border-slate-800 bg-[#0d1420]"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-800 bg-[#0c121d] px-4 pt-2 pb-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg transition-all",
                  isActive
                    ? item.activeColor
                    : "text-slate-300 hover:bg-slate-800/70"
                )}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={cn("h-4 w-4", isActive ? item.activeIcon : "text-slate-400")} />
                  <span>{item.name}</span>
                </div>
                {item.tag && (
                  <span className={cn(
                    "rounded px-1.5 py-0.5 text-[10px] font-mono",
                    isActive ? "bg-white/20 text-white" : "bg-slate-800 text-slate-300"
                  )}>
                    {item.tag}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
