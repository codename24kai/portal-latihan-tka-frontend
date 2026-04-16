import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ClipboardList, 
  Timer, 
  BookOpen, 
  ChevronLeft, 
  Play,
  CheckCircle2,
  AlertCircle,
  Wifi,
  Keyboard,
  Coffee
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
    description: 'Uji kemampuan akademikmu dengan soal-soal standar nasional terbaru.'
  };

  const prepSteps = [
    { id: 1, text: 'Pastikan koneksi internet stabil (disarankan 4G atau Wi-Fi).', icon: Wifi, color: 'text-teal-500' },
    { id: 2, text: 'Siapkan alat tulis dan kertas buram untuk coret-coretan.', icon: Keyboard, color: 'text-orange-500' },
    { id: 3, text: 'Cari tempat yang tenang agar kamu fokus mengerjakan.', icon: Coffee, color: 'text-yellow-500' },
    { id: 4, text: 'Pastikan baterai perangkatmu cukup atau terhubung ke daya.', icon: AlertCircle, color: 'text-teal-600' }
  ];

  const [checkedSteps, setCheckedSteps] = useState(new Set());

  const toggleStep = (id) => {
    const newChecked = new Set(checkedSteps);
    if (newChecked.has(id)) newChecked.delete(id);
    else newChecked.add(id);
    setCheckedSteps(newChecked);
  };

  const isReady = checkedSteps.size === prepSteps.length;

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

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left Column: Info Card */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-100 dark:bg-orange-900/20 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-teal-100 dark:group-hover:bg-teal-900/20 transition-colors duration-700" />
              
              <div className="relative z-10 space-y-6">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-yellow-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-orange-500/20">
                  <ClipboardList size={32} />
                </div>
                
                <div className="space-y-2">
                  <h1 className="text-3xl font-black text-slate-800 dark:text-white leading-tight">
                    {simulationData?.title}
                  </h1>
                  <p className="text-sm font-bold text-teal-600 dark:text-teal-400 flex items-center gap-2">
                    <BookOpen size={16} />
                    {simulationData?.subject}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-3xl border border-slate-100 dark:border-slate-700">
                    <div className="flex items-center gap-2 text-slate-400 mb-1">
                      <Timer size={14} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Durasi</span>
                    </div>
                    <p className="text-lg font-black text-slate-800 dark:text-white">{simulationData?.duration} Menit</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-3xl border border-slate-100 dark:border-slate-700">
                    <div className="flex items-center gap-2 text-slate-400 mb-1">
                      <ClipboardList size={14} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Soal</span>
                    </div>
                    <p className="text-lg font-black text-slate-800 dark:text-white">{simulationData?.questionCount} Butir</p>
                  </div>
                </div>

                <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-2xl border border-orange-100 dark:border-orange-900/30">
                  <p className="text-xs font-medium text-orange-700 dark:text-orange-300 leading-relaxed">
                    {simulationData?.description}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Preparation Steps */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 md:p-10 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700 space-y-8">
              <div>
                <h2 className="text-2xl font-black text-slate-800 dark:text-white">Langkah Persiapan</h2>
                <p className="text-sm text-slate-400 font-medium">Selesaikan daftar periksa berikut agar belajarmu lancar!</p>
              </div>

              <div className="space-y-4">
                {prepSteps.map((step) => (
                  <button
                    key={step.id}
                    onClick={() => toggleStep(step.id)}
                    className={`w-full flex items-center gap-4 p-5 rounded-3xl border-2 transition-all text-left group ${
                      checkedSteps.has(step.id)
                        ? 'bg-teal-50 border-teal-200 dark:bg-teal-900/20 dark:border-teal-900/50'
                        : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 hover:border-orange-200 dark:hover:border-orange-900/30'
                    }`}
                  >
                    <div className={`p-3 rounded-2xl shrink-0 transition-colors ${
                      checkedSteps.has(step.id) ? 'bg-teal-500 text-white' : 'bg-slate-50 dark:bg-slate-900 text-slate-400 group-hover:text-orange-500'
                    }`}>
                      <step.icon size={24} />
                    </div>
                    <span className={`text-sm md:text-base font-bold flex-1 ${
                      checkedSteps.has(step.id) ? 'text-teal-700 dark:text-teal-400' : 'text-slate-600 dark:text-slate-400'
                    }`}>
                      {step.text}
                    </span>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                      checkedSteps.has(step.id) 
                        ? 'bg-teal-500 border-teal-500 text-white' 
                        : 'border-slate-200 dark:border-slate-600'
                    }`}>
                      {checkedSteps.has(step.id) && <CheckCircle2 size={16} />}
                    </div>
                  </button>
                ))}
              </div>

              <div className="pt-6">
                <button
                  disabled={!isReady}
                  onClick={() => navigate(`/exam/${examId}`)}
                  className={`w-full group relative flex items-center justify-center gap-3 py-6 rounded-3xl font-black text-lg uppercase tracking-widest transition-all shadow-2xl active:scale-95 ${
                    isReady
                      ? 'bg-gradient-to-r from-teal-500 via-teal-600 to-indigo-600 text-white shadow-teal-500/25 hover:shadow-teal-500/40'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed shadow-none'
                  }`}
                >
                  <Play size={24} fill={isReady ? "currentColor" : "none"} />
                  <span>Masuk Simulasi</span>
                  {isReady && (
                    <motion.div 
                      layoutId="glow"
                      className="absolute inset-0 bg-white/20 rounded-3xl animate-pulse" 
                    />
                  )}
                </button>
                {!isReady && (
                  <p className="text-center text-[10px] font-black uppercase tracking-widest text-slate-400 mt-4 animate-bounce">
                    Selesaikan semua langkah di atas untuk mulai!
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
