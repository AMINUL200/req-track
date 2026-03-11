import React, { useState } from 'react'
import { Search, MapPin, Briefcase, ChevronRight, Sparkles, TrendingUp, Users, Building2, Star, ArrowRight, Zap } from 'lucide-react'

const HeroSection = () => {
  const [keyword, setKeyword] = useState('')
  const [location, setLocation] = useState('')
  const [experience, setExperience] = useState('')

  const stats = [
    { icon: Briefcase, label: 'Open Roles', value: '12,400+' },
    { icon: Building2, label: 'Organizations', value: '850+' },
    { icon: Users, label: 'Hired This Month', value: '3,200+' },
  ]

  const popularTags = ['React Developer', 'Product Manager', 'Data Analyst', 'UI/UX Designer', 'DevOps']

  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #F8FAFC 0%, #EFF6FF 50%, #F0FDFA 100%)',
      }}
    >
      {/* Google Font Import */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600&display=swap');
      `}</style>

      {/* Background blobs */}
      <div className="absolute w-[500px] h-[500px] bg-gradient-to-r from-blue-100 to-transparent rounded-full filter blur-[80px] opacity-40 top-[-100px] right-[200px] pointer-events-none" />
      <div className="absolute w-[350px] h-[350px] bg-gradient-to-r from-teal-100 to-transparent rounded-full filter blur-[80px] opacity-40 bottom-0 right-[50px] pointer-events-none" />
      <div className="absolute w-[300px] h-[300px] bg-gradient-to-r from-purple-100 to-transparent rounded-full filter blur-[80px] opacity-40 top-[200px] left-[-80px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* LEFT SIDE */}
          <div className={`
            ${window.innerWidth <= 968 ? 'text-center' : ''}
          `}>
            {/* Badge */}
            <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-blue-100 to-teal-100 border border-blue-200 text-blue-700 text-xs font-semibold px-3.5 py-1.5 rounded-full mb-6 animate-[fadeSlideDown_0.6s_ease_forwards]">
              <Sparkles size={13} />
              #1 Recruitment Platform for Growing Teams
            </div>

            {/* Headline */}
            <h1 className="font-outfit font-black text-4xl md:text-5xl lg:text-6xl leading-tight text-slate-900 mb-5 tracking-tight animate-[fadeSlideUp_0.7s_ease_0.1s_both]">
              Find Your
              <span className="block bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                Dream Job
              </span>
              Faster
            </h1>

            {/* Subtitle */}
            <p className="font-jakarta text-base md:text-lg text-slate-500 mb-9 max-w-[480px] lg:mx-0 animate-[fadeSlideUp_0.7s_ease_0.2s_both]">
              Explore thousands of job opportunities from top organizations.
              Apply easily and track your application progress — all in one place.
            </p>

            {/* Search Card */}
            <div className="bg-white rounded-2xl shadow-[0_4px_40px_rgba(37,99,235,0.10)] p-2 flex flex-wrap items-stretch gap-1 animate-[fadeSlideUp_0.7s_ease_0.3s_both] border border-slate-200">
              {/* Keyword */}
              <div className="flex-1 min-w-[200px] flex items-center gap-2.5 p-3.5 rounded-xl bg-slate-50 border-2 border-transparent focus-within:border-blue-600 focus-within:bg-blue-50 focus-within:shadow-[0_0_0_3px_rgba(37,99,235,0.08)] transition-all cursor-text">
                <Search className="w-[18px] h-[18px] text-slate-400 focus-within:text-blue-600" />
                <input
                  className="w-full bg-transparent outline-none font-outfit text-sm text-slate-900 placeholder:text-slate-400"
                  type="text"
                  placeholder="Job Title / Keyword"
                  value={keyword}
                  onChange={e => setKeyword(e.target.value)}
                />
              </div>

              <div className="w-px bg-slate-200 my-2" />

              {/* Location */}
              <div className="flex-1 flex items-center gap-2.5 p-3.5 rounded-xl bg-slate-50 border-2 border-transparent focus-within:border-blue-600 focus-within:bg-blue-50 focus-within:shadow-[0_0_0_3px_rgba(37,99,235,0.08)] transition-all cursor-text">
                <MapPin className="w-[18px] h-[18px] text-slate-400 focus-within:text-blue-600" />
                <input
                  className="w-full bg-transparent outline-none font-outfit text-sm text-slate-900 placeholder:text-slate-400"
                  type="text"
                  placeholder="Location"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                />
              </div>

              <div className="w-px bg-slate-200 my-2" />

              {/* Experience */}
              <div className="flex-1 min-w-[140px] flex items-center gap-2.5 p-3.5 rounded-xl bg-slate-50 border-2 border-transparent focus-within:border-blue-600 focus-within:bg-blue-50 focus-within:shadow-[0_0_0_3px_rgba(37,99,235,0.08)] transition-all cursor-text">
                <TrendingUp className="w-[18px] h-[18px] text-slate-400 focus-within:text-blue-600" />
                <select
                  className="w-full bg-transparent outline-none font-outfit text-sm text-slate-900 cursor-pointer appearance-none"
                  value={experience}
                  onChange={e => setExperience(e.target.value)}
                >
                  <option value="">Experience</option>
                  <option value="0">Fresher (0 yr)</option>
                  <option value="1">1–2 Years</option>
                  <option value="3">3–5 Years</option>
                  <option value="5">5–8 Years</option>
                  <option value="10">10+ Years</option>
                </select>
              </div>

              {/* Button */}
              <button className="flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white border-none rounded-xl font-outfit font-bold text-sm cursor-pointer whitespace-nowrap shadow-[0_4px_16px_rgba(37,99,235,0.35)] hover:from-blue-700 hover:to-blue-800 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(37,99,235,0.40)] active:translate-y-0 transition-all">
                <Search size={16} />
                Search Jobs
              </button>
            </div>

            {/* Popular Tags */}
            <div className="flex flex-wrap items-center gap-2 mt-4.5 animate-[fadeSlideUp_0.7s_ease_0.4s_both] justify-center lg:justify-start">
              <span className="text-xs text-slate-400 font-medium mr-2">Popular:</span>
              {popularTags.map(tag => (
                <button key={tag} className="text-xs text-blue-600 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-full cursor-pointer font-medium font-outfit hover:bg-blue-100 hover:border-blue-600 hover:-translate-y-0.5 transition-all flex items-center gap-1">
                  {tag}
                  <ArrowRight size={11} />
                </button>
              ))}
            </div>

            {/* Stats */}
            <div className="flex gap-6 mt-9 animate-[fadeSlideUp_0.7s_ease_0.5s_both] flex-wrap justify-center lg:justify-start">
              {stats.map((s, i) => (
                <React.Fragment key={s.label}>
                  <div className="flex items-center gap-2.5">
                    <div className="w-[38px] h-[38px] rounded-[10px] bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center flex-shrink-0">
                      <s.icon className="w-[18px] h-[18px] text-blue-600" />
                    </div>
                    <div>
                      <div className="text-lg font-extrabold text-slate-900 font-outfit leading-tight">{s.value}</div>
                      <div className="text-xs text-slate-400 font-jakarta font-normal">{s.label}</div>
                    </div>
                  </div>
                  {i < stats.length - 1 && <div className="w-px h-8 bg-slate-200" />}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* RIGHT SIDE — Illustration */}
          <div className="relative hidden lg:flex items-center justify-center animate-[fadeSlideLeft_0.8s_ease_0.2s_both]">
            {/* Decorative dots */}
            <div className="absolute top-[-20px] right-[-20px] grid grid-cols-5 gap-1.5 z-0 opacity-35">
              {Array.from({ length: 25 }).map((_, i) => (
                <div key={i} className="w-[5px] h-[5px] rounded-full bg-blue-600" />
              ))}
            </div>

            {/* Floating card – top left */}
            <div className="absolute top-[-20px] left-[-50px] bg-white rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.10)] border border-slate-200 p-3 z-10 animate-[floatBob_3s_ease-in-out_infinite]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                  <Zap size={16} className="text-green-500" />
                </div>
                <div>
                  <div className="text-base font-extrabold text-slate-900 font-outfit">98%</div>
                  <div className="text-xs text-slate-400 font-jakarta">Placement Rate</div>
                </div>
              </div>
            </div>

            {/* Main card */}
            <div className="bg-white rounded-2xl shadow-[0_20px_60px_rgba(37,99,235,0.12)] p-7 w-[340px] border border-slate-200 relative z-20">
              <div className="flex items-center justify-between mb-5.5">
                <span className="text-sm font-bold text-slate-900 font-outfit">Top Openings</span>
                <span className="text-xs font-semibold text-green-600 bg-green-100 px-2.5 py-1 rounded-full">● Live</span>
              </div>

              {[
                { logo: '🏢', bg: 'bg-blue-50', role: 'Senior React Developer', company: 'TechNova Inc.', type: 'Full-time', loc: 'Bangalore' },
                { logo: '🎯', bg: 'bg-orange-50', role: 'Product Manager', company: 'GrowthStack', type: 'Remote', loc: 'Mumbai' },
                { logo: '📊', bg: 'bg-teal-50', role: 'Data Analyst', company: 'InsightBridge', type: 'Contract', loc: 'Hyderabad' },
              ].map(job => (
                <div key={job.role} className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 mb-2.5 hover:border-blue-200 hover:bg-blue-50 hover:translate-x-0.5 transition-all cursor-pointer last:mb-0">
                  <div className={`w-10 h-10 rounded-[10px] ${job.bg} flex items-center justify-center text-lg flex-shrink-0`}>
                    {job.logo}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-bold text-slate-900 font-outfit mb-0.5">{job.role}</div>
                    <div className="text-[11.5px] text-slate-500 font-jakarta mb-1.5">{job.company}</div>
                    <div className="flex gap-1 flex-wrap">
                      <span className="text-[10.5px] font-medium px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">{job.type}</span>
                      <span className="text-[10.5px] font-medium px-2 py-0.5 rounded-full bg-teal-50 text-teal-700">📍 {job.loc}</span>
                    </div>
                  </div>
                  <ChevronRight size={15} className="text-slate-300 group-hover:text-blue-600 transition-colors mt-1" />
                </div>
              ))}

              {/* Apply CTA inside card */}
              <button className="mt-4 w-full py-3 bg-gradient-to-r from-blue-600 to-teal-600 text-white border-none rounded-xl font-outfit font-bold text-sm cursor-pointer flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(37,99,235,0.25)] hover:opacity-90 transition-opacity">
                Browse All Jobs <ArrowRight size={15} />
              </button>
            </div>

            {/* Floating card – bottom right */}
            <div className="absolute bottom-5 right-[-45px] bg-white rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.10)] border border-slate-200 p-3 z-10 animate-[floatBob_3s_ease-in-out_infinite_1.5s]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-yellow-100 flex items-center justify-center">
                  <Star size={16} className="text-yellow-500" />
                </div>
                <div>
                  <div className="text-base font-extrabold text-slate-900 font-outfit">4.9★</div>
                  <div className="text-xs text-slate-400 font-jakarta">Candidate Rating</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Keyframes for animations */}
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeSlideDown {
          from { opacity: 0; transform: translateY(-12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeSlideLeft {
          from { opacity: 0; transform: translateX(32px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes floatBob {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </section>
  )
}

export default HeroSection