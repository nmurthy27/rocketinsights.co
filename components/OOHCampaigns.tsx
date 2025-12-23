
import React from 'react';
import { NewsItem } from '../types';
import { NEWS_REGIONS } from '../constants';

interface OOHCampaignsProps {
  campaigns: NewsItem[];
  isLoading: boolean;
  onRefresh: () => void;
  selectedRegion: string;
  onRegionChange: (region: string) => void;
}

export const OOHCampaigns: React.FC<OOHCampaignsProps> = ({ 
  campaigns, 
  isLoading, 
  onRefresh,
  selectedRegion,
  onRegionChange
}) => {
  
  const todayDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  });

  return (
    <div className="clean-panel rounded-[2.5rem] overflow-hidden bg-white mb-8 border border-slate-200 shadow-xl shadow-slate-200/30">
      {/* Header - Strictly Solid White */}
      <div className="px-10 py-10 border-b border-slate-100 bg-white flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 bg-slate-900 rounded-[1.5rem] flex items-center justify-center text-white">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h14a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
             <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                OOH Campaign Updates
             </h2>
             <div className="flex items-center gap-2 mt-1">
               <span className="text-purple-600 font-black text-[10px] uppercase tracking-widest">DOOH & Physical Activation Stream Active • {todayDate}</span>
             </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
           <div className="relative">
              <select
                value={selectedRegion}
                onChange={(e) => onRegionChange(e.target.value)}
                disabled={isLoading}
                className="appearance-none bg-slate-50 border border-slate-200 text-slate-900 text-sm font-bold py-3.5 pl-5 pr-12 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 focus:bg-white transition-all cursor-pointer"
              >
                {NEWS_REGIONS.map(region => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
              </div>
           </div>

           <button 
             onClick={onRefresh}
             disabled={isLoading}
             className="px-8 py-4 bg-slate-900 text-white font-black text-sm uppercase tracking-widest rounded-2xl hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg shadow-slate-100"
           >
              {isLoading ? (
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
              )}
              {isLoading ? 'Scanning' : 'Update'}
           </button>
        </div>
      </div>
      
      <div className="p-10 bg-white">
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
        ) : campaigns.length === 0 ? (
           <div className="text-center py-20 bg-slate-50 rounded-[2rem] border border-dashed border-slate-200">
             <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white shadow-sm mb-6">
                <svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h14a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
             </div>
             <p className="text-slate-500 font-black uppercase tracking-widest text-xs">Waiting for OOH data refresh...</p>
             <p className="text-[10px] text-slate-400 mt-2 uppercase tracking-widest font-bold">Select a region and click update to begin scanning</p>
           </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {campaigns.map(item => (
              <div key={item.id} className="group relative flex flex-col bg-white rounded-[2rem] border border-slate-200 p-8 hover:border-purple-400 hover:shadow-xl hover:shadow-purple-500/5 transition-all duration-300 overflow-hidden">
                {/* Solid accent line */}
                <div className="absolute top-0 left-0 w-full h-1 bg-slate-100 group-hover:bg-purple-600 transition-colors"></div>
                
                <div className="flex items-center justify-between mb-5">
                  <span className="text-[10px] font-black text-purple-700 bg-purple-50 px-2.5 py-1 rounded border border-purple-100 uppercase tracking-widest">
                    {item.category || 'OOH'}
                  </span>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                    {item.source}
                  </span>
                </div>
                
                <h4 className="text-lg font-black text-slate-900 group-hover:text-purple-600 leading-tight transition-colors mb-4">
                  {item.headline}
                </h4>
                
                <p className="text-sm text-slate-600 leading-relaxed line-clamp-3 font-medium mb-8">
                  {item.summary}
                </p>
                
                <div className="mt-auto pt-6 border-t border-slate-100 flex items-center justify-between">
                  <a 
                    href={`https://www.google.com/search?q=${encodeURIComponent(item.headline + ' OOH campaign ' + item.source)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-black text-slate-400 hover:text-purple-600 flex items-center gap-1.5 transition-colors uppercase tracking-widest"
                  >
                    View Intelligence
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2-2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Footer - Strictly Solid Slate */}
      <div className="px-10 py-5 bg-slate-50 border-t border-slate-100 text-[10px] font-black text-slate-400 flex justify-between items-center tracking-widest uppercase">
        <span>DOOH & Physical Activation Stream</span>
        <span>Tracking {selectedRegion} Media Landscape</span>
      </div>
    </div>
  );
};
