import React, { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  RotateCcw,
  CheckCircle2,
  Smile,
  Sun,
  Moon,
  Medal,
  ThumbsUp,
  BookOpen,
  Timer,
  TrendingUp,
  MessageCircle,
  LayoutDashboard
} from 'lucide-react';
import mockQuestions from '../../data/mockQuestions';
import { useDarkMode } from '../../hooks/useDarkMode';
import { motion, AnimatePresence } from 'framer-motion';
import MathText from '../../components/MathText';

/**
 * ExamResult Page — Post-Exam Performance Summary
 * Features a dynamic, positive reward system and distraction-free layout.
 */
export default function ExamResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isDark, toggleDarkMode } = useDarkMode();
  const [showReview, setShowReview] = useState(false);

  const {
    answers = {},
    totalQuestions = 40,
    timeUp = false,
    examType = 'practice',
    timeTaken = 0 // Expected in seconds or mock it
  } = location.state || {};

  const isTryout = examType === 'tryout';

  // Calculate score & counts
  const stats = useMemo(() => {
    let correct = 0;
    let answered = 0;

    mockQuestions.forEach((q) => {
      const userAnswer = answers[q.id || q.questionNumber];
      if (userAnswer) {
        answered++;
        if (userAnswer === q.correctAnswer) correct++;
      }
    });

    const score = Math.round((correct / totalQuestions) * 100) || 0;
    const unanswered = totalQuestions - answered;
    const wrong = answered - correct;

    return { correct, wrong, unanswered, score };
  }, [answers, totalQuestions]);

  // Dynamic Tier Logic (No Red)
  const tier = useMemo(() => {
    const s = stats.score;
    if (s >= 85) return {
      color: 'text-amber-500 dark:text-amber-400',
      bgGradient: 'from-amber-400 via-yellow-500 to-orange-500',
      icon: <Medal size={48} className="text-white" />,
      title: "Luar Biasa! 🌟",
      summary: "Kamu jenius! Skor sempurna hampir di tanganmu.",
      recommendation: "Kamu sudah siap untuk tantangan yang lebih sulit. Ayo gas!"
    };
    if (s >= 70) return {
      color: 'text-blue-500 dark:text-blue-400',
      bgGradient: 'from-blue-500 via-indigo-500 to-primary',
      icon: <ThumbsUp size={48} className="text-white" />,
      title: "Bagus Sekali! 👍",
      summary: "Hebat! Kamu sudah memahami sebagian besar materi.",
      recommendation: "Sedikit lagi belajar dan kamu akan jadi juara 100!"
    };
    if (s >= 55) return {
      color: 'text-teal-500 dark:text-teal-400',
      bgGradient: 'from-teal-400 via-emerald-500 to-teal-600',
      icon: <BookOpen size={48} className="text-white" />,
      title: "Terus Semangat! 📚",
      summary: "Bagus! Kamu sudah berusaha keras hari ini.",
      recommendation: "Ulangi bagian yang sulit di modul supaya makin paham!"
    };
    return {
      color: 'text-purple-500 dark:text-purple-400',
      bgGradient: 'from-purple-500 via-fuchsia-500 to-purple-700',
      icon: <Smile size={48} className="text-white" />,
      title: "Coba Lagi, Semangat! 💪",
      summary: "Tidak apa-apa! Setiap kesalahan adalah pelajaran baru.",
      recommendation: "Jangan menyerah! Baca modul lagi dan coba kuisnya sesukamu."
    };
  }, [stats.score]);

  const formatTime = (seconds) => {
    if (!seconds) return '15m 30s'; // Mock if not provided
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col transition-colors duration-300">

      {/* 1. HERO HEADER (Increased padding to avoid overlap) */}
      <div className={`relative bg-gradient-to-br ${tier.bgGradient} pt-16 pb-28 px-4 text-center text-white overflow-hidden shadow-2xl`}>
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-white/10 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl" />

        <button
          onClick={toggleDarkMode}
          className="absolute top-8 right-8 w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white/30 transition-all active:scale-95 z-20 shadow-lg"
          aria-label="Toggle dark mode"
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="relative z-10 py-4"
        >
          <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 shadow-xl border border-white/20">
            {tier.icon}
          </div>
          <h1 className="text-3xl lg:text-5xl font-black mb-3 tracking-tight italic uppercase">{tier.title}</h1>
          <p className="text-white/90 font-bold max-w-lg mx-auto leading-relaxed text-sm md:text-base">{tier.summary}</p>
        </motion.div>
      </div>

      {/* 2. MAIN CONTENT AREA (Safer negative margin & Z-index) */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 lg:px-8 -mt-16 mb-20 space-y-8 relative z-10">

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">

          {/* LEFT: Primary Score Card */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-slate-800 rounded-[3.5rem] p-10 md:p-14 text-center shadow-2xl border border-slate-100 dark:border-slate-700 relative overflow-hidden group"
            >
              {/* Decorative Accent */}
              <div className={`absolute top-0 left-0 w-full h-2`} />

              <div className="absolute top-6 right-8 flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-full text-[10px] font-black uppercase tracking-widest">
                <TrendingUp size={14} /> Naik 10 Poin!
              </div>

              <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] mb-6 block">Hasil Akhirmu</span>
              <div className="relative inline-block mb-6">
                <span className={`text-8xl md:text-9xl font-black italic tracking-tighter ${tier.color}`}>
                  {stats.score}
                </span>
                <span className="text-xl md:text-2xl font-black text-slate-300 absolute -bottom-2 -right-8">/100</span>
              </div>

              <div className="flex items-center justify-center gap-6 pt-8 border-t border-slate-50 dark:border-slate-700 mt-4">
                <div className="text-left">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
                  <p className={`font-black uppercase tracking-tight ${tier.color}`}>Lulus Berlatih</p>
                </div>
                <div className="h-12 w-px bg-slate-100 dark:bg-slate-700" />
                <div className="text-left">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Kategori</p>
                  <p className="font-black tracking-tight text-slate-700 dark:text-slate-200 uppercase">Akademik</p>
                </div>
              </div>
            </motion.div>

            {/* Stats Grid - Fixed mobile layout to prevent text overlap */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 text-center shadow-lg border border-slate-100 dark:border-slate-700 group hover:border-teal-400 transition-colors">
                <p className="text-4xl font-black text-teal-600 dark:text-teal-400">{stats.correct}</p>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Tepat</p>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 text-center shadow-lg border border-slate-100 dark:border-slate-700 hover:border-purple-400 transition-colors">
                <p className="text-4xl font-black text-purple-600 dark:text-purple-400">{stats.wrong}</p>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Melenceng</p>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 text-center shadow-lg border border-slate-100 dark:border-slate-700 hover:border-slate-400 transition-colors">
                <p className="text-4xl font-black text-slate-400 dark:text-slate-500">{stats.unanswered}</p>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Kosong</p>
              </div>
            </div>
          </div>

          {/* RIGHT: Recommendations & Action */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-[3rem] p-8 md:p-12 shadow-xl border border-slate-100 dark:border-slate-700 flex flex-col justify-between min-h-full lg:min-h-[500px]">
              <div className="space-y-10">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <div className="w-16 h-16 bg-slate-50 dark:bg-slate-900 rounded-2xl flex items-center justify-center text-orange-500 shrink-0 shadow-inner">
                    <Timer size={32} />
                  </div>
                  <div className="text-center sm:text-left">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Waktu Pengerjaan</p>
                    <h4 className="text-3xl md:text-4xl font-black text-slate-800 dark:text-white leading-none italic">{formatTime(timeTaken)}</h4>
                  </div>
                </div>

                <div className="p-8 md:p-10 bg-slate-50 dark:bg-slate-900 rounded-[2.5rem] border-2 border-dashed border-slate-200 dark:border-slate-700 relative">
                  <div className="absolute -top-5 -left-5 w-14 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg transform -rotate-6">
                    <Medal size={28} />
                  </div>
                  <h5 className="font-black text-slate-800 dark:text-white uppercase tracking-tight mb-3 text-sm">Tips Piro buat Kamu:</h5>
                  <p className="text-sm md:text-base font-bold text-slate-500 dark:text-slate-400 leading-relaxed italic">
                    "{tier.recommendation}"
                  </p>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-12 pt-6 border-t border-slate-50 dark:border-slate-700">
                <button
                  onClick={() => setShowReview(!showReview)}
                  className={`flex items-center justify-center gap-3 py-5 px-6 font-black text-[10px] uppercase tracking-widest rounded-3xl transition-all shadow-md active:scale-95 ${showReview
                      ? 'bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-800'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-200 border border-slate-100 dark:border-slate-700'
                    }`}
                >
                  <MessageCircle size={18} />
                  {showReview ? 'Tutup Review' : 'Lihat Pembahasan'}
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate('/')}
                    className="flex-1 flex items-center justify-center gap-3 py-5 bg-indigo-600 text-white font-black text-[10px] uppercase tracking-widest rounded-3xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20 active:scale-95"
                  >
                    <LayoutDashboard size={18} />
                    Beranda
                  </button>
                  <button
                    onClick={() => navigate('/test')}
                    className="w-16 flex items-center justify-center bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 text-slate-400 rounded-3xl hover:text-orange-500 hover:border-orange-500 transition-all active:scale-95 shadow-sm"
                  >
                    <RotateCcw size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. REVIEW SECTION (Mirror Quiz Review) */}
        <AnimatePresence>
          {showReview && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="space-y-6 pt-10"
            >
              <div className="flex items-center gap-4 px-4">
                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-600/20">
                  <MessageCircle size={20} />
                </div>
                <h3 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic">Bedah <span className="text-indigo-600">Jawaban</span></h3>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {mockQuestions.map((q, idx) => {
                  const userAnswer = answers[q.id || q.questionNumber];
                  const isCorrect = userAnswer === q.correctAnswer;
                  return (
                    <div key={idx} className={`p-6 md:p-8 rounded-[2rem] border-2 bg-white dark:bg-slate-800 ${isCorrect ? 'border-teal-100 dark:border-teal-900/30' : 'border-purple-100 dark:border-purple-900/30'}`}>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Soal #{idx + 1}</span>
                          <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${isCorrect ? 'bg-teal-500 text-white' : 'bg-purple-500 text-white'}`}>
                            {isCorrect ? 'Tepat' : 'Terus Belajar'}
                          </span>
                        </div>
                        <h4 className="font-bold text-slate-800 dark:text-white"><MathText text={q.text} /></h4>
                        <div className="flex flex-col sm:flex-row gap-4 pt-2">
                          <div className="flex-1 space-y-1">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Jawabanmu</p>
                            <div className={`p-3 rounded-xl border text-sm font-bold ${isCorrect ? 'bg-teal-50 dark:bg-emerald-900/10 border-teal-200 dark:border-teal-900/30 text-teal-700' : 'bg-purple-50 dark:bg-purple-900/10 border-purple-200 dark:border-purple-900/30 text-purple-700'}`}>
                              {userAnswer || 'Tidak Dijawab'}
                            </div>
                          </div>
                          {!isCorrect && (
                            <div className="flex-1 space-y-1">
                              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Kunci Jawaban</p>
                              <div className="p-3 rounded-xl bg-teal-500 text-white text-sm font-bold">
                                {q.correctAnswer}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
