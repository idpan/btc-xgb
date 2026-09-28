import { Link, useLocation } from "react-router-dom";
import { logout, getUserRole } from "../utils/auth";

export default function Sidebar() {
  const location = useLocation();
  const currentPath = location.pathname;
  const role = getUserRole();

  const navItems = [
    { id: "dashboard", label: "Dashboard", path: "/dashboard", icon: "fa-solid fa-chart-line" },
    { id: "history", label: "History", path: "/history", icon: "fa-solid fa-clock-rotate-left" },
    { id: "data-lake", label: "Data Lake", path: "/data-lake", icon: "fa-solid fa-database" },
    { id: "explainer", label: "Explainer", path: "/XGBoostExplainerDashboard", icon: "fa-solid fa-brain" },
    { id: "pred-run-page", label: "Run Pred", path: "/pred-run-page", icon: "fa-solid fa-play" },
    { id: "explainer2", label: "Explainer 2", path: "/XGBoostExplainerDashboard2", icon: "fa-solid fa-chart-pie" },
    { id: "anatomi-model", label: "Anatomi Model", path: "/anatomi-model", icon: "fa-solid fa-cubes" },
  ];

  if (role === "admin") {
    navItems.push({ id: "users", label: "Users", path: "/users", icon: "fa-solid fa-users" });
  }

  return (
    <aside className="w-64 flex-shrink-0 h-screen sticky top-0 bg-white border-r border-slate-200/80 shadow-sm flex flex-col justify-between p-4 z-40 select-none overflow-y-auto">
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-2 py-3 border-b border-slate-100">
          <div className="bg-blue-600 p-2.5 rounded-xl shadow-md shadow-blue-500/20 flex items-center justify-center text-white">
            <i className="fa-brands fa-bitcoin text-xl"></i>
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900 tracking-tight leading-tight uppercase">
              BTC-Predict
            </h1>
            <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full inline-block mt-0.5">
              v2.0 Standalone
            </span>
          </div>
        </div>

        {/* Navigation Section */}
        <div>
          <p className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            Main Menu
          </p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive =
                currentPath === item.path ||
                (item.path !== "/dashboard" && currentPath.startsWith(item.path));
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                    isActive
                      ? "bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/20"
                      : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
                  }`}
                >
                  <i
                    className={`${item.icon} text-base w-5 text-center ${
                      isActive ? "text-white" : "text-slate-400"
                    }`}
                  ></i>
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* User Footer / Logout */}
      <div className="pt-4 border-t border-slate-100 space-y-3">
        <div className="px-3 py-2 rounded-xl bg-slate-50 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-xs">
            {role === "admin" ? "AD" : "US"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-slate-800 truncate">
              {role === "admin" ? "Administrator" : "User"}
            </p>
            <p className="text-[11px] text-slate-400 capitalize truncate">
              {role || "Guest"}
            </p>
          </div>
        </div>

        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 text-xs font-semibold bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 py-2.5 px-3 rounded-xl transition duration-200"
        >
          <i className="fa-solid fa-arrow-right-from-bracket"></i>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
