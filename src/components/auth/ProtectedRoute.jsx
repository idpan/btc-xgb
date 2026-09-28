import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({ children, adminOnly = false }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && role !== "admin") {
    // Jika user biasa coba masuk ke menu admin, lempar ke dashboard utama
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};
