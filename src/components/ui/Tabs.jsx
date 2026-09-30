import React, { useState } from "react";

export default function Tabs({ items = [], className = "" }) {
  // Jika items kosong, fallback ke null
  const defaultTabId = items.length > 0 ? items[0].id : null;

  // State disimpan sepenuhnya di dalam komponen ini
  const [activeTab, setActiveTab] = useState(defaultTabId);

  if (!items.length) return null;

  // Cari item yang sedang aktif, fallback ke item pertama jika tidak ketemu
  const activeItem = items.find((item) => item.id === activeTab) || items[0];

  return (
    <div className={`w-full font-sans ${className}`}>
      {/* Tabs Header Container */}
      <div className="relative border-b-2 border-emerald-500 flex items-end  scrollbar-none">
        {items.map((tab) => {
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`
                px-5 py-2.5 text-base font-medium transition-all duration-150 ease-in-out whitespace-nowrap focus:outline-none cursor-pointer
                ${
                  isActive
                    ? "border-t-2 border-x-2 border-emerald-500 bg-white rounded-t-lg -mb-[2px] z-10 text-black"
                    : "text-black hover:text-emerald-600 border-t-2 border-x-2 border-transparent"
                }
              `}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="pt-6">
        {activeItem && (
          <div>
            {typeof activeItem.content === "string" ? (
              <p className="text-xl font-medium text-gray-900">
                {activeItem.content}
              </p>
            ) : (
              activeItem.content
            )}
          </div>
        )}
      </div>
    </div>
  );
}
