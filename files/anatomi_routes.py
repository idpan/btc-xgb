"""
Blueprint: Anatomi Model
Serve metadata + gambar asli 100 pohon (hasil xgboost.to_graphviz()) ke frontend React.

Cara pasang:
1. Copy folder `static_trees/` (isi tree_001.svg ... tree_100.svg) ke dalam
   folder static Flask kamu, misal: app/static/trees/
2. Copy `trees_meta.json` ke app/data/trees_meta.json (atau path lain, sesuaikan TREES_META_PATH)
3. Di app.py / __init__.py:
       from anatomi_routes import anatomi_bp
       app.register_blueprint(anatomi_bp, url_prefix="/api/anatomi")
4. Isi BASE_SCORE dan FEATURE_IMPORTANCE di bawah dengan nilai asli dari model
   (baseline.get_params()['base_score'] dan baseline.feature_importances_) —
   saat ini masih placeholder.
"""

import json
import os
from flask import Blueprint, jsonify, send_from_directory, abort

anatomi_bp = Blueprint("anatomi", __name__)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
TREES_META_PATH = os.path.join(BASE_DIR, "trees_meta.json")
TREES_SVG_DIR = os.path.join(BASE_DIR, "static_trees")  # arahkan ke lokasi asli di server kamu

MODEL_CONFIG = {
    "n_estimators": 100,
    "learning_rate": 0.05,
    "max_depth": 5,
    "objective": "binary:logistic",
    "random_state": 42,
}

# TODO: ganti dengan nilai asli — baseline.get_params()["base_score"]
BASE_SCORE = 0.5

# TODO: ganti dengan nilai asli — dict(zip(X.columns, baseline.feature_importances_))
FEATURE_IMPORTANCE_PLACEHOLDER = True
FEATURES = [
    "RSI", "MACD", "MACD_Signal", "MACD_Hist", "Log_Ret", "ATR", "BBW", "OBV",
    "Vol_Chg", "D_EMA20", "D_EMA200", "regime_trend_strength", "regime_vol_ratio",
    "regime_adx", "regime_rsi_norm", "regime_ema_spread", "regime_vol_trend",
    "Day_Sin", "Day_Cos", "Mon_Sin", "Mon_Cos",
]


def _load_trees_meta():
    with open(TREES_META_PATH, "r") as f:
        return json.load(f)


@anatomi_bp.route("/meta", methods=["GET"])
def get_meta():
    """Semua yang dibutuhkan React untuk render file-explorer: config, base_score,
    feature_importance (placeholder), dan daftar 100 pohon (id, nodes, leaves, root, batch)."""
    trees = _load_trees_meta()
    return jsonify({
        "model_config": MODEL_CONFIG,
        "base_score": BASE_SCORE,
        "feature_importance_is_placeholder": FEATURE_IMPORTANCE_PLACEHOLDER,
        "feature_importance": [{"name": f, "score": None} for f in FEATURES],
        "trees": trees,
    })


@anatomi_bp.route("/trees/<int:tree_id>", methods=["GET"])
def get_tree_svg(tree_id):
    """Serve file SVG asli untuk satu pohon, mis. /api/anatomi/trees/1 -> tree_001.svg"""
    if tree_id < 1 or tree_id > 100:
        abort(404)
    filename = f"tree_{tree_id:03d}.svg"
    if not os.path.exists(os.path.join(TREES_SVG_DIR, filename)):
        abort(404)
    return send_from_directory(TREES_SVG_DIR, filename, mimetype="image/svg+xml")
