import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/utilitas/api';
import {
  Activity,
  Clock,
  User,
  CheckCircle,
  HelpCircle,
  Search,
  ArrowLeft,
  RefreshCw,
  Upload,
  Download,
  AlertCircle,
  X,
  Calendar,
  MonitorSmartphone,
  Users
} from 'lucide-react';
import Dropdown from '@/komponen/ui/Dropdown';
import Badge from '@/komponen/ui/Badge';
import DataTable from '@/komponen/ui/TabelData';

const ActivityIcon = ({ type }) => {
  switch (type) {
    case 'finish': return <CheckCircle size={16} className="text-emerald-500" />;
    case 'start': return <Activity size={16} className="text-blue-500" />;
    case 'login': return <User size={16} className="text-indigo-500" />;
    case 'update': return <RefreshCw size={16} className="text-amber-500" />;
    case 'upload': return <Upload size={16} className="text-teal-500" />;
    case 'download': return <Download size={16} className="text-purple-500" />;
    default: return <HelpCircle size={16} className="text-slate-400" />;
  }
};

export default function LogAktivitasAdmin() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('Semua');
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [showActiveModal, setShowActiveModal] = useState(false); // State untuk Tabel Pengguna Aktif
  const [activeUsersCount, setActiveUsersCount] = useState(0);
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLogs = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = {};
      if (searchQuery) params.search = searchQuery;
      if (typeFilter !== 'Semua') {
          // Map typeFilter to aksi
          const aksiMap = {
              'login': 'login',
              'start': 'mulai',
              'finish': 'selesai',
              'update': 'update',
              'upload': 'upload',
              'download': 'download'
          };
          params.aksi = aksiMap[typeFilter] || typeFilter;
      }
      
      const res = await api.get('/admin/log-aktivitas', { params });
      
      const formatted = res.data.data.map(l => ({
        id: l.id_log,
        user: l.pengguna ? l.pengguna.username : 'Unknown',
        type: l.aksi.includes('login') ? 'login' : l.aksi.includes('selesai') ? 'finish' : l.aksi.includes('mulai') ? 'start' : 'update',
        description: l.keterangan || l.aksi,
        subject: 'System',
        class: '-',
        time: new Date(l.created_at).toLocaleString('id-ID'),
        detail: l.keterangan
      }));
      setActivities(formatted);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, typeFilter]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const typeOptions = [
    { value: 'Semua', label: 'Semua Tipe' },
    { value: 'login', label: 'Login' },
    { value: 'start', label: 'Mulai Tes' },
    { value: 'finish', label: 'Selesai Tes' },
    { value: 'update', label: 'Perubahan Data' },
    { value: 'upload', label: 'Unggah Berkas' },
    { value: 'download', label: 'Unduh Berkas' }
  ];

  return (
    <div className="animate-in fade-in duration-500 space-y-6 pb-20 relative">

      {/* Header & Realtime Widget Button */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin')}
            className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:text-indigo-600 shadow-sm transition-all"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight flex items-center gap-3">
              <Activity className="text-indigo-600 dark:text-indigo-400" size={26} /> Log Aktivitas Sistem
            </h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
              Pantau seluruh aktivitas penting pengguna dan operasional portal
            </p>
          </div>
        </div>

        {/* Real-time Widget Monitoring (Diubah menjadi Tombol Interaktif) */}
        <button
          onClick={() => setShowActiveModal(true)}
          className="flex items-center gap-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/50 px-5 py-3 rounded-2xl shadow-sm hover:bg-emerald-100 dark:hover:bg-emerald-900/40 hover:shadow-emerald-500/20 transition-all active:scale-95 group text-left"
        >
          <div className="relative flex h-4 w-4 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500"></span>
          </div>
          <div className="flex-1">
            <span className="block text-[9px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest leading-none mb-1 group-hover:text-emerald-700 dark:group-hover:text-emerald-300">Pengguna Aktif Realtime</span>
            <span className="block text-xl font-black text-slate-800 dark:text-white leading-none">
              {activeUsersCount} <span className="text-[10px] text-slate-500 font-bold uppercase tracking-normal">Online</span>
            </span>
          </div>
          <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-800/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 ml-2">
            <Users size={16} />
          </div>
        </button>
      </div>

      {/* Main Container */}
      <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
        {/* Filters */}
        <div className="p-8 border-b border-slate-50 dark:border-slate-700 flex flex-col lg:flex-row gap-4 items-center bg-slate-50/30 dark:bg-slate-900/10">
          <div className="relative flex-1 w-full lg:max-w-md">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari aktivitas, nama pengguna, atau subjek..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-bold focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all dark:text-white"
            />
          </div>

          <Dropdown
            value={typeFilter}
            onChange={setTypeFilter}
            options={typeOptions}
          />
        </div>

        {/* Timeline Table */}
        <DataTable
          headers={[
            { label: 'Aktivitas' },
            { label: 'Pelaku', align: 'center' },
            { label: 'Lingkup / Subjek', align: 'center' },
            { label: 'Waktu Kejadian', align: 'right' }
          ]}
          data={activities}
          rowsPerPage={10}
          renderRow={(act) => (
            <tr
              key={act.id}
              onClick={() => setSelectedActivity(act)}
              className="hover:bg-slate-50/80 dark:hover:bg-slate-900/40 transition-colors group cursor-pointer"
            >
              <td className="py-6 px-8">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-700 flex items-center justify-center border border-slate-100 dark:border-slate-600 transition-transform group-hover:scale-110">
                    <ActivityIcon type={act.type} />
                  </div>
                  <div>
                    <p className="font-bold text-slate-700 dark:text-slate-200 text-sm group-hover:text-indigo-600 transition-colors">
                      {act.description}
                    </p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                      Tipe: {act.type.toUpperCase()}
                    </p>
                  </div>
                </div>
              </td>
              <td className="py-6 px-4 text-center">
                <div className="inline-block">
                  <p className="font-black text-slate-800 dark:text-white text-xs uppercase tracking-tight">{act.user}</p>
                  <span className="text-[9px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded">
                    Kelas {act.class}
                  </span>
                </div>
              </td>
              <td className="py-6 px-4 text-center">
                <Badge text={act.subject} variant="Neutral" />
              </td>
              <td className="py-6 px-8 text-right text-xs font-semibold text-slate-400 uppercase tracking-tighter">
                <div className="flex items-center justify-end gap-1.5">
                  <Clock size={12} className="group-hover:text-indigo-500 transition-colors" />
                  {act.time}
                </div>
              </td>
            </tr>
          )}
        />
      </div>

      <div className="max-w-md bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-900/50 rounded-2xl p-5 flex gap-4">
        <AlertCircle className="text-indigo-500 shrink-0" size={24} />
        <div>
          <p className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.1em] mb-1">Informasi Sinkronisasi</p>
          <p className="text-[11px] font-medium text-slate-600 dark:text-slate-400 leading-relaxed">Log ini mencatat riwayat audit trails di sisi server secara kronologis dengan standar zona waktu WIB.</p>
        </div>
      </div>

      {/* ========================================= */}
      {/* MODAL 1: TABEL PENGGUNA AKTIF REALTIME    */}
      {/* ========================================= */}
      {showActiveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-800 rounded-[3rem] p-8 md:p-10 max-w-5xl w-full shadow-2xl border border-slate-100 dark:border-slate-700 animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">

            {/* Header Modal */}
            <div className="flex justify-between items-center mb-8 shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center border border-emerald-100 dark:border-emerald-800/50 relative">
                  <span className="animate-ping absolute top-0 right-0 inline-flex h-3 w-3 rounded-full bg-emerald-400 opacity-75 transform translate-x-1/3 -translate-y-1/3"></span>
                  <span className="absolute top-0 right-0 inline-flex rounded-full h-3 w-3 bg-emerald-500 transform translate-x-1/3 -translate-y-1/3 border-2 border-white dark:border-slate-800"></span>
                  <Users className="text-emerald-600 dark:text-emerald-400" size={24} />
                </div>
                <div>
                  <h3 className="text-xl md:text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight">Pengguna Aktif</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Memantau sesi {activeUsersCount} perangkat yang terhubung saat ini</p>
                </div>
              </div>
              <button
                onClick={() => setShowActiveModal(false)}
                className="p-3 bg-slate-50 dark:bg-slate-700 hover:bg-rose-50 hover:text-rose-600 text-slate-400 rounded-2xl transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Tabel Pengguna Aktif */}
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 border border-slate-100 dark:border-slate-700 rounded-3xl bg-slate-50/50 dark:bg-slate-900/30">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-100 dark:bg-slate-800 sticky top-0 z-10 shadow-sm">
                  <tr>
                    <th className="py-5 px-6 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-200 dark:border-slate-700">Identitas Pengguna</th>
                    <th className="py-5 px-6 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-200 dark:border-slate-700">Aktivitas Terkini</th>
                    <th className="py-5 px-6 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-200 dark:border-slate-700 text-center">Perangkat</th>
                    <th className="py-5 px-6 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-200 dark:border-slate-700 text-right">Durasi Online</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan="4" className="py-12 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">
                      Belum ada pengguna aktif realtime
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

          </div>
        </div>
      )}

      {/* ========================================= */}
      {/* MODAL 2: DETAIL LOG AKTIVITAS KLIK BARIS  */}
      {/* ========================================= */}
      {selectedActivity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 md:p-10 max-w-lg w-full shadow-2xl border border-slate-100 dark:border-slate-700 animate-in zoom-in-95 duration-200">
            {/* Header Modal */}
            <div className="flex justify-between items-start mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-700 flex items-center justify-center border border-slate-200 dark:border-slate-600">
                  <ActivityIcon type={selectedActivity.type} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight">Detail Aktivitas</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">ID Ref: #LOG-{selectedActivity.id.toString().padStart(4, '0')}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedActivity(null)}
                className="p-2 bg-slate-50 dark:bg-slate-700 hover:bg-rose-50 hover:text-rose-600 text-slate-400 rounded-xl transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Isi Detail */}
            <div className="space-y-6">
              <div className="p-5 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-700/50 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><MonitorSmartphone size={14} /> Pelaku</span>
                  <span className="font-bold text-sm text-slate-800 dark:text-white">{selectedActivity.user} <span className="text-slate-400 text-[10px] uppercase">({selectedActivity.class})</span></span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Calendar size={14} /> Waktu</span>
                  <span className="font-bold text-xs text-indigo-600 dark:text-indigo-400">{selectedActivity.time}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Activity size={14} /> Kategori</span>
                  <Badge text={selectedActivity.type.toUpperCase()} variant="Info" className="text-[9px]" />
                </div>
              </div>

              <div>
                <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Deskripsi & Keterangan Lengkap</span>
                <div className="bg-white dark:bg-slate-800 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-5">
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300 leading-relaxed">
                    {selectedActivity.detail}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700">
              <button
                onClick={() => setSelectedActivity(null)}
                className="w-full py-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-black text-[10px] uppercase tracking-widest rounded-2xl transition-all"
              >
                Tutup Jendela
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
