import React from 'react';
import { Search, X } from 'lucide-react';

export default function SearchBar({
  value = '',
  onChange,
  placeholder = 'QUERY TELEMETRY (NAME, SKILL, DEPT)...',
  className = '',
}) {
  return (
    <div className={`relative flex items-center w-full font-mono ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-retro-muted">
        <Search className="w-3.5 h-3.5" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-retro-surface text-retro-paper placeholder:text-retro-muted text-xs rounded-none border border-retro-border hover:border-retro-orange/50 focus:border-retro-orange pl-9 pr-8 py-2 h-9 transition-colors outline-none tracking-wide"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-retro-muted hover:text-retro-paper"
          aria-label="Clear search input"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
