
import React, { useState, useEffect } from 'react';
import { fetchFromSupabase } from '../services/supabaseClient';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

type Tab = 'subscribers' | 'master_logs' | 'pulse_logs' | 'leadership_logs' | 'emailer';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<Tab>('subscribers');
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Email Template State
  const [emailSubject, setEmailSubject] = useState('Rocket Insights: Your Weekly Market Intelligence Digest');
  const [emailIntro, setEmailIntro] = useState('Here is your curated update on the latest agency movements, account wins, and leadership changes across APAC.');
  const [emailTopStory, setEmailTopStory] = useState('WPP Appoints New CEO for Southeast Asia');
  const [emailTopStorySummary, setEmailTopStorySummary] = useState('In a major leadership reshuffle, WPP has announced...');

  useEffect(() => {
    if (isOpen && activeTab !== 'emailer') {
      loadData(activeTab);
    }
  }, [isOpen, activeTab]);

  const loadData = async (collectionName: string) => {
    setLoading(true);
    let targetCollection = '';
    
    switch(collectionName) {
      case 'subscribers': targetCollection = 'subscribers'; break;
      case 'master_logs': targetCollection = 'business_search_logs'; break;
      case 'pulse_logs': targetCollection = 'pulse_scanner_logs'; break;
      case 'leadership_logs': targetCollection = 'leadership_logs'; break;
    }

    if (targetCollection) {
      const results = await fetchFromSupabase(targetCollection);
      setData(results);
    }
    setLoading(false);
  };

  const generateEmailHTML = () => {
    return `
<!DOCTYPE html>
<html>
<head>
<style>
  body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
  .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
  .header { background: linear-gradient(90deg, #4f46e5, #ec4899); padding: 30px 20px; text-align: center; }
  .header h1 { color: white; margin: 0; font-size: 24px; letter-spacing: 1px; }
  .content { padding: 30px 20px; color: #333333; line-height: 1.6; }
  .section-title { font-size: 14px; font-weight: bold; color: #4f46e5; text-transform: uppercase; letter-spacing: 1px; margin-top: 20px; border-bottom: 2px solid #f0f0f0; padding-bottom: 5px; }
  .card { background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 15px; margin-top: 15px; }
  .headline { font-size: 16px; font-weight: bold; color: #111827; margin: 0 0 5px 0; }
  .summary { font-size: 14px; color: #6b7280; margin: 0; }
  .footer { background-color: #1f2937; color: #9ca3af; text-align: center; padding: 20px; font-size: 12px; }
  .btn { display: inline-block; background-color: #4f46e5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold; margin-top: 20px; }
</style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>ROCKET INSIGHTS</h1>
    </div>
    <div class="content">
      <p>Hi there,</p>
      <p>${emailIntro}</p>
      
      <div class="section-title">Top Story of the Week</div>
      <div class="card">
        <h3 class="headline">${emailTopStory}</h3>
        <p class="summary">${emailTopStorySummary}</p>
      </div>

      <div class="section-title">Market Pulse Snapshot</div>
      <div class="card">
         <h3 class="headline">Ogilvy Wins Global Account</h3>
         <p class="summary">WPP's creative network secures duties after competitive pitch.</p>
      </div>
      <div class="card">
         <h3 class="headline">Publicis Groupe Growth</h3>
         <p class="summary">Organic growth beats expectations in Q3 earnings report.</p>
      </div>

      <center>
        <a href="https://rocketinsights.co" class="btn">View Full Report</a>
      </center>
    </div>
    <div class="footer">
      &copy; 2025 Rocket Insights. All rights reserved.<br/>
      You are receiving this because you subscribed to our weekly digest.<br/>
      <a href="#" style="color: #9ca3af;">Unsubscribe</a>
    </div>
  </div>
</body>
</html>
    `;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] overflow-hidden">
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="absolute inset-y-0 right-0 max-w-6xl w-full bg-white shadow-2xl transform transition-transform duration-300 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex justify-between items-center shadow-md shrink-0">
          <div className="flex items-center gap-3">
             <div className="bg-indigo-500 p-2 rounded-lg">
               <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
             </div>
             <h2 className="text-xl font-bold">Admin Panel (Supabase)</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex flex-col">
            <div className="flex flex-1 overflow-hidden">
               {/* Sidebar */}
               <div className="w-64 bg-slate-50 border-r border-slate-200 flex flex-col p-4 space-y-2 shrink-0 overflow-y-auto">
                  <button 
                    onClick={() => setActiveTab('subscribers')}
                    className={`text-left px-4 py-3 rounded-xl font-medium text-sm transition-all ${activeTab === 'subscribers' ? 'bg-white shadow-sm text-indigo-600 ring-1 ring-indigo-200' : 'text-slate-600 hover:bg-white hover:text-slate-900'}`}
                  >
                    Subscribers List
                  </button>
                  <button 
                    onClick={() => setActiveTab('master_logs')}
                    className={`text-left px-4 py-3 rounded-xl font-medium text-sm transition-all ${activeTab === 'master_logs' ? 'bg-white shadow-sm text-indigo-600 ring-1 ring-indigo-200' : 'text-slate-600 hover:bg-white hover:text-slate-900'}`}
                  >
                    Business Intelligence Logs
                  </button>
                  <button 
                    onClick={() => setActiveTab('pulse_logs')}
                    className={`text-left px-4 py-3 rounded-xl font-medium text-sm transition-all ${activeTab === 'pulse_logs' ? 'bg-white shadow-sm text-indigo-600 ring-1 ring-indigo-200' : 'text-slate-600 hover:bg-white hover:text-slate-900'}`}
                  >
                    Pulse Scanner Logs
                  </button>
                  <button 
                    onClick={() => setActiveTab('leadership_logs')}
                    className={`text-left px-4 py-3 rounded-xl font-medium text-sm transition-all ${activeTab === 'leadership_logs' ? 'bg-white shadow-sm text-indigo-600 ring-1 ring-indigo-200' : 'text-slate-600 hover:bg-white hover:text-slate-900'}`}
                  >
                    Leadership Logs
                  </button>
                  <div className="h-px bg-slate-200 my-2"></div>
                  <button 
                    onClick={() => setActiveTab('emailer')}
                    className={`text-left px-4 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'emailer' ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md' : 'text-slate-600 hover:bg-white hover:text-slate-900'}`}
                  >
                    Email Template Editor
                  </button>
               </div>

               {/* Main View */}
               <div className="flex-1 bg-white overflow-y-auto p-8">
                 {loading ? (
                   <div className="flex justify-center items-center h-full">
                     <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                   </div>
                 ) : activeTab === 'emailer' ? (
                   <div className="h-full flex flex-col gap-6">
                      <div className="flex justify-between items-center">
                         <h2 className="text-2xl font-bold text-slate-800">Digest Email Builder</h2>
                         <button 
                           onClick={() => {
                             const blob = new Blob([generateEmailHTML()], {type: 'text/html'});
                             const url = URL.createObjectURL(blob);
                             window.open(url, '_blank');
                           }}
                           className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-bold hover:bg-slate-700"
                         >
                           Preview in Browser
                         </button>
                      </div>
                      
                      <div className="flex flex-col lg:flex-row gap-8 h-full">
                        {/* Editor Inputs */}
                        <div className="w-full lg:w-1/3 space-y-6 overflow-y-auto pr-2">
                           <div className="space-y-2">
                              <label className="text-xs font-bold uppercase text-slate-500">Subject Line</label>
                              <input 
                                className="w-full border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500" 
                                value={emailSubject}
                                onChange={e => setEmailSubject(e.target.value)}
                              />
                           </div>
                           <div className="space-y-2">
                              <label className="text-xs font-bold uppercase text-slate-500">Intro Text</label>
                              <textarea 
                                className="w-full border border-slate-300 rounded-lg p-2 text-sm h-32 focus:ring-2 focus:ring-indigo-500" 
                                value={emailIntro}
                                onChange={e => setEmailIntro(e.target.value)}
                              />
                           </div>
                           <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
                              <h4 className="font-bold text-slate-800 text-sm">Top Story Section</h4>
                              <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-slate-500">Headline</label>
                                <input 
                                  className="w-full border border-slate-300 rounded-lg p-2 text-sm" 
                                  value={emailTopStory}
                                  onChange={e => setEmailTopStory(e.target.value)}
                                />
                              </div>
                              <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-slate-500">Summary</label>
                                <textarea 
                                  className="w-full border border-slate-300 rounded-lg p-2 text-sm h-24" 
                                  value={emailTopStorySummary}
                                  onChange={e => setEmailTopStorySummary(e.target.value)}
                                />
                              </div>
                           </div>
                        </div>

                        {/* Live Preview */}
                        <div className="w-full lg:w-2/3 bg-slate-100 rounded-xl border border-slate-300 overflow-hidden flex flex-col">
                           <div className="bg-slate-200 px-4 py-2 text-xs font-mono text-slate-500 border-b border-slate-300">
                              HTML Preview
                           </div>
                           <div className="flex-1 bg-white overflow-auto p-4">
                              <iframe 
                                srcDoc={generateEmailHTML()} 
                                className="w-full h-full border-0" 
                                title="Email Preview"
                              />
                           </div>
                        </div>
                      </div>
                   </div>
                 ) : (
                   <div className="h-full flex flex-col">
                     <h2 className="text-2xl font-bold text-slate-800 mb-6 capitalize">{activeTab.replace('_', ' ').replace('logs', 'Intelligence Logs')}</h2>
                     <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex-1 flex flex-col">
                        <div className="overflow-x-auto overflow-y-auto flex-1">
                          <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50 sticky top-0">
                              <tr>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Timestamp</th>
                                {activeTab === 'subscribers' && (
                                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">User</th>
                                )}
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Details</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-200">
                              {data.map((row: any, idx: number) => (
                                <tr key={row.id || idx}>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                    {row.created_at ? new Date(row.created_at).toLocaleString() : 'N/A'}
                                  </td>
                                  
                                  {activeTab === 'subscribers' && (
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                                      {row.email || 'Anonymous'}
                                    </td>
                                  )}

                                  <td className="px-6 py-4 text-sm text-slate-500">
                                    {activeTab === 'subscribers' && (
                                      <span>
                                        Status: {row.is_subscribed ? 'Active' : 'Unsubscribed'} • Role: {row.role} • Regions: {row.regions?.join(', ')}
                                      </span>
                                    )}
                                    {activeTab === 'master_logs' && (
                                      <span className="font-mono bg-slate-100 px-2 py-1 rounded">
                                        Query: "{row.query}"
                                      </span>
                                    )}
                                    {activeTab === 'pulse_logs' && (
                                      <span className="font-mono bg-slate-100 px-2 py-1 rounded">
                                        {row.client_query} | {row.country_query} | {row.media_type}
                                      </span>
                                    )}
                                    {activeTab === 'leadership_logs' && (
                                      <span className="font-mono bg-slate-100 px-2 py-1 rounded">
                                        {row.role} @ {row.company} ({row.country})
                                      </span>
                                    )}
                                  </td>
                                </tr>
                              ))}
                              {data.length === 0 && (
                                <tr>
                                  <td colSpan={activeTab === 'subscribers' ? 3 : 2} className="px-6 py-10 text-center text-slate-400">
                                    No records found in this collection.
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                     </div>
                   </div>
                 )}
               </div>
            </div>
        </div>
      </div>
    </div>
  );
};
