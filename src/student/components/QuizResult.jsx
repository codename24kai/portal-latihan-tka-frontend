import React from 'react';
import { 
  Trophy, 
  Award, 
  ArrowRight, 
  CheckCircle, 
  XCircle, 
  MessageCircle, 
  BookOpen 
} from 'lucide-react';
import { motion } from 'framer-motion';
import MathText from '../../components/MathText';

/**
 * QuizResult — Detailed performance summary for students.
 * Features a question-by-question review with clear visual status.
 */
export default function QuizResult({ percentage, score, total, history, timeTaken, onBack }) {
  // Helper to format time
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    if (m === 0) return `${s} Detik`;
    return `${m} Menit ${s} Detik`;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-4 md:p-12 animate-fade-in flex flex-col items-center">
      <div className="max-w-4xl w-full flex flex-col gap-8 md:gap-12">
        
        {/* 1. SCORE HERO CARD */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-800 rounded-[3rem] md:rounded-[4rem] p-8 md:p-16 shadow-2xl border border-slate-100 dark:border-slate-700 relative overflow-hidden text-center"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-500/10 blur-[100px] rounded-full" />
          
          <div className="relative z-10 space-y-8">
            <motion.div 
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ repeat: Infinity, duration: 4 }}
              className="w-32 h-32 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-2xl"
            >
              {percentage === 100 ? <Award size={64} /> : <Trophy size={64} />}
            </motion.div>

            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic">
                {percentage === 100 ? "Luar Biasa!" : "Kuis Selesai!"}
              </h2>
              <p className="text-lg md:text-xl font-bold text-slate-400 max-w-sm mx-auto">
                {percentage === 100 
                  ? "Kamu berhasil menjawab semua dengan benar! Pertahankan terus!" 
                  : "Bagus sekali! Cek hasil belajarmu di bawah ini ya."}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 max-w-3xl mx-auto">
              <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-[2rem] border border-slate-100 dark:border-slate-700">
                <span className="block text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 md:mb-2">Skor Akhir</span>
                <span className="text-2xl md:text-3xl font-black text-indigo-600 italic">{percentage}%</span>
              </div>
              <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-[2rem] border border-slate-100 dark:border-slate-700">
                <span className="block text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 md:mb-2">Benar</span>
                <span className="text-2xl md:text-3xl font-black text-teal-500 italic">
                  {score} <span className="text-xs text-slate-300 font-black tracking-normal">/ {total}</span>
                </span>
              </div>
              <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-[2rem] border border-slate-100 dark:border-slate-700">
                <span className="block text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 md:mb-2">Durasi</span>
                <span className="text-xl md:text-2xl font-black text-orange-500 italic leading-tight">
                  {formatTime(timeTaken)}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 2. DETAILED REVIEW SECTION */}
        <div className="space-y-8">
          <div className="flex items-center gap-4 px-4">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-600/20">
              <MessageCircle size={20} />
            </div>
            <h3 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic">Analisis <span className="text-indigo-600">Jawabanmu</span></h3>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {history?.map((item, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`group p-6 md:p-10 rounded-[2.5rem] border-2 transition-all ${
                  item.isCorrect 
                    ? 'bg-emerald-50/50 dark:bg-emerald-500/5 border-emerald-100 dark:border-emerald-500/20' 
                    : 'bg-rose-50/50 dark:bg-rose-500/5 border-rose-100 dark:border-rose-500/20'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                  <div className="space-y-4 flex-1">
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Soal #{index + 1}</span>
                      {item.isCorrect ? (
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500 text-white rounded-full text-[9px] font-black uppercase tracking-widest">
                          <CheckCircle size={10} strokeWidth={4} /> Tepat
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-rose-500 text-white rounded-full text-[9px] font-black uppercase tracking-widest">
                          <XCircle size={10} strokeWidth={4} /> Belum Tepat
                        </div>
                      )}
                    </div>
                    <h4 className="text-lg md:text-xl font-black text-slate-800 dark:text-white leading-snug">
                      <MathText text={item.questionText} />
                    </h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                       <div className="space-y-1">
                         <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Jawabanmu</span>
                         <div className={`p-4 rounded-2xl font-bold text-sm border transition-colors ${
                           item.isCorrect 
                             ? 'bg-white/50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30 text-emerald-600 dark:text-emerald-400' 
                             : 'bg-white/50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/30 text-rose-600 dark:text-rose-400'
                         }`}>
                           <MathText text={item.studentAnswer} />
                         </div>
                       </div>
                       {!item.isCorrect && (
                         <div className="space-y-1">
                           <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Seharusnya</span>
                           <div className="p-4 bg-emerald-500 text-white dark:bg-emerald-600 rounded-2xl font-bold text-sm shadow-lg shadow-emerald-500/20 dark:shadow-none">
                             <MathText text={item.correctAnswer} />
                           </div>
                         </div>
                       )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 3. NAVIGATION ACTION */}
        <div className="pt-4 flex justify-center pb-12">
           <button
             onClick={onBack}
             className="w-full md:w-auto px-16 py-6 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-[2.5rem] transition-all shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-3 active:scale-95 uppercase tracking-widest"
           >
             Selesai Belajar
             <ArrowRight size={24} />
           </button>
        </div>
      </div>
    </div>
  );
}
