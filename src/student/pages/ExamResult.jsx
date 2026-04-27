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
import mockQuestions from '../../data/mockQuestionsV2'; // Using V2 for demo
import { useDarkMode } from '../../hooks/useDarkMode';
import { motion, AnimatePresence } from 'framer-motion';
import MathRenderer from '../../components/ui/MathRenderer';
import mockSurveyDefinitions from '../../data/mockSurveys';
import { Heart } from 'lucide-react';
import { calculateScore } from '@/utils/scoringEngine';
import { QUESTION_TYPES } from '@/constants/questions';

/**
 * ExamResult Page V2 — Post-Exam Performance Summary
 */
export default function ExamResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isDark, toggleDarkMode } = useDarkMode();
  const [showReview, setShowReview] = useState(false);

  // Strict Defensive Check for location.state
  if (!location.state) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-6">
        <div className="max-w-md w-full bg-white dark:bg-slate-800 p-10 rounded-[3rem] shadow-2xl text-center space-y-6 border border-slate-100 dark:border-slate-700">
          <div className="w-20 h-20 bg-rose-50 dark:bg-rose-900/20 rounded-[2.5rem] flex items-center justify-center mx-auto text-rose-500">
             <LayoutDashboard size={40} />
          </div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic">Ups! Data Tidak Ditemukan</h2>
          <p className="text-sm font-bold text-slate-500 dark:text-slate-400 italic">Maaf, kami tidak bisa menampilkan hasil karena data sesi hilang atau tidak valid.</p>
          <button 
            onClick={() => navigate('/')}
            className="w-full py-5 bg-indigo-600 text-white font-black text-xs uppercase tracking-widest rounded-3xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20 active:scale-95"
          >
            Kembali ke Beranda
          </button>
        </div>
      </div>
    );
  }

  const {
    answers = {},
    totalQuestions = 40,
    timeUp = false,
    examType = 'unknown', 
    timeTaken = 0, 
    examData = {},
    student = {}
  } = location.state || {};

  const examId = examData?.id || 0;
  const isLatihanTKA = examType === 'tryout' || examData?.type === 'tka';
  const isRegularQuiz = examType === 'practice' || examData?.type === 'quiz';
  const isUnknownType = !isLatihanTKA && !isRegularQuiz;

  // Calculate score & counts V2
  const stats = useMemo(() => {
    let earnedPoints = 0;
    let totalMaxPoints = 0;
    let answeredCount = 0;
    let needsManualGrading = false;

    (mockQuestions || []).forEach((q) => {
      const userAnswer = answers[q.id];
      const maxPoints = q.max_points || 1;
      totalMaxPoints += maxPoints;

      if (userAnswer !== undefined) {
        answeredCount++;
        const score = calculateScore(q, userAnswer, maxPoints);
        
        if (score === null) {
          needsManualGrading = true;
        } else {
          earnedPoints += score;
        }
      }
    });

    const score = totalMaxPoints > 0 ? Math.round((earnedPoints / totalMaxPoints) * 100) : 0;
    const unanswered = Math.max(0, (mockQuestions?.length || 0) - answeredCount);

    return { earnedPoints, totalMaxPoints, score, unanswered, needsManualGrading };
  }, [answers]);

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
    if (!seconds) return '15m 30s'; 
    const m = Math.floor(seconds / 60) || 0;
    const s = seconds % 60 || 0;
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
            {tier?.icon}
          </div>
          <h1 className="text-3xl lg:text-5xl font-black mb-3 tracking-tight italic uppercase">{tier?.title}</h1>
          <p className="text-white/90 font-bold max-w-lg mx-auto leading-relaxed text-sm md:text-base">{tier?.summary}</p>
        </motion.div>
      </div>

      {/* 2. MAIN CONTENT AREA (Safer negative margin & Z-index) */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 lg:px-8 -mt-16 mb-20 space-y-8 relative z-10">

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">

          {/* LEFT: Primary Score Card */}
          <div className="lg:col-span-2 space-y-6">
            {isLatihanTKA || isUnknownType ? (
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="bg-white dark:bg-slate-800 rounded-[3.5rem] p-10 md:p-14 text-center shadow-2xl border border-slate-100 dark:border-slate-700 relative overflow-hidden group"
              >
                <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${tier.bgGradient}`} />
                <div className="w-24 h-24 bg-amber-100 dark:bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-8 text-amber-500 shadow-inner">
                  <Smile size={48} />
                </div>
                <h3 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-white mb-4 leading-tight italic">Terima kasih, {student?.name || 'Siswa Hebat'}!</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base font-bold leading-relaxed">
                  {isUnknownType 
                    ? "Terima kasih sudah mengerjakan evaluasi ini dengan baik."
                    : "Kamu sudah berjuang menyelesaikan Latihan TKA dengan sangat baik. 🌟"
                  }
                </p>
                <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-700">
                  <div className="flex justify-between items-center text-left">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Soal Diisi</p>
                      <p className="text-lg font-black text-teal-500">{(stats?.correct || 0) + (stats?.wrong || 0)} <span className="text-sm text-slate-400">/ {totalQuestions || 0}</span></p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
                      <p className="text-lg font-black text-indigo-500">Selesai</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <>
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
                    <span className={`text-8xl md:text-9xl font-black italic tracking-tighter ${tier?.color || ''}`}>
                      {stats?.score || 0}
                    </span>
                    <span className="text-xl md:text-2xl font-black text-slate-300 absolute -bottom-2 -right-8">/100</span>
                  </div>

                  <div className="flex items-center justify-center gap-6 pt-8 border-t border-slate-50 dark:border-slate-700 mt-4">
                    <div className="text-left">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
                      <p className={`font-black uppercase tracking-tight ${tier?.color || ''}`}>Lulus Berlatih</p>
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
                    <p className="text-4xl font-black text-teal-600 dark:text-teal-400">{stats?.correct || 0}</p>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Tepat</p>
                  </div>
                  <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 text-center shadow-lg border border-slate-100 dark:border-slate-700 hover:border-purple-400 transition-colors">
                    <p className="text-4xl font-black text-purple-600 dark:text-purple-400">{stats?.wrong || 0}</p>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Melenceng</p>
                  </div>
                  <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 text-center shadow-lg border border-slate-100 dark:border-slate-700 hover:border-slate-400 transition-colors">
                    <p className="text-4xl font-black text-slate-400 dark:text-slate-500">{stats?.unanswered || 0}</p>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Kosong</p>
                  </div>
                </div>
              </>
            )}
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

                {/* Survey CTA Section */}
                {(() => {
                  const attachedSurvey = (mockSurveyDefinitions || []).find(s => s?.attached_to_tryout_id === parseInt(examId));
                  if (!attachedSurvey) return null;

                  return (
                    <motion.div 
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      className="p-6 bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-900/10 dark:to-emerald-900/10 border border-teal-100 dark:border-teal-900/30 rounded-[2.5rem] space-y-4 relative overflow-hidden group"
                    >
                      <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-teal-200/20 rounded-full blur-3xl group-hover:bg-teal-300/30 transition-colors" />
                      <div className="relative z-10 flex items-start gap-4">
                        <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center text-rose-500 shadow-sm shrink-0">
                          <Heart size={24} fill="currentColor" className="animate-pulse" />
                        </div>
                        <div className="space-y-1">
                          <h5 className="text-sm font-black text-slate-800 dark:text-white leading-tight uppercase tracking-tight italic">
                            Lengkapi {attachedSurvey?.title || 'Survei Karakter'}
                          </h5>
                          <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 leading-relaxed uppercase tracking-widest">
                            Jawabanmu sangat membantu kami memahami suasana belajarmu!
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => navigate(`/survey/${attachedSurvey?.id}`)}
                        className="w-full py-4 bg-teal-600 hover:bg-teal-700 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl transition-all shadow-lg shadow-teal-600/20 active:scale-95 relative z-10"
                      >
                        Mulai Survei Sekarang
                      </button>
                    </motion.div>
                  );
                })()}

                <div className="p-8 md:p-10 bg-slate-50 dark:bg-slate-900 rounded-[2.5rem] border-2 border-dashed border-slate-200 dark:border-slate-700 relative">
                  <div className="absolute -top-5 -left-5 w-14 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg transform -rotate-6">
                    <Medal size={28} />
                  </div>
                  <h5 className="font-black text-slate-800 dark:text-white uppercase tracking-tight mb-3 text-sm">Tips Piro buat Kamu:</h5>
                  <p className="text-sm md:text-base font-bold text-slate-500 dark:text-slate-400 leading-relaxed italic">
                    "{tier?.recommendation || 'Tetap semangat belajar ya!'}"
                  </p>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-12 pt-6 border-t border-slate-50 dark:border-slate-700">
                {isRegularQuiz && (
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
                )}
                <div className={`flex gap-2 ${!isRegularQuiz ? 'sm:col-span-2' : ''}`}>
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

        {/* 3. REVIEW SECTION V2 */}
        {isRegularQuiz && (
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
                    const userAnswer = answers[q.id];
                    const score = calculateScore(q, userAnswer, q.max_points);
                    const isCorrect = score === q.max_points;
                    const isPartial = score > 0 && score < q.max_points;

                    return (
                      <div key={q.id} className={`p-6 md:p-8 rounded-[2rem] border-2 bg-white dark:bg-slate-800 ${
                        isCorrect ? 'border-teal-100 dark:border-teal-900/30' : 
                        isPartial ? 'border-amber-100 dark:border-amber-900/30' :
                        'border-purple-100 dark:border-purple-900/30'
                      }`}>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Soal #{idx + 1}</span>
                            <div className="flex gap-2">
                              {score === null ? (
                                <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-[9px] font-black uppercase tracking-widest">Menunggu Nilai</span>
                              ) : (
                                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                  isCorrect ? 'bg-teal-500 text-white' : 
                                  isPartial ? 'bg-amber-500 text-white' :
                                  'bg-purple-500 text-white'
                                }`}>
                                  {isCorrect ? 'Tepat' : isPartial ? `Sebagian (${score} pts)` : 'Terus Belajar'}
                                </span>
                              )}
                            </div>
                          </div>

                          <h4 className="font-bold text-slate-800 dark:text-white">
                            <MathRenderer text={q.payload.stem} />
                          </h4>

                          {q.payload.stem_image && (
                            <div className="w-full max-w-sm rounded-xl overflow-hidden border border-slate-100 dark:border-slate-700 bg-white">
                              <img src={q.payload.stem_image} alt="Soal" className="w-full h-auto object-contain max-h-32 p-2" />
                            </div>
                          )}

                          <div className="flex flex-col sm:flex-row gap-4 pt-2">
                            <div className="flex-1 space-y-1">
                              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Jawabanmu</p>
                              <div className={`p-3 rounded-xl border text-sm font-bold ${
                                isCorrect ? 'bg-teal-50 text-teal-700' : 
                                isPartial ? 'bg-amber-50 text-amber-700' :
                                'bg-purple-50 text-purple-700'
                              }`}>
                                {q.question_type === QUESTION_TYPES.ESSAY 
                                  ? (userAnswer || 'Tidak Dijawab')
                                  : q.question_type === QUESTION_TYPES.MULTI_CHOICE
                                  ? (userAnswer?.join(', ') || 'Tidak Dijawab')
                                  : q.question_type === QUESTION_TYPES.TRUE_FALSE
                                  ? (userAnswer === true ? 'Benar' : userAnswer === false ? 'Salah' : 'Tidak Dijawab')
                                  : (userAnswer || 'Tidak Dijawab')}
                              </div>
                            </div>
                            
                            {q.question_type !== QUESTION_TYPES.ESSAY && !isCorrect && (
                              <div className="flex-1 space-y-1">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Kunci Jawaban</p>
                                <div className="p-3 rounded-xl bg-teal-500 text-white text-sm font-bold">
                                  {q.question_type === QUESTION_TYPES.MULTI_CHOICE 
                                    ? q.payload.correct_keys.join(', ')
                                    : q.question_type === QUESTION_TYPES.TRUE_FALSE
                                    ? (q.payload.correct_value ? 'Benar' : 'Salah')
                                    : q.payload.correct_keys[0]}
                                </div>
                              </div>
                            )}
                          </div>

                          {q.explanation && (
                            <div className="mt-4 p-4 bg-indigo-50/30 rounded-2xl border border-indigo-100/50">
                               <p className="text-[9px] font-black text-indigo-500 uppercase tracking-widest mb-1">Pembahasan:</p>
                               <p className="text-xs text-slate-500 leading-relaxed italic">{q.explanation}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </main>
    </div>
  );
}
