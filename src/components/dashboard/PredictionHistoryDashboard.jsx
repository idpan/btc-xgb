import React from "react";

export const PredictionHistoryDashboard = ({ data = [] }) => {
  const getDirectionBadge = (dir) => {
    if (dir === "up") return <span className="text-[#33c17f]">▲</span>;
    if (dir === "down") return <span className="text-[#ef5a6f]">▼</span>;
    return <span className="text-[#7c8aa0]">-</span>;
  };

  const getStatusIcon = (status) => {
    if (status === "correct")
      return (
        <span className="px-1.5 py-0.5 rounded text-[12px] font-bold bg-[#33c17f]/15 text-[#33c17f]">
          ✓ Benar
        </span>
      );
    if (status === "wrong")
      return (
        <span className="px-1.5 py-0.5 rounded text-[12px] font-bold bg-[#ef5a6f]/15 text-[#ef5a6f]">
          ✗ Salah
        </span>
      );
    return (
      <span className="px-1.5 py-0.5 rounded text-[12px] font-bold bg-[#161e2c] text-[#7c8aa0]">
        ⏳ Proses
      </span>
    );
  };

  return (
    <div className="w-full bg-[#111722] border border-[#232e40] rounded-xl overflow-hidden text-xs text-[#e8edf5]">
      <table className="w-full text-left border-collapse">
        <thead className="bg-[#161e2c] text-[#7c8aa0] uppercase text-[9.5px] font-semibold border-b border-[#232e40]">
          <tr className="text-center">
            <th className="py-2.5 px-3">Tgl (UTC)</th>
            <th className="py-2.5 px-2 text-center">
              Arah <br />
              (Pred → Akt)
            </th>
            {/* <th className="py-2.5 px-2 text-center">Conf.</th> */}
            <th className="py-2.5 px-3 ">Hasil</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#1c2637] font-mono text-[12px]">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan="4"
                className="py-8 text-center text-[#7c8aa0] font-sans italic"
              >
                Tidak ada data riwayat.
              </td>
            </tr>
          ) : (
            data.map((item, index) => (
              <tr
                key={index}
                className="hover:bg-[#161e2c]/50 transition text-center "
              >
                {/* Tanggal */}
                <td className="py-2 px-3 text-[#e8edf5] whitespace-nowrap">
                  {item.date}
                </td>

                {/* Prediksi vs Aktual Ringkas */}
                <td className="py-2 px-2  font-bold">
                  <div className="flex items-center justify-center gap-1.5 text-sm">
                    {getDirectionBadge(item.prediction_direction)}
                    <span className="text-[#7c8aa0] text-[9px]">→</span>
                    {getDirectionBadge(item.actual_direction)}
                  </div>
                </td>

                {/* Confidence Persen Saja */}
                {/* <td className="py-2 px-2 text-center text-[#7c8aa0]">
                  {(item.confidence_level * 100).toFixed(0)}%
                </td> */}

                {/* Status Badge Ringkas */}
                <td className="py-2 px-3  font-sans">
                  {getStatusIcon(item.prediction_status)}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
