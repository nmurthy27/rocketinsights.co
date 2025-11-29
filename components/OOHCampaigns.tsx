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
  
  // Group by category (e.g., DOOH, Transit, Large Format)
  const groupedCampaigns = campaigns.reduce((acc, item) => {
    const category = item.category || 'General OOH';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {} as Record<string, NewsItem[]>);

  const categories = Object.keys(groupedCampaigns);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-8">
      <div className="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-purple-50 to-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-2">
          <div className="bg-purple-500 w-2 h-2 rounded-full animate-pulse"></div>
          <h2 className="text-lg font-bold text-slate-800">Out of Home Campaign Updates</h2>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
           <div className="relative">
              <select
                value={selectedRegion}
                onChange={(e) => onRegionChange(e.target.value)}
                disabled={isLoading}
                className="appearance-none bg-white border border-slate-300 text-slate-700 text-xs font-medium py-1.5 pl-3 pr-8 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {NEWS_REGIONS.map(region => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                <svg className="h-3 w-3 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
           </div>

           <div className="h-4 w-px bg-slate-300 hidden sm:block"></div>

           <button 
             onClick={onRefresh}
             disabled={isLoading}
             className="text-xs text-purple-600 hover:text-purple-800 font-medium flex items-center gap-1 disabled:opacity-50 whitespace-nowrap"
           >
              {isLoading ? 'Scanning...' : 'Refresh'}
              {!isLoading && (
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              )}
           </button>
        </div>
      </div>
      
      <div className="p-6">
        {isLoading ? (
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="space-y-3">
                  <div className="h-4 bg-slate-100 rounded w-1/3 mb-4"></div>
                  <div className="flex gap-4">
                     <div className="flex-1 space-y-2">
                        <div className="h-4 bg-slate-50 rounded w-full"></div>
                        <div className="h-4 bg-slate-50 rounded w-2/3"></div>
                     </div>
                  </div>
                  <div className="flex gap-4">
                     <div className="flex-1 space-y-2">
                        <div className="h-4 bg-slate-50 rounded w-full"></div>
                        <div className="h-4 bg-slate-50 rounded w-2/3"></div>
                     </div>
                  </div>
                </div>
              ))}
           </div>
        ) : campaigns.length === 0 ? (
           <div className="text-center py-8 text-slate-500">
             <p>No OOH campaigns found for {selectedRegion} recently. Try refreshing or changing the region.</p>
           </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-8">
            {categories.map(category => (
              <div key={category} className="flex flex-col">
                <h3 className="text-xs font-bold text-purple-600 uppercase tracking-wider mb-4 border-b border-purple-100 pb-2">
                  {category}
                </h3>
                <div className="space-y-4">
                  {groupedCampaigns[category].map(item => (
                    <div key={item.id} className="group relative bg-white rounded-lg border border-slate-100 overflow-hidden hover:border-purple-200 hover:shadow-lg transition-all duration-300">
                      <a 
                        href={`https://www.google.com/search?q=${encodeURIComponent(item.headline + ' OOH Campaign ' + item.source)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-start p-4 gap-3"
                      >
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-bold text-slate-900 group-hover:text-purple-700 leading-snug transition-colors line-clamp-2">
                            {item.headline}
                          </h4>
                          <p className="text-xs text-slate-600 mt-1 leading-relaxed line-clamp-2">
                            {item.summary}
                          </p>
                          <div className="mt-2 flex items-center pt-2 border-t border-slate-50 justify-between">
                             <span className="text-[10px] text-slate-400 font-medium truncate">
                               Source: {item.source}
                             </span>
                             <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-50 text-purple-600 font-medium">
                               {item.category}
                             </span>
                          </div>
                        </div>
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="px-6 py-2 bg-slate-50 border-t border-slate-200 text-[10px] text-slate-400">
        Tracking OOH, DOOH, Transit, Airport, and Retail Media activations in {selectedRegion}
      </div>
    </div>
  );
};