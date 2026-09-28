import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import Sidebar from "./components/Sidebar";
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

  if (!showSidebar) {
    return (
      <div className="min-h-screen bg-[#f8fafc] text-slate-700 font-sans">
        {children}
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#f8fafc] text-slate-700 font-sans">
      <Sidebar />
      <main className="flex-1 p-6 md:p-8 min-w-0 overflow-y-auto">
        {children}
      </main>
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
            path="/history"
            element={
              <ProtectedRoute>
                <History />
              </ProtectedRoute>
            }
          />
          <Route
            path="/about"
            element={
              <ProtectedRoute>
                <About />
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
          <Route
            path="/XGBoostExplainerDashboard"
            element={
              <ProtectedRoute adminOnly={true}>
                <XGBoostExplainerDashboard />
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
            path="/data-lake"
            element={
              <ProtectedRoute adminOnly={true}>
                <DataLakeFlow />
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
            path="/anatomi-model"
            element={
              <ProtectedRoute adminOnly={true}>
                <AnatomiModel />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
