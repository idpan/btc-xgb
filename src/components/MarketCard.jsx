import React, { useState } from "react";
import PriceChart from "./PriceChart";
import { formatUSD, formatCountdown } from "../utils/formatters";

export default function MarketCard({
  // Data Real dari 00:00 UTC (Strike) hingga 19:00 UTC (Live)
  strikePrice = 75584.17,
  livePrice = 75470.11,
  secondsLeft = 18000, // sisa waktu menuju UTC 00:00 berikutnya (5 jam)

  // Mapping 20 titik data ke koordinat grafik SVG (viewBox 0 0 480 200)
  historicalPoints = [
    { x: 15, y: 140 }, // 00:00 UTC - $75.584,17 (Strike Initial Point)
    { x: 36, y: 117 }, // 01:00 UTC - $75.724,95
    { x: 57, y: 165 }, // 02:00 UTC - $75.434,60
    { x: 78, y: 90 }, // 03:00 UTC - $75.890,30
    { x: 99, y: 112 }, // 04:00 UTC - $75.755,41
    { x: 120, y: 115 }, // 05:00 UTC - $75.739,91
    { x: 141, y: 85 }, // 06:00 UTC - $75.920,59
    { x: 162, y: 103 }, // 07:00 UTC - $75.810,85
    { x: 183, y: 135 }, // 08:00 UTC - $75.619,94
    { x: 204, y: 114 }, // 09:00 UTC - $75.746,58
    { x: 226, y: 78 }, // 10:00 UTC - $75.966,47
    { x: 247, y: 98 }, // 11:00 UTC - $75.839,76
    { x: 268, y: 35 }, // 12:00 UTC - $76.224,87 (High)
    { x: 289, y: 113 }, // 13:00 UTC - $75.750,48
    { x: 310, y: 156 }, // 14:00 UTC - $75.488,81
    { x: 331, y: 134 }, // 15:00 UTC - $75.625,24
    { x: 352, y: 119 }, // 16:00 UTC - $75.717,26
    { x: 373, y: 124 }, // 17:00 UTC - $75.680,80
    { x: 394, y: 46 }, // 18:00 UTC - $76.159,37
    { x: 415, y: 159 }, // 19:00 UTC - $75.470,11 (Live Last Point)
  ],

  expiryX = 440,
  rangeTabs = ["14 Hari", "30 Hari", "90 Hari", "Semua"],
  onRangeChange,
}) {
  const [activeRange, setActiveRange] = useState(0);

  // Perhitungan persentase perubahan dari Strike (00:00 UTC) ke Live
  const drift = strikePrice
    ? ((livePrice - strikePrice) / strikePrice) * 100
    : 0;
  const isPositive = drift >= 0;

  // Garis putus-putus acuan strike diambil langsung dari titik x=15 (y=140)
  const strikeY = historicalPoints[0]?.y ?? 140;
  const referenceCloseX = historicalPoints[0]?.x ?? 15;

  const handleTabClick = (index) => {
    setActiveRange(index);
    if (onRangeChange) onRangeChange(rangeTabs[index], index);
  };

  return (
    <div className="w-full bg-[#111722] border border-[#232e40] rounded-xl p-4 pb-1 text-[#e8edf5]">
      {/* Top Section / Header */}
      <div className="flex justify-between items-start mb-3.5">
        <div>
          <h2 className="text-[13.5px] font-semibold leading-snug">
            Closing berikutnya vs closing terakhir
          </h2>
          <span className="block text-[11px] text-[#7c8aa0] font-normal mt-0.5">
            Resolusi: closing harian BTC-USD (UTC 00:00)
          </span>
        </div>
        <div className="flex flex-col items-center bg-[#161e2c] border border-[#232e40] rounded-lg px-2.5 py-1.5 shrink-0">
          <span className="font-mono text-xs font-bold text-[#e8a33d]">
            {formatCountdown(secondsLeft)}
          </span>
          <span className="text-[8.5px] text-[#7c8aa0] tracking-wider mt-0.5">
            JAM:MENIT
          </span>
        </div>
      </div>

      {/* Price Summary */}
      <div className="flex gap-5.5 mb-2.5">
        <div>
          <div className="text-[11px] text-[#7c8aa0] mb-1">
            Closing Sebelumnya (00:00 UTC)
          </div>
          <div className="font-mono text-xl font-bold">
            {formatUSD(strikePrice)}
          </div>
        </div>
        <div>
          <div className="text-[11px] text-[#7c8aa0] mb-1">
            Harga Terkini (19:00 UTC)
          </div>
          <div className="font-mono text-xl font-bold flex items-center gap-1.5">
            <span
              className={`text-xs ${isPositive ? "text-[#33c17f]" : "text-[#ef5a6f]"}`}
            >
              {isPositive ? "▲" : "▼"}
            </span>
            {formatUSD(livePrice)}
          </div>
          <div
            className={`inline-block font-mono text-[10.5px] px-1.75 py-0.5 rounded-md mt-1 ${
              isPositive
                ? "text-[#33c17f] bg-[#33c17f]/10"
                : "text-[#ef5a6f] bg-[#ef5a6f]/10"
            }`}
          >
            {isPositive ? "+" : ""}
            {drift.toFixed(2)}% dari acuan
          </div>
        </div>
      </div>

      {/* SVG Chart */}
      <PriceChart
        historicalPoints={historicalPoints}
        strikePrice={strikePrice}
        strikeY={strikeY}
        expiryX={expiryX}
        referenceCloseX={referenceCloseX}
        secondsLeft={secondsLeft}
      />
    </div>
  );
}
