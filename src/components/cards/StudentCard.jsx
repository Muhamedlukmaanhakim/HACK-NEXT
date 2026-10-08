import React from 'react';
import Avatar from '../ui/Avatar';
import SkillBadge from '../skills/SkillBadge';
import Button from '../ui/Button';
import { UserCheck, UserPlus, Clock } from 'lucide-react';

export default function StudentCard({
  student,
  isRequested = false,
  onConnect,
  onViewProfile,
  matchScore,
  className = '',
}) {
  const {
    id,
    name,
    department,
    year,
    bio,
    skills = [],
    availability = [],
  } = student;

  return (
    <div className={`p-5 rounded-2xl bg-surface border border-surface-border hover:border-surface-border-hover transition-all duration-200 flex flex-col justify-between group ${className}`}>
      <div>
        {/* Top Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <Avatar name={name} size="md" />
            <div>
              <h3 className="text-sm font-semibold text-text-primary group-hover:text-accent-teal transition-colors">
                {name}
              </h3>
              <p className="text-xs text-text-secondary">
                {department} • {year}
              </p>
            </div>
          </div>
          {matchScore !== undefined && (
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-accent-teal/15 text-accent-teal border border-accent-teal/30">
              {matchScore}% Match
            </span>
          )}
        </div>

        {/* Bio */}
        <p className="text-xs text-text-secondary line-clamp-2 mb-4 leading-relaxed">
          {bio || 'Enthusiastic collaborator looking to build impactful projects with like-minded peers.'}
        </p>

        {/* Skills */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-1.5">
            {skills.slice(0, 4).map((skill) => (
              <SkillBadge key={skill} skill={skill} size="sm" />
            ))}
            {skills.length > 4 && (
              <span className="text-[11px] text-text-muted px-2 py-0.5 rounded-full bg-surface-elevated border border-surface-border">
                +{skills.length - 4} more
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Footer / Actions */}
      <div className="pt-3 border-t border-surface-border/60 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1 text-[11px] text-text-muted">
          <Clock className="w-3 h-3 flex-shrink-0" />
          <span className="truncate max-w-[110px]">{availability[0] || 'Flexible'}</span>
        </div>

        <div className="flex items-center gap-2">
          {onViewProfile && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onViewProfile(student)}
            >
              Profile
            </Button>
          )}

          <Button
            variant={isRequested ? 'secondary' : 'primary'}
            size="sm"
            disabled={isRequested}
            icon={isRequested ? UserCheck : UserPlus}
            onClick={() => !isRequested && onConnect && onConnect(student)}
          >
            {isRequested ? 'Request Sent' : 'Connect'}
          </Button>
        </div>
      </div>
    </div>
  );
}
