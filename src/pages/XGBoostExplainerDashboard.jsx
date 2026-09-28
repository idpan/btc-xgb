import React, { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  GitCommit,
  BarChart3,
  Info,
  CheckCircle2,
  Layers,
  DollarSign,
  ListFilter,
} from "lucide-react";

// Sample Data yang mencakup Harga Closing, 21 Fitur, dan Tracing 5 Pohon
const sampleData = {
  tanggal: "2026-09-25",
  closing_price: 64250.0,
  prediksi: "UP",
  probabilitas_up: 68.45,
  total_log_odds: 0.7742,
  actual_label: "UP",
  is_correct: true,

  // Tracing untuk 5 Pohon Pertama
  tracing_5_pohon: [
    {
      tree_index: 0,
      leaf_id: 12,
      leaf_value: 0.0766,
      path: ["ATR < 305.44", "Day_Cos < 1", "Vol_Chg < 0.0059"],
    },
    {
      tree_index: 1,
      leaf_id: 5,
      leaf_value: -0.021,
      path: ["Log_Ret < -0.0233", "MACD_Hist < -543.40"],
    },
    {
      tree_index: 2,
      leaf_id: 8,
      leaf_value: 0.045,
      path: ["RSI < 59.20", "D_EMA20 < 0.947"],
    },
    {
      tree_index: 3,
      leaf_id: 3,
      leaf_value: 0.0312,
      path: ["OBV < 1.51e+12", "regime_vol_ratio < 1.12"],
    },
    {
      tree_index: 4,
      leaf_id: 15,
      leaf_value: -0.0105,
      path: ["BBW < 0.466", "regime_ema_spread < -0.046"],
    },
  ],

  // Progres Boosting
  progres_boosting: [
    { n_pohon: 0, proba_up: 50.0, log_odds: 0.0 },
    { n_pohon: 20, proba_up: 54.2, log_odds: 0.1687 },
    { n_pohon: 40, proba_up: 59.1, log_odds: 0.3681 },
    { n_pohon: 60, proba_up: 62.8, log_odds: 0.5236 },
    { n_pohon: 80, proba_up: 65.5, log_odds: 0.641 },
    { n_pohon: 100, proba_up: 68.45, log_odds: 0.7742 },
  ],

  // Full 21 Fitur beserta nilainya & SHAP Contribution
  fitur_21: [
    { fitur: "RSI", nilai: "42.50", kontribusi: 0.1245, efek: "positif" },
    { fitur: "ATR", nilai: "280.10", kontribusi: 0.0812, efek: "positif" },
    { fitur: "D_EMA20", nilai: "0.9850", kontribusi: 0.0431, efek: "positif" },
    { fitur: "Log_Ret", nilai: "-0.0120", kontribusi: 0.031, efek: "positif" },
    { fitur: "Vol_Chg", nilai: "0.0042", kontribusi: 0.0215, efek: "positif" },
    { fitur: "Day_Cos", nilai: "0.8660", kontribusi: 0.018, efek: "positif" },
    { fitur: "Day_Sin", nilai: "0.5000", kontribusi: 0.012, efek: "positif" },
    { fitur: "D_EMA50", nilai: "0.9720", kontribusi: 0.0095, efek: "positif" },
    { fitur: "D_EMA200", nilai: "0.9110", kontribusi: 0.008, efek: "positif" },
    { fitur: "BBW", nilai: "0.3520", kontribusi: 0.0045, efek: "positif" },
    { fitur: "regime_adx", nilai: "24.50", kontribusi: 0.002, efek: "positif" },
    {
      fitur: "MACD_Hist",
      nilai: "-12.40",
      kontribusi: -0.0389,
      efek: "negatif",
    },
    { fitur: "OBV", nilai: "1.25e+12", kontribusi: -0.0152, efek: "negatif" },
    {
      fitur: "regime_vol_ratio",
      nilai: "1.0500",
      kontribusi: -0.011,
      efek: "negatif",
    },
    {
      fitur: "regime_ema_spread",
      nilai: "-0.0210",
      kontribusi: -0.0085,
      efek: "negatif",
    },
    {
      fitur: "regime_vol_trend",
      nilai: "-0.0050",
      kontribusi: -0.006,
      efek: "negatif",
    },
    {
      fitur: "MACD_Signal",
      nilai: "115.20",
      kontribusi: -0.004,
      efek: "negatif",
    },
    {
      fitur: "MACD_Line",
      nilai: "102.80",
      kontribusi: -0.0032,
      efek: "negatif",
    },
    { fitur: "Stoch_K", nilai: "68.20", kontribusi: -0.0021, efek: "negatif" },
    { fitur: "Stoch_D", nilai: "64.10", kontribusi: -0.0015, efek: "negatif" },
    { fitur: "ROC_14", nilai: "0.0180", kontribusi: -0.0008, efek: "negatif" },
  ],
};

export default function XGBoostExplainerDashboard() {
  const [data] = useState(sampleData);
  const isUp = data.prediksi === "UP";

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6 bg-slate-50 min-h-screen text-slate-800">
      {/* HEADER PAGE */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-xl shadow-sm border border-slate-200 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-6 h-6 text-indigo-600" />
            Transparansi Prediksi XGBoost (Explainable AI)
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Penjelasan alur inferensi dan kontribusi indikator teknikal untuk
            tanggal:{" "}
            <span className="font-semibold text-slate-700">{data.tanggal}</span>
          </p>
        </div>
        <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg border border-emerald-200 text-sm font-medium">
          <CheckCircle2 className="w-4 h-4" />
          Status Prediksi: BENAR
        </div>
      </div>

      {/* STEP 1: RINGKASAN METRIK / PREDIKSI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Harga Closing */}
        <div className="p-5 rounded-xl shadow-sm border border-slate-200 bg-white flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold tracking-wider uppercase text-slate-500">
              Harga Penutupan
            </span>
            <DollarSign className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold text-slate-900">
              $
              {data.closing_price.toLocaleString("en-US", {
                minimumFractionDigits: 2,
              })}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Closing price pasar pada hari ini
            </p>
          </div>
        </div>

        {/* Card Status Prediksi */}
        <div
          className={`p-5 rounded-xl shadow-sm border ${
            isUp
              ? "bg-emerald-50/50 border-emerald-200"
              : "bg-rose-50/50 border-rose-200"
          } flex flex-col justify-between`}
        >
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold tracking-wider uppercase text-slate-500">
              Sinyal Prediksi
            </span>
            {isUp ? (
              <span className="p-1.5 bg-emerald-100 text-emerald-700 rounded-lg">
                <TrendingUp className="w-5 h-5" />
              </span>
            ) : (
              <span className="p-1.5 bg-rose-100 text-rose-700 rounded-lg">
                <TrendingDown className="w-5 h-5" />
              </span>
            )}
          </div>
          <div className="mt-4">
            <div
              className={`text-3xl font-extrabold ${isUp ? "text-emerald-600" : "text-rose-600"}`}
            >
              {data.prediksi}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Label Aktual:{" "}
              <span className="font-semibold">{data.actual_label}</span>
            </p>
          </div>
        </div>

        {/* Card Probabilitas (Sigmoid) */}
        <div className="p-5 rounded-xl shadow-sm border border-slate-200 bg-white flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold tracking-wider uppercase text-slate-500">
              Probabilitas UP
            </span>
            <BarChart3 className="w-5 h-5 text-indigo-500" />
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold text-slate-900">
              {data.probabilitas_up}%
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full mt-2 overflow-hidden">
              <div
                className={`h-full ${isUp ? "bg-emerald-500" : "bg-rose-500"}`}
                style={{ width: `${data.probabilitas_up}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Card Total Log-Odds */}
        <div className="p-5 rounded-xl shadow-sm border border-slate-200 bg-white flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold tracking-wider uppercase text-slate-500">
              Total Log-Odds
            </span>
            <Info className="w-5 h-5 text-slate-400" />
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold text-slate-900">
              +{data.total_log_odds}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Base score + total leaf score
            </p>
          </div>
        </div>
      </div>

      {/* STEP 2: PENELUSURAN 5 POHON PERTAMA */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <GitCommit className="w-5 h-5 text-indigo-600" />
            Alur Traversal 5 Pohon Pertama
          </h2>
          <p className="text-sm text-slate-500">
            Daftar alur keputusan yang dilalui data hari ini pada 5 pohon
            pertama:
          </p>
        </div>

        <div className="space-y-3">
          {data.tracing_5_pohon.map((pohon, index) => (
            <div
              key={index}
              className="bg-slate-50 p-4 rounded-lg border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-indigo-200 transition-colors"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <span className="bg-indigo-600 text-white text-xs font-bold px-2 py-0.5 rounded">
                    Pohon ke-{pohon.tree_index + 1}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    (`num_trees={pohon.tree_index}`)
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 text-xs font-medium text-slate-700 mt-1">
                  {pohon.path.map((step, idx) => (
                    <React.Fragment key={idx}>
                      <span className="bg-white px-2.5 py-1 rounded border border-slate-200 shadow-2xs font-mono text-indigo-900">
                        {step}
                      </span>
                      {idx < pohon.path.length - 1 && (
                        <span className="text-slate-400">→</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              <div className="bg-white border border-slate-200 px-4 py-2 rounded-lg text-left md:text-right w-full md:w-auto min-w-[150px] shadow-2xs">
                <div className="text-[11px] text-slate-400 font-medium">
                  Leaf ID:{" "}
                  <span className="text-slate-700 font-semibold">
                    #{pohon.leaf_id}
                  </span>
                </div>
                <div
                  className={`text-base font-bold ${pohon.leaf_value >= 0 ? "text-emerald-600" : "text-rose-600"}`}
                >
                  Skor: {pohon.leaf_value >= 0 ? "+" : ""}
                  {pohon.leaf_value}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* STEP 3 & 4: PROGRES BOOSTING & TABEL 21 FITUR */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Tabel Progres Boosting */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-4 lg:col-span-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Progres Boosting
            </h2>
            <p className="text-sm text-slate-500">
              Akumulasi nilai dari Pohon 0 s.d. 100
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-medium text-xs uppercase">
                  <th className="py-2.5 px-3">Pohon</th>
                  <th className="py-2.5 px-3">Prob.</th>
                  <th className="py-2.5 px-3">Sinyal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.progres_boosting.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80">
                    <td className="py-2.5 px-3 font-medium text-slate-700">
                      {row.n_pohon}
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-slate-800">
                      {row.proba_up}%
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${
                          row.proba_up > 50
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-rose-100 text-rose-700"
                        }`}
                      >
                        {row.proba_up > 50 ? "UP" : "DOWN"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Tabel Lengkap 21 Fitur Indikator */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-4 lg:col-span-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <ListFilter className="w-5 h-5 text-indigo-600" />
                Data 21 Fitur Indikator & Kontribusi SHAP
              </h2>
              <p className="text-sm text-slate-500">
                Nilai indikator teknikal hari ini dan pengaruhnya terhadap
                prediksi
              </p>
            </div>
            <span className="text-xs bg-slate-100 px-2.5 py-1 rounded-full text-slate-600 font-medium border border-slate-200 shrink-0">
              Total 21 Fitur
            </span>
          </div>

          <div className="overflow-y-auto max-h-[380px] border border-slate-200 rounded-lg">
            <table className="w-full text-sm text-left border-collapse">
              <thead className="sticky top-0 bg-slate-100 border-b border-slate-200 text-slate-600 font-medium text-xs uppercase z-10">
                <tr>
                  <th className="py-2.5 px-3">Nama Fitur</th>
                  <th className="py-2.5 px-3">Nilai Aktual</th>
                  <th className="py-2.5 px-3 text-right">Kontribusi SHAP</th>
                  <th className="py-2.5 px-3 text-center">Pengaruh</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {data.fitur_21.map((item, idx) => (
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
                      className={`py-2 px-3 text-right font-mono font-bold ${
                        item.efek === "positif"
                          ? "text-emerald-600"
                          : "text-rose-600"
                      }`}
                    >
                      {item.efek === "positif" ? "+" : ""}
                      {item.kontribusi.toFixed(4)}
                    </td>
                    <td className="py-2 px-3 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${
                          item.efek === "positif"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-rose-50 text-rose-700 border border-rose-200"
                        }`}
                      >
                        {item.efek === "positif"
                          ? "Mendorong UP"
                          : "Menahan UP"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
