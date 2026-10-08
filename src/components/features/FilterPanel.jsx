import React from 'react';
import { Filter, X, RotateCcw } from 'lucide-react';
import Button from '../ui/Button';

export default function FilterPanel({
  filters = {},
  onChange,
  onReset,
  options = {},
  isOpen = false,
  onClose,
  className = '',
}) {
  const {
    department = '',
    year = '',
    category = '',
    availability = '',
    projectType = '',
  } = filters;

  const activeCount = Object.values(filters).filter(Boolean).length;

  const content = (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-3 border-b-2 border-ink">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-ink stroke-[2.5]" />
          <h3 className="font-display font-bold text-xs uppercase tracking-wider text-ink">
            FILTERS
          </h3>
          {activeCount > 0 && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 bg-signal-yellow text-ink border border-ink">
              {activeCount} ACTIVE
            </span>
          )}
        </div>
        {activeCount > 0 && (
          <button
            type="button"
            onClick={onReset}
            className="text-[11px] font-mono font-bold text-brutal-red hover:underline flex items-center gap-1 transition-colors uppercase tracking-wider"
          >
            <RotateCcw className="w-3 h-3 stroke-[2.5]" />
            <span>RESET</span>
          </button>
        )}
      </div>

      {/* Department Filter */}
      {options.departments && (
        <div className="space-y-1.5">
          <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-ink/70">
            DEPARTMENT
          </label>
          <select
            value={department}
            onChange={(e) => onChange({ ...filters, department: e.target.value })}
            className="w-full bg-canvas text-ink text-xs font-mono border-2 border-ink p-2 outline-none focus:border-brutal-red focus:bg-white transition-colors"
          >
            <option value="">ALL DEPARTMENTS</option>
            {options.departments.map((dept) => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>
      )}

      {/* Year Filter */}
      {options.years && (
        <div className="space-y-1.5">
          <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-ink/70">
            YEAR OF STUDY
          </label>
          <select
            value={year}
            onChange={(e) => onChange({ ...filters, year: e.target.value })}
            className="w-full bg-canvas text-ink text-xs font-mono border-2 border-ink p-2 outline-none focus:border-brutal-red focus:bg-white transition-colors"
          >
            <option value="">ALL YEARS</option>
            {options.years.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      )}

      {/* Category Filter */}
      {options.categories && (
        <div className="space-y-1.5">
          <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-ink/70">
            DISCIPLINE
          </label>
          <select
            value={category}
            onChange={(e) => onChange({ ...filters, category: e.target.value })}
            className="w-full bg-canvas text-ink text-xs font-mono border-2 border-ink p-2 outline-none focus:border-brutal-red focus:bg-white transition-colors"
          >
            <option value="">ALL DISCIPLINES</option>
            {options.categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      )}

      {/* Project Type Filter (for opportunities) */}
      {options.projectTypes && (
        <div className="space-y-1.5">
          <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-ink/70">
            PROJECT TYPE
          </label>
          <select
            value={projectType}
            onChange={(e) => onChange({ ...filters, projectType: e.target.value })}
            className="w-full bg-canvas text-ink text-xs font-mono border-2 border-ink p-2 outline-none focus:border-brutal-red focus:bg-white transition-colors"
          >
            <option value="">ALL TYPES</option>
            {options.projectTypes.map((pt) => (
              <option key={pt} value={pt}>{pt}</option>
            ))}
          </select>
        </div>
      )}

      {/* Availability Filter */}
      {options.availabilities && (
        <div className="space-y-1.5">
          <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-ink/70">
            AVAILABILITY
          </label>
          <select
            value={availability}
            onChange={(e) => onChange({ ...filters, availability: e.target.value })}
            className="w-full bg-canvas text-ink text-xs font-mono border-2 border-ink p-2 outline-none focus:border-brutal-red focus:bg-white transition-colors"
          >
            <option value="">ANY SCHEDULE</option>
            {options.availabilities.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Panel */}
      <div className={`hidden lg:block p-5 bg-white border-2 border-ink shadow-brutal ${className}`}>
        {content}
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
          <div
            className="fixed inset-0 bg-ink/70 backdrop-blur-xs"
            onClick={onClose}
          />
          <div className="relative w-full max-w-xs bg-canvas border-l-4 border-ink h-full p-6 overflow-y-auto z-10 font-mono shadow-brutal-xl">
            <div className="flex items-center justify-between pb-3 mb-4 border-b-2 border-ink">
              <span className="font-display font-bold text-sm text-ink uppercase tracking-wider">FILTERS</span>
              <button
                type="button"
                onClick={onClose}
                className="p-1 border border-ink bg-white text-ink hover:bg-signal-yellow"
              >
                <X className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
            {content}
            <div className="mt-6 pt-4 border-t-2 border-ink">
              <Button variant="primary" className="w-full text-xs" onClick={onClose}>
                APPLY FILTERS
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
