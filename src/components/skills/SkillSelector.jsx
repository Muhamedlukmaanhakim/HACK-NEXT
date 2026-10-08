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
        <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-ink/70">
          <label className="block">
            {label}
          </label>
          {maxSkills && (
            <span className="text-ink/60">
              {selectedSkills.length}/{maxSkills} SELECTED
            </span>
          )}
        </div>
      )}

      {/* Selected Chips */}
      {selectedSkills.length > 0 && (
        <div className="flex flex-wrap gap-1.5 p-3 bg-canvas border-2 border-ink">
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
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-ink">
          <Search className="w-3.5 h-3.5 stroke-[2.5]" />
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
          className="w-full bg-white text-ink placeholder:text-ink/40 text-xs border-2 border-ink focus:border-brutal-red pl-9 pr-20 py-2.5 transition-colors outline-none font-mono"
        />
        {searchQuery.trim() && !PRESET_SKILLS.includes(searchQuery.trim()) && (
          <button
            type="button"
            onClick={handleCustomAdd}
            className="absolute right-1.5 top-1.5 bottom-1.5 px-2.5 bg-brutal-red text-white hover:bg-ink text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 transition-colors border border-ink"
          >
            <Plus className="w-3 h-3 stroke-[2.5]" /> ADD
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
            className={`px-2.5 py-1 text-[11px] font-mono font-bold uppercase tracking-wider whitespace-nowrap transition-colors border-2 border-ink ${
              activeCategory === cat
                ? 'bg-ink text-canvas shadow-brutal-sm'
                : 'bg-white text-ink hover:bg-canvas'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Selectable Skill Chips Grid */}
      <div className="flex flex-wrap gap-1.5 max-h-44 overflow-y-auto p-2 border-2 border-ink bg-canvas scrollbar-none">
        {filteredSkills.map((skill) => {
          const isSelected = selectedSkills.includes(skill);
          return (
            <button
              key={skill}
              type="button"
              onClick={() => toggleSkill(skill)}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-bold border-2 border-ink transition-all ${
                isSelected
                  ? 'bg-ink text-canvas shadow-brutal-sm'
                  : 'bg-white text-ink hover:bg-canvas'
              }`}
            >
              {isSelected ? <Check className="w-3 h-3 stroke-[3]" /> : <Plus className="w-3 h-3 text-ink/50 stroke-[2.5]" />}
              <span>{skill}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
