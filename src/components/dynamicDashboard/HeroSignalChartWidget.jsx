import { useState, useEffect } from "react";
import { ArrowDown, ArrowUp, Clock, Info, LineChart } from "lucide-react";

export default function HeroSignalChartWidget() {
  const [signalData] = useState({
    pair: "BTC/USDT",
    direction: "BEARISH",
    confidence: 63,
    lastClose: 93240,
    livePrice: 94150,
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

  // 36 data points simulating realistic 24-hour Bitcoin price action ($92,800 to $94,910)
  const pricePoints = [
    { x: 45, y: 138, price: 92800, vol: 12 },
    { x: 55, y: 130, price: 93000, vol: 18 },
    { x: 65, y: 134, price: 92900, vol: 10 },
    { x: 75, y: 122, price: 93200, vol: 22 },
    { x: 85, y: 126, price: 93100, vol: 15 },
    { x: 95, y: 142, price: 92700, vol: 28 },
    { x: 105, y: 148, price: 92550, vol: 32 },
    { x: 115, y: 154, price: 92400, vol: 35 },
    { x: 125, y: 146, price: 92600, vol: 14 },
    { x: 140, y: 120, price: 93240, vol: 20 },
    { x: 150, y: 114, price: 93380, vol: 16 },
    { x: 160, y: 124, price: 93150, vol: 12 },
    { x: 170, y: 110, price: 93500, vol: 25 },
    { x: 180, y: 97, price: 93820, vol: 30 },
    { x: 190, y: 106, price: 93600, vol: 19 },
    { x: 200, y: 92, price: 93950, vol: 24 },
    { x: 210, y: 86, price: 94100, vol: 27 },
    { x: 220, y: 96, price: 93850, vol: 15 },
    { x: 230, y: 82, price: 94200, vol: 33 },
    { x: 240, y: 72, price: 94450, vol: 38 },
    { x: 250, y: 79, price: 94280, vol: 21 },
    { x: 260, y: 66, price: 94600, vol: 40 },
    { x: 270, y: 76, price: 94350, vol: 18 },
    { x: 280, y: 69, price: 94520, vol: 26 },
    { x: 290, y: 83, price: 94180, vol: 17 },
    { x: 300, y: 74, price: 94390, vol: 22 },
    { x: 310, y: 62, price: 94700, vol: 36 },
    { x: 320, y: 71, price: 94480, vol: 20 },
    { x: 330, y: 56, price: 94850, vol: 42 },
    { x: 340, y: 65, price: 94620, vol: 29 },
    { x: 350, y: 53, price: 94910, vol: 45 },
    { x: 360, y: 60, price: 94750, vol: 31 },
    { x: 370, y: 74, price: 94400, vol: 24 },
    { x: 380, y: 84, price: 94150, vol: 37 },
  ];

  const linePoints = pricePoints.map((p) => `${p.x},${p.y}`).join(" ");
  const areaPoints = `${pricePoints[0].x},190 ${linePoints} ${pricePoints[pricePoints.length - 1].x},190`;

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-5 md:p-6 text-slate-800 shadow-sm space-y-5">
      {/* ===== SECTION 1: SIGNAL HEADER ===== */}
      <div className="flex justify-between items-start">
        <div>
          <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5 mb-1">
            <LineChart className="w-3.5 h-3.5 text-blue-600" />
            <span>Sinyal Utama &amp; Visualisasi Siklus (Hero Combined)</span>
          </div>
          <div
            className={`text-2xl md:text-3xl font-black flex items-center gap-2 ${
              isBear ? "text-rose-600" : "text-emerald-600"
            }`}
          >
            <span className="text-2xl">
              {isBear ? (
                <ArrowDown className="w-7 h-7 stroke-[3]" />
              ) : (
                <ArrowUp className="w-7 h-7 stroke-[3]" />
              )}
            </span>
            {signalData.direction}
          </div>
        </div>

        <div className="text-right">
          <div
            className={`font-mono text-xs md:text-sm font-bold px-3 py-1.5 rounded-full inline-block ${
              isBear
                ? "bg-rose-50 text-rose-600 border border-rose-200"
                : "bg-emerald-50 text-emerald-600 border border-emerald-200"
            }`}
          >
            Confidence {signalData.confidence}%
          </div>
          <div className="text-[11px] text-slate-500 mt-1.5 font-mono flex items-center justify-end gap-1">
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-amber-600 font-bold">
              {String(timeLeft.h).padStart(2, "0")}j{" "}
              {String(timeLeft.m).padStart(2, "0")}m{" "}
              {String(timeLeft.s).padStart(2, "0")}s
            </span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div>
        <div className="flex justify-between text-[11px] text-slate-500 mb-1">
          <span>Keyakinan Model (Probability)</span>
          <span className="font-mono text-slate-700 font-semibold">
            predict_proba: {signalData.proba}
          </span>
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

      {/* ===== SECTION 2: HIGH-DENSITY REALISTIC SVG CHART ===== */}
      <div className="relative w-full overflow-hidden rounded-2xl border border-slate-200 bg-[#0d1117] p-2 sm:p-3 shadow-inner">
        <svg viewBox="0 0 520 230" className="w-full h-auto">
          <defs>
            <linearGradient id="heroPriceAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="heroBearZoneGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f2b84b" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#f2b84b" stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {/* Y-Axis Horizontal Gridlines & Price Scale Labels */}
          <g stroke="#232d3b" strokeWidth="1" strokeDasharray="3,3">
            <line x1="45" y1="35" x2="480" y2="35" />
            <line x1="45" y1="75" x2="480" y2="75" />
            <line x1="45" y1="115" x2="480" y2="115" />
            <line x1="45" y1="155" x2="480" y2="155" />
            <line x1="45" y1="190" x2="480" y2="190" />
          </g>

          <g fill="#8695a7" fontSize="9" fontFamily="monospace">
            <text x="5" y="38">
              $95,500
            </text>
            <text x="5" y="78">
              $94,500
            </text>
            <text x="5" y="118">
              $93,500
            </text>
            <text x="5" y="158">
              $92,500
            </text>
            <text x="5" y="193">
              $91,500
            </text>
          </g>

          {/* X-Axis Time Labels & Vertical Gridlines */}
          <g stroke="#1d2633" strokeWidth="1">
            <line x1="45" y1="35" x2="45" y2="190" />
            <line x1="140" y1="35" x2="140" y2="190" />
            <line x1="235" y1="35" x2="235" y2="190" />
            <line x1="330" y1="35" x2="330" y2="190" />
            <line
              x1="425"
              y1="35"
              x2="425"
              y2="190"
              stroke="#f2b84b"
              strokeDasharray="3,3"
            />
          </g>

          <g
            fill="#8695a7"
            fontSize="8.5"
            fontFamily="monospace"
            textAnchor="middle"
          >
            <text x="45" y="203">
              07:00 (Kemarin)
            </text>
            <text x="140" y="203">
              13:00
            </text>
            <text x="235" y="203">
              19:00
            </text>
            <text x="330" y="203">
              01:00
            </text>
            <text x="425" y="203" fill="#f2b84b" fontWeight="bold">
              07:00 WIB (Target)
            </text>
          </g>

          {/* Volume Histogram Bars */}
          <g>
            {pricePoints.map((p, i) => (
              <rect
                key={i}
                x={p.x - 2}
                y={222 - p.vol * 0.7}
                width="4"
                height={p.vol * 0.7}
                fill={i % 2 === 0 ? "#3ecf8e" : "#ff6b6b"}
                opacity="0.3"
                rx="1"
              />
            ))}
          </g>

          {/* SIKLUS SEBELUMNYA */}
          <line
            x1="45"
            y1="128"
            x2="115"
            y2="128"
            stroke="#8695a7"
            strokeWidth="1"
            strokeDasharray="3,2"
          />
          <text
            x="48"
            y="123"
            fill="#8695a7"
            fontSize="8"
            fontFamily="monospace"
          >
            Strike Lama: $93,050
          </text>
          <line
            x1="115"
            y1="128"
            x2="115"
            y2="175"
            stroke="#3ecf8e"
            strokeWidth="2"
          />
          <circle cx="115" cy="154" r="4" fill="#3ecf8e" />
          <text
            x="65"
            y="172"
            fill="#3ecf8e"
            fontSize="8.5"
            fontFamily="monospace"
            fontWeight="bold"
          >
            ✓ Hit (Menabrak)
          </text>

          {/* SIKLUS SAAT INI */}
          <line
            x1="140"
            y1="120"
            x2="480"
            y2="120"
            stroke="#e6ecf3"
            strokeWidth="1.2"
            strokeDasharray="4,3"
          />
          <rect
            x="142"
            y="108"
            width="95"
            height="15"
            rx="3"
            fill="#171f2b"
            stroke="#e6ecf3"
            strokeWidth="0.8"
          />
          <text
            x="146"
            y="119"
            fill="#e6ecf3"
            fontSize="8.5"
            fontFamily="monospace"
            fontWeight="bold"
          >
            Strike Acuan: $93,240
          </text>

          {/* Bearish Expiry Zone */}
          <polygon
            points="140,120 425,120 425,185 140,185"
            fill="url(#heroBearZoneGrad)"
          />
          <line
            x1="425"
            y1="120"
            x2="425"
            y2="185"
            stroke="#f2b84b"
            strokeWidth="2.2"
          />
          <text
            x="430"
            y="135"
            fill="#f2b84b"
            fontSize="8"
            fontFamily="monospace"
            fontWeight="bold"
          >
            Garis Expiry (BEARISH)
          </text>

          {/* Area Fill Under Price Curve */}
          <polygon points={areaPoints} fill="url(#heroPriceAreaGrad)" />

          {/* Smooth High-Density Price Line */}
          <polyline
            points={linePoints}
            fill="none"
            stroke="#5b8def"
            strokeWidth="2.2"
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          {/* Micro Dots */}
          <g fill="#5b8def">
            {pricePoints.map((p, i) => (
              <circle key={i} cx={p.x} cy={p.y} r="1.8" />
            ))}
          </g>

          {/* Live Price Point */}
          {/* <circle
            cx="380"
            cy="84"
            r="8"
            fill="#f2b84b"
            opacity="0.2"
            className="animate-ping"
          /> */}
          <circle
            cx="380"
            cy="84"
            r="4.5"
            fill="#f2b84b"
            stroke="#ffffff"
            strokeWidth="1.5"
          />
          <rect x="340" y="62" width="80" height="16" rx="4" fill="#f2b84b" />
          <text
            x="344"
            y="73"
            fill="#0d1117"
            fontSize="8.5"
            fontFamily="monospace"
            fontWeight="bold"
          >
            Live: $94,150
          </text>
        </svg>
      </div>

      {/* Legend & Footnote */}
      <div className="space-y-2">
        <div className="flex flex-wrap gap-4 text-[10px] text-slate-500 font-medium">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-1 rounded bg-blue-500 inline-block"></span>
            <span>Micro-price action BTC 24 jam</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-0.5 border-b border-dashed border-slate-700 inline-block"></span>
            <span>Strike Acuan ($93,240)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1 rounded bg-amber-500 inline-block"></span>
            <span>Expiry Berarah (BEARISH)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
            <span>Hit (Benar)</span>
          </div>
        </div>

        <div className="text-[10.5px] text-slate-500 leading-relaxed flex items-start gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-200">
          <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <b className="text-slate-800">
              Hero Combined (High-Density Option A):
            </b>{" "}
            Menampilkan sinyal utama eksekutif beserta grafik pergerakan harga
            Bitcoin 24 jam yang realistis dengan sumbu Y skala harga, sumbu X
            jam/tanggal, volume trading, dan indikator *expiry* Hybrid v2.
          </div>
        </div>
      </div>
    </div>
  );
}
