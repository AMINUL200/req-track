import React, { useState } from 'react'
import { Search, MousePointerClick, CalendarCheck, PartyPopper, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react'

const steps = [
  {
    step: '01',
    icon: Search,
    title: 'Search Jobs',
    description: 'Browse thousands of verified job openings from trusted companies. Filter by role, location, salary, and experience to find your perfect match.',
    color: '#2563EB',
    lightBg: '#EFF6FF',
    borderColor: '#BFDBFE',
    highlights: ['Smart filters', 'Verified companies', 'Real-time listings'],
    emoji: '🔍',
  },
  {
    step: '02',
    icon: MousePointerClick,
    title: 'Apply Online',
    description: 'Submit your application in just a few clicks. Upload your resume, add a cover letter, and track every application from your personal dashboard.',
    color: '#14B8A6',
    lightBg: '#F0FDFA',
    borderColor: '#99F6E4',
    highlights: ['One-click apply', 'Resume upload', 'Application tracker'],
    emoji: '📋',
  },
  {
    step: '03',
    icon: CalendarCheck,
    title: 'Attend Interview',
    description: 'Get interview invitations directly in your inbox. Choose online or in-person, prepare with company insights, and show your best self.',
    color: '#8B5CF6',
    lightBg: '#F5F3FF',
    borderColor: '#DDD6FE',
    highlights: ['Online & offline', 'Instant scheduling', 'Interview reminders'],
    emoji: '🎤',
  },
  {
    step: '04',
    icon: PartyPopper,
    title: 'Get Hired',
    description: "Receive your offer letter, review the package, and accept with confidence. Your dream job is just a few steps away — we'll celebrate with you!",
    color: '#F59E0B',
    lightBg: '#FFFBEB',
    borderColor: '#FDE68A',
    highlights: ['Offer management', 'Package insights', 'Onboarding support'],
    emoji: '🎉',
  },
]

const HowItWorkSection = () => {
  const [activeStep, setActiveStep] = useState(null)

  return (
    <section className="relative py-24 overflow-hidden" style={{ background: '#F8FAFC' }}>

      {/* ── decorative background shapes ── */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg,transparent,#BFDBFE,transparent)' }} />
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle,#DBEAFE,transparent)' }} />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle,#CCFBF1,transparent)' }} />
        {/* dotted grid */}
        <svg className="absolute top-10 left-10 opacity-30" width="160" height="160">
          {Array.from({ length: 6 }).map((_, r) =>
            Array.from({ length: 6 }).map((_, c) => (
              <circle key={`${r}-${c}`} cx={c * 28 + 6} cy={r * 28 + 6} r="2" fill="#CBD5E1" />
            ))
          )}
        </svg>
        <svg className="absolute bottom-10 right-10 opacity-30" width="160" height="160">
          {Array.from({ length: 6 }).map((_, r) =>
            Array.from({ length: 6 }).map((_, c) => (
              <circle key={`${r}-${c}`} cx={c * 28 + 6} cy={r * 28 + 6} r="2" fill="#CBD5E1" />
            ))
          )}
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10">

        {/* ── Section Header ── */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold px-4 py-1.5 rounded-full mb-4">
            <Sparkles size={12} className="text-blue-500" />
            Simple & Fast Process
          </div>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight"
            style={{ letterSpacing: '-0.03em', fontFamily: "'Outfit', sans-serif" }}
          >
            How It{' '}
            <span style={{
              background: 'linear-gradient(135deg,#2563EB 0%,#14B8A6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Works
            </span>
          </h2>
          <p className="text-slate-500 text-base mt-3 max-w-xl mx-auto leading-relaxed">
            Land your dream job in four simple steps. Thousands of candidates have already found their perfect role.
          </p>
        </div>

        {/* ── Steps Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">

          {/* Connector line (desktop only) */}
          <div className="hidden lg:block absolute top-14 left-[12.5%] right-[12.5%] h-px z-0"
            style={{ background: 'linear-gradient(90deg,#BFDBFE,#99F6E4,#DDD6FE,#FDE68A)', opacity: 0.7 }} />

          {steps.map((s, i) => {
            const Icon = s.icon
            const isActive = activeStep === i

            return (
              <div
                key={s.step}
                onClick={() => setActiveStep(isActive ? null : i)}
                className="relative z-10 flex flex-col gap-5 rounded-2xl border p-6 cursor-pointer transition-all duration-300 group"
                style={{
                  background: isActive ? s.lightBg : '#FFFFFF',
                  borderColor: isActive ? s.borderColor : '#E2E8F0',
                  boxShadow: isActive
                    ? `0 8px 32px ${s.color}18, 0 2px 8px rgba(0,0,0,0.04)`
                    : '0 2px 12px rgba(0,0,0,0.04)',
                  transform: isActive ? 'translateY(-6px)' : undefined,
                }}
              >
                {/* Step number + icon */}
                <div className="flex items-start justify-between">
                  {/* Icon circle */}
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-300"
                    style={{
                      background: isActive ? s.color : s.lightBg,
                      boxShadow: isActive ? `0 6px 20px ${s.color}40` : 'none',
                    }}
                  >
                    <Icon
                      size={24}
                      style={{ color: isActive ? '#FFFFFF' : s.color }}
                      strokeWidth={2}
                    />
                  </div>

                  {/* Step badge */}
                  <span
                    className="text-xs font-black px-2.5 py-1 rounded-lg tracking-widest"
                    style={{
                      background: s.lightBg,
                      color: s.color,
                      fontFamily: "'Outfit', sans-serif",
                    }}
                  >
                    {s.step}
                  </span>
                </div>

                {/* Emoji (fun visual accent) */}
                <div className="text-3xl select-none"
                  style={{ filter: isActive ? 'none' : 'grayscale(30%)' }}>
                  {s.emoji}
                </div>

                {/* Text */}
                <div>
                  <h3
                    className="text-lg font-bold mb-1.5 transition-colors"
                    style={{
                      color: isActive ? s.color : '#0F172A',
                      fontFamily: "'Outfit', sans-serif",
                    }}
                  >
                    {s.title}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    {s.description}
                  </p>
                </div>

                {/* Highlight bullets — shown when active */}
                <div
                  className="flex flex-col gap-1.5 overflow-hidden transition-all duration-300"
                  style={{ maxHeight: isActive ? '120px' : '0', opacity: isActive ? 1 : 0 }}
                >
                  {s.highlights.map(h => (
                    <div key={h} className="flex items-center gap-2">
                      <CheckCircle2 size={13} style={{ color: s.color }} />
                      <span className="text-xs font-semibold" style={{ color: s.color }}>
                        {h}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Arrow indicator */}
                <div className="mt-auto pt-2 flex items-center gap-1.5 text-xs font-semibold transition-all"
                  style={{ color: s.color, opacity: isActive ? 1 : 0.5 }}>
                  {isActive ? 'Less info' : 'Learn more'}
                  <ArrowRight size={13} className={`transition-transform duration-200 ${isActive ? 'rotate-90' : ''}`} />
                </div>

                {/* Bottom accent bar */}
                <div
                  className="absolute bottom-0 left-6 right-6 h-0.5 rounded-full transition-all duration-300"
                  style={{
                    background: `linear-gradient(90deg, ${s.color}, transparent)`,
                    opacity: isActive ? 1 : 0,
                  }}
                />
              </div>
            )
          })}
        </div>

        {/* ── Progress indicator (mobile-friendly) ── */}
        <div className="flex items-center justify-center gap-2 mt-10 lg:hidden">
          {steps.map((s, i) => (
            <button
              key={i}
              onClick={() => setActiveStep(activeStep === i ? null : i)}
              className="transition-all duration-200 rounded-full"
              style={{
                width: activeStep === i ? '28px' : '8px',
                height: '8px',
                background: activeStep === i ? s.color : '#CBD5E1',
              }}
            />
          ))}
        </div>

        {/* ── Bottom CTA row ── */}
        <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            className="flex items-center gap-2 px-8 py-3.5 text-white font-bold text-sm rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
            style={{
              background: 'linear-gradient(135deg,#2563EB,#1D4ED8)',
              boxShadow: '0 4px 18px rgba(37,99,235,0.35)',
              fontFamily: "'Outfit', sans-serif",
            }}
            onMouseOver={e => e.currentTarget.style.transform = 'translateY(-1px)'}
            onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            Start Job Search <ArrowRight size={16} />
          </button>
          <button
            className="flex items-center gap-2 px-8 py-3.5 font-bold text-sm rounded-xl border-2 transition-all duration-200"
            style={{
              color: '#2563EB',
              borderColor: '#BFDBFE',
              background: '#EFF6FF',
              fontFamily: "'Outfit', sans-serif",
            }}
            onMouseOver={e => {
              e.currentTarget.style.background = '#DBEAFE'
              e.currentTarget.style.borderColor = '#2563EB'
            }}
            onMouseOut={e => {
              e.currentTarget.style.background = '#EFF6FF'
              e.currentTarget.style.borderColor = '#BFDBFE'
            }}
          >
            View All Jobs <ArrowRight size={16} />
          </button>
        </div>

        {/* ── Trust strip ── */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-medium">
          {['Free to use', 'No hidden charges', '500+ companies hiring', 'Verified job listings'].map(t => (
            <div key={t} className="flex items-center gap-1.5">
              <CheckCircle2 size={13} className="text-teal-500" />
              {t}
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}

export default HowItWorkSection