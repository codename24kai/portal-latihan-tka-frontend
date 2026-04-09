# Walkthrough — Architectural Audit & First Surgery

## Summary of Changes

### 🔴 Critical Fix: White Screen of Death Resolved

**Root Cause:** [StudentSetting.jsx](file:///d:/laragon/www/portal-latihan-tka-frontend/src/student/pages/StudentSetting.jsx) imported `IdentificationCard` from `lucide-react`, which **does not exist**. Vite 8's Rolldown bundler treats missing exports as a fatal error, crashing the entire student route module graph and causing ALL student pages to potentially render blank.

**Fix:** Removed the invalid import. `IdCard` (which was already imported on the same line) is the correct Lucide equivalent.

```diff:StudentSetting.jsx
import React from 'react';
import { 
  User, 
  Settings, 
  Camera, 
  Mail, 
  IdentificationCard, // Note: IdentificationCard is not in Lucide regular, usually IDCard or Fingerprint, I'll use IdCard or UserRound
  IdCard,
  Phone,
  LogOut,
  ChevronRight,
  ShieldCheck,
  Bell
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * Student Setting Page
 * Clean and focused profile management view.
 */
export default function StudentSetting() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-8 animate-fade-in text-slate-900 dark:text-white pb-20 md:pb-8">
    
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-black uppercase tracking-tight">
          Pengaturan Akun
        </h1>
        <p className="text-sm font-bold text-slate-400 tracking-widest uppercase">
          Kelola profil dan preferensi aplikasi Anda
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 ">
      
        {/* Left Col: Profile Visual & Basic Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col items-center">
          
            {/* Avatar Section */}
            <div className="relative group mb-6">
              <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-indigo-600 to-purple-600 border-4 border-white dark:border-slate-700 shadow-xl flex items-center justify-center text-white text-4xl font-black overflow-hidden">
                BS
              </div>
              <button className="absolute -bottom-2 -right-2 w-10 h-10 bg-white dark:bg-slate-700 rounded-xl shadow-lg border border-slate-100 dark:border-slate-600 flex items-center justify-center text-slate-500 hover:text-indigo-600 transition-colors">
                <Camera size={20} />
              </button>
            </div>

            <div className="text-center">
              <h3 className="text-xl font-black tracking-tight">Budi Santoso</h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Siswa • Kelas 6-A</p>
            </div>
          </div>

          <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl p-6 border border-emerald-100 dark:border-emerald-900/50">
             <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400 mb-2">
                <ShieldCheck size={20} />
                <span className="text-sm font-black uppercase tracking-widest">Akun Terverifikasi</span>
             </div>
             <p className="text-xs text-emerald-700 dark:text-emerald-300 font-bold opacity-80 leading-relaxed uppercase tracking-tight">
                Data Anda telah disinkronkan dengan Dapodik Sekolah.
             </p>
          </div>
        </div>

        {/* Right Col: Detailed Settings Form */}
        <div className="lg:col-span-2 space-y-6">
        
          {/* Identity Section */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-sm border border-slate-100 dark:border-slate-700 space-y-6">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Informasi Pribadi</h3>
          
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nama Lengkap</label>
                <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold text-sm">
                  <User size={16} /> Budi Santoso
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">NISN</label>
                <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold text-sm">
                  <IdCard size={16} /> 0012345678
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email</label>
                <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-700 text-slate-400 dark:text-slate-500 italic font-bold text-sm">
                  <Mail size={16} /> budi.example@student.id
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">No. WhatsApp</label>
                <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-700 text-slate-400 dark:text-slate-500 italic font-bold text-sm">
                  <Phone size={16} /> +62 812 3456 XXXX
                </div>
              </div>
            </div>
          </div>

          {/* Preferences Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <button className="flex items-center justify-between p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-500 flex items-center justify-center">
                    <Bell size={20} />
                  </div>
                  <span className="font-bold text-sm">Notifikasi</span>
                </div>
                <ChevronRight size={18} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
             </button>

             <button className="flex items-center justify-between p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group text-red-600 dark:text-red-400" onClick={handleLogout}>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-900/30 text-red-500 flex items-center justify-center">
                    <LogOut size={20} />
                  </div>
                  <span className="font-bold text-sm">Keluar Akun</span>
                </div>
                <ChevronRight size={18} className="text-red-200 dark:text-red-800 group-hover:translate-x-1 transition-transform" />
             </button>
          </div>

        </div>
      </div>

    </div>
  );
}
===
import React from 'react';
import { 
  User, 
  Settings, 
  Camera, 
  Mail, 
  IdCard,
  Phone,
  LogOut,
  ChevronRight,
  ShieldCheck,
  Bell
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * Student Setting Page
 * Clean and focused profile management view.
 */
export default function StudentSetting() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-8 animate-fade-in text-slate-900 dark:text-white pb-20 md:pb-8">
    
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-black uppercase tracking-tight">
          Pengaturan Akun
        </h1>
        <p className="text-sm font-bold text-slate-400 tracking-widest uppercase">
          Kelola profil dan preferensi aplikasi Anda
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 ">
      
        {/* Left Col: Profile Visual & Basic Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col items-center">
          
            {/* Avatar Section */}
            <div className="relative group mb-6">
              <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-indigo-600 to-purple-600 border-4 border-white dark:border-slate-700 shadow-xl flex items-center justify-center text-white text-4xl font-black overflow-hidden">
                BS
              </div>
              <button className="absolute -bottom-2 -right-2 w-10 h-10 bg-white dark:bg-slate-700 rounded-xl shadow-lg border border-slate-100 dark:border-slate-600 flex items-center justify-center text-slate-500 hover:text-indigo-600 transition-colors">
                <Camera size={20} />
              </button>
            </div>

            <div className="text-center">
              <h3 className="text-xl font-black tracking-tight">Budi Santoso</h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Siswa • Kelas 6-A</p>
            </div>
          </div>

          <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl p-6 border border-emerald-100 dark:border-emerald-900/50">
             <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400 mb-2">
                <ShieldCheck size={20} />
                <span className="text-sm font-black uppercase tracking-widest">Akun Terverifikasi</span>
             </div>
             <p className="text-xs text-emerald-700 dark:text-emerald-300 font-bold opacity-80 leading-relaxed uppercase tracking-tight">
                Data Anda telah disinkronkan dengan Dapodik Sekolah.
             </p>
          </div>
        </div>

        {/* Right Col: Detailed Settings Form */}
        <div className="lg:col-span-2 space-y-6">
        
          {/* Identity Section */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-sm border border-slate-100 dark:border-slate-700 space-y-6">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Informasi Pribadi</h3>
          
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nama Lengkap</label>
                <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold text-sm">
                  <User size={16} /> Budi Santoso
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">NISN</label>
                <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold text-sm">
                  <IdCard size={16} /> 0012345678
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email</label>
                <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-700 text-slate-400 dark:text-slate-500 italic font-bold text-sm">
                  <Mail size={16} /> budi.example@student.id
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">No. WhatsApp</label>
                <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-700 text-slate-400 dark:text-slate-500 italic font-bold text-sm">
                  <Phone size={16} /> +62 812 3456 XXXX
                </div>
              </div>
            </div>
          </div>

          {/* Preferences Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <button className="flex items-center justify-between p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-500 flex items-center justify-center">
                    <Bell size={20} />
                  </div>
                  <span className="font-bold text-sm">Notifikasi</span>
                </div>
                <ChevronRight size={18} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
             </button>

             <button className="flex items-center justify-between p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group text-red-600 dark:text-red-400" onClick={handleLogout}>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-900/30 text-red-500 flex items-center justify-center">
                    <LogOut size={20} />
                  </div>
                  <span className="font-bold text-sm">Keluar Akun</span>
                </div>
                <ChevronRight size={18} className="text-red-200 dark:text-red-800 group-hover:translate-x-1 transition-transform" />
             </button>
          </div>

        </div>
      </div>

    </div>
  );
}
```

---

### 🟡 Layout Fix: Double Padding Eliminated

**Problem:** `StudentLayout` wrapped `<Outlet />` in a `p-4 md:p-8` container, but every child page (Dashboard, Test, Modules, Settings) ALSO defined its own `p-4 md:p-6 lg:p-8`. This caused double padding (32px + 32px = 64px on desktop).

**Fix:** Removed padding from the layout's Outlet wrapper. Child pages now own their own spacing.

```diff:StudentLayout.jsx
import React from 'react';
import { Outlet, NavLink, Link } from 'react-router-dom';
import { 
  Home, 
  PenTool, 
  BookOpen, 
  Settings, 
  Moon, 
  Sun, 
  Wifi, 
  WifiOff, 
  LogOut 
} from 'lucide-react';
import { useDarkMode } from '../../hooks/useDarkMode';
import NetworkIndicator from '../../components/NetworkIndicator';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';

/**
 * StudentLayout Redesign
 * Features:
 * 1. Bottom Navigation Bar for Mobile (< 768px)
 * 2. Left Sidebar for Desktop (>= 768px)
 * 3. Integrated Top Header for Profile & Status
 */
export default function StudentLayout() {
  const isOnline = useNetworkStatus();
  const { isDark, toggleDarkMode } = useDarkMode();

  const navItems = [
    { label: 'Home', icon: Home, path: '/' },
    { label: 'Test', icon: PenTool, path: '/test' }, // Assumed or Dashboard section
    { label: 'Modul', icon: BookOpen, path: '/modules' },
    { label: 'Setting', icon: Settings, path: '/settings' }, // Placeholder
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
    
      {/* 1. DESKTOP SIDEBAR (Visible md+) */}
      <aside className="hidden md:flex fixed left-0 top-0 h-full w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex-col z-40">
        <div className="p-6">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg">
              <BookOpen size={24} />
            </div>
            <span className="font-black text-xl tracking-tight text-slate-800 dark:text-white">PORTAL TKA</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-4">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all
                ${isActive 
                  ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400' 
                  : 'text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-700/50'
                }
              `}
            >
              <item.icon size={20} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100 dark:border-slate-700 space-y-2">
          <button 
            onClick={toggleDarkMode}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 font-bold text-sm transition-all"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
            {isDark ? 'Mode Terang' : 'Mode Gelap'}
          </button>
          <button className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 font-bold text-sm transition-all">
            <LogOut size={20} />
            Keluar
          </button>
        </div>
      </aside>

      {/* 2. MOBILE TOP HEADER (Visible < md) */}
      <header className="md:hidden sticky top-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 px-4 py-3 flex items-center justify-between z-40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-md">
            <BookOpen size={18} />
          </div>
          <span className="font-bold text-slate-800 dark:text-white">PORTAL TKA</span>
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

      {/* 3. MAIN CONTENT AREA */}
      <main className="md:ml-64 transition-all duration-300 min-h-screen flex flex-col">
        {/* Desktop Top Bar (Optional, for Network Status etc) */}
        <div className="hidden md:flex h-16 px-8 items-center justify-end bg-transparent gap-4">
           <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm">
             <NetworkIndicator isOnline={isOnline} />
           </div>
           <div className="flex items-center gap-3">
             <div className="text-right">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Siswa</p>
                <p className="text-sm font-black text-slate-800 dark:text-white">Budi Santoso</p>
             </div>
             <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 border-2 border-white dark:border-slate-700 shadow-md" />
           </div>
        </div>

        <div className="flex-1 p-4 md:p-8 pb-24 md:pb-8">
          <Outlet />
        </div>
      </main>

      {/* 4. MOBILE BOTTOM NAVIGATION (Visible < md) */}
      <footer className="md:hidden fixed bottom-0 w-full bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 z-50 px-6 py-3 pb-6 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <nav className="flex items-center justify-between">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              className={({ isActive }) => `
                flex flex-col items-center gap-1 transition-all
                ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'}
              `}
            >
              {({ isActive }) => (
                <>
                  <item.icon size={24} className={isActive ? 'animate-bounce' : ''} />
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
===
import React from 'react';
import { Outlet, NavLink, Link } from 'react-router-dom';
import { 
  Home, 
  PenTool, 
  BookOpen, 
  Settings, 
  Moon, 
  Sun, 
  Wifi, 
  WifiOff, 
  LogOut 
} from 'lucide-react';
import { useDarkMode } from '../../hooks/useDarkMode';
import NetworkIndicator from '../../components/NetworkIndicator';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';

/**
 * StudentLayout Redesign
 * Features:
 * 1. Bottom Navigation Bar for Mobile (< 768px)
 * 2. Left Sidebar for Desktop (>= 768px)
 * 3. Integrated Top Header for Profile & Status
 */
export default function StudentLayout() {
  const isOnline = useNetworkStatus();
  const { isDark, toggleDarkMode } = useDarkMode();

  const navItems = [
    { label: 'Home', icon: Home, path: '/', end: true },
    { label: 'Test', icon: PenTool, path: '/test' },
    { label: 'Modul', icon: BookOpen, path: '/modules' },
    { label: 'Setting', icon: Settings, path: '/settings' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
    
      {/* 1. DESKTOP SIDEBAR (Visible md+) */}
      <aside className="hidden md:flex fixed left-0 top-0 h-full w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex-col z-40">
        <div className="p-6">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg">
              <BookOpen size={24} />
            </div>
            <span className="font-black text-xl tracking-tight text-slate-800 dark:text-white">PORTAL TKA</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-4">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              end={item.end}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all
                ${isActive 
                  ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400' 
                  : 'text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-700/50'
                }
              `}
            >
              <item.icon size={20} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100 dark:border-slate-700 space-y-2">
          <button 
            onClick={toggleDarkMode}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 font-bold text-sm transition-all"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
            {isDark ? 'Mode Terang' : 'Mode Gelap'}
          </button>
          <button className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 font-bold text-sm transition-all">
            <LogOut size={20} />
            Keluar
          </button>
        </div>
      </aside>

      {/* 2. MOBILE TOP HEADER (Visible < md) */}
      <header className="md:hidden sticky top-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 px-4 py-3 flex items-center justify-between z-40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-md">
            <BookOpen size={18} />
          </div>
          <span className="font-bold text-slate-800 dark:text-white">PORTAL TKA</span>
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

      {/* 3. MAIN CONTENT AREA */}
      <main className="md:ml-64 transition-all duration-300 min-h-screen flex flex-col">
        {/* Desktop Top Bar (Optional, for Network Status etc) */}
        <div className="hidden md:flex h-16 px-8 items-center justify-end bg-transparent gap-4">
           <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm">
             <NetworkIndicator isOnline={isOnline} />
           </div>
           <div className="flex items-center gap-3">
             <div className="text-right">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Siswa</p>
                <p className="text-sm font-black text-slate-800 dark:text-white">Budi Santoso</p>
             </div>
             <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 border-2 border-white dark:border-slate-700 shadow-md" />
           </div>
        </div>

        <div className="flex-1 pb-24 md:pb-0">
          <Outlet />
        </div>
      </main>

      {/* 4. MOBILE BOTTOM NAVIGATION (Visible < md) */}
      <footer className="md:hidden fixed bottom-0 w-full bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 z-50 px-6 py-3 pb-6 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <nav className="flex items-center justify-between">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              end={item.end}
              className={({ isActive }) => `
                flex flex-col items-center gap-1 transition-all
                ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'}
              `}
            >
              {({ isActive }) => (
                <>
                  <item.icon size={24} className={isActive ? 'animate-bounce' : ''} />
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
```

---

### 🟡 NavLink Fix: Active State Accuracy

**Problem:** The `"/"` NavLink in the sidebar and bottom bar matched ALL routes (e.g., `/test`, `/settings`) because React Router's `NavLink` uses prefix matching by default. "Home" always appeared active.

**Fix:** Added `end` prop to nav items, propagated to both desktop sidebar and mobile bottom bar NavLinks.

---

### 🟡 Typography Fix: Font Weight 900

**Problem:** `font-black` (Tailwind's `font-weight: 900`) was used extensively across the entire codebase, but the Google Fonts URL only loaded weights up to 800. The browser synthesized faux-bold, producing inferior typography.

**Fix:** Added `0,900` to the Google Fonts weight range.

```diff:index.html
<!doctype html>
<html lang="id">

<head>
  <meta charset="UTF-8" />
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <meta name="description" content="Portal Latihan TKA — Platform tryout online untuk siswa SD kelas 6. Latihan ujian kapan saja, di mana saja." />
  <meta name="theme-color" content="#6C5CE7" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&display=swap" rel="stylesheet" />
  <title>Portal Latihan TKA</title>
</head>

<body>
  <div id="root"></div>
  <script type="module" src="/src/main.jsx"></script>
</body>

</html>
===
<!doctype html>
<html lang="id">

<head>
  <meta charset="UTF-8" />
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <meta name="description" content="Portal Latihan TKA — Platform tryout online untuk siswa SD kelas 6. Latihan ujian kapan saja, di mana saja." />
  <meta name="theme-color" content="#6C5CE7" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400&display=swap" rel="stylesheet" />
  <title>Portal Latihan TKA</title>
</head>

<body>
  <div id="root"></div>
  <script type="module" src="/src/main.jsx"></script>
</body>

</html>
```

---

### 🧹 Dead Code Removed

| File                                      | Reason                                                    |
| ----------------------------------------- | --------------------------------------------------------- |
| `src/App.css`                           | Vite scaffold CSS (counter, hero, ticks). Never imported. |
| `src/student/pages/LearningModules.jsx` | Orphaned. Superseded by `StudentModul.jsx`.             |

---

## Verification

| Check                            | Result                                                           |
| -------------------------------- | ---------------------------------------------------------------- |
| `npx vite build`               | ✅**Built in 1.76s** — 0 errors                           |
| `/` Dashboard                  | ✅ Renders with chart, profile, exam cards                       |
| `/test` — previously WSOD     | ✅**"Pusat Ujian & Latihan"** with tabs + exam cards       |
| `/modules` — previously WSOD  | ✅**"Katalog Modul Belajar"** with 5 module cards          |
| `/settings` — previously WSOD | ✅**"Pengaturan Akun"** with profile, NISN, verified badge |
| NavLink active state             | ✅ Only the current page is highlighted                          |

---

## Console Warnings Noticed (Non-blocking, for future fixes)

| Warning                                                        | File                                    | Fix                                                                                         |
| -------------------------------------------------------------- | --------------------------------------- | ------------------------------------------------------------------------------------------- |
| `Encountered two children with the same key "Survei"`        | `StudentDashboard.jsx` chart legend   | Two exams names both start with "Survei" — use `exam.id` as key instead of `item.name` |
| `width(-1) and height(-1) of chart should be greater than 0` | `StudentDashboard.jsx` RadialBarChart | Recharts ResponsiveContainer needs a parent with explicit dimensions on initial render      |

---

## Remaining Refactor Checklist (Awaiting Your Go-Ahead)

Per the [implementation plan](file:///C:/Users/Kais%20Nabhan/.gemini/antigravity/brain/f59e25cc-086b-41f2-94d8-c3d58c72cbef/implementation_plan.md), these P1–P3 items remain:

- [ ] Standardize gray scale (`gray-*` → `slate-*` everywhere)
- [ ] Promote `useDarkMode` to React Context
- [ ] Enforce design token usage (`primary`, `surface`, `card` vs raw Tailwind)
- [ ] Add role-aware routing guard (student can't access `/admin`)
- [ ] Fix the two console warnings above
