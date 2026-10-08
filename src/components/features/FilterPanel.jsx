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
    <div className="space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-surface-border">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-accent-indigo" />
          <h3 className="text-sm font-semibold text-text-primary tracking-tight">
            Filters
          </h3>
          {activeCount > 0 && (
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-accent-indigo/20 text-indigo-300">
              {activeCount}
            </span>
          )}
        </div>
        {activeCount > 0 && (
          <button
            type="button"
            onClick={onReset}
            className="text-xs text-text-muted hover:text-accent-indigo flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Clear all</span>
          </button>
        )}
      </div>

      {/* Department Filter */}
      {options.departments && (
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-text-muted">
            Department
          </label>
          <select
            value={department}
            onChange={(e) => onChange({ ...filters, department: e.target.value })}
            className="w-full bg-surface-elevated text-text-primary text-xs rounded-xl border border-surface-border p-2 outline-none focus:border-accent-indigo"
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
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-text-muted">
            Year of Study
          </label>
          <select
            value={year}
            onChange={(e) => onChange({ ...filters, year: e.target.value })}
            className="w-full bg-surface-elevated text-text-primary text-xs rounded-xl border border-surface-border p-2 outline-none focus:border-accent-indigo"
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
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-text-muted">
            Skill Category
          </label>
          <select
            value={category}
            onChange={(e) => onChange({ ...filters, category: e.target.value })}
            className="w-full bg-surface-elevated text-text-primary text-xs rounded-xl border border-surface-border p-2 outline-none focus:border-accent-indigo"
          >
            <option value="">All Categories</option>
            {options.categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      )}

      {/* Project Type Filter (for opportunities) */}
      {options.projectTypes && (
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-text-muted">
            Collaboration Type
          </label>
          <select
            value={projectType}
            onChange={(e) => onChange({ ...filters, projectType: e.target.value })}
            className="w-full bg-surface-elevated text-text-primary text-xs rounded-xl border border-surface-border p-2 outline-none focus:border-accent-indigo"
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
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-text-muted">
            Availability
          </label>
          <select
            value={availability}
            onChange={(e) => onChange({ ...filters, availability: e.target.value })}
            className="w-full bg-surface-elevated text-text-primary text-xs rounded-xl border border-surface-border p-2 outline-none focus:border-accent-indigo"
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
      <div className={`hidden lg:block p-5 rounded-2xl bg-surface border border-surface-border ${className}`}>
        {content}
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm"
            onClick={onClose}
          />
          <div className="relative w-full max-w-xs bg-surface border-l border-surface-border h-full p-5 overflow-y-auto z-10 animate-slide-up">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-surface-border">
              <span className="text-base font-semibold text-text-primary">Filter Results</span>
              <button
                type="button"
                onClick={onClose}
                className="p-1 rounded-lg text-text-muted hover:text-text-primary"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {content}
            <div className="mt-6 pt-4 border-t border-surface-border">
              <Button variant="primary" className="w-full" onClick={onClose}>
                Apply Filters
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
