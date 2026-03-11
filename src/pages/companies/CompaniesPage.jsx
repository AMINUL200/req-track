import React, { useState, useMemo } from 'react'
import {
  Search, MapPin, Users, Briefcase, Globe, Building2,
  ChevronRight, ChevronLeft, ArrowRight, Star, BadgeCheck,
  SlidersHorizontal, X, LayoutGrid, LayoutList, Filter,
  TrendingUp, Sparkles, Shield, Zap, Award, ExternalLink,
  RotateCcw, AlertCircle, Heart, CheckCircle2, Eye,
  Phone, Mail, Twitter, Linkedin, Hash
} from 'lucide-react'

/* ════════════════════════════════════════════
   DATA
════════════════════════════════════════════ */
const COMPANIES = [
  { id:1,  name:'TechNova Inc.',           logo:'🏢', logoBg:'#EFF6FF', industry:'IT Services',       location:'Bangalore', size:'200–500',  openJobs:18, rating:4.8, founded:2012, website:'technova.in',      featured:true,  hiring:true,  desc:'Leading software development firm building enterprise-grade web and mobile applications for global clients.',          tags:['React','Node.js','AWS'] },
  { id:2,  name:'GrowthStack Solutions',   logo:'🎯', logoBg:'#FFF7ED', industry:'SaaS / Product',    location:'Mumbai',    size:'50–200',   openJobs:12, rating:4.9, founded:2017, website:'growthstack.io',   featured:true,  hiring:true,  desc:'B2B SaaS company helping businesses automate growth operations through AI-powered analytics platforms.',               tags:['Product','Agile','Data'] },
  { id:3,  name:'InsightBridge Analytics', logo:'📊', logoBg:'#F0FDFA', industry:'Data & Analytics',  location:'Hyderabad', size:'50–200',   openJobs:9,  rating:4.7, founded:2019, website:'insightbridge.in', featured:false, hiring:true,  desc:'Data intelligence company transforming raw data into actionable business insights for Fortune 500 companies.',        tags:['Python','ML','SQL'] },
  { id:4,  name:'PixelForge Studios',      logo:'🎨', logoBg:'#FDF4FF', industry:'Design & Creative', location:'Pune',      size:'10–50',    openJobs:6,  rating:4.6, founded:2018, website:'pixelforge.io',   featured:false, hiring:true,  desc:'Award-winning UI/UX studio crafting digital experiences that delight users and drive measurable business results.',   tags:['Figma','UX','Branding'] },
  { id:5,  name:'CloudNine Infrastructure',logo:'⚙️', logoBg:'#F0FDF4', industry:'Cloud & DevOps',    location:'Chennai',   size:'200–500',  openJobs:14, rating:4.5, founded:2014, website:'cloudnine.tech',  featured:true,  hiring:true,  desc:'Cloud infrastructure specialists helping enterprises migrate, scale, and secure their workloads on AWS and GCP.',    tags:['AWS','Kubernetes','DevOps'] },
  { id:6,  name:'Nexus Platforms',         logo:'🔧', logoBg:'#FFF1F2', industry:'IT Services',       location:'Remote',    size:'50–200',   openJobs:8,  rating:4.4, founded:2016, website:'nexus.dev',       featured:false, hiring:true,  desc:'Distributed engineering teams building high-performance backend systems and APIs for technology companies.',          tags:['Node.js','PostgreSQL','Go'] },
  { id:7,  name:'BizReach Corp',           logo:'📈', logoBg:'#FFF7ED', industry:'Sales & Marketing', location:'Delhi',     size:'200–500',  openJobs:22, rating:4.3, founded:2011, website:'bizreach.in',     featured:false, hiring:true,  desc:'India\'s fastest-growing B2B sales enablement platform connecting decision-makers across industries.',                tags:['Sales','CRM','B2B'] },
  { id:8,  name:'PeopleFirst Solutions',   logo:'🤝', logoBg:'#F5F3FF', industry:'HR & Talent',       location:'Noida',     size:'50–200',   openJobs:5,  rating:4.6, founded:2015, website:'peoplefirst.hr',  featured:false, hiring:true,  desc:'Human capital management consultancy specializing in talent acquisition, L&D programs, and organizational design.',  tags:['HR','L&D','HRBP'] },
  { id:9,  name:'AppCraft Technologies',   logo:'📱', logoBg:'#F0FDF4', industry:'Mobile Dev',        location:'Bangalore', size:'10–50',    openJobs:7,  rating:4.5, founded:2020, website:'appcraft.dev',    featured:false, hiring:true,  desc:'Mobile-first development studio building native and cross-platform apps for startups and enterprise clients.',      tags:['Kotlin','Swift','Flutter'] },
  { id:10, name:'BrandVoice Agency',       logo:'✍️', logoBg:'#FFFBEB', industry:'Marketing',         location:'Mumbai',    size:'10–50',    openJobs:4,  rating:4.4, founded:2018, website:'brandvoice.in',   featured:false, hiring:true,  desc:'Full-service content and digital marketing agency helping brands find their voice and grow their online presence.',  tags:['SEO','Content','Social'] },
  { id:11, name:'CapitalEdge Finance',     logo:'💰', logoBg:'#FFFBEB', industry:'Finance & Banking', location:'Chennai',   size:'200–500',  openJobs:11, rating:4.7, founded:2010, website:'capitaledge.in',  featured:true,  hiring:true,  desc:'Fintech company providing digital lending, investment management, and financial advisory services to retail clients.', tags:['Fintech','Excel','ERP'] },
  { id:12, name:'HealthPlus Technologies', logo:'🏥', logoBg:'#F0FDF4', industry:'Healthcare',        location:'Bangalore', size:'200–500',  openJobs:16, rating:4.8, founded:2013, website:'healthplus.in',   featured:true,  hiring:true,  desc:'Digital health platform connecting patients with verified doctors, diagnostic labs, and pharmacies across India.',    tags:['HealthTech','React','Django'] },
]

const INDUSTRIES  = ['IT Services','SaaS / Product','Data & Analytics','Design & Creative','Cloud & DevOps','Sales & Marketing','HR & Talent','Mobile Dev','Marketing','Finance & Banking','Healthcare']
const SIZES       = ['1–10','10–50','50–200','200–500','500+']
const LOCATIONS   = ['Bangalore','Mumbai','Delhi','Hyderabad','Pune','Chennai','Noida','Remote']
const PER_PAGE    = 9
const F           = { fontFamily:"'Outfit',sans-serif" }

/* ════════════════════════════════════════════
   NAVBAR
════════════════════════════════════════════ */
const Navbar = () => (
  <nav className="sticky top-0 z-50 bg-white border-b border-slate-100" style={{ boxShadow:'0 1px 12px rgba(0,0,0,0.06)' }}>
    <div className="max-w-7xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between gap-6">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background:'linear-gradient(135deg,#2563EB,#14B8A6)' }}>
          <Briefcase size={15} className="text-white"/>
        </div>
        <span className="text-lg font-black text-slate-900" style={{ ...F, letterSpacing:'-0.03em' }}>
          Req<span style={{ background:'linear-gradient(135deg,#2563EB,#14B8A6)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Track</span>
        </span>
      </div>
      <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-500">
        {['Jobs','Companies','Resources','About'].map(n=>(
          <a key={n} href="#" className={`hover:text-blue-600 transition-colors ${n==='Companies'?'text-blue-600 font-bold':''}`} style={F}>{n}</a>
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
   COMPANIES HEADER
════════════════════════════════════════════ */
const CompaniesHeader = ({ total }) => (
  <div className="relative overflow-hidden py-14" style={{ background:'linear-gradient(135deg,#F8FAFC 0%,#EFF6FF 50%,#F0FDFA 100%)' }}>
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background:'linear-gradient(90deg,transparent,#BFDBFE,transparent)' }}/>
      <div className="absolute -top-24 right-0 w-72 h-72 rounded-full opacity-20" style={{ background:'radial-gradient(circle,#DBEAFE,transparent)', filter:'blur(50px)' }}/>
      <div className="absolute -bottom-12 left-0 w-56 h-56 rounded-full opacity-15" style={{ background:'radial-gradient(circle,#CCFBF1,transparent)', filter:'blur(40px)' }}/>
      <svg className="absolute top-8 right-12 opacity-20" width="120" height="120">
        {Array.from({length:5}).map((_,r)=>Array.from({length:5}).map((_,c)=>(
          <circle key={`${r}-${c}`} cx={c*24+6} cy={r*24+6} r="2" fill="#2563EB"/>
        )))}
      </svg>
    </div>
    <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10">
      <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold px-3.5 py-1.5 rounded-full mb-4">
        <Sparkles size={11}/> Top Employers
      </div>
      <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-2" style={{ ...F, letterSpacing:'-0.03em' }}>
        Explore{' '}
        <span style={{ background:'linear-gradient(135deg,#2563EB,#14B8A6)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
          Top Companies
        </span>
      </h1>
      <p className="text-slate-500 text-base mb-6">Discover organizations actively hiring talented professionals across India.</p>
      <div className="flex flex-wrap items-center gap-4 text-sm">
        <div className="flex items-center gap-2 bg-white rounded-xl px-4 py-2 border border-slate-200" style={{ boxShadow:'0 2px 8px rgba(0,0,0,0.04)' }}>
          <Building2 size={14} className="text-blue-500"/>
          <span className="font-bold text-slate-900" style={F}>{total}</span>
          <span className="text-slate-500 font-medium">Companies Listed</span>
        </div>
        {[
          { icon:Zap,    val:'500+', label:'Actively Hiring', color:'#22C55E' },
          { icon:Star,   val:'4.7',  label:'Avg Rating',      color:'#F59E0B' },
          { icon:Award,  val:'48',   label:'Featured',         color:'#8B5CF6' },
        ].map(s=>{ const Icon=s.icon; return(
          <div key={s.label} className="hidden sm:flex items-center gap-1.5 text-slate-500 text-sm font-medium">
            <Icon size={13} style={{ color:s.color }}/> <span className="font-bold text-slate-700" style={F}>{s.val}</span> {s.label}
          </div>
        )})}
      </div>
    </div>
  </div>
)

/* ════════════════════════════════════════════
   SEARCH BAR
════════════════════════════════════════════ */
const CompanySearchBar = ({ search, setSearch, onSearch }) => (
  <div className="bg-white rounded-2xl border border-slate-200 p-2 flex flex-wrap gap-1.5 items-stretch" style={{ boxShadow:'0 4px 24px rgba(37,99,235,0.08)' }}>
    {[
      { key:'name',     icon:Search,    placeholder:'Company name or keyword', type:'text' },
      { key:'industry', icon:Building2, placeholder:'Industry',                type:'select', opts:['All Industries',...INDUSTRIES] },
      { key:'location', icon:MapPin,    placeholder:'Location',                type:'select', opts:['All Locations',...LOCATIONS] },
    ].map((f,i)=>{ const Icon=f.icon; return(
      <React.Fragment key={f.key}>
        {i>0 && <div className="hidden sm:block w-px bg-slate-100 my-1"/>}
        <div className="flex-1 min-w-[150px] flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-slate-50 border border-transparent focus-within:border-blue-500 focus-within:bg-blue-50 transition-all">
          <Icon size={15} className="text-slate-400 flex-shrink-0"/>
          {f.type==='text'
            ? <input className="bg-transparent border-none outline-none text-sm text-slate-900 w-full placeholder-slate-400" style={F}
                placeholder={f.placeholder} value={search[f.key]||''} onChange={e=>setSearch(p=>({...p,[f.key]:e.target.value}))}/>
            : <select className="bg-transparent border-none outline-none text-sm text-slate-600 w-full cursor-pointer appearance-none" style={F}
                value={search[f.key]||''} onChange={e=>setSearch(p=>({...p,[f.key]:e.target.value}))}>
                {f.opts.map(o=><option key={o}>{o}</option>)}
              </select>
          }
        </div>
      </React.Fragment>
    )})}
    <button onClick={onSearch} className="flex items-center gap-2 px-7 py-2.5 text-white font-bold text-sm rounded-xl transition-all hover:-translate-y-0.5"
      style={{ ...F, background:'linear-gradient(135deg,#2563EB,#1D4ED8)', boxShadow:'0 4px 14px rgba(37,99,235,0.35)' }}>
      <Search size={15}/> Search
    </button>
  </div>
)

/* ════════════════════════════════════════════
   FILTER SIDEBAR
════════════════════════════════════════════ */
const FSection = ({ title, children, open, setOpen }) => (
  <div className="border-b border-slate-100 pb-4 mb-4 last:border-0 last:pb-0 last:mb-0">
    <button className="flex items-center justify-between w-full mb-3 group" onClick={()=>setOpen(o=>!o)}>
      <span className="text-xs font-bold text-slate-700 uppercase tracking-widest group-hover:text-blue-600 transition-colors" style={F}>{title}</span>
      <ChevronRight size={13} className={`text-slate-400 transition-transform duration-200 ${open?'rotate-90':''}`}/>
    </button>
    {open && children}
  </div>
)

const CFilter = ({ label, checked, onChange, color='#2563EB' }) => (
  <label className="flex items-center gap-2.5 py-1.5 cursor-pointer group">
    <div className="w-4 h-4 rounded flex items-center justify-center border transition-all duration-150 flex-shrink-0"
      style={{ background:checked?color:'transparent', borderColor:checked?color:'#CBD5E1' }} onClick={onChange}>
      {checked && <CheckCircle2 size={11} className="text-white"/>}
    </div>
    <span className={`text-sm font-medium transition-colors ${checked?'text-slate-900':'text-slate-500'} group-hover:text-slate-800`} style={F}>{label}</span>
  </label>
)

const CompanyFilters = ({ filters, setFilters, onReset, isMobile, onClose }) => {
  const [openSections, setOpenSections] = useState({ industry:true, size:true, location:true })
  const toggle=(group,val)=>setFilters(p=>{ const a=p[group]||[]; return {...p,[group]:a.includes(val)?a.filter(x=>x!==val):[...a,val]} })
  const isC=(g,v)=>(filters[g]||[]).includes(v)
  const ots=(k)=>setOpenSections(p=>({...p,[k]:!p[k]}))

  return(
    <div className={`${isMobile?'':'bg-white rounded-2xl border border-slate-200 p-5'}`} style={isMobile?{}:{ boxShadow:'0 2px 12px rgba(0,0,0,0.04)' }}>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2"><SlidersHorizontal size={15} className="text-blue-600"/><span className="text-sm font-bold text-slate-900" style={F}>Filters</span></div>
        <div className="flex items-center gap-2">
          <button onClick={onReset} className="text-xs font-semibold text-red-500 hover:text-red-700 flex items-center gap-1 transition-colors"><RotateCcw size={11}/> Reset</button>
          {isMobile && <button onClick={onClose}><X size={16} className="text-slate-400"/></button>}
        </div>
      </div>
      <FSection title="Industry" open={openSections.industry} setOpen={()=>ots('industry')}>
        {INDUSTRIES.slice(0,7).map(i=><CFilter key={i} label={i} checked={isC('industries',i)} onChange={()=>toggle('industries',i)}/>)}
      </FSection>
      <FSection title="Company Size" open={openSections.size} setOpen={()=>ots('size')}>
        {SIZES.map(s=><CFilter key={s} label={`${s} employees`} checked={isC('sizes',s)} onChange={()=>toggle('sizes',s)} color="#14B8A6"/>)}
      </FSection>
      <FSection title="Location" open={openSections.location} setOpen={()=>ots('location')}>
        {LOCATIONS.map(l=><CFilter key={l} label={l} checked={isC('locations',l)} onChange={()=>toggle('locations',l)} color="#8B5CF6"/>)}
      </FSection>
    </div>
  )
}

/* ════════════════════════════════════════════
   COMPANY CARD SKELETON
════════════════════════════════════════════ */
const CompanyCardSkeleton = () => (
  <div className="bg-white rounded-2xl border border-slate-100 p-6 animate-pulse">
    <div className="flex flex-col items-center text-center gap-3">
      <div className="w-16 h-16 rounded-2xl bg-slate-100"/>
      <div className="h-4 w-32 bg-slate-100 rounded-lg"/>
      <div className="h-3 w-20 bg-slate-100 rounded-lg"/>
      <div className="flex gap-2 mt-1">
        {[...Array(3)].map((_,i)=><div key={i} className="h-5 w-14 bg-slate-100 rounded-full"/>)}
      </div>
      <div className="h-px w-full bg-slate-100 my-1"/>
      <div className="grid grid-cols-2 gap-2 w-full">
        {[...Array(4)].map((_,i)=><div key={i} className="h-3 bg-slate-100 rounded-lg"/>)}
      </div>
      <div className="h-9 w-full bg-slate-100 rounded-xl mt-1"/>
    </div>
  </div>
)

/* ════════════════════════════════════════════
   COMPANY CARD
════════════════════════════════════════════ */
const CompanyCard = ({ company, viewMode, onView }) => {
  const [following, setFollowing] = useState(false)

  if(viewMode==='list'){
    return(
      <div className="group bg-white rounded-2xl border border-slate-100 px-5 py-4 flex items-center gap-4 transition-all duration-300 hover:border-blue-200 hover:shadow-lg hover:-translate-y-0.5"
        style={{ boxShadow:'0 2px 8px rgba(0,0,0,0.04)' }}>
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 border border-slate-100 hidden sm:flex" style={{ background:company.logoBg }}>{company.logo}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors" style={F}>{company.name}</h3>
            <BadgeCheck size={13} className="text-blue-500"/>
            {company.featured && <span className="text-[9.5px] font-bold px-1.5 py-0.5 rounded-full text-white flex-shrink-0" style={{ background:'linear-gradient(135deg,#F59E0B,#EF4444)' }}>Featured</span>}
          </div>
          <div className="flex items-center gap-3 flex-wrap text-xs text-slate-500 mb-2">
            <span className="flex items-center gap-1"><Building2 size={10} className="text-blue-400"/>{company.industry}</span>
            <span className="flex items-center gap-1"><MapPin size={10} className="text-blue-400"/>{company.location}</span>
            <span className="flex items-center gap-1"><Users size={10} className="text-teal-500"/>{company.size} employees</span>
            <span className="flex items-center gap-1"><Star size={10} className="text-amber-400" fill="#FBBF24"/>{company.rating}</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {company.tags.map(t=><span key={t} className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-100">{t}</span>)}
          </div>
        </div>
        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          <div className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full" style={{ background:'#14B8A620', color:'#14B8A6', border:'1px solid #14B8A630' }}>
            <Briefcase size={11}/>{company.openJobs} Jobs
          </div>
          <div className="flex items-center gap-1.5">
            <button onClick={()=>setFollowing(f=>!f)}
              className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${following?'bg-red-500 text-white':'bg-slate-100 text-slate-400 hover:bg-red-50 hover:text-red-500'}`}>
              <Heart size={13} fill={following?'white':'none'}/>
            </button>
            <button onClick={()=>onView(company)}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all" style={{ ...F, boxShadow:'0 2px 8px rgba(37,99,235,0.25)' }}>
              View <ArrowRight size={11}/>
            </button>
          </div>
        </div>
      </div>
    )
  }

  return(
    <div className="group relative bg-white rounded-2xl border border-slate-100 p-6 flex flex-col items-center text-center gap-4 transition-all duration-300 hover:-translate-y-2 hover:border-blue-200 hover:shadow-xl cursor-pointer"
      style={{ boxShadow:'0 2px 12px rgba(0,0,0,0.04)' }} onClick={()=>onView(company)}>
      {company.featured && (
        <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1 text-[9.5px] font-bold px-3 py-0.5 rounded-full text-white whitespace-nowrap"
          style={{ background:'linear-gradient(135deg,#F59E0B,#EF4444)', boxShadow:'0 2px 8px rgba(245,158,11,0.35)' }}>
          <Star size={8} fill="white"/> Featured Employer
        </div>
      )}
      {/* Hiring badge */}
      {company.hiring && (
        <div className="absolute top-4 right-4 flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-100">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"/> Hiring
        </div>
      )}
      {/* Logo */}
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl border border-slate-100 transition-all duration-300 group-hover:scale-110" style={{ background:company.logoBg }}>
        {company.logo}
      </div>
      {/* Name + verified */}
      <div>
        <div className="flex items-center justify-center gap-1.5 mb-0.5">
          <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug" style={F}>{company.name}</h3>
          <BadgeCheck size={13} className="text-blue-500 flex-shrink-0"/>
        </div>
        <span className="text-xs text-slate-500 font-medium">{company.industry}</span>
      </div>
      {/* Rating */}
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_,i)=><Star key={i} size={12} fill={i<Math.floor(company.rating)?'#F59E0B':'none'} className={i<Math.floor(company.rating)?'text-amber-400':'text-slate-200'}/>)}
        <span className="text-xs text-slate-500 ml-1 font-semibold">{company.rating}</span>
      </div>
      {/* Tags */}
      <div className="flex flex-wrap justify-center gap-1.5">
        {company.tags.map(t=>(
          <span key={t} className="text-[10.5px] font-semibold px-2.5 py-1 rounded-full" style={{ background:'#F0FDFA', color:'#0D9488', border:'1px solid #99F6E4' }}>{t}</span>
        ))}
      </div>
      {/* Divider */}
      <div className="w-full h-px bg-slate-100"/>
      {/* Meta grid */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 w-full text-xs text-slate-500">
        <div className="flex items-center gap-1.5"><MapPin size={11} className="text-blue-400"/><span className="truncate">{company.location}</span></div>
        <div className="flex items-center gap-1.5"><Users size={11} className="text-teal-500"/><span className="truncate">{company.size}</span></div>
        <div className="flex items-center gap-1.5"><Building2 size={11} className="text-purple-400"/><span className="truncate">Est. {company.founded}</span></div>
        <div className="flex items-center gap-1.5"><Globe size={11} className="text-slate-400"/><span className="truncate">{company.website}</span></div>
      </div>
      {/* Open jobs pill */}
      <div className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl font-bold text-sm"
        style={{ background:'#14B8A615', color:'#14B8A6', border:'1.5px solid #14B8A625' }}>
        <Briefcase size={14}/> {company.openJobs} Open Job{company.openJobs!==1?'s':''}
      </div>
      {/* CTA */}
      <button className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-all group-hover:shadow-lg"
        style={{ ...F, boxShadow:'0 2px 10px rgba(37,99,235,0.25)' }}>
        View Company <ArrowRight size={13} className="inline ml-1"/>
      </button>
      {/* Follow */}
      <button onClick={e=>{e.stopPropagation();setFollowing(f=>!f)}}
        className={`absolute bottom-[72px] right-4 w-7 h-7 rounded-lg flex items-center justify-center transition-all ${following?'bg-red-500 text-white':'bg-slate-100 text-slate-400 hover:bg-red-50 hover:text-red-500'}`}>
        <Heart size={12} fill={following?'white':'none'}/>
      </button>
    </div>
  )
}

/* ════════════════════════════════════════════
   COMPANIES GRID
════════════════════════════════════════════ */
const CompaniesGrid = ({ companies, loading, viewMode, onView }) => {
  if(loading){
    return(
      <div className={viewMode==='grid'?'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5':'flex flex-col gap-3'}>
        {[...Array(6)].map((_,i)=><CompanyCardSkeleton key={i}/>)}
      </div>
    )
  }
  if(companies.length===0){
    return(
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-20 h-20 rounded-3xl bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center mb-5">
          <AlertCircle size={32} className="text-slate-300"/>
        </div>
        <h3 className="text-lg font-bold text-slate-700 mb-2" style={F}>No Companies Found</h3>
        <p className="text-slate-400 text-sm mb-2 max-w-xs">Try adjusting your search terms or removing some filters.</p>
      </div>
    )
  }
  if(viewMode==='list') return <div className="flex flex-col gap-3">{companies.map(c=><CompanyCard key={c.id} company={c} viewMode="list" onView={onView}/>)}</div>
  return <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">{companies.map(c=><CompanyCard key={c.id} company={c} viewMode="grid" onView={onView}/>)}</div>
}

/* ════════════════════════════════════════════
   PAGINATION
════════════════════════════════════════════ */
const Pagination = ({ page, total, onChange }) => {
  if(total<=1)return null
  return(
    <div className="flex items-center justify-center gap-1.5 mt-10 flex-wrap">
      <button onClick={()=>onChange(page-1)} disabled={page===1}
        className="flex items-center gap-1.5 px-4 py-2 rounded-xl border text-xs font-semibold transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:border-blue-300 hover:text-blue-600"
        style={{ background:'#FFFFFF', borderColor:'#E2E8F0', color:'#64748B', ...F }}>
        <ChevronLeft size={14}/> Previous
      </button>
      {Array.from({length:total},(_,i)=>i+1).map(p=>(
        <button key={p} onClick={()=>onChange(p)}
          className="w-9 h-9 rounded-xl text-sm font-bold border transition-all"
          style={{ background:page===p?'linear-gradient(135deg,#2563EB,#1D4ED8)':'#FFFFFF', borderColor:page===p?'#2563EB':'#E2E8F0', color:page===p?'#FFFFFF':'#64748B', boxShadow:page===p?'0 4px 12px rgba(37,99,235,0.30)':'none', ...F }}>
          {p}
        </button>
      ))}
      <button onClick={()=>onChange(page+1)} disabled={page===total}
        className="flex items-center gap-1.5 px-4 py-2 rounded-xl border text-xs font-semibold transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:border-blue-300 hover:text-blue-600"
        style={{ background:'#FFFFFF', borderColor:'#E2E8F0', color:'#64748B', ...F }}>
        Next <ChevronRight size={14}/>
      </button>
    </div>
  )
}

/* ════════════════════════════════════════════
   COMPANY DETAIL MODAL / PAGE
════════════════════════════════════════════ */
const CompanyDetailModal = ({ company, onClose }) => {
  const jobs = COMPANIES.filter(c=>c.id===company.id).length>0
    ? [
        { id:1, title:'Senior Frontend Developer', location:company.location, exp:'3–6 yrs', sal:`₹${company.openJobs}L–₹${company.openJobs+10}L`, type:'permanent' },
        { id:2, title:'Backend Engineer',           location:company.location, exp:'2–5 yrs', sal:`₹10L–₹18L`, type:'permanent' },
        { id:3, title:'DevOps Engineer',            location:'Remote',          exp:'3–7 yrs', sal:`₹14L–₹24L`, type:'remote' },
      ].slice(0, Math.min(company.openJobs, 3))
    : []

  return(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}/>
      <div className="relative bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col" style={{ boxShadow:'0 24px 64px rgba(0,0,0,0.20)' }}>
        {/* Header */}
        <div className="relative overflow-hidden px-7 pt-7 pb-6" style={{ background:'linear-gradient(135deg,#EFF6FF,#F0FDFA)' }}>
          <button onClick={onClose} className="absolute top-5 right-5 w-8 h-8 rounded-xl bg-white/80 flex items-center justify-center text-slate-500 hover:bg-white transition-all z-10">
            <X size={16}/>
          </button>
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl border border-white/80 flex-shrink-0" style={{ background:company.logoBg }}>{company.logo}</div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-xl font-extrabold text-slate-900" style={{ ...F, letterSpacing:'-0.02em' }}>{company.name}</h2>
                <BadgeCheck size={16} className="text-blue-500"/>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">{company.industry}</span>
                {company.featured && <span className="text-[9.5px] font-bold px-2 py-0.5 rounded-full text-white" style={{ background:'linear-gradient(135deg,#F59E0B,#EF4444)' }}>Featured</span>}
              </div>
              <div className="flex items-center gap-0.5 mt-2">
                {[...Array(5)].map((_,i)=><Star key={i} size={12} fill={i<Math.floor(company.rating)?'#F59E0B':'none'} className={i<Math.floor(company.rating)?'text-amber-400':'text-slate-200'}/>)}
                <span className="text-xs text-slate-500 ml-1 font-semibold">{company.rating}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 px-7 py-6">
          {/* About */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3"><Building2 size={14} className="text-blue-600"/><h3 className="text-sm font-bold text-slate-900" style={F}>About the Company</h3></div>
            <p className="text-sm text-slate-500 leading-relaxed">{company.desc}</p>
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {[
              { icon:MapPin,   label:'Location',  val:company.location,            color:'#2563EB' },
              { icon:Users,    label:'Team Size',  val:`${company.size} employees`, color:'#14B8A6' },
              { icon:Building2,label:'Founded',   val:company.founded,             color:'#8B5CF6' },
              { icon:Globe,    label:'Website',   val:company.website,             color:'#F59E0B' },
            ].map(r=>{ const Icon=r.icon; return(
              <div key={r.label} className="flex items-center gap-2.5 bg-slate-50 rounded-xl px-3.5 py-2.5 border border-slate-100">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background:`${r.color}15` }}>
                  <Icon size={13} style={{ color:r.color }}/>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">{r.label}</div>
                  <div className="text-xs text-slate-800 font-semibold mt-0.5" style={F}>{r.val}</div>
                </div>
              </div>
            )})}
          </div>

          {/* Tags */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3"><Hash size={14} className="text-teal-600"/><h3 className="text-sm font-bold text-slate-900" style={F}>Tech Stack / Expertise</h3></div>
            <div className="flex flex-wrap gap-2">
              {company.tags.map(t=><span key={t} className="text-sm font-semibold px-3 py-1.5 rounded-xl" style={{ background:'#F0FDFA', color:'#0D9488', border:'1px solid #99F6E4' }}>{t}</span>)}
            </div>
          </div>

          {/* Open Jobs */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2"><Briefcase size={14} className="text-blue-600"/><h3 className="text-sm font-bold text-slate-900" style={F}>Open Positions ({company.openJobs})</h3></div>
              <a href="#" className="text-xs font-bold text-blue-600 hover:underline" style={F}>View all →</a>
            </div>
            <div className="flex flex-col gap-2.5">
              {jobs.map(j=>(
                <div key={j.id} className="flex items-center justify-between gap-3 bg-white rounded-xl border border-slate-100 px-4 py-3 hover:border-blue-200 transition-all group" style={{ boxShadow:'0 1px 4px rgba(0,0,0,0.04)' }}>
                  <div>
                    <div className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors" style={F}>{j.title}</div>
                    <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400">
                      <span className="flex items-center gap-1"><MapPin size={9}/>{j.location}</span>
                      <span className="flex items-center gap-1"><TrendingUp size={9}/>{j.exp}</span>
                      <span className="flex items-center gap-1"><Briefcase size={9}/>{j.sal}</span>
                    </div>
                  </div>
                  <button className="flex items-center gap-1 px-3.5 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-lg flex-shrink-0 hover:bg-blue-700 transition-all" style={F}>
                    Apply <ArrowRight size={11}/>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-7 py-4 border-t border-slate-100 flex items-center gap-3">
          <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-all" style={{ ...F, boxShadow:'0 4px 14px rgba(37,99,235,0.30)' }}>
            View All Jobs <ArrowRight size={14}/>
          </button>
          <a href={`https://${company.website}`} target="_blank" rel="noreferrer"
            className="flex items-center justify-center gap-1.5 px-5 py-3 border-2 border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:border-blue-300 hover:text-blue-600 transition-all" style={F}>
            <Globe size={14}/> Website <ExternalLink size={12}/>
          </a>
        </div>
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════
   TOP HIRING COMPANIES STRIP
════════════════════════════════════════════ */
const TopHiringStrip = ({ companies, onView }) => {
  const top = companies.filter(c=>c.featured).slice(0,5)
  return(
    <div className="bg-white rounded-2xl border border-slate-200 p-5 mb-6" style={{ boxShadow:'0 2px 12px rgba(0,0,0,0.04)' }}>
      <div className="flex items-center gap-2 mb-4">
        <Award size={15} className="text-amber-500"/>
        <h3 className="text-sm font-bold text-slate-900" style={F}>Top Hiring Companies</h3>
        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse ml-1"/>
      </div>
      <div className="flex flex-wrap gap-3">
        {top.map(c=>(
          <button key={c.id} onClick={()=>onView(c)}
            className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl border transition-all hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md group"
            style={{ background:'#F8FAFC', borderColor:'#E2E8F0' }}>
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-base flex-shrink-0" style={{ background:c.logoBg }}>{c.logo}</div>
            <div className="text-left">
              <div className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors" style={F}>{c.name}</div>
              <div className="text-[10px] text-teal-600 font-semibold">{c.openJobs} jobs open</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════
   COMPANIES PAGE
════════════════════════════════════════════ */
const CompaniesPage = () => {
  const [searchQ, setSearchQ] = useState({ name:'', industry:'', location:'' })
  const [sideF,   setSideF]   = useState({ industries:[], sizes:[], locations:[] })
  const [sort,    setSort]     = useState('featured')
  const [viewMode,setViewMode] = useState('grid')
  const [page,    setPage]     = useState(1)
  const [loading, setLoading]  = useState(false)
  const [drawer,  setDrawer]   = useState(false)
  const [detail,  setDetail]   = useState(null)

  const activeCount = Object.values(sideF).flat().length
  const resetAll = ()=>{ setSearchQ({name:'',industry:'',location:''}); setSideF({industries:[],sizes:[],locations:[]}); setPage(1) }

  const filtered = useMemo(()=>{
    let r=[...COMPANIES]
    const n=searchQ.name.toLowerCase()
    if(n)r=r.filter(c=>c.name.toLowerCase().includes(n)||c.industry.toLowerCase().includes(n)||c.tags.some(t=>t.toLowerCase().includes(n)))
    if(searchQ.industry&&!searchQ.industry.startsWith('All'))r=r.filter(c=>c.industry===searchQ.industry)
    if(searchQ.location&&!searchQ.location.startsWith('All'))r=r.filter(c=>c.location===searchQ.location)
    if(sideF.industries.length)r=r.filter(c=>sideF.industries.includes(c.industry))
    if(sideF.locations.length)r=r.filter(c=>sideF.locations.includes(c.location))
    if(sort==='rating')r.sort((a,b)=>b.rating-a.rating)
    else if(sort==='jobs')r.sort((a,b)=>b.openJobs-a.openJobs)
    else r.sort((a,b)=>(b.featured?1:0)-(a.featured?1:0))
    return r
  },[searchQ,sideF,sort])

  const totalPages = Math.ceil(filtered.length/PER_PAGE)
  const paginated  = filtered.slice((page-1)*PER_PAGE, page*PER_PAGE)

  return(
    <div className='pt-20' style={{ background:'#F1F5F9', minHeight:'100vh', ...F }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap');*{box-sizing:border-box}`}</style>

      <CompaniesHeader total={COMPANIES.length}/>

      {/* Search bar */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 -mt-5 relative z-10 mb-6">
        <CompanySearchBar search={searchQ} setSearch={setSearchQ} onSearch={()=>setPage(1)}/>
      </div>

      {/* Mobile filter bar */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 mb-4 lg:hidden">
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={()=>setDrawer(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:border-blue-300 transition-all"
            style={{ boxShadow:'0 1px 4px rgba(0,0,0,0.04)', ...F }}>
            <Filter size={14}/> Filters
            {activeCount>0&&<span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-black flex items-center justify-center">{activeCount}</span>}
          </button>
          <div className="flex items-center gap-1.5 ml-auto">
            <select value={sort} onChange={e=>setSort(e.target.value)} className="text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl px-3 py-2 outline-none" style={F}>
              <option value="featured">Featured First</option>
              <option value="jobs">Most Jobs</option>
              <option value="rating">Top Rated</option>
            </select>
            <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1">
              {[{m:'grid',I:LayoutGrid},{m:'list',I:LayoutList}].map(({m,I})=>(
                <button key={m} onClick={()=>setViewMode(m)} className="w-7 h-7 rounded-lg flex items-center justify-center transition-all"
                  style={{ background:viewMode===m?'#2563EB':'transparent', color:viewMode===m?'#FFFFFF':'#94A3B8' }}>
                  <I size={14}/>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main layout */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 pb-16">

        {/* Top hiring strip */}
        <TopHiringStrip companies={COMPANIES} onView={setDetail}/>

        <div className="flex gap-6 items-start">
          {/* Sidebar */}
          <aside className="hidden lg:block w-60 xl:w-64 flex-shrink-0 sticky top-20">
            <CompanyFilters filters={sideF} setFilters={setSideF} onReset={resetAll}/>
          </aside>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Desktop sort row */}
            <div className="hidden lg:flex items-center justify-between mb-5">
              <p className="text-xs text-slate-500 font-medium">
                Showing <span className="text-slate-800 font-bold">{filtered.length}</span> compan{filtered.length!==1?'ies':'y'}
              </p>
              <div className="flex items-center gap-2.5">
                <select value={sort} onChange={e=>setSort(e.target.value)} className="text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl px-3 py-2 outline-none cursor-pointer hover:border-blue-300 transition-colors appearance-none pr-7"
                  style={{ ...F, backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%2394A3B8'/%3E%3C/svg%3E")`, backgroundRepeat:'no-repeat', backgroundPosition:'right 10px center' }}>
                  <option value="featured">Featured First</option>
                  <option value="jobs">Most Jobs</option>
                  <option value="rating">Top Rated</option>
                </select>
                <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1">
                  {[{m:'grid',I:LayoutGrid},{m:'list',I:LayoutList}].map(({m,I})=>(
                    <button key={m} onClick={()=>setViewMode(m)} className="w-7 h-7 rounded-lg flex items-center justify-center transition-all"
                      style={{ background:viewMode===m?'#2563EB':'transparent', color:viewMode===m?'#FFFFFF':'#94A3B8' }}>
                      <I size={14}/>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Active filter chips */}
            {activeCount>0&&(
              <div className="flex flex-wrap gap-2 mb-4">
                {Object.entries(sideF).flatMap(([g,vals])=>vals.map(v=>(
                  <span key={`${g}-${v}`} className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                    {v}<button onClick={()=>setSideF(p=>({...p,[g]:p[g].filter(x=>x!==v)}))}><X size={11}/></button>
                  </span>
                )))}
                <button onClick={resetAll} className="text-xs font-semibold text-red-500 hover:text-red-700 flex items-center gap-1 px-3 py-1.5 rounded-full bg-red-50 border border-red-100 transition-colors">
                  <X size={11}/> Clear all
                </button>
              </div>
            )}

            <CompaniesGrid companies={paginated} loading={loading} viewMode={viewMode} onView={setDetail}/>
            <Pagination page={page} total={totalPages} onChange={p=>{setPage(p);window.scrollTo({top:0,behavior:'smooth'})}}/>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="relative overflow-hidden py-14 px-6" style={{ background:'linear-gradient(135deg,#1E40AF 0%,#2563EB 55%,#0D9488 100%)' }}>
        <div className="absolute right-0 top-0 w-64 h-64 rounded-full opacity-10 -translate-y-1/3 translate-x-1/4 bg-white pointer-events-none"/>
        <div className="max-w-2xl mx-auto text-center relative z-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3" style={{ ...F, letterSpacing:'-0.02em' }}>Are You an Employer?</h2>
          <p className="text-blue-100 text-sm mb-6">List your company, post jobs, and connect with thousands of qualified candidates today.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button className="flex items-center gap-2 px-7 py-3.5 bg-white text-blue-700 font-bold text-sm rounded-xl hover:bg-blue-50 transition-all" style={{ ...F, boxShadow:'0 4px 16px rgba(0,0,0,0.15)' }}>
              <Building2 size={15}/> List Your Company
            </button>
            <button className="flex items-center gap-2 px-7 py-3.5 text-white font-bold text-sm rounded-xl border-2 border-white/30 hover:bg-white/10 transition-all" style={F}>
              Post a Job <ArrowRight size={15}/>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      {drawer&&(
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={()=>setDrawer(false)}/>
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-white overflow-y-auto p-5" style={{ boxShadow:'-8px 0 32px rgba(0,0,0,0.15)' }}>
            <CompanyFilters filters={sideF} setFilters={setSideF} onReset={resetAll} isMobile onClose={()=>setDrawer(false)}/>
          </div>
        </div>
      )}

      {/* Company detail modal */}
      {detail && <CompanyDetailModal company={detail} onClose={()=>setDetail(null)}/>}
    </div>
  )
}

export default CompaniesPage