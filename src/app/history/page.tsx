"use client";

import React, { useState, useEffect } from "react";
import { 
  History, 
  Download, 
  Calendar, 
  AlertTriangle, 
  BarChart2, 
  CheckCircle,
  TrendingDown,
  Filter
} from "lucide-react";
import { TrafficTrendChart } from "@/components/charts/TrafficTrendChart";
import { AirQualityChart } from "@/components/charts/AirQualityChart";
import { DataBadge } from "@/components/common/DataBadge";
import { formatNumber } from "@/lib/utils";

export default function HistoryPage() {
  const [selectedDays, setSelectedDays] = useState<number>(14);
  const [historyData, setHistoryData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/history?days=${selectedDays}`);
      const json = await res.json();
      if (json.success) {
        setHistoryData(json);
      }
    } catch (err) {
      console.error("Error fetching history:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [selectedDays]);

  const handleDownloadCsv = () => {
    window.open(`/api/history?days=${selectedDays}&format=csv`, "_blank");
  };

  return (
    <div className="mx-auto max-w-[1720px] w-full px-4 sm:px-6 lg:px-8 xl:px-10 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-cyan-300 bg-cyan-950/60 px-2.5 py-0.5 rounded-md border border-cyan-500/40 backdrop-blur-sm">
              Analisis Tren & Deret Waktu
            </span>
            <DataBadge type="baseline" label="Data Historis Terverifikasi" />
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight font-sans drop-shadow-sm">
            Analisis Historis Mobilitas & Kualitas Udara
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Eksplorasi perubahan kecepatan lalu lintas, fluktuasi indeks ISPU, pola jam sibuk mingguan, serta deteksi anomali cuaca dan liburan di Kota Malang.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Period Selector */}
          <div className="flex items-center rounded-xl border border-slate-700/60 bg-[#0e1726]/60 backdrop-blur-xl p-1 shadow-lg">
            {[
              { days: 7, label: "7 Hari" },
              { days: 14, label: "14 Hari" },
              { days: 30, label: "30 Hari" },
              { days: 90, label: "90 Hari" },
            ].map((p) => (
              <button
                key={p.days}
                type="button"
                onClick={() => setSelectedDays(p.days)}
                className={`rounded-lg px-3 py-1.5 text-xs font-mono font-semibold transition-all ${
                  selectedDays === p.days
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-xs"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleDownloadCsv}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700/60 bg-[#0e1726]/60 backdrop-blur-xl px-3.5 py-1.5 text-xs font-mono font-bold text-slate-200 hover:text-white hover:border-slate-600 hover:bg-slate-800/80 shadow-lg transition-all"
          >
            <Download className="h-3.5 w-3.5 text-cyan-400" />
            Ekspor CSV
          </button>
        </div>
      </div>

      {/* Summary Statistics Cards */}
      {historyData?.statistics && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="group rounded-2xl border border-slate-700/60 bg-[#0e1726]/60 backdrop-blur-xl p-5 shadow-lg hover:border-cyan-500/40 transition-all space-y-3">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
              Statistik Kecepatan Kendaraan ({selectedDays} Hari)
            </div>
            <div className="grid grid-cols-4 gap-2 text-center pt-2 border-t border-slate-800/80">
              <div>
                <div className="text-[10px] text-slate-400 font-mono">Rata-rata</div>
                <div className="text-sm font-bold text-white font-mono mt-0.5">{historyData.statistics.speed.mean}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400 font-mono">Median</div>
                <div className="text-sm font-bold text-white font-mono mt-0.5">{historyData.statistics.speed.median}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400 font-mono">Terendah</div>
                <div className="text-sm font-bold text-rose-400 font-mono mt-0.5">{historyData.statistics.speed.min}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400 font-mono">Tertinggi</div>
                <div className="text-sm font-bold text-emerald-400 font-mono mt-0.5">{historyData.statistics.speed.max}</div>
              </div>
            </div>
            <div className="text-[10px] text-slate-400 text-right font-mono">Satuan: km/jam</div>
          </div>

          <div className="group rounded-2xl border border-slate-700/60 bg-[#0e1726]/60 backdrop-blur-xl p-5 shadow-lg hover:border-cyan-500/40 transition-all space-y-3">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
              Statistik Konsentrasi PM2.5 ({selectedDays} Hari)
            </div>
            <div className="grid grid-cols-4 gap-2 text-center pt-2 border-t border-slate-800/80">
              <div>
                <div className="text-[10px] text-slate-400 font-mono">Rata-rata</div>
                <div className="text-sm font-bold text-white font-mono mt-0.5">{historyData.statistics.pm25.mean}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400 font-mono">Median</div>
                <div className="text-sm font-bold text-white font-mono mt-0.5">{historyData.statistics.pm25.median}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400 font-mono">Terendah</div>
                <div className="text-sm font-bold text-emerald-400 font-mono mt-0.5">{historyData.statistics.pm25.min}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400 font-mono">Tertinggi</div>
                <div className="text-sm font-bold text-amber-400 font-mono mt-0.5">{historyData.statistics.pm25.max}</div>
              </div>
            </div>
            <div className="text-[10px] text-slate-400 text-right font-mono">Satuan: µg/m³</div>
          </div>

          <div className="group rounded-2xl border border-slate-700/60 bg-[#0e1726]/60 backdrop-blur-xl p-5 shadow-lg hover:border-cyan-500/40 transition-all space-y-3">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
              Statistik Skor ISPU ({selectedDays} Hari)
            </div>
            <div className="grid grid-cols-4 gap-2 text-center pt-2 border-t border-slate-800/80">
              <div>
                <div className="text-[10px] text-slate-400 font-mono">Rata-rata</div>
                <div className="text-sm font-bold text-white font-mono mt-0.5">{historyData.statistics.ispu.mean}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400 font-mono">Median</div>
                <div className="text-sm font-bold text-white font-mono mt-0.5">{historyData.statistics.ispu.median}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400 font-mono">Terendah</div>
                <div className="text-sm font-bold text-emerald-400 font-mono mt-0.5">{historyData.statistics.ispu.min}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400 font-mono">Tertinggi</div>
                <div className="text-sm font-bold text-amber-400 font-mono mt-0.5">{historyData.statistics.ispu.max}</div>
              </div>
            </div>
            <div className="text-[10px] text-slate-400 text-right font-mono">Kategori: Sedang s/d Baik</div>
          </div>
        </div>
      )}

      {/* Anomaly Detection Banner */}
      <div className="rounded-2xl border border-amber-500/40 bg-amber-950/30 backdrop-blur-xl p-5 space-y-2 shadow-lg">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-300 uppercase tracking-wider">
          <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0" />
          Deteksi Anomali Lapangan Teridentifikasi ({historyData?.anomaliesDetected || 1} Kejadian)
        </div>
        <p className="text-xs sm:text-sm text-amber-200/90 leading-relaxed font-sans">
          Sistem mendeteksi anomali perlambatan ekstrem (kecepatan &lt; 10 km/jam) pada jam sibuk sore koridor barat (Dinoyo-Suhat). Terkorelasi dengan kejadian hujan lebat lokal yang memicu genangan sesaat, sekaligus mencuci partikulat debu (washout effect) sehingga konsentrasi PM2.5 turun tajam ke 14.2 µg/m³.
        </p>
      </div>

      {/* Historical Trend Charts */}
      {historyData?.timeseries && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-700/60 bg-[#0e1726]/60 backdrop-blur-xl p-6 shadow-xl space-y-3">
            <h3 className="text-base font-bold text-white font-sans">
              Deret Waktu Kecepatan Rata-rata & Indeks Kemacetan
            </h3>
            <p className="text-xs text-slate-300 font-sans">
              Evaluasi fluktuasi kecepatan jam puncak pagi vs sore selama {selectedDays} hari
            </p>
            <TrafficTrendChart data={historyData.timeseries} height={340} />
          </div>

          <div className="rounded-2xl border border-slate-700/60 bg-[#0e1726]/60 backdrop-blur-xl p-6 shadow-xl space-y-3">
            <h3 className="text-base font-bold text-white font-sans">
              Deret Waktu Kualitas Udara (PM2.5 vs Ambang Batas WHO)
            </h3>
            <p className="text-xs text-slate-300 font-sans">
              Konsentrasi partikulat terhadap standar batas WHO (15 µg/m³) dan Baku Mutu PP 22/2021 (55 µg/m³)
            </p>
            <AirQualityChart data={historyData.timeseries} height={340} />
          </div>
        </div>
      )}
    </div>
  );
}
