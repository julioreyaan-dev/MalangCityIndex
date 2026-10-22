import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { MALANG_ROAD_CORRIDORS } from "@/lib/data/roadCorridors";
import { runUrbanSimulation, SimulationParameters } from "@/lib/engine/simulatorEngine";

export const dynamic = "force-dynamic";

const SimulationInputSchema = z.object({
  scenarioName: z.string().min(3).max(80),
  scenarioType: z.enum([
    "signal_optimization",
    "transit_mode_shift",
    "staggered_peak_hours",
    "arterial_freight_restriction",
    "comprehensive_package",
  ]),
  targetCorridorId: z.string().optional().default("all"),
  transitModeShiftPct: z.number().min(0).max(30).default(0),
  signalEfficiencyImprovementPct: z.number().min(0).max(25).default(0),
  privateVehicleReductionPct: z.number().min(0).max(25).default(0),
  peakFlatteningPct: z.number().min(0).max(30).default(0),
  roadCapacityGainPct: z.number().min(0).max(15).default(0),
});

// Predefined official template scenarios
const PRESET_SCENARIOS: SimulationParameters[] = [
  {
    scenarioName: "Optimasi Lampu Sinyal Simpang Padat (Suhat & Dinoyo)",
    scenarioType: "signal_optimization",
    targetCorridorId: "suhat-lowokwaru",
    transitModeShiftPct: 0,
    signalEfficiencyImprovementPct: 18,
    privateVehicleReductionPct: 0,
    peakFlatteningPct: 5,
    roadCapacityGainPct: 8,
  },
  {
    scenarioName: "Revitalisasi Angkutan Umum & Feeder Kampus (Mode Shift 12%)",
    scenarioType: "transit_mode_shift",
    targetCorridorId: "all",
    transitModeShiftPct: 12,
    signalEfficiencyImprovementPct: 5,
    privateVehicleReductionPct: 10,
    peakFlatteningPct: 8,
    roadCapacityGainPct: 5,
  },
  {
    scenarioName: "Paket Terpadu Transportasi Berkelanjutan Malang 2026",
    scenarioType: "comprehensive_package",
    targetCorridorId: "all",
    transitModeShiftPct: 15,
    signalEfficiencyImprovementPct: 20,
    privateVehicleReductionPct: 12,
    peakFlatteningPct: 15,
    roadCapacityGainPct: 10,
  },
];

export async function GET() {
  try {
    // Jalankan preset baseline untuk demo langsung
    const presetResults = PRESET_SCENARIOS.map((param) =>
      runUrbanSimulation(param, MALANG_ROAD_CORRIDORS)
    );

    return NextResponse.json({
      success: true,
      count: presetResults.length,
      presets: presetResults,
      availableCorridors: MALANG_ROAD_CORRIDORS.map((c) => ({
        id: c.id,
        name: c.name,
        kecamatan: c.kecamatan,
        lengthKm: c.lengthKm,
      })),
    });
  } catch (error) {
    console.error("Error in GET /api/simulations:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memuat preset simulasi" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = SimulationInputSchema.parse(body);

    const result = runUrbanSimulation(validated, MALANG_ROAD_CORRIDORS);

    return NextResponse.json({
      success: true,
      simulationResult: result,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Parameter simulasi tidak valid", details: error.issues },
        { status: 400 }
      );
    }
    console.error("Error in POST /api/simulations:", error);
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan saat mengeksekusi simulasi" },
      { status: 500 }
    );
  }
}
