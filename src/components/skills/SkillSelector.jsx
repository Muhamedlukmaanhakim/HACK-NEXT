import React, { useState, useMemo } from 'react';
import { Search, Plus, Check } from 'lucide-react';
import SkillBadge, { getSkillCategory } from './SkillBadge';

const PRESET_SKILLS = [
  // Technical
  'Python', 'React', 'JavaScript', 'AI/ML', 'Backend', 'APIs', 'Databases',
  'Data Science', 'C/C++', 'Java', 'Cloud', 'App Dev', 'Cybersecurity', 'IoT',
  // Creative
  'UI/UX', 'Figma', 'Graphic Design', 'Video Editing', 'Photography', '3D Design', 'Branding',
  // Communication
  'Public Speaking', 'Presentation', 'Storytelling', 'Technical Writing', 'Documentation',
  // Business
  'Marketing', 'Social Media', 'Event Management', 'Entrepreneurship', 'Product Management',
  // Research
  'Research', 'Data Analysis', 'Academic Writing',
  // Leadership
  'Leadership', 'Team Management'
];

const CATEGORIES = ['All', 'Technical', 'Creative', 'Communication', 'Business', 'Research', 'Leadership'];

export default function SkillSelector({
  selectedSkills = [],
  onChange,
  maxSkills,
  label = 'Select Skills',
  placeholder = 'Search skills or select from categories...',
  className = '',
}) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSkills = useMemo(() => {
    return PRESET_SKILLS.filter((skill) => {
      const matchesCategory =
        activeCategory === 'All' || getSkillCategory(skill) === activeCategory;
      const matchesSearch = skill
        .toLowerCase()
        .includes(searchQuery.trim().toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const toggleSkill = (skill) => {
    if (selectedSkills.includes(skill)) {
      onChange(selectedSkills.filter((s) => s !== skill));
    } else {
      if (maxSkills && selectedSkills.length >= maxSkills) return;
      onChange([...selectedSkills, skill]);
    }
  };

  const handleCustomAdd = () => {
    const trimmed = searchQuery.trim();
    if (trimmed && !selectedSkills.includes(trimmed)) {
      onChange([...selectedSkills, trimmed]);
      setSearchQuery('');
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {label && (
        <div className="flex justify-between items-center">
          <label className="block text-xs font-semibold uppercase tracking-wider text-text-secondary">
            {label}
          </label>
          {maxSkills && (
            <span className="text-xs text-text-muted">
              {selectedSkills.length}/{maxSkills} selected
            </span>
          )}
        </div>
      )}

      {/* Selected Chips */}
      {selectedSkills.length > 0 && (
        <div className="flex flex-wrap gap-2 p-3 bg-surface-elevated/60 border border-surface-border rounded-xl min-h-[48px]">
          {selectedSkills.map((skill) => (
            <SkillBadge
              key={skill}
              skill={skill}
              onRemove={() => toggleSkill(skill)}
            />
          ))}
        </div>
      )}

      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={placeholder}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleCustomAdd();
            }
          }}
          className="w-full bg-surface-elevated text-text-primary placeholder:text-text-muted text-sm rounded-xl border border-surface-border hover:border-surface-border-hover focus:border-accent-indigo focus:ring-2 focus:ring-accent-indigo/20 pl-9 pr-20 py-2 transition-all outline-none"
        />
        {searchQuery.trim() && !PRESET_SKILLS.includes(searchQuery.trim()) && (
          <button
            type="button"
            onClick={handleCustomAdd}
            className="absolute right-2 top-1.5 bottom-1.5 px-2.5 bg-accent-indigo/20 text-accent-indigo hover:bg-accent-indigo/30 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors"
          >
            <Plus className="w-3 h-3" /> Add
          </button>
        )}
      </div>

      {/* Category Pills */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              activeCategory === cat
                ? 'bg-accent-indigo text-white'
                : 'bg-surface-elevated text-text-secondary hover:text-text-primary hover:bg-white/5 border border-surface-border'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Selectable Skill Chips Grid */}
      <div className="flex flex-wrap gap-2 max-h-44 overflow-y-auto p-1">
        {filteredSkills.map((skill) => {
          const isSelected = selectedSkills.includes(skill);
          return (
            <button
              key={skill}
              type="button"
              onClick={() => toggleSkill(skill)}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-all duration-150 ${
                isSelected
                  ? 'bg-accent-indigo text-white border-accent-indigo shadow-sm'
                  : 'bg-surface-elevated text-text-secondary border-surface-border hover:border-surface-border-hover hover:text-text-primary hover:bg-surface-hover'
              }`}
            >
              {isSelected ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
              <span>{skill}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
