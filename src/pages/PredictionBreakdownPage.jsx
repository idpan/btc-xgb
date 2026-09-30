import PredictionBreakdown from "../components/PredictionBreakdown";
import { useNavigate } from "react-router-dom";
// Import data dummy statis atau generatornya
// import { mockPohonData, generateMockTrees } from "../data/mockPredictionData";
// Atau dari JSON:
import dummyJson from "../../public/prediction_detail.json";

export default function PredictionBreakdownPage() {
  // Opsi 1: Menggunakan array statis (10 pohon)
  // const dataStatis = mockPohonData;

  // Opsi 2: Menggunakan generator (misal 100 pohon)
  // const dataDinamis = generateMockTrees(100);

  // Opsi 3: Dari JSON
  const navigate = useNavigate();
  const dataJson = dummyJson.pohon;
  const handleLihatPohon = (treeId) => {
    navigate(`/trees?treeId=${treeId}`);
  };
  return (
    <PredictionBreakdown
      judulHalaman="Prediksi Hari Ini"
      pohon={dataJson}
      baseScore={0.5}
      onLihatPohon={handleLihatPohon}
    />
  );
}
