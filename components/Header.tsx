
import React from 'react';
import { UserProfile } from '../types';

interface HeaderProps {
  user: UserProfile | null;
  onLoginClick: () => void;
  onLogoutClick: () => void;
  onUnsubscribeClick: () => void;
  onSubscribersClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onLoginClick, onLogoutClick, onUnsubscribeClick, onSubscribersClick }) => {
  const isAdmin = user?.role === 'admin';

  return (
    <header className="glass-header sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center space-x-3 group cursor-pointer">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-200">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758" />
            </svg>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
              Rocket Insights
            </span>
          </h1>
        </div>

        <div className="flex items-center space-x-4 text-sm">
           {isAdmin && (
             <button 
               onClick={onSubscribersClick}
               className="text-slate-600 hover:text-indigo-600 font-semibold text-xs transition-colors px-3 py-1.5 rounded-lg hover:bg-indigo-50 flex items-center gap-1.5"
             >
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
               Admin Dashboard
             </button>
           )}
           
          {user ? (
            <div className="flex items-center gap-2 bg-white/50 px-2 py-1.5 rounded-full border border-white/60 shadow-sm backdrop-blur-sm">
               <div className="hidden sm:flex flex-col items-end px-2">
                 <div className="flex items-center gap-1">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                      {user.role === 'admin' ? 'Administrator' : 'Subscriber'}
                    </span>
                 </div>
                 <span className="font-bold text-slate-800 text-xs truncate max-w-[120px]">{user.email.split('@')[0]}</span>
               </div>
               
               <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block"></div>

               {user.role !== 'admin' && (
                 <button
                   onClick={onUnsubscribeClick}
                   className="text-xs text-rose-500 hover:text-rose-700 font-bold px-3 py-1.5 rounded-full hover:bg-rose-50 transition-colors"
                 >
                   Unsubscribe
                 </button>
               )}

               <button
                 onClick={onLogoutClick}
                 className="text-slate-500 hover:text-indigo-600 transition-all p-2 bg-white rounded-full shadow-sm hover:shadow-md hover:scale-105"
                 title="Sign Out"
               >
                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                 </svg>
               </button>
            </div>
          ) : (
            <button 
              onClick={onLoginClick}
              className="group relative inline-flex items-center justify-center px-6 py-2.5 overflow-hidden font-bold text-white transition-all duration-300 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full hover:scale-105 focus:outline-none focus:ring focus:ring-indigo-300 shadow-lg shadow-indigo-500/40"
            >
              <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-black"></span>
              <span className="relative flex items-center gap-2">
                Sign In / Subscribe
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
              </span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
