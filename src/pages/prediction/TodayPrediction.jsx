import { ListFilter } from "lucide-react";

export default function FeaturePredictionCurrent({ data }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-4 flex justify-between items-center border-b border-slate-200">
        <div>
          <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <ListFilter className="w-4 h-4 text-indigo-600" />
            Data 21 Fitur Indikator & Kontribusi SHAP
          </h2>
          <p className="text-md text-slate-500 mt-0.5">
            Nilai indikator teknikal aktual dan besaran kontribusinya terhadap Total Log-Odds
          </p>
        </div>
        <span className="text-md bg-slate-100 px-2.5 py-1 rounded-full text-slate-600 font-medium border border-slate-200">
          Total 21 Fitur
        </span>
      </div>

      <div className="relative overflow-y-auto ">
        <table className="w-full text-md text-left border-collapse">
          <thead className="sticky top-0 bg-indigo-600 text-white font-bold uppercase text-md tracking-wider z-10">
            <tr>
              <th className="py-2.5 px-4 border-r border-indigo-500/50 w-12 text-center">NO</th>
              <th className="py-2.5 px-4 border-r border-indigo-500/50">NAMA FITUR</th>
              <th className="py-2.5 px-4 border-r border-indigo-500/50">NILAI AKTUAL</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200 bg-white">
            {data.map((item, idx) => (
              <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-2 px-4 text-center text-slate-600 font-mono border-r border-slate-100">
                  {idx + 1}
                </td>
                <td className="py-2 px-4 font-semibold text-slate-700 border-r border-slate-100">
                  {item.name}
                </td>
                <td className="py-2 px-4 text-slate-700 font-mono border-r border-slate-100">
                  {item.value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
