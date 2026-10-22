export interface HistoricalDataPoint {
  timestamp: string; // ISO format
  date: string;
  hour: number;
  averageSpeedKmh: number;
  congestionIndexScore: number; // 0 - 100
  pm25Concentration: number; // µg/m³
  pm10Concentration: number; // µg/m³
  ispuScore: number; // 0 - 500
  ispuCategory: "Baik" | "Sedang" | "Tidak Sehat" | "Sangat Tidak Sehat";
  trafficVolumeVehPerHour: number;
  weatherCondition: "Cerah" | "Berawan" | "Hujan Ringan" | "Hujan Lebat";
  isAnomaly: boolean;
  anomalyNote?: string;
}

// Generate realistic verified-baseline time series for Kota Malang
// Mengacu pada pola karakteristik mobilitas Kota Malang:
// - Puncak Pagi: 06:45 - 08:30 WIB (Sekolah & Kantor)
// - Puncak Sore: 16:15 - 18:30 WIB (Kepulangan & Aktivitas Komersial Suhat/Kayutangan)
// - Anomali Akhir Pekan & Musim Liburan (Pariwisata & Akses Kota Batu via Dinoyo)
export function getMalangHistoricalTimeseries(days = 14): HistoricalDataPoint[] {
  const points: HistoricalDataPoint[] = [];
  const now = new Date();

  for (let d = days; d >= 0; d--) {
    const currentDate = new Date(now.getTime() - d * 24 * 60 * 60 * 1000);
    const dateStr = currentDate.toISOString().split("T")[0];
    const isWeekend = currentDate.getDay() === 0 || currentDate.getDay() === 6;

    // Ambil sampel jam-jam utama: 07:00 (pagi), 12:00 (siang), 17:00 (sore puncak), 21:00 (malam)
    const sampledHours = [7, 12, 17, 21];

    for (const h of sampledHours) {
      let speed = 25.0;
      let pm25 = 22.0;
      let ispu = 45;
      let ispuCat: "Baik" | "Sedang" | "Tidak Sehat" = "Baik";
      let isAnomaly = false;
      let anomalyNote: string | undefined = undefined;

      if (h === 7) {
        // Jam Sibuk Pagi
        speed = isWeekend ? 28.5 : 17.2;
        pm25 = isWeekend ? 21.0 : 34.5;
        ispu = isWeekend ? 48 : 72;
        ispuCat = isWeekend ? "Baik" : "Sedang";
      } else if (h === 12) {
        speed = 22.0;
        pm25 = 26.0;
        ispu = 55;
        ispuCat = "Sedang";
      } else if (h === 17) {
        // Jam Sibuk Sore Puncak
        speed = isWeekend ? 15.8 : 14.5; // Akhir pekan di Malang sering macet karena wisatawan Batu
        pm25 = 38.0;
        ispu = 81;
        ispuCat = "Sedang";

        if (d === 3) {
          // Simulasi anomali nyata (Hujan deras sore + kemacetan simpang Dinoyo)
          speed = 9.8;
          pm25 = 14.2; // Hujan membersihkan partikulat debu (washout)
          ispu = 35;
          ispuCat = "Baik";
          isAnomaly = true;
          anomalyNote = "Hujan lebat sesaat menyebabkan genangan dan perlambatan drastis koridor barat Dinoyo-Suhat.";
        }
      } else {
        // Malam
        speed = 34.0;
        pm25 = 18.0;
        ispu = 40;
        ispuCat = "Baik";
      }

      const congestionIndex = Math.min(100, Math.max(5, Math.round(((45 - speed) / 45) * 100)));

      points.push({
        timestamp: `${dateStr}T${h.toString().padStart(2, "0")}:00:00+07:00`,
        date: dateStr,
        hour: h,
        averageSpeedKmh: Number(speed.toFixed(1)),
        congestionIndexScore: congestionIndex,
        pm25Concentration: Number(pm25.toFixed(1)),
        pm10Concentration: Number((pm25 * 1.55).toFixed(1)),
        ispuScore: ispu,
        ispuCategory: ispuCat,
        trafficVolumeVehPerHour: Math.round((congestionIndex / 100) * 4500 + 1200),
        weatherCondition: d === 3 && h === 17 ? "Hujan Lebat" : "Cerah",
        isAnomaly,
        anomalyNote,
      });
    }
  }

  return points;
}
