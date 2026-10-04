import React from "react";
import Tabs from "../../components/ui/Tabs";
import { useNavigate } from "react-router-dom";

import dummyJson from "../../data/prediction_detail.json";
import todayPohon from "../../data/decision_tree.json";
import DecisionTree from "../../components/DecisionTree";
import PredictionSection from "../../components/PredictionSection";
import PredictionBreakdown from "../../components/PredictionBreakdown";
import { FEATURE_DATA } from "../../data/feature";
import FeaturePredictionCurrent from "../FeaturePredictionCurrent";

export default function TestResult({}) {
  const navigate = useNavigate();
  const dataJson = dummyJson.pohon;
  const handleLihatPohon = (treeId) => {
    navigate(`/trees?treeId=${treeId}`);
  };
  // Data tabs dibentuk di sini atau di-pass dari props
  const tabItems = [
    {
      id: "features",
      label: "Fitur",
      content: <FeaturePredictionCurrent data={FEATURE_DATA} />,
    },
    {
      id: "calculation",
      label: "Perhitungan",
      content: (
        <PredictionBreakdown
          judulHalaman="Prediksi Hari Ini"
          pohon={dataJson}
          baseScore={0.5}
          onLihatPohon={handleLihatPohon}
        />
      ),
    },
    {
      id: "tree",
      label: "Pohon Keputusan",
      content: (
        <DecisionTree judulHalaman="Pohon Keputusan Model" pohon={todayPohon} />
      ),
    },
  ];

  return (
    <>
      <button
        className="p-3 bg-white cursor-pointer  "
        onClick={() => navigate(-1)}
      >
        Kembali
      </button>
      <div className="space-y-6 p-6">
        {/* Header Halaman */}
        <h1 className="text-2xl font-bold text-gray-800">Prediksi hari ini</h1>

        {/* Ringkasan Hasil Prediksi */}
        <PredictionSection
          previousClose={77490.12}
          direction="down"
          actualClose={76650.67}
        />

        {/* Section Detail Menggunakan Tabs */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <Tabs items={tabItems} />
        </div>
      </div>
    </>
  );
}
