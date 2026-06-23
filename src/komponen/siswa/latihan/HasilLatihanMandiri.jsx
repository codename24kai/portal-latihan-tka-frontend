import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShieldAlert, CheckCircle, Clock, BookOpen, RotateCcw, ChevronRight, MessageCircle } from 'lucide-react';
import MathRenderer from '@/komponen/ui/RendererMatematika';
import { calculateScore } from '@/utilitas/mesinPenilaian';

export default function HasilLatihanMandiri() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showReview, setShowReview] = useState(true); // Default show for study mode

  const {
    answers = {},
    timeTaken = 0
  } = location.state || {};

  const latihan = location.state?.latihanData || null;

  // Calculations
  const stats = useMemo(() => {
    if (!latihan) return { score: 0, correctCount: 0, incorrectCount: 0, unansweredCount: 0 };
    
    let poinDidapat = 0;
    let totalPoin = 0;
    let correctCount = 0;
    let incorrectCount = 0;
    let unansweredCount = 0;

    latihan.questions.forEach((q) => {
      const userAnswer = answers[q.id];
      const maxPoints = q.max_points || 1;
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

    const score = totalPoin > 0 ? Math.round((poinDidapat / totalPoin) * 15) : 0; // standard 100 based or normalized
    const percentage = totalPoin > 0 ? Math.round((poinDidapat / totalPoin) * 100) : 0;
    return { score: percentage, correctCount, incorrectCount, unansweredCount };
  }, [answers, latihan]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60) || 0;
    const s = seconds % 60 || 0;
    return `${m}m ${s}s`;
  };

  if (!location.state || !latihan) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-6">
        <div className="max-w-md w-full bg-white dark:bg-slate-800 p-10 rounded-[3rem] shadow-2xl text-center space-y-6">
          <ShieldAlert size={64} className="mx-auto text-rose-500" />
          <h2 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic">Data Latihan Hilang</h2>
          <p className="text-sm font-bold text-slate-500">Hasil latihan mandiri tidak dapat dimuat karena sesi sudah kedaluwarsa.</p>
          <button
            onClick={() => navigate('/beranda')}
            className="w-full py-5 bg-teal-600 text-white font-black text-xs uppercase tracking-widest rounded-3xl"
          >
            Kembali ke Beranda
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col pb-20 animate-fade-in">
      
      {/* Hero Header - Relaxed Teal style */}
      <div className="bg-gradient-to-br from-teal-900 via-slate-900 to-emerald-950 text-white pt-16 pb-28 px-4 text-center relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 left-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
        
        <div className="max-w-xl mx-auto space-y-4 relative z-10">
          <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-[2rem] flex items-center justify-center mx-auto mb-4 border border-white/20">
            <BookOpen size={32} className="text-teal-400" />
          </div>
          <span className="text-[10px] font-black text-teal-400 uppercase tracking-[0.3em] block">Hasil Latihan Mandiri</span>
          <h1 className="text-3xl md:text-4xl font-black italic uppercase leading-none">{latihan.title}</h1>
          <p className="text-sm text-slate-400 font-bold">Evaluasi hasil pengerjaanmu untuk menguasai materi dengan lebih mantap!</p>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto w-full px-4 -mt-16 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Score Display */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] p-8 text-center shadow-xl border border-slate-100 dark:border-slate-800/80">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-4">Nilai Akhir Belajar</span>
            <div className="relative inline-block mb-4">
              <span className="text-8xl font-black italic text-teal-600 dark:text-teal-400 tracking-tighter">
                {stats.score}
              </span>
              <span className="text-lg font-black text-slate-400 absolute bottom-1 -right-8">/100</span>
            </div>
            
            <div className="grid grid-cols-3 gap-2 pt-6 border-t border-slate-100 dark:border-slate-800 mt-4 text-center">
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Tepat</p>
                <p className="text-lg font-black text-teal-600 mt-1">{stats.correctCount}</p>
              </div>
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Salah</p>
                <p className="text-lg font-black text-rose-500 mt-1">{stats.incorrectCount}</p>
              </div>
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Kosong</p>
                <p className="text-lg font-black text-slate-400 mt-1">{stats.unansweredCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 shadow-lg border border-slate-100 dark:border-slate-800/80 space-y-4">
            <div className="flex justify-between items-center text-xs font-bold text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-slate-400" />
                <span>Total Durasi:</span>
              </div>
              <span className="text-slate-800 dark:text-white font-black">{formatTime(timeTaken)}</span>
            </div>
            <div className="flex justify-between items-center text-xs font-bold text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <CheckCircle size={16} className="text-slate-400" />
                <span>Hasil:</span>
              </div>
              <span className="text-teal-600 font-black">
                {stats.score >= 70 ? 'Sangat Baik!' : 'Tingkatkan Lagi!'}
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Options & Action Buttons */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-8 shadow-xl border border-slate-100 dark:border-slate-800/80 space-y-6">
            <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight italic">
              Menu Evaluasi Latihan
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-bold leading-relaxed">
              Karena sifatnya mandiri, disarankan membaca bagian pembahasan di bawah secara teliti sebelum mencoba kuis ini kembali.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => navigate(`/siswa/latihan/${latihanId}/pra`)}
                className="flex items-center justify-center gap-2.5 py-4 bg-white dark:bg-slate-800 border-2 border-slate-150 dark:border-slate-700 hover:border-teal-500 dark:hover:border-teal-500 text-slate-700 dark:text-slate-300 font-black text-xs uppercase tracking-widest rounded-2xl active:scale-95 transition-all"
              >
                <RotateCcw size={16} className="text-teal-600" />
                Ulangi Latihan (Retry)
              </button>
              
              <button
                onClick={() => navigate('/latihan')}
                className="flex items-center justify-center gap-2.5 py-4 bg-teal-600 hover:bg-teal-700 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-lg shadow-teal-500/20 active:scale-95 transition-all"
              >
                Kembali ke Daftar Latihan
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

      </main>

      {/* Discussion List */}
      {showReview && (
        <section className="max-w-5xl mx-auto w-full px-4 mt-8 space-y-6">
          <div className="flex items-center gap-3 px-4">
            <div className="w-10 h-10 bg-teal-600 rounded-2xl flex items-center justify-center text-white">
              <MessageCircle size={20} />
            </div>
            <h2 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic">
              Pembahasan <span className="text-teal-600">Lengkap Soal</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {latihan.questions.map((q, idx) => {
              const userAnswer = answers[q.id];
              const score = calculateScore(q, userAnswer, q.max_points);
              const isCorrect = score === q.max_points;
              
              return (
                <div key={q.id} className={`p-6 md:p-8 rounded-[2.5rem] bg-white dark:bg-slate-900 border-2 shadow-sm ${
                  isCorrect 
                    ? 'border-teal-100 dark:border-teal-900/30' 
                    : 'border-orange-100 dark:border-orange-900/30'
                }`}>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Soal #{idx + 1}</span>
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                        isCorrect ? 'bg-teal-500 text-white' : 'bg-orange-500 text-white'
                      }`}>
                        {isCorrect ? 'Tepat / Benar' : 'Perlu Belajar'}
                      </span>
                    </div>

                    <h4 className="font-bold text-slate-800 dark:text-white leading-relaxed">
                      <MathRenderer text={q.payload.stem} />
                    </h4>

                    {/* Show correct answer explicitly for Study mode */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Jawabanmu:</p>
                        <div className={`p-3 border rounded-xl text-xs font-bold ${
                          isCorrect ? 'bg-teal-50 border-teal-100 text-teal-700' : 'bg-orange-50 border-orange-100 text-orange-700'
                        }`}>
                          {q.question_type === QUESTION_TYPES.ESSAY
                            ? (userAnswer || 'Tidak Dijawab')
                            : q.question_type === QUESTION_TYPES.MULTI_CHOICE
                              ? (userAnswer?.join(', ') || 'Tidak Dijawab')
                              : q.question_type === QUESTION_TYPES.TRUE_FALSE
                                ? (typeof userAnswer === 'object' && userAnswer !== null 
                                    ? Object.entries(userAnswer).map(([k, v]) => `${k}: ${v ? 'B' : 'S'}`).join(' | ')
                                    : (userAnswer === true ? 'Benar' : userAnswer === false ? 'Salah' : 'Tidak Dijawab'))
                                : (userAnswer || 'Tidak Dijawab')
                          }
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Kunci Jawaban:</p>
                        <div className="p-3 bg-teal-50 dark:bg-teal-900/20 border border-teal-150 dark:border-teal-800 rounded-xl text-xs font-black text-teal-700 dark:text-teal-400">
                          {q.question_type === QUESTION_TYPES.TRUE_FALSE
                            ? 'Lihat Pembahasan Detail'
                            : q.payload.correct_keys?.join(', ') || 'Esai (Jawaban Fleksibel)'
                          }
                        </div>
                      </div>
                    </div>

                    {/* Complete Discussion */}
                    {q.explanation && (
                      <div className="p-4 bg-teal-50/50 dark:bg-teal-950/20 border border-teal-100 dark:border-teal-900/40 rounded-2xl">
                        <p className="text-[9px] font-black text-teal-600 dark:text-teal-400 uppercase tracking-widest mb-1">
                          Pembahasan Lengkap & Konsep:
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic font-medium whitespace-pre-line">
                          {q.explanation}
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
