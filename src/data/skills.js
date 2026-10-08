/**
 * Canonical skills database, taxonomy, and AI extraction keyword map
 */

export const SKILL_CATEGORIES = {
  Technical: [
    'Python',
    'C/C++',
    'Java',
    'JavaScript',
    'React',
    'AI/ML',
    'Data Science',
    'Cybersecurity',
    'IoT',
    'Robotics',
    'Cloud',
    'App Dev',
    'Backend',
    'Databases',
    'APIs',
    'Frontend Development',
  ],
  Creative: [
    'UI/UX',
    'Figma',
    'Graphic Design',
    'Photography',
    'Videography',
    'Video Editing',
    'Motion Graphics',
    '3D Design',
    'Animation',
    'Branding',
  ],
  Communication: [
    'Public Speaking',
    'Presentation',
    'Content/Script Writing',
    'Storytelling',
    'Technical Writing',
    'Documentation',
  ],
  Research: [
    'Research',
    'Data Analysis',
    'Academic Writing',
    'Literature Review',
    'User Research',
  ],
  Business: [
    'Marketing',
    'Social Media',
    'Event Management',
    'Entrepreneurship',
    'Product Management',
    'Growth Strategy',
  ],
  Leadership: [
    'Leadership',
    'Team Management',
    'Agile/Scrum',
    'Project Coordination',
  ],
};

export const INTEREST_OPTIONS = [
  'AI & Machine Learning',
  'Healthcare & MedTech',
  'FinTech & Web3',
  'EdTech & Learning',
  'Climate & Sustainability',
  'Creative Arts & Media',
  'Hardware & IoT',
  'Social Impact & Non-Profit',
  'Gaming & Interactive Media',
  'Campus Culture & Events',
];

export const AVAILABILITY_OPTIONS = [
  'Weekdays',
  'Weekends',
  'Evenings',
  'Flexible',
  'Full-time Sprint',
];

export const COLLABORATION_TYPES = [
  'Hackathon',
  'Project',
  'Research',
  'Startup',
  'Event',
  'Creative',
];

export const DEPARTMENTS = [
  'Computer Science (CSE)',
  'Information Technology (IT)',
  'AI & Data Science (AI&DS)',
  'Electronics & Comm (ECE)',
  'Mechanical Engineering',
  'Biotechnology',
  'Design & Media',
  'Business Administration (BBA)',
];

export const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year'];

/**
 * Keyword mapping for AI Requirement Analysis simulation
 */
export const AI_KEYWORD_MAP = [
  {
    keywords: ['design', 'interface', 'figma', 'ui', 'ux', 'look and feel', 'wireframe', 'prototype'],
    skills: ['UI/UX', 'Figma'],
    category: 'Creative',
  },
  {
    keywords: ['present', 'pitch', 'pitching', 'speak', 'public speaking', 'demo', 'explaining', 'confidently present'],
    skills: ['Presentation', 'Public Speaking'],
    category: 'Communication',
  },
  {
    keywords: ['video', 'editing', 'youtube', 'reels', 'clip', 'footage'],
    skills: ['Video Editing', 'Videography'],
    category: 'Creative',
  },
  {
    keywords: ['ai', 'ml', 'machine learning', 'model', 'neural', 'llm', 'deep learning'],
    skills: ['AI/ML', 'Python'],
    category: 'Technical',
  },
  {
    keywords: ['backend', 'api', 'server', 'database', 'sql', 'endpoints'],
    skills: ['Backend', 'APIs', 'Databases'],
    category: 'Technical',
  },
  {
    keywords: ['frontend', 'react', 'web', 'ui component', 'css'],
    skills: ['React', 'Frontend Development'],
    category: 'Technical',
  },
  {
    keywords: ['market', 'marketing', 'social media', 'growth', 'outreach', 'promote'],
    skills: ['Marketing', 'Social Media'],
    category: 'Business',
  },
  {
    keywords: ['research', 'paper', 'literature', 'experiment', 'survey', 'study'],
    skills: ['Research', 'Data Analysis'],
    category: 'Research',
  },
  {
    keywords: ['write', 'script', 'story', 'content', 'documentation', 'copy'],
    skills: ['Content/Script Writing', 'Storytelling'],
    category: 'Communication',
  },
  {
    keywords: ['lead', 'manage', 'coordinate', 'organize', 'scrum'],
    skills: ['Leadership', 'Team Management'],
    category: 'Leadership',
  },
];
