import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDetailSurvei } from '@/utilitas/apiSiswa';
import { Heart, Globe, ArrowRight, ShieldCheck, ClipboardList, Info } from 'lucide-react';

export default function PraSurvei() {
  const { surveiId } = useParams();
  const navigate = useNavigate();
  const [survei, setSurvei] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSurvei = async () => {
      try {
        setLoading(true);
        const data = await getDetailSurvei(surveiId);
        setSurvei(data);
      } catch (err) {
        console.error("Gagal memuat data survei:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSurvei();
  }, [surveiId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-6">
        <div className="text-center font-bold text-slate-500">Memuat detail survei...</div>
      </div>
    );
  }

  if (!survei) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 p-6">
        <div className="max-w-md w-full bg-white dark:bg-slate-800 p-8 rounded-[2rem] shadow-xl text-center space-y-4">
          <h2 className="text-xl font-black text-rose-600">Survei Tidak Ditemukan</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Maaf, survei yang kamu cari tidak terdaftar atau telah ditutup.</p>
          <button
            onClick={() => navigate('/beranda')}
            className="px-6 py-3 bg-indigo-650 hover:bg-indigo-700 text-white rounded-2xl font-bold transition-all text-xs uppercase tracking-widest"
          >
            Kembali ke Beranda
          </button>
        </div>
      </div>
    );
  }

  const isKarakter = survei.type === 'survei_karakter';
  const themeColor = isKarakter ? 'from-rose-500 to-pink-600' : 'from-emerald-500 to-teal-600';
  const themeBg = isKarakter ? 'bg-rose-50 dark:bg-rose-950/20 text-rose-600' : 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600';

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 p-6 transition-colors duration-300">
      <div className="max-w-xl w-full bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-xl overflow-hidden border border-slate-100 dark:border-slate-700">
        
        {/* Banner */}
        <div className={`h-40 bg-gradient-to-r ${themeColor} p-8 flex items-end justify-between relative`}>
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-white/80">Kuesioner Siswa</span>
            <h2 className="text-xl font-black text-white leading-tight">{survei.title}</h2>
          </div>
          <div className="w-16 h-16 rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
            {isKarakter ? <Heart size={32} /> : <Globe size={32} />}
          </div>
        </div>

        {/* Content */}
        <div className="p-8 md:p-10 space-y-8">
          
          <div className="space-y-3">
            <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider">Tentang Survei Ini</h3>
            <p className="text-sm text-slate-650 dark:text-slate-350 leading-relaxed font-semibold">
              {survei.description}
            </p>
          </div>

          {/* Quick Stats Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-5 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-100 dark:border-slate-800 flex flex-col justify-center">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Jumlah Pertanyaan</span>
              <span className="text-xl font-black text-slate-850 dark:text-white italic">{survei.questions?.length || 0} <span className="text-xs font-bold text-slate-400">Pernyataan</span></span>
            </div>
            
            <div className="p-5 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-100 dark:border-slate-800 flex flex-col justify-center">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Estimasi Waktu</span>
              <span className="text-xl font-black text-slate-850 dark:text-white italic">~5 - 10 <span className="text-xs font-bold text-slate-400">Menit</span></span>
            </div>
          </div>

          {/* Guidelines */}
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/10 border border-indigo-100 dark:border-indigo-950/20 text-indigo-700 dark:text-indigo-400">
              <ShieldCheck className="shrink-0 mt-0.5" size={18} />
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider mb-1">Jawaban Rahasia & Terlindungi</h4>
                <p className="text-[11px] font-bold uppercase tracking-tight text-slate-500 dark:text-slate-400 leading-relaxed">
                  Survei ini bersifat evaluatif. Jawaban yang kamu berikan tidak akan memengaruhi penilaian akademik atau nilai rapor kamu. Jawablah dengan jujur sesuai kondisimu.
                </p>
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-slate-700">
            <button
              onClick={() => navigate('/beranda')}
              className="px-6 py-4 text-xs font-black text-slate-400 hover:text-slate-655 uppercase tracking-widest transition-colors"
            >
              Nanti Saja
            </button>
            <button
              onClick={() => navigate(`/siswa/survei/${survei.id}`)}
              className={`flex items-center gap-2 px-8 py-4 bg-gradient-to-r ${themeColor} text-white rounded-2xl font-black uppercase text-xs tracking-widest transition-all hover:shadow-lg active:scale-95`}
            >
              <span>Mulai Survei</span>
              <ArrowRight size={14} />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
