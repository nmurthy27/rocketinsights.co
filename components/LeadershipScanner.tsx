
import React, { useState, useEffect } from 'react';
import { LeaderProfile, LeadershipSearchHistoryItem, UserProfile } from '../types';
import { COMMON_ROLES } from '../constants';
import { fetchLeadershipData } from '../services/geminiService';
import { getLeadershipSearchHistory, addLeadershipSearchHistory } from '../services/localStorageService';

interface LeadershipScannerProps {
  currentUser: UserProfile | null;
}

export const LeadershipScanner: React.FC<LeadershipScannerProps> = ({ currentUser }) => {
  const [role, setRole] = useState<string>(COMMON_ROLES[0]);
  const [customRole, setCustomRole] = useState<string>('');
  const [company, setCompany] = useState<string>('');
  const [country, setCountry] = useState<string>('');
  const [results, setResults] = useState<LeaderProfile[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [recentSearches, setRecentSearches] = useState<LeadershipSearchHistoryItem[]>([]);

  const isReadOnly = currentUser?.role === 'read_only';

  useEffect(() => {
    setRecentSearches(getLeadershipSearchHistory());
  }, []);

  const executeSearch = async (targetRole: string, targetCompany: string, targetCountry: string) => {
    if (!targetCompany || !targetCountry || isReadOnly) return;

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

  return (
    <div className="clean-panel rounded-[2.5rem] p-10 bg-white border-none shadow-2xl shadow-slate-200/40 overflow-hidden">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-12">
         <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-slate-900 rounded-[1.5rem] flex items-center justify-center text-white">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
               <h2 className="text-3xl font-black text-slate-900 tracking-tight">Leadership Scanner - Find key decision makers</h2>
               <div className="flex items-center gap-2 mt-1">
                  <span className="text-indigo-500 font-black text-[10px] uppercase tracking-widest">Global Professional Network Monitoring Active</span>
               </div>
            </div>
         </div>
      </div>

      <div className="mb-10">
        <form onSubmit={handleSearch} className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative group">
             <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
             </div>
             <input 
               type="text" 
               placeholder="Company (e.g., Ogilvy, Unilever)"
               required
               readOnly={isReadOnly}
               className="block w-full pl-12 pr-4 py-4.5 border border-slate-200 rounded-2xl bg-slate-50 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all font-bold text-slate-900 placeholder-slate-400"
               value={company}
               onChange={(e) => setCompany(e.target.value)}
             />
          </div>

          <div className="w-full lg:w-64 relative">
             <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
             </div>
             <input 
               type="text" 
               placeholder="Country..."
               required
               readOnly={isReadOnly}
               className="block w-full pl-12 pr-4 py-4.5 border border-slate-200 rounded-2xl bg-slate-50 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all font-bold text-slate-900 placeholder-slate-400"
               value={country}
               onChange={(e) => setCountry(e.target.value)}
             />
          </div>

          <div className="w-full lg:w-64 relative">
             <select 
               className="block w-full pl-5 pr-12 py-4.5 border border-slate-200 rounded-2xl bg-slate-50 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all font-bold text-slate-900 appearance-none cursor-pointer"
               value={customRole ? 'custom' : role}
               disabled={isReadOnly}
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
                <option value="custom">Other (Custom)...</option>
             </select>
             <div className="absolute inset-y-0 right-0 flex items-center px-5 pointer-events-none text-slate-500">
               <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
             </div>
          </div>

          <button 
            type="submit"
            disabled={loading || isReadOnly}
            className="w-full lg:w-auto px-10 py-4.5 bg-slate-900 text-white font-black text-sm uppercase tracking-widest rounded-2xl hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-xl shadow-slate-100"
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            ) : isReadOnly ? (
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            ) : 'Identify'}
          </button>
        </form>
      </div>

      <div className="bg-white">
        {!loading && results.length === 0 && (
           <div className="p-20 text-center bg-slate-50 rounded-[2rem] border border-dashed border-slate-300">
             <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white shadow-sm mb-6">
                <svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
             </div>
             <p className="text-slate-500 font-black uppercase tracking-widest text-xs">
               {isReadOnly ? 'Read-only access: Database scanning restricted.' : company ? 'Institutional database mismatch. Refining required.' : 'Awaiting profile identification scan...'}
             </p>
           </div>
        )}
      </div>
    </div>
  );
};
