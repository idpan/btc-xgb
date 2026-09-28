import { useEffect, useState } from "react";

/**
 * Halaman "Anatomi Model" — file-explorer 100 pohon XGBoost.
 * Konsumsi backend Flask: GET /api/anatomi/meta, GET /api/anatomi/trees/:id
 *
 * Ganti API_BASE sesuai konfigurasi kamu (proxy dev server / env var).
 */
const API_BASE = "/api/anatomi";
const BATCH_SIZE = 10;

function fmtScore(v) {
  if (v === null || v === undefined) return "—";
  return (v >= 0 ? "+" : "") + v.toFixed(3);
}

export default function AnatomiModel() {
  const [meta, setMeta] = useState(null);
  const [error, setError] = useState(null);
  const [path, setPath] = useState([]); // [] = root, [batchNum] = di dalam batch
  const [modal, setModal] = useState(null); // { type: 'tree'|'config', ... }

  useEffect(() => {
    fetch(`${API_BASE}/meta`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(setMeta)
      .catch((e) => setError(e.message));
  }, []);

  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-sm text-red-400">
        Gagal memuat data anatomi model: {error}
      </div>
    );
  }
  if (!meta) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-sm text-slate-400">
        Memuat struktur model…
      </div>
    );
  }

  const treesInBatch = (b) =>
    meta.trees.filter((t) => t.batch === b).sort((a, b2) => a.id - b2.id);

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 text-slate-100">
      <h1 className="text-base font-semibold mb-1">🗂️ Anatomi Model</h1>
      <p className="text-xs text-slate-400 leading-relaxed mb-4">
        Jeroan XGBoost — 100 pohon keputusan tersimpan tetap di dalam model,
        ditata sebagai 10 batch sesuai urutan boosting. Struktur & leaf value
        ditampilkan apa adanya, tidak dikaitkan ke prediksi tertentu.
      </p>

      {/* breadcrumb */}
      <div className="flex items-center gap-1.5 font-mono text-xs text-slate-400 mb-3 flex-wrap">
        <span
          className="cursor-pointer px-1 py-0.5 rounded hover:bg-slate-800 hover:text-slate-100"
          onClick={() => setPath([])}
        >
          Anatomi Model
        </span>
        {path.length > 0 && (
          <>
            <span className="opacity-50">/</span>
            <span className="px-1 py-0.5">
              Batch_{String(path[0]).padStart(2, "0")}
            </span>
          </>
        )}
      </div>

      {/* listing */}
      <div className="bg-[#131a24] border border-[#232d3b] rounded-xl overflow-hidden">
        {path.length === 0 ? (
          <>
            <Row
              iconClass="cfg"
              iconChar="⚙"
              name="model_config.json"
              meta="Konfigurasi model"
              onClick={() => setModal({ type: "config" })}
            />
            <Row
              iconClass="cfg"
              iconChar="#"
              name="base_score.txt"
              meta="Nilai awal sebelum koreksi pohon"
              onClick={() => setModal({ type: "base_score" })}
            />
            <Row
              iconClass="cfg"
              iconChar="▤"
              name="feature_importance.csv"
              meta="Peringkat fitur, seluruh 100 pohon"
              onClick={() => setModal({ type: "importance" })}
            />
            {Array.from({ length: 10 }, (_, i) => i + 1).map((b) => (
              <Row
                key={b}
                iconClass="folder"
                iconChar="📁"
                name={`Batch_${String(b).padStart(2, "0")}`}
                meta={`Tree_${String((b - 1) * BATCH_SIZE + 1).padStart(
                  3,
                  "0"
                )}–${String(b * BATCH_SIZE).padStart(3, "0")}`}
                chevron
                onClick={() => setPath([b])}
              />
            ))}
          </>
        ) : (
          treesInBatch(path[0]).map((t) => (
            <Row
              key={t.id}
              iconClass="cfg"
              iconChar="T"
              name={`Tree_${String(t.id).padStart(3, "0")}.tree`}
              meta={`${t.nodes} node · ${t.leaves} leaf · akar: ${t.root}`}
              onClick={() => setModal({ type: "tree", tree: t })}
            />
          ))
        )}
      </div>

      <p className="text-[10.5px] text-slate-500 text-center leading-relaxed mt-5 px-2">
        Setiap gambar pohon adalah output asli{" "}
        <span className="font-mono">xgboost.to_graphviz()</span> dari model
        terlatih — bukan digambar ulang.
        {meta.feature_importance_is_placeholder && (
          <> Feature importance & base_score masih placeholder.</>
        )}
      </p>

      {modal && (
        <Modal onClose={() => setModal(null)}>
          {modal.type === "tree" && <TreeModal tree={modal.tree} />}
          {modal.type === "config" && <ConfigModal config={meta.model_config} />}
          {modal.type === "base_score" && (
            <BaseScoreModal value={meta.base_score} />
          )}
          {modal.type === "importance" && (
            <ImportanceModal list={meta.feature_importance} />
          )}
        </Modal>
      )}
    </div>
  );
}

function Row({ iconClass, iconChar, name, meta, chevron, onClick }) {
  const iconStyles =
    iconClass === "folder"
      ? "bg-[#5b8def26] text-[#5b8def]"
      : "bg-[#171f2b] text-slate-400 border border-[#232d3b]";
  return (
    <div
      className="flex items-center gap-3 px-3.5 py-3 border-b border-[#232d3b] last:border-b-0 cursor-pointer hover:bg-[#171f2b]"
      onClick={onClick}
    >
      <div
        className={`w-[30px] h-[30px] rounded-lg flex items-center justify-center text-sm font-mono font-bold flex-shrink-0 ${iconStyles}`}
      >
        {iconChar}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[13px] font-mono truncate">{name}</div>
        <div className="text-[11px] text-slate-400 truncate">{meta}</div>
      </div>
      {chevron && <div className="text-slate-400 text-xs">›</div>}
    </div>
  );
}

function Modal({ children, onClose }) {
  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-end justify-center z-50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-[#131a24] border border-[#232d3b] rounded-t-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto p-4 pb-6">
        {children}
        <button
          className="mt-4 w-full text-xs text-slate-400 bg-[#171f2b] border border-[#232d3b] rounded-lg py-2"
          onClick={onClose}
        >
          Tutup
        </button>
      </div>
    </div>
  );
}

function TreeModal({ tree }) {
  return (
    <>
      <h2 className="font-mono text-sm mb-3">
        Tree_{String(tree.id).padStart(3, "0")}.tree
      </h2>
      <div className="bg-white border border-[#232d3b] rounded-lg p-2.5 overflow-x-auto">
        <img
          src={`${API_BASE}/trees/${tree.id}`}
          alt={`Struktur Tree_${String(tree.id).padStart(3, "0")}`}
          className="h-[280px] w-auto max-w-none block"
        />
      </div>
      <div className="mt-3 bg-[#171f2b] rounded-lg px-3.5 py-3 text-[11px] text-slate-400 leading-relaxed">
        Gambar asli dari <span className="font-mono">xgboost.to_graphviz()</span>{" "}
        — {tree.nodes} node ({tree.leaves} di antaranya leaf). Struktur ini
        tetap, terlepas dari data mana pun yang diprediksi; leaf mana yang
        terpakai untuk satu prediksi ditentukan oleh nilai fitur input saat
        itu melewati tiap split.
      </div>
    </>
  );
}

function ConfigModal({ config }) {
  return (
    <>
      <h2 className="font-mono text-sm mb-3">model_config.json</h2>
      <pre className="font-mono text-xs bg-[#171f2b] rounded-lg p-3.5 leading-relaxed text-slate-400 whitespace-pre-wrap">
        {JSON.stringify(config, null, 2)}
      </pre>
    </>
  );
}

function BaseScoreModal({ value }) {
  return (
    <>
      <h2 className="font-mono text-sm mb-3">base_score.txt</h2>
      <div className="font-mono text-xs bg-[#171f2b] rounded-lg p-3.5 text-slate-400 leading-relaxed">
        base_score = {value}
        <br />
        (titik awal sebelum 100 pohon mengoreksi)
      </div>
    </>
  );
}

function ImportanceModal({ list }) {
  return (
    <>
      <h2 className="font-mono text-sm mb-3">feature_importance.csv</h2>
      <table className="w-full text-xs border-collapse">
        <tbody>
          {list.map((f, i) => (
            <tr key={f.name} className="border-b border-[#232d3b]">
              <td className="py-1.5 pr-2">
                #{i + 1} {f.name}
              </td>
              <td className="py-1.5 text-right font-mono">
                {fmtScore(f.score)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
