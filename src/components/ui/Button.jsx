import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  type = 'button',
  icon: Icon,
  iconPosition = 'left',
  className = '',
  onClick,
  ...props
}) {
  const baseClasses = 'inline-flex items-center justify-center font-mono font-bold tracking-wider uppercase rounded-sm transition-all duration-150 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-orange focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none active:translate-y-0.5';

  const variants = {
    primary: 'bg-accent-orange text-background hover:brightness-110 active:brightness-90 border border-accent-amber/50 shadow-terminal',
    secondary: 'bg-surface-elevated text-paper hover:bg-surface-hover border border-surface-border hover:border-accent-orange/60 shadow-panel',
    outline: 'bg-transparent text-paper border border-surface-border hover:border-accent-orange hover:text-accent-orange hover:bg-surface-elevated/40',
    ghost: 'bg-transparent text-text-secondary hover:text-paper hover:bg-surface-elevated/60 border border-transparent',
    danger: 'bg-status-danger/15 text-status-danger border border-status-danger/35 hover:bg-status-danger/25',
    teal: 'bg-accent-teal/15 text-accent-teal border border-accent-teal/35 hover:bg-accent-teal/25',
  };

  const sizes = {
    sm: 'text-[11px] px-2.5 py-1.5 h-8 gap-1.5 min-h-[32px]',
    md: 'text-xs px-4 py-2 h-9 sm:h-10 gap-2 min-h-[36px]',
    lg: 'text-xs sm:text-sm px-6 py-2.5 h-11 sm:h-12 gap-2.5 min-h-[44px]',
  };

  const variantClass = variants[variant] || variants.primary;
  const sizeClass = sizes[size] || sizes.md;

  return (
    <button
      type={type}
      className={`${baseClasses} ${variantClass} ${sizeClass} ${className}`}
      disabled={disabled || isLoading}
      onClick={onClick}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
          <span>{children}</span>
        </>
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />}
          <span>{children}</span>
          {Icon && iconPosition === 'right' && <Icon className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />}
        </>
      )}
    </button>
  );
}
