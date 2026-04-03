import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { useDarkMode } from '../../hooks/useDarkMode';
import { Moon, Sun, Menu, Search, User } from 'lucide-react';

/**
 * Admin layout with sidebar + main content area.
 * Fully responsive and supports dark mode.
 */
export default function AdminLayout() {
  const { isDark, toggleDarkMode } = useDarkMode();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div id="admin-layout" className="min-h-screen bg-surface dark:bg-dark flex overflow-x-hidden">
      {/* Sidebar */}
      <Sidebar 
        mobileMenuOpen={mobileMenuOpen} 
        setMobileMenuOpen={setMobileMenuOpen} 
      />

      {/* Main Content */}
      <div className="flex-1 lg:ml-[260px] transition-all duration-300 w-full min-w-0 flex flex-col h-screen overflow-y-auto">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white/80 dark:bg-dark-surface/80 backdrop-blur-md border-b border-gray-100 dark:border-dark-border">
          <div className="flex items-center justify-between px-4 lg:px-8 py-4">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 -ml-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-dark/50 transition-colors"
                title="Buka Menu"
              >
                <Menu size={24} />
              </button>
              <div className="hidden sm:block">
                <p className="text-sm text-gray-400 dark:text-gray-500">Selamat datang kembali,</p>
                <h2 className="text-lg font-bold text-dark dark:text-white flex items-center gap-2">
                  Ibu Guru Sarah
                </h2>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative hidden md:block">
                <input
                  type="text"
                  placeholder="Cari siswa, soal..."
                  className="w-64 h-10 pl-10 pr-4 bg-gray-50 dark:bg-dark/50 border border-gray-200 dark:border-dark-border rounded-xl text-sm text-dark dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
              </div>

              {/* Dark mode toggle */}
              <button
                onClick={toggleDarkMode}
                className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-dark border border-gray-200 dark:border-dark-border flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors"
                title={isDark ? 'Mode Terang' : 'Mode Gelap'}
              >
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              {/* Avatar */}
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-accent-dark flex items-center justify-center text-white font-bold text-sm shadow-glow shrink-0">
                GS
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-8 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
