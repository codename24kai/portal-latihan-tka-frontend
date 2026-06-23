import React, { useState, useMemo, useEffect } from 'react';
import {
  BookOpen,
  Download,
  Lock,
  Play,
  CheckCircle2,
  Gamepad2,
  Clock,
  Info,
  RotateCcw,
  Calculator,
  Library,
  FileText,
  Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { getDaftarModul } from '@/utilitas/apiSiswa';

export default function StudentModul() {
  const navigate = useNavigate();

  const [modules, setModules] = useState([]);
  const [activeTab, setActiveTab] = useState('Semua');
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [activeModule, setActiveModule] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mengambil data dari Backend dan sinkronisasi dengan Local Progress
  useEffect(() => {
    const fetchModules = async () => {
      try {
        setLoading(true);
        // Menggunakan utilitas apiSiswa
        const apiData = await getDaftarModul();

        // Mapped response (sudah dilakukan di adapter, jadi hanya ditambahkan styling khusus UI jika diperlukan)
        const mappedModules = apiData.map((mod, index) => {
          const isMath = mod.mataPelajaran === 'Matematika';
          const isBahasa = mod.mataPelajaran === 'Bahasa Indonesia';

          return {
            id: mod.id,
            title: mod.judul,
            subject: mod.mataPelajaran || 'Umum',
            pages: mod.totalMateri || 20,
            size: '2.0 MB', // mock size
            heroImage: mod.gambarCover,
            color: isMath ? 'from-teal-400 to-teal-600' : isBahasa ? 'from-orange-400 to-orange-600' : 'from-slate-400 to-slate-600',
            bgLight: isMath ? 'bg-teal-50' : isBahasa ? 'bg-orange-50' : 'bg-slate-50',
            textColor: isMath ? 'text-teal-600' : isBahasa ? 'text-orange-600' : 'text-slate-600',
            hasQuiz: false, // fallback untuk quiz
            quizLocked: true, 
            prerequisiteType: 'download',
            type: 'pdf',
            estimasiWaktu: `± 30 menit`,
            progressStatus: mod.status || 'belum',
            isFirst: index === 0
          };
        });

        // SINKRONISASI: Timpa dengan progress dari LocalStorage (jika ada)
        const storedProgress = JSON.parse(localStorage.getItem('materi_progress') || '{}');
        const syncedModules = mappedModules.map(mod => {
          const localProgress = storedProgress[mod.id];
          const finalProgress = localProgress || mod.progressStatus;

          return {
            ...mod,
            progressStatus: finalProgress,
            quizLocked: finalProgress === 'selesai' ? false : mod.quizLocked
          };
        });

        setModules(syncedModules);
      } catch (error) {
        console.error('Gagal memuat modul dari server:', error);
        // Bisa tambahkan toast error di sini
      } finally {
        setLoading(false);
      }
    };

    fetchModules();
  }, []);

  // Segmentasi Data Berdasarkan Mata Pelajaran
  const mathModules = useMemo(() => {
    return modules.filter(m => m.subject === 'Matematika' && m.progressStatus !== 'selesai');
  }, [modules]);

  const bahasaModules = useMemo(() => {
    return modules.filter(m => m.subject === 'Bahasa Indonesia' && m.progressStatus !== 'selesai');
  }, [modules]);

  const generalModules = useMemo(() => {
    return modules.filter(m => m.subject !== 'Matematika' && m.subject !== 'Bahasa Indonesia' && m.progressStatus !== 'selesai');
  }, [modules]);

  const completedModules = useMemo(() => {
    return modules.filter(m => m.progressStatus === 'selesai');
  }, [modules]);

  const handleQuizStart = (mod) => {
    setActiveModule(mod);
    setIsConfirmOpen(true);
  };

  const handleContentAccess = (moduleId) => {
    navigate(`/modul/materi/${moduleId}`);
  };

  // Komponen Helper Internal
  const Badge = ({ subject }) => {
    const isMath = subject === 'Matematika';
    return (
      <span className={`inline-flex items-center gap-1.5 text-[9px] font-black px-3 py-1.5 rounded-lg border backdrop-blur-md uppercase tracking-widest ${isMath
        ? 'bg-teal-500/20 text-teal-100 border-teal-400/30'
        : subject === 'Bahasa Indonesia'
          ? 'bg-orange-500/20 text-orange-100 border-orange-400/30'
          : 'bg-slate-500/20 text-slate-100 border-slate-400/30'
        }`}>
        {isMath ? <Calculator size={10} /> : subject === 'Bahasa Indonesia' ? <Library size={10} /> : <BookOpen size={10} />}
        {subject}
      </span>
    );
  };

  const ModuleCard = ({ mod }) => (
    <div
      key={mod.id}
      className={`group relative bg-white dark:bg-slate-800 border-2 rounded-[2.5rem] transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 ${mod.progressStatus === 'selesai'
        ? 'border-emerald-100 dark:border-emerald-900/30 bg-slate-50/50 dark:bg-slate-900/40'
        : 'border-slate-100 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-indigo-700'
        }`}
    >
      <div>
        <div className="relative h-48 overflow-hidden bg-slate-100 dark:bg-slate-800">
          <img
            src={mod.heroImage}
            alt={mod.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            onError={(e) => {
              e.target.src = 'https://placehold.co/600x400/e2e8f0/475569?text=Ilustrasi+Modul'; // Fallback image
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent" />

          {/* Status Badge */}
          <div className="absolute top-4 right-4 flex flex-col items-end gap-2 z-10">
            {mod.isFirst && mod.progressStatus !== 'selesai' && (
              <div className="px-3 py-1 bg-amber-500 text-white rounded-full text-[9px] font-black uppercase tracking-widest animate-pulse shadow-lg flex items-center gap-1">
                <Gamepad2 size={10} /> Mulai di sini
              </div>
            )}
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-md backdrop-blur-md ${mod.progressStatus === 'selesai'
              ? 'bg-emerald-500/90 text-white border border-emerald-400'
              : mod.progressStatus === 'sedang'
                ? 'bg-blue-500/90 text-white border border-blue-400'
                : 'bg-white/90 text-slate-600 border border-white/50'
              }`}>
              {mod.progressStatus === 'selesai' && <CheckCircle2 size={12} />}
              {mod.progressStatus === 'selesai' ? 'Tuntas' : mod.progressStatus === 'sedang' ? 'Sedang Belajar' : 'Belum Dibaca'}
            </div>
          </div>

          <div className="absolute bottom-0 left-0 p-5 w-full z-10">
            <Badge subject={mod.subject} />
            <h3 className={`text-xl md:text-2xl font-black leading-tight mt-2 transition-colors uppercase tracking-tight drop-shadow-md ${mod.progressStatus === 'selesai' ? 'text-white/70' : 'text-white'}`}>
              {mod.title}
            </h3>
          </div>
        </div>

        {/* Info Strip */}
        <div className="grid grid-cols-2 gap-px bg-slate-100 dark:bg-slate-700/50 border-b border-slate-100 dark:border-slate-700">
          <div className="flex items-center justify-center gap-2 p-3 bg-white dark:bg-slate-800 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">
            <Clock size={14} className="text-indigo-400" /> {mod.estimasiWaktu}
          </div>
          <div className="flex items-center justify-center gap-2 p-3 bg-white dark:bg-slate-800 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">
            <FileText size={14} className="text-teal-400" /> {mod.pages} Halaman
          </div>
        </div>
      </div>

      <div className="p-6 space-y-3 bg-white dark:bg-slate-800">
        {mod.progressStatus === 'selesai' ? (
          <button
            onClick={() => handleContentAccess(mod.id)}
            className="w-full py-4 bg-slate-100 dark:bg-slate-700/50 text-slate-500 dark:text-slate-300 font-black text-[10px] uppercase tracking-[0.15em] rounded-2xl transition-all flex items-center justify-center gap-2 hover:bg-slate-200 dark:hover:bg-slate-600 active:scale-95"
          >
            <RotateCcw size={16} /> Belajar Ulang
          </button>
        ) : (
          <>
            <button
              onClick={() => handleContentAccess(mod.id)}
              className="w-full py-4 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/20 dark:hover:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 font-black text-[10px] uppercase tracking-widest rounded-2xl transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              {mod.type === 'video' ? <Play size={16} /> : <Download size={16} />}
              {mod.type === 'video' ? 'Tonton Materi' : 'Buka Modul PDF'}
            </button>

            {mod.hasQuiz ? (
              <div className="relative group/quiz">
                <button
                  disabled={mod.quizLocked}
                  onClick={() => handleQuizStart(mod)}
                  className={`w-full py-4 font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl transition-all flex items-center justify-center gap-2 active:scale-95 ${mod.quizLocked
                    ? 'bg-slate-100 dark:bg-slate-800/80 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700 cursor-not-allowed'
                    : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/30 border border-emerald-400'
                    }`}
                >
                  {mod.quizLocked ? <Lock size={14} /> : <Gamepad2 size={16} />}
                  {mod.quizLocked ? 'Kuis Terkunci' : 'Mulai Kuis Game'}
                </button>

                {mod.quizLocked && (
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-slate-800 text-white text-[9px] font-bold uppercase tracking-widest rounded-lg whitespace-nowrap shadow-xl opacity-0 group-hover/quiz:opacity-100 transition-opacity pointer-events-none z-20">
                    Buka modul dulu untuk main!
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-800 rotate-45" />
                  </div>
                )}
              </div>
            ) : (
              <div className="py-4 flex items-center justify-center text-[10px] font-black text-slate-300 dark:text-slate-600 border-2 border-dashed border-slate-100 dark:border-slate-700 rounded-2xl uppercase tracking-widest">
                Tidak Ada Kuis
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 size={48} className="text-indigo-500 animate-spin" />
        <p className="text-sm font-black text-slate-400 uppercase tracking-widest animate-pulse">
          Mempersiapkan Materi...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in duration-500 text-slate-900 dark:text-white pb-20">

      {/* Hero / Filter Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 bg-white dark:bg-slate-800 p-8 rounded-[3rem] shadow-sm border border-slate-100 dark:border-slate-700">
        <div>
          <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight italic">
            Katalog <span className="text-indigo-600">Modul</span>
          </h1>
          <p className="text-sm font-bold text-slate-500 tracking-wide mt-1 uppercase">
            Pilih materimu dan selesaikan tantangan kuisnya!
          </p>
        </div>

        {/* Visual Filter Tabs */}
        <div className="flex p-1.5 bg-slate-100 dark:bg-slate-900 rounded-[2rem] w-full md:w-fit border border-slate-200 dark:border-slate-800">
          {['Semua', 'Matematika', 'Bahasa Indonesia'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 md:flex-none flex items-center justify-center px-6 py-3.5 rounded-[1.5rem] font-black text-[10px] tracking-widest uppercase transition-all whitespace-nowrap ${activeTab === tab
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
            >
              {tab === 'Bahasa Indonesia' ? 'B. Indonesia' : tab}
            </button>
          ))}
        </div>
      </div>

      {/* ========================================= */}
      {/* SECTION: MATEMATIKA                       */}
      {/* ========================================= */}
      {(activeTab === 'Semua' || activeTab === 'Matematika') && mathModules.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center gap-4 pl-2">
            <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/30 rounded-2xl flex items-center justify-center text-teal-600 dark:text-teal-400 shadow-inner">
              <Calculator size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black uppercase tracking-tight italic">Misi <span className="text-teal-600 dark:text-teal-400">Matematika</span></h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Kuasai angka dan logika ruang</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {mathModules.map((mod) => (
              <ModuleCard key={mod.id} mod={mod} />
            ))}
          </div>
        </div>
      )}

      {/* ========================================= */}
      {/* SECTION: BAHASA INDONESIA                 */}
      {/* ========================================= */}
      {(activeTab === 'Semua' || activeTab === 'Bahasa Indonesia') && bahasaModules.length > 0 && (
        <div className="space-y-6 pt-6">
          <div className="flex items-center gap-4 pl-2">
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-2xl flex items-center justify-center text-orange-600 dark:text-orange-400 shadow-inner">
              <Library size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black uppercase tracking-tight italic">Misi <span className="text-orange-600 dark:text-orange-400">Bahasa Indonesia</span></h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pahami literasi dan karya sastra</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {bahasaModules.map((mod) => (
              <ModuleCard key={mod.id} mod={mod} />
            ))}
          </div>
        </div>
      )}

      {/* ========================================= */}
      {/* SECTION: UMUM / PANDUAN                   */}
      {/* ========================================= */}
      {generalModules.length > 0 && activeTab === 'Semua' && (
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-[3rem] p-8 md:p-10 space-y-8 border border-slate-200 dark:border-slate-800 mt-12">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white dark:bg-slate-700 rounded-2xl flex items-center justify-center text-slate-500 shadow-sm border border-slate-200 dark:border-slate-600">
              <Info size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black uppercase tracking-tight italic">Materi <span className="text-slate-500">Pendukung</span></h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Informasi umum & panduan belajar</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {generalModules.map((mod) => (
              <ModuleCard key={mod.id} mod={mod} />
            ))}
          </div>
        </div>
      )}

      {/* ========================================= */}
      {/* SECTION: MODUL SELESAI                    */}
      {/* ========================================= */}
      {completedModules.length > 0 && activeTab === 'Semua' && (
        <div className="bg-emerald-50 dark:bg-emerald-900/10 rounded-[3rem] p-8 md:p-12 border border-emerald-100 dark:border-emerald-900/30 mt-12">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center text-emerald-500 shadow-sm border border-emerald-200 dark:border-emerald-800">
              <CheckCircle2 size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-black uppercase tracking-tight italic">Modul <span className="text-emerald-600 dark:text-emerald-400">Tuntas!</span></h2>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-0.5 italic">Hebat! Kamu sudah menyelesaikan materi ini.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {completedModules.map((mod) => (
              <ModuleCard key={mod.id} mod={mod} />
            ))}
          </div>
        </div>
      )}

      {/* Verification Popup */}
      {isConfirmOpen && activeModule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm animate-in fade-in" onClick={() => setIsConfirmOpen(false)} />
          <div className="relative bg-white dark:bg-slate-800 p-8 md:p-10 rounded-[3rem] shadow-2xl max-w-sm w-full text-center space-y-8 animate-in zoom-in-95 duration-200 border border-slate-100 dark:border-slate-700">
            <div className="w-24 h-24 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-500 rounded-[2rem] flex items-center justify-center mx-auto shadow-inner border border-emerald-100 dark:border-emerald-800">
              <Gamepad2 size={48} fill="currentColor" />
            </div>
            <div className="space-y-3">
              <h3 className="text-2xl font-black text-slate-800 dark:text-white leading-tight uppercase tracking-tight italic">Siap <span className="text-emerald-500">Mulai Kuis?</span></h3>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest leading-relaxed">
                Pastikan kamu sudah memahami materi <strong className="text-slate-700 dark:text-slate-200">{activeModule.title}</strong> agar dapat skor sempurna!
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  setIsConfirmOpen(false);
                  navigate(`/modul/kuis/${activeModule.id}`);
                }}
                className="w-full py-5 bg-emerald-500 text-white font-black text-[11px] uppercase tracking-widest rounded-2xl hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-500/30 active:scale-95"
              >
                Ya, Main Sekarang!
              </button>
              <button
                onClick={() => setIsConfirmOpen(false)}
                className="w-full py-5 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 font-black text-[11px] uppercase tracking-widest rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-all active:scale-95"
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