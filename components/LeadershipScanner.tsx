
import React, { useState, useEffect } from 'react';
import { LeaderProfile, LeadershipSearchHistoryItem } from '../types';
import { COMMON_ROLES } from '../constants';
import { fetchLeadershipData } from '../services/geminiService';
import { logLeadershipSearchToSupabase } from '../services/supabaseClient';
import { getLeadershipSearchHistory, addLeadershipSearchHistory } from '../services/localStorageService';

export const LeadershipScanner: React.FC = () => {
  const [role, setRole] = useState<string>(COMMON_ROLES[0]);
  const [customRole, setCustomRole] = useState<string>('');
  const [company, setCompany] = useState<string>('');
  const [country, setCountry] = useState<string>('');
  const [results, setResults] = useState<LeaderProfile[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [recentSearches, setRecentSearches] = useState<LeadershipSearchHistoryItem[]>([]);

  useEffect(() => {
    setRecentSearches(getLeadershipSearchHistory());
  }, []);

  const executeSearch = async (targetRole: string, targetCompany: string, targetCountry: string) => {
    if (!targetCompany || !targetCountry) return;

    logLeadershipSearchToSupabase(targetRole, targetCompany, targetCountry); // No email passed
    const updatedHistory = addLeadershipSearchHistory({
        role: targetRole,
        company: targetCompany,
        country: targetCountry,
        timestamp: Date.now()
    });
    setRecentSearches(updatedHistory);

    setLoading(true);
    setResults([]);
    
    try {
      const data = await fetchLeadershipData(targetRole, targetCompany, targetCountry);
      setResults(data);
    } catch (error) {
      console.error("Error fetching leadership:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const activeRole = customRole || role;
    executeSearch(activeRole, company, country);
  };

  const handleHistoryClick = (item: LeadershipSearchHistoryItem) => {
    setRole(COMMON_ROLES.includes(item.role) ? item.role : 'custom');
    setCustomRole(COMMON_ROLES.includes(item.role) ? '' : item.role);
    setCompany(item.company);
    setCountry(item.country);
    executeSearch(item.role, item.company, item.country);
  };

  const handleClear = () => {
    setCompany('');
    setCountry('');
    setCustomRole('');
    setRole(COMMON_ROLES[0]);
    setResults([]);
    setLoading(false);
  };

  return (
    <div className="glass-panel rounded-3xl overflow-hidden shadow-lg">
      <div className="px-6 py-6 border-b border-slate-100 bg-white/60">
        <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
          <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          Leadership Scanner
        </h2>
        <p className="text-sm text-slate-500 mt-1 ml-11 font-medium">
          Identify key decision makers at agencies or client organizations.
        </p>
      </div>

      <div className="p-6 bg-white/40 border-b border-slate-100">
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-5 items-end">
          <div className="col-span-1">
             <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Role</label>
             <select 
               className="block w-full border border-slate-200 rounded-xl shadow-sm py-3 px-4 bg-white text-sm font-medium focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
               value={customRole ? 'custom' : role}
               onChange={(e) => {
                 if (e.target.value === 'custom') {
                   setCustomRole(''); 
                 } else {
                   setCustomRole('');
                   setRole(e.target.value);
                 }
               }}
             >
                {COMMON_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                <option value="custom">Other (Type Custom)...</option>
             </select>
             {role === 'custom' || (customRole !== '') ? (
               <input 
                 type="text" 
                 placeholder="Enter specific title..."
                 className="mt-2 block w-full border border-slate-200 rounded-xl shadow-sm py-3 px-4 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                 value={customRole}
                 onChange={(e) => {
                   setCustomRole(e.target.value);
                   if(e.target.value === '') setRole('custom');
                 }}
               />
             ) : null}
          </div>

          <div className="col-span-1">
             <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Company</label>
             <input 
               type="text" 
               placeholder="e.g., Ogilvy, Unilever"
               required
               className="block w-full border border-slate-200 rounded-xl shadow-sm py-3 px-4 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
               value={company}
               onChange={(e) => setCompany(e.target.value)}
             />
          </div>

          <div className="col-span-1">
             <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Country</label>
             <input 
               type="text" 
               placeholder="e.g., Singapore"
               required
               className="block w-full border border-slate-200 rounded-xl shadow-sm py-3 px-4 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
               value={country}
               onChange={(e) => setCountry(e.target.value)}
             />
          </div>

          <div className="col-span-1 flex gap-2">
            <button 
              type="button"
              onClick={handleClear}
              disabled={loading || (!company && !country && results.length === 0)}
              className="px-4 py-3 border border-slate-200 rounded-xl font-bold text-slate-600 bg-white hover:bg-slate-50 hover:text-slate-800 transition-all disabled:opacity-50 text-sm"
            >
              Clear
            </button>
            <button 
              type="submit"
              disabled={loading}
              className="flex-1 flex justify-center items-center py-3 px-6 border border-transparent rounded-xl shadow-lg shadow-indigo-500/30 text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-all active:scale-95"
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              ) : (
                'Search'
              )}
            </button>
          </div>
        </form>

        {/* Recent Searches */}
        {recentSearches.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2 items-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mr-2 flex items-center gap-1">
               <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
               Recent:
            </span>
            {recentSearches.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleHistoryClick(item)}
                disabled={loading}
                className="px-2.5 py-1 rounded bg-white border border-slate-200 text-[10px] font-medium text-slate-500 hover:text-indigo-600 hover:border-indigo-200 transition-colors shadow-sm"
              >
                {item.role} @ {item.company} ({item.country})
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="bg-slate-50/50 min-h-[100px]">
        {loading && (
           <div className="p-10 text-center">
              <div className="flex flex-col items-center animate-pulse">
                <div className="h-16 w-16 bg-indigo-100 rounded-full mb-4"></div>
                <div className="h-4 bg-slate-200 rounded w-48 mb-2"></div>
                <div className="h-3 bg-slate-200 rounded w-32"></div>
              </div>
           </div>
        )}

        {!loading && results.length > 0 && (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 p-6">
              {results.map((person) => (
                <div key={person.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-indigo-200 transition-all flex flex-col group">
                   <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-600 flex items-center justify-center font-bold shadow-inner">
                            {person.name.charAt(0)}
                         </div>
                         <div>
                            <h3 className="text-base font-bold text-slate-900 leading-none mb-1">{person.name}</h3>
                            <p className="text-xs text-indigo-600 font-bold uppercase tracking-wide">{person.role}</p>
                         </div>
                      </div>
                      <a 
                        href={person.linkedinUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-slate-300 hover:text-[#0077b5] transition-colors p-1"
                      >
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                      </a>
                   </div>
                   
                   <div className="mt-auto space-y-2 pt-3 border-t border-slate-50">
                      <div className="flex items-center text-xs text-slate-500 font-medium">
                         <svg className="w-4 h-4 mr-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                         </svg>
                         {person.company}
                      </div>
                      <div className="flex items-center text-xs text-slate-500 font-medium">
                         <svg className="w-4 h-4 mr-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                         </svg>
                         {person.country}
                      </div>
                   </div>
                </div>
              ))}
           </div>
        )}

        {!loading && results.length === 0 && (
           <div className="p-10 text-center text-slate-400 text-sm font-medium">
             {company ? 'No results found. Try refining the company name.' : 'Enter details above to scan for leadership profiles.'}
           </div>
        )}
      </div>
    </div>
  );
};
