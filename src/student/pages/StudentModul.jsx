import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  FileText,
  Download,
  ChevronRight,
  Calculator,
  Globe,
  Heart,
  Book,
  PenTool,
  Trees,
  Lock,
  Play,
  CheckCircle2,
  Gamepad2,
  AlertCircle,
  Clock,
  Star,
  Info,
  RotateCcw
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * Student Modul Page — Tailored for 6th Grade Engagement
 * Features visual filters, progress rewards, and structured learning paths.
 */
export default function StudentModul() {
  const navigate = useNavigate();
  
  // Enhanced Mock Data with Gamification Metadata
  const initialModules = [
    {
      id: 1,
      title: 'Teks Narasi & Deskripsi',
      subject: 'Bahasa Indonesia',
      pages: 45,
      size: '2.4 MB',
      icon: Book,
      color: 'from-orange-400 to-orange-600',
      bgLight: 'bg-orange-50',
      textColor: 'text-orange-600',
      hasQuiz: true,
      quizLocked: true,
      prerequisiteType: 'download',
      type: 'pdf',
      estimasiWaktu: '± 25 menit',
      progressStatus: 'sedang', // 'belum', 'sedang', 'selesai'
      isFirst: true // Start here indicator
    },
    {
      id: 2,
      title: 'Bilangan Bulat & Operasi',
      subject: 'Matematika',
      pages: 32,
      size: '1.8 MB',
      icon: Calculator,
      color: 'from-teal-400 to-teal-600',
      bgLight: 'bg-teal-50',
      textColor: 'text-teal-600',
      hasQuiz: true,
      quizLocked: true,
      prerequisiteType: 'video',
      type: 'video',
      estimasiWaktu: '± 30 menit',
      progressStatus: 'belum'
    },
    {
      id: 3,
      title: 'Panduan Survei Karakter',
      subject: 'Umum',
      pages: 20,
      size: '1.2 MB',
      icon: Trees,
      color: 'from-slate-400 to-slate-600',
      bgLight: 'bg-slate-50',
      textColor: 'text-slate-600',
      hasQuiz: false,
      type: 'text',
      estimasiWaktu: '± 15 menit',
      progressStatus: 'selesai'
    },
    {
      id: 4,
      title: 'Puisi & Karya Sastra',
      subject: 'Bahasa Indonesia',
      pages: 28,
      size: '1.5 MB',
      icon: PenTool,
      color: 'from-orange-400 to-orange-600',
      bgLight: 'bg-orange-50',
      textColor: 'text-orange-600',
      hasQuiz: true,
      quizLocked: false,
      prerequisiteType: 'download',
      type: 'pdf',
      estimasiWaktu: '± 20 menit',
      progressStatus: 'selesai'
    },
    {
      id: 5,
      title: 'Bangun Datar & Ruang',
      subject: 'Matematika',
      pages: 40,
      size: '3.1 MB',
      icon: Calculator,
      color: 'from-teal-400 to-teal-600',
      bgLight: 'bg-teal-50',
      textColor: 'text-teal-600',
      hasQuiz: true,
      quizLocked: true,
      prerequisiteType: 'video',
      type: 'video',
      estimasiWaktu: '± 40 menit',
      progressStatus: 'belum'
    },
  ];

  const [modules, setModules] = useState(initialModules);
  const [activeTab, setActiveTab] = useState('Semua');
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [activeModule, setActiveModule] = useState(null);

  // Tab Filtering Logic: Separate Academic from Umum
  const academicModules = useMemo(() => {
    const list = modules.filter(m => m.subject !== 'Umum' && m.progressStatus !== 'selesai');
    if (activeTab === 'Semua') return list;
    return list.filter(m => m.subject === activeTab);
  }, [modules, activeTab]);

  const generalModules = useMemo(() => {
    return modules.filter(m => m.subject === 'Umum' && m.progressStatus !== 'selesai');
  }, [modules]);

  const completedModules = useMemo(() => {
    return modules.filter(m => m.progressStatus === 'selesai');
  }, [modules]);

  const handleQuizStart = (mod) => {
    setActiveModule(mod);
    setIsConfirmOpen(true);
  };

  const handleContentAccess = (moduleId) => {
    setModules(prev => prev.map(mod => {
      if (mod.id === moduleId) {
        return { 
          ...mod, 
          quizLocked: mod.hasQuiz ? false : mod.quizLocked,
          progressStatus: mod.progressStatus === 'belum' ? 'sedang' : mod.progressStatus
        };
      }
      return mod;
    }));
  };

  // Internal Card Component for consistency
  const ModuleCard = ({ mod }) => (
    <div
      key={mod.id}
      className={`group relative bg-white dark:bg-slate-800 border-2 rounded-[3rem] p-8 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] hover:-translate-y-2 ${
        mod.progressStatus === 'selesai' 
          ? 'border-teal-100 dark:border-teal-900/30 bg-slate-50/50 dark:bg-slate-900/40' 
          : 'border-white dark:border-slate-800'
      }`}
    >
      <div>
        <div className="flex justify-between items-start mb-10">
          {/* Enhanced & Enlarged Icon */}
          <div className={`w-20 h-20 rounded-[2rem] bg-gradient-to-br ${mod.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500 text-white ${mod.progressStatus === 'selesai' ? 'grayscale-[0.5] opacity-80' : ''}`}>
            {React.createElement(mod.icon, { size: 40 })}
          </div>
          
          <div className="flex flex-col items-end gap-2">
            {/* Learning Path Badge */}
            {mod.isFirst && mod.progressStatus !== 'selesai' && (
              <div className="px-3 py-1 bg-teal-600 text-white rounded-full text-[9px] font-black uppercase tracking-widest animate-pulse">
                Mulai di sini
              </div>
            )}
            {/* Progress Badge Container - Updated to prevent overlap */}
            <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all ${
              mod.progressStatus === 'selesai' 
                ? 'bg-teal-50 text-teal-600 border-teal-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20 shadow-sm' 
                : mod.progressStatus === 'sedang'
                  ? 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20'
                  : 'bg-slate-100 text-slate-400 border-slate-200 dark:bg-slate-900 dark:text-slate-500 dark:border-slate-700'
            }`}>
              {mod.progressStatus === 'selesai' && <Star size={12} fill="currentColor" className="text-teal-500" />}
              {mod.progressStatus === 'selesai' ? 'Selesai' : mod.progressStatus === 'sedang' ? 'Sedang Belajar' : 'Belum Dibaca'}
            </div>
          </div>
        </div>
        
        <h3 className={`text-2xl font-black leading-tight mb-2 pr-6 transition-colors uppercase tracking-tight ${mod.progressStatus === 'selesai' ? 'text-slate-400 dark:text-slate-500' : 'text-slate-800 dark:text-white group-hover:text-indigo-600'}`}>
          {mod.title}
        </h3>
        
        <div className="flex items-center gap-2 mb-6 uppercase">
           <span className={`text-[10px] font-black px-3 py-1 rounded-lg ${mod.bgLight} ${mod.textColor} dark:bg-white/5 ${mod.progressStatus === 'selesai' ? 'opacity-50' : ''}`}>
             {mod.subject}
           </span>
        </div>

        <div className="flex items-center gap-4 text-[10px] font-black text-slate-400 mb-10 uppercase tracking-widest">
          <span className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900 px-3 py-2 rounded-xl">
            <Clock size={14} className="text-indigo-400" /> {mod.estimasiWaktu}
          </span>
          <span className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900 px-2 py-1 rounded-xl">
             {mod.pages} hal
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {mod.progressStatus === 'selesai' ? (
           <button 
             onClick={() => handleContentAccess(mod.id)}
             className="w-full h-14 bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-300 font-black text-[10px] uppercase tracking-[0.15em] rounded-2xl transition-all flex items-center justify-center gap-3 hover:bg-slate-300 dark:hover:bg-slate-600 active:scale-95 shadow-inner"
           >
             <RotateCcw size={16} />
             Belajar Lagi
           </button>
        ) : (
          <>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => handleContentAccess(mod.id)}
                className="flex-1 h-14 bg-white dark:bg-slate-700 border-2 border-slate-100 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-black text-[10px] uppercase tracking-widest rounded-2xl transition-all flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-600 active:scale-95 shadow-sm"
              >
                {mod.type === 'video' ? <Play size={16} /> : <Download size={16} />}
                {mod.type === 'video' ? 'Tonton' : 'Unduh PDF'}
              </button>
            </div>

            {mod.hasQuiz ? (
              <div className="relative group/quiz">
                <button 
                  disabled={mod.quizLocked}
                  onClick={() => handleQuizStart(mod)}
                  className={`w-full h-14 font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95 ${
                    mod.quizLocked 
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-300 dark:text-slate-600 cursor-not-allowed shadow-none border-2 border-slate-100 dark:border-slate-700' 
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/20'
                  }`}
                >
                  <Gamepad2 size={16} />
                  Mulai Kuis Game
                </button>
                
                {mod.quizLocked && (
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-4 py-2 bg-orange-500 text-white text-[9px] font-black uppercase tracking-widest rounded-xl whitespace-nowrap shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                     <div className="flex items-center gap-2">
                       <Lock size={12} /> Baca dulu, lalu kuis terbuka!
                     </div>
                     <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-orange-500 rotate-45" />
                  </div>
                )}
              </div>
            ) : (
              <div className="h-14 flex items-center justify-center text-[10px] font-black text-slate-300 dark:text-slate-600 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-2xl uppercase tracking-widest">
                Tidak ada kuis
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-12 animate-fade-in text-slate-900 dark:text-white pb-20">

      {/* Hero / Filter Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight italic">
            Katalog <span className="text-indigo-600">Modul</span> Belajar
          </h1>
          <p className="text-base font-bold text-slate-400 tracking-wide mt-2">
            Pilih materimu dan kumpulkan <span className="text-teal-600">Bintang Emas</span> dari kuis game!
          </p>
        </div>

        {/* Visual Filter Tabs */}
        <div className="flex p-2 bg-white dark:bg-slate-800 rounded-[2rem] w-full md:w-fit shadow-sm border border-slate-100 dark:border-slate-700">
          {['Semua', 'Matematika', 'Bahasa Indonesia'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 md:flex-none flex items-center justify-center px-6 py-4 rounded-[1.5rem] font-black text-[10px] tracking-widest uppercase transition-all whitespace-nowrap ${
                activeTab === tab
                  ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
            >
              {tab === 'Bahasa Indonesia' ? 'B. Indonesia' : tab}
            </button>
          ))}
        </div>
      </div>

      {/* Main Academic Modules Section */}
      {academicModules.length > 0 && (
        <div className="space-y-8">
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl flex items-center justify-center text-indigo-600">
               <BookOpen size={20} />
             </div>
             <h2 className="text-2xl font-black uppercase tracking-tight">Materi <span className="text-indigo-600">Pelajaran</span></h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {academicModules.map((mod) => (
              <ModuleCard key={mod.id} mod={mod} />
            ))}
          </div>
        </div>
      )}

      {/* Separate Section for Umum/Panduan (Only if active) */}
      {generalModules.length > 0 && (
        <div className="bg-white dark:bg-slate-800/10 rounded-[3rem] p-4 md:p-8 space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400 shadow-sm border border-slate-100 dark:border-slate-700">
                <Info size={24} />
              </div>
              <h2 className="text-2xl font-black uppercase tracking-tight">Informasi & <span className="text-slate-400">Panduan Umum</span></h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {generalModules.map((mod) => (
                <ModuleCard key={mod.id} mod={mod} />
              ))}
            </div>
        </div>
      )}

      {/* NEW: Completed Modules Section (Gray Theme) */}
      {completedModules.length > 0 && (
        <div className="bg-slate-50 dark:bg-slate-900/50 rounded-[3rem] p-10 md:p-14 border border-slate-100 dark:border-slate-800">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center text-teal-500 shadow-sm border border-teal-100 dark:border-emerald-500/20">
                 <CheckCircle2 size={24} />
               </div>
               <div>
                 <h2 className="text-2xl font-black uppercase tracking-tight">Modul <span className="text-slate-400">Selesai</span></h2>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5 italic text-teal-600/80">Kamu hebat! Materi ini sudah kamu kuasai.</p>
               </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {completedModules.map((mod) => (
               <ModuleCard key={mod.id} mod={mod} />
            ))}
            
            {/* Explore More Card Moved here only if listing general modules else where or stayed empty */}
             <div className="border-4 border-dashed border-slate-200 dark:border-slate-800 rounded-[3rem] p-8 flex flex-col items-center justify-center text-center gap-6 opacity-40">
              <div className="w-20 h-20 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center text-slate-300">
                <Star size={40} />
              </div>
              <div>
                <span className="block font-black text-slate-400 text-sm uppercase tracking-widest">Selesaikan Lebih Banyak</span>
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Kumpulkan semua bintang!</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Verification Popup */}
      {isConfirmOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-fade-in" onClick={() => setIsConfirmOpen(false)} />
          <div className="relative bg-white dark:bg-slate-800 p-10 rounded-[3rem] shadow-2xl max-w-sm w-full text-center space-y-8 animate-in zoom-in-95 duration-200 border border-white/20 dark:border-slate-700">
            <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-500 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
              <Gamepad2 size={40} fill="currentColor" />
            </div>
            <div className="space-y-3">
              <h3 className="text-3xl font-black text-slate-800 dark:text-white leading-tight uppercase tracking-tight italic">Siap <span className="text-indigo-600">Main?</span></h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-relaxed">Pastikan kamu sudah memahami materi agar kumpulkan <span className="text-teal-600">Bintang Maksimal!</span></p>
            </div>
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => {
                  setIsConfirmOpen(false);
                  navigate(`/modules/quiz/${activeModule.id}`);
                }}
                className="w-full py-5 bg-indigo-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20"
              >
                Ya, Main Sekarang!
              </button>
              <button 
                onClick={() => setIsConfirmOpen(false)}
                className="w-full py-5 bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-300 font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-slate-200 transition-all"
              >
                Nanti Dulu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
