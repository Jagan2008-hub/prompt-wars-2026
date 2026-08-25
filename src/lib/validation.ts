/**
 * Input validation helpers for forms across ProjectMatch.
 */

export interface ProfileValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export interface ProjectValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

/** Validate email format */
export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

/** Validate URL format (http/https). Empty string = valid (optional field). */
export function isValidUrl(url: string): boolean {
  if (typeof url !== 'string') return false;
  const trimmed = url.trim();
  if (trimmed === '') return true; // Optional URLs can be empty
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

/** Validate commitment hours within realistic boundaries (1 to 100 hrs/wk) */
export function validateHours(hours: number): { isValid: boolean; error?: string } {
  if (typeof hours !== 'number' || isNaN(hours)) {
    return { isValid: false, error: 'Hours must be a valid number' };
  }
  if (hours < 1) {
    return { isValid: false, error: 'Hours must be at least 1 hr/week' };
  }
  if (hours > 100) {
    return { isValid: false, error: 'Hours cannot exceed 100 hrs/week' };
  }
  return { isValid: true };
}

/** Comprehensive User Profile Form Validator */
export function validateProfile(data: {
  full_name?: string;
  email?: string;
  college?: string;
  course?: string;
  hours_per_week?: number;
  github_url?: string;
  linkedin_url?: string;
  portfolio_url?: string;
  skills?: string[];
}): ProfileValidationResult {
  const errors: Record<string, string> = {};

  if (!data.full_name || data.full_name.trim().length < 2) {
    errors.full_name = 'Full name must be at least 2 characters';
  }

  if (data.email !== undefined && !isValidEmail(data.email)) {
    errors.email = 'Please provide a valid email address';
  }

  if (!data.college || data.college.trim().length === 0) {
    errors.college = 'University / College is required';
  }

  if (!data.course || data.course.trim().length === 0) {
    errors.course = 'Course / Department is required';
  }

  if (data.hours_per_week !== undefined) {
    const hoursCheck = validateHours(data.hours_per_week);
    if (!hoursCheck.isValid) {
      errors.hours_per_week = hoursCheck.error!;
    }
  }

  if (data.github_url && !isValidUrl(data.github_url)) {
    errors.github_url = 'Invalid GitHub URL format';
  }

  if (data.linkedin_url && !isValidUrl(data.linkedin_url)) {
    errors.linkedin_url = 'Invalid LinkedIn URL format';
  }

  if (data.portfolio_url && !isValidUrl(data.portfolio_url)) {
    errors.portfolio_url = 'Invalid Portfolio URL format';
  }

  if (data.skills && data.skills.length === 0) {
    errors.skills = 'Select at least 1 core skill';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/** Comprehensive Project Creation Form Validator */
export function validateProject(data: {
  title?: string;
  description?: string;
  category?: string;
  members_needed?: number;
  commitment_hours?: number;
  required_skills?: string[];
  required_roles?: string[];
}): ProjectValidationResult {
  const errors: Record<string, string> = {};

  if (!data.title || data.title.trim().length < 3) {
    errors.title = 'Project title must be at least 3 characters';
  }

  if (!data.description || data.description.trim().length < 10) {
    errors.description = 'Description must be at least 10 characters';
  }

  if (!data.category || data.category.trim().length === 0) {
    errors.category = 'Project category is required';
  }

  if (typeof data.members_needed !== 'number' || data.members_needed < 1) {
    errors.members_needed = 'Team size must be at least 1 member';
  }

  if (data.commitment_hours !== undefined) {
    const hoursCheck = validateHours(data.commitment_hours);
    if (!hoursCheck.isValid) {
      errors.commitment_hours = hoursCheck.error!;
    }
  }

  if (!data.required_skills || data.required_skills.length === 0) {
    errors.required_skills = 'Select at least 1 required skill';
  }

  if (!data.required_roles || data.required_roles.length === 0) {
    errors.required_roles = 'Select at least 1 required role';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
