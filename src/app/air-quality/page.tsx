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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded border border-slate-200">
              STANDAR BAKU MUTU PERMEN LHK NO. 14/2020
            </span>
            <DataBadge type={current.isLiveFeed ? "observed" : "baseline"} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
            Monitoring Kualitas Udara & Konsentrasi Polutan
          </h1>
          <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
            Pengukuran kontinu konsentrasi partikulat halus (PM2.5, PM10) dan polutan gas di Kota Malang yang diintegrasikan dengan stasiun pemantau fisik DLH dan asimilasi atmosferik CAMS.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <RefreshButton onRefresh={fetchAirQualityData} />
        </div>
      </div>

      {/* Main ISPU Score Board */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          <div className="space-y-2 lg:border-r lg:border-slate-100 lg:pr-8">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
              SKOR ISPU KOTA MALANG
            </span>
            <div className="flex items-baseline gap-3">
              <span className="text-6xl font-black text-slate-900 tracking-tight font-mono tabular-nums">
                {current.ispu}
              </span>
              <span
                className={`rounded-lg px-3 py-1 text-xs font-bold font-sans border ${current.category.badgeClass}`}
              >
                {current.category.category}
              </span>
            </div>
            <p className="text-[11px] font-mono text-slate-400">
              Sinkronisasi: {formatDateTime(current.timestamp)}
            </p>
          </div>

          <div className="space-y-2.5 lg:col-span-2">
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-slate-700">
              <HeartPulse className="h-4 w-4 text-rose-600" />
              Protokol Kesehatan & Aktivitas Luar Ruang
            </div>
            <p className="text-sm font-semibold text-slate-800 leading-relaxed font-sans">
              {current.category.healthAdvice}
            </p>
            <p className="text-xs text-slate-500 leading-relaxed font-sans">
              {current.category.description}
            </p>
          </div>
        </div>
      </div>

      {/* 6 Pollutant Metric Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900">
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
              className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-2xs space-y-1.5"
            >
              <div className="text-xs font-mono font-bold text-slate-500">{item.param}</div>
              <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
                {item.val} <span className="text-xs font-normal text-slate-400 font-sans">{item.unit}</span>
              </div>
              <div className="text-[11px] text-slate-600 font-medium font-sans">{item.desc}</div>
              <div className="text-[10px] text-slate-400 pt-1.5 border-t border-slate-100 font-mono">
                {item.standard}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Physical Monitoring Stations Cards */}
      <div className="space-y-4">
        <div>
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900">
            Jaringan Stasiun Pemantauan Fisik (SPKU) Kota Malang
          </h3>
          <p className="text-xs text-slate-500 font-sans mt-0.5">
            4 stasiun observasi fisik terkalibrasi di titik strategis pusat pemerintahan, komersial kampus, jalur hijau cagar budaya, dan arteri industri.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stations.map((st: any) => (
            <div
              key={st.station.id}
              className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                    {st.station.code}
                  </span>
                  <span
                    className={`rounded px-2 py-0.5 text-[10px] font-mono font-bold border ${st.category.badgeClass}`}
                  >
                    ISPU {st.ispu} ({st.category.category})
                  </span>
                </div>

                <h4 className="text-sm font-bold text-slate-900 mb-1 font-sans">
                  {st.station.name}
                </h4>
                <p className="text-[11px] text-slate-500 mb-3 font-mono">
                  Kec. {st.station.kecamatan} • Elevasi {st.station.elevationMeters}m dpl
                </p>

                <div className="rounded-xl bg-slate-50 p-3 space-y-1.5 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-sans">Konsentrasi PM2.5:</span>
                    <span className="font-bold text-slate-900">{st.pm25} µg/m³</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-sans">Konsentrasi PM10:</span>
                    <span className="font-bold text-slate-900">{st.pm10} µg/m³</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-slate-200/60">
                    <span className="text-slate-500 font-sans">Status Sensor:</span>
                    <span className="text-emerald-700 font-semibold font-mono">OPERASIONAL</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 mt-3 leading-relaxed font-sans">
                  {st.station.notes}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 text-[10px] text-slate-400 font-mono">
                Otoritas: {st.station.sourceAuthority}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ISPU Standards Table */}
      <div className="rounded-2xl border border-slate-200/90 bg-white overflow-hidden shadow-xs">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900">
            Tabel Standar Kategori ISPU (PerMen LHK No. 14 Tahun 2020)
          </h4>
          <span className="text-[11px] font-mono text-slate-400">PANDUAN NASIONAL</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 font-mono text-[11px]">
              <tr>
                <th className="py-3 px-4">RENTANG ISPU</th>
                <th className="py-3 px-4">PM2.5 (24 JAM)</th>
                <th className="py-3 px-4">KATEGORI MUTU</th>
                <th className="py-3 px-4">PENGARUH KESEHATAN</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr>
                <td className="py-3 px-4 font-mono font-bold text-emerald-700">0 - 50</td>
                <td className="py-3 px-4 font-mono">0 - 15.5 µg/m³</td>
                <td className="py-3 px-4 font-bold text-emerald-700">Baik (Hijau)</td>
                <td className="py-3 px-4">Kualitas udara sangat baik, tidak memberikan dampak negatif bagi manusia atau hewan.</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-mono font-bold text-blue-700">51 - 100</td>
                <td className="py-3 px-4 font-mono">15.6 - 55.4 µg/m³</td>
                <td className="py-3 px-4 font-bold text-blue-700">Sedang (Biru)</td>
                <td className="py-3 px-4">Kualitas udara dapat diterima, namun kelompok rentan dianjurkan mengurangi aktivitas fisik berat di luar ruang.</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-mono font-bold text-amber-700">101 - 200</td>
                <td className="py-3 px-4 font-mono">55.5 - 150.4 µg/m³</td>
                <td className="py-3 px-4 font-bold text-amber-700">Tidak Sehat (Kuning)</td>
                <td className="py-3 px-4">Mulai merugikan kesehatan pada populasi umum, kelompok sensitif wajib menggunakan masker filtrasi.</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-mono font-bold text-rose-700">201 - 300</td>
                <td className="py-3 px-4 font-mono">150.5 - 250.4 µg/m³</td>
                <td className="py-3 px-4 font-bold text-rose-700">Sangat Tidak Sehat (Merah)</td>
                <td className="py-3 px-4">Meningkatkan risiko kesehatan serius pada seluruh segmen populasi. Hindari aktivitas luar ruangan.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
