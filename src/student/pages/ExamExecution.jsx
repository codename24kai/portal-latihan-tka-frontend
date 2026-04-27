import { useState, useCallback, useMemo, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCountdown } from '../../hooks/useCountdown';
import mockQuestions from '../../data/mockQuestionsV2'; // Using V2 for demo
import ExamHeader from '../components/ExamHeader';
import QuestionContent from '../components/QuestionContent';
import ExamNavBar from '../components/ExamNavBar';
import QuestionNavigator from '../components/QuestionNavigator';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
import ExamFallback from '../components/ExamFallback';

// Renderers
import SingleChoiceRenderer from '../components/QuestionRenderers/SingleChoiceRenderer';
import MultiChoiceRenderer from '../components/QuestionRenderers/MultiChoiceRenderer';
import TrueFalseRenderer from '../components/QuestionRenderers/TrueFalseRenderer';
import EssayRenderer from '../components/QuestionRenderers/EssayRenderer';

import { QUESTION_TYPES } from '@/constants/questions';

const RENDERER_MAP = {
  [QUESTION_TYPES.SINGLE_CHOICE]: SingleChoiceRenderer,
  [QUESTION_TYPES.MULTI_CHOICE]:  MultiChoiceRenderer,
  [QUESTION_TYPES.TRUE_FALSE]:    TrueFalseRenderer,
  [QUESTION_TYPES.ESSAY]:         EssayRenderer,
};

/**
 * Full exam-taking page V2.
 * Orchestrates the timer, question navigation, answer selection, and submission.
 */
export default function ExamExecution() {
  const { examId } = useParams();
  const navigate = useNavigate();

  // State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { [questionId]: response_object }
  const [showNavigator, setShowNavigator] = useState(false);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [flaggedQuestions, setFlaggedQuestions] = useState(new Set());

  const questions = mockQuestions || [];
  const totalQuestions = questions?.length || 0;
  const currentQuestion = questions[currentIndex];
  const currentNumber = currentIndex + 1;

  // Answered count
  const answeredCount = useMemo(
    () => Object.keys(answers).length,
    [answers]
  );
  const unansweredCount = totalQuestions - answeredCount;

  // Timer
  const handleTimeUp = useCallback(() => {
    setIsSubmitted(true);
    navigate(`/exam/${examId}/result`, {
      state: { answers, totalQuestions, timeUp: true },
    });
  }, [answers, examId, navigate, totalQuestions]);

  const { timeLeft, isWarning, start } = useCountdown(5400, handleTimeUp);

  useEffect(() => {
    start();
  }, [start]);

  // Navigation
  const goToQuestion = useCallback((num) => {
    setCurrentIndex(num - 1);
  }, []);

  const handlePrevious = useCallback(() => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => Math.min(totalQuestions - 1, prev + 1));
  }, [totalQuestions]);

  // Answer selection (V2 stores response as object)
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
    setIsSubmitted(true);
    setShowSubmitDialog(false);
    navigate(`/exam/${examId}/result`, {
      state: { answers, totalQuestions, timeUp: false, examData: { id: examId } },
    });
  }, [answers, examId, navigate, totalQuestions]);

  if (isSubmitted) return null;

  if (totalQuestions === 0) {
    return <ExamFallback message="Belum ada soal tersedia untuk simulasi ini." />;
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
    <div id="exam-execution" className="h-screen flex flex-col bg-surface dark:bg-dark transition-colors duration-300 overflow-hidden">
      <div className="shrink-0">
        <ExamHeader
          timeLeft={timeLeft}
          isWarning={isWarning}
          currentQuestion={currentNumber}
          totalQuestions={totalQuestions}
          answeredCount={answeredCount}
          onToggleNavigator={() => setShowNavigator(true)}
        />
      </div>

      <main className="flex-1 overflow-y-auto px-4 py-6 dark:bg-dark scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
        <div className="max-w-3xl mx-auto w-full">
          <div key={currentQuestion.id} className="animate-fade-in pb-20">
            <QuestionContent
              questionNumber={currentNumber}
              text={currentQuestion.payload.stem}
              image={currentQuestion.payload.stem_image}
            />

            <div className="flex justify-end mt-4">
              <button
                onClick={handleToggleFlag}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs transition-all border-2 ${flaggedQuestions.has(currentNumber)
                    ? 'bg-orange-50 border-orange-200 text-orange-600 shadow-sm'
                    : 'bg-white dark:bg-dark border-slate-100 dark:border-dark-border text-slate-400 hover:border-slate-200'
                  }`}
              >
                <div className={`w-2 h-2 rounded-full ${flaggedQuestions.has(currentNumber) ? 'bg-orange-500 animate-pulse' : 'bg-slate-300'}`} />
                {flaggedQuestions.has(currentNumber) ? 'Ditandai' : 'Tandai Soal'}
              </button>
            </div>

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

      <ExamNavBar
        currentQuestion={currentNumber}
        totalQuestions={totalQuestions}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onSubmit={() => setShowSubmitDialog(true)}
      />

      <QuestionNavigator
        isOpen={showNavigator}
        onClose={() => setShowNavigator(false)}
        totalQuestions={totalQuestions}
        currentQuestion={currentNumber}
        answers={answers}
        flaggedQuestions={flaggedQuestions}
        onGoToQuestion={goToQuestion}
      />

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
