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
    <div className={`p-4 sm:p-5 rounded-none bg-retro-surface border border-retro-border hover:border-retro-orange/60 transition-all duration-150 flex flex-col justify-between group shadow-panel relative font-mono ${className}`}>
      {/* Corner crosshairs */}
      <div className="absolute top-1 left-1 text-[8px] text-retro-muted/40 leading-none select-none">+</div>
      <div className="absolute top-1 right-1 text-[8px] text-retro-muted/40 leading-none select-none">+</div>

      <div>
        {/* Top Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <Avatar name={name} size="md" />
            <div>
              <div className="text-[9px] text-retro-muted tracking-widest uppercase">
                [ NODE // {id?.toUpperCase() || 'STU'} ]
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-retro-paper group-hover:text-retro-amber transition-colors">
                {name}
              </h3>
              <p className="text-[10px] text-retro-muted">
                {department} // {year}
              </p>
            </div>
          </div>
          {matchScore !== undefined && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-none bg-retro-orange/15 text-retro-orange border border-retro-orange/40 tracking-wider">
              {matchScore >= 90 ? `${matchScore}% — STRONG MATCH` : `${matchScore}% MATCH`}
            </span>
          )}
        </div>

        {/* Bio */}
        <p className="text-xs text-retro-paper/70 font-sans line-clamp-2 mb-3 leading-relaxed">
          {bio || 'Enthusiastic collaborator looking to build impactful projects with like-minded peers.'}
        </p>

        {/* Skills */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            {skills.slice(0, 4).map((skill) => (
              <SkillBadge key={skill} skill={skill} size="xs" />
            ))}
            {skills.length > 4 && (
              <span className="text-[9px] font-mono text-retro-muted px-1.5 py-0.5 bg-retro-surface-elevated border border-retro-border">
                +{skills.length - 4} MORE
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Footer / Actions */}
      <div className="pt-2.5 border-t border-retro-border/60 flex items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1 text-[10px] text-retro-muted">
          <Clock className="w-3 h-3 flex-shrink-0" />
          <span className="truncate max-w-[100px]">{availability[0] || 'Flexible'}</span>
        </div>

        <div className="flex items-center gap-1.5">
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
            {isRequested ? 'Sent' : 'Connect'}
          </Button>
        </div>
      </div>
    </div>
  );
}
