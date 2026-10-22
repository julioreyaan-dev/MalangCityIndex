import React from "react";
import Link from "next/link";
import { 
  Info, 
  BookOpen, 
  Cpu, 
  ShieldCheck, 
  ArrowRight,
  Calculator,
  Compass,
  FileCode
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-[1720px] w-full px-4 sm:px-6 lg:px-8 xl:px-10 py-8 space-y-10">
      {/* Header */}
      <div className="border-b border-slate-800/80 pb-6 space-y-2">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-cyan-300 bg-cyan-950/60 px-2.5 py-0.5 rounded-md border border-cyan-500/40 backdrop-blur-sm">
            Metodologi Resmi & Dokumentasi
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight font-sans drop-shadow-sm">
          Tentang Malang City Index
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
          Malang City Index adalah inisiatif data terbuka independen untuk mendukung perencanaan transportasi cerdas, analisis dampak polusi udara, serta pengambilan kebijakan berbasis bukti (evidence-based urban policymaking) di Kota Malang, Jawa Timur.
        </p>
      </div>

      {/* Methodology Section 1: Traffic Congestion Index & PKJI 2023 */}
      <section id="pkji-methodology" className="space-y-4">
        <div className="flex items-center gap-2 text-white font-bold text-lg font-sans">
          <Calculator className="h-5 w-5 text-sky-400" />
          <h2>1. Metodologi Traffic Congestion Index & PKJI 2023</h2>
        </div>

        <div className="rounded-2xl border border-slate-700/60 bg-[#0e1726]/60 backdrop-blur-xl p-6 sm:p-7 shadow-xl space-y-4 text-xs text-slate-300 leading-relaxed font-sans">
          <p>
            Tingkat kemacetan koridor jalan dihitung menggunakan pendekatan <b className="text-white">Travel Time Ratio (TTR)</b> dan evaluasi <b className="text-white">Level of Service (LOS)</b> berdasarkan <i className="text-cyan-300">Pedoman Kapasitas Jalan Indonesia (PKJI 2023)</i> yang diterbitkan oleh Kementerian Pekerjaan Umum dan Perumahan Rakyat (PUPR).
          </p>

          <div className="rounded-xl bg-[#090e18]/80 border border-slate-800/80 p-4 font-mono text-cyan-300 space-y-2">
            <div className="font-bold text-white font-sans text-xs">Rumus Travel Time Ratio:</div>
            <div className="text-sm">TTR = T_aktual / T_arus_bebas = V_arus_bebas / V_aktual</div>
            <div className="text-[11px] text-slate-400 font-sans leading-normal">
              Di mana V_arus_bebas adalah kecepatan desain ruas jalan (misal 45 km/jam untuk arteri sekunder perkotaan) dan V_aktual adalah kecepatan rata-rata kendaraan hasil pengamatan.
            </div>
          </div>

          <div className="space-y-2">
            <div className="font-bold text-white text-xs">Klasifikasi Level of Service (LOS):</div>
            <ul className="list-disc list-inside space-y-1.5 pl-1 text-slate-300">
              <li><b className="text-emerald-400">LOS A (TTR ≤ 1.15, V/C &lt; 0.35):</b> Arus bebas sempurna, pengemudi bebas memilih kecepatan.</li>
              <li><b className="text-sky-400">LOS B (TTR 1.16 - 1.30, V/C 0.35 - 0.54):</b> Arus stabil dengan sedikit hambatan internal.</li>
              <li><b className="text-yellow-400">LOS C (TTR 1.31 - 1.50, V/C 0.55 - 0.74):</b> Arus stabil namun kecepatan mulai dibatasi kendaraan lain.</li>
              <li><b className="text-amber-400">LOS D (TTR 1.51 - 1.85, V/C 0.75 - 0.87):</b> Arus mendekati jenuh, antrean sering terjadi pada persimpangan sinyal.</li>
              <li><b className="text-orange-400">LOS E (TTR 1.86 - 2.30, V/C 0.88 - 0.99):</b> Volume lalu lintas mendekati kapasitas penuh, kecepatan merayap.</li>
              <li><b className="text-rose-400">LOS F (TTR &gt; 2.30, V/C ≥ 1.00):</b> Arus macet total (gridlock), kecepatan &lt; 10 km/jam, antrean panjang tidak terurai.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Methodology Section 2: ISPU Standard */}
      <section id="ispu-standard" className="space-y-4">
        <div className="flex items-center gap-2 text-white font-bold text-lg font-sans">
          <BookOpen className="h-5 w-5 text-emerald-400" />
          <h2>2. Standar Indeks Standar Pencemar Udara (ISPU)</h2>
        </div>

        <div className="rounded-2xl border border-slate-700/60 bg-[#0e1726]/60 backdrop-blur-xl p-6 sm:p-7 shadow-xl space-y-4 text-xs text-slate-300 leading-relaxed font-sans">
          <p>
            Kualitas udara dihitung mengacu pada standar resmi Republik Indonesia, yaitu <b className="text-white">Peraturan Menteri Lingkungan Hidup dan Kehutanan No. P.14/MENLHK/SETJEN/KUM.1/7/2020 tentang Indeks Standar Pencemar Udara (ISPU)</b>.
          </p>

          <div className="rounded-xl bg-[#090e18]/80 border border-slate-800/80 p-4 font-mono text-emerald-300 space-y-2">
            <div className="font-bold text-white font-sans text-xs">Rumus Interpolasi Linear ISPU:</div>
            <div className="text-sm">I = [ (Ia - Ib) / (Xa - Xb) ] * (Xx - Xb) + Ib</div>
            <div className="text-[11px] text-slate-400 font-sans leading-normal">
              I = ISPU terhitung; Ia = batas atas ISPU; Ib = batas bawah ISPU; Xa = batas atas konsentrasi; Xb = batas bawah konsentrasi; Xx = konsentrasi aktual terukur (µg/m³).
            </div>
          </div>

          <p>
            Parameter kritis harian Kota Malang umumnya didominasi oleh partikulat debu halus <b className="text-white">PM2.5</b> dan <b className="text-white">PM10</b> yang berasal dari emisi gas buang kendaraan bermotor serta aktivitas konstruksi perkotaan.
          </p>
        </div>
      </section>

      {/* Methodology Section 3: BPR Simulation Model */}
      <section id="bpr-simulator" className="space-y-4">
        <div className="flex items-center gap-2 text-white font-bold text-lg font-sans">
          <Cpu className="h-5 w-5 text-purple-400" />
          <h2>3. Algoritma Bureau of Public Roads (BPR) pada Scenario Simulator</h2>
        </div>

        <div className="rounded-2xl border border-slate-700/60 bg-[#0e1726]/60 backdrop-blur-xl p-6 sm:p-7 shadow-xl space-y-4 text-xs text-slate-300 leading-relaxed font-sans">
          <p>
            Pada fitur <b className="text-white">Scenario Simulator</b>, pengaruh perubahan volume dan kapasitas jalan dimodelkan menggunakan fungsi matematis BPR standar transportasi internasional yang terbukti secara empiris:
          </p>

          <div className="rounded-xl bg-[#090e18]/80 border border-slate-800/80 p-4 font-mono text-purple-300 space-y-2">
            <div className="font-bold text-white font-sans text-xs">Fungsi Waktu Tempuh BPR:</div>
            <div className="text-sm">T = T0 * [ 1 + alpha * (V / C)^beta ]</div>
            <div className="text-[11px] text-slate-400 font-sans leading-normal">
              T = Waktu tempuh skenario; T0 = Waktu tempuh arus bebas; V = Volume kendaraan jam puncak; C = Kapasitas jalan efektif (kendaraan/jam); alpha = 0.15; beta = 4.0 (parameter empiris standar jalan arteri perkotaan).
            </div>
          </div>

          <p>
            Reduksi emisi gas rumah kaca dan partikulat dihitung menggunakan faktor emisi <b className="text-white">IPCC Tier 1 / Tier 2</b> untuk armada kendaraan di Indonesia (82% sepeda motor, 15% mobil bensin):
          </p>

          <ul className="list-disc list-inside space-y-1.5 pl-1 text-slate-300">
            <li><b className="text-white">Faktor Emisi CO2:</b> Rata-rata tertimbang 140 gram/km per VKT (Vehicle Kilometers Traveled).</li>
            <li><b className="text-white">Faktor Emisi PM2.5:</b> 0.035 gram/km (kombinasi emisi knalpot + keausan rem dan ban).</li>
            <li><b className="text-white">Konsumsi Bahan Bakar Rata-rata:</b> 0.0414 Liter/km (campuran motor 2.8L/100km & mobil 9.5L/100km).</li>
          </ul>
        </div>
      </section>

      {/* Disclaimer */}
      <div className="rounded-2xl border border-slate-700/60 bg-[#0e1726]/40 backdrop-blur-xl p-5 text-xs text-slate-300 space-y-2 shadow-lg">
        <div className="font-bold text-white flex items-center gap-1.5 text-sm">
          <ShieldCheck className="h-4 w-4 text-cyan-400" />
          Batasan Tanggung Jawab & Etika Data
        </div>
        <p className="leading-relaxed">
          Platform Malang City Index menyajikan data untuk kepentingan riset, jurnalisme data, edukasi publik, dan kajian akademis. Platform tidak memungut biaya dan seluruh data disajikan sebagaimana adanya (as-is) berdasarkan sumber resmi yang tercatat. Untuk keputusan kebijakan publik formal, pengambil kebijakan tetap diwajibkan melakukan validasi lapangan langsung bersama instansi berwenang.
        </p>
      </div>
    </div>
  );
}
