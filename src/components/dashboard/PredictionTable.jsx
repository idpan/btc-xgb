import { Eye } from "lucide-react";
import { Link } from "react-router-dom";

export const PredictionTable = ({ data = [] }) => {
  const getDirectionStyle = (dir) => {
    if (dir === "up") return "text-emerald-600";
    if (dir === "down") return "text-red-600";
    return "text-slate-400";
  };

  const getStatusStyle = (status) => {
    if (status === "correct") return "bg-emerald-100 text-emerald-700";
    if (status === "wrong") return "bg-red-100 text-red-700";
    return "bg-slate-100 text-slate-600";
  };

  const formatCurrency = (val) =>
    val !== undefined && val !== null
      ? `$${val.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`
      : "-";

  const hasConfidence = data.some(
    (item) => item.confidence_level !== undefined,
  );

  return (
    <div className="bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden text-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-[#4e73df] text-white uppercase text-xs font-bold tracking-wider">
            <tr>
              <th className="p-3.5 border-r border-blue-400/40 last:border-r-0">
                Tanggal
                <span className="block text-[9px] font-normal lowercase opacity-80">
                  Acuan UTC
                </span>
              </th>
              <th className="p-3.5 border-r border-blue-400/40 last:border-r-0">
                Harga Closing
              </th>
              <th className="p-3.5 border-r border-blue-400/40 last:border-r-0">
                Prediksi
              </th>
              {hasConfidence && (
                <th className="p-3.5 text-center border-r border-blue-400/40 last:border-r-0">
                  Confidence
                </th>
              )}
              <th className="p-3.5 border-r border-blue-400/40 last:border-r-0">
                Aktual
              </th>
              <th className="p-3.5 border-r border-blue-400/40 last:border-r-0">
                Closing Berikutnya
              </th>
              <th className="p-3.5">Hasil</th>
              <th className="p-3.5">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-slate-700">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={hasConfidence ? 7 : 6}
                  className="p-12 text-center text-slate-400 italic"
                >
                  <i className="fa-solid fa-folder-open block text-4xl mb-4 opacity-20"></i>
                  Tidak ada data riwayat yang ditemukan.
                </td>
              </tr>
            ) : (
              data.map((item, index) => (
                <tr
                  key={index}
                  className="hover:bg-blue-50/20 transition text-slate-700 border-b border-slate-200"
                >
                  {/* Tanggal */}
                  <td className="p-3.5 border-r border-slate-200 font-medium">
                    {item.date}
                  </td>

                  {/* Closing Price */}
                  <td className="p-3.5 border-r border-slate-200 font-semibold text-slate-800">
                    {formatCurrency(item.closing_price)}
                  </td>

                  {/* Prediksi */}
                  <td
                    className={`p-3.5 border-r border-slate-200 font-bold uppercase ${getDirectionStyle(
                      item.prediction_direction,
                    )}`}
                  >
                    <i
                      className={`fa-solid ${
                        item.prediction_direction === "up"
                          ? "fa-arrow-trend-up"
                          : "fa-arrow-trend-down"
                      } mr-2`}
                    ></i>
                    {item.prediction_direction}
                  </td>

                  {/* Confidence (Jika Ada) */}
                  {hasConfidence && (
                    <td className="p-3.5 border-r border-slate-200 text-center">
                      {item.confidence_level !== undefined ? (
                        <>
                          <div className="w-20 bg-slate-200 h-1.5 rounded-full mx-auto overflow-hidden">
                            <div
                              className="bg-[#4e73df] h-1.5 rounded-full"
                              style={{
                                width: `${item.confidence_level * 100}%`,
                              }}
                            ></div>
                          </div>
                          <span className="text-[10px] mt-1 block">
                            {(item.confidence_level * 100).toFixed(0)}%
                          </span>
                        </>
                      ) : (
                        "-"
                      )}
                    </td>
                  )}

                  {/* Aktual */}
                  <td
                    className={`p-3.5 border-r border-slate-200 font-bold uppercase ${getDirectionStyle(
                      item.actual_direction,
                    )}`}
                  >
                    <i
                      className={`fa-solid ${
                        item.actual_direction === "up"
                          ? "fa-arrow-trend-up"
                          : item.actual_direction === "down"
                            ? "fa-arrow-trend-down"
                            : "fa-clock"
                      } mr-2`}
                    ></i>
                    {item.actual_direction || "pending"}
                  </td>

                  {/* Next Closing Price */}
                  <td className="p-3.5 border-r border-slate-200 font-semibold text-slate-800">
                    {formatCurrency(item.next_closing_price)}
                  </td>

                  {/* Hasil Status */}
                  <td className="p-3.5">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${getStatusStyle(
                        item.prediction_status,
                      )}`}
                    >
                      <i
                        className={`fa-solid ${
                          item.prediction_status === "correct"
                            ? "fa-check"
                            : item.prediction_status === "wrong"
                              ? "fa-xmark"
                              : "fa-spinner"
                        } mr-1`}
                      ></i>
                      {item.prediction_status === "correct"
                        ? "Benar"
                        : item.prediction_status === "wrong"
                          ? "Salah"
                          : "Proses"}
                    </span>
                  </td>
                  <td className="p-3.5 border-r border-slate-200 font-semibold text-slate-800">
                    <Link to="/prediction-history/hasil">
                      <button className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-indigo text-xs font-semibold px-4 py-2 rounded-lg transition-colors">
                        <Eye className="w-3.5 h-3.5" />
                        Detail
                      </button>
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
