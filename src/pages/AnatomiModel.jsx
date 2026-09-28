import React, { useState, useEffect } from "react";
import {
  Folder,
  FileCode2,
  Settings2,
  Hash,
  BarChart3,
  Loader2,
  X,
  ChevronRight,
  GitBranch,
} from "lucide-react";

const BATCH_SIZE = 10;

function fmtScore(v) {
  if (v === null || v === undefined) return "—";
  return (v >= 0 ? "+" : "") + v.toFixed(3);
}

export default function AnatomiModel() {
  const [trees, setTrees] = useState(null);
  const [config, setConfig] = useState(null);
  const [path, setPath] = useState([]); // [] = root, [batchNum] = di dalam batch
  const [modal, setModal] = useState(null); // { type: 'tree'|'config'|'base_score'|'importance', tree? }

  useEffect(() => {
    Promise.all([
      fetch("/trees-meta.json").then((r) => r.json()),
      fetch("/anatomi-config.json").then((r) => r.json()),
    ])
      .then(([treesData, configData]) => {
        setTrees(treesData);
        setConfig(configData);
      })
      .catch(() => {
        setTrees([]);
        setConfig(null);
      });
  }, []);

  if (!trees || !config) {
    return (
      <div className="flex items-center justify-center gap-2 text-slate-500 text-sm py-16">
        <Loader2 className="w-4 h-4 animate-spin" /> Memuat anatomi model...
      </div>
    );
  }

  const treesInBatch = (b) =>
    trees.filter((t) => t.batch === b).sort((a, b2) => a.id - b2.id);

  return (
    <div className="bg-slate-900 text-slate-200 rounded-xl border border-slate-800 overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <GitBranch className="w-5 h-5 text-indigo-400" />
          <div>
            <h2 className="text-sm font-bold text-slate-100">
              Anatomi Model — Jeroan XGBoost
            </h2>
            <p className="text-xs text-slate-500">
              100 pohon tetap di dalam model, ditata 10 batch sesuai urutan
              boosting. Struktur & leaf value apa adanya, tidak dikaitkan ke
              prediksi tertentu.
            </p>
          </div>
        </div>
        <span className="text-[10px] text-slate-500 font-mono">
          {trees.length} pohon · frontend-only (fetch /public)
        </span>
      </div>

      {/* breadcrumb */}
      <div className="flex items-center gap-1.5 font-mono text-xs text-slate-500 px-5 pt-3 flex-wrap">
        <span
          className="cursor-pointer px-1.5 py-0.5 rounded hover:bg-slate-800 hover:text-slate-200"
          onClick={() => setPath([])}
        >
          Anatomi Model
        </span>
        {path.length > 0 && (
          <>
            <span className="opacity-50">/</span>
            <span className="px-1.5 py-0.5 text-slate-300">
              Batch_{String(path[0]).padStart(2, "0")}
            </span>
          </>
        )}
      </div>

      {/* listing */}
      <div className="px-5 pb-5 pt-2">
        <div className="border border-slate-800 rounded-lg overflow-hidden divide-y divide-slate-800">
          {path.length === 0 ? (
            <>
              <Row
                icon={<Settings2 className="w-4 h-4" />}
                name="model_config.json"
                meta="Konfigurasi model"
                onClick={() => setModal({ type: "config" })}
              />
              <Row
                icon={<Hash className="w-4 h-4" />}
                name="base_score.txt"
                meta="Nilai awal sebelum koreksi pohon"
                onClick={() => setModal({ type: "base_score" })}
              />
              <Row
                icon={<BarChart3 className="w-4 h-4" />}
                name="feature_importance.csv"
                meta="Peringkat fitur, seluruh 100 pohon"
                onClick={() => setModal({ type: "importance" })}
              />
              {Array.from({ length: 10 }, (_, i) => i + 1).map((b) => (
                <Row
                  key={b}
                  icon={<Folder className="w-4 h-4" />}
                  iconTint="text-indigo-400 bg-indigo-500/10"
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
                icon={<FileCode2 className="w-4 h-4" />}
                name={`Tree_${String(t.id).padStart(3, "0")}.tree`}
                meta={`${t.nodes} node · ${t.leaves} leaf · akar: ${t.root}`}
                onClick={() => setModal({ type: "tree", tree: t })}
              />
            ))
          )}
        </div>

        <p className="text-[10.5px] text-slate-500 text-center leading-relaxed mt-4">
          Setiap gambar pohon adalah output asli{" "}
          <span className="font-mono">xgboost.to_graphviz()</span> dari model
          terlatih — bukan digambar ulang.
          {config.feature_importance_is_placeholder && (
            <> Feature importance &amp; base_score masih placeholder.</>
          )}
        </p>
      </div>

      {modal && (
        <Modal onClose={() => setModal(null)}>
          {modal.type === "tree" && (
            <TreeModal tree={modal.tree} onClose={() => setModal(null)} />
          )}
          {modal.type === "config" && (
            <ConfigModal
              config={config.model_config}
              onClose={() => setModal(null)}
            />
          )}
          {modal.type === "base_score" && (
            <BaseScoreModal
              value={config.base_score}
              onClose={() => setModal(null)}
            />
          )}
          {modal.type === "importance" && (
            <ImportanceModal
              list={config.feature_importance}
              onClose={() => setModal(null)}
            />
          )}
        </Modal>
      )}
    </div>
  );
}

function Row({ icon, iconTint, name, meta, chevron, onClick }) {
  return (
    <div
      className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-slate-800/60 transition-colors"
      onClick={onClick}
    >
      <div
        className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
          iconTint || "text-slate-400 bg-slate-800 border border-slate-700"
        }`}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[13px] font-mono text-slate-200 truncate">
          {name}
        </div>
        <div className="text-[11px] text-slate-500 truncate">{meta}</div>
      </div>
      {chevron && <ChevronRight className="w-4 h-4 text-slate-600" />}
    </div>
  );
}

function Modal({ children, onClose }) {
  return (
    <div
      className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-2xl">
        {children}
      </div>
    </div>
  );
}

function ModalHeader({ title, onClose }) {
  return (
    <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 sticky top-0 bg-slate-900">
      <h3 className="font-mono text-sm text-slate-100">{title}</h3>
      <button
        onClick={onClose}
        className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

function TreeModal({ tree, onClose }) {
  return (
    <>
      <ModalHeader
        title={`Tree_${String(tree.id).padStart(3, "0")}.tree`}
        onClose={onClose}
      />
      <div className="p-5">
        <div className="bg-white border border-slate-800 rounded-lg p-2.5 overflow-x-auto">
          <img
            src={`/trees/tree_${String(tree.id).padStart(3, "0")}.svg`}
            alt={`Struktur Tree_${String(tree.id).padStart(3, "0")}`}
            className="h-[280px] w-auto max-w-none block"
          />
        </div>
        <div className="mt-3 bg-slate-800/60 rounded-lg px-4 py-3 text-[11px] text-slate-400 leading-relaxed">
          Gambar asli dari{" "}
          <span className="font-mono">xgboost.to_graphviz()</span> — {tree.nodes}{" "}
          node ({tree.leaves} di antaranya leaf). Struktur ini tetap, terlepas
          dari data mana pun yang diprediksi; leaf mana yang terpakai untuk
          satu prediksi ditentukan oleh nilai fitur input saat itu melewati
          tiap split.
        </div>
      </div>
    </>
  );
}

function ConfigModal({ config, onClose }) {
  return (
    <>
      <ModalHeader title="model_config.json" onClose={onClose} />
      <div className="p-5">
        <pre className="font-mono text-xs bg-slate-800/60 rounded-lg p-4 leading-relaxed text-slate-400 whitespace-pre-wrap">
          {JSON.stringify(config, null, 2)}
        </pre>
      </div>
    </>
  );
}

function BaseScoreModal({ value, onClose }) {
  return (
    <>
      <ModalHeader title="base_score.txt" onClose={onClose} />
      <div className="p-5">
        <div className="font-mono text-xs bg-slate-800/60 rounded-lg p-4 text-slate-400 leading-relaxed">
          base_score = {value}
          <br />
          (titik awal sebelum 100 pohon mengoreksi)
        </div>
      </div>
    </>
  );
}

function ImportanceModal({ list, onClose }) {
  return (
    <>
      <ModalHeader title="feature_importance.csv" onClose={onClose} />
      <div className="p-5">
        <table className="w-full text-xs border-collapse">
          <tbody>
            {list.map((f, i) => (
              <tr key={f.name} className="border-b border-slate-800">
                <td className="py-1.5 pr-2 text-slate-300">
                  #{i + 1} {f.name}
                </td>
                <td className="py-1.5 text-right font-mono text-slate-400">
                  {fmtScore(f.score)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
