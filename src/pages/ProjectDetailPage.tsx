import React, { useState, useEffect } from 'react';
import { ArrowLeft, Sparkles, Users, Calendar, Clock, Award, CheckCircle2, AlertTriangle, Send, Zap, FolderGit2, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Project, RoleType, AIMatchAnalysis } from '../types';
import { evaluateCandidateMatch, calculateLocalMatch } from '../lib/gemini';
import { CompatibilityRing } from '../components/CompatibilityRing';

interface ProjectDetailPageProps {
  projectId: string;
  navigate: (route: string) => void;
  openProfileModal: (profile: any) => void;
}

export const ProjectDetailPage: React.FC<ProjectDetailPageProps> = ({ projectId, navigate, openProfileModal }) => {
  const { projects, currentUser, applyToProject, addToast } = useApp();

  const project = projects.find(p => p.id === projectId);

  const [aiAnalysis, setAiAnalysis] = useState<AIMatchAnalysis | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [applyRole, setApplyRole] = useState<RoleType>('Developer');
  const [applyMessage, setApplyMessage] = useState('');
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    if (project && currentUser) {
      setApplyRole(currentUser.preferred_roles[0] || 'Developer');
      // Execute match analysis
      setLoadingAi(true);
      evaluateCandidateMatch(project, currentUser).then(res => {
        setAiAnalysis(res);
        setLoadingAi(false);
      });
    } else if (project) {
      setAiAnalysis({
        overallScore: 85,
        skillMatch: 88,
        roleMatch: 90,
        availabilityMatch: 80,
        experienceMatch: 85,
        interestMatch: 88,
        keyStrengths: ['Strong complementary project fit.'],
        growthAreas: ['Sign in to view personalized AI match metrics.'],
        synergyReasoning: 'Sign in to see detailed AI suitability insights for this project.',
      });
    }
  }, [project, currentUser]);

  if (!project) {
    return (
      <div style={{ maxWidth: '800px', margin: '60px auto', textAlign: 'center', padding: '24px' }}>
        <h2>Project not found</h2>
        <button onClick={() => navigate('/projects')} className="btn-primary" style={{ marginTop: '16px' }}>
          Back to Projects
        </button>
      </div>
    );
  }

  const isMember = project.members.some(m => m.user_id === currentUser?.id);
  const isCreator = project.creator_id === currentUser?.id;

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      navigate('/auth');
      return;
    }
    applyToProject(project.id, applyMessage, applyRole);
    setHasApplied(true);
  };

  return (
    <div style={{ maxWidth: '1180px', margin: '0 auto', padding: '36px 24px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* Back Link */}
      <button
        onClick={() => navigate('/projects')}
        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'transparent', color: 'var(--text-secondary)', fontSize: '0.9rem' }}
      >
        <ArrowLeft size={16} />
        <span>Back to Project Directory</span>
      </button>

      {/* Project Overview Card */}
      <div className="glass-card" style={{ padding: '36px', border: '1px solid rgba(99, 102, 241, 0.3)', position: 'relative' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span style={{ padding: '3px 10px', borderRadius: 'var(--radius-full)', background: 'rgba(99, 102, 241, 0.15)', color: '#c7d2fe', fontSize: '0.75rem', fontWeight: 600 }}>
                {project.category}
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Created by <strong>{project.creator_name || 'Project Lead'}</strong>
              </span>
            </div>
            <h1 style={{ fontSize: '2.2rem', color: '#ffffff', lineHeight: 1.2 }}>{project.title}</h1>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => navigate(`/projects/${project.id}/ai-team`)}
              className="btn-primary"
              style={{ padding: '10px 20px', fontSize: '0.9rem' }}
            >
              <Zap size={16} />
              <span>AI Team & Gap Lab</span>
            </button>
            {isMember && (
              <button
                onClick={() => navigate(`/workspace/${project.id}`)}
                className="btn-secondary"
                style={{ padding: '10px 18px', fontSize: '0.9rem' }}
              >
                <FolderGit2 size={16} />
                <span>Workspace</span>
              </button>
            )}
          </div>
        </div>

        <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '28px' }}>
          {project.description}
        </p>

        {/* Specs Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', padding: '18px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
              <Users size={14} color="var(--accent-primary)" />
              <span>Team Size</span>
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff' }}>
              {project.members.length} / {project.members_needed} Members Filled
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
              <Clock size={14} color="var(--accent-cyan)" />
              <span>Commitment</span>
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff' }}>
              {project.commitment_hours} hrs / week
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
              <Calendar size={14} color="var(--accent-emerald)" />
              <span>Target Deadline</span>
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff' }}>
              {project.deadline}
            </div>
          </div>
        </div>
      </div>

      {/* Main 2-Column: AI Candidate Match Station vs Team Roster & Apply */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '32px' }}>
        
        {/* LEFT: Comprehensive AI Match Analysis */}
        <div className="glass-card" style={{ padding: '32px', border: '1px solid rgba(99, 102, 241, 0.4)' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-cyan)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>
                <Sparkles size={14} />
                <span>AI Team Fit Analysis</span>
              </div>
              <h3 style={{ fontSize: '1.3rem', color: '#ffffff', marginTop: '2px' }}>
                Your Compatibility Report
              </h3>
            </div>

            {aiAnalysis && (
              <CompatibilityRing score={aiAnalysis.overallScore} size={64} strokeWidth={6} label="Overall Match" />
            )}
          </div>

          {loadingAi ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
              <Sparkles size={24} color="var(--accent-primary)" style={{ animation: 'spin 2s linear infinite', marginBottom: '12px' }} />
              <div>Gemini AI analyzing multi-dimensional synergy...</div>
            </div>
          ) : aiAnalysis ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Detailed Metrics Breakdown */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                <div style={{ padding: '12px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px', border: '1px solid var(--border-glass)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    <span>Skill Coverage</span>
                    <span style={{ color: '#ffffff', fontWeight: 700 }}>{aiAnalysis.skillMatch}%</span>
                  </div>
                  <div style={{ width: '100%', height: '5px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', marginTop: '6px', overflow: 'hidden' }}>
                    <div style={{ width: `${aiAnalysis.skillMatch}%`, height: '100%', background: 'var(--gradient-primary)' }}></div>
                  </div>
                </div>

                <div style={{ padding: '12px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px', border: '1px solid var(--border-glass)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    <span>Role Alignment</span>
                    <span style={{ color: '#ffffff', fontWeight: 700 }}>{aiAnalysis.roleMatch}%</span>
                  </div>
                  <div style={{ width: '100%', height: '5px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', marginTop: '6px', overflow: 'hidden' }}>
                    <div style={{ width: `${aiAnalysis.roleMatch}%`, height: '100%', background: 'var(--accent-cyan)' }}></div>
                  </div>
                </div>

                <div style={{ padding: '12px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px', border: '1px solid var(--border-glass)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    <span>Availability Overlap</span>
                    <span style={{ color: '#ffffff', fontWeight: 700 }}>{aiAnalysis.availabilityMatch}%</span>
                  </div>
                  <div style={{ width: '100%', height: '5px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', marginTop: '6px', overflow: 'hidden' }}>
                    <div style={{ width: `${aiAnalysis.availabilityMatch}%`, height: '100%', background: 'var(--accent-emerald)' }}></div>
                  </div>
                </div>

                <div style={{ padding: '12px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px', border: '1px solid var(--border-glass)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    <span>Experience Fit</span>
                    <span style={{ color: '#ffffff', fontWeight: 700 }}>{aiAnalysis.experienceMatch}%</span>
                  </div>
                  <div style={{ width: '100%', height: '5px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', marginTop: '6px', overflow: 'hidden' }}>
                    <div style={{ width: `${aiAnalysis.experienceMatch}%`, height: '100%', background: 'var(--accent-amber)' }}></div>
                  </div>
                </div>
              </div>

              {/* Narrative Synergy Reasoning */}
              <div style={{ padding: '14px', background: 'rgba(99, 102, 241, 0.08)', borderRadius: '10px', border: '1px solid rgba(99, 102, 241, 0.25)' }}>
                <div style={{ fontSize: '0.85rem', color: '#ffffff', fontWeight: 600, marginBottom: '4px' }}>
                  AI Synergy Rationale:
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {aiAnalysis.synergyReasoning}
                </p>
              </div>

              {/* Key Strengths */}
              <div>
                <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '8px' }}>
                  Key Value Additions:
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {aiAnalysis.keyStrengths.map((str, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.85rem', color: '#6ee7b7' }}>
                      <CheckCircle2 size={15} style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span>{str}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Growth Areas / Caveats */}
              {aiAnalysis.growthAreas && aiAnalysis.growthAreas.length > 0 && (
                <div>
                  <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '8px' }}>
                    Considerations & Nuances:
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {aiAnalysis.growthAreas.map((grw, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.85rem', color: '#fbbf24' }}>
                        <AlertTriangle size={15} style={{ flexShrink: 0, marginTop: '2px' }} />
                        <span>{grw}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          ) : null}
        </div>

        {/* RIGHT: Team Roster + Application Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Current Team Roster */}
          <div className="glass-card" style={{ padding: '28px' }}>
            <h3 style={{ fontSize: '1.2rem', color: '#ffffff', marginBottom: '16px' }}>
              Current Team Roster ({project.members.length})
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {project.members.map(member => (
                <div
                  key={member.user_id}
                  onClick={() => member.profile && openProfileModal(member.profile)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    borderRadius: '10px',
                    border: '1px solid var(--border-glass)',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#ffffff' }}>
                      {member.profile?.full_name?.charAt(0) || 'M'}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, color: '#ffffff', fontSize: '0.9rem' }}>{member.profile?.full_name || 'Member'}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)' }}>{member.role}</div>
                    </div>
                  </div>

                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    View Profile →
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Application Form */}
          {!isMember && !isCreator && (
            <div className="glass-card" style={{ padding: '28px' }}>
              <h3 style={{ fontSize: '1.2rem', color: '#ffffff', marginBottom: '8px' }}>
                Request to Join This Team
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                Submit a direct join request with your intended role contribution.
              </p>

              {hasApplied ? (
                <div style={{ padding: '16px', background: 'rgba(16, 185, 129, 0.15)', borderRadius: '10px', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#6ee7b7', textAlign: 'center', fontSize: '0.9rem', fontWeight: 600 }}>
                  <CheckCircle2 size={20} style={{ margin: '0 auto 6px' }} />
                  <div>Join request submitted to {project.creator_name}!</div>
                </div>
              ) : (
                <form onSubmit={handleApply} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#ffffff', marginBottom: '4px' }}>
                      Role You Want to Fill
                    </label>
                    <select
                      value={applyRole}
                      onChange={(e) => setApplyRole(e.target.value as RoleType)}
                      style={{ width: '100%', padding: '10px 12px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-glass)', borderRadius: '8px', color: '#ffffff', fontSize: '0.9rem', outline: 'none' }}
                    >
                      {project.required_roles.map(r => (
                        <option key={r} value={r} style={{ background: '#0f172a' }}>{r}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#ffffff', marginBottom: '4px' }}>
                      Pitch / Intro Note
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={applyMessage}
                      onChange={(e) => setApplyMessage(e.target.value)}
                      placeholder="Explain how your background helps achieve this project's milestones..."
                      style={{ width: '100%', padding: '10px 12px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-glass)', borderRadius: '8px', color: '#ffffff', fontSize: '0.9rem', outline: 'none', resize: 'none' }}
                    />
                  </div>

                  <button type="submit" className="btn-primary" style={{ justifyContent: 'center', padding: '12px' }}>
                    <Send size={16} />
                    <span>Submit Join Request</span>
                  </button>
                </form>
              )}
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
