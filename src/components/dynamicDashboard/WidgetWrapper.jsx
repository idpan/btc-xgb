import { useState } from "react";
import { GripVertical, ArrowUp, ArrowDown, EyeOff } from "lucide-react";

export default function WidgetWrapper({
  id,
  index,
  totalWidgets,
  title,
  fullWidth,
  children,
  isEditMode,
  onMoveUp,
  onMoveDown,
  onRemove,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
}) {
  const [isOver, setIsOver] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!isOver) setIsOver(true);
    if (onDragOver) onDragOver(e, index);
  };

  const handleDragLeave = () => {
    setIsOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsOver(false);
    if (onDrop) onDrop(e, index);
  };

  return (
    <div
      draggable={isEditMode}
      onDragStart={(e) => onDragStart && onDragStart(e, index)}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onDragEnd={onDragEnd}
      className={`group relative transition-all duration-200 break-inside-avoid mb-4 h-fit ${
        fullWidth ? "md:[column-span:all] w-full" : ""
      } ${
        isOver
          ? "ring-2 ring-blue-500 ring-offset-2 ring-offset-slate-50 scale-[1.01]"
          : ""
      }`}
    >
      {/* Edit Mode Header Overlay */}
      {isEditMode && (
        <div className="flex items-center justify-between bg-slate-100 border-t border-x border-slate-200 rounded-t-2xl px-4 py-2 text-slate-600 text-xs shadow-inner">
          <div className="flex items-center gap-2 cursor-grab active:cursor-grabbing font-medium text-slate-800">
            <GripVertical className="w-4 h-4 text-blue-600" />
            <span>{title || "Widget"}</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onMoveUp(index)}
              disabled={index === 0}
              className="p-1 hover:bg-slate-200 disabled:opacity-30 rounded text-slate-700 transition"
              title="Geser Ke Atas"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onMoveDown(index)}
              disabled={index === totalWidgets - 1}
              className="p-1 hover:bg-slate-200 disabled:opacity-30 rounded text-slate-700 transition"
              title="Geser Ke Bawah"
            >
              <ArrowDown className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onRemove(id)}
              className="p-1 hover:bg-rose-100 hover:text-rose-600 rounded text-slate-500 transition ml-1"
              title="Sembunyikan Widget"
            >
              <EyeOff className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Widget Content Container */}
      <div className={isEditMode ? "rounded-b-2xl overflow-hidden" : ""}>
        {children}
      </div>
    </div>
  );
}
