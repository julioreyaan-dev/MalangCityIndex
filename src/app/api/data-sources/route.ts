import { NextResponse } from "next/server";
import { MALANG_DATA_SOURCES } from "@/lib/data/dataSourcesMeta";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      count: MALANG_DATA_SOURCES.length,
      sources: MALANG_DATA_SOURCES,
    });
  } catch (error) {
    console.error("Error in /api/data-sources:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memuat status sumber data" },
      { status: 500 }
    );
  }
}
