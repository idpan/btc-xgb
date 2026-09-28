import { useState } from "react";
import { X, Search, RotateCcw, Eye, EyeOff, LayoutGrid } from "lucide-react";

export default function WidgetManagerModal({
  allWidgets,
  visibleWidgetIds,
  onToggleWidget,
  onShowAll,
  onHideAll,
  onResetDefault,
  onClose,
}) {
  const [search, setSearch] = useState("");

  const filteredWidgets = allWidgets.filter((w) =>
    w.title.toLowerCase().includes(search.toLowerCase()) ||
    w.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-xl shadow-2xl text-slate-800 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2">
            <LayoutGrid className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-bold text-slate-900">Kelola Widget Dashboard</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Search & Quick Actions */}
        <div className="p-4 border-b border-slate-200 space-y-3 bg-white">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari widget..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onShowAll}
                className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg text-blue-600 transition flex items-center gap-1 font-medium"
              >
                <Eye className="w-3.5 h-3.5" />
                Tampilkan Semua
              </button>
              <button
                type="button"
                onClick={onHideAll}
                className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg text-rose-600 transition flex items-center gap-1 font-medium"
              >
                <EyeOff className="w-3.5 h-3.5" />
                Sembunyikan Semua
              </button>
            </div>

            <button
              type="button"
              onClick={onResetDefault}
              className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg text-amber-700 transition flex items-center gap-1 font-medium"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Layout
            </button>
          </div>
        </div>

        {/* Widget List */}
        <div className="p-4 space-y-2.5 overflow-y-auto flex-1 bg-slate-50/50">
          {filteredWidgets.map((w) => {
            const isVisible = visibleWidgetIds.includes(w.id);
            return (
              <div
                key={w.id}
                onClick={() => onToggleWidget(w.id)}
                className={`flex items-center justify-between p-3.5 rounded-2xl border transition cursor-pointer ${
                  isVisible
                    ? "bg-white border-blue-300 shadow-sm"
                    : "bg-slate-100/60 border-slate-200 opacity-60"
                }`}
              >
                <div>
                  <div className="text-xs font-bold text-slate-800 flex items-center gap-2">
                    {w.title}
                    {isVisible && (
                      <span className="text-[10px] bg-emerald-50 text-emerald-600 border border-emerald-200 px-1.5 py-0.2 rounded font-mono">
                        Aktif
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">{w.description}</div>
                </div>

                {/* Toggle Switch */}
                <div
                  className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors ${
                    isVisible ? "bg-emerald-500" : "bg-slate-300"
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      isVisible ? "translate-x-5" : "translate-x-0"
                    }`}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition shadow-md shadow-blue-600/20"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
}
