
import React, { useState, useEffect } from 'react';
import { MasterSearchResult, UserProfile } from '../types';
import { performMasterSearch } from '../services/geminiService';
import { getMasterSearchHistory, addMasterSearchHistory } from '../services/localStorageService';

interface MasterSearchSectionProps {
  onSearchComplete?: (data: MasterSearchResult) => void;
  currentUser: UserProfile | null;
}

export const MasterSearchSection: React.FC<MasterSearchSectionProps> = ({ onSearchComplete, currentUser }) => {
  const [query, setQuery] = useState('');
  const [data, setData] = useState<MasterSearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const isReadOnly = currentUser?.role === 'read_only';

  useEffect(() => {
    setRecentSearches(getMasterSearchHistory());
  }, []);

  const executeSearch = async (searchQuery: string) => {
    if (!searchQuery.trim() || isReadOnly) return;

    const updatedHistory = addMasterSearchHistory(searchQuery);
    setRecentSearches(updatedHistory);

    setIsLoading(true);
    setError(null);
    setData(null);

    try {
      const result = await performMasterSearch(searchQuery);
      setData(result);
      if (onSearchComplete) onSearchComplete(result);
    } catch (err) {
      setError("Strategic intelligence retrieval failed. Please try a different query.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    executeSearch(query);
  };

  const handleHistoryClick = (historyQuery: string) => {
    setQuery(historyQuery);
    executeSearch(historyQuery);
  };

  return (
    <div className="w-full space-y-12">
      {/* Search Command Center */}
      <div className="relative rounded-[3rem] p-1 shadow-2xl overflow-hidden bg-gradient-to-br from-indigo-500 via-purple-600 to-indigo-800">
        <div className="bg-slate-900 rounded-[2.9rem] p-10 md:p-20 relative overflow-hidden">
          {/* Decorative Elements for depth */}
          <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
            <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-500 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-600 rounded-full blur-[120px]"></div>
          </div>

          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-300 text-[10px] font-black uppercase tracking-[0.25em] mb-8">
              <span className="flex h-2 w-2 rounded-full bg-indigo-400 animate-pulse"></span>
              Global Strategy Hub
            </div>
            
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight leading-none">
              Enterprise <span className="text-indigo-400">Insight</span> Engine
            </h2>
            
            <p className="text-slate-400 mb-12 text-lg md:text-xl font-medium leading-relaxed max-w-2xl mx-auto">
              Access institutional-grade intelligence. Scan the last 12 months of global agency wins and leadership shifts instantly.
            </p>
            
            {/* HIGH VISIBILITY SEARCH BAR */}
            <form onSubmit={handleSearch} className="relative max-w-3xl mx-auto group">
              <div className="absolute inset-y-0 left-0 pl-7 flex items-center pointer-events-none z-20">
                <svg className="h-7 w-7 text-slate-400 group-focus-within:text-indigo-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              
              <input
                type="text"
                readOnly={isReadOnly}
                className={`block w-full pl-16 pr-52 py-7 border-0 rounded-3xl bg-white text-slate-900 shadow-[0_20px_50px_rgba(79,70,229,0.3)] placeholder-slate-400 text-xl md:text-2xl focus:outline-none focus:ring-8 focus:ring-indigo-500/20 transition-all font-bold ${isReadOnly ? 'cursor-not-allowed opacity-80' : ''}`}
                placeholder={isReadOnly ? "Read-Only Access Active..." : "Search Agency or Brand..."}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              
              <button
                type="submit"
                disabled={isLoading || !query.trim() || isReadOnly}
                className="absolute right-3 top-3 bottom-3 bg-indigo-600 text-white px-12 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 flex items-center gap-3 z-20 shadow-lg shadow-indigo-600/20"
              >
                {isLoading ? (
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                ) : isReadOnly ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                )}
                <span>{isReadOnly ? 'Locked' : isLoading ? 'Scanning' : 'Execute'}</span>
              </button>
            </form>

            {recentSearches.length > 0 && (
              <div className="mt-12 flex flex-wrap justify-center gap-3 items-center animate-fade-in">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mr-2">
                  Previous Scans:
                </span>
                {recentSearches.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => handleHistoryClick(item)}
                    disabled={isLoading || isReadOnly}
                    className="px-5 py-2.5 rounded-2xl bg-slate-800/50 border border-slate-700/50 text-[11px] font-bold text-slate-400 hover:text-white hover:bg-slate-800 hover:border-indigo-500 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {item}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 text-rose-700 p-6 rounded-2xl border border-rose-100 font-bold flex items-center gap-3 max-w-4xl mx-auto shadow-sm">
           <svg className="w-6 h-6 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
           {error}
        </div>
      )}

      {/* Results Area */}
      {(isLoading || data) && (
        <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
          {isLoading ? (
             <div className="space-y-6">
                <div className="h-32 bg-slate-100 shimmer rounded-3xl w-full"></div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="h-[500px] bg-slate-100 shimmer rounded-[2rem]"></div>
                    <div className="h-[500px] bg-slate-100 shimmer rounded-[2rem]"></div>
                    <div className="h-[500px] bg-slate-100 shimmer rounded-[2rem]"></div>
                </div>
             </div>
          ) : data && (
            <>
              {/* Executive Summary Card */}
              <div className="bg-white rounded-[2.5rem] p-12 border border-slate-100 shadow-2xl shadow-slate-200/50 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-50 rounded-full blur-[100px] -mr-40 -mt-40 pointer-events-none"></div>
                <div className="relative z-10">
                   <div className="flex items-center gap-3 mb-8">
                      <div className="bg-indigo-600 p-3 rounded-2xl text-white shadow-xl shadow-indigo-200">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                      </div>
                      <span className="text-xs font-black uppercase tracking-[0.25em] text-indigo-600">Executive Strategic Brief</span>
                   </div>
                   <p className="text-2xl md:text-4xl leading-snug font-extrabold text-slate-900 tracking-tight">{data.summary}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                
                {/* Insights - News */}
                <div className="clean-panel rounded-[2.5rem] overflow-hidden bg-white border-none shadow-xl shadow-slate-200/50">
                  <div className="bg-slate-50/50 px-8 py-7 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs">Intelligence Feed</h3>
                    <span className="text-[10px] font-black text-slate-400">NEWS LOG</span>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {data.news.map((item, i) => (
                      <a key={i} href={`https://www.google.com/search?q=${encodeURIComponent(item.headline)}`} target="_blank" rel="noreferrer" className="block p-8 hover:bg-slate-50 transition-all group">
                        <div className="flex justify-between items-start mb-3">
                           <span className="text-[10px] font-black text-slate-600 bg-slate-100 px-2.5 py-1 rounded border border-slate-200 uppercase tracking-widest">{item.category}</span>
                        </div>
                        <h4 className="text-base font-extrabold text-slate-900 leading-tight mb-2 group-hover:text-indigo-600 transition-colors">{item.headline}</h4>
                        <p className="text-sm text-slate-500 line-clamp-2 font-medium leading-relaxed">{item.summary}</p>
                      </a>
                    ))}
                  </div>
                </div>

                {/* Key Personnel */}
                <div className="clean-panel rounded-[2.5rem] overflow-hidden bg-white border-none shadow-xl shadow-slate-200/50">
                  <div className="bg-slate-50/50 px-8 py-7 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs">Decision Makers</h3>
                    <span className="text-[10px] font-black text-slate-400">PEOPLE LOG</span>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {data.leaders.map((person, i) => (
                       <div key={i} className="p-8 flex items-center justify-between group hover:bg-slate-50 transition-all">
                          <div className="flex items-center gap-4">
                             <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-xl shadow-sm">
                                {person.name.charAt(0)}
                             </div>
                             <div>
                                <div className="font-extrabold text-slate-900 text-base">{person.name}</div>
                                <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">{person.role}</div>
                             </div>
                          </div>
                          <a href={person.linkedinUrl} target="_blank" rel="noreferrer" className="text-slate-300 hover:text-indigo-600 p-2 transition-all hover:bg-indigo-50 rounded-xl">
                            <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                          </a>
                       </div>
                    ))}
                  </div>
                </div>

                {/* Operations & Wins */}
                <div className="clean-panel rounded-[2.5rem] overflow-hidden bg-white border-none shadow-xl shadow-slate-200/50">
                  <div className="bg-slate-50/50 px-8 py-7 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs">Wins & Reviews</h3>
                    <span className="text-[10px] font-black text-slate-400">ACCOUNT LOG</span>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {data.wins.map((win, i) => (
                      <div key={i} className="p-8 hover:bg-slate-50 transition-all">
                         <div className="flex items-center gap-2 mb-3">
                            <span className="text-[10px] font-black bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded border border-emerald-100 uppercase tracking-widest">{win.country}</span>
                         </div>
                         <div className="text-base text-slate-800 leading-snug font-medium">
                            <span className="font-black text-slate-900">{win.agency}</span> appointed to <span className="font-black text-slate-900 underline decoration-indigo-200 decoration-4 underline-offset-4">{win.client}</span>
                         </div>
                         <div className="text-[10px] text-slate-400 mt-4 font-black uppercase tracking-[0.1em]">VERIFIED BY {win.source}</div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
