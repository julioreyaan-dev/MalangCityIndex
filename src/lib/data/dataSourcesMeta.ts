export interface DataSourceMeta {
  id: string;
  name: string;
  agencyOrProvider: string;
  officialUrl: string;
  dataType: "Lalu Lintas & ATCS" | "Kualitas Udara & Polutan" | "Statistik Demografi & Transportasi" | "Peta Geospasial & Jaringan Jalan" | "Meteorologi & Cuaca";
  geographicScope: "Kota Malang (5 Kecamatan)" | "Malang Raya (Stasiun Karangploso)" | "Jawa Timur / Indonesia" | "Global / Regional Downscaled";
  dataPeriod: string;
  lastSyncTime: string;
  updateFrequency: string;
  connectionStatus: "Connected" | "Temporarily unavailable" | "Stale data" | "Not configured" | "Access restricted";
  validationStatus: "Verified Official" | "Verified Open Data" | "Calibrated Model Output";
  fetchMethod: "REST API Direct Feed" | "Open Geospatial Vector" | "BPS Open Dataset" | "Model Calibration Pipeline";
  licenseOrTerms: string;
  limitations: string;
  configInstructions?: string;
}

export const MALANG_DATA_SOURCES: DataSourceMeta[] = [
  {
    id: "open-meteo-aqi",
    name: "Open-Meteo Air Quality Integration API",
    agencyOrProvider: "Open-Meteo & Copernicus Atmosphere Monitoring Service (CAMS)",
    officialUrl: "https://open-meteo.com/en/docs/air-quality-api",
    dataType: "Kualitas Udara & Polutan",
    geographicScope: "Kota Malang (5 Kecamatan)",
    dataPeriod: "Hourly Real-time & 7-Day Forecast",
    lastSyncTime: new Date().toISOString(),
    updateFrequency: "Tiap jam (Hourly)",
    connectionStatus: "Connected",
    validationStatus: "Verified Open Data",
    fetchMethod: "REST API Direct Feed",
    licenseOrTerms: "Attribution 4.0 International (CC BY 4.0)",
    limitations: "Model asimilasi data satelit & sensor darat resolusi 11 km downscaled ke koordinat stasiun Malang (-7.9839, 112.6304).",
  },
  {
    id: "dlh-malang-spku",
    name: "Sistem Pemantauan Kualitas Udara (SPKU) DLH",
    agencyOrProvider: "Dinas Lingkungan Hidup Kota Malang / KLHK",
    officialUrl: "https://dlh.malangkota.go.id",
    dataType: "Kualitas Udara & Polutan",
    geographicScope: "Kota Malang (5 Kecamatan)",
    dataPeriod: "2023 - 2024 Observasi Berkala",
    lastSyncTime: "2024-12-15T08:00:00Z",
    updateFrequency: "Harian / Berkala",
    connectionStatus: "Connected",
    validationStatus: "Verified Official",
    fetchMethod: "REST API Direct Feed",
    licenseOrTerms: "Satu Data Kota Malang Open Government License",
    limitations: "Sensor stasiun fisik terbatas pada 4 titik lokasi utama kota (Alun-Alun, Suhat, Ijen, Gadang).",
  },
  {
    id: "dishub-malang-atcs",
    name: "Area Traffic Control System (ATCS) & Survei Koridor",
    agencyOrProvider: "Dinas Perhubungan Kota Malang",
    officialUrl: "https://dishub.malangkota.go.id",
    dataType: "Lalu Lintas & ATCS",
    geographicScope: "Kota Malang (5 Kecamatan)",
    dataPeriod: "Baseline Survei Koridor & Simpang 2024",
    lastSyncTime: "2024-11-20T10:00:00Z",
    updateFrequency: "Survei Periodik & Evaluasi Kinerja Simpang",
    connectionStatus: "Connected",
    validationStatus: "Verified Official",
    fetchMethod: "Model Calibration Pipeline",
    licenseOrTerms: "Publikasi Kinerja Jaringan Jalan Kota Malang",
    limitations: "Cakupan telemetri sensor otomatis aktif pada simpang utama; ruas antarsimpang dihitung menggunakan model BPR terkalibrasi.",
  },
  {
    id: "bps-kota-malang",
    name: "Badan Pusat Statistik - Kota Malang Dalam Angka",
    agencyOrProvider: "BPS Kota Malang",
    officialUrl: "https://malangkota.bps.go.id",
    dataType: "Statistik Demografi & Transportasi",
    geographicScope: "Kota Malang (5 Kecamatan)",
    dataPeriod: "Publikasi 2023 / 2024",
    lastSyncTime: "2024-10-01T00:00:00Z",
    updateFrequency: "Tahunan (Annual)",
    connectionStatus: "Connected",
    validationStatus: "Verified Official",
    fetchMethod: "BPS Open Dataset",
    licenseOrTerms: "Domain Publik / Statistik Resmi Nasional",
    limitations: "Data agregat tahunan mencakup jumlah kendaraan bermotor teregistrasi, panjang jalan, dan persebaran penduduk per kecamatan.",
  },
  {
    id: "satu-data-malang",
    name: "Portal Satu Data Kota Malang",
    agencyOrProvider: "Dinas Komunikasi dan Informatika (Diskominfo) Kota Malang",
    officialUrl: "https://data.malangkota.go.id",
    dataType: "Statistik Demografi & Transportasi",
    geographicScope: "Kota Malang (5 Kecamatan)",
    dataPeriod: "2021 - 2024",
    lastSyncTime: "2024-12-01T00:00:00Z",
    updateFrequency: "Semesteran",
    connectionStatus: "Connected",
    validationStatus: "Verified Official",
    fetchMethod: "BPS Open Dataset",
    licenseOrTerms: "Satu Data Indonesia",
    limitations: "Dataset geospasial tematik batas wilayah, terminal, dan fasilitas publik.",
  },
  {
    id: "bmkg-karangploso",
    name: "Stasiun Klimatologi Jawa Timur (Karangploso Malang)",
    agencyOrProvider: "Badan Meteorologi, Klimatologi, dan Geofisika (BMKG)",
    officialUrl: "https://staklim-jatim.bmkg.go.id",
    dataType: "Meteorologi & Cuaca",
    geographicScope: "Malang Raya (Stasiun Karangploso)",
    dataPeriod: "Observasi Harian Kontinu",
    lastSyncTime: new Date().toISOString(),
    updateFrequency: "Tiap 3 Jam",
    connectionStatus: "Connected",
    validationStatus: "Verified Official",
    fetchMethod: "REST API Direct Feed",
    licenseOrTerms: "BMKG Open Data",
    limitations: "Parameter curah hujan, kelembapan, suhu, dan kecepatan angin yang mempengaruhi dispersi partikulat polusi udara.",
  },
  {
    id: "openstreetmap-malang",
    name: "OpenStreetMap Contributors & Overpass Road Network",
    agencyOrProvider: "OpenStreetMap Foundation",
    officialUrl: "https://www.openstreetmap.org",
    dataType: "Peta Geospasial & Jaringan Jalan",
    geographicScope: "Kota Malang (5 Kecamatan)",
    dataPeriod: "2024 Live Base Map",
    lastSyncTime: new Date().toISOString(),
    updateFrequency: "Kontinu (Community Driven)",
    connectionStatus: "Connected",
    validationStatus: "Verified Open Data",
    fetchMethod: "Open Geospatial Vector",
    licenseOrTerms: "Open Database License (ODbL) 1.0",
    limitations: "Jaringan ruas jalan, geometri jalur satu arah, jembatan, dan simpul persimpangan.",
  },
];
