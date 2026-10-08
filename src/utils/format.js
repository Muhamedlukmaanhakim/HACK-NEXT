/**
 * Utility functions for formatting strings, dates, and initials
 */

/**
 * Deterministically generates initials from a full name (e.g., "Lukmaan Hakim" -> "LH")
 * @param {string} name
 * @returns {string}
 */
export function getInitials(name = '') {
  if (!name) return '??';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Deterministically generates a gradient color pair for an avatar based on a name string
 * @param {string} name
 * @returns {{ from: string, to: string, text: string }}
 */
export function getAvatarGradient(name = '') {
  const gradients = [
    { from: '#6366F1', to: '#8B5CF6' }, // Indigo to Violet
    { from: '#3B82F6', to: '#2DD4BF' }, // Blue to Teal
    { from: '#EC4899', to: '#8B5CF6' }, // Pink to Violet
    { from: '#10B981', to: '#059669' }, // Emerald
    { from: '#F59E0B', to: '#EA580C' }, // Amber to Orange
    { from: '#8B5CF6', to: '#D946EF' }, // Violet to Fuchsia
    { from: '#06B6D4', to: '#3B82F6' }, // Cyan to Blue
    { from: '#F43F5E', to: '#FB7185' }, // Rose
  ];

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % gradients.length;
  return gradients[index];
}

/**
 * Format relative time or standard date
 * @param {string|Date} dateStr
 * @returns {string}
 */
export function formatDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

/**
 * Truncate long text with ellipsis
 * @param {string} text
 * @param {number} maxLen
 * @returns {string}
 */
export function truncate(text = '', maxLen = 100) {
  if (!text || text.length <= maxLen) return text;
  return text.slice(0, maxLen).trim() + '...';
}

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

