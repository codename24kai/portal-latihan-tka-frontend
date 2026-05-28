import React, { useState, useEffect, useMemo } from 'react';
import {
  CalendarDays,
  Clock,
  Users,
  CheckCircle2,
  AlertCircle,
  Megaphone,
  Search,
  Filter,
  ArrowRight,
  TrendingUp,
  Send,
  Info,
  ChevronRight,
  Sparkles,
  BookOpen
} from 'lucide-react';
import toast from 'react-hot-toast';
import mockStudents from '@/data/mockSiswa';

export default function AgendaKelas() {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('aktif'); // 'aktif' | 'riwayat'
  const [selectedType, setSelectedType] = useState('Semua'); // 'Semua' | 'Simulasi TKA' | 'Latihan Mandiri'
  const [selectedAgendaId, setSelectedAgendaId] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Reminder modal state
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [targetStudent, setTargetStudent] = useState(null);
  const [reminderMessage, setReminderMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const assignedClass = localStorage.getItem('assignedClass') ?? '6A';

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  // Filter students for this class
  const classStudents = useMemo(() => {
    return (mockStudents ?? []).filter(s => s?.class === assignedClass);
  }, [assignedClass]);

  // Mock Agendas
  const mockAgendas = [
    {
      id: 1,
      title: 'Tryout TKA Matematika - Batch B',
      type: 'Simulasi TKA',
      startDate: '2026-05-26 08:00',
      endDate: '2026-05-30 23:59',
      duration: '90 Menit',
      status: 'aktif',
      questions: 40,
      description: 'Simulasi ujian matematika berbasis materi TKA standar nasional.',
      participation: [
        { studentId: 1, status: 'completed', score: 88, submittedAt: '2026-05-27 10:15' },
        { studentId: 2, status: 'completed', score: 72, submittedAt: '2026-05-27 14:30' },
        { studentId: 4, status: 'not-started', score: null, submittedAt: null },
        { studentId: 6, status: 'in-progress', score: null, submittedAt: null },
        { studentId: 8, status: 'completed', score: 78, submittedAt: '2026-05-26 11:00' },
        { studentId: 10, status: 'not-started', score: null, submittedAt: null },
      ]
    },
    {
      id: 2,
      title: 'Latihan Mandiri Aljabar & Geometri',
      type: 'Latihan Mandiri',
      startDate: '2026-05-25 07:00',
      endDate: '2026-05-28 18:00',
      duration: '45 Menit',
      status: 'aktif',
      questions: 20,
      description: 'Latihan soal mandiri untuk mengasah pemahaman topik aljabar dasar dan geometri ruang.',
      participation: [
        { studentId: 1, status: 'completed', score: 95, submittedAt: '2026-05-25 09:00' },
        { studentId: 2, status: 'not-started', score: null, submittedAt: null },
        { studentId: 4, status: 'completed', score: 65, submittedAt: '2026-05-26 15:45' },
        { studentId: 6, status: 'not-started', score: null, submittedAt: null },
        { studentId: 8, status: 'completed', score: 80, submittedAt: '2026-05-25 16:30' },
        { studentId: 10, status: 'completed', score: 85, submittedAt: '2026-05-26 10:00' },
      ]
    },
    {
      id: 3,
      title: 'Tryout Akbar Bahasa Indonesia',
      type: 'Simulasi TKA',
      startDate: '2026-06-01 08:00',
      endDate: '2026-06-05 23:59',
      duration: '75 Menit',
      status: 'aktif',
      questions: 35,
      description: 'Ujian literasi bahasa Indonesia komprehensif mencakup membaca kritis & penalaran analitis.',
      participation: [
        { studentId: 1, status: 'not-started', score: null, submittedAt: null },
        { studentId: 2, status: 'not-started', score: null, submittedAt: null },
        { studentId: 4, status: 'not-started', score: null, submittedAt: null },
        { studentId: 6, status: 'not-started', score: null, submittedAt: null },
        { studentId: 8, status: 'not-started', score: null, submittedAt: null },
        { studentId: 10, status: 'not-started', score: null, submittedAt: null },
      ]
    },
    {
      id: 4,
      title: 'Latihan Soal Literasi & Penalaran',
      type: 'Latihan Mandiri',
      startDate: '2026-05-27 12:00',
      endDate: '2026-06-02 20:00',
      duration: '50 Menit',
      status: 'aktif',
      questions: 25,
      description: 'Latihan mandiri penalaran logis serta literasi bahasa untuk memperkuat skor TKA.',
      participation: [
        { studentId: 1, status: 'completed', score: 90, submittedAt: '2026-05-27 13:00' },
        { studentId: 2, status: 'not-started', score: null, submittedAt: null },
        { studentId: 4, status: 'not-started', score: null, submittedAt: null },
        { studentId: 6, status: 'not-started', score: null, submittedAt: null },
        { studentId: 8, status: 'in-progress', score: null, submittedAt: null },
        { studentId: 10, status: 'not-started', score: null, submittedAt: null },
      ]
    },
    {
      id: 5,
      title: 'Simulasi Evaluasi TKA Awal',
      type: 'Simulasi TKA',
      startDate: '2026-05-10 08:00',
      endDate: '2026-05-14 23:59',
      duration: '90 Menit',
      status: 'riwayat',
      questions: 40,
      description: 'Simulasi pemetaan kemampuan awal siswa sebelum bimbingan belajar TKA intensif dimulai.',
      participation: [
        { studentId: 1, status: 'completed', score: 85, submittedAt: '2026-05-11 09:20' },
        { studentId: 2, status: 'completed', score: 70, submittedAt: '2026-05-12 10:15' },
        { studentId: 4, status: 'completed', score: 60, submittedAt: '2026-05-13 14:00' },
        { studentId: 6, status: 'completed', score: 55, submittedAt: '2026-05-14 16:30' },
        { studentId: 8, status: 'completed', score: 75, submittedAt: '2026-05-11 11:45' },
        { studentId: 10, status: 'completed', score: 80, submittedAt: '2026-05-12 08:30' },
      ]
    },
    {
      id: 6,
      title: 'Latihan Mandiri Dasar Trigonometri',
      type: 'Latihan Mandiri',
      startDate: '2026-05-18 07:00',
      endDate: '2026-05-20 22:00',
      duration: '30 Menit',
      status: 'riwayat',
      questions: 15,
      description: 'Latihan pemantapan rumus dasar sin, cos, tan dan segitiga siku-siku.',
      participation: [
        { studentId: 1, status: 'completed', score: 90, submittedAt: '2026-05-19 14:00' },
        { studentId: 2, status: 'completed', score: 75, submittedAt: '2026-05-19 15:30' },
        { studentId: 4, status: 'completed', score: 70, submittedAt: '2026-05-18 09:15' },
        { studentId: 6, status: 'not-started', score: null, submittedAt: null },
        { studentId: 8, status: 'completed', score: 80, submittedAt: '2026-05-19 10:00' },
        { studentId: 10, status: 'completed', score: 85, submittedAt: '2026-05-20 11:00' },
      ]
    }
  ];

  // Filtered Agendas
  const filteredAgendas = useMemo(() => {
    return mockAgendas.filter(agenda => {
      const matchTab = agenda.status === selectedTab;
      const matchType = selectedType === 'Semua' || agenda.type === selectedType;
      return matchTab && matchType;
    });
  }, [selectedTab, selectedType]);

  // Selected Agenda details
  const selectedAgenda = useMemo(() => {
    return mockAgendas.find(a => a.id === selectedAgendaId) || mockAgendas[0];
  }, [selectedAgendaId]);

  // Participation Data for Selected Agenda
  const participationData = useMemo(() => {
    if (!selectedAgenda) return [];
    
    // Map class students to their participation in this agenda
    return classStudents.map(student => {
      const p = selectedAgenda.participation.find(item => item.studentId === student.id);
      return {
        ...student,
        participationStatus: p ? p.status : 'not-started', // 'completed' | 'in-progress' | 'not-started'
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

    return {
      finished,
      inProgress,
      pending,
      percent,
      avgScore
    };
  }, [selectedAgenda, participationData, classStudents]);

  // Handle open reminder modal
  const handleOpenReminder = (student) => {
    setTargetStudent(student);
    setReminderMessage(
      `Halo ${student.name}, jangan lupa untuk menyelesaikan "${selectedAgenda.title}" sebelum batas waktu berakhir pada ${selectedAgenda.endDate}. Semangat persiapan TKA-nya! 🚀`
    );
    setShowReminderModal(true);
  };

  // Handle sending reminder (mocked action)
  const handleSendReminder = () => {
    if (!reminderMessage.trim()) return;
    
    setIsSending(true);
    setTimeout(() => {
      toast.success(`Pengingat terkirim ke ${targetStudent.name}!`, {
        duration: 3000,
        icon: '🔔',
        style: {
          borderRadius: '1rem',
          background: '#14b8a6',
          color: '#fff',
          fontSize: '12px',
          fontWeight: 'bold',
          textTransform: 'uppercase'
        }
      });
      setIsSending(false);
      setShowReminderModal(false);
      setTargetStudent(null);
    }, 800);
  };

  // Auto select first agenda on tab/type change
  useEffect(() => {
    if (filteredAgendas.length > 0) {
      // Find if current selection is in the new list, if not, select the first
      const exists = filteredAgendas.some(a => a.id === selectedAgendaId);
      if (!exists) {
        setSelectedAgendaId(filteredAgendas[0].id);
      }
    }
  }, [filteredAgendas, selectedAgendaId]);

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight">
            Agenda Kelas {assignedClass}
          </h1>
          <p className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-widest italic">
            Monitor jadwal latihan mandiri dan simulasi TKA siswa Anda
          </p>
        </div>
        
        {/* Quick Type Selection */}
        <div className="flex gap-2 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200/50 dark:border-slate-700/50">
          {['Semua', 'Simulasi TKA', 'Latihan Mandiri'].map((t) => (
            <button
              key={t}
              onClick={() => setSelectedType(t)}
              className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                selectedType === t
                  ? 'bg-orange-600 text-white shadow-md shadow-orange-600/10'
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-700'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setSelectedTab('aktif')}
          className={`flex items-center gap-2 px-6 py-4 border-b-2 font-black uppercase tracking-widest text-[11px] transition-all ${
            selectedTab === 'aktif'
              ? 'border-orange-600 text-orange-600 dark:text-orange-500'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          <Sparkles size={16} /> Agenda Aktif & Mendatang
        </button>
        <button
          onClick={() => setSelectedTab('riwayat')}
          className={`flex items-center gap-2 px-6 py-4 border-b-2 font-black uppercase tracking-widest text-[11px] transition-all ${
            selectedTab === 'riwayat'
              ? 'border-orange-600 text-orange-600 dark:text-orange-500'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          <CalendarDays size={16} /> Riwayat Agenda Selesai
        </button>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Agendas List */}
        <div className="lg:col-span-5 space-y-4">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
            Daftar Agenda ({filteredAgendas.length})
          </h3>
          
          {isLoading ? (
            <div className="p-8 text-center bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-100 dark:border-slate-700">
              <div className="animate-spin w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-400 uppercase">Memuat Agenda...</p>
            </div>
          ) : filteredAgendas.length > 0 ? (
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
              {filteredAgendas.map((agenda) => {
                const isSelected = selectedAgendaId === agenda.id;
                const totalStudents = classStudents.length;
                const completedCount = agenda.participation.filter(item => item.status === 'completed').length;
                const partPercent = Math.round((completedCount / totalStudents) * 100);

                return (
                  <div
                    key={agenda.id}
                    onClick={() => setSelectedAgendaId(agenda.id)}
                    className={`p-6 rounded-[2rem] border transition-all cursor-pointer text-left relative overflow-hidden group ${
                      isSelected
                        ? 'bg-gradient-to-br from-slate-900 to-slate-800 text-white border-transparent shadow-xl dark:from-slate-800 dark:to-slate-750'
                        : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 hover:border-orange-500 hover:shadow-md'
                    }`}
                  >
                    {/* Top badging */}
                    <div className="flex justify-between items-center mb-3">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                        agenda.type === 'Simulasi TKA'
                          ? isSelected ? 'bg-orange-500 text-white' : 'bg-orange-50 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400'
                          : isSelected ? 'bg-teal-500 text-white' : 'bg-teal-50 dark:bg-teal-950/30 text-teal-600 dark:text-teal-400'
                      }`}>
                        {agenda.type}
                      </span>
                      <div className="flex items-center gap-1 text-[10px] opacity-75 font-semibold">
                        <Clock size={12} />
                        {agenda.duration}
                      </div>
                    </div>

                    {/* Title */}
                    <h4 className="text-sm font-black leading-tight uppercase tracking-tight mb-2">
                      {agenda.title}
                    </h4>

                    {/* Details */}
                    <p className={`text-[11px] font-bold leading-normal mb-4 ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}>
                      {agenda.description}
                    </p>

                    {/* Timeline */}
                    <div className="flex flex-col gap-1 text-[10px] font-bold opacity-80 mb-4">
                      <div>Mulai: <span className={isSelected ? 'text-white' : 'text-slate-700 dark:text-slate-350'}>{agenda.startDate}</span></div>
                      <div>Akhir: <span className={isSelected ? 'text-white' : 'text-slate-700 dark:text-slate-350'}>{agenda.endDate}</span></div>
                    </div>

                    {/* Progress Bar in list card */}
                    <div className="space-y-1.5 border-t border-slate-100 dark:border-slate-700 pt-4 mt-2">
                      <div className="flex justify-between text-[9px] font-black uppercase tracking-widest">
                        <span>Partisipasi</span>
                        <span>{partPercent}%</span>
                      </div>
                      <div className="h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isSelected ? 'bg-orange-500' : 'bg-teal-600'
                          }`}
                          style={{ width: `${partPercent}%` }}
                        />
                      </div>
                    </div>

                    {/* Active hover chevron */}
                    <div className={`absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 ${isSelected ? 'translate-x-0' : 'translate-x-2 text-orange-500'}`}>
                      <ChevronRight size={20} />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-12 text-center bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-100 dark:border-slate-700">
              <CalendarDays size={36} className="text-slate-300 mx-auto mb-3" />
              <p className="text-xs font-bold text-slate-400 uppercase">Tidak Ada Agenda {selectedType}</p>
            </div>
          )}
        </div>

        {/* Right Side: Agenda Detail & Student Participation */}
        <div className="lg:col-span-7 space-y-6">
          {selectedAgenda ? (
            <div className="space-y-6">
              
              {/* Agenda Details & Live Performance Header */}
              <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 dark:bg-orange-500/10 rounded-bl-[10rem] pointer-events-none" />
                
                <p className="text-[10px] font-black text-orange-600 uppercase tracking-[0.2em] mb-2">Detail Aktif & Performa</p>
                <h2 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight mb-4">
                  {selectedAgenda.title}
                </h2>
                
                {/* 3 Grid Stats */}
                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Partisipasi</p>
                    <p className="text-xl font-black text-orange-600">{stats.percent}%</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase mt-0.5">{stats.finished} / {classStudents.length} Siswa</p>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Rata-rata Skor</p>
                    <p className="text-xl font-black text-teal-600">{stats.avgScore || '-'}</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase mt-0.5">Siswa Selesai</p>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Belum Ujian</p>
                    <p className="text-xl font-black text-rose-500">{stats.pending}</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase mt-0.5">Perlu Diingatkan</p>
                  </div>
                </div>
              </div>

              {/* Student Participation Search & List */}
              <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm space-y-6">
                
                {/* Search header area */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <h3 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-widest">
                    Partisipasi Siswa Kelas {assignedClass}
                  </h3>
                  
                  {/* Search box */}
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-450 dark:text-slate-500" size={16} />
                    <input
                      type="text"
                      placeholder="Cari siswa..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-11 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all dark:text-white"
                    />
                  </div>
                </div>

                {/* Students list */}
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                  {filteredParticipation.length > 0 ? (
                    filteredParticipation.map((student) => {
                      return (
                        <div
                          key={student.id}
                          className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-transparent hover:border-slate-200 dark:hover:border-slate-750 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                        >
                          {/* Student identity */}
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-950/20 flex items-center justify-center text-[11px] font-black text-orange-600 uppercase">
                              {student.avatar}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-800 dark:text-white tracking-tight leading-none mb-1.5">
                                {student.name}
                              </p>
                              <div className="flex items-center gap-2">
                                <span className={`w-2.5 h-2.5 rounded-full ${
                                  student.participationStatus === 'completed'
                                    ? 'bg-teal-500'
                                    : student.participationStatus === 'in-progress'
                                    ? 'bg-amber-400 animate-pulse'
                                    : 'bg-slate-300 dark:bg-slate-600'
                                }`} />
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                                  {student.participationStatus === 'completed'
                                    ? 'Selesai'
                                    : student.participationStatus === 'in-progress'
                                    ? 'Mengerjakan'
                                    : 'Belum Mulai'}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Action area */}
                          <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-t-0 border-slate-100 dark:border-slate-800 pt-3 sm:pt-0">
                            {/* Score display */}
                            {student.participationStatus === 'completed' ? (
                              <div className="text-right">
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Nilai</span>
                                <span className="text-sm font-black text-teal-600">{student.score}</span>
                              </div>
                            ) : student.participationStatus === 'in-progress' ? (
                              <div className="text-right">
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Aktif</span>
                                <span className="text-[10px] font-black text-amber-500 uppercase">Sedang Mengerjakan</span>
                              </div>
                            ) : (
                              <div className="text-right">
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Status</span>
                                <span className="text-[10px] font-black text-rose-500 uppercase">Belum Mencoba</span>
                              </div>
                            )}

                            {/* Reminder button */}
                            {selectedTab === 'aktif' && student.participationStatus !== 'completed' && (
                              <button
                                onClick={() => handleOpenReminder(student)}
                                className="h-9 px-4 bg-orange-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-md shadow-orange-600/10 hover:bg-orange-700 transition-all hover:scale-105 active:scale-95"
                              >
                                Ingatkan
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="py-12 text-center">
                      <Users size={32} className="text-slate-350 mx-auto mb-3" />
                      <p className="text-xs font-bold text-slate-400 uppercase">Siswa tidak ditemukan</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-slate-700">
              <CalendarDays size={48} className="text-slate-300 mx-auto mb-4" />
              <p className="text-sm font-bold text-slate-400 uppercase">Pilih agenda di panel kiri untuk memantau performa kelas secara detail.</p>
            </div>
          )}
        </div>
      </div>

      {/* Reminder Modal */}
      {showReminderModal && targetStudent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowReminderModal(false)} />
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-2xl border border-slate-150 dark:border-slate-700 p-8 sm:p-10 animate-in zoom-in-95 duration-200">
            
            {/* Modal header */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-orange-50 dark:bg-orange-950/40 rounded-2xl flex items-center justify-center text-orange-600">
                <Megaphone size={24} />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-800 dark:text-white uppercase tracking-tight leading-none">Kirim Pengingat Tugas</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Ingatkan siswa untuk berpartisipasi</p>
              </div>
            </div>

            {/* Modal content input */}
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Siswa Tujuan</p>
                <p className="text-sm font-bold text-slate-750 dark:text-white uppercase tracking-tight">{targetStudent.name}</p>
                <p className="text-[10px] font-bold text-orange-600 uppercase tracking-wider mt-0.5">Kelas {assignedClass}</p>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Pesan Pengingat</label>
                <textarea
                  value={reminderMessage}
                  onChange={(e) => setReminderMessage(e.target.value.slice(0, 300))}
                  placeholder="Ketik pesan pengingat khusus..."
                  className="w-full h-32 p-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all dark:text-white resize-none leading-relaxed"
                />
                <div className="text-right text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                  {reminderMessage.length} / 300
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-teal-50 dark:bg-teal-900/10 rounded-2xl border border-teal-100 dark:border-teal-900/20">
                <Info size={16} className="text-teal-600 shrink-0" />
                <p className="text-[9px] font-bold text-teal-700 dark:text-teal-400 uppercase leading-relaxed">
                  Pesan pengingat akan muncul di dashboard siswa secara real-time.
                </p>
              </div>
            </div>

            {/* Modal actions */}
            <div className="flex gap-4 mt-8 border-t border-slate-100 dark:border-slate-700 pt-6">
              <button
                onClick={() => {
                  setShowReminderModal(false);
                  setTargetStudent(null);
                }}
                className="flex-1 py-3.5 bg-slate-100 dark:bg-slate-700 text-slate-400 font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-all"
              >
                Batal
              </button>
              <button
                onClick={handleSendReminder}
                disabled={isSending || !reminderMessage.trim()}
                className="flex-1 py-3.5 bg-orange-600 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-lg shadow-orange-600/20 hover:bg-orange-700 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSending ? 'Mengirim...' : 'Kirim Sekarang'} <Send size={12} />
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
