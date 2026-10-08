/**
 * Taxonomy Service Layer
 * Provides reference tables for departments, years, skills, categories, and options.
 * Future Supabase tables: `public.departments`, `public.skills`, `public.interests`
 */

import {
  SKILL_CATEGORIES,
  INTEREST_OPTIONS,
  AVAILABILITY_OPTIONS,
  COLLABORATION_TYPES,
  DEPARTMENTS,
  YEARS,
} from '../data/skills.js';

const delay = (ms = 100) => new Promise((resolve) => setTimeout(resolve, ms));

export {
  SKILL_CATEGORIES,
  INTEREST_OPTIONS,
  AVAILABILITY_OPTIONS,
  COLLABORATION_TYPES,
  DEPARTMENTS,
  YEARS,
};

export async function getSkillCategories() {
  await delay();
  return SKILL_CATEGORIES;
}

export async function getInterestOptions() {
  await delay();
  return INTEREST_OPTIONS;
}

export async function getDepartments() {
  await delay();
  return DEPARTMENTS;
}
