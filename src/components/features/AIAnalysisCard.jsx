import React from 'react';
import { Sparkles, Plus, Check, Info } from 'lucide-react';
import Button from '../ui/Button';
import SkillBadge from '../skills/SkillBadge';

export default function AIAnalysisCard({
  analysis,
  onApplySkills,
  onRemoveSkill,
  onAddCustomSkill,
  className = '',
}) {
  if (!analysis) return null;

  const {
    skills = [],
    summary = 'Extracted high-priority project disciplines based on provided context.',
    confidence = 94,
  } = analysis;

  return (
    <div className={`p-5 rounded-2xl bg-gradient-to-br from-surface-elevated via-surface to-surface-elevated border border-accent-indigo/30 shadow-glow-indigo transition-all duration-300 animate-slide-up ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-accent-indigo/20 text-accent-indigo">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-text-primary tracking-tight">
              AI Requirement Analysis
            </h4>
            <p className="text-[11px] text-indigo-300">
              Natural Language Requirement Extraction ({confidence}% confidence)
            </p>
          </div>
        </div>
        <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-accent-indigo/20 text-indigo-300 border border-accent-indigo/30">
          Detected
        </span>
      </div>

      {/* Summary */}
      <p className="text-xs text-text-secondary mb-4 leading-relaxed bg-surface/60 p-3 rounded-xl border border-surface-border">
        {summary}
      </p>

      {/* Detected Skills */}
      <div className="mb-4 space-y-2">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">
          Recommended Skill Requirements:
        </div>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <SkillBadge
              key={skill}
              skill={skill}
              size="md"
              onRemove={onRemoveSkill ? () => onRemoveSkill(skill) : undefined}
            />
          ))}
          {skills.length === 0 && (
            <span className="text-xs text-text-muted italic">
              No matching skills detected in description.
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="pt-3 border-t border-surface-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 text-[11px] text-text-muted">
          <Info className="w-3.5 h-3.5 text-accent-teal flex-shrink-0" />
          <span>Prototype: results are simulated from mock data.</span>
        </div>

        {onApplySkills && skills.length > 0 && (
          <Button
            variant="primary"
            size="sm"
            icon={Check}
            onClick={onApplySkills}
          >
            Apply to Required Skills
          </Button>
        )}
      </div>
    </div>
  );
}
