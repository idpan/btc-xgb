import React, { useState } from "react";
import {
  Zap,
  Terminal as TerminalIcon,
  BarChart3,
  ArrowLeft,
} from "lucide-react";
import DataLakeExplorer from "./DataLakeExplorer";
import XGBoostExplainerDashboard2 from "./XGBoostExplainerDashboard2";
import { TerminalLog, buildPredictionLog } from "./TerminalLog";

const MODES = { INSTANT: "instant", GIMMICK: "gimmick" };

export default function PredictionRunPage() {
  const [stage, setStage] = useState("pilih"); // "pilih" | "berjalan"
  const [mode, setMode] = useState(MODES.GIMMICK);
  const [activeRecord, setActiveRecord] = useState(null);
  const [activeTab, setActiveTab] = useState("log"); // "log" | "explainer"
  const [logDone, setLogDone] = useState(false);

  const handleRunPrediction = (record) => {
    setActiveRecord(record);
    if (mode === MODES.INSTANT) {
      setLogDone(true);
      setActiveTab("explainer");
    } else {
      setLogDone(false);
      setActiveTab("log");
    }
    setStage("berjalan");
  };

  const handleReset = () => {
    setStage("pilih");
    setActiveRecord(null);
    setLogDone(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {stage !== "pilih" && (
            <button
              onClick={handleReset}
              className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Kembali
            </button>
          )}
          <div>
            <h1 className="text-lg font-bold text-slate-100">
              Simulasi Prediksi — Live Run
            </h1>
            <p className="text-xs text-slate-500">
              Pilih tanggal, jalankan inferensi, telusuri prosesnya
            </p>
          </div>
        </div>

        <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-1 text-xs">
          <button
            onClick={() => setMode(MODES.INSTANT)}
            disabled={stage !== "pilih"}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-semibold transition-colors ${
              mode === MODES.INSTANT
                ? "bg-slate-700 text-slate-100"
                : "text-slate-500 hover:text-slate-300"
            } ${stage !== "pilih" ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <Zap className="w-3.5 h-3.5" /> Instan
          </button>
          <button
            onClick={() => setMode(MODES.GIMMICK)}
            disabled={stage !== "pilih"}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-semibold transition-colors ${
              mode === MODES.GIMMICK
                ? "bg-indigo-600 text-white"
                : "text-slate-500 hover:text-slate-300"
            } ${stage !== "pilih" ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <TerminalIcon className="w-3.5 h-3.5" /> Proses
          </button>
        </div>
      </div>

      {stage === "pilih" && (
        <DataLakeExplorer onRunPrediction={handleRunPrediction} />
      )}

      {stage === "berjalan" && activeRecord && (
        <>
          {/* TABS */}
          <div className="flex items-center gap-2 border-b border-slate-800">
            <button
              onClick={() => setActiveTab("log")}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold border-b-2 transition-colors ${
                activeTab === "log"
                  ? "border-indigo-500 text-slate-100"
                  : "border-transparent text-slate-500 hover:text-slate-300"
              }`}
            >
              <TerminalIcon className="w-3.5 h-3.5" /> Log Proses
              {!logDone && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-1" />
              )}
            </button>
            <button
              onClick={() => logDone && setActiveTab("explainer")}
              disabled={!logDone}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold border-b-2 transition-colors ${
                activeTab === "explainer"
                  ? "border-indigo-500 text-slate-100"
                  : "border-transparent text-slate-500"
              } ${!logDone ? "opacity-40 cursor-not-allowed" : "hover:text-slate-300"}`}
            >
              <BarChart3 className="w-3.5 h-3.5" /> Hasil (Explainer)
              {!logDone && (
                <span className="text-[10px] text-slate-600 ml-1">
                  tunggu proses selesai
                </span>
              )}
            </button>
          </div>

          {/* KEDUANYA TETAP MOUNTED — toggle via display, bukan conditional render */}
          <div className={activeTab === "log" ? "block" : "hidden"}>
            <TerminalLog
              title={`inference.py --date ${activeRecord.tanggal}`}
              lines={buildPredictionLog(activeRecord)}
              autoplay={mode === MODES.GIMMICK}
              onDone={() => setLogDone(true)}
            />
          </div>
          <div
            className={
              activeTab === "explainer"
                ? "block animate-in fade-in duration-300"
                : "hidden"
            }
          >
            <XGBoostExplainerDashboard2 data={activeRecord} />
          </div>
        </>
      )}
    </div>
  );
}
