import React from "react";
import { 
  Database, 
  ExternalLink, 
  ShieldCheck, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Layers,
  FileText
} from "lucide-react";
import { MALANG_DATA_SOURCES } from "@/lib/data/dataSourcesMeta";
import { formatDateTime } from "@/lib/utils";

export default function DataSourcesPage() {
  return (
    <div className="mx-auto max-w-[1720px] w-full px-4 sm:px-6 lg:px-8 xl:px-10 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-800/80 pb-6 space-y-2">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-cyan-300 bg-cyan-950/60 px-2.5 py-0.5 rounded-md border border-cyan-500/40 backdrop-blur-sm">
            Transparansi & Asal-Usul Data
          </span>
          <span className="inline-flex items-center gap-1 rounded-md bg-emerald-950/60 px-2.5 py-0.5 text-[10px] font-mono font-bold text-emerald-400 border border-emerald-500/40 backdrop-blur-sm">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            Terverifikasi & Terbuka
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight font-sans drop-shadow-sm">
          Sumber Data, Metodologi, dan Batasan Sistem
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
          Malang City Index mematuhi prinsip keterbukaan dan integritas informasi. Seluruh metrik berasal dari instansi resmi atau sumber data terbuka berlisensi sah. Tidak ada data telemetri kecepatan atau kualitas udara yang difabrikasi.
        </p>
      </div>

      {/* Sources Grid */}
      <div className="space-y-4">
        <h2 className="text-base sm:text-lg font-bold text-white font-sans flex items-center gap-2">
          <Database className="h-4 w-4 text-cyan-400" />
          Katalog Sumber Data Terintegrasi ({MALANG_DATA_SOURCES.length} Sumber)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {MALANG_DATA_SOURCES.map((source) => (
            <div
              key={source.id}
              className="group rounded-2xl border border-slate-700/60 bg-[#0e1726]/60 backdrop-blur-xl p-5 shadow-lg hover:border-cyan-500/40 hover:bg-[#0e1726]/80 transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400">
                      {source.dataType}
                    </span>
                    <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {source.name}
                    </h3>
                    <p className="text-xs text-slate-400 font-medium">
                      {source.agencyOrProvider}
                    </p>
                  </div>

                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-950/70 px-2.5 py-1 text-xs font-mono font-semibold text-emerald-400 border border-emerald-500/40 shrink-0">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    {source.connectionStatus}
                  </span>
                </div>

                {/* Attributes Table */}
                <div className="rounded-xl bg-[#090e18]/80 border border-slate-800/80 p-3.5 space-y-2 text-xs text-slate-300 mt-3 font-mono">
                  <div className="flex justify-between border-b border-slate-800/60 pb-1.5">
                    <span className="text-slate-400 font-sans">Cakupan Wilayah:</span>
                    <span className="font-medium text-white">{source.geographicScope}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800/60 pb-1.5">
                    <span className="text-slate-400 font-sans">Periode / Frekuensi:</span>
                    <span className="font-medium text-white">{source.dataPeriod} ({source.updateFrequency})</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800/60 pb-1.5">
                    <span className="text-slate-400 font-sans">Metode Pengambilan:</span>
                    <span className="font-medium text-white">{source.fetchMethod}</span>
                  </div>
                  <div className="flex justify-between pt-0.5">
                    <span className="text-slate-400 font-sans">Status Validasi:</span>
                    <span className="font-bold text-cyan-400">{source.validationStatus}</span>
                  </div>
                </div>

                {/* Limitations */}
                <div className="mt-3 text-xs text-slate-300 font-sans leading-relaxed">
                  <span className="font-bold text-slate-100">Keterbatasan & Catatan Penggunaan: </span>
                  {source.limitations}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
                <span className="text-[11px] text-slate-400">
                  Lisensi: {source.licenseOrTerms}
                </span>
                <a
                  href={source.officialUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  Portal Resmi <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Principles & Verification Standard */}
      <div className="rounded-2xl border border-slate-700/60 bg-[#0e1726]/50 backdrop-blur-xl p-6 space-y-4 shadow-xl">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-emerald-400" />
          Pedoman Integritas Data Malang City Index
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
          <div className="space-y-1 rounded-xl bg-[#090e18]/50 border border-slate-800/60 p-4">
            <div className="font-bold text-white font-sans text-sm mb-1">1. Larangan Fabrikasi Data</div>
            <p className="leading-relaxed">
              Platform tidak merekayasa angka seolah-olah hasil sensor CCTV/GPS langsung jika integrasi teknis belum terpasang.
            </p>
          </div>
          <div className="space-y-1 rounded-xl bg-[#090e18]/50 border border-slate-800/60 p-4">
            <div className="font-bold text-white font-sans text-sm mb-1">2. Metadata Wajib Pada Setiap Metrik</div>
            <p className="leading-relaxed">
              Setiap nilai kecepatan, konsentrasi partikulat, dan indeks mencantumkan waktu pengukuran, sumber resmi, dan satuan standar.
            </p>
          </div>
          <div className="space-y-1 rounded-xl bg-[#090e18]/50 border border-slate-800/60 p-4">
            <div className="font-bold text-white font-sans text-sm mb-1">3. Pemisahan Tegas Jenis Informasi</div>
            <p className="leading-relaxed">
              Data pengamatan (observed), baseline historis, indeks terhitung, dan hasil simulasi dipisahkan secara visual menggunakan badge khusus.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
