import { describe, it, expect } from 'vitest';
import {
  INITIAL_PROFILES,
  INITIAL_PROJECTS,
  INITIAL_TASKS,
  ALL_AVAILABLE_SKILLS,
  ALL_ROLES,
} from './mockData';

// ─── INITIAL_PROFILES data integrity ────────────────────────────────────

describe('INITIAL_PROFILES data integrity', () => {
  it('exports a non-empty array of profiles', () => {
    expect(Array.isArray(INITIAL_PROFILES)).toBe(true);
    expect(INITIAL_PROFILES.length).toBeGreaterThan(0);
  });

  it('every profile has a unique id', () => {
    const ids = INITIAL_PROFILES.map((p) => p.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });

  it('every profile has required string fields', () => {
    for (const p of INITIAL_PROFILES) {
      expect(typeof p.id).toBe('string');
      expect(p.id.length).toBeGreaterThan(0);
      expect(typeof p.full_name).toBe('string');
      expect(p.full_name.length).toBeGreaterThan(0);
      expect(typeof p.email).toBe('string');
      expect(typeof p.college).toBe('string');
      expect(typeof p.course).toBe('string');
    }
  });

  it('every profile has at least one skill', () => {
    for (const p of INITIAL_PROFILES) {
      expect(Array.isArray(p.skills)).toBe(true);
      expect(p.skills.length).toBeGreaterThan(0);
    }
  });

  it('every profile has at least one preferred role', () => {
    for (const p of INITIAL_PROFILES) {
      expect(Array.isArray(p.preferred_roles)).toBe(true);
      expect(p.preferred_roles.length).toBeGreaterThan(0);
    }
  });

  it('hours_per_week is within realistic range [1, 100]', () => {
    for (const p of INITIAL_PROFILES) {
      expect(p.hours_per_week).toBeGreaterThanOrEqual(1);
      expect(p.hours_per_week).toBeLessThanOrEqual(100);
    }
  });

  it('experience_level is one of the accepted values', () => {
    const allowed = new Set(['Beginner', 'Intermediate', 'Advanced']);
    for (const p of INITIAL_PROFILES) {
      expect(allowed.has(p.experience_level)).toBe(true);
    }
  });

  it('schedule_preference is one of the accepted values', () => {
    const allowed = new Set(['Flexible', 'Evenings', 'Weekends', 'Mornings', 'Weekdays']);
    for (const p of INITIAL_PROFILES) {
      expect(allowed.has(p.schedule_preference)).toBe(true);
    }
  });

  it('learning_goals is an array', () => {
    for (const p of INITIAL_PROFILES) {
      expect(Array.isArray(p.learning_goals)).toBe(true);
    }
  });

  it('days_available entries are valid day names', () => {
    const validDays = new Set(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']);
    for (const p of INITIAL_PROFILES) {
      for (const day of p.days_available) {
        expect(validDays.has(day)).toBe(true);
      }
    }
  });
});

// ─── INITIAL_PROJECTS data integrity ────────────────────────────────────

describe('INITIAL_PROJECTS data integrity', () => {
  it('exports a non-empty array of projects', () => {
    expect(Array.isArray(INITIAL_PROJECTS)).toBe(true);
    expect(INITIAL_PROJECTS.length).toBeGreaterThan(0);
  });

  it('every project has a unique id', () => {
    const ids = INITIAL_PROJECTS.map((p) => p.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });

  it('every project has required fields with valid types', () => {
    for (const p of INITIAL_PROJECTS) {
      expect(typeof p.id).toBe('string');
      expect(p.id.length).toBeGreaterThan(0);
      expect(typeof p.title).toBe('string');
      expect(p.title.length).toBeGreaterThan(2);
      expect(typeof p.description).toBe('string');
      expect(typeof p.category).toBe('string');
      expect(typeof p.creator_id).toBe('string');
    }
  });

  it('every project has at least one required skill', () => {
    for (const p of INITIAL_PROJECTS) {
      expect(Array.isArray(p.required_skills)).toBe(true);
      expect(p.required_skills.length).toBeGreaterThan(0);
    }
  });

  it('every project has at least one required role', () => {
    for (const p of INITIAL_PROJECTS) {
      expect(Array.isArray(p.required_roles)).toBe(true);
      expect(p.required_roles.length).toBeGreaterThan(0);
    }
  });

  it('commitment_hours is within realistic range [1, 100]', () => {
    for (const p of INITIAL_PROJECTS) {
      expect(p.commitment_hours).toBeGreaterThanOrEqual(1);
      expect(p.commitment_hours).toBeLessThanOrEqual(100);
    }
  });

  it('members_needed is at least 1', () => {
    for (const p of INITIAL_PROJECTS) {
      expect(p.members_needed).toBeGreaterThanOrEqual(1);
    }
  });

  it('status is one of the accepted values', () => {
    const allowed = new Set(['open', 'closed', 'completed', 'in-progress', 'in_progress']);
    for (const p of INITIAL_PROJECTS) {
      expect(allowed.has(p.status)).toBe(true);
    }
  });

  it('members array is an array (may be empty)', () => {
    for (const p of INITIAL_PROJECTS) {
      expect(Array.isArray(p.members)).toBe(true);
    }
  });

  it('experience_preference is one of the accepted values', () => {
    const allowed = new Set(['Beginner', 'Intermediate', 'Advanced', 'Any']);
    for (const p of INITIAL_PROJECTS) {
      expect(allowed.has(p.experience_preference)).toBe(true);
    }
  });
});

// ─── INITIAL_TASKS data integrity ───────────────────────────────────────

describe('INITIAL_TASKS data integrity', () => {
  it('exports a non-empty array of tasks', () => {
    expect(Array.isArray(INITIAL_TASKS)).toBe(true);
    expect(INITIAL_TASKS.length).toBeGreaterThan(0);
  });

  it('every task has required id and title fields', () => {
    for (const t of INITIAL_TASKS) {
      expect(typeof t.id).toBe('string');
      expect(t.id.length).toBeGreaterThan(0);
      expect(typeof t.title).toBe('string');
      expect(t.title.length).toBeGreaterThan(0);
    }
  });

  it('every task has a valid status', () => {
    const allowed = new Set(['todo', 'in-progress', 'done', 'review', 'in_progress']);
    for (const t of INITIAL_TASKS) {
      expect(typeof t.status).toBe('string');
      expect(allowed.has(t.status)).toBe(true);
    }
  });

  it('every task with priority has a valid priority value', () => {
    const allowed = new Set(['low', 'medium', 'high', 'critical']);
    for (const t of INITIAL_TASKS) {
      if (t.priority) {
        expect(allowed.has(t.priority)).toBe(true);
      }
    }
  });

  it('every task belongs to a project (has project_id)', () => {
    for (const t of INITIAL_TASKS) {
      expect(typeof t.project_id).toBe('string');
      expect(t.project_id.length).toBeGreaterThan(0);
    }
  });
});

// ─── ALL_AVAILABLE_SKILLS integrity ─────────────────────────────────────

describe('ALL_AVAILABLE_SKILLS integrity', () => {
  it('is a non-empty string array', () => {
    expect(Array.isArray(ALL_AVAILABLE_SKILLS)).toBe(true);
    expect(ALL_AVAILABLE_SKILLS.length).toBeGreaterThan(0);
    for (const s of ALL_AVAILABLE_SKILLS) {
      expect(typeof s).toBe('string');
      expect(s.length).toBeGreaterThan(0);
    }
  });

  it('contains no duplicates', () => {
    const unique = new Set(ALL_AVAILABLE_SKILLS.map((s) => s.toLowerCase()));
    expect(unique.size).toBe(ALL_AVAILABLE_SKILLS.length);
  });
});

// ─── ALL_ROLES integrity ─────────────────────────────────────────────────

describe('ALL_ROLES integrity', () => {
  it('is a non-empty string array', () => {
    expect(Array.isArray(ALL_ROLES)).toBe(true);
    expect(ALL_ROLES.length).toBeGreaterThan(0);
  });

  it('contains no duplicates', () => {
    const unique = new Set(ALL_ROLES);
    expect(unique.size).toBe(ALL_ROLES.length);
  });

  it('includes common expected roles', () => {
    expect(ALL_ROLES).toContain('Developer');
    expect(ALL_ROLES).toContain('Frontend');
    expect(ALL_ROLES).toContain('Backend');
  });
});
