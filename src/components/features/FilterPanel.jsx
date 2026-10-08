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
    <div className="space-y-4 font-mono">
      <div className="flex items-center justify-between pb-2.5 border-b border-retro-border">
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-retro-orange" />
          <h3 className="text-xs font-bold text-retro-paper tracking-wider uppercase">
            PARAMETER FILTERS
          </h3>
          {activeCount > 0 && (
            <span className="text-[9px] font-bold px-1.5 py-0.2 bg-retro-orange text-retro-bg">
              {activeCount}
            </span>
          )}
        </div>
        {activeCount > 0 && (
          <button
            type="button"
            onClick={onReset}
            className="text-[10px] text-retro-amber hover:text-retro-orange flex items-center gap-1 transition-colors uppercase tracking-wider"
          >
            <RotateCcw className="w-2.5 h-2.5" />
            <span>[RESET]</span>
          </button>
        )}
      </div>

      {/* Department Filter */}
      {options.departments && (
        <div className="space-y-1">
          <label className="text-[10px] font-mono uppercase tracking-wider text-retro-muted">
            [ FIELD // DEPARTMENT ]
          </label>
          <select
            value={department}
            onChange={(e) => onChange({ ...filters, department: e.target.value })}
            className="w-full bg-retro-surface-elevated text-retro-paper text-xs rounded-none border border-retro-border p-2 outline-none focus:border-retro-orange"
          >
            <option value="">All Departments</option>
            {options.departments.map((dept) => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>
      )}

      {/* Year Filter */}
      {options.years && (
        <div className="space-y-1">
          <label className="text-[10px] font-mono uppercase tracking-wider text-retro-muted">
            [ FIELD // YEAR_OF_STUDY ]
          </label>
          <select
            value={year}
            onChange={(e) => onChange({ ...filters, year: e.target.value })}
            className="w-full bg-retro-surface-elevated text-retro-paper text-xs rounded-none border border-retro-border p-2 outline-none focus:border-retro-orange"
          >
            <option value="">All Years</option>
            {options.years.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      )}

      {/* Category Filter */}
      {options.categories && (
        <div className="space-y-1">
          <label className="text-[10px] font-mono uppercase tracking-wider text-retro-muted">
            [ FIELD // SKILL_DISCIPLINE ]
          </label>
          <select
            value={category}
            onChange={(e) => onChange({ ...filters, category: e.target.value })}
            className="w-full bg-retro-surface-elevated text-retro-paper text-xs rounded-none border border-retro-border p-2 outline-none focus:border-retro-orange"
          >
            <option value="">All Disciplines</option>
            {options.categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      )}

      {/* Project Type Filter (for opportunities) */}
      {options.projectTypes && (
        <div className="space-y-1">
          <label className="text-[10px] font-mono uppercase tracking-wider text-retro-muted">
            [ FIELD // COLLAB_TYPE ]
          </label>
          <select
            value={projectType}
            onChange={(e) => onChange({ ...filters, projectType: e.target.value })}
            className="w-full bg-retro-surface-elevated text-retro-paper text-xs rounded-none border border-retro-border p-2 outline-none focus:border-retro-orange"
          >
            <option value="">All Types</option>
            {options.projectTypes.map((pt) => (
              <option key={pt} value={pt}>{pt}</option>
            ))}
          </select>
        </div>
      )}

      {/* Availability Filter */}
      {options.availabilities && (
        <div className="space-y-1">
          <label className="text-[10px] font-mono uppercase tracking-wider text-retro-muted">
            [ FIELD // AVAILABILITY ]
          </label>
          <select
            value={availability}
            onChange={(e) => onChange({ ...filters, availability: e.target.value })}
            className="w-full bg-retro-surface-elevated text-retro-paper text-xs rounded-none border border-retro-border p-2 outline-none focus:border-retro-orange"
          >
            <option value="">Any Schedule</option>
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
      <div className={`hidden lg:block p-4 rounded-none bg-retro-surface border border-retro-border shadow-panel ${className}`}>
        {content}
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
          <div
            className="fixed inset-0 bg-retro-bg/85 backdrop-blur-sm"
            onClick={onClose}
          />
          <div className="relative w-full max-w-xs bg-retro-surface border-l border-retro-border h-full p-4 overflow-y-auto z-10 animate-slide-up font-mono">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-retro-border">
              <span className="text-xs font-bold text-retro-paper uppercase tracking-wider">[ PARAMETER FILTERS ]</span>
              <button
                type="button"
                onClick={onClose}
                className="p-1 text-retro-muted hover:text-retro-paper"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {content}
            <div className="mt-5 pt-3 border-t border-retro-border">
              <Button variant="primary" className="w-full font-mono text-xs" onClick={onClose}>
                [ APPLY PARAMETERS ]
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
