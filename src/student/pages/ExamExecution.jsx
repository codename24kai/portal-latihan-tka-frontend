import { useState, useCallback, useMemo, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCountdown } from '../../hooks/useCountdown';
import mockQuestions from '../../data/mockQuestions';
import ExamHeader from '../components/ExamHeader';
import QuestionContent from '../components/QuestionContent';
import OptionCard from '../components/OptionCard';
import ExamNavBar from '../components/ExamNavBar';
import QuestionNavigator from '../components/QuestionNavigator';
import ConfirmDialog from '../../components/ConfirmDialog';

/**
 * Full exam-taking page.
 * Orchestrates the timer, question navigation, answer selection, and submission.
 * Audited for deep Dark Mode support and responsive desktop centering.
 */
export default function ExamExecution() {
  const { examId } = useParams();
  const navigate = useNavigate();

  // State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showNavigator, setShowNavigator] = useState(false);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [flaggedQuestions, setFlaggedQuestions] = useState(new Set());

  const questions = mockQuestions;
  const totalQuestions = questions.length;
  const currentQuestion = questions[currentIndex];
  const currentNumber = currentIndex + 1;

  // Answered count
  const answeredCount = useMemo(
    () => Object.keys(answers).length,
    [answers]
  );
  const unansweredCount = totalQuestions - answeredCount;

  // Timer: 90 minutes = 5400 seconds
  const handleTimeUp = useCallback(() => {
    setIsSubmitted(true);
    navigate(`/exam/${examId}/result`, {
      state: { answers, totalQuestions, timeUp: true },
    });
  }, [answers, examId, navigate, totalQuestions]);

  const { timeLeft, isWarning, start, isRunning } = useCountdown(5400, handleTimeUp);

  // Auto-start timer on mount
  useEffect(() => {
    start();
  }, [start]);

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

  // Answer selection
  const handleSelectOption = useCallback(
    (label) => {
      setAnswers((prev) => ({
        ...prev,
        [currentNumber]: label,
      }));
    },
    [currentNumber]
  );
  
  // Flagging
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

  // Submit handlers
  const handleSubmitClick = useCallback(() => {
    setShowSubmitDialog(true);
  }, []);

  const handleConfirmSubmit = useCallback(() => {
    setIsSubmitted(true);
    setShowSubmitDialog(false);
    navigate(`/exam/${examId}/result`, {
      state: { answers, totalQuestions, timeUp: false },
    });
  }, [answers, examId, navigate, totalQuestions]);

  if (isSubmitted) return null;

  return (
    <div id="exam-execution" className="min-h-screen flex flex-col bg-surface dark:bg-dark transition-colors duration-300">
      {/* Sticky Top Bar */}
      <ExamHeader
        timeLeft={timeLeft}
        isWarning={isWarning}
        currentQuestion={currentNumber}
        totalQuestions={totalQuestions}
        answeredCount={answeredCount}
        onToggleNavigator={() => setShowNavigator(true)}
      />

      {/* Main Content: Deep scan for dark mode leakages */}
      <main className="flex-1 px-4 py-8 max-w-3xl mx-auto w-full dark:bg-dark">
        {/* Question Item Container */}
        <div key={currentQuestion.id} className="animate-fade-in">
          <QuestionContent
            questionNumber={currentNumber}
            text={currentQuestion.text}
            image={currentQuestion.image}
          />
          
          {/* Flag Button */}
          <div className="flex justify-end mt-4">
            <button
              onClick={handleToggleFlag}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all border-2 ${
                flaggedQuestions.has(currentNumber)
                  ? 'bg-orange-50 border-orange-200 text-orange-600 shadow-sm'
                  : 'bg-white dark:bg-dark border-slate-100 dark:border-dark-border text-slate-400 hover:border-slate-200'
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${flaggedQuestions.has(currentNumber) ? 'bg-orange-500 animate-pulse' : 'bg-slate-300'}`} />
              {flaggedQuestions.has(currentNumber) ? 'Ditandai (Ragu-ragu)' : 'Tandai Soal'}
            </button>
          </div>

          {/* Answer Options Grid */}
          <div className="flex flex-col gap-3 mt-6">
            {currentQuestion.options.map((option) => (
              <OptionCard
                key={option.label}
                label={option.label}
                text={option.text}
                isSelected={answers[currentNumber] === option.label}
                onSelect={() => handleSelectOption(option.label)}
              />
            ))}
          </div>
        </div>
      </main>

      {/* Sticky Bottom Bar */}
      <ExamNavBar
        currentQuestion={currentNumber}
        totalQuestions={totalQuestions}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onSubmit={handleSubmitClick}
      />

      {/* Overlays & Dialogs */}
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
        title="Kumpulkan Ujian?"
        message="Pastikan semua jawabanmu sudah benar. Jawaban tidak bisa diubah setelah dikumpulkan."
        confirmLabel="Ya, Kumpulkan"
        cancelLabel="Periksa Lagi"
        variant="warning"
        onConfirm={handleConfirmSubmit}
        onCancel={() => setShowSubmitDialog(false)}
      >
        {unansweredCount > 0 && (
          <div className="mt-3 px-4 py-3 bg-red-50 dark:bg-red-900/30 border border-red-100 dark:border-red-900/50 rounded-xl text-sm transition-colors">
            <span className="font-bold text-red-600 dark:text-red-400">{unansweredCount} soal</span>
            <span className="text-red-500 dark:text-red-400/80"> belum dijawab!</span>
          </div>
        )}
      </ConfirmDialog>
    </div>
  );
}
