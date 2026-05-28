import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MousePointer2, MoveRight, CheckCircle2, Star } from 'lucide-react';

/**
 * QuizGuideModal component to prepare students before the quiz.
 * Designed with high-contrast, child-friendly aesthetics.
 */
export default function QuizGuideModal({ onStart }) {
  const steps = [
    {
      icon: <MousePointer2 className="text-indigo-600" size={32} />,
      title: "Pilih Jawaban",
      desc: "Ketuk kotak pilihanmu.",
      color: "bg-indigo-50",
      emoji: "🎯"
    },
    {
      icon: <MoveRight className="text-orange-600" size={32} />,
      title: "Pindah Soal",
      desc: "Gunakan tombol Lanjut/Kembali.",
      color: "bg-orange-50",
      emoji: "➡️"
    },
    {
      icon: <CheckCircle2 className="text-emerald-600" size={32} />,
      title: "Selesai",
      desc: "Tekan tombol Kumpulkan di akhir kuis.",
      color: "bg-emerald-50",
      emoji: "✅"
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/40 backdrop-blur-xl">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-2xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl overflow-hidden flex flex-col items-center text-center transition-all"
      >
        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-8 md:p-12 w-full">
          {/* Decorative Background Elements */}
          <div className="absolute top-0 right-0 p-8 text-indigo-100 dark:text-indigo-900/20 pointer-events-none">
            <Star size={120} fill="currentColor" />
          </div>

          {/* Header */}
          <div className="space-y-4 mb-10 relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-full text-indigo-600 dark:text-indigo-400 text-xs font-black uppercase tracking-widest">
              Panduan Belajar
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-800 dark:text-white leading-tight">
              Tunggu sebentar! <br />
              <span className="text-indigo-600">Cek panduan ini dulu ya</span>
            </h2>
          </div>

          {/* Steps Grid */}
          <div className="grid grid-cols-1 gap-4 w-full relative z-10">
            {steps.map((step, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-center gap-6 p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-left group hover:scale-[1.02] transition-transform"
              >
                <div className={`w-16 h-16 shrink-0 rounded-2xl ${step.color} dark:bg-opacity-10 flex items-center justify-center shadow-inner`}>
                  {step.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{step.emoji}</span>
                    <h4 className="font-black text-slate-800 dark:text-white uppercase tracking-tight text-sm">
                      {step.title}
                    </h4>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 font-bold">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Action Button: Sticky Footer */}
        <div className="w-full p-8 md:px-12 md:pb-12 md:pt-0 bg-white dark:bg-slate-900 shrink-0">
          <button
            onClick={onStart}
            className="group relative w-full py-6 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-lg rounded-[2rem] transition-all shadow-xl shadow-indigo-600/30 active:scale-95 flex items-center justify-center gap-3 overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
            Saya Mengerti, Mulai!
            <MoveRight size={24} />
          </button>

          <p className="mt-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
            Timer kuis akan dimulai setelah kamu menekan tombol diatas
          </p>
        </div>
      </motion.div>
    </div>
  );
}
