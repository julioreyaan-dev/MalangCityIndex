import { NextRequest, NextResponse } from "next/server";
import { getCorridorTrafficStatuses } from "@/lib/providers/dishubTrafficProvider";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const kecamatan = searchParams.get("kecamatan");

    let corridors = getCorridorTrafficStatuses();

    if (kecamatan && kecamatan !== "all") {
      corridors = corridors.filter(
        (c) => c.corridor.kecamatan.toLowerCase() === kecamatan.toLowerCase()
      );
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      count: corridors.length,
      data: corridors,
      metadata: {
        methodology: "Pedoman Kapasitas Jalan Indonesia (PKJI 2023) & Travel Time Ratio (TTR)",
        sourceAuthority: "Dinas Perhubungan Kota Malang",
        disclaimer: "Data kecepatan adalah hasil survei baseline terkalibrasi dengan status persimpangan ATCS, bukan streaming GPS seluler kontinu tanpa izin.",
      },
    });
  } catch (error) {
    console.error("Error in /api/traffic:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memuat data koridor lalu lintas" },
      { status: 500 }
    );
  }
}
