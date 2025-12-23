
import React, { useState, useEffect } from 'react';
import { NewsItem, SavedEmail, UserProfile } from '../types';
import { getEmailHistory, saveEmailToHistory, deleteEmailFromHistory } from '../services/localStorageService';
import { getGlobalUsers, saveGlobalUser, deleteGlobalUser } from '../services/firebaseService';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  news: NewsItem[];
  currentUser: UserProfile | null;
}

type Tab = 'emailer' | 'history' | 'settings';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ isOpen, onClose, news, currentUser }) => {
  const [activeTab, setActiveTab] = useState<Tab>('emailer');
  const [emailHistory, setEmailHistory] = useState<SavedEmail[]>([]);
  const [viewingEmail, setViewingEmail] = useState<SavedEmail | null>(null);
  const [users, setUsers] = useState<UserProfile[]>([]);
  
  // New User Form State
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<UserProfile['role']>('read_only');
  const [isAdding, setIsAdding] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const isSuperAdmin = currentUser?.role === 'super_admin';

  // Load History and Users
  const syncData = async () => {
    setIsSyncing(true);
    try {
      const globalUsers = await getGlobalUsers();
      setUsers(globalUsers.length > 0 ? globalUsers : []);
      setEmailHistory(getEmailHistory());
    } catch (e) {
      console.error(e);
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    if (isOpen) syncData();
  }, [isOpen]);

  const handleUpdateUserRole = async (email: string, newRole: UserProfile['role']) => {
    if (!isSuperAdmin) return;
    const userToUpdate = users.find(u => u.email === email);
    if (userToUpdate) {
      const updated = { ...userToUpdate, role: newRole };
      await saveGlobalUser(updated);
      await syncData();
    }
  };

  const handleDeleteUser = async (email: string) => {
    if (!isSuperAdmin) return;
    if (email.toLowerCase() === 'nmurthy27@gmail.com') {
      alert("System security protocol: Primary Super Admin cannot be deleted.");
      return;
    }
    if (window.confirm(`Are you sure you want to revoke all access for ${email}?`)) {
      await deleteGlobalUser(email);
      await syncData();
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserEmail || !newUserEmail.includes('@')) return;
    
    setIsSyncing(true);
    await saveGlobalUser({
      email: newUserEmail,
      role: newUserRole,
      isSubscribed: false
    });
    
    setNewUserEmail('');
    setIsAdding(false);
    await syncData();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] overflow-hidden">
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="absolute inset-y-0 right-0 max-w-7xl w-full bg-white shadow-2xl transform transition-transform duration-300 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex justify-between items-center shadow-md shrink-0">
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-3">
               <div className="bg-indigo-500 p-2 rounded-lg">
                 <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
               </div>
               <div>
                  <h2 className="text-xl font-bold text-white">Institutional Control Center</h2>
                  <div className="flex items-center gap-2 mt-0.5">
                     <span className={`text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded bg-indigo-500 text-white`}>
                        {currentUser?.role?.replace('_', ' ')}
                     </span>
                     {isSyncing && <span className="text-[8px] animate-pulse text-indigo-300">Syncing Firestore...</span>}
                  </div>
               </div>
             </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="flex-1 overflow-hidden flex">
            <div className="w-72 bg-slate-50 border-r border-slate-200 flex flex-col p-6 space-y-2 shrink-0">
               <button onClick={() => setActiveTab('emailer')} className={`text-left px-4 py-3 rounded-xl font-bold text-sm ${activeTab === 'emailer' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-600 hover:bg-white'}`}>Digest Builder</button>
               <button onClick={() => setActiveTab('history')} className={`text-left px-4 py-3 rounded-xl font-bold text-sm ${activeTab === 'history' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-600 hover:bg-white'}`}>Archive</button>
               <div className="h-px bg-slate-200 my-6"></div>
               <button onClick={() => setActiveTab('settings')} className={`text-left px-4 py-3 rounded-xl font-bold text-sm ${activeTab === 'settings' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-600 hover:bg-white'}`}>User Management</button>
            </div>

            <div className="flex-1 bg-white overflow-y-auto p-10">
               {activeTab === 'settings' && (
                 <div className="space-y-12 animate-fade-in">
                    <div className="flex items-center justify-between">
                       <h3 className="text-2xl font-black text-slate-900 tracking-tight">Global User Registry</h3>
                       {isSuperAdmin && (
                          <button 
                            onClick={() => setIsAdding(!isAdding)}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest"
                          >
                             {isAdding ? 'Cancel' : 'Register New User'}
                          </button>
                       )}
                    </div>

                    {isAdding && (
                       <form onSubmit={handleAddUser} className="bg-slate-50 p-8 rounded-[2rem] border border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
                          <input 
                             required 
                             className="bg-white border p-3 rounded-xl text-sm font-bold" 
                             placeholder="Email Address" 
                             value={newUserEmail} 
                             onChange={e => setNewUserEmail(e.target.value)} 
                          />
                          <select className="bg-white border p-3 rounded-xl text-sm font-bold" value={newUserRole} onChange={e => setNewUserRole(e.target.value as any)}>
                             <option value="read_only">Read Only</option>
                             <option value="admin">Admin</option>
                             <option value="super_admin">Super Admin</option>
                          </select>
                          <button className="bg-slate-900 text-white rounded-xl font-black uppercase tracking-widest text-xs">Verify & Save</button>
                       </form>
                    )}

                    <div className="overflow-hidden border border-slate-200 rounded-3xl shadow-sm bg-white">
                       <table className="min-w-full divide-y divide-slate-200">
                          <thead className="bg-slate-50">
                             <tr>
                                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase">Member Identity</th>
                                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase">Authorization</th>
                                {isSuperAdmin && <th className="px-6 py-4 text-right text-[10px] font-black text-slate-500 uppercase">Protocol Actions</th>}
                             </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                             {users.map(u => (
                                <tr key={u.email} className="hover:bg-slate-50 group transition-colors">
                                   <td className="px-6 py-5 whitespace-nowrap font-bold text-slate-900">{u.email}</td>
                                   <td className="px-6 py-5 whitespace-nowrap">
                                      <span className="text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded bg-indigo-50 text-indigo-600 border border-indigo-100">
                                         {u.role.replace('_', ' ')}
                                      </span>
                                   </td>
                                   {isSuperAdmin && (
                                      <td className="px-6 py-5 whitespace-nowrap text-right flex justify-end gap-3">
                                         <select 
                                           className="bg-slate-100 border text-[10px] font-black px-2 py-1 rounded-lg"
                                           value={u.role}
                                           onChange={e => handleUpdateUserRole(u.email, e.target.value as any)}
                                         >
                                            <option value="read_only">Read Only</option>
                                            <option value="admin">Admin</option>
                                            <option value="super_admin">Super Admin</option>
                                         </select>
                                         <button onClick={() => handleDeleteUser(u.email)} className="text-slate-300 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-all">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                         </button>
                                      </td>
                                   )}
                                </tr>
                             ))}
                          </tbody>
                       </table>
                    </div>
                 </div>
               )}
            </div>
        </div>
      </div>
    </div>
  );
};
