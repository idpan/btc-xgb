import { useState } from "react";

export default function BreakdownPageLayout({
  // Header tabel
  columns = [],
  // Data mentah untuk baris tabel
  data = [],
  // Fungsi render untuk custom row (opsional)
  renderRow,
  // Teks / nilai di baris pertama (base row)
  baseRow,
  // Baris footer tabel (total)
  footer,
  // Langkah-langkah perhitungan di panel samping
  steps = [],
  // Judul panel kanan
  sidebarTitle = "Perhitungan",
  className = "",
}) {
  const [kartuTerbuka, setKartuTerbuka] = useState(true);

  return (
    <div className={`mx-auto w-full max-w-6xl p-4 text-gray-900 ${className}`}>
      <div className="grid gap-4 lg:grid-cols-[7fr_3fr] lg:items-start">
        {/* ---------- Panel Kanan (Sticky Summary / Steps) ---------- */}
        <aside className="order-first rounded-lg border border-gray-300 bg-white lg:order-last lg:sticky lg:top-4">
          <button
            onClick={() => setKartuTerbuka((b) => !b)}
            aria-expanded={kartuTerbuka}
            className="flex w-full items-center justify-between px-4 py-3 text-left lg:pointer-events-none"
          >
            <span className="font-semibold">{sidebarTitle}</span>
            <span className="text-sm text-gray-500 lg:hidden">
              {kartuTerbuka ? "Tutup" : "Buka"}
            </span>
          </button>

          <div
            className={`${kartuTerbuka ? "block" : "hidden"} px-4 pb-4 lg:block`}
          >
            <ol className="relative space-y-3 before:absolute before:left-3 before:top-3 before:h-[calc(100%-1.5rem)] before:w-px before:bg-gray-300">
              {steps.map((step, idx) => (
                <li key={idx} className="relative pl-9">
                  <span className="absolute left-0 top-0 flex h-6 w-6 items-center justify-center rounded-full bg-gray-900 text-xs font-semibold text-white">
                    {idx + 1}
                  </span>
                  <div
                    className={`rounded-md px-2 py-1 transition-colors ${step.sorot ? "bg-amber-100" : ""}`}
                  >
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-sm text-gray-600">
                        {step.judul}
                      </span>
                      <span className="tabular-nums text-base font-semibold">
                        {step.nilai}
                      </span>
                    </div>
                    {step.catatan && (
                      <p className="mt-0.5 text-xs text-gray-500">
                        {step.catatan}
                      </p>
                    )}
                    {step.content}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </aside>

        {/* ---------- Panel Kiri (Tabel Data Main) ---------- */}
        <div className="max-h-[75vh] overflow-auto rounded-lg border border-gray-300 bg-white">
          <table className="w-full min-w-[520px] border-collapse text-sm">
            <thead className="sticky top-0 z-10 bg-[#4e73df] text-white uppercase text-xs font-bold tracking-wider">
              <tr>
                {columns.map((col, idx) => (
                  <th
                    key={idx}
                    colSpan={col.colSpan || 1}
                    className={`px-3 py-3 border-r border-blue-400/40 last:border-r-0 ${col.className || "text-left"}`}
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {/* Optional Base / Initial Row */}
              {baseRow && (
                <tr className="border-t border-gray-200 bg-gray-50">
                  <td
                    className="px-3 py-2 text-gray-500"
                    colSpan={baseRow.labelColSpan || 3}
                  >
                    {baseRow.label}
                  </td>
                  <td className="px-3 py-2 text-right tabular-nums">
                    {baseRow.value}
                  </td>
                  {baseRow.extraColSpan && (
                    <td colSpan={baseRow.extraColSpan} />
                  )}
                </tr>
              )}

              {/* Dynamic Rows */}
              {data.map((item, index) => renderRow(item, index))}
            </tbody>

            {/* Optional Footer Row */}
            {footer && (
              <tfoot className="sticky bottom-0 z-10 bg-gray-900 text-white">
                <tr>
                  <td
                    colSpan={footer.labelColSpan || 3}
                    className="px-3 py-3 font-semibold"
                  >
                    {footer.label}
                  </td>
                  <td className="px-3 py-3 text-right tabular-nums font-semibold">
                    {footer.value}
                  </td>
                  {footer.extraColSpan && <td colSpan={footer.extraColSpan} />}
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
}
