import { useState, useEffect } from "react";
import { ArrowDown, ArrowUp, Clock } from "lucide-react";

export default function SignalCardWidget() {
  const [signalData] = useState({
    pair: "BTC/USDT",
    direction: "BEARISH",
    confidence: 63,
    proba: 0.63,
    hoursLeft: 9,
    minutesLeft: 28,
    secondsLeft: 45,
  });

  const [timeLeft, setTimeLeft] = useState({
    h: signalData.hoursLeft,
    m: signalData.minutesLeft,
    s: signalData.secondsLeft,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.s > 0) return { ...prev, s: prev.s - 1 };
        if (prev.m > 0) return { ...prev, m: 59, s: 59 };
        if (prev.h > 0) return { h: prev.h - 1, m: 59, s: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const isBear = signalData.direction === "BEARISH";

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-5 md:p-6 text-slate-800 shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <div className="text-xs text-slate-400 mb-1 font-medium">
            Prediksi closing berikutnya vs closing terakhir
          </div>
          <div
            className={`text-2xl md:text-3xl font-black flex items-center gap-2 ${
              isBear ? "text-rose-600" : "text-emerald-600"
            }`}
          >
            <span className="text-2xl">
              {isBear ? <ArrowDown className="w-7 h-7 stroke-[3]" /> : <ArrowUp className="w-7 h-7 stroke-[3]" />}
            </span>
            {signalData.direction}
          </div>
        </div>
        <div
          className={`font-mono text-xs md:text-sm font-bold px-3 py-1.5 rounded-full whitespace-nowrap ${
            isBear
              ? "bg-rose-50 text-rose-600 border border-rose-200"
              : "bg-emerald-50 text-emerald-600 border border-emerald-200"
          }`}
        >
          Confidence {signalData.confidence}%
        </div>
      </div>

      <div className="text-xs text-slate-500 mt-3 leading-relaxed">
        Model memprediksi harga <b className="text-slate-800 font-semibold">closing berikutnya</b> akan berada lebih rendah dibanding closing terakhir. Pergerakan harga di sepanjang periode tidak diprediksi — bisa naik-turun sebelum closing.
      </div>

      <div className="mt-4">
        <div className="flex justify-between text-[11px] text-slate-500 mb-1.5">
          <span>Keyakinan model</span>
          <span className="font-mono text-slate-700 font-semibold">predict_proba: {signalData.proba}</span>
        </div>
        <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/60">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isBear ? "bg-rose-500" : "bg-emerald-500"
            }`}
            style={{ width: `${signalData.confidence}%` }}
          ></div>
        </div>
      </div>

      <div className="flex justify-between items-center mt-4 pt-3 border-t border-dashed border-slate-200">
        <div className="text-xs text-slate-500 flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-amber-500" />
          <span>Closing berikutnya (WIB 07:00) dalam</span>
        </div>
        <div className="font-mono text-sm font-bold text-amber-600">
          {String(timeLeft.h).padStart(2, "0")}j {String(timeLeft.m).padStart(2, "0")}m {String(timeLeft.s).padStart(2, "0")}s
        </div>
      </div>
    </div>
  );
}
