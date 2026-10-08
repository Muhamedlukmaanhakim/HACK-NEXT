/**
 * AI Requirement Extraction Service
 * Simulates an LLM requirement parser with realistic keyword heuristics and delay.
 * Future endpoint: Supabase Edge Function `supabase.functions.invoke('analyze-requirements')`
 */

import { AI_KEYWORD_MAP } from '../data/skills.js';

const LATENCY_MS = 600;
const delay = (ms = LATENCY_MS) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Analyzes natural language project description to extract structured requirements
 * @param {string} text - User prompt / project description
 * @returns {Promise<{ skills: string[], categories: string[], confidence: number, summary: string }>}
 */
export async function analyzeRequirements(text = '') {
  await delay();

  const trimmed = text.trim();
  if (!trimmed || trimmed.length < 5) {
    throw new Error('Please enter a descriptive project requirement (at least 5 characters).');
  }

  const lower = trimmed.toLowerCase();
  const detectedSkillsSet = new Set();
  const detectedCategoriesSet = new Set();

  // Test against keyword taxonomy
  AI_KEYWORD_MAP.forEach((mapping) => {
    const hasMatch = mapping.keywords.some((kw) => lower.includes(kw));
    if (hasMatch) {
      mapping.skills.forEach((skill) => detectedSkillsSet.add(skill));
      detectedCategoriesSet.add(mapping.category);
    }
  });

  // Target demo exact phrase:
  // "I need someone who can design the interface and confidently present our project."
  if (lower.includes('design') || lower.includes('interface')) {
    detectedSkillsSet.add('UI/UX');
  }
  if (lower.includes('present') || lower.includes('pitch')) {
    detectedSkillsSet.add('Presentation');
  }
  if (lower.includes('confidently') || lower.includes('speak') || lower.includes('present our project')) {
    detectedSkillsSet.add('Public Speaking');
  }

  const skills = Array.from(detectedSkillsSet);
  const categories = Array.from(detectedCategoriesSet);

  if (skills.length === 0) {
    return {
      skills: ['UI/UX', 'Presentation'],
      categories: ['Creative', 'Communication'],
      confidence: 72,
      summary: 'Heuristic fallback: identified foundational design and communication requirements.',
    };
  }

  return {
    skills,
    categories,
    confidence: Math.min(98, 88 + skills.length * 2),
    summary: `Identified ${skills.length} core discipline requirements (${skills.join(', ')}) aligned with your project description.`,
  };
}
