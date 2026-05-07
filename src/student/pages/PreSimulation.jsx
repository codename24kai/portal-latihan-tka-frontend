import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ClipboardList,
  Timer,
  BookOpen,
  ChevronLeft,
  Play
} from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * PreSimulation Page
 * Displays simulation info and preparation steps before starting.
 * Follows Orange-Yellow-Teal aesthetic.
 */
export default function PreSimulation() {
  const { examId } = useParams();
  const navigate = useNavigate();

  // Mock simulation data based on ID
  const simulationData = {
    title: examId === '1' ? 'Tryout Akbar Nasional #1' : 'Simulasi Ujian TKA #2',
    subject: 'Matematika & Literasi',
    questionCount: 40,
    duration: 90,
    description: 'Halo! Selamat datang di Simulasi Tes Kemampuan Akademik (TKA) 🤗 \n Latihan ini dirancang khusus untuk membantumu bersiap menghadapi ujian sekolah yang sesungguhnya. Jangan terburu-buru, baca setiap pertanyaan dengan teliti, dan berikan jawaban terbaikmu. Ingat, ini adalah tempat untuk belajar dan berlatih. Tetap semangat dan percaya diri!'
  };

  const isReady = true;

  return (
    <div className="min-h-full flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl w-full space-y-8"
      >
        {/* Back Button */}
        <button
          onClick={() => navigate('/test')}
          className="flex items-center gap-2 text-slate-500 hover:text-teal-600 font-bold transition-colors"
        >
          <ChevronLeft size={20} />
          <span>Kembali ke Daftar Latihan</span>
        </button>

        <div className="w-full max-w-2xl mx-auto space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 md:p-10 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700 relative overflow-hidden group">
            {/* Header pattern */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-100 dark:bg-orange-900/20 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-teal-100 dark:group-hover:bg-teal-900/20 transition-colors duration-700" />

            <div className="relative z-10 space-y-8">
              {/* Exam Info Header */}
              <div className="flex flex-col items-center text-center space-y-6">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-yellow-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-orange-500/20">
                  <ClipboardList size={32} />
                </div>

                <div className="space-y-2">
                  <h1 className="text-3xl font-black text-slate-800 dark:text-white leading-tight">
                    {simulationData?.title}
                  </h1>
                  <p className="text-sm font-bold text-teal-600 dark:text-teal-400 flex items-center justify-center gap-2">
                    <BookOpen size={16} />
                    {simulationData?.subject}
                  </p>
                </div>

                <div className="flex gap-4 w-full">
                  <div className="flex-1 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-3xl border border-slate-100 dark:border-slate-700">
                    <div className="flex items-center justify-center gap-2 text-slate-400 mb-1">
                      <Timer size={14} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Durasi</span>
                    </div>
                    <p className="text-lg font-black text-slate-800 dark:text-white">{simulationData?.duration} Menit</p>
                  </div>
                  <div className="flex-1 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-3xl border border-slate-100 dark:border-slate-700">
                    <div className="flex items-center justify-center gap-2 text-slate-400 mb-1">
                      <ClipboardList size={14} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Soal</span>
                    </div>
                    <p className="text-lg font-black text-slate-800 dark:text-white">{simulationData?.questionCount} Nomor</p>
                  </div>
                </div>
              </div>

              {/* Simulation Description */}
              <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700 rounded-[2rem] p-6 text-center">
                <p className="text-sm md:text-base font-bold text-slate-600 dark:text-slate-400 leading-relaxed">
                  {simulationData?.description}
                </p>
              </div>

              {/* Action Button */}
              <div className="pt-4">
                <button
                  disabled={!isReady}
                  onClick={() => navigate(`/exam/${examId}`)}
                  className={`w-full group relative flex items-center justify-center gap-3 py-5 rounded-3xl font-black text-base uppercase tracking-widest transition-all shadow-2xl active:scale-95 ${isReady
                    ? 'bg-gradient-to-r from-teal-500 via-teal-600 to-indigo-600 text-white shadow-teal-500/25 hover:shadow-teal-500/40'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed shadow-none'
                    }`}
                >
                  <Play size={20} fill={isReady ? "currentColor" : "none"} />
                  <span>Mulai Simulasi</span>
                  {isReady && (
                    <motion.div
                      layoutId="glow"
                      className="absolute inset-0 bg-white/20 rounded-3xl animate-pulse"
                    />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
