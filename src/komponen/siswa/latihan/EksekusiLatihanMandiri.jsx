import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ExamHeader from '@/komponen/siswa/latihan/HeaderUjian';
import QuestionContent from '@/komponen/siswa/latihan/KontenSoal';
import ExamNavBar from '@/komponen/siswa/latihan/NavBarUjian';
import QuestionNavigator from '@/komponen/siswa/latihan/NavigatorSoal';
import ConfirmDialog from '@/komponen/ui/DialogKonfirmasi';
import LoadingSkeleton from '@/komponen/ui/SkeletonMemuat';
import ExamFallback from '@/komponen/siswa/latihan/FallbackUjian';
import { Dumbbell, Grid3X3, Sun, Moon, ArrowLeft, Play, Pause } from 'lucide-react';
import { useDarkMode } from '@/hooks/useModGelap';

// Renderers
import SingleChoiceRenderer from '@/komponen/siswa/RendererSoal/RendererPilihanTunggal';
import MultiChoiceRenderer from '@/komponen/siswa/RendererSoal/RendererPilihanGanda';
import TrueFalseRenderer from '@/komponen/siswa/RendererSoal/RendererBenarSalah';

import { QUESTION_TYPES } from '@/konstanta/soal';

const RENDERER_MAP = {
  [QUESTION_TYPES.SINGLE_CHOICE]: SingleChoiceRenderer,
  [QUESTION_TYPES.MULTI_CHOICE]: MultiChoiceRenderer,
  [QUESTION_TYPES.TRUE_FALSE]: TrueFalseRenderer,
};

function EssayRenderer({ payload, selected, onSelect }) {
  return (
    <div className="space-y-4">
      <textarea
        value={selected || ''}
        onChange={(e) => onSelect(e.target.value)}
        placeholder="Tuliskan jawaban esai kamu di sini..."
        className="w-full min-h-[180px] p-6 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-[2rem] text-sm font-semibold focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 outline-none transition-all dark:text-white resize-none"
        maxLength={payload?.word_limit || 1000}
      />
      {payload?.word_limit && (
        <div className="text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">
          Karakter: {(selected || '').length} / {payload.word_limit}
        </div>
      )}
    </div>
  );
}

export default function EksekusiLatihanMandiri() {
  const { latihanId } = useParams();
  const navigate = useNavigate();
  const { isDark, toggleDarkMode } = useDarkMode();

  // Load Latihan Mandiri data
  const latihan = useMemo(() => {
    return null;
  }, [latihanId]);

  // State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { [questionId]: response }
  const [showNavigator, setShowNavigator] = useState(false);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [flaggedQuestions, setFlaggedQuestions] = useState(new Set());
  
  // Track elapsed time in background
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const timerRef = useRef(null);

  useEffect(() => {
    if (latihan && !isPaused && !isSubmitted) {
      timerRef.current = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [latihan, isPaused, isSubmitted]);

  // Total questions mapping
  const questions = latihan?.questions || [];
  const totalQuestions = questions.length;
  const currentQuestion = questions[currentIndex];
  const currentNumber = currentIndex + 1;

  const answeredCount = useMemo(
    () => Object.keys(answers).length,
    [answers]
  );
  const unansweredCount = totalQuestions - answeredCount;

  // Handlers
  const goToQuestion = useCallback((num) => {
    setCurrentIndex(num - 1);
  }, []);

  const handlePrevious = useCallback(() => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => Math.min(totalQuestions - 1, prev + 1));
  }, [totalQuestions]);

  const handleAnswerChange = useCallback(
    (response) => {
      if (isPaused) return;
      setAnswers((prev) => ({
        ...prev,
        [currentQuestion.id]: response,
      }));
    },
    [currentQuestion?.id, isPaused]
  );

  const handleToggleFlag = useCallback(() => {
    if (isPaused) return;
    setFlaggedQuestions((prev) => {
      const next = new Set(prev);
      if (next.has(currentNumber)) {
        next.delete(currentNumber);
      } else {
        next.add(currentNumber);
      }
      return next;
    });
  }, [currentNumber, isPaused]);

  const handleConfirmSubmit = useCallback(() => {
    setIsSubmitted(true);
    setShowSubmitDialog(false);
    if (timerRef.current) clearInterval(timerRef.current);

    navigate(`/siswa/latihan/${latihanId}/hasil`, {
      state: {
        answers,
        timeTaken: elapsedTime,
        timeUp: false,
        latihanData: {
          id: latihan.id,
          subject: latihan.subject,
          title: latihan.title,
          totalQuestions: latihan.totalQuestions,
        },
      },
    });
  }, [answers, elapsedTime, latihan, latihanId, navigate]);

  if (!latihan) {
    return <ExamFallback message="Data latihan tidak ditemukan. Silakan kembali ke halaman sebelumnya." />;
  }

  if (isSubmitted) return null;

  if (totalQuestions === 0) {
    return <ExamFallback message="Belum ada soal tersedia untuk latihan mandiri ini." />;
  }

  const Renderer = currentQuestion?.question_type === QUESTION_TYPES.ESSAY 
    ? EssayRenderer 
    : (RENDERER_MAP[currentQuestion?.question_type] || SingleChoiceRenderer);
    
  const currentAnswer = answers[currentQuestion?.id];

  return (
    <div id="latihan-execution" className="h-screen flex flex-col bg-slate-50 dark:bg-slate-900 transition-colors duration-300 overflow-hidden">
      
      {/* Custom Header for Latihan Mandiri (NO Countdown, Teal Theme) */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 safe-top transition-colors duration-300">
        <div className="flex items-center justify-between px-6 py-4 max-w-3xl mx-auto">
          
          {/* Left: Mode Badge & Pause Toggle */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 text-xs font-black uppercase tracking-wider">
              <Dumbbell size={14} className="animate-bounce-subtle" />
              <span>Latihan Mandiri</span>
            </div>
            
            <button
              onClick={() => setIsPaused((prev) => !prev)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                isPaused 
                  ? 'bg-amber-100 text-amber-700 animate-pulse'
                  : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-350 hover:bg-slate-200'
              }`}
              title={isPaused ? "Lanjutkan Latihan" : "Jeda Latihan"}
            >
              {isPaused ? <Play size={12} /> : <Pause size={12} />}
              <span>{isPaused ? "Dijeda" : "Jeda"}</span>
            </button>
          </div>

          {/* Right: Navigator & Counter */}
          <div className="flex items-center gap-4">
            <div className="text-xs text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest hidden sm:block">
              Soal: <span className="text-teal-600 dark:text-teal-400 text-sm font-black">{currentNumber}</span> / {totalQuestions}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={toggleDarkMode}
                className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-205 dark:hover:bg-slate-700 transition-all duration-200"
                aria-label="Toggle dark mode"
              >
                {isDark ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              <button
                onClick={() => setShowNavigator(true)}
                className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/30 text-teal-650 dark:text-teal-400 hover:bg-teal-100 transition-all duration-200 active:scale-95"
                aria-label="Navigasi soal"
              >
                <Grid3X3 size={18} />
                {answeredCount < totalQuestions && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-teal-500 text-white text-[10px] font-black rounded-full flex items-center justify-center">
                    {totalQuestions - answeredCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Progress Bar (Teal theme) */}
        <div className="h-1 bg-slate-100 dark:bg-slate-800">
          <div
            className="h-full bg-teal-500 rounded-r-full transition-all duration-500 ease-out"
            style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
          />
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 overflow-y-auto px-6 py-8 dark:bg-slate-900 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
        <div className="max-w-3xl mx-auto w-full">
          {isPaused ? (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
              <div className="w-20 h-20 bg-amber-50 dark:bg-amber-950/20 text-amber-500 rounded-full flex items-center justify-center animate-pulse">
                <Pause size={40} />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-black text-slate-850 dark:text-white uppercase tracking-tight">Latihan Sedang Dijeda</h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Jawaban kamu tersimpan dengan aman. Klik lanjutkan untuk menyelesaikan.</p>
              </div>
              <button
                onClick={() => setIsPaused(false)}
                className="px-8 py-3 bg-teal-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-teal-700 active:scale-95 transition-all shadow-lg shadow-teal-600/20"
              >
                Lanjutkan Latihan
              </button>
            </div>
          ) : (
            <div key={currentQuestion?.id} className="animate-fade-in pb-20">
              <QuestionContent
                questionNumber={currentNumber}
                text={currentQuestion?.payload?.stem}
                image={currentQuestion?.payload?.stem_image}
              />

              <div className="flex justify-end mt-4">
                <button
                  onClick={handleToggleFlag}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs transition-all border-2 ${
                    flaggedQuestions.has(currentNumber)
                      ? 'bg-teal-50 border-teal-200 text-teal-600 dark:bg-teal-950/20 dark:border-teal-900/30 dark:text-teal-400'
                      : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-400 hover:border-slate-200'
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full ${flaggedQuestions.has(currentNumber) ? 'bg-teal-500 animate-pulse' : 'bg-slate-300'}`} />
                  {flaggedQuestions.has(currentNumber) ? 'Ditandai' : 'Tandai Soal'}
                </button>
              </div>

              <div className="mt-8">
                <Renderer
                  payload={currentQuestion?.payload}
                  selected={currentAnswer}
                  onSelect={handleAnswerChange}
                />
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Navigation Buttons footer (modified to use Teal colors for Submit/Completed state) */}
      <nav className="sticky bottom-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-100 dark:border-slate-800 safe-bottom transition-colors duration-300">
        <div className="flex items-center justify-between gap-3 px-6 py-4 max-w-3xl mx-auto">
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0 || isPaused}
            className={`flex items-center gap-2 py-2 px-4 rounded-xl border border-slate-100 dark:border-slate-700 text-slate-500 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all ${
              currentIndex === 0 || isPaused ? 'opacity-40 cursor-not-allowed' : ''
            }`}
          >
            <span>Sebelumnya</span>
          </button>

          {currentIndex === totalQuestions - 1 ? (
            <button
              onClick={() => setShowSubmitDialog(true)}
              disabled={isPaused}
              className={`flex items-center gap-2 bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-black text-xs uppercase tracking-widest px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all ${
                isPaused ? 'opacity-40 cursor-not-allowed' : 'active:scale-95'
              }`}
            >
              <span>Kumpulkan Latihan</span>
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={isPaused}
              className={`flex items-center gap-2 bg-slate-900 dark:bg-slate-800 text-white dark:text-slate-100 font-bold text-xs px-6 py-3 rounded-xl transition-all hover:bg-slate-850 ${
                isPaused ? 'opacity-40 cursor-not-allowed' : 'active:scale-95'
              }`}
            >
              <span>Selanjutnya</span>
            </button>
          )}
        </div>
      </nav>

      {/* Question Navigator */}
      <QuestionNavigator
        isOpen={showNavigator}
        onClose={() => setShowNavigator(false)}
        totalQuestions={totalQuestions}
        currentQuestion={currentNumber}
        answers={answers}
        flaggedQuestions={flaggedQuestions}
        onGoToQuestion={goToQuestion}
      />

      {/* Submit Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showSubmitDialog}
        title="Kumpulkan Latihan Mandiri?"
        message="Kamu akan mengakhiri sesi latihan ini. Hasil beserta kunci jawaban dan pembahasan lengkap akan langsung ditampilkan."
        confirmLabel="Ya, Kumpulkan"
        cancelLabel="Lanjutkan Mengerjakan"
        variant="success"
        onConfirm={handleConfirmSubmit}
        onCancel={() => setShowSubmitDialog(false)}
      >
        {unansweredCount > 0 && (
          <div className="mt-3 px-4 py-3 bg-red-50 dark:bg-red-900/30 border border-red-100 dark:border-red-900/50 rounded-xl text-sm transition-colors">
            <span className="font-bold text-red-650 dark:text-red-400">{unansweredCount} soal</span>
            <span className="text-red-500 dark:text-red-400/80"> belum kamu jawab!</span>
          </div>
        )}
      </ConfirmDialog>

    </div>
  );
}
