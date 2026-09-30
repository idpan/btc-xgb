// src/components/dashboard/StatCard.jsx

const colorMap = {
  emerald: {
    bg: "bg-emerald-50",
    text: "text-emerald-600",
    border: "border-l-4 border-l-emerald-500",
  },
  blue: {
    bg: "bg-blue-50",
    text: "text-[#4e73df]",
    border: "border-l-4 border-l-[#4e73df]",
  },
  indigo: {
    bg: "bg-indigo-50",
    text: "text-indigo-600",
    border: "border-l-4 border-l-indigo-500",
  },
  amber: {
    bg: "bg-amber-50",
    text: "text-amber-600",
    border: "border-l-4 border-l-amber-500",
  },
};

export function StatCard({ title, value, subtitle, icon: Icon, color = "blue" }) {
  const theme = colorMap[color] || colorMap.blue;

  return (
    <div
      className={`bg-white p-5 rounded-xl border border-slate-200/80 ${theme.border} shadow-xs hover:shadow-md transition flex flex-col justify-between`}
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-xs font-bold uppercase tracking-wider text-[#4e73df]">
          {title}
        </span>
        {Icon && (
          <div className={`p-2.5 rounded-xl ${theme.bg} ${theme.text}`}>
            <Icon size={20} />
          </div>
        )}
      </div>

      <div>
        <div className="text-2xl font-black text-slate-800 tracking-tight">
          {value}
        </div>
        {subtitle && (
          <p className="text-xs text-slate-500 font-medium mt-1 truncate">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
