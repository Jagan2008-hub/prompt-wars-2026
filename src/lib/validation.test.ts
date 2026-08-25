import { describe, it, expect } from 'vitest';
import {
  isValidEmail,
  isValidUrl,
  validateHours,
  validateProfile,
  validateProject,
} from './validation';

describe('isValidEmail', () => {
  it('validates correct email addresses', () => {
    expect(isValidEmail('student@college.edu')).toBe(true);
    expect(isValidEmail('builder.user@domain.com')).toBe(true);
    expect(isValidEmail('user+tag@gmail.co.in')).toBe(true);
  });

  it('rejects invalid email addresses', () => {
    expect(isValidEmail('')).toBe(false);
    expect(isValidEmail('invalid-email')).toBe(false);
    expect(isValidEmail('student@')).toBe(false);
    expect(isValidEmail('@domain.com')).toBe(false);
    expect(isValidEmail(null as any)).toBe(false);
    expect(isValidEmail(undefined as any)).toBe(false);
  });
});

describe('isValidUrl', () => {
  it('validates correct http and https URLs', () => {
    expect(isValidUrl('https://github.com/username')).toBe(true);
    expect(isValidUrl('http://myportfolio.dev')).toBe(true);
    expect(isValidUrl('')).toBe(true); // Empty optional URL is valid
  });

  it('rejects invalid or non-http URLs', () => {
    expect(isValidUrl('not-a-url')).toBe(false);
    expect(isValidUrl('ftp://server.com')).toBe(false);
    expect(isValidUrl('javascript:void(0)')).toBe(false);
  });
});

describe('validateHours', () => {
  it('accepts valid hours within range [1, 100]', () => {
    expect(validateHours(15).isValid).toBe(true);
    expect(validateHours(1).isValid).toBe(true);
    expect(validateHours(100).isValid).toBe(true);
  });

  it('rejects hours out of range or invalid numbers', () => {
    expect(validateHours(0).isValid).toBe(false);
    expect(validateHours(-5).isValid).toBe(false);
    expect(validateHours(120).isValid).toBe(false);
    expect(validateHours(NaN).isValid).toBe(false);
  });
});

describe('validateProfile', () => {
  const validData = {
    full_name: 'Arjun Mehta',
    email: 'arjun@college.edu',
    college: 'IIT Madras',
    course: 'Computer Science',
    hours_per_week: 20,
    github_url: 'https://github.com/arjun',
    skills: ['React', 'Python'],
  };

  it('passes for valid profile data', () => {
    const result = validateProfile(validData);
    expect(result.isValid).toBe(true);
    expect(result.errors).toEqual({});
  });

  it('detects short or missing full_name', () => {
    const res1 = validateProfile({ ...validData, full_name: 'A' });
    expect(res1.isValid).toBe(false);
    expect(res1.errors.full_name).toBeDefined();

    const res2 = validateProfile({ ...validData, full_name: '' });
    expect(res2.isValid).toBe(false);
  });

  it('detects invalid email format', () => {
    const res = validateProfile({ ...validData, email: 'bad-email' });
    expect(res.isValid).toBe(false);
    expect(res.errors.email).toBeDefined();
  });

  it('detects missing college or course', () => {
    const res1 = validateProfile({ ...validData, college: '' });
    expect(res1.isValid).toBe(false);

    const res2 = validateProfile({ ...validData, course: '' });
    expect(res2.isValid).toBe(false);
  });

  it('detects invalid social URLs', () => {
    const res = validateProfile({ ...validData, github_url: 'invalid-url' });
    expect(res.isValid).toBe(false);
    expect(res.errors.github_url).toBeDefined();
  });

  it('detects empty skills list', () => {
    const res = validateProfile({ ...validData, skills: [] });
    expect(res.isValid).toBe(false);
    expect(res.errors.skills).toBeDefined();
  });
});

describe('validateProject', () => {
  const validProjectData = {
    title: 'PulseSense AI',
    description: 'A comprehensive healthcare monitoring platform built for hackathons.',
    category: 'Hackathon',
    members_needed: 4,
    commitment_hours: 15,
    required_skills: ['React', 'Python'],
    required_roles: ['Frontend', 'Backend'],
  };

  it('passes for valid project data', () => {
    const result = validateProject(validProjectData);
    expect(result.isValid).toBe(true);
    expect(result.errors).toEqual({});
  });

  it('detects short title or description', () => {
    const res1 = validateProject({ ...validProjectData, title: 'AI' });
    expect(res1.isValid).toBe(false);

    const res2 = validateProject({ ...validProjectData, description: 'Short' });
    expect(res2.isValid).toBe(false);
  });

  it('detects missing category, skills, or roles', () => {
    const res1 = validateProject({ ...validProjectData, category: '' });
    expect(res1.isValid).toBe(false);

    const res2 = validateProject({ ...validProjectData, required_skills: [] });
    expect(res2.isValid).toBe(false);

    const res3 = validateProject({ ...validProjectData, required_roles: [] });
    expect(res3.isValid).toBe(false);
  });

  it('detects invalid team size or commitment hours', () => {
    const res1 = validateProject({ ...validProjectData, members_needed: 0 });
    expect(res1.isValid).toBe(false);
    expect(res1.errors.members_needed).toBeDefined();

    const res2 = validateProject({ ...validProjectData, commitment_hours: 150 });
    expect(res2.isValid).toBe(false);
    expect(res2.errors.commitment_hours).toBeDefined();
  });

  it('allows omitting optional commitment_hours field', () => {
    const { commitment_hours: _, ...withoutHours } = validProjectData;
    const result = validateProject(withoutHours);
    expect(result.isValid).toBe(true);
  });
});

// ─── Additional validateProfile edge cases ──────────────────────────────

describe('validateProfile — additional edge cases', () => {
  const base = {
    full_name: 'Test Person',
    email: 'test@college.edu',
    college: 'Test University',
    course: 'Computer Science',
    hours_per_week: 10,
    skills: ['React'],
  };

  it('accepts valid linkedin and portfolio URLs', () => {
    const res = validateProfile({
      ...base,
      linkedin_url: 'https://linkedin.com/in/user',
      portfolio_url: 'https://mysite.dev',
    });
    expect(res.isValid).toBe(true);
  });

  it('detects invalid linkedin URL', () => {
    const res = validateProfile({ ...base, linkedin_url: 'bad-link' });
    expect(res.isValid).toBe(false);
    expect(res.errors.linkedin_url).toBeDefined();
  });

  it('detects invalid portfolio URL', () => {
    const res = validateProfile({ ...base, portfolio_url: 'ftp://old-protocol.com' });
    expect(res.isValid).toBe(false);
    expect(res.errors.portfolio_url).toBeDefined();
  });

  it('allows omitting optional email field without error', () => {
    const { email: _, ...withoutEmail } = base;
    const res = validateProfile(withoutEmail);
    expect(res.isValid).toBe(true);
  });

  it('allows omitting optional hours_per_week without error', () => {
    const { hours_per_week: _, ...withoutHours } = base;
    const res = validateProfile(withoutHours);
    expect(res.isValid).toBe(true);
  });

  it('allows empty github_url (optional field)', () => {
    const res = validateProfile({ ...base, github_url: '' });
    expect(res.isValid).toBe(true);
  });

  it('reports isValid false when multiple fields fail', () => {
    const res = validateProfile({ full_name: 'A', email: 'bad', college: '' });
    expect(res.isValid).toBe(false);
    expect(Object.keys(res.errors).length).toBeGreaterThanOrEqual(2);
  });
});

// ─── isValidUrl — additional edge cases ─────────────────────────────────

describe('isValidUrl — additional edge cases', () => {
  it('accepts whitespace-only string as valid (treated as empty optional)', () => {
    // Trim makes '   ' effectively empty → valid optional URL
    expect(isValidUrl('   ')).toBe(true);
  });

  it('accepts URLs with paths and query strings', () => {
    expect(isValidUrl('https://github.com/user/repo?tab=readme')).toBe(true);
  });

  it('rejects mailto: links', () => {
    expect(isValidUrl('mailto:user@example.com')).toBe(false);
  });

  it('rejects bare domain without protocol', () => {
    expect(isValidUrl('github.com/user')).toBe(false);
  });
});

// ─── validateHours — additional edge cases ──────────────────────────────

describe('validateHours — additional edge cases', () => {
  it('returns descriptive error messages', () => {
    const low = validateHours(0);
    expect(low.error).toContain('1');

    const high = validateHours(101);
    expect(high.error).toContain('100');
  });

  it('returns no error for boundary values', () => {
    expect(validateHours(1).isValid).toBe(true);
    expect(validateHours(100).isValid).toBe(true);
  });
});
