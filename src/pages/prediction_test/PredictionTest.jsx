import { Play } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export const PredictionTest = () => {
  const [data, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/ohlcv.json")
      .then((res) => {
        if (!res.ok) throw new Error("Gagal mengambil data ohlcv.json");
        return res.json();
      })
      .then((data) => {
        // Karena data di public/prediction_history.json berupa Array langsung
        setHistoryData(Array.isArray(data) ? data : data.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Gagal mengambil data:", err);
        setLoading(false);
      });
  }, []);

  const formatCurrency = (val) =>
    val !== undefined && val !== null
      ? `$${val.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`
      : "-";
  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 ">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            Tes Prediksi
          </h1>
          <p className="text-slate-500 font-medium">
            Melakukan untuk data pada tanggal tertentu.
          </p>
        </div>
      </div>
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
                  Open
                </th>
                <th className="p-3.5 border-r border-blue-400/40 last:border-r-0">
                  High
                </th>
                <th className="p-3.5 text-center border-r border-blue-400/40 last:border-r-0">
                  Close
                </th>
                <th className="p-3.5 border-r border-blue-400/40 last:border-r-0">
                  Volume
                </th>
                <th className="p-3.5 border-r border-blue-400/40 last:border-r-0">
                  Aksi
                </th>
                {/* <th className="p-3.5">Hasil</th> */}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-700">
              {data.length === 0 ? (
                <tr>
                  <td className="p-12 text-center text-slate-400 italic">
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
                      {formatCurrency(item.open)}
                    </td>
                    <td className="p-3.5 border-r border-slate-200 font-semibold text-slate-800">
                      {formatCurrency(item.high)}
                    </td>
                    <td className="p-3.5 border-r border-slate-200 font-semibold text-slate-800">
                      {formatCurrency(item.low)}
                    </td>
                    <td className="p-3.5 border-r border-slate-200 font-semibold text-slate-800">
                      {formatCurrency(item.close)}
                    </td>
                    <td className="p-3.5 border-r border-slate-200 font-semibold text-slate-800">
                      {/* <button className="p-2 bg" >Lakukan Prediksi</button> */}
                      <Link to="/prediction-test/hasil">
                        <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors">
                          <Play className="w-3.5 h-3.5" />
                          Prediksi
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
    </>
  );
};
