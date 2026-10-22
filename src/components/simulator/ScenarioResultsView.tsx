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
      <div className="rounded-2xl border border-slate-700/60 bg-[#0e1726]/60 backdrop-blur-xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded bg-purple-950/80 border border-purple-500/40 px-2 py-0.5 text-[10px] font-mono font-bold text-purple-300 uppercase tracking-wider">
              RUN ID: {result.runId}
            </span>
            <span className="rounded border border-slate-700/80 bg-slate-800/60 px-2 py-0.5 text-[10px] font-mono font-semibold text-slate-300">
              KEYAKINAN MODEL: {result.modelConfidenceLevel}
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white font-sans tracking-tight">
            {result.parameters.scenarioName}
          </h3>
          <p className="text-xs text-slate-300 font-mono">
            {result.methodologyNote}
          </p>
        </div>

        <button
          type="button"
          onClick={exportSummaryCsv}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700/80 bg-slate-800/60 hover:bg-slate-700/80 px-4 py-2 text-xs font-mono font-bold text-slate-200 hover:text-white transition-all shadow-md self-start md:self-auto cursor-pointer"
        >
          <FileSpreadsheet className="h-3.5 w-3.5 text-purple-400" />
          EKSPOR CSV
        </button>
      </div>

      {/* Primary KPI Impact Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="group rounded-2xl border border-slate-700/60 bg-[#0e1726]/60 backdrop-blur-xl p-5 shadow-lg hover:border-emerald-500/40 transition-all space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span className="font-bold uppercase tracking-wider flex items-center gap-1">
              <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
              Kecepatan
            </span>
            <span className="text-emerald-400 font-bold bg-emerald-950/70 px-1.5 py-0.5 rounded text-[11px] border border-emerald-500/40">
              +{metrics.avgSpeedChangePct}%
            </span>
          </div>
          <div className="text-3xl font-black text-white font-mono tabular-nums">
            {metrics.avgSpeedScenarioKmh}{" "}
            <span className="text-xs font-sans font-normal text-slate-400">km/jam</span>
          </div>
          <div className="text-[11px] text-slate-400 font-mono pt-1">
            Baseline: {metrics.avgSpeedBaselineKmh} km/jam
          </div>
        </div>

        <div className="group rounded-2xl border border-slate-700/60 bg-[#0e1726]/60 backdrop-blur-xl p-5 shadow-lg hover:border-sky-500/40 transition-all space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span className="font-bold uppercase tracking-wider flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-sky-400" />
              Waktu Terhemat
            </span>
            <span className="text-sky-300 font-bold bg-sky-950/70 border border-sky-500/40 px-1.5 py-0.5 rounded text-[10px]">
              KOMUTER
            </span>
          </div>
          <div className="text-3xl font-black text-white font-mono tabular-nums">
            {formatNumber(metrics.totalDailyHoursSaved, 0)}{" "}
            <span className="text-xs font-sans font-normal text-slate-400">jam/hari</span>
          </div>
          <div className="text-[11px] text-slate-400 font-mono pt-1">
            Total waktu perjalanan terhemat
          </div>
        </div>

        <div className="group rounded-2xl border border-slate-700/60 bg-[#0e1726]/60 backdrop-blur-xl p-5 shadow-lg hover:border-amber-500/40 transition-all space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span className="font-bold uppercase tracking-wider flex items-center gap-1">
              <Fuel className="h-3.5 w-3.5 text-amber-400" />
              BBM Terhemat
            </span>
            <span className="text-amber-300 font-bold bg-amber-950/70 border border-amber-500/40 px-1.5 py-0.5 rounded text-[10px]">
              VKT
            </span>
          </div>
          <div className="text-3xl font-black text-white font-mono tabular-nums">
            {formatNumber(metrics.dailyFuelSavedLiters, 0)}{" "}
            <span className="text-xs font-sans font-normal text-slate-400">L/hari</span>
          </div>
          <div className="text-[11px] text-slate-400 font-mono pt-1">
            Penurunan konsumsi bahan bakar
          </div>
        </div>

        <div className="group rounded-2xl border border-slate-700/60 bg-[#0e1726]/60 backdrop-blur-xl p-5 shadow-lg hover:border-emerald-500/40 transition-all space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span className="font-bold uppercase tracking-wider flex items-center gap-1">
              <Leaf className="h-3.5 w-3.5 text-emerald-400" />
              Reduksi Emisi
            </span>
            <span className="text-emerald-400 font-bold bg-emerald-950/70 px-1.5 py-0.5 rounded text-[10px] border border-emerald-500/40">
              IPCC
            </span>
          </div>
          <div className="text-2xl font-black text-white font-mono tabular-nums">
            -{formatNumber(metrics.dailyCo2ReducedKg, 0)}{" "}
            <span className="text-xs font-sans font-normal text-slate-400">kg CO2/hr</span>
          </div>
          <div className="text-[11px] text-slate-400 font-mono pt-1">
            Reduksi PM2.5: -{metrics.dailyPm25ReducedKg} kg/hari
          </div>
        </div>
      </div>

      {/* Side-by-side Corridor Breakdown Table */}
      <div className="rounded-2xl border border-slate-700/60 bg-[#0e1726]/60 backdrop-blur-xl overflow-hidden shadow-xl">
        <div className="px-5 py-4 border-b border-slate-800/80 flex items-center justify-between bg-[#090e18]/60">
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
            Rincian Dampak Per Ruas Koridor Jalan Kota Malang
          </h4>
          <span className="text-[11px] font-mono text-purple-400">
            {result.corridorBreakdown.length} KORIDOR TERDAMPAK
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-[#090e18]/80 text-slate-400 border-b border-slate-800/80 font-mono text-[11px]">
              <tr>
                <th className="py-3 px-4">KORIDOR JALAN</th>
                <th className="py-3 px-4">KECEPATAN BASELINE</th>
                <th className="py-3 px-4">KECEPATAN SKENARIO</th>
                <th className="py-3 px-4">DELTA KECEPATAN</th>
                <th className="py-3 px-4">TINGKAT LAYANAN (LOS)</th>
                <th className="py-3 px-4">WAKTU TERHEMAT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
              {result.corridorBreakdown.map((row) => (
                <tr key={row.corridorId} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-white font-sans">
                    {row.corridorName}
                  </td>
                  <td className="py-3.5 px-4 text-slate-400">
                    {row.baselineSpeedKmh} km/j
                  </td>
                  <td className="py-3.5 px-4 font-bold text-white">
                    {row.scenarioSpeedKmh} km/j
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center text-emerald-400 font-bold bg-emerald-950/70 px-2 py-0.5 rounded border border-emerald-500/40">
                      +{row.speedDeltaKmh} km/j (+{row.speedDeltaPct}%)
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-slate-400">LOS {row.baselineLos}</span>
                    <span className="mx-1 text-slate-500">→</span>
                    <span className="font-bold text-cyan-300">LOS {row.scenarioLos}</span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-200">
                    {row.timeSavedMinutes > 0 ? `-${row.timeSavedMinutes} mnt` : "Optimal"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assumptions & Limitations Drawer */}
      <div className="rounded-2xl border border-slate-700/60 bg-[#0e1726]/40 backdrop-blur-xl p-5 space-y-3 shadow-lg">
        <button
          type="button"
          onClick={() => setShowDetails(!showDetails)}
          className="flex w-full items-center justify-between text-xs font-mono font-bold uppercase tracking-wider text-slate-300 hover:text-white transition-colors cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4 text-purple-400" />
            Transparansi Metodologi, Asumsi Model, dan Batasan Simulasi
          </span>
          {showDetails ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
        </button>

        {showDetails && (
          <div className="pt-3 border-t border-slate-800/80 space-y-4 text-xs text-slate-300 font-sans leading-relaxed">
            <div>
              <h5 className="font-bold text-white mb-1.5 font-mono uppercase text-[11px]">Asumsi Dasar Model:</h5>
              <ul className="list-disc list-inside space-y-1 text-slate-300 pl-1">
                {result.assumptions.map((asmp, i) => (
                  <li key={i}>{asmp}</li>
                ))}
              </ul>
            </div>

            <div>
              <h5 className="font-bold text-white mb-1.5 font-mono uppercase text-[11px]">Batasan & Catatan Model:</h5>
              <ul className="list-disc list-inside space-y-1 text-slate-300 pl-1">
                {result.limitations.map((limit, i) => (
                  <li key={i}>{limit}</li>
                ))}
              </ul>
            </div>

            <p className="text-[11px] italic text-slate-400 pt-2 border-t border-slate-800/80 font-mono">
              * Hasil komputasi simulator disajikan sebagai estimasi skenario pembanding berbasis model analitik terbuka untuk pengambil kebijakan dan riset publik.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
