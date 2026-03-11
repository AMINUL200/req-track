import React, { useState } from 'react'
import {
  Sparkles, LayoutDashboard, ShieldCheck, Zap,
  Video, Lock, ArrowRight, CheckCircle2, Star,
  TrendingUp, Bell, Globe
} from 'lucide-react'

const features = [
  {
    id: 1,
    icon: Sparkles,
    title: 'Smart Job Matching',
    description:
      'Our AI engine analyzes your skills, experience, and preferences to surface the most relevant roles — so you spend less time searching and more time applying.',
    bullets: ['AI-powered recommendations', 'Skill-based matching', 'Personalized job feed'],
    color: '#2563EB',
    lightBg: '#EFF6FF',
    borderColor: '#BFDBFE',
    gradFrom: '#2563EB',
    gradTo: '#6366F1',
    badge: 'AI Powered',
    featured: true,
  },
  {
    id: 2,
    icon: LayoutDashboard,
    title: 'Application Tracking',
    description:
      'Track every application in one unified dashboard. Know exactly where you stand — applied, shortlisted, interviewing, or offer received — at a glance.',
    bullets: ['Real-time status updates', 'Pipeline kanban view', 'Follow-up reminders'],
    color: '#14B8A6',
    lightBg: '#F0FDFA',
    borderColor: '#99F6E4',
    gradFrom: '#14B8A6',
    gradTo: '#06B6D4',
    badge: 'Dashboard',
    featured: false,
  },
  {
    id: 3,
    icon: ShieldCheck,
    title: 'Verified Employers',
    description:
      'Every organization on our platform is verified and vetted. No ghost jobs, no scams — only genuine opportunities from companies that are actively hiring.',
    bullets: ['Background-checked orgs', 'Authentic job listings', 'Trusted network'],
    color: '#22C55E',
    lightBg: '#F0FDF4',
    borderColor: '#BBF7D0',
    gradFrom: '#22C55E',
    gradTo: '#16A34A',
    badge: 'Verified',
    featured: false,
  },
  {
    id: 4,
    icon: Zap,
    title: 'Fast Hiring Process',
    description:
      'Cut through the noise with streamlined workflows. Recruiters get notified instantly, candidates hear back faster — the entire cycle runs in record time.',
    bullets: ['Instant recruiter alerts', 'Quick-apply in 1 click', 'Avg. 5-day hiring cycle'],
    color: '#F59E0B',
    lightBg: '#FFFBEB',
    borderColor: '#FDE68A',
    gradFrom: '#F59E0B',
    gradTo: '#EF4444',
    badge: 'Lightning Fast',
    featured: false,
  },
  {
    id: 5,
    icon: Video,
    title: 'Multiple Interview Modes',
    description:
      'Whether in-person, video call, or phone screen — schedule and manage every interview format from one place. Automated reminders keep everyone on time.',
    bullets: ['Online & offline modes', 'Calendar integration', 'Auto interview reminders'],
    color: '#8B5CF6',
    lightBg: '#F5F3FF',
    borderColor: '#DDD6FE',
    gradFrom: '#8B5CF6',
    gradTo: '#6366F1',
    badge: 'Flexible',
    featured: false,
  },
  {
    id: 6,
    icon: Lock,
    title: 'Secure Candidate Profiles',
    description:
      'Your data is encrypted and never shared without consent. Control exactly who sees your resume, contact info, and portfolio — always on your terms.',
    bullets: ['End-to-end encryption', 'Privacy controls', 'GDPR compliant'],
    color: '#0F172A',
    lightBg: '#F1F5F9',
    borderColor: '#CBD5E1',
    gradFrom: '#334155',
    gradTo: '#0F172A',
    badge: 'Private & Safe',
    featured: false,
  },
]

const stats = [
  { icon: TrendingUp, value: '98%',    label: 'Match Accuracy',    color: '#2563EB' },
  { icon: Bell,       value: '< 24h',  label: 'Avg. Response Time', color: '#14B8A6' },
  { icon: Globe,      value: '850+',   label: 'Verified Companies', color: '#8B5CF6' },
  { icon: Star,       value: '4.9★',   label: 'Candidate Rating',   color: '#F59E0B' },
]

/* ─── FeatureCard ─────────────────────────────────────────────────────── */
const FeatureCard = ({ feature, index }) => {
  const [hovered, setHovered] = useState(false)
  const Icon = feature.icon

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative flex flex-col gap-5 rounded-2xl border p-6 cursor-default transition-all duration-300 overflow-hidden bg-white hover:bg-opacity-100"
      style={{
        background: hovered ? feature.lightBg : '#FFFFFF',
        borderColor: hovered ? feature.borderColor : '#E2E8F0',
        boxShadow: hovered
          ? `0 12px 40px ${feature.color}18, 0 2px 8px rgba(0,0,0,0.04)`
          : '0 2px 12px rgba(0,0,0,0.04)',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        animationDelay: `${index * 80}ms`,
      }}
    >
      {/* Glow blob on hover */}
      <div
        className="absolute -top-10 -right-10 w-40 h-40 rounded-full transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${feature.color}18, transparent)`,
          opacity: hovered ? 1 : 0,
        }}
      />

      {/* Top row — icon + badge */}
      <div className="flex items-start justify-between gap-4 relative z-10">
        {/* Icon */}
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-300"
          style={{
            background: hovered
              ? `linear-gradient(135deg, ${feature.gradFrom}, ${feature.gradTo})`
              : feature.lightBg,
            boxShadow: hovered ? `0 6px 20px ${feature.color}40` : 'none',
          }}
        >
          <Icon
            size={24}
            strokeWidth={2}
            style={{ color: hovered ? '#FFFFFF' : feature.color }}
          />
        </div>

        {/* Badge */}
        <span
          className="text-xs font-bold px-3 py-1 rounded-full flex-shrink-0 mt-1 transition-all duration-300"
          style={{
            background: hovered ? feature.color : feature.lightBg,
            color: hovered ? '#FFFFFF' : feature.color,
            letterSpacing: '0.03em',
          }}
        >
          {feature.badge}
        </span>
      </div>

      {/* Text */}
      <div className="relative z-10">
        <h3
          className="text-lg font-bold mb-2 transition-colors duration-200"
          style={{
            color: hovered ? feature.color : '#0F172A',
            fontFamily: "'Outfit', sans-serif",
          }}
        >
          {feature.title}
        </h3>
        <p className="text-slate-500 text-sm leading-relaxed">
          {feature.description}
        </p>
      </div>

      {/* Bullets */}
      <div className="flex flex-col gap-2 relative z-10">
        {feature.bullets.map(b => (
          <div key={b} className="flex items-center gap-2">
            <CheckCircle2
              size={14}
              style={{ color: feature.color, flexShrink: 0 }}
            />
            <span className="text-xs font-semibold text-slate-600">{b}</span>
          </div>
        ))}
      </div>

      {/* Learn more link */}
      <div
        className="mt-auto flex items-center gap-1.5 text-xs font-bold transition-all duration-200 relative z-10"
        style={{
          color: feature.color,
          opacity: hovered ? 1 : 0.5,
        }}
      >
        Learn more
        <ArrowRight
          size={13}
          className="transition-transform duration-200"
          style={{ transform: hovered ? 'translateX(3px)' : 'translateX(0)' }}
        />
      </div>

      {/* Bottom accent bar */}
      <div
        className="absolute bottom-0 left-0 right-0 h-0.5 transition-all duration-300"
        style={{
          background: `linear-gradient(90deg, ${feature.gradFrom}, ${feature.gradTo})`,
          opacity: hovered ? 1 : 0,
          transform: hovered ? 'scaleX(1)' : 'scaleX(0)',
          transformOrigin: 'left',
        }}
      />
    </div>
  )
}

/* ─── PlatformFeaturesSection ─────────────────────────────────────────── */
const PlatformFeaturesSection = () => {
  return (
    <section className="relative py-24 overflow-hidden" style={{ background: '#F1F5F9' }}>

      {/* ── decorative background ── */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg,transparent,#BFDBFE,transparent)' }} />
        <div className="absolute bottom-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg,transparent,#99F6E4,transparent)' }} />
        <div className="absolute top-20 right-0 w-[500px] h-[500px] rounded-full opacity-20 pointer-events-none"
          style={{ background: 'radial-gradient(circle,#DBEAFE,transparent)', transform: 'translate(30%,-20%)' }} />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-20 pointer-events-none"
          style={{ background: 'radial-gradient(circle,#CCFBF1,transparent)', transform: 'translate(-30%,20%)' }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10">

        {/* ── Header ── */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold px-4 py-1.5 rounded-full mb-4">
            <Sparkles size={12} className="text-blue-500" />
            Why Choose ReqTrack
          </div>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight"
            style={{ letterSpacing: '-0.03em', fontFamily: "'Outfit', sans-serif" }}
          >
            Everything You Need to{' '}
            <span style={{
              background: 'linear-gradient(135deg,#2563EB 0%,#14B8A6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Land Your Role
            </span>
          </h2>
          <p className="text-slate-500 text-base mt-3 max-w-xl mx-auto leading-relaxed">
            Built for modern job seekers and recruiters alike. Powerful features that make hiring faster, smarter, and more human.
          </p>
        </div>

        {/* ── Stats strip ── */}
        <div
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-14 rounded-2xl p-6"
          style={{
            background: 'linear-gradient(135deg,#1E40AF 0%,#2563EB 50%,#0D9488 100%)',
            boxShadow: '0 8px 40px rgba(37,99,235,0.25)',
          }}
        >
          {stats.map(s => {
            const Icon = s.icon
            return (
              <div key={s.label} className="flex flex-col items-center gap-1 text-center relative">
                <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center mb-1">
                  <Icon size={18} className="text-white" />
                </div>
                <span className="text-white text-2xl font-black" style={{ fontFamily: "'Outfit',sans-serif" }}>
                  {s.value}
                </span>
                <span className="text-blue-100 text-xs font-medium">{s.label}</span>
              </div>
            )
          })}
        </div>

        {/* ── Feature grid - 2 ROWS layout ── */}
        {/* First row - 3 cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
          {features.slice(0, 3).map((feature, i) => (
            <FeatureCard key={feature.id} feature={feature} index={i} />
          ))}
        </div>

        {/* Second row - 3 cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {features.slice(3, 6).map((feature, i) => (
            <FeatureCard key={feature.id} feature={feature} index={i + 3} />
          ))}
        </div>

        {/* ── Bottom CTA ── */}
        <div className="mt-16 text-center">
          <p className="text-slate-500 text-sm mb-5">
            Join <span className="font-bold text-slate-800">12,000+</span> candidates who found their job through ReqTrack
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              className="flex items-center gap-2 px-8 py-3.5 text-white font-bold text-sm rounded-xl transition-all duration-200 hover:-translate-y-0.5"
              style={{
                background: 'linear-gradient(135deg,#2563EB,#1D4ED8)',
                boxShadow: '0 4px 18px rgba(37,99,235,0.35)',
                fontFamily: "'Outfit',sans-serif",
              }}
            >
              Get Started Free <ArrowRight size={16} />
            </button>
            <button
              className="flex items-center gap-2 px-8 py-3.5 font-bold text-sm rounded-xl border-2 transition-all duration-200 hover:bg-blue-50"
              style={{
                color: '#2563EB',
                borderColor: '#BFDBFE',
                background: '#FFFFFF',
                fontFamily: "'Outfit',sans-serif",
              }}
            >
              See All Features <ArrowRight size={16} />
            </button>
          </div>
        </div>

      </div>
    </section>
  )
}

export default PlatformFeaturesSection