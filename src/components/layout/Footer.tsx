import React from "react";
import Link from "next/link";
import { ShieldCheck, Info, Database, ExternalLink } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-800/90 bg-[#060a12] text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: About Platform */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-100 text-base">Malang City Index</span>
              <span className="rounded bg-sky-950/80 border border-sky-800/60 px-2 py-0.5 text-[10px] font-semibold text-sky-300 font-mono">
                Urban Index v1.0
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-md">
              Platform index perkotaan berbasis data nyata untuk memantau mobilitas lalu lintas,
              kemacetan koridor, kualitas udara, serta dampak kebijakan transportasi di Kota Malang, Jawa Timur.
            </p>
            <div className="flex items-center gap-3 pt-1">
              <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/40 px-2.5 py-1 rounded-md border border-emerald-800/60 font-mono text-[11px]">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                Data Terkalibrasi & Terbuka (Tanpa Telemetri Palsu)
              </span>
            </div>
          </div>

          {/* Col 2: Sumber Data Resmi */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider font-mono">
              Sumber Data Resmi
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li>
                <a
                  href="https://data.malangkota.go.id"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-cyan-400 flex items-center gap-1 transition-colors"
                >
                  Satu Data Kota Malang <ExternalLink className="h-2.5 w-2.5 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://dishub.malangkota.go.id"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-cyan-400 flex items-center gap-1 transition-colors"
                >
                  Dishub & ATCS Malang <ExternalLink className="h-2.5 w-2.5 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://dlh.malangkota.go.id"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-cyan-400 flex items-center gap-1 transition-colors"
                >
                  DLH Kota Malang (SPKU) <ExternalLink className="h-2.5 w-2.5 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://malangkota.bps.go.id"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-cyan-400 flex items-center gap-1 transition-colors"
                >
                  BPS Kota Malang <ExternalLink className="h-2.5 w-2.5 text-slate-500" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Standar & Kebijakan */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider font-mono">
              Metodologi
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li>
                <Link href="/about#ispu-standard" className="hover:text-cyan-400 transition-colors">
                  ISPU PerMen LHK 14/2020
                </Link>
              </li>
              <li>
                <Link href="/about#pkji-methodology" className="hover:text-cyan-400 transition-colors">
                  PKJI 2023 & Model BPR
                </Link>
              </li>
              <li>
                <Link href="/data-sources" className="hover:text-cyan-400 transition-colors">
                  Transparansi & Batasan Data
                </Link>
              </li>
              <li>
                <Link href="/analysis" className="hover:text-amber-400 font-medium text-amber-300 transition-colors">
                  Analisis & Rekomendasi
                </Link>
              </li>
              <li>
                <Link href="/simulator" className="hover:text-purple-400 transition-colors">
                  Simulator Kebijakan Berbasis Aturan
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-800/80 pt-4 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 font-mono">
          <p>© 2026 Malang City Index. Inisiatif keterbukaan data perkotaan Kota Malang.</p>
          <p className="mt-1 sm:mt-0">
            Kecamatan Klojen • Lowokwaru • Blimbing • Sukun • Kedungkandang
          </p>
        </div>
      </div>
    </footer>
  );
}
