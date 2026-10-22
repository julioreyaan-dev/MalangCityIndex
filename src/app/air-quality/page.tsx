"use client";

import React, { useState, useEffect } from "react";
import { 
  Wind, 
  MapPin, 
  ShieldCheck, 
  AlertCircle, 
  HeartPulse, 
  Info,
  Calendar,
  Layers,
  Thermometer,
  Activity
} from "lucide-react";
import { DataBadge } from "@/components/common/DataBadge";
import { RefreshButton } from "@/components/common/RefreshButton";
import { formatNumber, formatDateTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default function AirQualityPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchAirQualityData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/air-quality");
      const json = await res.json();
      if (json.success) {
        setData(json);
      }
    } catch (err) {
      console.error("Error fetching air quality:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAirQualityData();
  }, []);

  if (loading || !data) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 text-center text-slate-500 font-mono text-xs">
        <Wind className="h-8 w-8 animate-pulse text-slate-700 mx-auto mb-3" />
        <p>MENGAMBIL DATA STREAM KUALITAS UDARA KOTA MALANG...</p>
      </div>
    );
  }

  const current = data.currentCityReading;
  const stations = data.stations || [];

  return (
    <div className="mx-auto max-w-[1720px] w-full px-4 sm:px-6 lg:px-8 xl:px-10 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-emerald-300 bg-emerald-950/60 px-2.5 py-0.5 rounded-md border border-emerald-500/40 backdrop-blur-sm">
              STANDAR BAKU MUTU PERMEN LHK NO. 14/2020
            </span>
            <DataBadge type={current.isLiveFeed ? "observed" : "baseline"} />
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight font-sans drop-shadow-sm">
            Monitoring Kualitas Udara & Konsentrasi Polutan
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
            Pengukuran kontinu konsentrasi partikulat halus (PM2.5, PM10) dan polutan gas di Kota Malang yang diintegrasikan dengan stasiun pemantau fisik DLH dan asimilasi atmosferik CAMS.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <RefreshButton onRefresh={fetchAirQualityData} />
        </div>
      </div>

      {/* Main ISPU Score Board (Glassmorphism) */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-700/60 bg-gradient-to-br from-slate-900/80 via-[#0e1726]/70 to-[#090e18]/80 backdrop-blur-xl p-6 sm:p-8 shadow-2xl transition-all duration-300 hover:border-slate-600/70">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center relative z-10">
          <div className="space-y-2 lg:border-r lg:border-slate-800/80 lg:pr-8">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
              SKOR ISPU KOTA MALANG
            </span>
            <div className="flex items-baseline gap-3">
              <span className="text-6xl sm:text-7xl font-black text-white tracking-tight font-mono tabular-nums drop-shadow-md">
                {current.ispu}
              </span>
              <span
                className={`rounded-lg px-3 py-1 text-xs font-bold font-sans border backdrop-blur-md ${current.category.badgeClass}`}
              >
                {current.category.category}
              </span>
            </div>
            <p className="text-[11px] font-mono text-slate-400">
              Sinkronisasi: {formatDateTime(current.timestamp)}
            </p>
          </div>

          <div className="space-y-2.5 lg:col-span-2">
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-rose-400">
              <HeartPulse className="h-4 w-4 text-rose-400 animate-pulse" />
              Protokol Kesehatan & Aktivitas Luar Ruang
            </div>
            <p className="text-sm sm:text-base font-semibold text-slate-100 leading-relaxed font-sans">
              {current.category.healthAdvice}
            </p>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              {current.category.description}
            </p>
          </div>
        </div>
      </div>

      {/* 6 Pollutant Metric Cards (Glassmorphism) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
            Parameter Konsentrasi Polutan Terukur
          </h3>
          <span className="text-[11px] font-mono text-slate-400">
            Sumber: {current.source}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { param: "PM2.5", val: current.pm25, unit: "µg/m³", desc: "Partikulat Halus", standard: "Baku Mutu 55 µg/m³" },
            { param: "PM10", val: current.pm10, unit: "µg/m³", desc: "Partikulat Kasar", standard: "Baku Mutu 75 µg/m³" },
            { param: "CO", val: current.co, unit: "µg/m³", desc: "Karbon Monoksida", standard: "Emisi Gas Buang" },
            { param: "NO2", val: current.no2, unit: "µg/m³", desc: "Nitrogen Dioksida", standard: "Aktivitas Kendaraan" },
            { param: "SO2", val: current.so2, unit: "µg/m³", desc: "Sulfur Dioksida", standard: "Aktivitas Industri" },
            { param: "O3", val: current.o3, unit: "µg/m³", desc: "Ozon Permukaan", standard: "Fotokimia Udara" },
          ].map((item) => (
            <div
              key={item.param}
              className="group relative overflow-hidden rounded-2xl border border-slate-700/60 bg-[#0e1726]/60 backdrop-blur-xl p-4 shadow-lg hover:border-cyan-500/40 hover:bg-[#0e1726]/80 hover:shadow-cyan-950/20 transition-all duration-300 space-y-1.5"
            >
              <div className="text-xs font-mono font-bold text-cyan-400 group-hover:text-cyan-300 transition-colors">
                {item.param}
              </div>
              <div className="text-2xl font-bold text-white font-mono tabular-nums">
                {item.val} <span className="text-xs font-normal text-slate-400 font-sans">{item.unit}</span>
              </div>
              <div className="text-[11px] text-slate-300 font-medium font-sans">{item.desc}</div>
              <div className="text-[10px] text-slate-400 pt-1.5 border-t border-slate-800/80 font-mono">
                {item.standard}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Physical Monitoring Stations Cards (Glassmorphism) */}
      <div className="space-y-4">
        <div>
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
            Jaringan Stasiun Pemantauan Fisik (SPKU) Kota Malang
          </h3>
          <p className="text-xs text-slate-400 font-sans mt-0.5">
            4 stasiun observasi fisik terkalibrasi di titik strategis pusat pemerintahan, komersial kampus, jalur hijau cagar budaya, dan arteri industri.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stations.map((st: any) => (
            <div
              key={st.station.id}
              className="group relative overflow-hidden rounded-2xl border border-slate-700/60 bg-[#0e1726]/60 backdrop-blur-xl p-5 shadow-lg hover:border-cyan-500/40 hover:bg-[#0e1726]/80 transition-all duration-300 flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                    {st.station.code}
                  </span>
                  <span
                    className={`rounded-md px-2 py-0.5 text-[10px] font-mono font-bold border backdrop-blur-sm ${st.category.badgeClass}`}
                  >
                    ISPU {st.ispu} ({st.category.category})
                  </span>
                </div>

                <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 mb-1 font-sans transition-colors">
                  {st.station.name}
                </h4>
                <p className="text-[11px] text-slate-400 mb-3 font-mono">
                  Kec. {st.station.kecamatan} • Elevasi {st.station.elevationMeters}m dpl
                </p>

                <div className="rounded-xl bg-[#090e18]/80 border border-slate-800/80 p-3 space-y-2 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-sans">Konsentrasi PM2.5:</span>
                    <span className="font-bold text-white">{st.pm25} µg/m³</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-sans">Konsentrasi PM10:</span>
                    <span className="font-bold text-white">{st.pm10} µg/m³</span>
                  </div>
                  <div className="flex justify-between pt-1.5 border-t border-slate-800/80">
                    <span className="text-slate-400 font-sans">Status Sensor:</span>
                    <span className="text-emerald-400 font-semibold font-mono flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      OPERASIONAL
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 mt-3 leading-relaxed font-sans">
                  {st.station.notes}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 text-[10px] text-slate-400 font-mono">
                Otoritas: {st.station.sourceAuthority}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ISPU Standards Table (Glassmorphism) */}
      <div className="rounded-2xl border border-slate-700/60 bg-[#0e1726]/60 backdrop-blur-xl overflow-hidden shadow-xl">
        <div className="px-5 py-4 border-b border-slate-800/80 flex items-center justify-between bg-[#090e18]/60">
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
            Tabel Standar Kategori ISPU (PerMen LHK No. 14 Tahun 2020)
          </h4>
          <span className="text-[11px] font-mono text-emerald-400">PANDUAN NASIONAL</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-[#090e18]/80 text-slate-400 border-b border-slate-800/80 font-mono text-[11px]">
              <tr>
                <th className="py-3 px-4">RENTANG ISPU</th>
                <th className="py-3 px-4">PM2.5 (24 JAM)</th>
                <th className="py-3 px-4">KATEGORI MUTU</th>
                <th className="py-3 px-4">PENGARUH KESEHATAN</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              <tr className="hover:bg-slate-800/30 transition-colors">
                <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">0 - 50</td>
                <td className="py-3.5 px-4 font-mono text-slate-200">0 - 15.5 µg/m³</td>
                <td className="py-3.5 px-4 font-bold text-emerald-400">Baik (Hijau)</td>
                <td className="py-3.5 px-4 text-slate-300">Kualitas udara sangat baik, tidak memberikan dampak negatif bagi manusia atau hewan.</td>
              </tr>
              <tr className="hover:bg-slate-800/30 transition-colors">
                <td className="py-3.5 px-4 font-mono font-bold text-sky-400">51 - 100</td>
                <td className="py-3.5 px-4 font-mono text-slate-200">15.6 - 55.4 µg/m³</td>
                <td className="py-3.5 px-4 font-bold text-sky-400">Sedang (Biru)</td>
                <td className="py-3.5 px-4 text-slate-300">Kualitas udara dapat diterima, namun kelompok rentan dianjurkan mengurangi aktivitas fisik berat di luar ruang.</td>
              </tr>
              <tr className="hover:bg-slate-800/30 transition-colors">
                <td className="py-3.5 px-4 font-mono font-bold text-amber-400">101 - 200</td>
                <td className="py-3.5 px-4 font-mono text-slate-200">55.5 - 150.4 µg/m³</td>
                <td className="py-3.5 px-4 font-bold text-amber-400">Tidak Sehat (Kuning)</td>
                <td className="py-3.5 px-4 text-slate-300">Mulai merugikan kesehatan pada populasi umum, kelompok sensitif wajib menggunakan masker filtrasi.</td>
              </tr>
              <tr className="hover:bg-slate-800/30 transition-colors">
                <td className="py-3.5 px-4 font-mono font-bold text-rose-400">201 - 300</td>
                <td className="py-3.5 px-4 font-mono text-slate-200">150.5 - 250.4 µg/m³</td>
                <td className="py-3.5 px-4 font-bold text-rose-400">Sangat Tidak Sehat (Merah)</td>
                <td className="py-3.5 px-4 text-slate-300">Meningkatkan risiko kesehatan serius pada seluruh segmen populasi. Hindari aktivitas luar ruangan.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
