
import React, { useState } from 'react';
import { NEWS_REGIONS, NEWS_TOPICS } from '../constants';
import { UserProfile } from '../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (profile: UserProfile) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [email, setEmail] = useState('');
  const [selectedRegions, setSelectedRegions] = useState<string[]>(['APAC']);
  const [selectedTopics, setSelectedTopics] = useState<string[]>(['Agency Business']);
  const [hasConsented, setHasConsented] = useState(false);
  
  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !hasConsented) return;

    const profile: UserProfile = {
      email,
      regions: selectedRegions,
      topics: selectedTopics,
      isSubscribed: true,
      consentDate: new Date().toISOString()
    };
    
    onLogin(profile);
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
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 bg-slate-900 bg-opacity-75 transition-opacity" 
          aria-hidden="true"
          onClick={onClose}
        ></div>

        {/* Modal panel */}
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div className="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full">
          <form onSubmit={handleSubmit}>
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                  <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                  <h3 className="text-lg leading-6 font-medium text-slate-900" id="modal-title">
                    Subscribe to Weekly Intelligence Digest
                  </h3>
                  <div className="mt-2 bg-slate-50 p-3 rounded-md border border-slate-100">
                    <p className="text-sm text-slate-600 mb-2">
                      Get a consolidated report delivered to your inbox <strong>every Monday morning</strong>.
                    </p>
                    <ul className="text-xs text-slate-500 list-disc list-inside space-y-1">
                      <li><strong>Daily Industry Briefing:</strong> Recap of the week's key movements.</li>
                      <li><strong>OOH Campaign Updates:</strong> Latest outdoor & retail media launches for this week.</li>
                    </ul>
                  </div>

                  {/* Email Input */}
                  <div className="mt-5">
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      required
                      className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="you@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  {/* Regions Selection */}
                  <div className="mt-5">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Select Regions
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {NEWS_REGIONS.map(region => (
                        <button
                          key={region}
                          type="button"
                          onClick={() => toggleRegion(region)}
                          className={`inline-flex items-center px-2.5 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                            selectedRegions.includes(region)
                              ? 'bg-blue-100 text-blue-800 border-blue-200'
                              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {region}
                          {selectedRegions.includes(region) && (
                            <svg className="ml-1.5 h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Topics Selection */}
                  <div className="mt-5">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Customize Topics
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {NEWS_TOPICS.map(topic => (
                        <button
                          key={topic}
                          type="button"
                          onClick={() => toggleTopic(topic)}
                          className={`inline-flex items-center px-2.5 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                            selectedTopics.includes(topic)
                              ? 'bg-purple-100 text-purple-800 border-purple-200'
                              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {topic}
                           {selectedTopics.includes(topic) && (
                            <svg className="ml-1.5 h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Consent Checkbox */}
                  <div className="mt-6">
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
                        <label htmlFor="consent" className="font-medium text-slate-700">I agree to receive the weekly market intelligence digest.</label>
                        <p className="text-slate-500 text-xs mt-0.5">I understand I can unsubscribe at any time via the link in the email or from the app header.</p>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
            <div className="bg-slate-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="submit"
                disabled={!email || !hasConsented}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Subscribe to Digest
              </button>
              <button
                type="button"
                className="mt-3 w-full inline-flex justify-center rounded-md border border-slate-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                onClick={onClose}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
