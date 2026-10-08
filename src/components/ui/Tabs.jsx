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
      className={`flex items-center gap-1 p-1 bg-retro-surface border border-retro-border w-fit overflow-x-auto font-mono text-xs ${className}`}
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
            className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider transition-all duration-150 flex items-center gap-2 whitespace-nowrap focus-visible:outline-none ${
              isActive
                ? 'bg-retro-orange text-retro-bg font-bold shadow-panel'
                : 'text-retro-paper/70 hover:text-retro-paper hover:bg-retro-surface-hover'
            }`}
          >
            <span>{label}</span>
            {count !== undefined && (
              <span
                className={`px-1 py-0.2 text-[9px] font-mono font-bold ${
                  isActive
                    ? 'bg-retro-bg text-retro-orange'
                    : 'bg-retro-surface-elevated text-retro-muted'
                }`}
              >
                [{count}]
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
