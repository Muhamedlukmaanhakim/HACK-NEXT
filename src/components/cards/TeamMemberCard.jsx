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
    <div className={`p-5 rounded-2xl bg-surface border border-surface-border flex flex-col justify-between hover:border-surface-border-hover transition-all ${className}`}>
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <Avatar name={name} size="md" />
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="text-sm font-semibold text-text-primary tracking-tight">
                  {name}
                </h4>
                {isOwner && (
                  <Crown className="w-3.5 h-3.5 text-status-warning" aria-label="Team Lead" />
                )}
              </div>
              <p className="text-xs text-text-secondary">
                {department} • {year}
              </p>
            </div>
          </div>
          <Badge variant={isOwner ? 'primary' : 'teal'} size="sm">
            {isOwner ? 'Lead / Owner' : role}
          </Badge>
        </div>

        {/* Skills */}
        <div className="space-y-1.5 mb-4">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">
            Contributions:
          </div>
          <div className="flex flex-wrap gap-1.5">
            {skills.slice(0, 4).map((skill) => (
              <SkillBadge key={skill} skill={skill} size="xs" />
            ))}
          </div>
        </div>
      </div>

      <div className="pt-3 border-t border-surface-border/60 flex items-center justify-between">
        <span className="text-xs text-text-muted">
          {isOwner ? 'Project Creator' : 'Active Member'}
        </span>
        {!isOwner && onRemove && (
          <Button
            variant="ghost"
            size="sm"
            icon={Trash2}
            onClick={() => onRemove(member)}
            className="text-status-danger hover:bg-status-danger/10 hover:text-status-danger px-2"
          >
            Remove
          </Button>
        )}
      </div>
    </div>
  );
}
