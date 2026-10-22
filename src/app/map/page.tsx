"use client";

import React, { useState, useEffect } from "react";
import { 
  Map as MapIcon, 
  Layers, 
  MapPin, 
  Wind, 
  Bus, 
  ShieldCheck,
  Maximize2,
  Info,
  Compass
} from "lucide-react";
import { MapLibreView } from "@/components/map/MapLibreView";
import { DataBadge } from "@/components/common/DataBadge";
import { RefreshButton } from "@/components/common/RefreshButton";

export default function UrbanMapPage() {
  const [layersData, setLayersData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedEntity, setSelectedEntity] = useState<any>(null);

  const fetchLayers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/map/layers");
      const json = await res.json();
      if (json.success) {
        setLayersData(json.layers);
      }
    } catch (err) {
      console.error("Error fetching map layers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLayers();
  }, []);

  return (
    <div className="mx-auto max-w-[1720px] w-full px-4 sm:px-6 lg:px-8 xl:px-10 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded border border-slate-200">
              SISTEM INFORMASI GEOSPASIAL (GIS)
            </span>
            <DataBadge type="reference" label="ESRI ARCGIS & OPENSTREETMAP" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
            Peta Geospasial Spasial Kota Malang
          </h1>
          <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
            Eksplorasi spasial interaktif multi-lapisan untuk menganalisis kepadatan koridor kemacetan, sebaran stasiun SPKU, batas wilayah 5 kecamatan, dan jaringan trayek mikrolet.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <RefreshButton onRefresh={fetchLayers} />
        </div>
      </div>

      {/* Main Map Frame */}
      <div className="relative">
        <MapLibreView
          roadGeoJson={layersData?.roads}
          airStationsGeoJson={layersData?.airStations}
          kecamatanGeoJson={layersData?.kecamatans}
          transitGeoJson={layersData?.transitRoutes}
          height={640}
          onSelectEntity={(entity) => setSelectedEntity(entity)}
        />
      </div>

      {/* Spatial Reference Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-2xs space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-slate-500">
            <MapPin className="h-4 w-4 text-slate-700" />
            Koridor Terpantau
          </div>
          <div className="text-xl font-extrabold text-slate-900 font-mono">7 Koridor Utama</div>
          <div className="text-[11px] text-slate-400 font-mono">Total panjang 18.1 km arteri & kolektor</div>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-2xs space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-slate-500">
            <Wind className="h-4 w-4 text-slate-700" />
            Stasiun SPKU
          </div>
          <div className="text-xl font-extrabold text-slate-900 font-mono">4 Stasiun Fisik</div>
          <div className="text-[11px] text-slate-400 font-mono">Alun-Alun, Ijen, Suhat, dan Gadang</div>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-2xs space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-slate-500">
            <Layers className="h-4 w-4 text-slate-700" />
            Wilayah Kecamatan
          </div>
          <div className="text-xl font-extrabold text-slate-900 font-mono">5 Wilayah (57 Kel.)</div>
          <div className="text-[11px] text-slate-400 font-mono">Luas daratan total 110.06 km² (BPS)</div>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-2xs space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-slate-500">
            <Bus className="h-4 w-4 text-slate-700" />
            Trayek Angkutan Kota
          </div>
          <div className="text-xl font-extrabold text-slate-900 font-mono">4 Rute (AL, LDG, GL, ABG)</div>
          <div className="text-[11px] text-slate-400 font-mono">Koneksi Arjosari, Landungsari, Gadang</div>
        </div>
      </div>
    </div>
  );
}
