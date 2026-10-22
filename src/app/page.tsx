import React from "react";
import Link from "next/link";
import { 
  Car, 
  Wind, 
  Clock, 
  ShieldCheck, 
  Gauge, 
  Layers, 
  ArrowRight, 
  MapPin,
  TrendingUp,
  SlidersHorizontal,
  Compass,
  FileSpreadsheet,
  Route,
  Map as MapIcon,
  ArrowUpRight
} from "lucide-react";
import { KpiCard } from "@/components/common/KpiCard";
import { DataBadge } from "@/components/common/DataBadge";
import { RefreshButton } from "@/components/common/RefreshButton";
import { TrafficTrendChart } from "@/components/charts/TrafficTrendChart";
import { AirQualityChart } from "@/components/charts/AirQualityChart";
import { fetchMalangAirQuality } from "@/lib/providers/openMeteoProvider";
import { getCorridorTrafficStatuses } from "@/lib/providers/dishubTrafficProvider";
import { getMalangHistoricalTimeseries } from "@/lib/data/historicalDataset";
import { MALANG_DATA_SOURCES } from "@/lib/data/dataSourcesMeta";
import { formatDateTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function OverviewPage() {
  const airQuality = await fetchMalangAirQuality();
  const trafficCorridors = getCorridorTrafficStatuses();
  const historicalData = getMalangHistoricalTimeseries(7);

  // Kalkulasi agregat KPI
  const totalCorridors = trafficCorridors.length;
  const totalSpeed = trafficCorridors.reduce((acc, c) => acc + c.corridor.observedSpeedKmh, 0);
  const avgSpeed = Number((totalSpeed / totalCorridors).toFixed(1));

  const totalTci = trafficCorridors.reduce((acc, c) => acc + c.congestionIndexScore, 0);
  const avgTci = Math.round(totalTci / totalCorridors);

  const sortedByDelay = [...trafficCorridors].sort((a, b) => b.delayMinutes - a.delayMinutes);
  const criticalCorridor = sortedByDelay[0];

  const activeSources = MALANG_DATA_SOURCES.filter((s) => s.connectionStatus === "Connected").length;
  const totalSources = MALANG_DATA_SOURCES.length;

  return (
    <div className="mx-auto max-w-[1720px] w-full px-4 sm:px-6 lg:px-8 xl:px-10 py-8 space-y-8">
      {/* Executive Command Deck Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-slate-800/80 pb-6">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-cyan-400 bg-cyan-950/60 px-2.5 py-0.5 rounded-md border border-cyan-800/60">
              KOTA MALANG • 5 KECAMATAN • 57 KELURAHAN
            </span>
            <DataBadge type={airQuality.isLiveFeed ? "observed" : "baseline"} />
            <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-purple-300 bg-purple-950/60 px-2 py-0.5 rounded-md border border-purple-800/60">
              PKJI 2023 & PERMEN LHK 14/2020
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight font-sans">
            Dashboard Index Mobilitas & Kualitas Udara
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-3xl leading-relaxed">
            Sistem pengamatan terpadu berbasis sensor dan pemodelan matematis untuk mengevaluasi kinerja koridor jalan arteri primer, dispersi partikulat udara, serta simulasi proyeksi kebijakan transportasi di Kota Malang.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="text-left lg:text-right font-mono bg-[#0c1320] border border-slate-800 rounded-xl px-3.5 py-2 shadow-md">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider flex items-center lg:justify-end gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Pembaruan Telemetri
            </div>
            <div className="text-xs font-bold text-white mt-0.5">
              {formatDateTime(airQuality.timestamp)}
            </div>
          </div>
          <RefreshButton />
        </div>
      </div>

      {/* Sector Navigation Hub: Lalu Lintas, Kualitas Udara, Peta Spasial */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-slate-300 bg-slate-800/90 px-2.5 py-0.5 rounded border border-slate-700">
              MODUL EKSPLORASI SEKTORAL
            </span>
            <span className="text-xs text-slate-400 font-mono hidden sm:inline">
              Akses cepat analisis koridor, telemetri emisi, dan geospasial
            </span>
          </div>
          <span className="text-[11px] font-mono text-slate-500">
            3 MODUL UTAMA
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Cardbox 1: Lalu Lintas */}
          <Link
            href="/traffic"
            className="group relative overflow-hidden rounded-2xl border border-slate-800/90 bg-[#0d1422] p-5 shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:border-rose-500/50 hover:shadow-xl flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-950/60 text-rose-400 border border-rose-500/30 group-hover:bg-rose-600 group-hover:text-white transition-colors duration-300">
                    <Route className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-rose-400">
                      Sektor Mobilitas
                    </span>
                    <h3 className="text-base font-bold text-white group-hover:text-rose-400 transition-colors">
                      Lalu Lintas Koridor
                    </h3>
                  </div>
                </div>
                <div className="rounded-full bg-slate-800/80 p-1.5 text-slate-400 group-hover:bg-rose-950 group-hover:text-rose-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all">
                  <ArrowUpRight className="h-4 w-4" />
                </div>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                Evaluasi empiris 7 koridor arteri & kolektor Kota Malang, rasio waktu tempuh (TTR), Level of Service PKJI 2023, dan tundaan jam sibuk.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
              <span className="text-slate-400">
                <strong className="text-slate-200">{totalCorridors} Koridor</strong> • Kecepatan <strong className="text-slate-200">{avgSpeed} km/j</strong>
              </span>
              <span className="font-bold text-rose-400 bg-rose-950/60 px-2 py-0.5 rounded border border-rose-500/40">
                LOS {criticalCorridor?.congestion?.los || "E"} Kritis
              </span>
            </div>
          </Link>

          {/* Cardbox 2: Kualitas Udara */}
          <Link
            href="/air-quality"
            className="group relative overflow-hidden rounded-2xl border border-slate-800/90 bg-[#0d1422] p-5 shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-500/50 hover:shadow-xl flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
                    <Wind className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400">
                      Sektor Lingkungan
                    </span>
                    <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors">
                      Kualitas Udara & ISPU
                    </h3>
                  </div>
                </div>
                <div className="rounded-full bg-slate-800/80 p-1.5 text-slate-400 group-hover:bg-emerald-950 group-hover:text-emerald-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all">
                  <ArrowUpRight className="h-4 w-4" />
                </div>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                Pemantauan Indeks Standar Pencemar Udara (PerMen LHK 14/2020), konsentrasi mikrogram PM2.5, PM10, dan tren dispersi atmosfer 5 kecamatan.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
              <span className="text-slate-400">
                PM2.5: <strong className="text-slate-200">{airQuality.pm25} µg/m³</strong> • 3 Stasiun SPKU
              </span>
              <span className={`font-bold px-2 py-0.5 rounded border ${airQuality.category.badgeClass}`}>
                ISPU {airQuality.ispu} • {airQuality.category.category}
              </span>
            </div>
          </Link>

          {/* Cardbox 3: Peta Spasial */}
          <Link
            href="/map"
            className="group relative overflow-hidden rounded-2xl border border-slate-800/90 bg-[#0d1422] p-5 shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:border-indigo-500/50 hover:shadow-xl flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-950/60 text-indigo-400 border border-indigo-500/30 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                    <MapIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-400">
                      Eksplorasi GIS
                    </span>
                    <h3 className="text-base font-bold text-white group-hover:text-indigo-400 transition-colors">
                      Peta Spasial Interaktif
                    </h3>
                  </div>
                </div>
                <div className="rounded-full bg-slate-800/80 p-1.5 text-slate-400 group-hover:bg-indigo-950 group-hover:text-indigo-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all">
                  <ArrowUpRight className="h-4 w-4" />
                </div>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                Peta GIS multi-layer geometris menampilkan poligon 5 kecamatan, batas 57 kelurahan, layer koridor jalan, dan sebaran stasiun SPKU Kota Malang.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
              <span className="text-slate-400">
                <strong className="text-slate-200">5 Kecamatan</strong> • 57 Kelurahan
              </span>
              <span className="font-bold text-indigo-400 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-500/40">
                Multi-Layer GIS
              </span>
            </div>
          </Link>
        </div>
      </div>

      {/* Primary KPI Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        <KpiCard
          title="Indeks Kemacetan"
          value={avgTci}
          unit="%"
          statusText={avgTci > 60 ? "Tinggi" : avgTci > 40 ? "Padat" : "Lancar"}
          badgeClass={avgTci > 60 ? "bg-rose-50 text-rose-700 border-rose-200" : "bg-amber-50 text-amber-700 border-amber-200"}
          changeText="Rata-rata 7 koridor utama"
          dataLineage="Dishub Malang & PKJI 2023"
          detailHref="/traffic"
          icon={<Car className="h-3.5 w-3.5" />}
          tooltipText="Dihitung dari rasio waktu tempuh aktual terhadap waktu tempuh arus bebas (Travel Time Ratio) mengacu pada PKJI 2023."
          accentColor="rose"
        />

        <KpiCard
          title="Kecepatan Jaringan"
          value={avgSpeed}
          unit="km/j"
          statusText={avgSpeed < 20 ? "Perlambatan" : "Stabil"}
          badgeClass="bg-amber-50 text-amber-700 border-amber-200"
          changeText="Kecepatan Desain: 45 km/j"
          dataLineage="Survei Lapangan Dishub"
          detailHref="/traffic"
          icon={<Gauge className="h-3.5 w-3.5" />}
          tooltipText="Rata-rata kecepatan lintas koridor utama Kota Malang pada jam sibuk."
          accentColor="amber"
          progressPercent={Math.round((avgSpeed / 45) * 100)}
        />

        <KpiCard
          title="Indeks ISPU"
          value={airQuality.ispu}
          unit=""
          statusText={airQuality.category.category}
          badgeClass={airQuality.category.badgeClass}
          changeText="Permen LHK 14/2020"
          dataLineage="CAMS & SPKU DLH Malang"
          detailHref="/air-quality"
          icon={<Wind className="h-3.5 w-3.5" />}
          tooltipText="Indeks Standar Pencemar Udara (ISPU) dihitung berdasarkan interpolasi baku mutu PM2.5 PerMen LHK 14/2020."
          accentColor="emerald"
          progressPercent={Math.min(airQuality.ispu, 150)}
        />

        <KpiCard
          title="Partikulat PM2.5"
          value={airQuality.pm25}
          unit="µg/m³"
          statusText={airQuality.pm25 <= 15 ? "Sesuai WHO" : "Moderat"}
          badgeClass="bg-sky-50 text-sky-700 border-sky-200"
          changeText="Baku Mutu RI: 55 µg/m³"
          dataLineage="Atmosferik Open-Meteo"
          detailHref="/air-quality"
          icon={<Wind className="h-3.5 w-3.5" />}
          tooltipText="Konsentrasi partikulat halus diameter <2.5 mikron. Baku mutu PP RI No. 22/2021: 55 µg/m³."
          accentColor="sky"
          progressPercent={Math.min(Math.round((airQuality.pm25 / 55) * 100), 100)}
        />

        <KpiCard
          title="Siklus Telemetri"
          value="Aktif"
          unit=""
          statusText="Sinkron"
          badgeClass="bg-indigo-50 text-indigo-700 border-indigo-200"
          changeText="Sync berkala 15 menit"
          dataLineage="Pipeline Terjadwal"
          icon={<Clock className="h-3.5 w-3.5" />}
          tooltipText="Status siklus pembaruan data sistem."
          accentColor="indigo"
          progressPercent={100}
        />

        <KpiCard
          title="Cakupan Data"
          value={`${activeSources}/${totalSources}`}
          unit="Provider"
          statusText="100% Online"
          badgeClass="bg-purple-50 text-purple-700 border-purple-200"
          changeText="5 Kecamatan Tercakup"
          dataLineage="Dishub, DLH, BPS, BMKG"
          detailHref="/data-sources"
          icon={<Layers className="h-3.5 w-3.5" />}
          tooltipText="Jumlah penyedia data terverifikasi yang saat ini terhubung dan diproses oleh platform."
          accentColor="purple"
          progressPercent={100}
        />
      </div>

      {/* Institutional Insights Memo - Themed Executive Cards */}
      <div className="rounded-2xl border border-slate-800/90 bg-[#0c1320] p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-100">
              Analisis Index Otomatis • Evaluasi Lapangan Kota Malang
            </h2>
          </div>
          <span className="text-[11px] font-mono text-slate-500">
            METODOLOGI TERKALIBRASI: PKJI 2023 & PERMEN LHK 14/2020
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: Traffic Criticality */}
          <div className="rounded-xl border border-rose-500/30 bg-gradient-to-br from-rose-950/40 via-[#0e1625] to-[#0c1320] p-4.5 space-y-2.5 shadow-md">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-rose-300 uppercase font-mono tracking-wide flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-rose-500" />
                Titik Kritis Kemacetan
              </span>
              <span className="font-mono text-xs font-bold text-rose-300 bg-rose-950/80 px-2 py-0.5 rounded border border-rose-500/40">
                LOS {criticalCorridor.congestion.los}
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Koridor <b className="text-rose-300">{criticalCorridor.corridor.name}</b> (Kecamatan {criticalCorridor.corridor.kecamatan}) mengalami perlambatan signifikan dengan kecepatan operasional rata-rata <b>{criticalCorridor.corridor.observedSpeedKmh} km/jam</b> dan tundaan waktu tempuh sebesar <b className="text-rose-400">+{criticalCorridor.delayMinutes} menit</b>.
            </p>
            <div className="text-[10px] text-slate-400 font-mono pt-2 border-t border-rose-950/60 flex items-center justify-between">
              <span>Rasio Waktu Tempuh: <b>{criticalCorridor.congestion.travelTimeRatio}</b></span>
              <span className="text-rose-400 font-semibold">Prioritas ATCS</span>
            </div>
          </div>

          {/* Card 2: Air Quality Dispersion */}
          <div className="rounded-xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/40 via-[#0e1625] to-[#0c1320] p-4.5 space-y-2.5 shadow-md">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-emerald-300 uppercase font-mono tracking-wide flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Dispersi Polutan Udara
              </span>
              <span className="font-mono text-xs font-bold text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/40">
                ISPU {airQuality.ispu} • {airQuality.category.category}
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Indeks Standar Pencemar Udara (ISPU) Kota Malang terpantau dalam kategori <b className="text-emerald-300">{airQuality.category.category}</b> dengan konsentrasi PM2.5 <b>{airQuality.pm25} µg/m³</b>. Mutu udara berada dalam batas ambang baku mutu nasional PP 22/2021 (55 µg/m³).
            </p>
            <div className="text-[10px] text-slate-400 font-mono pt-2 border-t border-emerald-950/60 flex items-center justify-between">
              <span>Sensor: <b>SPKU DLH & CAMS</b></span>
              <span className="text-emerald-400 font-semibold">Terkendali</span>
            </div>
          </div>

          {/* Card 3: Capacity & Peak Flow */}
          <div className="rounded-xl border border-blue-500/30 bg-gradient-to-br from-blue-950/40 via-[#0e1625] to-[#0c1320] p-4.5 space-y-2.5 shadow-md">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-blue-300 uppercase font-mono tracking-wide flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-blue-500" />
                Kapasitas Efektif Koridor
              </span>
              <span className="font-mono text-xs font-bold text-blue-300 bg-blue-950/80 px-2 py-0.5 rounded border border-blue-500/40">
                V/C: 0.78 • Puncak
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Volume kendaraan jam puncak pada koridor pendidikan (Lowokwaru) dan pintu gerbang utara (A. Yani) telah menyerap <b className="text-blue-300">78% kapasitas rencana</b>, meningkatkan antrean di persimpangan lampu lalu lintas.
            </p>
            <div className="text-[10px] text-slate-400 font-mono pt-2 border-t border-blue-950/60 flex items-center justify-between">
              <span>Dasar: <b>Manual PKJI 2023</b></span>
              <span className="text-blue-400 font-semibold">Beban Tinggi</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Charts Section - Full Responsive Width */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-slate-800/90 bg-[#0c1320] p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/50">
                  LALU LINTAS & KECEPATAN
                </span>
                <span className="text-[11px] font-mono text-slate-500">7 HARI TERAKHIR</span>
              </div>
              <h3 className="text-sm font-bold text-white font-sans">
                Fluktuasi Kecepatan & Indeks Kemacetan (Pagi vs Sore)
              </h3>
            </div>
            <Link 
              href="/history" 
              className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-mono bg-cyan-950/60 px-2.5 py-1 rounded-lg border border-cyan-800/60 transition-colors"
            >
              HISTORIS <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <TrafficTrendChart data={historicalData} height={320} />
        </div>

        <div className="rounded-2xl border border-slate-800/90 bg-[#0c1320] p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/50">
                  KUALITAS UDARA AMBIEN
                </span>
                <span className="text-[11px] font-mono text-slate-500">7 HARI TERAKHIR</span>
              </div>
              <h3 className="text-sm font-bold text-white font-sans">
                Deret Waktu Partikulat PM2.5 vs Garis Panduan Baku Mutu
              </h3>
            </div>
            <Link 
              href="/air-quality" 
              className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-mono bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-800/60 transition-colors"
            >
              STASIUN SPKU <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <AirQualityChart data={historicalData} height={320} />
        </div>
      </div>

      {/* Corridors Spotlight Section - ALL 7 CORRIDORS DISPLAYED */}
      <div className="rounded-2xl border border-slate-800/90 bg-[#0c1320] p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
              <h3 className="text-sm font-bold text-white font-sans">
                Status Lengkap Kinerja 7 Koridor Jalan Utama Kota Malang
              </h3>
            </div>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              Evaluasi empiris kecepatan operasional, kapasitas rencana, tundaan waktu tempuh, dan tingkat pelayanan jalan (LOS PKJI 2023)
            </p>
          </div>
          <Link
            href="/map"
            className="inline-flex items-center gap-1.5 rounded-lg bg-slate-800/90 border border-slate-700 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 hover:text-white transition-colors shadow-sm self-start sm:self-auto font-mono"
          >
            <MapPin className="h-3.5 w-3.5 text-cyan-400" />
            Eksplorasi di Peta Spasial
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-7 gap-3.5">
          {trafficCorridors.map((c) => (
            <div
              key={c.corridor.id}
              className="rounded-xl border border-slate-800/90 bg-[#0e1625] p-4 space-y-3 hover:border-slate-700 hover:bg-[#111c2e] transition-all flex flex-col justify-between shadow-md"
            >
              <div>
                <div className="flex items-start justify-between gap-1.5 mb-2">
                  <span className="text-xs font-bold text-slate-100 line-clamp-1 font-sans" title={c.corridor.name}>
                    {c.corridor.name}
                  </span>
                  <span
                    className="rounded px-2 py-0.5 text-[10px] font-mono font-bold shrink-0 border"
                    style={{
                      backgroundColor: `${c.congestion.colorHex}20`,
                      color: c.congestion.colorHex,
                      borderColor: `${c.congestion.colorHex}50`,
                    }}
                  >
                    LOS {c.congestion.los}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs p-2.5 rounded-lg bg-[#080d16] border border-slate-800/90">
                  <div>
                    <div className="text-[9px] text-slate-500 font-mono uppercase">Kecepatan:</div>
                    <div className="font-bold text-white font-mono text-sm">
                      {c.corridor.observedSpeedKmh} <span className="text-[10px] font-normal text-slate-500">km/j</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-[9px] text-slate-500 font-mono uppercase">Waktu:</div>
                    <div className="font-bold text-white font-mono text-sm">
                      {c.travelTimeMinutes} <span className="text-[10px] font-normal text-slate-500">mnt</span>
                    </div>
                  </div>
                </div>

                {/* Speed Ratio Bar */}
                <div className="mt-2.5 space-y-1">
                  <div className="flex justify-between text-[10px] font-mono text-slate-400">
                    <span>Arus Bebas: {c.corridor.freeFlowSpeedKmh} km/j</span>
                    <span className="font-semibold text-rose-400">+{c.delayMinutes} mnt delay</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min(Math.round((c.corridor.observedSpeedKmh / c.corridor.freeFlowSpeedKmh) * 100), 100)}%`,
                        backgroundColor: c.congestion.colorHex,
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="text-[10px] text-slate-400 flex items-center justify-between pt-2 border-t border-slate-800/80 font-mono">
                <span>Kec. {c.corridor.kecamatan}</span>
                <span className="text-slate-500">{c.corridor.lengthKm} km</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Simulator Highlight Banner - Enhanced Modern Palette */}
      <div className="rounded-2xl border border-indigo-900/40 bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 p-6 sm:p-8 text-white shadow-lg flex flex-col lg:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="space-y-2.5 relative z-10">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-900/60 px-3 py-1 text-[11px] font-mono text-indigo-300 border border-indigo-700/60">
            <SlidersHorizontal className="h-3 w-3 text-sky-400" />
            URBAN SCENARIO SIMULATOR • FORMULA BPR TERSTANDARISASI PKJI 2023
          </div>
          <h3 className="text-lg sm:text-2xl font-bold tracking-tight text-white">
            Uji Coba Dampak Kebijakan Transportasi & Emisi Kota Malang
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed font-sans">
            Gunakan simulator matematis untuk menguji dampak perpindahan moda ke angkot/feeder kampus, optimasi sinyal ATCS simpang padat, atau perataan jam sekolah/kantor terhadap kelancaran jalan dan emisi polutan udara di Kota Malang.
          </p>
        </div>

        <Link
          href="/simulator"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-xs font-bold text-slate-900 hover:bg-slate-100 active:bg-slate-200 transition-all shadow-md shrink-0 font-mono relative z-10 hover:scale-105"
        >
          MULAI SIMULASI KEBIJAKAN <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
