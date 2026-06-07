import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '@/komponen/admin/SidebarAdmin';
import { useDarkMode } from '@/hooks/useModGelap';
import { Moon, Sun, Menu, Search, Bell, CheckCircle, Info, AlertCircle } from 'lucide-react';
import NotificationDropdown from '@/komponen/ui/DropdownNotifikasi';

import AdminHeader from '@/komponen/admin/dashboard/HeaderAdmin';

/**
 * Admin layout with sidebar + main content area.
 * Refined with global padding and glassmorphic header.
 */
export default function AdminLayout() {
  const { isDark, toggleDarkMode } = useDarkMode();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

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
              <NotificationDropdown />

              {/* Theme Toggle */}
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
