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
      <div className="border-b border-slate-200 pb-5">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-xs font-bold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded border border-sky-200">
            Transparansi & Asal-Usul Data
          </span>
          <span className="inline-flex items-center gap-1 rounded bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 border border-emerald-200">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
            Terverifikasi & Terbuka
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Sumber Data, Metodologi, dan Batasan Sistem
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-3xl leading-relaxed">
          Malang City Index mematuhi prinsip keterbukaan dan integritas informasi. Seluruh metrik berasal dari instansi resmi atau sumber data terbuka berlisensi sah. Tidak ada data telemetri kecepatan atau kualitas udara yang difabrikasi.
        </p>
      </div>

      {/* Sources Grid */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-slate-900">
          Katalog Sumber Data Terintegrasi ({MALANG_DATA_SOURCES.length} Sumber)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {MALANG_DATA_SOURCES.map((source) => (
            <div
              key={source.id}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {source.dataType}
                    </span>
                    <h3 className="text-base font-bold text-slate-900">
                      {source.name}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      {source.agencyOrProvider}
                    </p>
                  </div>

                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200 shrink-0">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    {source.connectionStatus}
                  </span>
                </div>

                {/* Attributes Table */}
                <div className="rounded-lg bg-slate-50 p-3 space-y-1.5 text-xs text-slate-600 mt-3">
                  <div className="flex justify-between border-b border-slate-200/50 pb-1">
                    <span className="text-slate-400">Cakupan Wilayah:</span>
                    <span className="font-medium text-slate-800">{source.geographicScope}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200/50 pb-1">
                    <span className="text-slate-400">Periode / Frekuensi:</span>
                    <span className="font-medium text-slate-800">{source.dataPeriod} ({source.updateFrequency})</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200/50 pb-1">
                    <span className="text-slate-400">Metode Pengambilan:</span>
                    <span className="font-medium text-slate-800">{source.fetchMethod}</span>
                  </div>
                  <div className="flex justify-between pt-0.5">
                    <span className="text-slate-400">Status Validasi:</span>
                    <span className="font-semibold text-sky-700">{source.validationStatus}</span>
                  </div>
                </div>

                {/* Limitations */}
                <div className="mt-3 text-xs text-slate-500">
                  <span className="font-semibold text-slate-700">Keterbatasan & Catatan Penggunaan: </span>
                  {source.limitations}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400">
                  Lisensi: {source.licenseOrTerms}
                </span>
                <a
                  href={source.officialUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 font-semibold text-sky-600 hover:text-sky-700 text-xs"
                >
                  Portal Resmi <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Principles & Verification Standard */}
      <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-6 space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-emerald-600" />
          Pedoman Integritas Data Malang City Index
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600">
          <div className="space-y-1">
            <div className="font-bold text-slate-800">1. Larangan Fabrikasi Data</div>
            <p className="leading-relaxed">
              Platform tidak merekayasa angka seolah-olah hasil sensor CCTV/GPS langsung jika integrasi teknis belum terpasang.
            </p>
          </div>
          <div className="space-y-1">
            <div className="font-bold text-slate-800">2. Metadata Wajib Pada Setiap Metrik</div>
            <p className="leading-relaxed">
              Setiap nilai kecepatan, konsentrasi partikulat, dan indeks mencantumkan waktu pengukuran, sumber resmi, dan satuan standar.
            </p>
          </div>
          <div className="space-y-1">
            <div className="font-bold text-slate-800">3. Pemisahan Tegas Jenis Informasi</div>
            <p className="leading-relaxed">
              Data pengamatan (observed), baseline historis, indeks terhitung, dan hasil simulasi dipisahkan secara visual menggunakan badge khusus.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
