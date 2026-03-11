import React, { useState, useEffect, useRef } from 'react'
import {
  Briefcase, Target, Eye, Heart, Zap, Users, Shield, Globe,
  ArrowRight, Star, CheckCircle2, TrendingUp, Building2,
  Sparkles, Award, Layers, Calendar, MapPin, Linkedin,
  Twitter, Github, Mail, ChevronRight, Play, Quote,
  BarChart3, Clock, MessageCircle, Rocket, Brain,
  HandshakeIcon, Lightbulb, BadgeCheck
} from 'lucide-react'

/* ════════════════════════════════════════
   CONSTANTS
════════════════════════════════════════ */
const F = { fontFamily: "'Outfit', sans-serif" }

/* ════════════════════════════════════════
   ANIMATED COUNTER HOOK
════════════════════════════════════════ */
const useCountUp = (target, duration = 2000, started = false) => {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!started) return
    let raf, startTime = null
    const numeric = parseFloat(String(target).replace(/[^0-9.]/g, ''))
    const tick = (ts) => {
      if (!startTime) startTime = ts
      const p = Math.min((ts - startTime) / duration, 1)
      const e = 1 - Math.pow(1 - p, 3)
      setCount(Number.isInteger(numeric) ? Math.floor(e * numeric) : parseFloat((e * numeric).toFixed(1)))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [started, target, duration])
  return count
}

/* ════════════════════════════════════════
   SECTION WRAPPER
════════════════════════════════════════ */
const SectionLabel = ({ text }) => (
  <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold px-4 py-1.5 rounded-full mb-4">
    <Sparkles size={11} /> {text}
  </div>
)

const SectionHeading = ({ children, center = true }) => (
  <h2 className={`text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight mb-4 ${center ? 'text-center' : ''}`}
    style={{ ...F, letterSpacing: '-0.03em' }}>
    {children}
  </h2>
)

/* ════════════════════════════════════════
   NAVBAR
════════════════════════════════════════ */
const Navbar = () => (
  <nav className="sticky top-0 z-50 bg-white border-b border-slate-100" style={{ boxShadow: '0 1px 12px rgba(0,0,0,0.06)' }}>
    <div className="max-w-7xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between gap-6">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#2563EB,#14B8A6)' }}>
          <Briefcase size={15} className="text-white" />
        </div>
        <span className="text-lg font-black text-slate-900" style={{ ...F, letterSpacing: '-0.03em' }}>
          Req<span style={{ background: 'linear-gradient(135deg,#2563EB,#14B8A6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Track</span>
        </span>
      </div>
      <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-500">
        {['Jobs', 'Companies', 'About', 'Contact'].map(n => (
          <a key={n} href="#" className={`hover:text-blue-600 transition-colors ${n === 'About' ? 'text-blue-600 font-bold' : ''}`} style={F}>{n}</a>
        ))}
      </div>
      <div className="flex items-center gap-2.5">
        <button className="hidden sm:flex text-sm font-semibold text-slate-600 hover:text-blue-600 px-3 py-1.5 transition-colors" style={F}>Sign In</button>
        <button className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white font-bold text-sm rounded-xl hover:bg-blue-700 transition-all" style={{ ...F, boxShadow: '0 2px 10px rgba(37,99,235,0.30)' }}>
          Get Started
        </button>
      </div>
    </div>
  </nav>
)

/* ════════════════════════════════════════
   HERO SECTION
════════════════════════════════════════ */
const AboutHero = () => (
  <section className="relative overflow-hidden py-24" style={{ background: 'linear-gradient(160deg,#0F172A 0%,#1E3A5F 45%,#0D3D38 85%,#0F172A 100%)' }}>
    <style>{`
      @keyframes floatA { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
      @keyframes floatB { 0%,100%{transform:translateY(0)} 50%{transform:translateY(10px)} }
      @keyframes rotateSlow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
      @keyframes shimmerText { 0%{background-position:-200% center} 100%{background-position:200% center} }
      @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
    `}</style>

    {/* BG decor */}
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'linear-gradient(#FFF 1px,transparent 1px),linear-gradient(90deg,#FFF 1px,transparent 1px)', backgroundSize: '56px 56px' }} />
      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full opacity-15" style={{ background: 'radial-gradient(circle,#2563EB,transparent)', filter: 'blur(80px)' }} />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full opacity-15" style={{ background: 'radial-gradient(circle,#14B8A6,transparent)', filter: 'blur(80px)' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full border border-white/5" style={{ animation: 'rotateSlow 40s linear infinite' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-white/5" style={{ animation: 'rotateSlow 25s linear infinite reverse' }} />
      {[
        { top: '15%', left: '8%', size: 5, color: '#2563EB', delay: '0s' },
        { top: '70%', left: '5%', size: 4, color: '#14B8A6', delay: '1s' },
        { top: '20%', right: '10%', size: 3, color: '#8B5CF6', delay: '0.5s' },
        { top: '75%', right: '8%', size: 5, color: '#F59E0B', delay: '1.5s' },
      ].map((p, i) => (
        <div key={i} className="absolute rounded-full opacity-60"
          style={{ top: p.top, left: p.left, right: p.right, width: p.size * 2, height: p.size * 2, background: p.color, animation: `floatA 3s ease-in-out ${p.delay} infinite`, boxShadow: `0 0 ${p.size * 3}px ${p.color}` }} />
      ))}
    </div>

    <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
      <div className="inline-flex items-center gap-2 border text-blue-300 text-xs font-semibold px-4 py-1.5 rounded-full mb-6"
        style={{ borderColor: '#2563EB50', background: '#2563EB15', animation: 'fadeUp 0.6s ease both' }}>
        <Sparkles size={12} className="text-blue-400" /> India's Smartest Recruitment Platform
      </div>

      <h1 className="font-black text-white leading-tight mb-5"
        style={{ ...F, fontSize: 'clamp(36px,6vw,72px)', letterSpacing: '-0.04em', animation: 'fadeUp 0.7s ease 0.1s both' }}>
        About{' '}
        <span style={{ background: 'linear-gradient(135deg,#60A5FA 0%,#34D399 50%,#A78BFA 100%)', backgroundSize: '200% auto', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', animation: 'shimmerText 4s linear infinite' }}>
          ReqTrack
        </span>
      </h1>

      <p className="text-slate-300 text-lg leading-relaxed max-w-2xl mx-auto mb-10"
        style={{ animation: 'fadeUp 0.7s ease 0.2s both' }}>
        ReqTrack is a modern recruitment management platform connecting talented professionals with leading organizations — built to make hiring faster, smarter, and more human.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4" style={{ animation: 'fadeUp 0.7s ease 0.3s both' }}>
        <button className="flex items-center gap-2 px-8 py-3.5 text-white font-bold text-sm rounded-xl transition-all hover:-translate-y-0.5"
          style={{ ...F, background: 'linear-gradient(135deg,#2563EB,#1D4ED8)', boxShadow: '0 6px 24px rgba(37,99,235,0.45)' }}>
          Browse Jobs <ArrowRight size={15} />
        </button>
        <button className="flex items-center gap-2 px-8 py-3.5 font-bold text-sm rounded-xl border-2 border-white/20 text-white hover:bg-white/10 transition-all hover:-translate-y-0.5" style={F}>
          Contact Us <MessageCircle size={15} />
        </button>
      </div>

      {/* Floating stats */}
      <div className="flex flex-wrap justify-center gap-4 mt-14" style={{ animation: 'fadeUp 0.7s ease 0.4s both' }}>
        {[
          { val: '500+', label: 'Companies', color: '#60A5FA' },
          { val: '20K+', label: 'Candidates', color: '#34D399' },
          { val: '10K+', label: 'Placements', color: '#A78BFA' },
          { val: '4.9★', label: 'Rating', color: '#FBBF24' },
        ].map(s => (
          <div key={s.label} className="text-center px-6 py-3 rounded-2xl" style={{ background: '#FFFFFF0A', border: '1px solid #FFFFFF15' }}>
            <div className="font-black text-xl" style={{ color: s.color, ...F }}>{s.val}</div>
            <div className="text-slate-400 text-xs font-medium mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
)

/* ════════════════════════════════════════
   ABOUT COMPANY
════════════════════════════════════════ */
const AboutCompany = () => (
  <section className="py-20" style={{ background: '#F8FAFC' }}>
    <div className="max-w-7xl mx-auto px-6 lg:px-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
        {/* Left */}
        <div>
          <SectionLabel text="Our Story" />
          <SectionHeading center={false}>
            Built to Fix What's{' '}
            <span style={{ background: 'linear-gradient(135deg,#2563EB,#14B8A6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Broken in Hiring
            </span>
          </SectionHeading>
          <div className="flex flex-col gap-4 text-slate-500 text-sm leading-relaxed">
            <p>Traditional hiring processes are slow, fragmented, and opaque. Job seekers send applications into black holes. HR teams juggle spreadsheets and email threads. Managers lose visibility. Vendors submit candidates with no structure. Everyone loses.</p>
            <p>ReqTrack was born out of frustration with this broken system. We set out to build a centralized recruitment management platform — one that brings HR teams, department managers, interview panels, vendors, and candidates together in a single collaborative workspace.</p>
            <p>Today, over 500 organizations use ReqTrack to post requirements, track candidates, conduct interviews, and make hiring decisions — all in one place, with full transparency at every step.</p>
          </div>
          <div className="flex flex-wrap gap-3 mt-7">
            {['Launched 2021', 'Pan-India', 'GDPR Compliant', 'SOC 2 Certified'].map(b => (
              <span key={b} className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                <CheckCircle2 size={11} />{b}
              </span>
            ))}
          </div>
        </div>

        {/* Right — visual */}
        <div className="relative flex items-center justify-center min-h-[380px]">
          <div className="absolute w-64 h-64 rounded-full" style={{ background: 'linear-gradient(135deg,#EFF6FF,#F0FDFA)', border: '1.5px solid #BFDBFE' }} />

          {/* Center card */}
          <div className="relative z-10 bg-white rounded-2xl p-7 w-64 text-center" style={{ boxShadow: '0 16px 48px rgba(37,99,235,0.12)', border: '1.5px solid #BFDBFE' }}>
            <div className="w-14 h-14 rounded-2xl mx-auto mb-3 flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#2563EB,#14B8A6)' }}>
              <Rocket size={26} className="text-white" />
            </div>
            <div className="text-2xl font-black text-slate-900 mb-0.5" style={F}>Since 2021</div>
            <div className="text-xs text-slate-500 font-medium mb-3">Transforming Recruitment</div>
            <div className="flex justify-center gap-0.5">
              {[...Array(5)].map((_, i) => <Star key={i} size={13} fill="#F59E0B" className="text-amber-400" />)}
            </div>
          </div>

          {/* Floating chips */}
          {[
            { top: '5%', left: '-5%', Icon: Users, val: '20K+', sub: 'Candidates', color: '#14B8A6', bg: '#F0FDFA', border: '#99F6E4', anim: 'floatA 4s ease-in-out infinite' },
            { top: '5%', right: '-5%', Icon: Building2, val: '500+', sub: 'Companies', color: '#2563EB', bg: '#EFF6FF', border: '#BFDBFE', anim: 'floatB 3.5s ease-in-out infinite' },
            { bottom: '5%', left: '-5%', Icon: Award, val: '10K+', sub: 'Placements', color: '#F59E0B', bg: '#FFFBEB', border: '#FDE68A', anim: 'floatB 4.5s ease-in-out infinite 1s' },
            { bottom: '5%', right: '-5%', Icon: TrendingUp, val: '95%', sub: 'Success Rate', color: '#8B5CF6', bg: '#F5F3FF', border: '#DDD6FE', anim: 'floatA 4s ease-in-out infinite 1.5s' },
          ].map((fc, i) => {
            const Icon = fc.Icon
            return (
              <div key={i} className="absolute flex items-center gap-2.5 bg-white rounded-xl px-3.5 py-2.5 z-20" style={{ top: fc.top, left: fc.left, right: fc.right, bottom: fc.bottom, border: `1.5px solid ${fc.border}`, boxShadow: `0 4px 16px ${fc.color}18`, animation: fc.anim }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: fc.bg }}>
                  <Icon size={16} style={{ color: fc.color }} />
                </div>
                <div>
                  <div className="text-sm font-black text-slate-900 leading-none" style={F}>{fc.val}</div>
                  <div className="text-[10px] text-slate-400 font-medium">{fc.sub}</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  </section>
)

/* ════════════════════════════════════════
   MISSION & VISION
════════════════════════════════════════ */
const MissionVision = () => (
  <section className="py-20" style={{ background: '#F1F5F9' }}>
    <div className="max-w-7xl mx-auto px-6 lg:px-10">
      <div className="text-center mb-12">
        <SectionLabel text="Purpose & Direction" />
        <SectionHeading>Mission &amp; Vision</SectionHeading>
        <p className="text-slate-500 text-base max-w-lg mx-auto">Two guiding stars that drive every decision we make at ReqTrack.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {[
          {
            Icon: Target, label: 'Our Mission', color: '#2563EB', grad: ['#2563EB', '#6366F1'], bg: '#EFF6FF', border: '#BFDBFE',
            text: 'To simplify the hiring process by providing a transparent, efficient, and collaborative recruitment platform that saves time, reduces bias, and empowers every stakeholder — from HR to candidate.',
            pillars: ['Transparency', 'Efficiency', 'Collaboration'],
          },
          {
            Icon: Eye, label: 'Our Vision', color: '#14B8A6', grad: ['#14B8A6', '#06B6D4'], bg: '#F0FDFA', border: '#99F6E4',
            text: 'To become the leading recruitment management platform in India and beyond — one that empowers organizations to build great teams and helps every professional find work that truly matters to them.',
            pillars: ['Scale', 'Impact', 'Inclusion'],
          },
        ].map(card => {
          const Icon = card.Icon
          return (
            <div key={card.label} className="relative bg-white rounded-3xl p-8 overflow-hidden group hover:-translate-y-1 transition-all duration-300" style={{ border: `1.5px solid ${card.border}`, boxShadow: `0 4px 24px ${card.color}10` }}>
              <div className="absolute top-0 left-8 right-8 h-0.5 rounded-full" style={{ background: `linear-gradient(90deg,transparent,${card.color},transparent)` }} />
              <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full pointer-events-none" style={{ background: `radial-gradient(circle,${card.color}10,transparent)` }} />
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5" style={{ background: `linear-gradient(135deg,${card.grad[0]},${card.grad[1]})`, boxShadow: `0 6px 20px ${card.color}35` }}>
                <Icon size={26} className="text-white" />
              </div>
              <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: card.color, ...F }}>{card.label}</div>
              <p className="text-slate-600 text-sm leading-relaxed mb-5">{card.text}</p>
              <div className="flex gap-2 flex-wrap">
                {card.pillars.map(p => (
                  <span key={p} className="text-xs font-bold px-3 py-1 rounded-full" style={{ background: card.bg, color: card.color, border: `1px solid ${card.border}` }}>{p}</span>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  </section>
)

/* ════════════════════════════════════════
   CORE VALUES
════════════════════════════════════════ */
const coreValues = [
  { Icon: Shield,    title: 'Transparency',   color: '#2563EB', bg: '#EFF6FF', border: '#BFDBFE', desc: 'Clear, honest hiring processes with full visibility for candidates and recruiters at every stage.' },
  { Icon: Zap,       title: 'Efficiency',     color: '#F59E0B', bg: '#FFFBEB', border: '#FDE68A', desc: 'Automated workflows and smart tools that cut hiring time from weeks to days.' },
  { Icon: Lightbulb, title: 'Innovation',     color: '#8B5CF6', bg: '#F5F3FF', border: '#DDD6FE', desc: 'Continuously improving talent acquisition with AI-powered matching and modern interfaces.' },
  { Icon: Users,     title: 'Collaboration',  color: '#14B8A6', bg: '#F0FDFA', border: '#99F6E4', desc: 'One unified platform for HR, managers, panels, and vendors to work together seamlessly.' },
  { Icon: Heart,     title: 'Empathy',        color: '#EF4444', bg: '#FEF2F2', border: '#FECACA', desc: 'Every feature is designed with compassion for job seekers navigating a stressful process.' },
  { Icon: Globe,     title: 'Accessibility',  color: '#22C55E', bg: '#F0FDF4', border: '#BBF7D0', desc: 'Free for candidates, inclusive for all experience levels, available across 50+ cities.' },
]

const CoreValues = () => (
  <section className="py-20" style={{ background: '#F8FAFC' }}>
    <div className="max-w-7xl mx-auto px-6 lg:px-10">
      <div className="text-center mb-12">
        <SectionLabel text="What We Stand For" />
        <SectionHeading>Our Core Values</SectionHeading>
        <p className="text-slate-500 text-base max-w-lg mx-auto">The principles that guide our product decisions, team culture, and relationships with every user.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {coreValues.map(v => {
          const Icon = v.Icon
          return (
            <div key={v.title} className="group bg-white rounded-2xl p-6 border transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl cursor-default"
              style={{ borderColor: v.border, boxShadow: `0 2px 12px ${v.color}08` }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110"
                style={{ background: `linear-gradient(135deg,${v.color}22,${v.color}10)`, border: `1.5px solid ${v.border}` }}>
                <Icon size={22} style={{ color: v.color }} />
              </div>
              <h3 className="text-base font-extrabold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors" style={F}>{v.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{v.desc}</p>
            </div>
          )
        })}
      </div>
    </div>
  </section>
)

/* ════════════════════════════════════════
   PLATFORM FEATURES
════════════════════════════════════════ */
const platformFeatures = [
  { Icon: Layers,      title: 'Requirement Management',      desc: 'Create, submit, approve, and publish manpower requirements with multi-level workflow.',  color: '#2563EB' },
  { Icon: Users,       title: 'Candidate CRM',               desc: 'Centralized candidate profiles with tags, follow-ups, and pipeline stage tracking.',      color: '#14B8A6' },
  { Icon: Calendar,    title: 'Interview Scheduling',         desc: 'Schedule online/offline interviews, assign panels, and collect structured feedback.',      color: '#8B5CF6' },
  { Icon: Building2,   title: 'Vendor Collaboration',        desc: 'Vendors and consultancies submit candidates directly against open requirements.',           color: '#F59E0B' },
  { Icon: BarChart3,   title: 'Application Tracking',        desc: 'Real-time pipeline view with status updates for every application submitted.',              color: '#22C55E' },
  { Icon: Brain,       title: 'AI-Powered Matching',         desc: 'Smart algorithms surface the best-fit candidates based on skills, experience, and role.',   color: '#EF4444' },
]

const PlatformFeatures = () => (
  <section className="py-20" style={{ background: '#F1F5F9' }}>
    <div className="max-w-7xl mx-auto px-6 lg:px-10">
      <div className="text-center mb-12">
        <SectionLabel text="Platform Capabilities" />
        <SectionHeading>
          Everything Built for{' '}
          <span style={{ background: 'linear-gradient(135deg,#2563EB,#14B8A6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Modern Hiring
          </span>
        </SectionHeading>
        <p className="text-slate-500 text-base max-w-lg mx-auto">Six core capabilities that make ReqTrack the only recruitment tool your team will ever need.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {platformFeatures.map((f, i) => {
          const Icon = f.Icon
          return (
            <div key={f.title} className="group bg-white rounded-2xl p-6 border border-slate-100 transition-all duration-300 hover:-translate-y-1.5 hover:border-blue-200 hover:shadow-xl"
              style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.04)', animationDelay: `${i * 80}ms` }}>
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                  style={{ background: `${f.color}15`, border: `1.5px solid ${f.color}25` }}>
                  <Icon size={22} style={{ color: f.color }} />
                </div>
                <span className="text-xs font-black text-slate-300" style={{ ...F, fontSize: '28px', lineHeight: 1, opacity: 0.08 }}>0{i + 1}</span>
              </div>
              <h3 className="text-sm font-extrabold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors" style={F}>{f.title}</h3>
              <p className="text-slate-500 text-xs leading-relaxed">{f.desc}</p>
              <div className="mt-4 flex items-center gap-1.5 text-xs font-bold transition-all" style={{ color: f.color, opacity: 0.6 }}>
                Learn more <ChevronRight size={12} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  </section>
)

/* ════════════════════════════════════════
   HOW IT WORKS
════════════════════════════════════════ */
const howSteps = [
  { step: '01', Icon: Briefcase,    title: 'Post Requirement',        desc: 'Organizations create detailed manpower requirements for specific departments — with skills, salary, and urgency.',  color: '#2563EB', bg: '#EFF6FF' },
  { step: '02', Icon: CheckCircle2, title: 'Review & Approve',        desc: 'Admins and org managers review, comment on, and approve requirements through a structured multi-level workflow.',    color: '#14B8A6', bg: '#F0FDFA' },
  { step: '03', Icon: Users,        title: 'Candidate Applications',  desc: 'Published jobs are visible publicly. Candidates apply directly or through verified vendor/consultancy submissions.', color: '#8B5CF6', bg: '#F5F3FF' },
  { step: '04', Icon: Award,        title: 'Interviews & Hiring',     desc: 'Recruiters schedule interviews, panels submit structured feedback, and hiring decisions are made with full context.',  color: '#F59E0B', bg: '#FFFBEB' },
]

const HowItWorks = () => (
  <section className="py-20" style={{ background: '#F8FAFC' }}>
    <div className="max-w-7xl mx-auto px-6 lg:px-10">
      <div className="text-center mb-14">
        <SectionLabel text="The Process" />
        <SectionHeading>How ReqTrack Works</SectionHeading>
        <p className="text-slate-500 text-base max-w-lg mx-auto">Four simple steps that transform chaotic hiring into a smooth, transparent process.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 relative">
        {/* Connector line */}
        <div className="hidden lg:block absolute top-14 left-[12.5%] right-[12.5%] h-px z-0"
          style={{ background: 'linear-gradient(90deg,#BFDBFE,#99F6E4,#DDD6FE,#FDE68A)', opacity: 0.7 }} />
        {howSteps.map(s => {
          const Icon = s.Icon
          return (
            <div key={s.step} className="relative z-10 bg-white rounded-2xl p-6 border border-slate-100 flex flex-col gap-4 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg group"
              style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
              <div className="flex items-start justify-between">
                <div className="w-13 h-13 w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-105"
                  style={{ background: s.bg, border: `1.5px solid ${s.color}25` }}>
                  <Icon size={22} style={{ color: s.color }} />
                </div>
                <span className="text-xs font-black px-2 py-0.5 rounded-lg" style={{ background: s.bg, color: s.color, ...F }}>{s.step}</span>
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors" style={F}>{s.title}</h3>
                <p className="text-slate-500 text-xs leading-relaxed">{s.desc}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  </section>
)

/* ════════════════════════════════════════
   STATS SECTION
════════════════════════════════════════ */
const statsData = [
  { rawVal: 500,   suffix: '+',  label: 'Partner Companies',    sub: 'Verified & hiring',         Icon: Building2,   color: '#60A5FA', grad: ['#2563EB', '#6366F1'] },
  { rawVal: 20000, suffix: 'K+', label: 'Registered Candidates',sub: 'From across India',         Icon: Users,       color: '#34D399', grad: ['#14B8A6', '#06B6D4'] },
  { rawVal: 10000, suffix: 'K+', label: 'Successful Placements',sub: 'Dreams fulfilled',          Icon: Award,       color: '#A78BFA', grad: ['#8B5CF6', '#A855F7'] },
  { rawVal: 5000,  suffix: 'K+', label: 'Jobs Posted',          sub: 'Across all industries',    Icon: Briefcase,   color: '#FBBF24', grad: ['#F59E0B', '#EF4444'] },
]

const StatsSection = () => {
  const [started, setStarted] = useState(false)
  const ref = useRef(null)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStarted(true) }, { threshold: 0.2 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <section ref={ref} className="relative py-24 overflow-hidden" style={{ background: 'linear-gradient(180deg,#0F172A 0%,#1E293B 60%,#0F172A 100%)' }}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'linear-gradient(#FFF 1px,transparent 1px),linear-gradient(90deg,#FFF 1px,transparent 1px)', backgroundSize: '56px 56px' }} />
        <div className="absolute top-0 left-1/4 w-80 h-80 rounded-full opacity-10" style={{ background: 'radial-gradient(circle,#2563EB,transparent)', filter: 'blur(70px)' }} />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 rounded-full opacity-10" style={{ background: 'radial-gradient(circle,#14B8A6,transparent)', filter: 'blur(70px)' }} />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 border text-blue-300 text-xs font-semibold px-4 py-1.5 rounded-full mb-4" style={{ borderColor: '#2563EB50', background: '#2563EB15' }}>
            <TrendingUp size={12} className="text-blue-400" /> Platform Impact
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3" style={{ ...F, letterSpacing: '-0.03em' }}>
            Numbers That{' '}
            <span style={{ background: 'linear-gradient(135deg,#60A5FA,#34D399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Speak for Us</span>
          </h2>
          <p className="text-slate-400 text-sm max-w-md mx-auto">Every metric represents a real person whose career — or team — moved forward.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {statsData.map(s => {
            const Icon = s.Icon
            const raw = s.rawVal >= 1000 ? s.rawVal / 1000 : s.rawVal
            const count = useCountUp(raw, 2200, started)
            const display = `${count}${s.suffix}`
            return (
              <div key={s.label} className="group relative flex flex-col items-center justify-center gap-4 rounded-2xl p-7 text-center overflow-hidden transition-all duration-300 hover:-translate-y-2"
                style={{ background: '#FFFFFF', border: `1.5px solid ${s.color}30`, boxShadow: `0 4px 24px ${s.color}12` }}>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 h-0.5 w-1/2 rounded-full group-hover:w-3/4 transition-all duration-500"
                  style={{ background: `linear-gradient(90deg,${s.grad[0]},${s.grad[1]})` }} />
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                  style={{ background: `linear-gradient(135deg,${s.grad[0]}22,${s.grad[1]}12)`, border: `1.5px solid ${s.color}25` }}>
                  <Icon size={26} style={{ color: s.grad[0] }} />
                </div>
                <div>
                  <div className="text-4xl font-black leading-none mb-1" style={{ ...F, background: `linear-gradient(135deg,${s.grad[0]},${s.grad[1]})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.04em' }}>
                    {display}
                  </div>
                  <div className="text-sm font-bold text-slate-800 mb-0.5" style={F}>{s.label}</div>
                  <div className="text-xs text-slate-400">{s.sub}</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ════════════════════════════════════════
   TEAM SECTION
════════════════════════════════════════ */
const teamMembers = [
  { name: 'Aminul Islam',    role: 'Full Stack Developer',   avatar: 'AI', color: '#2563EB', bio: 'Passionate about building scalable web platforms. Led 3 enterprise recruitment systems before founding ReqTrack.', twitter: '#', linkedin: '#', github: '#' },
  { name: 'Priya Nair',      role: 'Product Designer',       avatar: 'PN', color: '#14B8A6', bio: 'UX-obsessed designer with 6+ years crafting intuitive hiring experiences for enterprise and startup clients.', twitter: '#', linkedin: '#', github: '#' },
  { name: 'Rajan Mehta',     role: 'Backend Engineer',       avatar: 'RM', color: '#8B5CF6', bio: 'Systems architect specializing in high-performance APIs and distributed databases for HR tech platforms.', twitter: '#', linkedin: '#', github: '#' },
  { name: 'Sneha Kulkarni',  role: 'Head of Partnerships',   avatar: 'SK', color: '#F59E0B', bio: 'Built our network of 500+ partner companies. Former recruiter turned tech advocate with deep HR domain expertise.', twitter: '#', linkedin: '#', github: '#' },
]

const TeamSection = () => (
  <section className="py-20" style={{ background: '#F1F5F9' }}>
    <div className="max-w-7xl mx-auto px-6 lg:px-10">
      <div className="text-center mb-12">
        <SectionLabel text="The People Behind It" />
        <SectionHeading>Meet Our Team</SectionHeading>
        <p className="text-slate-500 text-base max-w-lg mx-auto">A small but mighty team of engineers, designers, and domain experts obsessed with making hiring better.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {teamMembers.map(m => (
          <div key={m.name} className="group bg-white rounded-2xl p-6 border border-slate-100 flex flex-col gap-4 text-center transition-all duration-300 hover:-translate-y-2 hover:border-blue-200 hover:shadow-xl"
            style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
            {/* Avatar */}
            <div className="relative mx-auto">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-xl font-black mx-auto" style={{ background: `linear-gradient(135deg,${m.color},${m.color}99)`, boxShadow: `0 4px 16px ${m.color}35`, ...F }}>
                {m.avatar}
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-lg bg-green-400 border-2 border-white flex items-center justify-center">
                <BadgeCheck size={10} className="text-white" />
              </div>
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 mb-0.5" style={F}>{m.name}</h3>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: `${m.color}15`, color: m.color }}>{m.role}</span>
            </div>
            <p className="text-slate-500 text-xs leading-relaxed">{m.bio}</p>
            {/* Social */}
            <div className="flex items-center justify-center gap-2 mt-auto">
              {[{ I: Linkedin, href: m.linkedin, color: '#0A66C2' }, { I: Twitter, href: m.twitter, color: '#1DA1F2' }, { I: Github, href: m.github, color: '#0F172A' }].map(({ I, href, color }) => (
                <a key={href} href={href} className="w-7 h-7 rounded-lg flex items-center justify-center bg-slate-100 text-slate-400 hover:text-white transition-all duration-200"
                  onMouseOver={e => { e.currentTarget.style.background = color; e.currentTarget.style.color = '#fff' }}
                  onMouseOut={e => { e.currentTarget.style.background = '#F1F5F9'; e.currentTarget.style.color = '#94A3B8' }}>
                  <I size={13} />
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
)

/* ════════════════════════════════════════
   JOURNEY TIMELINE
════════════════════════════════════════ */
const milestones = [
  { year: '2021', event: 'ReqTrack Founded', desc: 'Started as an internal tool for a 200-person IT firm in Bangalore.', color: '#2563EB' },
  { year: '2022', event: '50 Companies Onboard', desc: 'First major milestone: 50 verified organizations using the platform.', color: '#14B8A6' },
  { year: '2023', event: 'AI Matching Launched', desc: 'Released AI-powered candidate matching with 94% accuracy on skill alignment.', color: '#8B5CF6' },
  { year: '2024', event: '10,000 Placements', desc: 'Crossed the milestone of 10,000 successful candidate placements.', color: '#F59E0B' },
  { year: '2025', event: 'Pan-India Expansion', desc: 'Now live in 50+ cities with 500+ verified employer organizations.', color: '#22C55E' },
]

const OurJourney = () => (
  <section className="py-20" style={{ background: '#F8FAFC' }}>
    <div className="max-w-5xl mx-auto px-6 lg:px-10">
      <div className="text-center mb-12">
        <SectionLabel text="Our Milestones" />
        <SectionHeading>Our Journey So Far</SectionHeading>
      </div>
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-0.5 hidden sm:block" style={{ background: 'linear-gradient(180deg,#BFDBFE,#99F6E4,#DDD6FE,#FDE68A,#BBF7D0)' }} />
        <div className="flex flex-col gap-8">
          {milestones.map((m, i) => (
            <div key={m.year} className={`flex items-center gap-6 ${i % 2 === 0 ? 'sm:flex-row' : 'sm:flex-row-reverse'}`}>
              <div className={`flex-1 ${i % 2 === 0 ? 'sm:text-right' : 'sm:text-left'}`}>
                <div className="bg-white rounded-2xl p-5 border border-slate-100 inline-block transition-all hover:-translate-y-0.5 hover:shadow-md" style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.05)', maxWidth: '320px' }}>
                  <div className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: m.color }}>{m.year}</div>
                  <h3 className="text-sm font-extrabold text-slate-900 mb-1" style={F}>{m.event}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{m.desc}</p>
                </div>
              </div>
              {/* Dot */}
              <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 z-10 hidden sm:flex" style={{ background: m.color, boxShadow: `0 0 0 4px ${m.color}25` }}>
                <CheckCircle2 size={16} className="text-white" />
              </div>
              <div className="flex-1 hidden sm:block" />
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
)

/* ════════════════════════════════════════
   CTA SECTION
════════════════════════════════════════ */
const AboutCTA = () => (
  <section className="relative overflow-hidden py-24 px-6" style={{ background: 'linear-gradient(135deg,#0F172A 0%,#1E3A5F 45%,#0D3D38 85%,#0F172A 100%)' }}>
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'linear-gradient(#FFF 1px,transparent 1px),linear-gradient(90deg,#FFF 1px,transparent 1px)', backgroundSize: '56px 56px' }} />
      <div className="absolute top-0 left-1/4 w-80 h-80 rounded-full opacity-15" style={{ background: 'radial-gradient(circle,#2563EB,transparent)', filter: 'blur(80px)' }} />
      <div className="absolute bottom-0 right-1/4 w-72 h-72 rounded-full opacity-15" style={{ background: 'radial-gradient(circle,#14B8A6,transparent)', filter: 'blur(80px)' }} />
    </div>
    <div className="relative z-10 max-w-3xl mx-auto text-center">
      <div className="inline-flex items-center gap-2 border text-blue-300 text-xs font-semibold px-4 py-1.5 rounded-full mb-6" style={{ borderColor: '#2563EB50', background: '#2563EB15' }}>
        <Sparkles size={12} className="text-blue-400" /> Your Next Chapter Starts Here
      </div>
      <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4" style={{ ...F, letterSpacing: '-0.03em' }}>
        Start Your Career{' '}
        <span style={{ background: 'linear-gradient(135deg,#60A5FA,#34D399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Journey Today
        </span>
      </h2>
      <p className="text-slate-300 text-base max-w-xl mx-auto mb-10 leading-relaxed">
        Explore thousands of job opportunities and connect with top companies through ReqTrack. Free for job seekers, always.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
        <button className="flex items-center gap-2 px-9 py-4 text-white font-bold text-sm rounded-2xl transition-all hover:-translate-y-1"
          style={{ ...F, background: 'linear-gradient(135deg,#2563EB,#1D4ED8)', boxShadow: '0 6px 24px rgba(37,99,235,0.45)' }}>
          <Briefcase size={16} /> Browse Jobs <ArrowRight size={15} />
        </button>
        <button className="flex items-center gap-2 px-9 py-4 font-bold text-sm rounded-2xl border-2 border-white/20 text-white hover:bg-white/10 transition-all hover:-translate-y-1" style={F}>
          <Users size={16} /> Create Account <ArrowRight size={15} />
        </button>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
        {['Free to join', 'Verified employers', '50K+ jobs', 'Track applications'].map(t => (
          <div key={t} className="flex items-center gap-1.5"><CheckCircle2 size={12} className="text-teal-400" />{t}</div>
        ))}
      </div>
    </div>
  </section>
)

/* ════════════════════════════════════════
   FOOTER
════════════════════════════════════════ */
const Footer = () => (
  <footer style={{ background: '#0F172A' }}>
    <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#2563EB,#14B8A6)' }}>
            <Briefcase size={15} className="text-white" />
          </div>
          <span className="text-base font-black text-white" style={{ ...F, letterSpacing: '-0.03em' }}>
            Req<span style={{ background: 'linear-gradient(135deg,#60A5FA,#34D399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Track</span>
          </span>
        </div>
        <div className="flex flex-wrap justify-center gap-5 text-xs text-slate-500 font-medium">
          {['Jobs', 'Companies', 'About', 'Privacy', 'Terms', 'Contact'].map(l => (
            <a key={l} href="#" className="hover:text-blue-400 transition-colors" style={F}>{l}</a>
          ))}
        </div>
        <div className="flex items-center gap-1.5 text-slate-500 text-xs">
          <span>© {new Date().getFullYear()} ReqTrack · Made with</span>
          <Heart size={10} fill="#EF4444" className="text-red-500" />
          <span>in India</span>
        </div>
      </div>
    </div>
  </footer>
)

/* ════════════════════════════════════════
   ABOUT PAGE
════════════════════════════════════════ */
const AboutPage = () => (
  <div className='pt-20' style={{ background: '#F1F5F9', minHeight: '100vh', ...F }}>
    <style>{`@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap');*{box-sizing:border-box}`}</style>
    <AboutHero />
    <AboutCompany />
    <MissionVision />
    <CoreValues />
    <PlatformFeatures />
    <HowItWorks />
    <StatsSection />
    <TeamSection />
    <OurJourney />
    <AboutCTA />
  </div>
)

export default AboutPage