import React, { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Network, ChevronRight } from "lucide-react";
import TreeViewer from "./TreeViewer";
import { bertanda } from "../utils/calculation";
export default function DecisionTree({
  pohon = [],
  judulHalaman = "Visualisasi Pohon Keputusan",
  customHeader = null,
  onSelectTree: externalOnSelectTree,
}) {
  const [searchParams, setSearchParams] = useSearchParams();

  // Baca id pohon dari URL query string (default: 1)
  const queryTreeId = parseInt(searchParams.get("treeId") || "1", 10);
  const [selectedTreeId, setSelectedTreeId] = useState(
    isNaN(queryTreeId) ? 1 : queryTreeId,
  );

  // Sinkronkan state lokal saat query param atau data pohon berubah
  useEffect(() => {
    if (
      pohon.length > 0 &&
      !isNaN(queryTreeId) &&
      queryTreeId >= 1 &&
      queryTreeId <= pohon.length
    ) {
      setSelectedTreeId(queryTreeId);
    } else if (
      pohon.length > 0 &&
      (selectedTreeId > pohon.length || selectedTreeId < 1)
    ) {
      setSelectedTreeId(1);
    }
  }, [queryTreeId, pohon.length, selectedTreeId]);

  const handleSelectTree = (id) => {
    setSelectedTreeId(id);
    setSearchParams({ treeId: String(id) });
    if (externalOnSelectTree) {
      externalOnSelectTree(id);
    }
  };

  const currentTree = useMemo(
    () => pohon.find((p) => p.id === selectedTreeId) || pohon[0],
    [pohon, selectedTreeId],
  );

  return (
    <div className="mx-auto w-full max-w-[90rem] p-4 text-slate-800">
      {/* Header Halaman & Slot Custom Filter (misal: Date Picker) */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2">
              <Network className="w-5 h-5 text-indigo-600" /> {judulHalaman}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Pilih pohon dari daftar di sebelah kiri untuk melihat strukturnya
              secara rinci.
            </p>
          </div>
          {customHeader && <div className="mt-2 sm:mt-0">{customHeader}</div>}
        </div>

        {currentTree && (
          <div className="flex items-center gap-3 bg-slate-100 rounded-lg px-3 py-1.5 text-xs">
            <span>
              Pohon Aktif:{" "}
              <strong className="text-indigo-600">#{currentTree.id}</strong>
            </span>
            <span className="text-slate-300">|</span>
            <span>
              Target Leaf:{" "}
              <strong className="font-mono">#{currentTree.leafId}</strong>
            </span>
            <span className="text-slate-300">|</span>
            <span>
              Score:{" "}
              <strong
                className={
                  currentTree.leafScore >= 0
                    ? "text-emerald-600"
                    : "text-rose-600"
                }
              >
                {bertanda(currentTree.leafScore)}
              </strong>
            </span>
          </div>
        )}
      </div>

      {/* Main Grid: Scrollable Sidebar + Area Viewer Utama */}
      <div className="grid gap-4 lg:grid-cols-12 items-start">
        {/* Sisi Kiri: Scrollable List Pohon */}
        <div className="lg:col-span-3 bg-white border border-slate-200 rounded-xl p-3 shadow-sm">
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Daftar Pohon ({pohon.length})
            </span>
            <span className="text-[11px] text-slate-400">1-based</span>
          </div>

          <div className="space-y-1.5 max-h-[calc(78vh-4rem)] overflow-y-auto pr-1">
            {pohon.map((p) => {
              const isSelected = p.id === selectedTreeId;
              return (
                <button
                  key={p.id}
                  onClick={() => handleSelectTree(p.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left text-xs transition-all ${
                    isSelected
                      ? "bg-indigo-600 text-white shadow-sm font-semibold"
                      : "bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-100"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>Pohon #{p.id}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`font-mono text-[11px] px-1.5 py-0.5 rounded ${
                        isSelected
                          ? "bg-indigo-700 text-indigo-100"
                          : p.leafScore >= 0
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-rose-50 text-rose-700 border border-rose-200"
                      }`}
                    >
                      {bertanda(p.leafScore)}
                    </span>
                    <ChevronRight
                      className={`w-3.5 h-3.5 opacity-60 ${
                        isSelected ? "text-white" : "text-slate-400"
                      }`}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Sisi Kanan: Area Tampilan Utama TreeViewer */}
        <div className="lg:col-span-9 bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          {currentTree ? (
            <TreeViewer
              treeIndex={currentTree.id - 1}
              leafId={currentTree.leafId}
              height="74vh"
            />
          ) : (
            <div className="flex items-center justify-center h-[70vh] text-slate-400 text-sm">
              Pilih pohon untuk menampilkan visualisasi.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
