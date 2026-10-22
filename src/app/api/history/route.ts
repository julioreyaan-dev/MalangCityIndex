import { NextRequest, NextResponse } from "next/server";
import { getMalangHistoricalTimeseries, HistoricalDataPoint } from "@/lib/data/historicalDataset";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const daysParam = parseInt(searchParams.get("days") || "14", 10);
    const format = searchParams.get("format"); // 'json' or 'csv'

    const validDays = Math.min(90, Math.max(3, isNaN(daysParam) ? 14 : daysParam));
    const timeseries = getMalangHistoricalTimeseries(validDays);

    // Jika format CSV diminta untuk ekspor
    if (format === "csv") {
      const headers = [
        "timestamp",
        "date",
        "hour",
        "average_speed_kmh",
        "congestion_index",
        "pm25_ug_m3",
        "pm10_ug_m3",
        "ispu_score",
        "ispu_category",
        "traffic_volume_veh_hr",
        "weather",
        "is_anomaly",
        "anomaly_note",
      ].join(",");

      const rows = timeseries.map((pt) =>
        [
          pt.timestamp,
          pt.date,
          pt.hour,
          pt.averageSpeedKmh,
          pt.congestionIndexScore,
          pt.pm25Concentration,
          pt.pm10Concentration,
          pt.ispuScore,
          `"${pt.ispuCategory}"`,
          pt.trafficVolumeVehPerHour,
          `"${pt.weatherCondition}"`,
          pt.isAnomaly,
          `"${pt.anomalyNote || ""}"`,
        ].join(",")
      );

      const csvContent = [headers, ...rows].join("\n");

      return new NextResponse(csvContent, {
        status: 200,
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="malang_urban_index_${validDays}d.csv"`,
        },
      });
    }

    // Statistik agregat
    const speeds = timeseries.map((p) => p.averageSpeedKmh);
    const pm25s = timeseries.map((p) => p.pm25Concentration);
    const ispus = timeseries.map((p) => p.ispuScore);

    const calcStats = (arr: number[]) => {
      const sorted = [...arr].sort((a, b) => a - b);
      const min = sorted[0];
      const max = sorted[sorted.length - 1];
      const sum = sorted.reduce((a, b) => a + b, 0);
      const mean = Number((sum / sorted.length).toFixed(1));
      const mid = Math.floor(sorted.length / 2);
      const median =
        sorted.length % 2 !== 0
          ? sorted[mid]
          : Number(((sorted[mid - 1] + sorted[mid]) / 2).toFixed(1));
      return { min, max, mean, median };
    };

    const speedStats = calcStats(speeds);
    const pm25Stats = calcStats(pm25s);
    const ispuStats = calcStats(ispus);

    const anomalies = timeseries.filter((p) => p.isAnomaly);

    return NextResponse.json({
      success: true,
      periodDays: validDays,
      totalDataPoints: timeseries.length,
      anomaliesDetected: anomalies.length,
      statistics: {
        speed: speedStats,
        pm25: pm25Stats,
        ispu: ispuStats,
      },
      timeseries,
      metadata: {
        methodology: "Data historis terverifikasi baseline Dishub, DLH, dan Open-Meteo",
        disclaimer: "Data telah disaring dari missing values dan dinormalisasi ke standar waktu WIB (UTC+7).",
      },
    });
  } catch (error) {
    console.error("Error in /api/history:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memproses data historis" },
      { status: 500 }
    );
  }
}
