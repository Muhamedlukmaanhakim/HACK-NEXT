import React from 'react';
import Avatar from '../ui/Avatar';
import SkillBadge from '../skills/SkillBadge';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { Mail, GraduationCap, Calendar, Award } from 'lucide-react';

export default function ProfileCard({
  student,
  isOwnProfile = false,
  onEdit,
  className = '',
}) {
  const {
    name,
    email,
    department,
    year,
    bio,
    skills = [],
    interests = [],
    achievements = [],
    availability = [],
  } = student;

  return (
    <div className={`p-6 rounded-2xl bg-surface border border-surface-border ${className}`}>
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <Avatar name={name} size="xl" />
          <div>
            <h2 className="text-xl font-bold text-text-primary tracking-tight">
              {name}
            </h2>
            <div className="flex items-center gap-2 text-xs text-text-secondary mt-1 flex-wrap">
              <span className="flex items-center gap-1">
                <GraduationCap className="w-3.5 h-3.5 text-accent-indigo" />
                {department} • {year}
              </span>
              {email && (
                <span className="flex items-center gap-1 text-text-muted">
                  <Mail className="w-3.5 h-3.5" />
                  {email}
                </span>
              )}
            </div>
          </div>
        </div>

        {isOwnProfile && onEdit && (
          <Button variant="secondary" size="sm" onClick={onEdit}>
            Edit Profile
          </Button>
        )}
      </div>

      {/* Bio */}
      <div className="mb-6">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
          About
        </h4>
        <p className="text-sm text-text-secondary leading-relaxed bg-surface-elevated/40 p-3.5 rounded-xl border border-surface-border">
          {bio || 'Passionate student eager to collaborate and build high-impact projects.'}
        </p>
      </div>

      {/* Skills */}
      <div className="mb-6">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-2.5">
          Skills & Expertise
        </h4>
        <div className="flex flex-wrap gap-1.5">
          {skills.map((skill) => (
            <SkillBadge key={skill} skill={skill} size="sm" />
          ))}
        </div>
      </div>

      {/* Interests & Availability */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
            Interests
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {interests.map((interest) => (
              <Badge key={interest} variant="teal" size="sm">
                {interest}
              </Badge>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
            Availability
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {availability.map((avail) => (
              <Badge key={avail} variant="default" size="sm">
                <Calendar className="w-3 h-3 mr-1 text-text-muted" />
                {avail}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Achievements */}
      {achievements.length > 0 && (
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
            Achievements
          </h4>
          <ul className="space-y-1.5 text-xs text-text-secondary">
            {achievements.map((ach, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <Award className="w-3.5 h-3.5 text-accent-indigo flex-shrink-0" />
                <span>{ach}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
