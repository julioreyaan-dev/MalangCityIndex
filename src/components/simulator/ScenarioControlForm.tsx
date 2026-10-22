"use client";

import React, { useState } from "react";
import { SlidersHorizontal, RotateCcw, Play, Sparkles } from "lucide-react";
import { SimulationParameters } from "@/lib/engine/simulatorEngine";

interface ScenarioControlFormProps {
  onRunSimulation: (params: SimulationParameters) => void;
  loading?: boolean;
}

export function ScenarioControlForm({ onRunSimulation, loading = false }: ScenarioControlFormProps) {
  const [scenarioName, setScenarioName] = useState("Uji Coba Kebijakan Terpadu Suhat & Kawasan Kampus");
  const [scenarioType, setScenarioType] = useState<SimulationParameters["scenarioType"]>("comprehensive_package");
  const [targetCorridorId, setTargetCorridorId] = useState("all");
  const [transitModeShiftPct, setTransitModeShiftPct] = useState(12);
  const [signalEfficiencyImprovementPct, setSignalEfficiencyImprovementPct] = useState(15);
  const [privateVehicleReductionPct, setPrivateVehicleReductionPct] = useState(8);
  const [peakFlatteningPct, setPeakFlatteningPct] = useState(10);
  const [roadCapacityGainPct, setRoadCapacityGainPct] = useState(8);

  const applyPreset = (presetKey: string) => {
    if (presetKey === "signal") {
      setScenarioName("Optimasi Waktu Siklus Lampu Sinyal Simpang Padat");
      setScenarioType("signal_optimization");
      setTargetCorridorId("suhat-lowokwaru");
      setTransitModeShiftPct(0);
      setSignalEfficiencyImprovementPct(20);
      setPrivateVehicleReductionPct(0);
      setPeakFlatteningPct(5);
      setRoadCapacityGainPct(8);
    } else if (presetKey === "transit") {
      setScenarioName("Revitalisasi Angkutan Umum & Feeder Kampus Malang");
      setScenarioType("transit_mode_shift");
      setTargetCorridorId("all");
      setTransitModeShiftPct(18);
      setSignalEfficiencyImprovementPct(5);
      setPrivateVehicleReductionPct(14);
      setPeakFlatteningPct(10);
      setRoadCapacityGainPct(5);
    } else if (presetKey === "comprehensive") {
      setScenarioName("Paket Terpadu Transportasi Berkelanjutan Malang 2026");
      setScenarioType("comprehensive_package");
      setTargetCorridorId("all");
      setTransitModeShiftPct(15);
      setSignalEfficiencyImprovementPct(18);
      setPrivateVehicleReductionPct(10);
      setPeakFlatteningPct(15);
      setRoadCapacityGainPct(10);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRunSimulation({
      scenarioName,
      scenarioType,
      targetCorridorId,
      transitModeShiftPct,
      signalEfficiencyImprovementPct,
      privateVehicleReductionPct,
      peakFlatteningPct,
      roadCapacityGainPct,
    });
  };

  const handleReset = () => {
    applyPreset("comprehensive");
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-700/60 bg-[#0e1726]/60 backdrop-blur-xl p-6 sm:p-7 shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div className="space-y-1">
          <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-white flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-purple-400" />
            Parameter Intervensi Kebijakan Perkotaan
          </h3>
          <p className="text-xs text-slate-300 font-sans">
            Uji sensitivitas empiris menggunakan model BPR (Bureau of Public Roads) terkalibrasi PKJI 2023.
          </p>
        </div>

        {/* Presets */}
        <div className="flex flex-wrap items-center gap-1.5 font-mono">
          <span className="text-[10px] uppercase font-bold text-slate-400 mr-1">Preset:</span>
          <button
            type="button"
            onClick={() => applyPreset("signal")}
            className="rounded-lg border border-slate-700/80 bg-slate-800/50 px-2.5 py-1 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-700/60 transition-all"
          >
            Sinyal ATCS
          </button>
          <button
            type="button"
            onClick={() => applyPreset("transit")}
            className="rounded-lg border border-slate-700/80 bg-slate-800/50 px-2.5 py-1 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-700/60 transition-all"
          >
            Angkot/Feeder
          </button>
          <button
            type="button"
            onClick={() => applyPreset("comprehensive")}
            className="rounded-lg border border-purple-500/50 bg-purple-950/70 px-2.5 py-1 text-xs font-bold text-purple-200 shadow-sm transition-all"
          >
            Paket Terpadu
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-1.5">
            Nama Skenario Simulasi
          </label>
          <input
            type="text"
            value={scenarioName}
            onChange={(e) => setScenarioName(e.target.value)}
            required
            className="w-full rounded-xl border border-slate-700/80 bg-[#090e18]/80 px-3.5 py-2.5 text-xs font-medium text-white placeholder-slate-500 focus:border-purple-400 focus:ring-1 focus:ring-purple-400 outline-none transition-all"
            placeholder="Contoh: Optimasi Simpang Suhat & Dinoyo"
          />
        </div>

        <div>
          <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-1.5">
            Cakupan Ruas Koridor Jalan
          </label>
          <select
            value={targetCorridorId}
            onChange={(e) => setTargetCorridorId(e.target.value)}
            className="w-full rounded-xl border border-slate-700/80 bg-[#090e18] px-3.5 py-2.5 text-xs font-medium text-white focus:border-purple-400 outline-none transition-all cursor-pointer"
          >
            <option value="all">Seluruh Jaringan Koridor Utama Kota Malang (7 Koridor)</option>
            <option value="suhat-lowokwaru">Jl. Soekarno-Hatta (Suhat) - Lowokwaru</option>
            <option value="ahmad-yani-blimbing">Jl. Ahmad Yani (Gerbang Utara) - Blimbing</option>
            <option value="kayutangan-klojen">Jl. Basuki Rahmat (Kayutangan Heritage) - Klojen</option>
            <option value="dinoyo-mt-haryono">Jl. MT Haryono - Dinoyo (Lowokwaru)</option>
            <option value="veteran-klojen">Jl. Veteran (Kawasan Kampus) - Lowokwaru</option>
            <option value="sugiono-gadang-sukun">Jl. Kolonel Sugiono (Arteri Selatan) - Sukun</option>
            <option value="mayjen-sungkono-kedungkandang">Jl. Mayjen Sungkono - Kedungkandang</option>
          </select>
        </div>
      </div>

      {/* Sliders Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
        <div className="rounded-xl border border-slate-800/90 bg-[#090e18]/70 backdrop-blur-md p-4 space-y-2.5">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-slate-200 font-sans">Perpindahan ke Angkutan Umum</span>
            <span className="font-bold text-purple-300 bg-purple-950/80 px-2 py-0.5 rounded-md border border-purple-500/40 font-mono">
              {transitModeShiftPct}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="30"
            step="1"
            value={transitModeShiftPct}
            onChange={(e) => setTransitModeShiftPct(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-400"
          />
          <p className="text-[11px] text-slate-400 font-sans leading-tight">
            Persentase pengguna kendaraan pribadi beralih ke mikrolet dan bus feeder kampus.
          </p>
        </div>

        <div className="rounded-xl border border-slate-800/90 bg-[#090e18]/70 backdrop-blur-md p-4 space-y-2.5">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-slate-200 font-sans">Efisiensi Sinyal Lampu ATCS</span>
            <span className="font-bold text-purple-300 bg-purple-950/80 px-2 py-0.5 rounded-md border border-purple-500/40 font-mono">
              {signalEfficiencyImprovementPct}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="25"
            step="1"
            value={signalEfficiencyImprovementPct}
            onChange={(e) => setSignalEfficiencyImprovementPct(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-400"
          />
          <p className="text-[11px] text-slate-400 font-sans leading-tight">
            Reduksi waktu siklus tundaan simpang via koordinasi gelombang hijau (green wave).
          </p>
        </div>

        <div className="rounded-xl border border-slate-800/90 bg-[#090e18]/70 backdrop-blur-md p-4 space-y-2.5">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-slate-200 font-sans">Pengurangan Kendaraan Pribadi</span>
            <span className="font-bold text-purple-300 bg-purple-950/80 px-2 py-0.5 rounded-md border border-purple-500/40 font-mono">
              {privateVehicleReductionPct}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="25"
            step="1"
            value={privateVehicleReductionPct}
            onChange={(e) => setPrivateVehicleReductionPct(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-400"
          />
          <p className="text-[11px] text-slate-400 font-sans leading-tight">
            Penurunan volume via carpooling, mobilitas aktif (sepeda/jalan kaki), dan tarif parkir.
          </p>
        </div>

        <div className="rounded-xl border border-slate-800/90 bg-[#090e18]/70 backdrop-blur-md p-4 space-y-2.5">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-slate-200 font-sans">Perataan Jam Sibuk (Staggered)</span>
            <span className="font-bold text-purple-300 bg-purple-950/80 px-2 py-0.5 rounded-md border border-purple-500/40 font-mono">
              {peakFlatteningPct}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="30"
            step="1"
            value={peakFlatteningPct}
            onChange={(e) => setPeakFlatteningPct(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-400"
          />
          <p className="text-[11px] text-slate-400 font-sans leading-tight">
            Pengaturan bertahap jam masuk sekolah dan perkuliahan (06:45, 07:30, 08:15).
          </p>
        </div>

        <div className="rounded-xl border border-slate-800/90 bg-[#090e18]/70 backdrop-blur-md p-4 space-y-2.5">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-slate-200 font-sans">Penertiban Hambatan Samping</span>
            <span className="font-bold text-purple-300 bg-purple-950/80 px-2 py-0.5 rounded-md border border-purple-500/40 font-mono">
              {roadCapacityGainPct}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="15"
            step="1"
            value={roadCapacityGainPct}
            onChange={(e) => setRoadCapacityGainPct(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-400"
          />
          <p className="text-[11px] text-slate-400 font-sans leading-tight">
            Penertiban parkir on-street liar dan pedagang kaki lima di bahu jalan koridor utama.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-slate-800/80 pt-4">
        <button
          type="button"
          onClick={handleReset}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white font-mono font-medium transition-colors"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          RESET PARAMETER
        </button>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 active:from-purple-700 active:to-indigo-700 px-6 py-2.5 text-xs font-mono font-bold text-white transition-all shadow-lg shadow-purple-900/30 disabled:opacity-60 cursor-pointer"
        >
          <Play className="h-3.5 w-3.5 fill-white" />
          {loading ? "MEMPROSES MODEL BPR..." : "EKSEKUSI SIMULASI MODEL"}
        </button>
      </div>
    </form>
  );
}
