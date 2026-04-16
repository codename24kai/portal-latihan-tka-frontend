import React, { useState, useMemo } from 'react';
import { 
  Trophy, 
  Award, 
  ArrowRight, 
  CheckCircle, 
  XCircle, 
  MessageCircle, 
  BookOpen,
  Star,
  ThumbsUp,
  Smile,
  Zap,
  RotateCcw,
  LayoutDashboard,
  TrendingUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import MathText from '../../components/MathText';

/**
 * QuizResult — Child-Friendly Performance Summary
 * Features a dynamic reward system (Tier-based) and actionable feedback.
 */
export default function QuizResult({ percentage, score, total, history, timeTaken, onBack }) {
  const [showReview, setShowReview] = useState(false);

  // Helper: Determine Result Tier (Child-Friendly Logic)
  const tier = useMemo(() => {
    const s = Math.round(percentage || 0);
    if (s >= 85) return {
      id: 'gold',
      color: 'from-amber-400 to-yellow-600',
      bgLight: 'bg-amber-50 dark:bg-amber-900/20',
      text: 'text-amber-600 dark:text-amber-400',
      decoration: 'amber',
      icon: <MedalIcon className="w-16 h-16" />,
      title: "Luar Biasa! 🌟",
      message: "Kamu jenius! Kamu berhasil menjawab hampir semua dengan benar. Pertahankan prestasimu ya!",
      recommendation: "Kamu sudah siap untuk materi tantangan berikutnya. Ayo lanjut!"
    };
    if (s >= 70) return {
      id: 'blue',
      color: 'from-blue-400 to-indigo-600',
      bgLight: 'bg-blue-50 dark:bg-blue-900/20',
      text: 'text-blue-600 dark:text-blue-400',
      decoration: 'blue',
      icon: <ThumbsUp size={64} />,
      title: "Bagus Sekali! 👍",
      message: "Hebat! Kamu sudah paham banyak hal. Sedikit lagi kamu akan jadi juara sempurna!",
      recommendation: "Coba tinjau soal yang salah supaya nilaimu jadi 100 di kuis berikutnya!"
    };
    if (s >= 55) return {
      id: 'green',
      color: 'from-teal-400 to-emerald-600',
      bgLight: 'bg-teal-50 dark:bg-teal-900/20',
      text: 'text-teal-600 dark:text-teal-400',
      decoration: 'teal',
      icon: <BookOpen size={64} />,
      title: "Terus Semangat! 📚",
      message: "Bagus! Kamu sudah berusaha keras. Yuk, pelajari lagi sedikit bagian yang masih sulit.",
      recommendation: "Baca lagi modul penjelasannya pelan-pelan ya, kamu pasti bisa!"
    };
    return {
      id: 'purple',
      color: 'from-purple-400 to-fuchsia-600',
      bgLight: 'bg-purple-50 dark:bg-purple-900/20',
      text: 'text-purple-600 dark:text-purple-400',
      decoration: 'purple',
      icon: <Smile size={64} />,
      title: "Jangan Menyerah! 💪",
      message: "Tidak apa-apa, belajar itu proses! Setiap kesalahan membuatmu makin pintar.",
      recommendation: "Jangan ragu untuk bertanya pada guru atau orang tuamu jika ada yang bingung."
    };
  }, [percentage]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / (60));
    const s = seconds % 60;
    if (m === 0) return `${s} dtk`;
    return `${m}m ${s}s`;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-4 md:p-8 animate-fade-in flex flex-col items-center">
      <div className="max-w-4xl w-full space-y-8">
        
        {/* 1. SCORE HERO CARD (Tier-Based) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`relative bg-white dark:bg-slate-800 rounded-[3rem] md:rounded-[4rem] p-8 md:p-14 shadow-2xl border border-slate-100 dark:border-slate-700 overflow-hidden text-center`}
        >
          {/* Animated Background Glow */}
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-br ${tier.color} opacity-[0.03] blur-[100px] rounded-full`} />
          
          <div className="relative z-10 space-y-8">
            <motion.div 
              animate={{ 
                scale: [1, 1.05, 1],
                rotate: [0, 3, -3, 0]
              }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className={`w-32 h-32 ${tier.bgLight} ${tier.text} rounded-[2.5rem] flex items-center justify-center mx-auto shadow-xl`}
            >
              {tier.icon}
            </motion.div>

            <div className="space-y-3">
              <h2 className={`text-4xl md:text-5xl font-black uppercase tracking-tight italic ${tier.text}`}>
                {tier.title}
              </h2>
              <p className="text-sm md:text-base font-bold text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                {tier.message}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 md:gap-6 max-w-2xl mx-auto">
              <div className="p-4 md:p-6 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-100 dark:border-slate-700">
                <span className="block text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Skor</span>
                <span className={`text-xl md:text-3xl font-black italic ${tier.text}`}>{percentage}%</span>
              </div>
              <div className="p-4 md:p-6 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-100 dark:border-slate-700">
                <span className="block text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Benar</span>
                <span className="text-xl md:text-3xl font-black text-teal-500 dark:text-teal-400 italic">
                  {score}<span className="text-xs text-slate-300 font-bold tracking-normal ml-0.5">/{total}</span>
                </span>
              </div>
              <div className="p-4 md:p-6 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-100 dark:border-slate-700">
                <span className="block text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Waktu</span>
                <span className="text-lg md:text-2xl font-black text-orange-500 italic leading-none block mt-1">
                  {formatTime(timeTaken)}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 2. SMART RECOMMENDATION BOX */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`p-6 bg-white dark:bg-slate-800 rounded-[2rem] border-l-8 border-l-${tier.decoration}-400 dark:border-l-${tier.decoration}-600 shadow-lg flex flex-col md:flex-row items-center gap-6`}
        >
          <div className={`p-4 rounded-2xl ${tier.bgLight} ${tier.text}`}>
            <Zap size={24} />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h4 className="font-black text-slate-800 dark:text-white uppercase tracking-tight text-sm">Saran Belajar Buat Kamu:</h4>
            <p className="text-sm font-bold text-slate-500 dark:text-slate-400 mt-1">{tier.recommendation}</p>
          </div>
          <div className="flex items-center gap-1.5 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-full text-[10px] font-black uppercase tracking-widest">
            <TrendingUp size={14} /> +10 Poin Progres
          </div>
        </motion.div>

        {/* 3. NAVIGATION ACTIONS */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 px-4">
          <button
            onClick={() => setShowReview(!showReview)}
            className={`w-full sm:w-auto px-8 py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest transition-all shadow-xl flex items-center justify-center gap-2 active:scale-95 ${
              showReview 
                ? 'bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-800' 
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-700'
            }`}
          >
            <MessageCircle size={18} />
            {showReview ? 'Tutup Pembahasan' : 'Lihat Pembahasan'}
          </button>

          <button
            onClick={onBack}
            className="w-full sm:w-auto px-12 py-5 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-black rounded-[2.5rem] transition-all shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-3 active:scale-95 uppercase tracking-widest text-xs"
          >
            <LayoutDashboard size={18} />
            Dashboard
          </button>
        </div>

        {/* 4. DETAILED REVIEW SECTION (Toggleable) */}
        <AnimatePresence>
          {showReview && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-8 overflow-hidden pt-4"
            >
              <div className="flex items-center gap-4 px-4">
                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-600/20">
                  <MessageCircle size={20} />
                </div>
                <h3 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic">Analisis <span className="text-indigo-600">Jawabanmu</span></h3>
              </div>

              <div className="grid grid-cols-1 gap-6 pb-20">
                {history?.map((item, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className={`group p-6 md:p-8 rounded-[2.5rem] border-2 transition-all ${
                      item.isCorrect 
                        ? 'bg-emerald-50/30 dark:bg-emerald-500/5 border-emerald-100 dark:border-emerald-500/20 shadow-sm' 
                        : 'bg-purple-50/30 dark:bg-purple-500/5 border-purple-100 dark:border-purple-500/20 shadow-sm'
                    }`}
                  >
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Soal #{index + 1}</span>
                        {item.isCorrect ? (
                          <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500 text-white rounded-full text-[9px] font-black uppercase tracking-widest">
                            <CheckCircle size={10} strokeWidth={4} /> Tepat
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 px-3 py-1 bg-purple-500 text-white rounded-full text-[9px] font-black uppercase tracking-widest">
                            <Smile size={10} strokeWidth={4} /> Coba Lagi
                          </div>
                        )}
                      </div>
                      <h4 className="text-lg font-black text-slate-800 dark:text-white leading-snug">
                        <MathText text={item.questionText} />
                      </h4>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Pilihanmu</span>
                          <div className={`p-4 rounded-2xl font-bold text-sm border ${
                            item.isCorrect 
                              ? 'bg-white dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30 text-emerald-600 dark:text-emerald-400' 
                              : 'bg-white dark:bg-purple-500/10 border-purple-200 dark:border-purple-500/30 text-purple-600 dark:text-purple-400'
                          }`}>
                            <MathText text={item.studentAnswer} />
                          </div>
                        </div>
                        {!item.isCorrect && (
                          <div className="space-y-1">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Jawaban Benar</span>
                            <div className="p-4 bg-emerald-500 text-white dark:bg-emerald-600 rounded-2xl font-bold text-sm shadow-lg shadow-emerald-500/20">
                              <MathText text={item.correctAnswer} />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Custom Icon Components for Tier Display
const MedalIcon = ({ className = "" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="6" />
    <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
  </svg>
);
