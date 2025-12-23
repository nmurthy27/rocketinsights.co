
import React from 'react';
import { NewsItem } from '../types';
import { NEWS_REGIONS } from '../constants';

interface DailyBriefingProps {
  news: NewsItem[];
  isLoading: boolean;
  onRefresh: () => void;
  selectedRegion: string;
  onRegionChange: (region: string) => void;
  isSubscribed: boolean;
  onSubscribeClick: () => void;
}

export const DailyBriefing: React.FC<DailyBriefingProps> = ({ 
  news, 
  isLoading, 
  onRefresh,
  selectedRegion,
  onRegionChange,
  isSubscribed,
  onSubscribeClick
}) => {
  
  const todayDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  });

  return (
    <div className="clean-panel rounded-[2.5rem] overflow-hidden bg-white mb-8 border-none shadow-2xl shadow-slate-200/40">
      <div className="px-10 py-8 border-b border-slate-100 bg-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="flex items-center space-x-5">
          <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-100">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          </div>
          <div>
             <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                Daily Intel Briefing
             </h2>
             <div className="flex items-center gap-2 mt-1">
               <span className="flex h-2 w-2 rounded-full bg-emerald-500"></span>
               <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em]">{todayDate} • REGION: {selectedRegion}</p>
             </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
           <div className="relative">
              <select
                value={selectedRegion}
                onChange={(e) => onRegionChange(e.target.value)}
                disabled={isLoading}
                className="appearance-none bg-slate-50 border border-slate-200 text-slate-900 text-xs font-black py-3.5 pl-5 pr-12 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all cursor-pointer uppercase tracking-widest"
              >
                {NEWS_REGIONS.map(region => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
              </div>
           </div>

           <button 
             onClick={onRefresh}
             disabled={isLoading}
             className="text-xs bg-slate-900 text-white hover:bg-slate-800 font-black px-8 py-3.5 rounded-2xl shadow-xl shadow-slate-200 transition-all flex items-center gap-3 disabled:opacity-50 uppercase tracking-widest"
           >
              {isLoading ? (
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
              )}
              {isLoading ? 'Scanning' : 'Update'}
           </button>
        </div>
      </div>
      
      <div className="p-10">
        {isLoading ? (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                <div key={i} className="space-y-4 animate-pulse bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
                  <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                  <div className="h-6 bg-slate-200 rounded w-full"></div>
                  <div className="h-16 bg-slate-200 rounded w-full"></div>
                </div>
              ))}
           </div>
        ) : news.length === 0 ? (
           <div className="text-center py-20 bg-slate-50 rounded-[2.5rem] border border-dashed border-slate-300">
             <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-white shadow-sm mb-8">
                <svg className="w-12 h-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
             </div>
             <p className="text-slate-500 font-black uppercase tracking-[0.2em] text-xs">Waiting for institutional feed sync...</p>
             <p className="text-[10px] text-slate-400 mt-2 uppercase tracking-widest font-bold">Select target region and execute update</p>
           </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {news.map(item => (
              <div key={item.id} className="group relative flex flex-col bg-white rounded-[2rem] border border-slate-200 p-8 hover:border-indigo-400 hover:shadow-2xl hover:shadow-indigo-500/5 transition-all duration-300 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-slate-100 group-hover:bg-indigo-600 transition-colors"></div>
                
                <div className="flex items-center justify-between mb-5">
                  <span className="text-[10px] font-black text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100 uppercase tracking-widest">
                    {item.category || 'MARKET'}
                  </span>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest opacity-60">
                    {item.source}
                  </span>
                </div>
                
                <h4 className="text-[15px] font-black text-slate-900 group-hover:text-indigo-600 leading-tight transition-colors mb-4">
                  {item.headline}
                </h4>
                
                <p className="text-sm text-slate-500 leading-relaxed line-clamp-3 font-medium mb-8">
                  {item.summary}
                </p>
                
                <div className="mt-auto pt-6 border-t border-slate-100 flex items-center justify-between">
                  <a 
                    href={`https://www.google.com/search?q=${encodeURIComponent(item.headline + ' ' + item.source)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-black text-slate-400 hover:text-indigo-600 flex items-center gap-2 transition-colors uppercase tracking-widest"
                  >
                    View Intel
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && news.length > 0 && !isSubscribed && (
          <div className="mt-12 p-8 bg-indigo-50 rounded-[2rem] border border-indigo-100 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Stay Ahead with the Weekly Pulse</h3>
              <p className="text-slate-600 font-medium text-sm mt-1">Get the full week's intelligence summarized in your inbox every Monday morning.</p>
            </div>
            <button 
              onClick={onSubscribeClick}
              className="px-10 py-4 bg-slate-900 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
            >
              Subscribe Now
            </button>
          </div>
        )}
      </div>

      <div className="px-10 py-5 bg-slate-50 border-t border-slate-100 text-[10px] font-black text-slate-400 flex justify-between items-center tracking-widest uppercase">
        <span>Institutional Intelligence Stream</span>
        <span>Search Grounding Enabled • Gemini 3.0</span>
      </div>
    </div>
  );
};
