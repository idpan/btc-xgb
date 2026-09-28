export const PredictionSummary = ({ total, correct, confidence }) => {
  const winRate = ((correct / total) * 100).toFixed(0);

  return (
    <div className="bg-white border border-slate-200 shadow-sm p-6 rounded-2xl h-full">
      <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">
        Performance Summary
      </h3>

      <div className="space-y-6">
        {/* Win Rate Progress */}
        <div>
          <div className="flex justify-between items-end mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase">
              Win Rate
            </span>
            <span className="text-xl font-black text-blue-600">{winRate}%</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-blue-600 h-full transition-all duration-1000"
              style={{ width: `${winRate}%` }}
            ></div>
          </div>
          <p className="text-[10px] text-slate-400 mt-2">
            {correct} dari {total} prediksi terakhir akurat.
          </p>
        </div>

        {/* Confidence Average */}
        <div className="pt-4 border-t border-slate-50">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-500 uppercase">
              Avg. Confidence
            </span>
            <span className="text-sm font-mono font-bold text-slate-700">
              {confidence}%
            </span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1 italic">
            Rata-rata tingkat kepercayaan model terhadap sinyal.
          </p>
        </div>
      </div>
    </div>
  );
};
