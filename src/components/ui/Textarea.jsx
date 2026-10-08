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
    <div className="w-full space-y-1 font-sans">
      <div className="flex justify-between items-center">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-mono font-bold uppercase tracking-wider text-ink"
          >
            {label}
            {required && <span className="text-brutal-red ml-1">*</span>}
          </label>
        )}
        {maxLength && (
          <span className="text-xs font-mono text-ink/60">
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
        className={`w-full bg-white text-ink placeholder:text-ink/40 text-sm rounded-none border-2 border-ink p-3 transition-all duration-150 outline-none resize-y
          ${
            error
              ? 'border-brutal-red bg-brutal-red/5 focus:border-brutal-red'
              : 'hover:border-black focus:border-brutal-red focus:shadow-brutal-sm'
          }
          disabled:opacity-50 disabled:cursor-not-allowed
          ${className}`}
        {...props}
      />

      {error ? (
        <p id={errorId} className="text-xs font-mono text-brutal-red font-bold">
          ERR: {error}
        </p>
      ) : helperText ? (
        <p id={helperId} className="text-[11px] font-mono text-ink/60">
          // {helperText}
        </p>
      ) : null}
    </div>
  );
});

export default Textarea;
