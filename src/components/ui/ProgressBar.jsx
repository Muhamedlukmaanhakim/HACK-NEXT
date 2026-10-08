import React from 'react';

export default function ProgressBar({
  value = 0,
  max = 100,
  label,
  showValue = false,
  variant = 'indigo',
  size = 'md',
  className = '',
}) {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  const variants = {
    indigo: 'bg-gradient-primary',
    teal: 'bg-accent-teal',
    success: 'bg-status-success',
    warning: 'bg-status-warning',
    danger: 'bg-status-danger',
  };

  const sizes = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  const colorClass = variants[variant] || variants.indigo;
  const sizeClass = sizes[size] || sizes.md;

  return (
    <div className={`w-full space-y-1.5 ${className}`}>
      {(label || showValue) && (
        <div className="flex justify-between items-center text-xs">
          {label && <span className="font-medium text-text-secondary">{label}</span>}
          {showValue && <span className="font-semibold text-text-primary">{percentage}%</span>}
        </div>
      )}
      <div
        className={`w-full bg-surface-elevated rounded-full overflow-hidden border border-surface-border p-0.5 ${sizeClass}`}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label || 'Progress'}
      >
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${colorClass}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
