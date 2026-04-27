import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { 
  LogOut, 
  Moon, 
  Sun, 
  HelpCircle,
  ChevronLeft,
  Menu
} from 'lucide-react';
import ConfirmDialog from '../../components/ui/ConfirmDialog';

/**
 * Sidebar Component for Student Portal
 * extracted from StudentLayout for better maintainability.
 */
export default function Sidebar({ 
  isSidebarOpen, 
  toggleSidebar, 
  navItems, 
  handleLogout, 
  isDark, 
  toggleDarkMode,
  userData 
}) {
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  // Avatar logic: Default to boy-1 if not specified
  const avatarSrc = `/avatar/avatar-${userData?.avatarId || 'boy-1'}.svg`;

  return (
    <>
      <aside className={`
        hidden md:flex fixed left-0 top-0 h-full bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex-col z-40 transition-all duration-300 ease-in-out
        ${isSidebarOpen ? 'w-64' : 'w-20'}
      `}>
        {/* Brand Logo */}
        <div className="p-6 flex items-center justify-between">
          {isSidebarOpen ? (
            <Link to="/" className="flex items-center gap-3 overflow-hidden animate-in fade-in slide-in-from-left-2 duration-300">
              <div className="w-10 h-10 flex items-center justify-center shrink-0">
                <img src="/logo-sd-1.svg" alt="Logo" className="w-10 h-10 object-contain shadow-lg rounded-xl" />
              </div>
              <span className="font-black text-xl tracking-tight text-slate-800 dark:text-white whitespace-nowrap">PORTAL TKA</span>
            </Link>
          ) : (
            <div className="w-10 h-10 flex items-center justify-center mx-auto shrink-0 animate-in zoom-in duration-300">
              <img src="/logo-sd-1.svg" alt="Logo" className="w-10 h-10 object-contain shadow-lg rounded-xl" />
            </div>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 space-y-1 mt-4">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              end={item.end}
              title={!isSidebarOpen ? item.label : ''}
              className={({ isActive }) => `
                flex items-center rounded-xl font-bold text-sm transition-all relative group
                ${isSidebarOpen ? 'px-4 py-3 gap-3' : 'p-3 justify-center mb-2'}
                ${isActive
                  ? 'bg-teal-50 text-teal-600 dark:bg-teal-900/40 dark:text-teal-400'
                  : 'text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-700/50'
                }
              `}
            >
              <item.icon size={20} className="shrink-0" />
              {isSidebarOpen && (
                <span className="whitespace-nowrap animate-in fade-in slide-in-from-left-1 duration-300">{item.label}</span>
              )}
              {!isSidebarOpen && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-slate-900 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                  {item.label}
                </div>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-700 space-y-2">
          <Link
            to="/help"
            title={!isSidebarOpen ? 'Bantuan' : ''}
            className={`
              flex items-center rounded-xl font-bold text-sm transition-all w-full
              ${isSidebarOpen ? 'px-4 py-3 gap-3' : 'p-3 justify-center'}
              text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50
            `}
          >
            <HelpCircle size={20} />
            {isSidebarOpen && <span className="whitespace-nowrap animate-in fade-in duration-300">Bantuan</span>}
          </Link>

          <button
            onClick={toggleDarkMode}
            title={!isSidebarOpen ? 'Toggle Dark Mode' : ''}
            className={`
              flex items-center rounded-xl font-bold text-sm transition-all w-full
              ${isSidebarOpen ? 'px-4 py-3 gap-3' : 'p-3 justify-center'}
              text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50
            `}
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
            {isSidebarOpen && <span className="whitespace-nowrap animate-in fade-in duration-300">{isDark ? 'Mode Terang' : 'Mode Gelap'}</span>}
          </button>

          <button
            onClick={() => setIsLogoutConfirmOpen(true)}
            title={!isSidebarOpen ? 'Keluar' : ''}
            className={`
              flex items-center rounded-xl font-bold text-sm transition-all w-full
              ${isSidebarOpen ? 'px-4 py-3 gap-3' : 'p-3 justify-center'}
              text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20
            `}
          >
            <LogOut size={20} className="flex-shrink-0" />
            {isSidebarOpen && <span className="whitespace-nowrap animate-in fade-in duration-300">Keluar</span>}
          </button>
        </div>
      </aside>

      <ConfirmDialog 
        isOpen={isLogoutConfirmOpen}
        title="Konfirmasi Keluar"
        message="Apakah Anda yakin ingin keluar dari akun ini? Anda harus login kembali untuk mengakses portal."
        confirmLabel="Ya, Keluar"
        cancelLabel="Batal"
        onConfirm={handleLogout}
        onCancel={() => setIsLogoutConfirmOpen(false)}
        variant="warning"
      />
    </>
  );
}
