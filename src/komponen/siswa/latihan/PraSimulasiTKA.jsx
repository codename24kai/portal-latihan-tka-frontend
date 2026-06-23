import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import {
  ClipboardList,
  Timer,
  BookOpen,
  ChevronLeft,
  Play,
  AlertCircle,
  CheckCircle2,
  KeyRound,
  ShieldCheck
} from 'lucide-react';
import { motion } from 'framer-motion';
import { getDetailSimulasi } from '@/utilitas/apiSiswa';

export default function PreSimulation() {
  const { simulasiId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // State untuk Token Ujian
  const [token, setToken] = useState('');
  const [tokenError, setTokenError] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [examItem, setExamItem] = useState(null);

  useEffect(() => {
    const loadDetail = async () => {
      try {
        const data = await getDetailSimulasi(simulasiId);
        setExamItem(data || null);
      } catch (error) {
        setExamItem(null);
      }
    };

    loadDetail();
  }, [simulasiId]);

  const examType = location.state?.examType || examItem?.type || 'tryout';
  const isTryout = examType === 'tryout';

  // Data dinamis berdasarkan tipe
  const simulationData = {
    title: examItem?.judul_sesi_latihan || examItem?.judul_simulasi || examItem?.title || '-',
    subject: examItem?.mata_pelajaran || examItem?.subject || '-',
    questionCount: examItem?.jumlah_soal || examItem?.totalQuestions || 0,
    duration: examItem?.durasi_menit ? Number(examItem.durasi_menit) : (examItem?.duration ? Math.round(examItem.duration / 60) : 0),
  };

  // Aturan & Panduan
  const rules = isTryout ? [
    "Berdoalah sebelum memulai pengerjaan.",
    "Waktu ujian akan terus berjalan dan tidak dapat dihentikan sementara (jeda).",
    "Kerjakan secara jujur dan mandiri. Jangan membuka tab atau aplikasi lain.",
    "Pastikan koneksi internet stabil sebelum memasukkan token."
  ] : [
    "Ini adalah mode latihan untuk mengasah kemampuanmu.",
    "Kamu bisa berlatih tanpa tekanan waktu yang terlalu ketat.",
    "Fokuslah pada pemahaman konsep, bukan hanya sekadar menjawab cepat.",
    "Kunci jawaban dan pembahasan akan ditampilkan setelah ujian selesai."
  ];

  const handleStart = (e) => {
    e.preventDefault();
    setTokenError('');

    if (isTryout) {
      if (!token) {
        setTokenError('Token tidak boleh kosong!');
        return;
      }

      setIsChecking(true);

      // Simulasi pengecekan token (bisa diganti dengan API Call nantinya)
      setTimeout(() => {
        const storedTokens = JSON.parse(localStorage.getItem('tryout_tokens') || '{}');
        const defaultTokens = {
          '1': 'TKA202701',
          '2': 'TKA202702',
          'default': 'TKA2026'
        };
        const expectedToken = storedTokens[simulasiId] || defaultTokens[simulasiId] || defaultTokens['default'];

        if (token.trim().toUpperCase() === expectedToken.toUpperCase()) {
          navigate(`/siswa/sesi-latihan/${simulasiId}/kerjakan`, { state: { examType } });
        } else {
          setTokenError('Token salah atau tidak valid!');
          setIsChecking(false);
        }
      }, 600);
    } else {
      // Jika latihan mandiri, langsung masuk tanpa token
      navigate(`/siswa/sesi-latihan/${simulasiId}/kerjakan`, { state: { examType } });
    }
  };

  return (
    <div className="min-h-full flex flex-col items-center justify-center p-4 py-12 lg:py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl w-full space-y-6" /* PERBAIKAN: Diperlebar dari 3xl ke 5xl */
      >
        {/* Tombol Kembali */}
        <button
          onClick={() => navigate('/latihan')}
          className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-500 hover:text-orange-600 dark:hover:text-orange-400 font-black uppercase tracking-widest transition-all hover:shadow-md active:scale-95 w-fit"
        >
          <ChevronLeft size={16} />
          <span>Kembali</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">

          {/* SISI KIRI: Detail Informasi */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 md:p-10 border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col justify-between space-y-10">
            <div>
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-orange-50 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400 rounded-lg text-[10px] font-black uppercase tracking-widest">
                  <ClipboardList size={14} /> Konfirmasi Pengerjaan
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-white leading-tight uppercase tracking-tight italic">
                  {simulationData.title}
                </h2>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                  Mata Pelajaran: <span className="text-slate-600 dark:text-slate-300">{simulationData.subject}</span>
                </p>
              </div>

              {/* Spek Ujian */}
              <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="p-5 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-100 dark:border-slate-800/80 hover:border-orange-200 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-orange-100 dark:bg-orange-950/30 text-orange-600 flex items-center justify-center shrink-0">
                      <Timer size={24} />
                    </div>
                    <div>
                      <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Durasi</span>
                      <span className="text-lg font-black text-slate-800 dark:text-white leading-none">{simulationData.duration} Menit</span>
                    </div>
                  </div>
                </div>

                <div className="p-5 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-100 dark:border-slate-800/80 hover:border-orange-200 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-orange-100 dark:bg-orange-950/30 text-orange-600 flex items-center justify-center shrink-0">
                      <BookOpen size={24} />
                    </div>
                    <div>
                      <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Soal</span>
                      <span className="text-lg font-black text-slate-800 dark:text-white leading-none">{simulationData.questionCount} Soal</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Aturan */}
            <div className="space-y-4 pt-6 border-t border-slate-100 dark:border-slate-700/50">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Aturan & Panduan Ujian:</h4>
              <ul className="space-y-3">
                {rules.map((rule, idx) => (
                  <li key={idx} className="flex gap-3 items-start text-xs font-bold text-slate-600 dark:text-slate-300">
                    <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{rule}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* SISI KANAN: Form Token & Tombol Mulai */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 md:p-10 border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col space-y-8">
            <div className="space-y-3">
              <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight italic">Langkah Terakhir</h3>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                {isTryout ? 'Silakan masukkan token dari wali kelas untuk memulai simulasi resmi.' : 'Konfirmasi persiapan dirimu sebelum masuk ke pengerjaan latihan.'}
              </p>
            </div>

            <form onSubmit={handleStart} className="flex flex-col flex-1 justify-between gap-8">
              {isTryout ? (
                <div className="space-y-3 mt-4">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Token Akses Ujian</label>
                  <div className="relative group">
                    <KeyRound size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-orange-500 transition-colors" />
                    <input
                      type="text"
                      value={token}
                      onChange={(e) => setToken(e.target.value)}
                      placeholder="Contoh: TKA202701"
                      disabled={isChecking}
                      className="w-full pl-14 pr-5 py-5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-base font-black placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all dark:text-white uppercase"
                    />
                  </div>
                  {tokenError && (
                    <p className="text-xs font-bold text-rose-500 flex items-center gap-1.5 ml-1 animate-in slide-in-from-top-1">
                      <AlertCircle size={14} />
                      {tokenError}
                    </p>
                  )}
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center py-8">
                  <div className="w-32 h-32 bg-slate-50 dark:bg-slate-900/50 rounded-full flex items-center justify-center border-8 border-white dark:border-slate-800 shadow-inner">
                    <ShieldCheck size={48} className="text-teal-500 opacity-50" />
                  </div>
                </div>
              )}

              <div className="space-y-6 mt-auto">
                <button
                  type="submit"
                  disabled={isChecking}
                  className="w-full flex items-center justify-center gap-3 h-16 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-black text-sm uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-orange-500/25 active:scale-95 disabled:opacity-50 disabled:pointer-events-none transition-all"
                >
                  {isChecking ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Memproses...
                    </>
                  ) : (
                    <>
                      <Play size={20} fill="white" />
                      Mulai Sekarang
                    </>
                  )}
                </button>

                <div className="p-4 bg-orange-50/50 dark:bg-orange-900/10 rounded-2xl border border-orange-100 dark:border-orange-900/30 flex gap-3">
                  <ShieldCheck size={18} className="text-orange-500 shrink-0 mt-0.5" />
                  <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest leading-relaxed">
                    Pengerjaan dimonitor oleh sistem. Mohon tidak melakukan kecurangan demi progres belajarmu.
                  </p>
                </div>
              </div>
            </form>
          </div>

        </div>
      </motion.div>
    </div>
  );
}
