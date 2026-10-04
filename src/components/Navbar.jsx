import { getUserRole } from "../utils/auth";

export default function Navbar() {
  const role = getUserRole() || "admin";

  return (
    <header className="bg-white border-b border-slate-200/80 h-16 px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      <div className="flex items-center gap-3"></div>

      <div className="flex items-center gap-4">
        {/* User Badge / Profile */}
        <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
          <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
            {role.toUpperCase()}
          </span>
          <div className="w-8 h-8 rounded-full bg-[#4e73df] text-white flex items-center justify-center shadow-xs">
            <i className="fa-solid fa-user text-xs"></i>
          </div>
        </div>
      </div>
    </header>
  );
}
