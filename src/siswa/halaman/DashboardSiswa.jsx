import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  GraduationCap,
  ChevronRight,
  UserCircle,
  Award,
  History,
  Flame
} from 'lucide-react';
import { Link } from 'react-router-dom';

import SkeletonLoading from '@/komponen/ui/SkeletonMemuat';

import CountdownTimer from '@/komponen/siswa/Dashboard/PenghitungWaktu';
import { AcademicProgress } from '@/komponen/siswa/Dashboard/WidgetProgres';
import LoginStreakModal from '@/komponen/siswa/ModalStreakLogin';

// User Context Hook
import { useUser } from '@/konteks/KonteksPengguna';

import { getDashboardData } from '@/utilitas/apiSiswa';

export default function StudentDashboard() {
  const { currentUser } = useUser();
  const [isStreakModalOpen, setIsStreakModalOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showReminder, setShowReminder] = useState(true);

  const isMale = currentUser?.gender === 'Laki-laki';

  // Timer logic for Ujian TKA
  const targetDate = new Date('2026-06-25');
  const today = new Date();
  const diffTime = Math.max(0, targetDate - today);
  const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await getDashboardData();
        const progressLatihan = response.progressLatihan || response.progress_latihan || [];
        const modulAktif = response.modulAktif || response.modul_aktif || [];
        const sesiTerdekat = response.sesiLatihanTerdekat || response.sesi_latihan_terdekat || null;

        setDashboardData({
          progress: {
            simulations: {
              completed: response.statistik?.totalSimulasi ?? response.statistik?.totalSesiLatihan ?? 0,
              total: response.statistik?.totalSimulasi ?? response.statistik?.totalSesiLatihan ?? 0,
              percentage: 0
            },
            modules: {
              completed: response.statistik?.modulSelesai ?? 0,
              total: modulAktif.length,
              percentage: modulAktif.length > 0 ? Math.round(((response.statistik?.modulSelesai ?? 0) / modulAktif.length) * 100) : 0
            }
          },
          upcoming_exams: sesiTerdekat ? [sesiTerdekat] : [],
          recent_results: progressLatihan.map((item) => ({
            attempt_id: item.id,
            exam_title: item.jenis === 'latihan_mandiri' ? 'Latihan Mandiri' : 'Simulasi TKA',
            subject: item.jenis,
            total_score: item.nilai
          })),
          modules: modulAktif
        });
      } catch (error) {
        console.error('gagal memuat data dashboard siswa', error);
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

  const recentResults = dashboardData?.recent_results || [];
  const modules = dashboardData?.modules || [];

  return (
    <div id="student-dashboard" className="space-y-8 animate-fade-in max-w-7xl mx-auto pb-10">

      <CountdownTimer daysLeft={daysLeft} />

      {showReminder && (
        <div className="relative overflow-hidden bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-rose-500/20 dark:from-amber-500/10 dark:to-rose-500/10 border-2 border-orange-200 dark:border-orange-950/50 p-6 rounded-[2.5rem] flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md animate-in slide-in-from-top duration-300">
          <div className="flex items-center gap-5 text-center sm:text-left flex-col sm:flex-row">
            <div className="w-14 h-14 bg-orange-500 text-white rounded-2xl flex items-center justify-center shadow-lg shrink-0">
              <span className="text-2xl">📢</span>
            </div>
            <div>
              <h4 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider">Penting: Persiapan Simulasi TKA Tahap Akhir!</h4>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-1">
                Jangan lupa untuk menyelesaikan materi pecahan dan gaya sebelum Simulasi TKA Nasional dimulai tanggal 15 Juni 2026.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto justify-center sm:justify-end shrink-0">
            <button
              onClick={() => setShowReminder(false)}
              className="px-5 py-3 bg-orange-600 hover:bg-orange-700 dark:bg-orange-600/20 dark:hover:bg-orange-600/40 border border-orange-500/30 text-white dark:text-orange-400 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-md active:scale-95"
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
          <AcademicProgress exams={dashboardData?.upcoming_exams || []} averageScore={dashboardData?.progress?.simulations?.percentage || 0} />
        </div>

        <div className="flex flex-col gap-6">
          {/* Agenda Mendatang */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 flex-1">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-black uppercase tracking-tight text-slate-800 dark:text-white flex items-center gap-2">
                <span className="text-orange-500">📅</span> Agenda Mendatang
              </h3>
            </div>
            <div className="space-y-4">
              <div className="p-3.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-2xl flex flex-col gap-1 text-center">
                <h4 className="text-xs font-black text-slate-750 dark:text-slate-200 uppercase tracking-tight leading-tight">Belum Ada Agenda Aktif</h4>
                <div className="flex items-center justify-center mt-1 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Menunggu jadwal latihan atau simulasi dari backend
                </div>
              </div>
            </div>
          </div>

          {/* Riwayat */}
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
                  Belum ada riwayat pengerjaan yang tersimpan
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
          <Link to="/latihan" className="text-xs font-black text-orange-500 uppercase tracking-widest flex items-center gap-1.5 hover:underline">
            Lihat Semua <ChevronRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {dashboardData?.upcoming_exams?.length > 0 ? (
            dashboardData.upcoming_exams.map((item) => (
              <div key={item.id} className="col-span-2 text-center py-10 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-3xl text-sm text-slate-700 dark:text-slate-200 font-bold">
                {item.judul || item.judul_sesi_latihan || 'Sesi latihan tersedia'}
              </div>
            ))
          ) : (
            <div className="col-span-2 text-center py-10 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-3xl text-sm text-slate-400 font-bold uppercase tracking-widest">
              Tidak ada sesi latihan atau simulasi aktif saat ini
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
          {modules.length > 0 ? modules.map((modul) => (
            <div key={modul.id_modul} className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-3xl p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <BookOpen size={18} className="text-orange-500" />
                <div>
                  <h4 className="font-black text-slate-800 dark:text-white">{modul.judul_modul}</h4>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{modul.mata_pelajaran}</p>
                </div>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-3">{modul.deskripsi || 'Modul belajar tersedia.'}</p>
            </div>
          )) : (
            <div className="col-span-full text-center py-10 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-3xl text-sm text-slate-400 font-bold uppercase tracking-widest">
              Belum ada modul aktif dari backend
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
