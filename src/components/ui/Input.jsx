import React, { forwardRef } from 'react';

const Input = forwardRef(function Input(
  {
    label,
    error,
    helperText,
    icon: Icon,
    iconRight: IconRight,
    id,
    name,
    type = 'text',
    className = '',
    required = false,
    disabled = false,
    ...props
  },
  ref
) {
  const inputId = id || name || Math.random().toString(36).substr(2, 9);
  const errorId = `${inputId}-error`;
  const helperId = `${inputId}-helper`;

  return (
    <div className="w-full space-y-1.5 font-sans">
      {label && (
        <label
          htmlFor={inputId}
          className="flex items-center justify-between text-[11px] font-mono font-semibold uppercase tracking-wider text-text-secondary"
        >
          <span>
            {label}
            {required && <span className="text-accent-orange ml-1">*</span>}
          </span>
          <span className="text-[10px] text-text-muted select-none">SYS_IN</span>
        </label>
      )}

      <div className="relative rounded-sm">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
            <Icon className="w-4 h-4" aria-hidden="true" />
          </div>
        )}

        <input
          ref={ref}
          id={inputId}
          name={name}
          type={type}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={
            error ? errorId : helperText ? helperId : undefined
          }
          className={`w-full bg-surface-elevated text-paper placeholder:text-text-muted text-xs sm:text-sm rounded-sm border transition-all duration-150 outline-none
            ${Icon ? 'pl-9' : 'pl-3'}
            ${IconRight ? 'pr-9' : 'pr-3'}
            py-2 h-10
            ${
              error
                ? 'border-status-danger/70 focus:border-status-danger focus:ring-1 focus:ring-status-danger'
                : 'border-surface-border hover:border-surface-border-hover focus:border-accent-orange focus:ring-1 focus:ring-accent-orange/40'
            }
            disabled:opacity-50 disabled:cursor-not-allowed
            ${className}`}
          {...props}
        />

        {IconRight && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-text-muted">
            <IconRight className="w-4 h-4" aria-hidden="true" />
          </div>
        )}
      </div>

      {error ? (
        <p id={errorId} className="text-[11px] font-mono text-status-danger flex items-center gap-1 font-medium">
          [ ERR // {error} ]
        </p>
      ) : helperText ? (
        <p id={helperId} className="text-[11px] font-mono text-text-muted">
          // {helperText}
        </p>
      ) : null}
    </div>
  );
});

export default Input;
