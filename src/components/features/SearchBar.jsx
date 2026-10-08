import React from 'react';
import { Search, X } from 'lucide-react';

export default function SearchBar({
  value = '',
  onChange,
  placeholder = 'SEARCH BY SKILL, NAME, DEPARTMENT, OR INTEREST...',
  className = '',
}) {
  return (
    <div className={`relative flex items-center w-full ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ink">
        <Search className="w-4 h-4 stroke-[2.5]" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-white text-ink placeholder:text-ink/40 font-mono text-xs sm:text-sm border-2 border-ink pl-10 pr-9 py-2.5 h-11 transition-all outline-none focus:bg-canvas focus:border-ink shadow-brutal-sm"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-ink/60 hover:text-ink font-bold"
          aria-label="Clear search input"
        >
          <X className="w-4 h-4 stroke-[2.5]" />
        </button>
      )}
    </div>
  );
}
