import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import GuruSidebar from '../components/GuruSidebar';
import { useDarkMode } from '../../hooks/useDarkMode';
import { Moon, Sun, Menu, Bell, Search } from 'lucide-react';

/**
 * Guru Layout with scoped sidebar and header.
 * Optimized for Orange-Teal theme.
 */
export default function GuruLayout() {
  const { isDark, toggleDarkMode } = useDarkMode();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const userClass = localStorage.getItem('assignedClass') ?? '';

  return (
    <div id="guru-layout" className="flex min-h-[100dvh] w-full bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <GuruSidebar
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      <div className={`flex-1 flex flex-col min-w-0 min-h-[100dvh] transition-all duration-300 ${collapsed ? 'lg:ml-[72px]' : 'lg:ml-[260px]'}`}>
        {/* Top Header */}
        <header className="h-20 shrink-0 sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-100 dark:border-slate-800 flex items-center transition-all">
          <div className="flex items-center justify-between px-4 lg:px-8 w-full">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 -ml-2 rounded-lg text-slate-500 hover:bg-slate-50 transition-colors"
              >
                <Menu size={24} />
              </button>
              <div>
                <p className="text-[10px] uppercase tracking-wider font-bold text-orange-600 leading-none mb-1">
                  Wali Kelas
                </p>
                <h2 className="text-base font-bold text-slate-700 dark:text-white leading-none">
                  Kelas {userClass}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Notifications */}
              <button className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-orange-600 transition-colors relative">
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-800 animate-bounce">
                  3
                </span>
              </button>

              {/* Theme Toggle */}
              <button
                onClick={toggleDarkMode}
                className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-orange-600 transition-colors"
              >
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              {/* Profile Avatar */}
              <div className="w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-orange-600/20">
                GK
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 pb-32 lg:pb-8 w-full overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
