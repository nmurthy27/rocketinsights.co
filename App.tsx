
import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { SourceCard } from './components/SourceCard';
import { IntelligenceTable } from './components/IntelligenceTable';
import { DailyBriefing } from './components/DailyBriefing';
import { OOHCampaigns } from './components/OOHCampaigns';
import { LeadershipScanner } from './components/LeadershipScanner';
import { LoginModal } from './components/LoginModal';
import { SubscribersListModal } from './components/SubscribersListModal';
import { MasterSearchSection } from './components/MasterSearchSection';
import { SOURCES, MEDIA_TYPES, NEWS_REGIONS } from './constants';
import { AgencyWin, NewsItem, ScanStatus, UserProfile } from './types';
import { scanMarketIntelligence, fetchDailyNews, fetchOOHCampaigns } from './services/geminiService';
import { subscribeUser, unsubscribeUser, isSupabaseConfigured } from './services/supabaseClient';
import { subscribeToMailchimp } from './services/mailchimpService';

// Helper to map timezone to our supported regions
const detectUserRegion = (): string => {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (!tz) return 'APAC'; // Default fallback

    if (tz.includes('Australia') || tz.includes('Pacific/Auckland')) return 'ANZ';
    if (tz.includes('Asia/Shanghai') || tz.includes('Asia/Chongqing') || tz.includes('Asia/Urumqi')) return 'China';
    if (tz.includes('Asia/Dubai') || tz.includes('Asia/Riyadh') || tz.includes('Asia/Baghdad') || tz.includes('Asia/Kuwait')) return 'Middle East';
    if (tz.includes('Europe') || tz.includes('London') || tz.includes('Paris') || tz.includes('Berlin')) return 'Europe';
    if (tz.includes('America') || tz.includes('US') || tz.includes('Canada') || tz.includes('Sao_Paulo')) return 'Americas';
    if (tz.includes('Africa')) return 'Africa';
    if (tz.includes('Asia')) return 'APAC'; // General Asia catch-all
    
    return 'Global';
  } catch (e) {
    return 'APAC';
  }
};

// Helper to extract a potential default country from timezone city
const detectUserCountry = (): string => {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz && tz.includes('/')) {
        const city = tz.split('/')[1].replace(/_/g, ' ');
        // Basic mapping for major hubs
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
  // Initialize state with detected defaults
  const [status, setStatus] = useState<ScanStatus>(ScanStatus.IDLE);
  const [data, setData] = useState<AgencyWin[]>([]);
  const [lastScanTime, setLastScanTime] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [countryQuery, setCountryQuery] = useState<string>(detectUserCountry());
  const [mediaQuery, setMediaQuery] = useState<string>('All Media');

  // News State - Defaulting to detected region
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [newsLoading, setNewsLoading] = useState<boolean>(true);
  const [newsRegion, setNewsRegion] = useState<string>(detectUserRegion());

  // OOH Campaign State - Defaulting to detected region
  const [oohItems, setOohItems] = useState<NewsItem[]>([]);
  const [oohLoading, setOohLoading] = useState<boolean>(true);
  const [oohRegion, setOohRegion] = useState<string>(detectUserRegion());

  // User Management State
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [isSubscribersModalOpen, setIsSubscribersModalOpen] = useState<boolean>(false);
  const [loginToast, setLoginToast] = useState<string | null>(null);

  // Load user from local storage on init
  useEffect(() => {
    const savedUser = localStorage.getItem('apacMarketIntelUser');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Failed to parse user profile", e);
      }
    }
  }, []);

  const handleLogin = async (profile: UserProfile) => {
    // Optimistically log in locally first
    setUser(profile);
    localStorage.setItem('apacMarketIntelUser', JSON.stringify(profile));
    setIsLoginModalOpen(false);

    let toastMessage = "Welcome! Subscribed locally.";

    // 1. Attempt Mailchimp Sync (Fire and forget style)
    try {
      // We don't await this to block UI, but we trigger it
      subscribeToMailchimp(profile.email).then(msg => {
        console.log("Mailchimp Sync:", msg);
      });
    } catch (mcError) {
      console.warn("Mailchimp failed", mcError);
    }

    // 2. Attempt Supabase Sync
    if (isSupabaseConfigured()) {
        try {
            await subscribeUser(profile);
            toastMessage = `Success! Your weekly digest will be sent to ${profile.email}.`;
        } catch (err: any) {
            console.error("Subscription process error:", err);
            
            // Check for Schema/Table missing error (PGRST205)
            const isTableMissing = 
                err.code === 'PGRST205' || 
                (err.message && err.message.includes('subscribers') && err.message.includes('cache'));

            // Check for Auth/Email errors (often 500s or specific messages about invite)
            const isEmailError = err.message && (
                err.message.includes('invite') || 
                err.message.includes('email') || 
                err.status === 500
            );

            if (isTableMissing) {
                alert("Database Setup Required: The 'subscribers' table does not exist. Please check the 'Admin: Subscribers' view for setup instructions.");
            } else if (isEmailError) {
                // If this is an email error, we still allow the local login but warn the admin/user
                toastMessage = "Subscribed to App. (Check Mailchimp/Supabase settings)";
                console.warn("Server-side email error detected. Check Supabase SMTP/Resend settings.");
            } else if (err.message !== 'MISSING_CREDENTIALS') {
                alert("Note: Could not sync subscription to server. " + (err.message || "Unknown error"));
            }
        }
    } else {
        toastMessage = `Subscribed locally. (Configure Supabase/Mailchimp for cloud sync)`;
    }

    setLoginToast(toastMessage);
    // Auto-hide toast after 5 seconds
    setTimeout(() => setLoginToast(null), 5000);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('apacMarketIntelUser');
  };

  const handleUnsubscribe = async () => {
    if (window.confirm("Are you sure you want to unsubscribe from the weekly digest?")) {
      try {
        if (user?.email && isSupabaseConfigured()) {
            await unsubscribeUser(user.email);
        }
        // Note: Mailchimp unsubscribe usually requires user to click link in email
        // We can't easily unsubscribe them via JSONP without API Key
        
        setUser(null);
        localStorage.removeItem('apacMarketIntelUser');
        setLoginToast("You have been unsubscribed from the app.");
        setTimeout(() => setLoginToast(null), 3000);
      } catch (err) {
        console.error("Error unsubscribing:", err);
        alert("There was an issue processing your unsubscribe request.");
      }
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

  // Initial Data Fetches
  useEffect(() => {
    loadDailyNews();
  }, [loadDailyNews]);

  useEffect(() => {
    loadOOHCampaigns();
  }, [loadOOHCampaigns]);

  const handleScan = useCallback(async () => {
    setStatus(ScanStatus.SCANNING);
    setError(null);
    setData([]); // Clear previous data
    try {
      const results = await scanMarketIntelligence(searchQuery, countryQuery, mediaQuery);
      setData(results);
      setLastScanTime(new Date().toLocaleString());
      setStatus(ScanStatus.COMPLETED);
    } catch (err) {
      console.error(err);
      setError("Failed to retrieve market intelligence. Please check your connection and API key.");
      setStatus(ScanStatus.ERROR);
    }
  }, [searchQuery, countryQuery, mediaQuery]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && status !== ScanStatus.SCANNING) {
      handleScan();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header 
        user={user} 
        onLoginClick={() => setIsLoginModalOpen(true)} 
        onLogoutClick={handleLogout} 
        onUnsubscribeClick={handleUnsubscribe}
        onSubscribersClick={() => setIsSubscribersModalOpen(true)}
      />

      {/* Login/Subscription Toast */}
      {loginToast && (
        <div className="fixed bottom-4 right-4 z-50 bg-slate-800 text-white px-6 py-3 rounded-lg shadow-lg flex items-center transition-all duration-500 ease-in-out animate-bounce">
          <svg className="w-6 h-6 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {loginToast}
        </div>
      )}

      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
        onLogin={handleLogin} 
      />

      <SubscribersListModal
        isOpen={isSubscribersModalOpen}
        onClose={() => setIsSubscribersModalOpen(false)}
      />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        
        {/* NEW Master Search Section */}
        <section id="master-search">
           <MasterSearchSection />
        </section>

        {/* Daily News Section */}
        <section id="daily-briefing" className="scroll-mt-24">
          <DailyBriefing 
            news={newsItems} 
            isLoading={newsLoading} 
            onRefresh={loadDailyNews}
            selectedRegion={newsRegion}
            onRegionChange={setNewsRegion}
          />
        </section>

        {/* Weekly Pulse Scanner (Existing) */}
        <div id="market-scanner" className="scroll-mt-24 bg-white rounded-xl p-6 shadow-sm border border-slate-200 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
          <div className="max-w-md">
            <h2 className="text-2xl font-bold text-slate-900">Weekly Pulse Scanner</h2>
            <p className="text-slate-500 mt-1">
              Structured table of agency appointments and reviews.
            </p>
          </div>
          
          <div className="flex-1 w-full flex flex-col md:flex-row items-center gap-4 justify-end">
             
             {/* Search Inputs Container */}
             <div className="flex flex-col sm:flex-row gap-3 w-full lg:max-w-4xl">
                {/* Client/Agency Input */}
                <div className="relative flex-grow min-w-[200px]">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-lg leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm transition duration-150 ease-in-out"
                    placeholder="Client or Agency..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyPress}
                  />
                </div>

                {/* Country Input */}
                <div className="relative w-full sm:w-40 lg:w-52">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-lg leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm transition duration-150 ease-in-out"
                    placeholder="Country..."
                    value={countryQuery}
                    onChange={(e) => setCountryQuery(e.target.value)}
                    onKeyDown={handleKeyPress}
                  />
                </div>

                 {/* Media Type Dropdown */}
                 <div className="relative w-full sm:w-44 lg:w-48">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                       <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                       </svg>
                    </div>
                    <select
                      className="block w-full pl-10 pr-8 py-3 border border-slate-200 rounded-lg leading-5 bg-slate-50 text-slate-600 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm appearance-none transition duration-150 ease-in-out cursor-pointer"
                      value={mediaQuery}
                      onChange={(e) => setMediaQuery(e.target.value)}
                    >
                      {MEDIA_TYPES.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-600">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                    </div>
                 </div>

             </div>

            <div className="flex items-center gap-4 w-full md:w-auto">
              {lastScanTime && (
                <div className="text-right hidden 2xl:block whitespace-nowrap">
                  <div className="text-xs text-slate-400 font-medium uppercase tracking-wide">Last Scan</div>
                  <div className="text-sm text-slate-700 font-medium">{lastScanTime}</div>
                </div>
              )}
              
              <button
                onClick={handleScan}
                disabled={status === ScanStatus.SCANNING}
                className={`
                  w-full md:w-auto whitespace-nowrap flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold shadow-sm transition-all
                  ${status === ScanStatus.SCANNING 
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                    : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md active:transform active:scale-95'}
                `}
              >
                {status === ScanStatus.SCANNING ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-slate-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Scanning...
                  </>
                ) : (
                  <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Run Weekly Scan
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
             <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
             {error}
          </div>
        )}

        {/* Results Section */}
        <section>
           <IntelligenceTable data={data} isLoading={status === ScanStatus.SCANNING} />
        </section>

        {/* Leadership Scanner Section */}
        <section id="leadership-scanner" className="scroll-mt-24">
          <LeadershipScanner />
        </section>

        {/* OOH Campaign Updates */}
        <section id="ooh-updates" className="scroll-mt-24">
           <OOHCampaigns
             campaigns={oohItems}
             isLoading={oohLoading}
             onRefresh={loadOOHCampaigns}
             selectedRegion={oohRegion}
             onRegionChange={setOohRegion}
           />
        </section>

        {/* Sources Grid */}
        <section id="sources" className="scroll-mt-24">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-800">Monitored Intelligence Sources</h3>
            <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
              {SOURCES.length} Active Streams
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {SOURCES.map((source) => (
              <SourceCard key={source.name} source={source} />
            ))}
          </div>
        </section>

      </main>
      
      <footer className="bg-white border-t border-slate-200 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-400 text-sm">
          <p>&copy; {new Date().getFullYear()} Rocket Insights. All rights reserved.</p>
          <p className="mt-2">Data provided by Google Gemini Search Grounding.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
