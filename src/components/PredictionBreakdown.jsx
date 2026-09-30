import { useMemo, useState } from "react";

/* ---------- Utilitas Internal ---------- */
const angka = (n, digit = 4) =>
  new Intl.NumberFormat("id-ID", {
    minimumFractionDigits: digit,
    maximumFractionDigits: digit,
  }).format(n);

const bertanda = (n) => (n > 0 ? "+" : n < 0 ? "−" : "") + angka(Math.abs(n));
const sigmoid = (x) => 1 / (1 + Math.exp(-x));
const logit = (p) => Math.log(p / (1 - p));

function BarSkor({ nilai, maks }) {
  const lebar = maks ? (Math.abs(nilai) / maks) * 50 : 0;
  return (
    <div className="relative h-2 w-24 rounded bg-gray-100" aria-hidden="true">
      <div className="absolute left-1/2 top-0 h-full w-px bg-gray-400" />
      <div
        className={`absolute top-0 h-full ${
          nilai >= 0 ? "left-1/2 bg-emerald-500" : "right-1/2 bg-rose-500"
        }`}
        style={{ width: `${lebar}%` }}
      />
    </div>
  );
}

function Langkah({ no, judul, nilai, catatan, sorot, children }) {
  return (
    <li className="relative pl-9">
      <span className="absolute left-0 top-0 flex h-6 w-6 items-center justify-center rounded-full bg-gray-900 text-xs font-semibold text-white">
        {no}
      </span>
      <div
        className={`rounded-md px-2 py-1 transition-colors ${
          sorot ? "bg-amber-100" : ""
        }`}
      >
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-sm text-gray-600">{judul}</span>
          <span className="tabular-nums text-base font-semibold">{nilai}</span>
        </div>
        {catatan && <p className="mt-0.5 text-xs text-gray-500">{catatan}</p>}
        {children}
      </div>
    </li>
  );
}

/* ---------- Komponen Utama Reusable ---------- */
export default function PredictionBreakdown({
  pohon = [],
  baseScore = 0.5,
  onLihatPohon,
  judulHalaman = "Rincian Prediksi",
  customHeader = null, // Slot opsional jika ingin menyisipkan Filter Tanggal / Controller Tambahan
}) {
  const [sorotAkhir, setSorotAkhir] = useState(false);
  const [infoRumus, setInfoRumus] = useState(false);
  const [kartuTerbuka, setKartuTerbuka] = useState(true);

  const baseMargin = useMemo(() => logit(baseScore), [baseScore]);

  const { baris, totalLeaf, maks } = useMemo(() => {
    let kumulatif = baseMargin;
    let total = 0;
    let maksAbs = 0;
    const hasil = pohon.map((p) => {
      kumulatif += p.leafScore;
      total += p.leafScore;
      maksAbs = Math.max(maksAbs, Math.abs(p.leafScore));
      return { ...p, kumulatif };
    });
    return { baris: hasil, totalLeaf: total, maks: maksAbs };
  }, [pohon, baseMargin]);

  const marginAkhir = baseMargin + totalLeaf;
  const probabilitas = sigmoid(marginAkhir);
  const naik = probabilitas >= 0.5;

  return (
    <div className="mx-auto w-full max-w-6xl p-4 text-gray-900">
      {/* Header Halaman & Optional Controller (misal: Date Picker) */}
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-bold">{judulHalaman}</h1>
        {customHeader}
      </div>

      <div className="grid gap-4 lg:grid-cols-[7fr_3fr] lg:items-start">
        {/* ---------- Panel Kanan: Perhitungan Prediksi ---------- */}
        <aside className="order-first rounded-lg border border-gray-300 bg-white lg:order-last lg:sticky lg:top-4">
          <button
            onClick={() => setKartuTerbuka((b) => !b)}
            aria-expanded={kartuTerbuka}
            className="flex w-full items-center justify-between px-4 py-3 text-left lg:pointer-events-none"
          >
            <span className="font-semibold">Perhitungan prediksi</span>
            <span className="text-sm text-gray-500 lg:hidden">
              {kartuTerbuka ? "Tutup" : "Buka"}
            </span>
          </button>

          <div
            className={`${kartuTerbuka ? "block" : "hidden"} px-4 pb-4 lg:block`}
          >
            <ol className="relative space-y-3 before:absolute before:left-3 before:top-3 before:h-[calc(100%-1.5rem)] before:w-px before:bg-gray-300">
              <Langkah
                no={1}
                judul="Base margin"
                nilai={angka(baseMargin)}
                catatan={`logit dari base score ${angka(baseScore, 2)}`}
              />
              <Langkah
                no={2}
                judul={`Total leaf score (${pohon.length} pohon)`}
                nilai={bertanda(totalLeaf)}
              />
              <Langkah
                no={3}
                judul="Margin akhir (1 + 2)"
                nilai={angka(marginAkhir)}
                catatan="Sama dengan margin kumulatif di pohon terakhir."
                sorot={sorotAkhir}
              />
              <Langkah
                no={4}
                judul="Probabilitas naik (sigmoid)"
                nilai={`${angka(probabilitas * 100, 2)}%`}
              >
                <button
                  onClick={() => setInfoRumus((b) => !b)}
                  aria-expanded={infoRumus}
                  className="mt-0.5 text-xs text-blue-700 underline"
                >
                  {infoRumus ? "Sembunyikan rumus" : "Lihat rumus"}
                </button>
                {infoRumus && (
                  <p className="mt-1 rounded bg-gray-100 px-2 py-1 font-mono text-xs">
                    1 / (1 + e^(−margin))
                  </p>
                )}
              </Langkah>
              <Langkah
                no={5}
                judul="Prediksi"
                nilai={naik ? "Naik" : "Turun"}
                catatan="Naik bila probabilitas ≥ 50%."
              />
            </ol>
          </div>
        </aside>

        {/* ---------- Panel Kiri: Tabel Leaf Score ---------- */}
        <div className="max-h-[75vh] overflow-auto rounded-lg border border-gray-300 bg-white">
          <table className="w-full min-w-[520px] border-collapse text-sm">
            <thead className="sticky top-0 z-10 bg-[#4e73df] text-white uppercase text-xs font-bold tracking-wider">
              <tr>
                <th className="w-16 px-3 py-3 text-left border-r border-blue-400/40">
                  Pohon
                </th>
                <th
                  className="px-3 py-3 text-right border-r border-blue-400/40"
                  colSpan={2}
                >
                  Leaf score
                </th>
                <th className="px-3 py-3 text-right border-r border-blue-400/40">
                  Margin kumulatif
                </th>
                <th className="w-16 px-3 py-3 text-right opacity-80 border-r border-blue-400/40">
                  Leaf
                </th>
                <th className="w-24 px-3 py-3" />
              </tr>
            </thead>

            <tbody>
              <tr className="border-t border-gray-200 bg-gray-50">
                <td className="px-3 py-2 text-gray-500" colSpan={3}>
                  Base (logit base score)
                </td>
                <td className="px-3 py-2 text-right tabular-nums">
                  {angka(baseMargin)}
                </td>
                <td colSpan={2} />
              </tr>

              {baris.map((p, i) => {
                const terakhir = i === baris.length - 1;
                return (
                  <tr
                    key={p.id}
                    onMouseEnter={
                      terakhir ? () => setSorotAkhir(true) : undefined
                    }
                    onMouseLeave={
                      terakhir ? () => setSorotAkhir(false) : undefined
                    }
                    className="border-t border-gray-200 hover:bg-gray-50"
                  >
                    <td className="px-3 py-2 tabular-nums text-gray-500">
                      {p.id}
                    </td>
                    <td className="w-28 px-3 py-2">
                      <div className="flex justify-end">
                        <BarSkor nilai={p.leafScore} maks={maks} />
                      </div>
                    </td>
                    <td
                      className={`w-24 px-3 py-2 text-right tabular-nums font-semibold ${
                        p.leafScore >= 0 ? "text-emerald-700" : "text-rose-700"
                      }`}
                    >
                      {bertanda(p.leafScore)}
                    </td>
                    <td
                      className={`px-3 py-2 text-right tabular-nums ${
                        terakhir && sorotAkhir ? "bg-amber-100" : ""
                      }`}
                    >
                      {angka(p.kumulatif)}
                    </td>
                    <td className="px-3 py-2 text-right tabular-nums text-gray-400">
                      {p.leafId}
                    </td>
                    <td className="px-3 py-2 text-right">
                      {onLihatPohon && (
                        <button
                          onClick={() => onLihatPohon(p.id)}
                          className="text-xs text-blue-700 hover:underline font-medium"
                        >
                          Lihat pohon
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>

            <tfoot className="sticky bottom-0 z-10 bg-gray-900 text-white">
              <tr>
                <td colSpan={3} className="px-3 py-3 font-semibold">
                  Total leaf score
                </td>
                <td className="px-3 py-3 text-right tabular-nums font-semibold">
                  {bertanda(totalLeaf)}
                </td>
                <td colSpan={2} />
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
