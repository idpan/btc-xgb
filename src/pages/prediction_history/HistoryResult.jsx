import React, { useEffect, useState } from "react";
import PredictionSection from "../../components/PredictionSection";
import Tabs from "../../components/ui/Tabs";
import FeaturePredictionCurrent from "../../pages/FeaturePredictionCurrent";
import PredictionBreakdown from "../../components/PredictionBreakdown";
import DecisionTree from "../../components/DecisionTree";

export default function HistoryResult({}) {
  const [features, setfeatures] = useState([]);
  const [trees, setTrees] = useState([]);
  const [summary, setSummary] = useState({});
  useEffect(() => {
    fetch("/predictions/byDate.json")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setfeatures(data.data.features);
        setTrees(data.data.trees);
        setSummary(data.data.summary);
      });
  }, []);

  // Data tabs dibentuk di sini atau di-pass dari props
  const tabItems = [
    {
      id: "features",
      label: "Fitur",
      content: <FeaturePredictionCurrent data={features} />,
    },
    {
      id: "calculation",
      label: "Perhitungan",
      content: (
        <PredictionBreakdown
          judulHalaman="Prediksi Hari Ini"
          pohon={trees}
          baseScore={0.5}
        />
      ),
    },
    {
      id: "tree",
      label: "Pohon Keputusan",
      content: (
        <DecisionTree judulHalaman="Pohon Keputusan Model" pohon={trees} />
      ),
    },
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Header Halaman */}
      <h1 className="text-2xl font-bold text-gray-800">Prediksi hari ini</h1>

      {/* Ringkasan Hasil Prediksi */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <PredictionSection
          previousClose={summary.reference_closing_price}
          direction={summary.prediction}
          nextClosingDate={summary.next_closing_date}
          nextClosingPrice={summary.next_closing_price}
          referenceClosingPrice={summary.reference_closing_price}
          referenceClosingDate={summary.reference_closing_date}
        />
      </div>

      {/* Section Detail Menggunakan Tabs */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <Tabs items={tabItems} />
      </div>
    </div>
  );
}
