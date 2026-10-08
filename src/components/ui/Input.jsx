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
    <div className="w-full space-y-1 font-sans">
      {label && (
        <label
          htmlFor={inputId}
          className="flex items-center justify-between text-xs font-mono font-bold uppercase tracking-wider text-ink"
        >
          <span>
            {label}
            {required && <span className="text-brutal-red ml-1">*</span>}
          </span>
          <span className="text-[10px] text-ink/40 select-none">// INPUT</span>
        </label>
      )}

      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-ink/60">
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
          className={`w-full bg-white text-ink placeholder:text-ink/40 text-sm border-2 border-ink rounded-none transition-all duration-150 outline-none
            ${Icon ? 'pl-9' : 'pl-3'}
            ${IconRight ? 'pr-9' : 'pr-3'}
            py-2 h-11
            ${
              error
                ? 'border-brutal-red bg-brutal-red/5 focus:border-brutal-red'
                : 'hover:border-black focus:border-brutal-red focus:shadow-brutal-sm'
            }
            disabled:opacity-50 disabled:cursor-not-allowed
            ${className}`}
          {...props}
        />

        {IconRight && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-ink/60">
            <IconRight className="w-4 h-4" aria-hidden="true" />
          </div>
        )}
      </div>

      {error ? (
        <p id={errorId} className="text-xs font-mono text-brutal-red font-bold flex items-center gap-1">
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

export default Input;
