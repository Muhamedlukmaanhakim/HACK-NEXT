import React from 'react';
import SkillBadge from '../skills/SkillBadge';
import Badge from '../ui/Badge';
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
  const isAlmostFull = memberCount === teamSize - 1;
  const isFull = memberCount >= teamSize;

  const statusVariant = isFull ? 'danger' : isAlmostFull ? 'warning' : 'success';

  return (
    <div className={`p-4 sm:p-5 rounded-none bg-retro-surface border border-retro-border hover:border-retro-orange/60 transition-all duration-150 flex flex-col justify-between group shadow-panel relative font-mono ${className}`}>
      {/* Corner crosshairs */}
      <div className="absolute top-1 left-1 text-[8px] text-retro-muted/40 leading-none select-none">+</div>
      <div className="absolute top-1 right-1 text-[8px] text-retro-muted/40 leading-none select-none">+</div>

      <div>
        {/* Top Meta */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <Badge variant="teal" size="sm">
            {type}
          </Badge>
          <div className="flex items-center gap-1.5">
            {matchScore !== undefined && (
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-none bg-retro-orange/15 text-retro-orange border border-retro-orange/40">
                {matchScore}% MATCH
              </span>
            )}
            <Badge variant={statusVariant} size="sm">
              {status}
            </Badge>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-sm sm:text-base font-display font-bold text-retro-paper group-hover:text-retro-amber transition-colors mb-1.5 tracking-tight">
          {title}
        </h3>

        {/* Creator Info */}
        <div className="flex items-center gap-2 mb-2.5">
          <Avatar name={creator?.name || 'Lead'} size="xs" />
          <span className="text-[11px] text-retro-muted">
            LEAD: <strong className="text-retro-paper font-semibold">{creator?.name}</strong> ({creator?.department || 'CSE'})
          </span>
        </div>

        {/* Description */}
        <p className="text-xs text-retro-paper/70 font-sans line-clamp-2 mb-3 leading-relaxed">
          {description}
        </p>

        {/* Required Skills */}
        <div className="space-y-1 mb-3">
          <div className="text-[9px] font-mono uppercase tracking-widest text-retro-muted">
            // REQUIRED COMPETENCIES:
          </div>
          <div className="flex flex-wrap gap-1">
            {requiredSkills.slice(0, 4).map((skill) => (
              <SkillBadge key={skill} skill={skill} size="xs" />
            ))}
            {requiredSkills.length > 4 && (
              <span className="text-[9px] font-mono text-retro-muted px-1.5 py-0.2 bg-retro-surface-elevated border border-retro-border">
                +{requiredSkills.length - 4} MORE
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-2.5 border-t border-retro-border/60 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <div className="flex -space-x-1.5 overflow-hidden">
            {currentMembers.slice(0, 3).map((m) => (
              <Avatar key={m.id || m.name} name={m.name} size="xs" className="ring-1 ring-retro-surface" />
            ))}
          </div>
          <span className="text-[10px] text-retro-muted flex items-center gap-1 font-mono">
            <Users className="w-3 h-3" />
            <span>{memberCount}/{teamSize} ROLES</span>
          </span>
        </div>

        <Button
          variant="outline"
          size="sm"
          icon={ArrowRight}
          iconPosition="right"
          onClick={() => onView && onView(opportunity)}
        >
          [ INSPECT → ]
        </Button>
      </div>
    </div>
  );
}
