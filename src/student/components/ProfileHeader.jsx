import React from 'react';
import { ChevronLeft, Menu } from 'lucide-react';
import NetworkIndicator from '../../components/NetworkIndicator';

/**
 * ProfileHeader Component for Student Portal
 * extracted from StudentLayout for better maintainability.
 */
export default function ProfileHeader({ 
  isSidebarOpen, 
  toggleSidebar, 
  isOnline, 
  userData 
}) {
  // Avatar logic: Default to boy-1 if not specified
  const avatarSrc = `/avatar/avatar-${userData?.avatarId || 'boy-1'}.svg`;

  return (
    <div className="hidden md:flex h-16 px-8 items-center justify-between bg-transparent shrink-0">
      {/* Sidebar Toggle Burger */}
      <button
        onClick={toggleSidebar}
        className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center text-slate-500 hover:text-teal-600 transition-all hover:shadow-md active:scale-90"
      >
        {isSidebarOpen ? <ChevronLeft size={20} /> : <Menu size={20} />}
      </button>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm">
          <NetworkIndicator isOnline={isOnline} />
        </div>
        
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Siswa</p>
            <p className="text-sm font-black text-slate-800 dark:text-white whitespace-nowrap">
              {userData?.name || 'Siswa TKA'}
            </p>
          </div>
          
          <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-white dark:border-slate-700 shadow-md bg-white p-0.5">
            <img 
              src={avatarSrc} 
              alt="Profile" 
              className="w-full h-full object-cover rounded-xl"
              onError={(e) => {
                e.target.src = '/avatar/avatar-boy-1.svg';
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
