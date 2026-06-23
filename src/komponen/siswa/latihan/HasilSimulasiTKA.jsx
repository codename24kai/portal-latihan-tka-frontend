import { useMemo, useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { LayoutDashboard, ShieldAlert, CheckCircle, Clock, Heart, Award, ArrowRight, MessageCircle, Info } from 'lucide-react';
import MathRenderer from '@/komponen/ui/RendererMatematika';
import { calculateScore } from '@/utilitas/mesinPenilaian';
import { getDetailSimulasi } from '@/utilitas/apiSiswa';
import LoadingSkeleton from '@/komponen/ui/SkeletonMemuat';

export default function HasilSimulasiTka() {
  const { simulasiId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [showReview, setShowReview] = useState(false);
  const [surveyCompleted, setSurveyCompleted] = useState(false);
  const [currentExam, setCurrentExam] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Determine linked survey based on simulasi ID
  const surveyId = useMemo(() => {
    return simulasiId === '2' ? 'sulingjar-sd6' : 'survei-karakter-sd6';
  }, [simulasiId]);

  // Check if survey has been completed
  useEffect(() => {
    const isCompleted = localStorage.getItem(`survey_completed_${surveyId}`) === 'true';
    setSurveyCompleted(isCompleted);
  }, [surveyId]);

  useEffect(() => {
    const loadDetail = async () => {
      try {
        const data = await getDetailSimulasi(simulasiId);
        setCurrentExam(data || null);
      } catch (error) {
        setCurrentExam(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadDetail();
  }, [simulasiId]);

  const {
    answers = {},
    timeTaken = 0,
    timeUp = false,
    simulasiData = {}
  } = location.state || {};

  const simulasi = useMemo(() => currentExam, [currentExam]);

  // Calculations
  const stats = useMemo(() => {
    if (!simulasi) return { score: 0, correctCount: 0, incorrectCount: 0, unansweredCount: 0 };

    let poinDidapat = 0;
    let totalPoin = 0;
    let correctCount = 0;
    let incorrectCount = 0;
    let unansweredCount = 0;

    const questionList = simulasi?.soal || simulasi?.questions || [];

    questionList.forEach((q) => {
      const userAnswer = answers[q.id];
      const maxPoints = q.max_points || q.bobot || 1;
      totalPoin += maxPoints;

      if (userAnswer === undefined || userAnswer === null || userAnswer === '') {
        unansweredCount++;
      } else {
        const score = calculateScore(q, userAnswer, maxPoints);
        if (score === maxPoints) {
          correctCount++;
          poinDidapat += score;
        } else {
          incorrectCount++;
          poinDidapat += (score || 0);
        }
      }
    });

    const score = totalPoin > 0 ? Math.round((poinDidapat / totalPoin) * 100) : 0;
    return { score, correctCount, incorrectCount, unansweredCount };
  }, [answers, simulasi]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60) || 0;
    const s = seconds % 60 || 0;
    return `${m}m ${s}s`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-6">
        <LoadingSkeleton className="h-96 w-full max-w-5xl rounded-[2.5rem]" />
      </div>
    );
  }

  if (!simulasi) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-6">
        <div className="max-w-md w-full bg-white dark:bg-slate-800 p-10 rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-slate-700 text-center space-y-6">
          <ShieldAlert size={64} className="mx-auto text-rose-500" />
          <div>
            <h2 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic mb-2">Data Ujian Hilang</h2>
            <p className="text-sm font-bold text-slate-500">Hasil simulasi TKA tidak dapat dimuat karena sesi ujian sudah kedaluwarsa.</p>
          </div>
          <button
            onClick={() => navigate('/siswa/beranda')}
            className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-widest rounded-2xl transition-colors shadow-lg shadow-indigo-200 dark:shadow-none"
          >
            Kembali ke Beranda
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col pb-24 animate-fade-in">

      {/* Hero Header */}
      <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 text-white pt-20 pb-32 px-4 text-center relative overflow-hidden shadow-2xl">
        {/* Decorative Blobs */}
        <div className="absolute top-0 left-0 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />

        <div className="max-w-2xl mx-auto space-y-5 relative z-10">
          <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-3xl flex items-center justify-center mx-auto mb-6 border border-white/20 shadow-xl">
            <Award size={40} className="text-orange-400" />
          </div>
          <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] block">Hasil Evaluasi Akhir</span>
          <h1 className="text-3xl md:text-5xl font-black italic uppercase leading-tight">{simulasi?.judul_sesi_latihan || simulasi?.judul_simulasi || simulasi?.title}</h1>
          <p className="text-sm text-slate-300 font-bold max-w-lg mx-auto">Simulasi selesai disubmit. Berikut adalah statistik performa belajarmu hari ini.</p>
        </div>
      </div>

      {/* Main Content Container */}
      <main className="max-w-6xl mx-auto w-full px-4 -mt-20 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">

        {/* --- LEFT SIDE: Stats & Score --- */}
        <div className="lg:col-span-5 flex flex-col gap-6">

          {/* Score Card */}
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 md:p-10 text-center shadow-lg border border-slate-100 dark:border-slate-800 flex flex-col items-center">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4">Skor Perolehan Akhir</span>

            <div className="relative inline-block my-4">
              <span className="text-8xl md:text-9xl font-black italic text-indigo-600 dark:text-indigo-400 tracking-tighter drop-shadow-sm">
                {stats.score}
              </span>
              <span className="text-2xl font-black text-slate-300 absolute bottom-3 -right-12">/100</span>
            </div>

            <div className="w-full grid grid-cols-3 gap-4 pt-8 mt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700/50">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Benar</p>
                <p className="text-xl font-black text-teal-600">{stats.correctCount}</p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700/50">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Salah</p>
                <p className="text-xl font-black text-rose-500">{stats.incorrectCount}</p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700/50">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Kosong</p>
                <p className="text-xl font-black text-slate-500">{stats.unansweredCount}</p>
              </div>
            </div>
          </div>

          {/* Time & Status Widget */}
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 shadow-sm border border-slate-100 dark:border-slate-800 grid gap-4">
            <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl">
              <div className="flex items-center gap-3">
                <Clock size={18} className="text-indigo-500" />
                <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Waktu Mengerjakan</span>
              </div>
              <span className="text-base font-black text-slate-800 dark:text-white">{formatTime(timeTaken)}</span>
            </div>

            <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl">
              <div className="flex items-center gap-3">
                <Info size={18} className={timeUp ? "text-rose-500" : "text-teal-500"} />
                <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Status Penyelesaian</span>
              </div>
              <span className={`text-[10px] uppercase tracking-widest font-black px-3 py-1.5 rounded-lg ${timeUp ? 'bg-rose-100 text-rose-600 dark:bg-rose-900/30' : 'bg-teal-100 text-teal-600 dark:bg-teal-900/30'
                }`}>
                {timeUp ? 'Auto Submit' : 'Selesai Tepat'}
              </span>
            </div>
          </div>
        </div>

        {/* --- RIGHT SIDE: Mandatory Survey & Actions --- */}
        <div className="lg:col-span-7 flex flex-col gap-6">

          {/* Survey Announcement Box */}
          <div className={`p-8 md:p-10 rounded-[2.5rem] border-2 shadow-xl transition-all ${surveyCompleted
              ? 'bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-950/40 dark:to-emerald-950/20 border-teal-200 dark:border-teal-900/50'
              : 'bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/40 dark:to-amber-950/20 border-orange-200 dark:border-orange-900/50'
            }`}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 shadow-md ${surveyCompleted ? 'bg-teal-500 text-white' : 'bg-orange-500 text-white'
                }`}>
                {surveyCompleted ? <CheckCircle size={32} /> : <Heart size={32} fill="white" className="animate-pulse" />}
              </div>
              <div className="space-y-2 flex-1">
                <span className={`inline-block px-3 py-1 rounded-md text-[9px] font-black uppercase tracking-widest ${surveyCompleted ? 'bg-teal-100 text-teal-700 dark:bg-teal-900/50 dark:text-teal-300' : 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300'
                  }`}>
                  {surveyCompleted ? 'Tugas Selesai' : 'Tugas Wajib'}
                </span>
                <h3 className="text-xl md:text-2xl font-black text-slate-800 dark:text-white leading-tight uppercase tracking-tight italic">
                  {surveyCompleted ? 'Terima Kasih Atas Partisipasimu!' : 'Isi Survei Refleksi Sekarang'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-bold leading-relaxed mt-1">
                  {surveyCompleted
                    ? 'Kamu telah menyelesaikan survei. Akses menu dashboard dan beranda kini telah terbuka penuh.'
                    : 'Sesuai tata tertib TKA, kamu diwajibkan untuk melengkapi survei refleksi ini sebelum diperkenankan kembali ke dashboard utama.'
                  }
                </p>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-black/5 dark:border-white/5">
              {!surveyCompleted ? (
                <button
                  onClick={() => navigate(`/siswa/survei/${surveyId}`, { state: { fromSimulasiId: simulasiId } })}
                  className="w-full flex items-center justify-center gap-3 py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-black text-sm uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-orange-500/25 active:scale-95"
                >
                  <span className="text-center">Mulai Isi Survei</span> <ArrowRight size={18} className="shrink-0" />
                </button>
              ) : (
                <div className="w-full py-4 flex items-center justify-center gap-2 bg-teal-500/10 text-teal-600 dark:text-teal-400 rounded-2xl text-xs font-black uppercase tracking-widest">
                  <CheckCircle size={18} /> Pengisian Survei Selesai
                </div>
              )}
            </div>
          </div>

          {/* Action Row - PERBAIKAN RESPONSIVE */}
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 md:p-8 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col gap-4">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center mb-2">Aksi Lanjutan</h4>

            <div className="flex flex-col sm:flex-row gap-4 w-full">
              <button
                onClick={() => setShowReview(!showReview)}
                className={`w-full sm:w-1/2 flex items-center justify-center gap-2 sm:gap-3 py-4 px-2 border-2 rounded-2xl font-black text-[10px] sm:text-[11px] uppercase tracking-widest transition-all ${showReview
                    ? 'bg-slate-800 border-slate-800 text-white dark:bg-white dark:border-white dark:text-slate-900 shadow-md'
                    : 'bg-transparent border-slate-200 text-slate-600 dark:border-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
              >
                <MessageCircle size={18} className="shrink-0" />
                <span className="text-center">{showReview ? 'Tutup Pembahasan' : 'Bedah Pembahasan'}</span>
              </button>

              <button
                onClick={() => navigate('/siswa/beranda')}
                disabled={!surveyCompleted}
                className={`w-full sm:w-1/2 flex items-center justify-center gap-2 sm:gap-3 py-4 px-2 font-black text-[10px] sm:text-[11px] uppercase tracking-widest rounded-2xl transition-all ${surveyCompleted
                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/20 active:scale-95'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-500'
                  }`}
              >
                <LayoutDashboard size={18} className="shrink-0" />
                <span className="text-center">Kembali ke Dashboard</span>
              </button>
            </div>

            {!surveyCompleted && (
              <p className="text-[10px] text-center text-rose-500 font-bold uppercase tracking-widest mt-2">
                * Tombol dashboard terkunci sampai survei terisi
              </p>
            )}
          </div>

        </div>

      </main>

      {/* --- DISCUSSION SECTION --- */}
      {showReview && (
        <section className="max-w-6xl mx-auto w-full px-4 mt-12 mb-12 space-y-8 animate-fade-in">
          <div className="flex items-center gap-4 px-2">
            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center text-indigo-600 shadow-inner">
              <MessageCircle size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic">
                Bedah <span className="text-indigo-600">Konsep & Alasan</span>
              </h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Review ulang jawabanmu</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {(simulasi?.soal || simulasi?.questions || []).map((q, idx) => {
              const userAnswer = answers[q.id];
              return (
                <div key={q.id} className="p-6 md:p-8 rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm transition-hover hover:shadow-md">
                  <div className="space-y-6">
                    {/* Question Header */}
                    <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800/50">
                      <span className="px-4 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-black uppercase tracking-widest rounded-lg">
                        Soal #{idx + 1}
                      </span>
                      <span className={`text-[10px] font-black uppercase tracking-widest ${userAnswer ? 'text-teal-600' : 'text-slate-400'
                        }`}>
                        {userAnswer ? 'Telah Dijawab' : 'Tidak Dijawab'}
                      </span>
                    </div>

                    {/* Question Body */}
                    <div className="font-bold text-slate-800 dark:text-slate-200 leading-relaxed text-sm md:text-base">
                      <MathRenderer text={q.payload?.stem || q.isi_soal || ''} />
                    </div>

                    {/* Explanations Area */}
                    {(q.explanation || q.pembahasan) && (
                      <div className="p-5 bg-indigo-50/80 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/30 rounded-2xl mt-4">
                        <p className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                          <Info size={14} /> Penjelasan Konsep & Pembahasan:
                        </p>
                        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                          {q.explanation || q.pembahasan}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

    </div>
  );
}
