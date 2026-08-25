import React from 'react';
import { Sparkles, Users, FolderGit2, Zap, ArrowRight, CheckCircle2, Plus, Clock, Award, Bell, ShieldAlert } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CompatibilityRing } from '../components/CompatibilityRing';
import { calculateLocalMatch } from '../lib/gemini';

interface DashboardPageProps {
  navigate: (route: string) => void;
  openProfileModal: (profile: any) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ navigate, openProfileModal }) => {
  const { currentUser, projects, profiles, invitations, respondToInvitation, profileCompletionPercentage } = useApp();

  const userProjects = projects.filter(p => p.creator_id === currentUser?.id || p.members.some(m => m.user_id === currentUser?.id));
  const pendingInvites = invitations.filter(i => (i.recipient_id === currentUser?.id || i.recipient_id === currentUser?.email) && i.status === 'pending');

  // Compute recommended projects for currentUser
  const recommendedProjects = projects
    .filter(p => !userProjects.some(up => up.id === p.id))
    .map(p => {
      const match = currentUser ? calculateLocalMatch(p, currentUser) : { overallScore: 88 };
      return { project: p, score: match.overallScore };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  // Compute recommended peers with complementary skills
  const recommendedPeers = profiles
    .filter(p => p.id !== currentUser?.id)
    .slice(0, 3);

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* Welcome Banner + Profile Completion Card */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        
        {/* Greeting Banner */}
        <div className="glass-card" style={{ padding: '32px', position: 'relative', overflow: 'hidden', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 12px', background: 'rgba(99, 102, 241, 0.15)', borderRadius: '9999px', color: '#a5b4fc', fontSize: '0.75rem', fontWeight: 600, marginBottom: '12px' }}>
            <Sparkles size={14} />
            <span>Builder Dashboard</span>
          </div>

          <h1 style={{ fontSize: '2rem', color: '#ffffff', marginBottom: '8px' }}>
            Welcome back, <span className="gradient-text">{currentUser?.full_name?.split(' ')[0] || 'Builder'}</span>!
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '20px', lineHeight: 1.5 }}>
            {currentUser?.course} ({currentUser?.year_of_study}) · {currentUser?.college}
          </p>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button onClick={() => navigate('/projects')} className="btn-primary" style={{ padding: '8px 18px', fontSize: '0.85rem' }}>
              <FolderGit2 size={16} />
              <span>Explore Projects</span>
            </button>
            <button onClick={() => navigate('/community')} className="btn-secondary" style={{ padding: '8px 18px', fontSize: '0.85rem' }}>
              <Users size={16} />
              <span>Discover Teammates</span>
            </button>
          </div>
        </div>

        {/* Profile Completion Meter */}
        <div className="glass-card" style={{ padding: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#ffffff' }}>Profile Completion</span>
              <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>{profileCompletionPercentage}%</span>
            </div>
            <div style={{ width: '100%', height: '8px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '4px', overflow: 'hidden', marginBottom: '14px' }}>
              <div style={{ width: `${profileCompletionPercentage}%`, height: '100%', background: 'var(--gradient-primary)', transition: 'width 0.4s ease' }}></div>
            </div>

            {profileCompletionPercentage < 100 ? (
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                💡 <strong>Optimization Tip:</strong> Add your weekly availability and learning goals to improve Gemini AI match accuracy by +15%.
              </p>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981', fontSize: '0.85rem', fontWeight: 600 }}>
                <CheckCircle2 size={16} />
                <span>All profile fields complete! Optimal AI matching active.</span>
              </div>
            )}
          </div>

          <button
            onClick={() => navigate('/onboarding')}
            className="btn-secondary"
            style={{ alignSelf: 'flex-start', marginTop: '16px', padding: '6px 14px', fontSize: '0.8rem' }}
          >
            Update Profile Setup →
          </button>
        </div>

      </div>

      {/* AI Key Match Statistics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-primary)', marginBottom: '8px' }}>
            <FolderGit2 size={18} />
            <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>Project Matches</span>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff' }}>3 High Matches</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>Aligning with {currentUser?.skills[0] || 'your core skills'}</div>
        </div>

        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-cyan)', marginBottom: '8px' }}>
            <Users size={18} />
            <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>Peer Opportunities</span>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff' }}>5 Candidates</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>Seeking your {currentUser?.preferred_roles[0] || 'Role'} expertise</div>
        </div>

        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-emerald)', marginBottom: '8px' }}>
            <Zap size={18} />
            <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>Highest Synergy</span>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff' }}>94% Match</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>PulseSense AI Co-Pilot</div>
        </div>

        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-rose)', marginBottom: '8px' }}>
            <ShieldAlert size={18} />
            <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>Skill Gap Alerts</span>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff' }}>1 Role Gap</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>UI/UX Designer required</div>
        </div>
      </div>

      {/* Pending Invitations Banner (if any) */}
      {pendingInvites.length > 0 && (
        <div className="glass-card" style={{ padding: '24px', border: '1px solid rgba(99, 102, 241, 0.4)', background: 'rgba(99, 102, 241, 0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-cyan)', fontWeight: 700, marginBottom: '12px' }}>
            <Bell size={18} />
            <span>Pending Team Invitations ({pendingInvites.length})</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {pendingInvites.map(inv => (
              <div key={inv.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', padding: '14px', background: 'rgba(15, 23, 42, 0.8)', borderRadius: '10px', border: '1px solid var(--border-glass)' }}>
                <div>
                  <div style={{ fontWeight: 700, color: '#ffffff' }}>{inv.project_title}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    Invited by <strong>{inv.sender_name}</strong> as <strong>{inv.role_offered_or_requested || 'Team Member'}</strong>
                  </div>
                  {inv.message && (
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px', fontStyle: 'italic' }}>
                      "{inv.message}"
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => respondToInvitation(inv.id, true)} className="btn-primary" style={{ padding: '6px 14px', fontSize: '0.8rem' }}>
                    Accept
                  </button>
                  <button onClick={() => respondToInvitation(inv.id, false)} className="btn-secondary" style={{ padding: '6px 14px', fontSize: '0.8rem' }}>
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Two-Column Content: Recommended Projects & Active Teams */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '28px' }}>
        
        {/* Recommended Projects for You */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.25rem', color: '#ffffff' }}>Recommended Projects for You</h3>
            <button onClick={() => navigate('/projects')} style={{ background: 'transparent', color: 'var(--accent-cyan)', fontSize: '0.85rem', fontWeight: 600 }}>
              View All →
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {recommendedProjects.map(({ project, score }) => (
              <div 
                key={project.id} 
                className="glass-card" 
                onClick={() => navigate(`/projects/${project.id}`)}
                style={{ padding: '20px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'inline-block', padding: '2px 8px', borderRadius: '4px', background: 'rgba(99, 102, 241, 0.15)', color: '#c7d2fe', fontSize: '0.7rem', fontWeight: 600, marginBottom: '6px' }}>
                    {project.category}
                  </div>
                  <h4 style={{ fontSize: '1rem', color: '#ffffff', marginBottom: '4px' }}>{project.title}</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {project.description}
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '8px' }}>
                    {project.required_skills.slice(0, 3).map(s => (
                      <span key={s} style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>• {s}</span>
                    ))}
                  </div>
                </div>

                <CompatibilityRing score={score} size={54} strokeWidth={5} showLabel={false} />
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Teammates */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.25rem', color: '#ffffff' }}>Recommended Teammates</h3>
            <button onClick={() => navigate('/community')} style={{ background: 'transparent', color: 'var(--accent-cyan)', fontSize: '0.85rem', fontWeight: 600 }}>
              Discover →
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {recommendedPeers.map(peer => (
              <div 
                key={peer.id} 
                className="glass-card" 
                onClick={() => openProfileModal(peer)}
                style={{ padding: '16px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', fontWeight: 800, fontSize: '1.1rem' }}>
                    {peer.full_name.charAt(0)}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.95rem', color: '#ffffff' }}>{peer.full_name}</h4>
                    <div style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)' }}>{peer.preferred_roles[0]} · {peer.college.split(' ')[0]}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      Skills: {peer.skills.slice(0, 3).join(', ')}
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span style={{ padding: '4px 10px', borderRadius: 'var(--radius-full)', background: 'rgba(16, 185, 129, 0.15)', color: '#6ee7b7', fontSize: '0.75rem', fontWeight: 700 }}>
                    92% Fit
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* My Active Projects / Teams Section */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1.25rem', color: '#ffffff' }}>My Active Projects & Workspaces</h3>
          <button onClick={() => navigate('/projects')} className="btn-secondary" style={{ padding: '6px 14px', fontSize: '0.8rem' }}>
            <Plus size={14} />
            <span>Create New Project</span>
          </button>
        </div>

        {userProjects.length === 0 ? (
          <div className="glass-card" style={{ padding: '40px', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>You haven't joined or created any projects yet.</p>
            <button onClick={() => navigate('/projects')} className="btn-primary" style={{ padding: '8px 20px', fontSize: '0.85rem' }}>
              Explore Projects
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
            {userProjects.map(proj => (
              <div key={proj.id} className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '4px', background: 'rgba(99, 102, 241, 0.15)', color: '#c7d2fe', fontWeight: 600 }}>
                      {proj.category}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {proj.members.length} / {proj.members_needed} members
                    </span>
                  </div>

                  <h4 style={{ fontSize: '1.1rem', color: '#ffffff', marginBottom: '6px' }}>{proj.title}</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                    {proj.description.slice(0, 100)}...
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                  <button
                    onClick={() => navigate(`/workspace/${proj.id}`)}
                    className="btn-primary"
                    style={{ flex: 1, padding: '8px', fontSize: '0.8rem', justifyContent: 'center' }}
                  >
                    Open Workspace
                  </button>
                  <button
                    onClick={() => navigate(`/projects/${proj.id}/ai-team`)}
                    className="btn-secondary"
                    style={{ padding: '8px 12px', fontSize: '0.8rem' }}
                    title="AI Team Assembly Lab"
                  >
                    <Zap size={15} color="var(--accent-cyan)" />
                    <span>AI Lab</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
