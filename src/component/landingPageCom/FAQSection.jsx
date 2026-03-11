import React, { useState } from 'react'
import {
  ChevronDown, HelpCircle, Search, Sparkles,
  ArrowRight, MessageCircle, Mail, Phone,
  UserCheck, Wallet, LayoutDashboard, Bell,
  Briefcase, Building2, Shield, Zap, Star, X
} from 'lucide-react'

/* ─── FAQ Data ───────────────────────────────────────────────────── */
const faqCategories = [
  {
    id: 'getting-started',
    label: 'Getting Started',
    icon: UserCheck,
    color: '#2563EB',
    bg: '#EFF6FF',
    border: '#BFDBFE',
    faqs: [
      {
        q: 'How do I apply for a job on ReqTrack?',
        a: "Applying is simple! Browse or search for jobs, click on any listing you're interested in, and hit the 'Apply Now' button. Fill in your details, upload your resume, add an optional cover letter, and submit. You'll receive a confirmation instantly and can track your application from your dashboard.",
      },
      {
        q: 'Is registration free on ReqTrack?',
        a: 'Yes, absolutely! Creating a candidate account on ReqTrack is 100% free — no hidden charges, no premium tiers for job seekers. You can browse all jobs, apply to unlimited positions, and use our tracking tools without paying a single rupee.',
      },
      {
        q: 'How do I create my profile to attract recruiters?',
        a: 'After signing up, go to your profile and fill in your experience, skills, education, expected salary, and notice period. Upload a professional photo and a well-formatted resume. A complete profile gets 5× more recruiter views than an incomplete one.',
      },
      {
        q: 'Can I apply to multiple jobs at the same time?',
        a: "Yes! There's no limit on the number of jobs you can apply to simultaneously. We recommend applying to roles that genuinely match your skills and experience for a better success rate.",
      },
    ],
  },
  {
    id: 'applications',
    label: 'Applications & Tracking',
    icon: LayoutDashboard,
    color: '#14B8A6',
    bg: '#F0FDFA',
    border: '#99F6E4',
    faqs: [
      {
        q: 'Can I track my application status?',
        a: "Yes! Every application you submit appears in your personal dashboard with real-time status updates. You'll see exactly where you are in the pipeline — Applied → Shortlisted → Interview Scheduled → Offer Made — so you're never left guessing.",
      },
      {
        q: 'Can I withdraw or edit my application after submitting?',
        a: "You can withdraw an application from your dashboard at any time before an interview is scheduled. Editing after submission isn't available, but you can withdraw and reapply with updated information if the position is still open.",
      },
      {
        q: 'How long does it take to hear back from employers?',
        a: "The average response time on ReqTrack is under 24 hours for shortlisted candidates. Most hiring decisions are made within 5 business days. If you haven't heard back after 7 days, you can send a polite follow-up directly from your dashboard.",
      },
    ],
  },
  {
    id: 'interviews',
    label: 'Interviews',
    icon: Bell,
    color: '#8B5CF6',
    bg: '#F5F3FF',
    border: '#DDD6FE',
    faqs: [
      {
        q: 'How will I know my interview status?',
        a: "You'll receive an instant email and in-app notification the moment an interview is scheduled. The notification includes the date, time, mode (online or in-person), meeting link (if online), and the interviewer's name. You can also check your dashboard anytime for the latest status.",
      },
      {
        q: 'What interview modes are supported?',
        a: "ReqTrack supports all major interview formats — video calls (Google Meet, Zoom, Teams), phone screenings, and in-person interviews. The employer will specify the mode when scheduling, and you'll receive all necessary details directly.",
      },
      {
        q: 'Can I reschedule an interview?',
        a: 'Yes. If you need to reschedule, use the "Reschedule Request" button in your dashboard within 24 hours of the scheduled time. The recruiter will be notified and can offer an alternative slot. Please keep rescheduling to a minimum as it can affect your candidacy.',
      },
    ],
  },
  {
    id: 'employers',
    label: 'For Employers',
    icon: Building2,
    color: '#F59E0B',
    bg: '#FFFBEB',
    border: '#FDE68A',
    faqs: [
      {
        q: 'How do I post a job as an employer?',
        a: "Register your organization, complete verification, and go to the Requirements section. Click 'Create Requirement,' fill in the job details (title, description, skills, salary range, openings), submit for approval, and publish. Your job goes live immediately after publishing and is visible to all relevant candidates.",
      },
      {
        q: 'How are candidate profiles verified?',
        a: "Candidates provide detailed profiles with work history, skills, and contact information. Our platform cross-checks profile completeness and flags inconsistencies. Additionally, recruiters can request document verification before extending offers.",
      },
      {
        q: 'Is there a limit on how many jobs I can post?',
        a: 'This depends on your organization plan. Most verified organizations can post unlimited jobs. Contact our support team or check your organization dashboard under "Plan & Usage" for your specific limits.',
      },
    ],
  },
  {
    id: 'security',
    label: 'Privacy & Security',
    icon: Shield,
    color: '#22C55E',
    bg: '#F0FDF4',
    border: '#BBF7D0',
    faqs: [
      {
        q: 'Is my personal data safe on ReqTrack?',
        a: 'Your data security is our top priority. All data is encrypted in transit and at rest using industry-standard AES-256 encryption. We are GDPR-compliant and never sell your personal information to third parties. You have full control over your privacy settings at all times.',
      },
      {
        q: 'Can I control who sees my resume?',
        a: "Absolutely. In your privacy settings, you can choose to make your profile visible to all employers, only employers you've applied to, or completely private. You can also hide specific details like your current employer or contact information.",
      },
    ],
  },
]

/* ─── Accordion Item ─────────────────────────────────────────────── */
const AccordionItem = ({ faq, isOpen, onToggle, color, accentBg, accentBorder, index }) => (
  <div
    className="rounded-2xl border overflow-hidden transition-all duration-300"
    style={{
      borderColor: isOpen ? accentBorder : '#E2E8F0',
      background: isOpen ? accentBg : '#FFFFFF',
      boxShadow: isOpen ? `0 4px 20px ${color}12` : '0 1px 4px rgba(0,0,0,0.03)',
    }}
  >
    <button
      onClick={onToggle}
      className="w-full flex items-start gap-4 px-5 py-4 text-left group"
    >
      {/* Number badge */}
      <div
        className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black flex-shrink-0 mt-0.5 transition-all duration-200"
        style={{
          background: isOpen ? color : '#F1F5F9',
          color: isOpen ? '#FFFFFF' : '#94A3B8',
          fontFamily: "'Outfit',sans-serif",
        }}
      >
        {index + 1}
      </div>

      {/* Question */}
      <span
        className="flex-1 text-sm font-semibold leading-snug transition-colors duration-200"
        style={{
          color: isOpen ? color : '#0F172A',
          fontFamily: "'Outfit',sans-serif",
        }}
      >
        {faq.q}
      </span>

      {/* Chevron */}
      <div
        className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300"
        style={{
          background: isOpen ? color : '#F1F5F9',
          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
        }}
      >
        <ChevronDown size={14} style={{ color: isOpen ? '#FFFFFF' : '#94A3B8' }} />
      </div>
    </button>

    {/* Answer */}
    <div
      className="overflow-hidden transition-all duration-400 ease-in-out"
      style={{ maxHeight: isOpen ? '300px' : '0px' }}
    >
      <div className="px-5 pb-5 flex gap-4">
        <div className="w-6 flex-shrink-0" /> {/* spacer to align with question */}
        <p className="text-slate-500 text-sm leading-relaxed flex-1">
          {faq.a}
        </p>
      </div>
    </div>
  </div>
)

/* ─── Category Tab ───────────────────────────────────────────────── */
const CategoryTab = ({ cat, isActive, onClick }) => {
  const Icon = cat.icon
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold border transition-all duration-200 whitespace-nowrap"
      style={{
        background: isActive ? cat.color : '#FFFFFF',
        borderColor: isActive ? cat.color : '#E2E8F0',
        color: isActive ? '#FFFFFF' : '#64748B',
        boxShadow: isActive ? `0 4px 14px ${cat.color}35` : '0 1px 4px rgba(0,0,0,0.04)',
        transform: isActive ? 'translateY(-1px)' : 'translateY(0)',
        fontFamily: "'Outfit',sans-serif",
      }}
    >
      <Icon size={13} />
      {cat.label}
    </button>
  )
}

/* ─── FAQSection ─────────────────────────────────────────────────── */
const FAQSection = () => {
  const [activeCategory, setActiveCategory] = useState('getting-started')
  const [openIndex, setOpenIndex]           = useState(0)
  const [search, setSearch]                 = useState('')

  const currentCat = faqCategories.find(c => c.id === activeCategory)

  const allFaqs = faqCategories.flatMap(c =>
    c.faqs.map(f => ({ ...f, catColor: c.color, catBg: c.bg, catBorder: c.border, catLabel: c.label }))
  )

  const searchResults = search.trim().length > 1
    ? allFaqs.filter(f =>
        f.q.toLowerCase().includes(search.toLowerCase()) ||
        f.a.toLowerCase().includes(search.toLowerCase())
      )
    : []

  const isSearching = search.trim().length > 1

  return (
    <section className="relative py-24 overflow-hidden" style={{ background: '#F8FAFC' }}>

      {/* BG decor */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg,transparent,#BFDBFE,transparent)' }} />
        <div className="absolute -top-32 right-0 w-80 h-80 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle,#DBEAFE,transparent)', filter: 'blur(60px)' }} />
        <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle,#CCFBF1,transparent)', filter: 'blur(60px)' }} />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-10">

        {/* ── Header ── */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold px-4 py-1.5 rounded-full mb-4">
            <Sparkles size={12} className="text-blue-500" />
            Got Questions?
          </div>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight mb-3"
            style={{ letterSpacing: '-0.03em', fontFamily: "'Outfit', sans-serif" }}
          >
            Frequently Asked{' '}
            <span style={{
              background: 'linear-gradient(135deg,#2563EB 0%,#14B8A6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Questions
            </span>
          </h2>
          <p className="text-slate-500 text-base max-w-lg mx-auto leading-relaxed">
            Everything you need to know about using ReqTrack. Can't find an answer? Reach out to our support team.
          </p>
        </div>

        {/* ── Search ── */}
        <div className="relative mb-8 max-w-xl mx-auto">
          <div
            className="flex items-center gap-3 bg-white rounded-2xl border px-4 py-3.5 transition-all duration-200 focus-within:border-blue-500 focus-within:shadow-lg"
            style={{
              borderColor: '#E2E8F0',
              boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
            }}
          >
            <Search size={17} className="text-slate-400 flex-shrink-0" />
            <input
              className="flex-1 bg-transparent border-none outline-none text-sm text-slate-900 placeholder-slate-400"
              placeholder="Search any question..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ fontFamily: "'Outfit',sans-serif" }}
            />
            {search && (
              <button onClick={() => setSearch('')} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X size={15} />
              </button>
            )}
          </div>

          {/* Search results dropdown */}
          {isSearching && (
            <div
              className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-slate-200 overflow-hidden z-30"
              style={{ boxShadow: '0 16px 40px rgba(0,0,0,0.10)' }}
            >
              {searchResults.length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-8 text-slate-400">
                  <HelpCircle size={28} className="opacity-40" />
                  <p className="text-sm font-medium">No results found for "{search}"</p>
                  <p className="text-xs">Try different keywords</p>
                </div>
              ) : (
                <>
                  <div className="px-4 py-2.5 border-b border-slate-100 bg-slate-50">
                    <span className="text-xs font-semibold text-slate-500">
                      {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found
                    </span>
                  </div>
                  {searchResults.map((f, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        const catId = faqCategories.find(c => c.catLabel === f.catLabel || c.faqs.includes(f) || c.faqs.some(cf => cf.q === f.q))?.id
                        setSearch('')
                        if (catId) setActiveCategory(catId)
                      }}
                      className="w-full flex items-start gap-3 px-4 py-3.5 hover:bg-slate-50 text-left border-b border-slate-50 last:border-0 transition-colors"
                    >
                      <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{ background: f.catBg }}>
                        <HelpCircle size={12} style={{ color: f.catColor }} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800 mb-0.5" style={{ fontFamily: "'Outfit',sans-serif" }}>
                          {f.q}
                        </p>
                        <p className="text-xs text-slate-400 line-clamp-1">{f.a}</p>
                        <span className="text-xs font-semibold mt-1 inline-block" style={{ color: f.catColor }}>
                          {f.catLabel}
                        </span>
                      </div>
                    </button>
                  ))}
                </>
              )}
            </div>
          )}
        </div>

        {/* ── Category Tabs ── */}
        <div className="flex flex-wrap justify-center gap-2.5 mb-8">
          {faqCategories.map(cat => (
            <CategoryTab
              key={cat.id}
              cat={cat}
              isActive={activeCategory === cat.id}
              onClick={() => { setActiveCategory(cat.id); setOpenIndex(0) }}
            />
          ))}
        </div>

        {/* ── Active category header ── */}
        {currentCat && (
          <div
            className="flex items-center gap-3 rounded-2xl px-5 py-4 mb-5"
            style={{
              background: currentCat.bg,
              border: `1.5px solid ${currentCat.border}`,
            }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: currentCat.color }}
            >
              <currentCat.icon size={20} className="text-white" />
            </div>
            <div>
              <h3
                className="text-sm font-bold"
                style={{ color: currentCat.color, fontFamily: "'Outfit',sans-serif" }}
              >
                {currentCat.label}
              </h3>
              <p className="text-xs text-slate-500">
                {currentCat.faqs.length} question{currentCat.faqs.length !== 1 ? 's' : ''} in this section
              </p>
            </div>
            <div className="ml-auto flex gap-1">
              {[...Array(currentCat.faqs.length)].map((_, i) => (
                <div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full transition-all duration-200"
                  style={{ background: i === openIndex ? currentCat.color : `${currentCat.color}30` }}
                />
              ))}
            </div>
          </div>
        )}

        {/* ── Accordion ── */}
        {currentCat && (
          <div className="flex flex-col gap-3 mb-14">
            {currentCat.faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                faq={faq}
                isOpen={openIndex === i}
                onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
                color={currentCat.color}
                accentBg={currentCat.bg}
                accentBorder={currentCat.border}
                index={i}
              />
            ))}
          </div>
        )}

        {/* ── Quick stats strip ── */}
        <div
          className="flex flex-wrap justify-center gap-6 mb-12 rounded-2xl px-8 py-5"
          style={{
            background: 'linear-gradient(135deg,#F8FAFC,#EFF6FF)',
            border: '1.5px solid #E2E8F0',
          }}
        >
          {[
            { icon: Zap,    val: '< 2 min', label: 'Avg. answer time',    color: '#2563EB' },
            { icon: Star,   val: '98%',     label: 'Support satisfaction', color: '#F59E0B' },
            { icon: Briefcase, val: '24/7', label: 'Help available',      color: '#14B8A6' },
            { icon: MessageCircle, val: '50+', label: 'FAQ articles',     color: '#8B5CF6' },
          ].map(s => {
            const Icon = s.icon
            return (
              <div key={s.label} className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${s.color}15` }}>
                  <Icon size={15} style={{ color: s.color }} />
                </div>
                <div>
                  <div className="text-base font-black text-slate-900 leading-none"
                    style={{ fontFamily: "'Outfit',sans-serif" }}>
                    {s.val}
                  </div>
                  <div className="text-xs text-slate-400 font-medium">{s.label}</div>
                </div>
              </div>
            )
          })}
        </div>

        {/* ── Contact support cards ── */}
        <div className="text-center mb-8">
          <p className="text-slate-600 text-sm font-medium mb-5">
            Still have questions? Our team is ready to help.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                icon: MessageCircle,
                title: 'Live Chat',
                desc: 'Chat with our support team in real time. Usually responds within 2 minutes.',
                action: 'Start Chat',
                color: '#2563EB', bg: '#EFF6FF', border: '#BFDBFE',
                grad: ['#2563EB', '#6366F1'],
              },
              {
                icon: Mail,
                title: 'Email Support',
                desc: 'Send us a detailed message and we\'ll get back to you within 4 hours.',
                action: 'Send Email',
                color: '#14B8A6', bg: '#F0FDFA', border: '#99F6E4',
                grad: ['#14B8A6', '#06B6D4'],
              },
              {
                icon: Phone,
                title: 'Call Us',
                desc: 'Speak directly with a support agent. Available Mon–Sat, 9 AM – 7 PM.',
                action: 'Call Now',
                color: '#8B5CF6', bg: '#F5F3FF', border: '#DDD6FE',
                grad: ['#8B5CF6', '#A855F7'],
              },
            ].map(card => {
              const Icon = card.icon
              return (
                <div
                  key={card.title}
                  className="group flex flex-col items-center gap-3 rounded-2xl p-6 border transition-all duration-300 hover:-translate-y-1.5 cursor-pointer"
                  style={{
                    background: '#FFFFFF',
                    borderColor: card.border,
                    boxShadow: `0 2px 12px ${card.color}10`,
                  }}
                >
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                    style={{
                      background: `linear-gradient(135deg,${card.grad[0]},${card.grad[1]})`,
                      boxShadow: `0 4px 16px ${card.color}35`,
                    }}
                  >
                    <Icon size={22} className="text-white" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 mb-1"
                      style={{ fontFamily: "'Outfit',sans-serif" }}>
                      {card.title}
                    </h4>
                    <p className="text-xs text-slate-500 leading-relaxed">{card.desc}</p>
                  </div>
                  <button
                    className="flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl transition-all duration-200 group-hover:gap-2.5"
                    style={{
                      background: card.bg,
                      color: card.color,
                      border: `1px solid ${card.border}`,
                    }}
                  >
                    {card.action} <ArrowRight size={12} />
                  </button>
                </div>
              )
            })}
          </div>
        </div>

      </div>
    </section>
  )
}

export default FAQSection