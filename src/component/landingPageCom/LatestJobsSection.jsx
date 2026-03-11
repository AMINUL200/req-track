import React, { useState } from 'react'
import {
  MapPin, TrendingUp, IndianRupee, Clock, Zap,
  ArrowRight, Bookmark, BookmarkCheck, ChevronRight,
  Building2, Users, SlidersHorizontal, Search,
  ChevronLeft, LayoutGrid, LayoutList, Star,
  Briefcase, Filter, X, BadgeCheck
} from 'lucide-react'

/* ─── All Jobs Data ─────────────────────────────────────────────── */
const allJobs = [
  {
    id: 1,
    title: 'Senior Frontend Developer',
    company: 'TechNova Inc.',
    logo: '🏢', logoBg: '#EFF6FF',
    location: 'Bangalore', remote: false,
    experience: '3–6 Years', salary: '₹12L – ₹22L',
    type: 'Full-time', posted: '1 hour ago',
    urgent: true, featured: true,
    tags: ['React', 'TypeScript', 'Redux'],
    openings: 2, rating: 4.8,
    category: 'Technology',
  },
  {
    id: 2,
    title: 'Product Manager – B2B SaaS',
    company: 'GrowthStack Solutions',
    logo: '🎯', logoBg: '#FFF7ED',
    location: 'Mumbai', remote: true,
    experience: '4–8 Years', salary: '₹20L – ₹35L',
    type: 'Remote', posted: '3 hours ago',
    urgent: true, featured: true,
    tags: ['Agile', 'Roadmap', 'Analytics'],
    openings: 1, rating: 4.9,
    category: 'Product',
  },
  {
    id: 3,
    title: 'Data Scientist',
    company: 'InsightBridge Analytics',
    logo: '📊', logoBg: '#F0FDFA',
    location: 'Hyderabad', remote: false,
    experience: '2–5 Years', salary: '₹10L – ₹18L',
    type: 'Full-time', posted: '5 hours ago',
    urgent: false, featured: false,
    tags: ['Python', 'ML', 'TensorFlow'],
    openings: 3, rating: 4.7,
    category: 'Data',
  },
  {
    id: 4,
    title: 'UI/UX Designer',
    company: 'PixelForge Studios',
    logo: '🎨', logoBg: '#FDF4FF',
    location: 'Pune', remote: true,
    experience: '2–5 Years', salary: '₹8L – ₹15L',
    type: 'Remote', posted: '8 hours ago',
    urgent: false, featured: false,
    tags: ['Figma', 'Prototyping', 'Design Systems'],
    openings: 2, rating: 4.6,
    category: 'Design',
  },
  {
    id: 5,
    title: 'DevOps Engineer',
    company: 'CloudNine Infrastructure',
    logo: '⚙️', logoBg: '#F0FDF4',
    location: 'Chennai', remote: false,
    experience: '3–7 Years', salary: '₹14L – ₹24L',
    type: 'Full-time', posted: '12 hours ago',
    urgent: true, featured: false,
    tags: ['AWS', 'Kubernetes', 'Terraform'],
    openings: 4, rating: 4.5,
    category: 'Technology',
  },
  {
    id: 6,
    title: 'Backend Engineer – Node.js',
    company: 'Nexus Platforms',
    logo: '🔧', logoBg: '#FFF1F2',
    location: 'Remote', remote: true,
    experience: '3–5 Years', salary: '₹10L – ₹20L',
    type: 'Remote', posted: '1 day ago',
    urgent: false, featured: false,
    tags: ['Node.js', 'PostgreSQL', 'GraphQL'],
    openings: 2, rating: 4.4,
    category: 'Technology',
  },
  {
    id: 7,
    title: 'Sales Development Representative',
    company: 'BizReach Corp',
    logo: '📈', logoBg: '#FFF7ED',
    location: 'Delhi', remote: false,
    experience: '1–3 Years', salary: '₹6L – ₹10L',
    type: 'Full-time', posted: '1 day ago',
    urgent: false, featured: false,
    tags: ['B2B Sales', 'CRM', 'Cold Outreach'],
    openings: 5, rating: 4.3,
    category: 'Sales',
  },
  {
    id: 8,
    title: 'HR Business Partner',
    company: 'PeopleFirst Solutions',
    logo: '🤝', logoBg: '#F5F3FF',
    location: 'Noida', remote: false,
    experience: '4–7 Years', salary: '₹9L – ₹16L',
    type: 'Contract', posted: '2 days ago',
    urgent: false, featured: false,
    tags: ['HRBP', 'Talent Management', 'L&D'],
    openings: 1, rating: 4.6,
    category: 'HR',
  },
  {
    id: 9,
    title: 'Android Developer',
    company: 'AppCraft Technologies',
    logo: '📱', logoBg: '#F0FDF4',
    location: 'Bangalore', remote: false,
    experience: '2–4 Years', salary: '₹8L – ₹14L',
    type: 'Full-time', posted: '2 days ago',
    urgent: false, featured: false,
    tags: ['Kotlin', 'Jetpack', 'Firebase'],
    openings: 2, rating: 4.5,
    category: 'Technology',
  },
  {
    id: 10,
    title: 'Content Strategist',
    company: 'BrandVoice Agency',
    logo: '✍️', logoBg: '#FFFBEB',
    location: 'Mumbai', remote: true,
    experience: '2–5 Years', salary: '₹7L – ₹12L',
    type: 'Remote', posted: '3 days ago',
    urgent: false, featured: false,
    tags: ['SEO', 'Content Marketing', 'Copywriting'],
    openings: 2, rating: 4.4,
    category: 'Marketing',
  },
  {
    id: 11,
    title: 'QA Automation Engineer',
    company: 'TestPilot Labs',
    logo: '🧪', logoBg: '#F0FDFA',
    location: 'Hyderabad', remote: false,
    experience: '2–5 Years', salary: '₹8L – ₹14L',
    type: 'Full-time', posted: '3 days ago',
    urgent: false, featured: false,
    tags: ['Selenium', 'Cypress', 'Jest'],
    openings: 3, rating: 4.3,
    category: 'Technology',
  },
  {
    id: 12,
    title: 'Finance Analyst',
    company: 'CapitalEdge Finance',
    logo: '💰', logoBg: '#FFFBEB',
    location: 'Chennai', remote: false,
    experience: '2–4 Years', salary: '₹7L – ₹12L',
    type: 'Full-time', posted: '4 days ago',
    urgent: false, featured: false,
    tags: ['Excel', 'Financial Modelling', 'ERP'],
    openings: 2, rating: 4.5,
    category: 'Finance',
  },
]

/* ─── Helpers ────────────────────────────────────────────────────── */
const typeStyle = {
  'Full-time': { bg: 'bg-blue-50',   text: 'text-blue-700',   border: 'border-blue-100' },
  'Remote':    { bg: 'bg-teal-50',   text: 'text-teal-700',   border: 'border-teal-100' },
  'Contract':  { bg: 'bg-amber-50',  text: 'text-amber-700',  border: 'border-amber-100' },
}

const JOBS_PER_PAGE = 8

/* ─── JobCard (Grid) ─────────────────────────────────────────────── */
const JobCardGrid = ({ job }) => {
  const [saved, setSaved] = useState(false)
  const tc = typeStyle[job.type] || typeStyle['Full-time']

  return (
    <div
      className="group relative bg-white rounded-2xl border border-slate-100 p-5 flex flex-col gap-3.5 transition-all duration-300 hover:-translate-y-1.5 hover:border-blue-200 hover:shadow-xl"
      style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.04)', minHeight: '260px' }}
    >
      {/* Featured ribbon */}
      {job.featured && (
        <div className="absolute -top-2.5 left-4 flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full text-white"
          style={{ background: 'linear-gradient(135deg,#F59E0B,#EF4444)', boxShadow: '0 2px 8px rgba(245,158,11,0.4)' }}>
          <Star size={8} fill="white" /> Featured
        </div>
      )}
      {!job.featured && job.urgent && (
        <div className="absolute -top-2.5 left-4 flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full text-white"
          style={{ background: 'linear-gradient(135deg,#2563EB,#14B8A6)', boxShadow: '0 2px 8px rgba(37,99,235,0.4)' }}>
          <Zap size={8} fill="white" /> Urgent
        </div>
      )}

      {/* Top */}
      <div className="flex items-start justify-between gap-2 pt-1">
        <div className="flex items-center gap-2.5">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0 border border-slate-100"
            style={{ background: job.logoBg }}>
            {job.logo}
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 leading-snug group-hover:text-blue-600 transition-colors line-clamp-1">
              {job.title}
            </h3>
            <div className="flex items-center gap-1 mt-0.5">
              <Building2 size={10} className="text-slate-400" />
              <span className="text-xs text-slate-500 font-medium">{job.company}</span>
              <BadgeCheck size={10} className="text-blue-500 ml-0.5" />
            </div>
          </div>
        </div>
        <button onClick={() => setSaved(s => !s)}
          className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200 ${saved ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400 hover:bg-blue-50 hover:text-blue-600'}`}>
          {saved ? <BookmarkCheck size={13} /> : <Bookmark size={13} />}
        </button>
      </div>

      {/* Meta */}
      <div className="grid grid-cols-2 gap-x-2 gap-y-1.5">
        {[
          { Icon: MapPin,      color: 'text-blue-500',   val: job.location },
          { Icon: TrendingUp,  color: 'text-teal-500',   val: job.experience },
          { Icon: IndianRupee, color: 'text-amber-500',  val: job.salary },
          { Icon: Users,       color: 'text-purple-500', val: `${job.openings} Opening${job.openings > 1 ? 's' : ''}` },
        ].map(({ Icon, color, val }) => (
          <div key={val} className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-md bg-slate-50 flex items-center justify-center flex-shrink-0">
              <Icon size={10} className={color} />
            </div>
            <span className="text-xs text-slate-600 font-medium truncate">{val}</span>
          </div>
        ))}
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1">
        <span className={`text-[10.5px] font-semibold px-2 py-0.5 rounded-full border ${tc.bg} ${tc.text} ${tc.border}`}>
          {job.type}
        </span>
        {job.tags.slice(0, 2).map(t => (
          <span key={t} className="text-[10.5px] font-medium px-2 py-0.5 rounded-full bg-slate-50 text-slate-500 border border-slate-100">{t}</span>
        ))}
        {job.tags.length > 2 && (
          <span className="text-[10.5px] font-medium px-2 py-0.5 rounded-full bg-slate-50 text-slate-400 border border-slate-100">+{job.tags.length - 2}</span>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between gap-2 mt-auto pt-1 border-t border-slate-50">
        <div className="flex items-center gap-1 text-slate-400">
          <Clock size={10} />
          <span className="text-[10.5px]">{job.posted}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <button className="text-[11px] font-semibold text-slate-500 hover:text-blue-600 flex items-center gap-0.5 transition-colors">
            Details <ChevronRight size={11} />
          </button>
          <button className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold rounded-lg transition-all duration-200"
            style={{ boxShadow: '0 2px 8px rgba(37,99,235,0.30)' }}>
            Apply <ArrowRight size={11} />
          </button>
        </div>
      </div>
    </div>
  )
}

/* ─── JobCard (List) ─────────────────────────────────────────────── */
const JobCardList = ({ job }) => {
  const [saved, setSaved] = useState(false)
  const tc = typeStyle[job.type] || typeStyle['Full-time']

  return (
    <div
      className="group bg-white rounded-2xl border border-slate-100 px-5 py-4 flex items-center gap-4 transition-all duration-300 hover:border-blue-200 hover:shadow-lg hover:-translate-y-0.5"
      style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
    >
      {/* Logo */}
      <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 border border-slate-100 hidden sm:flex"
        style={{ background: job.logoBg }}>
        {job.logo}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
            {job.title}
          </h3>
          {job.urgent && (
            <span className="flex items-center gap-0.5 text-[9.5px] font-bold px-1.5 py-0.5 rounded-full text-white flex-shrink-0"
              style={{ background: 'linear-gradient(135deg,#2563EB,#14B8A6)' }}>
              <Zap size={8} fill="white" /> Urgent
            </span>
          )}
          {job.featured && (
            <span className="flex items-center gap-0.5 text-[9.5px] font-bold px-1.5 py-0.5 rounded-full text-white flex-shrink-0"
              style={{ background: 'linear-gradient(135deg,#F59E0B,#EF4444)' }}>
              <Star size={8} fill="white" /> Featured
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 mt-1 flex-wrap">
          <div className="flex items-center gap-1">
            <Building2 size={10} className="text-slate-400" />
            <span className="text-xs text-slate-500">{job.company}</span>
            <BadgeCheck size={10} className="text-blue-500" />
          </div>
          <div className="flex items-center gap-1">
            <MapPin size={10} className="text-blue-500" />
            <span className="text-xs text-slate-500">{job.location}</span>
          </div>
          <div className="flex items-center gap-1">
            <IndianRupee size={10} className="text-amber-500" />
            <span className="text-xs text-slate-500">{job.salary}</span>
          </div>
          <div className="flex items-center gap-1">
            <TrendingUp size={10} className="text-teal-500" />
            <span className="text-xs text-slate-500">{job.experience}</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 mt-2 flex-wrap">
          <span className={`text-[10.5px] font-semibold px-2 py-0.5 rounded-full border ${tc.bg} ${tc.text} ${tc.border}`}>{job.type}</span>
          {job.tags.slice(0, 3).map(t => (
            <span key={t} className="text-[10.5px] px-2 py-0.5 rounded-full bg-slate-50 text-slate-500 border border-slate-100">{t}</span>
          ))}
        </div>
      </div>

      {/* Right actions */}
      <div className="flex flex-col items-end gap-2 flex-shrink-0">
        <div className="flex items-center gap-1 text-slate-400">
          <Clock size={10} />
          <span className="text-[10.5px]">{job.posted}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <button onClick={() => setSaved(s => !s)}
            className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-200 ${saved ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400 hover:bg-blue-50 hover:text-blue-600'}`}>
            {saved ? <BookmarkCheck size={12} /> : <Bookmark size={12} />}
          </button>
          <button className="flex items-center gap-1 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-all"
            style={{ boxShadow: '0 2px 8px rgba(37,99,235,0.30)' }}>
            Apply Now <ArrowRight size={12} />
          </button>
        </div>
      </div>
    </div>
  )
}

/* ─── JobList ────────────────────────────────────────────────────── */
const JobList = ({ jobs, viewMode }) => {
  if (jobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-slate-400">
        <Briefcase size={48} className="mb-3 opacity-30" />
        <p className="text-sm font-medium">No jobs match your filters.</p>
        <p className="text-xs mt-1 text-slate-300">Try adjusting your search criteria.</p>
      </div>
    )
  }

  if (viewMode === 'list') {
    return (
      <div className="flex flex-col gap-3">
        {jobs.map(job => <JobCardList key={job.id} job={job} />)}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {jobs.map(job => <JobCardGrid key={job.id} job={job} />)}
    </div>
  )
}

/* ─── Pagination ─────────────────────────────────────────────────── */
const Pagination = ({ current, total, onChange }) => {
  const pages = Array.from({ length: total }, (_, i) => i + 1)
  return (
    <div className="flex items-center justify-center gap-1.5 mt-10">
      <button
        onClick={() => onChange(current - 1)}
        disabled={current === 1}
        className="w-9 h-9 rounded-xl border flex items-center justify-center transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed hover:border-blue-300 hover:text-blue-600"
        style={{ background: '#FFFFFF', borderColor: '#E2E8F0', color: '#64748B' }}>
        <ChevronLeft size={16} />
      </button>

      {pages.map(p => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className="w-9 h-9 rounded-xl border font-bold text-sm transition-all duration-200"
          style={{
            background: current === p ? 'linear-gradient(135deg,#2563EB,#1D4ED8)' : '#FFFFFF',
            borderColor: current === p ? '#2563EB' : '#E2E8F0',
            color: current === p ? '#FFFFFF' : '#64748B',
            boxShadow: current === p ? '0 4px 12px rgba(37,99,235,0.30)' : 'none',
            fontFamily: "'Outfit',sans-serif",
          }}>
          {p}
        </button>
      ))}

      <button
        onClick={() => onChange(current + 1)}
        disabled={current === total}
        className="w-9 h-9 rounded-xl border flex items-center justify-center transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed hover:border-blue-300 hover:text-blue-600"
        style={{ background: '#FFFFFF', borderColor: '#E2E8F0', color: '#64748B' }}>
        <ChevronRight size={16} />
      </button>
    </div>
  )
}

/* ─── LatestJobsSection ──────────────────────────────────────────── */
const LatestJobsSection = () => {
  const [search, setSearch]           = useState('')
  const [selectedType, setSelectedType] = useState('All')
  const [selectedCat, setSelectedCat] = useState('All')
  const [viewMode, setViewMode]       = useState('grid')
  const [page, setPage]               = useState(1)
  const [savedIds, setSavedIds]       = useState([])

  const types = ['All', 'Full-time', 'Remote', 'Contract']
  const categories = ['All', 'Technology', 'Product', 'Data', 'Design', 'Sales', 'HR', 'Finance', 'Marketing']

  const filtered = allJobs.filter(j => {
    const matchSearch = j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.company.toLowerCase().includes(search.toLowerCase()) ||
      j.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
    const matchType = selectedType === 'All' || j.type === selectedType
    const matchCat  = selectedCat  === 'All' || j.category === selectedCat
    return matchSearch && matchType && matchCat
  })

  const totalPages = Math.ceil(filtered.length / JOBS_PER_PAGE)
  const paginated  = filtered.slice((page - 1) * JOBS_PER_PAGE, page * JOBS_PER_PAGE)

  const resetFilters = () => {
    setSearch(''); setSelectedType('All'); setSelectedCat('All'); setPage(1)
  }
  const hasFilters = search || selectedType !== 'All' || selectedCat !== 'All'

  return (
    <section className="relative py-20 overflow-hidden" style={{ background: '#F1F5F9' }}>

      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg,transparent,#BFDBFE,transparent)' }} />

      <div className="max-w-7xl mx-auto px-6 lg:px-10">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold px-3.5 py-1.5 rounded-full mb-3">
              <Clock size={11} className="text-blue-500" />
              Freshly Added
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight"
              style={{ letterSpacing: '-0.025em', fontFamily: "'Outfit', sans-serif" }}>
              Latest{' '}
              <span style={{ background: 'linear-gradient(135deg,#2563EB,#14B8A6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Job Openings
              </span>
            </h2>
            <p className="text-slate-500 text-sm mt-1.5">
              <span className="font-bold text-slate-700">{filtered.length}</span> jobs found · Updated daily
            </p>
          </div>
          <a href="#"
            className="flex items-center gap-2 text-blue-600 font-semibold text-sm hover:text-blue-800 transition-colors whitespace-nowrap pb-1 border-b-2 border-blue-200 hover:border-blue-600 self-end sm:self-auto">
            View All Jobs <ArrowRight size={14} />
          </a>
        </div>

        {/* ── Search + Controls bar ── */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-6 flex flex-col gap-3"
          style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>

          {/* Row 1: search + view toggle */}
          <div className="flex items-center gap-3">
            <div className="flex-1 flex items-center gap-2.5 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus-within:border-blue-500 focus-within:bg-blue-50 transition-all">
              <Search size={15} className="text-slate-400 flex-shrink-0" />
              <input
                className="bg-transparent border-none outline-none text-sm text-slate-900 w-full placeholder-slate-400 font-medium"
                placeholder="Search job title, company or skill..."
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1) }}
                style={{ fontFamily: "'Outfit',sans-serif" }}
              />
              {search && (
                <button onClick={() => { setSearch(''); setPage(1) }} className="text-slate-400 hover:text-slate-600">
                  <X size={14} />
                </button>
              )}
            </div>

            {/* View toggle */}
            <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1 flex-shrink-0">
              {[
                { mode: 'grid', Icon: LayoutGrid },
                { mode: 'list', Icon: LayoutList },
              ].map(({ mode, Icon }) => (
                <button key={mode} onClick={() => setViewMode(mode)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200"
                  style={{
                    background: viewMode === mode ? '#FFFFFF' : 'transparent',
                    color: viewMode === mode ? '#2563EB' : '#94A3B8',
                    boxShadow: viewMode === mode ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                  }}>
                  <Icon size={15} />
                </button>
              ))}
            </div>
          </div>

          {/* Row 2: filter chips */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1 text-slate-400 flex-shrink-0">
              <Filter size={13} />
              <span className="text-xs font-medium">Type:</span>
            </div>
            {types.map(t => (
              <button key={t} onClick={() => { setSelectedType(t); setPage(1) }}
                className="px-3 py-1 rounded-full text-xs font-semibold border transition-all duration-200"
                style={{
                  background: selectedType === t ? '#2563EB' : '#F8FAFC',
                  borderColor: selectedType === t ? '#2563EB' : '#E2E8F0',
                  color: selectedType === t ? '#FFFFFF' : '#64748B',
                  boxShadow: selectedType === t ? '0 2px 8px rgba(37,99,235,0.25)' : 'none',
                }}>
                {t}
              </button>
            ))}
            <div className="w-px h-4 bg-slate-200 mx-1 flex-shrink-0" />
            <div className="flex items-center gap-1 text-slate-400 flex-shrink-0">
              <SlidersHorizontal size={13} />
              <span className="text-xs font-medium">Domain:</span>
            </div>
            <div className="flex gap-1.5 overflow-x-auto pb-0.5 flex-wrap">
              {categories.map(c => (
                <button key={c} onClick={() => { setSelectedCat(c); setPage(1) }}
                  className="px-3 py-1 rounded-full text-xs font-semibold border transition-all duration-200 whitespace-nowrap"
                  style={{
                    background: selectedCat === c ? '#0F172A' : '#F8FAFC',
                    borderColor: selectedCat === c ? '#0F172A' : '#E2E8F0',
                    color: selectedCat === c ? '#FFFFFF' : '#64748B',
                  }}>
                  {c}
                </button>
              ))}
            </div>
            {hasFilters && (
              <button onClick={resetFilters}
                className="ml-auto flex items-center gap-1 text-xs text-red-500 font-semibold hover:text-red-700 transition-colors flex-shrink-0">
                <X size={12} /> Reset
              </button>
            )}
          </div>
        </div>

        {/* ── Results info ── */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs text-slate-400 font-medium">
            Showing <span className="text-slate-700 font-bold">{(page - 1) * JOBS_PER_PAGE + 1}–{Math.min(page * JOBS_PER_PAGE, filtered.length)}</span> of <span className="text-slate-700 font-bold">{filtered.length}</span> jobs
          </p>
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Zap size={11} className="text-blue-500" />
            <span>{allJobs.filter(j => j.urgent).length} urgent openings</span>
          </div>
        </div>

        {/* ── Job List ── */}
        <JobList jobs={paginated} viewMode={viewMode} />

        {/* ── Pagination ── */}
        {totalPages > 1 && (
          <Pagination
            current={page}
            total={totalPages}
            onChange={(p) => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
          />
        )}

        {/* ── View All CTA ── */}
        <div className="mt-10 text-center">
          <div className="inline-flex flex-col items-center gap-4">
            <p className="text-slate-500 text-sm">
              Showing <span className="font-bold text-slate-700">{allJobs.length}</span> of <span className="font-bold text-blue-600">50,000+</span> available jobs
            </p>
            <button
              className="flex items-center gap-2.5 px-10 py-4 text-white font-bold text-sm rounded-2xl transition-all duration-300 hover:-translate-y-1"
              style={{
                background: 'linear-gradient(135deg,#2563EB,#1D4ED8)',
                boxShadow: '0 6px 24px rgba(37,99,235,0.35)',
                fontFamily: "'Outfit',sans-serif",
                letterSpacing: '0.01em',
              }}
              onMouseOver={e => e.currentTarget.style.boxShadow = '0 10px 32px rgba(37,99,235,0.45)'}
              onMouseOut={e => e.currentTarget.style.boxShadow = '0 6px 24px rgba(37,99,235,0.35)'}
            >
              <Briefcase size={17} />
              View All Jobs
              <ArrowRight size={16} />
            </button>
            <div className="flex items-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1"><BadgeCheck size={12} className="text-green-500" /> Verified listings</span>
              <span className="flex items-center gap-1"><Zap size={12} className="text-blue-500" /> Updated daily</span>
              <span className="flex items-center gap-1"><Star size={12} className="text-amber-400" fill="#FBBF24" /> Top employers</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}

export default LatestJobsSection