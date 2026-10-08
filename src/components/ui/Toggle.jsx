import React from 'react';

export default function Toggle({
  checked = false,
  onChange,
  label,
  description,
  disabled = false,
  id,
  className = '',
}) {
  const toggleId = id || Math.random().toString(36).substr(2, 9);

  return (
    <div className={`flex items-start justify-between gap-4 select-none ${className}`}>
      {(label || description) && (
        <label htmlFor={toggleId} className="cursor-pointer flex-1">
          {label && <div className="text-sm font-medium text-text-primary">{label}</div>}
          {description && <div className="text-xs text-text-muted mt-0.5">{description}</div>}
        </label>
      )}

      <button
        id={toggleId}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-indigo focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed ${
          checked ? 'bg-accent-indigo' : 'bg-surface-elevated border border-surface-border'
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
}
