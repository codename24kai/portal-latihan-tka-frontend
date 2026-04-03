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
    <div id="exam-execution" className="min-h-screen flex flex-col bg-surface">
      {/* Sticky Top Bar */}
      <ExamHeader
        timeLeft={timeLeft}
        isWarning={isWarning}
        currentQuestion={currentNumber}
        totalQuestions={totalQuestions}
        answeredCount={answeredCount}
        onToggleNavigator={() => setShowNavigator(true)}
      />

      {/* Main Content */}
      <main className="flex-1 px-4 py-5 max-w-2xl mx-auto w-full">
        {/* Question */}
        <div key={currentQuestion.id}>
          <QuestionContent
            questionNumber={currentNumber}
            text={currentQuestion.text}
            image={currentQuestion.image}
          />

          {/* Answer Options */}
          <div className="flex flex-col gap-3 mt-2">
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

      {/* Question Navigator Overlay */}
      <QuestionNavigator
        isOpen={showNavigator}
        onClose={() => setShowNavigator(false)}
        totalQuestions={totalQuestions}
        currentQuestion={currentNumber}
        answers={answers}
        onGoToQuestion={goToQuestion}
      />

      {/* Submit Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showSubmitDialog}
        title="Kumpulkan Ujian?"
        message="Pastikan semua jawabanmu sudah benar. Jawaban tidak bisa diubah setelah dikumpulkan."
        confirmLabel="Ya, Kumpulkan"
        cancelLabel="Periksa Lagi"
        variant={unansweredCount > 0 ? 'warning' : 'warning'}
        onConfirm={handleConfirmSubmit}
        onCancel={() => setShowSubmitDialog(false)}
      >
        {unansweredCount > 0 && (
          <div className="mt-3 px-4 py-3 bg-red-50 rounded-xl text-sm">
            <span className="font-bold text-red-500">{unansweredCount} soal</span>
            <span className="text-red-400"> belum dijawab!</span>
          </div>
        )}
      </ConfirmDialog>
    </div>
  );
}
