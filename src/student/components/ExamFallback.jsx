import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * ExamFallback - Premium styled fallback UI for missing/error exam states.
 */
export default function ExamFallback({ message = "Maaf, data ujian tidak ditemukan atau terjadi kesalahan saat memuat." }) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white dark:bg-slate-800 rounded-[3rem] p-10 shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700 text-center space-y-8"
      >
        <div className="w-20 h-20 bg-rose-50 dark:bg-rose-900/30 rounded-3xl flex items-center justify-center text-rose-500 mx-auto">
          <AlertCircle size={40} />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight">Terjadi Galat</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-bold leading-relaxed whitespace-pre-line">
            {message}
          </p>
        </div>

        <button
          onClick={() => navigate('/test')}
          className="w-full flex items-center justify-center gap-3 py-5 bg-slate-900 dark:bg-slate-700 text-white dark:text-slate-200 font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-slate-800 transition-all active:scale-95"
        >
          <ArrowLeft size={16} />
          Kembali ke Dashboard
        </button>
      </motion.div>
    </div>
  );
}
