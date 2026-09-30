import PredictionDetailLayout from "../layouts/PredictionDetailLayout";
export default function TodayPrediction() {
  const todayPredictionContent = {
    calculation: "calculation konten",
    features: "fitur konten",
    decisionTree: "tree konten",
  };
  return (
    <PredictionDetailLayout
      headerTitle="Prediksi Hari ini"
      summaryCard={"summary"}
      details={todayPredictionContent}
    />
  );
}
