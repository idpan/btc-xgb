import { BarChart2 } from "lucide-react";

export default function ShapContributionWidget() {
  const shapFeatures = [
    { name: "Funding Rate", value: -0.19 },
    { name: "RSI (14)", value: -0.14 },
    { name: "Volume 24h", value: 0.08 },
    { name: "MA(50) cross", value: -0.07 },
    { name: "Lagged Return (1d)", value: 0.04 },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-5 text-slate-800 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <BarChart2 className="w-4 h-4 text-rose-500" />
          Kontribusi Fitur — SHAP (untuk sinyal ini)
        </h3>
      </div>

      <div className="space-y-3 mt-3">
        {shapFeatures.map((item, idx) => {
          const isPos = item.value >= 0;
          const absVal = Math.abs(item.value);
          const widthPct = Math.min(absVal * 250, 48); // scale for visual bar

          return (
            <div key={idx} className="flex items-center text-xs">
              <div className="w-28 text-slate-500 shrink-0 font-medium">{item.name}</div>
              <div className="flex-1 h-4 relative bg-slate-100 border border-slate-200/60 rounded overflow-hidden mx-2">
                {/* Center line indicator */}
                <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-slate-300 z-10"></div>
                {/* Bar */}
                <div
                  className={`h-full rounded transition-all duration-500 ${
                    isPos ? "bg-emerald-500" : "bg-rose-500"
                  }`}
                  style={{
                    width: `${widthPct}%`,
                    marginLeft: isPos ? "50%" : `calc(50% - ${widthPct}%)`,
                  }}
                ></div>
              </div>
              <div
                className={`w-12 text-right font-mono text-xs font-bold shrink-0 ${
                  isPos ? "text-emerald-600" : "text-rose-600"
                }`}
              >
                {isPos ? `+${item.value}` : item.value}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
