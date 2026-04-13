import React from 'react';
import {
  TrendingUp,
  Clock,
  ArrowRight,
  BookOpen,
  Gamepad2,
  GraduationCap,
  Calendar,
  ChevronRight,
  Calculator,
  Globe,
  Heart,
  Book,
  Trees,
  UserCircle,
  Timer,
  Award,
  History
} from 'lucide-react';
import { Link } from 'react-router-dom';
import mockExams from '../../data/mockExams';
import MissionCard from '../components/MissionCard';
import { useDarkMode } from '../../hooks/useDarkMode';
import ProgressBar from '../../components/ui/ProgressBar';

// Mock User Data
const userData = {
  name: 'Budi Kialang',
  school: 'SD Negeri Muncul 02',
  class: 'Kelas 6-A',
  gender: 'Laki-laki',
  avatar: 'BK'
};

const recentModules = [
  { id: 1, title: 'Aljabar Dasar', subject: 'Matematika', icon: Calculator, color: 'text-teal-500', bg: 'bg-teal-50 dark:bg-teal-900/20' },
  { id: 2, title: 'Kalimat Majemuk', subject: 'Bahasa Indonesia', icon: Book, color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/20' },
  { id: 4, title: 'Teks Prosedur', subject: 'B. Indonesia', icon: Book, color: 'text-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-900/20' },
];

const recentHistory = [
  { id: 1, subject: 'Matematika - Aljabar', date: 'Hari ini, 10:00', score: 85, isFinished: true },
  { id: 2, subject: 'Bahasa Indonesia - Teks', date: 'Kemarin, 14:30', score: 90, isFinished: true },
  { id: 3, subject: 'Survei Karakter', date: '11 Apr 2026', score: null, isFinished: true },
];

export default function StudentDashboard() {
  const { isDark } = useDarkMode();
  const isMale = userData.gender === 'Laki-laki';

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

  // Calculate Average from Academic exams
  const academicScores = academicExams.map(e => e.score || 0);
  const averageScore = academicScores.length > 0 
    ? Math.round(academicScores.reduce((a, b) => a + b, 0) / academicScores.length)
    : 0;

  return (
    <div id="student-dashboard" className="space-y-8 animate-fade-in">
      
      {/* COUNTDOWN TIMER WIDGET */}
      <div className="bg-gradient-to-r from-orange-500 to-yellow-500 rounded-[2rem] p-6 shadow-xl text-white flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden group">
         {/* Background pattern */}
         <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
         
         <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
           <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md shadow-inner">
             <Timer size={32} className="text-white" />
           </div>
           <div>
             <h3 className="font-black text-xl tracking-tight">Persiapan Ujian TKA</h3>
             <p className="text-white/80 text-xs font-bold uppercase tracking-[0.2em] mt-1">Fokus dan raih nilai terbaik!</p>
           </div>
         </div>
         <div className="flex items-center gap-4 bg-black/10 backdrop-blur-sm self-stretch sm:self-auto px-6 py-3 rounded-2xl border border-white/10">
           <div className="text-right">
             <div className="text-3xl font-black leading-none">{daysLeft}</div>
             <div className="text-[10px] font-black uppercase tracking-widest text-white/70 mt-1">Hari Lagi</div>
           </div>
           <ChevronRight size={20} className="text-white/40" />
         </div>
      </div>

      {/* 1. PROFILE HEADER */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-8 text-center sm:text-left">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className={`w-20 h-20 rounded-3xl flex items-center justify-center shadow-xl border-4 border-white dark:border-slate-800 shrink-0 transform transition-transform hover:rotate-3 ${isMale
              ? 'bg-gradient-to-br from-teal-400 to-teal-600'
              : 'bg-gradient-to-br from-orange-400 to-yellow-500'
            }`}>
            <UserCircle size={44} className="text-white/90" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-800 dark:text-white leading-tight tracking-tight">
              Halo, {userData.name.split(' ')[0]}! 👋
            </h2>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-2">
              <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full">
                <GraduationCap size={14} className="text-teal-600" />
                <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                  {userData.school}
                </p>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full">
                <Award size={14} className="text-orange-500" />
                <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                  {userData.class}
                </p>
              </div>
            </div>
            {/* STREAK WIDGET IN HEADER */}
            <div className="mt-3 text-xs font-bold text-orange-500 dark:text-orange-400 flex items-center justify-center sm:justify-start gap-2 bg-orange-50 dark:bg-orange-950/20 w-fit sm:mx-0 mx-auto px-4 py-1.5 rounded-full border border-orange-100 dark:border-orange-900/30">
              <span className="animate-bounce">🔥</span> 5 Hari Belajar Berturut-turut!
            </div>
          </div>
        </div>
        <button className="hidden sm:flex items-center justify-center w-14 h-14 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm text-slate-400 hover:text-teal-600 transition-all hover:shadow-md active:scale-90">
          <Calendar size={24} />
        </button>
      </section>

      {/* 2. ACADEMIC & SURVEY SECTION + RECENT HISTORY */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Score & Progress (Academic vs Survey) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-black uppercase tracking-tight text-slate-800 dark:text-white">Kemampuan Akademik</h3>
                <p className="text-xs font-bold text-slate-400 tracking-widest mt-0.5">Skor Rata-rata: {averageScore}%</p>
              </div>
              <div className="flex items-center gap-1 text-teal-600 bg-teal-50 dark:bg-teal-500/10 px-3 py-1.5 rounded-lg text-xs font-black">
                <TrendingUp size={14} /> +5%
              </div>
            </div>

            <div className="space-y-6">
              {academicExams.map((exam, idx) => (
                <div key={idx} className="space-y-2">
                  <ProgressBar 
                    progress={exam.score || 0} 
                    label={exam.subject.includes('Matematika') ? 'Matematika' : 'B. Indonesia'}
                    color={exam.subject.includes('Matematika') ? 'bg-teal-500' : 'bg-orange-400'}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Survey Lingkungan & Karakter */}
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-3xl p-6 border border-slate-100 dark:border-slate-700/50">
            <h3 className="text-sm font-black uppercase tracking-tight text-slate-800 dark:text-white mb-4">Survei Lingkungan & Karakter</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {surveyExams.map((exam, idx) => (
                 <div key={idx} className="flex items-center gap-3 bg-white dark:bg-slate-800 p-3 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
                   <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${exam.subject.includes('Lingkungan') ? 'bg-teal-50 text-teal-600 dark:bg-teal-900/30' : 'bg-yellow-50 text-yellow-600 dark:bg-yellow-900/30'}`}>
                     {exam.subject.includes('Lingkungan') ? <Trees size={20} /> : <Heart size={20} />}
                   </div>
                   <div className="overflow-hidden">
                     <p className="text-xs font-bold text-slate-800 dark:text-white truncate">
                       {exam.subject.includes('Lingkungan') ? 'Lingkungan Belajar' : 'Karakter Singkat'}
                     </p>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Selesai</p>
                   </div>
                 </div>
              ))}
            </div>
          </div>
        </div>

        {/* History / Motivation Card */}
        <div className="flex flex-col gap-6">
          <div className="bg-teal-600 rounded-3xl p-6 text-white flex flex-col shadow-xl shadow-teal-600/20 relative overflow-hidden shrink-0">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full translate-x-1/2 -translate-y-1/2 blur-2xl" />
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-4 relative z-10">
              <Award size={20} />
            </div>
            <h4 className="text-xl font-black leading-tight mb-2 relative z-10">Terus Berlatih!</h4>
            <div className="relative z-10">
              <ProgressBar 
                progress={75} 
                label="Minggu Ke-2: Selesai" 
                color="bg-white" 
                className="!text-white"
              />
            </div>
          </div>

          {/* RECENT HISTORY WIDGET */}
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
          <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight">Overview Ujian</h3>
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
          <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight">Overview Modul</h3>
          <Link to="/modules" className="text-xs font-black text-orange-500 uppercase tracking-widest flex items-center gap-1.5 hover:underline">
            Katalog Lengkap <ChevronRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentModules.map((module) => (
            <Link
              to="/modules"
              key={module.id}
              className="group flex items-center gap-4 p-5 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-[2rem] hover:shadow-xl transition-all"
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 shadow-inner ${module.bg} ${module.color}`}>
                <module.icon size={28} />
              </div>
              <div className="overflow-hidden">
                <h4 className="font-black text-slate-800 dark:text-white text-sm truncate uppercase tracking-tight">{module.title}</h4>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">{module.subject}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

    </div>
  );
}
