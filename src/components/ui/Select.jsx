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
    <div className="w-full space-y-1.5 font-mono">
      {label && (
        <label
          htmlFor={selectId}
          className="block text-xs font-mono font-bold uppercase tracking-wider text-ink/80"
        >
          {label}
          {required && <span className="text-brutal-red ml-1">*</span>}
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
          className={`w-full bg-white text-ink text-xs sm:text-sm border-2 appearance-none px-3.5 pr-9 py-2.5 h-11 transition-all duration-150 outline-none
            ${
              error
                ? 'border-brutal-red focus:border-brutal-red bg-brutal-red/5'
                : 'border-ink hover:bg-canvas focus:border-brutal-red focus:bg-canvas'
            }
            shadow-brutal-sm disabled:opacity-50 disabled:cursor-not-allowed
            ${className}`}
          {...props}
        >
          {placeholder && <option value="" disabled className="bg-white text-ink/40">{placeholder}</option>}
          {options.map((opt) => {
            const value = typeof opt === 'object' ? opt.value : opt;
            const labelText = typeof opt === 'object' ? opt.label : opt;
            return (
              <option key={value} value={value} className="bg-white text-ink font-mono font-semibold">
                {labelText}
              </option>
            );
          })}
        </select>

        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-ink">
          <ChevronDown className="w-4 h-4 stroke-[2.5]" aria-hidden="true" />
        </div>
      </div>

      {error && (
        <p id={errorId} className="text-xs text-brutal-red font-mono font-bold" role="alert">
          ERROR: {error}
        </p>
      )}

      {helperText && !error && (
        <p id={helperId} className="text-[11px] text-ink/60 font-mono">
          {helperText}
        </p>
      )}
    </div>
  );
});

export default Select;
