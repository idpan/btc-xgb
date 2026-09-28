import React, { useState, useEffect, useRef } from "react";

function useTerminalLines(lines, speed) {
  const [visibleCount, setVisibleCount] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    // JIKA SUDAH SELESAI, JANGAN RESET KE 0 LAGI
    if (done) return;

    setVisibleCount(0);
    setDone(false);

    if (!lines || lines.length === 0) return;

    let i = 0;
    const interval = setInterval(() => {
      i += 1;
      setVisibleCount(i);
      if (i >= lines.length) {
        clearInterval(interval);
        setDone(true);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [lines, speed, done]); // <-- Tambahkan `done` ke dependency

  return { visibleCount, done };
}

const COLOR_MAP = {
  cmd: "text-slate-500",
  phase: "text-indigo-400 font-bold mt-3 first:mt-0", // ← baris baru
  info: "text-slate-300",
  detail: "text-slate-500 pl-4",
  success: "text-emerald-400",
  result: "text-indigo-300 pl-4",
  warn: "text-amber-400",
};
const FEATURE_GROUPS = [
  { label: "MOMENTUM", features: ["RSI", "MACD", "MACD_Signal", "MACD_Hist"] },
  {
    label: "TREN & VOLATILITAS",
    features: ["Log_Ret", "ATR", "D_EMA20", "D_EMA200", "BBW"],
  },
  { label: "VOLUME", features: ["OBV", "Vol_Chg"] },
  {
    label: "WAKTU (cyclical)",
    features: ["Day_Sin", "Day_Cos", "Mon_Sin", "Mon_Cos"],
  },
  {
    label: "REGIME FEATURES",
    features: [
      "regime_trend_strength",
      "regime_vol_ratio",
      "regime_adx",
      "regime_rsi_norm",
      "regime_ema_spread",
      "regime_vol_trend",
    ],
  },
];

export function buildPredictionLog(record) {
  const featureMap = Object.fromEntries(
    record.fitur_21.map((f) => [f.fitur, f]),
  );
  const lines = [];

  lines.push({
    type: "cmd",
    text: `$ python inference.py --date ${record.tanggal}`,
  });

  // ================= FASE 1/3 =================
  lines.push({ type: "phase", text: "[1/3] MEMUAT HISTORI OHLCV" });
  lines.push({ type: "info", text: "> Membaca data dari database..." });
  lines.push({
    type: "detail",
    text: `  rentang: 2020-01-01 → ${record.tanggal}`,
  });
  lines.push({ type: "success", text: "  ✓ histori dimuat" });

  // ================= FASE 2/3 =================
  lines.push({ type: "phase", text: "[2/3] MENGHITUNG 21 FITUR TEKNIKAL" });
  FEATURE_GROUPS.forEach((group) => {
    lines.push({ type: "info", text: `> ${group.label}` });
    group.features.forEach((fname) => {
      const f = featureMap[fname];
      lines.push({
        type: "detail",
        text: `  ${fname.padEnd(24, " ")} = ${f ? f.nilai : "—"}`,
      });
    });
  });
  lines.push({
    type: "success",
    text: "  ✓ 21 fitur siap sebagai input model",
  });

  // ================= FASE 3/3 =================
  lines.push({
    type: "phase",
    text: "[3/3] INFERENSI MODEL (XGBClassifier, 100 pohon)",
  });
  lines.push({
    type: "info",
    text: "> Menjumlahkan leaf score per batch 10 pohon...",
  });

  if (record.tracing_100_pohon) {
    let running = record.base_score_log_odds;
    const batchSize = 10;
    for (let i = 0; i < record.tracing_100_pohon.length; i += batchSize) {
      const batch = record.tracing_100_pohon.slice(i, i + batchSize);
      batch.forEach((t) => {
        running += t.leaf_value;
      });
      lines.push({
        type: "detail",
        text: `  pohon ${String(i + 1).padStart(3, "0")}-${String(i + batch.length).padStart(3, "0")}/100  →  running sum = ${running >= 0 ? "+" : ""}${running.toFixed(4)}`,
      });
    }
  }

  lines.push({ type: "info", text: "> Agregasi akhir:" });
  lines.push({
    type: "result",
    text: `  base_score (log-odds)     = ${record.base_score_log_odds.toFixed(4)}`,
  });
  lines.push({
    type: "result",
    text: `  Σ leaf scores (100 pohon) = ${record.sum_leaf_scores >= 0 ? "+" : ""}${record.sum_leaf_scores.toFixed(4)}`,
  });
  lines.push({
    type: "result",
    text: `  total log-odds (z)        = ${record.total_log_odds >= 0 ? "+" : ""}${record.total_log_odds.toFixed(4)}`,
  });
  lines.push({ type: "info", text: "> Menerapkan sigmoid: 1 / (1 + e⁻ᶻ)" });
  lines.push({
    type: "result",
    text: `  P(UP)                     = ${record.probabilitas_up.toFixed(2)}%`,
  });
  lines.push({
    type: record.prediksi === "UP" ? "success" : "warn",
    text: `> Keputusan: P(UP) ${record.probabilitas_up > 50 ? ">" : "≤"} 0.50 → PREDIKSI = ${record.prediksi}`,
  });
  lines.push({ type: "success", text: "✓ Selesai" });

  return lines;
}
export function TerminalLog({
  lines,
  title = "inference.py",
  speed = 220,
  onDone,
}) {
  const { visibleCount, done } = useTerminalLines(lines, speed);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [visibleCount]);

  useEffect(() => {
    if (done) onDone?.();
  }, [done]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="bg-[#0a0e14] border border-slate-800 rounded-xl overflow-hidden font-mono text-xs">
      <div className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 border-b border-slate-800">
        <span className="w-2.5 h-2.5 rounded-full bg-rose-500/70" />
        <span className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
        <span className="ml-2 text-slate-500 text-[11px]">{title}</span>
      </div>
      <div className="p-4 space-y-1 h-[600px] overflow-y-auto">
        {lines.slice(0, visibleCount).map((line, i) => (
          <div
            key={i}
            className={`whitespace-pre-wrap ${COLOR_MAP[line.type] || "text-slate-300"}`}
          >
            {line.text}
          </div>
        ))}
        {!done && (
          <span className="inline-block w-2 h-3.5 bg-emerald-400 animate-pulse align-middle" />
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
