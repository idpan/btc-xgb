import { TrendingUp, Info } from "lucide-react";

export default function AnchorPriceWidget() {
  const anchorPrice = 93240;
  const livePrice = 94150;
  const diff = livePrice - anchorPrice;
  const driftPct = ((diff / anchorPrice) * 100).toFixed(2);
  const isPos = diff >= 0;

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-5 text-slate-800 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <TrendingUp className="w-4 h-4 text-blue-600" />
          Titik Acuan vs Harga Sekarang
        </h3>
      </div>

      <div className="space-y-2.5">
        <div className="flex justify-between items-center py-2 border-b border-slate-100">
          <div className="text-xs text-slate-500 flex items-center gap-2">
            <span>Closing terakhir</span>
            <span className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded font-mono font-semibold">
              acuan model
            </span>
          </div>
          <div className="font-mono text-sm font-bold text-slate-900">${anchorPrice.toLocaleString()}</div>
        </div>

        <div className="flex justify-between items-center py-2 border-b border-slate-100">
          <div className="text-xs text-slate-500">Harga sekarang</div>
          <div className="font-mono text-sm font-bold text-slate-900">${livePrice.toLocaleString()}</div>
        </div>

        <div className="flex justify-between items-center py-2">
          <div className="text-xs text-slate-500">Selisih (drift)</div>
          <div
            className={`font-mono text-sm font-bold ${
              isPos ? "text-emerald-600" : "text-rose-600"
            }`}
          >
            {isPos ? `+${driftPct}%` : `${driftPct}%`}
          </div>
        </div>
      </div>

      <div className="mt-3 p-3 bg-amber-50 rounded-2xl border-l-4 border-amber-500 text-[11px] text-amber-900 leading-relaxed flex items-start gap-2">
        <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div>
          Harga sekarang sudah {Math.abs(driftPct)}% di atas closing acuan, berlawanan arah dengan prediksi Bearish. Data ini disajikan apa adanya — interpretasinya tergantung strategi masing-masing trader.
        </div>
      </div>
    </div>
  );
}
