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
  ChevronLeft,
  UserCircle,
  HelpCircle
} from 'lucide-react';
import { useDarkMode } from '../../hooks/useDarkMode';
import NetworkIndicator from '../../components/NetworkIndicator';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';
import FloatingGuide from '../components/FloatingGuide';
import Sidebar from '../components/Sidebar';
import ProfileHeader from '../components/ProfileHeader';

const userData = {
  name: 'Budi Kialang',
  gender: 'Laki-laki',
  avatarId: 'boy-2' // Example avatar
};

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
    <div className="h-screen flex flex-col md:flex-row bg-slate-50 dark:bg-slate-900 transition-colors duration-300 overflow-hidden">

      {/* ============================================================
          1. DESKTOP SIDEBAR (Visible md+)
          Fixed left column, full height, collapsible width
          ============================================================ */}
      <Sidebar 
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        navItems={navItems}
        handleLogout={handleLogout}
        isDark={isDark}
        toggleDarkMode={toggleDarkMode}
        userData={userData}
      />

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
        flex-1 flex flex-col min-w-0 transition-all duration-300
        ${isSidebarOpen ? 'md:ml-64' : 'md:ml-20'}
      `}>

        <ProfileHeader 
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
          isOnline={isOnline}
          userData={userData}
        />

        {/* PDOTLE WRAPPER - SCROLLABLE AREA */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-5 md:px-6 lg:px-8 pt-6 md:pt-8 pb-32 md:pb-8">
          <div className="max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
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
                ${isActive ? 'text-teal-600 dark:text-teal-400' : 'text-slate-400 dark:text-slate-500'}
              `}
            >
              {({ isActive }) => (
                <>
                  <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                  <span className="text-[10px] font-black uppercase tracking-widest text-center">{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </footer>

      <FloatingGuide />
    </div>
  );
}
