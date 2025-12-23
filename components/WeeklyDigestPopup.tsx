
import React, { useState, useEffect } from 'react';
import { NEWS_REGIONS, NEWS_TOPICS } from '../constants';

interface WeeklyDigestPopupProps {
  onSubscribe: (email: string, regions: string[], topics: string[]) => Promise<void>;
  initialEmail?: string;
}

export const WeeklyDigestPopup: React.FC<WeeklyDigestPopupProps> = ({ onSubscribe, initialEmail }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState(initialEmail || '');
  const [selectedRegions, setSelectedRegions] = useState<string[]>(['APAC']);
  const [selectedTopics, setSelectedTopics] = useState<string[]>(['Agency Business']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (initialEmail) setEmail(initialEmail);
  }, [initialEmail]);

  const toggleRegion = (region: string) => {
    setSelectedRegions(prev => 
      prev.includes(region) ? prev.filter(r => r !== region) : [...prev, region]
    );
  };

  const toggleTopic = (topic: string) => {
    setSelectedTopics(prev => 
      prev.includes(topic) ? prev.filter(t => t !== topic) : [...prev, topic]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    try {
      await onSubscribe(email, selectedRegions, selectedTopics);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setIsOpen(false);
      }, 3000);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed bottom-8 left-8 z-[100] flex flex-col items-start">
      {/* The Popup Panel */}
      <div 
        className={`mb-4 w-80 md:w-96 bg-white rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(15,23,42,0.3)] border border-slate-100 overflow-hidden transition-all duration-500 ease-out origin-bottom-left ${
          isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-75 opacity-0 translate-y-10 pointer-events-none'
        }`}
      >
        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Weekly Intel Digest</h3>
              <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mt-1">Institutional Delivery</p>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-2 text-slate-400 hover:text-slate-900 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          {isSuccess ? (
            <div className="py-12 text-center animate-fade-in">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
              </div>
              <p className="text-slate-900 font-black text-lg">Intel Feed Activated</p>
              <p className="text-slate-500 text-sm font-medium mt-2">See you on Monday morning.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Delivery Email</label>
                <input 
                  type="email" 
                  required
                  placeholder="name@company.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Target Geos</label>
                <div className="flex flex-wrap gap-2">
                  {NEWS_REGIONS.map(region => (
                    <button
                      key={region}
                      type="button"
                      onClick={() => toggleRegion(region)}
                      className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border transition-all ${
                        selectedRegions.includes(region)
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                          : 'bg-white text-slate-500 border-slate-200 hover:border-indigo-400'
                      }`}
                    >
                      {region}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Content Topics</label>
                <div className="flex flex-wrap gap-2">
                  {NEWS_TOPICS.map(topic => (
                    <button
                      key={topic}
                      type="button"
                      onClick={() => toggleTopic(topic)}
                      className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border transition-all ${
                        selectedTopics.includes(topic)
                          ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                          : 'bg-white text-slate-500 border-slate-200 hover:border-slate-900'
                      }`}
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !email}
                className="w-full py-4 bg-indigo-600 text-white rounded-xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50"
              >
                {isSubmitting ? 'Syncing...' : 'Activate Weekly Digest'}
              </button>
            </form>
          )}
        </div>
        <div className="bg-slate-50 px-8 py-4 border-t border-slate-100">
          <p className="text-[9px] text-slate-400 font-bold leading-relaxed uppercase tracking-wider">
            Curated from 50+ trade journals using Gemini 3.0 strategic grounding.
          </p>
        </div>
      </div>

      {/* The Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`group flex items-center gap-3 p-4 md:p-5 rounded-full shadow-2xl transition-all duration-300 active:scale-90 ${
          isOpen ? 'bg-slate-900' : 'bg-indigo-600'
        }`}
      >
        <div className="relative w-6 h-6 flex items-center justify-center">
          {isOpen ? (
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" /></svg>
          ) : (
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
          )}
          {!isOpen && <span className="absolute -top-1 -right-1 flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span></span>}
        </div>
        {!isOpen && (
          <span className="text-white font-black text-[10px] uppercase tracking-[0.2em] pr-2 hidden md:block">
            Subscribe to Weekly Digest
          </span>
        )}
      </button>
    </div>
  );
};
