import React, { useState } from 'react';
import { Sparkles, Edit3, Save, MapPin, Clock, Calendar, BookOpen, ExternalLink, Plus, CheckCircle2, Zap, TrendingUp, Lightbulb } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ALL_AVAILABLE_SKILLS, ALL_ROLES } from '../data/mockData';
import { RoleType, ExperienceLevel } from '../types';

interface ProfilePageProps {
  navigate: (route: string) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ navigate }) => {
  const { currentUser, updateCurrentUser, profileCompletionPercentage, projects } = useApp();

  const [isEditing, setIsEditing] = useState(false);

  const [fullName, setFullName] = useState(currentUser?.full_name || '');
  const [college, setCollege] = useState(currentUser?.college || '');
  const [course, setCourse] = useState(currentUser?.course || '');
  const [yearOfStudy, setYearOfStudy] = useState(currentUser?.year_of_study || '3rd Year');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [skills, setSkills] = useState<string[]>(currentUser?.skills || []);
  const [customSkill, setCustomSkill] = useState('');
  const [preferredRoles, setPreferredRoles] = useState<RoleType[]>(currentUser?.preferred_roles || []);
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>(currentUser?.experience_level || 'Intermediate');
  const [hoursPerWeek, setHoursPerWeek] = useState<number>(currentUser?.hours_per_week || 15);
  const [schedulePref, setSchedulePref] = useState<'Weekdays' | 'Weekends' | 'Flexible' | 'Evenings'>(
    (currentUser?.schedule_preference as any) || 'Flexible'
  );
  const [githubUrl, setGithubUrl] = useState(currentUser?.github_url || '');
  const [linkedinUrl, setLinkedinUrl] = useState(currentUser?.linkedin_url || '');
  const [portfolioUrl, setPortfolioUrl] = useState(currentUser?.portfolio_url || '');
  const [learningGoals, setLearningGoals] = useState<string[]>(currentUser?.learning_goals || []);
  const [customGoal, setCustomGoal] = useState('');

  if (!currentUser) {
    return (
      <div style={{ maxWidth: '600px', margin: '60px auto', textAlign: 'center', padding: '24px' }}>
        <h2>Please sign in to view your profile</h2>
        <button onClick={() => navigate('/auth')} className="btn-primary" style={{ marginTop: '16px' }}>
          Go to Sign In
        </button>
      </div>
    );
  }

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

  const addGoal = () => {
    if (customGoal.trim() && !learningGoals.includes(customGoal.trim())) {
      setLearningGoals([...learningGoals, customGoal.trim()]);
      setCustomGoal('');
    }
  };

  const removeGoal = (g: string) => {
    setLearningGoals(learningGoals.filter(goal => goal !== g));
  };

  const handleSave = () => {
    updateCurrentUser({
      full_name: fullName,
      college,
      course,
      year_of_study: yearOfStudy,
      bio,
      skills,
      preferred_roles: preferredRoles,
      experience_level: experienceLevel,
      hours_per_week: hoursPerWeek,
      schedule_preference: schedulePref,
      github_url: githubUrl,
      linkedin_url: linkedinUrl,
      portfolio_url: portfolioUrl,
      learning_goals: learningGoals,
    });
    setIsEditing(false);
  };

  const userProjects = projects.filter(p => p.creator_id === currentUser.id || p.members.some(m => m.user_id === currentUser.id));

  // Dynamic Growth Suggestions tailored to persona
  const growthSuggestions = [
    `Your proficiency in ${currentUser.skills.slice(0, 2).join(' and ')} is in high demand across active hackathon projects.`,
    currentUser.learning_goals.length > 0 
      ? `Actively learning ${currentUser.learning_goals[0]} will unlock 94%+ compatibility on technical projects.` 
      : `Add 2 learning goals to accelerate complementary peer matching.`,
    `Your ${currentUser.schedule_preference} schedule (${currentUser.hours_per_week}h/wk) provides high synergy with campus teams.`
  ];

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', padding: '36px 24px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* Profile Header Card */}
      <div className="glass-card" style={{ padding: '36px', border: '1px solid rgba(99, 102, 241, 0.4)', position: 'relative' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '20px',
              background: 'var(--gradient-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              fontWeight: 800,
              color: '#ffffff',
              boxShadow: '0 8px 25px rgba(99, 102, 241, 0.4)',
            }}>
              {currentUser.full_name.charAt(0)}
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h1 style={{ fontSize: '1.8rem', color: '#ffffff' }}>{currentUser.full_name}</h1>
                <span style={{ padding: '2px 8px', borderRadius: 'var(--radius-full)', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', fontSize: '0.75rem', fontWeight: 700 }}>
                  Active Persona
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
                <MapPin size={15} color="var(--accent-cyan)" />
                <span>{currentUser.college} · {currentUser.course} ({currentUser.year_of_study})</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            {isEditing ? (
              <button onClick={handleSave} className="btn-primary" style={{ padding: '8px 18px', fontSize: '0.85rem' }}>
                <Save size={16} />
                <span>Save Changes</span>
              </button>
            ) : (
              <button onClick={() => setIsEditing(true)} className="btn-secondary" style={{ padding: '8px 18px', fontSize: '0.85rem' }}>
                <Edit3 size={16} />
                <span>Edit Profile</span>
              </button>
            )}
          </div>
        </div>

        {/* Profile Completion Meter */}
        <div style={{ marginTop: '24px', padding: '14px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '10px', border: '1px solid var(--border-glass)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', fontSize: '0.8rem' }}>
            <span style={{ fontWeight: 600, color: '#ffffff' }}>Profile Strength for Matching</span>
            <span style={{ fontWeight: 700, color: 'var(--accent-cyan)' }}>{profileCompletionPercentage}%</span>
          </div>
          <div style={{ width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ width: `${profileCompletionPercentage}%`, height: '100%', background: 'var(--gradient-primary)' }}></div>
          </div>
        </div>

      </div>

      {/* Growth Suggestions Card */}
      <div className="glass-card" style={{ padding: '24px', border: '1px solid rgba(6, 182, 212, 0.3)', background: 'rgba(6, 182, 212, 0.04)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <Lightbulb size={18} color="var(--accent-cyan)" />
          <h2 style={{ fontSize: '1.05rem', color: '#ffffff' }}>Career & Team Formation Insights</h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {growthSuggestions.map((sug, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <Zap size={14} color="var(--accent-cyan)" style={{ flexShrink: 0, marginTop: '3px' }} />
              <span>{sug}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Details Body */}
      {isEditing ? (
        /* Edit Mode Form */
        <div className="glass-card" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h2 style={{ fontSize: '1.2rem', color: '#ffffff' }}>Edit Builder Details</h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            <div>
              <label htmlFor="fullname-input" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#ffffff', marginBottom: '4px' }}>Full Name</label>
              <input id="fullname-input" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} style={{ width: '100%', padding: '10px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-glass)', borderRadius: '8px', color: '#ffffff', fontSize: '0.9rem' }} />
            </div>
            <div>
              <label htmlFor="college-input" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#ffffff', marginBottom: '4px' }}>College</label>
              <input id="college-input" type="text" value={college} onChange={(e) => setCollege(e.target.value)} style={{ width: '100%', padding: '10px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-glass)', borderRadius: '8px', color: '#ffffff', fontSize: '0.9rem' }} />
            </div>
          </div>

          <div>
            <label htmlFor="bio-input" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#ffffff', marginBottom: '4px' }}>Bio</label>
            <textarea id="bio-input" rows={3} value={bio} onChange={(e) => setBio(e.target.value)} style={{ width: '100%', padding: '10px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-glass)', borderRadius: '8px', color: '#ffffff', fontSize: '0.9rem', resize: 'vertical' }} />
          </div>

          <div>
            <span style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#ffffff', marginBottom: '6px' }}>Skills</span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
              {ALL_AVAILABLE_SKILLS.slice(0, 16).map(s => (
                <button type="button" key={s} aria-pressed={skills.includes(s)} onClick={() => toggleSkill(s)} style={{ padding: '4px 10px', borderRadius: '6px', background: skills.includes(s) ? 'rgba(99, 102, 241, 0.25)' : 'rgba(255,255,255,0.04)', color: skills.includes(s) ? '#ffffff' : 'var(--text-secondary)', border: '1px solid var(--border-glass)', fontSize: '0.75rem' }}>
                  {skills.includes(s) ? '✓ ' : '+ '}{s}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input type="text" aria-label="Add custom skill" value={customSkill} onChange={(e) => setCustomSkill(e.target.value)} placeholder="Add another skill..." style={{ flex: 1, padding: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-glass)', borderRadius: '6px', color: '#ffffff', fontSize: '0.8rem' }} />
              <button type="button" onClick={addCustomSkill} className="btn-secondary" style={{ padding: '8px 12px', fontSize: '0.75rem' }}>Add</button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div>
              <label htmlFor="hours-slider" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#ffffff', marginBottom: '4px' }}>Hours/Week: {hoursPerWeek}h</label>
              <input id="hours-slider" type="range" min={5} max={40} value={hoursPerWeek} onChange={(e) => setHoursPerWeek(parseInt(e.target.value))} style={{ width: '100%', accentColor: 'var(--accent-primary)' }} />
            </div>
            <div>
              <label htmlFor="portfolio-url-input" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#ffffff', marginBottom: '4px' }}>Portfolio URL</label>
              <input id="portfolio-url-input" type="url" value={portfolioUrl} onChange={(e) => setPortfolioUrl(e.target.value)} placeholder="https://..." style={{ width: '100%', padding: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-glass)', borderRadius: '6px', color: '#ffffff', fontSize: '0.85rem' }} />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
            <button type="button" onClick={() => setIsEditing(false)} className="btn-secondary">Cancel</button>
            <button type="button" onClick={handleSave} className="btn-primary">Save Profile</button>
          </div>
        </div>
      ) : (
        /* View Mode */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          
          {/* LEFT: Skills, Bio, Learning Goals */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            <div className="glass-card" style={{ padding: '28px' }}>
              <h2 style={{ fontSize: '1.1rem', color: '#ffffff', marginBottom: '10px' }}>About Me</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                {currentUser.bio || 'No bio provided yet.'}
              </p>
            </div>

            <div className="glass-card" style={{ padding: '28px' }}>
              <h2 style={{ fontSize: '1.1rem', color: '#ffffff', marginBottom: '14px' }}>Core Skills</h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {currentUser.skills.map(s => (
                  <span
                    key={s}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '8px',
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid var(--border-glass)',
                      color: '#ffffff',
                      fontSize: '0.85rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <Sparkles size={13} color="var(--accent-primary)" />
                    <span>{s}</span>
                  </span>
                ))}
              </div>
            </div>

            {currentUser.learning_goals && currentUser.learning_goals.length > 0 && (
              <div className="glass-card" style={{ padding: '28px' }}>
                <h2 style={{ fontSize: '1.1rem', color: '#ffffff', marginBottom: '14px' }}>Skills I Want to Learn</h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {currentUser.learning_goals.map(g => (
                    <span
                      key={g}
                      style={{
                        padding: '6px 12px',
                        borderRadius: 'var(--radius-full)',
                        background: 'rgba(139, 92, 246, 0.15)',
                        border: '1px solid rgba(139, 92, 246, 0.3)',
                        color: '#ddd6fe',
                        fontSize: '0.8rem',
                      }}
                    >
                      🎯 {g}
                    </span>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* RIGHT: Roles, Availability & Projects */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            <div className="glass-card" style={{ padding: '28px' }}>
              <h2 style={{ fontSize: '1.1rem', color: '#ffffff', marginBottom: '16px' }}>Availability & Schedule</h2>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                <div style={{ padding: '12px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '8px', border: '1px solid var(--border-glass)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Weekly Commitment</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff' }}>{currentUser.hours_per_week} hrs/wk</div>
                </div>
                <div style={{ padding: '12px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '8px', border: '1px solid var(--border-glass)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Working Schedule</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>{currentUser.schedule_preference}</div>
                </div>
              </div>

              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Days active: {currentUser.days_available?.join(', ') || 'Flexible'}
              </div>
            </div>

            <div className="glass-card" style={{ padding: '28px' }}>
              <h2 style={{ fontSize: '1.1rem', color: '#ffffff', marginBottom: '14px' }}>My Active Projects ({userProjects.length})</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {userProjects.map(p => (
                  <button
                    type="button"
                    key={p.id}
                    onClick={() => navigate(`/projects/${p.id}`)}
                    style={{ padding: '12px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px', border: '1px solid var(--border-glass)', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', textAlign: 'left' }}
                  >
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#ffffff' }}>{p.title}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)' }}>{p.category}</div>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>View →</span>
                  </button>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
