import { useState, useEffect } from "react";

export default function NextPredictionCard({ pendingData }) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      // Target: Jam 7 pagi besok (WIB) saat data yfinance biasanya update
      const target = new Date();
      target.setHours(7, 0, 0, 0);
      if (now > target) target.setDate(target.getDate() + 1);

      const diff = target - now;
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft(`${hours}j ${minutes}m ${seconds}s`);
    };

    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!pendingData) return null;

  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden border border-slate-700">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl"></div>

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <span className="bg-blue-500/20 text-blue-300 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider border border-blue-500/30">
            Prediksi Berikutnya
          </span>
          <div className="text-right">
            <p className="text-slate-400 text-[10px] uppercase font-bold">
              Validasi Dalam
            </p>
            <p className="text-blue-400 font-mono text-sm">{timeLeft}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div
            className={`p-4 rounded-xl ${
              pendingData.prediction_direction === "up"
                ? "bg-emerald-500/20"
                : "bg-red-500/20"
            }`}
          >
            <i
              className={`fa-solid fa-3x ${
                pendingData.prediction_direction === "up"
                  ? "fa-circle-chevron-up text-emerald-400"
                  : "fa-circle-chevron-down text-red-400"
              }`}
            ></i>
          </div>

            <div className="flex flex-col">
              <p className="text-slate-400 text-xs">Arah Prediksi</p>
              <h2 className="text-2xl font-black uppercase tracking-tight">
                {pendingData.prediction_direction === "up" ? "Naik" : "Turun"}
              </h2>
            </div>
            <div className="ml-auto text-right">
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Keyakinan</p>
              <p className={`text-sm font-black ${
                pendingData.confidence_level < 0.55 ? "text-slate-400" :
                pendingData.confidence_level < 0.75 ? "text-amber-400" : "text-emerald-400"
              }`}>
                {(pendingData.confidence_level * 100).toFixed(1)}%
              </p>
              <span className={`text-[8px] font-bold uppercase tracking-tighter px-2 py-0.5 rounded ${
                pendingData.confidence_level < 0.55 ? "bg-slate-700 text-slate-400" :
                pendingData.confidence_level < 0.75 ? "bg-amber-900/40 text-amber-400" : "bg-emerald-900/40 text-emerald-400"
              }`}>
                {pendingData.confidence_level < 0.55 ? "Rendah" : 
                 pendingData.confidence_level < 0.75 ? "Cukup" : "Kuat"}
              </span>
            </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-700/50 flex flex-col gap-2 text-[10px] text-slate-400">
          <div className="flex justify-between items-center">
            <span className="font-bold text-slate-300 underline decoration-blue-500/50">Target Penutupan: {pendingData.date}</span>
            <span className="bg-blue-600/20 text-blue-300 px-2 py-0.5 rounded border border-blue-500/30">Valit di: Besok Pagi 07:00 WIB</span>
          </div>
          <p className="italic text-slate-500 leading-relaxed">
            *Prediksi dibuat dari data pagi ini (07:00 WIB) untuk memperkirakan apakah harga besok pagi akan lebih tinggi atau rendah.
          </p>
        </div>
      </div>
    </div>
  );
}
