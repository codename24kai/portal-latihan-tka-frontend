import React, { useState, useEffect, useMemo } from 'react';
import {
  CalendarDays,
  Clock,
  Users,
  Search,
  Send,
  Info,
  ChevronRight,
  Sparkles,
  Target,
  CheckCircle2,
  AlertCircle,
  Megaphone,
  Bell
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getDaftarAgendaGuru, getDaftarSiswaGuru, broadcastPesanGuru } from '@/utilitas/apiGuru';

export default function AgendaKelas() {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('aktif'); // 'aktif' | 'riwayat'
  const [selectedType, setSelectedType] = useState('Semua'); // 'Semua' | 'Sesi Latihan' | 'Latihan Mandiri'
  const [selectedAgendaId, setSelectedAgendaId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Data dari API
  const [agendas, setAgendas] = useState([]);
  const [classStudents, setClassStudents] = useState([]);

  // Reminder modal state
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [targetStudent, setTargetStudent] = useState(null);
  const [reminderMessage, setReminderMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const assignedClass = localStorage.getItem('assignedClass') ?? '6A';

  useEffect(() => {
    const fetchAgenda = async () => {
      try {
        setIsLoading(true);
        const [agendaData, studentsData] = await Promise.all([
          getDaftarAgendaGuru(),
          getDaftarSiswaGuru()
        ]);
        setAgendas(agendaData || []);
        // Asumsi data siswa sudah difilter oleh backend sesuai kelas guru
        setClassStudents(studentsData || []);

        if (agendaData && agendaData.length > 0) {
          setSelectedAgendaId(agendaData[0].id);
        }
      } catch (err) {
        toast.error('Gagal memuat sesi latihan kelas.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchAgenda();
  }, []);

  // Filtered sessions
  const filteredAgendas = useMemo(() => {
    return agendas.filter(agenda => {
      const matchTab = agenda.status === selectedTab;
      const matchType = selectedType === 'Semua' || agenda.type === selectedType;
      return matchTab && matchType;
    });
  }, [agendas, selectedTab, selectedType]);

  // Selected session details
  const selectedAgenda = useMemo(() => {
    return agendas.find(a => a.id === selectedAgendaId) || agendas[0];
  }, [agendas, selectedAgendaId]);

  // Participation Data for Selected Session
  const participationData = useMemo(() => {
    if (!selectedAgenda) return [];

    return classStudents.map(student => {
      const p = selectedAgenda.participation.find(item => item.studentId === student.id);
      return {
        ...student,
        participationStatus: p ? p.status : 'not-started',
        score: p ? p.score : null,
        submittedAt: p ? p.submittedAt : null
      };
    });
  }, [selectedAgenda, classStudents]);

  // Filtered student list by search input
  const filteredParticipation = useMemo(() => {
    return participationData.filter(student =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [participationData, searchTerm]);

  // Statistics calculation for the class
  const stats = useMemo(() => {
    if (!selectedAgenda) return { finished: 0, inProgress: 0, pending: 0, percent: 0, avgScore: 0 };
    const total = classStudents.length;
    if (total === 0) return { finished: 0, inProgress: 0, pending: 0, percent: 0, avgScore: 0 };

    const finished = participationData.filter(s => s.participationStatus === 'completed').length;
    const inProgress = participationData.filter(s => s.participationStatus === 'in-progress').length;
    const pending = participationData.filter(s => s.participationStatus === 'not-started').length;
    const percent = Math.round((finished / total) * 100);

    const completedScores = participationData.filter(s => s.score !== null).map(s => s.score);
    const avgScore = completedScores.length > 0
      ? Math.round(completedScores.reduce((a, b) => a + b, 0) / completedScores.length)
      : 0;

    return { finished, inProgress, pending, percent, avgScore };
  }, [selectedAgenda, participationData, classStudents]);

  // Handle open reminder modal
  const handleOpenReminder = (student) => {
    setTargetStudent(student);
    setReminderMessage(
      `Halo ${student.name}, jangan lupa untuk menyelesaikan "${selectedAgenda.title}" sebelum batas waktu berakhir pada ${selectedAgenda.endDate}. Semangat belajar ya! 🚀`
    );
    setShowReminderModal(true);
  };

  // Handle sending reminder
  const handleSendReminder = async () => {
    if (!reminderMessage.trim()) return;

    setIsSending(true);
    try {
      await broadcastPesanGuru({
        judul: `Pengingat: ${selectedAgenda.title}`,
        isi_pesan: reminderMessage,
        target_type: 'Spesifik',
        target_ids: [targetStudent.id]
      });

      toast.success(`Pengingat terkirim ke ${targetStudent.name}!`, {
        duration: 3000,
        icon: '🔔',
        style: {
          borderRadius: '1rem',
          background: '#f97316',
          color: '#fff',
          fontSize: '12px',
          fontWeight: 'bold',
          textTransform: 'uppercase'
        }
      });
      setShowReminderModal(false);
      setTargetStudent(null);
    } catch (err) {
      toast.error('Gagal mengirim pengingat.');
    } finally {
      setIsSending(false);
    }
  };

  // Auto select first session on tab/type change
  useEffect(() => {
    if (filteredAgendas.length > 0) {
      const exists = filteredAgendas.some(a => a.id === selectedAgendaId);
      if (!exists) {
        setSelectedAgendaId(filteredAgendas[0].id);
      }
    }
  }, [filteredAgendas, selectedAgendaId]);

  return (
    <div className="space-y-8 animate-fade-in pb-20 max-w-7xl mx-auto">

      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic">
            Sesi Latihan Kelas <span className="text-orange-600">{assignedClass}</span>
          </h1>
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2">
            Pantau dan kelola jadwal latihan mandiri serta sesi latihan siswa Anda
          </p>
        </div>

        {/* Quick Type Selection */}
        <div className="flex bg-slate-100 dark:bg-slate-800/50 p-1 rounded-[1rem] border border-slate-200 dark:border-slate-700/50 shadow-sm overflow-x-auto no-scrollbar">
          {['Semua', 'Simulasi TKA', 'Latihan Mandiri'].map((t) => (
            <button
              key={t}
              onClick={() => setSelectedType(t)}
              className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${selectedType === t
                ? 'bg-white dark:bg-slate-700 text-orange-600 shadow-sm border border-slate-200/50 dark:border-slate-600'
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 border border-transparent'
                }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* MAIN GRID CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">

        {/* LEFT COLUMN: SESSIONS LIST */}
        <div className="lg:col-span-5 flex flex-col gap-4">

          {/* Tabs Menu */}
          <div className="flex bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-1 shadow-sm">
            <button
              onClick={() => setSelectedTab('aktif')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all ${selectedTab === 'aktif'
                ? 'bg-orange-50 dark:bg-orange-500/10 text-orange-600'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                }`}
            >
              <Sparkles size={14} /> Aktif
            </button>
            <button
              onClick={() => setSelectedTab('riwayat')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all ${selectedTab === 'riwayat'
                ? 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-white'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                }`}
            >
              <CalendarDays size={14} /> Riwayat
            </button>
          </div>

          {/* Session Cards */}
          {isLoading ? (
            <div className="p-12 text-center bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-100 dark:border-slate-700">
              <div className="animate-spin w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-4" />
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Memuat Sesi Latihan...</p>
            </div>
          ) : filteredAgendas.length > 0 ? (
            <div className="flex flex-col gap-4 max-h-[700px] overflow-y-auto pr-2 custom-scrollbar">
              {filteredAgendas.map((agenda) => {
                const isSelected = selectedAgendaId === agenda.id;
                const totalStudents = classStudents.length;
                const completedCount = agenda.participation.filter(item => item.status === 'completed').length;
                const partPercent = Math.round((completedCount / totalStudents) * 100);

                return (
                  <div
                    key={agenda.id}
                    onClick={() => setSelectedAgendaId(agenda.id)}
                    className={`p-5 rounded-[1.5rem] transition-all cursor-pointer text-left relative overflow-hidden group border ${isSelected
                      ? 'bg-orange-50/50 dark:bg-orange-500/10 border-orange-300 dark:border-orange-500/50 shadow-sm ring-4 ring-orange-500/10'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-orange-300 dark:hover:border-orange-500/50'
                      }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <span className={`px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-widest ${agenda.type === 'Sesi Latihan'
                        ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400'
                        : 'bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400'
                        }`}>
                        {agenda.type}
                      </span>
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 dark:text-slate-400">
                        <Clock size={12} />
                        {agenda.duration}
                      </div>
                    </div>

                    <h4 className={`text-sm font-black leading-snug tracking-tight mb-4 pr-6 line-clamp-2 ${isSelected ? 'text-orange-900 dark:text-orange-100' : 'text-slate-800 dark:text-white'}`}>
                      {agenda.title}
                    </h4>

                    <div className="space-y-2 border-t border-slate-100 dark:border-slate-700/50 pt-4">
                      <div className="flex justify-between items-end">
                        <div className="text-[9px] font-bold text-slate-500 dark:text-slate-400 space-y-0.5">
                          <p>Batas Akhir:</p>
                          <p className="text-slate-800 dark:text-slate-200">{agenda.endDate}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Selesai</p>
                          <p className={`text-xs font-black ${isSelected ? 'text-orange-600' : 'text-slate-700 dark:text-slate-300'}`}>
                            {partPercent}%
                          </p>
                        </div>
                      </div>
                      <div className="h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${isSelected ? 'bg-orange-500' : 'bg-slate-400 dark:bg-slate-500'}`}
                          style={{ width: `${partPercent}%` }}
                        />
                      </div>
                    </div>

                    <div className={`absolute right-4 top-1/2 -translate-y-1/2 transition-all duration-300 ${isSelected ? 'opacity-100 translate-x-0 text-orange-500' : 'opacity-0 -translate-x-2'}`}>
                      <ChevronRight size={20} />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-16 text-center bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-100 dark:border-slate-700">
              <CalendarDays size={40} className="text-slate-300 dark:text-slate-600 mx-auto mb-4" />
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tidak Ada Sesi {selectedType}</p>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: SESSION DETAIL & PARTICIPATION */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {selectedAgenda ? (
            <>
              {/* Top Stats Card */}
              <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-[2rem] border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden">
                <div className="flex flex-col md:flex-row gap-6 justify-between items-start mb-8 relative z-10">
                  <div className="space-y-3">
                    <span className="inline-block px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-[10px] font-black uppercase tracking-widest">
                      Detail Performa
                    </span>
                    <h2 className="text-xl md:text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight leading-snug">
                      {selectedAgenda.title}
                    </h2>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 leading-relaxed max-w-lg">
                      {selectedAgenda.description}
                    </p>
                  </div>
                </div>

                {/* 3 Stats Columns */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 relative z-10">
                  <div className="p-4 bg-teal-50 dark:bg-teal-900/10 border border-teal-100 dark:border-teal-900/30 rounded-2xl flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-900/50 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
                      <Target size={20} />
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-teal-600/70 dark:text-teal-400/70 uppercase tracking-widest mb-0.5">Partisipasi</p>
                      <p className="text-lg font-black text-teal-700 dark:text-teal-300">{stats.percent}%</p>
                    </div>
                  </div>

                  <div className="p-4 bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-900/30 rounded-2xl flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                      <CheckCircle2 size={20} />
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-indigo-600/70 dark:text-indigo-400/70 uppercase tracking-widest mb-0.5">Rata-rata Skor</p>
                      <p className="text-lg font-black text-indigo-700 dark:text-indigo-300">{stats.avgScore || '-'}</p>
                    </div>
                  </div>

                  <div className="p-4 bg-rose-50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-900/30 rounded-2xl flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                      <AlertCircle size={20} />
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-rose-600/70 dark:text-rose-400/70 uppercase tracking-widest mb-0.5">Belum Ujian</p>
                      <p className="text-lg font-black text-rose-700 dark:text-rose-300">{stats.pending} <span className="text-xs">Siswa</span></p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Student List Card */}
              <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-[2rem] border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col min-h-[400px]">

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <div>
                    <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-tight">
                      Daftar Partisipasi Siswa
                    </h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Total {classStudents.length} Siswa di Kelas {assignedClass}</p>
                  </div>

                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                      type="text"
                      placeholder="Cari nama siswa..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-11 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all dark:text-white"
                    />
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3 max-h-[500px]">
                  {filteredParticipation.length > 0 ? (
                    filteredParticipation.map((student) => (
                      <div
                        key={student.id}
                        className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-700/50 hover:border-slate-300 dark:hover:border-slate-600 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        {/* Student Identity */}
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-[12px] font-black text-indigo-600 dark:text-indigo-400 uppercase shrink-0 border border-indigo-100 dark:border-indigo-800">
                            {student.avatar}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-800 dark:text-white tracking-tight leading-none mb-1.5">
                              {student.name}
                            </p>
                            <div className="flex items-center gap-1.5">
                              <span className={`w-2 h-2 rounded-full ${student.participationStatus === 'completed' ? 'bg-teal-500' :
                                student.participationStatus === 'in-progress' ? 'bg-amber-400 animate-pulse' :
                                  'bg-slate-300 dark:bg-slate-600'
                                }`} />
                              <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                                {student.participationStatus === 'completed' ? 'Selesai Mengerjakan' :
                                  student.participationStatus === 'in-progress' ? 'Sedang Mengerjakan' :
                                    'Belum Mulai'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Status/Action Area */}
                        <div className="flex items-center justify-between sm:justify-end gap-6 sm:min-w-[120px]">
                          {student.participationStatus === 'completed' ? (
                            <div className="text-right">
                              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">Skor Akhir</span>
                              <span className="text-lg font-black text-teal-600 dark:text-teal-400">{student.score}</span>
                            </div>
                          ) : student.participationStatus === 'in-progress' ? (
                            <div className="text-right">
                              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">Status</span>
                              <span className="text-xs font-black text-amber-500 uppercase">Aktif</span>
                            </div>
                          ) : (
                            <div className="text-right">
                              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">Status</span>
                              <span className="text-xs font-black text-rose-500 uppercase">Kosong</span>
                            </div>
                          )}

                          {/* Reminder Button */}
                          {selectedTab === 'aktif' && student.participationStatus !== 'completed' && (
                            <button
                              onClick={() => handleOpenReminder(student)}
                              className="h-9 px-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-orange-500 hover:text-orange-600 dark:hover:text-orange-400 transition-all flex items-center gap-1.5 shrink-0"
                              title="Kirim Pengingat"
                            >
                              <Bell size={12} />
                              <span className="hidden sm:inline">Ingatkan</span>
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-16 text-center">
                      <Users size={32} className="text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Siswa tidak ditemukan</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="p-16 text-center bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-200 dark:border-slate-700 h-full flex flex-col items-center justify-center min-h-[400px]">
              <CalendarDays size={48} className="text-slate-300 dark:text-slate-600 mx-auto mb-4" />
              <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase max-w-sm">Pilih sesi di panel kiri untuk memantau performa kelas secara detail.</p>
            </div>
          )}
        </div>
      </div>

      {/* REMINDER MODAL */}
      {showReminderModal && targetStudent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowReminderModal(false)} />
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-700 p-8 md:p-10 animate-in zoom-in-95 duration-200">

            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 bg-orange-50 dark:bg-orange-900/30 rounded-2xl flex items-center justify-center text-orange-600 dark:text-orange-400 shrink-0">
                <Megaphone size={24} />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight leading-none mb-1.5">Kirim Pengingat</h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Peringatan Tugas Belum Selesai</p>
              </div>
            </div>

            <div className="space-y-5">
              <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700/50 rounded-2xl flex justify-between items-center">
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Penerima</p>
                  <p className="text-sm font-bold text-slate-800 dark:text-white">{targetStudent.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Kelas</p>
                  <p className="text-sm font-black text-orange-600 dark:text-orange-400">{assignedClass}</p>
                </div>
              </div>

              <div className="space-y-2.5">
                <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Isi Pesan</label>
                <textarea
                  value={reminderMessage}
                  onChange={(e) => setReminderMessage(e.target.value.slice(0, 300))}
                  className="w-full h-32 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all dark:text-white resize-none"
                />
                <div className="text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  {reminderMessage.length} / 300
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-teal-50 dark:bg-teal-900/10 rounded-2xl border border-teal-100 dark:border-teal-900/20">
                <Info size={16} className="text-teal-600 shrink-0 mt-0.5" />
                <p className="text-[10px] font-black tracking-wide text-teal-700 dark:text-teal-400 uppercase leading-relaxed">
                  Pesan ini akan dikirimkan langsung ke dashboard siswa sebagai notifikasi prioritas tinggi.
                </p>
              </div>
            </div>

            <div className="flex gap-4 mt-8 pt-6 border-t border-slate-100 dark:border-slate-700">
              <button
                onClick={() => {
                  setShowReminderModal(false);
                  setTargetStudent(null);
                }}
                className="flex-1 py-4 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-all"
              >
                Batal
              </button>
              <button
                onClick={handleSendReminder}
                disabled={isSending || !reminderMessage.trim()}
                className="flex-1 py-4 bg-orange-600 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-lg shadow-orange-600/20 hover:bg-orange-700 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSending ? 'Mengirim...' : 'Kirim Pengingat'} <Send size={14} />
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
