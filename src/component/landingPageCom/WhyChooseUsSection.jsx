import React, { useState, useEffect, useRef } from 'react'
import {
  Building2, Users, Trophy, Rocket, ShieldCheck, HeartHandshake,
  Clock, Globe, Star, TrendingUp, CheckCircle2, ArrowRight, Sparkles, Zap
} from 'lucide-react'

/* ─── Animated Counter Hook ─────────────────────────────────────────── */
const useCountUp = (target, duration = 2000, start = false) => {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!start) return
    let startTime = null
    const numeric = parseInt(target.replace(/\D/g, ''))
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * numeric))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [start, target, duration])

  const suffix = target.replace(/[0-9]/g, '')
  return count.toLocaleString() + suffix
}

/* ─── Stat Counter Card ───────────────────────────────────────────────── */
const StatCard = ({ stat, started }) => {
  const Icon = stat.icon
  const display = useCountUp(stat.rawValue, 2200, started)

  return (
    <div
      className="relative flex flex-col items-center justify-center gap-3 rounded-2xl p-8 text-center overflow-hidden transition-all duration-300 group hover:-translate-y-2"
      style={{
        background: '#FFFFFF',
        border: `1.5px solid ${stat.borderColor}`,
        boxShadow: `0 4px 24px ${stat.color}12`,
      }}
    >
      {/* Glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
        style={{ background: `radial-gradient(circle at 50% 0%, ${stat.color}10, transparent 70%)` }}
      />

      {/* Top accent line */}
      <div className="absolute top-0 left-8 right-8 h-0.5 rounded-full"
        style={{ background: `linear-gradient(90deg, transparent, ${stat.color}, transparent)` }} />

      {/* Icon */}
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
        style={{
          background: `linear-gradient(135deg, ${stat.color}18, ${stat.color}08)`,
          border: `1.5px solid ${stat.borderColor}`,
          boxShadow: `0 4px 16px ${stat.color}20`,
        }}
      >
        <Icon size={28} style={{ color: stat.color }} strokeWidth={1.8} />
      </div>

      {/* Counter */}
      <div>
        <div
          className="text-4xl font-black leading-none mb-1"
          style={{ color: stat.color, fontFamily: "'Outfit', sans-serif", letterSpacing: '-0.03em' }}
        >
          {display}
        </div>
        <div className="text-sm font-bold text-slate-700" style={{ fontFamily: "'Outfit', sans-serif" }}>
          {stat.label}
        </div>
        <div className="text-xs text-slate-400 mt-1 font-medium">{stat.sublabel}</div>
      </div>

      {/* Trend badge */}
      <div
        className="flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full"
        style={{ background: stat.badgeBg, color: stat.color }}
      >
        <TrendingUp size={11} />
        {stat.trend}
      </div>
    </div>
  )
}

/* ─── Benefit Card ──────────────────────────────────────────────────── */
const BenefitCard = ({ benefit, index }) => {
  const Icon = benefit.icon
  return (
    <div
      className="flex gap-4 items-start p-5 rounded-2xl border transition-all duration-300 hover:-translate-y-1 group"
      style={{
        background: '#FFFFFF',
        borderColor: '#E2E8F0',
        boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
        animationDelay: `${index * 60}ms`,
      }}
    >
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110"
        style={{
          background: `linear-gradient(135deg, ${benefit.color}15, ${benefit.color}08)`,
          border: `1px solid ${benefit.color}25`,
        }}
      >
        <Icon size={20} style={{ color: benefit.color }} strokeWidth={2} />
      </div>
      <div>
        <h4
          className="text-sm font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors"
          style={{ fontFamily: "'Outfit', sans-serif" }}
        >
          {benefit.title}
        </h4>
        <p className="text-xs text-slate-500 leading-relaxed">{benefit.desc}</p>
      </div>
    </div>
  )
}

/* ─── Data ─────────────────────────────────────────────────────────── */
const stats = [
  {
    icon: Building2,
    rawValue: '500+',
    label: 'Partner Companies',
    sublabel: 'Verified & actively hiring',
    trend: '+48 this month',
    color: '#2563EB',
    borderColor: '#BFDBFE',
    badgeBg: '#EFF6FF',
  },
  {
    icon: Users,
    rawValue: '20000+',
    label: 'Registered Candidates',
    sublabel: 'From across India',
    trend: '+1.2K this week',
    color: '#14B8A6',
    borderColor: '#99F6E4',
    badgeBg: '#F0FDFA',
  },
  {
    icon: Trophy,
    rawValue: '10000+',
    label: 'Successful Placements',
    sublabel: 'Dreams fulfilled',
    trend: '+320 this month',
    color: '#F59E0B',
    borderColor: '#FDE68A',
    badgeBg: '#FFFBEB',
  },
  {
    icon: Star,
    rawValue: '4.9',
    label: 'Average Rating',
    sublabel: 'Rated by candidates',
    trend: 'Top 1% platforms',
    color: '#8B5CF6',
    borderColor: '#DDD6FE',
    badgeBg: '#F5F3FF',
  },
]

const benefits = [
  {
    icon: Rocket,
    title: 'Fast & Streamlined Hiring',
    desc: 'From application to offer in under 5 days. Our automated workflows eliminate bottlenecks.',
    color: '#2563EB',
  },
  {
    icon: ShieldCheck,
    title: 'Only Verified Employers',
    desc: 'Every company is background-checked. No fake listings, no wasted effort.',
    color: '#22C55E',
  },
  {
    icon: HeartHandshake,
    title: 'Dedicated Support',
    desc: 'Our recruiter team is available to guide candidates and employers at every step.',
    color: '#14B8A6',
  },
  {
    icon: Globe,
    title: 'Pan-India Reach',
    desc: 'Opportunities across 50+ cities and remote roles from 500+ companies nationwide.',
    color: '#8B5CF6',
  },
  {
    icon: Clock,
    title: '24/7 Application Access',
    desc: 'Apply anytime, track your pipeline, and get real-time updates around the clock.',
    color: '#F59E0B',
  },
  {
    icon: Zap,
    title: 'AI-Powered Matching',
    desc: 'Smart algorithms match your profile to the right roles before you even search.',
    color: '#EF4444',
  },
]

const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'Frontend Developer @ TechNova',
    avatar: 'PS',
    color: '#2563EB',
    text: 'Got placed within 8 days of signing up. The application tracker made the whole process stress-free.',
    rating: 5,
  },
  {
    name: 'Rahul Menon',
    role: 'Product Manager @ GrowthStack',
    avatar: 'RM',
    color: '#14B8A6',
    text: 'The AI matching surfaced roles I hadn\'t even considered. Landed a 40% salary hike.',
    rating: 5,
  },
  {
    name: 'Ananya Bose',
    role: 'Data Analyst @ InsightBridge',
    avatar: 'AB',
    color: '#8B5CF6',
    text: 'Verified employers gave me confidence. Every interview I attended was with a genuine company.',
    rating: 5,
  },
]

/* ─── WhyChooseUsSection ─────────────────────────────────────────────── */
const WhyChooseUsSection = () => {
  const [started, setStarted] = useState(false)
  const sectionRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true) },
      { threshold: 0.2 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="relative py-24 overflow-hidden" style={{ background: '#F8FAFC' }}>

      {/* ── Background decor ── */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg,transparent,#BFDBFE,transparent)' }} />
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle,#DBEAFE,transparent)' }} />
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle,#CCFBF1,transparent)' }} />
        {/* Large faint text watermark */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[200px] font-black text-slate-100 select-none pointer-events-none whitespace-nowrap"
          style={{ fontFamily: "'Outfit',sans-serif", letterSpacing: '-0.05em', lineHeight: 1 }}
        >
          #1
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10">

        {/* ── Section Header ── */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold px-4 py-1.5 rounded-full mb-4">
            <Sparkles size={12} className="text-blue-500" />
            Trusted by Thousands
          </div>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight"
            style={{ letterSpacing: '-0.03em', fontFamily: "'Outfit', sans-serif" }}
          >
            Why{' '}
            <span style={{
              background: 'linear-gradient(135deg,#2563EB 0%,#14B8A6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              10,000+ Candidates
            </span>{' '}
            <br className="hidden sm:block" />
            Choose ReqTrack
          </h2>
          <p className="text-slate-500 text-base mt-3 max-w-xl mx-auto leading-relaxed">
            Numbers speak louder than words. Here's what we've achieved together — and we're just getting started.
          </p>
        </div>

        {/* ── Stats counters ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
          {stats.map((stat, i) => (
            <StatCard key={stat.label} stat={stat} started={started} />
          ))}
        </div>

        {/* ── Two-col: benefits + visual ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">

          {/* Left — benefits grid */}
          <div>
            <div className="mb-6">
              <h3
                className="text-2xl font-extrabold text-slate-900 mb-2"
                style={{ fontFamily: "'Outfit',sans-serif", letterSpacing: '-0.02em' }}
              >
                Built Different. Built Better.
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                ReqTrack isn't just another job board. It's a full-stack recruitment engine designed to give candidates and companies a genuine edge.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {benefits.map((b, i) => (
                <BenefitCard key={b.title} benefit={b} index={i} />
              ))}
            </div>
          </div>

          {/* Right — visual card stack */}
          <div className="relative flex items-center justify-center min-h-[420px]">

            {/* Background circle */}
            <div
              className="absolute w-72 h-72 rounded-full"
              style={{ background: 'linear-gradient(135deg,#EFF6FF,#F0FDFA)', border: '1.5px solid #BFDBFE' }}
            />

            {/* Center main card */}
            <div
              className="relative z-10 bg-white rounded-2xl p-6 w-64 text-center"
              style={{ boxShadow: '0 16px 48px rgba(37,99,235,0.15)', border: '1.5px solid #BFDBFE' }}
            >
              <div
                className="w-14 h-14 rounded-2xl mx-auto mb-3 flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg,#2563EB,#14B8A6)' }}
              >
                <Trophy size={26} className="text-white" />
              </div>
              <div className="text-3xl font-black text-slate-900 mb-0.5" style={{ fontFamily: "'Outfit',sans-serif" }}>
                #1 Platform
              </div>
              <div className="text-xs text-slate-500 font-medium mb-3">For Recruitment in India</div>
              <div className="flex justify-center gap-0.5 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill="#F59E0B" className="text-amber-400" />
                ))}
              </div>
              <div className="text-xs text-slate-400">Based on 8,200+ reviews</div>
            </div>

            {/* Floating mini cards */}
            {[
              { top: '5%',  left: '-8%',  icon: Users,    val: '20K+', sub: 'Candidates', color: '#14B8A6', bg: '#F0FDFA', border: '#99F6E4' },
              { top: '5%',  right: '-8%', icon: Building2, val: '500+', sub: 'Companies',  color: '#2563EB', bg: '#EFF6FF', border: '#BFDBFE' },
              { bottom: '8%', left: '-5%', icon: Clock,   val: '5 days', sub: 'Avg. Hire', color: '#8B5CF6', bg: '#F5F3FF', border: '#DDD6FE' },
              { bottom: '8%', right: '-5%', icon: Trophy, val: '10K+', sub: 'Placed',     color: '#F59E0B', bg: '#FFFBEB', border: '#FDE68A' },
            ].map((fc, i) => {
              const Ic = fc.icon
              return (
                <div
                  key={i}
                  className="absolute flex items-center gap-2.5 bg-white rounded-xl px-3.5 py-2.5 z-20"
                  style={{
                    top: fc.top, left: fc.left, right: fc.right, bottom: fc.bottom,
                    border: `1.5px solid ${fc.border}`,
                    boxShadow: `0 4px 16px ${fc.color}18`,
                    animation: `floatBob${i % 2 === 0 ? 'A' : 'B'} 3s ease-in-out infinite`,
                    animationDelay: `${i * 0.6}s`,
                  }}
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: fc.bg }}>
                    <Ic size={16} style={{ color: fc.color }} />
                  </div>
                  <div>
                    <div className="text-sm font-black text-slate-900 leading-none" style={{ fontFamily: "'Outfit',sans-serif" }}>
                      {fc.val}
                    </div>
                    <div className="text-[10px] text-slate-400 font-medium">{fc.sub}</div>
                  </div>
                </div>
              )
            })}

            <style>{`
              @keyframes floatBobA { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
              @keyframes floatBobB { 0%,100%{transform:translateY(0)} 50%{transform:translateY(8px)} }
            `}</style>
          </div>
        </div>

        {/* ── Testimonials ── */}
        <div className="mb-16">
          <h3
            className="text-center text-xl font-extrabold text-slate-900 mb-8"
            style={{ fontFamily: "'Outfit',sans-serif" }}
          >
            What Candidates Are Saying
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {testimonials.map(t => (
              <div
                key={t.name}
                className="bg-white rounded-2xl p-5 border border-slate-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}
              >
                <div className="flex gap-0.5 mb-3">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} size={13} fill="#F59E0B" className="text-amber-400" />
                  ))}
                </div>
                <p className="text-slate-600 text-sm leading-relaxed mb-4">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-black flex-shrink-0"
                    style={{ background: `linear-gradient(135deg,${t.color},${t.color}99)` }}
                  >
                    {t.avatar}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900" style={{ fontFamily: "'Outfit',sans-serif" }}>
                      {t.name}
                    </div>
                    <div className="text-xs text-slate-400">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Bottom CTA ── */}
        <div
          className="relative rounded-2xl overflow-hidden px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left"
          style={{ background: 'linear-gradient(135deg,#0F172A 0%,#1E3A5F 50%,#0D9488 100%)' }}
        >
          <div className="absolute right-0 top-0 w-64 h-64 rounded-full opacity-10 -translate-y-1/3 translate-x-1/4 bg-white pointer-events-none" />
          <div className="absolute left-1/3 bottom-0 w-40 h-40 rounded-full opacity-10 translate-y-1/2 bg-white pointer-events-none" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 justify-center sm:justify-start mb-2">
              <CheckCircle2 size={16} className="text-teal-400" />
              <span className="text-teal-300 text-xs font-semibold tracking-wide uppercase">Free to join</span>
            </div>
            <h3
              className="text-white text-2xl font-extrabold mb-1"
              style={{ fontFamily: "'Outfit',sans-serif" }}
            >
              Ready to Find Your Dream Job?
            </h3>
            <p className="text-slate-300 text-sm">
              Create your free profile today and start getting matched instantly.
            </p>
          </div>
          <div className="relative z-10 flex flex-col sm:flex-row gap-3 flex-shrink-0">
            <button
              className="flex items-center gap-2 px-7 py-3 font-bold text-sm rounded-xl text-blue-700 bg-white hover:bg-blue-50 transition-all"
              style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.2)', fontFamily: "'Outfit',sans-serif" }}
            >
              Get Started Free <ArrowRight size={15} />
            </button>
            <button
              className="flex items-center gap-2 px-7 py-3 font-bold text-sm rounded-xl text-white border-2 border-white/30 hover:border-white/60 hover:bg-white/10 transition-all"
              style={{ fontFamily: "'Outfit',sans-serif" }}
            >
              Browse Jobs <ArrowRight size={15} />
            </button>
          </div>
        </div>

      </div>
    </section>
  )
}

export default WhyChooseUsSection