import { useState } from "react";
import { Award } from "lucide-react";

export default function WinRateHistoryWidget() {
  const [activeTab, setActiveTab] = useState("30d");

  const dataMap = {
    "7d": { bullish: 72, bearish: 55, neutral: 48 },
    "30d": { bullish: 68, bearish: 61, neutral: 50 },
    "90d": { bullish: 65, bearish: 58, neutral: 52 },
  };

  const data = dataMap[activeTab] || dataMap["30d"];

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-5 text-slate-800 shadow-sm">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Award className="w-4 h-4 text-blue-600" />
          Track Record Klasifikasi
        </h3>
        <div className="flex gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
          {[
            { id: "7d", label: "7 Hari" },
            { id: "30d", label: "30 Hari" },
            { id: "90d", label: "90 Hari" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`text-xs px-2.5 py-1 rounded-lg transition font-medium ${
                activeTab === t.id
                  ? "bg-blue-600 text-white shadow-sm font-bold"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3 mt-4">
        {/* Bullish Row */}
        <div className="flex items-center gap-3">
          <div className="text-xs text-slate-500 w-16 shrink-0 font-medium">Bullish</div>
          <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden flex border border-slate-200/50">
            <div className="bg-emerald-500 h-full" style={{ width: `${data.bullish}%` }}></div>
            <div className="bg-rose-500 h-full" style={{ width: `${100 - data.bullish}%` }}></div>
          </div>
          <div className="font-mono text-xs text-emerald-600 w-10 text-right font-bold">{data.bullish}%</div>
        </div>

        {/* Bearish Row */}
        <div className="flex items-center gap-3">
          <div className="text-xs text-slate-500 w-16 shrink-0 font-medium">Bearish</div>
          <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden flex border border-slate-200/50">
            <div className="bg-emerald-500 h-full" style={{ width: `${data.bearish}%` }}></div>
            <div className="bg-rose-500 h-full" style={{ width: `${100 - data.bearish}%` }}></div>
          </div>
          <div className="font-mono text-xs text-emerald-600 w-10 text-right font-bold">{data.bearish}%</div>
        </div>

        {/* Neutral Row */}
        <div className="flex items-center gap-3">
          <div className="text-xs text-slate-500 w-16 shrink-0 font-medium">Neutral</div>
          <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden flex border border-slate-200/50">
            <div className="bg-emerald-500 h-full" style={{ width: `${data.neutral}%` }}></div>
            <div className="bg-rose-500 h-full" style={{ width: `${100 - data.neutral}%` }}></div>
          </div>
          <div
            className={`font-mono text-xs w-10 text-right font-bold ${
              data.neutral >= 50 ? "text-emerald-600" : "text-rose-600"
            }`}
          >
            {data.neutral}%
          </div>
        </div>
      </div>
    </div>
  );
}
