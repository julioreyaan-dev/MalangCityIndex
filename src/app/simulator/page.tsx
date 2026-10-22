"use client";

import React, { useState, useEffect } from "react";
import { 
  Sliders, 
  Sparkles, 
  ShieldCheck, 
  RotateCcw, 
  Download, 
  HelpCircle,
  TrendingUp,
  Clock,
  Fuel,
  Leaf
} from "lucide-react";
import { ScenarioControlForm } from "@/components/simulator/ScenarioControlForm";
import { ScenarioResultsView } from "@/components/simulator/ScenarioResultsView";
import { DataBadge } from "@/components/common/DataBadge";
import { SimulationParameters, SimulationRunResult } from "@/lib/engine/simulatorEngine";

export default function SimulatorPage() {
  const [currentResult, setCurrentResult] = useState<SimulationRunResult | null>(null);
  const [loading, setLoading] = useState(false);

  // Load default preset on initial mount
  useEffect(() => {
    const loadDefault = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/simulations");
        const json = await res.json();
        if (json.success && json.presets && json.presets.length > 0) {
          setCurrentResult(json.presets[2]); // Paket Terpadu
        }
      } catch (err) {
        console.error("Error loading default presets:", err);
      } finally {
        setLoading(false);
      }
    };
    loadDefault();
  }, []);

  const handleRunSimulation = async (params: SimulationParameters) => {
    setLoading(true);
    try {
      const res = await fetch("/api/simulations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });
      const json = await res.json();
      if (json.success) {
        setCurrentResult(json.simulationResult);
      } else {
        alert(json.error || "Gagal menjalankan simulasi.");
      }
    } catch (err) {
      console.error("Simulation execution error:", err);
      alert("Terjadi kesalahan saat memproses simulasi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-[1720px] w-full px-4 sm:px-6 lg:px-8 xl:px-10 py-8 space-y-8">
      {/* Page Header */}
      <div className="border-b border-slate-800/80 pb-6 space-y-2">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-purple-300 bg-purple-950/60 px-2.5 py-0.5 rounded-md border border-purple-500/40 backdrop-blur-sm">
            Urban Transport & Emission Simulator
          </span>
          <DataBadge type="simulation" label="Model BPR PKJI 2023" />
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight font-sans drop-shadow-sm">
          Simulator Skenario Solusi Perkotaan Kota Malang
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
          Uji dampak potensial kebijakan transportasi di Kota Malang—seperti optimasi lampu sinyal ATCS, perpindahan moda ke angkutan umum/mikrolet, perataan jam masuk kampus/sekolah, dan penertiban hambatan samping—berdasarkan model matematika BPR transparan.
        </p>
      </div>

      {/* Simulator Control Form */}
      <ScenarioControlForm onRunSimulation={handleRunSimulation} loading={loading} />

      {/* Simulation Results Display */}
      {currentResult && (
        <div className="space-y-4 pt-4">
          <h2 className="text-base sm:text-lg font-bold text-white font-sans flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            Hasil Komputasi Skenario vs Baseline Kota Malang
          </h2>
          <ScenarioResultsView result={currentResult} />
        </div>
      )}
    </div>
  );
}
