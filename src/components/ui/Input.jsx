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
    <div className="w-full space-y-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-semibold uppercase tracking-wider text-text-secondary"
        >
          {label}
          {required && <span className="text-status-danger ml-1">*</span>}
        </label>
      )}

      <div className="relative rounded-xl">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-muted">
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
          className={`w-full bg-surface-elevated text-text-primary placeholder:text-text-muted text-sm rounded-xl border transition-all duration-200 outline-none
            ${Icon ? 'pl-10' : 'pl-3.5'}
            ${IconRight ? 'pr-10' : 'pr-3.5'}
            py-2.5 h-10
            ${
              error
                ? 'border-status-danger/70 focus:border-status-danger focus:ring-1 focus:ring-status-danger'
                : 'border-surface-border hover:border-surface-border-hover focus:border-accent-indigo focus:ring-2 focus:ring-accent-indigo/20'
            }
            disabled:opacity-50 disabled:cursor-not-allowed
            ${className}`}
          {...props}
        />

        {IconRight && (
          <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-text-muted">
            <IconRight className="w-4 h-4" aria-hidden="true" />
          </div>
        )}
      </div>

      {error ? (
        <p id={errorId} className="text-xs text-status-danger flex items-center gap-1 font-medium">
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

export default Input;
