import React, { useState } from 'react';
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

// Shared Data & Hooks
import mockExams from '@/data/mockExams';

// UI Components
import ProgressBar from '@/components/ui/ProgressBar';

// Dashboard Components
import MissionCard from '@/student/components/MissionCard';
import CountdownTimer from '@/student/components/Dashboard/CountdownTimer';
import { AcademicProgress, SurveySection } from '@/student/components/Dashboard/ProgressWidgets';
import LoginStreakModal from '@/student/components/LoginStreakModal';

// Mock User Data
import { useUser } from '@/context/UserContext';

const recentModules = [
  { id: 1, title: 'Aljabar Dasar', subject: 'Matematika', heroImage: '/assets/hero/math-background-hero.jpg' },
  { id: 2, title: 'Kalimat Majemuk', subject: 'Bahasa Indonesia', heroImage: '/assets/hero/bahasa-background-hero.jpg' },
  { id: 4, title: 'Teks Prosedur', subject: 'B. Indonesia', heroImage: '/assets/hero/bahasa-background-hero.jpg' },
];

const recentHistory = [
  { id: 1, subject: 'Matematika - Aljabar', date: 'Hari ini, 10:00', score: 85, isFinished: true },
  { id: 2, subject: 'Bahasa Indonesia - Teks', date: 'Kemarin, 14:30', score: 90, isFinished: true },
  { id: 3, subject: 'Survei Karakter', date: '11 Apr 2026', score: null, isFinished: true },
];

export default function StudentDashboard() {
  const { currentUser } = useUser();
  const [isStreakModalOpen, setIsStreakModalOpen] = useState(false);
  const isMale = currentUser?.gender === 'Laki-laki';

  // Timer logic for Ujian TKA
  const targetDate = new Date('2026-05-15');
  const today = new Date();
  const diffTime = Math.max(0, targetDate - today);
  const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // Process Academic vs Survey
  const academicExams = mockExams.filter(exam =>
    exam.subject.includes('Matematika') || exam.subject.includes('Bahasa') || exam.subject.includes('B. Indonesia')
  );
  const surveyExams = mockExams.filter(exam =>
    !exam.subject.includes('Matematika') && !exam.subject.includes('Bahasa') && !exam.subject.includes('B. Indonesia')
  );

  const academicScores = academicExams.map(e => e.score || 0);
  const averageScore = academicScores.length > 0
    ? Math.round(academicScores.reduce((a, b) => a + b, 0) / academicScores.length)
    : 0;

  return (
    <div id="student-dashboard" className="space-y-8 animate-fade-in">

      <CountdownTimer daysLeft={daysLeft} />

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
                <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">{currentUser?.school}</p>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full">
                <Award size={14} className="text-orange-500" />
                <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">{currentUser?.class}</p>
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

      {/* 2. ACADEMIC & SURVEY SECTION + RECENT HISTORY */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <AcademicProgress exams={academicExams} averageScore={averageScore} />
          <SurveySection exams={surveyExams} />
        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-teal-600 rounded-3xl p-6 text-white flex flex-col shadow-xl shadow-teal-600/20 relative overflow-hidden shrink-0">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full translate-x-1/2 -translate-y-1/2 blur-2xl" />
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-4 relative z-10">
              <Award size={20} />
            </div>
            <h4 className="text-xl font-black dark:text-white leading-tight mb-2 relative z-10">Terus Berlatih!</h4>
            <div className="relative z-10">
              <ProgressBar progress={75} label="Minggu Ke-2: Selesai" color="bg-teal-300" className="!text-black" />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 flex-1">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-black uppercase tracking-tight text-slate-800 dark:text-white flex items-center gap-2">
                <History size={16} className="text-slate-400" /> Riwayat
              </h3>
            </div>
            <div className="space-y-4">
              {recentHistory.map((item) => (
                <div key={item.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center shrink-0">
                      <BookOpen size={14} className="text-slate-400" />
                    </div>
                    <div className="truncate">
                      <p className="text-xs font-bold text-slate-800 dark:text-white truncate">{item.subject}</p>
                      <p className="text-[10px] text-slate-400 font-medium">{item.date}</p>
                    </div>
                  </div>
                  {item.score !== null ? (
                    <div className="text-xs font-black text-teal-600 dark:text-teal-400">{item.score}</div>
                  ) : (
                    <div className="text-[10px] font-bold text-slate-400 px-2 py-1 bg-slate-50 dark:bg-slate-700/50 rounded-md">✓</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. OVERVIEW UJIAN/LATIHAN */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight">Ujian Yang Tersedia</h3>
          <Link to="/test" className="text-xs font-black text-orange-500 uppercase tracking-widest flex items-center gap-1.5 hover:underline">
            Lihat Semua <ChevronRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mockExams.slice(0, 2).map((exam) => (
            <MissionCard key={exam.id} exam={exam} />
          ))}
        </div>
      </section>

      {/* 4. OVERVIEW MODUL */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight">Modul Yang Tersedia</h3>
          <Link to="/modules" className="text-xs font-black text-orange-500 uppercase tracking-widest flex items-center gap-1.5 hover:underline">
            Katalog Lengkap <ChevronRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentModules.map((module) => (
            <Link
              to="/modules"
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
