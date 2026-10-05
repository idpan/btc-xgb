import React, { useEffect, useState } from "react";
import PredictionSection from "../../components/prediction/PredictionSection";
import Tabs from "../../components/ui/Tabs";
import FeaturePredictionCurrent from "./FeaturePredictionCurrent";
import PredictionBreakdown from "../../components/prediction/PredictionBreakdown";
import DecisionTree from "../../components/charts/DecisionTree";

export default function HistoryResult() {
  const [features, setFeatures] = useState([]);
  const [trees, setTrees] = useState([]);
  const [summary, setSummary] = useState({});

  useEffect(() => {
    fetch("/predictions/byDate.json")
      .then((res) => res.json())
      .then((data) => {
        setFeatures(data.data.features);
        setTrees(data.data.trees);
        setSummary(data.data.summary);
      });
  }, []);

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
      content: <DecisionTree judulHalaman="Pohon Keputusan Model" pohon={trees} />,
    },
  ];

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold text-gray-800">Prediksi hari ini</h1>

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

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <Tabs items={tabItems} />
      </div>
    </div>
  );
}
