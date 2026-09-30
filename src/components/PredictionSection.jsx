import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowUp, ArrowDown } from "lucide-react";
import Tabs from "../components/ui/Tabs";

export default function PredictionSection() {
  const [historyData, setHistoryData] = useState([]);
  const [latestPrediction, setLatestPrediction] = useState(null);
  const [loading, setLoading] = useState(true);

  // State untuk Waktu & Countdown Realtime
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [targetTime, setTargetTime] = useState(null);
  const [acuanTime, setAcuanTime] = useState(null);

  useEffect(() => {
    // 1. Tentukan Waktu Closing Berikutnya (Pukul 07:00 WIB)
    const now = new Date();
    const target = new Date();
    target.setHours(7, 0, 0, 0);

    // Jika waktu saat ini sudah lewat jam 07:00 WIB, target bergeser ke jam 07:00 WIB besok
    if (now.getHours() >= 7) {
      target.setDate(target.getDate() + 1);
    }

    // Waktu acuan adalah jam 07:00 WIB sehari sebelum waktu target
    const acuan = new Date(target);
    acuan.setDate(acuan.getDate() - 1);

    setTargetTime(target);
    setAcuanTime(acuan);

    // 2. Interval Hitung Mundur Realtime
    const calculateTimeLeft = () => {
      const difference = target.getTime() - Date.now();

      if (difference > 0) {
        setTimeLeft({
          hours: Math.floor(difference / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      } else {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    Promise.all([
      fetch("/prediction_result.json").then((res) => {
        if (!res.ok) throw new Error("Gagal mengambil prediction_result.json");
        return res.json();
      }),
      fetch("/prediction_history.json").then((res) => {
        if (!res.ok) throw new Error("Gagal mengambil prediction_history.json");
        return res.json();
      }),
    ])
      .then(([latestRes, historyRes]) => {
        if (latestRes.status === "success" && latestRes.data) {
          setLatestPrediction(latestRes.data);
        }
        setHistoryData(historyRes || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Gagal mengambil data dari folder public:", err);
        setLoading(false);
      });
  }, []);

  // Formatter Tanggal WIB
  const formatDateWIB = (dateObj) => {
    if (!dateObj || isNaN(dateObj.getTime())) return "-";
    const formatted = new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Jakarta",
    }).format(dateObj);

    return `${formatted.replace(".", ":")} WIB`;
  };

  const formatCurrency = (val) =>
    val !== undefined && val !== null
      ? `$${val.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`
      : "-";

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="text-slate-500 font-medium">Memuat dashboard...</p>
      </div>
    );
  }

  const isUp =
    latestPrediction?.direction === "up" ||
    latestPrediction?.prediction_direction === "up";

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-12">
        <div className="md:col-span-7 bg-[#eef7f2] p-6 flex flex-col justify-between">
          <div>
            <p className="text-sm text-slate-600 mb-3">
              Model memprediksi closing berikutnya akan
            </p>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-[#10b981] flex items-center justify-center text-white">
                {isUp ? (
                  <ArrowUp className="w-6 h-6 stroke-[2.5]" />
                ) : (
                  <ArrowDown className="w-6 h-6 stroke-[2.5]" />
                )}
              </div>
              <span className="text-4xl font-extrabold text-[#065f46]">
                {isUp ? "Naik" : "Turun"}
              </span>
            </div>
          </div>

          <div className="bg-white/80 rounded-xl p-4 backdrop-blur-sm border border-emerald-100/50">
            <p className="text-xs text-slate-500 mb-1">
              Dibanding closing acuan :
              <span className="font-semibold text-slate-700 ml-1">
                {formatDateWIB(acuanTime)}
              </span>
            </p>
            <p className="text-2xl font-bold text-slate-800">
              {latestPrediction?.previous_close
                ? formatCurrency(latestPrediction.previous_close)
                : "$77,490.12"}
            </p>
          </div>
        </div>

        <div className="md:col-span-5 p-6 flex flex-col justify-between bg-white border-t md:border-t-0 md:border-l border-slate-100">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-slate-500">
                Closing berikutnya :
                <span className="font-semibold text-slate-700 ml-1">
                  {formatDateWIB(targetTime)}
                </span>
              </span>
            </div>
            <div className="text-3xl font-bold text-slate-300 tracking-wider mb-2">
              $ —
            </div>
            <p className="text-[14px] text-slate-400 leading-relaxed mb-6">
              Harga closing belum ada. Kolom ini terisi otomatis saat waktu
              closing tercapai.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <p className="text-xs text-slate-500 mb-1">
              Closing berikutnya terjadi dalam
            </p>
            <p className="text-2xl font-extrabold text-slate-800 mb-1">
              {timeLeft.hours} jam {timeLeft.minutes} menit
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
