
import React, { useState } from 'react';
import { UserProfile } from '../types';

interface LandingPageProps {
  onRegisterSuccess: (profile: UserProfile) => void;
  onLoginClick: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onRegisterSuccess, onLoginClick }) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    try {
      const profile: UserProfile = {
        email,
        role: 'read_only',
        consentDate: new Date().toISOString()
      };
      onRegisterSuccess(profile);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white selection:bg-indigo-100 selection:text-indigo-900 overflow-x-hidden">
      {/* Navigation */}
      <nav className="h-24 flex items-center justify-between px-6 sm:px-12 max-w-7xl mx-auto" aria-label="Global">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-[#0f172a] rounded-xl flex items-center justify-center shadow-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758" />
            </svg>
          </div>
          <span className="text-xl font-extrabold text-[#0f172a] tracking-tight">Rocket Insights</span>
        </div>
        <div className="flex items-center gap-6">
          <a href="#faq" className="hidden md:block text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors">FAQ</a>
          <button 
            onClick={onLoginClick} 
            className="bg-[#0f172a] text-white px-8 py-3.5 rounded-full font-black text-xs uppercase tracking-widest shadow-xl shadow-slate-200 hover:scale-105 transition-all"
            aria-label="Login to Platform"
          >
            Start Scanning
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="pt-24 pb-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 bg-indigo-50/80 text-indigo-600 px-6 py-2 rounded-full text-xs font-bold mb-10 border border-indigo-100">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
            <span>The Intelligence Engine for Growth-First Teams</span>
          </div>
          
          <h1 className="text-6xl md:text-[5.5rem] font-black text-[#0f172a] tracking-tight mb-8 leading-[1.05]">
            Stop Searching. <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-indigo-500 to-emerald-500">Scale Intelligence.</span>
          </h1>
          
          <p className="text-xl text-slate-500 mb-14 max-w-3xl mx-auto font-medium leading-relaxed">
            Scan 50+ major trade journals instantly. Rocket Insights is the all-in-one market intelligence platform for SDRs, Research Teams, and CXOs looking to track <strong>agency wins</strong> and <strong>client appointments</strong>.
          </p>

          <form onSubmit={handleRegister} className="max-w-xl mx-auto relative mb-6">
            <div className="flex p-1.5 bg-white border border-slate-200 rounded-[1.5rem] shadow-2xl shadow-slate-200 focus-within:ring-4 focus-within:ring-indigo-100 transition-all">
              <input 
                type="email" 
                required
                placeholder="Enter work email..." 
                className="flex-1 px-8 py-4.5 rounded-xl text-slate-900 text-lg placeholder-slate-400 focus:outline-none font-medium"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button 
                type="submit"
                disabled={isSubmitting}
                className="bg-[#0f172a] text-white px-8 py-4.5 rounded-[1.2rem] font-bold text-lg hover:bg-slate-800 transition-all flex items-center gap-2 group"
                aria-label="Request Access"
              >
                {isSubmitting ? '...' : (
                  <>Get Access <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg></>
                )}
              </button>
            </div>
          </form>
          <p className="text-[13px] text-slate-400 font-medium">Free trial available. Includes our Daily Market Briefing.</p>
        </div>
      </header>

      {/* Authority Section (New: Good for Indexing) */}
      <section className="py-20 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-12">Tracking Signals Across 50+ Global Sources</p>
          <div className="flex flex-wrap justify-center gap-x-16 gap-y-10 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-700">
             <span className="text-2xl font-black text-slate-900 tracking-tighter">Campaign</span>
             <span className="text-2xl font-black text-slate-900 tracking-tighter">Ad Age</span>
             <span className="text-2xl font-black text-slate-900 tracking-tighter">The Drum</span>
             <span className="text-2xl font-black text-slate-900 tracking-tighter">Adweek</span>
             <span className="text-2xl font-black text-slate-900 tracking-tighter">WARC</span>
          </div>
        </div>
      </section>

      {/* Value Proposition Grid */}
      <section className="py-32 bg-white" id="features">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-24">
            <h2 className="text-4xl font-black text-[#0f172a] mb-5">Institutional Intelligence Infrastructure</h2>
            <p className="text-slate-500 text-lg font-medium">Tailored for the specific workflows of agency growth teams.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            <article className="p-10 rounded-[2.5rem] bg-slate-50/50 border border-slate-100/50 hover:bg-white hover:shadow-2xl hover:shadow-slate-200 transition-all group">
              <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white mb-8 shadow-lg shadow-indigo-100">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg>
              </div>
              <h3 className="text-2xl font-black text-[#0f172a] mb-4">Outreach Signals</h3>
              <p className="text-slate-500 text-[15px] leading-relaxed font-medium">
                Personalize your prospecting with verified account wins and <strong>leadership changes</strong>. Reach out within 24 hours of a new CMO appointment.
              </p>
            </article>

            <article className="p-10 rounded-[2.5rem] bg-slate-50/50 border border-slate-100/50 hover:bg-white hover:shadow-2xl hover:shadow-slate-200 transition-all">
              <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center text-white mb-8 shadow-lg shadow-emerald-100">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
              </div>
              <h3 className="text-2xl font-black text-[#0f172a] mb-4">Risk Detection</h3>
              <p className="text-slate-500 text-[15px] leading-relaxed font-medium">
                Monitor "at-risk" client accounts where agencies are shifting. Detect review cycles and media-buying migrations before they are public.
              </p>
            </article>

            <article className="p-10 rounded-[2.5rem] bg-slate-50/50 border border-slate-100/50 hover:bg-white hover:shadow-2xl hover:shadow-slate-200 transition-all">
              <div className="w-14 h-14 bg-orange-600 rounded-2xl flex items-center justify-center text-white mb-8 shadow-lg shadow-orange-100">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
              </div>
              <h3 className="text-2xl font-black text-[#0f172a] mb-4">Market Audits</h3>
              <p className="text-slate-500 text-[15px] leading-relaxed font-medium">
                Deep-dive into any client's agency roster with <strong>Master Search</strong>. Export comprehensive 12-month reports for your strategy sessions.
              </p>
            </article>

            <article className="p-10 rounded-[2.5rem] bg-slate-50/50 border border-slate-100/50 hover:bg-white hover:shadow-2xl hover:shadow-slate-200 transition-all">
              <div className="w-14 h-14 bg-[#0f172a] rounded-2xl flex items-center justify-center text-white mb-8 shadow-lg shadow-slate-200">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              </div>
              <h3 className="text-2xl font-black text-[#0f172a] mb-4">Executive Intel</h3>
              <p className="text-slate-500 text-[15px] leading-relaxed font-medium">
                High-level market summaries and competitive analysis for CXOs. Understand macro-shifts in the advertising industry within seconds.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* FAQ Section (Excellent for Rich Snippets) */}
      <section className="py-32 bg-slate-50" id="faq">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl font-black text-[#0f172a] mb-16 text-center">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
              <h4 className="text-lg font-black text-slate-900 mb-2">What sources does Rocket Insights scan?</h4>
              <p className="text-slate-500 font-medium">We scan over 50+ trade journals including Campaign Asia, AdAge, Adweek, Marketing-Interactive, and The Drum, covering both APAC and Global markets.</p>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
              <h4 className="text-lg font-black text-slate-900 mb-2">Can I export intelligence reports?</h4>
              <p className="text-slate-500 font-medium">Yes. All intelligence scans, including agency wins and leadership profiles, can be exported as professional PDF or CSV files for your CRM or pitch decks.</p>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
              <h4 className="text-lg font-black text-slate-900 mb-2">How frequent is the Daily Briefing?</h4>
              <p className="text-slate-500 font-medium">The briefing is updated in real-time as industry news breaks. Our Monday Morning Digest summarizes the top 10 most impactful signals from the previous week.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-24 border-t border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-10 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center space-x-3">
             <div className="w-8 h-8 bg-[#0f172a] rounded-lg flex items-center justify-center">
               <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41" />
               </svg>
             </div>
             <span className="text-sm font-black text-[#0f172a] uppercase tracking-widest">Rocket Insights</span>
          </div>
          <div className="flex gap-10 text-[10px] font-black text-slate-400 uppercase tracking-widest">
            <a href="#" className="hover:text-indigo-600">Privacy Protocol</a>
            <a href="#" className="hover:text-indigo-600">Terms of Intel</a>
            <a href="#" className="hover:text-indigo-600">Contact Control</a>
          </div>
          <p className="text-sm text-slate-400 font-bold uppercase tracking-[0.3em]">&copy; {new Date().getFullYear()} Rocket Insights Intelligence System.</p>
        </div>
      </footer>
    </div>
  );
};
