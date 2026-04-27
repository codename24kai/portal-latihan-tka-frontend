import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function SurveyHeader({ title, currentQuestion, totalQuestions }) {
  const navigate = useNavigate();
  const progress = (currentQuestion / totalQuestions) * 100;

  return (
    <header className="h-20 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 sticky top-0 z-50 transition-all">
      <div className="max-w-5xl mx-auto h-full px-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-teal-600 transition-all"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="overflow-hidden">
            <h1 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-tight truncate max-w-[200px] sm:max-w-md italic">
              {title}
            </h1>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">
              Instrumen Non-Kognitif
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden sm:flex flex-col items-end">
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Kemajuan</span>
             <span className="text-sm font-black text-teal-600 italic leading-none">{currentQuestion} <span className="text-[10px] text-slate-300 not-italic">/ {totalQuestions}</span></span>
          </div>
          
          <div className="w-24 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden relative">
            <div 
              className="absolute inset-0 bg-gradient-to-r from-teal-500 to-emerald-500 transition-all duration-500 ease-out" 
              style={{ width: `${progress}%` }} 
            />
          </div>
        </div>
      </div>
    </header>
  );
}
