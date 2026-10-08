import React from 'react';
import { Check, Info, Sparkles } from 'lucide-react';
import Button from '../ui/Button';
import SkillBadge from '../skills/SkillBadge';

export default function AIAnalysisCard({
  analysis,
  onApplySkills,
  onRemoveSkill,
  className = '',
}) {
  if (!analysis) return null;

  const {
    skills = [],
    summary = 'Extracted high-priority project disciplines based on provided context.',
    confidence = 94,
  } = analysis;

  return (
    <div className={`p-5 bg-white border-2 border-ink shadow-brutal animate-slide-up ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b-2 border-ink">
        <div>
          <div className="text-[10px] font-mono font-bold text-brutal-red uppercase tracking-wider">
            NATURAL LANGUAGE PARSER // ANALYSIS COMPLETE
          </div>
          <h4 className="font-display font-black text-sm uppercase text-ink">
            PARSED COMPETENCIES IDENTIFIED
          </h4>
        </div>
        <span className="font-mono text-xs font-bold px-2 py-0.5 bg-signal-yellow text-ink border border-ink">
          CONFIDENCE {confidence}%
        </span>
      </div>

      {/* Summary */}
      <div className="text-xs font-sans text-ink/80 bg-canvas p-3 border-2 border-ink mb-4 leading-relaxed font-normal">
        {summary}
      </div>

      {/* Detected Skills */}
      <div className="mb-4 space-y-2">
        <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-ink/70">
          IDENTIFIED REQUIRED SKILLS ({skills.length}):
        </div>
        <div className="flex flex-wrap gap-1.5">
          {skills.map((skill) => (
            <SkillBadge
              key={skill}
              skill={skill}
              size="sm"
              onRemove={onRemoveSkill ? () => onRemoveSkill(skill) : undefined}
            />
          ))}
          {skills.length === 0 && (
            <span className="text-xs font-mono text-ink/50 uppercase">
              No matching skill vectors detected.
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="pt-3 border-t-2 border-ink flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 text-[11px] font-mono text-ink/60">
          <Info className="w-3.5 h-3.5 text-ink flex-shrink-0" />
          <span>SIMULATION: Mock requirement extraction engine.</span>
        </div>

        {onApplySkills && skills.length > 0 && (
          <Button
            variant="danger"
            size="sm"
            icon={Check}
            onClick={onApplySkills}
            className="text-xs font-bold"
          >
            MERGE SKILLS INTO PROJECT →
          </Button>
        )}
      </div>
    </div>
  );
}
