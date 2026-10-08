import React from 'react';
import { Terminal, Check, Info } from 'lucide-react';
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
    <div className={`p-5 rounded-none bg-retro-surface border border-retro-orange shadow-panel transition-all duration-300 animate-slide-up font-mono ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-3 border-b border-retro-border pb-2.5">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-sm bg-retro-surface-elevated border border-retro-orange/60 text-retro-orange">
            <Terminal className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-retro-muted uppercase tracking-wider">[ SUBROUTINE // NLP_PARSER ]</div>
            <h4 className="text-xs font-bold text-retro-paper tracking-wider uppercase">
              AI Requirement Analysis
            </h4>
          </div>
        </div>
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-none bg-retro-orange/15 text-retro-orange border border-retro-orange/40">
          CONFIDENCE: {confidence}%
        </span>
      </div>

      {/* Summary */}
      <div className="text-xs text-retro-paper/80 mb-3 bg-retro-surface-elevated p-3 border border-retro-border font-sans leading-relaxed">
        {summary}
      </div>

      {/* Detected Skills */}
      <div className="mb-4 space-y-1.5">
        <div className="text-[10px] font-mono uppercase tracking-widest text-retro-muted">
          // DETECTED COMPETENCY VECTORS:
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
            <span className="text-xs text-retro-muted italic">
              No matching skill vectors detected.
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="pt-2.5 border-t border-retro-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1.5 text-[10px] text-retro-muted">
          <Info className="w-3.5 h-3.5 text-retro-amber flex-shrink-0" />
          <span>PROTOTYPE: results are simulated from mock data.</span>
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
