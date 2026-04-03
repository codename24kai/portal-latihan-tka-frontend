import { formatTime } from '../../utils/formatTime';
import { Clock, Grid3X3, AlertTriangle } from 'lucide-react';

/**
 * Sticky top bar during exam — shows timer and question counter.
 * Timer changes color when under 5 minutes.
 */
export default function ExamHeader({
  timeLeft,
  isWarning,
  currentQuestion,
  totalQuestions,
  answeredCount,
  onToggleNavigator,
}) {
  return (
    <header
      id="exam-header"
      className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100 safe-top"
    >
      <div className="flex items-center justify-between px-4 py-3 max-w-2xl mx-auto">
        {/* Timer */}
        <div
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-lg tracking-wide transition-colors duration-300 ${
            isWarning
              ? 'bg-red-50 text-red-500 animate-pulse-soft'
              : 'bg-gray-50 text-dark'
          }`}
        >
          {isWarning ? (
            <AlertTriangle size={20} className="text-red-400" />
          ) : (
            <Clock size={20} className="text-gray-400" />
          )}
          <time>{formatTime(timeLeft)}</time>
        </div>

        {/* Question Counter */}
        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-500 font-medium">
            <span className="text-primary font-bold text-base">{currentQuestion}</span>
            <span className="mx-1">/</span>
            <span>{totalQuestions}</span>
          </div>

          {/* Navigator Toggle Button */}
          <button
            id="btn-toggle-navigator"
            onClick={onToggleNavigator}
            className="relative flex items-center justify-center w-10 h-10 rounded-xl
                       bg-primary-50 text-primary hover:bg-primary/10
                       transition-all duration-200 active:scale-95"
            aria-label="Navigasi soal"
          >
            <Grid3X3 size={20} />
            {/* Unanswered badge */}
            {answeredCount < totalQuestions && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-white
                              text-[10px] font-bold rounded-full flex items-center justify-center">
                {totalQuestions - answeredCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-gray-100">
        <div
          className="h-full bg-gradient-to-r from-primary to-secondary rounded-r-full transition-all duration-500 ease-out"
          style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
        />
      </div>
    </header>
  );
}
