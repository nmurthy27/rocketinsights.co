
import React, { useState } from 'react';
import { NEWS_REGIONS, NEWS_TOPICS } from '../constants';
import { UserProfile } from '../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (profile: UserProfile) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [mode, setMode] = useState<'subscribe' | 'admin'>('subscribe');
  
  // Subscribe State
  const [email, setEmail] = useState('');
  const [selectedRegions, setSelectedRegions] = useState<string[]>(['APAC']);
  const [selectedTopics, setSelectedTopics] = useState<string[]>(['Agency Business']);
  const [hasConsented, setHasConsented] = useState(false);

  // Admin State
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState('');
  
  if (!isOpen) return null;

  const handleSubscribeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !hasConsented) return;

    const profile: UserProfile = {
      email,
      role: 'subscriber',
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

    // Simple authentication check for the prototype
    if ((adminPassword === 'admin123' || adminPassword === 'rocket')) {
      const profile: UserProfile = {
        email: adminEmail,
        role: 'admin'
      };
      onLogin(profile);
    } else {
      setAdminError('Invalid credentials. Please try again.');
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
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-center justify-center min-h-screen px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 bg-slate-900 bg-opacity-75 transition-opacity backdrop-blur-sm" 
          aria-hidden="true"
          onClick={onClose}
        ></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        
        <div className="relative inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full">
          
          {/* Header Tabs */}
          <div className="flex border-b border-slate-100">
            <button
              onClick={() => setMode('subscribe')}
              className={`flex-1 py-4 text-sm font-bold text-center transition-colors ${mode === 'subscribe' ? 'bg-white text-blue-600 border-b-2 border-blue-600' : 'bg-slate-50 text-slate-500 hover:text-slate-700'}`}
            >
              Subscriber Access
            </button>
            <button
              onClick={() => setMode('admin')}
              className={`flex-1 py-4 text-sm font-bold text-center transition-colors ${mode === 'admin' ? 'bg-white text-indigo-600 border-b-2 border-indigo-600' : 'bg-slate-50 text-slate-500 hover:text-slate-700'}`}
            >
              Admin Login
            </button>
          </div>

          <div className="px-6 py-6">
            {mode === 'subscribe' ? (
              <form onSubmit={handleSubscribeSubmit}>
                <div className="text-center mb-6">
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-3">
                    <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Subscribe to Intelligence Digest</h3>
                  <p className="text-sm text-slate-500 mt-1">
                    Get a consolidated report delivered to your inbox every Monday morning.
                  </p>
                </div>

                {/* Email Input */}
                <div className="mb-4">
                  <label htmlFor="email" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    required
                    className="block w-full border border-slate-300 rounded-xl shadow-sm py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                {/* Regions Selection */}
                <div className="mb-4">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Select Regions
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {NEWS_REGIONS.map(region => (
                      <button
                        key={region}
                        type="button"
                        onClick={() => toggleRegion(region)}
                        className={`inline-flex items-center px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                          selectedRegions.includes(region)
                            ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-200'
                            : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'
                        }`}
                      >
                        {region}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Topics Selection */}
                <div className="mb-5">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Customize Topics
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {NEWS_TOPICS.map(topic => (
                      <button
                        key={topic}
                        type="button"
                        onClick={() => toggleTopic(topic)}
                        className={`inline-flex items-center px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                          selectedTopics.includes(topic)
                            ? 'bg-purple-600 text-white border-purple-600 shadow-md shadow-purple-200'
                            : 'bg-white text-slate-600 border-slate-200 hover:border-purple-300'
                        }`}
                      >
                        {topic}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Consent Checkbox */}
                <div className="mb-6 p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="consent"
                        name="consent"
                        type="checkbox"
                        required
                        checked={hasConsented}
                        onChange={(e) => setHasConsented(e.target.checked)}
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-slate-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="consent" className="font-medium text-slate-700">I agree to receive the weekly digest.</label>
                      <p className="text-slate-500 text-xs mt-0.5">You can unsubscribe at any time.</p>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!email || !hasConsented}
                  className="w-full inline-flex justify-center rounded-xl border border-transparent shadow-lg shadow-blue-500/30 px-4 py-3 bg-blue-600 text-base font-bold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Subscribe
                </button>
              </form>
            ) : (
              <form onSubmit={handleAdminLogin}>
                <div className="text-center mb-6">
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 mb-3">
                    <svg className="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Admin Login</h3>
                  <p className="text-sm text-slate-500 mt-1">
                    Access the dashboard to view logs and manage subscribers.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                      Admin Email
                    </label>
                    <input
                      type="email"
                      required
                      className="block w-full border border-slate-300 rounded-xl shadow-sm py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                      Password
                    </label>
                    <input
                      type="password"
                      required
                      className="block w-full border border-slate-300 rounded-xl shadow-sm py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                    />
                  </div>
                </div>

                {adminError && (
                  <div className="mt-4 p-3 bg-red-50 text-red-600 text-sm font-medium rounded-lg border border-red-100 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    {adminError}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full mt-6 inline-flex justify-center rounded-xl border border-transparent shadow-lg shadow-indigo-500/30 px-4 py-3 bg-indigo-600 text-base font-bold text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
                >
                  Login to Dashboard
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
