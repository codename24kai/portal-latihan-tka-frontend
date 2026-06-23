import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { CheckCircle2, LayoutDashboard, ArrowLeft } from 'lucide-react';

export default function SurveiSelesaiSiswa() {
  const { surveiId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const fromSimulasiId = location.state?.fromSimulasiId || null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[3.5rem] shadow-2xl border border-slate-100 dark:border-slate-800/80 text-center space-y-8 animate-scale-up">
        
        {/* Success Icon */}
        <div className="relative inline-block">
          <div className="w-24 h-24 bg-teal-50 dark:bg-teal-900/20 rounded-[2.5rem] flex items-center justify-center text-teal-550 mx-auto">
            <CheckCircle2 size={48} className="animate-bounce" />
          </div>
        </div>

        {/* Text */}
        <div className="space-y-3">
          <span className="text-[10px] font-black text-teal-600 dark:text-teal-400 uppercase tracking-[0.25em]">Survei Terkirim</span>
          <h2 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic">Terima Kasih!</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-bold leading-relaxed">
            Jawaban surveimu sudah tersimpan dalam sistem. Partisipasimu sangat membantu perbaikan kualitas pembelajaran!
          </p>
        </div>

        {/* Action button */}
        <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800/80">
          {fromSimulasiId ? (
            <button
              onClick={() => navigate(`/siswa/sesi-latihan/${fromSimulasiId}/hasil`, { state: location.state })}
              className="w-full py-4 bg-teal-600 hover:bg-teal-700 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-lg shadow-teal-500/20 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <ArrowLeft size={16} />
              Kembali ke Hasil Ujian
            </button>
          ) : null}

          <button
            onClick={() => navigate('/beranda')}
            className="w-full py-4 bg-indigo-650 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-lg shadow-indigo-650/20 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <LayoutDashboard size={16} />
            Menuju Dashboard
          </button>
        </div>

      </div>
    </div>
  );
}
