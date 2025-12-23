
import React, { useState, useCallback, useEffect, Suspense, lazy } from 'react';
import { Header } from './components/Header';
import { IntelligenceTable } from './components/IntelligenceTable';
import { DailyBriefing } from './components/DailyBriefing';
import { LandingPage } from './components/LandingPage';
import { LoginModal } from './components/LoginModal';
import { AgencyWin, NewsItem, ScanStatus, UserProfile } from './types';
import { scanMarketIntelligence, fetchDailyNews, fetchOOHCampaigns } from './services/geminiService';
import { 
  saveGlobalUser, 
  fetchGlobalUserByEmail, 
  saveScanResult, 
  getLatestGlobalScan,
  saveBriefing,
  getBriefingByRegion,
  testConnection
} from './services/firebaseService';

// Speed Optimization: Lazy load heavy components
const MasterSearchSection = lazy(() => import('./components/MasterSearchSection').then(m => ({ default: m.MasterSearchSection })));
const LeadershipScanner = lazy(() => import('./components/LeadershipScanner').then(m => ({ default: m.LeadershipScanner })));
const OOHCampaigns = lazy(() => import('./components/OOHCampaigns').then(m => ({ default: m.OOHCampaigns })));
const AdminDashboard = lazy(() => import('./components/AdminDashboard').then(m => ({ default: m.AdminDashboard })));

const BUILD_ID = "2025.05.21.R1"; // Increment this to verify Cloud Run updates

const detectUserRegion = (): string => {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (!tz) return 'APAC';
    if (tz.includes('Australia')) return 'ANZ';
    if (tz.includes('Asia/Shanghai')) return 'China';
    if (tz.includes('Asia/Dubai')) return 'Middle East';
    if (tz.includes('Europe')) return 'Europe';
    if (tz.includes('America')) return 'Americas';
    return 'APAC';
  } catch (e) {
    return 'APAC';
  }
};

const LoadingPlaceholder = () => (
  <div className="w-full bg-slate-50 rounded-[2.5rem] p-20 flex flex-col items-center justify-center min-h-[400px]">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900 mb-4"></div>
    <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Loading Intelligence...</p>
  </div>
);

const App: React.FC = () => {
  const [view, setView] = useState<'landing' | 'dashboard'>('landing');
  const [status, setStatus] = useState<ScanStatus>(ScanStatus.IDLE);
  const [data, setData] = useState<AgencyWin[]>([]);
  const [lastScanTime, setLastScanTime] = useState<string | null>(null);
  const [globalError, setGlobalError] = useState<string | null>(null);
  
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [countryQuery, setCountryQuery] = useState<string>('');
  const [mediaQuery, setMediaQuery] = useState<string>('All Media');

  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [newsLoading, setNewsLoading] = useState<boolean>(true);
  const [newsRegion, setNewsRegion] = useState<string>(detectUserRegion());

  const [oohItems, setOohItems] = useState<NewsItem[]>([]);
  const [oohLoading, setOohLoading] = useState<boolean>(true);
  const [oohRegion, setOohRegion] = useState<string>(detectUserRegion());

  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState<boolean>(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [loginModalMode, setLoginModalMode] = useState<'subscribe' | 'admin'>('subscribe');
  const [loginToast, setLoginToast] = useState<string | null>(null);

  const isReadOnly = user?.role === 'read_only';

  // Initial Data Sync & Connection Test
  useEffect(() => {
    const initApp = async () => {
      // 1. Connection Handshake
      try {
        await testConnection();
      } catch (e: any) {
        setGlobalError(e.message);
      }

      // 2. Auth Check
      const savedUser = localStorage.getItem('apacMarketIntelUser');
      if (savedUser) {
        try {
          const localProfile = JSON.parse(savedUser) as UserProfile;
          const globalProfile = await fetchGlobalUserByEmail(localProfile.email);
          if (globalProfile) {
            setUser(globalProfile);
            localStorage.setItem('apacMarketIntelUser', JSON.stringify(globalProfile));
          } else {
            setUser(localProfile);
          }
          setView('dashboard');
        } catch (e: any) { 
          if (e.message.includes('Database Access')) setGlobalError(e.message);
        }
      }

      // 3. Load Scans
      try {
        const results = await getLatestGlobalScan();
        if (results.length > 0) {
          setData(results);
          setLastScanTime("Global Persistence: Loaded");
        }
      } catch (e: any) {
         if (e.message.includes('Database Access')) setGlobalError(e.message);
      }
    };
    
    initApp();
  }, []);

  const handleLogin = async (profile: UserProfile) => {
    try {
      if (profile.email.toLowerCase() === 'nmurthy27@gmail.com') {
        profile.role = 'super_admin';
      }
      await saveGlobalUser(profile);
      setUser(profile);
      localStorage.setItem('apacMarketIntelUser', JSON.stringify(profile));
      setIsLoginModalOpen(false);
      setLoginToast(`Identity Verified: ${profile.role.toUpperCase()}`);
      setView('dashboard');
      setTimeout(() => setLoginToast(null), 5000);
    } catch (e: any) {
      setGlobalError(e.message);
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('apacMarketIntelUser');
    setIsAdminPanelOpen(false);
    setView('landing');
  };

  const loadDailyNews = useCallback(async () => {
    setNewsLoading(true);
    try {
      const cached = await getBriefingByRegion(newsRegion);
      if (cached) {
        setNewsItems(cached);
      } else {
        const news = await fetchDailyNews(newsRegion);
        setNewsItems(news);
        await saveBriefing(newsRegion, news);
      }
    } catch (e: any) {
      if (e.message.includes('Database Access')) setGlobalError(e.message);
    } finally {
      setNewsLoading(false);
    }
  }, [newsRegion]);

  const loadOOHCampaigns = useCallback(async () => {
    setOohLoading(true);
    try {
      const campaigns = await fetchOOHCampaigns(oohRegion);
      setOohItems(campaigns);
    } catch (e) { console.error(e); }
    finally { setOohLoading(false); }
  }, [oohRegion]);

  useEffect(() => {
    if (view === 'dashboard') {
      loadDailyNews();
      loadOOHCampaigns();
    }
  }, [view, loadDailyNews, loadOOHCampaigns]);

  const executeScan = async (client: string, country: string, media: string) => {
    if (isReadOnly) return;
    setStatus(ScanStatus.SCANNING);
    
    try {
      const results = await scanMarketIntelligence(client, country, media);
      setData(results);
      setLastScanTime(new Date().toLocaleString());
      setStatus(ScanStatus.COMPLETED);
      await saveScanResult(`${client} ${country} ${media}`, results);
    } catch (err: any) {
      setStatus(ScanStatus.ERROR);
      if (err.message.includes('Database Access')) setGlobalError(err.message);
    }
  };

  const openModal = (mode: 'subscribe' | 'admin') => {
    setLoginModalMode(mode);
    setIsLoginModalOpen(true);
  };

  if (isAdminPanelOpen && user?.role === 'super_admin') {
    return (
      <Suspense fallback={<div className="fixed inset-0 bg-slate-900 flex items-center justify-center text-white font-black uppercase tracking-widest">Waking Control Center...</div>}>
        <AdminDashboard 
          isOpen={true} 
          onClose={() => setIsAdminPanelOpen(false)}
          news={newsItems}
          currentUser={user}
        />
      </Suspense>
    );
  }

  if (view === 'landing') {
    return (
      <>
        <LandingPage onRegisterSuccess={handleLogin} onLoginClick={() => openModal('subscribe')} />
        <LoginModal isOpen={isLoginModalOpen} mode={loginModalMode} onClose={() => setIsLoginModalOpen(false)} onLogin={handleLogin} />
      </>
    );
  }

  return (
    <div className="min-h-screen text-slate-900 flex flex-col font-sans bg-[#f8fafc]">
      <Header 
        user={user} 
        onLoginClick={() => openModal('subscribe')} 
        onAdminClick={() => openModal('admin')}
        onLogoutClick={handleLogout} 
        onUnsubscribeClick={() => {}}
        onSubscribersClick={() => setIsAdminPanelOpen(true)} 
      />

      {globalError && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] bg-rose-600 text-white px-8 py-5 rounded-2xl shadow-2xl flex items-start border border-rose-500 animate-fade-in max-w-lg">
           <svg className="w-6 h-6 mr-4 shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
           <div className="flex flex-col">
              <span className="font-black text-xs uppercase tracking-widest mb-2">Cloud Configuration Required</span>
              <span className="text-sm font-medium leading-relaxed">{globalError}</span>
           </div>
        </div>
      )}

      {loginToast && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] bg-slate-900 text-white px-8 py-5 rounded-[2rem] shadow-2xl flex items-center transition-all animate-fade-in border border-slate-700">
          <svg className="w-5 h-5 mr-3 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="font-black text-xs uppercase tracking-widest">{loginToast}</span>
        </div>
      )}

      <main className="flex-grow max-w-7xl w-full mx-auto px-6 py-12 space-y-20">
        <section id="business-search">
          <Suspense fallback={<LoadingPlaceholder />}>
            <MasterSearchSection currentUser={user} />
          </Suspense>
        </section>
        
        <section id="daily-briefing">
          <DailyBriefing 
            news={newsItems} 
            isLoading={newsLoading} 
            onRefresh={loadDailyNews}
            selectedRegion={newsRegion}
            onRegionChange={setNewsRegion}
            isSubscribed={user?.isSubscribed || false}
            onSubscribeClick={() => openModal('subscribe')}
          />
        </section>

        <div id="market-scanner" className="clean-panel rounded-[2.5rem] p-10 bg-white">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-12">
             <div className="flex items-center gap-5">
                <div className="w-16 h-16 bg-slate-900 rounded-[1.5rem] flex items-center justify-center text-white">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 00(2 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
                </div>
                <div>
                   <h2 className="text-3xl font-black text-slate-900 tracking-tight">Weekly Pulse Scanner</h2>
                   <div className="flex items-center gap-2 mt-1">
                      <span className="text-emerald-500 font-black text-[10px] uppercase tracking-widest">Global Database Active (rocketinsights-6786c)</span>
                   </div>
                </div>
             </div>
             {lastScanTime && (
                <div className="bg-slate-50 px-5 py-3 rounded-2xl border border-slate-100 text-xs flex items-center gap-3">
                   <span className="text-slate-400 uppercase font-black tracking-widest">Registry Status:</span> 
                   <span className="text-slate-900 font-black">{lastScanTime}</span>
                </div>
             )}
          </div>
          
          <div className="flex flex-col lg:flex-row gap-4 mb-10">
              <input
                className="flex-1 px-6 py-4.5 border border-slate-200 rounded-2xl bg-slate-50 focus:bg-white transition-all font-bold outline-none"
                placeholder="Target Client or Agency..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <input
                className="w-full lg:w-72 px-6 py-4.5 border border-slate-200 rounded-2xl bg-slate-50 focus:bg-white transition-all font-bold outline-none"
                placeholder="Country..."
                value={countryQuery}
                onChange={(e) => setCountryQuery(e.target.value)}
              />
              <button
                onClick={() => executeScan(searchQuery, countryQuery, mediaQuery)}
                disabled={status === ScanStatus.SCANNING || isReadOnly}
                className="px-10 py-4.5 bg-indigo-600 text-white font-black text-sm uppercase tracking-widest rounded-2xl hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-3"
              >
                {status === ScanStatus.SCANNING ? 'Scanning...' : isReadOnly ? 'Locked' : 'Execute Pulse'}
              </button>
          </div>

          <IntelligenceTable data={data} isLoading={status === ScanStatus.SCANNING} />
        </div>

        <section id="leadership-scanner">
          <Suspense fallback={<LoadingPlaceholder />}>
            <LeadershipScanner currentUser={user} />
          </Suspense>
        </section>

        <section id="ooh-updates">
          <Suspense fallback={<LoadingPlaceholder />}>
            <OOHCampaigns campaigns={oohItems} isLoading={oohLoading} onRefresh={loadOOHCampaigns} selectedRegion={oohRegion} onRegionChange={setOohRegion} />
          </Suspense>
        </section>
      </main>
      
      <footer className="bg-white border-t border-slate-100 py-16 mt-auto">
        <div className="max-w-7xl mx-auto px-10 flex flex-col items-center">
          <p className="font-black text-slate-900 text-sm tracking-widest uppercase mb-2">&copy; {new Date().getFullYear()} Rocket Insights Intelligence System</p>
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Build ID: {BUILD_ID}</p>
        </div>
      </footer>
    </div>
  );
};
export default App;
