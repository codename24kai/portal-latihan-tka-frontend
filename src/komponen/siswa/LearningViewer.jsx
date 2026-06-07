import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Download,
  User,
  Calendar,
  Clock,
  BookOpen,
  Award,
  AlertCircle,
  CheckCircle2,
  Calculator,
  Library,
  Play,
  FileText,
  Gamepad2,
  Loader2
} from 'lucide-react';
import { getMateriById } from "./data/mockMateri";
import PdfViewer from "./viewers/PdfViewer";
import VideoViewer from "./viewers/VideoViewer";
import YoutubeViewer from "./viewers/YoutubeViewer";

export default function LearningViewer() {
  const { materiId } = useParams();
  const navigate = useNavigate();

  // State to support API-driven structure in the future
  const [materi, setMateri] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    getMateriById(materiId)
      .then((data) => {
        if (!isMounted) return;
        if (data) {
          setMateri(data);
          setIsCompleted(data.progressStatus === 'selesai');
          // Automatically mark as 'sedang' (in progress) if it was 'belum' (not started)
          // This simulates backend progress tracking
          if (data.progressStatus === 'belum') {
            data.progressStatus = 'sedang';
          }
        } else {
          setError('Materi tidak ditemukan');
        }
        setLoading(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(err.message || 'Gagal memuat data materi');
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [materiId]);

  // Mark completion handler
  const handleMarkAsCompleted = () => {
    if (materi) {
      materi.progressStatus = 'selesai';
      setIsCompleted(true);

      // Update local storage or cache if needed so ModulSiswa knows it is done
      try {
        const storedProgress = JSON.parse(localStorage.getItem('materi_progress') || '{}');
        storedProgress[materi.id] = 'selesai';
        localStorage.setItem('materi_progress', JSON.stringify(storedProgress));
      } catch (e) {
        console.error('Gagal menyimpan progres', e);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center p-6">
        <Loader2 className="w-16 h-16 text-indigo-600 dark:text-indigo-400 animate-spin mb-4" />
        <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-wider animate-pulse">
          Menyiapkan Halaman Belajar...
        </h3>
      </div>
    );
  }

  if (error || !materi) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center p-6">
        <div className="bg-white dark:bg-slate-800 p-10 rounded-[3rem] shadow-2xl max-w-md w-full text-center border-2 border-slate-100 dark:border-slate-700 space-y-6">
          <div className="w-20 h-20 bg-red-100 dark:bg-red-950 text-red-500 rounded-[2rem] flex items-center justify-center mx-auto border border-red-200 dark:border-red-900/50">
            <AlertCircle size={40} />
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic">
              Ada Masalah!
            </h3>
            <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest leading-relaxed mt-2">
              {error || 'Materi pembelajaran tidak dapat ditemukan.'}
            </p>
          </div>
          <button
            onClick={() => navigate('/modul')}
            className="w-full py-4 bg-indigo-600 text-white font-black text-[11px] uppercase tracking-widest rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 active:scale-95"
          >
            <ArrowLeft size={16} /> Kembali ke Daftar Modul
          </button>
        </div>
      </div>
    );
  }

  const renderViewer = () => {
    switch (materi.type) {
      case 'pdf':
        return <PdfViewer title={materi.title} contentUrl={materi.contentUrl} />;
      case 'video':
        return <VideoViewer title={materi.title} contentUrl={materi.contentUrl} />;
      case 'youtube':
        return <YoutubeViewer title={materi.title} youtubeId={materi.youtubeId} />;
      default:
        return (
          <div className="w-full h-[50vh] bg-slate-100 dark:bg-slate-800 rounded-[2rem] flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-slate-300 dark:border-slate-700">
            <AlertCircle size={48} className="text-slate-400 mb-4" />
            <p className="font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
              Tipe materi tidak dikenali.
            </p>
          </div>
        );
    }
  };

  const getSubjectBadge = (subject) => {
    const isMath = subject === 'Matematika';
    return (
      <span className={`inline-flex items-center gap-1.5 text-[10px] font-black px-4 py-2 rounded-xl border uppercase tracking-widest ${isMath
        ? 'bg-teal-500/15 text-teal-600 dark:text-teal-400 border-teal-200 dark:border-teal-800/40'
        : subject === 'Bahasa Indonesia'
          ? 'bg-orange-500/15 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-800/40'
          : 'bg-slate-500/15 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800/40'
        }`}>
        {isMath ? <Calculator size={12} /> : subject === 'Bahasa Indonesia' ? <Library size={12} /> : <BookOpen size={12} />}
        {subject}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white flex flex-col animate-in fade-in duration-500">

      {/* Top Navbar */}
      <header className="bg-white dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700 sticky top-0 z-30 px-4 md:px-8 py-4 flex items-center justify-between shadow-sm">
        <button
          onClick={() => navigate('/modul')}
          className="flex items-center gap-2 px-4 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-2xl transition-all active:scale-95 text-[10px] font-black uppercase tracking-wider"
        >
          <ArrowLeft size={16} /> Kembali
        </button>

        <div className="flex items-center gap-3">
          {getSubjectBadge(materi.subject)}

          {/* Completion Status Badge */}
          <div className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider border shadow-sm ${isCompleted
            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/40'
            : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800/40'
            }`}>
            {isCompleted ? <CheckCircle2 size={12} /> : <Clock size={12} />}
            {isCompleted ? 'Selesai Dibaca' : 'Sedang Dipelajari'}
          </div>
        </div>
      </header>

      {/* Main Grid Content */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

        {/* Left/Top Area: Content Viewer */}
        <section className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-800 p-4 md:p-6 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-700">
            {renderViewer()}
          </div>
        </section>

        {/* Right/Bottom Area: Metadata & Actions */}
        <section className="space-y-6">

          {/* Main Info Card */}
          <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-700 space-y-6">
            <div>
              <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
                Materi Kelas 6 SD
              </span>
              <h1 className="text-2xl md:text-3xl font-black leading-tight uppercase tracking-tight italic mt-1 text-slate-800 dark:text-white">
                {materi.title}
              </h1>
            </div>

            <hr className="border-slate-100 dark:border-slate-700" />

            {/* Meta Items Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <div className="w-9 h-9 bg-slate-100 dark:bg-slate-700 rounded-xl flex items-center justify-center text-indigo-500">
                  <User size={16} />
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Pembuat</p>
                  <p className="text-[11px] font-bold truncate max-w-[120px]">{materi.author}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <div className="w-9 h-9 bg-slate-100 dark:bg-slate-700 rounded-xl flex items-center justify-center text-teal-500">
                  <Calendar size={16} />
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Publikasi</p>
                  <p className="text-[11px] font-bold">{materi.publishedAt}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <div className="w-9 h-9 bg-slate-100 dark:bg-slate-700 rounded-xl flex items-center justify-center text-amber-500">
                  <Clock size={16} />
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Durasi</p>
                  <p className="text-[11px] font-bold">{materi.estimasiWaktu}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <div className="w-9 h-9 bg-slate-100 dark:bg-slate-700 rounded-xl flex items-center justify-center text-purple-500">
                                      {materi.type === 'pdf' ? <FileText size={16} /> : <Play size={16} />}
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Format</p>
                  <p className="text-[11px] font-bold uppercase">{materi.type}</p>
                </div>
              </div>
            </div>

            <hr className="border-slate-100 dark:border-slate-700" />

            {/* Description */}
            <div className="space-y-2">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Deskripsi Materi
              </h4>
              <p className="text-xs font-bold text-slate-600 dark:text-slate-300 leading-relaxed">
                {materi.description}
              </p>
            </div>
          </div>

          {/* Actions Card */}
          <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-700 space-y-3">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
              Menu Belajar
            </h4>

            {/* Download Button (hidden for youtube if downloadable is false) */}
            {materi.downloadable && materi.contentUrl && (
              <a
                href={materi.contentUrl}
                download
                target="_blank"
                rel="noreferrer"
                className="w-full py-4 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/20 dark:hover:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 font-black text-[10px] uppercase tracking-widest rounded-2xl transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <Download size={16} /> Unduh Materi ({materi.size || 'Unduh'})
              </a>
            )}

            {/* Complete button */}
            {!isCompleted ? (
              <button
                onClick={handleMarkAsCompleted}
                className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl transition-all flex items-center justify-center gap-2 active:scale-95 shadow-lg shadow-emerald-500/20 border border-emerald-400"
              >
                <CheckCircle2 size={16} /> Tandai Selesai
              </button>
            ) : (
              <div className="w-full py-4 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 font-black text-[10px] uppercase tracking-widest rounded-2xl flex items-center justify-center gap-2 border border-emerald-200 dark:border-emerald-900/40">
                <Award size={16} /> Materi Telah Tuntas
              </div>
            )}

            {/* Quick Link to Quiz if Module has one */}
            {isCompleted && (
              <button
                onClick={() => navigate(`/modul/kuis/${materi.id}`)}
                className="w-full py-4 bg-amber-500 hover:bg-amber-600 text-white font-black text-[10px] uppercase tracking-[0.15em] rounded-2xl transition-all flex items-center justify-center gap-2 active:scale-95 shadow-lg shadow-amber-500/20 border border-amber-400"
              >
                <Gamepad2 size={16} fill="currentColor" /> Mulai Kuis Game
              </button>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
