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
  const baseClasses =
    'group inline-flex items-center justify-center font-display font-bold tracking-wider uppercase border-2 border-ink transition-all duration-150 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brutal-red disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none rounded-none';

  const variants = {
    primary:
      'bg-ink text-canvas hover:bg-black hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-brutal active:translate-x-0.5 active:translate-y-0.5 active:shadow-none shadow-brutal-sm',
    secondary:
      'bg-white text-ink hover:bg-canvas hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-brutal active:translate-x-0.5 active:translate-y-0.5 active:shadow-none shadow-brutal-sm',
    accent:
      'bg-brutal-red text-white hover:brightness-105 hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-brutal active:translate-x-0.5 active:translate-y-0.5 active:shadow-none shadow-brutal-sm',
    red:
      'bg-brutal-red text-white hover:brightness-105 hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-brutal active:translate-x-0.5 active:translate-y-0.5 active:shadow-none shadow-brutal-sm',
    yellow:
      'bg-brutal-yellow text-ink hover:brightness-105 hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-brutal active:translate-x-0.5 active:translate-y-0.5 active:shadow-none shadow-brutal-sm',
    outline:
      'bg-transparent text-ink border-2 border-ink hover:bg-white hover:-translate-y-0.5 hover:shadow-brutal-sm active:translate-y-0',
    ghost:
      'bg-transparent text-ink border-transparent hover:bg-canvas-muted hover:border-ink',
    danger:
      'bg-brutal-red text-white border-2 border-ink hover:brightness-105 shadow-brutal-sm',
    teal:
      'bg-brutal-green text-white border-2 border-ink hover:brightness-105 shadow-brutal-sm',
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 h-8 gap-1.5 min-h-[32px]',
    md: 'text-xs sm:text-sm px-4 py-2 h-10 gap-2 min-h-[40px]',
    lg: 'text-sm sm:text-base px-6 py-3 h-12 gap-2.5 min-h-[48px]',
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
          <Loader2 className="w-4 h-4 animate-spin mr-1.5" aria-hidden="true" />
          <span>{children}</span>
        </>
      ) : (
        <>
          {Icon && iconPosition === 'left' && (
            <Icon className="w-4 h-4 flex-shrink-0 transition-transform duration-150 group-hover:-translate-x-0.5" aria-hidden="true" />
          )}
          <span>{children}</span>
          {Icon && iconPosition === 'right' && (
            <Icon className="w-4 h-4 flex-shrink-0 transition-transform duration-150 group-hover:translate-x-1" aria-hidden="true" />
          )}
        </>
      )}
    </button>
  );
}
