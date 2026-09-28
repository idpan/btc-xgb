import { Compass } from "lucide-react";

export default function MarketContextWidget() {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-5 text-slate-800 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Compass className="w-4 h-4 text-amber-500" />
          Konteks Pasar
        </h3>
      </div>

      <div className="grid grid-cols-3 gap-2.5 mt-2">
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 text-center">
          <div className="text-xl font-bold font-mono text-amber-600">54</div>
          <div className="text-[10px] text-slate-500 mt-1 leading-tight font-medium">
            Fear &amp; Greed<br />(Neutral)
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 text-center">
          <div className="text-xl font-bold font-mono text-slate-900">2.1%</div>
          <div className="text-[10px] text-slate-500 mt-1 leading-tight font-medium">
            ATR (24h)<br />Volatilitas
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 text-center">
          <div className="text-xl font-bold font-mono text-emerald-600">$28.4B</div>
          <div className="text-[10px] text-slate-500 mt-1 leading-tight font-medium">
            Volume 24h<br />(+8%)
          </div>
        </div>
      </div>
    </div>
  );
}
