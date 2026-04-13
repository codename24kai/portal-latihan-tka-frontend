import { useLocation, useNavigate } from 'react-router-dom';
import { Trophy, Target, ArrowLeft, RotateCcw, CheckCircle2, XCircle, Sun, Moon } from 'lucide-react';
import { useMemo } from 'react';
import mockQuestions from '../../data/mockQuestions';
import { useDarkMode } from '../../hooks/useDarkMode';

/**
 * Post-exam result summary page.
 * Major Layout Overhaul: 2-Column Desktop View & No Overlap.
 */
export default function ExamResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isDark, toggleDarkMode } = useDarkMode();

  const { answers = {}, totalQuestions = 40, timeUp = false, examType = 'practice' } = location.state || {};
  const isTryout = examType === 'tryout';

  // Calculate score based on mock correct answers
  const { correctCount, wrongCount, unanswered, score } = useMemo(() => {
    let correct = 0;
    let wrong = 0;

    mockQuestions.forEach((q) => {
      const userAnswer = answers[q.id];
      if (!userAnswer) return;
      if (userAnswer === q.correctAnswer) {
        correct++;
      } else {
        wrong++;
      }
    });

    return {
      correctCount: correct,
      wrongCount: wrong,
      unanswered: totalQuestions - correct - wrong,
      score: Math.round((correct / totalQuestions) * 100),
    };
  }, [answers, totalQuestions]);

  // Score color based on performance
  const getScoreColor = () => {
    if (score >= 80) return 'text-correct';
    if (score >= 60) return 'text-warning';
    return 'text-incorrect';
  };

  const getScoreLabel = () => {
    if (score >= 80) return 'Luar Biasa! 🎉';
    if (score >= 60) return 'Bagus! 👍';
    if (score >= 40) return 'Terus Berlatih! 💪';
    return 'Jangan Menyerah! 🌟';
  };

  return (
    <div id="exam-result" className="min-h-screen w-full flex flex-col bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      
      {/* Header Banner (No Overlap) */}
      <div className="relative bg-gradient-to-br from-primary via-primary-dark to-primary-light pt-12 pb-16 px-4 text-center text-white overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-0 left-0 w-40 h-40 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-60 h-60 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3" />

        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className="absolute top-6 right-6 w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white/30 transition-all active:scale-95"
          aria-label="Toggle dark mode"
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {timeUp && (
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/20 text-red-200 rounded-lg text-xs font-medium mb-4">
            ⏰ Waktu Habis
          </div>
        )}

        <div className="animate-bounce-in">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
            <Trophy size={32} className="text-white" />
          </div>
        </div>

        <h1 className="text-2xl lg:text-3xl font-bold mb-1">Hasil Ujian Kamu</h1>
        <p className="text-white/70 text-sm">Matematika — Tryout Minggu ke-1</p>
      </div>

      {/* Optimized Layout Container */}
      <main className="max-w-5xl mx-auto w-full px-4 pt-8 pb-12 flex-grow">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          {/* LEFT COLUMN: Score & Stats */}
          <div className="space-y-8">
            {/* Score Card */}
            {isTryout ? (
              <div className="bg-white dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-[3rem] p-12 text-center animate-pulse">
                <div className="w-20 h-20 bg-orange-100 dark:bg-orange-900/30 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                  <CheckCircle2 size={40} />
                </div>
                <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-4 italic tracking-tight underline decoration-orange-400 decoration-4 underline-offset-8 uppercase">Jawaban Tersimpan</h3>
                <p className="text-slate-500 dark:text-slate-400 font-bold leading-relaxed px-4">
                  Terima kasih telah menyelesaikan simulasi ini. <br/>
                  <span className="text-orange-600 dark:text-orange-400 uppercase tracking-widest text-[10px] block mt-4">Nilai akan diumumkan oleh bapak/ibu guru.</span>
                </p>
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-900 border border-transparent dark:border-slate-700 rounded-3xl shadow-card dark:shadow-none p-8 text-center animate-slide-up">
                <p className="text-sm text-slate-400 dark:text-slate-400 font-medium mb-2">Skor Akhir</p>
                <p className={`text-7xl font-extrabold ${getScoreColor()} mb-2`}>
                  {score}
                </p>
                <p className="text-sm text-slate-400 dark:text-slate-500 mb-6">dari 100 poin</p>
                <div className="py-3 px-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl inline-block">
                  <p className="text-xl font-bold text-dark dark:text-slate-200">{getScoreLabel()}</p>
                </div>
              </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white dark:bg-slate-900 border border-transparent dark:border-slate-700 rounded-2xl shadow-card dark:shadow-none p-5 text-center animate-slide-up" style={{ animationDelay: '100ms' }}>
                <div className="w-10 h-10 rounded-xl bg-correct/10 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 size={20} className="text-correct" />
                </div>
                <p className="text-2xl font-bold text-correct">{correctCount}</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 uppercase font-semibold">Benar</p>
              </div>

              <div className="bg-white dark:bg-slate-900 border border-transparent dark:border-slate-700 rounded-2xl shadow-card dark:shadow-none p-5 text-center animate-slide-up" style={{ animationDelay: '200ms' }}>
                <div className="w-10 h-10 rounded-xl bg-incorrect/10 flex items-center justify-center mx-auto mb-3">
                  <XCircle size={20} className="text-incorrect" />
                </div>
                <p className="text-2xl font-bold text-incorrect">{wrongCount}</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 uppercase font-semibold">Salah</p>
              </div>

              <div className="bg-white dark:bg-slate-900 border border-transparent dark:border-slate-700 rounded-2xl shadow-card dark:shadow-none p-5 text-center animate-slide-up" style={{ animationDelay: '300ms' }}>
                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-3">
                  <Target size={20} className="text-slate-400 dark:text-slate-500" />
                </div>
                <p className="text-2xl font-bold text-slate-500 dark:text-slate-400">{unanswered}</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 uppercase font-semibold">Kosong</p>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Summary & Actions */}
          <div className="space-y-8">
            {/* Progress Summary Bars */}
            {!isTryout && (
              <div className="bg-white dark:bg-slate-900 border border-transparent dark:border-slate-700 rounded-2xl shadow-card dark:shadow-none p-6 animate-slide-up" style={{ animationDelay: '400ms' }}>
                <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-6">Analisis Jawaban</h3>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-500 dark:text-slate-400">Akurasi Benar</span>
                      <span className="font-bold text-correct">{correctCount}/{totalQuestions}</span>
                    </div>
                    <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-correct to-secondary rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${(correctCount / totalQuestions) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-500 dark:text-slate-400">Total Salah</span>
                      <span className="font-bold text-incorrect">{wrongCount}/{totalQuestions}</span>
                    </div>
                    <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-incorrect to-accent rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${(wrongCount / totalQuestions) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-500 dark:text-slate-400">Tanpa Jawaban</span>
                      <span className="font-bold text-slate-400 dark:text-slate-500">{unanswered}/{totalQuestions}</span>
                    </div>
                    <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-slate-300 dark:bg-slate-700 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${(unanswered / totalQuestions) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 animate-slide-up" style={{ animationDelay: '500ms' }}>
              <button
                id="btn-back-dashboard"
                onClick={() => navigate('/')}
                className="flex-1 btn-primary flex items-center justify-center gap-2 py-4 rounded-xl font-bold shadow-lg"
              >
                <ArrowLeft size={18} />
                Dashboard
              </button>
              <button
                id="btn-retry"
                onClick={() => navigate(`/exam/1`)}
                className="flex-1 btn-ghost dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 flex items-center justify-center gap-2 py-4 rounded-xl font-bold transition-all border border-transparent dark:border-slate-700"
              >
                <RotateCcw size={18} />
                Coba Lagi
              </button>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
