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
    <div className={`p-5 rounded-2xl bg-surface border border-surface-border hover:border-surface-border-hover transition-all duration-200 flex flex-col justify-between group ${className}`}>
      <div>
        {/* Top Meta */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <Badge variant="teal" size="sm">
            {type}
          </Badge>
          <div className="flex items-center gap-2">
            {matchScore !== undefined && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-accent-indigo/15 text-indigo-300 border border-accent-indigo/30">
                {matchScore}% Match
              </span>
            )}
            <Badge variant={statusVariant} size="sm">
              {status}
            </Badge>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-base font-semibold text-text-primary group-hover:text-accent-indigo transition-colors mb-1.5 tracking-tight">
          {title}
        </h3>

        {/* Creator Info */}
        <div className="flex items-center gap-2 mb-3">
          <Avatar name={creator?.name || 'Lead'} size="xs" />
          <span className="text-xs text-text-secondary">
            Lead: <strong className="text-text-primary font-medium">{creator?.name}</strong> ({creator?.department || 'CSE'})
          </span>
        </div>

        {/* Description */}
        <p className="text-xs text-text-secondary line-clamp-2 mb-4 leading-relaxed">
          {description}
        </p>

        {/* Required Skills */}
        <div className="space-y-1.5 mb-4">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">
            Looking for:
          </div>
          <div className="flex flex-wrap gap-1.5">
            {requiredSkills.slice(0, 4).map((skill) => (
              <SkillBadge key={skill} skill={skill} size="xs" />
            ))}
            {requiredSkills.length > 4 && (
              <span className="text-[10px] text-text-muted px-2 py-0.5 rounded-full bg-surface-elevated border border-surface-border">
                +{requiredSkills.length - 4} more
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-3 border-t border-surface-border/60 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2 overflow-hidden">
            {currentMembers.slice(0, 3).map((m) => (
              <Avatar key={m.id || m.name} name={m.name} size="xs" className="ring-2 ring-surface" />
            ))}
          </div>
          <span className="text-xs text-text-muted flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            <span>{memberCount}/{teamSize}</span>
          </span>
        </div>

        <Button
          variant="outline"
          size="sm"
          icon={ArrowRight}
          iconPosition="right"
          onClick={() => onView && onView(opportunity)}
        >
          View
        </Button>
      </div>
    </div>
  );
}
