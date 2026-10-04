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
  // State lokal khusus untuk kalkulasi countdown realtime
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0 });
  const [computedTarget, setComputedTarget] = useState(null);
  const [computedAcuan, setComputedAcuan] = useState(null);

  // Kalkulasi/Format Waktu Target & Acuan
  useEffect(() => {
    // Tentukan waktu target (dari prop atau default 07:00 WIB berikutnya)
    const target = nextClosingDate
      ? new Date(nextClosingDate)
      : (() => {
          const t = new Date();
          t.setHours(7, 0, 0, 0);
          if (new Date().getHours() >= 7) t.setDate(t.getDate() + 1);
          return t;
        })();

    // Tentukan waktu acuan (dari prop atau default 1 hari sebelum target)
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

  // Formatters Helper
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

  // ==========================================
  // EVALUASI LOGIKA TAMPILAN BERBASIS PROPS
  // ==========================================

  // 1. Arah Prediksi (Naik / Turun)
  const isUp = direction === "up" || direction === "Naik";

  // 2. Status Pending vs Selesai
  // Otomatis berubah dari true -> false jika parent memperbarui nextClosingPrice dari null ke number
  const isPending = nextClosingPrice === null || nextClosingPrice === undefined;

  // 3. Status Prediksi Benar vs Salah
  let isSuccess = false;
  if (!isPending) {
    if (isCorrect !== null && isCorrect !== undefined) {
      isSuccess = isCorrect;
    } else if (referenceClosingPrice) {
      const isActualUp = nextClosingPrice > referenceClosingPrice;
      isSuccess = isUp === isActualUp;
    }
  }

  // 4. Kalkulasi Selisih Harga & Persentase
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
    <>
      <div className="max-w-2xl">
        {/* GRID 2 PANEL */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-3">
          {/* PANEL KIRI: PREDIKSI MODEL */}
          <div className=" bg-white p-5 flex flex-col justify-between">
            <div>
              <div className="border-b border-neutral-100 dark:border-neutral-800 pb-3 mb-4">
                <span className="block text-[10px] uppercase tracking-wider text-neutral-400 dark:text-neutral-500 font-medium">
                  Dibanding closing acuan : {formatDateWIB(computedAcuan)}
                </span>
                <span className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
                  {formatCurrency(referenceClosingPrice)}
                </span>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-2">
                Model memprediksi closing berikutnya akan
              </p>
            </div>

            {/* Indicator Naik / Turun */}
            <div
              className={`flex items-center gap-2 ${
                isUp
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-rose-600 dark:text-rose-400"
              }`}
            >
              <span
                className={`p-1 border ${
                  isUp
                    ? "border-emerald-600/30 dark:border-emerald-400/30 bg-emerald-50 dark:bg-emerald-950/50"
                    : "border-rose-600/30 dark:border-rose-400/30 bg-rose-50 dark:bg-rose-950/50"
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

          {/* PANEL KANAN: CLOSING AKTUAL */}
          <div className=" bg-white p-5 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs text-neutral-500 dark:text-neutral-400">
                  Closing berikutnya
                </span>
                <span className="text-[11px] font-semibold text-neutral-700 dark:text-neutral-300">
                  {formatDateWIB(computedTarget)}
                </span>
              </div>

              {/* Target Price ($ — vs $79,250.00) */}
              <div
                className={`my-2 ${
                  isPending
                    ? "text-2xl font-light text-neutral-300 dark:text-neutral-700"
                    : "text-2xl font-bold tracking-tight text-neutral-900 dark:text-white"
                }`}
              >
                {isPending ? "$ —" : formatCurrency(nextClosingPrice)}
              </div>

              {/* Sub-text Deskripsi */}
              <p className="text-xs text-neutral-400 dark:text-neutral-500 leading-relaxed mt-2">
                {isPending
                  ? "Harga closing belum ada. Kolom ini terisi otomatis saat waktu closing tercapai."
                  : isDiffPositive
                    ? "Harga closing telah tercapai dan berada di atas harga acuan."
                    : "Harga closing telah tercapai dan berada di bawah harga acuan."}
              </p>
            </div>

            {/* Stat Footer / Countdown */}
            <div className="mt-6 pt-3 border-t border-neutral-100 dark:border-neutral-800">
              <span className="block text-[10px] uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                {isPending
                  ? "Closing berikutnya terjadi dalam"
                  : "Pergerakan Harga Aktual"}
              </span>

              <span
                className={
                  isPending
                    ? "text-lg font-semibold text-neutral-800 dark:text-neutral-200"
                    : `text-base font-bold ${
                        isDiffPositive
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-rose-600 dark:text-rose-400"
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

        {/* BANNER HASIL (Tampil saat isPending = false) */}
        {!isPending && (
          <div
            className={`bg-white dark:bg-neutral-900 border p-3 text-center ${
              isSuccess
                ? "border-blue-500/40 dark:border-blue-500/30"
                : "border-amber-500/40 dark:border-amber-500/30"
            }`}
          >
            <span
              className={`text-md font-bold tracking-wider uppercase flex items-center justify-center gap-1.5 ${
                isSuccess
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-amber-600 dark:text-amber-400"
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
    </>
  );
}
