import React, { useState } from 'react';
import { Sparkles, Check, ArrowRight, ArrowLeft, Plus, Award, Calendar, Clock, BookOpen, ExternalLink } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';
import { RoleType, ExperienceLevel } from '../types';
import { ALL_AVAILABLE_SKILLS, ALL_ROLES } from '../data/mockData';

interface OnboardingPageProps {
  navigate: (route: string) => void;
}

export const OnboardingPage: React.FC<OnboardingPageProps> = ({ navigate }) => {
  const { currentUser, updateCurrentUser, profileCompletionPercentage } = useApp();

  const [step, setStep] = useState(1);

  // Form states initialized from currentUser
  const [fullName, setFullName] = useState(currentUser?.full_name || '');
  const [college, setCollege] = useState(currentUser?.college || '');
  const [course, setCourse] = useState(currentUser?.course || '');
  const [yearOfStudy, setYearOfStudy] = useState(currentUser?.year_of_study || '3rd Year');
  const [bio, setBio] = useState(currentUser?.bio || '');

  const [skills, setSkills] = useState<string[]>(currentUser?.skills || ['React', 'TypeScript']);
  const [customSkill, setCustomSkill] = useState('');
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>(currentUser?.experience_level || 'Intermediate');
  const [experienceSummary, setExperienceSummary] = useState(currentUser?.experience_summary || '');

  const [preferredRoles, setPreferredRoles] = useState<RoleType[]>(currentUser?.preferred_roles || ['Frontend']);
  const [daysAvailable, setDaysAvailable] = useState<string[]>(currentUser?.days_available || ['Mon', 'Wed', 'Fri', 'Sat']);
  const [hoursPerWeek, setHoursPerWeek] = useState<number>(currentUser?.hours_per_week || 15);
  const [schedulePref, setSchedulePref] = useState<'Weekdays' | 'Weekends' | 'Flexible' | 'Evenings'>(
    (currentUser?.schedule_preference as any) || 'Flexible'
  );

  const [githubUrl, setGithubUrl] = useState(currentUser?.github_url || '');
  const [linkedinUrl, setLinkedinUrl] = useState(currentUser?.linkedin_url || '');
  const [portfolioUrl, setPortfolioUrl] = useState(currentUser?.portfolio_url || '');
  const [learningGoals, setLearningGoals] = useState<string[]>(currentUser?.learning_goals || ['AI/ML', 'System Architecture']);
  const [customGoal, setCustomGoal] = useState('');

  const toggleSkill = (s: string) => {
    if (skills.includes(s)) {
      setSkills(skills.filter(item => item !== s));
    } else {
      setSkills([...skills, s]);
    }
  };

  const addCustomSkill = () => {
    if (customSkill.trim() && !skills.includes(customSkill.trim())) {
      setSkills([...skills, customSkill.trim()]);
      setCustomSkill('');
    }
  };

  const toggleRole = (r: RoleType) => {
    if (preferredRoles.includes(r)) {
      if (preferredRoles.length > 1) {
        setPreferredRoles(preferredRoles.filter(item => item !== r));
      }
    } else {
      setPreferredRoles([...preferredRoles, r]);
    }
  };

  const toggleDay = (day: string) => {
    if (daysAvailable.includes(day)) {
      setDaysAvailable(daysAvailable.filter(d => d !== day));
    } else {
      setDaysAvailable([...daysAvailable, day]);
    }
  };

  const addGoal = () => {
    if (customGoal.trim() && !learningGoals.includes(customGoal.trim())) {
      setLearningGoals([...learningGoals, customGoal.trim()]);
      setCustomGoal('');
    }
  };

  const removeGoal = (g: string) => {
    setLearningGoals(learningGoals.filter(goal => goal !== g));
  };

  const handleSaveAndNext = () => {
    updateCurrentUser({
      full_name: fullName,
      college,
      course,
      year_of_study: yearOfStudy,
      bio,
      skills,
      experience_level: experienceLevel,
      experience_summary: experienceSummary,
      preferred_roles: preferredRoles,
      days_available: daysAvailable,
      hours_per_week: hoursPerWeek,
      schedule_preference: schedulePref,
      github_url: githubUrl,
      linkedin_url: linkedinUrl,
      portfolio_url: portfolioUrl,
      learning_goals: learningGoals,
    });

    if (step < 4) {
      setStep(step + 1);
    } else {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
      navigate('/dashboard');
    }
  };

  return (
    <div style={{ maxWidth: '780px', margin: '40px auto', padding: '0 24px' }}>
      
      {/* Header with Completion Meter */}
      <div className="glass-card" style={{ padding: '24px 32px', marginBottom: '28px', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', fontWeight: 700, textTransform: 'uppercase' }}>
              Step {step} of 4 · Builder Profile Setup
            </span>
            <h1 style={{ fontSize: '1.4rem', color: '#ffffff', marginTop: '2px' }}>
              {step === 1 && 'Basic Background & Academic Info'}
              {step === 2 && 'Technical Skills & Track Record'}
              {step === 3 && 'Preferred Roles & Schedule Availability'}
              {step === 4 && 'Learning Goals & Portfolio Links'}
            </h1>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff' }}>
              {profileCompletionPercentage}%
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Complete</div>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '3px', overflow: 'hidden' }}>
          <div style={{ width: `${(step / 4) * 100}%`, height: '100%', background: 'var(--gradient-primary)', transition: 'width 0.3s ease' }}></div>
        </div>
      </div>

      {/* Wizard Form Body */}
      <div className="glass-card" style={{ padding: '36px', border: '1px solid var(--border-glass)' }}>
        
        {/* STEP 1: Academic & Bio */}
        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label htmlFor="onb-fullname-input" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#ffffff', marginBottom: '6px' }}>
                Full Name *
              </label>
              <input
                id="onb-fullname-input"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Arjun Mehta"
                style={{ width: '100%', padding: '10px 14px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-glass)', borderRadius: '8px', color: '#ffffff', fontSize: '0.9rem', outline: 'none' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
              <div>
                <label htmlFor="onb-college-input" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#ffffff', marginBottom: '6px' }}>
                  University / College *
                </label>
                <input
                  id="onb-college-input"
                  type="text"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  placeholder="e.g. IIT Madras, BITS Pilani, NID"
                  style={{ width: '100%', padding: '10px 14px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-glass)', borderRadius: '8px', color: '#ffffff', fontSize: '0.9rem', outline: 'none' }}
                />
              </div>

              <div>
                <label htmlFor="onb-course-input" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#ffffff', marginBottom: '6px' }}>
                  Department / Course *
                </label>
                <input
                  id="onb-course-input"
                  type="text"
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  placeholder="e.g. Computer Science, Design"
                  style={{ width: '100%', padding: '10px 14px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-glass)', borderRadius: '8px', color: '#ffffff', fontSize: '0.9rem', outline: 'none' }}
                />
              </div>
            </div>

            <div>
              <label htmlFor="onb-year-select" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#ffffff', marginBottom: '6px' }}>
                Year of Study
              </label>
              <select
                id="onb-year-select"
                value={yearOfStudy}
                onChange={(e) => setYearOfStudy(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-glass)', borderRadius: '8px', color: '#ffffff', fontSize: '0.9rem', outline: 'none' }}
              >
                <option value="1st Year" style={{ background: '#0f172a' }}>1st Year</option>
                <option value="2nd Year" style={{ background: '#0f172a' }}>2nd Year</option>
                <option value="3rd Year" style={{ background: '#0f172a' }}>3rd Year</option>
                <option value="4th Year" style={{ background: '#0f172a' }}>4th Year</option>
                <option value="Postgraduate / PhD" style={{ background: '#0f172a' }}>Postgraduate / PhD</option>
              </select>
            </div>

            <div>
              <label htmlFor="onb-bio-textarea" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#ffffff', marginBottom: '6px' }}>
                Short Bio
              </label>
              <textarea
                id="onb-bio-textarea"
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="What are you passionate about building? Tell future teammates what drives you."
                style={{ width: '100%', padding: '10px 14px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-glass)', borderRadius: '8px', color: '#ffffff', fontSize: '0.9rem', outline: 'none', resize: 'vertical' }}
              />
            </div>
          </div>
        )}

        {/* STEP 2: Skills & Experience */}
        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <span style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#ffffff', marginBottom: '8px' }}>
                Select Your Core Skills
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
                {ALL_AVAILABLE_SKILLS.map(s => {
                  const isSelected = skills.includes(s);
                  return (
                    <button
                      type="button"
                      key={s}
                      aria-pressed={isSelected}
                      onClick={() => toggleSkill(s)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '8px',
                        background: isSelected ? 'rgba(99, 102, 241, 0.25)' : 'rgba(255, 255, 255, 0.04)',
                        border: isSelected ? '1px solid rgba(99, 102, 241, 0.5)' : '1px solid var(--border-glass)',
                        color: isSelected ? '#ffffff' : 'var(--text-secondary)',
                        fontSize: '0.8rem',
                        fontWeight: isSelected ? 600 : 400,
                      }}
                    >
                      {isSelected ? '✓ ' : '+ '}{s}
                    </button>
                  );
                })}
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  aria-label="Add custom skill"
                  value={customSkill}
                  onChange={(e) => setCustomSkill(e.target.value)}
                  placeholder="Add another skill..."
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addCustomSkill(); } }}
                  style={{ flex: 1, padding: '8px 12px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-glass)', borderRadius: '6px', color: '#ffffff', fontSize: '0.85rem', outline: 'none' }}
                />
                <button type="button" onClick={addCustomSkill} className="btn-secondary" style={{ padding: '8px 14px', borderRadius: '6px', fontSize: '0.8rem' }}>
                  <Plus size={14} /> Add
                </button>
              </div>
            </div>

            <div>
              <span style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#ffffff', marginBottom: '6px' }}>
                Experience Level
              </span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                {(['Beginner', 'Intermediate', 'Advanced'] as ExperienceLevel[]).map(lvl => (
                  <button
                    key={lvl}
                    type="button"
                    aria-pressed={experienceLevel === lvl}
                    onClick={() => setExperienceLevel(lvl)}
                    style={{
                      padding: '12px',
                      borderRadius: '8px',
                      background: experienceLevel === lvl ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                      border: experienceLevel === lvl ? '1px solid var(--accent-primary)' : '1px solid var(--border-glass)',
                      color: experienceLevel === lvl ? '#ffffff' : 'var(--text-secondary)',
                      fontWeight: experienceLevel === lvl ? 700 : 500,
                      fontSize: '0.9rem',
                    }}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="onb-exp-summary" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#ffffff', marginBottom: '6px' }}>
                Experience & Previous Hackathons / Projects
              </label>
              <textarea
                id="onb-exp-summary"
                rows={3}
                value={experienceSummary}
                onChange={(e) => setExperienceSummary(e.target.value)}
                placeholder="Mention hackathon wins, research papers, open-source contributions, or internship highlights..."
                style={{ width: '100%', padding: '10px 14px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-glass)', borderRadius: '8px', color: '#ffffff', fontSize: '0.9rem', outline: 'none' }}
              />
            </div>
          </div>
        )}

        {/* STEP 3: Roles & Availability */}
        {step === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <span style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#ffffff', marginBottom: '8px' }}>
                Preferred Roles in a Team
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {ALL_ROLES.map(r => {
                  const isSelected = preferredRoles.includes(r);
                  return (
                    <button
                      type="button"
                      key={r}
                      aria-pressed={isSelected}
                      onClick={() => toggleRole(r)}
                      style={{
                        padding: '6px 14px',
                        borderRadius: 'var(--radius-full)',
                        background: isSelected ? 'rgba(6, 182, 212, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                        border: isSelected ? '1px solid var(--accent-cyan)' : '1px solid var(--border-glass)',
                        color: isSelected ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                        fontSize: '0.85rem',
                        fontWeight: isSelected ? 600 : 400,
                      }}
                    >
                      {isSelected ? '✓ ' : '+ '}{r}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <span style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#ffffff', marginBottom: '8px' }}>
                Days Available for Sprints
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => {
                  const isSelected = daysAvailable.includes(day);
                  return (
                    <button
                      type="button"
                      key={day}
                      aria-pressed={isSelected}
                      onClick={() => toggleDay(day)}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '8px',
                        background: isSelected ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                        border: isSelected ? '1px solid var(--accent-emerald)' : '1px solid var(--border-glass)',
                        color: isSelected ? '#6ee7b7' : 'var(--text-secondary)',
                        fontWeight: 600,
                        fontSize: '0.85rem',
                      }}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
              <div>
                <label htmlFor="onb-hours-slider" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#ffffff', marginBottom: '6px' }}>
                  Weekly Commitment: {hoursPerWeek} hrs / week
                </label>
                <input
                  id="onb-hours-slider"
                  type="range"
                  min={5}
                  max={35}
                  step={1}
                  value={hoursPerWeek}
                  onChange={(e) => setHoursPerWeek(parseInt(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--accent-primary)' }}
                />
              </div>

              <div>
                <label htmlFor="onb-schedule-select" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#ffffff', marginBottom: '6px' }}>
                  Working Schedule Preference
                </label>
                <select
                  id="onb-schedule-select"
                  value={schedulePref}
                  onChange={(e) => setSchedulePref(e.target.value as any)}
                  style={{ width: '100%', padding: '10px 14px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-glass)', borderRadius: '8px', color: '#ffffff', fontSize: '0.9rem', outline: 'none' }}
                >
                  <option value="Flexible" style={{ background: '#0f172a' }}>Flexible (Anytime)</option>
                  <option value="Evenings" style={{ background: '#0f172a' }}>Evenings (Post Classes)</option>
                  <option value="Weekends" style={{ background: '#0f172a' }}>Weekends Intensive</option>
                  <option value="Weekdays" style={{ background: '#0f172a' }}>Weekdays</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Learning Goals & Links */}
        {step === 4 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <span style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#ffffff', marginBottom: '8px' }}>
                Skills You Want to Learn (Complementary Skill Growth)
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '10px' }}>
                {learningGoals.map(g => (
                  <span
                    key={g}
                    style={{
                      padding: '5px 12px',
                      borderRadius: 'var(--radius-full)',
                      background: 'rgba(139, 92, 246, 0.2)',
                      border: '1px solid rgba(139, 92, 246, 0.4)',
                      color: '#ddd6fe',
                      fontSize: '0.8rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <span>🎯 {g}</span>
                    <button type="button" aria-label={`Remove goal ${g}`} onClick={() => removeGoal(g)} style={{ background: 'transparent', color: '#fda4af' }}>×</button>
                  </span>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  aria-label="Add custom learning goal"
                  value={customGoal}
                  onChange={(e) => setCustomGoal(e.target.value)}
                  placeholder="e.g. Distributed Systems, Three.js, PyTorch..."
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addGoal(); } }}
                  style={{ flex: 1, padding: '8px 12px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-glass)', borderRadius: '6px', color: '#ffffff', fontSize: '0.85rem', outline: 'none' }}
                />
                <button type="button" onClick={addGoal} className="btn-secondary" style={{ padding: '8px 14px', borderRadius: '6px', fontSize: '0.8rem' }}>
                  <Plus size={14} /> Add Goal
                </button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
              <div>
                <label htmlFor="onb-github-input" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#ffffff', marginBottom: '6px' }}>
                  GitHub Profile URL
                </label>
                <input
                  id="onb-github-input"
                  type="url"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/username"
                  style={{ width: '100%', padding: '10px 12px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-glass)', borderRadius: '8px', color: '#ffffff', fontSize: '0.85rem', outline: 'none' }}
                />
              </div>

              <div>
                <label htmlFor="onb-linkedin-input" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#ffffff', marginBottom: '6px' }}>
                  LinkedIn Profile URL
                </label>
                <input
                  id="onb-linkedin-input"
                  type="url"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  placeholder="https://linkedin.com/in/username"
                  style={{ width: '100%', padding: '10px 12px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-glass)', borderRadius: '8px', color: '#ffffff', fontSize: '0.85rem', outline: 'none' }}
                />
              </div>

              <div>
                <label htmlFor="onb-portfolio-input" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#ffffff', marginBottom: '6px' }}>
                  Portfolio / Website URL
                </label>
                <input
                  id="onb-portfolio-input"
                  type="url"
                  value={portfolioUrl}
                  onChange={(e) => setPortfolioUrl(e.target.value)}
                  placeholder="https://yourname.dev"
                  style={{ width: '100%', padding: '10px 12px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-glass)', borderRadius: '8px', color: '#ffffff', fontSize: '0.85rem', outline: 'none' }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Action Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '32px', borderTop: '1px solid var(--border-glass)', paddingTop: '20px' }}>
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="btn-secondary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <ArrowLeft size={16} />
              <span>Back</span>
            </button>
          ) : (
            <div></div>
          )}

          <button
            type="button"
            onClick={handleSaveAndNext}
            className="btn-primary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          >
            <span>{step === 4 ? 'Complete & Go to Dashboard' : 'Save & Continue'}</span>
            <ArrowRight size={16} />
          </button>
        </div>

      </div>

    </div>
  );
};
