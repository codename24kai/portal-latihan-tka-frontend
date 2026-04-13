import React, { useState, useEffect } from 'react';
import {
  ClipboardList,
  Dumbbell,
  Calendar,
  ArrowRight,
  Clock,
  LayoutGrid,
  History,
  Trophy,
  CheckCircle2,
  ChevronRight,
  Zap
} from 'lucide-react';
import mockExams from '../../data/mockExams';
import MissionCard from '../components/MissionCard';
import { useNavigate } from 'react-router-dom';

/**
 * Visual Countdown Widget for Students.
 */
function CountdownWidget({ targetDate }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const target = new Date(targetDate);
      const diff = target - now;

      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / 1000 / 60) % 60),
        });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const TimeUnit = ({ value, label, color }) => (
    <div className="flex flex-col items-center">
      <div className={`w-16 h-16 md:w-20 md:h-20 ${color} rounded-[1.5rem] flex items-center justify-center text-2xl md:text-3xl font-black text-white shadow-lg`}>
        {value.toString().padStart(2, '0')}
      </div>
      <span className="text-[10px] font-black text-slate-400 mt-2 uppercase tracking-widest">{label}</span>
    </div>
  );

  return (
    <div className="flex items-center gap-4 md:gap-6">
      <TimeUnit value={timeLeft.days} label="Hari" color="bg-orange-500" />
      <div className="text-2xl font-black text-slate-300 mb-6">:</div>
      <TimeUnit value={timeLeft.hours} label="Jam" color="bg-orange-600" />
      <div className="text-2xl font-black text-slate-300 mb-6">:</div>
      <TimeUnit value={timeLeft.minutes} label="Menit" color="bg-teal-600" />
    </div>
  );
}

/**
 * Student Test Page - Overhauled for engagement and clarity.
 */
export default function StudentTest() {
  const [activeTab, setActiveTab] = useState('ujian'); // 'ujian' or 'latihan'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);
  const [token, setToken] = useState('');
  const [tokenError, setTokenError] = useState(false);
  const navigate = useNavigate();

  const exams = mockExams.filter(e => e.type === 'tryout');
  const practices = mockExams.filter(e => e.type === 'practice');
  const completedHistory = mockExams.filter(e => e.status === 'completed');

  const handleStartExam = (exam) => {
    setSelectedExam(exam);
    setIsModalOpen(true);
    setToken('');
    setTokenError(false);
  };

  const handleConfirmStart = () => {
    if (selectedExam.type === 'tryout') {
      if (token === 'TKA2026') {
        navigate(`/exam/${selectedExam.id}`, { state: { examType: selectedExam.type } });
      } else {
        setTokenError(true);
      }
    } else {
      navigate(`/exam/${selectedExam.id}`, { state: { examType: selectedExam.type } });
    }
  };

  const currentItems = activeTab === 'ujian' ? exams : practices;

  return (
    <div className="space-y-12 animate-fade-in pb-20">

      {/* 1. HERO & COUNTDOWN SECTION */}
      <div className="relative overflow-hidden bg-white dark:bg-dark-surface rounded-[3rem] p-8 md:p-12 border border-slate-100 dark:border-slate-800 shadow-sm">
        {/* Background abstract elements */}
        <div className="absolute top-[-10%] right-[-5%] w-64 h-64 bg-orange-100/50 dark:bg-orange-900/10 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] left-[-5%] w-48 h-48 bg-teal-100/50 dark:bg-teal-900/10 rounded-full blur-3xl" />

        <div className="relative flex flex-col xl:flex-row xl:items-center justify-between gap-12">
          <div className="max-w-xl space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400 rounded-full text-xs font-black uppercase tracking-[0.2em] mb-2">
              <Zap size={14} fill="currentColor" /> Fokus Belajar Hari Ini
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-800 dark:text-white leading-[1.1] tracking-tight italic">
              Pusat <span className="text-orange-600 italic-none not-italic">Ujian</span> & Latihan
            </h1>
            <p className="text-base text-slate-500 font-bold dark:text-slate-400">
              Ayo selesaikan tantangan hari ini dan kumpulkan bintang emasmu!
            </p>
          </div>

          <div className="bg-slate-50/50 dark:bg-slate-900/50 p-6 md:p-8 rounded-[2.5rem] border border-white dark:border-slate-800 shadow-inner flex flex-col md:flex-row items-center gap-8">
            <div className="text-center md:text-left">
              <h4 className="font-black text-slate-400 text-[10px] uppercase tracking-[0.2em] mb-4">Ujian Terdekat Akan Dimulai</h4>
              <CountdownWidget targetDate="2026-04-14T08:00:00" />
            </div>
            <div className="h-20 w-[1px] bg-slate-200 dark:bg-slate-700 hidden md:block" />
            <div className="text-center">
              <p className="text-[10px] font-black text-teal-600 uppercase tracking-widest mb-1 italic">Senin, 14 April 2026</p>
              <p className="text-lg font-black text-slate-700 dark:text-white leading-none tracking-tight">08:00 WIB</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. NAVIGATION TABS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex p-2 bg-white dark:bg-slate-800 rounded-[2rem] w-full md:w-fit shadow-sm border border-slate-100 dark:border-slate-700">
          <button
            onClick={() => setActiveTab('ujian')}
            className={`flex-1 md:flex-none flex items-center justify-center gap-3 px-8 py-4 rounded-[1.5rem] font-black text-xs tracking-widest transition-all ${activeTab === 'ujian'
                ? 'bg-orange-600 text-white shadow-xl shadow-orange-600/20'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
          >
            <ClipboardList size={18} /> SIMULASI TRYOUT
          </button>
          <button
            onClick={() => setActiveTab('latihan')}
            className={`flex-1 md:flex-none flex items-center justify-center gap-3 px-8 py-4 rounded-[1.5rem] font-black text-xs tracking-widest transition-all ${activeTab === 'latihan'
                ? 'bg-teal-600 text-white shadow-xl shadow-teal-600/20'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
          >
            <Dumbbell size={18} /> LATIHAN MANDIRI
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest px-4">
           <LayoutGrid size={16} className="text-teal-600" />
           Tampilan: <span className="text-slate-800 dark:text-white ml-1">Grid Dinamis</span>
        </div>
      </div>

      {/* 3. CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {currentItems.map((item) => (
          <MissionCard 
            key={item.id} 
            exam={item} 
            isPractice={activeTab === 'latihan'}
            onStart={() => handleStartExam(item)} 
          />
        ))}

        {currentItems.length === 0 && (
          <div className="col-span-full py-32 bg-slate-50/50 dark:bg-slate-900/30 rounded-[3rem] border border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-center space-y-6">
            <div className="w-24 h-24 bg-white dark:bg-slate-800 rounded-[2rem] flex items-center justify-center text-slate-300 dark:text-slate-700 shadow-xl shadow-slate-200/50">
              <ClipboardList size={48} />
            </div>
            <div>
              <p className="text-slate-400 font-black tracking-[0.25em] uppercase text-sm italic">Belum Ada Item Tersedia</p>
              <p className="text-slate-400/60 font-bold text-xs mt-2 uppercase tracking-widest">Pantau terus jadwal belajarmu!</p>
            </div>
          </div>
        )}
      </div>

      {/* 4. RIWAYAT PENGERJAAN (HISTORY) */}
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-teal-50 dark:bg-teal-900/20 rounded-2xl flex items-center justify-center text-teal-600 shadow-sm border border-teal-100 dark:border-teal-900/30">
               <History size={24} />
             </div>
             <div>
               <h2 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic">Riwayat <span className="text-teal-600">Terakhirmu</span></h2>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Pantau progres pengerjaanmu di sini</p>
             </div>
          </div>
          <button className="flex items-center gap-2 text-[10px] font-black text-slate-400 hover:text-teal-600 uppercase tracking-[0.2em] transition-colors">
            Lihat Semua <ChevronRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           {completedHistory.length > 0 ? completedHistory.map((item) => (
             <div key={`history-${item.id}`} className="group p-6 bg-white dark:bg-dark-surface rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-10 h-10 rounded-xl ${item.bgLight} dark:bg-white/5 flex items-center justify-center`}>
                    <CheckCircle2 size={18} className="text-teal-600" />
                  </div>
                  <div className="text-right">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest italic">Hasil Skor</p>
                    <p className="text-xl font-black text-teal-600">{item.score}</p>
                  </div>
                </div>
                <h4 className="font-black text-slate-800 dark:text-white text-sm uppercase tracking-tight mb-1 truncate group-hover:text-teal-600 transition-colors uppercase">{item.subject}</h4>
                <div className="flex items-center gap-2">
                  <Clock size={12} className="text-slate-300" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Selesai Kemarin</span>
                </div>
             </div>
           )) : (
            <div className="col-span-full py-12 text-center bg-slate-50/50 dark:bg-slate-900/10 rounded-[2rem] border border-dashed border-slate-200 dark:border-slate-700">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Belum Ada Riwayat Pengerjaan</p>
            </div>
           )}
        </div>
      </div>

      {/* CONFIRMATION MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-fade-in" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white dark:bg-slate-800 p-10 rounded-[3rem] shadow-2xl max-w-sm w-full animate-in zoom-in-95 duration-200 border border-white/20 dark:border-slate-700">
            <div className="w-16 h-16 bg-orange-50 dark:bg-orange-950/30 rounded-2xl flex items-center justify-center text-orange-600 mb-6 mx-auto">
               <Zap size={32} fill="currentColor" />
            </div>
            
            <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-2 leading-tight text-center uppercase tracking-tight">Sudah Siap?</h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs font-bold mb-8 text-center uppercase tracking-widest leading-relaxed">
              {selectedExam.type === 'tryout'
                ? 'Pastikan koneksi aman! Kamu akan memulai Simulasi Resmi.'
                : 'Ukur kemampuanmu dengan latihan mandiri ini!'}
            </p>

            {selectedExam.type === 'tryout' && (
              <div className="space-y-3 mb-8">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Kode Akses Ujian</label>
                <input
                  type="text"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="Contoh: TKA2026"
                  className={`w-full h-14 px-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border-2 transition-all font-black tracking-[0.2em] text-center text-sm ${tokenError ? 'border-rose-400 focus:ring-rose-500/10' : 'border-slate-100 dark:border-slate-700 focus:border-orange-500 focus:ring-orange-500/10'
                    }`}
                />
                {tokenError && <p className="text-[10px] font-black text-rose-500 text-center animate-shake mt-2 uppercase tracking-widest">Kode Akses Salah!</p>}
              </div>
            )}

            <div className="flex flex-col gap-3">
              <button
                onClick={handleConfirmStart}
                className="w-full py-5 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-orange-500/20"
              >
                Mulai Ujian Sekarang
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-full py-5 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-slate-200 transition-all outline-none"
              >
                Nanti Dulu
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
