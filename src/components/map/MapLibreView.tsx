"use client";

import React, { useEffect, useRef, useState } from "react";
import * as maplibregl from "maplibre-gl";
import { 
  Layers, 
  RotateCcw, 
  Info,
  Route,
  Activity
} from "lucide-react";

// Ensure web worker resolves from public folder to fix bundler worker error
if (typeof window !== "undefined") {
  (maplibregl as any).config.WORKER_URL = "/maplibre-gl-worker.mjs";
}

interface MapLibreViewProps {
  roadGeoJson?: any;
  airStationsGeoJson?: any;
  kecamatanGeoJson?: any;
  transitGeoJson?: any;
  height?: string | number;
  selectedEntityId?: string;
  onSelectEntity?: (entity: { type: "corridor" | "station" | "kecamatan"; data: any }) => void;
}

type BasemapStyle = "light_gray" | "streets" | "satellite";

export function MapLibreView({
  roadGeoJson,
  airStationsGeoJson,
  kecamatanGeoJson,
  transitGeoJson,
  height = "580px",
  selectedEntityId,
  onSelectEntity,
}: MapLibreViewProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);

  // Basemap style switcher
  const [currentBasemap, setCurrentBasemap] = useState<BasemapStyle>("light_gray");

  // Layer visibility toggles
  const [showRoads, setShowRoads] = useState(true);
  const [showAirStations, setShowAirStations] = useState(true);
  const [showKecamatans, setShowKecamatans] = useState(true);
  const [showTransit, setShowTransit] = useState(false);
  const [selectedFeatureInfo, setSelectedFeatureInfo] = useState<any>(null);

  const MALANG_CENTER: [number, number] = [112.6304, -7.9839];

  const getBasemapTiles = (style: BasemapStyle) => {
    switch (style) {
      case "light_gray":
        return [
          "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}",
        ];
      case "streets":
        return [
          "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
        ];
      case "satellite":
        return [
          "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        ];
    }
  };

  // Helper function to safely add or update GeoJSON sources
  const updateGeoJsonLayers = (map: maplibregl.Map) => {
    if (!map.isStyleLoaded()) return;

    // 1. Batas Kecamatan
    if (kecamatanGeoJson) {
      const src = map.getSource("kecamatans-src") as maplibregl.GeoJSONSource | undefined;
      if (src) {
        src.setData(kecamatanGeoJson);
      } else {
        map.addSource("kecamatans-src", { type: "geojson", data: kecamatanGeoJson });
        map.addLayer({
          id: "kecamatans-fill",
          type: "fill",
          source: "kecamatans-src",
          paint: { "fill-color": "#0284c7", "fill-opacity": 0.04 },
        });
        map.addLayer({
          id: "kecamatans-line",
          type: "line",
          source: "kecamatans-src",
          paint: { "line-color": "#475569", "line-width": 1.2, "line-dasharray": [4, 3], "line-opacity": 0.6 },
        });
      }
    }

    // 2. Rute Transit (Angkot)
    if (transitGeoJson) {
      const src = map.getSource("transit-src") as maplibregl.GeoJSONSource | undefined;
      if (src) {
        src.setData(transitGeoJson);
      } else {
        map.addSource("transit-src", { type: "geojson", data: transitGeoJson });
        map.addLayer({
          id: "transit-line",
          type: "line",
          source: "transit-src",
          layout: { visibility: showTransit ? "visible" : "none" },
          paint: { "line-color": ["get", "color"], "line-width": 2.5, "line-dasharray": [3, 2], "line-opacity": 0.85 },
        });
      }
    }

    // 3. Koridor Jalan (Roads)
    if (roadGeoJson) {
      const src = map.getSource("roads-src") as maplibregl.GeoJSONSource | undefined;
      if (src) {
        src.setData(roadGeoJson);
      } else {
        map.addSource("roads-src", { type: "geojson", data: roadGeoJson });
        map.addLayer({
          id: "roads-casing",
          type: "line",
          source: "roads-src",
          layout: { 
            visibility: showRoads ? "visible" : "none",
            "line-join": "round",
            "line-cap": "round",
          },
          paint: { "line-color": "#0f172a", "line-width": 12, "line-opacity": 0.12 },
        });
        map.addLayer({
          id: "roads-line",
          type: "line",
          source: "roads-src",
          layout: { 
            visibility: showRoads ? "visible" : "none",
            "line-join": "round",
            "line-cap": "round",
          },
          paint: { "line-color": ["get", "color"], "line-width": 5, "line-opacity": 0.95 },
        });

        const handleRoadClick = (e: any) => {
          if (e.features && e.features[0]) {
            const props = e.features[0].properties;
            setSelectedFeatureInfo({ type: "corridor", ...props });
            if (onSelectEntity) onSelectEntity({ type: "corridor", data: props });
          }
        };

        map.on("click", "roads-line", handleRoadClick);
        map.on("click", "roads-casing", handleRoadClick);
        map.on("mouseenter", "roads-line", () => { map.getCanvas().style.cursor = "pointer"; });
        map.on("mouseenter", "roads-casing", () => { map.getCanvas().style.cursor = "pointer"; });
        map.on("mouseleave", "roads-line", () => { map.getCanvas().style.cursor = ""; });
        map.on("mouseleave", "roads-casing", () => { map.getCanvas().style.cursor = ""; });
      }
    }

    // 4. Stasiun Kualitas Udara (SPKU Points)
    if (airStationsGeoJson) {
      const src = map.getSource("air-stations-src") as maplibregl.GeoJSONSource | undefined;
      if (src) {
        src.setData(airStationsGeoJson);
      } else {
        map.addSource("air-stations-src", { type: "geojson", data: airStationsGeoJson });
        map.addLayer({
          id: "air-stations-glow",
          type: "circle",
          source: "air-stations-src",
          layout: { visibility: showAirStations ? "visible" : "none" },
          paint: { "circle-radius": 18, "circle-color": ["get", "color"], "circle-opacity": 0.25 },
        });
        map.addLayer({
          id: "air-stations-point",
          type: "circle",
          source: "air-stations-src",
          layout: { visibility: showAirStations ? "visible" : "none" },
          paint: { "circle-radius": 7.5, "circle-color": ["get", "color"], "circle-stroke-width": 2.5, "circle-stroke-color": "#ffffff" },
        });

        const handleStationClick = (e: any) => {
          if (e.features && e.features[0]) {
            const props = e.features[0].properties;
            setSelectedFeatureInfo({ type: "station", ...props });
            if (onSelectEntity) onSelectEntity({ type: "station", data: props });
          }
        };

        map.on("click", "air-stations-point", handleStationClick);
        map.on("click", "air-stations-glow", handleStationClick);
        map.on("mouseenter", "air-stations-point", () => { map.getCanvas().style.cursor = "pointer"; });
        map.on("mouseenter", "air-stations-glow", () => { map.getCanvas().style.cursor = "pointer"; });
        map.on("mouseleave", "air-stations-point", () => { map.getCanvas().style.cursor = ""; });
        map.on("mouseleave", "air-stations-glow", () => { map.getCanvas().style.cursor = ""; });
      }
    }
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: {
        version: 8,
        sources: {
          "basemap-base": {
            type: "raster",
            tiles: getBasemapTiles(currentBasemap),
            tileSize: 256,
            attribution: '&copy; Esri, HERE, Garmin, OpenStreetMap contributors',
          },
          "basemap-labels": {
            type: "raster",
            tiles: [
              "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}",
            ],
            tileSize: 256,
          },
        },
        layers: [
          {
            id: "basemap-tiles",
            type: "raster",
            source: "basemap-base",
            minzoom: 0,
            maxzoom: 19,
          },
        ],
      },
      center: MALANG_CENTER,
      zoom: 12.35,
      maxZoom: 18,
      minZoom: 10,
    });

    map.addControl(new maplibregl.NavigationControl({ showCompass: true }), "top-right");

    map.on("load", () => {
      updateGeoJsonLayers(map);
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [currentBasemap]);

  // Synchronize GeoJSON data whenever props update
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (map.isStyleLoaded()) {
      updateGeoJsonLayers(map);
    } else {
      map.once("load", () => {
        updateGeoJsonLayers(map);
      });
    }
  }, [roadGeoJson, airStationsGeoJson, kecamatanGeoJson, transitGeoJson]);

  // Handle Layer Visibility Toggles
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;

    if (map.getLayer("roads-line")) {
      map.setLayoutProperty("roads-line", "visibility", showRoads ? "visible" : "none");
      map.setLayoutProperty("roads-casing", "visibility", showRoads ? "visible" : "none");
    }
    if (map.getLayer("air-stations-point")) {
      map.setLayoutProperty("air-stations-point", "visibility", showAirStations ? "visible" : "none");
      map.setLayoutProperty("air-stations-glow", "visibility", showAirStations ? "visible" : "none");
    }
    if (map.getLayer("kecamatans-fill")) {
      map.setLayoutProperty("kecamatans-fill", "visibility", showKecamatans ? "visible" : "none");
      map.setLayoutProperty("kecamatans-line", "visibility", showKecamatans ? "visible" : "none");
    }
    if (map.getLayer("transit-line")) {
      map.setLayoutProperty("transit-line", "visibility", showTransit ? "visible" : "none");
    }
  }, [showRoads, showAirStations, showKecamatans, showTransit]);

  const handleResetView = () => {
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: MALANG_CENTER,
        zoom: 12.35,
        essential: true,
      });
    }
  };

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-slate-200/90 bg-slate-900 shadow-md">
      {/* Map Canvas */}
      <div
        ref={mapContainerRef}
        style={{
          width: "100%",
          height: typeof height === "number" ? `${height}px` : height,
        }}
      />

      {/* Floating Precision Toolbar */}
      <div className="absolute top-3 left-3 z-10 flex flex-wrap items-center gap-1.5 rounded-xl bg-white/95 p-1.5 shadow-sm border border-slate-200/80 backdrop-blur-md text-xs">
        <div className="flex items-center gap-1.5 font-bold text-slate-800 px-2 py-1 border-r border-slate-200 mr-1">
          <Layers className="h-3.5 w-3.5 text-slate-600" />
          <span className="text-[11px] font-mono tracking-tight uppercase">Layer</span>
        </div>

        <button
          type="button"
          onClick={() => setShowRoads(!showRoads)}
          className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-semibold transition-all ${
            showRoads ? "bg-slate-900 text-white shadow-2xs" : "bg-slate-100 text-slate-400 hover:text-slate-600"
          }`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${showRoads ? "bg-emerald-400" : "bg-slate-300"}`} />
          Koridor Jalan
        </button>

        <button
          type="button"
          onClick={() => setShowAirStations(!showAirStations)}
          className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-semibold transition-all ${
            showAirStations ? "bg-slate-900 text-white shadow-2xs" : "bg-slate-100 text-slate-400 hover:text-slate-600"
          }`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${showAirStations ? "bg-sky-400" : "bg-slate-300"}`} />
          Stasiun SPKU
        </button>

        <button
          type="button"
          onClick={() => setShowKecamatans(!showKecamatans)}
          className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-semibold transition-all ${
            showKecamatans ? "bg-slate-900 text-white shadow-2xs" : "bg-slate-100 text-slate-400 hover:text-slate-600"
          }`}
        >
          Batas Kecamatan
        </button>

        <button
          type="button"
          onClick={() => setShowTransit(!showTransit)}
          className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-semibold transition-all ${
            showTransit ? "bg-slate-900 text-white shadow-2xs" : "bg-slate-100 text-slate-400 hover:text-slate-600"
          }`}
        >
          Trayek Angkot
        </button>

        <div className="h-4 w-px bg-slate-200 mx-0.5" />

        {/* Basemap Switcher */}
        <select
          value={currentBasemap}
          onChange={(e) => setCurrentBasemap(e.target.value as BasemapStyle)}
          className="rounded-lg bg-slate-100 px-2 py-1 font-semibold text-slate-700 text-xs border-0 outline-none cursor-pointer hover:bg-slate-200 transition-colors"
          title="Ganti gaya basemap"
        >
          <option value="light_gray">Minimalist Slate</option>
          <option value="streets">Street Detail</option>
          <option value="satellite">Satellite View</option>
        </select>

        <button
          type="button"
          onClick={handleResetView}
          className="flex items-center gap-1 rounded-lg bg-slate-100 hover:bg-slate-200 px-2.5 py-1 text-slate-700 font-semibold transition-colors"
          title="Pusatkan kembali ke Kota Malang"
        >
          <RotateCcw className="h-3 w-3 text-slate-500" />
          Malang
        </button>
      </div>

      {/* Selected Feature Info Box */}
      {selectedFeatureInfo && (
        <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-md z-10 rounded-xl bg-white/95 p-5 shadow-xl border border-slate-200/90 backdrop-blur-md animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-start justify-between gap-3 mb-3 pb-2 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-slate-400">
                {selectedFeatureInfo.type === "corridor" ? "INSPEKTOR KORIDOR LALU LINTAS" : "INSPEKTOR STASIUN LINGKUNGAN"}
              </span>
              <h4 className="text-base font-bold text-slate-900 leading-tight mt-0.5">
                {selectedFeatureInfo.name}
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Wilayah Kecamatan {selectedFeatureInfo.kecamatan}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSelectedFeatureInfo(null)}
              className="text-slate-400 hover:text-slate-600 text-xs font-bold p-1 rounded-md hover:bg-slate-100 transition-colors"
            >
              ✕
            </button>
          </div>

          {selectedFeatureInfo.type === "corridor" ? (
            <div className="space-y-2 text-xs">
              <div className="grid grid-cols-2 gap-2 p-2 rounded-lg bg-slate-50 font-mono">
                <div>
                  <div className="text-[10px] text-slate-400 font-sans">Kinerja (LOS):</div>
                  <div className="font-bold text-slate-900 text-sm">
                    Level {selectedFeatureInfo.los} ({selectedFeatureInfo.statusLabel})
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 font-sans">Kecepatan Aktual:</div>
                  <div className="font-bold text-slate-900 text-sm">
                    {selectedFeatureInfo.observedSpeedKmh} km/jam
                  </div>
                </div>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-100 text-slate-600">
                <span>Kecepatan Arus Bebas:</span>
                <span className="font-mono font-semibold text-slate-900">{selectedFeatureInfo.freeFlowSpeedKmh} km/jam</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 text-slate-600">
                <span>Waktu Tempuh & Tundaan:</span>
                <span className="font-mono font-semibold text-slate-900">
                  {selectedFeatureInfo.travelTimeMinutes} mnt (+{selectedFeatureInfo.delayMinutes} mnt)
                </span>
              </div>
              <div className="flex justify-between py-1 text-slate-600">
                <span>Klasifikasi Jalan:</span>
                <span className="font-medium text-slate-800">{selectedFeatureInfo.roadClass} ({selectedFeatureInfo.lengthKm} km)</span>
              </div>
            </div>
          ) : (
            <div className="space-y-2 text-xs">
              <div className="grid grid-cols-2 gap-2 p-2 rounded-lg bg-slate-50 font-mono">
                <div>
                  <div className="text-[10px] text-slate-400 font-sans">Skor ISPU:</div>
                  <div className="font-bold text-slate-900 text-base">
                    {selectedFeatureInfo.ispu} <span className="text-xs font-sans font-normal text-slate-500">({selectedFeatureInfo.category})</span>
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 font-sans">PM2.5:</div>
                  <div className="font-bold text-slate-900 text-base">
                    {selectedFeatureInfo.pm25} <span className="text-xs font-sans font-normal text-slate-500">µg/m³</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-100 text-slate-600">
                <span>Kode Stasiun:</span>
                <span className="font-mono font-semibold text-slate-800">{selectedFeatureInfo.code}</span>
              </div>
              <div className="flex justify-between py-1 text-slate-600">
                <span>Otoritas Pengelola:</span>
                <span className="font-medium text-slate-800">{selectedFeatureInfo.authority}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Minimalist Professional Map Legend */}
      <div className="absolute bottom-4 right-4 z-10 hidden sm:block rounded-xl bg-white/95 p-3.5 shadow-md border border-slate-200/80 text-xs backdrop-blur-md">
        <div className="font-mono text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-2">
          Level of Service (PKJI)
        </div>
        <div className="space-y-1.5 font-medium">
          <div className="flex items-center gap-2">
            <span className="h-2 w-6 rounded-xs bg-[#10b981]" />
            <span className="text-slate-700">LOS A/B • Lancar (&gt;25 km/j)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-6 rounded-xs bg-[#f59e0b]" />
            <span className="text-slate-700">LOS C • Arus Ramai Terkendali</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-6 rounded-xs bg-[#f97316]" />
            <span className="text-slate-700">LOS D • Padat Mendekati Jenuh</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-6 rounded-xs bg-[#e11d48]" />
            <span className="text-slate-700">LOS E/F • Macet Kritis/Jenuh</span>
          </div>
        </div>
      </div>
    </div>
  );
}
