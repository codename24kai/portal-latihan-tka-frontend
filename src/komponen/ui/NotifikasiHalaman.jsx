import React, { useEffect, useState, useMemo } from 'react';
import { Bell, CheckCircle, Info, AlertCircle, Calendar, Trash2, CheckSquare } from 'lucide-react';
import toast from 'react-hot-toast';

export default function NotifikasiHalaman() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState('Semua'); // 'Semua' | 'Belum Dibaca'
  const pageSize = 8;

  // Determine user role and theme color
  const userRole = localStorage.getItem('userRole') || 'student';
  const theme = useMemo(() => {
    if (userRole === 'admin') {
      return {
        primary: 'indigo',
        bg: 'bg-indigo-600 hover:bg-indigo-700',
        text: 'text-indigo-600 dark:text-indigo-400',
        badge: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
        ring: 'focus:ring-indigo-500/10'
      };
    }
    if (userRole === 'guru') {
      return {
        primary: 'orange',
        bg: 'bg-orange-600 hover:bg-orange-700',
        text: 'text-orange-600 dark:text-orange-400',
        badge: 'bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
        ring: 'focus:ring-orange-500/10'
      };
    }
    return {
      primary: 'teal',
      bg: 'bg-teal-600 hover:bg-teal-700',
      text: 'text-teal-600 dark:text-teal-400',
      badge: 'bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
      ring: 'focus:ring-teal-500/10'
    };
  }, [userRole]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // Generate realistic mock notifications
      const mock = [
        {
          id: 1,
          title: 'Hasil Ujian Simulasi Keluar',
          desc: 'Skor Simulasi TKA Matematika Tahap 1 Anda telah diterbitkan. Silakan cek detail pembahasan di lembar hasil.',
          time: '10 menit yang lalu',
          type: 'success',
          isRead: false,
        },
        {
          id: 2,
          title: 'Unggahan Modul Pembelajaran Baru',
          desc: 'Guru Anda baru saja mengunggah modul belajar mandiri "Persiapan TKA Literasi & Numerasi Dasar".',
          time: '1 jam yang lalu',
          type: 'info',
          isRead: false,
        },
        {
          id: 3,
          title: 'Pemeliharaan Sistem Terjadwal',
          desc: 'Portal akan mengalami pemeliharaan rutin pada hari Sabtu mulai pukul 23:00 hingga Minggu 02:00 WIB.',
          time: '5 jam yang lalu',
          type: 'warning',
          isRead: true,
        },
        {
          id: 4,
          title: 'Pengumuman Penting Wali Kelas',
          desc: 'Mohon selesaikan latihan mandiri sebelum batas waktu hari Kamis ini untuk rekap nilai mingguan.',
          time: '1 hari yang lalu',
          type: 'info',
          isRead: false,
        },
        {
          id: 5,
          title: 'Batas Waktu Pengumpulan Tugas',
          desc: 'Pengisian instrumen Survei Karakter & Sulingjar dibatasi paling lambat akhir pekan ini.',
          time: '2 hari yang lalu',
          type: 'warning',
          isRead: true,
        },
        {
          id: 6,
          title: 'Registrasi Akun Berhasil',
          desc: 'Selamat! Akun Portal Latihan TKA Anda telah aktif sepenuhnya. Selamat belajar!',
          time: '3 hari yang lalu',
          type: 'success',
          isRead: true,
        },
        {
          id: 7,
          title: 'Kuis Selesai Dinilai',
          desc: 'Kuis Game Modul 2: Bangun Ruang telah selesai dinilai. Anda mendapatkan +25 Koin Prestasi.',
          time: '4 hari yang lalu',
          type: 'success',
          isRead: true,
        }
      ];
      setNotifications(mock);
      setLoading(false);
    };
    fetchData();
  }, []);

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
      default:
        return <Bell className="w-5 h-5 text-slate-600 dark:text-slate-400" />;
    }
  };

  const getIconBg = (type) => {
    switch (type) {
      case 'success':
        return 'bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/30';
      case 'warning':
        return 'bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/30';
      case 'info':
        return 'bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/30';
      default:
        return 'bg-slate-50 dark:bg-slate-950/30 border border-slate-100 dark:border-slate-900/30';
    }
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    toast.success('Semua notifikasi telah ditandai sebagai dibaca');
  };

  const toggleRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: !n.isRead } : n));
  };

  const deleteNotif = (id, e) => {
    e.stopPropagation();
    setNotifications(prev => prev.filter(n => n.id !== id));
    toast.success('Notifikasi dihapus');
  };

  const filteredNotifs = useMemo(() => {
    if (filter === 'Belum Dibaca') {
      return notifications.filter(n => !n.isRead);
    }
    return notifications;
  }, [notifications, filter]);

  const totalPages = Math.ceil(filteredNotifs.length / pageSize) || 1;
  const paginated = filteredNotifs.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [totalPages, page]);

  return (
    <div className="animate-fade-in max-w-4xl mx-auto space-y-6 pb-20 pt-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight flex items-center gap-3">
            <Bell className={theme.text} size={26} /> Pusat Notifikasi
          </h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
            Lihat semua pemberitahuan, pembaruan tugas, dan riwayat aktivitas Anda
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={markAllRead}
            className={`flex items-center gap-2 px-5 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all active:scale-95`}
          >
            <CheckSquare size={14} /> Tandai Semua Dibaca
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
        {/* Tabs Filter */}
        <div className="flex items-center gap-8 px-10 py-5 border-b border-slate-50 dark:border-slate-700 bg-slate-50/20 dark:bg-slate-900/10">
          {['Semua', 'Belum Dibaca'].map((t) => {
            const count = t === 'Semua' ? notifications.length : notifications.filter(n => !n.isRead).length;
            const isActive = filter === t;
            return (
              <button
                key={t}
                onClick={() => { setFilter(t); setPage(1); }}
                className={`relative py-2 text-[10px] font-black uppercase tracking-[0.15em] transition-all flex items-center gap-2 ${
                  isActive 
                    ? theme.text 
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                }`}
              >
                {t}
                <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold ${
                  isActive 
                    ? theme.badge 
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-500'
                }`}>
                  {count}
                </span>
                {isActive && <div className={`absolute -bottom-5 left-0 right-0 h-1 rounded-t-full ${userRole === 'admin' ? 'bg-indigo-600' : userRole === 'guru' ? 'bg-orange-600' : 'bg-teal-600'}`} />}
              </button>
            );
          })}
        </div>

        {/* Notifications List */}
        <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
          {loading ? (
            Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="p-8 flex gap-4 animate-pulse">
                <div className="w-11 h-11 bg-slate-200 dark:bg-slate-700 rounded-2xl shrink-0" />
                <div className="flex-1 space-y-3">
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
                  <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
                </div>
              </div>
            ))
          ) : paginated.length > 0 ? (
            paginated.map((notif) => (
              <div
                key={notif.id}
                onClick={() => toggleRead(notif.id)}
                className={`p-8 flex items-start gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors cursor-pointer relative group ${
                  !notif.isRead ? 'bg-slate-50/30 dark:bg-slate-900/5' : ''
                }`}
              >
                {/* Left Active Line */}
                {!notif.isRead && (
                  <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                    userRole === 'admin' ? 'bg-indigo-500' : userRole === 'guru' ? 'bg-orange-500' : 'bg-teal-500'
                  }`} />
                )}

                {/* Icon Wrapper */}
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${getIconBg(notif.type)}`}>
                  {getIcon(notif.type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-1.5">
                    <h3 className={`text-sm font-bold tracking-tight ${
                      !notif.isRead ? 'text-slate-800 dark:text-white font-extrabold' : 'text-slate-600 dark:text-slate-300'
                    }`}>
                      {notif.title}
                    </h3>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter shrink-0">
                      {notif.time}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 leading-relaxed">
                    {notif.desc}
                  </p>
                </div>

                {/* Action Hover Button */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity self-center pl-2">
                  <button
                    onClick={(e) => deleteNotif(notif.id, e)}
                    className="p-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/20 dark:hover:bg-rose-900/30 text-rose-600 dark:text-rose-400 transition-all active:scale-95"
                    title="Hapus Notifikasi"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-20 text-center flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-slate-50 dark:bg-slate-900/50 rounded-[1.5rem] flex items-center justify-center mb-4 border border-slate-100 dark:border-slate-800">
                <Bell className="text-slate-300 dark:text-slate-600" size={26} />
              </div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-wider">Tidak ada notifikasi yang ditemukan</p>
              <p className="text-[10px] font-bold text-slate-400/80 uppercase tracking-widest mt-1">Anda sudah membaca semua pengumuman</p>
            </div>
          )}
        </div>
      </div>

      {/* Pagination Controls */}
      {filteredNotifs.length > pageSize && (
        <div className="flex justify-center items-center gap-4">
          <button
            onClick={() => setPage(p => Math.max(p - 1, 1))}
            disabled={page === 1}
            className={`px-5 py-3 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 transition-colors disabled:opacity-40 disabled:pointer-events-none hover:bg-slate-50`}
          >
            Sebelumnya
          </button>
          <span className="text-xs font-black text-slate-500 uppercase tracking-widest">{page} / {totalPages}</span>
          <button
            onClick={() => setPage(p => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            className={`px-5 py-3 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 transition-colors disabled:opacity-40 disabled:pointer-events-none hover:bg-slate-50`}
          >
            Berikutnya
          </button>
        </div>
      )}
    </div>
  );
}
