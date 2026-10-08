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
  placeholder = 'Query skill index or type custom...',
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
    <div className={`space-y-3 font-mono ${className}`}>
      {label && (
        <div className="flex justify-between items-center text-[10px] uppercase tracking-wider">
          <label className="block font-bold text-retro-paper/80">
            [ FIELD // {label.toUpperCase()} ]
          </label>
          {maxSkills && (
            <span className="text-retro-muted">
              {selectedSkills.length}/{maxSkills} SELECTED
            </span>
          )}
        </div>
      )}

      {/* Selected Chips */}
      {selectedSkills.length > 0 && (
        <div className="flex flex-wrap gap-1.5 p-2.5 bg-retro-surface-elevated border border-retro-border rounded-none min-h-[44px]">
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
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-retro-muted">
          <Search className="w-3.5 h-3.5" />
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
          className="w-full bg-retro-surface text-retro-paper placeholder:text-retro-muted text-xs rounded-none border border-retro-border hover:border-retro-orange/50 focus:border-retro-orange pl-9 pr-20 py-2 transition-colors outline-none tracking-wide"
        />
        {searchQuery.trim() && !PRESET_SKILLS.includes(searchQuery.trim()) && (
          <button
            type="button"
            onClick={handleCustomAdd}
            className="absolute right-1.5 top-1.5 bottom-1.5 px-2 bg-retro-orange text-retro-bg hover:bg-retro-orange/90 rounded-none text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 transition-colors"
          >
            <Plus className="w-3 h-3" /> ADD
          </button>
        )}
      </div>

      {/* Category Pills */}
      <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategory(cat)}
            className={`px-2.5 py-1 rounded-none text-[10px] font-mono uppercase tracking-wider whitespace-nowrap transition-colors border ${
              activeCategory === cat
                ? 'bg-retro-orange text-retro-bg font-bold border-retro-orange'
                : 'bg-retro-surface-elevated text-retro-paper/70 hover:text-retro-paper border-retro-border hover:border-retro-border-strong'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Selectable Skill Chips Grid */}
      <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto p-1 border border-retro-border/40 bg-retro-surface/50 scrollbar-none">
        {filteredSkills.map((skill) => {
          const isSelected = selectedSkills.includes(skill);
          return (
            <button
              key={skill}
              type="button"
              onClick={() => toggleSkill(skill)}
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-none text-[10px] font-mono border transition-all duration-150 ${
                isSelected
                  ? 'bg-retro-orange text-retro-bg font-bold border-retro-orange'
                  : 'bg-retro-surface-elevated text-retro-paper/80 border-retro-border hover:border-retro-orange/60 hover:text-retro-paper'
              }`}
            >
              {isSelected ? <Check className="w-2.5 h-2.5" /> : <Plus className="w-2.5 h-2.5 text-retro-muted" />}
              <span>{skill}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
