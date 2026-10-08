import React from 'react';

export default function ProgressBar({
  value = 0,
  max = 100,
  label,
  showValue = false,
  variant = 'orange',
  size = 'md',
  className = '',
}) {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  const variants = {
    orange: 'bg-retro-orange',
    amber: 'bg-retro-amber',
    teal: 'bg-retro-teal',
    indigo: 'bg-retro-orange', // map legacy indigo to retro-orange
    success: 'bg-retro-teal',
    warning: 'bg-retro-amber',
    danger: 'bg-retro-red',
  };

  const sizes = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-3.5',
  };

  const colorClass = variants[variant] || variants.orange;
  const sizeClass = sizes[size] || sizes.md;

  return (
    <div className={`w-full space-y-1 ${className}`}>
      {(label || showValue) && (
        <div className="flex justify-between items-center text-[11px] font-mono">
          {label && <span className="text-retro-muted uppercase tracking-wider">{label}</span>}
          {showValue && <span className="font-bold text-retro-paper">{percentage}%</span>}
        </div>
      )}
      <div
        className={`w-full bg-retro-bg rounded-none border border-retro-border p-0.5 relative overflow-hidden ${sizeClass}`}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label || 'Progress'}
      >
        <div
          className={`h-full transition-all duration-500 ease-out ${colorClass}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
