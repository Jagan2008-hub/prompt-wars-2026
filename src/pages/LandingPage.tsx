import React, { useState } from 'react';
import { 
  Sparkles, 
  Users, 
  Layers, 
  Zap, 
  ArrowRight, 
  CheckCircle2, 
  Cpu, 
  Dna, 
  ShieldCheck, 
  UserCheck, 
  FolderGit2, 
  Award,
  Play
} from 'lucide-react';
import { CompatibilityRing } from '../components/CompatibilityRing';
import { SkillGapBadge } from '../components/SkillGapBadge';
import { TeamDNAChart } from '../components/TeamDNAChart';

interface LandingPageProps {
  navigate: (route: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ navigate }) => {
  const [activeTab, setActiveTab] = useState<'match' | 'gap' | 'team' | 'dna'>('match');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '80px', paddingBottom: '80px' }}>
      
      {/* Hero Section */}
      <section style={{
        position: 'relative',
        padding: '80px 24px 40px',
        textAlign: 'center',
        background: 'radial-gradient(ellipse at 50% 10%, rgba(99, 102, 241, 0.2), transparent 70%)',
        overflow: 'hidden',
      }}>
        {/* Glow ambient decorations */}
        <div style={{ position: 'absolute', top: '10%', left: '15%', width: '300px', height: '300px', background: 'rgba(6, 182, 212, 0.12)', filter: 'blur(80px)', borderRadius: '50%', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '20%', right: '15%', width: '350px', height: '350px', background: 'rgba(139, 92, 246, 0.15)', filter: 'blur(90px)', borderRadius: '50%', pointerEvents: 'none' }} />

        <div style={{ maxWidth: '920px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
          
          {/* Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 18px',
            background: 'rgba(99, 102, 241, 0.12)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            borderRadius: '9999px',
            color: '#a5b4fc',
            fontSize: '0.85rem',
            fontWeight: 600,
            marginBottom: '28px',
          }}>
            <Sparkles size={15} />
            <span>Prompt Wars Hackathon 2026 · AI Team Formation Platform</span>
          </div>

          {/* Heading */}
          <h1 style={{
            fontSize: 'clamp(2.6rem, 5.8vw, 4.4rem)',
            fontWeight: 800,
            lineHeight: 1.12,
            letterSpacing: '-0.03em',
            marginBottom: '24px',
            color: '#ffffff',
          }}>
            Find the people who <br />
            <span className="gradient-text">complete your project.</span>
          </h1>

          {/* Subheading */}
          <p style={{
            fontSize: 'clamp(1.05rem, 2vw, 1.25rem)',
            color: 'var(--text-secondary)',
            maxWidth: '720px',
            margin: '0 auto 36px',
            lineHeight: 1.6,
          }}>
            ProjectMatch uses Google Gemini AI to match builders by skills, roles, availability, and learning goals — then detects skill bottlenecks to assemble balanced, high-velocity dream teams.
          </p>

          {/* Value Equation Banner */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            padding: '10px 20px',
            background: 'rgba(15, 23, 42, 0.7)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.85rem',
            color: '#ffffff',
            fontWeight: 600,
            marginBottom: '36px',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}>
            <span style={{ color: 'var(--accent-cyan)' }}>You</span>
            <span style={{ color: 'var(--text-muted)' }}>+</span>
            <span style={{ color: 'var(--accent-primary)' }}>Gemini AI Engine</span>
            <span style={{ color: 'var(--text-muted)' }}>+</span>
            <span style={{ color: 'var(--accent-emerald)' }}>Complementary Builders</span>
            <span style={{ color: 'var(--text-muted)' }}>=</span>
            <span style={{ color: '#ec4899', fontWeight: 800 }}>Unstoppable Winning Team 🏆</span>
          </div>

          {/* CTA Group */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap', marginBottom: '48px' }}>
            <button
              onClick={() => navigate('/community')}
              className="btn-primary"
              style={{ padding: '14px 34px', fontSize: '1.05rem' }}
            >
              <span>Try the AI Demo</span>
              <ArrowRight size={18} />
            </button>

            <button
              onClick={() => navigate('/projects')}
              className="btn-secondary"
              style={{ padding: '14px 34px', fontSize: '1.05rem' }}
            >
              <span>Explore Projects</span>
            </button>
          </div>

          {/* Key Metrics Strip */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '16px',
            maxWidth: '780px',
            margin: '0 auto',
            padding: '20px',
            background: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(12px)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-glass)',
          }}>
            <div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff' }}>94%</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Peak Synergy Score</div>
            </div>
            <div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>100%</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Skill Gap Coverage</div>
            </div>
            <div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>5 Dimensions</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Team DNA Profiling</div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive AI Preview Demo Box with 4 Tabs */}
      <section style={{ maxWidth: '1120px', margin: '0 auto', padding: '0 24px', width: '100%' }}>
        <div className="glass-card" style={{ padding: '36px', border: '1px solid rgba(99, 102, 241, 0.35)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '28px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-cyan)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase' }}>
                <Zap size={16} />
                <span>Live AI Synergy Simulation</span>
              </div>
              <h3 style={{ fontSize: '1.5rem', color: '#ffffff', marginTop: '4px' }}>
                PulseSense AI — Team Match Preview
              </h3>
            </div>

            {/* Interactive Mode Tabs */}
            <div style={{ display: 'flex', gap: '6px', background: 'rgba(0, 0, 0, 0.3)', padding: '4px', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-glass)', flexWrap: 'wrap' }}>
              <button
                onClick={() => setActiveTab('match')}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  background: activeTab === 'match' ? 'var(--gradient-primary)' : 'transparent',
                  color: activeTab === 'match' ? '#ffffff' : 'var(--text-secondary)',
                }}
              >
                Candidate Match
              </button>
              <button
                onClick={() => setActiveTab('gap')}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  background: activeTab === 'gap' ? 'var(--gradient-primary)' : 'transparent',
                  color: activeTab === 'gap' ? '#ffffff' : 'var(--text-secondary)',
                }}
              >
                Skill Gap Matrix
              </button>
              <button
                onClick={() => setActiveTab('team')}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  background: activeTab === 'team' ? 'var(--gradient-primary)' : 'transparent',
                  color: activeTab === 'team' ? '#ffffff' : 'var(--text-secondary)',
                }}
              >
                AI Dream Team
              </button>
              <button
                onClick={() => setActiveTab('dna')}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  background: activeTab === 'dna' ? 'var(--gradient-primary)' : 'transparent',
                  color: activeTab === 'dna' ? '#ffffff' : 'var(--text-secondary)',
                }}
              >
                Team DNA
              </button>
            </div>
          </div>

          {/* Tab 1: Candidate Match View */}
          {activeTab === 'match' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', alignItems: 'center' }}>
              <div style={{ padding: '20px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.2rem', color: '#ffffff' }}>
                    A
                  </div>
                  <div>
                    <h4 style={{ color: '#ffffff', fontSize: '1.1rem' }}>Arjun Mehta</h4>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Frontend Lead · IIT 3rd Year</div>
                  </div>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                  <span style={{ padding: '2px 8px', borderRadius: '4px', background: 'rgba(99, 102, 241, 0.15)', color: '#c7d2fe', fontSize: '0.75rem' }}>React (Expert)</span>
                  <span style={{ padding: '2px 8px', borderRadius: '4px', background: 'rgba(99, 102, 241, 0.15)', color: '#c7d2fe', fontSize: '0.75rem' }}>TypeScript</span>
                  <span style={{ padding: '2px 8px', borderRadius: '4px', background: 'rgba(99, 102, 241, 0.15)', color: '#c7d2fe', fontSize: '0.75rem' }}>Next.js</span>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 size={15} />
                  <span>Available 18 hrs/week (Evenings)</span>
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '18px' }}>
                  <CompatibilityRing score={94} size={76} label="Overall Match" />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#ffffff' }}>High Complementary Synergy</div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      Arjun completely fulfills the missing Frontend role and pairs with Rahul's AI models for real-time ECG telemetry.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                    <span>Skill Alignment (35%)</span>
                    <span style={{ color: '#ffffff', fontWeight: 600 }}>96%</span>
                  </div>
                  <div style={{ width: '100%', height: '5px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: '96%', height: '100%', background: 'var(--gradient-primary)' }}></div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                    <span>Availability Overlap (15%)</span>
                    <span style={{ color: '#ffffff', fontWeight: 600 }}>92%</span>
                  </div>
                  <div style={{ width: '100%', height: '5px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: '92%', height: '100%', background: 'var(--accent-emerald)' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Skill Gap Matrix View */}
          {activeTab === 'gap' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  PulseSense AI required skills vs current team roster:
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--accent-rose)', fontWeight: 600 }}>
                  1 Critical Skill Gap Detected
                </span>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                <SkillGapBadge status="Covered" skill="AI/ML" coveredBy={['Rahul Varma']} />
                <SkillGapBadge status="Covered" skill="Python" coveredBy={['Rahul Varma']} />
                <SkillGapBadge status="Covered" skill="Clinical Analysis" coveredBy={['Meera Iyer']} />
                <SkillGapBadge status="Covered" skill="Research" coveredBy={['Meera Iyer']} />
                <SkillGapBadge status="Partial" skill="React" coveredBy={['Arjun Mehta']} />
                <SkillGapBadge status="Missing" skill="UI/UX (Figma)" />
              </div>

              <div style={{ padding: '14px', background: 'rgba(244, 63, 94, 0.08)', borderRadius: '10px', border: '1px solid rgba(244, 63, 94, 0.25)', marginTop: '8px' }}>
                <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#fda4af', marginBottom: '4px' }}>
                  AI Recommendation to Close Gap:
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Invite <strong>Priya Sharma (NID Design Expert)</strong> to design the clinical interface in Figma, raising team compatibility to 96%.
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: AI Dream Team View */}
          {activeTab === 'team' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff' }}>
                    Recommended 4-Person Dream Team
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    Assembled for 100% role coverage and zero single-points-of-failure.
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 14px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: 'var(--radius-full)', color: '#6ee7b7', fontWeight: 700, fontSize: '0.9rem' }}>
                  <span>95% Team Synergy</span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                <div style={{ padding: '12px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '10px', border: '1px solid var(--border-glass)' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#ffffff' }}>Rahul Varma</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: 600 }}>AI/ML Engineer</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>PyTorch, Gemini, FastAPI</div>
                </div>

                <div style={{ padding: '12px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '10px', border: '1px solid var(--border-glass)' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#ffffff' }}>Arjun Mehta</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', fontWeight: 600 }}>Frontend Engineer</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>React, WebSockets, Next.js</div>
                </div>

                <div style={{ padding: '12px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '10px', border: '1px solid var(--border-glass)' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#ffffff' }}>Priya Sharma</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--accent-secondary)', fontWeight: 600 }}>UI/UX Designer</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>Figma, Design Systems</div>
                </div>

                <div style={{ padding: '12px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '10px', border: '1px solid var(--border-glass)' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#ffffff' }}>Meera Iyer</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)', fontWeight: 600 }}>Domain Expert</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>Clinical Telemetry & Research</div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Team DNA View */}
          {activeTab === 'dna' && (
            <TeamDNAChart dna={{
              technical: 95,
              creative: 90,
              execution: 94,
              leadership: 88,
              learning: 97,
              dnaSummary: 'Elite Product & Deep-Tech Squad: High machine learning precision paired with rapid interactive Figma UI prototyping.'
            }} />
          )}
        </div>
      </section>

      {/* How It Works Section */}
      <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--accent-cyan)', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>
            <Sparkles size={14} />
            <span>5-Step Workflow</span>
          </div>
          <h2 style={{ fontSize: '2.2rem', color: '#ffffff', marginBottom: '8px' }}>
            How ProjectMatch Assembles Unstoppable Teams
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '600px', margin: '0 auto' }}>
            From initial student registration to full sprint execution in one seamless flow.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          <div className="glass-card" style={{ padding: '24px' }}>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-primary)', marginBottom: '12px' }}>01</div>
            <h4 style={{ fontSize: '1.1rem', color: '#ffffff', marginBottom: '6px' }}>Build Profile</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Specify your tech stack, schedule availability, and skills you want to learn.
            </p>
          </div>

          <div className="glass-card" style={{ padding: '24px' }}>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-cyan)', marginBottom: '12px' }}>02</div>
            <h4 style={{ fontSize: '1.1rem', color: '#ffffff', marginBottom: '6px' }}>Define Project</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Publish hackathon ideas, desired team size, required roles, and weekly pace.
            </p>
          </div>

          <div className="glass-card" style={{ padding: '24px' }}>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-emerald)', marginBottom: '12px' }}>03</div>
            <h4 style={{ fontSize: '1.1rem', color: '#ffffff', marginBottom: '6px' }}>Detect Gaps</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              AI analyzes team roster to highlight covered, partial, and unstaffed skills.
            </p>
          </div>

          <div className="glass-card" style={{ padding: '24px' }}>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-amber)', marginBottom: '12px' }}>04</div>
            <h4 style={{ fontSize: '1.1rem', color: '#ffffff', marginBottom: '6px' }}>Assemble Squad</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Gemini AI generates an optimal 3–5 person squad with collective Team DNA.
            </p>
          </div>

          <div className="glass-card" style={{ padding: '24px' }}>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ec4899', marginBottom: '12px' }}>05</div>
            <h4 style={{ fontSize: '1.1rem', color: '#ffffff', marginBottom: '6px' }}>Sprint & Deliver</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Collaborate on Kanban tasks, track sprint progress, and win hackathons.
            </p>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{ fontSize: '2.2rem', color: '#ffffff', marginBottom: '12px' }}>
            Built for Serious Hackathon Builders
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '600px', margin: '0 auto' }}>
            Everything you need to discover talent, plug skill gaps, and collaborate effectively.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          
          <div className="glass-card" style={{ padding: '28px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.15)', border: '1px solid rgba(99, 102, 241, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <Zap size={22} color="var(--accent-primary)" />
            </div>
            <h3 style={{ fontSize: '1.25rem', color: '#ffffff', marginBottom: '8px' }}>Multi-Variable AI Matching</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
              Gemini AI analyzes technical proficiencies, role preferences, weekly available hours, and learning goals to produce verifiable match reasons.
            </p>
          </div>

          <div className="glass-card" style={{ padding: '28px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(6, 182, 212, 0.15)', border: '1px solid rgba(6, 182, 212, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <Layers size={22} color="var(--accent-cyan)" />
            </div>
            <h3 style={{ fontSize: '1.25rem', color: '#ffffff', marginBottom: '8px' }}>Real-time Skill Gap Detection</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
              Instantly see which core competencies your project is missing and get automated candidate suggestions who specialize in those missing skills.
            </p>
          </div>

          <div className="glass-card" style={{ padding: '28px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <Users size={22} color="var(--accent-emerald)" />
            </div>
            <h3 style={{ fontSize: '1.25rem', color: '#ffffff', marginBottom: '8px' }}>AI Dream Team Assembly</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
              Generate complete 3–5 person multidisciplinary squads with balanced role distributions, schedule synergy, and zero single-points-of-failure.
            </p>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section style={{ maxWidth: '1080px', margin: '0 auto', padding: '0 24px', width: '100%' }}>
        <div style={{
          padding: '60px 40px',
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(139, 92, 246, 0.1) 100%)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid rgba(99, 102, 241, 0.4)',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <h2 style={{ fontSize: '2.4rem', color: '#ffffff', marginBottom: '16px' }}>
            Ready to form your winning team?
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 32px' }}>
            Create your builder profile in 60 seconds and let Gemini AI match you with high-synergy projects.
          </p>
          <button
            onClick={() => navigate('/community')}
            className="btn-primary"
            style={{ padding: '16px 36px', fontSize: '1.1rem' }}
          >
            <span>Launch Interactive AI Demo</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </section>

    </div>
  );
};
