export interface KecamatanData {
  id: string;
  name: string;
  areaKm2: number;
  population: number; // Sensus BPS Kota Malang 2023/2024
  densityPerKm2: number;
  centerCoordinates: [number, number]; // [lng, lat]
  kelurahanCount: number;
  characteristics: string;
  polygonCoordinates: [number, number][]; // Poligon batas administrasi ringkas
}

export const MALANG_KECAMATAN: KecamatanData[] = [
  {
    id: "klojen",
    name: "Klojen",
    areaKm2: 8.83,
    population: 94250,
    densityPerKm2: 10673,
    centerCoordinates: [112.6315, -7.9790],
    kelurahanCount: 11,
    characteristics: "Pusat pemerintahan kota, kawasan cagar budaya Kayutangan, stasiun kereta api Kotabaru, dan perbankan.",
    polygonCoordinates: [
      [112.6180, -7.9680],
      [112.6380, -7.9650],
      [112.6450, -7.9850],
      [112.6320, -7.9940],
      [112.6190, -7.9820],
      [112.6180, -7.9680],
    ],
  },
  {
    id: "lowokwaru",
    name: "Lowokwaru",
    areaKm2: 22.60,
    population: 165400,
    densityPerKm2: 7318,
    centerCoordinates: [112.6150, -7.9450],
    kelurahanCount: 12,
    characteristics: "Pusat pendidikan tinggi (UB, UM, UIN, Polinema, Unisma) dengan mobilitas mahasiswa dan komersial tertinggi.",
    polygonCoordinates: [
      [112.5950, -7.9300],
      [112.6320, -7.9300],
      [112.6380, -7.9650],
      [112.6180, -7.9680],
      [112.5920, -7.9550],
      [112.5950, -7.9300],
    ],
  },
  {
    id: "blimbing",
    name: "Blimbing",
    areaKm2: 17.77,
    population: 182300,
    densityPerKm2: 10258,
    centerCoordinates: [112.6480, -7.9400],
    kelurahanCount: 11,
    characteristics: "Pintu gerbang utara Kota Malang (akses Surabaya via Arjosari), zona industri dan perdagangan.",
    polygonCoordinates: [
      [112.6320, -7.9300],
      [112.6700, -7.9200],
      [112.6750, -7.9580],
      [112.6450, -7.9650],
      [112.6380, -7.9650],
      [112.6320, -7.9300],
    ],
  },
  {
    id: "sukun",
    name: "Sukun",
    areaKm2: 20.97,
    population: 201100,
    densityPerKm2: 9589,
    centerCoordinates: [112.6180, -8.0050],
    kelurahanCount: 11,
    characteristics: "Wilayah permukiman padat, industri tembakau/rokok, koridor arteri menuju Blitar/Kepanjen, dan RSUD.",
    polygonCoordinates: [
      [112.5920, -7.9850],
      [112.6190, -7.9820],
      [112.6320, -7.9940],
      [112.6380, -8.0300],
      [112.5980, -8.0280],
      [112.5920, -7.9850],
    ],
  },
  {
    id: "kedungkandang",
    name: "Kedungkandang",
    areaKm2: 39.89,
    population: 213900,
    densityPerKm2: 5362,
    centerCoordinates: [112.6580, -8.0020],
    kelurahanCount: 12,
    characteristics: "Kecamatan terluas di Kota Malang dengan pusat perkantoran Pemkot baru (Block Office) dan GOR Ken Arok.",
    polygonCoordinates: [
      [112.6450, -7.9650],
      [112.6750, -7.9580],
      [112.6950, -8.0150],
      [112.6650, -8.0380],
      [112.6380, -8.0300],
      [112.6320, -7.9940],
      [112.6450, -7.9650],
    ],
  },
];
