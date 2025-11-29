
import React, { useState } from 'react';
import { LeaderProfile } from '../types';
import { COMMON_ROLES } from '../constants';
import { fetchLeadershipData } from '../services/geminiService';

export const LeadershipScanner: React.FC = () => {
  const [role, setRole] = useState<string>(COMMON_ROLES[0]);
  const [customRole, setCustomRole] = useState<string>('');
  const [company, setCompany] = useState<string>('');
  const [country, setCountry] = useState<string>('');
  const [results, setResults] = useState<LeaderProfile[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company || !country) return;

    setLoading(true);
    setResults([]); // Clear previous
    const activeRole = customRole || role;
    
    try {
      const data = await fetchLeadershipData(activeRole, company, country);
      setResults(data);
    } catch (error) {
      console.error("Error fetching leadership:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setCompany('');
    setCountry('');
    setCustomRole('');
    setRole(COMMON_ROLES[0]); // Reset to All Key Leaders
    setResults([]);
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Leadership Scanner
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Identify key decision makers at agencies or client organizations.
          </p>
        </div>
      </div>

      {/* Search Form */}
      <div className="p-6 bg-white border-b border-slate-100">
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          {/* Role Selection */}
          <div className="col-span-1">
             <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Role</label>
             <select 
               className="block w-full border border-slate-300 rounded-lg shadow-sm py-2.5 px-3 bg-slate-50 text-sm focus:ring-indigo-500 focus:border-indigo-500"
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
                 className="mt-2 block w-full border border-slate-300 rounded-lg shadow-sm py-2 px-3 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                 value={customRole}
                 onChange={(e) => {
                   setCustomRole(e.target.value);
                   if(e.target.value === '') setRole('custom'); // Keep custom selected if clearing
                 }}
               />
             ) : null}
          </div>

          {/* Company Input */}
          <div className="col-span-1">
             <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Company</label>
             <input 
               type="text" 
               placeholder="e.g., Ogilvy, Unilever, Grab"
               required
               className="block w-full border border-slate-300 rounded-lg shadow-sm py-2.5 px-3 text-sm focus:ring-indigo-500 focus:border-indigo-500"
               value={company}
               onChange={(e) => setCompany(e.target.value)}
             />
          </div>

          {/* Country Input */}
          <div className="col-span-1">
             <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Country</label>
             <input 
               type="text" 
               placeholder="e.g., Singapore, Australia"
               required
               className="block w-full border border-slate-300 rounded-lg shadow-sm py-2.5 px-3 text-sm focus:ring-indigo-500 focus:border-indigo-500"
               value={country}
               onChange={(e) => setCountry(e.target.value)}
             />
          </div>

          {/* Buttons */}
          <div className="col-span-1 flex gap-2">
            <button 
              type="button"
              onClick={handleClear}
              disabled={loading || (!company && !country && results.length === 0)}
              className="flex-1 py-2.5 px-3 border border-slate-300 rounded-lg shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-all"
            >
              Clear
            </button>
            <button 
              type="submit"
              disabled={loading}
              className="flex-[2] flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-wait transition-all"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Scanning...
                </>
              ) : (
                'Search Leaders'
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Results Area */}
      <div className="bg-slate-50 min-h-[100px]">
        {loading && (
           <div className="p-8 text-center">
              <div className="animate-pulse flex flex-col items-center">
                <div className="h-12 w-12 bg-indigo-100 rounded-full mb-3"></div>
                <div className="h-4 bg-slate-200 rounded w-48 mb-2"></div>
                <div className="h-3 bg-slate-200 rounded w-32"></div>
              </div>
           </div>
        )}

        {!loading && results.length > 0 && (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
              {results.map((person) => (
                <div key={person.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col">
                   <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                         <h3 className="text-lg font-bold text-slate-900">{person.name}</h3>
                         <p className="text-sm text-indigo-600 font-medium">{person.role}</p>
                      </div>
                      <a 
                        href={person.linkedinUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-slate-400 hover:text-[#0077b5] transition-colors"
                        title="View LinkedIn Profile"
                      >
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                           <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                        </svg>
                      </a>
                   </div>
                   
                   <div className="space-y-1 mb-2">
                      <div className="flex items-center text-xs text-slate-500">
                         <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                         </svg>
                         {person.company}
                      </div>
                      <div className="flex items-center text-xs text-slate-500">
                         <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
           <div className="p-6 text-center text-slate-400 text-sm">
             {company ? 'No results found. Try refining the company name or role.' : 'Enter details above to scan for leadership profiles.'}
           </div>
        )}
      </div>
    </div>
  );
};
    