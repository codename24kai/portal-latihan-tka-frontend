import { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Dumbbell, Play, ArrowLeft, Clock, BookOpen, Lightbulb } from 'lucide-react';

export default function LatihanMandiri() {
  const { latihanId } = useParams();
  const navigate = useNavigate();

  const latihan = useMemo(() => {
    return null;
  }, [latihanId]);

  if (!latihan) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 p-6">
        <div className="max-w-md w-full bg-white dark:bg-slate-800 p-8 rounded-[2rem] shadow-xl text-center space-y-4">
          <h2 className="text-xl font-black text-rose-600">Latihan Tidak Ditemukan</h2>
          <p className="text-sm text-slate-500">Maaf, paket latihan mandiri belum tersedia dari backend.</p>
          <button
            onClick={() => navigate('/latihan')}
            className="px-6 py-3 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700"
          >
            Kembali ke Daftar Latihan
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center items-center p-4 md:p-8 animate-fade-in">
      <div className="max-w-2xl w-full bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl border border-slate-100 dark:border-slate-800/80 overflow-hidden">

        {/* Banner - Relaxed Teal Theme */}
        <div className="bg-gradient-to-r from-teal-500 via-emerald-500 to-indigo-600 p-8 text-white relative overflow-hidden text-center">
          <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-x-12 -translate-y-12" />
          <div className="relative z-10 space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-wider">
              <Lightbulb size={12} fill="currentColor" /> Latihan Mandiri
            </div>
            <h1 className="text-2xl md:text-3xl font-black italic uppercase leading-tight">{latihan.title}</h1>
            <p className="text-xs text-white/80 font-bold uppercase tracking-widest mt-1">Latihan {latihan.subject}</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 md:p-12 space-y-8">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl flex flex-col items-center justify-center text-center">
              <Clock className="text-teal-600 mb-2" size={24} />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Target Waktu</span>
              <span className="text-lg font-black text-slate-800 dark:text-white mt-1">{latihan.duration / 60} Menit</span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl flex flex-col items-center justify-center text-center">
              <BookOpen className="text-teal-600 mb-2" size={24} />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Soal</span>
              <span className="text-lg font-black text-slate-800 dark:text-white mt-1">{latihan.totalQuestions} Soal Latihan</span>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Karakteristik Latihan Mandiri:</h4>
            <ul className="space-y-3.5 text-xs text-slate-600 dark:text-slate-300 font-bold">
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 bg-teal-500 rounded-full mt-1.5 shrink-0" />
                <span>Timer bersifat fleksibel. Kamu tidak akan dipaksa mengumpulkan ketika waktu habis, sehingga bisa fokus memahami setiap soal.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 bg-teal-500 rounded-full mt-1.5 shrink-0" />
                <span>Navigasi soal sangat bebas. Kamu bisa melihat ulang soal sebelumnya sesukamu.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 bg-teal-500 rounded-full mt-1.5 shrink-0" />
                <span>Pembahasan lengkap dan langkah-langkah penyelesaian akan dibuka secara detail setelah kuis selesai dikumpulkan.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 bg-teal-500 rounded-full mt-1.5 shrink-0" />
                <span>Mendukung pengerjaan ulang kuis (retry) untuk memperbaiki pemahaman konsepmu.</span>
              </li>
            </ul>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center gap-4">
            <button
              onClick={() => navigate('/latihan')}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-4 border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 rounded-2xl font-black text-xs uppercase tracking-widest transition-all"
            >
              <ArrowLeft size={16} />
              Kembali
            </button>
            <button
              onClick={() => navigate(`/siswa/latihan/${latihanId}/kerjakan`)}
              className="flex-1 w-full flex items-center justify-center gap-3 py-5 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-650 hover:to-emerald-700 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-teal-500/25 active:scale-95 transition-all"
            >
              <Play size={16} fill="white" />
              Mulai Latihan Mandiri
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
