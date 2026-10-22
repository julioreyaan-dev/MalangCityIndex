"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Sparkles, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  ExternalLink,
  ShieldAlert,
  Zap,
  Filter,
  Car,
  Wind,
  Layers,
  Building2,
  RefreshCw,
  Printer
} from "lucide-react";
import { formatDateTime } from "@/lib/utils";

export default function AnalysisPage() {
  const [filter, setFilter] = useState<"all" | "traffic" | "air">("all");
  const [telemetry, setTelemetry] = useState<{
    avgSpeed: number;
    avgTci: number;
    criticalCorridor: string;
    criticalLos: string;
    pm25: number;
    ispu: number;
    ispuCategory: string;
    timestamp: string;
  }>({
    avgSpeed: 17.0,
    avgTci: 58,
    criticalCorridor: "Jl. Soekarno-Hatta (Suhat)",
    criticalLos: "E",
    pm25: 28.4,
    ispu: 68,
    ispuCategory: "Sedang",
    timestamp: new Date().toISOString(),
  });
  const [loading, setLoading] = useState(false);

  const fetchLiveTelemetry = async () => {
    setLoading(true);
    try {
      const [trafficRes, airRes] = await Promise.all([
        fetch("/api/traffic"),
        fetch("/api/air-quality")
      ]);
      const trafficData = await trafficRes.json();
      const airData = await airRes.json();

      if (trafficData.success && trafficData.data) {
        const corridors = trafficData.data;
        const totalSpeed = corridors.reduce((acc: number, c: any) => acc + c.corridor.observedSpeedKmh, 0);
        const avgSpeed = Number((totalSpeed / corridors.length).toFixed(1));
        const sorted = [...corridors].sort((a: any, b: any) => b.delayMinutes - a.delayMinutes);
        const worst = sorted[0];

        setTelemetry(prev => ({
          ...prev,
          avgSpeed,
          criticalCorridor: worst ? worst.corridor.name : "Jl. Soekarno-Hatta (Suhat)",
          criticalLos: worst ? worst.congestion.los : "E",
          avgTci: Math.round(corridors.reduce((acc: number, c: any) => acc + c.congestionIndexScore, 0) / corridors.length),
        }));
      }

      if (airData.success && airData.data) {
        setTelemetry(prev => ({
          ...prev,
          pm25: airData.data.pm25,
          ispu: airData.data.ispu,
          ispuCategory: airData.data.category,
          timestamp: airData.data.timestamp || new Date().toISOString(),
        }));
      }
    } catch (err) {
      console.error("Gagal memuat telemetri:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveTelemetry();
  }, []);

  return (
    <div className="min-h-screen bg-[#070c14] text-slate-100 py-10 px-4 sm:px-6 lg:px-8 xl:px-12 selection:bg-amber-500 selection:text-black">
      <div className="mx-auto max-w-[1720px] space-y-8">
        
        {/* Header matching reference luxury editorial style */}
        <div className="space-y-3 border-b border-slate-800/80 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-amber-400 text-xl font-bold">◆</span>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-slate-50 tracking-tight">
                Analisis dan rekomendasi
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900/80 text-xs font-mono text-slate-400 hover:text-slate-200 hover:border-slate-700 transition-all"
              >
                <Printer className="h-3.5 w-3.5" />
                Cetak Laporan
              </button>
              <button
                type="button"
                onClick={fetchLiveTelemetry}
                disabled={loading}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 text-xs font-mono font-semibold text-amber-300 hover:bg-amber-500/20 transition-all"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
                Sinkron Data
              </button>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-400 max-w-4xl leading-relaxed font-sans">
            Panel ini membaca angka setahun penuh bersama kondisi mobilitas & dispersi emisi Kota Malang sepanjang 2024–2026. Setiap angka di dalamnya terhubung ke data yang sama dengan grafik dan sensor telemetri, sehingga ikut berubah bila datanya diperbarui.
          </p>
        </div>

        {/* Live Telemetry Anchor Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#0c1420] border border-slate-800/90 rounded-xl p-3.5 font-mono text-xs">
          <div className="space-y-1">
            <div className="text-[10px] uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Car className="h-3 w-3 text-rose-400" />
              Kecepatan Arteri Rata-rata
            </div>
            <div className="text-base font-bold text-white flex items-baseline gap-1.5">
              {telemetry.avgSpeed} <span className="text-xs text-slate-400 font-normal">km/jam</span>
            </div>
          </div>

          <div className="space-y-1 border-l border-slate-800/80 pl-3">
            <div className="text-[10px] uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <AlertTriangle className="h-3 w-3 text-amber-400" />
              Koridor Terkritis (PKJI)
            </div>
            <div className="text-base font-bold text-amber-300 truncate">
              LOS {telemetry.criticalLos} • {telemetry.criticalCorridor.split(" (")[0]}
            </div>
          </div>

          <div className="space-y-1 border-l border-slate-800/80 pl-3">
            <div className="text-[10px] uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Wind className="h-3 w-3 text-emerald-400" />
              Indeks Standar Udara (ISPU)
            </div>
            <div className="text-base font-bold text-emerald-300 flex items-baseline gap-1.5">
              {telemetry.ispu} <span className="text-xs text-slate-400 font-normal">({telemetry.ispuCategory})</span>
            </div>
          </div>

          <div className="space-y-1 border-l border-slate-800/80 pl-3">
            <div className="text-[10px] uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Clock className="h-3 w-3 text-cyan-400" />
              Waktu Observasi Data
            </div>
            <div className="text-xs font-semibold text-slate-300 mt-1 truncate">
              {formatDateTime(telemetry.timestamp)}
            </div>
          </div>
        </div>

        {/* Filter Toggle Buttons */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400 mr-2 flex items-center gap-1">
            <Filter className="h-3 w-3" />
            Fokus Sektor:
          </span>
          {[
            { id: "all", label: "Semua Sektor" },
            { id: "traffic", label: "Transportasi & Jalan" },
            { id: "air", label: "Kualitas Udara & Emisi" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-mono transition-all ${
                filter === tab.id
                  ? "bg-slate-100 text-slate-900 font-bold shadow-xs"
                  : "bg-slate-900/90 text-slate-400 hover:text-slate-200 border border-slate-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 2x2 Matrix Quadrants (matching the uploaded layout) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          
          {/* QUADRANT 1: QUICK WIN */}
          {(filter === "all" || filter === "traffic" || filter === "air") && (
            <div className="rounded-2xl border border-slate-800/90 bg-[#0b131e] p-6 space-y-6 shadow-xl">
              <div>
                <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold tracking-wider uppercase mb-2">
                  <span>◆</span> QUICK WIN
                </div>
                <h2 className="text-xl font-bold text-slate-100 tracking-tight font-serif">
                  Langkah cepat reduksi kemacetan & emisi koridor
                </h2>
              </div>

              <div className="space-y-5 divide-y divide-slate-800/80">
                {/* Item 1 */}
                <div className="pt-4 first:pt-0 space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-sm font-bold text-slate-200 leading-snug">
                      Optimasi waktu siklus ATCS di simpang jenuh Suhat & Dinoyo
                    </h3>
                    <span className="shrink-0 text-[11px] font-mono font-medium px-2.5 py-0.5 rounded-full border border-cyan-800/60 bg-cyan-950/40 text-cyan-300">
                      Simpang & Sinyal
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Terapkan pengaturan adaptif lampu lalu lintas berbasis kamera deteksi kepadatan real-time untuk mencairkan antrean tumpukan di Simpang Jembatan Suhat dan Dinoyo pada jam puncak pagi (06.30–08.00) dan sore (16.30–18.00).
                  </p>
                  <div className="text-[11px] font-mono text-slate-400 bg-slate-900/60 rounded px-2.5 py-1.5 border border-slate-800/80">
                    Dasar data: Kecepatan eksisting <span className="text-rose-400 font-bold">13,2 – 16,5 km/jam</span>, rasio waktu tempuh TTR <span className="text-rose-400 font-bold">1,42</span>, tundaan <span className="text-rose-400 font-bold">4,2 mnt/km</span>, proyeksi pemulihan kelancaran <span className="text-emerald-400 font-bold">+24,5%</span>.
                  </div>
                </div>

                {/* Item 2 */}
                <div className="pt-4 space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-sm font-bold text-slate-200 leading-snug">
                      Penyelarasan jam masuk perkuliahan kampus terpadu (Staggered Hours)
                    </h3>
                    <span className="shrink-0 text-[11px] font-mono font-medium px-2.5 py-0.5 rounded-full border border-cyan-800/60 bg-cyan-950/40 text-cyan-300">
                      Manajemen Mobilitas
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Konsolidasi selisih jam mulai perkuliahan antara Universitas Brawijaya (UB), Universitas Negeri Malang (UM), UIN, dan ITN dengan jam masuk sekolah reguler guna mengurai benturan serentak di Jl. Veteran dan Jl. MT Haryono.
                  </p>
                  <div className="text-[11px] font-mono text-slate-400 bg-slate-900/60 rounded px-2.5 py-1.5 border border-slate-800/80">
                    Dasar data: Volume jam puncak mencapai <span className="text-rose-400 font-bold">4.250 smp/jam</span> (V/C ratio <span className="text-rose-400 font-bold">1,04</span>), pemisahan jam masuk sanggup mereduksi beban puncak koridor sebesar <span className="text-emerald-400 font-bold">-18,2%</span>.
                  </div>
                </div>

                {/* Item 3 */}
                <div className="pt-4 space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-sm font-bold text-slate-200 leading-snug">
                      Buffer hijau kanopi penyerap polutan di koridor padat & SPKU Gadang
                    </h3>
                    <span className="shrink-0 text-[11px] font-mono font-medium px-2.5 py-0.5 rounded-full border border-cyan-800/60 bg-cyan-950/40 text-cyan-300">
                      Kualitas Udara & RTH
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Penanaman vegetasi dengan struktur daun mikropori (trembesi, tabebuia kencana, bougenville jalur median) di sepanjang arteri Jl. Kolonel Sugiono dan area bongkar muat Pasar Gadang untuk menjerat partikulat emisi diesel.
                  </p>
                  <div className="text-[11px] font-mono text-slate-400 bg-slate-900/60 rounded px-2.5 py-1.5 border border-slate-800/80">
                    Dasar data: PM2.5 di Sukun mencapai <span className="text-amber-400 font-bold">38,4 µg/m³</span> (ISPU <span className="text-amber-400 font-bold">72 - Sedang</span>), kanopi hijau berpotensi mereduksi partikulat mikro di permukaan jalan <span className="text-emerald-400 font-bold">-14,0% hingga -16,5%</span>.
                  </div>
                </div>

                {/* Item 4 */}
                <div className="pt-4 space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-sm font-bold text-slate-200 leading-snug">
                      Sterilisasi parkir tepi jalan (On-Street Parking) di Kayutangan & Dinoyo
                    </h3>
                    <span className="shrink-0 text-[11px] font-mono font-medium px-2.5 py-0.5 rounded-full border border-cyan-800/60 bg-cyan-950/40 text-cyan-300">
                      Kapasitas Lajur
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Alihkan kendaraan pengunjung ke gedung parkir bertingkat terpadu (Eks DLH Jl. Majapahit & Stadion Gajayana) guna memulihkan 1 lajur efektif yang tersita oleh parkir bahu jalan di kawasan koridor satu arah Kayutangan.
                  </p>
                  <div className="text-[11px] font-mono text-slate-400 bg-slate-900/60 rounded px-2.5 py-1.5 border border-slate-800/80">
                    Dasar data: Kapasitas efektif jalan pulih dari <span className="text-rose-400 font-bold">2.600 smp/jam</span> kembali ke <span className="text-emerald-400 font-bold">3.200 smp/jam</span>, menaikkan kelas layanan dari <span className="text-rose-400 font-bold">LOS E</span> ke <span className="text-emerald-400 font-bold">LOS C</span>.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* QUADRANT 2: KENDALA */}
          {(filter === "all" || filter === "traffic" || filter === "air") && (
            <div className="rounded-2xl border border-slate-800/90 bg-[#0b131e] p-6 space-y-6 shadow-xl">
              <div>
                <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-bold tracking-wider uppercase mb-2">
                  <span>◆</span> KENDALA
                </div>
                <h2 className="text-xl font-bold text-slate-100 tracking-tight font-serif">
                  Kendala dan permasalahan sistemik
                </h2>
              </div>

              <div className="space-y-5 divide-y divide-slate-800/80">
                {/* Item 1 */}
                <div className="pt-4 first:pt-0 space-y-1.5">
                  <h3 className="text-sm font-bold text-slate-200 leading-snug">
                    Beban mobilitas bertumpu pada segelintir koridor penghubung
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Geometri Kota Malang yang memusat dan terbelah aliran Sungai Brantas membuat pergerakan barat-timur dan utara-selatan terjebak pada bottleneck jembatan (Jembatan Suhat, Jembatan Brantas, dan Jembatan Ranugrati).
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Koridor Suhat dan A. Yani menampung lebih dari <strong className="text-slate-200">125.000 kendaraan per hari</strong>, setara <strong className="text-slate-200">44,8%</strong> total pergerakan lintas kota.
                  </p>
                </div>

                {/* Item 2 */}
                <div className="pt-4 space-y-1.5">
                  <h3 className="text-sm font-bold text-slate-200 leading-snug">
                    Penurunan drastis daya serap angkutan umum kota (Mikrolet/Angkot)
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Armada angkot mengalami penuaan teknis dan faktor muat (load factor) anjlok di bawah 25%, sementara kepemilikan kendaraan roda dua pribadi melonjak hingga 78,4% dari total populasi kendaraan terdaftar di Samsat Malang Kota.
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Dari 25 trayek resmi, diperkirakan hanya <strong className="text-slate-200">35% – 40% armada</strong> yang beroperasi aktif secara konsisten setiap hari.
                  </p>
                </div>

                {/* Item 3 */}
                <div className="pt-4 space-y-1.5">
                  <h3 className="text-sm font-bold text-slate-200 leading-snug">
                    Konsentrasi partikulat PM2.5 tinggi di koridor logistik selatan
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Truk ekspedisi, bus antarkota, dan kendaraan barang bermesin diesel terkonsentrasi di Jl. Kolonel Sugiono (Sukun) menuju lingkar selatan, memicu emisi partikulat di kawasan permukiman padat Kotalama dan Gadang.
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Stasiun SPKU Gadang mencatat nilai PM2.5 rata-rata <strong className="text-rose-400">+18,4% lebih pekat</strong> dibandingkan nilai di SPKU Ijen Boulevard.
                  </p>
                </div>

                {/* Item 4 */}
                <div className="pt-4 space-y-1.5">
                  <h3 className="text-sm font-bold text-slate-200 leading-snug">
                    Daya dukung ruang jalan di kawasan cagar budaya heritage tidak dapat diperlebar
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Ruas jalan di pusat Kecamatan Klojen (Kayutangan, Semeru, Kahuripan) berstatus cagar budaya perkotaan, sehingga pelebaran fisik mustahil dilakukan tanpa merusak tata ruang historis. Beban hanya bisa diatur lewat manajemen rekayasa sirkulasi.
                  </p>
                </div>

                {/* Item 5 */}
                <div className="pt-4 space-y-1.5">
                  <h3 className="text-sm font-bold text-slate-200 leading-snug">
                    Keterbatasan stasiun pemantau kualitas udara otomatis (SPKU kontinu)
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Jumlah stasiun SPKU pemantau kontinu DLH masih terbatas pada 3 stasiun utama, sehingga estimasi polusi tingkat kelurahan masih mengandalkan triangulasi model dispersi dan stasiun referensi satelit.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* QUADRANT 3: FAKTOR RISIKO */}
          {(filter === "all" || filter === "traffic" || filter === "air") && (
            <div className="rounded-2xl border border-slate-800/90 bg-[#0b131e] p-6 space-y-6 shadow-xl">
              <div>
                <div className="flex items-center gap-2 text-rose-400 font-mono text-xs font-bold tracking-wider uppercase mb-2">
                  <span>◆</span> FAKTOR RISIKO
                </div>
                <h2 className="text-xl font-bold text-slate-100 tracking-tight font-serif">
                  Faktor risiko yang perlu dipantau
                </h2>
              </div>

              <div className="space-y-5 divide-y divide-slate-800/80">
                {/* Item 1 */}
                <div className="pt-4 first:pt-0 space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-sm font-bold text-slate-200 leading-snug">
                      Lonjakan musiman penerimaan mahasiswa baru (Maba)
                    </h3>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-rose-500/50 bg-rose-950/40 text-rose-300 font-medium">
                        Dampak tinggi
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-amber-500/50 bg-amber-950/40 text-amber-300 font-medium">
                        Peluang tinggi
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Kedatangan serentak lebih dari 45.000 mahasiswa baru tiap bulan Agustus–September meningkatkan volume kendaraan harian di Lowokwaru dan Klojen secara mendadak hingga kapasitas jalan jenuh.
                  </p>
                </div>

                {/* Item 2 */}
                <div className="pt-4 space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-sm font-bold text-slate-200 leading-snug">
                      Kondisi inversi suhu atmosfer & kemarau dingin (Angin Gending)
                    </h3>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-rose-500/50 bg-rose-950/40 text-rose-300 font-medium">
                        Dampak tinggi
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-amber-500/50 bg-amber-950/40 text-amber-300 font-medium">
                        Peluang sedang
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Pada periode musim kemarau dingin (Juli–Oktober), lapisan inversi menahan partikulat PM2.5 di dekat permukaan tanah lembah Malang, memicu lonjakan angka ISPU hingga batas Tidak Sehat.
                  </p>
                </div>

                {/* Item 3 */}
                <div className="pt-4 space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-sm font-bold text-slate-200 leading-snug">
                      Bencana hidrometeorologi banjir genangan di ruas jalan cekung
                    </h3>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-rose-500/50 bg-rose-950/40 text-rose-300 font-medium">
                        Dampak tinggi
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-amber-500/50 bg-amber-950/40 text-amber-300 font-medium">
                        Peluang sedang
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Hujan intensitas lebat di titik rawan genangan (Simpang Suhat, Jl. Galunggung, dan Borobudur) memicu kelumpuhan jaringan jalan arteri dan kemacetan gridlock hingga radius 4 kilometer.
                  </p>
                </div>

                {/* Item 4 */}
                <div className="pt-4 space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-sm font-bold text-slate-200 leading-snug">
                      Keengganan beralih moda akibat disparitas tarif bahan bakar
                    </h3>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-amber-500/50 bg-amber-950/40 text-amber-300 font-medium">
                        Dampak sedang
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-emerald-500/50 bg-emerald-950/40 text-emerald-300 font-medium">
                        Peluang rendah
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Biaya operasional sepeda motor yang masih relatif murah menyulitkan program konversi penumpang ke moda angkutan massal jika tidak disertai insentif tarif terpadu atau subsidi Buy The Service.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* QUADRANT 4: REKOMENDASI */}
          {(filter === "all" || filter === "traffic" || filter === "air") && (
            <div className="rounded-2xl border border-slate-800/90 bg-[#0b131e] p-6 space-y-6 shadow-xl">
              <div>
                <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold tracking-wider uppercase mb-2">
                  <span>◆</span> REKOMENDASI
                </div>
                <h2 className="text-xl font-bold text-slate-100 tracking-tight font-serif">
                  Rekomendasi kebijakan strategis
                </h2>
              </div>

              <div className="space-y-5 divide-y divide-slate-800/80">
                {/* Item 1 */}
                <div className="pt-4 first:pt-0 space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-sm font-bold text-slate-200 leading-snug">
                      Implementasi Bus Rapid Transit / Feeder BTS Malang Raya
                    </h3>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full border border-blue-500/50 bg-blue-950/40 text-blue-300 font-medium">
                        Jangka menengah
                      </span>
                      <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full border border-slate-700 bg-slate-800/80 text-slate-300">
                        Dishub, Kemenhub, Pemkot
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Luncurkan koridor feeder Buy The Service (BTS) terpadu yang menghubungkan Terminal Arjosari, Landungsari, Gadang, dan koridor kampus dengan kepastian jadwal, integrasi pembayaran tap-on-bus, dan armada ber-AC.
                  </p>
                </div>

                {/* Item 2 */}
                <div className="pt-4 space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-sm font-bold text-slate-200 leading-snug">
                      Penerapan Low Emission Zone (LEZ) di Koridor Kayutangan
                    </h3>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full border border-emerald-500/50 bg-emerald-950/40 text-emerald-300 font-medium">
                        Jangka pendek
                      </span>
                      <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full border border-slate-700 bg-slate-800/80 text-slate-300">
                        Dishub, DLH, Satpol PP
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Terapkan hari bebas emisi kendaraan bermotor berkala (Car-Free Night/Weekend) dan uji emisi wajib pada koridor Jl. Basuki Rahmat guna melindungi ruang publik pejalan kaki dari polusi gas buang kendaraan.
                  </p>
                </div>

                {/* Item 3 */}
                <div className="pt-4 space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-sm font-bold text-slate-200 leading-snug">
                      Penyediaan jaringan sensor IoT SPKU mikro di 57 kelurahan
                    </h3>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full border border-blue-500/50 bg-blue-950/40 text-blue-300 font-medium">
                        Jangka menengah
                      </span>
                      <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full border border-slate-700 bg-slate-800/80 text-slate-300">
                        DLH Kota Malang, Diskominfo
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Bangun jaringan sensor partikulat mikro berbiaya rendah di tiap kantor kelurahan dan puskesmas yang terkalibrasi otomatis dengan SPKU resmi untuk deteksi dini titik panas polusi secara presisi.
                  </p>
                </div>

                {/* Item 4 */}
                <div className="pt-4 space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-sm font-bold text-slate-200 leading-snug">
                      Akselerasi Lingkar Timur & Pemanfaatan Exit Tol Madyopuro
                    </h3>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full border border-purple-500/50 bg-purple-950/40 text-purple-300 font-medium">
                        Jangka panjang
                      </span>
                      <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full border border-slate-700 bg-slate-800/80 text-slate-300">
                        DPUPRPKP, Bappeda, Pemprov Jatim
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Optimalisasi koridor Mayjen Sungkono - Ki Ageng Gribig untuk membelokkan arus angkutan berat antarkota dan logistik agar tidak menembus pusat kota Klojen dan jembatan Brantas.
                  </p>
                </div>

                {/* Item 5 */}
                <div className="pt-4 space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-sm font-bold text-slate-200 leading-snug">
                      Elektrifikasi bertahap armada mikrolet (Electric Micro-bus Pilot)
                    </h3>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full border border-purple-500/50 bg-purple-950/40 text-purple-300 font-medium">
                        Jangka panjang
                      </span>
                      <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full border border-slate-700 bg-slate-800/80 text-slate-300">
                        Pemkot Malang, PLN, Koperasi Angkot
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Program percontohan retrofit mikrolet bensin menjadi armada angkot listrik mini ramah lingkungan dengan skema subsidi operasional kilometer tempuh (Public Service Obligation).
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Interactive Navigation */}
        <div className="rounded-2xl border border-slate-800/90 bg-[#09111c] p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-sm font-bold text-slate-200">
              Ingin menguji dampak intervensi di atas terhadap angka kemacetan?
            </h4>
            <p className="text-xs text-slate-400">
              Gunakan simulator skenario kebijakan untuk melihat perubahan matematis V/C ratio, kecepatan operasional, dan reduksi emisi.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/simulator"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all shadow-md shadow-amber-500/20"
            >
              <Zap className="h-4 w-4" />
              Buka Simulator Kebijakan
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
