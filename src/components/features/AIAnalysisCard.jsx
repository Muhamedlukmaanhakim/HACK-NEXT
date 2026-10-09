import React from 'react';
import { ArrowDown } from 'lucide-react';
import Button from '../ui/Button';

export default function AIAnalysisCard({
  analysis,
  inputQuery = '',
  onApplySkills,
  className = '',
}) {
  if (!analysis) return null;

  const {
    skills = [],
    confidence = 94,
  } = analysis;

  return (
    <div className={`p-4 bg-white border-2 border-ink shadow-brutal font-mono animate-slide-up space-y-3 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between border-b-2 border-ink pb-2 text-[10px] font-bold">
        <span className="text-brutal-red uppercase">
          PROJECT ANALYSIS / 01
        </span>
        <span className="bg-signal-yellow text-ink px-1.5 py-0.5 border border-ink">
          ENGINE CONFIDENCE: {confidence}%
        </span>
      </div>

      {/* 1. INPUT */}
      <div className="space-y-1">
        <div className="text-[10px] font-bold text-ink/50 uppercase">INPUT</div>
        <p className="text-xs text-ink/90 font-mono italic bg-canvas p-2.5 border border-ink">
          "{inputQuery || 'I need someone who can design the interface and confidently present our project.'}"
        </p>
      </div>

      {/* Down arrow indicator */}
      <div className="flex justify-center text-ink/40">
        <ArrowDown className="w-4 h-4 stroke-[2.5]" />
      </div>

      {/* 2. REQUIREMENTS IDENTIFIED */}
      <div className="space-y-1.5">
        <div className="text-[10px] font-bold text-ink/50 uppercase">
          REQUIREMENTS IDENTIFIED
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 text-xs font-bold">
          {skills.map((skill) => (
            <div
              key={skill}
              className="p-2 border-2 border-ink bg-white text-ink text-center uppercase shadow-brutal-sm flex items-center justify-center"
            >
              {skill}
            </div>
          ))}
        </div>
      </div>

      {/* Down arrow indicator */}
      <div className="flex justify-center text-ink/40">
        <ArrowDown className="w-4 h-4 stroke-[2.5]" />
      </div>

      {/* 3. MATCHING PARAMETERS */}
      <div className="space-y-1">
        <div className="text-[10px] font-bold text-ink/50 uppercase">
          MATCHING PARAMETERS
        </div>
        <div className="flex flex-wrap gap-1 text-[11px] font-bold">
          {['SKILL', 'INTEREST', 'AVAILABILITY', 'EXPERIENCE', 'DOMAIN'].map((param) => (
            <span
              key={param}
              className="px-2 py-0.5 border border-ink bg-canvas text-ink uppercase"
            >
              {param}
            </span>
          ))}
        </div>
      </div>

      {/* Apply Action */}
      {onApplySkills && skills.length > 0 && (
        <div className="pt-2 border-t-2 border-ink flex justify-end">
          <Button
            variant="accent"
            size="sm"
            onClick={onApplySkills}
            className="text-xs font-bold"
          >
            [ MERGE INTO REQUIREMENTS → ]
          </Button>
        </div>
      )}
    </div>
  );
}
