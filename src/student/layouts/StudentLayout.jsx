import React, { useState } from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import {
  Home,
  PenTool,
  BookOpen,
  Settings,
  Moon,
  Sun,
  LogOut,
  Menu,
  ChevronLeft
} from 'lucide-react';
import { useDarkMode } from '../../hooks/useDarkMode';
import NetworkIndicator from '../../components/NetworkIndicator';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';

/**
 * StudentLayout — The "Bulletproof Shell"
 * 
 * Architecture: Layout-Owns-Padding
 * This layout provides ALL edge-level spacing so child pages
 * only need to manage their internal content spacing (space-y, gap, grid).
 * 
 * Features:
 * 1. Desktop (md+): Fixed left sidebar (w-64) + top utility bar
 * 2. Mobile (<md): Sticky top header + fixed bottom navigation bar
 * 3. Collapsible Sidebar for Desktop: useState(isSidebarOpen)
 */
export default function StudentLayout() {
  const isOnline = useNetworkStatus();
  const { isDark, toggleDarkMode } = useDarkMode();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const navItems = [
    { label: 'Beranda', icon: Home, path: '/', end: true },
    { label: 'Latihan', icon: PenTool, path: '/test' },
    { label: 'Modul Belajar', icon: BookOpen, path: '/modules' },
    { label: 'Pengaturan', icon: Settings, path: '/settings' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">

      {/* ============================================================
          1. DESKTOP SIDEBAR (Visible md+)
          Fixed left column, full height, collapsible width
          ============================================================ */}
      <aside className={`
        hidden md:flex fixed left-0 top-0 h-full bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex-col z-40 transition-all duration-300 ease-in-out
        ${isSidebarOpen ? 'w-64' : 'w-20'}
      `}>
        {/* Brand Logo & Burger Toggle */}
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
                  ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400'
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

        {/* Sidebar Footer: Theme Toggle + Logout */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-700 space-y-2">
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
            onClick={handleLogout}
            title={!isSidebarOpen ? 'Keluar' : ''}
            className={`
              flex items-center rounded-xl font-bold text-sm transition-all w-full
              ${isSidebarOpen ? 'px-4 py-3 gap-3' : 'p-3 justify-center'}
              text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20
            `}
          >
            <LogOut size={20} />
            {isSidebarOpen && <span className="whitespace-nowrap animate-in fade-in duration-300">Keluar</span>}
          </button>
        </div>
      </aside>

      {/* ============================================================
          2. MOBILE TOP HEADER (Visible < md)
          Sticky, glassmorphic, contains logo + status + theme toggle
          ============================================================ */}
      <header className="md:hidden sticky top-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 px-4 py-3 flex items-center justify-between z-40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 flex items-center justify-center">
            <img src="/logo-sd-1.svg" alt="Logo" className="w-8 h-8 object-contain shadow-md rounded-lg" />
          </div>
          <span className="font-bold text-slate-800 dark:text-white text-sm">PORTAL TKA</span>
        </div>
        <div className="flex items-center gap-3">
          <NetworkIndicator isOnline={isOnline} />
          <button
            onClick={toggleDarkMode}
            className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </header>

      {/* ============================================================
          3. MAIN CONTENT AREA
          - Desktop: margin-left changes based on isSidebarOpen
          - Contains desktop top bar + padded Outlet wrapper
          ============================================================ */}
      <main className={`
        ${isSidebarOpen ? 'md:ml-64' : 'md:ml-20'} 
        transition-all duration-300 min-h-screen flex flex-col
      `}>

        {/* Desktop Top Utility Bar (burger + network status + user info) */}
        <div className="hidden md:flex h-16 px-8 items-center justify-between bg-transparent shrink-0">
          {/* Sidebar Toggle Burger */}
          <button
            onClick={toggleSidebar}
            className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center text-slate-500 hover:text-indigo-600 transition-all hover:shadow-md active:scale-90"
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
                <p className="text-sm font-black text-slate-800 dark:text-white whitespace-nowrap">Budi Kialang</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 border-2 border-white dark:border-slate-700 shadow-md" />
            </div>
          </div>
        </div>

        {/* OUTLET WRAPPER */}
        <div className="flex-1 px-4 sm:px-5 md:px-6 lg:px-8 pt-6 md:pt-8 pb-28 md:pb-8">
          <Outlet />
        </div>
      </main>

      {/* ============================================================
          4. MOBILE BOTTOM NAVIGATION BAR (Visible < md)
          Fixed to bottom, ~80px tall. UNCHANGED per requirements.
          ============================================================ */}
      <footer className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border-t border-slate-200 dark:border-slate-700 z-50 px-6 pt-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <nav className="flex items-center justify-around">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              end={item.end}
              className={({ isActive }) => `
                flex flex-col items-center gap-1 py-1.5 px-3 rounded-xl transition-all
                ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'}
              `}
            >
              {({ isActive }) => (
                <>
                  <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                  <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </footer>

    </div>
  );
}
