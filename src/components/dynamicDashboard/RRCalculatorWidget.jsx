import { useState } from "react";
import { Calculator } from "lucide-react";

export default function RRCalculatorWidget() {
  const [entry, setEntry] = useState(94150);
  const [sl, setSl] = useState(95100);
  const [tp, setTp] = useState(92200);

  const entryVal = parseFloat(entry) || 0;
  const slVal = parseFloat(sl) || 0;
  const tpVal = parseFloat(tp) || 0;

  const risk = Math.abs(entryVal - slVal);
  const reward = Math.abs(tpVal - entryVal);
  const ratio = risk > 0 ? (reward / risk) : 0;

  let ratioText = "—";
  let colorClass = "text-amber-600";
  if (risk > 0) {
    ratioText = `1 : ${ratio.toFixed(2)}`;
    if (ratio >= 1.5) colorClass = "text-emerald-600";
    else if (ratio >= 1.0) colorClass = "text-amber-600";
    else colorClass = "text-rose-600";
  }

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-5 text-slate-800 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Calculator className="w-4 h-4 text-blue-600" />
          Kalkulator Risk : Reward
        </h3>
      </div>

      <p className="text-[11px] text-slate-500 mb-4 leading-relaxed">
        Isi rencana entry, stop, dan target sesuai strategi kamu sendiri — aplikasi ini tidak menentukan level tersebut untukmu.
      </p>

      <div className="space-y-3">
        <div>
          <label className="block text-[11px] text-slate-500 mb-1 font-medium">Harga Entry</label>
          <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 focus-within:border-blue-500 focus-within:bg-white transition">
            <span className="font-mono text-xs text-slate-400 mr-1">$</span>
            <input
              type="number"
              value={entry}
              onChange={(e) => setEntry(e.target.value)}
              className="w-full bg-transparent border-none text-slate-800 font-mono text-sm focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] text-slate-500 mb-1 font-medium">Stop Loss</label>
          <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 focus-within:border-blue-500 focus-within:bg-white transition">
            <span className="font-mono text-xs text-slate-400 mr-1">$</span>
            <input
              type="number"
              value={sl}
              onChange={(e) => setSl(e.target.value)}
              className="w-full bg-transparent border-none text-slate-800 font-mono text-sm focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] text-slate-500 mb-1 font-medium">Take Profit</label>
          <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 focus-within:border-blue-500 focus-within:bg-white transition">
            <span className="font-mono text-xs text-slate-400 mr-1">$</span>
            <input
              type="number"
              value={tp}
              onChange={(e) => setTp(e.target.value)}
              className="w-full bg-transparent border-none text-slate-800 font-mono text-sm focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mt-4 pt-3 border-t border-slate-100">
        <div>
          <div className="text-[11px] text-slate-400">Rasio R:R</div>
          <div className={`font-mono text-2xl font-black ${colorClass}`}>{ratioText}</div>
        </div>
        <div className="text-[11px] text-slate-400 text-right max-w-[160px]">
          Dihitung dari angka yang kamu masukkan sendiri
        </div>
      </div>
    </div>
  );
}
