import { useState, useCallback, useMemo, useEffect } from 'react';
import { useCountdown } from '@/hooks/useHitungMundur';
import ExamHeader from '@/komponen/siswa/latihan/HeaderUjian';
import QuestionContent from '@/komponen/siswa/latihan/KontenSoal';
import ExamNavBar from '@/komponen/siswa/latihan/NavBarUjian';
import QuestionNavigator from '@/komponen/siswa/latihan/NavigatorSoal';
import ConfirmDialog from '@/komponen/ui/DialogKonfirmasi';
import LoadingSkeleton from '@/komponen/ui/SkeletonMemuat';
import ExamFallback from '@/komponen/siswa/latihan/FallbackUjian';

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

/**
 * Reusable Exam Engine.
 * Supports:
 * - 'simulasi': Strict exam mode, mandatory timer, fullscreen friendly.
 * - 'latihan': Relaxed study mode, flexible timer (can be paused or ignored), free navigation.
 */
export default function ExamEngine({
  questions = [],
  duration = 5400, // Duration in seconds
  mode = 'simulasi', // 'simulasi' | 'latihan'
  title = 'Pengerjaan Soal',
  onSubmit, // Callback(answers, timeTaken, timeUp)
  onCancel, // Callback if student exits
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { [questionId]: answer_value }
  const [showNavigator, setShowNavigator] = useState(false);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [flaggedQuestions, setFlaggedQuestions] = useState(new Set());
  const [timeTaken, setTimeTaken] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const totalQuestions = questions.length;
  const currentQuestion = questions[currentIndex];
  const currentNumber = currentIndex + 1;

  // Track time taken
  useEffect(() => {
    const timerInterval = setInterval(() => {
      setTimeTaken((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timerInterval);
  }, []);

  // Answer counts
  const answeredCount = useMemo(() => Object.keys(answers).length, [answers]);
  const unansweredCount = totalQuestions - answeredCount;

  // Timer logic
  const handleTimeUp = useCallback(() => {
    if (onSubmit) {
      onSubmit(answers, timeTaken, true);
    }
  }, [answers, timeTaken, onSubmit]);

  // If in practice ('latihan') mode, we can use a very long duration or let it be flexible
  const countdownDuration = useMemo(() => {
    return mode === 'latihan' ? 99999 : duration;
  }, [mode, duration]);

  const { timeLeft, isWarning, start, pause } = useCountdown(countdownDuration, handleTimeUp);

  useEffect(() => {
    start();
    return () => pause();
  }, [start, pause]);

  // Fullscreen support
  const toggleFullscreen = () => {
    const element = document.getElementById('exam-engine-root');
    if (!element) return;

    if (!document.fullscreenElement) {
      element.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch((err) => {
        console.error('Error enabling fullscreen:', err);
      });
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Navigation handlers
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
      setAnswers((prev) => ({
        ...prev,
        [currentQuestion.id]: response,
      }));
    },
    [currentQuestion?.id]
  );

  const handleToggleFlag = useCallback(() => {
    setFlaggedQuestions((prev) => {
      const next = new Set(prev);
      if (next.has(currentNumber)) {
        next.delete(currentNumber);
      } else {
        next.add(currentNumber);
      }
      return next;
    });
  }, [currentNumber]);

  const handleConfirmSubmit = useCallback(() => {
    setShowSubmitDialog(false);
    if (onSubmit) {
      onSubmit(answers, timeTaken, false);
    }
  }, [answers, timeTaken, onSubmit]);

  if (totalQuestions === 0) {
    return <ExamFallback message="Belum ada soal tersedia untuk sesi ini." />;
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex flex-col bg-surface dark:bg-dark">
        <LoadingSkeleton className="h-20 w-full mb-8" />
        <main className="flex-1 px-4 py-8 max-w-3xl mx-auto w-full">
          <LoadingSkeleton className="h-64 w-full rounded-[3rem]" />
        </main>
      </div>
    );
  }

  const Renderer = RENDERER_MAP[currentQuestion.question_type] || SingleChoiceRenderer;
  const currentAnswer = answers[currentQuestion.id];

  return (
    <div
      id="exam-engine-root"
      className="h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors duration-300 overflow-hidden relative"
    >
      {/* Header */}
      <div className="shrink-0">
        <ExamHeader
          timeLeft={mode === 'latihan' ? countdownDuration - timeTaken : timeLeft}
          isWarning={mode === 'latihan' ? false : isWarning}
          currentQuestion={currentNumber}
          totalQuestions={totalQuestions}
          answeredCount={answeredCount}
          onToggleNavigator={() => setShowNavigator(true)}
        />
      </div>

      {/* Mode Indicator & Fullscreen Button */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800/80 px-4 py-2 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className={`inline-block w-2.5 h-2.5 rounded-full ${mode === 'simulasi' ? 'bg-orange-500 animate-pulse' : 'bg-teal-500'}`} />
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {mode === 'simulasi' ? 'Mode Simulasi Resmi' : 'Mode Belajar Santai'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {mode === 'latihan' && (
            <span className="text-[9px] font-bold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/30 px-2 py-0.5 rounded-md">
              Waktu Fleksibel
            </span>
          )}
          <button
            onClick={toggleFullscreen}
            className="text-[10px] font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 hover:underline px-2 py-1"
          >
            {isFullscreen ? 'Keluar Fullscreen' : 'Layar Penuh (Fullscreen)'}
          </button>
        </div>
      </div>

      {/* Main Question Body */}
      <main className="flex-1 overflow-y-auto px-4 py-8 dark:bg-slate-950 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
        <div className="max-w-3xl mx-auto w-full">
          <div key={currentQuestion.id} className="pb-20 space-y-6">
            <QuestionContent
              questionNumber={currentNumber}
              text={currentQuestion.payload.stem}
              image={currentQuestion.payload.stem_image}
            />

            {/* Flag / Bookmark Question */}
            <div className="flex justify-end mt-4">
              <button
                onClick={handleToggleFlag}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-xs transition-all border-2 ${flaggedQuestions.has(currentNumber)
                  ? 'bg-orange-50 border-orange-200 text-orange-600 shadow-sm dark:bg-orange-950/20 dark:border-orange-900/50'
                  : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-400 hover:border-slate-200 dark:hover:border-slate-700'
                  }`}
              >
                <div className={`w-2 h-2 rounded-full ${flaggedQuestions.has(currentNumber) ? 'bg-orange-500 animate-pulse' : 'bg-slate-300 dark:bg-slate-700'}`} />
                {flaggedQuestions.has(currentNumber) ? 'Ragu-ragu (Ditandai)' : 'Tandai Ragu-ragu'}
              </button>
            </div>

            {/* Answer Options Renderer */}
            <div className="mt-8">
              <Renderer
                payload={currentQuestion.payload}
                selected={currentAnswer}
                onSelect={handleAnswerChange}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Footer Nav */}
      <ExamNavBar
        currentQuestion={currentNumber}
        totalQuestions={totalQuestions}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onSubmit={() => setShowSubmitDialog(true)}
      />

      {/* Navigator Modal */}
      <QuestionNavigator
        isOpen={showNavigator}
        onClose={() => setShowNavigator(false)}
        totalQuestions={totalQuestions}
        currentQuestion={currentNumber}
        answers={answers}
        flaggedQuestions={flaggedQuestions}
        onGoToQuestion={goToQuestion}
      />

      {/* Submission Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showSubmitDialog}
        title="Kumpulkan Jawaban?"
        message={
          mode === 'simulasi'
            ? 'Pastikan semua jawabanmu sudah diteliti. Sesi Simulasi Resmi akan disimpan dan nilai tidak bisa diubah.'
            : 'Kamu telah menyelesaikan Latihan Mandiri. Kamu bisa langsung melihat pembahasan lengkap setelah ini!'
        }
        confirmLabel={mode === 'simulasi' ? 'Ya, Kumpulkan' : 'Lihat Hasil & Pembahasan'}
        cancelLabel="Kembali Memeriksa"
        variant={mode === 'simulasi' ? 'warning' : 'success'}
        onConfirm={handleConfirmSubmit}
        onCancel={() => setShowSubmitDialog(false)}
      >
        {unansweredCount > 0 && (
          <div className="mt-3 px-4 py-3 bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-900/30 rounded-2xl text-xs transition-colors">
            <span className="font-black text-rose-600 dark:text-rose-400">{unansweredCount} soal</span>
            <span className="text-rose-500 dark:text-rose-400/80"> belum kamu jawab!</span>
          </div>
        )}
      </ConfirmDialog>
    </div>
  );
}
