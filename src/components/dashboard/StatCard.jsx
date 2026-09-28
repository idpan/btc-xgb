// src/components/dashboard/StatCard.jsx

const colorMap = {
  emerald: {
    bg: "bg-emerald-50",
    text: "text-emerald-600",
    border: "border-emerald-200/60",
  },
  blue: {
    bg: "bg-blue-50",
    text: "text-blue-600",
    border: "border-blue-200/60",
  },
  indigo: {
    bg: "bg-indigo-50",
    text: "text-indigo-600",
    border: "border-indigo-200/60",
  },
  amber: {
    bg: "bg-amber-50",
    text: "text-amber-600",
    border: "border-amber-200/60",
  },
};

export function StatCard({ title, value, subtitle, icon: Icon, color = "blue" }) {
  const theme = colorMap[color] || colorMap.blue;

  return (
    <div
      className={`bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition flex flex-col justify-between`}
    >
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {title}
        </span>
        {Icon && (
          <div className={`p-2.5 rounded-xl ${theme.bg} ${theme.text}`}>
            <Icon size={20} />
          </div>
        )}
      </div>

      <div>
        <div className="text-2xl font-black text-slate-900 tracking-tight">
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
