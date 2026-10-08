import React from 'react';

export default function StatCard({
  icon: Icon,
  label,
  value,
  change,
  trend = 'up',
  isKey = false,
  className = '',
}) {
  return (
    <div
      className={`p-4 rounded-none bg-retro-surface border transition-all duration-150 shadow-panel font-mono relative group ${
        isKey
          ? 'border-retro-coral/60 bg-retro-surface-elevated/40 ring-1 ring-retro-coral/30'
          : 'border-retro-border hover:border-retro-paper/30'
      } ${className}`}
    >
      {/* Corner crosshairs decoration */}
      <div className={`absolute top-1 left-1 text-[8px] leading-none select-none ${isKey ? 'text-retro-coral/70' : 'text-retro-muted/40'}`}>+</div>
      <div className={`absolute top-1 right-1 text-[8px] leading-none select-none ${isKey ? 'text-retro-coral/70' : 'text-retro-muted/40'}`}>+</div>

      <div className="flex items-center justify-between mb-2">
        <span className={`text-[10px] font-mono uppercase tracking-widest ${isKey ? 'text-retro-coral font-bold' : 'text-retro-muted'}`}>
          // {label}
        </span>
        {Icon && (
          <div className={`p-1 rounded-sm border ${
            isKey
              ? 'bg-retro-coral/10 text-retro-coral border-retro-coral/40'
              : 'bg-retro-surface-elevated text-retro-amber border-retro-border'
          }`}>
            <Icon className="w-3.5 h-3.5" />
          </div>
        )}
      </div>

      <div className="flex items-baseline justify-between mt-1">
        <h3 className={`text-3xl sm:text-4xl font-display font-bold tracking-tight ${
          isKey ? 'text-retro-coral' : 'text-retro-paper'
        }`}>
          {value}
        </h3>
        {change && (
          <span
            className={`text-[10px] font-mono px-1.5 py-0.5 uppercase tracking-wider ${
              isKey
                ? 'text-retro-coral bg-retro-coral/10 border border-retro-coral/30 font-bold'
                : trend === 'up'
                ? 'text-retro-mint bg-retro-mint/10 border border-retro-mint/30'
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
