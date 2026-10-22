export interface AirQualityStation {
  id: string;
  name: string;
  code: string;
  kecamatan: "Klojen" | "Lowokwaru" | "Blimbing" | "Sukun" | "Kedungkandang";
  latitude: number;
  longitude: number;
  elevationMeters: number;
  stationType: "SPKU Otomatis Kontinu (DLH/KLHK)" | "Sensor Pemantau Mikroklimat" | "Stasiun Referensi Model";
  activeStatus: "OPERATIONAL" | "MAINTENANCE" | "STALE_DATA";
  lastCalibrationDate: string;
  sourceAuthority: "Dinas Lingkungan Hidup Kota Malang" | "Kementerian LHK" | "Open-Meteo Environmental Stream";
  notes: string;
}

export const MALANG_AIR_STATIONS: AirQualityStation[] = [
  {
    id: "spku-alun-alun",
    name: "Stasiun Alun-Alun Merdeka (SPKU DLH)",
    code: "MLG-KLJ-01",
    kecamatan: "Klojen",
    latitude: -7.9826,
    longitude: 112.6308,
    elevationMeters: 440,
    stationType: "SPKU Otomatis Kontinu (DLH/KLHK)",
    activeStatus: "OPERATIONAL",
    lastCalibrationDate: "2024-09-12",
    sourceAuthority: "Dinas Lingkungan Hidup Kota Malang",
    notes: "Stasiun inti pusat kota, memantau dampak aktivitas perkantoran, perbankan, dan wisata kuliner heritage.",
  },
  {
    id: "spku-suhat-lowokwaru",
    name: "Stasiun Koridor Suhat / Kampus UB",
    code: "MLG-LKW-02",
    kecamatan: "Lowokwaru",
    latitude: -7.9463,
    longitude: 112.6162,
    elevationMeters: 475,
    stationType: "Sensor Pemantau Mikroklimat",
    activeStatus: "OPERATIONAL",
    lastCalibrationDate: "2024-10-05",
    sourceAuthority: "Dinas Lingkungan Hidup Kota Malang",
    notes: "Memantau polutan jalan raya di zona padat mahasiswa, kafe, dan kemacetan jam pulang kampus.",
  },
  {
    id: "spku-ijen-boulevard",
    name: "Stasiun Taman Ijen Boulevard",
    code: "MLG-KLJ-03",
    kecamatan: "Klojen",
    latitude: -7.9735,
    longitude: 112.6212,
    elevationMeters: 450,
    stationType: "Sensor Pemantau Mikroklimat",
    activeStatus: "OPERATIONAL",
    lastCalibrationDate: "2024-08-30",
    sourceAuthority: "Dinas Lingkungan Hidup Kota Malang",
    notes: "Zona cagar budaya dan jalur hijau. Indikator kualitas udara pembanding di area dengan vegetasi tinggi.",
  },
  {
    id: "spku-gadang-sukun",
    name: "Stasiun Arteri Pasar Gadang",
    code: "MLG-SKN-04",
    kecamatan: "Sukun",
    latitude: -8.0210,
    longitude: 112.6280,
    elevationMeters: 420,
    stationType: "Sensor Pemantau Mikroklimat",
    activeStatus: "OPERATIONAL",
    lastCalibrationDate: "2024-11-01",
    sourceAuthority: "Dinas Lingkungan Hidup Kota Malang",
    notes: "Koridor perlintasan truk logistik antarkota dan aktivitas pasar induk sayur dan komoditas.",
  },
];
