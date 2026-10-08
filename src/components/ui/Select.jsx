import React, { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

const Select = forwardRef(function Select(
  {
    label,
    error,
    helperText,
    id,
    name,
    options = [],
    placeholder = 'Select an option',
    className = '',
    required = false,
    disabled = false,
    ...props
  },
  ref
) {
  const selectId = id || name || Math.random().toString(36).substr(2, 9);
  const errorId = `${selectId}-error`;
  const helperId = `${selectId}-helper`;

  return (
    <div className="w-full space-y-1.5 font-sans">
      {label && (
        <label
          htmlFor={selectId}
          className="block text-[11px] font-mono font-semibold uppercase tracking-wider text-text-secondary"
        >
          {label}
          {required && <span className="text-accent-orange ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        <select
          ref={ref}
          id={selectId}
          name={name}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={
            error ? errorId : helperText ? helperId : undefined
          }
          className={`w-full bg-surface-elevated text-paper text-xs sm:text-sm rounded-sm border appearance-none px-3 pr-9 py-2 h-10 transition-all duration-150 outline-none
            ${
              error
                ? 'border-status-danger/70 focus:border-status-danger focus:ring-1 focus:ring-status-danger'
                : 'border-surface-border hover:border-surface-border-hover focus:border-accent-orange focus:ring-1 focus:ring-accent-orange/40'
            }
            disabled:opacity-50 disabled:cursor-not-allowed
            ${className}`}
          {...props}
        >
          {placeholder && <option value="" disabled className="bg-surface-elevated text-text-muted">{placeholder}</option>}
          {options.map((opt) => {
            const value = typeof opt === 'object' ? opt.value : opt;
            const labelText = typeof opt === 'object' ? opt.label : opt;
            return (
              <option key={value} value={value} className="bg-surface-elevated text-paper">
                {labelText}
              </option>
            );
          })}
        </select>

        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-text-muted">
          <ChevronDown className="w-4 h-4" aria-hidden="true" />
        </div>
      </div>

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

export default Select;
