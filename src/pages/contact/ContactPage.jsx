import { useState } from "react";
import {
  Phone, Mail, MapPin, Clock, Send, ChevronDown, CheckCircle,
  Linkedin, Twitter, Facebook, Instagram, ArrowRight,
} from "lucide-react";

// ─── Navbar ──────────────────────────────────────────────────────────────────
const Navbar = () => (
  <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
    <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
      <a href="#" className="flex items-center gap-2 font-extrabold text-xl text-blue-600 tracking-tight">
        ReqTrack
        <span className="w-2 h-2 rounded-full bg-teal-500 inline-block" />
      </a>
      <div className="hidden md:flex items-center gap-8">
        {["Dashboard", "Jobs", "Candidates"].map((l) => (
          <a key={l} href="#" className="text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors">{l}</a>
        ))}
        <a href="#" className="text-sm font-semibold text-blue-600 border-b-2 border-blue-600 pb-0.5">Contact</a>
      </div>
      <a href="#" className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all hover:-translate-y-0.5 shadow-sm">
        Browse Jobs
      </a>
    </div>
  </nav>
);

// ─── Hero ────────────────────────────────────────────────────────────────────
const ContactHero = () => (
  <section className="relative bg-slate-900 overflow-hidden py-24 text-center">
    <div
      className="absolute inset-0 opacity-[0.04]"
      style={{
        backgroundImage: "linear-gradient(white 1px,transparent 1px),linear-gradient(90deg,white 1px,transparent 1px)",
        backgroundSize: "48px 48px",
      }}
    />
    <div
      className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full pointer-events-none"
      style={{ background: "radial-gradient(ellipse,rgba(37,99,235,0.3) 0%,transparent 65%)" }}
    />
    <div
      className="absolute bottom-0 left-0 right-0 h-[3px]"
      style={{ background: "linear-gradient(90deg,#2563EB 0%,#14B8A6 50%,#2563EB 100%)" }}
    />
    <div className="relative z-10 max-w-3xl mx-auto px-6">
      <div className="inline-flex items-center gap-2 bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-6">
        <span className="w-1.5 h-1.5 rounded-full bg-teal-400 inline-block" />
        We're here to help
      </div>
      <h1
        className="font-extrabold text-white leading-tight tracking-tight mb-5"
        style={{ fontSize: "clamp(2.4rem,5vw,3.6rem)" }}
      >
        Let's Start a<br />
        <span className="text-teal-400">Conversation</span>
      </h1>
      <p className="text-slate-400 text-lg leading-relaxed max-w-xl mx-auto mb-10">
        Have questions about jobs, recruitment, or partnerships? Our team is always ready to assist you.
      </p>
      <div className="flex flex-wrap gap-3 justify-center">
        <a
          href="#contact-form"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-6 py-3 rounded-xl transition-all hover:-translate-y-0.5 shadow-lg shadow-blue-600/30"
        >
          <Send size={16} /> Send a Message
        </a>
        <a
          href="mailto:support@reqtrack.com"
          className="flex items-center gap-2 border border-white/20 hover:border-white/50 hover:bg-white/5 text-white text-sm font-semibold px-6 py-3 rounded-xl transition-all hover:-translate-y-0.5"
        >
          <Mail size={16} /> Email Support
        </a>
      </div>
    </div>
  </section>
);

// ─── Info Cards ───────────────────────────────────────────────────────────────
const infoCards = [
  {
    Icon: Phone, bg: "bg-blue-50", iconColor: "text-blue-600",
    label: "Phone Support", title: "+91 98765 43210",
    lines: ["Mon – Fri, 9 AM – 6 PM", "Emergency line available"],
  },
  {
    Icon: Mail, bg: "bg-teal-50", iconColor: "text-teal-600",
    label: "Email Us", title: "support@reqtrack.com",
    lines: ["careers@reqtrack.com", "Response within 24 hours"],
  },
  {
    Icon: MapPin, bg: "bg-violet-50", iconColor: "text-violet-600",
    label: "Our Office", title: "Kolkata, West Bengal",
    lines: ["India – 700 001", "Headquarters"],
  },
  {
    Icon: Clock, bg: "bg-amber-50", iconColor: "text-amber-600",
    label: "Working Hours", title: "Mon – Fri",
    lines: ["9:00 AM – 6:00 PM IST", "Closed on holidays"],
  },
];

const ContactInfoCards = () => (
  <section className="bg-slate-50 py-16 px-6">
    <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {infoCards.map(({ Icon, bg, iconColor, label, title, lines }, i) => (
        <div
          key={i}
          className="group bg-white border border-slate-200 rounded-2xl p-7 flex flex-col gap-4 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-blue-600 to-teal-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          <div className={`w-12 h-12 rounded-xl ${bg} ${iconColor} flex items-center justify-center`}>
            <Icon size={22} />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-1">{label}</p>
            <p className="font-bold text-slate-900 text-[15px] mb-1">{title}</p>
            {lines.map((l, j) => (
              <p key={j} className="text-sm text-slate-500 leading-relaxed">{l}</p>
            ))}
          </div>
        </div>
      ))}
    </div>
  </section>
);

// ─── Contact Form ─────────────────────────────────────────────────────────────
const ContactForm = ({ onSuccess }) => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Full name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
    if (!form.subject.trim()) e.subject = "Subject is required";
    if (!form.message.trim()) e.message = "Message cannot be empty";
    return e;
  };

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors((er) => ({ ...er, [e.target.name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) { setErrors(e2); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1600));
    setLoading(false);
    onSuccess();
  };

  const base = "w-full bg-white border rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all duration-200";
  const normal = `${base} border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10`;
  const err = `${base} border-red-400 focus:border-red-400 focus:ring-4 focus:ring-red-400/10`;

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-700">Full Name <span className="text-red-500">*</span></label>
          <input name="name" className={errors.name ? err : normal} placeholder="John Doe" value={form.name} onChange={handleChange} />
          {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
        </div>
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-700">Email Address <span className="text-red-500">*</span></label>
          <input name="email" type="email" className={errors.email ? err : normal} placeholder="john@company.com" value={form.email} onChange={handleChange} />
          {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-700">Phone Number</label>
          <input name="phone" className={normal} placeholder="+91 98765 43210" value={form.phone} onChange={handleChange} />
        </div>
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-700">Subject <span className="text-red-500">*</span></label>
          <input name="subject" className={errors.subject ? err : normal} placeholder="How can we help?" value={form.subject} onChange={handleChange} />
          {errors.subject && <p className="text-xs text-red-500">{errors.subject}</p>}
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="block text-xs font-semibold text-slate-700">Message <span className="text-red-500">*</span></label>
        <textarea
          name="message"
          className={`${errors.message ? err : normal} resize-y min-h-[130px]`}
          placeholder="Write your message or inquiry here..."
          value={form.message} onChange={handleChange} rows={5}
        />
        {errors.message && <p className="text-xs text-red-500">{errors.message}</p>}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold py-3.5 rounded-xl transition-all hover:-translate-y-0.5 shadow-md shadow-blue-600/25 active:translate-y-0"
      >
        {loading ? (
          <>
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Sending…
          </>
        ) : (
          <><Send size={16} /> Send Message</>
        )}
      </button>
    </form>
  );
};

// ─── Form + Map Section ───────────────────────────────────────────────────────
const FormMapSection = () => {
  const [submitted, setSubmitted] = useState(false);
  const [toast, setToast] = useState(false);

  const handleSuccess = () => {
    setSubmitted(true);
    setToast(true);
    setTimeout(() => setToast(false), 4200);
  };

  return (
    <section id="contact-form" className="bg-slate-100 py-20 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

        {/* Form Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-8 lg:p-10 shadow-sm">
          <div className="mb-7">
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-1.5">Send Us a Message</h2>
            <p className="text-sm text-slate-500">Fill in the form and our team will get back to you within 24 hours.</p>
          </div>
          {submitted ? (
            <div className="flex flex-col items-center text-center py-10 gap-4">
              <CheckCircle size={56} className="text-green-500" strokeWidth={1.5} />
              <h3 className="text-xl font-bold text-slate-900">Message Sent!</h3>
              <p className="text-sm text-slate-500 max-w-xs leading-relaxed">
                Thank you for reaching out. Our team will contact you soon.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-2 bg-blue-50 hover:bg-blue-100 text-blue-600 text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <ContactForm onSuccess={handleSuccess} />
          )}
        </div>

        {/* Map Card */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm flex flex-col">
          <div className="px-7 py-5 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-base mb-0.5">Find Us Here</h3>
            <p className="text-sm text-slate-500">ReqTrack HQ · Kolkata, West Bengal, India</p>
          </div>
          <div className="relative flex-1 min-h-[300px]">
            <iframe
              title="ReqTrack Office"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d117850.29738547879!2d88.26494885703127!3d22.535564800000012!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f882db4908f667%3A0x43e330e68f6c2cbc!2sKolkata%2C%20West%20Bengal!5e0!3m2!1sen!2sin!4v1699000000000!5m2!1sen!2sin"
              className="w-full min-h-[300px] border-none block"
              style={{ height: "100%" }}
              allowFullScreen loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <div className="px-7 py-4 bg-slate-50 border-t border-slate-100 flex flex-wrap gap-5">
            {[
              { Icon: Mail, text: "support@reqtrack.com" },
              { Icon: Phone, text: "+91 98765 43210" },
              { Icon: MapPin, text: "Kolkata, WB 700001" },
            ].map(({ Icon, text }) => (
              <div key={text} className="flex items-center gap-2 text-slate-600">
                <Icon size={14} className="text-blue-500 shrink-0" />
                <span className="text-xs font-medium">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-7 right-7 z-50 flex items-center gap-3 bg-slate-900 border border-l-4 border-green-500 text-white text-sm font-medium px-5 py-4 rounded-xl shadow-2xl max-w-sm">
          <CheckCircle size={18} className="text-green-400 shrink-0" />
          Your message has been sent successfully!
        </div>
      )}
    </section>
  );
};

// ─── Social Strip ─────────────────────────────────────────────────────────────
const SocialStrip = () => (
  <div className="bg-slate-900 py-5 px-6 flex items-center justify-center gap-8 flex-wrap">
    <p className="text-sm text-slate-400 font-medium">Follow us on social media</p>
    <div className="flex gap-3">
      {[Linkedin, Twitter, Facebook, Instagram].map((Icon, i) => (
        <button
          key={i}
          className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-slate-400 flex items-center justify-center hover:bg-blue-600 hover:text-white hover:border-blue-600 hover:-translate-y-0.5 transition-all duration-200"
        >
          <Icon size={17} />
        </button>
      ))}
    </div>
  </div>
);

// ─── FAQ ─────────────────────────────────────────────────────────────────────
const faqs = [
  { q: "How can I apply for a job?", a: 'Browse available jobs on our public listings page and click "Apply Now" to submit your application with your details and resume.' },
  { q: "How can companies post jobs?", a: "Organizations can register on ReqTrack, create an admin account, and post job requirements directly through the platform dashboard." },
  { q: "Can vendors submit candidates?", a: "Yes. Vendors and consultancies can create accounts and submit candidates for open requirements through their dedicated portal." },
  { q: "How can I contact support?", a: "Email us at support@reqtrack.com or use the contact form on this page. We typically respond within 24 hours." },
  { q: "Is there a free trial available?", a: "Yes, organizations can start with a free trial. Contact our team to learn about pricing plans and enterprise options." },
  { q: "How do interviews get scheduled?", a: "HR managers can schedule interviews directly within the platform, send notifications to candidates, and log feedback from panel members." },
];

const ContactFAQ = () => {
  const [open, setOpen] = useState(null);
  return (
    <section className="bg-slate-50 py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <span className="inline-block bg-teal-100 text-teal-700 text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-4">
            FAQ
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-3">Frequently Asked Questions</h2>
          <p className="text-slate-500 max-w-md mx-auto leading-relaxed">Quick answers to the most common questions about ReqTrack.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className={`border rounded-2xl overflow-hidden bg-white transition-all duration-200 ${
                open === i ? "border-blue-500 shadow-md" : "border-slate-200"
              }`}
            >
              <button
                className="w-full flex items-center justify-between gap-3 px-6 py-5 text-left"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span className={`text-sm font-semibold ${open === i ? "text-blue-600" : "text-slate-800"}`}>
                  {faq.q}
                </span>
                <ChevronDown
                  size={18}
                  className={`shrink-0 transition-transform duration-300 ${
                    open === i ? "rotate-180 text-blue-600" : "text-slate-400"
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${open === i ? "max-h-40" : "max-h-0"}`}
              >
                <p className="text-sm text-slate-500 leading-relaxed px-6 pb-5">{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── CTA ─────────────────────────────────────────────────────────────────────
const ContactCTA = () => (
  <section className="relative bg-slate-900 py-20 px-6 text-center overflow-hidden">
    <div
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full pointer-events-none"
      style={{ background: "radial-gradient(ellipse,rgba(20,184,166,0.14) 0%,transparent 65%)" }}
    />
    <div className="relative z-10 max-w-2xl mx-auto">
      <h2
        className="font-extrabold text-white tracking-tight mb-4"
        style={{ fontSize: "clamp(1.8rem,4vw,2.8rem)" }}
      >
        Looking for{" "}
        <span className="text-teal-400">Job Opportunities?</span>
      </h2>
      <p className="text-slate-400 leading-relaxed max-w-md mx-auto mb-10">
        Explore the latest job openings and take the next step in your career journey today.
      </p>
      <div className="flex flex-wrap gap-3 justify-center">
        <a
          href="#"
          className="flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white text-sm font-semibold px-7 py-3.5 rounded-xl transition-all hover:-translate-y-0.5 shadow-lg shadow-teal-500/30"
        >
          Browse Jobs <ArrowRight size={16} />
        </a>
        <a
          href="#"
          className="flex items-center gap-2 border border-white/20 hover:border-white/50 hover:bg-white/5 text-white text-sm font-semibold px-7 py-3.5 rounded-xl transition-all hover:-translate-y-0.5"
        >
          Create Account
        </a>
      </div>
    </div>
  </section>
);

// ─── Footer ──────────────────────────────────────────────────────────────────
const Footer = () => (
  <footer className="bg-slate-900 text-slate-400 border-t border-white/[0.06] px-6 pt-16 pb-8">
    <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
      <div>
        <div className="font-extrabold text-white text-xl mb-3">
          ReqTrack<span className="text-teal-400">.</span>
        </div>
        <p className="text-sm leading-relaxed text-slate-500 max-w-[230px] mb-5">
          Requirement CRM & Recruitment Management platform connecting organizations, HR teams, and talent.
        </p>
        <div className="flex gap-2.5">
          {[Linkedin, Twitter, Facebook, Instagram].map((Icon, i) => (
            <button
              key={i}
              className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 text-slate-400 flex items-center justify-center hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-200"
            >
              <Icon size={15} />
            </button>
          ))}
        </div>
      </div>
      {[
        { title: "Company", links: ["About Us", "Careers", "Blog", "Press"] },
        { title: "Jobs", links: ["Browse Jobs", "Post a Job", "Candidates", "HR Portal"] },
        { title: "Support", links: ["Help Center", "Contact Us", "API Docs", "Privacy Policy"] },
      ].map(({ title, links }) => (
        <div key={title}>
          <p className="text-xs font-bold uppercase tracking-widest text-white mb-4">{title}</p>
          <div className="flex flex-col gap-2.5">
            {links.map((l) => (
              <a key={l} href="#" className="text-sm text-slate-500 hover:text-white transition-colors">{l}</a>
            ))}
          </div>
        </div>
      ))}
    </div>
    <div className="max-w-6xl mx-auto pt-6 border-t border-white/[0.07] flex flex-wrap items-center justify-between gap-3">
      <p className="text-xs text-slate-500">© {new Date().getFullYear()} ReqTrack. All rights reserved.</p>
      <div className="flex gap-5">
        {["Privacy", "Terms", "Cookies"].map((l) => (
          <a key={l} href="#" className="text-xs text-slate-500 hover:text-white transition-colors">{l}</a>
        ))}
      </div>
    </div>
  </footer>
);

// ─── Page ─────────────────────────────────────────────────────────────────────
const ContactPage = () => (
  <div className="min-h-screen overflow-x-hidden">
    <ContactHero />
    <ContactInfoCards />
    <FormMapSection />
    <SocialStrip />
    <ContactFAQ />
    <ContactCTA />
  </div>
);

export default ContactPage;