import React, { useState } from 'react'
import {
  Briefcase, MapPin, Mail, Phone, ArrowRight,
  Linkedin, Facebook, Twitter, Instagram, Youtube,
  Shield, Heart, ExternalLink, ChevronRight,
  Building2, Globe, Zap, Star, Users, CheckCircle2,
  Send
} from 'lucide-react'

/* ─── Data ───────────────────────────────────────────────────────── */
const footerLinks = [
  {
    title: 'Company',
    links: [
      { label: 'About Us',       href: '#', badge: null },
      { label: 'Careers',        href: '#', badge: "We're hiring" },
      { label: 'Blog',           href: '#', badge: null },
      { label: 'Contact',        href: '#', badge: null },
      { label: 'Press Kit',      href: '#', badge: null },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Help Center',      href: '#', badge: null },
      { label: 'Privacy Policy',   href: '#', badge: null },
      { label: 'Terms of Service', href: '#', badge: null },
      { label: 'Cookie Policy',    href: '#', badge: null },
      { label: 'Sitemap',          href: '#', badge: null },
    ],
  },
  {
    title: 'Jobs',
    links: [
      { label: 'Browse All Jobs',  href: '#', badge: '50K+' },
      { label: 'Top Companies',    href: '#', badge: null },
      { label: 'Remote Jobs',      href: '#', badge: 'New' },
      { label: 'Urgent Openings',  href: '#', badge: null },
      { label: 'By Category',      href: '#', badge: null },
    ],
  },
]

const socials = [
  { icon: Linkedin,  label: 'LinkedIn',  href: '#', color: '#0A66C2', bg: '#EFF6FF' },
  { icon: Twitter,   label: 'Twitter',   href: '#', color: '#1DA1F2', bg: '#EFF6FF' },
  { icon: Facebook,  label: 'Facebook',  href: '#', color: '#1877F2', bg: '#EFF6FF' },
  { icon: Instagram, label: 'Instagram', href: '#', color: '#E1306C', bg: '#FFF1F2' },
  { icon: Youtube,   label: 'YouTube',   href: '#', color: '#FF0000', bg: '#FFF1F2' },
]

const stats = [
  { icon: Briefcase, value: '50K+',  label: 'Jobs',       color: '#60A5FA' },
  { icon: Users,     value: '30K+',  label: 'Candidates', color: '#34D399' },
  { icon: Building2, value: '500+',  label: 'Companies',  color: '#A78BFA' },
  { icon: Star,      value: '4.9★',  label: 'Rating',     color: '#FBBF24' },
]

const categories = [
  'Technology', 'Finance', 'Healthcare', 'Design',
  'Marketing', 'Sales', 'HR', 'Operations', 'Data', 'Legal',
]

/* ─── Footer ─────────────────────────────────────────────────────── */
const Footer = () => {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (email.trim()) { setSubscribed(true); setEmail('') }
  }

  return (
    <footer style={{ background: '#0F172A', fontFamily: "'Outfit', sans-serif" }}>

      {/* ── Top newsletter band ── */}
      <div
        className="relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg,#1E3A5F 0%,#2563EB 50%,#0D9488 100%)' }}
      >
        {/* Decorative circles */}
        <div className="absolute right-0 top-0 w-72 h-72 rounded-full opacity-10 -translate-y-1/2 translate-x-1/4"
          style={{ background: 'white' }} />
        <div className="absolute left-1/4 bottom-0 w-40 h-40 rounded-full opacity-10 translate-y-1/2"
          style={{ background: 'white' }} />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 py-10 flex flex-col lg:flex-row items-center justify-between gap-7">
          <div className="text-center lg:text-left">
            <div className="flex items-center gap-2 justify-center lg:justify-start mb-1">
              <Zap size={15} className="text-yellow-300" fill="#FDE68A" />
              <span className="text-blue-100 text-xs font-semibold tracking-widest uppercase">Stay Ahead</span>
            </div>
            <h3 className="text-white text-xl font-extrabold leading-tight" style={{ letterSpacing: '-0.02em' }}>
              Get the Latest Jobs in Your Inbox
            </h3>
            <p className="text-blue-100 text-sm mt-1">
              New openings, career tips, and industry news — weekly.
            </p>
          </div>

          {subscribed ? (
            <div className="flex items-center gap-2.5 bg-white/20 rounded-2xl px-6 py-3.5 border border-white/30">
              <CheckCircle2 size={18} className="text-green-300" />
              <span className="text-white font-semibold text-sm">You're subscribed! 🎉</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe}
              className="flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-2xl p-2 border border-white/20 w-full lg:w-auto min-w-0 lg:min-w-[400px]">
              <Mail size={16} className="text-white/60 ml-2 flex-shrink-0" />
              <input
                type="email"
                required
                placeholder="Enter your email address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-white text-sm placeholder-white/50 min-w-0"
                style={{ fontFamily: "'Outfit',sans-serif" }}
              />
              <button type="submit"
                className="flex items-center gap-1.5 px-5 py-2.5 bg-white text-blue-700 font-bold text-sm rounded-xl flex-shrink-0 transition-all hover:bg-blue-50 hover:shadow-lg"
                style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.15)' }}>
                Subscribe <Send size={13} />
              </button>
            </form>
          )}
        </div>
      </div>

      {/* ── Main footer body ── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-14 pb-8">

        {/* ── Top row: brand + stats ── */}
        <div className="flex flex-col lg:flex-row gap-10 justify-between mb-12">

          {/* Brand column */}
          <div className="max-w-xs">
            {/* Logo */}
            <div className="flex items-center gap-2.5 mb-4">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg,#2563EB,#14B8A6)' }}
              >
                <Briefcase size={18} className="text-white" />
              </div>
              <span
                className="text-xl font-black text-white"
                style={{ letterSpacing: '-0.03em' }}
              >
                Req<span style={{
                  background: 'linear-gradient(135deg,#60A5FA,#34D399)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>Track</span>
              </span>
            </div>

            <p className="text-slate-400 text-sm leading-relaxed mb-5">
              India's smartest recruitment platform. Connecting ambitious candidates with verified employers — fast, transparent, and free for job seekers.
            </p>

            {/* Contact mini-list */}
            <div className="flex flex-col gap-2.5">
              {[
                { icon: Mail,  val: 'support@reqtrack.in',    color: '#60A5FA' },
                { icon: Phone, val: '+91 98765 43210',         color: '#34D399' },
                { icon: MapPin,val: 'Bangalore, India',        color: '#A78BFA' },
              ].map(c => {
                const Icon = c.icon
                return (
                  <div key={c.val} className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: `${c.color}18` }}>
                      <Icon size={13} style={{ color: c.color }} />
                    </div>
                    <span className="text-slate-400 text-xs font-medium hover:text-white transition-colors cursor-pointer">
                      {c.val}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4 gap-3 lg:gap-4 self-start">
            {stats.map(s => {
              const Icon = s.icon
              return (
                <div key={s.label}
                  className="flex flex-col items-center justify-center gap-1.5 rounded-2xl px-5 py-4 text-center"
                  style={{
                    background: '#FFFFFF08',
                    border: '1px solid #FFFFFF10',
                  }}
                >
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ background: `${s.color}18` }}>
                    <Icon size={17} style={{ color: s.color }} />
                  </div>
                  <div className="text-xl font-black text-white" style={{ letterSpacing: '-0.03em' }}>
                    {s.value}
                  </div>
                  <div className="text-xs text-slate-500 font-medium">{s.label}</div>
                </div>
              )
            })}
          </div>
        </div>

        {/* ── Divider ── */}
        <div className="h-px mb-12" style={{ background: 'linear-gradient(90deg,transparent,#FFFFFF15,transparent)' }} />

        {/* ── Links + Social grid ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-10 mb-12">

          {/* Three link columns */}
          {footerLinks.map(col => (
            <div key={col.title}>
              <h4 className="text-white text-sm font-bold mb-4 tracking-wide">{col.title}</h4>
              <ul className="flex flex-col gap-2.5">
                {col.links.map(link => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="group flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors duration-200"
                    >
                      <ChevronRight
                        size={12}
                        className="text-slate-600 group-hover:text-blue-400 transition-colors flex-shrink-0 -ml-1 group-hover:translate-x-0.5 transition-transform"
                      />
                      {link.label}
                      {link.badge && (
                        <span
                          className="text-[9.5px] font-bold px-1.5 py-0.5 rounded-full ml-0.5 flex-shrink-0"
                          style={{
                            background: link.badge === "We're hiring" ? '#22C55E20' : link.badge === 'New' ? '#14B8A620' : '#2563EB20',
                            color: link.badge === "We're hiring" ? '#4ADE80' : link.badge === 'New' ? '#2DD4BF' : '#60A5FA',
                          }}
                        >
                          {link.badge}
                        </span>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Social column */}
          <div>
            <h4 className="text-white text-sm font-bold mb-4 tracking-wide">Follow Us</h4>
            <div className="flex flex-col gap-2.5">
              {socials.map(s => {
                const Icon = s.icon
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    className="group flex items-center gap-3 text-slate-400 hover:text-white transition-colors duration-200"
                  >
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200 group-hover:scale-110"
                      style={{ background: '#FFFFFF10', border: '1px solid #FFFFFF10' }}
                      onMouseOver={e => {
                        e.currentTarget.style.background = s.color
                        e.currentTarget.style.borderColor = s.color
                        e.currentTarget.style.boxShadow = `0 4px 14px ${s.color}50`
                      }}
                      onMouseOut={e => {
                        e.currentTarget.style.background = '#FFFFFF10'
                        e.currentTarget.style.borderColor = '#FFFFFF10'
                        e.currentTarget.style.boxShadow = 'none'
                      }}
                    >
                      <Icon size={14} style={{ color: '#94A3B8' }} className="group-hover:text-white transition-colors" />
                    </div>
                    <span className="text-sm font-medium">{s.label}</span>
                    <ExternalLink size={11} className="text-slate-600 group-hover:text-slate-400 ml-auto transition-colors" />
                  </a>
                )
              })}
            </div>
          </div>
        </div>

        {/* ── Job categories strip ── */}
        <div
          className="rounded-2xl px-6 py-4 mb-10"
          style={{ background: '#FFFFFF06', border: '1px solid #FFFFFF0D' }}
        >
          <div className="flex flex-wrap items-center gap-x-2 gap-y-2">
            <span className="text-slate-500 text-xs font-semibold flex items-center gap-1.5 flex-shrink-0 mr-2">
              <Globe size={12} /> Browse by Category:
            </span>
            {categories.map((cat, i) => (
              <React.Fragment key={cat}>
                <a href="#"
                  className="text-slate-400 hover:text-blue-400 text-xs font-medium transition-colors duration-200">
                  {cat}
                </a>
                {i < categories.length - 1 && (
                  <span className="text-slate-700 text-xs select-none">·</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* ── Divider ── */}
        <div className="h-px mb-6" style={{ background: 'linear-gradient(90deg,transparent,#FFFFFF15,transparent)' }} />

        {/* ── Bottom bar ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">

          {/* Copyright */}
          <div className="flex items-center gap-1.5 text-slate-500 text-xs">
            <span>© {new Date().getFullYear()} ReqTrack.</span>
            <span>Made with</span>
            <Heart size={11} className="text-red-500" fill="#EF4444" />
            <span>in India.</span>
            <span className="text-slate-600">·</span>
            <span>All rights reserved.</span>
          </div>

          {/* Trust badges */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-slate-500 text-xs">
              <Shield size={12} className="text-green-500" />
              <span>SSL Secured</span>
            </div>
            <div className="h-3 w-px bg-slate-700" />
            <div className="flex items-center gap-1.5 text-slate-500 text-xs">
              <CheckCircle2 size={12} className="text-blue-500" />
              <span>GDPR Compliant</span>
            </div>
            <div className="h-3 w-px bg-slate-700" />
            <div className="flex items-center gap-1.5 text-slate-500 text-xs">
              <Star size={12} className="text-amber-400" fill="#FBBF24" />
              <span>4.9 Rated</span>
            </div>
          </div>

          {/* Back to top */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-1.5 text-slate-500 hover:text-blue-400 text-xs font-semibold transition-colors duration-200 group"
          >
            Back to top
            <div className="w-6 h-6 rounded-lg bg-white/8 border border-white/10 flex items-center justify-center group-hover:border-blue-500/50 transition-colors">
              <ArrowRight size={11} className="-rotate-90" />
            </div>
          </button>
        </div>

      </div>
    </footer>
  )
}

export default Footer