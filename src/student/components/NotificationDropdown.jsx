import React, { useState, useRef, useEffect } from 'react';
import { Bell, Info, CheckCircle, AlertCircle, Calendar } from 'lucide-react';

const mockNotifs = [
  { 
    id: 1, 
    title: 'Hasil Tryout Keluar', 
    desc: 'Hasil Tryout Matematika Batch #3 sudah tersedia.', 
    time: '5 menit yang lalu', 
    type: 'success', 
    icon: CheckCircle,
    isRead: false 
  },
  { 
    id: 2, 
    title: 'Modul Belajar Baru', 
    desc: 'Guru mengunggah modul "Logika Matematika".', 
    time: '1 jam yang lalu', 
    type: 'info', 
    icon: Info,
    isRead: false 
  },
  { 
    id: 3, 
    title: 'Jadwal Latihan', 
    desc: 'Latihan Bersama besok pukul 09:00 WIB.', 
    time: '3 jam yang lalu', 
    type: 'warning', 
    icon: Calendar,
    isRead: true 
  },
];

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = mockNotifs.filter(n => !n.isRead).length;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 active:scale-95
          ${isOpen 
            ? 'bg-teal-600 text-white shadow-lg shadow-teal-200 dark:shadow-none' 
            : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-slate-700 hover:border-teal-200 dark:hover:border-teal-900 shadow-sm hover:shadow-md'
          }
        `}
        aria-label="Notifikasi"
      >
        <Bell size={20} className={isOpen ? 'animate-bounce-slow' : ''} />
        
        {unreadCount > 0 && (
          <span className={`
            absolute top-2.5 right-2.5 w-2.5 h-2.5 rounded-full border-2 
            ${isOpen ? 'bg-white border-teal-600' : 'bg-rose-500 border-white dark:border-slate-800'}
          `} />
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-slate-900 shadow-2xl rounded-2xl border border-slate-100 dark:border-slate-800 z-[60] overflow-hidden animate-in fade-in zoom-in duration-200 origin-top-right">
          <div className="p-4 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/30">
            <div>
              <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-tight">Notifikasi</h3>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Anda memiliki {unreadCount} pesan baru</p>
            </div>
            <button className="text-[10px] font-black text-teal-600 dark:text-teal-400 hover:underline uppercase tracking-wider">
              Tandai Dibaca
            </button>
          </div>

          <div className="max-h-[350px] overflow-y-auto custom-scrollbar">
            {mockNotifs.length > 0 ? (
              <div className="divide-y divide-slate-50 dark:divide-slate-800/50">
                {mockNotifs.map((notif) => (
                  <div 
                    key={notif.id} 
                    className={`
                      p-4 flex items-start gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group relative
                      ${!notif.isRead ? 'bg-teal-50/30 dark:bg-teal-900/10' : ''}
                    `}
                  >
                    {!notif.isRead && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-teal-500" />
                    )}
                    
                    <div className={`
                      w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm
                      ${notif.type === 'success' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' :
                        notif.type === 'warning' ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' : 
                        'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                      }
                    `}>
                      <notif.icon size={18} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-0.5">
                        <p className="text-xs font-black text-slate-800 dark:text-slate-200 truncate group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                          {notif.title}
                        </p>
                        <span className="text-[9px] font-medium text-slate-400 whitespace-nowrap uppercase tracking-tighter">
                          {notif.time}
                        </span>
                      </div>
                      <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 leading-snug line-clamp-2">
                        {notif.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Bell size={24} className="text-slate-300" />
                </div>
                <p className="text-xs font-bold text-slate-400">Tidak ada notifikasi</p>
              </div>
            )}
          </div>

          <button className="w-full py-3 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] hover:text-teal-600 dark:hover:text-teal-400 transition-colors border-t border-slate-50 dark:border-slate-800 bg-white dark:bg-slate-900">
            Lihat Semua Riwayat
          </button>
        </div>
      )}
    </div>
  );
}
