import React from 'react';

export default function Tabs({
  tabs = [],
  activeTab,
  onChange,
  className = '',
}) {
  return (
    <div
      role="tablist"
      aria-label="Tabs"
      className={`flex items-center gap-2 overflow-x-auto font-mono text-xs ${className}`}
    >
      {tabs.map((tab) => {
        const id = typeof tab === 'object' ? tab.id : tab;
        const label = typeof tab === 'object' ? tab.label : tab;
        const count = typeof tab === 'object' ? tab.count : undefined;
        const isActive = activeTab === id;

        return (
          <button
            key={id}
            role="tab"
            aria-selected={isActive}
            aria-controls={`panel-${id}`}
            id={`tab-${id}`}
            type="button"
            onClick={() => onChange(id)}
            className={`px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider border-2 border-ink transition-all flex items-center gap-2 whitespace-nowrap ${
              isActive
                ? 'bg-ink text-canvas shadow-brutal-sm'
                : 'bg-white text-ink hover:bg-canvas'
            }`}
          >
            <span>{label}</span>
            {count !== undefined && (
              <span
                className={`px-1.5 py-0.5 text-[10px] font-mono font-bold border border-ink ${
                  isActive
                    ? 'bg-canvas text-ink'
                    : 'bg-signal-yellow text-ink'
                }`}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
