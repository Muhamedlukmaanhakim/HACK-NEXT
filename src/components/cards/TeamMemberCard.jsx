import React from 'react';
import Avatar from '../ui/Avatar';
import SkillBadge from '../skills/SkillBadge';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { Trash2, Crown } from 'lucide-react';

export default function TeamMemberCard({
  member,
  isOwner = false,
  onRemove,
  className = '',
}) {
  const {
    id,
    name,
    department,
    year,
    role = 'Collaborator',
    skills = [],
  } = member;

  return (
    <div className={`p-4 sm:p-5 rounded-none bg-retro-surface border border-retro-border flex flex-col justify-between hover:border-retro-orange/60 transition-all shadow-panel relative font-mono ${className}`}>
      {/* Corner crosshairs */}
      <div className="absolute top-1 left-1 text-[8px] text-retro-muted/40 leading-none select-none">+</div>
      <div className="absolute top-1 right-1 text-[8px] text-retro-muted/40 leading-none select-none">+</div>

      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <Avatar name={name} size="md" />
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="text-xs sm:text-sm font-bold text-retro-paper tracking-wide">
                  {name}
                </h4>
                {isOwner && (
                  <Crown className="w-3.5 h-3.5 text-retro-amber" aria-label="Team Lead" />
                )}
              </div>
              <p className="text-[10px] text-retro-muted">
                {department} // {year}
              </p>
            </div>
          </div>
          <Badge variant={isOwner ? 'primary' : 'teal'} size="sm">
            {isOwner ? 'LEAD / OWNER' : role}
          </Badge>
        </div>

        {/* Skills */}
        <div className="space-y-1 mb-3">
          <div className="text-[9px] font-mono uppercase tracking-widest text-retro-muted">
            // CONTRIBUTIONS:
          </div>
          <div className="flex flex-wrap gap-1">
            {skills.slice(0, 4).map((skill) => (
              <SkillBadge key={skill} skill={skill} size="xs" />
            ))}
          </div>
        </div>
      </div>

      <div className="pt-2.5 border-t border-retro-border/60 flex items-center justify-between text-xs">
        <span className="text-[10px] text-retro-muted">
          {isOwner ? 'PROJECT CREATOR' : 'ACTIVE ROSTER'}
        </span>
        {!isOwner && onRemove && (
          <Button
            variant="ghost"
            size="sm"
            icon={Trash2}
            onClick={() => onRemove(member)}
            className="text-retro-red hover:bg-retro-red/10 hover:text-retro-red px-2"
          >
            Remove
          </Button>
        )}
      </div>
    </div>
  );
}
