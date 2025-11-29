
import React, { useState } from 'react';
import { MasterSearchResult } from '../types';
import { performMasterSearch } from '../services/geminiService';

interface MasterSearchSectionProps {
  onSearchComplete?: (data: MasterSearchResult) => void;
}

export const MasterSearchSection: React.FC<MasterSearchSectionProps> = ({ onSearchComplete }) => {
  const [query, setQuery] = useState('');
  const [data, setData] = useState<MasterSearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);
    setData(null);

    try {
      const result = await performMasterSearch(query);
      setData(result);
      if (onSearchComplete) onSearchComplete(result);
    } catch (err) {
      setError("Failed to perform master search. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Search Input Area */}
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 md:p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Master Intelligence Search</h2>
        <p className="text-slate-500 mb-6">Deep dive into any Agency, Client, or Brand for the last 12 months.</p>
        
        <form onSubmit={handleSearch} className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg className="h-6 w-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            className="block w-full pl-12 pr-4 py-4 border-2 border-slate-200 rounded-xl leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-0 text-lg transition-all"
            placeholder="Search anything (e.g. 'Ogilvy', 'Nike', 'WPP APAC', 'Retail Media Trends')"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="absolute right-2 top-2 bottom-2 bg-blue-600 text-white px-6 rounded-lg font-medium hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Analyzing...' : 'Search'}
          </button>
        </form>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200 animate-fade-in">
          {error}
        </div>
      )}

      {/* Dynamic Results Area */}
      {isLoading && (
         <div className="bg-white rounded-xl p-8 border border-slate-200 animate-pulse space-y-4">
            <div className="h-6 bg-slate-100 rounded w-1/4"></div>
            <div className="h-4 bg-slate-100 rounded w-full"></div>
            <div className="h-4 bg-slate-100 rounded w-2/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="h-32 bg-slate-100 rounded"></div>
                <div className="h-32 bg-slate-100 rounded"></div>
                <div className="h-32 bg-slate-100 rounded"></div>
            </div>
         </div>
      )}

      {data && !isLoading && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Executive Summary */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-6 text-white shadow-md">
             <div className="flex items-center gap-2 mb-2 opacity-80">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span className="text-sm font-semibold uppercase tracking-wider">Executive Summary</span>
             </div>
             <p className="text-lg leading-relaxed font-light">{data.summary}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Column 1: Recent News */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>
                  News & Events
                </h3>
                <span className="text-xs bg-white border border-slate-200 px-2 py-0.5 rounded-full text-slate-500">Last 12 Mo</span>
              </div>
              <div className="divide-y divide-slate-100">
                {data.news.length > 0 ? data.news.map((item, i) => (
                  <a key={i} href={`https://www.google.com/search?q=${encodeURIComponent(item.headline)}`} target="_blank" rel="noreferrer" className="block p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex justify-between items-start mb-1">
                       <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded uppercase">{item.category}</span>
                    </div>
                    <h4 className="text-sm font-semibold text-slate-900 leading-snug mb-1">{item.headline}</h4>
                    <p className="text-xs text-slate-500 line-clamp-2">{item.summary}</p>
                  </a>
                )) : (
                  <div className="p-8 text-center text-slate-400 text-sm">No recent news found.</div>
                )}
              </div>
            </div>

            {/* Column 2: Key People */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                  Key Leadership
                </h3>
              </div>
              <div className="divide-y divide-slate-100">
                {data.leaders.length > 0 ? data.leaders.map((person, i) => (
                   <div key={i} className="p-4 flex items-center justify-between group">
                      <div>
                         <div className="font-bold text-slate-900 text-sm">{person.name}</div>
                         <div className="text-xs text-slate-500">{person.role}</div>
                      </div>
                      <a href={person.linkedinUrl} target="_blank" rel="noreferrer" className="text-slate-300 hover:text-blue-600">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                      </a>
                   </div>
                )) : (
                  <div className="p-8 text-center text-slate-400 text-sm">No leadership profiles found.</div>
                )}
              </div>
            </div>

            {/* Column 3: Wins & Activity */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  Wins & Campaigns
                </h3>
              </div>
              <div className="divide-y divide-slate-100">
                {data.wins.length > 0 ? data.wins.map((win, i) => (
                  <div key={i} className="p-4">
                     <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100 px-1.5 rounded">{win.country}</span>
                     </div>
                     <div className="text-sm text-slate-900">
                        <span className="font-semibold">{win.agency}</span> won <span className="font-semibold">{win.client}</span>
                     </div>
                     <div className="text-xs text-slate-400 mt-1">{win.source}</div>
                  </div>
                )) : (
                  <div className="p-8 text-center text-slate-400 text-sm">No recent wins or campaigns found.</div>
                )}
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
