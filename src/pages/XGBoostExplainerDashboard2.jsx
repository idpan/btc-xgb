import React, { useState } from "react";
import TreeViewer from "../components/TreeViewer";
import {
  TrendingUp,
  TrendingDown,
  GitCommit,
  BarChart3,
  CheckCircle2,
  Layers,
  DollarSign,
  ListFilter,
  Calculator,
  ArrowRight,
  X,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

// Sample Data XGBoost dengan Presisi 6 Digit Desimal
const sampleData = {
  tanggal: "2026-09-25",
  closing_price: 64250.0,
  prediksi: "UP",
  probabilitas_up: 68.445212,
  actual_label: "UP",
  is_correct: true,

  // Komponen Matematika Log-Odds & Sigmoid
  base_score_log_odds: 0.0, // log(0.5 / (1 - 0.5)) = 0
  sum_leaf_scores: 0.774218, // Total penjumlahan presisi 6 desimal
  total_log_odds: 0.774218,

  // Tracing 100 Pohon dengan 6 Digit Desimal
  tracing_100_pohon: Array.from({ length: 100 }, (_, i) => ({
    tree_index: i,
    leaf_id: Math.floor(Math.random() * 20) + 1,
    // Nilai leaf desimal 6 digit positif & negatif
    leaf_value: parseFloat((Math.random() * 0.1 - 0.042).toFixed(6)),
    path: [
      `Fitur_${(i % 5) + 1} < ${(Math.random() * 100).toFixed(2)}`,
      `Fitur_${(i % 3) + 6} >= ${(Math.random() * 10).toFixed(2)}`,
    ],
  })),

  // Full 21 Fitur beserta nilainya & SHAP Contribution (6 digit)
  fitur_21: [
    { fitur: "RSI", nilai: "42.500000", kontribusi: 0.124512, efek: "positif" },
    { fitur: "ATR", nilai: "280.100000", kontribusi: 0.08124, efek: "positif" },
    {
      fitur: "D_EMA20",
      nilai: "0.985000",
      kontribusi: 0.04311,
      efek: "positif",
    },
    {
      fitur: "Log_Ret",
      nilai: "-0.012000",
      kontribusi: 0.031005,
      efek: "positif",
    },
    {
      fitur: "Vol_Chg",
      nilai: "0.004200",
      kontribusi: 0.02151,
      efek: "positif",
    },
    { fitur: "Day_Cos", nilai: "0.866025", kontribusi: 0.018, efek: "positif" },
    { fitur: "Day_Sin", nilai: "0.500000", kontribusi: 0.012, efek: "positif" },
    {
      fitur: "D_EMA50",
      nilai: "0.972000",
      kontribusi: 0.00951,
      efek: "positif",
    },
    {
      fitur: "D_EMA200",
      nilai: "0.911000",
      kontribusi: 0.008012,
      efek: "positif",
    },
    { fitur: "BBW", nilai: "0.352000", kontribusi: 0.0045, efek: "positif" },
    {
      fitur: "regime_adx",
      nilai: "24.500000",
      kontribusi: 0.00201,
      efek: "positif",
    },
    {
      fitur: "MACD_Hist",
      nilai: "-12.400000",
      kontribusi: -0.03892,
      efek: "negatif",
    },
    { fitur: "OBV", nilai: "1.25e+12", kontribusi: -0.0152, efek: "negatif" },
    {
      fitur: "regime_vol_ratio",
      nilai: "1.050000",
      kontribusi: -0.011,
      efek: "negatif",
    },
    {
      fitur: "regime_ema_spread",
      nilai: "-0.021000",
      kontribusi: -0.00851,
      efek: "negatif",
    },
    {
      fitur: "regime_vol_trend",
      nilai: "-0.005000",
      kontribusi: -0.006,
      efek: "negatif",
    },
    {
      fitur: "MACD_Signal",
      nilai: "115.200000",
      kontribusi: -0.00401,
      efek: "negatif",
    },
    {
      fitur: "MACD_Line",
      nilai: "102.800000",
      kontribusi: -0.0032,
      efek: "negatif",
    },
    {
      fitur: "Stoch_K",
      nilai: "68.200000",
      kontribusi: -0.0021,
      efek: "negatif",
    },
    {
      fitur: "Stoch_D",
      nilai: "64.100000",
      kontribusi: -0.0015,
      efek: "negatif",
    },
    {
      fitur: "ROC_14",
      nilai: "0.018000",
      kontribusi: -0.0008,
      efek: "negatif",
    },
  ],
};

// Helper untuk Memisahkan Bilangan Bulat dan 6 Digit Desimal (Untuk Visual Highlight)
const FormattedDecimal = ({ value }) => {
  const isNegative = value < 0;
  const absValue = Math.abs(value);
  const parts = absValue.toFixed(6).split(".");
  const integerPart = Number(parts[0]).toLocaleString("en-US");
  const decimalPart = parts[1];

  return (
    <span className="font-mono tabular-nums">
      {isNegative ? "-" : ""}
      {integerPart}.
      <span className="text-slate-400 font-normal">{decimalPart}</span>
    </span>
  );
};

export default function XGBoostExplainerDashboard2({ data }) {
  // Gabungkan sampleData dengan data ringkas (tanggal & closing_price) yang dioper
  const mergedData = {
    ...sampleData,
    ...(data?.tanggal && { tanggal: data.tanggal }),
    ...(data?.closing_price !== undefined && {
      closing_price: data.closing_price,
    }),
  };

  // Gunakan mergedData untuk pengolahan berikutnya
  const displayData = mergedData;
  const isUp = displayData.prediksi === "UP";

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedTreeIndex, setExpandedTreeIndex] = useState(null);
  const [fullTree, setFullTree] = useState(null); // pohon yang dibuka di tampilan utuh

  const toggleTreeRow = (index) => {
    setExpandedTreeIndex(expandedTreeIndex === index ? null : index);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6 bg-slate-50 min-h-screen text-slate-800">
      {/* HEADER PAGE */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-xl shadow-xs border border-slate-200 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-6 h-6 text-indigo-600" />
            Transparansi Kalkulasi Prediksi XGBoost
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Penjelasan matematis pembentukan probabilitas untuk tanggal:{" "}
            <span className="font-semibold text-slate-700">
              {displayData.tanggal}
            </span>
          </p>
        </div>
        <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg border border-emerald-200 text-sm font-medium">
          <CheckCircle2 className="w-4 h-4" />
          Status Prediksi: BENAR
        </div>
      </div>

      {/* STEP 1: RINGKASAN DATA DASAR */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl shadow-xs border border-slate-200 bg-white flex justify-between items-center">
          <div>
            <span className="text-xs font-semibold tracking-wider uppercase text-slate-500">
              Harga Penutupan (Closing)
            </span>
            <div className="text-2xl font-bold text-slate-900 mt-1">
              $
              {displayData.closing_price.toLocaleString("en-US", {
                minimumFractionDigits: 2,
              })}
            </div>
          </div>
          <div className="p-3 bg-emerald-50 rounded-lg text-emerald-600">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div
          className={`p-5 rounded-xl shadow-xs border ${
            isUp
              ? "bg-emerald-50/50 border-emerald-200"
              : "bg-rose-50/50 border-rose-200"
          } flex justify-between items-center`}
        >
          <div>
            <span className="text-xs font-semibold tracking-wider uppercase text-slate-500">
              Hasil Klasifikasi
            </span>
            <div
              className={`text-2xl font-extrabold mt-1 ${
                isUp ? "text-emerald-600" : "text-rose-600"
              }`}
            >
              {displayData.prediksi} (Sinyal Beli)
            </div>
          </div>
          <div
            className={`p-3 rounded-lg ${
              isUp
                ? "bg-emerald-100 text-emerald-700"
                : "bg-rose-100 text-rose-700"
            }`}
          >
            {isUp ? (
              <TrendingUp className="w-6 h-6" />
            ) : (
              <TrendingDown className="w-6 h-6" />
            )}
          </div>
        </div>

        <div className="p-5 rounded-xl shadow-xs border border-slate-200 bg-white flex justify-between items-center">
          <div>
            <span className="text-xs font-semibold tracking-wider uppercase text-slate-500">
              Probabilitas Akhir
            </span>
            <div className="text-2xl font-bold text-slate-900 mt-1 font-mono">
              {displayData.probabilitas_up.toFixed(4)}%
            </div>
          </div>
          <div className="p-3 bg-indigo-50 rounded-lg text-indigo-600">
            <BarChart3 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Ganti seluruh referensi `data.` berikutnya di file ini dengan `displayData.` */}
      {/* ... SISA KODE SAMA SEPERTI SEBELUMNYA ... */}
      {/* STEP 2: KALKULASI MATEMATIS DARI BASE SCORE SAMPAI SIGMOID */}
      <div className="bg-white p-6 rounded-xl shadow-xs border border-slate-200 space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
          <Calculator className="w-6 h-6 text-indigo-600" />
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Alur Kalkulasi Matematis Log-Odds ke Probabilitas
            </h2>
            <p className="text-sm text-slate-500">
              Proses transformasi skor agregat ensemble tree menjadi nilai
              probabilitas [0, 1]
            </p>
          </div>
        </div>

        {/* ALUR MATEMATIKA VISUAL (1-4) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-xs font-semibold text-slate-500 uppercase">
                1. Base Score (Log-Odds)
              </div>
              <span className="text-[9px] font-semibold text-slate-400 bg-slate-200/70 px-1.5 py-0.5 rounded">
                DEFAULT XGBOOST
              </span>
            </div>
            <div className="text-xl font-bold text-slate-800">
              <FormattedDecimal value={displayData.base_score_log_odds} />
            </div>
            <p className="text-[11px] text-slate-500">
              Nilai tetap (bukan dihitung dari data BTC) — parameter{" "}
              <code className="text-[10px] bg-slate-200/70 px-1 rounded">
                base_score
              </code>{" "}
              XGBoost, sama untuk seluruh sampel.
              <br />
              (p₀ = 0.5 → ln(1) = 0)
            </p>
          </div>

          <div
            onClick={() => setIsModalOpen(true)}
            className="p-4 bg-indigo-50/60 border border-indigo-200 rounded-xl space-y-2 cursor-pointer hover:bg-indigo-100/70 transition-all group relative"
          >
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-indigo-600 uppercase">
                2. Sum Leaf Scores
              </span>
              <ExternalLink className="w-4 h-4 text-indigo-500 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-xl font-bold text-indigo-900">
              +<FormattedDecimal value={displayData.sum_leaf_scores} />
            </div>
            <p className="text-[11px] text-indigo-700">
              Total jumlahan nilai leaf dari{" "}
              <span className="underline font-semibold">100 pohon XGBoost</span>
              .
              <br />
              <span className="font-bold text-indigo-800">
                Klik untuk lihat tabel 100 pohon &rarr;
              </span>
            </p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <div className="text-xs font-semibold text-slate-500 uppercase">
              3. Total Log-Odds ($z$)
            </div>
            <div className="text-xl font-bold text-slate-800">
              +<FormattedDecimal value={displayData.total_log_odds} />
            </div>
            <p className="text-[11px] text-slate-500 font-mono">
              <span>z = Base + &sum; Leaf</span>
              <br />
              <span>z = 0 + 0.774218</span>
              <br />
              <span>z = 0.774218</span>
            </p>
          </div>

          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2">
            <div className="text-xs font-semibold text-emerald-700 uppercase">
              4. Fungsi Sigmoid P(Y=1)
            </div>
            <div className="text-xl font-bold text-emerald-800 font-mono">
              {displayData.probabilitas_up.toFixed(4)}%
            </div>
            <p className="text-[11px] text-emerald-700 font-mono">
              1 / (1 + e<sup>-z</sup>)
            </p>
          </div>
        </div>

        {/* REKAP PERSAMAAN LENGKAP — hanya rangkum step 1-4, dinamis dari data, TANPA duplikasi box keputusan */}
        <div className="bg-slate-900 text-slate-100 p-5 rounded-xl font-mono text-xs space-y-2 shadow-inner">
          <div className="text-slate-400 font-sans font-semibold text-sm border-b border-slate-800 pb-2">
            Persamaan Matematika Lengkap Transformasi:
          </div>
          <p className="text-emerald-400">
            P(UP) = Sigmoid( Base_Log_Odds + &sum; Leaf_Scores )
          </p>
          <p className="text-slate-300">
            P(UP) = 1 / (1 + e
            <sup>-{displayData.total_log_odds.toFixed(6)}</sup>) ={" "}
            <span className="text-emerald-400 font-bold">
              {(displayData.probabilitas_up / 100).toFixed(6)} (
              {displayData.probabilitas_up.toFixed(4)}%)
            </span>
          </p>
        </div>
      </div>

      {/* STEP 5: KEPUTUSAN KLASIFIKASI DARI THRESHOLD — sibling card, bukan nested */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
          <Calculator className="w-6 h-6 text-indigo-600" />
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              5. Keputusan Klasifikasi dari Probabilitas
            </h2>
            <p className="text-sm text-slate-500">
              Aturan ambang batas (threshold) untuk mengubah P(UP) menjadi label
              kelas
            </p>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 font-mono text-xs text-slate-600">
          <p>Jika P(UP) &gt; 0.50 &rarr; Prediksi = UP</p>
          <p>Jika P(UP) &le; 0.50 &rarr; Prediksi = DOWN</p>
          <p className="text-[11px] text-slate-400 mt-2 font-sans">
            Threshold 0.50 dipakai karena ini klasifikasi biner dengan dua kelas
            yang saling eksklusif (UP vs DOWN) — bukan nilai yang di-tuning,
            melainkan titik netral default tanpa pembobotan biaya kesalahan
            (cost-asymmetric antara false positive dan false negative).
          </p>
        </div>

        <div className="pt-2">
          <div className="relative h-2 bg-slate-200 rounded-full">
            <div
              className="absolute inset-y-0 left-0 bg-rose-300 rounded-l-full"
              style={{ width: "50%" }}
            />
            <div
              className="absolute inset-y-0 right-0 bg-emerald-300 rounded-r-full"
              style={{ width: "50%" }}
            />
            <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-0.5 h-4 bg-slate-700" />
            <div
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
              style={{ left: `${displayData.probabilitas_up}%` }}
            >
              <div
                className={`w-4 h-4 rounded-full border-2 border-white shadow-md ${isUp ? "bg-emerald-600" : "bg-rose-600"}`}
              />
            </div>
          </div>
          <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1.5">
            <span>0.00 (DOWN pasti)</span>
            <span className="text-slate-600 font-semibold">
              0.50 (threshold)
            </span>
            <span>1.00 (UP pasti)</span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 bg-slate-900 text-slate-100 p-4 rounded-xl">
          <div className="text-xs font-mono text-slate-300">
            P(UP) = {displayData.probabilitas_up}% {isUp ? ">" : "≤"} 0.50
            &rarr; margin{" "}
            <span
              className={
                isUp ? "text-emerald-400 font-bold" : "text-rose-400 font-bold"
              }
            >
              {isUp
                ? `+${(displayData.probabilitas_up - 50).toFixed(2)} poin di atas threshold`
                : `${(displayData.probabilitas_up - 50).toFixed(2)} poin di bawah threshold`}
            </span>
          </div>
          <div
            className={`px-4 py-2 rounded-lg font-bold text-sm ${
              isUp
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
            }`}
          >
            PREDIKSI = {displayData.prediksi}
          </div>
        </div>

        <p className="text-[11px] text-slate-400">
          P(DOWN) = 1 − P(UP) = {(100 - displayData.probabilitas_up).toFixed(2)}
          %, bukan hasil model terpisah — karena target-nya tunggal
          (`Close.shift(-1) &gt; Close`) dan bersifat biner.
        </p>
      </div>
      {/* STEP 3: TABEL 21 FITUR & SHAP VALUE */}
      <div className="bg-white p-6 rounded-xl shadow-xs border border-slate-200 space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <ListFilter className="w-5 h-5 text-indigo-600" />
              Data 21 Fitur Indikator & Kontribusi SHAP
            </h2>
            <p className="text-sm text-slate-500">
              Nilai indikator teknikal aktual dan besaran kontribusinya terhadap
              Total Log-Odds
            </p>
          </div>
          <span className="text-xs bg-slate-100 px-2.5 py-1 rounded-full text-slate-600 font-medium border border-slate-200">
            Total 21 Fitur
          </span>
        </div>

        <div className="overflow-y-auto max-h-[360px] border border-slate-200 rounded-lg">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="sticky top-0 bg-slate-100 border-b border-slate-200 text-slate-600 font-medium text-xs uppercase z-10">
              <tr>
                <th className="py-2.5 px-3">Nama Fitur</th>
                <th className="py-2.5 px-3">Nilai Eksisting Hari Ini</th>
                <th className="py-2.5 px-3 text-right">
                  Kontribusi SHAP (6 Digit)
                </th>
                <th className="py-2.5 px-3 text-center">Pengaruh</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {displayData.fitur_21.map((item, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-slate-50/80 transition-colors"
                >
                  <td className="py-2 px-3 font-semibold text-slate-800">
                    {item.fitur}
                  </td>
                  <td className="py-2 px-3 text-slate-600 font-mono">
                    {item.nilai}
                  </td>
                  <td
                    className={`py-2 px-3 text-right ${
                      item.efek === "positif"
                        ? "text-emerald-600"
                        : "text-rose-600"
                    }`}
                  >
                    {item.efek === "positif" ? "+" : ""}
                    <FormattedDecimal value={item.kontribusi} />
                  </td>
                  <td className="py-2 px-3 text-center">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${
                        item.efek === "positif"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-rose-50 text-rose-700 border border-rose-200"
                      }`}
                    >
                      {item.efek === "positif" ? "Mendorong UP" : "Menahan UP"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: TABEL PENJUMLAHAN 100 POHON ENSEMBLE */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex justify-center items-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col border border-slate-200 overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 bg-slate-900 text-white flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <GitCommit className="w-5 h-5 text-indigo-400" />
                  Rincian Penjumlahan Leaf Score (100 Pohon XGBoost)
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Tabel penjumlahan presisi 6 digit desimal dari seluruh *leaf
                  output* pohon keputusan.
                </p>
              </div>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setExpandedTreeIndex(null);
                }}
                className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Tabel Scrollable dengan Sticky Header & Footer */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <p className="text-xs text-slate-500">
                * Klik pada baris pohon untuk melihat alur keputusan (*decision
                path*) lengkap.
              </p>

              <div className="border border-slate-200 rounded-lg overflow-hidden max-h-[460px] overflow-y-auto relative shadow-xs">
                <table className="w-full text-sm text-left border-collapse">
                  {/* Sticky Header */}
                  <thead className="sticky top-0 bg-slate-100 text-slate-700 font-semibold text-xs uppercase border-b border-slate-200 z-10 shadow-2xs">
                    <tr>
                      <th className="py-3 px-4 w-16 text-center">Pohon</th>
                      <th className="py-3 px-4">Leaf ID</th>
                      <th className="py-3 px-4 text-center">Sinyal Impact</th>
                      <th className="py-3 px-4 text-right">
                        Skor Leaf (6 Digit Desimal)
                      </th>
                      <th className="py-3 px-4 w-12 text-center">Path</th>
                    </tr>
                  </thead>

                  {/* Body dengan Zebra Striping */}
                  <tbody className="divide-y divide-slate-100 bg-white text-xs">
                    {displayData.tracing_100_pohon.map((pohon) => {
                      const isExpanded = expandedTreeIndex === pohon.tree_index;
                      const isPositive = pohon.leaf_value >= 0;

                      return (
                        <React.Fragment key={pohon.tree_index}>
                          <tr
                            onClick={() => toggleTreeRow(pohon.tree_index)}
                            className={`cursor-pointer transition-colors ${
                              isExpanded
                                ? "bg-indigo-50/80"
                                : pohon.tree_index % 2 === 0
                                  ? "bg-white hover:bg-slate-50"
                                  : "bg-slate-50/50 hover:bg-slate-100/80"
                            }`}
                          >
                            <td className="py-2.5 px-4 font-mono font-bold text-slate-600 text-center">
                              #{pohon.tree_index + 1}
                            </td>
                            <td className="py-2.5 px-4 font-mono text-slate-700">
                              Leaf #{pohon.leaf_id}
                            </td>
                            <td className="py-2.5 px-4 text-center">
                              <span
                                className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                                  isPositive
                                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                    : "bg-rose-50 text-rose-700 border border-rose-200"
                                }`}
                              >
                                {isPositive ? "+ UP" : "- DOWN"}
                              </span>
                            </td>
                            <td
                              className={`py-2.5 px-4 text-right font-bold ${
                                isPositive
                                  ? "text-emerald-600"
                                  : "text-rose-600"
                              }`}
                            >
                              {isPositive ? "+" : ""}
                              <FormattedDecimal value={pohon.leaf_value} />
                            </td>
                            <td className="py-2.5 px-4 text-center text-slate-400">
                              {isExpanded ? (
                                <ChevronUp className="w-4 h-4 text-indigo-600 inline" />
                              ) : (
                                <ChevronDown className="w-4 h-4 inline" />
                              )}
                            </td>
                          </tr>

                          {/* Row Expansion untuk Percabangan Path */}
                          {isExpanded && (
                            <tr className="bg-indigo-50/40">
                              <td
                                colSpan="5"
                                className="p-3 pl-12 border-b border-indigo-100"
                              >
                                <div className="space-y-1.5">
                                  <span className="text-[11px] font-semibold text-indigo-900 uppercase block">
                                    Alur Decision Path Pohon #
                                    {pohon.tree_index + 1}:
                                  </span>
                                  <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                                    {pohon.path.map((step, idx) => (
                                      <React.Fragment key={idx}>
                                        <span className="bg-white border border-slate-200 px-2.5 py-1 rounded shadow-2xs text-slate-800">
                                          {step}
                                        </span>
                                        {idx < pohon.path.length - 1 && (
                                          <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                                        )}
                                      </React.Fragment>
                                    ))}
                                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                                    <span className="bg-indigo-100 border border-indigo-200 px-2.5 py-1 rounded text-indigo-800 font-bold">
                                      Skor Leaf:{" "}
                                      {pohon.leaf_value >= 0 ? "+" : ""}
                                      {pohon.leaf_value.toFixed(6)}
                                    </span>
                                  </div>
                                  <button
                                    onClick={() => setFullTree(pohon)}
                                    className="mt-1 inline-flex items-center gap-1.5 text-[11px] font-semibold text-indigo-700 bg-white border border-indigo-200 hover:bg-indigo-50 px-2.5 py-1 rounded-lg transition-colors"
                                  >
                                    <GitCommit className="w-3.5 h-3.5" />
                                    Lihat pohon utuh
                                  </button>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </tbody>

                  {/* Sticky Footer Total Penjumlahan */}
                  <tfoot className="sticky bottom-0 bg-slate-900 text-white font-semibold text-xs z-10 shadow-lg">
                    <tr>
                      <td
                        colSpan="3"
                        className="py-3 px-4 text-right uppercase tracking-wider font-sans"
                      >
                        Total Penjumlahan Leaf Scores (&sum; 100 Trees):
                      </td>
                      <td className="py-3 px-4 text-right text-emerald-400 font-bold font-mono text-sm">
                        +
                        <FormattedDecimal value={displayData.sum_leaf_scores} />
                      </td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 text-right">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setExpandedTreeIndex(null);
                }}
                className="px-4 py-2 bg-slate-800 text-white rounded-lg text-xs font-semibold hover:bg-slate-700 transition-colors"
              >
                Tutup Modal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* OVERLAY: POHON UTUH (terpisah dari modal 100 pohon) */}
      {fullTree && (
        <div
          className="fixed inset-0 z-[60] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && setFullTree(null)}
        >
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-6xl max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 sticky top-0 bg-white z-10">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Pohon #{fullTree.tree_index + 1} — Struktur Utuh
                </h3>
                <p className="text-xs text-slate-500">
                  Data hari ini berakhir di Leaf #{fullTree.leaf_id} (skor{" "}
                  {fullTree.leaf_value >= 0 ? "+" : ""}
                  {fullTree.leaf_value.toFixed(6)})
                </p>
              </div>
              <button
                onClick={() => setFullTree(null)}
                className="p-1.5 rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5">
              <TreeViewer
                treeIndex={fullTree.tree_index}
                leafId={fullTree.leaf_id}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
