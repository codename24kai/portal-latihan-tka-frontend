import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  ClipboardList,
  BarChart3,
  GraduationCap,
  LogOut,
  ChevronLeft,
  X,
} from 'lucide-react';
import { useState, useEffect } from 'react';

const menuItems = [
  { path: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { path: '/admin/question-bank', icon: BookOpen, label: 'Bank Soal' },
  { path: '/admin/tryout', icon: ClipboardList, label: 'Manajemen Tryout' },
  { path: '/admin/reports', icon: BarChart3, label: 'Laporan Nilai' },
];

/**
 * Admin sidebar navigation.
 * Collapsible on desktop, overlay on mobile.
 */
export default function Sidebar({ mobileMenuOpen, setMobileMenuOpen }) {
  const [collapsed, setCollapsed] = useState(false);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setMobileMenuOpen]);

  return (
    <>
      {/* Mobile backdrop */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-dark/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <aside
        id="admin-sidebar"
        className={`fixed left-0 top-0 h-screen bg-dark flex flex-col z-50 transition-all duration-300 ease-out 
          ${collapsed ? 'lg:w-[72px]' : 'lg:w-[260px]'}
          ${mobileMenuOpen ? 'w-[260px] translate-x-0' : 'w-[260px] -translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo area */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-dark-border h-[73px]">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
            <GraduationCap size={22} className="text-white" />
          </div>
          {(!collapsed || mobileMenuOpen) && (
            <div className="overflow-hidden animate-fade-in flex-1">
              <h1 className="text-white font-bold text-sm leading-tight">Portal TKA</h1>
              <p className="text-dark-text text-xs">Admin Panel</p>
            </div>
          )}
          {/* Mobile close button */}
          <button 
            className="lg:hidden text-gray-400 hover:text-white"
            onClick={() => setMobileMenuOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        {/* Menu */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? 'bg-primary text-white shadow-glow'
                    : 'text-dark-text hover:bg-dark-surface hover:text-white'
                }`
              }
            >
              <item.icon size={20} className="flex-shrink-0" />
              {(!collapsed || mobileMenuOpen) && (
                <span className="truncate animate-fade-in">{item.label}</span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom section */}
        <div className="px-3 py-4 border-t border-dark-border space-y-2">
          {/* Collapse toggle (Desktop only) */}
          <button
            id="btn-toggle-sidebar"
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-dark-text hover:bg-dark-surface hover:text-white text-sm transition-all duration-200"
          >
            <ChevronLeft
              size={20}
              className={`flex-shrink-0 transition-transform duration-300 ${
                collapsed ? 'rotate-180' : ''
              }`}
            />
            {!collapsed && <span className="animate-fade-in">Tutup Menu</span>}
          </button>

          {/* Logout */}
          <button className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-dark-text hover:bg-red-500/10 hover:text-red-400 text-sm transition-all duration-200">
            <LogOut size={20} className="flex-shrink-0" />
            {(!collapsed || mobileMenuOpen) && <span className="animate-fade-in">Keluar</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
