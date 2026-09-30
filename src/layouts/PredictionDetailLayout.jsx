import React from "react";
import Tabs from "../components/ui/Tabs";
import FeaturePredictionCurrent from "../pages/FeaturePredictionCurrent";
import { FEATURE_DATA } from "../data/feature";
import PredictionBreakdown from "../components/PredictionBreakdown";
import { useNavigate } from "react-router-dom";

import dummyJson from "../../public/prediction_detail.json";
import todayPohon from "../../public/decision_tree.json";
import DecisionTree from "../components/DecisionTree";
import PredictionSection from "../components/PredictionSection";

export default function PredictionDetailLayout({
  headerTitle,
  summaryCard,
  details,
}) {
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
    <div className="space-y-6 p-6">
      {/* Header Halaman */}
      <h1 className="text-2xl font-bold text-gray-800">{headerTitle}</h1>

      {/* Ringkasan Hasil Prediksi */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <PredictionSection />
      </div>

      {/* Section Detail Menggunakan Tabs */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <Tabs items={tabItems} />
      </div>
    </div>
  );
}
