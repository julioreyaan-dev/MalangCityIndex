/**
 * Traffic Congestion Index (TCI) Engine
 * Berdasarkan Pedoman Kapasitas Jalan Indonesia (PKJI 2023 / MKJI 1997)
 * & Travel Time Ratio (TTR) Metodologi
 */

export type LevelOfService = "A" | "B" | "C" | "D" | "E" | "F";

export interface CongestionStatus {
  los: LevelOfService;
  statusLabel: string;
  colorHex: string;
  badgeClass: string;
  travelTimeRatio: number;
  vcRatio: number;
  description: string;
}

/**
 * Menghitung Travel Time Ratio (TTR):
 * TTR = Waktu Tempuh Aktual / Waktu Tempuh Arus Bebas
 * atau Kecepatan Arus Bebas / Kecepatan Aktual
 */
export function calculateTravelTimeRatio(
  currentSpeedKmh: number,
  freeFlowSpeedKmh: number
): number {
  if (currentSpeedKmh <= 0 || freeFlowSpeedKmh <= 0) return 1.0;
  return Number((freeFlowSpeedKmh / currentSpeedKmh).toFixed(2));
}

/**
 * Menghitung Level of Service (LOS) berdasarkan Travel Time Ratio (TTR) dan V/C Ratio
 */
export function getCongestionStatus(
  currentSpeedKmh: number,
  freeFlowSpeedKmh: number,
  volumeVehPerHour?: number,
  capacityVehPerHour?: number
): CongestionStatus {
  const ttr = calculateTravelTimeRatio(currentSpeedKmh, freeFlowSpeedKmh);
  let vc = 0.5;

  if (volumeVehPerHour && capacityVehPerHour && capacityVehPerHour > 0) {
    vc = Number((volumeVehPerHour / capacityVehPerHour).toFixed(2));
  } else {
    // Estimasi V/C dari TTR jika volume tidak tercatat secara kontinu
    vc = Number(Math.min(1.2, Math.max(0.2, (ttr - 1) * 0.8 + 0.3)).toFixed(2));
  }

  if (ttr <= 1.15 && vc < 0.35) {
    return {
      los: "A",
      statusLabel: "Lancar (Arus Bebas)",
      colorHex: "#10b981",
      badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
      travelTimeRatio: ttr,
      vcRatio: vc,
      description: "Kecepatan mendekati batas kecepatan rencana, pengemudi bebas memilih lajur dan kecepatan.",
    };
  } else if (ttr <= 1.30 && vc < 0.55) {
    return {
      los: "B",
      statusLabel: "Arus Stabil",
      colorHex: "#3b82f6",
      badgeClass: "bg-blue-50 text-blue-700 border-blue-200",
      travelTimeRatio: ttr,
      vcRatio: vc,
      description: "Arus stabil dengan sedikit hambatan internal, kebebasan bermanuver masih terjaga.",
    };
  } else if (ttr <= 1.50 && vc < 0.75) {
    return {
      los: "C",
      statusLabel: "Ramai Terkendali",
      colorHex: "#eab308",
      badgeClass: "bg-yellow-50 text-yellow-700 border-yellow-200",
      travelTimeRatio: ttr,
      vcRatio: vc,
      description: "Arus stabil namun kecepatan mulai dibatasi oleh kendaraan lain dan aktivitas sisi jalan.",
    };
  } else if (ttr <= 1.85 && vc < 0.88) {
    return {
      los: "D",
      statusLabel: "Padat (Mendekati Jenuh)",
      colorHex: "#f97316",
      badgeClass: "bg-orange-50 text-orange-700 border-orange-200",
      travelTimeRatio: ttr,
      vcRatio: vc,
      description: "Arus mendekati batas tidak stabil, antrean terjadi pada persimpangan lampu lalu lintas.",
    };
  } else if (ttr <= 2.30 && vc < 1.0) {
    return {
      los: "E",
      statusLabel: "Sangat Padat (Kapasitas Penuh)",
      colorHex: "#ef4444",
      badgeClass: "bg-red-50 text-red-700 border-red-200",
      travelTimeRatio: ttr,
      vcRatio: vc,
      description: "Volume lalu lintas mendekati kapasitas jalan, kecepatan turun drastis, antrean panjang.",
    };
  } else {
    return {
      los: "F",
      statusLabel: "Macet Parah (Jenuh Total / Breakdown)",
      colorHex: "#991b1b",
      badgeClass: "bg-rose-100 text-rose-800 border-rose-300",
      travelTimeRatio: ttr,
      vcRatio: vc,
      description: "Kondisi arus tertahan, kecepatan merayap (<10 km/jam), antrean kendaraan tidak terurai.",
    };
  }
}

/**
 * Menghitung Traffic Congestion Index (skala 0 - 100%)
 * 0% = Arus bebas sempurna
 * 100% = Gridlock total
 */
export function calculateCongestionIndexScore(ttr: number): number {
  if (ttr <= 1.0) return 0;
  // Rentang TTR 1.0 s/d 2.5 dinormalisasi ke 0 s/d 100
  const normalized = ((ttr - 1.0) / 1.5) * 100;
  return Math.min(100, Math.max(0, Math.round(normalized)));
}
