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
  Users,
  Layers
} from 'lucide-react';
import { useEffect } from 'react';

/**
 * Admin sidebar navigation.
 * Collapsible on desktop, overlay on mobile.
 */
export default function Sidebar({ mobileMenuOpen, setMobileMenuOpen, collapsed, setCollapsed }) {
  // Get current user role to determine routing prefix and permissions
  const userRole = localStorage.getItem('userRole') || 'teacher';
  const basePath = userRole === 'teacher' ? '/teacher' : '/admin';

  // Base menu items available to both Teacher and Super Admin
  const menuItems = [
    { path: basePath, icon: LayoutDashboard, label: 'Dashboard', end: true },
    { path: `${basePath}/question-bank`, icon: BookOpen, label: 'Bank Soal' },
    { path: `${basePath}/tryout`, icon: ClipboardList, label: 'Manajemen Tryout' },
    { path: `${basePath}/reports`, icon: BarChart3, label: 'Laporan Nilai' },
    { path: `${basePath}/modules`, icon: Layers, label: 'Materi Belajar' },
  ];

  // Conditional Rendering: Append "User Management" ONLY for Super Admin
  if (userRole === 'admin') {
    menuItems.push({ path: `${basePath}/users`, icon: Users, label: 'Manajemen Pengguna' });
  }

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

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem('userRole');
    window.location.href = '/login';
  };

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
        className={`fixed left-0 top-0 h-screen bg-slate-900 flex flex-col z-50 transition-all duration-300 ease-out 
          ${collapsed ? 'lg:w-[72px]' : 'lg:w-[260px]'}
          ${mobileMenuOpen ? 'w-[260px] translate-x-0' : 'w-[260px] -translate-x-full lg:translate-x-0'}
          border-r border-slate-800
        `}
      >
        {/* Logo area (h-20 matching Header) */}
        <div className="flex items-center gap-3 px-5 border-b border-slate-800 h-20">
          <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
            <img src="/logo-sd-1.svg" alt="Logo" className="w-10 h-10 object-contain shadow-lg rounded-xl" />
          </div>
          {(!collapsed || mobileMenuOpen) && (
            <div className="overflow-hidden animate-fade-in flex-1">
              <h1 className="text-white font-bold text-sm leading-tight">Portal TKA</h1>
              <p className="text-slate-400 text-[10px] uppercase tracking-wider mt-0.5 font-bold">
                {userRole === 'admin' ? 'Super Admin' : 'Teacher View'}
              </p>
            </div>
          )}
          {/* Mobile close button */}
          <button
            className="lg:hidden text-slate-400 hover:text-white"
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
                `flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${isActive
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
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
        <div className="px-3 py-4 border-t border-slate-800 space-y-2">
          {/* Collapse toggle (Desktop only) */}
          <button
            id="btn-toggle-sidebar"
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white text-sm transition-all duration-200"
          >
            <ChevronLeft
              size={20}
              className={`flex-shrink-0 transition-transform duration-300 ${collapsed ? 'rotate-180' : ''
                }`}
            />
            {!collapsed && <span className="animate-fade-in">Tutup Menu</span>}
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 text-sm transition-all duration-200"
          >
            <LogOut size={20} className="flex-shrink-0" />
            {(!collapsed || mobileMenuOpen) && <span className="animate-fade-in">Keluar</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
