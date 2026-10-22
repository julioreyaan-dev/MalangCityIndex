import { NextResponse } from "next/server";
import { getCorridorTrafficStatuses } from "@/lib/providers/dishubTrafficProvider";
import { MALANG_AIR_STATIONS } from "@/lib/data/airStations";
import { MALANG_KECAMATAN } from "@/lib/data/administrativeKecamatan";
import { MALANG_TRANSIT_ROUTES } from "@/lib/data/publicTransitRoutes";
import { fetchMalangAirQuality } from "@/lib/providers/openMeteoProvider";
import { calculateISPUFromRaw, getISPUCategory } from "@/lib/engine/ispuCalculator";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const corridors = getCorridorTrafficStatuses();
    const airMain = await fetchMalangAirQuality();

    // 1. GeoJSON Koridor Jalan
    const roadGeoJson = {
      type: "FeatureCollection",
      features: corridors.map((c) => ({
        type: "Feature",
        id: c.corridor.id,
        geometry: {
          type: "LineString",
          coordinates: c.corridor.coordinates,
        },
        properties: {
          id: c.corridor.id,
          name: c.corridor.name,
          kecamatan: c.corridor.kecamatan,
          roadClass: c.corridor.roadClass,
          observedSpeedKmh: c.corridor.observedSpeedKmh,
          freeFlowSpeedKmh: c.corridor.freeFlowSpeedKmh,
          travelTimeMinutes: c.travelTimeMinutes,
          delayMinutes: c.delayMinutes,
          los: c.congestion.los,
          statusLabel: c.congestion.statusLabel,
          color: c.congestion.colorHex,
          lengthKm: c.corridor.lengthKm,
          oneWay: c.corridor.oneWay,
        },
      })),
    };

    // 2. GeoJSON Stasiun Kualitas Udara
    const airStationsGeoJson = {
      type: "FeatureCollection",
      features: MALANG_AIR_STATIONS.map((st) => {
        let mult = 1.0;
        if (st.id === "spku-suhat-lowokwaru") mult = 1.12;
        if (st.id === "spku-ijen-boulevard") mult = 0.82;
        if (st.id === "spku-gadang-sukun") mult = 1.18;

        const pm25 = Number((airMain.pm25 * mult).toFixed(1));
        const ispu = calculateISPUFromRaw(pm25, "pm25");
        const category = getISPUCategory(ispu);

        return {
          type: "Feature",
          id: st.id,
          geometry: {
            type: "Point",
            coordinates: [st.longitude, st.latitude],
          },
          properties: {
            id: st.id,
            name: st.name,
            code: st.code,
            kecamatan: st.kecamatan,
            pm25,
            ispu,
            category: category.category,
            color: category.colorHex,
            type: st.stationType,
            authority: st.sourceAuthority,
          },
        };
      }),
    };

    // 3. GeoJSON Batas Administrasi Kecamatan
    const kecamatanGeoJson = {
      type: "FeatureCollection",
      features: MALANG_KECAMATAN.map((k) => ({
        type: "Feature",
        id: k.id,
        geometry: {
          type: "Polygon",
          coordinates: [k.polygonCoordinates],
        },
        properties: {
          id: k.id,
          name: k.name,
          areaKm2: k.areaKm2,
          population: k.population,
          densityPerKm2: k.densityPerKm2,
          kelurahanCount: k.kelurahanCount,
          characteristics: k.characteristics,
        },
      })),
    };

    // 4. GeoJSON Rute Trayek Angkutan Kota
    const transitGeoJson = {
      type: "FeatureCollection",
      features: MALANG_TRANSIT_ROUTES.map((tr) => ({
        type: "Feature",
        id: tr.id,
        geometry: {
          type: "LineString",
          coordinates: tr.coordinates,
        },
        properties: {
          id: tr.id,
          code: tr.code,
          name: tr.name,
          color: tr.colorHex,
          origin: tr.terminalOrigin,
          destination: tr.terminalDestination,
          fleet: tr.fleetCountEstimate,
        },
      })),
    };

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      layers: {
        roads: roadGeoJson,
        airStations: airStationsGeoJson,
        kecamatans: kecamatanGeoJson,
        transitRoutes: transitGeoJson,
      },
    });
  } catch (error) {
    console.error("Error in /api/map/layers:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menghasilkan data lapisan peta" },
      { status: 500 }
    );
  }
}
