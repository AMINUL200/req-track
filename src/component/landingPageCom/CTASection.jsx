import React, { useState, useEffect, useRef } from 'react'
import {
  ArrowRight, Sparkles, CheckCircle2, Users,
  Briefcase, Zap, Star, Building2, TrendingUp,
  Play, Globe, Shield
} from 'lucide-react'

/* ─── Floating Particle ──────────────────────────────────────────── */
const Particle = ({ style }) => (
  <div className="absolute rounded-full pointer-events-none" style={style} />
)

/* ─── Animated Number ────────────────────────────────────────────── */
const AnimatedNum = ({ value, suffix, color }) => {
  const [count, setCount] = useState(0)
  const [started, setStarted] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setStarted(true) },
      { threshold: 0.3 }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    if (!started) return
    let raf, start = null
    const numeric = parseInt(value.toString().replace(/\D/g, ''))
    const tick = (ts) => {
      if (!start) start = ts
      const p = Math.min((ts - start) / 1800, 1)
      const e = 1 - Math.pow(1 - p, 3)
      setCount(Math.floor(e * numeric))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [started, value])

  return (
    <span ref={ref} className="font-black tabular-nums" style={{ color }}>
      {count.toLocaleString()}{suffix}
    </span>
  )
}

/* ─── CTASection ─────────────────────────────────────────────────── */
const CTASection = () => {
  const [hoverBrowse, setHoverBrowse] = useState(false)
  const [hoverCreate, setHoverCreate] = useState(false)

  const particles = [
    { top: '8%',  left: '6%',   width: 8,  height: 8,  background: '#2563EB', opacity: 0.5, animation: 'floatA 4s ease-in-out infinite', boxShadow: '0 0 12px #2563EB' },
    { top: '18%', right: '10%', width: 5,  height: 5,  background: '#14B8A6', opacity: 0.5, animation: 'floatB 3.5s ease-in-out infinite 0.5s', boxShadow: '0 0 8px #14B8A6' },
    { top: '60%', left: '4%',   width: 6,  height: 6,  background: '#8B5CF6', opacity: 0.4, animation: 'floatA 5s ease-in-out infinite 1s', boxShadow: '0 0 10px #8B5CF6' },
    { top: '75%', right: '7%',  width: 4,  height: 4,  background: '#F59E0B', opacity: 0.5, animation: 'floatB 4.5s ease-in-out infinite 0.8s', boxShadow: '0 0 8px #F59E0B' },
    { top: '40%', left: '15%',  width: 3,  height: 3,  background: '#FFFFFF', opacity: 0.3, animation: 'floatA 3s ease-in-out infinite 1.5s' },
    { top: '30%', right: '18%', width: 3,  height: 3,  background: '#FFFFFF', opacity: 0.3, animation: 'floatB 3.8s ease-in-out infinite 0.3s' },
    { top: '85%', left: '30%',  width: 5,  height: 5,  background: '#22C55E', opacity: 0.4, animation: 'floatA 4.2s ease-in-out infinite 2s', boxShadow: '0 0 10px #22C55E' },
    { top: '12%', left: '45%',  width: 4,  height: 4,  background: '#EF4444', opacity: 0.35, animation: 'floatB 3.2s ease-in-out infinite 0.6s', boxShadow: '0 0 8px #EF4444' },
  ]

  const perks = [
    { icon: CheckCircle2, text: 'Free to join, always',       color: '#22C55E' },
    { icon: Shield,       text: 'Verified employers only',    color: '#2563EB' },
    { icon: Zap,          text: 'Hired in as fast as 5 days', color: '#F59E0B' },
    { icon: Globe,        text: 'Pan-India opportunities',    color: '#14B8A6' },
  ]

  const floatingCards = [
    {
      icon: Users, value: '30K+', label: 'Candidates',
      color: '#14B8A6', bg: '#F0FDFA', border: '#99F6E4',
      style: { top: '12%', left: '2%', animation: 'floatA 4s ease-in-out infinite' },
    },
    {
      icon: Briefcase, value: '50K+', label: 'Jobs Posted',
      color: '#2563EB', bg: '#EFF6FF', border: '#BFDBFE',
      style: { top: '12%', right: '2%', animation: 'floatB 3.5s ease-in-out infinite 0.5s' },
    },
    {
      icon: Building2, value: '500+', label: 'Companies',
      color: '#8B5CF6', bg: '#F5F3FF', border: '#DDD6FE',
      style: { bottom: '14%', left: '3%', animation: 'floatA 4.5s ease-in-out infinite 1s' },
    },
    {
      icon: Star, value: '4.9★', label: 'Platform Rating',
      color: '#F59E0B', bg: '#FFFBEB', border: '#FDE68A',
      style: { bottom: '14%', right: '3%', animation: 'floatB 4s ease-in-out infinite 1.5s' },
    },
  ]

  return (
    <section
      className="relative py-28 overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #0F172A 0%, #1E3A5F 40%, #0D3D38 75%, #0F172A 100%)' }}
    >
      <style>{`
        @keyframes floatA { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        @keyframes floatB { 0%,100%{transform:translateY(0)} 50%{transform:translateY(10px)} }
        @keyframes rotateSlow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes pulseGlow { 0%,100%{opacity:0.15} 50%{opacity:0.30} }
        @keyframes shimmer {
          0%   { background-position: -200% center }
          100% { background-position:  200% center }
        }
      `}</style>

      {/* ── Background layers ── */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Grid */}
        <div className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `linear-gradient(#FFFFFF 1px,transparent 1px),linear-gradient(90deg,#FFFFFF 1px,transparent 1px)`,
            backgroundSize: '56px 56px',
          }}
        />
        {/* Orbs */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full"
          style={{ background: 'radial-gradient(circle,#2563EB,transparent)', filter: 'blur(90px)', opacity: 0.18, animation: 'pulseGlow 4s ease-in-out infinite' }} />
        <div className="absolute bottom-0 right-1/4 w-[450px] h-[450px] rounded-full"
          style={{ background: 'radial-gradient(circle,#14B8A6,transparent)', filter: 'blur(90px)', opacity: 0.18, animation: 'pulseGlow 4s ease-in-out infinite 2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full"
          style={{ background: 'radial-gradient(circle,#8B5CF620,transparent)', filter: 'blur(100px)' }} />
        {/* Rotating rings */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-white/[0.04]"
          style={{ animation: 'rotateSlow 40s linear infinite' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[580px] h-[580px] rounded-full border border-white/[0.04]"
          style={{ animation: 'rotateSlow 25s linear infinite reverse' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[360px] h-[360px] rounded-full border border-white/[0.06]"
          style={{ animation: 'rotateSlow 15s linear infinite' }} />
      </div>

      {/* ── Particles ── */}
      {particles.map((p, i) => <Particle key={i} style={{ ...p, position: 'absolute', borderRadius: '50%' }} />)}

      {/* ── Floating stat cards ── */}
      {floatingCards.map((fc, i) => {
        const Icon = fc.icon
        return (
          <div
            key={i}
            className="absolute hidden lg:flex items-center gap-2.5 bg-white rounded-xl px-3.5 py-2.5 z-20"
            style={{
              ...fc.style,
              border: `1.5px solid ${fc.border}`,
              boxShadow: `0 4px 20px ${fc.color}20`,
            }}
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: fc.bg }}>
              <Icon size={16} style={{ color: fc.color }} />
            </div>
            <div>
              <div className="text-sm font-black text-slate-900 leading-none" style={{ fontFamily: "'Outfit',sans-serif" }}>{fc.value}</div>
              <div className="text-[10px] text-slate-400 font-medium">{fc.label}</div>
            </div>
          </div>
        )
      })}

      {/* ── Main content ── */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">

        {/* Eyebrow badge */}
        <div className="inline-flex items-center gap-2 border text-blue-300 text-xs font-semibold px-4 py-1.5 rounded-full mb-7"
          style={{ borderColor: '#2563EB50', background: '#2563EB15', backdropFilter: 'blur(8px)' }}>
          <Sparkles size={12} className="text-blue-400" />
          Your Next Chapter Starts Here
        </div>

        {/* Headline */}
        <h2
          className="font-black leading-tight mb-5"
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: 'clamp(36px, 6vw, 68px)',
            letterSpacing: '-0.04em',
          }}
        >
          <span className="text-white">Ready to Start </span>
          <br />
          <span style={{
            background: 'linear-gradient(135deg, #60A5FA 0%, #34D399 50%, #A78BFA 100%)',
            backgroundSize: '200% auto',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            animation: 'shimmer 4s linear infinite',
          }}>
            Your Dream Career?
          </span>
        </h2>

        {/* Sub */}
        <p className="text-slate-400 text-base sm:text-lg leading-relaxed mb-10 max-w-xl mx-auto">
          Create your profile and apply for jobs today. Join{' '}
          <span className="text-white font-semibold">
            <AnimatedNum value={30000} suffix="K+" color="#34D399" />
          </span>{' '}
          candidates already building their future with ReqTrack.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">

          {/* Browse Jobs */}
          <button
            onMouseEnter={() => setHoverBrowse(true)}
            onMouseLeave={() => setHoverBrowse(false)}
            className="group relative flex items-center gap-2.5 px-9 py-4 rounded-2xl font-black text-sm overflow-hidden transition-all duration-300"
            style={{
              background: hoverBrowse
                ? 'linear-gradient(135deg,#1D4ED8,#1E40AF)'
                : 'linear-gradient(135deg,#2563EB,#1D4ED8)',
              color: '#FFFFFF',
              boxShadow: hoverBrowse
                ? '0 12px 40px rgba(37,99,235,0.55)'
                : '0 6px 24px rgba(37,99,235,0.40)',
              transform: hoverBrowse ? 'translateY(-3px) scale(1.02)' : 'translateY(0) scale(1)',
              fontFamily: "'Outfit',sans-serif",
              letterSpacing: '0.01em',
              minWidth: '180px',
            }}
          >
            {/* Shine */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300"
              style={{ background: 'linear-gradient(105deg,transparent 30%,rgba(255,255,255,0.15),transparent 70%)' }}
            />
            <Briefcase size={17} />
            Browse Jobs
            <ArrowRight size={16} className={`transition-transform duration-300 ${hoverBrowse ? 'translate-x-1' : ''}`} />
          </button>

          {/* Create Account */}
          <button
            onMouseEnter={() => setHoverCreate(true)}
            onMouseLeave={() => setHoverCreate(false)}
            className="group relative flex items-center gap-2.5 px-9 py-4 rounded-2xl font-black text-sm overflow-hidden transition-all duration-300"
            style={{
              background: hoverCreate ? '#FFFFFF' : 'rgba(255,255,255,0.08)',
              color: hoverCreate ? '#0F172A' : '#FFFFFF',
              border: '1.5px solid rgba(255,255,255,0.2)',
              boxShadow: hoverCreate
                ? '0 12px 40px rgba(255,255,255,0.15)'
                : '0 4px 16px rgba(0,0,0,0.2)',
              transform: hoverCreate ? 'translateY(-3px) scale(1.02)' : 'translateY(0) scale(1)',
              fontFamily: "'Outfit',sans-serif",
              letterSpacing: '0.01em',
              backdropFilter: 'blur(8px)',
              minWidth: '180px',
            }}
          >
            <Users size={17} />
            Create Account
            <ArrowRight size={16} className={`transition-transform duration-300 ${hoverCreate ? 'translate-x-1' : ''}`} />
          </button>

        </div>

        {/* Perks row */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 mb-14">
          {perks.map(p => {
            const Icon = p.icon
            return (
              <div key={p.text} className="flex items-center gap-2">
                <Icon size={13} style={{ color: p.color }} />
                <span className="text-slate-400 text-xs font-medium">{p.text}</span>
              </div>
            )
          })}
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-10">
          <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.1))' }} />
          <span className="text-slate-600 text-xs font-semibold tracking-widest uppercase">Or explore as</span>
          <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg,rgba(255,255,255,0.1),transparent)' }} />
        </div>

        {/* Role pills */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {[
            { label: 'A Recruiter',      icon: TrendingUp, color: '#2563EB', bg: '#2563EB20', border: '#2563EB40' },
            { label: 'A Company / Org',  icon: Building2,  color: '#14B8A6', bg: '#14B8A620', border: '#14B8A640' },
            { label: 'A Vendor',         icon: Globe,      color: '#8B5CF6', bg: '#8B5CF620', border: '#8B5CF640' },
            { label: 'An Interview Panel', icon: Play,     color: '#F59E0B', bg: '#F59E0B20', border: '#F59E0B40' },
          ].map(r => {
            const Icon = r.icon
            return (
              <button
                key={r.label}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 hover:-translate-y-0.5"
                style={{
                  background: r.bg,
                  color: r.color,
                  border: `1px solid ${r.border}`,
                  fontFamily: "'Outfit',sans-serif",
                }}
              >
                <Icon size={13} />
                {r.label}
              </button>
            )
          })}
        </div>

        {/* Bottom trust strip */}
        <div className="mt-14 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {[
            { val: '50K+',  label: 'Jobs',       color: '#60A5FA' },
            { val: '500+',  label: 'Companies',  color: '#34D399' },
            { val: '95%',   label: 'Success',    color: '#A78BFA' },
            { val: '4.9★',  label: 'Rating',     color: '#FBBF24' },
          ].map(s => (
            <div key={s.label} className="flex flex-col items-center">
              <span
                className="text-xl font-black leading-none"
                style={{ color: s.color, fontFamily: "'Outfit',sans-serif" }}
              >
                {s.val}
              </span>
              <span className="text-slate-500 text-xs font-medium mt-0.5">{s.label}</span>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}

export default CTASection