import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { useDarkMode } from '../../hooks/useDarkMode';
import { Moon, Sun, Menu, Search, Bell, CheckCircle, Info, AlertCircle } from 'lucide-react';

import AdminHeader from '../components/dashboard/AdminHeader';

/**
 * Admin layout with sidebar + main content area.
 * Refined with global padding and glassmorphic header.
 */
export default function AdminLayout() {
  const { isDark, toggleDarkMode } = useDarkMode();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const mockNotifs = [
    { id: 1, title: '5 Siswa baru mendaftar', time: '2 Menit Lalu', type: 'info', icon: Info },
    { id: 2, title: 'Tryout Matematika Batch B Selesai', time: '1 Jam Lalu', type: 'success', icon: CheckCircle },
    { id: 3, title: 'Server maintenance dijadwalkan', time: '3 Jam Lalu', type: 'warning', icon: AlertCircle },
  ];

  return (
    <div id="admin-layout" className="flex min-h-[100dvh] w-full bg-indigo-50/40 dark:bg-slate-900 transition-colors duration-300">
      {/* Sidebar - Fixed width/height managed inside Sidebar component */}
      <Sidebar
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      {/* Main Content Shell - Made scrollable for Glassmorphism */}
      <div className={`flex-1 flex flex-col min-w-0 min-h-[100dvh] overflow-y-auto overflow-x-hidden transition-all duration-300 ${collapsed ? 'lg:ml-[72px]' : 'lg:ml-[260px]'}`}>

        {/* Top Header - Enhanced Glassmorphism (h-20, locked z-40) */}
        <header className="h-20 shrink-0 sticky top-0 z-40 bg-white/100 dark:bg-slate-900/80 backdrop-blur-lg border-b border-indigo-100/50 dark:border-slate-800/50 flex items-center transition-all">
          <div className="flex items-center justify-between px-4 lg:px-8 w-full">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 -ml-2 rounded-lg text-slate-500 hover:bg-indigo-50 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
                title="Buka Menu"
              >
                <Menu size={24} />
              </button>
              <div className="hidden sm:block">
                <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500 leading-none mb-1">
                  Administrator
                </p>
                <h2 className="text-base font-bold text-slate-700 dark:text-white leading-none">
                  Administrator System
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Search Bar */}
              <div className="hidden lg:flex items-center relative group">
                <Search className="absolute left-4 text-slate-300 group-focus-within:text-indigo-600 transition-colors" size={18} />
                <input
                  type="text"
                  placeholder="Cari data, siswa, atau modul..."
                  className="pl-12 pr-6 py-2.5 bg-white/50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-full text-xs text-slate-800 dark:text-slate-200 font-bold w-64 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all shadow-sm"
                />
              </div>

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setIsNotifOpen(!isNotifOpen)}
                  className={`relative w-10 h-10 rounded-xl flex items-center justify-center transition-all shadow-sm group border ${isNotifOpen
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-white/50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-indigo-50 dark:border-slate-700 hover:text-indigo-600 dark:hover:text-indigo-400'
                    }`}
                >
                  <Bell size={20} />
                  <span className={`absolute top-2.5 right-2 w-2 h-2 rounded-full border-2 ${isNotifOpen ? 'bg-white border-indigo-600' : 'bg-rose-500 border-white dark:border-slate-800'
                    }`} />
                </button>

                {isNotifOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsNotifOpen(false)} />
                    <div className="absolute right-0 mt-3 w-72 bg-white dark:bg-slate-900 shadow-2xl rounded-[1.5rem] border border-slate-100 dark:border-slate-800 z-50 p-4 animate-in fade-in zoom-in duration-200">
                      <div className="flex items-center justify-between mb-4 px-1">
                        <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-tight">Notifikasi</h3>
                        <span className="text-[10px] font-black text-indigo-600 hover:underline cursor-pointer uppercase">Tandai Dibaca</span>
                      </div>
                      <div className="space-y-2">
                        {mockNotifs.map((notif) => (
                          <div key={notif.id} className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl flex items-start gap-3 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer group">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${notif.type === 'success' ? 'bg-emerald-100 text-emerald-600' :
                              notif.type === 'warning' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'
                              }`}>
                              <notif.icon size={16} />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-700 dark:text-slate-200 leading-tight group-hover:text-indigo-600 transition-colors">{notif.title}</p>
                              <p className="text-[10px] font-medium text-slate-400 mt-1 uppercase tracking-tighter">{notif.time}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <button className="w-full mt-4 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-indigo-600 transition-colors border-t border-slate-50 dark:border-slate-800 pt-3">
                        Lihat Semua Notifikasi
                      </button>
                    </div>
                  </>
                )}
              </div>              {/* Theme Toggle */}
              <button
                onClick={toggleDarkMode}
                className="w-10 h-10 rounded-xl bg-white/50 dark:bg-slate-800 border border-indigo-50 dark:border-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-primary transition-colors"
                title={isDark ? 'Mode Terang' : 'Mode Gelap'}
              >
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              {/* Profile Avatar */}
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-indigo-600/20 shrink-0">
                SA
              </div>
            </div>
          </div>
        </header>

        {/* Content Area - Removed overflow-y-auto so it scrolls within parent shell */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 pb-32 lg:pb-8 w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
