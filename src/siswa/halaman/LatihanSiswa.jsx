import React, { useState, useEffect, useMemo } from 'react';
import {
  ClipboardList,
  Dumbbell,
  LayoutGrid,
  History,
  CheckCircle2,
  ChevronRight,
  Clock,
  Zap
} from 'lucide-react';
import { getDaftarSesiLatihan, getDaftarLatihan } from '@/utilitas/apiSiswa';
import MissionCard from '@/komponen/siswa/KartuMisi';
import { useNavigate } from 'react-router-dom';

/**
 * Visual Countdown Widget for Students.
 */
function CountdownWidget({ targetDate }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 });

  const TimeUnit = ({ value, label, color }) => (
    <div className="flex flex-col items-center">
      <div className={`w-12 h-12 md:w-14 md:h-14 ${color} rounded-2xl flex items-center justify-center text-xl md:text-2xl font-black text-white shadow-lg`}>
        {value.toString().padStart(2, '0')}
      </div>
      <span className="text-[8px] font-black text-slate-400 mt-1.5 uppercase tracking-widest">{label}</span>
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
 * Student Test Page
 */
export default function StudentTest() {
  const [activeTab, setActiveTab] = useState('latihan-siswa'); // 'ujian' or 'latihan'
  const navigate = useNavigate();
  
  const [exams, setExams] = useState([]);
  const [practices, setPractices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSesiDanLatihan = async () => {
      try {
        setLoading(true);
        const [sesiLatihanData, latihanData] = await Promise.all([
          getDaftarSesiLatihan(),
          getDaftarLatihan()
        ]);

        const processedSimulasi = (sesiLatihanData || []).map(exam => ({
          ...exam,
          displayDuration: `${exam.durasi} Menit`,
          type: 'tryout',
          questionCount: exam.questionCount || exam.jumlah_soal || 40,
          status: exam.status || 'available',
          title: exam.judul_sesi_latihan || exam.judul
        }));

        const processedLatihan = (latihanData || []).map(exam => ({
          ...exam,
          displayDuration: `${exam.durasiMenit} Menit`,
          type: 'practice',
          questionCount: exam.jumlahSoal || 20,
          status: exam.status || 'available',
          title: exam.judul_latihan || exam.judul
        }));

        setExams(processedSimulasi);
        setPractices(processedLatihan);
      } catch (error) {
        console.error("Gagal memuat ujian/latihan", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSesiDanLatihan();
  }, []);

  const completedHistory = [...exams, ...practices].filter(e => e.status === 'completed');

  const handleStartExam = (exam) => {
    navigate(`/siswa/sesi-latihan/${exam.id}/pra`);
  };

  const currentItems = activeTab === 'ujian' ? exams : practices;

  return (
    <div className="space-y-12 animate-fade-in pb-20 max-w-7xl mx-auto">

      {/* 1. HERO & COUNTDOWN SECTION */}
      <div className="relative overflow-hidden bg-white dark:bg-slate-800 rounded-[2.5rem] p-6 md:p-10 border border-slate-100 dark:border-slate-700 shadow-sm">
        <div className="absolute top-[-10%] right-[-5%] w-64 h-64 bg-orange-100/50 dark:bg-orange-900/10 rounded-full blur-3xl text-orange-200" />

        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="max-w-xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-orange-50 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400 rounded-full text-[10px] font-black uppercase tracking-widest">
              <Zap size={12} fill="currentColor" /> Fokus Hari Ini
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-800 dark:text-white leading-tight tracking-tight italic">
              Pusat <span className="text-orange-600 italic-none not-italic">Ujian</span> & Latihan
            </h1>
            <p className="text-sm text-slate-500 font-bold dark:text-slate-400">
              Kerjakan dengan sungguh-sungguh agar mendapatkan hasil terbaik!
            </p>
          </div>

          <div className="bg-slate-50/50 dark:bg-slate-900/50 p-5 md:p-6 rounded-[2rem] border border-white dark:border-slate-800 shadow-inner flex items-center gap-6">
            <div className="text-center md:text-left shrink-0">
              <h4 className="font-black text-slate-400 text-[9px] uppercase tracking-widest mb-3">Tantangan Terdekat</h4>
              <CountdownWidget targetDate="2026-06-15T08:00:00" />
            </div>
            <div className="h-16 w-[1px] bg-slate-200 dark:bg-slate-700 hidden sm:block" />
            <div className="text-center hidden sm:block">
              <p className="text-[9px] font-black text-teal-600 uppercase tracking-widest mb-1 italic">15 Juni 2026</p>
              <p className="text-base font-black text-slate-700 dark:text-white leading-none tracking-tight">08:00 WIB</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. NAVIGATION TABS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex p-1.5 bg-white dark:bg-slate-800 rounded-[1.5rem] w-full md:w-fit shadow-sm border border-slate-100 dark:border-slate-700">
          <button
            onClick={() => setActiveTab('ujian')}
            className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-black text-[10px] tracking-widest transition-all ${activeTab === 'ujian'
              ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/20'
              : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
          >
            <ClipboardList size={16} /> SIMULASI TKA ({exams.length})
          </button>
          <button
            onClick={() => setActiveTab('latihan')}
            className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-black text-[10px] tracking-widest transition-all ${activeTab === 'latihan'
              ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/20'
              : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
          >
            <Dumbbell size={16} /> LATIHAN MANDIRI ({practices.length})
          </button>
        </div>

        <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest px-4">
          <LayoutGrid size={14} className="text-teal-600" />
          Tampilan: <span className="text-slate-800 dark:text-white ml-1">Grid Dinamis</span>
        </div>
      </div>

      {/* 3. CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {currentItems.map((item) => (
          <MissionCard
            key={item.id}
            exam={{
              ...item,
              // Overrides properti duration untuk keperluan UI (MissionCard biasanya membaca properti duration)
              duration: item.displayDuration
            }}
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
            <div
              key={`history-${item.id}`}
              onClick={() => {
                if (item.type === 'practice') {
                  navigate(`/siswa/latihan/${item.id}/hasil`);
                } else {
                  navigate(`/siswa/sesi-latihan/${item.id}/hasil`);
                }
              }}
              className="group p-6 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-xl transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl ${item.bgLight || 'bg-slate-100'} dark:bg-white/5 flex items-center justify-center`}>
                  <CheckCircle2 size={18} className="text-teal-600" />
                </div>
                <div className="text-right">
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest italic">Hasil Skor</p>
                  <p className="text-xl font-black text-teal-600">{item.score || 0}</p>
                </div>
              </div>
              <h4 className="font-black text-slate-800 dark:text-white text-sm uppercase tracking-tight mb-1 truncate group-hover:text-teal-600 transition-colors">{item.subject || item.title}</h4>
              <div className="flex items-center gap-2">
                <Clock size={12} className="text-slate-300 dark:text-slate-500" />
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

    </div>
  );
}
