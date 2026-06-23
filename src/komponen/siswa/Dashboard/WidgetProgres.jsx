import React from 'react';
import { TrendingUp, Trees, Heart } from 'lucide-react';
import ProgressBar from '@/komponen/ui/BarProgres';

export const AcademicProgress = ({ exams = [], averageScore = 0 }) => (
  <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
    <div className="flex items-center justify-between mb-6">
      <div>
        <h3 className="text-lg font-black uppercase tracking-tight text-slate-800 dark:text-white">Progres Aktivitas Belajar</h3>
        <p className="text-xs font-bold text-slate-400 tracking-widest mt-0.5">Pantau penyelesaian aktivitas belajar Anda</p>
      </div>
      <div className="flex items-center gap-1 text-teal-600 bg-teal-50 dark:bg-teal-500/10 px-3 py-1.5 rounded-lg text-xs font-black">
        <TrendingUp size={14} /> {averageScore > 0 ? 'Berjalan' : '0 Progress'}
      </div>
    </div>

    <div className="space-y-6">
      <div className="space-y-2">
        <ProgressBar 
          progress={0} 
          label="Sesi Latihan TKA (menunggu data)"
          color="bg-teal-500"
        />
      </div>
      <div className="space-y-2">
        <ProgressBar 
          progress={0} 
          label="Modul Pembelajaran (menunggu data)"
          color="bg-orange-400"
        />
      </div>
      <div className="space-y-2">
        <ProgressBar 
          progress={0} 
          label="Latihan Mandiri (menunggu data)"
          color="bg-indigo-500"
        />
      </div>
      {exams.length === 0 && (
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          Backend belum mengirim data progres untuk akun ini.
        </p>
      )}
    </div>
  </div>
);

export const SurveySection = ({ exams }) => (
  <div className="bg-slate-50 dark:bg-slate-800/50 rounded-3xl p-6 border border-slate-100 dark:border-slate-700/50">
    <h3 className="text-sm font-black uppercase tracking-tight text-slate-800 dark:text-white mb-4">Survei Lingkungan & Karakter</h3>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {exams.map((exam, idx) => (
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
);
