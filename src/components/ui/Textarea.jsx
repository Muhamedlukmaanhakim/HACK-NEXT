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
    <div className="w-full space-y-1.5">
      <div className="flex justify-between items-center">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold uppercase tracking-wider text-text-secondary"
          >
            {label}
            {required && <span className="text-status-danger ml-1">*</span>}
          </label>
        )}
        {maxLength && (
          <span className="text-xs text-text-muted">
            {charCount}/{maxLength}
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
        className={`w-full bg-surface-elevated text-text-primary placeholder:text-text-muted text-sm rounded-xl border p-3 transition-all duration-200 outline-none resize-y
          ${
            error
              ? 'border-status-danger/70 focus:border-status-danger focus:ring-1 focus:ring-status-danger'
              : 'border-surface-border hover:border-surface-border-hover focus:border-accent-indigo focus:ring-2 focus:ring-accent-indigo/20'
          }
          disabled:opacity-50 disabled:cursor-not-allowed
          ${className}`}
        {...props}
      />

      {error ? (
        <p id={errorId} className="text-xs text-status-danger font-medium">
          {error}
        </p>
      ) : helperText ? (
        <p id={helperId} className="text-xs text-text-muted">
          {helperText}
        </p>
      ) : null}
    </div>
  );
});

export default Textarea;
