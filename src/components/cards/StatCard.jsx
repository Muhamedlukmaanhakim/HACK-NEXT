import React from 'react';

export default function StatCard({
  icon: Icon,
  label,
  value,
  change,
  isKey = false,
  className = '',
}) {
  return (
    <div
      className={`p-4 sm:p-5 border-2 border-ink transition-all duration-150 relative ${
        isKey
          ? 'bg-signal-yellow shadow-brutal hover:-translate-y-1 hover:shadow-brutal-lg'
          : 'bg-white shadow-brutal-sm hover:-translate-y-1 hover:shadow-brutal'
      } ${className}`}
    >
      <div className="flex items-center justify-between mb-3 border-b border-ink/20 pb-2">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-ink/80">
          // {label}
        </span>
        {Icon && (
          <div className="p-1 border border-ink bg-white text-ink">
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="space-y-1">
        <h3 className="text-4xl sm:text-5xl font-display font-extrabold tracking-tight text-ink leading-none">
          {value}
        </h3>
        {change && (
          <div className="pt-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-white border border-ink px-1.5 py-0.5 inline-block">
              {change}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
