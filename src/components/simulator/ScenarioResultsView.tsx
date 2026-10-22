"use client";

import React, { useState } from "react";
import { 
  CheckCircle, 
  TrendingUp, 
  Clock, 
  Fuel, 
  Leaf, 
  AlertTriangle, 
  Download, 
  HelpCircle,
  ChevronDown,
  ChevronUp,
  FileSpreadsheet
} from "lucide-react";
import { SimulationRunResult } from "@/lib/engine/simulatorEngine";
import { formatNumber } from "@/lib/utils";

interface ScenarioResultsViewProps {
  result: SimulationRunResult;
}

export function ScenarioResultsView({ result }: ScenarioResultsViewProps) {
  const [showDetails, setShowDetails] = useState(false);
  const metrics = result.aggregateMetrics;

  const exportSummaryCsv = () => {
    const headers = [
      "corridor_id",
      "corridor_name",
      "baseline_speed_kmh",
      "scenario_speed_kmh",
      "speed_delta_kmh",
      "speed_delta_pct",
      "baseline_los",
      "scenario_los",
      "time_saved_minutes",
    ].join(",");

    const rows = result.corridorBreakdown.map((c) =>
      [
        c.corridorId,
        `"${c.corridorName}"`,
        c.baselineSpeedKmh,
        c.scenarioSpeedKmh,
        c.speedDeltaKmh,
        c.speedDeltaPct,
        c.baselineLos,
        c.scenarioLos,
        c.timeSavedMinutes,
      ].join(",")
    );

    const blob = new Blob([[headers, ...rows].join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `simulasi_${result.runId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Simulation Header Banner */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded bg-slate-900 px-2 py-0.5 text-[10px] font-mono font-bold text-white uppercase tracking-wider">
              RUN ID: {result.runId}
            </span>
            <span className="rounded border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-mono font-semibold text-slate-700">
              KEYAKINAN MODEL: {result.modelConfidenceLevel}
            </span>
          </div>
          <h3 className="text-lg font-bold text-slate-900 font-sans tracking-tight">
            {result.parameters.scenarioName}
          </h3>
          <p className="text-xs text-slate-500 font-mono">
            {result.methodologyNote}
          </p>
        </div>

        <button
          type="button"
          onClick={exportSummaryCsv}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 px-4 py-2 text-xs font-mono font-bold text-slate-800 transition-colors shadow-2xs self-start md:self-auto"
        >
          <FileSpreadsheet className="h-3.5 w-3.5 text-slate-600" />
          EKSPOR CSV
        </button>
      </div>

      {/* Primary KPI Impact Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
            <span className="font-bold uppercase tracking-wider flex items-center gap-1">
              <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
              Kecepatan
            </span>
            <span className="text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded text-[11px] border border-emerald-200/60">
              +{metrics.avgSpeedChangePct}%
            </span>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
            {metrics.avgSpeedScenarioKmh}{" "}
            <span className="text-xs font-sans font-normal text-slate-500">km/jam</span>
          </div>
          <div className="text-[11px] text-slate-400 font-mono pt-1">
            Baseline: {metrics.avgSpeedBaselineKmh} km/jam
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
            <span className="font-bold uppercase tracking-wider flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-sky-600" />
              Waktu Terhemat
            </span>
            <span className="text-slate-700 font-bold bg-slate-100 px-1.5 py-0.5 rounded text-[10px]">
              KOMUTER
            </span>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
            {formatNumber(metrics.totalDailyHoursSaved, 0)}{" "}
            <span className="text-xs font-sans font-normal text-slate-500">jam/hari</span>
          </div>
          <div className="text-[11px] text-slate-400 font-mono pt-1">
            Total waktu perjalanan terhemat
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
            <span className="font-bold uppercase tracking-wider flex items-center gap-1">
              <Fuel className="h-3.5 w-3.5 text-amber-600" />
              BBM Terhemat
            </span>
            <span className="text-slate-700 font-bold bg-slate-100 px-1.5 py-0.5 rounded text-[10px]">
              VKT
            </span>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
            {formatNumber(metrics.dailyFuelSavedLiters, 0)}{" "}
            <span className="text-xs font-sans font-normal text-slate-500">L/hari</span>
          </div>
          <div className="text-[11px] text-slate-400 font-mono pt-1">
            Penurunan konsumsi bahan bakar
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
            <span className="font-bold uppercase tracking-wider flex items-center gap-1">
              <Leaf className="h-3.5 w-3.5 text-emerald-600" />
              Reduksi Emisi
            </span>
            <span className="text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded text-[10px] border border-emerald-200/60">
              IPCC
            </span>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">
            -{formatNumber(metrics.dailyCo2ReducedKg, 0)}{" "}
            <span className="text-xs font-sans font-normal text-slate-500">kg CO2/hr</span>
          </div>
          <div className="text-[11px] text-slate-400 font-mono pt-1">
            Reduksi PM2.5: -{metrics.dailyPm25ReducedKg} kg/hari
          </div>
        </div>
      </div>

      {/* Side-by-side Corridor Breakdown Table */}
      <div className="rounded-2xl border border-slate-200/90 bg-white overflow-hidden shadow-xs">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900">
            Rincian Dampak Per Ruas Koridor Jalan Kota Malang
          </h4>
          <span className="text-[11px] font-mono text-slate-400">
            {result.corridorBreakdown.length} KORIDOR TERDAMPAK
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 font-mono text-[11px]">
              <tr>
                <th className="py-3 px-4">KORIDOR JALAN</th>
                <th className="py-3 px-4">KECEPATAN BASELINE</th>
                <th className="py-3 px-4">KECEPATAN SKENARIO</th>
                <th className="py-3 px-4">DELTA KECEPATAN</th>
                <th className="py-3 px-4">TINGKAT LAYANAN (LOS)</th>
                <th className="py-3 px-4">WAKTU TERHEMAT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {result.corridorBreakdown.map((row) => (
                <tr key={row.corridorId} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900 font-sans">
                    {row.corridorName}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">
                    {row.baselineSpeedKmh} km/j
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    {row.scenarioSpeedKmh} km/j
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">
                      +{row.speedDeltaKmh} km/j (+{row.speedDeltaPct}%)
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-slate-400">LOS {row.baselineLos}</span>
                    <span className="mx-1 text-slate-300">→</span>
                    <span className="font-bold text-slate-900">LOS {row.scenarioLos}</span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-800">
                    {row.timeSavedMinutes > 0 ? `-${row.timeSavedMinutes} mnt` : "Optimal"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assumptions & Limitations Drawer */}
      <div className="rounded-2xl border border-slate-200/90 bg-slate-50/70 p-5 space-y-3">
        <button
          type="button"
          onClick={() => setShowDetails(!showDetails)}
          className="flex w-full items-center justify-between text-xs font-mono font-bold uppercase tracking-wider text-slate-700 hover:text-slate-900"
        >
          <span className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4 text-slate-600" />
            Transparansi Metodologi, Asumsi Model, dan Batasan Simulasi
          </span>
          {showDetails ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>

        {showDetails && (
          <div className="pt-3 border-t border-slate-200 space-y-4 text-xs text-slate-600 font-sans leading-relaxed">
            <div>
              <h5 className="font-bold text-slate-900 mb-1.5 font-mono uppercase text-[11px]">Asumsi Dasar Model:</h5>
              <ul className="list-disc list-inside space-y-1 text-slate-600 pl-1">
                {result.assumptions.map((asmp, i) => (
                  <li key={i}>{asmp}</li>
                ))}
              </ul>
            </div>

            <div>
              <h5 className="font-bold text-slate-900 mb-1.5 font-mono uppercase text-[11px]">Batasan & Catatan Model:</h5>
              <ul className="list-disc list-inside space-y-1 text-slate-600 pl-1">
                {result.limitations.map((limit, i) => (
                  <li key={i}>{limit}</li>
                ))}
              </ul>
            </div>

            <p className="text-[11px] italic text-slate-500 pt-2 border-t border-slate-200 font-mono">
              * Hasil komputasi simulator disajikan sebagai estimasi skenario pembanding berbasis model analitik terbuka untuk pengambil kebijakan dan riset publik.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
