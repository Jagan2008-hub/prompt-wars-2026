import React, { useState, useEffect } from 'react';
import { ArrowLeft, Sparkles, Users, Layers, Zap, CheckCircle2, AlertTriangle, UserPlus, RefreshCw, Send, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';
import { Project, SkillGapItem, DreamTeamResult, UserProfile } from '../types';
import { detectSkillGaps, generateAIDreamTeam } from '../lib/gemini';
import { SkillGapBadge } from '../components/SkillGapBadge';
import { CompatibilityRing } from '../components/CompatibilityRing';

interface AIDreamTeamPageProps {
  projectId: string;
  navigate: (route: string) => void;
  openProfileModal: (profile: UserProfile) => void;
  openInviteModal: (profile: UserProfile) => void;
}

export const AIDreamTeamPage: React.FC<AIDreamTeamPageProps> = ({
  projectId,
  navigate,
  openProfileModal,
  openInviteModal,
}) => {
  const { projects, profiles, inviteUserToProject, addToast } = useApp();

  const project = projects.find(p => p.id === projectId);

  const [skillGaps, setSkillGaps] = useState<SkillGapItem[]>([]);
  const [dreamTeam, setDreamTeam] = useState<DreamTeamResult | null>(null);
  const [loadingTeam, setLoadingTeam] = useState(false);
  const [invitedAll, setInvitedAll] = useState(false);

  const runAnalysis = () => {
    if (!project) return;
    setLoadingTeam(true);

    const gaps = detectSkillGaps(project, profiles);
    setSkillGaps(gaps);

    generateAIDreamTeam(project, profiles).then(res => {
      setDreamTeam(res);
      setLoadingTeam(false);
    });
  };

  useEffect(() => {
    if (project) {
      runAnalysis();
    }
  }, [project, profiles]);

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

  const handleBatchInvite = () => {
    if (!dreamTeam) return;

    dreamTeam.recommendedTeam.forEach(m => {
      inviteUserToProject(
        project.id,
        m.profile.id,
        m.assignedRole,
        `AI Dream Team invitation for ${project.title} as ${m.assignedRole}!`
      );
    });

    setInvitedAll(true);
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 }
    });
    addToast('Batch invitations sent to all AI Dream Team candidates!', 'success');
  };

  const missingGaps = skillGaps.filter(g => g.status === 'Missing');
  const partialGaps = skillGaps.filter(g => g.status === 'Partial');
  const coveredGaps = skillGaps.filter(g => g.status === 'Covered');

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '36px 24px', display: 'flex', flexDirection: 'column', gap: '36px' }}>
      
      {/* Back Link */}
      <button
        onClick={() => navigate(`/projects/${project.id}`)}
        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'transparent', color: 'var(--text-secondary)', fontSize: '0.9rem' }}
      >
        <ArrowLeft size={16} />
        <span>Back to {project.title}</span>
      </button>

      {/* Hero Header */}
      <div className="glass-card" style={{ padding: '36px', border: '1px solid rgba(99, 102, 241, 0.4)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 12px', background: 'rgba(99, 102, 241, 0.15)', borderRadius: '9999px', color: '#a5b4fc', fontSize: '0.75rem', fontWeight: 600, marginBottom: '8px' }}>
              <Zap size={14} color="var(--accent-cyan)" />
              <span>Gemini AI Team Architecture Lab</span>
            </div>
            <h1 style={{ fontSize: '2.2rem', color: '#ffffff' }}>AI Dream Team & Skill Gap Detector</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '720px', marginTop: '4px' }}>
              Our AI engine dynamically evaluates your project's unstaffed roles, detects skill bottlenecks, and synthesizes a high-synergy multidisciplinary squad from available community talent.
            </p>
          </div>

          <button
            onClick={runAnalysis}
            disabled={loadingTeam}
            className="btn-secondary"
            style={{ padding: '10px 18px', fontSize: '0.85rem' }}
          >
            <RefreshCw size={15} style={{ animation: loadingTeam ? 'spin 1s linear infinite' : 'none' }} />
            <span>Regenerate AI Analysis</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: Skill Gap Detection */}
      <div className="glass-card" style={{ padding: '32px', border: '1px solid rgba(6, 182, 212, 0.3)' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-cyan)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>
              <Layers size={15} />
              <span>Real-Time Roster Analysis</span>
            </div>
            <h2 style={{ fontSize: '1.4rem', color: '#ffffff', marginTop: '2px' }}>
              Skill Gap Detection Matrix
            </h2>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <span style={{ padding: '4px 10px', borderRadius: 'var(--radius-full)', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', fontSize: '0.75rem', fontWeight: 600 }}>
              {coveredGaps.length} Covered
            </span>
            <span style={{ padding: '4px 10px', borderRadius: 'var(--radius-full)', background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', fontSize: '0.75rem', fontWeight: 600 }}>
              {partialGaps.length} Partial
            </span>
            <span style={{ padding: '4px 10px', borderRadius: 'var(--radius-full)', background: 'rgba(244, 63, 94, 0.15)', color: '#f87171', fontSize: '0.75rem', fontWeight: 600 }}>
              {missingGaps.length} Missing
            </span>
          </div>
        </div>

        {/* Skill Badges Flow */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '24px' }}>
          {skillGaps.map(gap => (
            <SkillGapBadge key={gap.skill} status={gap.status} skill={gap.skill} coveredBy={gap.coveredBy} />
          ))}
        </div>

        {/* Actionable Talent Recommendations to Plug Gaps */}
        {(missingGaps.length > 0 || partialGaps.length > 0) && (
          <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '20px' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff', marginBottom: '14px' }}>
              Recommended Talent to Close Detected Skill Gaps:
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
              {[...missingGaps, ...partialGaps].map(gap => (
                <div key={gap.skill} style={{ padding: '16px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '10px', border: '1px solid var(--border-glass)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#ffffff' }}>{gap.skill}</span>
                    <span style={{ fontSize: '0.7rem', color: gap.status === 'Missing' ? '#f87171' : '#fbbf24', fontWeight: 600 }}>{gap.status}</span>
                  </div>

                  {gap.suggestedCandidates && gap.suggestedCandidates.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {gap.suggestedCandidates.slice(0, 2).map(c => (
                        <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem' }}>
                          <span onClick={() => openProfileModal(c)} style={{ color: 'var(--accent-cyan)', cursor: 'pointer', fontWeight: 500 }}>
                            {c.full_name} ({c.preferred_roles[0]})
                          </span>
                          <button
                            onClick={() => openInviteModal(c)}
                            style={{ padding: '3px 8px', borderRadius: '4px', background: 'rgba(99, 102, 241, 0.2)', border: '1px solid rgba(99, 102, 241, 0.4)', color: '#ffffff', fontSize: '0.7rem', cursor: 'pointer' }}
                          >
                            + Invite
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      No community candidates found with this skill.
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* SECTION 2: AI Dream Team Assembly */}
      <div className="glass-card" style={{ padding: '36px', border: '1px solid rgba(99, 102, 241, 0.4)' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '28px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-emerald)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>
              <Sparkles size={15} />
              <span>Multi-Disciplinary Synergy Engine</span>
            </div>
            <h2 style={{ fontSize: '1.6rem', color: '#ffffff', marginTop: '2px' }}>
              Recommended AI Dream Team
            </h2>
          </div>

          {dreamTeam && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <CompatibilityRing score={dreamTeam.teamCompatibilityScore} size={64} strokeWidth={6} label="Team Synergy" />
              <button
                onClick={handleBatchInvite}
                disabled={invitedAll}
                className="btn-primary"
                style={{ padding: '10px 20px', fontSize: '0.9rem' }}
              >
                <Send size={16} />
                <span>{invitedAll ? 'Invitations Sent!' : 'Batch Invite All Teammates'}</span>
              </button>
            </div>
          )}
        </div>

        {loadingTeam ? (
          <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            <Sparkles size={32} color="var(--accent-primary)" style={{ animation: 'spin 2s linear infinite', marginBottom: '16px' }} />
            <div style={{ fontSize: '1.1rem', color: '#ffffff' }}>Gemini AI assembling optimal complementary dream squad...</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '6px' }}>Balancing technical roles, schedule overlap, and learning motivations.</div>
          </div>
        ) : dreamTeam ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            
            {/* High-Level Synergy Metrics Strip */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
              <div style={{ padding: '16px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '10px', border: '1px solid var(--border-glass)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Skill Coverage</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff' }}>{dreamTeam.skillCoverageScore}%</div>
              </div>
              <div style={{ padding: '16px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '10px', border: '1px solid var(--border-glass)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Availability Synergy</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>{dreamTeam.availabilitySynergyScore}%</div>
              </div>
              <div style={{ padding: '16px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '10px', border: '1px solid var(--border-glass)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Role Balance</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>{dreamTeam.teamBalanceScore}%</div>
              </div>
            </div>

            {/* Overall Synergy Rationale */}
            <div style={{ padding: '16px 20px', background: 'rgba(99, 102, 241, 0.08)', borderRadius: '12px', border: '1px solid rgba(99, 102, 241, 0.25)' }}>
              <div style={{ fontSize: '0.9rem', color: '#ffffff', fontWeight: 700, marginBottom: '6px' }}>
                Why This Squad Composition Works:
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {dreamTeam.overallSynergyReasoning}
              </p>
            </div>

            {/* Assembled Roster Cards */}
            <div>
              <h3 style={{ fontSize: '1.15rem', color: '#ffffff', marginBottom: '16px' }}>
                Assembled Squad Members ({dreamTeam.recommendedTeam.length})
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                {dreamTeam.recommendedTeam.map((member, idx) => (
                  <div
                    key={member.profile.id}
                    className="glass-card"
                    style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '14px' }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', fontWeight: 800, fontSize: '1.1rem' }}>
                            {member.profile.full_name.charAt(0)}
                          </div>
                          <div>
                            <h4 onClick={() => openProfileModal(member.profile)} style={{ fontSize: '1rem', color: '#ffffff', cursor: 'pointer' }}>
                              {member.profile.full_name}
                            </h4>
                            <div style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', fontWeight: 600 }}>
                              {member.assignedRole}
                            </div>
                          </div>
                        </div>

                        <span style={{ padding: '2px 8px', borderRadius: 'var(--radius-full)', background: 'rgba(16, 185, 129, 0.15)', color: '#6ee7b7', fontSize: '0.75rem', fontWeight: 700 }}>
                          {member.matchScore}% Fit
                        </span>
                      </div>

                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '10px' }}>
                        <strong>Skills Contributed:</strong> {member.contributedSkills.join(', ')}
                      </div>

                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.4, fontStyle: 'italic' }}>
                        "{member.selectionReason}"
                      </p>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid var(--border-glass)', paddingTop: '10px' }}>
                      <button
                        onClick={() => openProfileModal(member.profile)}
                        className="btn-secondary"
                        style={{ flex: 1, padding: '6px', fontSize: '0.75rem', justifyContent: 'center' }}
                      >
                        View Profile
                      </button>
                      <button
                        onClick={() => openInviteModal(member.profile)}
                        className="btn-primary"
                        style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                      >
                        <UserPlus size={13} />
                        <span>Invite</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Strengths & Caveats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              <div style={{ padding: '20px', background: 'rgba(16, 185, 129, 0.05)', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 700, color: '#34d399', marginBottom: '10px' }}>
                  <ShieldCheck size={16} />
                  <span>Key Squad Strengths</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  {dreamTeam.strengths.map((str, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                      <span style={{ color: '#34d399' }}>✓</span>
                      <span>{str}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ padding: '20px', background: 'rgba(245, 158, 11, 0.05)', borderRadius: '12px', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 700, color: '#fbbf24', marginBottom: '10px' }}>
                  <AlertTriangle size={16} />
                  <span>Operational Notes</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  {dreamTeam.potentialRisks.map((rsk, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                      <span style={{ color: '#fbbf24' }}>⚠</span>
                      <span>{rsk}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        ) : null}

      </div>

    </div>
  );
};
