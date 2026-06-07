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
  LayoutDashboard,
  Zap
} from 'lucide-react';
import mockQuestions from '@/data/mockSoalV2';
import { useDarkMode } from '@/hooks/useModGelap';
import { motion, AnimatePresence } from 'framer-motion';
import MathRenderer from '@/komponen/ui/RendererMatematika';
import { calculateScore } from '@/utilitas/mesinPenilaian';
import { QUESTION_TYPES } from '@/konstanta/soal';

/**
 * HasilLatihan Page — Latihan Mandiri Performance Summary
 */
export default function HasilLatihan() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isDark, toggleDarkMode } = useDarkMode();
  const [showReview, setShowReview] = useState(false);

  // Strict Defensive Check for location.state
  if (!location.state) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-6">
        <div className="max-w-md w-full bg-white dark:bg-slate-800 p-10 rounded-[3rem] shadow-2xl text-center space-y-6 border border-slate-100 dark:border-slate-700">
          <div className="w-20 h-20 bg-teal-50 dark:bg-teal-900/20 rounded-[2.5rem] flex items-center justify-center mx-auto text-teal-500">
            <LayoutDashboard size={40} />
          </div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic">Data Tidak Ditemukan</h2>
          <p className="text-sm font-bold text-slate-500 dark:text-slate-400 italic">Maaf, kami tidak bisa menampilkan hasil latihan karena data sesi hilang atau tidak valid.</p>
          <button
            onClick={() => navigate('/beranda')}
            className="w-full py-5 bg-teal-600 text-white font-black text-xs uppercase tracking-widest rounded-3xl hover:bg-teal-700 transition-all shadow-xl shadow-teal-600/20 active:scale-95"
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
    examData = {},
    timeTaken = 0,
    student = {}
  } = location.state || {};

  const latihanId = examData?.id || 0;

  // Calculate score & counts
  const stats = useMemo(() => {
    let poinDidapat = 0;
    let totalPoin = 0;
    let jumlahTerjawab = 0;
    let jumlahBenar = 0;
    let perluPenilaianManual = false;

    (mockQuestions || []).forEach((q) => {
      const jawabanUser = answers[q.id];
      const maxPoints = q.max_points || 1;
      totalPoin += maxPoints;

      if (jawabanUser !== undefined) {
        jumlahTerjawab++;
        const nilai = calculateScore(q, jawabanUser, maxPoints);

        if (nilai === null) {
          perluPenilaianManual = true;
        } else {
          poinDidapat += nilai;
          if (nilai === maxPoints) {
            jumlahBenar++;
          }
        }
      }
    });

    const score = totalPoin > 0 ? Math.round((poinDidapat / totalPoin) * 100) : 0;
    const tidakTerjawab = Math.max(0, (mockQuestions?.length || 0) - jumlahTerjawab);

    return { poinDidapat, totalPoin, score, tidakTerjawab, jumlahBenar, perluPenilaianManual };
  }, [answers]);

  // Dynamic Tier Logic (Teal and Orange theme colors)
  const tier = useMemo(() => {
    const s = stats.score;
    if (s >= 85) return {
      color: 'text-teal-600 dark:text-teal-400',
      bgGradient: 'from-teal-400 via-emerald-500 to-teal-600',
      icon: <Medal size={48} className="text-white" />,
      title: "Luar Biasa! 🌟",
      summary: "Hebat sekali! Pemahaman materimu sudah sangat matang.",
      recommendation: "Kamu telah menguasai latihan ini dengan sangat baik. Ayo coba bab berikutnya!"
    };
    if (s >= 70) return {
      color: 'text-teal-500 dark:text-teal-400',
      bgGradient: 'from-teal-500 to-indigo-600',
      icon: <ThumbsUp size={48} className="text-white" />,
      title: "Bagus Sekali! 👍",
      summary: "Hebat! Sebagian besar konsep sudah kamu kuasai dengan baik.",
      recommendation: "Tinggal sedikit lagi review pembahasan untuk merapikan pemahamanmu."
    };
    if (s >= 55) return {
      color: 'text-orange-500 dark:text-orange-400',
      bgGradient: 'from-orange-400 via-amber-500 to-teal-600',
      icon: <BookOpen size={48} className="text-white" />,
      title: "Terus Belajar! 📚",
      summary: "Usaha yang bagus! Pelajari materi yang salah agar semakin paham.",
      recommendation: "Baca pembahasan soal di bawah dengan saksama untuk memahami letak kesalahan."
    };
    return {
      color: 'text-orange-600 dark:text-orange-400',
      bgGradient: 'from-orange-500 via-rose-500 to-teal-600',
      icon: <Smile size={48} className="text-white" />,
      title: "Jangan Menyerah! 💪",
      summary: "Setiap kesalahan adalah langkah awal menuju pemahaman yang lebih baik.",
      recommendation: "Yuk, pelajari pembahasan soal dengan teliti dan coba kerjakan ulang kuis ini."
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

      {/* 1. HERO HEADER */}
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

      {/* 2. MAIN CONTENT AREA */}
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
              <div className="absolute top-0 left-0 w-full h-2 bg-teal-500" />
              <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] mb-6 block">Hasil Latihan Mandiri</span>
              <div className="relative inline-block mb-6">
                <span className={`text-8xl md:text-9xl font-black italic tracking-tighter ${tier?.color || ''}`}>
                  {stats?.score || 0}
                </span>
                <span className="text-xl md:text-2xl font-black text-slate-300 absolute -bottom-2 -right-8">/100</span>
              </div>
              <div className="flex items-center justify-center gap-6 pt-8 border-t border-slate-50 dark:border-slate-700 mt-4 text-left">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Kategori</p>
                  <p className="font-black tracking-tight text-slate-700 dark:text-slate-200 uppercase">Latihan Mandiri</p>
                </div>
                <div className="h-12 w-px bg-slate-100 dark:bg-slate-700" />
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
                  <p className="font-black uppercase tracking-tight text-teal-600 dark:text-teal-400">Selesai</p>
                </div>
              </div>
            </motion.div>

            {/* Statistics details matching simulated breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 text-center shadow-lg border border-slate-100 dark:border-slate-700">
                <p className="text-4xl font-black text-teal-600 dark:text-teal-400">{stats?.jumlahBenar || 0}</p>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Benar</p>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 text-center shadow-lg border border-slate-100 dark:border-slate-700">
                <p className="text-4xl font-black text-orange-500 dark:text-orange-400">{mockQuestions.length - stats?.jumlahBenar - stats?.tidakTerjawab}</p>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Salah</p>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 text-center shadow-lg border border-slate-100 dark:border-slate-700">
                <p className="text-4xl font-black text-slate-400 dark:text-slate-500">{stats?.tidakTerjawab || 0}</p>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Kosong</p>
              </div>
            </div>
          </div>

          {/* RIGHT: Recommendations & Action */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-[3rem] p-8 md:p-12 shadow-xl border border-slate-100 dark:border-slate-700 flex flex-col justify-between min-h-full lg:min-h-[460px]">
              <div className="space-y-8">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <div className="w-16 h-16 bg-slate-50 dark:bg-slate-900 rounded-2xl flex items-center justify-center text-teal-600 shrink-0 shadow-inner">
                    <Timer size={32} />
                  </div>
                  <div className="text-center sm:text-left">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Durasi Pengerjaan</p>
                    <h4 className="text-3xl md:text-4xl font-black text-slate-800 dark:text-white leading-none italic">{formatTime(timeTaken)}</h4>
                  </div>
                </div>

                <div className="p-8 md:p-10 bg-slate-50 dark:bg-slate-900 rounded-[2.5rem] border-2 border-dashed border-slate-200 dark:border-slate-700 relative">
                  <div className="absolute -top-5 -left-5 w-14 h-14 bg-teal-600 text-white rounded-2xl flex items-center justify-center shadow-lg transform -rotate-6">
                    <Zap size={28} />
                  </div>
                  <h5 className="font-black text-slate-800 dark:text-white uppercase tracking-tight mb-3 text-sm">Evaluasi Latihan Mandiri:</h5>
                  <p className="text-sm md:text-base font-bold text-slate-500 dark:text-slate-400 leading-relaxed italic">
                    "{tier?.recommendation || 'Pelajari pembahasan secara mendalam untuk memperkuat konsep!'}"
                  </p>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 pt-6 border-t border-slate-50 dark:border-slate-700">
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
                    onClick={() => navigate('/beranda')}
                    className="flex-1 flex items-center justify-center gap-3 py-5 bg-teal-600 text-white font-black text-[10px] uppercase tracking-widest rounded-3xl hover:bg-teal-700 transition-all shadow-xl shadow-teal-600/20 active:scale-95"
                  >
                    <LayoutDashboard size={18} />
                    Beranda
                  </button>
                  <button
                    onClick={() => navigate(`/ujian/${latihanId}/persiapan`)}
                    className="w-16 flex items-center justify-center bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 text-slate-400 rounded-3xl hover:text-teal-600 hover:border-teal-600 transition-all active:scale-95 shadow-sm"
                    title="Kerjakan Ulang"
                  >
                    <RotateCcw size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. REVIEW SECTION */}
        <AnimatePresence>
          {showReview && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="space-y-6 pt-10"
            >
              <div className="flex items-center gap-4 px-4">
                <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-teal-600/20">
                  <MessageCircle size={20} />
                </div>
                <h3 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic">Analisis <span className="text-teal-600">Pemahaman Soal</span></h3>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {mockQuestions.map((q, idx) => {
                  const userAnswer = answers[q.id];
                  const score = calculateScore(q, userAnswer, q.max_points);
                  const isCorrect = score === q.max_points;
                  const isPartial = score > 0 && score < q.max_points;

                  return (
                    <div key={q.id} className={`p-6 md:p-8 rounded-[2.5rem] border-2 bg-white dark:bg-slate-800 ${
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
                              <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${isCorrect ? 'bg-teal-500 text-white' :
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

                        {/* Answer Review Section */}
                        {q.question_type === QUESTION_TYPES.TRUE_FALSE && Array.isArray(q.payload.statements) ? (
                          <div className="space-y-2 pt-2">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Detail Jawaban Per Pernyataan</p>
                            <div className="space-y-2">
                              {q.payload.statements.map((stmt, sIdx) => {
                                const studentVal = typeof userAnswer === 'object' && userAnswer !== null ? userAnswer[stmt.id] : undefined;
                                const isUnanswered = studentVal === undefined;

                                return (
                                  <div key={stmt.id} className="flex items-center gap-3 p-3 rounded-xl border text-sm bg-slate-50 border-slate-100 dark:bg-slate-900/30 dark:border-slate-800">
                                    <span className="w-6 h-6 rounded-lg bg-white dark:bg-slate-800 flex items-center justify-center text-[10px] font-black text-slate-500 shrink-0">{sIdx + 1}</span>
                                    <span className="flex-1 text-xs font-bold text-slate-600 dark:text-slate-300 min-w-0">{stmt.text}</span>
                                    <div className="flex items-center gap-2 shrink-0 ml-2">
                                      <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider ${
                                        isUnanswered ? 'bg-slate-200 text-slate-400' : studentVal ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'
                                      }`}>
                                        {isUnanswered ? '—' : studentVal ? 'B' : 'S'}
                                      </span>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col sm:flex-row gap-4 pt-2">
                            <div className="flex-1 space-y-1">
                              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Jawabanmu</p>
                              <div className={`p-3 rounded-xl border text-sm font-bold ${
                                isCorrect ? 'bg-teal-50 text-teal-700 dark:bg-teal-900/10' :
                                  isPartial ? 'bg-amber-50 text-amber-700 dark:bg-amber-900/10' :
                                    'bg-purple-50 text-purple-700 dark:bg-purple-900/10'
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
                          </div>
                        )}

                        {/* Pembahasan / Explanation instead of Answer Keys to guide students */}
                        {q.explanation && (
                          <div className="mt-4 p-4 bg-teal-50/50 dark:bg-teal-950/20 rounded-2xl border border-teal-100/80 dark:border-teal-900/40">
                            <p className="text-[9px] font-black text-teal-600 dark:text-teal-400 uppercase tracking-widest mb-1">Pembahasan & Konsep Kunci:</p>
                            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic">{q.explanation}</p>
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
      </main>
    </div>
  );
}
