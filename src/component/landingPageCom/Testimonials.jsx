import React, { useState, useEffect, useRef, useCallback } from 'react'
import {
  Star, Quote, ChevronLeft, ChevronRight,
  Sparkles, ArrowRight, CheckCircle2, Briefcase,
  Building2, MapPin, Play, Pause
} from 'lucide-react'

/* ─── Data ───────────────────────────────────────────────────────── */
const testimonials = [
  {
    id: 1,
    name: 'Rahul Sharma',
    role: 'Software Engineer',
    company: 'TechNova Inc.',
    location: 'Bangalore',
    avatar: 'RS',
    avatarColor: '#2563EB',
    avatarGrad: ['#2563EB', '#6366F1'],
    rating: 5,
    category: 'Candidate',
    categoryColor: '#2563EB',
    categoryBg: '#EFF6FF',
    timeToHire: '2 weeks',
    salaryHike: '45%',
    quote:
      'ReqTrack helped me find my dream job in just 2 weeks. The AI matching surfaced roles I hadn\'t even considered. The application tracker kept me stress-free throughout the process.',
    highlight: 'Hired in 2 weeks',
    highlightColor: '#22C55E',
  },
  {
    id: 2,
    name: 'Priya Menon',
    role: 'Product Manager',
    company: 'GrowthStack Solutions',
    location: 'Mumbai',
    avatar: 'PM',
    avatarColor: '#14B8A6',
    avatarGrad: ['#14B8A6', '#06B6D4'],
    rating: 5,
    category: 'Candidate',
    categoryColor: '#14B8A6',
    categoryBg: '#F0FDFA',
    timeToHire: '8 days',
    salaryHike: '40%',
    quote:
      'From first application to offer letter in 8 days — I couldn\'t believe it. Every employer on the platform is verified, so every interview I attended was with a genuine company. Absolutely worth it.',
    highlight: '40% salary hike',
    highlightColor: '#14B8A6',
  },
  {
    id: 3,
    name: 'Ananya Bose',
    role: 'HR Manager',
    company: 'InsightBridge Analytics',
    location: 'Hyderabad',
    avatar: 'AB',
    avatarColor: '#8B5CF6',
    avatarGrad: ['#8B5CF6', '#A855F7'],
    rating: 5,
    category: 'Recruiter',
    categoryColor: '#8B5CF6',
    categoryBg: '#F5F3FF',
    timeToHire: '5 days',
    salaryHike: null,
    quote:
      'As a recruiter, ReqTrack has completely transformed our hiring pipeline. We filled 12 positions in a single month. The candidate profiles are detailed and the interview scheduling tool saves us hours every week.',
    highlight: '12 hires in 1 month',
    highlightColor: '#8B5CF6',
  },
  {
    id: 4,
    name: 'Vikram Nair',
    role: 'DevOps Engineer',
    company: 'CloudNine Infrastructure',
    location: 'Chennai',
    avatar: 'VN',
    avatarColor: '#F59E0B',
    avatarGrad: ['#F59E0B', '#EF4444'],
    rating: 5,
    category: 'Candidate',
    categoryColor: '#F59E0B',
    categoryBg: '#FFFBEB',
    timeToHire: '12 days',
    salaryHike: '52%',
    quote:
      'I had been job hunting for months with no luck on other platforms. ReqTrack\'s smart filters and verified employer badge gave me confidence. Landed my best role yet with a 52% salary hike.',
    highlight: '52% salary hike',
    highlightColor: '#F59E0B',
  },
  {
    id: 5,
    name: 'Sneha Kulkarni',
    role: 'UI/UX Designer',
    company: 'PixelForge Studios',
    location: 'Pune',
    avatar: 'SK',
    avatarColor: '#EF4444',
    avatarGrad: ['#EF4444', '#F59E0B'],
    rating: 5,
    category: 'Candidate',
    categoryColor: '#EF4444',
    categoryBg: '#FEF2F2',
    timeToHire: '6 days',
    salaryHike: '38%',
    quote:
      'The platform is beautifully designed and incredibly easy to use. I applied to 5 jobs, got 4 interview calls, and accepted an offer in under a week. ReqTrack genuinely cares about candidates.',
    highlight: 'Hired in 6 days',
    highlightColor: '#EF4444',
  },
  {
    id: 6,
    name: 'Arjun Das',
    role: 'Talent Acquisition Lead',
    company: 'Nexus Platforms',
    location: 'Delhi',
    avatar: 'AD',
    avatarColor: '#22C55E',
    avatarGrad: ['#22C55E', '#14B8A6'],
    rating: 5,
    category: 'Recruiter',
    categoryColor: '#22C55E',
    categoryBg: '#F0FDF4',
    timeToHire: null,
    salaryHike: null,
    quote:
      'We\'ve tried five different ATS tools over the years. ReqTrack is the first one our entire team actually loves using. The candidate pipeline view is brilliant and follow-up automation saves us 3+ hours daily.',
    highlight: '3h saved daily',
    highlightColor: '#22C55E',
  },
]

/* ─── StarRating ─────────────────────────────────────────────────── */
const StarRating = ({ rating, color }) => (
  <div className="flex gap-0.5">
    {[...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={14}
        fill={i < rating ? color : 'transparent'}
        style={{ color: i < rating ? color : '#CBD5E1' }}
      />
    ))}
  </div>
)

/* ─── TestimonialCard ────────────────────────────────────────────── */
const TestimonialCard = ({ t, isCenter, isLeft, isRight }) => {
  const scale    = isCenter ? 'scale-100 opacity-100 z-20' : 'scale-90 opacity-50 z-10'
  const translate = isLeft   ? '-translate-x-4' : isRight ? 'translate-x-4' : ''

  return (
    <div
      className={`relative flex-shrink-0 transition-all duration-500 ease-out ${scale} ${translate}`}
      style={{ width: '100%', maxWidth: isCenter ? '680px' : '520px' }}
    >
      <div
        className="relative rounded-3xl p-8 overflow-hidden"
        style={{
          background: isCenter ? '#FFFFFF' : '#F8FAFC',
          border: isCenter ? `1.5px solid ${t.avatarColor}30` : '1.5px solid #E2E8F0',
          boxShadow: isCenter
            ? `0 24px 64px ${t.avatarColor}18, 0 4px 16px rgba(0,0,0,0.06)`
            : '0 4px 16px rgba(0,0,0,0.04)',
        }}
      >
        {/* Glow bg */}
        {isCenter && (
          <div
            className="absolute inset-0 pointer-events-none rounded-3xl"
            style={{ background: `radial-gradient(ellipse at 10% 0%, ${t.avatarColor}08, transparent 60%)` }}
          />
        )}

        {/* Top accent */}
        {isCenter && (
          <div
            className="absolute top-0 left-8 right-8 h-0.5 rounded-full"
            style={{ background: `linear-gradient(90deg, transparent, ${t.avatarColor}, transparent)` }}
          />
        )}

        {/* Quote icon */}
        <div
          className="absolute top-6 right-7 opacity-10"
          style={{ color: t.avatarColor }}
        >
          <Quote size={64} fill="currentColor" />
        </div>

        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-5 relative z-10">
          <div className="flex items-center gap-3.5">
            {/* Avatar */}
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-base flex-shrink-0"
              style={{
                background: `linear-gradient(135deg, ${t.avatarGrad[0]}, ${t.avatarGrad[1]})`,
                boxShadow: `0 4px 16px ${t.avatarColor}40`,
                fontFamily: "'Outfit', sans-serif",
              }}
            >
              {t.avatar}
            </div>
            <div>
              <div className="font-bold text-slate-900 text-sm leading-snug" style={{ fontFamily: "'Outfit',sans-serif" }}>
                {t.name}
              </div>
              <div className="text-xs text-slate-500 font-medium">{t.role}</div>
              <div className="flex items-center gap-1 mt-0.5">
                <Building2 size={10} className="text-slate-400" />
                <span className="text-xs text-slate-400">{t.company}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
            <StarRating rating={t.rating} color={t.avatarColor} />
            <span
              className="text-xs font-bold px-2.5 py-0.5 rounded-full"
              style={{ background: t.categoryBg, color: t.categoryColor }}
            >
              {t.category}
            </span>
          </div>
        </div>

        {/* Quote text */}
        <blockquote
          className="text-slate-600 text-sm leading-relaxed mb-5 relative z-10"
          style={{ fontStyle: 'normal', quotes: 'none' }}
        >
          "{t.quote}"
        </blockquote>

        {/* Chips row */}
        <div className="flex flex-wrap gap-2 relative z-10">
          <div
            className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full"
            style={{ background: `${t.highlightColor}15`, color: t.highlightColor, border: `1px solid ${t.highlightColor}30` }}
          >
            <CheckCircle2 size={11} />
            {t.highlight}
          </div>
          <div className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-slate-50 text-slate-500 border border-slate-100">
            <MapPin size={10} />
            {t.location}
          </div>
          {t.timeToHire && (
            <div className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-slate-50 text-slate-500 border border-slate-100">
              <Briefcase size={10} />
              Hired in {t.timeToHire}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ─── TestimonialSlider ──────────────────────────────────────────── */
const TestimonialSlider = ({ items }) => {
  const [current, setCurrent] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const timerRef = useRef(null)
  const total = items.length

  const next = useCallback(() => setCurrent(c => (c + 1) % total), [total])
  const prev = useCallback(() => setCurrent(c => (c - 1 + total) % total), [total])

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(next, 4500)
    } else {
      clearInterval(timerRef.current)
    }
    return () => clearInterval(timerRef.current)
  }, [isPlaying, next])

  const getPos = (i) => {
    const diff = (i - current + total) % total
    if (diff === 0) return 'center'
    if (diff === 1 || diff === total - 1 + 1) return diff === 1 ? 'right' : 'left'
    return 'hidden'
  }

  return (
    <div className="relative">
      {/* Slider viewport */}
      <div className="relative flex items-center justify-center min-h-[380px] overflow-hidden px-4">

        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-24 z-30 pointer-events-none"
          style={{ background: 'linear-gradient(90deg,#F8FAFC,transparent)' }} />
        <div className="absolute right-0 top-0 bottom-0 w-24 z-30 pointer-events-none"
          style={{ background: 'linear-gradient(270deg,#F8FAFC,transparent)' }} />

        {/* Cards */}
        <div className="flex items-center justify-center gap-4 w-full">
          {items.map((t, i) => {
            const pos = getPos(i)
            if (pos === 'hidden') return null
            return (
              <TestimonialCard
                key={t.id}
                t={t}
                isCenter={pos === 'center'}
                isLeft={pos === 'left'}
                isRight={pos === 'right'}
              />
            )
          })}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-5 mt-8">
        {/* Prev */}
        <button
          onClick={prev}
          className="w-11 h-11 rounded-xl flex items-center justify-center border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
          style={{ background: '#FFFFFF', borderColor: '#E2E8F0', color: '#64748B' }}
          onMouseOver={e => { e.currentTarget.style.borderColor = '#2563EB'; e.currentTarget.style.color = '#2563EB' }}
          onMouseOut={e => { e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.color = '#64748B' }}
        >
          <ChevronLeft size={18} />
        </button>

        {/* Dots */}
        <div className="flex items-center gap-2">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className="transition-all duration-300 rounded-full"
              style={{
                width: i === current ? '28px' : '8px',
                height: '8px',
                background: i === current
                  ? `linear-gradient(90deg,${items[current].avatarGrad[0]},${items[current].avatarGrad[1]})`
                  : '#CBD5E1',
                boxShadow: i === current ? `0 0 8px ${items[current].avatarColor}60` : 'none',
              }}
            />
          ))}
        </div>

        {/* Play/pause */}
        <button
          onClick={() => setIsPlaying(p => !p)}
          className="w-11 h-11 rounded-xl flex items-center justify-center border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
          style={{
            background: isPlaying ? items[current].avatarColor : '#FFFFFF',
            borderColor: isPlaying ? items[current].avatarColor : '#E2E8F0',
            color: isPlaying ? '#FFFFFF' : '#64748B',
          }}
        >
          {isPlaying ? <Pause size={15} fill="white" /> : <Play size={15} />}
        </button>

        {/* Next */}
        <button
          onClick={next}
          className="w-11 h-11 rounded-xl flex items-center justify-center border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
          style={{ background: '#FFFFFF', borderColor: '#E2E8F0', color: '#64748B' }}
          onMouseOver={e => { e.currentTarget.style.borderColor = '#2563EB'; e.currentTarget.style.color = '#2563EB' }}
          onMouseOut={e => { e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.color = '#64748B' }}
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Progress bar */}
      <div className="mt-5 max-w-xs mx-auto h-1 rounded-full bg-slate-200 overflow-hidden">
        <div
          className="h-full rounded-full transition-none"
          style={{
            background: `linear-gradient(90deg,${items[current].avatarGrad[0]},${items[current].avatarGrad[1]})`,
            width: `${((current + 1) / total) * 100}%`,
            transition: 'width 0.4s ease',
          }}
        />
      </div>
      <p className="text-center text-xs text-slate-400 mt-2 font-medium">
        {current + 1} of {total}
      </p>
    </div>
  )
}

/* ─── Testimonials (Page Section) ───────────────────────────────── */
const Testimonials = () => {
  const ratingBreakdown = [
    { stars: 5, pct: 87, count: '7,200+' },
    { stars: 4, pct: 10, count: '830' },
    { stars: 3, pct: 2,  count: '165' },
    { stars: 2, pct: 1,  count: '83' },
  ]

  return (
    <section className="relative py-24 overflow-hidden" style={{ background: '#F8FAFC' }}>

      {/* BG decor */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg,transparent,#BFDBFE,transparent)' }} />
        <div className="absolute -top-32 right-0 w-96 h-96 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle,#DBEAFE,transparent)', filter: 'blur(60px)' }} />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle,#CCFBF1,transparent)', filter: 'blur(60px)' }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10">

        {/* ── Header ── */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold px-4 py-1.5 rounded-full mb-4">
            <Sparkles size={12} className="text-blue-500" />
            Real Stories, Real Results
          </div>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight mb-3"
            style={{ letterSpacing: '-0.03em', fontFamily: "'Outfit', sans-serif" }}
          >
            Loved by{' '}
            <span style={{
              background: 'linear-gradient(135deg,#2563EB 0%,#14B8A6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Candidates & Recruiters
            </span>
          </h2>
          <p className="text-slate-500 text-base max-w-lg mx-auto leading-relaxed">
            Don't just take our word for it. Here's what the people who use ReqTrack every day have to say.
          </p>
        </div>

        {/* ── Rating summary ── */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 mb-14">

          {/* Big score */}
          <div className="text-center">
            <div
              className="text-7xl font-black leading-none"
              style={{
                fontFamily: "'Outfit',sans-serif",
                background: 'linear-gradient(135deg,#2563EB,#14B8A6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.05em',
              }}
            >
              4.9
            </div>
            <div className="flex justify-center gap-0.5 my-1.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={18} fill="#F59E0B" className="text-amber-400" />
              ))}
            </div>
            <p className="text-slate-400 text-xs font-medium">Based on 8,200+ reviews</p>
          </div>

          {/* Divider */}
          <div className="hidden sm:block w-px h-24 bg-slate-200" />

          {/* Breakdown bars */}
          <div className="flex flex-col gap-2.5 min-w-[220px]">
            {ratingBreakdown.map(r => (
              <div key={r.stars} className="flex items-center gap-2.5">
                <div className="flex gap-0.5 flex-shrink-0">
                  {[...Array(r.stars)].map((_, i) => (
                    <Star key={i} size={11} fill="#F59E0B" className="text-amber-400" />
                  ))}
                </div>
                <div className="flex-1 h-2 rounded-full bg-slate-200 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${r.pct}%`,
                      background: 'linear-gradient(90deg,#F59E0B,#FCD34D)',
                    }}
                  />
                </div>
                <span className="text-xs text-slate-400 font-medium w-10 text-right">{r.pct}%</span>
                <span className="text-xs text-slate-300 font-medium w-12">{r.count}</span>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="hidden sm:block w-px h-24 bg-slate-200" />

          {/* Trust badges */}
          <div className="flex flex-col gap-2">
            {[
              { label: 'Verified Reviews',   color: '#22C55E' },
              { label: 'No Paid Endorsements', color: '#2563EB' },
              { label: 'Updated Monthly',    color: '#8B5CF6' },
            ].map(b => (
              <div key={b.label} className="flex items-center gap-2">
                <CheckCircle2 size={13} style={{ color: b.color }} />
                <span className="text-xs text-slate-500 font-medium">{b.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Slider ── */}
        <TestimonialSlider items={testimonials} />

        {/* ── CTA ── */}
        <div className="mt-14 text-center">
          <p className="text-slate-500 text-sm mb-5">
            Ready to write your own success story?
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
              Start Job Search <ArrowRight size={15} />
            </button>
            <button
              className="flex items-center gap-2 px-8 py-3.5 font-bold text-sm rounded-xl border-2 transition-all duration-200 hover:-translate-y-0.5"
              style={{
                color: '#2563EB',
                borderColor: '#BFDBFE',
                background: '#EFF6FF',
                fontFamily: "'Outfit',sans-serif",
              }}
            >
              Read All Reviews <ArrowRight size={15} />
            </button>
          </div>
        </div>

      </div>
    </section>
  )
}

export default Testimonials