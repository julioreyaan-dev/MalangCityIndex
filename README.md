# 🏙️ Malang City Index

**Urban Mobility & Air Quality Observatory**

Malang City Index adalah platform dashboard *Smart City* yang dirancang untuk memantau, menganalisis, dan mengevaluasi kondisi kemacetan lalu lintas serta kualitas udara di Kota Malang. Platform ini mengintegrasikan visualisasi data spasial, indikator kinerja transportasi, pemantauan polusi udara, dan simulasi kebijakan untuk mendukung pengambilan keputusan berbasis data.

##  Fitur Utama

- **📊 Executive Dashboard** — Menampilkan indikator utama kemacetan, kecepatan kendaraan, kualitas udara, dan cakupan wilayah.
- **🚦 Traffic Monitoring** — Analisis kondisi lalu lintas pada 7 koridor arteri utama menggunakan parameter kecepatan, tundaan, rasio waktu tempuh, dan Level of Service (LOS).
- **🌫️ Air Quality Monitoring** — Pemantauan konsentrasi polutan seperti PM2.5, PM10, SO2, NO2, CO, dan O3 serta perhitungan Indeks Standar Pencemar Udara (ISPU).
- **🗺️ Interactive GIS Map** — Visualisasi peta interaktif yang mencakup 5 kecamatan dan 57 kelurahan di Kota Malang.
- **🔮 Policy Simulator** — Simulasi skenario kebijakan lalu lintas, seperti optimasi lampu lalu lintas, peralihan moda transportasi, dan pengaturan jam masuk sekolah atau kantor.
- **📈 Historical Analytics** — Visualisasi tren historis untuk menganalisis perubahan kondisi lalu lintas dan kualitas udara.
- **📡 Live Telemetry Ticker** — Panel informasi status koridor lalu lintas, kualitas udara, dan pembaruan data.
- **🔍 Data Transparency** — Informasi sumber data, metodologi perhitungan, dan keterbatasan model analisis.

## 🛠️ Teknologi

- **Next.js 15+** — Framework aplikasi web.
- **React 19** — Pembangunan antarmuka pengguna.
- **TypeScript 5** — Pengembangan aplikasi dengan tipe data yang terstruktur.
- **Tailwind CSS v4** — Styling dan desain antarmuka.
- **MapLibre GL JS** — Visualisasi peta interaktif berbasis GIS.
- **Recharts** — Visualisasi grafik dan analitik data.
- **Supabase / Next.js Edge API** — Lapisan integrasi dan pengelolaan data.
- **Vercel & GitHub Actions** — Deployment dan otomatisasi pengembangan.

## 📐 Metodologi Analisis

Malang City Index menggunakan beberapa pendekatan analitis:

- **ISPU** — Perhitungan indeks kualitas udara berdasarkan metode yang dirujuk dalam Permen LHK No. 14 Tahun 2020.
- **PKJI 2023** — Analisis kinerja lalu lintas dan tingkat pelayanan jalan.
- **Travel Time Ratio (TTR)** — Perbandingan waktu tempuh aktual dengan waktu tempuh arus bebas.
- **BPR Delay Model** — Estimasi tundaan lalu lintas untuk simulasi skenario.
- **VKT Carbon Emission Estimator** — Estimasi perubahan emisi berdasarkan perubahan jarak perjalanan kendaraan.

##  Tujuan Proyek

1. Menyediakan informasi kemacetan dan kualitas udara Kota Malang dalam satu dashboard terintegrasi.
2. Membantu evaluasi kinerja koridor jalan dan identifikasi potensi kemacetan.
3. Mendukung simulasi kebijakan transportasi sebelum diterapkan di lapangan.
4. Menyediakan visualisasi data yang informatif bagi pemerintah, akademisi, peneliti, dan masyarakat.
5. Mendorong pengambilan keputusan berbasis data untuk mendukung pengembangan Smart City.

## 🗺️ Cakupan Wilayah

Platform dirancang untuk mencakup seluruh wilayah administratif Kota Malang, yaitu 5 kecamatan dan 57 kelurahan, dengan fokus analisis pada 7 koridor arteri utama.

## 🚀 Roadmap Pengembangan

- [x] Pengembangan dashboard dan antarmuka pengguna.
- [x] Implementasi perhitungan ISPU, analisis PKJI, dan simulasi BPR.
- [x] Integrasi repository GitHub dan deployment ke Vercel.
- [ ] Integrasi data sensor kualitas udara dan lalu lintas secara langsung.
- [ ] Pengembangan model Machine Learning untuk prediksi kemacetan dan polusi udara.
- [ ] Penyempurnaan analisis historis dan simulasi kebijakan.

## 📂 Sumber Data

Sumber data yang direncanakan atau dirujuk dalam proposal meliputi:

- Dinas Perhubungan Kota Malang (Dishub).
- Dinas Lingkungan Hidup Kota Malang (DLH).
- Open-Meteo dan Copernicus Atmosphere Monitoring Service (CAMS).
- Badan Informasi Geospasial (BIG) dan OpenStreetMap.
- Badan Pusat Statistik Kota Malang (BPS).

**Catatan:** Ketersediaan data real-time bergantung pada akses sumber data dan integrasi yang telah diimplementasikan. Data simulasi atau estimasi tidak merepresentasikan pengukuran lapangan secara langsung.

## 📌 Status Proyek

Malang City Index dikembangkan sebagai platform pendukung keputusan berbasis data untuk sektor Smart Mobility, Smart Environment, dan Smart Governance di Kota Malang.

---

**Malang City Index — Data-Driven Insights for a Smarter Malang City.**
