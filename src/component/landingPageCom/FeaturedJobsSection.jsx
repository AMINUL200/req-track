import React, { useState } from 'react'
import {
  MapPin, Briefcase, TrendingUp, IndianRupee, Clock, Zap,
  ArrowRight, Bookmark, BookmarkCheck, ChevronRight, Star,
  Building2, Users, SlidersHorizontal
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const jobs = [
  {
    id: 1,
    title: 'Frontend Developer',
    company: 'ABC Tech Pvt Ltd',
    logo: '🏢',
    logoBg: '#EFF6FF',
    location: 'Bangalore',
    experience: '2–4 Years',
    salary: '₹6L – ₹10L',
    type: 'Full-time',
    posted: '2 days ago',
    urgent: true,
    tags: ['React', 'TypeScript', 'Tailwind'],
    openings: 3,
  },
  {
    id: 2,
    title: 'Product Manager',
    company: 'GrowthStack Solutions',
    logo: '🎯',
    logoBg: '#FFF7ED',
    location: 'Mumbai',
    experience: '4–7 Years',
    salary: '₹18L – ₹28L',
    type: 'Remote',
    posted: '1 day ago',
    urgent: true,
    tags: ['Agile', 'Roadmapping', 'B2B SaaS'],
    openings: 1,
  },
  {
    id: 3,
    title: 'Data Analyst',
    company: 'InsightBridge Analytics',
    logo: '📊',
    logoBg: '#F0FDFA',
    location: 'Hyderabad',
    experience: '1–3 Years',
    salary: '₹5L – ₹9L',
    type: 'Contract',
    posted: '3 days ago',
    urgent: false,
    tags: ['Python', 'SQL', 'Power BI'],
    openings: 2,
  },
  {
    id: 4,
    title: 'UI/UX Designer',
    company: 'PixelForge Studios',
    logo: '🎨',
    logoBg: '#FDF4FF',
    location: 'Pune',
    experience: '2–5 Years',
    salary: '₹8L – ₹14L',
    type: 'Full-time',
    posted: '5 hours ago',
    urgent: true,
    tags: ['Figma', 'Design Systems', 'Prototyping'],
    openings: 2,
  },
  {
    id: 5,
    title: 'DevOps Engineer',
    company: 'CloudNine Infrastructure',
    logo: '⚙️',
    logoBg: '#F0FDF4',
    location: 'Chennai',
    experience: '3–6 Years',
    salary: '₹12L – ₹20L',
    type: 'Full-time',
    posted: '1 day ago',
    urgent: false,
    tags: ['AWS', 'Kubernetes', 'CI/CD'],
    openings: 4,
  },
  {
    id: 6,
    title: 'Backend Engineer',
    company: 'Nexus Platforms',
    logo: '🔧',
    logoBg: '#FFF1F2',
    location: 'Remote',
    experience: '3–5 Years',
    salary: '₹10L – ₹18L',
    type: 'Remote',
    posted: '4 days ago',
    urgent: false,
    tags: ['Node.js', 'PostgreSQL', 'GraphQL'],
    openings: 2,
  },
]

const typeColors = {
  'Full-time': { bg: 'bg-blue-50',   text: 'text-blue-700',   border: 'border-blue-100' },
  'Remote':    { bg: 'bg-teal-50',   text: 'text-teal-700',   border: 'border-teal-100' },
  'Contract':  { bg: 'bg-amber-50',  text: 'text-amber-700',  border: 'border-amber-100' },
}

/* ─── JobCard ─────────────────────────────────────────────────────────── */
const JobCard = ({ job }) => {
  const [saved, setSaved] = useState(false)
  const tc = typeColors[job.type] || typeColors['Full-time']
  const navigate = useNavigate();
  return (
    <div className="group relative bg-white rounded-2xl border border-slate-100 p-6 flex flex-col gap-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-blue-200"
      style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>

      {/* Urgent ribbon */}
      {job.urgent && (
        <div className="absolute -top-2.5 left-5 flex items-center gap-1 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md"
          style={{ background: 'linear-gradient(135deg,#2563EB,#14B8A6)' }}>
          <Zap size={10} fill="white" /> URGENT
        </div>
      )}

      {/* Top row — logo + title + save */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 border border-slate-100"
            style={{ background: job.logoBg }}>
            {job.logo}
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 leading-snug group-hover:text-blue-600 transition-colors">
              {job.title}
            </h3>
            <div className="flex items-center gap-1 mt-0.5">
              <Building2 size={11} className="text-slate-400" />
              <span className="text-xs text-slate-500 font-medium">{job.company}</span>
            </div>
          </div>
        </div>
        <button onClick={() => setSaved(s => !s)}
          className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 ${
            saved ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-100 text-slate-400 hover:bg-blue-50 hover:text-blue-600'
          }`}>
          {saved ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
        </button>
      </div>

      {/* Meta grid */}
      <div className="grid grid-cols-2 gap-y-2 gap-x-2">
        {[
          { Icon: MapPin,       color: 'text-blue-500',   val: job.location },
          { Icon: TrendingUp,   color: 'text-teal-500',   val: job.experience },
          { Icon: IndianRupee,  color: 'text-amber-500',  val: job.salary },
          { Icon: Users,        color: 'text-purple-500', val: `${job.openings} Opening${job.openings > 1 ? 's' : ''}` },
        ].map(({ Icon, color, val }) => (
          <div key={val} className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-md bg-slate-50 flex items-center justify-center flex-shrink-0">
              <Icon size={11} className={color} />
            </div>
            <span className="text-xs text-slate-600 font-medium truncate">{val}</span>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="h-px bg-slate-100" />

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 items-center">
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${tc.bg} ${tc.text} ${tc.border}`}>
          {job.type}
        </span>
        {job.tags.map(tag => (
          <span key={tag} className="text-xs font-medium px-2.5 py-1 rounded-full bg-slate-50 text-slate-500 border border-slate-100">
            {tag}
          </span>
        ))}
      </div>

      {/* Footer — posted + actions */}
      <div className="flex items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-1 text-slate-400">
          <Clock size={11} />
          <span className="text-xs">{job.posted}</span>
        </div>
        <div className="flex items-center gap-2">
          <button 
          onClick={()=>navigate(`/jobs/${job.id}`)}
          className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-0.5 transition-colors">
            View Details <ChevronRight size={12} />
          </button>
          <button className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
            style={{ boxShadow: '0 2px 8px rgba(37,99,235,0.25)' }}>
            Apply Now <ArrowRight size={12} />
          </button>
        </div>
      </div>
    </div>
  )
}

/* ─── FeaturedJobsSection ─────────────────────────────────────────────── */
const FeaturedJobsSection = () => {
  const [activeFilter, setActiveFilter] = useState('All')
  const filters = ['All', 'Full-time', 'Remote', 'Contract', 'Urgent']

  const filtered = jobs.filter(j => {
    if (activeFilter === 'All') return true
    if (activeFilter === 'Urgent') return j.urgent
    return j.type === activeFilter
  })

  return (
    <section className="relative py-20" style={{ background: '#F1F5F9' }}>

      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg,transparent,#BFDBFE,transparent)' }} />

      <div className="max-w-7xl mx-auto px-6 lg:px-10">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold px-3.5 py-1.5 rounded-full mb-3">
              <Star size={11} fill="#3B82F6" className="text-blue-500" />
              Featured Opportunities
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight"
              style={{ letterSpacing: '-0.025em', fontFamily: "'Outfit',sans-serif" }}>
              Latest &amp; Urgent{' '}
              <span style={{ background: 'linear-gradient(135deg,#2563EB,#14B8A6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Job Openings
              </span>
            </h2>
            <p className="text-slate-500 text-sm mt-2 max-w-md">
              Hand-picked roles from top organizations. New jobs added every day.
            </p>
          </div>
          <a href="#"
            className="flex items-center gap-2 text-blue-600 font-semibold text-sm hover:text-blue-800 transition-colors whitespace-nowrap pb-1 border-b-2 border-blue-200 hover:border-blue-600 self-end sm:self-auto">
            View All Jobs <ArrowRight size={14} />
          </a>
        </div>

        {/* ── Filter bar ── */}
        <div className="flex items-center gap-2 flex-wrap mb-8">
          <div className="flex items-center gap-1.5 text-slate-400 mr-1">
            <SlidersHorizontal size={14} />
            <span className="text-xs font-medium">Filter:</span>
          </div>
          {filters.map(f => (
            <button key={f} onClick={() => setActiveFilter(f)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 ${
                activeFilter === f
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-600'
              }`}
              style={activeFilter === f ? { boxShadow: '0 2px 10px rgba(37,99,235,0.30)' } : {}}>
              {f === 'Urgent' && '⚡ '}{f}
            </button>
          ))}
          <span className="ml-auto text-xs text-slate-400 font-medium">
            {filtered.length} role{filtered.length !== 1 ? 's' : ''} found
          </span>
        </div>

        {/* ── Grid ── */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {filtered.map(job => <JobCard key={job.id} job={job} />)}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-slate-400">
            <Briefcase size={40} className="mb-3 opacity-30" />
            <p className="text-sm font-medium">No jobs match this filter.</p>
          </div>
        )}

        {/* ── Bottom CTA banner ── */}
        <div className="mt-12 rounded-2xl overflow-hidden relative flex flex-col sm:flex-row items-center justify-between gap-6 px-8 py-7"
          style={{ background: 'linear-gradient(135deg,#1E40AF 0%,#2563EB 55%,#0D9488 100%)' }}>
          <div className="absolute right-0 top-0 w-48 h-48 rounded-full opacity-10 -translate-y-1/3 translate-x-1/4 bg-white" />
          <div className="absolute left-1/3 bottom-0 w-32 h-32 rounded-full opacity-10 translate-y-1/2 bg-white" />
          <div className="relative z-10 text-center sm:text-left">
            <h3 className="text-white font-bold text-xl" style={{ fontFamily: "'Outfit',sans-serif" }}>
              Can't find what you're looking for?
            </h3>
            <p className="text-blue-100 text-sm mt-1">
              Upload your resume and let recruiters come to you.
            </p>
          </div>
          <button className="relative z-10 flex items-center gap-2 bg-white text-blue-700 font-bold text-sm px-6 py-3 rounded-xl hover:bg-blue-50 transition-all flex-shrink-0"
            style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}>
            Upload Resume <ArrowRight size={15} />
          </button>
        </div>

      </div>
    </section>
  )
}

export default FeaturedJobsSection