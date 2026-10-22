import { MALANG_ROAD_CORRIDORS, RoadCorridor } from "../data/roadCorridors";
import { getCongestionStatus, CongestionStatus, calculateCongestionIndexScore } from "../engine/congestionIndex";

export interface RoadStatusItem {
  corridor: RoadCorridor;
  congestion: CongestionStatus;
  congestionIndexScore: number;
  travelTimeMinutes: number;
  freeFlowTimeMinutes: number;
  delayMinutes: number;
  timestamp: string;
  sourceStatus: "VERIFIED_BASELINE" | "CALIBRATED_SURVEY";
}

export function getCorridorTrafficStatuses(): RoadStatusItem[] {
  const nowIso = new Date().toISOString();

  return MALANG_ROAD_CORRIDORS.map((corridor) => {
    const congestion = getCongestionStatus(
      corridor.observedSpeedKmh,
      corridor.freeFlowSpeedKmh,
      corridor.peakHourVolume,
      corridor.baseCapacity
    );

    const congestionIndexScore = calculateCongestionIndexScore(congestion.travelTimeRatio);
    const travelTimeMinutes = Number(((corridor.lengthKm / corridor.observedSpeedKmh) * 60).toFixed(1));
    const freeFlowTimeMinutes = Number(((corridor.lengthKm / corridor.freeFlowSpeedKmh) * 60).toFixed(1));
    const delayMinutes = Number(Math.max(0, travelTimeMinutes - freeFlowTimeMinutes).toFixed(1));

    return {
      corridor,
      congestion,
      congestionIndexScore,
      travelTimeMinutes,
      freeFlowTimeMinutes,
      delayMinutes,
      timestamp: nowIso,
      sourceStatus: "VERIFIED_BASELINE",
    };
  });
}
