import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
  Outlet,
} from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import About from "./pages/About";
import History from "./pages/History";
import Login from "./pages/Login";
import UserManagement from "./pages/UserManagement";
import { getAuthToken, getUserRole } from "./utils/auth";
import XGBoostExplainerDashboard from "./pages/XGBoostExplainerDashboard";
import XGBoostExplainerDashboard2 from "./pages/XGBoostExplainerDashboard2";
import DataLakeExplorer from "./pages/DataLakeExplorer";
import AnatomiModel from "./pages/AnatomiModel";
import { useState } from "react";
import PredictionRunPage from "./pages/PredictionRunPage";
import PredictionBreakdownPage from "./pages/PredictionBreakdownPage";
import FeaturePredictionCurrent from "./pages/FeaturePredictionCurrent";
import DecisionTree from "./components/DecisionTree";
import todayPohon from "../public/decision_tree.json";
import testPohon from "../public/decision_tree.json";
import historyPohon from "../public/decision_tree.json";
import { FEATURE_DATA } from "./data/feature";
import TodayPrediction from "./pages/TodayPrediction";
import { PredictionTest } from "./pages/PredictionTest";

function ProtectedRoute({ children, adminOnly = false }) {
  const token = getAuthToken();
  const role = getUserRole();

  if (!token) return <Navigate to="/login" replace />;
  if (adminOnly && role !== "admin")
    return <Navigate to="/dashboard" replace />;

  return children;
}
function Layout({ children }) {
  const location = useLocation();
  const showSidebar = location.pathname !== "/login";

  const getTitleFromPath = (pathname) => {
    if (pathname === "/dashboard") return "Dashboard";
    if (pathname === "/feature-prediction-current")
      return "Data Feature & Prediksi";
    if (pathname === "/prediction-breakdown") return "Rincian Hasil Prediksi";
    if (pathname === "/history") return "History Data";
    if (pathname === "/pred-run-page") return "Uji Inferensi Model";
    if (pathname === "/XGBoostExplainerDashboard2")
      return "Explainer Dashboard";
    if (pathname === "/anatomi-model") return "Spesifikasi Model";
    if (pathname === "/users") return "Data User";
    return "SPK BTC-Predict";
  };

  if (!showSidebar) {
    return (
      <div className="min-h-screen bg-[#f8f9fc] text-slate-700 font-sans">
        {children}
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#f8f9fc] text-slate-700 font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar title={getTitleFromPath(location.pathname)} />
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

// Alur pemanggilan Data Lake ke Explainer dengan meneruskan tanggal & closing
function DataLakeFlow() {
  const [activeView, setActiveView] = useState("datalake");
  const [selectedRow, setSelectedRow] = useState(null);

  if (activeView === "explainer" && selectedRow) {
    return (
      <div className="space-y-4">
        <button
          onClick={() => setActiveView("datalake")}
          className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
        >
          &larr; Kembali ke Data Lake
        </button>
        {/* Hanya oper objek minimal yang berisi tanggal & closing_price */}
        <XGBoostExplainerDashboard2
          data={{
            tanggal: selectedRow.tanggal,
            closing_price: selectedRow.close ?? selectedRow.closing_price,
          }}
        />
      </div>
    );
  }

  return (
    <DataLakeExplorer
      onRunPrediction={(record) => {
        setSelectedRow(record);
        setActiveView("explainer");
      }}
    />
  );
}

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/prediction-today"
            element={
              <ProtectedRoute adminOnly={true}>
                <TodayPrediction />
              </ProtectedRoute>
            }
          />
          <Route
            path="/prediction-history"
            element={
              <ProtectedRoute>
                <History />
              </ProtectedRoute>
            }
          />
          <Route
            path="/prediction-test"
            element={
              <ProtectedRoute adminOnly={true}>
                <Outlet />
              </ProtectedRoute>
            }
          >
            <Route
              path=""
              element={
                <ProtectedRoute adminOnly={true}>
                  <PredictionTest />
                </ProtectedRoute>
              }
            />
            <Route
              path="hasil"
              element={
                <ProtectedRoute adminOnly={true}>
                  <TodayPrediction />
                </ProtectedRoute>
              }
            />
          </Route>
          <Route
            path="/anatomi-model"
            element={
              <ProtectedRoute adminOnly={true}>
                <AnatomiModel />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users"
            element={
              <ProtectedRoute adminOnly={true}>
                <UserManagement />
              </ProtectedRoute>
            }
          />
          {/* =============================================================== */}
          <Route
            path="/about"
            element={
              <ProtectedRoute>
                <About />
              </ProtectedRoute>
            }
          />

          <Route
            path="/XGBoostExplainerDashboard2"
            element={
              <ProtectedRoute adminOnly={true}>
                <XGBoostExplainerDashboard2 />
              </ProtectedRoute>
            }
          />

          <Route
            path="/pred-run-page"
            element={
              <ProtectedRoute adminOnly={true}>
                <PredictionRunPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="feature"
            element={
              <ProtectedRoute adminOnly={true}>
                <FeaturePredictionCurrent data={FEATURE_DATA} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/trees"
            element={
              <ProtectedRoute adminOnly={true}>
                {/* <DecisionTree /> */}
                <DecisionTree
                  judulHalaman="Pohon Keputusan Model"
                  pohon={todayPohon}
                />
              </ProtectedRoute>
            }
          />

          {/* 1. Rute untuk Today Prediction */}
          <Route
            path="/today-prediction"
            element={
              <ProtectedRoute adminOnly={true}>
                <Outlet />
              </ProtectedRoute>
            }
          >
            <Route
              path="calculation"
              element={
                <ProtectedRoute adminOnly={true}>
                  <PredictionBreakdownPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="feature"
              element={
                <ProtectedRoute adminOnly={true}>
                  <FeaturePredictionCurrent data={FEATURE_DATA} />
                </ProtectedRoute>
              }
            />
            <Route
              path="trees"
              element={
                <DecisionTree
                  judulHalaman="Visualisasi Pohon Prediksi Hari Ini"
                  pohon={todayPohon}
                />
              }
            />
          </Route>

          {/* 2. Rute untuk Test Prediction */}
          <Route
            path="/test-prediction"
            element={
              <ProtectedRoute adminOnly={true}>
                <Outlet />
              </ProtectedRoute>
            }
          >
            <Route
              path="calculation"
              element={
                <ProtectedRoute adminOnly={true}>
                  <PredictionBreakdownPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="feature"
              element={
                <ProtectedRoute adminOnly={true}>
                  <FeaturePredictionCurrent data={FEATURE_DATA} />
                </ProtectedRoute>
              }
            />
            <Route
              path="trees"
              element={
                <DecisionTree
                  judulHalaman="Visualisasi Pohon Prediksi Uji Coba"
                  pohon={testPohon}
                />
              }
            />
          </Route>

          {/* 3. Rute untuk History Prediction */}
          <Route
            path="/history-prediction"
            element={
              <ProtectedRoute adminOnly={true}>
                <Outlet />
              </ProtectedRoute>
            }
          >
            <Route
              path="calculation"
              element={
                <ProtectedRoute adminOnly={true}>
                  <PredictionBreakdownPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="feature"
              element={
                <ProtectedRoute adminOnly={true}>
                  <FeaturePredictionCurrent data={FEATURE_DATA} />
                </ProtectedRoute>
              }
            />
            <Route
              path="trees"
              element={
                <DecisionTree
                  judulHalaman="Visualisasi Pohon Riwayat Prediksi"
                  pohon={historyPohon}
                />
              }
            />
          </Route>
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
