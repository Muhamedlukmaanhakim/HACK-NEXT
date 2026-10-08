import React from 'react';
import Avatar from '../ui/Avatar';
import SkillBadge from '../skills/SkillBadge';
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
    <div className={`p-5 bg-white border-2 border-ink shadow-brutal flex flex-col justify-between group ${className}`}>
      <div>
        <div className="flex items-start justify-between gap-3 mb-3 pb-3 border-b-2 border-ink">
          <div className="flex items-start gap-3">
            <Avatar name={name} size="md" className="border-2 border-ink" />
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="font-display font-black text-base text-ink uppercase tracking-tight">
                  {name}
                </h4>
                {isOwner && (
                  <Crown className="w-4 h-4 text-signal-yellow fill-signal-yellow stroke-ink stroke-[1.5]" aria-label="Team Lead" />
                )}
              </div>
              <p className="font-mono text-[11px] text-ink/70 uppercase font-semibold">
                {department} · {year}
              </p>
            </div>
          </div>
          <span className={`font-mono text-[10px] font-bold uppercase px-2 py-0.5 border border-ink ${
            isOwner ? 'bg-signal-yellow text-ink shadow-brutal-sm' : 'bg-canvas text-ink'
          }`}>
            {isOwner ? 'PROJECT LEAD' : role.toUpperCase()}
          </span>
        </div>

        {/* Skills */}
        <div className="space-y-1.5 mb-4">
          <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-ink/60">
            KEY COMPETENCIES:
          </div>
          <div className="flex flex-wrap gap-1.5">
            {skills.slice(0, 4).map((skill) => (
              <SkillBadge key={skill} skill={skill} size="xs" />
            ))}
          </div>
        </div>
      </div>

      <div className="pt-3 border-t-2 border-ink flex items-center justify-between text-xs">
        <span className="font-mono text-[10px] font-bold text-campus-green flex items-center gap-1 uppercase">
          <span className="w-2 h-2 rounded-full bg-campus-green border border-ink inline-block" />
          ACTIVE SQUAD
        </span>
        {!isOwner && onRemove && (
          <Button
            variant="outline"
            size="sm"
            icon={Trash2}
            onClick={() => onRemove(member)}
            className="text-xs text-brutal-red hover:bg-brutal-red hover:text-white px-2 py-1"
          >
            REMOVE
          </Button>
        )}
      </div>
    </div>
  );
}
