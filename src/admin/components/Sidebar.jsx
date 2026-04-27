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
  Layers,
  FileText
} from 'lucide-react';
import { useEffect } from 'react';

/**
 * Admin sidebar navigation.
 * Collapsible on desktop, overlay on mobile.
 */
export default function Sidebar({ mobileMenuOpen, setMobileMenuOpen, collapsed, setCollapsed }) {
  const basePath = '/admin';

  // Grouped menu items with role-based visibility
  const menuGroups = [
    {
      label: 'Dashboard',
      items: [
        { path: basePath, icon: LayoutDashboard, label: 'Beranda', end: true },
      ]
    },
    {
      label: 'Akademik',
      items: [
        { path: `${basePath}/question-bank`, icon: BookOpen, label: 'Bank Soal' },
        { path: `${basePath}/tryout`, icon: ClipboardList, label: 'Manajemen Tryout' },
        { path: `${basePath}/modules`, icon: Layers, label: 'Materi Belajar' },
      ]
    },
    {
      label: 'Pengguna & Laporan',
      items: [
        { path: `${basePath}/users`, icon: Users, label: 'Manajemen Pengguna' },
        { path: `${basePath}/reports`, icon: BarChart3, label: 'Laporan Nilai' },
        { path: `${basePath}/reports/survey`, icon: FileText, label: 'Laporan Survei' },
      ]
    }
  ];

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
        className={`fixed left-0 top-0 h-screen bg-white dark:bg-slate-900 flex flex-col z-50 transition-all duration-300 ease-out 
          ${collapsed ? 'lg:w-[72px]' : 'lg:w-[260px]'}
          ${mobileMenuOpen ? 'w-[260px] translate-x-0' : 'w-[260px] -translate-x-full lg:translate-x-0'}
          border-r border-slate-200 dark:border-slate-800
        `}
      >
        {/* Logo area (h-20 matching Header) */}
        <div className="flex items-center gap-3 px-5 border-b border-slate-100 dark:border-slate-800 h-20">
          <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
            <img src="/logo-sd-1.svg" alt="Logo" className="w-10 h-10 object-contain shadow-lg rounded-xl" />
          </div>
          {(!collapsed || mobileMenuOpen) && (
            <div className="overflow-hidden animate-fade-in flex-1">
              <h1 className="text-slate-800 dark:text-white font-black text-sm uppercase tracking-tight">Portal TKA</h1>
              <p className="text-slate-400 text-[10px] uppercase tracking-wider mt-0.5 font-bold">
                Administrator
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
        <nav className="flex-1 py-6 px-3 space-y-8 overflow-y-auto custom-scrollbar">
          {menuGroups.map((group) => (
            <div key={group.label} className="space-y-2">
              {(!collapsed || mobileMenuOpen) && (
                <h3 className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">
                  {group.label}
                </h3>
              )}
              <div className="space-y-1">
                {group.items.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.end}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 group relative ${isActive
                        ? 'bg-teal-50 text-teal-600 dark:bg-teal-900/40 dark:text-teal-400'
                        : 'text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800'
                      }`
                    }
                  >
                    <item.icon size={20} className="flex-shrink-0" />
                    {(!collapsed || mobileMenuOpen) && (
                      <span className="truncate animate-fade-in">{item.label}</span>
                    )}
                    {collapsed && !mobileMenuOpen && (
                      <div className="absolute left-full ml-4 px-2 py-1 bg-slate-800 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                        {item.label}
                      </div>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Bottom section */}
        <div className="px-3 py-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
          <button
            id="btn-toggle-sidebar"
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800 text-sm font-bold transition-all duration-200"
          >
            <ChevronLeft
              size={20}
              className={`flex-shrink-0 transition-transform duration-300 ${collapsed ? 'rotate-180' : ''
                }`}
            />
            {!collapsed && <span className="animate-fade-in uppercase tracking-wider text-[10px]">Tutup Menu</span>}
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 text-sm font-bold transition-all duration-200"
          >
            <LogOut size={20} className="flex-shrink-0" />
            {(!collapsed || mobileMenuOpen) && <span className="animate-fade-in uppercase tracking-wider text-[10px]">Keluar</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
