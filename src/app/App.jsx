import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { getAuthToken, getUserRole } from "../utils/auth";
import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";

import Login from "../pages/auth/Login";
import UserManagement from "../pages/users/UserManagement";
import AnatomiModel from "../pages/anatomy/AnatomiModel";
import TodayPrediction from "../pages/prediction/TodayPrediction";
import History from "../pages/prediction/History";
import HistoryResult from "../pages/prediction/HistoryResult";

function ProtectedRoute({ children, adminOnly = false }) {
  const token = getAuthToken();
  const role = getUserRole();

  if (!token) return <Navigate to="/login" replace />;
  if (adminOnly && role !== "admin") {
    return <Navigate to="/prediction-today" replace />;
  }

  return children;
}

function Layout({ children }) {
  const location = useLocation();
  const showSidebar = location.pathname !== "/login";

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
        <Navbar />
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/prediction-today" replace />} />

          <Route
            path="/prediction-today"
            element={
              <ProtectedRoute adminOnly>
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
            path="/prediction-history/result"
            element={
              <ProtectedRoute>
                <HistoryResult />
              </ProtectedRoute>
            }
          />

          <Route
            path="/anatomi-model"
            element={
              <ProtectedRoute adminOnly>
                <AnatomiModel />
              </ProtectedRoute>
            }
          />

          <Route
            path="/users"
            element={
              <ProtectedRoute adminOnly>
                <UserManagement />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Layout>
    </Router>
  );
}
