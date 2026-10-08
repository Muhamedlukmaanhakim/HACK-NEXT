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
          {label && <div className="text-sm font-mono font-medium text-retro-paper">{label}</div>}
          {description && <div className="text-xs text-retro-muted mt-0.5 font-sans">{description}</div>}
        </label>
      )}

      <button
        id={toggleId}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={`relative inline-flex h-5 w-10 flex-shrink-0 cursor-pointer rounded-none border border-retro-border transition-colors duration-200 ease-in-out focus-visible:outline-none disabled:opacity-50 disabled:cursor-not-allowed ${
          checked ? 'bg-retro-orange' : 'bg-retro-surface-elevated'
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-3.5 w-4 my-auto transform bg-retro-bg border border-retro-border transition duration-150 ease-in-out ${
            checked ? 'translate-x-5 bg-retro-paper' : 'translate-x-0.5'
          }`}
        />
      </button>
    </div>
  );
}
