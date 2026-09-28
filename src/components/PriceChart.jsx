import React from "react";
import {
  formatUSD,
  formatCountdown,
  pointsToString,
} from "../utils/formatters";

export default function PriceChart({
  historicalPoints = [],
  strikePrice = 75584.17,
  expiryX = 440,
  secondsLeft = 0,
}) {
  const firstPricePoint = historicalPoints[0] || { x: 15, y: 140 };
  const lastPricePoint = historicalPoints[historicalPoints.length - 1] || {
    x: 415,
    y: 159,
  };

  const strikeY = firstPricePoint.y;
  const referenceCloseX = firstPricePoint.x;

  return (
    <div className="mt-1.5 -mx-1">
      <svg viewBox="0 0 480 200" className="block w-full h-auto">
        {/* Grid Lines */}
        <line
          x1="0"
          y1="40"
          x2="480"
          y2="40"
          className="stroke-[#1c2637]"
          strokeWidth="1"
        />
        <line
          x1="0"
          y1="80"
          x2="480"
          y2="80"
          className="stroke-[#1c2637]"
          strokeWidth="1"
        />
        <line
          x1="0"
          y1="120"
          x2="480"
          y2="120"
          className="stroke-[#1c2637]"
          strokeWidth="1"
        />
        <line
          x1="0"
          y1="160"
          x2="480"
          y2="160"
          className="stroke-[#1c2637]"
          strokeWidth="1"
        />

        {/* Polylines data historis */}
        <polyline
          fill="none"
          stroke="#3a4a63"
          strokeWidth="1.6"
          points={pointsToString(historicalPoints)}
        />

        {/* Garis Strike / Closing Acuan */}
        <line
          x1="0"
          y1={strikeY}
          x2="480"
          y2={strikeY}
          stroke="#7c8aa0"
          strokeWidth="1"
          strokeDasharray="4,3"
        />
        <text
          x="6"
          y={strikeY - 6}
          fontSize="8.5"
          className="font-mono fill-[#7c8aa0]"
        >
          Strike — closing acuan {formatUSD(strikePrice)}
        </text>

        {/* Garis Expiry / Target Waktu */}
        <line
          x1={expiryX}
          y1="10"
          x2={expiryX}
          y2="192"
          stroke="#e8a33d"
          strokeWidth="1.3"
          strokeDasharray="3,3"
        />
        <text
          x={expiryX - 48}
          y="10"
          fontSize="8.5"
          className="font-mono fill-[#e8a33d]"
        >
          Expiry {formatCountdown(secondsLeft)} lagi
        </text>

        {/* Titik awal & titik akhir live */}
        <circle
          cx={firstPricePoint.x}
          cy={firstPricePoint.y}
          r="3.5"
          fill="#7c8aa0"
        />
        <circle
          cx={lastPricePoint.x}
          cy={lastPricePoint.y}
          r="4"
          fill="#e8a33d"
        />

        {/* Badge Target */}
        <g transform={`translate(${expiryX + 15},${strikeY})`}>
          <rect x="-24" y="-9" width="48" height="18" rx="9" fill="#7c8aa0" />
          <text
            x="0"
            y="4"
            textAnchor="middle"
            fontSize="9"
            fontWeight="700"
            className="font-mono fill-[#0a0e14]"
          >
            TARGET
          </text>
        </g>

        {/* Garis vertikal acuan awal */}
        <text
          x={referenceCloseX}
          y="192"
          textAnchor="middle"
          fontSize="8.5"
          className="font-mono fill-[#7c8aa0]"
        >
          closing terakhir
        </text>
        <line
          x1={referenceCloseX}
          y1="15"
          x2={referenceCloseX}
          y2="180"
          stroke="#3a4a63"
          strokeWidth="1"
          strokeDasharray="2,2"
        />
      </svg>
    </div>
  );
}
