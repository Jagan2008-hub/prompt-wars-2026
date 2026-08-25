import React, { useState } from 'react';
import { Search, Filter, Sparkles, UserPlus, Eye, MapPin, Clock, Calendar, ArrowUpDown, CheckCircle2, Zap } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserProfile, RoleType, ExperienceLevel } from '../types';
import { ALL_AVAILABLE_SKILLS, ALL_ROLES } from '../data/mockData';
import { CompatibilityRing } from '../components/CompatibilityRing';
import { calculateLocalMatch } from '../lib/matching';

interface CommunityPageProps {
  openProfileModal: (profile: UserProfile) => void;
  openInviteModal: (profile: UserProfile) => void;
}

export const CommunityPage: React.FC<CommunityPageProps> = ({ openProfileModal, openInviteModal }) => {
  const { profiles, currentUser, projects } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('All');
  const [selectedSkill, setSelectedSkill] = useState<string>('All');
  const [selectedExperience, setSelectedExperience] = useState<string>('All');
  const [selectedSchedule, setSelectedSchedule] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'match' | 'hours' | 'name'>('match');

  const activeUserProject = projects.find(p => p.creator_id === currentUser?.id);

  // Compute profile matches & filter
  const processedProfiles = profiles.map(p => {
    let matchScore = 88 + (p.skills.length % 9);
    if (activeUserProject) {
      matchScore = calculateLocalMatch(activeUserProject, p).overallScore;
    } else if (currentUser) {
      // Peer-to-peer complementary score
      const sharedInterests = p.interests.filter(i => currentUser.interests.includes(i)).length;
      const compSkills = p.skills.filter(s => !currentUser.skills.includes(s)).length;
      matchScore = Math.min(97, 82 + (sharedInterests * 4) + (compSkills * 2));
    }
    const isTopRecommended = matchScore >= 90;

    const sharedSkills = p.skills.filter(s => currentUser?.skills.includes(s));
    const complementarySkills = p.skills.filter(s => !currentUser?.skills.includes(s));

    return {
      ...p,
      matchScore,
      isTopRecommended,
      sharedSkills,
      complementarySkills,
    };
  });

  const filteredProfiles = processedProfiles.filter(p => {
    const matchesSearch = 
      p.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.college.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.course.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
      p.preferred_roles.some(r => r.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesRole = selectedRole === 'All' || p.preferred_roles.includes(selectedRole as RoleType);
    const matchesSkill = selectedSkill === 'All' || p.skills.some(s => s.toLowerCase() === selectedSkill.toLowerCase());
    const matchesExp = selectedExperience === 'All' || p.experience_level === selectedExperience;
    const matchesSchedule = selectedSchedule === 'All' || p.schedule_preference === selectedSchedule;

    return matchesSearch && matchesRole && matchesSkill && matchesExp && matchesSchedule;
  });

  // Sorting
  filteredProfiles.sort((a, b) => {
    if (sortBy === 'match') return b.matchScore - a.matchScore;
    if (sortBy === 'hours') return b.hours_per_week - a.hours_per_week;
    return a.full_name.localeCompare(b.full_name);
  });

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '36px 24px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* Header Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 12px', background: 'rgba(6, 182, 212, 0.15)', borderRadius: '9999px', color: 'var(--accent-cyan)', fontSize: '0.75rem', fontWeight: 600, marginBottom: '8px' }}>
            <Sparkles size={14} />
            <span>Campus Talent Network</span>
          </div>
          <h1 style={{ fontSize: '2.2rem', color: '#ffffff' }}>Discover Teammates & Builders</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Browse verified students, view skill proficiencies, and discover candidates with complementary abilities.
          </p>
        </div>

        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Showing <strong>{filteredProfiles.length}</strong> available builders
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        {/* Search Input & Sort Selector */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
            <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '14px' }} />
            <input
              type="text"
              aria-label="Search builders"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, skill (e.g. PyTorch, React, UI/UX), role, or university..."
              style={{
                width: '100%',
                padding: '12px 14px 12px 42px',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--border-glass)',
                borderRadius: '10px',
                color: '#ffffff',
                fontSize: '0.95rem',
                outline: 'none',
              }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ArrowUpDown size={16} color="var(--text-muted)" />
            <select
              aria-label="Sort options"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              style={{ padding: '12px 16px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-glass)', borderRadius: '10px', color: '#ffffff', fontSize: '0.85rem', outline: 'none' }}
            >
              <option value="match" style={{ background: '#0f172a' }}>Sort: Best Match</option>
              <option value="hours" style={{ background: '#0f172a' }}>Sort: Most Available Hours</option>
              <option value="name" style={{ background: '#0f172a' }}>Sort: Alphabetical (Name)</option>
            </select>
          </div>
        </div>

        {/* Filter Dropdowns & Pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
          
          {/* Role Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <label htmlFor="comm-role-select" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>ROLE:</label>
            <select
              id="comm-role-select"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              style={{ padding: '6px 12px', background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border-glass)', borderRadius: '8px', color: '#ffffff', fontSize: '0.85rem', outline: 'none' }}
            >
              <option value="All" style={{ background: '#0f172a' }}>All Roles</option>
              {ALL_ROLES.map(r => (
                <option key={r} value={r} style={{ background: '#0f172a' }}>{r}</option>
              ))}
            </select>
          </div>

          {/* Skill Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <label htmlFor="comm-skill-select" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>SKILL:</label>
            <select
              id="comm-skill-select"
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
              style={{ padding: '6px 12px', background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border-glass)', borderRadius: '8px', color: '#ffffff', fontSize: '0.85rem', outline: 'none' }}
            >
              <option value="All" style={{ background: '#0f172a' }}>All Skills</option>
              {ALL_AVAILABLE_SKILLS.slice(0, 20).map(s => (
                <option key={s} value={s} style={{ background: '#0f172a' }}>{s}</option>
              ))}
            </select>
          </div>

          {/* Experience Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <label htmlFor="comm-exp-select" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>EXPERIENCE:</label>
            <select
              id="comm-exp-select"
              value={selectedExperience}
              onChange={(e) => setSelectedExperience(e.target.value)}
              style={{ padding: '6px 12px', background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border-glass)', borderRadius: '8px', color: '#ffffff', fontSize: '0.85rem', outline: 'none' }}
            >
              <option value="All" style={{ background: '#0f172a' }}>All Levels</option>
              <option value="Beginner" style={{ background: '#0f172a' }}>Beginner</option>
              <option value="Intermediate" style={{ background: '#0f172a' }}>Intermediate</option>
              <option value="Advanced" style={{ background: '#0f172a' }}>Advanced</option>
            </select>
          </div>

          {/* Schedule Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <label htmlFor="comm-sched-select" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>SCHEDULE:</label>
            <select
              id="comm-sched-select"
              value={selectedSchedule}
              onChange={(e) => setSelectedSchedule(e.target.value)}
              style={{ padding: '6px 12px', background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border-glass)', borderRadius: '8px', color: '#ffffff', fontSize: '0.85rem', outline: 'none' }}
            >
              <option value="All" style={{ background: '#0f172a' }}>Any Schedule</option>
              <option value="Flexible" style={{ background: '#0f172a' }}>Flexible</option>
              <option value="Evenings" style={{ background: '#0f172a' }}>Evenings</option>
              <option value="Weekends" style={{ background: '#0f172a' }}>Weekends</option>
              <option value="Weekdays" style={{ background: '#0f172a' }}>Weekdays</option>
            </select>
          </div>

          {(selectedRole !== 'All' || selectedSkill !== 'All' || selectedExperience !== 'All' || selectedSchedule !== 'All' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedRole('All');
                setSelectedSkill('All');
                setSelectedExperience('All');
                setSelectedSchedule('All');
                setSearchQuery('');
              }}
              style={{ background: 'transparent', color: 'var(--accent-rose)', fontSize: '0.8rem', fontWeight: 600, padding: '4px 8px' }}
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Profiles Grid */}
      {filteredProfiles.length === 0 ? (
        <div className="glass-card" style={{ padding: '60px 24px', textAlign: 'center' }}>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
            No student profiles matched your filter criteria.
          </p>
          <button
            onClick={() => {
              setSelectedRole('All');
              setSelectedSkill('All');
              setSelectedExperience('All');
              setSelectedSchedule('All');
              setSearchQuery('');
            }}
            className="btn-primary"
            style={{ padding: '8px 20px', fontSize: '0.85rem' }}
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
          {filteredProfiles.map(profile => {
            return (
              <div
                key={profile.id}
                className="glass-card"
                style={{
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '16px',
                  border: profile.isTopRecommended 
                    ? '1px solid rgba(16, 185, 129, 0.45)' 
                    : profile.id === currentUser?.id 
                    ? '1px solid rgba(99, 102, 241, 0.5)' 
                    : '1px solid var(--border-glass)',
                }}
              >
                {/* Top Section */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div style={{
                        width: '52px',
                        height: '52px',
                        borderRadius: '14px',
                        background: 'var(--gradient-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ffffff',
                        fontWeight: 800,
                        fontSize: '1.3rem',
                        boxShadow: '0 4px 15px rgba(99, 102, 241, 0.25)',
                      }}>
                        {profile.full_name.charAt(0)}
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <h2 style={{ fontSize: '1.15rem', color: '#ffffff' }}>{profile.full_name}</h2>
                          {profile.id === currentUser?.id && (
                            <span style={{ fontSize: '0.65rem', padding: '1px 6px', background: 'rgba(99, 102, 241, 0.25)', color: '#c7d2fe', borderRadius: '4px', fontWeight: 700 }}>YOU</span>
                          )}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                          {profile.course} · {profile.year_of_study}
                        </div>
                      </div>
                    </div>

                    <CompatibilityRing score={profile.matchScore} size={48} strokeWidth={4} showLabel={false} />
                  </div>

                  {/* Top Recommended Badge */}
                  {profile.isTopRecommended && (
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '3px 10px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: 'var(--radius-full)', color: '#6ee7b7', fontSize: '0.7rem', fontWeight: 700, marginBottom: '10px' }}>
                      <Sparkles size={12} />
                      <span>Top Match</span>
                    </div>
                  )}

                  {/* College Tag */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                    <MapPin size={13} color="var(--accent-cyan)" />
                    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{profile.college}</span>
                  </div>

                  {/* Preferred Roles */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '12px' }}>
                    {profile.preferred_roles.map(r => (
                      <span
                        key={r}
                        style={{
                          padding: '2px 8px',
                          borderRadius: 'var(--radius-full)',
                          background: 'rgba(99, 102, 241, 0.15)',
                          color: '#c7d2fe',
                          fontSize: '0.7rem',
                          fontWeight: 600,
                        }}
                      >
                        {r}
                      </span>
                    ))}
                    <span style={{ padding: '2px 8px', borderRadius: 'var(--radius-full)', background: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-secondary)', fontSize: '0.7rem' }}>
                      {profile.experience_level}
                    </span>
                  </div>

                  {/* Skills Chips */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '12px' }}>
                    {profile.skills.slice(0, 4).map(skill => (
                      <span
                        key={skill}
                        style={{
                          padding: '3px 8px',
                          borderRadius: '6px',
                          background: 'rgba(255, 255, 255, 0.04)',
                          border: '1px solid var(--border-glass)',
                          color: '#ffffff',
                          fontSize: '0.75rem',
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                    {profile.skills.length > 4 && (
                      <span style={{ padding: '3px 6px', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        +{profile.skills.length - 4} more
                      </span>
                    )}
                  </div>

                  {/* Availability */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '8px', border: '1px solid var(--border-glass)', fontSize: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-muted)' }}>
                      <Clock size={13} color="var(--accent-primary)" />
                      <span>{profile.hours_per_week}h/week</span>
                    </div>
                    <div style={{ color: 'var(--accent-emerald)', fontWeight: 600 }}>
                      {profile.schedule_preference}
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid var(--border-glass)', paddingTop: '14px' }}>
                  <button
                    onClick={() => openProfileModal(profile)}
                    className="btn-secondary"
                    style={{ flex: 1, padding: '8px', fontSize: '0.8rem', justifyContent: 'center' }}
                  >
                    <Eye size={14} />
                    <span>View Profile</span>
                  </button>
                  {profile.id !== currentUser?.id && (
                    <button
                      onClick={() => openInviteModal(profile)}
                      className="btn-primary"
                      style={{ padding: '8px 14px', fontSize: '0.8rem' }}
                      title="Invite to team"
                    >
                      <UserPlus size={14} />
                      <span>Invite</span>
                    </button>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
