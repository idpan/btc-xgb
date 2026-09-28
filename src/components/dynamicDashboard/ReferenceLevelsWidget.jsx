import { Layers } from "lucide-react";

export default function ReferenceLevelsWidget() {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-5 text-slate-800 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Layers className="w-4 h-4 text-amber-500" />
          Level Referensi Teknikal
        </h3>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center pb-2.5 border-b border-slate-100">
          <div className="text-xs text-slate-500">Resistance terdekat (swing high)</div>
          <div className="font-mono text-sm font-bold text-rose-600">$94,800</div>
        </div>

        <div className="flex justify-between items-center pb-2.5 border-b border-slate-100">
          <div className="text-xs text-slate-500">Support terdekat (swing low)</div>
          <div className="font-mono text-sm font-bold text-emerald-600">$91,600</div>
        </div>

        <div className="flex justify-between items-center pt-0.5">
          <div className="text-xs text-slate-500">1x ATR dari harga sekarang</div>
          <div className="font-mono text-sm font-bold text-slate-900">± $1,960</div>
        </div>
      </div>
    </div>
  );
}
