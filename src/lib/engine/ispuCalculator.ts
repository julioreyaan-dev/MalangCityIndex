/**
 * ISPU (Indeks Standar Pencemar Udara) Calculator
 * Berdasarkan Peraturan Menteri Lingkungan Hidup dan Kehutanan RI
 * No. P.14/MENLHK/SETJEN/KUM.1/7/2020
 */

export interface ISPUCategory {
  category: "Baik" | "Sedang" | "Tidak Sehat" | "Sangat Tidak Sehat" | "Berbahaya";
  colorHex: string;
  badgeClass: string;
  description: string;
  healthAdvice: string;
}

interface ISPUBreakpoint {
  ispuLow: number;
  ispuHigh: number;
  rawLow: number;
  rawHigh: number;
}

// Rentang konsentrasi PM2.5 (24 jam, µg/m³) sesuai Permen LHK 14/2020
const PM25_BREAKPOINTS: ISPUBreakpoint[] = [
  { ispuLow: 0, ispuHigh: 50, rawLow: 0, rawHigh: 15.5 },
  { ispuLow: 51, ispuHigh: 100, rawLow: 15.6, rawHigh: 55.4 },
  { ispuLow: 101, ispuHigh: 200, rawLow: 55.5, rawHigh: 150.4 },
  { ispuLow: 201, ispuHigh: 300, rawLow: 150.5, rawHigh: 250.4 },
  { ispuLow: 301, ispuHigh: 500, rawLow: 250.5, rawHigh: 500.0 },
];

// Rentang konsentrasi PM10 (24 jam, µg/m³) sesuai Permen LHK 14/2020
const PM10_BREAKPOINTS: ISPUBreakpoint[] = [
  { ispuLow: 0, ispuHigh: 50, rawLow: 0, rawHigh: 50.0 },
  { ispuLow: 51, ispuHigh: 100, rawLow: 51.0, rawHigh: 150.0 },
  { ispuLow: 101, ispuHigh: 200, rawLow: 151.0, rawHigh: 350.0 },
  { ispuLow: 201, ispuHigh: 300, rawLow: 351.0, rawHigh: 420.0 },
  { ispuLow: 301, ispuHigh: 500, rawLow: 421.0, rawHigh: 500.0 },
];

/**
 * Rumus interpolasi linear ISPU:
 * I = ((Ia - Ib) / (Xa - Xb)) * (Xx - Xb) + Ib
 */
export function calculateISPUFromRaw(
  rawVal: number,
  pollutant: "pm25" | "pm10"
): number {
  if (rawVal < 0 || isNaN(rawVal)) return 0;

  const breakpoints = pollutant === "pm25" ? PM25_BREAKPOINTS : PM10_BREAKPOINTS;

  for (const bp of breakpoints) {
    if (rawVal >= bp.rawLow && rawVal <= bp.rawHigh) {
      const ispu =
        ((bp.ispuHigh - bp.ispuLow) / (bp.rawHigh - bp.rawLow)) *
          (rawVal - bp.rawLow) +
        bp.ispuLow;
      return Math.round(ispu);
    }
  }

  // Jika melebihi batas atas (ekstrem)
  const lastBp = breakpoints[breakpoints.length - 1];
  if (rawVal > lastBp.rawHigh) {
    const ispu =
      ((lastBp.ispuHigh - lastBp.ispuLow) / (lastBp.rawHigh - lastBp.rawLow)) *
        (rawVal - lastBp.rawLow) +
      lastBp.ispuLow;
    return Math.min(Math.round(ispu), 500);
  }

  return 0;
}

export function getISPUCategory(ispuValue: number): ISPUCategory {
  if (ispuValue <= 50) {
    return {
      category: "Baik",
      colorHex: "#10b981", // Green
      badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
      description: "Tingkat kualitas udara sangat baik, tidak memberikan efek negatif bagi manusia atau hewan.",
      healthAdvice: "Kualitas udara sangat baik. Aman untuk beraktivitas luar ruangan tanpa masker.",
    };
  } else if (ispuValue <= 100) {
    return {
      category: "Sedang",
      colorHex: "#3b82f6", // Blue / Yellow
      badgeClass: "bg-blue-50 text-blue-700 border-blue-200",
      description: "Kualitas udara dapat diterima, namun beberapa polutan mungkin mempengaruhi kelompok rentan.",
      healthAdvice: "Kelompok sensitif sebaiknya mengurangi aktivitas fisik berat di luar ruangan.",
    };
  } else if (ispuValue <= 200) {
    return {
      category: "Tidak Sehat",
      colorHex: "#f59e0b", // Amber/Orange
      badgeClass: "bg-amber-50 text-amber-700 border-amber-200",
      description: "Kualitas udara bersifat merugikan pada manusia, hewan, dan tumbuhan.",
      healthAdvice: "Gunakan masker saat keluar ruangan. Kelompok sensitif disarankan tetap berada di dalam ruangan.",
    };
  } else if (ispuValue <= 300) {
    return {
      category: "Sangat Tidak Sehat",
      colorHex: "#ef4444", // Red
      badgeClass: "bg-red-50 text-red-700 border-red-200",
      description: "Kualitas udara dapat meningkatkan risiko kesehatan pada seluruh segmen populasi.",
      healthAdvice: "Hindari seluruh aktivitas di luar ruangan. Tutup jendela dan gunakan pemurni udara.",
    };
  } else {
    return {
      category: "Berbahaya",
      colorHex: "#18181b", // Black/Dark
      badgeClass: "bg-neutral-900 text-white border-neutral-700",
      description: "Tingkat kualitas udara berbahaya dan berpotensi memicu dampak kesehatan darurat.",
      healthAdvice: "Kondisi darurat polusi. Wajib berdiam di dalam ruangan dengan filtrasi udara.",
    };
  }
}
