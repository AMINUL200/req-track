import React, { useState, useMemo } from 'react'
import {
  Search, MapPin, TrendingUp, ChevronDown, SlidersHorizontal,
  X, Bookmark, BookmarkCheck, Share2, Copy, ArrowRight,
  ChevronLeft, ChevronRight, Briefcase, Building2, Clock,
  Zap, Star, BadgeCheck, IndianRupee, Users, Filter,
  LayoutGrid, LayoutList, AlertCircle, RotateCcw,
  ExternalLink, Bell, Globe, Hash, Sparkles, Eye,
  CheckCircle2
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

/* ════════════════════════════════════════════
   DATA
════════════════════════════════════════════ */
const JOBS = [
  { id:1,  title:'Senior Frontend Developer',  company:'TechNova Inc.',          logo:'🏢', logoBg:'#EFF6FF', location:'Bangalore', expMin:3, expMax:6,  salMin:12, salMax:22, type:'permanent', skills:['React','TypeScript','Redux','Tailwind'], posted:'1h ago',  urgent:true,  featured:true,  remote:false, category:'Technology', openings:2, rating:4.8 },
  { id:2,  title:'Product Manager – B2B SaaS', company:'GrowthStack Solutions',  logo:'🎯', logoBg:'#FFF7ED', location:'Mumbai',    expMin:4, expMax:8,  salMin:20, salMax:35, type:'remote',    skills:['Agile','Roadmap','Analytics','JIRA'],   posted:'3h ago',  urgent:true,  featured:true,  remote:true,  category:'Product',    openings:1, rating:4.9 },
  { id:3,  title:'Data Scientist',             company:'InsightBridge Analytics',logo:'📊', logoBg:'#F0FDFA', location:'Hyderabad', expMin:2, expMax:5,  salMin:10, salMax:18, type:'permanent', skills:['Python','ML','TensorFlow','SQL'],        posted:'5h ago',  urgent:false, featured:false, remote:false, category:'Data',       openings:3, rating:4.7 },
  { id:4,  title:'UI/UX Designer',             company:'PixelForge Studios',     logo:'🎨', logoBg:'#FDF4FF', location:'Pune',      expMin:2, expMax:5,  salMin:8,  salMax:15, type:'remote',    skills:['Figma','Design Systems','Prototyping'],  posted:'8h ago',  urgent:false, featured:false, remote:true,  category:'Design',     openings:2, rating:4.6 },
  { id:5,  title:'DevOps Engineer',            company:'CloudNine Infrastructure',logo:'⚙️',logoBg:'#F0FDF4', location:'Chennai',   expMin:3, expMax:7,  salMin:14, salMax:24, type:'permanent', skills:['AWS','Kubernetes','Terraform','CI/CD'],  posted:'12h ago', urgent:true,  featured:false, remote:false, category:'Technology', openings:4, rating:4.5 },
  { id:6,  title:'Backend Engineer – Node.js', company:'Nexus Platforms',        logo:'🔧', logoBg:'#FFF1F2', location:'Remote',    expMin:3, expMax:5,  salMin:10, salMax:20, type:'remote',    skills:['Node.js','PostgreSQL','GraphQL','Redis'], posted:'1d ago',  urgent:false, featured:false, remote:true,  category:'Technology', openings:2, rating:4.4 },
  { id:7,  title:'Sales Development Rep',      company:'BizReach Corp',          logo:'📈', logoBg:'#FFF7ED', location:'Delhi',     expMin:1, expMax:3,  salMin:6,  salMax:10, type:'permanent', skills:['B2B Sales','CRM','Cold Outreach'],       posted:'1d ago',  urgent:false, featured:false, remote:false, category:'Sales',      openings:5, rating:4.3 },
  { id:8,  title:'HR Business Partner',        company:'PeopleFirst Solutions',  logo:'🤝', logoBg:'#F5F3FF', location:'Noida',     expMin:4, expMax:7,  salMin:9,  salMax:16, type:'contract',  skills:['HRBP','Talent Management','L&D'],        posted:'2d ago',  urgent:false, featured:false, remote:false, category:'HR',         openings:1, rating:4.6 },
  { id:9,  title:'Android Developer',          company:'AppCraft Technologies',  logo:'📱', logoBg:'#F0FDF4', location:'Bangalore', expMin:2, expMax:4,  salMin:8,  salMax:14, type:'permanent', skills:['Kotlin','Jetpack','Firebase'],           posted:'2d ago',  urgent:false, featured:false, remote:false, category:'Technology', openings:2, rating:4.5 },
  { id:10, title:'Content Strategist',         company:'BrandVoice Agency',      logo:'✍️', logoBg:'#FFFBEB', location:'Mumbai',    expMin:2, expMax:5,  salMin:7,  salMax:12, type:'remote',    skills:['SEO','Content Marketing','Copywriting'],  posted:'3d ago',  urgent:false, featured:false, remote:true,  category:'Marketing',  openings:2, rating:4.4 },
  { id:11, title:'QA Automation Engineer',     company:'TestPilot Labs',         logo:'🧪', logoBg:'#F0FDFA', location:'Hyderabad', expMin:2, expMax:5,  salMin:8,  salMax:14, type:'permanent', skills:['Selenium','Cypress','Jest','Playwright'], posted:'3d ago',  urgent:false, featured:false, remote:false, category:'Technology', openings:3, rating:4.3 },
  { id:12, title:'Finance Analyst',            company:'CapitalEdge Finance',    logo:'💰', logoBg:'#FFFBEB', location:'Chennai',   expMin:2, expMax:4,  salMin:7,  salMax:12, type:'permanent', skills:['Excel','Financial Modelling','ERP'],     posted:'4d ago',  urgent:false, featured:false, remote:false, category:'Finance',    openings:2, rating:4.5 },
]

const LOCATIONS  = ['Bangalore','Mumbai','Delhi','Hyderabad','Pune','Chennai','Noida','Remote']
const SKILLS_LIST= ['React','Node.js','Python','Java','Laravel','TypeScript','AWS','Figma','SQL','Kotlin']
const JOBS_PER_PAGE = 8

/* ════════════════════════════════════════════
   HELPERS
════════════════════════════════════════════ */
const typeLabel = { permanent:'Permanent', contract:'Contract', remote:'Remote', govt_post:'Govt' }
const typeStyle = {
  permanent:{ bg:'bg-blue-50', text:'text-blue-700',  border:'border-blue-100' },
  remote:   { bg:'bg-teal-50', text:'text-teal-700',  border:'border-teal-100' },
  contract: { bg:'bg-amber-50',text:'text-amber-700', border:'border-amber-100' },
  govt_post:{ bg:'bg-green-50',text:'text-green-700', border:'border-green-100' },
}
const expRange = (min, max) => `${min}–${max} yrs`
const salRange = (min, max) => `₹${min}L – ₹${max}L`

/* ════════════════════════════════════════════
   NAVBAR (minimal)
════════════════════════════════════════════ */
const Navbar = () => (
  <nav className="sticky top-0 z-50 bg-white border-b border-slate-100"
    style={{ boxShadow:'0 1px 12px rgba(0,0,0,0.06)' }}>
    <div className="max-w-7xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between gap-6">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center"
          style={{ background:'linear-gradient(135deg,#2563EB,#14B8A6)' }}>
          <Briefcase size={15} className="text-white" />
        </div>
        <span className="text-lg font-black text-slate-900" style={{ fontFamily:"'Outfit',sans-serif", letterSpacing:'-0.03em' }}>
          Req<span style={{ background:'linear-gradient(135deg,#2563EB,#14B8A6)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Track</span>
        </span>
      </div>
      <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-500">
        {['Jobs','Companies','Resources','About'].map(n=>(
          <a key={n} href="#" className={`hover:text-blue-600 transition-colors ${n==='Jobs'?'text-blue-600 font-bold':''}`}
            style={{ fontFamily:"'Outfit',sans-serif" }}>{n}</a>
        ))}
      </div>
      <div className="flex items-center gap-2.5">
        <button className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors px-3 py-1.5"
          style={{ fontFamily:"'Outfit',sans-serif" }}>
          <Bell size={15} /> Alerts
        </button>
        <button className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white font-bold text-sm rounded-xl hover:bg-blue-700 transition-all"
          style={{ fontFamily:"'Outfit',sans-serif", boxShadow:'0 2px 10px rgba(37,99,235,0.30)' }}>
          Post a Job
        </button>
      </div>
    </div>
  </nav>
)

/* ════════════════════════════════════════════
   JOBS HEADER
════════════════════════════════════════════ */
const JobsHeader = ({ total }) => (
  <div className="relative overflow-hidden py-12"
    style={{ background:'linear-gradient(135deg,#F8FAFC 0%,#EFF6FF 50%,#F0FDFA 100%)' }}>
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background:'linear-gradient(90deg,transparent,#BFDBFE,transparent)' }} />
      <div className="absolute -top-20 right-0 w-64 h-64 rounded-full opacity-20"
        style={{ background:'radial-gradient(circle,#DBEAFE,transparent)', filter:'blur(50px)' }} />
      <div className="absolute -bottom-10 left-0 w-48 h-48 rounded-full opacity-15"
        style={{ background:'radial-gradient(circle,#CCFBF1,transparent)', filter:'blur(40px)' }} />
    </div>
    <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10">
      <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold px-3.5 py-1.5 rounded-full mb-4">
        <Sparkles size={11} /> Live Job Board
      </div>
      <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-2"
        style={{ fontFamily:"'Outfit',sans-serif", letterSpacing:'-0.03em' }}>
        Find Your{' '}
        <span style={{ background:'linear-gradient(135deg,#2563EB,#14B8A6)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
          Perfect Job
        </span>
      </h1>
      <p className="text-slate-500 text-base mb-5">
        Browse thousands of job opportunities from trusted companies.
      </p>
      <div className="flex flex-wrap items-center gap-4 text-sm">
        <div className="flex items-center gap-2 bg-white rounded-xl px-4 py-2 border border-slate-200"
          style={{ boxShadow:'0 2px 8px rgba(0,0,0,0.04)' }}>
          <Briefcase size={14} className="text-blue-500" />
          <span className="font-bold text-slate-900" style={{ fontFamily:"'Outfit',sans-serif" }}>{total.toLocaleString()}</span>
          <span className="text-slate-500 font-medium">Jobs Available</span>
        </div>
        {[
          { icon:Building2, val:'500+', label:'Companies', color:'#14B8A6' },
          { icon:Zap,        val:'48',  label:'Urgent',    color:'#EF4444' },
          { icon:Globe,      val:'12K+',label:'Remote',    color:'#8B5CF6' },
        ].map(s=>{
          const Icon=s.icon
          return(
            <div key={s.label} className="hidden sm:flex items-center gap-1.5 text-slate-500 text-sm font-medium">
              <Icon size={13} style={{ color:s.color }} />
              <span className="font-bold text-slate-700" style={{ fontFamily:"'Outfit',sans-serif" }}>{s.val}</span> {s.label}
            </div>
          )
        })}
      </div>
    </div>
  </div>
)

/* ════════════════════════════════════════════
   JOB SEARCH BAR
════════════════════════════════════════════ */
const JobSearchBar = ({ filters, setFilters, onSearch }) => {
  const fields = [
    { key:'keyword', icon:Search,    placeholder:'Job Title / Keyword',   type:'text' },
    { key:'location',icon:MapPin,    placeholder:'Location',               type:'text' },
    { key:'exp',     icon:TrendingUp,placeholder:'Experience',             type:'select',
      opts:['Any','0–1 yr','1–3 yrs','3–5 yrs','5–10 yrs','10+ yrs'] },
    { key:'empType', icon:Briefcase, placeholder:'Job Type',               type:'select',
      opts:['All Types','Permanent','Remote','Contract','Govt Post'] },
  ]
  return(
    <div className="bg-white rounded-2xl border border-slate-200 p-2 flex flex-wrap gap-1.5 items-stretch"
      style={{ boxShadow:'0 4px 24px rgba(37,99,235,0.08)' }}>
      {fields.map((f,i)=>{
        const Icon=f.icon
        return(
          <React.Fragment key={f.key}>
            {i>0 && <div className="hidden sm:block w-px bg-slate-100 my-1" />}
            <div className="flex-1 min-w-[140px] flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-slate-50 border border-transparent
              focus-within:border-blue-500 focus-within:bg-blue-50 transition-all">
              <Icon size={15} className="text-slate-400 flex-shrink-0" />
              {f.type==='text'?(
                <input className="bg-transparent border-none outline-none text-sm text-slate-900 w-full placeholder-slate-400"
                  style={{ fontFamily:"'Outfit',sans-serif" }}
                  placeholder={f.placeholder}
                  value={filters[f.key]||''}
                  onChange={e=>setFilters(p=>({...p,[f.key]:e.target.value}))} />
              ):(
                <select className="bg-transparent border-none outline-none text-sm text-slate-600 w-full cursor-pointer appearance-none"
                  style={{ fontFamily:"'Outfit',sans-serif" }}
                  value={filters[f.key]||''}
                  onChange={e=>setFilters(p=>({...p,[f.key]:e.target.value}))}>
                  {f.opts.map(o=><option key={o}>{o}</option>)}
                </select>
              )}
            </div>
          </React.Fragment>
        )
      })}
      <button onClick={onSearch}
        className="flex items-center gap-2 px-7 py-2.5 text-white font-bold text-sm rounded-xl transition-all duration-200 hover:-translate-y-0.5"
        style={{ background:'linear-gradient(135deg,#2563EB,#1D4ED8)', boxShadow:'0 4px 14px rgba(37,99,235,0.35)', fontFamily:"'Outfit',sans-serif" }}>
        <Search size={15} /> Search
      </button>
    </div>
  )
}

/* ════════════════════════════════════════════
   FILTERS SIDEBAR
════════════════════════════════════════════ */
const FilterSection = ({ title, children, defaultOpen=true }) => {
  const [open,setOpen]=useState(defaultOpen)
  return(
    <div className="border-b border-slate-100 pb-4 mb-4 last:border-0 last:pb-0 last:mb-0">
      <button className="flex items-center justify-between w-full mb-3 group" onClick={()=>setOpen(o=>!o)}>
        <span className="text-xs font-bold text-slate-700 uppercase tracking-widest group-hover:text-blue-600 transition-colors"
          style={{ fontFamily:"'Outfit',sans-serif" }}>{title}</span>
        <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ${open?'rotate-180':''}`} />
      </button>
      {open && <div>{children}</div>}
    </div>
  )
}

const CheckFilter = ({ label, count, checked, onChange, color='#2563EB' }) => (
  <label className="flex items-center justify-between gap-2 py-1.5 cursor-pointer group">
    <div className="flex items-center gap-2.5">
      <div className="w-4 h-4 rounded flex items-center justify-center border transition-all duration-150 flex-shrink-0"
        style={{ background:checked?color:'transparent', borderColor:checked?color:'#CBD5E1' }}
        onClick={onChange}>
        {checked && <CheckCircle2 size={12} className="text-white" />}
      </div>
      <span className={`text-sm font-medium transition-colors ${checked?'text-slate-900':'text-slate-500'} group-hover:text-slate-800`}
        style={{ fontFamily:"'Outfit',sans-serif" }}>{label}</span>
    </div>
    {count!=null && <span className="text-xs text-slate-400 font-medium bg-slate-100 px-1.5 py-0.5 rounded-md">{count}</span>}
  </label>
)

const JobsFilterSidebar = ({ sideFilters, setSideFilters, onReset, isMobile=false, onClose }) => {
  const toggle=(group,val)=>setSideFilters(p=>{
    const arr=p[group]||[]
    return { ...p,[group]:arr.includes(val)?arr.filter(x=>x!==val):[...arr,val] }
  })
  const isChecked=(group,val)=>(sideFilters[group]||[]).includes(val)

  return(
    <div className={`${isMobile?'':'bg-white rounded-2xl border border-slate-200 p-5'}`}
      style={isMobile?{}:{ boxShadow:'0 2px 12px rgba(0,0,0,0.04)' }}>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={15} className="text-blue-600" />
          <span className="text-sm font-bold text-slate-900" style={{ fontFamily:"'Outfit',sans-serif" }}>Filters</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onReset} className="text-xs font-semibold text-red-500 hover:text-red-700 flex items-center gap-1 transition-colors">
            <RotateCcw size={11} /> Reset
          </button>
          {isMobile && <button onClick={onClose}><X size={16} className="text-slate-400" /></button>}
        </div>
      </div>

      <FilterSection title="Job Type">
        {[['permanent','Permanent',45],['remote','Remote',32],['contract','Contract',18],['govt_post','Govt Post',5]].map(([v,l,c])=>(
          <CheckFilter key={v} label={l} count={c} checked={isChecked('types',v)} onChange={()=>toggle('types',v)} />
        ))}
      </FilterSection>

      <FilterSection title="Experience">
        {[['0-1','0–1 Year',12],['1-3','1–3 Years',28],['3-5','3–5 Years',34],['5-10','5–10 Years',22],['10+','10+ Years',9]].map(([v,l,c])=>(
          <CheckFilter key={v} label={l} count={c} checked={isChecked('exp',v)} onChange={()=>toggle('exp',v)} color="#14B8A6" />
        ))}
      </FilterSection>

      <FilterSection title="Salary Range">
        {[['0-3','₹0–3 LPA',8],['3-6','₹3–6 LPA',20],['6-10','₹6–10 LPA',31],['10+','₹10+ LPA',42]].map(([v,l,c])=>(
          <CheckFilter key={v} label={l} count={c} checked={isChecked('salary',v)} onChange={()=>toggle('salary',v)} color="#F59E0B" />
        ))}
      </FilterSection>

      <FilterSection title="Location">
        {LOCATIONS.map(loc=>(
          <CheckFilter key={loc} label={loc} checked={isChecked('locations',loc)} onChange={()=>toggle('locations',loc)} color="#8B5CF6" />
        ))}
      </FilterSection>

      <FilterSection title="Skills" defaultOpen={false}>
        <div className="flex flex-wrap gap-1.5">
          {SKILLS_LIST.map(sk=>{
            const active=isChecked('skills',sk)
            return(
              <button key={sk} onClick={()=>toggle('skills',sk)}
                className="text-xs font-semibold px-2.5 py-1 rounded-lg border transition-all duration-150"
                style={{ background:active?'#2563EB':active?'#EFF6FF':'#F8FAFC', borderColor:active?'#2563EB':'#E2E8F0', color:active?'#FFFFFF':'#64748B' }}>
                {sk}
              </button>
            )
          })}
        </div>
      </FilterSection>

      <FilterSection title="Company" defaultOpen={false}>
        <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-2 border border-slate-200">
          <Search size={13} className="text-slate-400 flex-shrink-0" />
          <input className="bg-transparent border-none outline-none text-xs text-slate-700 w-full placeholder-slate-400"
            style={{ fontFamily:"'Outfit',sans-serif" }}
            placeholder="Search company..." />
        </div>
      </FilterSection>
    </div>
  )
}

/* ════════════════════════════════════════════
   JOB CARD SKELETON
════════════════════════════════════════════ */
const JobCardSkeleton = () => (
  <div className="bg-white rounded-2xl border border-slate-100 p-5 animate-pulse">
    <div className="flex items-start gap-3 mb-4">
      <div className="w-12 h-12 rounded-xl bg-slate-100 flex-shrink-0" />
      <div className="flex-1">
        <div className="h-4 bg-slate-100 rounded-lg w-3/4 mb-2" />
        <div className="h-3 bg-slate-100 rounded-lg w-1/2" />
      </div>
    </div>
    <div className="grid grid-cols-2 gap-2 mb-3">
      {[...Array(4)].map((_,i)=><div key={i} className="h-3 bg-slate-100 rounded-lg" />)}
    </div>
    <div className="flex gap-1.5 mb-4">
      {[...Array(3)].map((_,i)=><div key={i} className="h-6 w-16 bg-slate-100 rounded-lg" />)}
    </div>
    <div className="flex justify-between">
      <div className="h-3 w-20 bg-slate-100 rounded-lg" />
      <div className="flex gap-2">
        <div className="h-8 w-20 bg-slate-100 rounded-lg" />
        <div className="h-8 w-20 bg-slate-100 rounded-lg" />
      </div>
    </div>
  </div>
)

/* ════════════════════════════════════════════
   JOB CARD
════════════════════════════════════════════ */
const JobCard = ({ job, viewMode }) => {
  const [saved,setSaved]=useState(false)
  const [copied,setCopied]=useState(false)
  const tc=typeStyle[job.type]||typeStyle['permanent']
    const navigate = useNavigate();
  const handleCopy=()=>{ setCopied(true); setTimeout(()=>setCopied(false),2000) }

  if(viewMode==='list'){
    return(
      <div className="group bg-white rounded-2xl border border-slate-100 px-5 py-4 flex items-center gap-4 transition-all duration-300 hover:border-blue-200 hover:shadow-lg hover:-translate-y-0.5"
        style={{ boxShadow:'0 2px 8px rgba(0,0,0,0.04)' }}>
        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 border border-slate-100 hidden sm:flex"
          style={{ background:job.logoBg }}>{job.logo}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors"
              style={{ fontFamily:"'Outfit',sans-serif" }}>{job.title}</h3>
            {job.urgent&&<span className="flex items-center gap-0.5 text-[9.5px] font-bold px-1.5 py-0.5 rounded-full text-white flex-shrink-0"
              style={{ background:'linear-gradient(135deg,#EF4444,#F59E0B)' }}><Zap size={8} fill="white"/>Urgent</span>}
            {job.featured&&<span className="flex items-center gap-0.5 text-[9.5px] font-bold px-1.5 py-0.5 rounded-full text-white flex-shrink-0"
              style={{ background:'linear-gradient(135deg,#F59E0B,#EF4444)' }}><Star size={8} fill="white"/>Featured</span>}
          </div>
          <div className="flex items-center gap-3 mt-1 flex-wrap text-xs text-slate-500">
            <span className="flex items-center gap-1"><Building2 size={10} className="text-slate-400"/>{job.company}<BadgeCheck size={10} className="text-blue-500"/></span>
            <span className="flex items-center gap-1"><MapPin size={10} className="text-blue-500"/>{job.location}</span>
            <span className="flex items-center gap-1"><IndianRupee size={10} className="text-amber-500"/>{salRange(job.salMin,job.salMax)}</span>
            <span className="flex items-center gap-1"><TrendingUp size={10} className="text-teal-500"/>{expRange(job.expMin,job.expMax)}</span>
          </div>
          <div className="flex gap-1.5 mt-2 flex-wrap">
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${tc.bg} ${tc.text} ${tc.border}`}>{typeLabel[job.type]}</span>
            {job.skills.slice(0,3).map(s=><span key={s} className="text-[10px] px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-100 font-medium">{s}</span>)}
          </div>
        </div>
        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          <span className="text-[10.5px] text-slate-400 flex items-center gap-1"><Clock size={10}/>{job.posted}</span>
          <div className="flex items-center gap-1.5">
            <button onClick={()=>setSaved(s=>!s)}
              className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${saved?'bg-blue-600 text-white':'bg-slate-100 text-slate-400 hover:bg-blue-50 hover:text-blue-600'}`}>
              {saved?<BookmarkCheck size={13}/>:<Bookmark size={13}/>}
            </button>
            <button onClick={handleCopy}
              className="w-7 h-7 rounded-lg flex items-center justify-center bg-slate-100 text-slate-400 hover:bg-slate-200 transition-all">
              {copied?<CheckCircle2 size={13} className="text-green-500"/>:<Copy size={13}/>}
            </button>
            <button className="flex items-center gap-1 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all"
              style={{ boxShadow:'0 2px 8px rgba(37,99,235,0.30)', fontFamily:"'Outfit',sans-serif" }}>
              Apply <ArrowRight size={11}/>
            </button>
          </div>
        </div>
      </div>
    )
  }

  return(
    <div className="group relative bg-white rounded-2xl border border-slate-100 p-5 flex flex-col gap-3.5 transition-all duration-300 hover:-translate-y-1.5 hover:border-blue-200 hover:shadow-xl"
      style={{ boxShadow:'0 2px 12px rgba(0,0,0,0.04)' }}>
      {job.featured&&(
        <div className="absolute -top-2.5 left-4 flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full text-white"
          style={{ background:'linear-gradient(135deg,#F59E0B,#EF4444)', boxShadow:'0 2px 8px rgba(245,158,11,0.4)' }}>
          <Star size={8} fill="white"/> Featured
        </div>
      )}
      {!job.featured&&job.urgent&&(
        <div className="absolute -top-2.5 left-4 flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full text-white"
          style={{ background:'linear-gradient(135deg,#EF4444,#F59E0B)', boxShadow:'0 2px 8px rgba(239,68,68,0.4)' }}>
          <Zap size={8} fill="white"/> Urgent
        </div>
      )}
      <div className="flex items-start justify-between gap-2 pt-1">
        <div className="flex items-center gap-2.5">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0 border border-slate-100"
            style={{ background:job.logoBg }}>{job.logo}</div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 leading-snug group-hover:text-blue-600 transition-colors line-clamp-1"
              style={{ fontFamily:"'Outfit',sans-serif" }}>{job.title}</h3>
            <div className="flex items-center gap-1 mt-0.5">
              <Building2 size={10} className="text-slate-400"/>
              <span className="text-xs text-slate-500 font-medium">{job.company}</span>
              <BadgeCheck size={10} className="text-blue-500 ml-0.5"/>
            </div>
          </div>
        </div>
        <button onClick={()=>setSaved(s=>!s)}
          className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${saved?'bg-blue-600 text-white':'bg-slate-100 text-slate-400 hover:bg-blue-50 hover:text-blue-600'}`}>
          {saved?<BookmarkCheck size={13}/>:<Bookmark size={13}/>}
        </button>
      </div>
      <div className="grid grid-cols-2 gap-x-2 gap-y-1.5">
        {[
          { Icon:MapPin,      color:'text-blue-500',   val:job.location },
          { Icon:TrendingUp,  color:'text-teal-500',   val:expRange(job.expMin,job.expMax) },
          { Icon:IndianRupee, color:'text-amber-500',  val:salRange(job.salMin,job.salMax) },
          { Icon:Users,       color:'text-purple-500', val:`${job.openings} Opening${job.openings>1?'s':''}` },
        ].map(({Icon,color,val})=>(
          <div key={val} className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-md bg-slate-50 flex items-center justify-center flex-shrink-0">
              <Icon size={10} className={color}/>
            </div>
            <span className="text-xs text-slate-600 font-medium truncate">{val}</span>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-1">
        <span className={`text-[10.5px] font-semibold px-2 py-0.5 rounded-full border ${tc.bg} ${tc.text} ${tc.border}`}>{typeLabel[job.type]}</span>
        {job.skills.slice(0,3).map(s=>(
          <span key={s} className="text-[10.5px] font-medium px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-100">{s}</span>
        ))}
        {job.skills.length>3&&<span className="text-[10.5px] px-2 py-0.5 rounded-full bg-slate-50 text-slate-400 border border-slate-100">+{job.skills.length-3}</span>}
      </div>
      <div className="flex items-center justify-between gap-2 mt-auto pt-2 border-t border-slate-50">
        <span className="text-[10.5px] text-slate-400 flex items-center gap-1"><Clock size={10}/>{job.posted}</span>
        <div className="flex items-center gap-1.5">
          <button onClick={handleCopy}
            className="w-7 h-7 rounded-lg flex items-center justify-center bg-slate-100 text-slate-400 hover:bg-slate-200 transition-all">
            {copied?<CheckCircle2 size={12} className="text-green-500"/>:<Copy size={12}/>}
          </button>
          <button
          onClick={()=> navigate(`/jobs/${job.id}`)}
          className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-blue-600 transition-colors">
            <Eye size={11}/> Details
          </button>
          <button className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold rounded-xl transition-all"
            style={{ boxShadow:'0 2px 8px rgba(37,99,235,0.30)', fontFamily:"'Outfit',sans-serif" }}>
            Apply <ArrowRight size={11}/>
          </button>
        </div>
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════
   JOBS SORT
════════════════════════════════════════════ */
const JobsSort = ({ sort, setSort, total, viewMode, setViewMode }) => (
  <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
    <p className="text-xs text-slate-500 font-medium">
      Showing <span className="text-slate-800 font-bold">{total}</span> job{total!==1?'s':''}
    </p>
    <div className="flex items-center gap-2.5 flex-wrap">
      <select value={sort} onChange={e=>setSort(e.target.value)}
        className="text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl px-3 py-2 outline-none cursor-pointer hover:border-blue-300 transition-colors appearance-none pr-7"
        style={{ fontFamily:"'Outfit',sans-serif", backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%2394A3B8'/%3E%3C/svg%3E")`, backgroundRepeat:'no-repeat', backgroundPosition:'right 10px center' }}>
        <option value="latest">Latest First</option>
        <option value="salary_high">Salary: High to Low</option>
        <option value="salary_low">Salary: Low to High</option>
        <option value="exp_low">Experience: Low</option>
        <option value="urgent">Urgent Jobs First</option>
      </select>
      <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1">
        {[{m:'grid',I:LayoutGrid},{m:'list',I:LayoutList}].map(({m,I})=>(
          <button key={m} onClick={()=>setViewMode(m)}
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-all"
            style={{ background:viewMode===m?'#2563EB':'transparent', color:viewMode===m?'#FFFFFF':'#94A3B8' }}>
            <I size={14}/>
          </button>
        ))}
      </div>
    </div>
  </div>
)

/* ════════════════════════════════════════════
   EMPTY STATE
════════════════════════════════════════════ */
const EmptyState = ({ onReset }) => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <div className="w-20 h-20 rounded-3xl bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center mb-5">
      <AlertCircle size={32} className="text-slate-300"/>
    </div>
    <h3 className="text-lg font-bold text-slate-700 mb-2" style={{ fontFamily:"'Outfit',sans-serif" }}>No Jobs Found</h3>
    <p className="text-slate-400 text-sm mb-6 max-w-xs">Try adjusting your filters or search keywords to discover more opportunities.</p>
    <button onClick={onReset}
      className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white font-bold text-sm rounded-xl hover:bg-blue-700 transition-all"
      style={{ fontFamily:"'Outfit',sans-serif", boxShadow:'0 4px 12px rgba(37,99,235,0.30)' }}>
      <RotateCcw size={14}/> Reset Filters
    </button>
  </div>
)

/* ════════════════════════════════════════════
   PAGINATION
════════════════════════════════════════════ */
const Pagination = ({ page, total, onChange }) => {
  if(total<=1)return null
  const pages=Array.from({length:total},(_,i)=>i+1)
  const visible=pages.filter(p=>p===1||p===total||Math.abs(p-page)<=1)
  return(
    <div className="flex items-center justify-center gap-1.5 mt-10 flex-wrap">
      <button onClick={()=>onChange(page-1)} disabled={page===1}
        className="flex items-center gap-1.5 px-4 py-2 rounded-xl border text-xs font-semibold transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:border-blue-300 hover:text-blue-600"
        style={{ background:'#FFFFFF', borderColor:'#E2E8F0', color:'#64748B', fontFamily:"'Outfit',sans-serif" }}>
        <ChevronLeft size={14}/> Previous
      </button>
      {pages.map((p,i)=>{
        const prev=pages[i-1]
        return(
          <React.Fragment key={p}>
            {prev&&p-prev>1&&<span className="text-slate-400 text-sm px-1">…</span>}
            {(visible.includes(p))&&(
              <button onClick={()=>onChange(p)}
                className="w-9 h-9 rounded-xl text-sm font-bold border transition-all"
                style={{ background:page===p?'linear-gradient(135deg,#2563EB,#1D4ED8)':'#FFFFFF', borderColor:page===p?'#2563EB':'#E2E8F0', color:page===p?'#FFFFFF':'#64748B', boxShadow:page===p?'0 4px 12px rgba(37,99,235,0.30)':'none', fontFamily:"'Outfit',sans-serif" }}>
                {p}
              </button>
            )}
          </React.Fragment>
        )
      })}
      <button onClick={()=>onChange(page+1)} disabled={page===total}
        className="flex items-center gap-1.5 px-4 py-2 rounded-xl border text-xs font-semibold transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:border-blue-300 hover:text-blue-600"
        style={{ background:'#FFFFFF', borderColor:'#E2E8F0', color:'#64748B', fontFamily:"'Outfit',sans-serif" }}>
        Next <ChevronRight size={14}/>
      </button>
    </div>
  )
}

/* ════════════════════════════════════════════
   JOBS LIST
════════════════════════════════════════════ */
const JobsList = ({ jobs, loading, viewMode }) => {
  if(loading){
    return(
      <div className={viewMode==='grid'?'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-4':'flex flex-col gap-3'}>
        {[...Array(6)].map((_,i)=><JobCardSkeleton key={i}/>)}
      </div>
    )
  }
  if(jobs.length===0)return null
  if(viewMode==='list'){
    return <div className="flex flex-col gap-3">{jobs.map(j=><JobCard key={j.id} job={j} viewMode="list"/>)}</div>
  }
  return(
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {jobs.map(j=><JobCard key={j.id} job={j} viewMode="grid"/>)}
    </div>
  )
}

/* ════════════════════════════════════════════
   POPULAR SEARCHES
════════════════════════════════════════════ */
const PopularSearches = () => {
  const searches = [
    '🔷 React Developer','🌍 Remote Jobs','🏛️ Government Jobs','☕ Java Developer',
    '📱 Android Developer','☁️ Cloud Engineer','🎨 UI/UX Designer','📊 Data Scientist',
  ]
  return(
    <div className="bg-white rounded-2xl border border-slate-200 p-6 mt-8"
      style={{ boxShadow:'0 2px 12px rgba(0,0,0,0.04)' }}>
      <div className="flex items-center gap-2 mb-4">
        <Hash size={15} className="text-blue-600"/>
        <h3 className="text-sm font-bold text-slate-900" style={{ fontFamily:"'Outfit',sans-serif" }}>Popular Searches</h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {searches.map(s=>(
          <button key={s}
            className="text-xs font-semibold px-3.5 py-1.5 rounded-xl border transition-all hover:-translate-y-0.5 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50"
            style={{ background:'#F8FAFC', borderColor:'#E2E8F0', color:'#64748B', fontFamily:"'Outfit',sans-serif" }}>
            {s}
          </button>
        ))}
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════
   MOBILE FILTER DRAWER
════════════════════════════════════════════ */
const MobileFilterDrawer = ({ open, onClose, sideFilters, setSideFilters, onReset }) => {
  if(!open)return null
  return(
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}/>
      <div className="absolute right-0 top-0 bottom-0 w-80 bg-white overflow-y-auto p-5"
        style={{ boxShadow:'-8px 0 32px rgba(0,0,0,0.15)' }}>
        <JobsFilterSidebar sideFilters={sideFilters} setSideFilters={setSideFilters} onReset={onReset} isMobile onClose={onClose}/>
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════
   JOBS PAGE
════════════════════════════════════════════ */
const JobsPage = () => {
  const [searchFilters,setSearchFilters]=useState({ keyword:'',location:'',exp:'',empType:'' })
  const [sideFilters,setSideFilters]=useState({ types:[],exp:[],salary:[],locations:[],skills:[] })
  const [sort,setSort]=useState('latest')
  const [viewMode,setViewMode]=useState('grid')
  const [page,setPage]=useState(1)
  const [loading,setLoading]=useState(false)
  const [drawerOpen,setDrawerOpen]=useState(false)

  const activeFilterCount = Object.values(sideFilters).flat().length

  const filtered = useMemo(()=>{
    let res=[...JOBS]
    const kw=searchFilters.keyword.toLowerCase()
    if(kw)res=res.filter(j=>j.title.toLowerCase().includes(kw)||j.company.toLowerCase().includes(kw)||j.skills.some(s=>s.toLowerCase().includes(kw)))
    const loc=searchFilters.location.toLowerCase()
    if(loc)res=res.filter(j=>j.location.toLowerCase().includes(loc))
    if(sideFilters.types.length)res=res.filter(j=>sideFilters.types.includes(j.type))
    if(sideFilters.locations.length)res=res.filter(j=>sideFilters.locations.includes(j.location))
    if(sideFilters.skills.length)res=res.filter(j=>j.skills.some(s=>sideFilters.skills.includes(s)))
    if(sort==='salary_high')res.sort((a,b)=>b.salMax-a.salMax)
    else if(sort==='salary_low')res.sort((a,b)=>a.salMin-b.salMin)
    else if(sort==='urgent')res.sort((a,b)=>(b.urgent?1:0)-(a.urgent?1:0))
    else res.sort((a,b)=>a.id-b.id)
    return res
  },[searchFilters,sideFilters,sort])

  const totalPages=Math.ceil(filtered.length/JOBS_PER_PAGE)
  const paginated=filtered.slice((page-1)*JOBS_PER_PAGE,page*JOBS_PER_PAGE)

  const resetAll=()=>{ setSearchFilters({keyword:'',location:'',exp:'',empType:''}); setSideFilters({types:[],exp:[],salary:[],locations:[],skills:[]}); setPage(1) }
  const handleSearch=()=>setPage(1)

  return(
    <div className='pt-20' style={{ background:'#F1F5F9', minHeight:'100vh', fontFamily:"'Outfit',sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap');*{box-sizing:border-box}`}</style>

      {/* <Navbar/> */}
      <JobsHeader total={JOBS.length}/>

      {/* ── Search bar ── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 -mt-5 relative z-10 mb-6">
        <JobSearchBar filters={searchFilters} setFilters={setSearchFilters} onSearch={handleSearch}/>
      </div>

      {/* ── Mobile: filter bar ── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 mb-4 lg:hidden">
        <div className="flex items-center gap-2">
          <button onClick={()=>setDrawerOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:border-blue-300 transition-all"
            style={{ boxShadow:'0 1px 4px rgba(0,0,0,0.04)' }}>
            <Filter size={14}/>
            Filters
            {activeFilterCount>0&&<span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-black flex items-center justify-center">{activeFilterCount}</span>}
          </button>
          <JobsSort sort={sort} setSort={setSort} total={filtered.length} viewMode={viewMode} setViewMode={setViewMode}/>
        </div>
      </div>

      {/* ── Main layout ── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 pb-16">
        <div className="flex gap-6 items-start">

          {/* Sidebar */}
          <aside className="hidden lg:block w-64 xl:w-72 flex-shrink-0 sticky top-20">
            <JobsFilterSidebar sideFilters={sideFilters} setSideFilters={setSideFilters} onReset={resetAll}/>
          </aside>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Desktop sort */}
            <div className="hidden lg:block">
              <JobsSort sort={sort} setSort={setSort} total={filtered.length} viewMode={viewMode} setViewMode={setViewMode}/>
            </div>

            {/* Active filter chips */}
            {activeFilterCount>0&&(
              <div className="flex flex-wrap gap-2 mb-4">
                {Object.entries(sideFilters).flatMap(([group,vals])=>
                  vals.map(v=>(
                    <span key={`${group}-${v}`}
                      className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                      {v}
                      <button onClick={()=>setSideFilters(p=>({...p,[group]:p[group].filter(x=>x!==v)}))}>
                        <X size={11}/>
                      </button>
                    </span>
                  ))
                )}
                <button onClick={resetAll} className="text-xs font-semibold text-red-500 hover:text-red-700 flex items-center gap-1 px-3 py-1.5 rounded-full bg-red-50 border border-red-100 transition-colors">
                  <X size={11}/> Clear all
                </button>
              </div>
            )}

            {/* Job list or empty */}
            {filtered.length===0
              ? <EmptyState onReset={resetAll}/>
              : <JobsList jobs={paginated} loading={loading} viewMode={viewMode}/>
            }

            {/* Pagination */}
            <Pagination page={page} total={totalPages} onChange={p=>{setPage(p);window.scrollTo({top:0,behavior:'smooth'})}}/>

            {/* Popular searches */}
            <PopularSearches/>
          </div>
        </div>
      </div>

      {/* ── CTA band ── */}
      <div className="relative overflow-hidden py-14 px-6"
        style={{ background:'linear-gradient(135deg,#1E40AF 0%,#2563EB 55%,#0D9488 100%)' }}>
        <div className="absolute right-0 top-0 w-64 h-64 rounded-full opacity-10 -translate-y-1/3 translate-x-1/4 bg-white pointer-events-none"/>
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3" style={{ letterSpacing:'-0.02em' }}>
            Can't find the right fit?
          </h2>
          <p className="text-blue-100 text-sm mb-6">Upload your resume and let top companies find you instead.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button className="flex items-center gap-2 px-7 py-3 bg-white text-blue-700 font-bold text-sm rounded-xl hover:bg-blue-50 transition-all"
              style={{ fontFamily:"'Outfit',sans-serif", boxShadow:'0 4px 16px rgba(0,0,0,0.15)' }}>
              Upload Resume <ArrowRight size={15}/>
            </button>
            <button className="flex items-center gap-2 px-7 py-3 text-white font-bold text-sm rounded-xl border-2 border-white/30 hover:border-white/60 hover:bg-white/10 transition-all"
              style={{ fontFamily:"'Outfit',sans-serif" }}>
              Set Job Alerts <Bell size={15}/>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      <MobileFilterDrawer open={drawerOpen} onClose={()=>setDrawerOpen(false)} sideFilters={sideFilters} setSideFilters={setSideFilters} onReset={resetAll}/>
    </div>
  )
}

export default JobsPage