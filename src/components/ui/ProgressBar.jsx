import React from 'react';

export default function ProgressBar({
  value = 0,
  max = 100,
  label,
  showValue = false,
  variant = 'ink',
  size = 'md',
  className = '',
}) {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  const variants = {
    ink: 'bg-ink',
    black: 'bg-ink',
    red: 'bg-brutal-red',
    coral: 'bg-brutal-red',
    orange: 'bg-brutal-red',
    yellow: 'bg-brutal-yellow',
    amber: 'bg-brutal-yellow',
    green: 'bg-brutal-green',
    mint: 'bg-brutal-green',
    teal: 'bg-brutal-green',
    success: 'bg-brutal-green',
    warning: 'bg-brutal-yellow',
    danger: 'bg-brutal-red',
  };

  const sizes = {
    sm: 'h-2',
    md: 'h-3.5',
    lg: 'h-5',
  };

  const colorClass = variants[variant] || variants.ink;
  const sizeClass = sizes[size] || sizes.md;

  return (
    <div className={`w-full space-y-1 ${className}`}>
      {(label || showValue) && (
        <div className="flex justify-between items-center text-xs font-mono font-bold">
          {label && <span className="text-ink uppercase tracking-wider">{label}</span>}
          {showValue && <span className="text-ink font-bold">{percentage}%</span>}
        </div>
      )}
      <div
        className={`w-full bg-white border-2 border-ink relative overflow-hidden ${sizeClass}`}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label || 'Progress'}
      >
        <div
          className={`h-full transition-all duration-700 ease-out ${colorClass}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
