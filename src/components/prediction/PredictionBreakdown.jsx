import React, { useState, useEffect } from "react";
import { ArrowUp, ArrowDown, CheckCircle2, AlertTriangle } from "lucide-react";

export default function PredictionSection({
  referenceClosingPrice,
  direction = "up",
  nextClosingPrice = null,
  nextClosingDate = null,
  referenceClosingDate = null,
  isCorrect = null,
}) {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0 });
  const [computedTarget, setComputedTarget] = useState(null);
  const [computedAcuan, setComputedAcuan] = useState(null);

  useEffect(() => {
    const target = nextClosingDate
      ? new Date(nextClosingDate)
      : (() => {
          const t = new Date();
          t.setHours(7, 0, 0, 0);
          if (new Date().getHours() >= 7) t.setDate(t.getDate() + 1);
          return t;
        })();

    const acuan = referenceClosingDate
      ? new Date(referenceClosingDate)
      : (() => {
          const a = new Date(target);
          a.setDate(a.getDate() - 1);
          return a;
        })();

    setComputedTarget(target);
    setComputedAcuan(acuan);

    const calculateTimeLeft = () => {
      const difference = target.getTime() - Date.now();
      if (difference > 0) {
        setTimeLeft({
          hours: Math.floor(difference / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        });
      } else {
        setTimeLeft({ hours: 0, minutes: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [nextClosingDate, referenceClosingDate]);

  const formatDateWIB = (dateObj) => {
    if (!dateObj || isNaN(new Date(dateObj).getTime())) return "-";
    const formatted = new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Jakarta",
    }).format(new Date(dateObj));

    return `${formatted.replace(".", ":")} WIB`;
  };

  const formatCurrency = (val) =>
    val !== undefined && val !== null
      ? `$${val.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`
      : "-";

  const isUp = direction === "up" || direction === "Naik";
  const isPending = nextClosingPrice === null || nextClosingPrice === undefined;

  let isSuccess = false;
  if (!isPending) {
    if (isCorrect !== null && isCorrect !== undefined) {
      isSuccess = isCorrect;
    } else if (referenceClosingPrice) {
      const isActualUp = nextClosingPrice > referenceClosingPrice;
      isSuccess = isUp === isActualUp;
    }
  }

  let priceDiffFormatted = "";
  let isDiffPositive = false;
  if (!isPending && referenceClosingPrice) {
    const diff = nextClosingPrice - referenceClosingPrice;
    const percent = (diff / referenceClosingPrice) * 100;
    isDiffPositive = diff >= 0;
    const sign = isDiffPositive ? "+" : "-";
    priceDiffFormatted = `${sign} $${Math.abs(diff).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} (${sign}${Math.abs(percent).toFixed(2)}%)`;
  }

  return (
    <div className="max-w-2xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-3">
        <div className="bg-white p-5 flex flex-col justify-between">
          <div>
            <div className="border-b border-neutral-100 dark:border-neutral-800 pb-3 mb-4">
              <span className="block text-[10px] uppercase tracking-wider text-neutral-400 font-medium">
                Dibanding closing acuan : {formatDateWIB(computedAcuan)}
              </span>
              <span className="text-xl font-bold tracking-tight text-neutral-900">
                {formatCurrency(referenceClosingPrice)}
              </span>
            </div>
            <p className="text-xs text-neutral-500 mb-2">
              Model memprediksi closing berikutnya akan
            </p>
          </div>

          <div
            className={`flex items-center gap-2 ${
              isUp ? "text-emerald-600" : "text-rose-600"
            }`}
          >
            <span
              className={`p-1 border ${
                isUp
                  ? "border-emerald-600/30 bg-emerald-50"
                  : "border-rose-600/30 bg-rose-50"
              }`}
            >
              {isUp ? (
                <ArrowUp className="w-5 h-5 stroke-[2]" />
              ) : (
                <ArrowDown className="w-5 h-5 stroke-[2]" />
              )}
            </span>
            <span className="text-2xl font-bold tracking-tight">
              {isUp ? "Naik" : "Turun"}
            </span>
          </div>
        </div>

        <div className="bg-white p-5 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs text-neutral-500">Closing berikutnya</span>
              <span className="text-[11px] font-semibold text-neutral-700">
                {formatDateWIB(computedTarget)}
              </span>
            </div>

            <div
              className={`my-2 ${
                isPending
                  ? "text-2xl font-light text-neutral-300"
                  : "text-2xl font-bold tracking-tight text-neutral-900"
              }`}
            >
              {isPending ? "$ —" : formatCurrency(nextClosingPrice)}
            </div>

            <p className="text-xs text-neutral-400 leading-relaxed mt-2">
              {isPending
                ? "Harga closing belum ada. Kolom ini terisi otomatis saat waktu closing tercapai."
                : isDiffPositive
                  ? "Harga closing telah tercapai dan berada di atas harga acuan."
                  : "Harga closing telah tercapai dan berada di bawah harga acuan."}
            </p>
          </div>

          <div className="mt-6 pt-3 border-t border-neutral-100">
            <span className="block text-[10px] uppercase tracking-wider text-neutral-400">
              {isPending ? "Closing berikutnya terjadi dalam" : "Pergerakan Harga Aktual"}
            </span>

            <span
              className={
                isPending
                  ? "text-lg font-semibold text-neutral-800"
                  : `text-base font-bold ${
                      isDiffPositive ? "text-emerald-600" : "text-rose-600"
                    }`
              }
            >
              {isPending
                ? `${timeLeft.hours} jam ${timeLeft.minutes} menit`
                : priceDiffFormatted}
            </span>
          </div>
        </div>
      </div>

      {!isPending && (
        <div
          className={`bg-white border p-3 text-center ${
            isSuccess
              ? "border-blue-500/40"
              : "border-amber-500/40"
          }`}
        >
          <span
            className={`text-md font-bold tracking-wider uppercase flex items-center justify-center gap-1.5 ${
              isSuccess ? "text-blue-600" : "text-amber-600"
            }`}
          >
            {isSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4 inline" />
                <span>Hasil: Prediksi Benar</span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-4 h-4 inline" />
                <span>Hasil: Prediksi Salah</span>
              </>
            )}
          </span>
        </div>
      )}
    </div>
  );
}
