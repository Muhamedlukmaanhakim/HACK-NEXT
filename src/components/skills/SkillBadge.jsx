import React from 'react';

/**
 * Skill category color map
 */
const CATEGORY_COLORS = {
  Technical: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30 hover:border-indigo-500/50',
  Creative: 'bg-pink-500/15 text-pink-300 border-pink-500/30 hover:border-pink-500/50',
  Communication: 'bg-amber-500/15 text-amber-300 border-amber-500/30 hover:border-amber-500/50',
  Research: 'bg-teal-500/15 text-teal-300 border-teal-500/30 hover:border-teal-500/50',
  Business: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30 hover:border-emerald-500/50',
  Leadership: 'bg-violet-500/15 text-violet-300 border-violet-500/30 hover:border-violet-500/50',
  Default: 'bg-surface-elevated text-text-secondary border-surface-border',
};

// Skill to category mapping helper for quick inference
const SKILL_CATEGORY_MAP = {
  // Technical
  'Python': 'Technical',
  'C/C++': 'Technical',
  'C': 'Technical',
  'Java': 'Technical',
  'JavaScript': 'Technical',
  'React': 'Technical',
  'AI/ML': 'Technical',
  'Data Science': 'Technical',
  'Cybersecurity': 'Technical',
  'IoT': 'Technical',
  'Robotics': 'Technical',
  'Cloud': 'Technical',
  'App Dev': 'Technical',
  'Backend': 'Technical',
  'APIs': 'Technical',
  'Databases': 'Technical',
  'Frontend': 'Technical',
  'Frontend Development': 'Technical',
  'Full Stack': 'Technical',

  // Creative
  'UI/UX': 'Creative',
  'UI/UX Design': 'Creative',
  'Figma': 'Creative',
  'Graphic Design': 'Creative',
  'Photography': 'Creative',
  'Videography': 'Creative',
  'Video Editing': 'Creative',
  'Motion Graphics': 'Creative',
  '3D Design': 'Creative',
  'Animation': 'Creative',
  'Branding': 'Creative',

  // Communication
  'Public Speaking': 'Communication',
  'Presentation': 'Communication',
  'Content/Script Writing': 'Communication',
  'Storytelling': 'Communication',
  'Technical Writing': 'Communication',
  'Documentation': 'Communication',

  // Business
  'Marketing': 'Business',
  'Social Media': 'Business',
  'Event Management': 'Business',
  'Entrepreneurship': 'Business',
  'Product Management': 'Business',

  // Research
  'Research': 'Research',
  'Data Analysis': 'Research',
  'Academic Writing': 'Research',
  'Literature Review': 'Research',

  // Leadership
  'Leadership': 'Leadership',
  'Team Management': 'Leadership',
  'Agile/Scrum': 'Leadership',
};

export function getSkillCategory(skillName) {
  return SKILL_CATEGORY_MAP[skillName] || 'Technical';
}

export default function SkillBadge({
  skill,
  category,
  size = 'md',
  onRemove,
  clickable = false,
  onClick,
  className = '',
}) {
  const resolvedCategory = category || getSkillCategory(skill) || 'Default';
  const colorClass = CATEGORY_COLORS[resolvedCategory] || CATEGORY_COLORS.Default;

  const sizeClasses = {
    xs: 'text-[10px] px-2 py-0.5 gap-1',
    sm: 'text-[11px] px-2.5 py-0.5 gap-1.5',
    md: 'text-xs px-3 py-1 gap-1.5',
    lg: 'text-sm px-3.5 py-1.5 gap-2',
  };

  return (
    <span
      onClick={clickable ? onClick : undefined}
      className={`inline-flex items-center font-medium rounded-full border transition-all duration-150 select-none
        ${colorClass}
        ${sizeClasses[size] || sizeClasses.md}
        ${clickable ? 'cursor-pointer active:scale-95' : ''}
        ${className}`}
    >
      <span>{skill}</span>
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(skill);
          }}
          className="ml-0.5 -mr-1 p-0.5 rounded-full hover:bg-white/20 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white"
          aria-label={`Remove ${skill}`}
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </span>
  );
}
