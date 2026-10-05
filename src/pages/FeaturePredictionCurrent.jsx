export default function PredictionTable({ data = [] }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm text-left border-collapse">
        <thead className="bg-slate-100 text-slate-700">
          <tr>
            <th className="px-4 py-3">Tanggal</th>
            <th className="px-4 py-3">Prediksi</th>
            <th className="px-4 py-3">Aktual</th>
            <th className="px-4 py-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={`${row.date}-${index}`} className="border-t border-slate-200">
              <td className="px-4 py-3">{row.date}</td>
              <td className="px-4 py-3">{row.prediction_direction || row.prediction || "-"}</td>
              <td className="px-4 py-3">{row.actual_direction || row.actual || "-"}</td>
              <td className="px-4 py-3">
                <span className="inline-flex rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                  {row.prediction_status || row.status || "pending"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
