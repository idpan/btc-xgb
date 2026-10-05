import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { logout, getUserRole } from "../../utils/auth";

export default function Sidebar() {
  const location = useLocation();
  const currentPath = location.pathname;
  const role = getUserRole();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const items = [
    { id: "today", label: "Prediksi Hari Ini", path: "/prediction-today", icon: "fa-solid fa-calendar-check" },
    { id: "history", label: "Riwayat Prediksi", path: "/prediction-history", icon: "fa-solid fa-clock-rotate-left" },
    { id: "anatomy", label: "Spesifikasi Model", path: "/anatomi-model", icon: "fa-solid fa-cubes" },
  ];

  if (role === "admin") {
    items.push({ id: "users", label: "Manajemen User", path: "/users", icon: "fa-solid fa-user-gear" });
  }

  return (
    <aside
      className={`h-screen sticky top-0 flex-shrink-0 transition-all duration-300 z-40 select-none flex flex-col justify-between text-white shadow-xl ${
        isCollapsed ? "w-20" : "w-64"
      }`}
      style={{ background: "linear-gradient(180deg, #4e73df 10%, #224abe 100%)" }}
    >
      <div className="flex flex-col h-full overflow-y-auto custom-scrollbar">
        <div className="flex items-center gap-3 px-4 py-4 border-b border-white/15">
          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center text-white shadow-inner flex-shrink-0">
            <i className="fa-solid fa-database text-xl"></i>
          </div>
          {!isCollapsed && (
            <div className="min-w-0 flex-1">
              <h1 className="text-base font-extrabold tracking-wider text-white uppercase leading-tight truncate">
                BTC PREDICT
              </h1>
              <span className="text-[10px] font-semibold text-blue-100 opacity-80 block truncate">
                SPK XGBoost v2.0
              </span>
            </div>
          )}
        </div>

        <div className="px-3 py-4 space-y-4 flex-1">
          <nav className="space-y-1">
            {items.map((item) => {
              const isActive = currentPath === item.path;
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  title={isCollapsed ? item.label : undefined}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? "bg-white/20 text-white font-bold shadow-xs border-l-4 border-white"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  } ${isCollapsed ? "justify-center px-0" : ""}`}
                >
                  <i
                    className={`${item.icon} text-base ${
                      isCollapsed ? "w-auto text-lg" : "w-5 text-center"
                    } ${isActive ? "text-white" : "text-white/70"}`}
                  ></i>
                  {!isCollapsed && <span className="truncate">{item.label}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-3 border-t border-white/15 flex items-center justify-between">
          {!isCollapsed && (
            <button
              onClick={logout}
              className="flex items-center gap-2 text-xs font-semibold text-white/80 hover:text-white hover:bg-white/10 py-1.5 px-3 rounded-lg transition"
            >
              <i className="fa-solid fa-arrow-right-from-bracket"></i>
              <span>Logout</span>
            </button>
          )}

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition shadow-xs mx-auto"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            <i className={`fa-solid ${isCollapsed ? "fa-chevron-right" : "fa-chevron-left"} text-xs`}></i>
          </button>
        </div>
      </div>
    </aside>
  );
}
