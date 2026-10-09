import React from 'react';
import Button from '../ui/Button';

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
    teamSize = 5,
    currentMembers = [],
    status = 'Open',
  } = opportunity;

  const memberCount = currentMembers.length || 3;
  const numId = id ? String(id).replace(/\D/g, '') || '014' : '014';
  const paddedId = numId.length < 3 ? `00${numId}`.slice(-3) : numId;

  return (
    <div
      className={`p-4 bg-white border-2 border-ink shadow-brutal-sm hover:shadow-brutal hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all duration-150 flex flex-col justify-between group ${className}`}
    >
      <div className="space-y-2.5">
        {/* Top Header: PROJECT / 014 */}
        <div className="flex items-center justify-between border-b border-ink/20 pb-2 text-[10px] font-mono font-bold">
          <span className="text-ink/60 uppercase">
            PROJECT / {paddedId}
          </span>
          <div className="flex items-center gap-1.5">
            {matchScore !== undefined && (
              <span className="bg-signal-yellow text-ink px-1.5 py-0.5 border border-ink">
                {matchScore}% MATCH
              </span>
            )}
            <span className="bg-white text-ink px-1.5 py-0.5 border border-ink uppercase">
              STATUS: {status.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Project Title */}
        <h3 className="font-display font-black text-base sm:text-lg text-ink uppercase tracking-tight leading-snug group-hover:text-brutal-red transition-colors">
          {title}
        </h3>

        {/* Project Meta */}
        <div className="flex items-center justify-between text-[11px] font-mono font-bold text-ink/70">
          <span>TEAM: {memberCount < 10 ? `0${memberCount}` : memberCount} / {teamSize < 10 ? `0${teamSize}` : teamSize}</span>
          <span className="text-ink/40">// {type?.toUpperCase()}</span>
        </div>

        <div className="editorial-separator" />

        {/* Looking For */}
        <div className="space-y-1">
          <div className="text-[10px] font-mono font-bold text-ink/50 uppercase">
            LOOKING FOR:
          </div>
          <p className="text-xs font-mono font-bold text-ink uppercase tracking-wide">
            {requiredSkills.slice(0, 3).join(' · ')}
            {requiredSkills.length > 3 && ` · +${requiredSkills.length - 3}`}
          </p>
        </div>

        {/* Description snippet */}
        <p className="text-xs text-ink/75 font-sans line-clamp-2 leading-relaxed">
          {description}
        </p>
      </div>

      {/* Footer CTA */}
      <div className="pt-3 mt-3 border-t-2 border-ink flex items-center justify-between">
        <span className="text-[10px] font-mono text-ink/60 uppercase">
          BY {creator?.name?.split(' ')[0]?.toUpperCase() || 'LEAD'}
        </span>
        <Button
          variant="primary"
          size="sm"
          className="text-xs px-2.5 py-1"
          onClick={() => onView && onView(opportunity)}
        >
          [ VIEW DOSSIER → ]
        </Button>
      </div>
    </div>
  );
}
