
import React, { useState, useEffect } from 'react';
import { MasterSearchResult } from '../types';
import { performMasterSearch } from '../services/geminiService';
import { logBusinessSearchToSupabase } from '../services/supabaseClient';
import { getMasterSearchHistory, addMasterSearchHistory } from '../services/localStorageService';

interface MasterSearchSectionProps {
  onSearchComplete?: (data: MasterSearchResult) => void;
  // userEmail prop removed as it is no longer used
}

export const MasterSearchSection: React.FC<MasterSearchSectionProps> = ({ onSearchComplete }) => {
  const [query, setQuery] = useState('');
  const [data, setData] = useState<MasterSearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    setRecentSearches(getMasterSearchHistory());
  }, []);

  const executeSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    logBusinessSearchToSupabase(searchQuery); // No email passed
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
      setError("Failed to perform search. Please try again.");
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
    <div className="w-full space-y-8">
      {/* Hero Search Area */}
      <div className="glass-panel rounded-3xl p-8 md:p-10 shadow-2xl shadow-indigo-900/5 relative overflow-hidden">
        {/* Decorative background blob */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>

        <div className="relative z-10">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">
            Business Intelligence <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-pink-600">Search</span>
          </h2>
          <p className="text-slate-500 mb-8 text-lg font-medium max-w-2xl">
            Deep dive into any Agency, Client, or Brand for the last 12 months with a single query.
          </p>
          
          <form onSubmit={handleSearch} className="relative max-w-4xl">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <svg className="h-7 w-7 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              className="block w-full pl-16 pr-36 py-5 border-2 border-indigo-50 rounded-2xl leading-5 bg-white shadow-xl shadow-indigo-100/50 placeholder-slate-300 text-slate-700 text-xl font-medium focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-300"
              placeholder="E.g. 'Ogilvy APAC', 'Nike Marketing', 'WPP Trends'"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button
              type="submit"
              disabled={isLoading || !query.trim()}
              className="absolute right-3 top-2.5 bottom-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 rounded-xl font-bold hover:shadow-lg hover:shadow-indigo-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  <span>Scanning</span>
                </>
              ) : 'Search'}
            </button>
          </form>

          {/* Recent Searches Pills */}
          {recentSearches.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2 items-center animate-fade-in">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mr-2 flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Recent:
              </span>
              {recentSearches.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleHistoryClick(item)}
                  disabled={isLoading}
                  className="px-3 py-1 rounded-full bg-white/50 border border-white/60 text-xs font-medium text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-all cursor-pointer shadow-sm"
                >
                  {item}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 text-rose-600 p-4 rounded-xl border border-rose-100 animate-fade-in font-medium flex items-center gap-2">
           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
           {error}
        </div>
      )}

      {/* Loading Skeleton */}
      {isLoading && (
         <div className="glass-panel rounded-3xl p-8 border border-white/50 space-y-6">
            <div className="h-8 bg-slate-100/50 rounded-lg w-1/4 animate-pulse"></div>
            <div className="h-4 bg-slate-100/50 rounded w-full animate-pulse"></div>
            <div className="h-4 bg-slate-100/50 rounded w-2/3 animate-pulse"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="h-48 bg-slate-100/50 rounded-2xl animate-pulse"></div>
                <div className="h-48 bg-slate-100/50 rounded-2xl animate-pulse"></div>
                <div className="h-48 bg-slate-100/50 rounded-2xl animate-pulse"></div>
            </div>
         </div>
      )}

      {/* Results */}
      {data && !isLoading && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Executive Summary */}
          <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-8 text-white shadow-xl shadow-purple-900/20 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-32 bg-white opacity-5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
             <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                    <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                    </div>
                    <span className="text-sm font-bold uppercase tracking-wider text-white/90">Executive Summary</span>
                </div>
                <p className="text-xl md:text-2xl leading-relaxed font-medium text-white/95">{data.summary}</p>
             </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* News Column */}
            <div className="glass-panel rounded-3xl overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="bg-gradient-to-r from-blue-50 to-white px-6 py-4 border-b border-blue-100/50 flex items-center justify-between">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span> News & Events
                </h3>
              </div>
              <div className="divide-y divide-slate-100">
                {data.news.map((item, i) => (
                  <a key={i} href={`https://www.google.com/search?q=${encodeURIComponent(item.headline)}`} target="_blank" rel="noreferrer" className="block p-5 hover:bg-blue-50/50 transition-colors group">
                    <div className="flex justify-between items-start mb-2">
                       <span className="text-[10px] font-bold text-blue-600 bg-blue-100/50 px-2 py-1 rounded-md uppercase tracking-wide group-hover:bg-blue-100 transition-colors">{item.category}</span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-800 leading-snug mb-1 group-hover:text-blue-700">{item.headline}</h4>
                    <p className="text-xs text-slate-500 line-clamp-2">{item.summary}</p>
                  </a>
                ))}
              </div>
            </div>

            {/* People Column */}
            <div className="glass-panel rounded-3xl overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="bg-gradient-to-r from-purple-50 to-white px-6 py-4 border-b border-purple-100/50 flex items-center justify-between">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-500"></span> Key Leadership
                </h3>
              </div>
              <div className="divide-y divide-slate-100">
                {data.leaders.map((person, i) => (
                   <div key={i} className="p-5 flex items-center justify-between group hover:bg-purple-50/50 transition-colors">
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-sm">
                            {person.name.charAt(0)}
                         </div>
                         <div>
                            <div className="font-bold text-slate-800 text-sm">{person.name}</div>
                            <div className="text-xs text-slate-500 font-medium">{person.role}</div>
                         </div>
                      </div>
                      <a href={person.linkedinUrl} target="_blank" rel="noreferrer" className="text-slate-300 hover:text-blue-600 bg-white p-2 rounded-full shadow-sm border border-slate-100 hover:border-blue-200 transition-all">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                      </a>
                   </div>
                ))}
              </div>
            </div>

            {/* Wins Column */}
            <div className="glass-panel rounded-3xl overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="bg-gradient-to-r from-emerald-50 to-white px-6 py-4 border-b border-emerald-100/50 flex items-center justify-between">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Wins & Activity
                </h3>
              </div>
              <div className="divide-y divide-slate-100">
                {data.wins.map((win, i) => (
                  <div key={i} className="p-5 hover:bg-emerald-50/50 transition-colors">
                     <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">{win.country}</span>
                     </div>
                     <div className="text-sm text-slate-800 leading-relaxed">
                        <span className="font-bold text-indigo-700">{win.agency}</span> won <span className="font-bold text-slate-900">{win.client}</span>
                     </div>
                     <div className="text-[10px] text-slate-400 mt-2 font-medium uppercase tracking-wide">{win.source}</div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
