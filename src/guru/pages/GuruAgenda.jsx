import React, { useState, useMemo } from 'react';
import { 
  CalendarDays, 
  Clock, 
  MapPin, 
  Users, 
  CheckCircle, 
  AlertCircle, 
  ChevronRight,
  Filter,
  Zap,
  Globe,
  Plus
} from 'lucide-react';
import Badge from '../../components/ui/Badge';
import Dropdown from '../../components/ui/Dropdown';

export default function GuruAgenda() {
  const [sourceFilter, setSourceFilter] = useState('Semua');
  const [statusFilter, setStatusFilter] = useState('Semua Status');
  const assignedClass = localStorage.getItem('assignedClass') ?? '';

  // Mock data for Admin-created global exams
  const adminExams = [
    {
      id: 'A1',
      title: 'Tryout Akbar Matematika Batch A',
      time: '08:00 - 10:00',
      date: 'Besok, 27 April 2026',
      location: 'Portal Online',
      participants: 40,
      status: 'Akan Datang',
      source: 'admin',
      type: 'Exam'
    },
    {
      id: 'A2',
      title: 'Simulasi AKM Nasional',
      time: '09:00 - 11:00',
      date: '15 Mei 2026',
      location: 'Lab Komputer',
      participants: 40,
      status: 'Akan Datang',
      source: 'admin',
      type: 'Simulation'
    }
  ];

  // Mock data for Teacher-created custom quizzes
  const teacherQuizzes = [
    {
      id: 'T1',
      title: 'Latihan Harian: Penjumlahan Pecahan',
      time: '13:00 - 14:00',
      date: '28 April 2026',
      location: 'Ruang Kelas 6A',
      participants: 16,
      status: 'Akan Datang',
      source: 'guru',
      type: 'Practice',
      target_class: '6A'
    },
    {
      id: 'T2',
      title: 'Kuis Literasi: Puisi Rakyat',
      time: '10:00 - 11:30',
      date: '29 April 2026',
      location: 'Ruang Kelas 6A',
      participants: 16,
      status: 'Akan Datang',
      source: 'guru',
      type: 'Quiz',
      target_class: '6A'
    },
    {
      id: 'T3',
      title: 'Evaluasi Mingguan 2',
      time: '08:00 - 09:30',
      date: '24 April 2026',
      location: 'Ruang Kelas 6A',
      participants: 16,
      status: 'Selesai',
      source: 'guru',
      type: 'Evaluation',
      target_class: '6A'
    }
  ];

  const mergedAgenda = useMemo(() => {
    const admin = (adminExams ?? []);
    const guru = (teacherQuizzes ?? []).filter(q => q?.target_class === assignedClass);
    
    return [...admin, ...guru]
      .filter(item => {
        if (sourceFilter === 'Semua') return true;
        return item.source === (sourceFilter === 'Ujian Akbar' ? 'admin' : 'guru');
      })
      .filter(item => {
        if (statusFilter === 'Semua Status') return true;
        return item.status === statusFilter;
      })
      .sort((a, b) => {
         // Simple sort logic: "Akan Datang" first
         if (a.status === 'Akan Datang' && b.status === 'Selesai') return -1;
         if (a.status === 'Selesai' && b.status === 'Akan Datang') return 1;
         return 0;
      });
  }, [assignedClass, sourceFilter, statusFilter]);

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tight">Agenda Latihan Kelas {assignedClass}</h1>
          <p className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-widest italic">Jadwal ujian, simulasi, dan materi belajar mendatang</p>
        </div>
        <button className="h-12 px-6 bg-teal-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest flex items-center gap-2 shadow-xl shadow-teal-600/20 hover:bg-teal-700 transition-all active:scale-95">
          <Plus size={18} /> Tambah Agenda Baru
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col lg:flex-row gap-6">
        <div className="flex flex-wrap gap-2">
          {['Semua', 'Ujian Akbar', 'Latihan Mandiri'].map((tab) => (
            <button
              key={tab}
              onClick={() => setSourceFilter(tab)}
              className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                sourceFilter === tab 
                  ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/20' 
                  : 'bg-slate-50 dark:bg-slate-900 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="lg:ml-auto min-w-[200px]">
           <Dropdown 
             value={statusFilter}
             onChange={setStatusFilter}
             options={[
               { value: 'Semua Status', label: 'Semua Status' },
               { value: 'Akan Datang', label: 'Akan Datang' },
               { value: 'Berlangsung', label: 'Berlangsung' },
               { value: 'Selesai', label: 'Selesai' }
             ]}
           />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Timeline */}
        <div className="lg:col-span-2 space-y-6">
          {mergedAgenda.length > 0 ? mergedAgenda.map((item) => (
            <div key={item.id} className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 p-8 flex flex-col md:flex-row gap-8 hover:shadow-xl hover:shadow-orange-500/5 transition-all group">
              <div className="flex-1 space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <div className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                    item.source === 'admin' 
                      ? 'bg-orange-50 border-orange-100 text-orange-600' 
                      : 'bg-teal-50 border-teal-100 text-teal-600'
                  }`}>
                    {item.source === 'admin' ? 'Ujian Akbar' : 'Latihan Mandiri'}
                  </div>
                  <div className="h-1 w-1 rounded-full bg-slate-300" />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                    <Clock size={12} /> {item.time}
                  </span>
                </div>
                <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight group-hover:text-orange-600 transition-colors">
                  {item.title}
                </h3>
                <div className="flex flex-wrap items-center gap-6">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                    <CalendarDays size={16} className="text-orange-500" />
                    {item.date}
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                    <MapPin size={16} className="text-teal-500" />
                    {item.location}
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                    <Users size={16} className="text-blue-500" />
                    {item.participants} Peserta
                  </div>
                </div>
              </div>
              <div className="flex flex-col justify-between items-end shrink-0 gap-4">
                <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${
                  item.status === 'Selesai' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                }`}>
                  {item.status === 'Selesai' ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
                  {item.status}
                </div>
                <button className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-700 flex items-center justify-center text-slate-400 group-hover:bg-orange-600 group-hover:text-white transition-all">
                  <ChevronRight size={24} />
                </button>
              </div>
            </div>
          )) : (
            <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] border-2 border-dashed border-slate-100 dark:border-slate-700 p-20 text-center">
               <CalendarDays size={48} className="mx-auto text-slate-200 mb-4" />
               <h4 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight mb-2">Tidak Ada Agenda</h4>
               <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Tidak ditemukan jadwal yang sesuai dengan filter Anda.</p>
            </div>
          )}
        </div>

        {/* Sidebar Info */}
        <div className="space-y-8">
          <div className="bg-orange-600 rounded-[2.5rem] p-8 text-white shadow-xl shadow-orange-600/20">
            <h4 className="text-sm font-black uppercase tracking-widest mb-2 opacity-80">Pengingat Penting</h4>
            <p className="text-lg font-black leading-tight mb-6 uppercase tracking-tight">
              Persiapkan data login siswa untuk Tryout Akbar besok pagi.
            </p>
            <button className="w-full py-4 bg-white/20 backdrop-blur-md rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/30 transition-all border border-white/30">
              Lihat Detail Persiapan
            </button>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 p-8 space-y-6">
            <h4 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-widest">Kategori Agenda</h4>
            <div className="space-y-3">
              {[
                { label: 'Ujian Akbar', count: adminExams.length, color: 'bg-orange-500', icon: Globe },
                { label: 'Latihan Mandiri', count: teacherQuizzes.length, color: 'bg-teal-500', icon: Zap },
              ].map((cat, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 group hover:bg-slate-100 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <cat.icon size={16} className={cat.color.replace('bg-', 'text-')} />
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-tight">{cat.label}</span>
                  </div>
                  <span className="text-[10px] font-black text-slate-400">{cat.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
