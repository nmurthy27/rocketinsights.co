
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
  // Only show admin features for emails starting with 'admin'
  // using trim to ensure no whitespace issues
  const isAdmin = user?.email?.toLowerCase().trim().startsWith('admin');

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Rocket Insights</h1>
        </div>

        <div className="flex items-center space-x-4 text-sm">
           {isAdmin && (
             <button 
               onClick={onSubscribersClick}
               className="text-slate-500 hover:text-blue-600 text-xs font-medium mr-2"
             >
               Admin: Subscribers
             </button>
           )}
           
          {user ? (
            <div className="flex items-center gap-3">
               <div className="text-right hidden sm:block">
                 <div className="text-xs text-slate-500">Subscribed as</div>
                 <div className="font-medium text-slate-900 truncate max-w-[150px]">{user.email}</div>
               </div>
               
               <div className="h-8 w-px bg-slate-200 mx-1"></div>

               <button
                 onClick={onUnsubscribeClick}
                 className="text-xs text-red-600 hover:text-red-800 font-medium transition-colors px-2"
                 title="Unsubscribe from emails"
               >
                 Unsubscribe
               </button>

               <button
                 onClick={onLogoutClick}
                 className="text-slate-500 hover:text-slate-700 transition-colors p-2 bg-slate-50 rounded-full hover:bg-slate-100"
                 title="Sign Out"
               >
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                 </svg>
               </button>
            </div>
          ) : (
            <button 
              onClick={onLoginClick}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Subscribe to Digest
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
