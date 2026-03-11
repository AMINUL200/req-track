import React, { useState } from 'react'
import {
  MapPin, TrendingUp, IndianRupee, Clock, Zap, Star,
  Briefcase, Building2, BadgeCheck, Bookmark, BookmarkCheck,
  Share2, Copy, ChevronRight, Home, ArrowRight, ArrowLeft,
  CheckCircle2, Users, Eye, Calendar, GraduationCap, Award,
  Linkedin, Twitter, MessageCircle, Flag, ExternalLink,
  X, Upload, Send, Globe, Phone, Mail, AlertCircle,
  Target, Layers, Shield, Heart, BarChart3, Sparkles,
  ClipboardList, FileText, Hash, ChevronDown
} from 'lucide-react'

/* ════════════════════════════════════════════
   MOCK DATA
════════════════════════════════════════════ */
const JOB = {
  id: 1,
  title: 'Senior Frontend Developer',
  company: 'ABC Technologies',
  companyLogo: '🏢',
  companyLogoBg: '#EFF6FF',
  companySize: '200–500 employees',
  companyIndustry: 'IT Services & Consulting',
  companyHQ: 'Bangalore, India',
  companyAbout: 'ABC Technologies is a leading software development company specializing in enterprise web applications and digital transformation. We partner with Fortune 500 companies to deliver cutting-edge technology solutions that drive real business impact.',
  companyWebsite: 'https://abctech.in',
  location: 'Bangalore',
  expMin: 3, expMax: 6,
  salMin: 12, salMax: 22,
  type: 'permanent',
  openings: 3,
  posted: '2 days ago',
  deadline: 'July 20, 2026',
  urgent: true,
  featured: true,
  applicants: 34,
  views: 240,
  rating: 4.8,
  skills: ['React', 'TypeScript', 'Redux', 'Tailwind CSS', 'REST APIs', 'Git', 'Next.js', 'Jest'],
  description: `We are looking for a passionate and experienced Senior Frontend Developer to join our growing engineering team. In this role, you will lead the development of modern, performant web applications that serve millions of users daily.\n\nYou will work closely with our product managers, UX designers, and backend engineers to translate complex requirements into elegant user interfaces. If you love building things that people actually use and care deeply about performance and accessibility, this role is for you.\n\nThis is a high-impact role with opportunities for technical leadership and career growth within a collaborative, fast-paced environment.`,
  responsibilities: [
    'Build and maintain high-quality, reusable React components and front-end libraries',
    'Lead technical architecture decisions for front-end systems',
    'Collaborate with UX/UI designers to implement pixel-perfect interfaces',
    'Optimize applications for maximum performance, speed, and scalability',
    'Write clean, well-documented, and testable code using modern best practices',
    'Conduct code reviews and mentor junior developers',
    'Integrate RESTful APIs and third-party services',
    'Participate in agile ceremonies and contribute to sprint planning',
  ],
  qualifications: [
    "Bachelor's degree in Computer Science, Engineering, or equivalent experience",
    '3+ years of professional experience with React.js',
    'Strong proficiency in TypeScript and modern JavaScript (ES6+)',
    'Experience with state management (Redux, Zustand, or Context API)',
    'Familiarity with testing frameworks like Jest and React Testing Library',
    'Solid understanding of HTML5, CSS3, and responsive design principles',
    'Experience with CI/CD pipelines and version control (Git)',
  ],
  benefits: [
    'Competitive salary + performance bonuses',
    'Flexible work hours & hybrid model',
    'Health & dental insurance',
    'Annual learning & development budget (₹50,000)',
    'Team offsites and company retreats',
    '24 days paid leave per year',
  ],
  education: "Bachelor's degree in Computer Science or equivalent",
  joining: 'Immediate / 30 days notice',
  category: 'Technology',
  remote: false,
}

const SIMILAR_JOBS = [
  { id:2, title:'React Developer', company:'NexGen Labs', logo:'⚛️', logoBg:'#EFF6FF', location:'Bangalore', salMin:10, salMax:18, type:'permanent', urgent:false, posted:'1d ago' },
  { id:3, title:'Frontend Engineer', company:'CloudSoft Inc.', logo:'☁️', logoBg:'#F0FDFA', location:'Remote', salMin:12, salMax:20, type:'remote', urgent:true, posted:'3h ago' },
  { id:4, title:'Fullstack Developer', company:'BuildFast Co.', logo:'🔨', logoBg:'#FFF7ED', location:'Pune', salMin:14, salMax:24, type:'permanent', urgent:false, posted:'2d ago' },
]

const typeLabel = { permanent:'Permanent', contract:'Contract', remote:'Remote', govt_post:'Govt' }
const typeStyle = {
  permanent:{ bg:'bg-blue-50', text:'text-blue-700', border:'border-blue-100' },
  remote:   { bg:'bg-teal-50', text:'text-teal-700', border:'border-teal-100' },
  contract: { bg:'bg-amber-50',text:'text-amber-700',border:'border-amber-100' },
}
const F = { fontFamily:"'Outfit',sans-serif" }

/* ════════════════════════════════════════════
   NAVBAR
════════════════════════════════════════════ */
const Navbar = () => (
  <nav className="sticky top-0 z-50 bg-white border-b border-slate-100" style={{ boxShadow:'0 1px 12px rgba(0,0,0,0.06)' }}>
    <div className="max-w-7xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between gap-6">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background:'linear-gradient(135deg,#2563EB,#14B8A6)' }}>
          <Briefcase size={15} className="text-white" />
        </div>
        <span className="text-lg font-black text-slate-900" style={{ ...F, letterSpacing:'-0.03em' }}>
          Req<span style={{ background:'linear-gradient(135deg,#2563EB,#14B8A6)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Track</span>
        </span>
      </div>
      <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-500">
        {['Jobs','Companies','Resources','About'].map(n=>(
          <a key={n} href="#" className={`hover:text-blue-600 transition-colors ${n==='Jobs'?'text-blue-600 font-bold':''}`} style={F}>{n}</a>
        ))}
      </div>
      <div className="flex items-center gap-2.5">
        <button className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-blue-600 px-3 py-1.5 transition-colors" style={F}>Sign In</button>
        <button className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white font-bold text-sm rounded-xl hover:bg-blue-700 transition-all" style={{ ...F, boxShadow:'0 2px 10px rgba(37,99,235,0.30)' }}>
          Post a Job
        </button>
      </div>
    </div>
  </nav>
)

/* ════════════════════════════════════════════
   BREADCRUMB
════════════════════════════════════════════ */
const Breadcrumb = ({ title }) => (
  <div className="max-w-7xl mx-auto px-6 lg:px-10 py-4">
    <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium flex-wrap" style={F}>
      {[{ icon:Home, label:'Home', href:'/' }, { label:'Jobs', href:'/jobs' }, { label:title }].map((b,i,arr)=>(
        <React.Fragment key={i}>
          {b.href
            ? <a href={b.href} className="flex items-center gap-1 hover:text-blue-600 transition-colors">{b.icon&&<b.icon size={12}/>}{b.label}</a>
            : <span className="text-slate-700 font-semibold truncate max-w-[200px]">{b.label}</span>
          }
          {i<arr.length-1 && <ChevronRight size={12} className="text-slate-300 flex-shrink-0"/>}
        </React.Fragment>
      ))}
    </div>
  </div>
)

/* ════════════════════════════════════════════
   JOB HEADER
════════════════════════════════════════════ */
const JobHeader = ({ job, saved, setSaved, onApply, onShare }) => (
  <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-6" style={{ boxShadow:'0 2px 16px rgba(0,0,0,0.05)' }}>
    <div className="flex flex-col sm:flex-row sm:items-start gap-5">
      {/* Logo */}
      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl flex-shrink-0 border border-slate-100" style={{ background:job.companyLogoBg }}>
        {job.companyLogo}
      </div>
      <div className="flex-1 min-w-0">
        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-2">
          {job.urgent && (
            <span className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full text-white" style={{ background:'linear-gradient(135deg,#EF4444,#F59E0B)', boxShadow:'0 2px 8px rgba(239,68,68,0.35)' }}>
              <Zap size={10} fill="white"/> Urgent Hiring
            </span>
          )}
          {job.featured && (
            <span className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full text-white" style={{ background:'linear-gradient(135deg,#F59E0B,#EF4444)' }}>
              <Star size={10} fill="white"/> Featured
            </span>
          )}
          <span className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-green-50 text-green-700 border border-green-100">
            <CheckCircle2 size={10}/> Actively Hiring
          </span>
        </div>
        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-1 leading-tight" style={{ ...F, letterSpacing:'-0.02em' }}>{job.title}</h1>
        {/* Company */}
        <div className="flex items-center gap-2 mb-3">
          <a href="#company" className="flex items-center gap-1.5 text-blue-600 font-semibold text-sm hover:underline" style={F}>
            <Building2 size={13}/> {job.company} <BadgeCheck size={13}/>
          </a>
          <span className="text-slate-300">·</span>
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_,i)=><Star key={i} size={11} fill={i<Math.floor(job.rating)?'#F59E0B':'none'} className={i<Math.floor(job.rating)?'text-amber-400':'text-slate-200'}/>)}
            <span className="text-xs text-slate-500 ml-1 font-medium">{job.rating}</span>
          </div>
        </div>
        {/* Meta chips */}
        <div className="flex flex-wrap gap-2 mb-4">
          {[
            { Icon:MapPin,      val:job.location,                           color:'#2563EB', bg:'#EFF6FF' },
            { Icon:TrendingUp,  val:`${job.expMin}–${job.expMax} Years`,    color:'#14B8A6', bg:'#F0FDFA' },
            { Icon:IndianRupee, val:`₹${job.salMin}L – ₹${job.salMax}L`,   color:'#F59E0B', bg:'#FFFBEB' },
            { Icon:Briefcase,   val:typeLabel[job.type],                    color:'#8B5CF6', bg:'#F5F3FF' },
            { Icon:Users,       val:`${job.openings} Opening${job.openings>1?'s':''}`, color:'#22C55E', bg:'#F0FDF4' },
          ].map(({ Icon, val, color, bg })=>(
            <div key={val} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold" style={{ background:bg, color, border:`1px solid ${color}20` }}>
              <Icon size={12}/> {val}
            </div>
          ))}
        </div>
        {/* Bottom row */}
        <div className="flex flex-wrap items-center gap-3">
          <button onClick={onApply}
            className="flex items-center gap-2 px-7 py-2.5 text-white font-bold text-sm rounded-xl transition-all hover:-translate-y-0.5"
            style={{ ...F, background:'linear-gradient(135deg,#2563EB,#1D4ED8)', boxShadow:'0 4px 16px rgba(37,99,235,0.35)' }}>
            <Send size={15}/> Apply Now
          </button>
          <button onClick={()=>setSaved(s=>!s)}
            className="flex items-center gap-2 px-5 py-2.5 font-bold text-sm rounded-xl border-2 transition-all hover:-translate-y-0.5"
            style={{ ...F, borderColor:saved?'#2563EB':'#E2E8F0', color:saved?'#2563EB':'#64748B', background:saved?'#EFF6FF':'#FFFFFF' }}>
            {saved?<BookmarkCheck size={15}/>:<Bookmark size={15}/>} {saved?'Saved':'Save Job'}
          </button>
          <button onClick={onShare}
            className="flex items-center gap-2 px-5 py-2.5 font-semibold text-sm rounded-xl border border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-600 transition-all"
            style={F}>
            <Share2 size={15}/> Share
          </button>
          <div className="ml-auto flex items-center gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-1"><Eye size={12}/>{job.views} views</span>
            <span className="flex items-center gap-1"><Users size={12}/>{job.applicants} applied</span>
            <span className="flex items-center gap-1"><Clock size={12}/>Posted {job.posted}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
)

/* ════════════════════════════════════════════
   JOB DESCRIPTION
════════════════════════════════════════════ */
const Section = ({ icon:Icon, title, color='#2563EB', children }) => (
  <div className="mb-8">
    <div className="flex items-center gap-2.5 mb-4">
      <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background:`${color}15` }}>
        <Icon size={16} style={{ color }}/>
      </div>
      <h2 className="text-base font-extrabold text-slate-900" style={F}>{title}</h2>
    </div>
    {children}
  </div>
)

const JobDescription = ({ text }) => (
  <Section icon={FileText} title="Job Description">
    {text.split('\n\n').map((para,i)=>(
      <p key={i} className="text-slate-600 text-sm leading-relaxed mb-3 last:mb-0">{para}</p>
    ))}
  </Section>
)

const JobResponsibilities = ({ items }) => (
  <Section icon={ClipboardList} title="Key Responsibilities" color="#14B8A6">
    <ul className="flex flex-col gap-2.5">
      {items.map((r,i)=>(
        <li key={i} className="flex items-start gap-3">
          <div className="w-5 h-5 rounded-full bg-teal-50 border border-teal-100 flex items-center justify-center flex-shrink-0 mt-0.5">
            <ChevronRight size={10} className="text-teal-600"/>
          </div>
          <span className="text-slate-600 text-sm leading-relaxed">{r}</span>
        </li>
      ))}
    </ul>
  </Section>
)

const JobSkills = ({ skills }) => (
  <Section icon={Hash} title="Skills Required" color="#8B5CF6">
    <div className="flex flex-wrap gap-2">
      {skills.map(s=>(
        <span key={s} className="flex items-center gap-1.5 text-sm font-semibold px-3.5 py-2 rounded-xl border transition-all hover:-translate-y-0.5 cursor-default"
          style={{ background:'#F0FDFA', borderColor:'#99F6E4', color:'#0D9488', boxShadow:'0 1px 4px rgba(20,184,166,0.10)' }}>
          <Sparkles size={11} className="text-teal-400"/>{s}
        </span>
      ))}
    </div>
  </Section>
)

const JobQualifications = ({ items, education, joining }) => (
  <Section icon={GraduationCap} title="Qualifications & Education" color="#F59E0B">
    <ul className="flex flex-col gap-2.5 mb-4">
      {items.map((q,i)=>(
        <li key={i} className="flex items-start gap-3">
          <CheckCircle2 size={15} className="text-amber-500 flex-shrink-0 mt-0.5"/>
          <span className="text-slate-600 text-sm leading-relaxed">{q}</span>
        </li>
      ))}
    </ul>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div className="flex items-center gap-3 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
        <GraduationCap size={16} className="text-amber-600 flex-shrink-0"/>
        <div>
          <div className="text-xs text-amber-600 font-semibold">Education</div>
          <div className="text-xs text-slate-700 font-medium mt-0.5">{education}</div>
        </div>
      </div>
      <div className="flex items-center gap-3 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
        <Calendar size={16} className="text-blue-600 flex-shrink-0"/>
        <div>
          <div className="text-xs text-blue-600 font-semibold">Joining</div>
          <div className="text-xs text-slate-700 font-medium mt-0.5">{joining}</div>
        </div>
      </div>
    </div>
  </Section>
)

const JobBenefits = ({ items }) => (
  <Section icon={Heart} title="Perks & Benefits" color="#EF4444">
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
      {items.map((b,i)=>(
        <div key={i} className="flex items-center gap-2.5 bg-red-50 border border-red-100 rounded-xl px-4 py-2.5">
          <Award size={13} className="text-red-500 flex-shrink-0"/>
          <span className="text-sm text-slate-700 font-medium">{b}</span>
        </div>
      ))}
    </div>
  </Section>
)

/* ════════════════════════════════════════════
   JOB SUMMARY CARD
════════════════════════════════════════════ */
const JobSummaryCard = ({ job }) => {
  const rows = [
    { icon:Briefcase,   label:'Job Title',     val:job.title },
    { icon:MapPin,      label:'Location',      val:job.location },
    { icon:TrendingUp,  label:'Experience',    val:`${job.expMin}–${job.expMax} Years` },
    { icon:IndianRupee, label:'Salary',        val:`₹${job.salMin}L – ₹${job.salMax}L` },
    { icon:Users,       label:'Openings',      val:`${job.openings} Positions` },
    { icon:Target,      label:'Type',          val:typeLabel[job.type] },
    { icon:Calendar,    label:'Deadline',      val:job.deadline },
    { icon:GraduationCap,label:'Education',   val:job.education },
  ]
  return(
    <div className="bg-white rounded-2xl border border-slate-200 p-5 mb-4" style={{ boxShadow:'0 2px 12px rgba(0,0,0,0.04)' }}>
      <div className="flex items-center gap-2 mb-4">
        <Layers size={15} className="text-blue-600"/>
        <h3 className="text-sm font-bold text-slate-900" style={F}>Job Overview</h3>
      </div>
      <div className="flex flex-col gap-3">
        {rows.map(r=>{
          const Icon=r.icon
          return(
            <div key={r.label} className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Icon size={13} className="text-slate-500"/>
              </div>
              <div className="min-w-0">
                <div className="text-[10.5px] text-slate-400 font-semibold uppercase tracking-wider">{r.label}</div>
                <div className="text-xs text-slate-800 font-semibold mt-0.5 truncate" style={F}>{r.val}</div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════
   APPLY CARD
════════════════════════════════════════════ */
const ApplyCard = ({ job, onApply, saved, setSaved }) => (
  <div className="bg-white rounded-2xl border-2 border-blue-100 p-5 mb-4" style={{ boxShadow:'0 4px 24px rgba(37,99,235,0.10)' }}>
    {/* Already applied banner */}
    <div className="flex items-center gap-2 bg-green-50 border border-green-100 rounded-xl px-3 py-2.5 mb-4">
      <CheckCircle2 size={14} className="text-green-600 flex-shrink-0"/>
      <div>
        <div className="text-xs font-bold text-green-700" style={F}>Application Under Review</div>
        <div className="text-[10.5px] text-green-600">You applied 3 days ago</div>
      </div>
    </div>

    <div className="text-center mb-4">
      <div className="text-sm font-bold text-slate-900 mb-0.5" style={F}>Apply for this Job</div>
      <div className="flex items-center justify-center gap-1.5 text-xs text-red-500 font-semibold">
        <Clock size={11}/> Apply before: <span className="font-bold">{job.deadline}</span>
      </div>
    </div>

    <button onClick={onApply}
      className="w-full flex items-center justify-center gap-2 py-3 text-white font-bold text-sm rounded-xl mb-3 transition-all hover:-translate-y-0.5"
      style={{ ...F, background:'linear-gradient(135deg,#2563EB,#1D4ED8)', boxShadow:'0 4px 16px rgba(37,99,235,0.35)' }}>
      <Send size={15}/> Apply Now
    </button>
    <button onClick={()=>setSaved(s=>!s)}
      className="w-full flex items-center justify-center gap-2 py-2.5 font-semibold text-sm rounded-xl border-2 transition-all mb-4"
      style={{ ...F, borderColor:saved?'#2563EB':'#E2E8F0', color:saved?'#2563EB':'#64748B', background:saved?'#EFF6FF':'transparent' }}>
      {saved?<BookmarkCheck size={14}/>:<Bookmark size={14}/>} {saved?'Saved':'Save Job'}
    </button>

    <div className="h-px bg-slate-100 mb-4"/>
    <div className="grid grid-cols-2 gap-3 mb-2">
      {[
        { icon:Users, val:job.applicants, label:'Applicants', color:'#2563EB' },
        { icon:Eye,   val:job.views,     label:'Views',       color:'#14B8A6' },
      ].map(s=>{
        const Icon=s.icon
        return(
          <div key={s.label} className="text-center rounded-xl py-2.5" style={{ background:`${s.color}08`, border:`1px solid ${s.color}20` }}>
            <Icon size={16} style={{ color:s.color }} className="mx-auto mb-1"/>
            <div className="text-base font-black" style={{ color:s.color, ...F }}>{s.val}</div>
            <div className="text-[10px] text-slate-400 font-medium">{s.label}</div>
          </div>
        )
      })}
    </div>
    <div className="flex items-center gap-1.5 justify-center mt-3">
      <Flag size={11} className="text-slate-300"/>
      <button className="text-[10.5px] text-slate-400 hover:text-red-500 transition-colors font-medium">Report this job</button>
    </div>
  </div>
)

/* ════════════════════════════════════════════
   COMPANY INFO
════════════════════════════════════════════ */
const CompanyInfo = ({ job }) => (
  <div className="bg-white rounded-2xl border border-slate-200 p-5 mb-4" style={{ boxShadow:'0 2px 12px rgba(0,0,0,0.04)' }}>
    <div className="flex items-center gap-2 mb-4">
      <Building2 size={15} className="text-blue-600"/>
      <h3 className="text-sm font-bold text-slate-900" style={F}>About the Company</h3>
    </div>
    <div className="flex items-center gap-3 mb-3">
      <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl border border-slate-100 flex-shrink-0" style={{ background:job.companyLogoBg }}>
        {job.companyLogo}
      </div>
      <div>
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-bold text-slate-900" style={F}>{job.company}</span>
          <BadgeCheck size={13} className="text-blue-500"/>
        </div>
        <div className="flex items-center gap-0.5 mt-0.5">
          {[...Array(5)].map((_,i)=><Star key={i} size={10} fill={i<Math.floor(job.rating)?'#F59E0B':'none'} className={i<Math.floor(job.rating)?'text-amber-400':'text-slate-200'}/>)}
          <span className="text-[10.5px] text-slate-400 ml-1">{job.rating}</span>
        </div>
      </div>
    </div>
    <p className="text-xs text-slate-500 leading-relaxed mb-4">{job.companyAbout}</p>
    <div className="flex flex-col gap-2 mb-4">
      {[
        { icon:BarChart3, label:'Industry',  val:job.companyIndustry },
        { icon:Users,     label:'Size',      val:job.companySize },
        { icon:MapPin,    label:'HQ',        val:job.companyHQ },
        { icon:Globe,     label:'Website',   val:'abctech.in', link:true },
      ].map(r=>{
        const Icon=r.icon
        return(
          <div key={r.label} className="flex items-center gap-2.5">
            <Icon size={12} className="text-slate-400 flex-shrink-0"/>
            <span className="text-[10.5px] text-slate-400 w-14 flex-shrink-0">{r.label}</span>
            {r.link
              ? <a href={job.companyWebsite} className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1">{r.val}<ExternalLink size={9}/></a>
              : <span className="text-xs text-slate-700 font-medium">{r.val}</span>
            }
          </div>
        )
      })}
    </div>
    <a href="#company" className="flex items-center justify-center gap-1.5 w-full py-2.5 text-xs font-bold rounded-xl border-2 border-blue-100 text-blue-600 hover:bg-blue-50 transition-all" style={F}>
      View Company Profile <ExternalLink size={12}/>
    </a>
  </div>
)

/* ════════════════════════════════════════════
   SHARE JOB
════════════════════════════════════════════ */
const ShareJob = () => {
  const [copied,setCopied]=useState(false)
  const copy=()=>{ setCopied(true); setTimeout(()=>setCopied(false),2000) }
  return(
    <div className="bg-white rounded-2xl border border-slate-200 p-5" style={{ boxShadow:'0 2px 12px rgba(0,0,0,0.04)' }}>
      <div className="flex items-center gap-2 mb-4">
        <Share2 size={15} className="text-blue-600"/>
        <h3 className="text-sm font-bold text-slate-900" style={F}>Share this Job</h3>
      </div>
      <div className="flex flex-col gap-2">
        {[
          { icon:Copy,            label:copied?'Link Copied!':'Copy Link',     color:'#2563EB', bg:'#EFF6FF', border:'#BFDBFE', fn:copy },
          { icon:MessageCircle,   label:'Share on WhatsApp', color:'#22C55E', bg:'#F0FDF4', border:'#BBF7D0', fn:()=>{} },
          { icon:Linkedin,        label:'Share on LinkedIn', color:'#0A66C2', bg:'#EFF6FF', border:'#BFDBFE', fn:()=>{} },
          { icon:Twitter,         label:'Share on Twitter',  color:'#1DA1F2', bg:'#EFF6FF', border:'#BFDBFE', fn:()=>{} },
        ].map(b=>{
          const Icon=b.icon
          return(
            <button key={b.label} onClick={b.fn}
              className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border text-xs font-semibold transition-all hover:-translate-y-0.5"
              style={{ background:b.bg, borderColor:b.border, color:b.color, ...F }}>
              <Icon size={14}/> {b.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════
   SIMILAR JOBS
════════════════════════════════════════════ */
const SimilarJobs = ({ jobs }) => (
  <div className="mt-8 mb-6">
    <div className="flex items-center justify-between mb-5">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Sparkles size={15} className="text-blue-500"/>
          <h2 className="text-lg font-extrabold text-slate-900" style={{ ...F, letterSpacing:'-0.02em' }}>Similar Jobs</h2>
        </div>
        <p className="text-xs text-slate-400 font-medium">You might also be interested in these</p>
      </div>
      <a href="#" className="flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors pb-0.5 border-b-2 border-blue-200 hover:border-blue-600" style={F}>
        View All <ArrowRight size={13}/>
      </a>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {jobs.map(j=>{
        const tc=typeStyle[j.type]||typeStyle['permanent']
        return(
          <a key={j.id} href="#"
            className="group bg-white rounded-2xl border border-slate-100 p-5 flex flex-col gap-3 transition-all duration-300 hover:-translate-y-1.5 hover:border-blue-200 hover:shadow-lg"
            style={{ boxShadow:'0 2px 10px rgba(0,0,0,0.04)', textDecoration:'none' }}>
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl border border-slate-100 flex-shrink-0" style={{ background:j.logoBg }}>{j.logo}</div>
                <div>
                  <div className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug" style={F}>{j.title}</div>
                  <div className="text-xs text-slate-400 font-medium">{j.company}</div>
                </div>
              </div>
              {j.urgent&&<span className="text-[9.5px] font-bold px-1.5 py-0.5 rounded-full text-white flex-shrink-0" style={{ background:'linear-gradient(135deg,#EF4444,#F59E0B)' }}>URGENT</span>}
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
              <span className="flex items-center gap-1"><MapPin size={10} className="text-blue-400"/>{j.location}</span>
              <span className="flex items-center gap-1"><IndianRupee size={10} className="text-amber-400"/>₹{j.salMin}L–₹{j.salMax}L</span>
            </div>
            <div className="flex items-center justify-between">
              <span className={`text-[10.5px] font-semibold px-2 py-0.5 rounded-full border ${tc.bg} ${tc.text} ${tc.border}`}>{typeLabel[j.type]}</span>
              <span className="flex items-center gap-1 text-[10.5px] text-slate-400"><Clock size={9}/>{j.posted}</span>
            </div>
          </a>
        )
      })}
    </div>
  </div>
)

/* ════════════════════════════════════════════
   APPLY MODAL
════════════════════════════════════════════ */
const ApplyModal = ({ job, onClose }) => {
  const [form,setForm]=useState({ name:'', email:'', phone:'', cover:'' })
  const [submitted,setSubmitted]=useState(false)
  const [fileName,setFileName]=useState('')

  if(submitted){
    return(
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}/>
        <div className="relative bg-white rounded-3xl p-10 w-full max-w-md text-center" style={{ boxShadow:'0 24px 64px rgba(0,0,0,0.20)' }}>
          <div className="w-20 h-20 rounded-3xl bg-green-50 border-2 border-green-100 flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 size={36} className="text-green-500"/>
          </div>
          <h3 className="text-xl font-extrabold text-slate-900 mb-2" style={F}>Application Submitted!</h3>
          <p className="text-slate-500 text-sm mb-6">Your application for <strong>{job.title}</strong> at <strong>{job.company}</strong> has been sent. We'll notify you of any updates.</p>
          <button onClick={onClose} className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all" style={F}>Close</button>
        </div>
      </div>
    )
  }

  return(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}/>
      <div className="relative bg-white rounded-3xl w-full max-w-lg overflow-hidden" style={{ boxShadow:'0 24px 64px rgba(0,0,0,0.20)' }}>
        {/* Modal header */}
        <div className="px-7 pt-7 pb-5 border-b border-slate-100">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center text-lg" style={{ background:job.companyLogoBg }}>{job.companyLogo}</div>
                <span className="text-sm font-semibold text-slate-500" style={F}>{job.company}</span>
              </div>
              <h3 className="text-xl font-extrabold text-slate-900" style={{ ...F, letterSpacing:'-0.02em' }}>Apply for {job.title}</h3>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-all flex-shrink-0 mt-1">
              <X size={16}/>
            </button>
          </div>
        </div>
        {/* Form */}
        <div className="px-7 py-5 max-h-[60vh] overflow-y-auto">
          <div className="flex flex-col gap-4">
            {[
              { key:'name',  label:'Full Name',     placeholder:'Rahul Sharma',          type:'text' },
              { key:'email', label:'Email Address', placeholder:'rahul@example.com',     type:'email' },
              { key:'phone', label:'Phone Number',  placeholder:'+91 98765 43210',       type:'tel' },
            ].map(f=>(
              <div key={f.key}>
                <label className="block text-xs font-bold text-slate-700 mb-1.5" style={F}>{f.label} <span className="text-red-500">*</span></label>
                <input type={f.type} placeholder={f.placeholder} value={form[f.key]}
                  onChange={e=>setForm(p=>({...p,[f.key]:e.target.value}))}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-900 outline-none placeholder-slate-400 transition-all focus:border-blue-500 focus:shadow-sm"
                  style={{ ...F, background:'#F8FAFC' }} />
              </div>
            ))}
            {/* Resume upload */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5" style={F}>Resume <span className="text-red-500">*</span></label>
              <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-slate-200 rounded-xl py-5 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all">
                <Upload size={20} className="text-slate-400"/>
                <span className="text-xs font-semibold text-slate-500" style={F}>{fileName||'Click to upload PDF / DOC'}</span>
                <span className="text-[10.5px] text-slate-400">Max file size: 5MB</span>
                <input type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={e=>setFileName(e.target.files[0]?.name||'')}/>
              </label>
            </div>
            {/* Cover letter */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5" style={F}>Cover Letter <span className="text-slate-400 font-normal">(Optional)</span></label>
              <textarea rows={4} placeholder="Tell us why you're a great fit for this role..."
                value={form.cover} onChange={e=>setForm(p=>({...p,cover:e.target.value}))}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-900 outline-none placeholder-slate-400 resize-none transition-all focus:border-blue-500"
                style={{ ...F, background:'#F8FAFC' }}/>
            </div>
          </div>
        </div>
        {/* Footer */}
        <div className="px-7 pb-7 pt-4 border-t border-slate-100">
          <button onClick={()=>setSubmitted(true)}
            className="w-full flex items-center justify-center gap-2 py-3.5 text-white font-bold text-sm rounded-xl transition-all hover:-translate-y-0.5"
            style={{ ...F, background:'linear-gradient(135deg,#2563EB,#1D4ED8)', boxShadow:'0 4px 16px rgba(37,99,235,0.35)' }}>
            <Send size={15}/> Submit Application
          </button>
          <p className="text-[10.5px] text-slate-400 text-center mt-3 flex items-center justify-center gap-1">
            <Shield size={10}/> Your data is encrypted and secure
          </p>
        </div>
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════
   JOB DETAILS PAGE
════════════════════════════════════════════ */
const JobDetailsPage = () => {
  const [saved,setSaved]=useState(false)
  const [applyOpen,setApplyOpen]=useState(false)

  return(
    <div className='pt-20' style={{ background:'#F1F5F9', minHeight:'100vh', ...F }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap');*{box-sizing:border-box}`}</style>

      {/* <Navbar/> */}
      <Breadcrumb title={JOB.title}/>

      <div className="max-w-7xl mx-auto px-6 lg:px-10 pb-20">
        {/* Back button */}
        <a href="#" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors mb-4" style={F}>
          <ArrowLeft size={13}/> Back to Jobs
        </a>

        {/* Job Header */}
        <JobHeader job={JOB} saved={saved} setSaved={setSaved} onApply={()=>setApplyOpen(true)} onShare={()=>{}}/>

        {/* Two-column layout */}
        <div className="flex gap-6 items-start">

          {/* ── LEFT: Main content ── */}
          <div className="flex-1 min-w-0">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6" style={{ boxShadow:'0 2px 12px rgba(0,0,0,0.04)' }}>
              <JobDescription text={JOB.description}/>
              <div className="h-px bg-slate-100 my-6"/>
              <JobResponsibilities items={JOB.responsibilities}/>
              <div className="h-px bg-slate-100 my-6"/>
              <JobSkills skills={JOB.skills}/>
              <div className="h-px bg-slate-100 my-6"/>
              <JobQualifications items={JOB.qualifications} education={JOB.education} joining={JOB.joining}/>
              <div className="h-px bg-slate-100 my-6"/>
              <JobBenefits items={JOB.benefits}/>
            </div>
            <SimilarJobs jobs={SIMILAR_JOBS}/>
          </div>

          {/* ── RIGHT: Sidebar ── */}
          <aside className="hidden lg:block w-72 xl:w-80 flex-shrink-0 sticky top-20">
            <ApplyCard job={JOB} onApply={()=>setApplyOpen(true)} saved={saved} setSaved={setSaved}/>
            <JobSummaryCard job={JOB}/>
            <CompanyInfo job={JOB}/>
            <ShareJob/>
          </aside>
        </div>

        {/* Mobile: Sticky apply bar */}
        <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white border-t border-slate-200 px-4 py-3 flex gap-3"
          style={{ boxShadow:'0 -4px 20px rgba(0,0,0,0.10)' }}>
          <button onClick={()=>setSaved(s=>!s)}
            className="flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl border-2 font-bold text-sm transition-all flex-shrink-0"
            style={{ borderColor:saved?'#2563EB':'#E2E8F0', color:saved?'#2563EB':'#64748B', background:saved?'#EFF6FF':'transparent', ...F }}>
            {saved?<BookmarkCheck size={16}/>:<Bookmark size={16}/>}
          </button>
          <button onClick={()=>setApplyOpen(true)}
            className="flex-1 flex items-center justify-center gap-2 py-3 text-white font-bold text-sm rounded-xl transition-all"
            style={{ ...F, background:'linear-gradient(135deg,#2563EB,#1D4ED8)', boxShadow:'0 4px 14px rgba(37,99,235,0.35)' }}>
            <Send size={15}/> Apply Now
          </button>
        </div>
      </div>

      {/* CTA Banner */}
      <div className="relative overflow-hidden py-14 px-6" style={{ background:'linear-gradient(135deg,#1E40AF 0%,#2563EB 55%,#0D9488 100%)' }}>
        <div className="absolute right-0 top-0 w-64 h-64 rounded-full opacity-10 -translate-y-1/3 translate-x-1/4 bg-white pointer-events-none"/>
        <div className="max-w-2xl mx-auto text-center relative z-10">
          <h2 className="text-2xl font-extrabold text-white mb-2" style={{ ...F, letterSpacing:'-0.02em' }}>Found your dream role?</h2>
          <p className="text-blue-100 text-sm mb-6">Don't wait — top positions fill fast. Apply now and track your status in real time.</p>
          <button onClick={()=>setApplyOpen(true)}
            className="flex items-center gap-2 px-8 py-3.5 bg-white text-blue-700 font-bold text-sm rounded-xl hover:bg-blue-50 transition-all mx-auto"
            style={{ ...F, boxShadow:'0 4px 16px rgba(0,0,0,0.15)' }}>
            Apply Now <ArrowRight size={15}/>
          </button>
        </div>
      </div>

      {/* Apply Modal */}
      {applyOpen && <ApplyModal job={JOB} onClose={()=>setApplyOpen(false)}/>}
    </div>
  )
}

export default JobDetailsPage