import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Sparkles, 
  Layers, 
  Zap, 
  CheckCircle2, 
  AlertTriangle, 
  UserPlus, 
  RefreshCw, 
  Send, 
  ShieldCheck,
  Dna,
  HelpCircle,
  TrendingUp,
  UserX
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';
import { Project, SkillGapItem, DreamTeamResult, UserProfile } from '../types';
import { detectSkillGaps, generateRecommendedTeam } from '../lib/matching';
import { SkillGapBadge } from '../components/SkillGapBadge';
import { CompatibilityRing } from '../components/CompatibilityRing';
import { TeamDNAChart } from '../components/TeamDNAChart';
import { AITeamBriefModal } from '../components/AITeamBriefModal';

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
  const [activeTab, setActiveTab] = useState<'squad' | 'dna' | 'whynot'>('squad');
  const [isBriefModalOpen, setIsBriefModalOpen] = useState(false);

  const runAnalysis = () => {
    if (!project) return;
    setLoadingTeam(true);

    const gaps = detectSkillGaps(project, profiles);
    setSkillGaps(gaps);

    setTimeout(() => {
      generateRecommendedTeam(project, profiles).then(res => {
        setDreamTeam(res);
        setLoadingTeam(false);
      });
    }, 400);
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
        `Team invitation for ${project.title} as ${m.assignedRole}!`
      );
    });

    setInvitedAll(true);
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 }
    });
    addToast('Batch invitations sent to all recommended team candidates!', 'success');
  };

  const missingGaps = skillGaps.filter(g => g.status === 'Missing');
  const partialGaps = skillGaps.filter(g => g.status === 'Partial');
  const coveredGaps = skillGaps.filter(g => g.status === 'Covered');

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '36px 24px', display: 'flex', flexDirection: 'column', gap: '36px' }}>
      
      {/* Back Link */}
      <button
        onClick={() => navigate(`/projects/${project.id}`)}
        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'transparent', color: 'var(--text-secondary)', fontSize: '0.9rem', width: 'fit-content' }}
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
              <span>Team Builder Lab</span>
            </div>
            <h1 style={{ fontSize: '2.2rem', color: '#ffffff' }}>Team Builder & Skill Gap Analysis</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '720px', marginTop: '4px' }}>
              Our matching engine dynamically evaluates project requirements, calculates a visual skill coverage matrix, and recommends a high-compatibility squad.
            </p>
          </div>

          <button
            onClick={runAnalysis}
            disabled={loadingTeam}
            className="btn-secondary"
            style={{ padding: '10px 18px', fontSize: '0.85rem' }}
          >
            <RefreshCw size={15} style={{ animation: loadingTeam ? 'spin 1s linear infinite' : 'none' }} />
            <span>Regenerate Analysis</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: Visual Skill Gap Matrix */}
      <div className="glass-card" style={{ padding: '32px', border: '1px solid rgba(6, 182, 212, 0.3)' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-cyan)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>
              <Layers size={15} />
              <span>Visual Skill Coverage Matrix</span>
            </div>
            <h2 style={{ fontSize: '1.4rem', color: '#ffffff', marginTop: '2px' }}>
              Skill Gap Breakdown ({coveredGaps.length} Covered · {partialGaps.length} Partial · {missingGaps.length} Missing)
            </h2>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <span style={{ padding: '4px 10px', borderRadius: 'var(--radius-full)', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', fontSize: '0.75rem', fontWeight: 600 }}>
              {coveredGaps.length} Fully Covered
            </span>
            <span style={{ padding: '4px 10px', borderRadius: 'var(--radius-full)', background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', fontSize: '0.75rem', fontWeight: 600 }}>
              {partialGaps.length} Partial
            </span>
            <span style={{ padding: '4px 10px', borderRadius: 'var(--radius-full)', background: 'rgba(244, 63, 94, 0.15)', color: '#f87171', fontSize: '0.75rem', fontWeight: 600 }}>
              {missingGaps.length} Unstaffed
            </span>
          </div>
        </div>

        {/* Visual Skill Coverage Matrix Bars */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px', marginBottom: '24px' }}>
          {skillGaps.map(gap => {
            let barColor = 'var(--accent-emerald)';
            let statusText = '100% Covered';
            if (gap.status === 'Partial') {
              barColor = 'var(--accent-amber)';
              statusText = `${gap.coveragePercentage}% Partial`;
            } else if (gap.status === 'Missing') {
              barColor = 'var(--accent-rose)';
              statusText = '0% Unstaffed';
            }

            return (
              <div key={gap.skill} style={{ padding: '12px 14px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '10px', border: '1px solid var(--border-glass)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.85rem', color: '#ffffff' }}>{gap.skill}</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: barColor }}>{statusText}</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${gap.coveragePercentage}%`, height: '100%', background: barColor, borderRadius: '3px' }}></div>
                </div>
                {gap.coveredBy && gap.coveredBy.length > 0 && (
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Covered by: {gap.coveredBy.join(', ')}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Actionable Talent Recommendations to Plug Gaps */}
        {(missingGaps.length > 0 || partialGaps.length > 0) && (
          <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '20px' }}>
            <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff', marginBottom: '14px' }}>
              Specific Talent Recommendations to Close Missing & Partial Skills:
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
              {[...missingGaps, ...partialGaps].map(gap => (
                <div key={gap.skill} style={{ padding: '16px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '10px', border: '1px solid var(--border-glass)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#ffffff' }}>{gap.skill}</span>
                    <span style={{ fontSize: '0.7rem', color: gap.status === 'Missing' ? '#f87171' : '#fbbf24', fontWeight: 600 }}>{gap.status}</span>
                  </div>

                  {gap.suggestedCandidates && gap.suggestedCandidates.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {gap.suggestedCandidates.map(c => (
                        <div key={c.profile.id} style={{ padding: '10px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', border: '1px solid var(--border-glass)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                            <button onClick={() => openProfileModal(c.profile)} style={{ color: 'var(--accent-cyan)', background: 'transparent', fontWeight: 600, fontSize: '0.85rem', textAlign: 'left' }}>
                              {c.profile.full_name} ({c.profile.preferred_roles[0]})
                            </button>
                            <button
                              onClick={() => openInviteModal(c.profile)}
                              className="btn-primary"
                              style={{ padding: '3px 10px', fontSize: '0.7rem' }}
                            >
                              + Invite
                            </button>
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                            {c.reason}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      No community candidates found with this specific skill.
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* SECTION 2: Recommended Team + Team DNA + "Why Not Others?" */}
      <div className="glass-card" style={{ padding: '36px', border: '1px solid rgba(99, 102, 241, 0.4)' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--accent-emerald)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>
              <Sparkles size={15} />
              <span>Multi-Disciplinary Matching Engine</span>
            </div>
            <h2 style={{ fontSize: '1.6rem', color: '#ffffff', marginTop: '2px' }}>
              Recommended Team
            </h2>
          </div>

          {dreamTeam && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <CompatibilityRing score={dreamTeam.teamCompatibilityScore} size={64} strokeWidth={6} label="Team Compatibility" />
              <button
                onClick={() => setIsBriefModalOpen(true)}
                className="btn-secondary"
                style={{ padding: '10px 16px', fontSize: '0.85rem' }}
              >
                <span>📄 View Team Brief</span>
              </button>
              <button
                onClick={handleBatchInvite}
                disabled={invitedAll}
                className="btn-primary"
                style={{ padding: '10px 20px', fontSize: '0.9rem' }}
              >
                <Send size={16} />
                <span>{invitedAll ? 'Invitations Sent!' : 'Batch Invite All'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Interactive View Switcher Tabs */}
        {dreamTeam && (
          <div role="tablist" aria-label="Team View Options" style={{ display: 'flex', gap: '8px', background: 'rgba(0, 0, 0, 0.3)', padding: '4px', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-glass)', width: 'fit-content', marginBottom: '24px' }}>
            <button
              role="tab"
              aria-selected={activeTab === 'squad'}
              onClick={() => setActiveTab('squad')}
              style={{
                padding: '6px 16px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.8rem',
                fontWeight: 600,
                background: activeTab === 'squad' ? 'var(--gradient-primary)' : 'transparent',
                color: activeTab === 'squad' ? '#ffffff' : 'var(--text-secondary)',
              }}
            >
              Recommended Squad
            </button>
            <button
              role="tab"
              aria-selected={activeTab === 'dna'}
              onClick={() => setActiveTab('dna')}
              style={{
                padding: '6px 16px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.8rem',
                fontWeight: 600,
                background: activeTab === 'dna' ? 'var(--gradient-primary)' : 'transparent',
                color: activeTab === 'dna' ? '#ffffff' : 'var(--text-secondary)',
              }}
            >
              Team DNA Profile
            </button>
            <button
              role="tab"
              aria-selected={activeTab === 'whynot'}
              onClick={() => setActiveTab('whynot')}
              style={{
                padding: '6px 16px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.8rem',
                fontWeight: 600,
                background: activeTab === 'whynot' ? 'var(--gradient-primary)' : 'transparent',
                color: activeTab === 'whynot' ? '#ffffff' : 'var(--text-secondary)',
              }}
            >
              Why Not The Others?
            </button>
          </div>
        )}

        {loadingTeam ? (
          <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            <Sparkles size={32} color="var(--accent-primary)" style={{ animation: 'spin 2s linear infinite', marginBottom: '16px' }} />
            <div style={{ fontSize: '1.1rem', color: '#ffffff' }}>Analyzing compatibility and building your recommended team...</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '6px' }}>Balancing technical roles, schedule overlap, and learning motivations.</div>
          </div>
        ) : dreamTeam ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            
            {/* TAB 1: Squad Members & Rationale */}
            {activeTab === 'squad' && (
              <>
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
                    {dreamTeam.recommendedTeam.map(member => (
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
                                <button onClick={() => openProfileModal(member.profile)} style={{ fontSize: '1rem', color: '#ffffff', background: 'transparent', fontWeight: 700, textAlign: 'left' }}>
                                  {member.profile.full_name}
                                </button>
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
                      <span>Operational Caveats</span>
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
              </>
            )}

            {/* TAB 2: Team DNA Visualizer */}
            {activeTab === 'dna' && (
              <TeamDNAChart dna={dreamTeam.dna} />
            )}

            {/* TAB 3: Why Not The Others? */}
            {activeTab === 'whynot' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  Transparency is a core design principle of ProjectMatch. Here is why alternative community candidates were not selected for this specific squad combination:
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
                  {dreamTeam.rejectedCandidates?.map((rej, idx) => (
                    <div key={idx} style={{ padding: '20px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                        <UserX size={18} color="var(--accent-rose)" />
                        <h4 style={{ color: '#ffffff', fontSize: '0.95rem' }}>{rej.profile.full_name}</h4>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>({rej.profile.preferred_roles[0]})</span>
                      </div>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                        {rej.reason}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        ) : null}

      </div>

      {/* Team Executive Brief Modal */}
      {dreamTeam && (
        <AITeamBriefModal
          isOpen={isBriefModalOpen}
          onClose={() => setIsBriefModalOpen(false)}
          project={project}
          dreamTeam={dreamTeam}
          onOpenWorkspace={() => navigate(`/workspace/${project.id}`)}
        />
      )}

    </div>
  );
};
