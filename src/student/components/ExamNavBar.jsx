import { ChevronLeft, ChevronRight, Send } from 'lucide-react';

/**
 * Sticky bottom navigation bar during exam.
 * Shows Previous/Next buttons, and Submit on the last question.
 */
export default function ExamNavBar({
  currentQuestion,
  totalQuestions,
  onPrevious,
  onNext,
  onSubmit,
}) {
  const isFirst = currentQuestion === 1;
  const isLast = currentQuestion === totalQuestions;

  return (
    <nav
      id="exam-nav-bar"
      className="sticky bottom-0 z-40 bg-white/90 backdrop-blur-md border-t border-gray-100 safe-bottom"
    >
      <div className="flex items-center justify-between gap-3 px-4 py-3 max-w-2xl mx-auto">
        {/* Previous Button */}
        <button
          id="btn-previous"
          onClick={onPrevious}
          disabled={isFirst}
          className={`btn-ghost flex items-center gap-2 ${
            isFirst ? 'opacity-40 cursor-not-allowed active:scale-100' : ''
          }`}
        >
          <ChevronLeft size={20} />
          <span className="hidden sm:inline">Sebelumnya</span>
        </button>

        {/* Question dots indicator (mobile) */}
        <div className="flex items-center gap-1.5 sm:hidden">
          {Array.from({ length: Math.min(5, totalQuestions) }, (_, i) => {
            const startDot = Math.max(0, Math.min(currentQuestion - 3, totalQuestions - 5));
            const dotIndex = startDot + i + 1;
            return (
              <span
                key={i}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  dotIndex === currentQuestion
                    ? 'bg-primary w-6'
                    : 'bg-gray-200'
                }`}
              />
            );
          })}
        </div>

        {/* Next / Submit Button */}
        {isLast ? (
          <button
            id="btn-submit"
            onClick={onSubmit}
            className="btn-primary flex items-center gap-2 bg-gradient-to-r from-primary to-secondary
                       hover:shadow-glow"
          >
            <Send size={18} />
            <span>Selesai</span>
          </button>
        ) : (
          <button
            id="btn-next"
            onClick={onNext}
            className="btn-primary flex items-center gap-2"
          >
            <span className="hidden sm:inline">Selanjutnya</span>
            <span className="sm:hidden">Lanjut</span>
            <ChevronRight size={20} />
          </button>
        )}
      </div>
    </nav>
  );
}
