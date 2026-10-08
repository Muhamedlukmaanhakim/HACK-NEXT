import React from 'react';
import SkillBadge from '../skills/SkillBadge';
import Button from '../ui/Button';
import Avatar from '../ui/Avatar';
import { Users, ArrowRight } from 'lucide-react';

export default function OpportunityCard({
  opportunity,
  onView,
  matchScore,
  className = '',
}) {
  const {
    id,
    title,
    description,
    type,
    creator,
    requiredSkills = [],
    teamSize = 4,
    currentMembers = [],
    status = 'Open',
  } = opportunity;

  const memberCount = currentMembers.length;
  const isFull = memberCount >= teamSize;

  return (
    <div className={`p-5 bg-white border-2 border-ink shadow-brutal hover:shadow-brutal-lg hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all duration-150 flex flex-col justify-between group ${className}`}>
      <div>
        {/* Top Header Bar */}
        <div className="flex items-center justify-between pb-2.5 mb-3 border-b-2 border-ink">
          <span className="font-mono text-[10px] font-bold text-ink uppercase tracking-wider bg-signal-yellow px-2 py-0.5 border border-ink">
            {type} // {id ? `0${id}`.slice(-3) : '014'}
          </span>
          <div className="flex items-center gap-1.5 font-mono text-[10px] font-bold">
            {matchScore !== undefined && (
              <span className="bg-brutal-red text-white px-2 py-0.5 border border-ink">
                {matchScore}% MATCH
              </span>
            )}
            <span className={`px-2 py-0.5 border border-ink ${
              isFull ? 'bg-ink text-white' : 'bg-campus-green text-ink'
            }`}>
              {status.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Title */}
        <h3 className="font-display font-black text-base sm:text-lg text-ink uppercase tracking-tight leading-snug group-hover:text-brutal-red transition-colors mb-2">
          {title}
        </h3>

        {/* Creator Info */}
        <div className="flex items-center gap-2 mb-3">
          <Avatar name={creator?.name || 'Lead'} size="xs" className="border border-ink" />
          <span className="text-[11px] font-mono text-ink/70 font-semibold uppercase">
            BY <strong className="text-ink">{creator?.name || 'Student Lead'}</strong> ({creator?.department || 'CS'} '{creator?.year ? creator.year.slice(-2) : '25'})
          </span>
        </div>

        {/* Description */}
        <p className="text-xs text-ink/80 font-sans line-clamp-2 mb-4 leading-relaxed">
          {description}
        </p>

        {/* Required Skills */}
        <div className="space-y-1.5 mb-4">
          <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-ink/60">
            NEEDED COMPETENCIES:
          </div>
          <div className="flex flex-wrap gap-1.5">
            {requiredSkills.slice(0, 4).map((skill) => (
              <SkillBadge key={skill} skill={skill} size="xs" />
            ))}
            {requiredSkills.length > 4 && (
              <span className="text-[10px] font-mono font-bold text-ink px-1.5 py-0.5 bg-canvas border border-ink">
                +{requiredSkills.length - 4} MORE
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Footer & Segmented Progress Bar */}
      <div className="pt-3 border-t-2 border-ink space-y-3">
        {/* Segmented Team Bar */}
        <div className="flex items-center justify-between text-xs font-mono font-bold">
          <span className="text-ink text-[11px]">
            {memberCount} / {teamSize} MEMBERS FILLED
          </span>
          <div className="flex items-center gap-1">
            {Array.from({ length: teamSize }).map((_, i) => (
              <div
                key={i}
                className={`w-4 h-2 border border-ink ${
                  i < memberCount ? 'bg-ink' : 'bg-canvas'
                }`}
              />
            ))}
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="w-full text-xs py-1.5 justify-center"
          onClick={() => onView && onView(opportunity)}
        >
          VIEW PROJECT →
        </Button>
      </div>
    </div>
  );
}
