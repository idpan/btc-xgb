import React, { useState } from "react";
import { getAuthToken } from "../utils/auth";
import { LucideInfo, Zap } from "lucide-react";
import { USE_MOCK_DATA } from "../config/config";
import { LATEST_MOCK_PREDICTION } from "../data/mockData";

const GaugeChart = ({ value, show }) => {
  const radius = 70;
  const strokeWeight = 12;
  const normalizedValue = value || 0;
  const circumference = Math.PI * radius; // Half circle
  const strokeDashoffset = circumference - normalizedValue * circumference;

  const getColor = (v) => {
    if (v < 0.55) return "#94a3b8"; // slate-400
    if (v < 0.75) return "#f59e0b"; // amber-500
    return "#10b981"; // emerald-500
  };

  const getLabel = (v) => {
    if (v < 0.55) return "Rendah";
    if (v < 0.75) return "Cukup Stabil";
    return "Sangat Kuat";
  };

  return (
    <div className="relative flex flex-col items-center">
      <svg width="180" height="110" viewBox="0 0 160 100">
        {/* Background Arc */}
        <path
          d="M 10 90 A 70 70 0 0 1 150 90"
          fill="none"
          stroke="#f1f5f9"
          strokeWidth={strokeWeight}
          strokeLinecap="round"
        />
        {/* Progress Arc */}
        <path
          d="M 10 90 A 70 70 0 0 1 150 90"
          fill="none"
          stroke={getColor(normalizedValue)}
          strokeWidth={strokeWeight}
          strokeLinecap="round"
          strokeDasharray={circumference}
          style={{
            strokeDashoffset: show ? strokeDashoffset : circumference,
            transition: "stroke-dashoffset 2s ease-out, stroke 0.5s ease",
          }}
        />
        {/* Value Text */}
        <text
          x="80"
          y="80"
          textAnchor="middle"
          className="text-2xl font-black fill-slate-900"
          style={{ fontSize: "24px" }}
        >
          {show ? (normalizedValue * 100).toFixed(1) : 0}%
        </text>
      </svg>
      <div className="mt-[-10px] flex flex-col items-center">
        <span
          className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
            normalizedValue < 0.55
              ? "bg-slate-100 text-slate-500"
              : normalizedValue < 0.75
              ? "bg-amber-50 text-amber-600"
              : "bg-emerald-50 text-emerald-600"
          }`}
        >
          {getLabel(normalizedValue)}
        </span>
      </div>
    </div>
  );
};

const PredictionSection = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    setShowResult(false);

    const startTime = Date.now();

    try {
      if (USE_MOCK_DATA) {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        // Generasikan variasi acak realistis untuk simulasi interaktif
        const isUp = Math.random() > 0.45;
        const confidence = parseFloat((0.72 + Math.random() * 0.20).toFixed(2));
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const targetDateStr = tomorrow.toISOString().split("T")[0];

        setData({
          direction: isUp ? "UP" : "DOWN",
          confidence_level: confidence,
          target_date: targetDateStr,
        });
        setLoading(false);
        setTimeout(() => setShowResult(true), 50);
        return;
      }

      const api_url = "http://127.0.0.1:5000/api/predict/latest";
      const response = await fetch(api_url, {
        headers: { Authorization: `Bearer ${getAuthToken()}` },
      });
      if (!response.ok) throw new Error("Gagal mengambil data");
      const result = await response.json();

      const duration = Date.now() - startTime;
      const minimalDelay = 2000;
      const remainingDelay = Math.max(0, minimalDelay - duration);

      setTimeout(() => {
        setData(result.data);
        setLoading(false);
        setTimeout(() => setShowResult(true), 50);
      }, remainingDelay);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center p-6 md:p-10 bg-white min-h-[350px] w-full rounded-3xl border border-slate-100 shadow-sm">
      <div className="relative w-full max-w-4xl flex flex-col items-center justify-center">
        {/* ================= ELEMEN 1: TOMBOL PREDIKSI ================= */}
        {!showResult && (
          <div
            className={`flex flex-col items-center transition-all duration-700 ease-in-out transform ${
              loading ? "opacity-100 scale-100" : "opacity-100 scale-100"
            }`}
          >
            <button
              onClick={fetchData}
              disabled={loading}
              className="group relative w-64 h-16 bg-blue-600 text-white text-sm font-bold rounded-2xl shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-80 uppercase tracking-widest overflow-hidden"
            >
              <div className="flex items-center justify-center gap-3">
                {loading ? (
                  <>
                    <Zap className="animate-spin text-blue-200" size={20} />
                    <span>Menganalisis...</span>
                  </>
                ) : (
                  <>
                    <Zap size={20} className="group-hover:scale-125 transition" />
                    <span>Lakukan Prediksi</span>
                  </>
                )}
              </div>
            </button>
            {error && <p className="text-red-500 text-[10px] mt-4 font-bold uppercase tracking-widest">{error}</p>}
          </div>
        )}

        {/* ================= ELEMEN 2: HASIL PREDIKSI (SIDE-BY-SIDE) ================= */}
        {data && !loading && showResult && (
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center animate-in fade-in zoom-in-95 duration-1000">
            {/* Left Column: Result & Direction */}
            <div className="text-center md:text-left space-y-4">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2 px-1">
                  Hasil Analisis XGBoost
                </p>
                <h2
                  className={`text-5xl md:text-6xl font-black tracking-tighter uppercase leading-none ${
                    data.direction.toUpperCase() === "UP" ? "text-emerald-500" : "text-rose-500"
                  }`}
                >
                  Bitcoin Diprediksi {data.direction.toUpperCase() === "UP" ? "NAIK" : "TURUN"}
                </h2>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-bold text-slate-700 leading-snug">
                  Harga diperkirakan {data.direction.toUpperCase() === "UP" ? "lebih tinggi" : "lebih rendah"} saat penutupan besok pagi (07:00 WIB) dibanding pagi ini.
                </p>
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  <span className="text-[9px] font-bold bg-slate-100 text-slate-500 px-3 py-1 rounded-full uppercase tracking-wider">
                    Target (UTC): {data.target_date}
                  </span>
                  <span className="text-[9px] font-bold bg-blue-50 text-blue-500 px-3 py-1 rounded-full uppercase tracking-wider">
                    Market Close UTC 00:00
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Gauge & Info */}
            <div className="flex flex-col items-center md:items-end gap-6 text-right">
              <div className="bg-slate-50/50 p-8 rounded-3xl border border-slate-100 w-full max-w-[320px] flex flex-col items-center">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
                  Tingkat Keyakinan
                </p>
                <GaugeChart value={data.confidence_level} show={showResult} />
                
                {/* Info Box */}
                <div className="mt-8 bg-white p-4 rounded-2xl border border-slate-100 text-left">
                  <div className="flex items-center gap-2 mb-2">
                    <LucideInfo className="text-blue-400" size={14} />
                    <span className="text-[10px] font-black text-slate-900 uppercase">Interpretasi</span>
                  </div>
                  <p className="text-[9px] text-slate-500 leading-relaxed">
                    Angka ini menunjukkan seberapa mirip pola market saat ini dengan ribuan skenario historis yang telah dipelajari model. Semakin besar, semakin kuat sinyalnya.
                  </p>
                </div>
              </div>

              <button 
                onClick={() => setShowResult(false)}
                className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-blue-600 transition flex items-center gap-2 pr-4 mr-10"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                Prediksi Ulang
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PredictionSection;
