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
          {label && <div className="text-xs font-mono font-bold uppercase text-ink">{label}</div>}
          {description && <div className="text-xs text-ink/70 mt-0.5 font-sans leading-relaxed">{description}</div>}
        </label>
      )}

      <button
        id={toggleId}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-none border-2 border-ink transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed ${
          checked ? 'bg-campus-green' : 'bg-canvas'
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-4 w-4 my-auto transform bg-ink transition duration-150 ease-in-out ${
            checked ? 'translate-x-5 bg-ink' : 'translate-x-0.5 bg-ink/40'
          }`}
        />
      </button>
    </div>
  );
}
