
import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { SourceCard } from './components/SourceCard';
import { IntelligenceTable } from './components/IntelligenceTable';
import { DailyBriefing } from './components/DailyBriefing';
import { OOHCampaigns } from './components/OOHCampaigns';
import { LeadershipScanner } from './components/LeadershipScanner';
import { LoginModal } from './components/LoginModal';
import { MasterSearchSection } from './components/MasterSearchSection';
import { AdminDashboard } from './components/AdminDashboard';
import { SOURCES, MEDIA_TYPES } from './constants';
import { AgencyWin, NewsItem, ScanStatus, UserProfile, PulseSearchHistoryItem } from './types';
import { scanMarketIntelligence, fetchDailyNews, fetchOOHCampaigns } from './services/geminiService';
import { saveSubscriberToSupabase, logPulseSearchToSupabase } from './services/supabaseClient';
import { subscribeToMailchimp } from './services/mailchimpService';
import { getPulseSearchHistory, addPulseSearchHistory } from './services/localStorageService';

const detectUserRegion = (): string => {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (!tz) return 'APAC';
    if (tz.includes('Australia') || tz.includes('Pacific/Auckland')) return 'ANZ';
    if (tz.includes('Asia/Shanghai') || tz.includes('Asia/Chongqing') || tz.includes('Asia/Urumqi')) return 'China';
    if (tz.includes('Asia/Dubai') || tz.includes('Asia/Riyadh') || tz.includes('Asia/Baghdad') || tz.includes('Asia/Kuwait')) return 'Middle East';
    if (tz.includes('Europe') || tz.includes('London') || tz.includes('Paris') || tz.includes('Berlin')) return 'Europe';
    if (tz.includes('America') || tz.includes('US') || tz.includes('Canada') || tz.includes('Sao_Paulo')) return 'Americas';
    if (tz.includes('Africa')) return 'Africa';
    if (tz.includes('Asia')) return 'APAC';
    return 'Global';
  } catch (e) {
    return 'APAC';
  }
};

const detectUserCountry = (): string => {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz && tz.includes('/')) {
        const city = tz.split('/')[1].replace(/_/g, ' ');
        if (city === 'Singapore') return 'Singapore';
        if (city === 'Hong Kong') return 'Hong Kong';
        if (city === 'Tokyo') return 'Japan';
        if (city === 'Sydney' || city === 'Melbourne') return 'Australia';
        if (city === 'London') return 'UK';
        if (city === 'New York' || city === 'Los Angeles' || city === 'Chicago') return 'USA';
        return city;
    }
    return '';
  } catch (e) {
    return '';
  }
};

const App: React.FC = () => {
  const [status, setStatus] = useState<ScanStatus>(ScanStatus.IDLE);
  const [data, setData] = useState<AgencyWin[]>([]);
  const [lastScanTime, setLastScanTime] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [countryQuery, setCountryQuery] = useState<string>(detectUserCountry());
  const [mediaQuery, setMediaQuery] = useState<string>('All Media');
  const [recentPulseSearches, setRecentPulseSearches] = useState<PulseSearchHistoryItem[]>([]);

  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [newsLoading, setNewsLoading] = useState<boolean>(true);
  const [newsRegion, setNewsRegion] = useState<string>(detectUserRegion());

  const [oohItems, setOohItems] = useState<NewsItem[]>([]);
  const [oohLoading, setOohLoading] = useState<boolean>(true);
  const [oohRegion, setOohRegion] = useState<string>(detectUserRegion());

  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState<boolean>(false);
  const [loginToast, setLoginToast] = useState<string | null>(null);

  useEffect(() => {
    // Check for admin URL param to open dashboard directly
    const params = new URLSearchParams(window.location.search);
    if (params.get('admin') === 'true') {
        setIsAdminPanelOpen(true);
    }

    const savedUser = localStorage.getItem('apacMarketIntelUser');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        if (!parsedUser.role) parsedUser.role = 'subscriber';
        setUser(parsedUser);
      } catch (e) {
        console.error("Failed to parse user profile", e);
      }
    }
    setRecentPulseSearches(getPulseSearchHistory());
  }, []);

  const handleLogin = async (profile: UserProfile) => {
    setUser(profile);
    localStorage.setItem('apacMarketIntelUser', JSON.stringify(profile));
    setIsLoginModalOpen(false);

    if (profile.role === 'admin') {
      setLoginToast("Welcome back, Administrator.");
    } else {
      subscribeToMailchimp(profile.email)
        .then(response => {
          if(response.result === 'error') console.warn('Mailchimp warning:', response.msg);
        })
        .catch(err => console.error('Mailchimp error:', err));

      try {
        await saveSubscriberToSupabase(profile);
        setLoginToast("Success! You are subscribed.");
      } catch (err) {
        console.error(err);
        setLoginToast("Subscribed locally! (Database sync failed)");
      }
    }
    setTimeout(() => setLoginToast(null), 5000);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('apacMarketIntelUser');
    setIsAdminPanelOpen(false);
  };

  const handleUnsubscribe = async () => {
    if (window.confirm("Are you sure you want to unsubscribe from the weekly digest?")) {
      setUser(null);
      localStorage.removeItem('apacMarketIntelUser');
      setLoginToast("You have been unsubscribed.");
      setTimeout(() => setLoginToast(null), 3000);
    }
  };

  const loadDailyNews = useCallback(async () => {
    setNewsLoading(true);
    try {
      const news = await fetchDailyNews(newsRegion);
      setNewsItems(news);
    } catch (e) {
      console.error("Failed to load news", e);
    } finally {
      setNewsLoading(false);
    }
  }, [newsRegion]);

  const loadOOHCampaigns = useCallback(async () => {
    setOohLoading(true);
    try {
      const campaigns = await fetchOOHCampaigns(oohRegion);
      setOohItems(campaigns);
    } catch (e) {
      console.error("Failed to load OOH campaigns", e);
    } finally {
      setOohLoading(false);
    }
  }, [oohRegion]);

  useEffect(() => {
    loadDailyNews();
  }, [loadDailyNews]);

  useEffect(() => {
    loadOOHCampaigns();
  }, [loadOOHCampaigns]);

  const executeScan = async (client: string, country: string, media: string) => {
    setStatus(ScanStatus.SCANNING);
    setError(null);
    setData([]);
    
    logPulseSearchToSupabase(client, country, media); // No email passed
    
    // Save to local history if it's not a generic "empty" scan
    if (client || (country && country !== detectUserCountry()) || media !== 'All Media') {
        const updated = addPulseSearchHistory({
            clientQuery: client,
            countryQuery: country,
            mediaQuery: media,
            timestamp: Date.now()
        });
        setRecentPulseSearches(updated);
    }

    try {
      const results = await scanMarketIntelligence(client, country, media);
      setData(results);
      setLastScanTime(new Date().toLocaleString());
      setStatus(ScanStatus.COMPLETED);
    } catch (err) {
      console.error(err);
      setError("Failed to retrieve market intelligence. Please check your connection and API key.");
      setStatus(ScanStatus.ERROR);
    }
  };

  const handleScan = useCallback(() => {
    executeScan(searchQuery, countryQuery, mediaQuery);
  }, [searchQuery, countryQuery, mediaQuery, user]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && status !== ScanStatus.SCANNING) {
      handleScan();
    }
  };

  const handleHistoryClick = (item: PulseSearchHistoryItem) => {
      setSearchQuery(item.clientQuery);
      setCountryQuery(item.countryQuery);
      setMediaQuery(item.mediaQuery);
      executeScan(item.clientQuery, item.countryQuery, item.mediaQuery);
  };

  // If Admin param is present, render Admin Dashboard exclusively
  if (isAdminPanelOpen) {
    return <AdminDashboard isOpen={true} onClose={() => {
        setIsAdminPanelOpen(false);
        // Clear query param without refreshing
        window.history.replaceState({}, document.title, window.location.pathname);
    }} />;
  }

  return (
    <div className="min-h-screen text-slate-800 flex flex-col font-sans">
      <Header 
        user={user} 
        onLoginClick={() => setIsLoginModalOpen(true)} 
        onLogoutClick={handleLogout} 
        onUnsubscribeClick={handleUnsubscribe}
        onSubscribersClick={() => window.open(window.location.pathname + '?admin=true', '_blank')} 
      />

      {loginToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900/90 backdrop-blur text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center transition-all animate-bounce border border-slate-700">
          <svg className="w-6 h-6 mr-3 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="font-medium">{loginToast}</span>
        </div>
      )}

      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
        onLogin={handleLogin} 
      />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
        
        {/* Business Intelligence Search */}
        <section id="business-search">
           <MasterSearchSection />
        </section>

        {/* Daily News */}
        <section id="daily-briefing" className="scroll-mt-32">
          <DailyBriefing 
            news={newsItems} 
            isLoading={newsLoading} 
            onRefresh={loadDailyNews}
            selectedRegion={newsRegion}
            onRegionChange={setNewsRegion}
          />
        </section>

        {/* Weekly Pulse Scanner */}
        <div id="market-scanner" className="scroll-mt-32 glass-panel rounded-3xl p-8 shadow-xl">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-8 border-b border-slate-100 pb-8">
             <div>
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Weekly Pulse Scanner</h2>
                <p className="text-slate-500 mt-2 text-lg">
                  Intelligence gathering from premier global sources.
                </p>
             </div>
             {lastScanTime && (
                <div className="bg-slate-50 px-4 py-2 rounded-lg border border-slate-100 text-sm">
                   <span className="text-slate-400 uppercase font-bold text-xs tracking-wider">Last Scan:</span> <span className="text-slate-700 font-semibold">{lastScanTime}</span>
                </div>
             )}
          </div>
          
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </div>
                <input
                  type="text"
                  className="block w-full pl-11 pr-4 py-4 border border-slate-200 rounded-xl bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium text-slate-700 placeholder-slate-400"
                  placeholder="Client or Agency..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyPress}
                />
              </div>

              <div className="w-full lg:w-64 relative">
                 <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                 </div>
                 <input
                    type="text"
                    className="block w-full pl-11 pr-4 py-4 border border-slate-200 rounded-xl bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium text-slate-700 placeholder-slate-400"
                    placeholder="Country..."
                    value={countryQuery}
                    onChange={(e) => setCountryQuery(e.target.value)}
                    onKeyDown={handleKeyPress}
                  />
              </div>

              <div className="w-full lg:w-56 relative">
                 <select
                    className="block w-full pl-4 pr-10 py-4 border border-slate-200 rounded-xl bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium text-slate-700 appearance-none cursor-pointer"
                    value={mediaQuery}
                    onChange={(e) => setMediaQuery(e.target.value)}
                  >
                    {MEDIA_TYPES.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-500">
                    <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                  </div>
              </div>

              <button
                onClick={handleScan}
                disabled={status === ScanStatus.SCANNING}
                className="w-full lg:w-auto whitespace-nowrap px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {status === ScanStatus.SCANNING ? (
                  <>
                    <svg className="animate-spin -ml-1 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Scanning...
                  </>
                ) : 'Run Weekly Scan'}
              </button>
          </div>

          {recentPulseSearches.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8 items-center">
               <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mr-2 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  Recent:
               </span>
               {recentPulseSearches.map((item, idx) => (
                 <button
                   key={idx}
                   onClick={() => handleHistoryClick(item)}
                   disabled={status === ScanStatus.SCANNING}
                   className="px-2.5 py-1 rounded bg-slate-50 border border-slate-200 text-[10px] font-medium text-slate-500 hover:text-blue-600 hover:border-blue-200 hover:bg-white transition-colors shadow-sm"
                 >
                   {item.clientQuery || 'All Clients'} • {item.countryQuery || 'APAC'} • {item.mediaQuery}
                 </button>
               ))}
            </div>
          )}

          {error && (
            <div className="bg-rose-50 border border-rose-100 text-rose-600 px-4 py-3 rounded-xl flex items-center mb-6 font-medium">
               <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
               {error}
            </div>
          )}

          <section>
             <IntelligenceTable data={data} isLoading={status === ScanStatus.SCANNING} />
          </section>
        </div>

        {/* Leadership Scanner */}
        <section id="leadership-scanner" className="scroll-mt-32">
          <LeadershipScanner />
        </section>

        {/* OOH */}
        <section id="ooh-updates" className="scroll-mt-32">
           <OOHCampaigns
             campaigns={oohItems}
             isLoading={oohLoading}
             onRefresh={loadOOHCampaigns}
             selectedRegion={oohRegion}
             onRegionChange={setOohRegion}
           />
        </section>

        {/* Sources */}
        <section id="sources" className="scroll-mt-32">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-800">Monitored Sources</h3>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-200 text-slate-600">
              {SOURCES.length} Active
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {SOURCES.map((source) => (
              <SourceCard key={source.name} source={source} />
            ))}
          </div>
        </section>

      </main>
      
      <footer className="glass-panel border-t border-white/50 py-10 mt-auto backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
          <p className="font-semibold text-slate-600 mb-2">&copy; {new Date().getFullYear()} Rocket Insights. All rights reserved.</p>
          <div className="flex justify-center gap-4 mt-4">
             <span>Powered by Google Gemini Search Grounding</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
export default App;
