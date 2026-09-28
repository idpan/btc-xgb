import { Target, Activity } from "lucide-react";

export default function GridStatsWidget() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div className="bg-white border border-slate-200 rounded-3xl p-4 text-slate-800 shadow-sm">
        <div className="text-xs text-slate-500 mb-1 flex items-center justify-between">
          <span>Win Rate (30 hari)</span>
          <Target className="w-4 h-4 text-emerald-600" />
        </div>
        <div className="text-2xl font-bold font-mono text-emerald-600">61.3%</div>
        <div className="text-[11px] text-slate-400 mt-1 font-mono">92 sinyal, 56 benar</div>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl p-4 text-slate-800 shadow-sm">
        <div className="text-xs text-slate-500 mb-1 flex items-center justify-between">
          <span>ATR (24h)</span>
          <Activity className="w-4 h-4 text-blue-600" />
        </div>
        <div className="text-2xl font-bold font-mono text-slate-900">2.1%</div>
        <div className="text-[11px] text-slate-400 mt-1 font-mono">≈ $1,960 pada harga saat ini</div>
      </div>
    </div>
  );
}
