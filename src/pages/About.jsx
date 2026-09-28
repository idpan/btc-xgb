import React from "react";

export default function About() {
  const stats = [
    {
      label: "Sumber Data",
      value: "Yahoo Finance (BTC-USD)",
      icon: "fa-database",
    },
    {
      label: "Rentang Latih",
      value: "Jan 2020 - Jan 2026",
      icon: "fa-calendar-check",
      color: "text-blue-600",
    },
    { label: "Total Baris", value: "1,800+ Baris Data", icon: "fa-table-list" },
    {
      label: "Library Indikator",
      value: "Pandas-TA (v0.4.0)",
      icon: "fa-code-branch",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto animate-in fade-in duration-700 pb-20">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h2 className="text-3xl font-black text-slate-900 mb-2 uppercase tracking-tight">
          Analisis & Performa Model
        </h2>
        <p className="text-slate-500 max-w-2xl mx-auto text-sm">
          Detail teknis dan metrik evaluasi model{" "}
          <strong className="text-blue-600">XGBoost</strong> untuk prediksi arah
          pergerakan harga Bitcoin.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar: Dataset & Accuracy */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h4 className="text-blue-600 font-bold mb-6 flex items-center gap-2 text-sm uppercase tracking-wider">
              <i className="fa-solid fa-server"></i> Dataset & Features
            </h4>
            <div className="space-y-5">
              {stats.map((stat, i) => (
                <div
                  key={i}
                  className="border-b border-slate-50 pb-3 last:border-0"
                >
                  <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">
                    {stat.label}
                  </p>
                  <p
                    className={`text-sm font-bold ${stat.color || "text-slate-700"
                      }`}
                  >
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-blue-600 p-6 rounded-2xl text-white shadow-lg shadow-blue-100 relative overflow-hidden">
            <i className="fa-solid fa-bullseye absolute -right-4 -bottom-4 text-8xl opacity-10"></i>
            <h4 className="font-bold mb-1 text-blue-100 text-xs uppercase tracking-widest">
              Akurasi Keseluruhan
            </h4>
            <div className="flex items-end gap-2">
              <span className="text-5xl font-black">55%</span>
              <span className="text-blue-200 text-[10px] mb-2 font-bold uppercase tracking-tighter">
                Accuracy Score
              </span>
            </div>
            <div className="w-full bg-blue-800/50 h-2 rounded-full mt-4 p-[1px]">
              <div
                className="bg-white h-full rounded-full shadow-sm"
                style={{ width: "55%" }}
              ></div>
            </div>
          </div>
        </div>

        {/* Main Content: Classification Report */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <h4 className="font-bold text-slate-800 text-sm italic">
                Classification Report
              </h4>
              <span className="text-[10px] bg-slate-200 px-2 py-0.5 rounded font-black text-slate-500 uppercase">
                Evaluasi V1.0
              </span>
            </div>
            <table className="w-full text-left text-sm">
              <thead className="text-slate-400 uppercase text-[10px] border-b border-slate-100 bg-slate-50 font-black">
                <tr>
                  <th className="p-4">Kelas</th>
                  <th className="p-4">Precision</th>
                  <th className="p-4 text-center">Recall</th>
                  <th className="p-4">F1-Score</th>
                  <th className="p-4 text-center">Data</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50 transition">
                  <td className="p-4 font-black text-red-600 uppercase text-xs">
                    Turun (0)
                  </td>
                  <td className="p-4 font-mono font-bold">0.54</td>
                  <td className="p-4 text-center">
                    <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-lg font-black text-[10px]">
                      0.64
                    </span>
                  </td>
                  <td className="p-4 font-mono font-bold">0.59</td>
                  <td className="p-4 text-center text-slate-400 font-mono">
                    200
                  </td>
                </tr>
                <tr className="hover:bg-slate-50 transition">
                  <td className="p-4 font-black text-emerald-600 uppercase text-xs">
                    Naik (1)
                  </td>
                  <td className="p-4 font-mono font-bold">0.56</td>
                  <td className="p-4 text-center">
                    <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-lg font-black text-[10px]">
                      0.46
                    </span>
                  </td>
                  <td className="p-4 font-mono font-bold">0.50</td>
                  <td className="p-4 text-center text-slate-400 font-mono">
                    199
                  </td>
                </tr>
              </tbody>
              <tfoot className="bg-slate-900 text-white font-bold">
                <tr>
                  <td
                    colSpan="3"
                    className="p-4 uppercase text-[10px] tracking-widest opacity-60"
                  >
                    Weighted Avg
                  </td>
                  <td className="p-4 text-blue-400 font-mono">0.55</td>
                  <td className="p-4 text-center font-mono">399</td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="border-l-4 border-blue-600 bg-blue-50 p-5 rounded-r-2xl shadow-sm">
            <p className="text-xs text-slate-600 leading-relaxed">
              <strong className="text-blue-600 font-black uppercase tracking-tighter mr-2">
                Analisis Strategis:
              </strong>
              Model memiliki nilai{" "}
              <strong className="text-slate-900">Recall (0.64)</strong> yang
              dominan pada kelas turun. Dalam konteks skripsi, ini menunjukkan
              model XGBoost lebih sensitif dalam menangkap sinyal pelemahan
              harga (Bearish) dibandingkan penguatan harga (Bullish).
            </p>
          </div>
        </div>
      </div>

      {/* Visual Analysis Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <VisualCard
          title="Confusion Matrix"
          subtitle="Prediksi vs Realita Harga"
          img="src/assets/images/confusion-matrix.png"
          footer={
            <span>
              Berhasil mendeteksi{" "}
              <strong className="text-emerald-600">128 tren turun</strong>{" "}
              secara valid.
            </span>
          }
        />
        <VisualCard
          title="Interpretasi Model (SHAP)"
          subtitle="Fitur Paling Berpengaruh"
          img="src/assets/images/shap-summary.png"
          footer={
            <span>
              Indikator <strong className="text-blue-600 uppercase">OBV</strong>{" "}
              dan <strong className="text-blue-600 uppercase">EMA20</strong>{" "}
              adalah fitur prediktor utama.
            </span>
          }
        />
      </div>
    </div>
  );
}

// Sub-komponen untuk kartu visual agar kode utama bersih
function VisualCard({ title, subtitle, img, footer }) {
  return (
    <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
      <h4 className="font-black text-slate-900 uppercase tracking-tighter">
        {title}
      </h4>
      <p className="text-[10px] text-slate-400 mb-4 italic">{subtitle}</p>
      <div className="bg-slate-50 p-2 rounded-xl mb-4 min-h-[200px] flex items-center justify-center border border-dashed border-slate-300">
        {/* Gantilah src dengan path gambar aslimu */}
        <img
          src={img}
          alt={title}
          className="max-w-full h-auto rounded shadow-sm mix-blend-multiply opacity-80"
        />
      </div>
      <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
        {footer}
      </p>
    </div>
  );
}
