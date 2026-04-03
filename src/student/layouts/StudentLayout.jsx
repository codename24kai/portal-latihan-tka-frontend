import { Outlet } from 'react-router-dom';
import { BookOpen, Moon, Sun, Hand } from 'lucide-react';
import NetworkIndicator from '../../components/NetworkIndicator';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';
import { useDarkMode } from '../../hooks/useDarkMode';

/**
 * Student layout wrapper.
 * Provides the welcoming top navigation header with greeting, network status, and dark mode toggle.
 */
export default function StudentLayout() {
  const isOnline = useNetworkStatus();
  const { isDark, toggleDarkMode } = useDarkMode();

  // Mock student name
  const studentName = 'Budi';

  return (
    <div className="min-h-screen bg-surface dark:bg-dark text-dark dark:text-white transition-colors duration-300">
      {/* Top Navigation Header */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-dark-surface/90 backdrop-blur-md border-b border-gray-100 dark:border-dark-border transition-colors duration-300">
        <div className="flex items-center justify-between px-4 py-3 max-w-3xl mx-auto">
          {/* Left: Greeting */}
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-sm shadow-glow shrink-0">
              {studentName.charAt(0)}
            </div>
            <div>
              <p className="text-sm text-gray-400 dark:text-gray-400 leading-tight flex items-center gap-1.5">
                Selamat datang <Hand size={14} className="text-warning" />
              </p>
              <h1 className="text-lg font-bold leading-tight">
                Halo, {studentName}!
              </h1>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <NetworkIndicator isOnline={isOnline} />
            
            {/* Dark mode toggle */}
            <button
              onClick={toggleDarkMode}
              className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-dark border border-gray-200 dark:border-dark-border flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors shrink-0"
              title={isDark ? 'Mode Terang' : 'Mode Gelap'}
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <button className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary/20 text-primary flex items-center justify-center hover:bg-primary/10 dark:hover:bg-primary/30 transition-colors shrink-0">
              <BookOpen size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto">
        <Outlet />
      </main>
    </div>
  );
}
