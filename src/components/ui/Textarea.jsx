import React, { forwardRef } from 'react';

const Textarea = forwardRef(function Textarea(
  {
    label,
    error,
    helperText,
    id,
    name,
    rows = 4,
    maxLength,
    value,
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
  const charCount = typeof value === 'string' ? value.length : 0;

  return (
    <div className="w-full space-y-1.5 font-sans">
      <div className="flex justify-between items-center">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-[11px] font-mono font-semibold uppercase tracking-wider text-text-secondary"
          >
            {label}
            {required && <span className="text-accent-orange ml-1">*</span>}
          </label>
        )}
        {maxLength && (
          <span className="text-[10px] font-mono text-text-muted">
            [{charCount}/{maxLength}]
          </span>
        )}
      </div>

      <textarea
        ref={ref}
        id={inputId}
        name={name}
        rows={rows}
        maxLength={maxLength}
        value={value}
        disabled={disabled}
        aria-invalid={Boolean(error)}
        aria-describedby={
          error ? errorId : helperText ? helperId : undefined
        }
        className={`w-full bg-surface-elevated text-paper placeholder:text-text-muted text-xs sm:text-sm rounded-sm border p-3 transition-all duration-150 outline-none resize-y
          ${
            error
              ? 'border-status-danger/70 focus:border-status-danger focus:ring-1 focus:ring-status-danger'
              : 'border-surface-border hover:border-surface-border-hover focus:border-accent-orange focus:ring-1 focus:ring-accent-orange/40'
          }
          disabled:opacity-50 disabled:cursor-not-allowed
          ${className}`}
        {...props}
      />

      {error ? (
        <p id={errorId} className="text-[11px] font-mono text-status-danger font-medium">
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

export default Textarea;
