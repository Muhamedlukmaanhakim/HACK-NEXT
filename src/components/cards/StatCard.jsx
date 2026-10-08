import React from 'react';

export default function StatCard({
  icon: Icon,
  label,
  value,
  change,
  trend = 'up',
  className = '',
}) {
  return (
    <div className={`p-4 rounded-none bg-retro-surface border border-retro-border hover:border-retro-orange/60 transition-all duration-150 shadow-panel font-mono relative group ${className}`}>
      {/* Corner crosshairs decoration */}
      <div className="absolute top-1 left-1 text-[8px] text-retro-muted/40 leading-none select-none">+</div>
      <div className="absolute top-1 right-1 text-[8px] text-retro-muted/40 leading-none select-none">+</div>

      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-mono uppercase tracking-widest text-retro-muted">
          // {label}
        </span>
        {Icon && (
          <div className="p-1 rounded-sm bg-retro-surface-elevated text-retro-amber border border-retro-border">
            <Icon className="w-3.5 h-3.5" />
          </div>
        )}
      </div>

      <div className="flex items-baseline justify-between mt-1">
        <h3 className="text-2xl sm:text-3xl font-display font-bold text-retro-paper tracking-tight">
          {value}
        </h3>
        {change && (
          <span
            className={`text-[10px] font-mono px-1.5 py-0.2 uppercase tracking-wider ${
              trend === 'up'
                ? 'text-retro-teal bg-retro-teal/10 border border-retro-teal/30'
                : 'text-retro-muted bg-retro-surface-elevated border border-retro-border'
            }`}
          >
            {change}
          </span>
        )}
      </div>
    </div>
  );
}
