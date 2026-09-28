import React, { useState, useEffect } from "react";
import { Play, Lock, Database, Info, Loader2 } from "lucide-react";

function SplitBadge({ split }) {
  const map = {
    train: { label: "Train", cls: "bg-slate-700 text-slate-300" },
    test: {
      label: "Test",
      cls: "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30",
    },
  };
  const s = map[split] ?? map.train;
  return (
    <span
      className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${s.cls}`}
    >
      {s.label}
    </span>
  );
}

export default function DataLakeExplorer({ onRunPrediction }) {
  const [data, setData] = useState(null);
  const [selectedTanggal, setSelectedTanggal] = useState(null);

  useEffect(() => {
    fetch("/data-lake.json")
      .then((res) => res.json())
      .then(setData)
      .catch(() => setData([]));
  }, []);

  if (!data) {
    return (
      <div className="flex items-center justify-center gap-2 text-slate-500 text-sm py-16">
        <Loader2 className="w-4 h-4 animate-spin" /> Memuat data-lake.json...
      </div>
    );
  }

  const selectedRow = data.find((r) => r.tanggal === selectedTanggal);
  const canSelect = (row) => row.split === "test"; // MVP: cuma test set punya bundle lengkap

  return (
    <div className="bg-slate-900 text-slate-200 rounded-xl border border-slate-800 overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Database className="w-5 h-5 text-indigo-400" />
          <div>
            <h2 className="text-sm font-bold text-slate-100">
              Data Lake — OHLCV Historis
            </h2>
            <p className="text-xs text-slate-500">
              Pilih baris test set untuk lihat detail prediksi
            </p>
          </div>
        </div>
        <span className="text-[10px] text-slate-500 font-mono">
          {data.length.toLocaleString("id-ID")} baris · MVP (frontend-only,
          tanpa backend)
        </span>
      </div>

      <div className="max-h-[480px] overflow-y-auto">
        <table className="w-full text-xs font-mono border-collapse">
          <thead className="sticky top-0 bg-slate-950 border-b border-slate-800 text-slate-500 text-[10px] uppercase font-sans z-10">
            <tr>
              <th className="text-left py-2 px-3">Tanggal</th>
              <th className="text-right py-2 px-3">Open</th>
              <th className="text-right py-2 px-3">High</th>
              <th className="text-right py-2 px-3">Low</th>
              <th className="text-right py-2 px-3">Close</th>
              <th className="text-right py-2 px-3">Volume</th>
              <th className="text-center py-2 px-3 font-sans">Set</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => {
              const selectable = canSelect(row);
              const isSelected = row.tanggal === selectedTanggal;
              return (
                <tr
                  key={row.tanggal}
                  onClick={() => selectable && setSelectedTanggal(row.tanggal)}
                  className={`border-b border-slate-800/60 transition-colors ${
                    selectable
                      ? "cursor-pointer hover:bg-slate-800/60"
                      : "cursor-not-allowed opacity-40"
                  } ${isSelected ? "bg-indigo-500/20 border-l-2 border-indigo-400" : ""}`}
                  title={
                    selectable
                      ? undefined
                      : "Versi MVP ini baru menyediakan bundle prediksi untuk baris test set"
                  }
                >
                  <td className="py-1.5 px-3 flex items-center gap-1.5">
                    {!selectable && <Lock className="w-3 h-3 text-slate-600" />}
                    {row.tanggal}
                  </td>
                  <td className="text-right py-1.5 px-3 text-slate-400">
                    {row.open.toFixed(2)}
                  </td>
                  <td className="text-right py-1.5 px-3 text-slate-400">
                    {row.high.toFixed(2)}
                  </td>
                  <td className="text-right py-1.5 px-3 text-slate-400">
                    {row.low.toFixed(2)}
                  </td>
                  <td className="text-right py-1.5 px-3 text-slate-200 font-semibold">
                    {row.close.toFixed(2)}
                  </td>
                  <td className="text-right py-1.5 px-3 text-slate-400">
                    {row.volume.toLocaleString("en-US")}
                  </td>
                  <td className="text-center py-1.5 px-3">
                    <SplitBadge split={row.split} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {selectedRow && (
        <div className="border-t border-indigo-500/30 bg-indigo-500/10 px-5 py-4 space-y-3">
          <div className="flex items-start gap-2 text-xs text-slate-300">
            <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <p>
              Bundle prediksi untuk tanggal ini sudah tersedia (di-precompute
              dari model asli) — tidak ada kalkulasi ulang di browser.
            </p>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-xs text-slate-400">
              Target:{" "}
              <span className="text-slate-100 font-semibold">
                {selectedRow.tanggal}
              </span>{" "}
              <SplitBadge split={selectedRow.split} />
              <span className="ml-2 text-slate-500">
                — label aktual tersedia untuk validasi
              </span>
            </div>
            <button
              onClick={() => onRunPrediction?.(selectedRow)}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              <Play className="w-3.5 h-3.5" />
              Lihat Prediksi {selectedRow.tanggal}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
