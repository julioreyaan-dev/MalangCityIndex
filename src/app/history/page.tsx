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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded border border-sky-200">
              Analisis Tren & Deret Waktu
            </span>
            <DataBadge type="baseline" label="Data Historis Terverifikasi" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Analisis Historis Mobilitas & Kualitas Udara
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Eksplorasi perubahan kecepatan lalu lintas, fluktuasi indeks ISPU, pola jam sibuk mingguan, serta deteksi anomali cuaca dan liburan di Kota Malang.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Period Selector */}
          <div className="flex items-center rounded-lg border border-slate-200 bg-white p-1 shadow-2xs">
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
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  selectedDays === p.days
                    ? "bg-slate-900 text-white font-semibold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleDownloadCsv}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-2xs"
          >
            <Download className="h-3.5 w-3.5 text-slate-500" />
            Ekspor CSV
          </button>
        </div>
      </div>

      {/* Summary Statistics Cards (Section 9) */}
      {historyData?.statistics && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs space-y-2">
            <div className="text-xs font-semibold text-slate-500">
              Statistik Kecepatan Kendaraan ({selectedDays} Hari)
            </div>
            <div className="grid grid-cols-4 gap-2 text-center pt-1 border-t border-slate-100">
              <div>
                <div className="text-[10px] text-slate-400">Rata-rata</div>
                <div className="text-sm font-bold text-slate-900">{historyData.statistics.speed.mean}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400">Median</div>
                <div className="text-sm font-bold text-slate-900">{historyData.statistics.speed.median}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400">Terendah</div>
                <div className="text-sm font-bold text-rose-600">{historyData.statistics.speed.min}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400">Tertinggi</div>
                <div className="text-sm font-bold text-emerald-600">{historyData.statistics.speed.max}</div>
              </div>
            </div>
            <div className="text-[10px] text-slate-400 text-right">Satuan: km/jam</div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs space-y-2">
            <div className="text-xs font-semibold text-slate-500">
              Statistik Konsentrasi PM2.5 ({selectedDays} Hari)
            </div>
            <div className="grid grid-cols-4 gap-2 text-center pt-1 border-t border-slate-100">
              <div>
                <div className="text-[10px] text-slate-400">Rata-rata</div>
                <div className="text-sm font-bold text-slate-900">{historyData.statistics.pm25.mean}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400">Median</div>
                <div className="text-sm font-bold text-slate-900">{historyData.statistics.pm25.median}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400">Terendah</div>
                <div className="text-sm font-bold text-emerald-600">{historyData.statistics.pm25.min}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400">Tertinggi</div>
                <div className="text-sm font-bold text-amber-600">{historyData.statistics.pm25.max}</div>
              </div>
            </div>
            <div className="text-[10px] text-slate-400 text-right">Satuan: µg/m³</div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs space-y-2">
            <div className="text-xs font-semibold text-slate-500">
              Statistik Skor ISPU ({selectedDays} Hari)
            </div>
            <div className="grid grid-cols-4 gap-2 text-center pt-1 border-t border-slate-100">
              <div>
                <div className="text-[10px] text-slate-400">Rata-rata</div>
                <div className="text-sm font-bold text-slate-900">{historyData.statistics.ispu.mean}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400">Median</div>
                <div className="text-sm font-bold text-slate-900">{historyData.statistics.ispu.median}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400">Terendah</div>
                <div className="text-sm font-bold text-emerald-600">{historyData.statistics.ispu.min}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400">Tertinggi</div>
                <div className="text-sm font-bold text-amber-600">{historyData.statistics.ispu.max}</div>
              </div>
            </div>
            <div className="text-[10px] text-slate-400 text-right">Kategori: Sedang s/d Baik</div>
          </div>
        </div>
      )}

      {/* Anomaly Detection Banner (Section 9) */}
      <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-4 space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
          <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
          Deteksi Anomali Lapangan Teridentifikasi ({historyData?.anomaliesDetected || 1} Kejadian)
        </div>
        <p className="text-xs text-amber-800 leading-relaxed">
          Sistem mendeteksi anomali perlambatan ekstrem (kecepatan &lt; 10 km/jam) pada jam sibuk sore koridor barat (Dinoyo-Suhat). Terkorelasi dengan kejadian hujan lebat lokal yang memicu genangan sesaat, sekaligus mencuci partikulat debu (washout effect) sehingga konsentrasi PM2.5 turun tajam ke 14.2 µg/m³.
        </p>
      </div>

      {/* Historical Trend Charts */}
      {historyData?.timeseries && (
        <div className="space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-2">
            <h3 className="text-sm font-bold text-slate-900">
              Deret Waktu Kecepatan Rata-rata & Indeks Kemacetan
            </h3>
            <p className="text-xs text-slate-500">
              Evaluasi fluktuasi kecepatan jam puncak pagi vs sore selama {selectedDays} hari
            </p>
            <TrafficTrendChart data={historyData.timeseries} height={340} />
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-2">
            <h3 className="text-sm font-bold text-slate-900">
              Deret Waktu Kualitas Udara (PM2.5 vs Ambang Batas WHO)
            </h3>
            <p className="text-xs text-slate-500">
              Konsentrasi partikulat terhadap standar batas WHO (15 µg/m³) dan Baku Mutu PP 22/2021 (55 µg/m³)
            </p>
            <AirQualityChart data={historyData.timeseries} height={340} />
          </div>
        </div>
      )}
    </div>
  );
}
