
import React, { useState, useEffect } from 'react';
import { NEWS_REGIONS, NEWS_TOPICS } from '../constants';
import { UserProfile } from '../types';

interface LoginModalProps {
  isOpen: boolean;
  mode: 'subscribe' | 'admin';
  onClose: () => void;
  onLogin: (profile: UserProfile) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, mode, onClose, onLogin }) => {
  // Subscribe State
  const [email, setEmail] = useState('');
  const [selectedRegions, setSelectedRegions] = useState<string[]>(['APAC']);
  const [selectedTopics, setSelectedTopics] = useState<string[]>(['Agency Business']);
  const [hasConsented, setHasConsented] = useState(false);

  // Admin State
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState('');
  
  // Animation state
  const [shouldRender, setShouldRender] = useState(isOpen);

  useEffect(() => {
    if (isOpen) setShouldRender(true);
  }, [isOpen]);

  const handleAnimationEnd = () => {
    if (!isOpen) setShouldRender(false);
  };

  if (!shouldRender) return null;

  const handleSubscribeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !hasConsented) return;

    // nmurthy27@gmail.com is hardcoded as Super Admin
    const isSuperUser = email.toLowerCase() === 'nmurthy27@gmail.com';

    const profile: UserProfile = {
      email,
      role: isSuperUser ? 'super_admin' : 'read_only', // New users are strictly read_only by default
      regions: selectedRegions,
      topics: selectedTopics,
      isSubscribed: true,
      consentDate: new Date().toISOString()
    };
    
    onLogin(profile);
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError('');

    const lowCaseEmail = adminEmail.toLowerCase();
    const isNMurthy = lowCaseEmail === 'nmurthy27@gmail.com';

    // Logic for Super Admin vs Admin
    if (adminPassword === 'rocket') {
      const isSuper = isNMurthy || adminEmail.includes('ceo') || adminEmail.includes('admin');
      const profile: UserProfile = {
        email: adminEmail,
        role: isSuper ? 'super_admin' : 'admin'
      };
      onLogin(profile);
    } else if (adminPassword === 'read') {
       const profile: UserProfile = {
        email: adminEmail,
        role: 'read_only'
      };
      onLogin(profile);
    } else {
      setAdminError('Access denied. Verify institutional credentials.');
    }
  };

  const toggleRegion = (region: string) => {
    setSelectedRegions(prev => 
      prev.includes(region) 
        ? prev.filter(r => r !== region)
        : [...prev, region]
    );
  };

  const toggleTopic = (topic: string) => {
    setSelectedTopics(prev => 
      prev.includes(topic) 
        ? prev.filter(t => t !== topic)
        : [...prev, topic]
    );
  };

  return (
    <div className={`fixed inset-0 z-[100] flex justify-end transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-md" 
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div 
        onTransitionEnd={handleAnimationEnd}
        className={`relative w-full max-w-md bg-white h-full shadow-[-20px_0_50px_rgba(0,0,0,0.1)] transform transition-transform duration-500 ease-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              {mode === 'subscribe' ? 'Weekly Digest' : 'Control Center'}
            </h2>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
              {mode === 'subscribe' ? 'Institutional Access' : 'Administrative Login'}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable Form Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
          {mode === 'subscribe' ? (
            <form onSubmit={handleSubscribeSubmit} className="space-y-8">
              <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
                <p className="text-sm text-indigo-900 font-bold leading-relaxed">
                  Join 12,000+ industry professionals receiving our high-signal APAC market brief every Monday morning.
                </p>
              </div>

              {/* Email Input */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Work Email</label>
                <input
                  type="email"
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all outline-none"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* Regions Selection */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Regional Focus</label>
                <div className="flex flex-wrap gap-2">
                  {NEWS_REGIONS.map(region => (
                    <button
                      key={region}
                      type="button"
                      onClick={() => toggleRegion(region)}
                      className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                        selectedRegions.includes(region)
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100'
                          : 'bg-white text-slate-500 border-slate-200 hover:border-indigo-400'
                      }`}
                    >
                      {region}
                    </button>
                  ))}
                </div>
              </div>

              {/* Topics Selection */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Intel Categories</label>
                <div className="flex flex-wrap gap-2">
                  {NEWS_TOPICS.map(topic => (
                    <button
                      key={topic}
                      type="button"
                      onClick={() => toggleTopic(topic)}
                      className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                        selectedTopics.includes(topic)
                          ? 'bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-200'
                          : 'bg-white text-slate-500 border-slate-200 hover:border-slate-900'
                      }`}
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              </div>

              {/* Consent Checkbox */}
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex gap-4 cursor-pointer group" onClick={() => setHasConsented(!hasConsented)}>
                <div className={`shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${hasConsented ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-slate-300'}`}>
                  {hasConsented && (
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                  )}
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-700">Confirm Subscription</p>
                  <p className="text-[10px] text-slate-500 font-medium mt-0.5">I agree to receive the weekly intelligence digest. One-click unsubscribe always available.</p>
                </div>
              </div>

              <button
                type="submit"
                disabled={!email || !hasConsented}
                className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50"
              >
                Activate Subscription
              </button>
            </form>
          ) : (
            <form onSubmit={handleAdminLogin} className="space-y-8">
              <div className="bg-slate-900 p-6 rounded-2xl text-white shadow-xl">
                <p className="text-xs font-bold leading-relaxed opacity-70 uppercase tracking-widest">Administrative access required for intelligence log management and subscriber auditing.</p>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Admin ID</label>
                  <input
                    type="email"
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-bold focus:ring-4 focus:ring-slate-500/10 focus:border-slate-900 focus:bg-white transition-all outline-none"
                    placeholder="admin@rocketinsights.co"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Protocol Key</label>
                  <input
                    type="password"
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-bold focus:ring-4 focus:ring-slate-500/10 focus:border-slate-900 focus:bg-white transition-all outline-none"
                    placeholder="Enter key (e.g. 'rocket' or 'read')"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                  />
                </div>
              </div>

              {adminError && (
                <div className="p-4 bg-rose-50 text-rose-600 text-[10px] font-black uppercase tracking-widest rounded-xl border border-rose-100 flex items-center gap-3">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  {adminError}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-slate-200 hover:bg-slate-800 transition-all active:scale-95"
              >
                Authenticate Access
              </button>
            </form>
          )}
        </div>

        <div className="p-8 border-t border-slate-50 text-center bg-slate-50/50">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Rocket Insights Intelligence Hub &copy; 2025</p>
        </div>
      </div>
    </div>
  );
};
