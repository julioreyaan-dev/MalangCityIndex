"use client";

import React, { useState, useEffect } from "react";
import { 
  Car, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Filter, 
  ArrowUpDown, 
  ExternalLink,
  Info,
  Route
} from "lucide-react";
import { MapLibreView } from "@/components/map/MapLibreView";
import { DataBadge } from "@/components/common/DataBadge";
import { RefreshButton } from "@/components/common/RefreshButton";
import { formatNumber, formatDateTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default function TrafficPage() {
  const [selectedKecamatan, setSelectedKecamatan] = useState<string>("all");
  const [corridors, setCorridors] = useState<any[]>([]);
  const [mapLayers, setMapLayers] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchTrafficData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/traffic?kecamatan=${selectedKecamatan}`);
      const data = await res.json();
      if (data.success) {
        setCorridors(data.data);
      }

      const layersRes = await fetch("/api/map/layers");
      const layersData = await layersRes.json();
      if (layersData.success) {
        setMapLayers(layersData.layers);
      }
    } catch (err) {
      console.error("Error fetching traffic:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrafficData();
  }, [selectedKecamatan]);

  return (
    <div className="mx-auto max-w-[1720px] w-full px-4 sm:px-6 lg:px-8 xl:px-10 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-rose-300 bg-rose-950/60 px-2.5 py-0.5 rounded-md border border-rose-500/40 backdrop-blur-sm">
              ANALISIS KINERJA KORIDOR JALAN
            </span>
            <DataBadge type="baseline" label="SURVEI DISHUB MALANG" />
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight font-sans drop-shadow-sm">
            Pemantauan Lalu Lintas & Tingkat Kemacetan
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Evaluasi empiris kecepatan operasional, Level of Service (LOS PKJI 2023), rasio waktu tempuh (TTR), dan antrean tundaan di 7 koridor jalan arteri dan kolektor Kota Malang.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <RefreshButton onRefresh={fetchTrafficData} />
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-700/60 bg-[#0e1726]/60 backdrop-blur-xl p-3.5 shadow-lg">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-mono font-semibold text-slate-400 flex items-center gap-1 mr-2 uppercase">
            <Filter className="h-3 w-3 text-slate-400" />
            Kecamatan:
          </span>
          {[
            { id: "all", name: "Semua Wilayah" },
            { id: "klojen", name: "Klojen" },
            { id: "lowokwaru", name: "Lowokwaru" },
            { id: "blimbing", name: "Blimbing" },
            { id: "sukun", name: "Sukun" },
            { id: "kedungkandang", name: "Kedungkandang" },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelectedKecamatan(item.id)}
              className={`rounded-lg px-3 py-1.5 text-xs font-mono font-semibold transition-all cursor-pointer ${
                selectedKecamatan === item.id
                  ? "bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-xs font-bold"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              {item.name}
            </button>
          ))}
        </div>

        <span className="text-[11px] font-mono text-slate-400">
          {corridors.length} KORIDOR AKTIF TERPANTAU
        </span>
      </div>

      {/* Map Section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
            <Route className="h-4 w-4 text-rose-400" />
            Peta Visualisasi Kinerja Spasial Koridor
          </h3>
          <span className="text-[11px] font-mono text-slate-400">
            KLASIFIKASI WARNA: PKJI 2023
          </span>
        </div>
        <MapLibreView
          roadGeoJson={mapLayers?.roads}
          airStationsGeoJson={mapLayers?.airStations}
          kecamatanGeoJson={mapLayers?.kecamatans}
          height={500}
        />
      </div>

      {/* Corridor Cards Grid */}
      <div className="space-y-3 pt-2">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
          Metrik Lengkap Kinerja Ruas Jalan
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {corridors.map((c) => (
            <div
              key={c.corridor.id}
              className="group rounded-2xl border border-slate-700/60 bg-[#0e1726]/60 backdrop-blur-xl p-5 shadow-lg hover:border-rose-500/40 hover:bg-[#0e1726]/80 transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-rose-300 transition-colors">{c.corridor.name}</h4>
                    <span className="text-[11px] text-slate-400 font-mono">
                      Kec. {c.corridor.kecamatan} • {c.corridor.roadClass}
                    </span>
                  </div>
                  <span
                    className="rounded-md px-2.5 py-0.5 text-xs font-mono font-bold shrink-0 border backdrop-blur-sm"
                    style={{
                      backgroundColor: `${c.congestion.colorHex}25`,
                      color: c.congestion.colorHex,
                      borderColor: `${c.congestion.colorHex}60`,
                    }}
                  >
                    LOS {c.congestion.los}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-[#090e18]/80 border border-slate-800/80 font-mono text-xs">
                  <div>
                    <div className="text-slate-400 text-[10px] uppercase font-sans">Kecepatan Aktual:</div>
                    <div className="text-base font-bold text-white">
                      {c.corridor.observedSpeedKmh} <span className="text-xs font-normal text-slate-400">km/j</span>
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Bebas: {c.corridor.freeFlowSpeedKmh} km/j
                    </div>
                  </div>

                  <div>
                    <div className="text-slate-400 text-[10px] uppercase font-sans">Waktu Tempuh:</div>
                    <div className="text-base font-bold text-white">
                      {c.travelTimeMinutes} <span className="text-xs font-normal text-slate-400">mnt</span>
                    </div>
                    <div className="text-[10px] text-amber-400 font-medium">
                      +{c.delayMinutes} mnt delay
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-300 mt-3 leading-relaxed font-sans">
                  {c.congestion.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>Panjang: {c.corridor.lengthKm} km ({c.corridor.lanes} Lajur)</span>
                <span>TTR: {c.congestion.travelTimeRatio}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lineage Footnote */}
      <div className="rounded-2xl border border-slate-700/60 bg-[#0e1726]/40 backdrop-blur-xl p-4 text-xs text-slate-300 flex items-start gap-3 font-mono shadow-md">
        <Info className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <span className="font-bold text-white">DATA LINEAGE:</span> Data kecepatan dan volume kendaraan merupakan hasil integrasi survei baseline berkala Dinas Perhubungan Kota Malang yang dikalibrasi menggunakan Manual Kapasitas Jalan Indonesia (PKJI 2023). Platform tidak memalsukan data streaming seluler swasta tanpa otorisasi.
        </div>
      </div>
    </div>
  );
}
