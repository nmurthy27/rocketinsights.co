import React from 'react';
import { NewsItem } from '../types';
import { NEWS_REGIONS } from '../constants';

interface DailyBriefingProps {
  news: NewsItem[];
  isLoading: boolean;
  onRefresh: () => void;
  selectedRegion: string;
  onRegionChange: (region: string) => void;
}

export const DailyBriefing: React.FC<DailyBriefingProps> = ({ 
  news, 
  isLoading, 
  onRefresh,
  selectedRegion,
  onRegionChange
}) => {
  
  const groupedNews = news.reduce((acc, item) => {
    const category = item.category || 'General';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {} as Record<string, NewsItem[]>);

  const categories = Object.keys(groupedNews);
  
  const todayDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  });

  return (
    <div className="glass-panel rounded-3xl overflow-hidden shadow-lg mb-8">
      <div className="px-6 py-5 border-b border-slate-100 bg-white/50 backdrop-blur-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-3">
          <div className="relative">
             <div className="bg-rose-500 w-3 h-3 rounded-full animate-ping absolute opacity-75"></div>
             <div className="bg-rose-500 w-3 h-3 rounded-full relative"></div>
          </div>
          <div>
             <h2 className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-slate-600 leading-none">
                Daily Industry Briefing
             </h2>
             <p className="text-xs font-semibold text-indigo-500 mt-1 uppercase tracking-wide">{todayDate}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
           <div className="relative group">
              <select
                value={selectedRegion}
                onChange={(e) => onRegionChange(e.target.value)}
                disabled={isLoading}
                className="appearance-none bg-white border border-slate-200 text-slate-700 text-xs font-bold py-2 pl-4 pr-10 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all hover:border-indigo-300 cursor-pointer"
              >
                {NEWS_REGIONS.map(region => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 group-hover:text-indigo-500 transition-colors">
                <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
           </div>

           <button 
             onClick={onRefresh}
             disabled={isLoading}
             className="text-xs bg-white border border-slate-200 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 font-bold px-4 py-2 rounded-xl shadow-sm transition-all flex items-center gap-1.5 disabled:opacity-50"
           >
              {isLoading ? (
                <svg className="animate-spin h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              ) : (
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
              )}
              {isLoading ? 'Updating...' : 'Refresh'}
           </button>
        </div>
      </div>
      
      <div className="p-6 md:p-8 bg-white/40">
        {isLoading ? (
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="space-y-4 animate-pulse">
                  <div className="h-5 bg-slate-200 rounded w-1/3"></div>
                  <div className="h-24 bg-slate-100 rounded-2xl border border-white/50"></div>
                  <div className="h-24 bg-slate-100 rounded-2xl border border-white/50"></div>
                </div>
              ))}
           </div>
        ) : news.length === 0 ? (
           <div className="text-center py-12">
             <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
                <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>
             </div>
             <p className="text-slate-500 font-medium">No headlines available for {selectedRegion}.</p>
           </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {categories.map(category => (
              <div key={category} className="flex flex-col">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                   <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                   {category}
                </h3>
                <div className="space-y-4">
                  {groupedNews[category].map(item => (
                    <div key={item.id} className="group bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-lg hover:shadow-indigo-500/5 hover:border-indigo-100 hover:-translate-y-1 transition-all duration-300">
                      <a 
                        href={`https://www.google.com/search?q=${encodeURIComponent(item.headline + ' ' + item.source)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col p-5 h-full"
                      >
                         <div className="mb-2">
                           <span className="text-[10px] font-bold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100/50">
                             {item.source}
                           </span>
                         </div>
                         <h4 className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 leading-snug transition-colors line-clamp-3 mb-2">
                            {item.headline}
                         </h4>
                         <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mt-auto">
                            {item.summary}
                         </p>
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="px-6 py-3 bg-white/60 border-t border-slate-100 text-[10px] text-slate-400 font-medium text-center">
        Top stories from last 24 hours curated via AI for {selectedRegion} region
      </div>
    </div>
  );
};