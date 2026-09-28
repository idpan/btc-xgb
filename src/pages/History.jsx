import { useState, useEffect } from "react";
import { PredictionTable } from "../components/dashboard/PredictionTable";
import { StatCard } from "../components/dashboard/StatCard";
import NextPredictionCard from "../components/dashboard/NextPredictionCard";
import { Search, Filter, History as HistoryIcon } from "lucide-react";

export default function History() {
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetch("/prediction_history.json")
      .then((res) => {
        if (!res.ok)
          throw new Error("Gagal mengambil data prediction_history.json");
        return res.json();
      })
      .then((data) => {
        // Karena data di public/prediction_history.json berupa Array langsung
        setHistoryData(Array.isArray(data) ? data : data.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Gagal mengambil data:", err);
        setLoading(false);
      });
  }, []);

  // Filter Logic
  const filteredData = historyData.filter((item) => {
    const matchesSearch = item.date
      ? item.date.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    const matchesStatus =
      statusFilter === "all" || item.prediction_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Perhitungan Statistik
  const totalPreds = historyData.length;
  const correctPreds = historyData.filter(
    (item) => item.prediction_status === "correct",
  ).length;
  const winRate =
    totalPreds > 0 ? ((correctPreds / totalPreds) * 100).toFixed(1) : 0;

  const avgConfidence =
    totalPreds > 0
      ? (
          (historyData.reduce(
            (acc, curr) => acc + (curr.confidence_level || 0),
            0,
          ) /
            totalPreds) *
          100
        ).toFixed(1)
      : 0;

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="text-slate-500 font-medium">Memuat riwayat prediksi...</p>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8 p-6 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <HistoryIcon className="text-blue-600" size={32} />
            RIWAYAT PREDIKSI
          </h1>
          <p className="text-slate-500 font-medium">
            Data performa model dari waktu ke waktu.
          </p>
        </div>
      </div>

      {/* --- FILTER & TABLE SECTION --- */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between">
          <h3 className="text-xl font-bold text-slate-800">Logs Prediksi</h3>

          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Cari tanggal..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Filter
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={16}
              />
              <select
                className="pl-10 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition appearance-none"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">Semua Status</option>
                <option value="correct">Benar (Correct)</option>
                <option value="wrong">Salah (Wrong)</option>
                <option value="pending">Proses (Pending)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="p-2">
          <PredictionTable data={filteredData} />
        </div>
      </div>
    </div>
  );
}
