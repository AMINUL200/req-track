import React, { useState, useEffect, useRef } from 'react'
import {
  Briefcase, Users, Building2, TrendingUp,
  Sparkles, ArrowRight, CheckCircle2, Star,
  MapPin, Clock, Globe, Award
} from 'lucide-react'

/* ─── useCountUp ─────────────────────────────────────────────────── */
const useCountUp = (target, duration = 2400, started = false) => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!started) return
    let raf
    let startTime = null
    const numeric = parseFloat(target.toString().replace(/[^0-9.]/g, ''))

    const tick = (ts) => {
      if (!startTime) startTime = ts
      const progress = Math.min((ts - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 4)
      const current = eased * numeric

      // Handle decimal (e.g. 4.9)
      setCount(Number.isInteger(numeric) ? Math.floor(current) : parseFloat(current.toFixed(1)))
      if (progress < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [started, target, duration])

  return count
}

/* ─── StatCard ───────────────────────────────────────────────────── */
const StatCard = ({ stat, started, index }) => {
  const Icon = stat.icon
  const count = useCountUp(stat.numeric, 2200 + index * 100, started)

  const display = stat.prefix
    ? `${stat.prefix}${count.toLocaleString()}${stat.suffix}`
    : `${count.toLocaleString()}${stat.suffix}`

  return (
    <div
      className="group relative flex flex-col items-center justify-center gap-4 rounded-3xl p-8 text-center overflow-hidden transition-all duration-500 hover:-translate-y-3 cursor-default"
      style={{
        background: '#FFFFFF',
        border: `1.5px solid ${stat.border}`,
        boxShadow: `0 4px 24px ${stat.color}10, 0 1px 4px rgba(0,0,0,0.04)`,
      }}
    >
      {/* Hover glow fill */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-3xl"
        style={{ background: `radial-gradient(ellipse at 50% -10%, ${stat.color}12 0%, transparent 65%)` }}
      />

      {/* Shine sweep on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none rounded-3xl overflow-hidden"
        style={{ transition: 'opacity 0.4s' }}
      >
        <div
          className="absolute top-0 -left-full w-1/2 h-full"
          style={{
            background: 'linear-gradient(105deg, transparent, rgba(255,255,255,0.35), transparent)',
            animation: 'shineSweep 1.2s ease forwards',
          }}
        />
      </div>

      {/* Top accent bar */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 h-1 rounded-full transition-all duration-500 group-hover:w-3/4"
        style={{
          width: '40%',
          background: `linear-gradient(90deg, ${stat.gradFrom}, ${stat.gradTo})`,
          boxShadow: `0 0 12px ${stat.color}60`,
        }}
      />

      {/* Icon ring */}
      <div className="relative">
        <div
          className="w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-400 group-hover:scale-110 group-hover:rotate-3"
          style={{
            background: `linear-gradient(135deg, ${stat.gradFrom}22, ${stat.gradTo}12)`,
            border: `1.5px solid ${stat.border}`,
            boxShadow: `0 6px 24px ${stat.color}20`,
          }}
        >
          <Icon size={32} style={{ color: stat.color }} strokeWidth={1.8} />
        </div>

        {/* Pulse ring */}
        <div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            border: `2px solid ${stat.color}40`,
            animation: 'pulseRing 1.5s ease-out infinite',
          }}
        />
      </div>

      {/* Counter */}
      <div className="relative z-10">
        <div
          className="font-black leading-none mb-1 tabular-nums"
          style={{
            fontSize: 'clamp(36px, 5vw, 52px)',
            background: `linear-gradient(135deg, ${stat.gradFrom}, ${stat.gradTo})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontFamily: "'Outfit', sans-serif",
            letterSpacing: '-0.04em',
          }}
        >
          {display}
        </div>
        <div
          className="text-base font-bold text-slate-800 mb-1"
          style={{ fontFamily: "'Outfit', sans-serif" }}
        >
          {stat.label}
        </div>
        <div className="text-xs text-slate-400 font-medium">{stat.sublabel}</div>
      </div>

      {/* Trend chip */}
      <div
        className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full transition-all duration-300 group-hover:scale-105"
        style={{
          background: `linear-gradient(135deg, ${stat.gradFrom}18, ${stat.gradTo}10)`,
          color: stat.color,
          border: `1px solid ${stat.border}`,
        }}
      >
        <TrendingUp size={11} />
        {stat.trend}
      </div>

      {/* Bottom faint label */}
      <div
        className="absolute bottom-3 right-4 text-xs font-black opacity-5 select-none"
        style={{
          fontSize: '56px',
          color: stat.color,
          fontFamily: "'Outfit', sans-serif",
          lineHeight: 1,
        }}
      >
        {stat.bg_char}
      </div>
    </div>
  )
}

/* ─── Mini metric row ────────────────────────────────────────────── */
const MiniMetric = ({ icon: Icon, label, value, color }) => (
  <div className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3 border border-slate-100"
    style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}>
    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
      style={{ background: `${color}15` }}>
      <Icon size={17} style={{ color }} />
    </div>
    <div>
      <div className="text-sm font-extrabold text-slate-900" style={{ fontFamily: "'Outfit',sans-serif" }}>{value}</div>
      <div className="text-xs text-slate-400 font-medium">{label}</div>
    </div>
  </div>
)

/* ─── Data ───────────────────────────────────────────────────────── */
const stats = [
  {
    icon: Briefcase,
    numeric: 50000,
    prefix: '',
    suffix: 'K+',
    label: 'Jobs Posted',
    sublabel: 'Across all industries & levels',
    trend: '+2.3K this month',
    color: '#2563EB',
    gradFrom: '#2563EB',
    gradTo: '#6366F1',
    border: '#BFDBFE',
    bg_char: '50K',
    display: '50K+',
  },
  {
    icon: Users,
    numeric: 30000,
    prefix: '',
    suffix: 'K+',
    label: 'Active Candidates',
    sublabel: 'Job-seekers across India',
    trend: '+1.8K this week',
    color: '#14B8A6',
    gradFrom: '#14B8A6',
    gradTo: '#06B6D4',
    border: '#99F6E4',
    bg_char: '30K',
    display: '30K+',
  },
  {
    icon: Building2,
    numeric: 500,
    prefix: '',
    suffix: '+',
    label: 'Partner Companies',
    sublabel: 'Verified & actively hiring',
    trend: '+48 this month',
    color: '#8B5CF6',
    gradFrom: '#8B5CF6',
    gradTo: '#A855F7',
    border: '#DDD6FE',
    bg_char: '500',
    display: '500+',
  },
  {
    icon: Award,
    numeric: 95,
    prefix: '',
    suffix: '%',
    label: 'Hiring Success Rate',
    sublabel: 'Candidates placed successfully',
    trend: 'Industry best',
    color: '#F59E0B',
    gradFrom: '#F59E0B',
    gradTo: '#EF4444',
    border: '#FDE68A',
    bg_char: '95%',
    display: '95%',
  },
]

const miniMetrics = [
  { icon: Clock,    label: 'Avg. Time to Hire',   value: '5 Days',    color: '#2563EB' },
  { icon: MapPin,   label: 'Cities Covered',       value: '50+',       color: '#14B8A6' },
  { icon: Star,     label: 'Platform Rating',       value: '4.9 / 5',  color: '#F59E0B' },
  { icon: Globe,    label: 'Remote Roles',           value: '12,400+',  color: '#8B5CF6' },
  { icon: CheckCircle2, label: 'Verified Listings', value: '100%',     color: '#22C55E' },
  { icon: Sparkles, label: 'AI Match Accuracy',     value: '98%',      color: '#EF4444' },
]

/* ─── StatisticsSection ──────────────────────────────────────────── */
const StatisticsSection = () => {
  const [started, setStarted] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true) },
      { threshold: 0.15 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={ref}
      className="relative py-24 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #0F172A 0%, #1E293B 60%, #0F172A 100%)' }}
    >
      <style>{`
        @keyframes shineSweep {
          0%   { left: -100%; }
          100% { left: 200%; }
        }
        @keyframes pulseRing {
          0%   { transform: scale(1);   opacity: 0.6; }
          100% { transform: scale(1.35); opacity: 0; }
        }
        @keyframes floatUp {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-8px); }
        }
        @keyframes rotateSlow {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>

      {/* ── Background layer ── */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Grid lines */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(#FFFFFF 1px, transparent 1px),
              linear-gradient(90deg, #FFFFFF 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />
        {/* Glow orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle,#2563EB,transparent)', filter: 'blur(60px)' }} />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle,#14B8A6,transparent)', filter: 'blur(60px)' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-5"
          style={{ background: 'radial-gradient(circle,#8B5CF6,transparent)', filter: 'blur(80px)' }} />

        {/* Rotating ring decoration */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full border border-white/5"
          style={{ animation: 'rotateSlow 30s linear infinite' }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-white/5"
          style={{ animation: 'rotateSlow 20s linear infinite reverse' }}
        />

        {/* Floating particles */}
        {[
          { top: '15%', left: '8%',  size: 4, color: '#2563EB', delay: '0s' },
          { top: '25%', right: '12%', size: 3, color: '#14B8A6', delay: '0.8s' },
          { top: '60%', left: '5%',  size: 5, color: '#8B5CF6', delay: '1.4s' },
          { top: '70%', right: '8%', size: 3, color: '#F59E0B', delay: '0.4s' },
          { top: '45%', left: '20%', size: 2, color: '#FFFFFF', delay: '1s' },
          { top: '35%', right: '20%', size: 2, color: '#FFFFFF', delay: '1.8s' },
        ].map((p, i) => (
          <div
            key={i}
            className="absolute rounded-full opacity-60"
            style={{
              top: p.top, left: p.left, right: p.right,
              width: p.size * 2, height: p.size * 2,
              background: p.color,
              animation: `floatUp 3s ease-in-out ${p.delay} infinite`,
              boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10">

        {/* ── Header ── */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 border text-blue-300 text-xs font-semibold px-4 py-1.5 rounded-full mb-4"
            style={{ borderColor: '#2563EB50', background: '#2563EB15' }}>
            <Sparkles size={12} className="text-blue-400" />
            Platform by the Numbers
          </div>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight mb-3"
            style={{
              fontFamily: "'Outfit', sans-serif",
              letterSpacing: '-0.03em',
              background: 'linear-gradient(135deg, #FFFFFF 0%, #94A3B8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Numbers That{' '}
            <span style={{
              background: 'linear-gradient(135deg, #2563EB, #14B8A6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Prove Our Impact
            </span>
          </h2>
          <p className="text-slate-400 text-sm max-w-lg mx-auto leading-relaxed">
            Every number represents a real person whose career moved forward. Here's the scale we've reached together.
          </p>
        </div>

        {/* ── Main counter grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
          {stats.map((stat, i) => (
            <StatCard key={stat.label} stat={stat} started={started} index={i} />
          ))}
        </div>

        {/* ── Divider ── */}
        <div className="flex items-center gap-4 mb-10">
          <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg,transparent,#FFFFFF15)' }} />
          <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold tracking-widest uppercase">
            <Star size={12} className="text-amber-400" fill="#F59E0B" />
            More Platform Highlights
            <Star size={12} className="text-amber-400" fill="#F59E0B" />
          </div>
          <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg,#FFFFFF15,transparent)' }} />
        </div>

        {/* ── Mini metrics ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-14">
          {miniMetrics.map(m => (
            <MiniMetric key={m.label} {...m} />
          ))}
        </div>

        {/* ── Progress bars ── */}
        <div
          className="rounded-2xl p-7 mb-12"
          style={{ background: '#FFFFFF08', border: '1px solid #FFFFFF10', backdropFilter: 'blur(8px)' }}
        >
          <h3
            className="text-white text-base font-bold mb-6"
            style={{ fontFamily: "'Outfit',sans-serif" }}
          >
            Industry Breakdown
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[
              { label: 'Technology & IT',        pct: 38, color: '#2563EB' },
              { label: 'Finance & Banking',       pct: 22, color: '#14B8A6' },
              { label: 'Healthcare',              pct: 18, color: '#22C55E' },
              { label: 'Sales & Marketing',       pct: 14, color: '#F59E0B' },
              { label: 'Design & Creative',       pct: 11, color: '#8B5CF6' },
              { label: 'Operations & Logistics',  pct: 9,  color: '#EF4444' },
            ].map(bar => (
              <div key={bar.label}>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-slate-300 text-xs font-medium">{bar.label}</span>
                  <span className="text-xs font-bold" style={{ color: bar.color }}>{bar.pct}%</span>
                </div>
                <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{
                      width: started ? `${bar.pct}%` : '0%',
                      background: `linear-gradient(90deg, ${bar.color}, ${bar.color}80)`,
                      boxShadow: `0 0 8px ${bar.color}60`,
                      transitionDelay: '0.3s',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── CTA strip ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 rounded-2xl px-8 py-6"
          style={{
            background: 'linear-gradient(135deg,#1E40AF30,#0D948830)',
            border: '1px solid #2563EB40',
            backdropFilter: 'blur(8px)',
          }}
        >
          <div className="text-center sm:text-left">
            <p className="text-white font-bold text-lg" style={{ fontFamily: "'Outfit',sans-serif" }}>
              Be Part of the Next Success Story
            </p>
            <p className="text-slate-400 text-sm mt-0.5">
              Join 30,000+ candidates already on their journey.
            </p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <button
              className="flex items-center gap-2 px-7 py-3 font-bold text-sm rounded-xl text-white transition-all duration-200 hover:-translate-y-0.5"
              style={{
                background: 'linear-gradient(135deg,#2563EB,#1D4ED8)',
                boxShadow: '0 4px 18px rgba(37,99,235,0.45)',
                fontFamily: "'Outfit',sans-serif",
              }}
            >
              Get Started Free <ArrowRight size={15} />
            </button>
            <button
              className="flex items-center gap-2 px-7 py-3 font-bold text-sm rounded-xl transition-all duration-200 hover:-translate-y-0.5"
              style={{
                color: '#FFFFFF',
                border: '1.5px solid #FFFFFF30',
                background: '#FFFFFF08',
                fontFamily: "'Outfit',sans-serif",
              }}
            >
              Browse Jobs <ArrowRight size={15} />
            </button>
          </div>
        </div>

      </div>
    </section>
  )
}

export default StatisticsSection