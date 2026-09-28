import { useEffect, useRef, useState } from "react";
import { createChart, ColorType, LineStyle } from "lightweight-charts";
import { Info, CandlestickChart, LineChart } from "lucide-react";

// Helper untuk mengubah string tanggal lokal ke Unix Timestamp (dalam detik)
const parseTimestamp = (dateStr) => {
  return Math.floor(new Date(dateStr.replace(" ", "T")).getTime() / 1000);
};

// Format data dengan timestamp yang valid
const rawMockData = [
  {
    time: "2026-09-13 07:00",
    open: 92800,
    high: 93100,
    low: 92600,
    close: 93000,
    value: 93000,
  },
  {
    time: "2026-09-13 08:00",
    open: 93000,
    high: 93300,
    low: 92850,
    close: 92900,
    value: 92900,
  },
  {
    time: "2026-09-13 09:00",
    open: 92900,
    high: 93400,
    low: 92800,
    close: 93200,
    value: 93200,
  },
  {
    time: "2026-09-13 10:00",
    open: 93200,
    high: 93350,
    low: 92950,
    close: 93100,
    value: 93100,
  },
  {
    time: "2026-09-13 11:00",
    open: 93100,
    high: 93200,
    low: 92500,
    close: 92700,
    value: 92700,
  },
  {
    time: "2026-09-13 12:00",
    open: 92700,
    high: 92800,
    low: 92350,
    close: 92400,
    value: 92400,
  },
  {
    time: "2026-09-13 13:00",
    open: 92400,
    high: 93400,
    low: 92400,
    close: 93240,
    value: 93240,
  },
  {
    time: "2026-09-13 14:00",
    open: 93240,
    high: 93500,
    low: 93100,
    close: 93380,
    value: 93380,
  },
  {
    time: "2026-09-13 15:00",
    open: 93380,
    high: 93450,
    low: 93000,
    close: 93150,
    value: 93150,
  },
  {
    time: "2026-09-13 16:00",
    open: 93150,
    high: 93600,
    low: 93050,
    close: 93500,
    value: 93500,
  },
  {
    time: "2026-09-13 17:00",
    open: 93500,
    high: 93900,
    low: 93400,
    close: 93820,
    value: 93820,
  },
  {
    time: "2026-09-13 18:00",
    open: 93820,
    high: 93850,
    low: 93500,
    close: 93600,
    value: 93600,
  },
  {
    time: "2026-09-13 19:00",
    open: 93600,
    high: 94100,
    low: 93550,
    close: 93950,
    value: 93950,
  },
  {
    time: "2026-09-13 20:00",
    open: 93950,
    high: 94250,
    low: 93850,
    close: 94100,
    value: 94100,
  },
  {
    time: "2026-09-13 21:00",
    open: 94100,
    high: 94150,
    low: 93700,
    close: 93850,
    value: 93850,
  },
  {
    time: "2026-09-13 22:00",
    open: 93850,
    high: 94350,
    low: 93800,
    close: 94200,
    value: 94200,
  },
  {
    time: "2026-09-13 23:00",
    open: 94200,
    high: 94600,
    low: 94150,
    close: 94450,
    value: 94450,
  },
  {
    time: "2026-09-14 00:00",
    open: 94450,
    high: 94500,
    low: 94100,
    close: 94280,
    value: 94280,
  },
  {
    time: "2026-09-14 01:00",
    open: 94280,
    high: 94750,
    low: 94200,
    close: 94600,
    value: 94600,
  },
  {
    time: "2026-09-14 02:00",
    open: 94600,
    high: 94650,
    low: 94250,
    close: 94350,
    value: 94350,
  },
  {
    time: "2026-09-14 03:00",
    open: 94350,
    high: 94700,
    low: 94300,
    close: 94520,
    value: 94520,
  },
  {
    time: "2026-09-14 04:00",
    open: 94520,
    high: 94600,
    low: 94000,
    close: 94180,
    value: 94180,
  },
  {
    time: "2026-09-14 05:00",
    open: 94180,
    high: 94500,
    low: 94100,
    close: 94390,
    value: 94390,
  },
  {
    time: "2026-09-14 06:00",
    open: 94390,
    high: 94850,
    low: 94300,
    close: 94700,
    value: 94700,
  },
  {
    time: "2026-09-14 07:00",
    open: 94700,
    high: 94950,
    low: 94400,
    close: 94850,
    value: 94850,
  },
  {
    time: "2026-09-14 08:00",
    open: 94850,
    high: 94900,
    low: 94500,
    close: 94620,
    value: 94620,
  },
  {
    time: "2026-09-14 09:00",
    open: 94620,
    high: 95000,
    low: 94550,
    close: 94910,
    value: 94910,
  },
  {
    time: "2026-09-14 10:00",
    open: 94910,
    high: 94950,
    low: 94600,
    close: 94750,
    value: 94750,
  },
  {
    time: "2026-09-14 11:00",
    open: 94750,
    high: 94800,
    low: 94250,
    close: 94400,
    value: 94400,
  },
  {
    time: "2026-09-14 12:00",
    open: 94400,
    high: 94450,
    low: 94050,
    close: 94150,
    value: 94150,
  },
];

const mockChartData = rawMockData.map((item) => ({
  ...item,
  time: parseTimestamp(item.time),
}));

export default function TradingViewChartWidget() {
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const [chartType, setChartType] = useState("line");

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 320,
      layout: {
        background: { type: ColorType.Solid, color: "#0d1117" },
        textColor: "#8695a7",
        fontSize: 11,
        fontFamily: "'SF Mono', Consolas, monospace",
      },
      grid: {
        vertLines: { color: "#1b2431" },
        horzLines: { color: "#1b2431" },
      },
      crosshair: {
        mode: 1,
      },
      rightPriceScale: {
        borderColor: "#232d3b",
      },
      timeScale: {
        borderColor: "#232d3b",
        timeVisible: true,
        secondsVisible: false,
      },
    });

    chartRef.current = chart;

    let series;
    if (chartType === "candle") {
      series = chart.addCandlestickSeries({
        upColor: "#3ecf8e",
        downColor: "#ff6b6b",
        borderVisible: false,
        wickUpColor: "#3ecf8e",
        wickDownColor: "#ff6b6b",
      });
    } else {
      series = chart.addSeries({
        lineColor: "#3b82f6",
        topColor: "rgba(59, 130, 246, 0.4)",
        bottomColor: "rgba(59, 130, 246, 0.0)",
        lineWidth: 2,
      });
    }

    series.setData(mockChartData);

    // Overlay Price Lines
    series.createPriceLine({
      price: 93240,
      color: "#38bdf8",
      lineWidth: 2,
      lineStyle: LineStyle.Dashed,
      axisLabelVisible: true,
      title: "Strike Acuan ($93,240)",
    });

    series.createPriceLine({
      price: 92400,
      color: "#eab308",
      lineWidth: 1.5,
      lineStyle: LineStyle.Dotted,
      axisLabelVisible: true,
      title: "Target Expiry Bearish",
    });

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, [chartType]);

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-5 text-slate-800 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-mono text-lg font-bold text-slate-900">
              $94,150.00
            </h3>
            <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              TradingView Canvas (Opsi B)
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Chart interaktif berbasis TradingView `lightweight-charts` dengan
            crosshair &amp; overlay harga.
          </p>
        </div>

        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setChartType("line")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              chartType === "line"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <LineChart className="w-3.5 h-3.5" />
            Area Line
          </button>
          <button
            type="button"
            onClick={() => setChartType("candle")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              chartType === "candle"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <CandlestickChart className="w-3.5 h-3.5" />
            Candlestick
          </button>
        </div>
      </div>

      <div className="relative w-full rounded-2xl overflow-hidden border border-slate-200 shadow-inner">
        <div ref={chartContainerRef} className="w-full h-[320px]" />
      </div>

      <div className="text-[10.5px] text-slate-500 leading-relaxed flex items-start gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-200">
        <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <b>Opsi B — TradingView Lightweight Charts:</b> Memungkinkan pengguna
          melakukan pan/zoom interaktif, memindahkan kursor crosshair, serta
          mengalihkan antara tampilan **Area Line** dan **Candlestick (OHLC)**
          dengan overlay garis Strike Acuan ($93,240).
        </div>
      </div>
    </div>
  );
}
