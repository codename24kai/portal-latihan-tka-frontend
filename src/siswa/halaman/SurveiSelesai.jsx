import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, LayoutDashboard, Sparkles } from 'lucide-react';

export default function SurveyComplete() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white dark:bg-slate-900 rounded-[3rem] p-10 md:p-12 shadow-2xl shadow-teal-500/10 border border-slate-100 dark:border-slate-800 text-center relative overflow-hidden"
      >
        {/* Background Sparkles */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
          <motion.div 
            animate={{ 
              y: [-10, 10], 
              opacity: [0.1, 0.3] 
            }} 
            transition={{ duration: 3, repeat: Infinity, repeatType: 'reverse' }}
            className="absolute top-10 left-10 text-teal-400"
          >
            <Sparkles size={24} />
          </motion.div>
          <motion.div 
            animate={{ 
              y: [10, -10], 
              opacity: [0.1, 0.3] 
            }} 
            transition={{ duration: 4, repeat: Infinity, repeatType: 'reverse', delay: 1 }}
            className="absolute bottom-20 right-10 text-emerald-400"
          >
            <Sparkles size={32} />
          </motion.div>
        </div>

        <div className="relative z-10 space-y-8">
          <motion.div
            initial={{ rotate: -20, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ type: 'spring', damping: 10, stiffness: 100, delay: 0.2 }}
            className="w-24 h-24 bg-gradient-to-br from-teal-400 to-emerald-600 rounded-[2rem] flex items-center justify-center text-white mx-auto shadow-xl shadow-teal-500/30"
          >
            <CheckCircle2 size={48} />
          </motion.div>

          <div className="space-y-3">
            <h1 className="text-3xl font-black text-slate-800 dark:text-white leading-tight italic">
              Terima Kasih!
            </h1>
            <p className="text-sm font-bold text-slate-500 dark:text-slate-400 leading-relaxed italic uppercase tracking-tight">
              Jawabanmu sangat berharga untuk menciptakan lingkungan belajar yang lebih baik.
            </p>
          </div>

          <div className="pt-4 space-y-4">
            <button
              onClick={() => navigate('/')}
              className="w-full flex items-center justify-center gap-3 py-5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-teal-50 hover:text-teal-600 transition-all active:scale-95"
            >
              <LayoutDashboard size={20} />
              Kembali ke Beranda
            </button>
            
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
              Mengarahkan otomatis dalam <span className="text-teal-600 italic">{countdown}</span> detik...
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
