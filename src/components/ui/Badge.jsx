import React from 'react';

export default function Badge({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  icon: Icon,
  onRemove,
  ...props
}) {
  const variants = {
    default: 'bg-canvas text-ink border border-ink',
    primary: 'bg-brutal-red text-white border border-ink',
    secondary: 'bg-signal-yellow text-ink border border-ink',
    teal: 'bg-campus-green text-ink border border-ink',
    success: 'bg-campus-green text-ink border border-ink',
    warning: 'bg-signal-yellow text-ink border border-ink',
    danger: 'bg-brutal-red text-white border border-ink',
    outline: 'bg-white text-ink border border-ink',
  };

  const sizes = {
    sm: 'text-[10px] px-2 py-0.5 gap-1 font-mono font-bold uppercase tracking-wider',
    md: 'text-[11px] px-2.5 py-0.5 gap-1.5 font-mono font-bold uppercase tracking-wider',
    lg: 'text-xs px-3 py-1 gap-2 font-mono font-bold uppercase tracking-wider',
  };

  const variantClass = variants[variant] || variants.default;
  const sizeClass = sizes[size] || sizes.md;

  return (
    <span
      className={`inline-flex items-center rounded-none select-none transition-colors ${variantClass} ${sizeClass} ${className}`}
      {...props}
    >
      {Icon && <Icon className="w-3 h-3 flex-shrink-0" aria-hidden="true" />}
      <span>{children}</span>
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-1 -mr-0.5 p-0.5 hover:bg-black/10 text-ink transition-colors"
          aria-label="Remove item"
        >
          <svg className="w-2.5 h-2.5 stroke-[3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </span>
  );
}
