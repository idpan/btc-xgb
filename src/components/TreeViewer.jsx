import React, { useEffect, useRef, useState, useCallback } from "react";
import { ZoomIn, ZoomOut, Maximize2, Crosshair, Loader2 } from "lucide-react";

/**
 * Menampilkan SVG pohon XGBoost utuh (hasil to_graphviz) yang bisa di-zoom & digeser.
 * Jika `leafId` diberikan, jalur dari akar ke daun tersebut diwarnai dan sisanya diredupkan.
 *
 * Props:
 * - treeIndex : indeks pohon 0-based (num_trees). File: /trees/tree_{index+1 dipad 3}.svg
 * - leafId    : id node daun terpilih (angka yang sama dengan `<title>` node di SVG /
 *               hasil predict(pred_leaf=True)). Opsional.
 * - height    : tinggi area tampil (CSS), default "65vh"
 */

const COLORS = {
  path: "#4f46e5", // indigo-600
  pathFill: "#eef2ff", // indigo-50
  leafPos: "#059669", // emerald-600
  leafPosFill: "#d1fae5",
  leafNeg: "#e11d48", // rose-600
  leafNegFill: "#ffe4e6",
};

const MIN_K = 0.1;
const MAX_K = 4;

function pad3(n) {
  return String(n).padStart(3, "0");
}

// Kembalikan { svgEl, w, h, note } setelah SVG diparse & diwarnai
function prepareSvg(text, leafId) {
  const doc = new DOMParser().parseFromString(text, "image/svg+xml");
  const svg = doc.documentElement;
  if (!svg || svg.nodeName.toLowerCase() !== "svg") {
    throw new Error("Format SVG tidak valid");
  }

  const vb = (svg.getAttribute("viewBox") || "0 0 800 400")
    .split(/\s+/)
    .map(Number);
  const w = vb[2];
  const h = vb[3];
  svg.setAttribute("width", w);
  svg.setAttribute("height", h);
  svg.style.display = "block";

  const nodes = new Map(); // id -> <g>
  const edges = new Map(); // "a->b" -> <g>
  const parent = new Map(); // child -> parent

  svg.querySelectorAll("g.node").forEach((g) => {
    const id = g.querySelector("title")?.textContent?.trim();
    if (id !== undefined) nodes.set(id, g);
  });
  svg.querySelectorAll("g.edge").forEach((g) => {
    const t = g.querySelector("title")?.textContent?.trim() || "";
    const [a, b] = t.split("->");
    if (a !== undefined && b !== undefined) {
      edges.set(`${a}->${b}`, g);
      parent.set(b, a);
    }
  });

  let note = null;
  let leafNodeId = null;

  if (leafId !== undefined && leafId !== null) {
    const leafG = nodes.get(String(leafId));
    const leafText = leafG?.querySelector("text")?.textContent || "";
    if (!leafG) {
      note = `Node #${leafId} tidak ada di pohon ini.`;
    } else if (!leafText.includes("leaf=")) {
      note = `Node #${leafId} bukan daun di pohon ini (kemungkinan data contoh, bukan hasil inferensi).`;
    } else {
      leafNodeId = String(leafId);
      // Susun jalur dari daun naik ke akar
      const pathNodes = [];
      let cur = leafNodeId;
      while (cur !== undefined) {
        pathNodes.unshift(cur);
        cur = parent.get(cur);
      }
      const pathNodeSet = new Set(pathNodes);
      const pathEdgeSet = new Set();
      for (let i = 0; i < pathNodes.length - 1; i++) {
        pathEdgeSet.add(`${pathNodes[i]}->${pathNodes[i + 1]}`);
      }

      // Redupkan semua, lalu sorot jalur
      nodes.forEach((g) => g.setAttribute("opacity", "0.28"));
      edges.forEach((g) => g.setAttribute("opacity", "0.28"));

      pathEdgeSet.forEach((key) => {
        const g = edges.get(key);
        if (!g) return;
        g.setAttribute("opacity", "1");
        g.querySelectorAll("path").forEach((p) => {
          p.setAttribute("stroke", COLORS.path);
          p.setAttribute("stroke-width", "3.5");
        });
        g.querySelectorAll("polygon").forEach((p) => {
          p.setAttribute("stroke", COLORS.path);
          p.setAttribute("fill", COLORS.path);
        });
      });

      pathNodeSet.forEach((id) => {
        const g = nodes.get(id);
        if (!g) return;
        g.setAttribute("opacity", "1");
        const ell = g.querySelector("ellipse");
        if (!ell) return;
        if (id === leafNodeId) {
          const m = leafText.match(/leaf=(-?[\d.eE+-]+)/);
          const positive = m ? parseFloat(m[1]) >= 0 : true;
          ell.setAttribute(
            "stroke",
            positive ? COLORS.leafPos : COLORS.leafNeg,
          );
          ell.setAttribute(
            "fill",
            positive ? COLORS.leafPosFill : COLORS.leafNegFill,
          );
          ell.setAttribute("stroke-width", "3");
        } else {
          ell.setAttribute("stroke", COLORS.path);
          ell.setAttribute("fill", COLORS.pathFill);
          ell.setAttribute("stroke-width", "2.5");
        }
      });
    }
  }

  // Posisi daun terpilih (untuk fokus) — dihitung dari ellipse cx/cy + transform graph
  let focus = null;
  if (leafNodeId) {
    const ell = nodes.get(leafNodeId)?.querySelector("ellipse");
    if (ell) {
      const cx = parseFloat(ell.getAttribute("cx"));
      const cy = parseFloat(ell.getAttribute("cy"));
      // g.graph transform biasanya "translate(4 H-4)" — ambil translate-nya
      const graphG = svg.querySelector("g.graph");
      const tr = graphG?.getAttribute("transform") || "";
      const tm = tr.match(/translate\(([-\d.]+)[ ,]+([-\d.]+)\)/);
      const tx = tm ? parseFloat(tm[1]) : 0;
      const ty = tm ? parseFloat(tm[2]) : 0;
      focus = { x: cx + tx, y: cy + ty };
    }
  }

  return { svg, w, h, note, focus };
}

export default function TreeViewer({ treeIndex, leafId, height = "65vh" }) {
  const containerRef = useRef(null);
  const contentRef = useRef(null);
  const dragRef = useRef(null);

  const [state, setState] = useState({ status: "loading" }); // loading | error | ready
  const [view, setView] = useState({ x: 0, y: 0, k: 1 });
  const dimsRef = useRef({ w: 0, h: 0, focus: null });

  const fitView = useCallback(() => {
    const c = containerRef.current;
    if (!c) return;
    const { w, h } = dimsRef.current;
    const k = Math.min(c.clientWidth / w, c.clientHeight / h, 1);
    setView({
      k,
      x: (c.clientWidth - w * k) / 2,
      y: (c.clientHeight - h * k) / 2,
    });
  }, []);

  const focusLeaf = useCallback(() => {
    const c = containerRef.current;
    const { focus } = dimsRef.current;
    if (!c || !focus) return fitView();
    const k = 0.9;
    setView({
      k,
      x: c.clientWidth / 2 - focus.x * k,
      y: c.clientHeight / 2 - focus.y * k,
    });
  }, [fitView]);

  // Muat & siapkan SVG
  useEffect(() => {
    let cancelled = false;
    setState({ status: "loading" });
    fetch(`/trees/tree_${pad3(treeIndex + 1)}.svg`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.text();
      })
      .then((text) => {
        if (cancelled) return;
        const { svg, w, h, note, focus } = prepareSvg(text, leafId);
        dimsRef.current = { w, h, focus };
        setState({ status: "ready", note });
        // pasang ke DOM setelah render
        requestAnimationFrame(() => {
          if (cancelled || !contentRef.current) return;
          contentRef.current.innerHTML = "";
          contentRef.current.appendChild(document.importNode(svg, true));
          focus ? focusLeaf() : fitView();
        });
      })
      .catch(
        (e) => !cancelled && setState({ status: "error", message: e.message }),
      );
    return () => {
      cancelled = true;
    };
  }, [treeIndex, leafId, fitView, focusLeaf]);

  // Zoom dengan roda mouse (listener non-passive agar bisa preventDefault)
  useEffect(() => {
    const c = containerRef.current;
    if (!c) return;
    const onWheel = (e) => {
      e.preventDefault();
      const rect = c.getBoundingClientRect();
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;
      setView((v) => {
        const k = Math.min(
          MAX_K,
          Math.max(MIN_K, v.k * (e.deltaY < 0 ? 1.12 : 1 / 1.12)),
        );
        const r = k / v.k;
        return { k, x: px - (px - v.x) * r, y: py - (py - v.y) * r };
      });
    };
    c.addEventListener("wheel", onWheel, { passive: false });
    return () => c.removeEventListener("wheel", onWheel);
  }, [state.status]);

  const zoomBy = (factor) => {
    const c = containerRef.current;
    if (!c) return;
    const px = c.clientWidth / 2;
    const py = c.clientHeight / 2;
    setView((v) => {
      const k = Math.min(MAX_K, Math.max(MIN_K, v.k * factor));
      const r = k / v.k;
      return { k, x: px - (px - v.x) * r, y: py - (py - v.y) * r };
    });
  };

  // Geser dengan drag
  const onPointerDown = (e) => {
    dragRef.current = { sx: e.clientX, sy: e.clientY, ox: view.x, oy: view.y };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e) => {
    const d = dragRef.current;
    if (!d) return;
    setView((v) => ({
      ...v,
      x: d.ox + e.clientX - d.sx,
      y: d.oy + e.clientY - d.sy,
    }));
  };
  const onPointerUp = () => {
    dragRef.current = null;
  };

  const btn =
    "p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-indigo-600 shadow-sm transition-colors";

  return (
    <div className="space-y-2 max-h-[calc(78vh-3rem)]">
      {/* Legenda */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="w-4 h-1 rounded bg-indigo-600" /> Jalur terpilih
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-emerald-200 border border-emerald-600" />{" "}
          Daun (+)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-rose-200 border border-rose-600" />{" "}
          Daun (−)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-4 h-1 rounded bg-slate-300" /> Cabang tidak diambil
        </span>
      </div>

      {state.status === "ready" && state.note && (
        <div className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
          {state.note}
        </div>
      )}

      <div
        className="relative bg-white border border-slate-200 rounded-xl overflow-hidden select-none h-[calc(78vh-8rem)] "
        // style={{ height }}
      >
        {state.status === "loading" && (
          <div className="absolute inset-0 flex items-center justify-center gap-2 text-slate-400 text-sm">
            <Loader2 className="w-4 h-4 animate-spin" /> Memuat pohon...
          </div>
        )}
        {state.status === "error" && (
          <div className="absolute inset-0 flex items-center justify-center text-sm text-rose-500">
            Gagal memuat pohon: {state.message}
          </div>
        )}

        <div
          ref={containerRef}
          className="absolute inset-0 cursor-grab active:cursor-grabbing touch-none"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          <div
            ref={contentRef}
            style={{
              transform: `translate(${view.x}px, ${view.y}px) scale(${view.k})`,
              transformOrigin: "0 0",
              width: "max-content",
            }}
          />
        </div>

        {state.status === "ready" && (
          <div className="absolute top-2 right-2 flex flex-col gap-1.5">
            <button
              className={btn}
              onClick={() => zoomBy(1.3)}
              title="Perbesar"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              className={btn}
              onClick={() => zoomBy(1 / 1.3)}
              title="Perkecil"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              className={btn}
              onClick={fitView}
              title="Tampilkan seluruh pohon"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
            <button
              className={btn}
              onClick={focusLeaf}
              title="Fokus ke daun terpilih"
            >
              <Crosshair className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
      <p className="text-[10.5px] text-slate-400">
        Scroll untuk zoom, seret untuk menggeser. Gambar asli dari{" "}
        <span className="font-mono">xgboost.to_graphviz()</span>.
      </p>
    </div>
  );
}
