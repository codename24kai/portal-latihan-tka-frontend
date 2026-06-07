import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  GraduationCap,
  ChevronRight,
  UserCircle,
  Award,
  History,
  Flame,
  Play
} from 'lucide-react';
import { Link } from 'react-router-dom';

// Shared API Client
import api from '@/utilitas/api';

// UI Components
import ProgressBar from '@/komponen/ui/BarProgres';
import SkeletonLoading from '@/komponen/ui/SkeletonMemuat';

// Dashboard Components
import MissionCard from '@/komponen/siswa/KartuMisi';
import CountdownTimer from '@/komponen/siswa/Dasboard/PenghitungWaktu';
import { AcademicProgress } from '@/komponen/siswa/Dasboard/WidgetProgres';
import LoginStreakModal from '@/komponen/siswa/ModalStreakLogin';

// User Context Hook
import { useUser } from '@/konteks/KonteksPengguna';

export default function StudentDashboard() {
  const { currentUser } = useUser();
  const [isStreakModalOpen, setIsStreakModalOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showReminder, setShowReminder] = useState(true);

  const isMale = currentUser?.gender === 'Laki-laki';

  // Timer logic for Ujian TKA
  const targetDate = new Date('2026-06-15');
  const today = new Date();
  const diffTime = Math.max(0, targetDate - today);
  const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get('/dashboard/student');
        setDashboardData(response.data.data);
      } catch (error) {
        console.error('Failed to load student dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-8 p-6">
        <SkeletonLoading className="h-20 w-full rounded-2xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <SkeletonLoading className="h-64 lg:col-span-2 rounded-3xl" />
          <SkeletonLoading className="h-64 rounded-3xl" />
        </div>
        <SkeletonLoading className="h-48 w-full rounded-3xl" />
      </div>
    );
  }

  const progress = dashboardData?.progress || {
    simulations: { completed: 0, total: 0, percentage: 0 },
    modules: { completed: 0, total: 0, percentage: 0 }
  };

  const upcomingExams = dashboardData?.upcoming_exams || [];
  const recentResults = dashboardData?.recent_results || [];

  // Map progress to standard format for AcademicProgress
  const academicProgressMockList = [
    { subject: 'Matematika', score: progress.simulations.percentage },
    { subject: 'B. Indonesia', score: progress.modules.percentage }
  ];

  return (
    <div id="student-dashboard" className="space-y-8 animate-fade-in">

      <CountdownTimer daysLeft={daysLeft} />

      {showReminder && (
        <div className="relative overflow-hidden bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-rose-500/20 dark:from-amber-500/10 dark:to-rose-500/10 border-2 border-orange-200 dark:border-orange-900/50 p-6 rounded-[2.5rem] flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md animate-in slide-in-from-top duration-300">
          <div className="flex items-center gap-5 text-center sm:text-left flex-col sm:flex-row">
            <div className="w-14 h-14 bg-orange-500 text-white rounded-2xl flex items-center justify-center shadow-lg shrink-0">
              <span className="text-2xl">📢</span>
            </div>
            <div>
              <h4 className="text-sm font-black text-slate-850 dark:text-white uppercase tracking-wider">Penting: Persiapan Simulasi TKA Tahap Akhir!</h4>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-1">
                Jangan lupa untuk menyelesaikan materi pecahan dan gaya sebelum Simulasi TKA Nasional dimulai tanggal 15 Juni 2026.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto justify-center sm:justify-end shrink-0">
            <button
              onClick={() => setShowReminder(false)}
              className="px-5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-500 dark:text-slate-300 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-sm"
            >
              Tutup Pengingat
            </button>
          </div>
        </div>
      )}

      {/* 1. PROFILE HEADER */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-8 text-center sm:text-left">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className={`w-20 h-20 rounded-3xl flex items-center justify-center shadow-xl border-4 border-white dark:border-slate-800 shrink-0 transform transition-transform hover:rotate-3 overflow-hidden ${!currentUser?.profile_pic && (isMale
            ? 'bg-gradient-to-br from-teal-400 to-teal-600'
            : 'bg-gradient-to-br from-orange-400 to-yellow-500')
            }`}>
            {currentUser?.profile_pic ? (
              <img
                src={currentUser.profile_pic}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <UserCircle size={44} className="text-white/90" />
            )}
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-800 dark:text-white leading-tight tracking-tight">
              Halo, {(currentUser?.name || 'Siswa').split(' ')[0]}! 👋
            </h2>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-2">
              <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full">
                <GraduationCap size={14} className="text-teal-600" />
                <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">{currentUser?.school || 'SD Negeri Muncul 02'}</p>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full">
                <Award size={14} className="text-orange-500" />
                <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">{currentUser?.class || 'Kelas 6'}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="relative z-50 flex items-center justify-center sm:justify-start">
          <button
            onClick={() => setIsStreakModalOpen(!isStreakModalOpen)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/30 text-orange-600 hover:bg-orange-100 hover:scale-105 transition-all shadow-md active:scale-95 group"
          >
            <Flame size={18} className="text-orange-500 group-hover:animate-pulse sm:w-5 sm:h-5" />
            <span className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap">15 Hari</span>
          </button>

          <LoginStreakModal
            isOpen={isStreakModalOpen}
            onClose={() => setIsStreakModalOpen(false)}
          />
        </div>
      </section>

      {/* 2. ACADEMIC PROGRESS & RECENT HISTORY */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <AcademicProgress exams={academicProgressMockList} averageScore={Math.round((progress.simulations.percentage + progress.modules.percentage) / 2)} />
        </div>

        <div className="flex flex-col gap-6">
          {/* S3: Agenda Mendatang */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 flex-1">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-black uppercase tracking-tight text-slate-800 dark:text-white flex items-center gap-2">
                <span className="text-orange-500">📅</span> Agenda Mendatang
              </h3>
            </div>
            <div className="space-y-4">
              {[
                { title: 'Simulasi TKA Matematika (Wajib)', date: '15 Juni 2026', time: '08:00 WIB' },
                { title: 'Pembahasan Soal Bersama Guru', date: '18 Juni 2026', time: '13:00 WIB' }
              ].map((agenda, index) => (
                <div key={index} className="p-3.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-2xl flex flex-col gap-1 hover:border-orange-200 transition-all">
                  <h4 className="text-xs font-black text-slate-750 dark:text-slate-200 uppercase tracking-tight leading-tight">{agenda.title}</h4>
                  <div className="flex items-center justify-between mt-1 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    <span>{agenda.date}</span>
                    <span className="text-teal-600 dark:text-teal-400">{agenda.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 flex-1">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-black uppercase tracking-tight text-slate-800 dark:text-white flex items-center gap-2">
                <History size={16} className="text-slate-400" /> Riwayat
              </h3>
            </div>
            <div className="space-y-4">
              {recentResults.length > 0 ? (
                recentResults.map((item) => (
                  <div key={item.attempt_id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center shrink-0">
                        <BookOpen size={14} className="text-slate-400" />
                      </div>
                      <div className="truncate">
                        <p className="text-xs font-bold text-slate-800 dark:text-white truncate">{item.exam_title}</p>
                        <p className="text-[10px] text-slate-400 font-medium">{item.subject}</p>
                      </div>
                    </div>
                    <div className="text-xs font-black text-teal-600 dark:text-teal-400">{Math.round(item.total_score)}</div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-xs text-slate-400 font-bold uppercase tracking-widest">
                  Belum ada ujian diselesaikan
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 3. OVERVIEW UJIAN/LATIHAN */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight">Latihan Terbaru</h3>
          <Link to="/ujian" className="text-xs font-black text-orange-500 uppercase tracking-widest flex items-center gap-1.5 hover:underline">
            Lihat Semua <ChevronRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {upcomingExams.length > 0 ? (
            upcomingExams.slice(0, 2).map((exam) => (
              <MissionCard key={exam.id} exam={exam} />
            ))
          ) : (
            <div className="col-span-2 text-center py-10 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-3xl text-sm text-slate-400 font-bold uppercase tracking-widest">
              Tidak ada simulasi/ujian aktif saat ini
            </div>
          )}
        </div>
      </section>

      {/* 4. OVERVIEW MODUL */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight">Modul Terbaru</h3>
          <Link to="/modul" className="text-xs font-black text-orange-500 uppercase tracking-widest flex items-center gap-1.5 hover:underline">
            Katalog Lengkap <ChevronRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { id: 1, title: 'Operasi Campuran Pecahan', subject: 'Matematika', heroImage: '/assets/hero/math-background-hero-3.jpg' },
            { id: 2, title: 'Konsep Gaya & Energi', subject: 'Sains', heroImage: '/assets/hero/kids-school.jpg' },
            { id: 3, title: 'Teks Narasi & Deskripsi', subject: 'Bahasa Indonesia', heroImage: '/assets/hero/bahasa-background-hero.jpg' },
          ].map((module) => (
            <Link
              to="/modul"
              key={module.id}
              className="group relative h-32 rounded-[2rem] overflow-hidden hover:shadow-xl transition-all"
            >
              <img
                src={module.heroImage}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                alt={module.title}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 p-5 w-full">
                <h4 className="font-black text-white text-sm truncate uppercase tracking-tight drop-shadow-md">{module.title}</h4>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-[9px] font-black text-white/70 uppercase tracking-widest drop-shadow-sm">{module.subject}</p>
                  <Play size={14} className="text-white/80" fill="currentColor" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
