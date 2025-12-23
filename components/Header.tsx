
import React from 'react';
import { UserProfile } from '../types';

interface HeaderProps {
  user: UserProfile | null;
  onLoginClick: () => void;
  onAdminClick: () => void;
  onLogoutClick: () => void;
  onUnsubscribeClick: () => void;
  onSubscribersClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onLoginClick, onAdminClick, onLogoutClick, onUnsubscribeClick, onSubscribersClick }) => {
  const isSuperAdmin = user?.role === 'super_admin';
  const isSubscribed = user?.isSubscribed === true;

  return (
    <header className="clean-header sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center space-x-3 group cursor-pointer" onClick={() => window.location.reload()}>
          <div className="w-9 h-9 bg-slate-900 rounded-lg flex items-center justify-center shadow-sm">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758" />
            </svg>
          </div>
          <h1 className="text-xl font-black tracking-tight text-slate-900">
            Rocket Insights
          </h1>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-6">
          <div className="flex items-center space-x-4">
            {!isSubscribed && (
              <button 
                onClick={onLoginClick}
                className="text-indigo-600 hover:text-indigo-800 font-black text-[10px] uppercase tracking-widest transition-all px-4 py-2 rounded-xl hover:bg-indigo-50"
              >
                Subscribe to Daily Digest
              </button>
            )}
            
            {isSuperAdmin && (
              <button 
                onClick={onSubscribersClick}
                className="bg-indigo-600 text-white font-black text-[10px] uppercase tracking-widest transition-all px-4 py-2 rounded-xl shadow-lg shadow-indigo-100 flex items-center gap-2 hover:bg-indigo-700"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924-1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /></svg>
                Control Center
              </button>
            )}
          </div>
           
          {user && (
            <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200 shadow-sm ml-2">
               <div className="hidden lg:flex flex-col items-end px-2">
                 <span className="font-bold text-slate-800 text-[10px] truncate max-w-[120px] uppercase tracking-tight">{user.email}</span>
               </div>
               
               <div className="h-4 w-px bg-slate-300 mx-1 hidden lg:block"></div>

               <button
                 onClick={onLogoutClick}
                 className="text-slate-400 hover:text-rose-600 transition-all p-1.5 rounded-full hover:bg-white shadow-sm"
                 title="End Session"
               >
                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                 </svg>
               </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
