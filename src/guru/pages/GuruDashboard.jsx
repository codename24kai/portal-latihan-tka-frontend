import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, 
  ClipboardList, 
  TrendingUp, 
  CalendarDays,
  ArrowRight,
  AlertCircle,
  Megaphone,
  Clock,
  CheckCircle2,
  BookOpen,
  Send,
  Info
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import mockStudents from '../../data/mockStudents';

export default function GuruDashboard() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [showAnnounceModal, setShowAnnounceModal] = useState(false);
  const [announcementText, setAnnouncementText] = useState('');
  const [priority, setPriority] = useState('Biasa');
  const assignedClass = localStorage.getItem('assignedClass') ?? '';

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Filter students for this class
  const classStudents = useMemo(() => {
    return (mockStudents ?? []).filter(s => s?.class === assignedClass);
  }, [assignedClass]);

  // Students needing attention (score < 60 or inactive status)
  const attentionStudents = useMemo(() => {
    return classStudents.filter(s => (s?.avgScore ?? 0) < 60 || s?.status === 'inactive').slice(0, 4);
  }, [classStudents]);

  // Calculate metrics
  const metrics = useMemo(() => {
    const total = classStudents.length;
    // Mocking specific subject scores for demonstration
    const avgMath = total > 0 
      ? (classStudents.reduce((acc, curr) => acc + (curr?.avgScore ?? 0) - 2, 0) / total).toFixed(1) 
      : 0;
    const avgIndo = total > 0 
      ? (classStudents.reduce((acc, curr) => acc + (curr?.avgScore ?? 0) + 3, 0) / total).toFixed(1) 
      : 0;
    
    return {
      totalSiswa: total,
      avgMath,
      avgIndo,
      participation: '92%'
    };
  }, [classStudents]);

  const statCards = [
    { label: 'Total Siswa', value: metrics.totalSiswa, icon: Users, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Rata-rata Matematika', value: metrics.avgMath, icon: BookOpen, color: 'text-teal-600', bg: 'bg-teal-50' },
    { label: 'Rata-rata B. Indonesia', value: metrics.avgIndo, icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Partisipasi Tryout', value: metrics.participation, icon: ClipboardList, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  const handleSendAnnouncement = () => {
    if (!announcementText.trim()) return;
    
    // Simulate sending
    toast.success(`Pengumuman berhasil dikirim ke ${classStudents.length} siswa Kelas ${assignedClass}`, {
      duration: 4000,
      icon: '📨',
      style: {
        borderRadius: '1rem',
        background: '#334155',
        color: '#fff',
        fontSize: '12px',
        fontWeight: 'bold',
        textTransform: 'uppercase'
      },
    });
    
    setAnnouncementText('');
    setPriority('Biasa');
    setShowAnnounceModal(false);
  };

  const getPriorityColor = (p) => {
    switch (p) {
      case 'Urgent': return 'bg-rose-500 text-white';
      case 'Penting': return 'bg-amber-500 text-white';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400';
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      {/* TKA Countdown Banner */}
      <div className="bg-gradient-to-r from-orange-600 to-teal-600 rounded-[2rem] p-6 text-white shadow-xl shadow-orange-600/10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
            <Clock size={32} className="text-white" />
          </div>
          <div>
            <h2 className="text-xl font-black uppercase tracking-tight leading-none">Countdown Menuju TKA</h2>
            <p className="text-sm font-bold opacity-80 uppercase tracking-widest mt-1">Sisa Waktu Persiapan Siswa</p>
          </div>
        </div>
        <div className="flex gap-4">
          {[
            { label: 'Hari', val: '14' },
            { label: 'Jam', val: '08' },
            { label: 'Menit', val: '45' }
          ].map((unit, i) => (
            <div key={i} className="text-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl min-w-[70px] border border-white/20">
              <p className="text-2xl font-black leading-none">{unit.val}</p>
              <p className="text-[10px] font-bold uppercase tracking-tighter mt-1">{unit.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Header & Quick Action */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight">
            Beranda Wali Kelas {assignedClass}
          </h1>
          <p className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-widest italic">
            Dashboard monitoring dan interaksi kelas
          </p>
        </div>
        <button 
          onClick={() => setShowAnnounceModal(true)}
          className="flex items-center gap-3 px-6 py-4 bg-orange-600 text-white rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-lg shadow-orange-600/20 hover:bg-orange-700 transition-all hover:scale-105 active:scale-95"
        >
          <Megaphone size={18} /> Kirim Pengumuman Kelas
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, idx) => (
          <div key={idx} className="bg-white dark:bg-slate-800 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 ${card.bg} rounded-2xl flex items-center justify-center ${card.color}`}>
                <card.icon size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
                  {card.label}
                </p>
                <p className="text-2xl font-black text-slate-800 dark:text-white leading-none">
                  {isLoading ? '...' : card.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Active Tryout Progress */}
      <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-widest">Progress Tryout Berjalan</h3>
          <span className="text-[10px] font-black text-teal-600 uppercase tracking-widest">Matematika Batch B</span>
        </div>
        <div className="relative h-4 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
          <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-teal-500 to-emerald-400 w-[87%] rounded-full shadow-[0_0_10px_rgba(20,184,166,0.3)]" />
        </div>
        <div className="flex justify-between mt-4">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">14 / 16 Siswa Selesai</p>
          <p className="text-[11px] font-black text-teal-600 uppercase tracking-wider">87%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Siswa Perlu Perhatian */}
        <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] border-2 border-rose-100 dark:border-rose-900/30 overflow-hidden shadow-xl shadow-rose-500/5">
          <div className="p-8 border-b border-rose-50 dark:border-rose-900/20 bg-rose-50/30 dark:bg-rose-900/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertCircle size={20} className="text-rose-500" />
              <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-widest">Siswa Perlu Perhatian</h3>
            </div>
            <span className="px-3 py-1 rounded-full bg-rose-500 text-white text-[10px] font-black uppercase">{attentionStudents.length}</span>
          </div>
          <div className="p-4">
            <div className="space-y-3">
              {attentionStudents.length > 0 ? attentionStudents.map((student) => (
                <div key={student?.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 flex items-center justify-between border border-transparent hover:border-rose-200 transition-all cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center text-[10px] font-black text-rose-600 uppercase">
                      {student?.avatar ?? student?.name?.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-700 dark:text-slate-200 uppercase tracking-tight">{student?.name}</p>
                      <p className="text-[10px] font-bold text-rose-500 uppercase tracking-tighter">
                        {student?.status === 'inactive' ? 'Belum Login > 3 Hari' : `Skor Rendah: ${student?.avgScore}`}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => navigate(`/guru/students?id=${student.id}`)}
                    className="h-10 px-4 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-rose-500 hover:border-rose-500 transition-all"
                  >
                    Intervensi
                  </button>
                </div>
              )) : (
                <div className="py-10 text-center">
                  <CheckCircle2 size={32} className="text-teal-500 mx-auto mb-3" />
                  <p className="text-xs font-bold text-slate-400 uppercase">Semua siswa dalam kondisi baik</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Performa Siswa (Alphabetical Summary) */}
        <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 overflow-hidden">
          <div className="p-8 border-b border-slate-50 dark:border-slate-700 flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-widest">Ringkasan Performa</h3>
            <button className="text-[10px] font-black text-orange-600 uppercase hover:underline">Lihat Laporan</button>
          </div>
          <div className="p-4">
            <div className="space-y-2">
              {[...classStudents]
                .sort((a, b) => (a?.name ?? '').localeCompare(b?.name ?? ''))
                .slice(0, 5)
                .map((student) => (
                  <div key={student?.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 flex items-center justify-between group hover:bg-teal-50/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 flex items-center justify-center text-[10px] font-black text-slate-400 border border-slate-100 dark:border-slate-700 uppercase">
                        {student?.avatar ?? student?.name?.charAt(0)}
                      </div>
                      <p className="text-sm font-bold text-slate-700 dark:text-slate-200 uppercase tracking-tight">{student?.name}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${(student?.avgScore ?? 0) >= 80 ? 'bg-teal-500' : (student?.avgScore ?? 0) >= 60 ? 'bg-amber-400' : 'bg-rose-500'}`} />
                      <p className="text-xs font-black text-slate-600 dark:text-slate-400">{student?.avgScore}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Agenda Preview */}
        <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 overflow-hidden">
          <div className="p-8 border-b border-slate-50 dark:border-slate-700 flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-widest">Agenda Terdekat</h3>
            <CalendarDays size={20} className="text-slate-400" />
          </div>
          <div className="p-8">
            <div className="space-y-6">
              {[
                { title: 'Tryout Matematika Batch A', time: 'Besok, 08:00', status: 'upcoming' },
                { title: 'Kuis Literasi Mingguan', time: 'Kamis, 10:00', status: 'upcoming' },
              ].map((item, idx) => (
                <div key={idx} className="flex gap-4 items-start relative">
                  {idx !== 1 && <div className="absolute left-2.5 top-8 bottom-[-24px] w-0.5 bg-slate-100 dark:bg-slate-700" />}
                  <div className={`w-5 h-5 rounded-full border-4 ${item.status === 'upcoming' ? 'border-orange-500 bg-white' : 'border-slate-200 bg-slate-100'} z-10`} />
                  <div className="flex-1 -mt-1">
                    <p className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-tight">{item.title}</p>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{item.time}</p>
                  </div>
                  <button className="p-2 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-400 hover:text-orange-600 transition-colors">
                    <ArrowRight size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Placeholder for Quick Info */}
        <div className="bg-orange-600 rounded-[2.5rem] p-8 text-white shadow-xl shadow-orange-600/10 flex flex-col justify-center group cursor-pointer" onClick={() => setShowAnnounceModal(true)}>
          <Megaphone size={40} className="mb-4 opacity-40 group-hover:rotate-12 transition-transform" />
          <h4 className="text-xl font-black uppercase tracking-tight leading-tight mb-2">
            Belum ada pengumuman hari ini.
          </h4>
          <p className="text-sm font-bold opacity-80 uppercase tracking-widest mb-6">
            Klik tombol di atas untuk mengirimkan info ke seluruh siswa di Kelas {assignedClass}.
          </p>
          <button className="w-full py-4 bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-white/30 transition-all">
            Kelola Pengumuman
          </button>
        </div>
      </div>

      {/* ENHANCED Announcement Modal */}
      {showAnnounceModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowAnnounceModal(false)} />
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-700 p-10 animate-in zoom-in-95 duration-200 overflow-hidden">
             {/* Header */}
             <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-orange-50 dark:bg-orange-900/30 rounded-2xl flex items-center justify-center text-orange-600">
                   <Megaphone size={24} />
                </div>
                <div>
                   <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight">Kirim Pengumuman</h3>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Broadcast pesan ke seluruh siswa</p>
                </div>
             </div>

             {/* Recipient Preview */}
             <div className="mb-6 flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-xl">
                <Send size={14} className="text-orange-500" />
                <span className="text-[10px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest">
                   Dikirim ke: <span className="text-orange-600">Seluruh Siswa Kelas {assignedClass} ({classStudents.length} Siswa)</span>
                </span>
             </div>

             {/* Priority Selector */}
             <div className="mb-6 space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Prioritas Pesan</label>
                <div className="flex gap-2">
                   {['Biasa', 'Penting', 'Urgent'].map((p) => (
                      <button
                        key={p}
                        onClick={() => setPriority(p)}
                        className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                           priority === p 
                           ? getPriorityColor(p) + ' border-transparent shadow-lg' 
                           : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-700 text-slate-400'
                        }`}
                      >
                         {p}
                      </button>
                   ))}
                </div>
             </div>

             {/* Textarea */}
             <div className="relative mb-8">
                <textarea 
                  value={announcementText}
                  onChange={(e) => setAnnouncementText(e.target.value.slice(0, 500))}
                  placeholder="Tulis pesan pengumuman di sini..."
                  className="w-full h-40 p-6 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all dark:text-white resize-none"
                />
                <div className={`absolute bottom-4 right-6 text-[10px] font-black tracking-widest ${announcementText.length >= 450 ? 'text-rose-500' : 'text-slate-300'}`}>
                   {announcementText.length} / 500
                </div>
             </div>

             <div className="flex items-center gap-3 mb-6 p-4 bg-teal-50 dark:bg-teal-900/10 rounded-2xl border border-teal-100 dark:border-teal-900/30">
                <Info size={16} className="text-teal-600 shrink-0" />
                <p className="text-[10px] font-bold text-teal-700 dark:text-teal-400 uppercase leading-relaxed">
                   Pesan akan muncul di notifikasi dashboard siswa segera setelah dikirim.
                </p>
             </div>

             {/* Actions */}
             <div className="flex gap-4">
                <button 
                  onClick={() => { setShowAnnounceModal(false); setAnnouncementText(''); }} 
                  className="flex-1 py-4 bg-slate-100 dark:bg-slate-700 text-slate-400 font-black uppercase tracking-widest text-[11px] rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                >
                   Batal
                </button>
                <button 
                  onClick={handleSendAnnouncement}
                  disabled={!announcementText.trim()}
                  className="flex-1 py-4 bg-orange-600 text-white font-black uppercase tracking-widest text-[11px] rounded-2xl shadow-lg shadow-orange-600/20 hover:bg-orange-700 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
                >
                   Kirim Sekarang <Send size={14} />
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
