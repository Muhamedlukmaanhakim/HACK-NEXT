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
    <div className={`p-5 rounded-2xl bg-surface border border-surface-border hover:border-surface-border-hover transition-all duration-200 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">
          {label}
        </span>
        {Icon && (
          <div className="p-2 rounded-xl bg-surface-elevated text-accent-indigo border border-surface-border">
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="flex items-baseline justify-between">
        <h3 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
          {value}
        </h3>
        {change && (
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-full ${
              trend === 'up'
                ? 'bg-status-success/15 text-status-success'
                : 'bg-text-muted/15 text-text-secondary'
            }`}
          >
            {change}
          </span>
        )}
      </div>
    </div>
  );
}
