import { formatTime } from '../../utils/formatTime';
import { Clock, Grid3X3, AlertTriangle, Sun, Moon } from 'lucide-react';
import { useDarkMode } from '../../hooks/useDarkMode';

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
  const { isDark, toggleDarkMode } = useDarkMode();

  return (
    <header
      id="exam-header"
      className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 safe-top transition-colors duration-300"
    >
      <div className="flex items-center justify-between px-4 py-3 max-w-2xl mx-auto">
        {/* Timer */}
        <div
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-lg tracking-wide transition-all duration-300 ${
            isWarning
              ? 'bg-red-50 dark:bg-red-900/30 text-red-500 dark:text-red-400 animate-pulse-soft'
              : 'bg-slate-50 dark:bg-slate-800 text-dark dark:text-slate-200'
          }`}
        >
          {isWarning ? (
            <AlertTriangle size={20} className="text-red-400" />
          ) : (
            <Clock size={20} className="text-slate-400 dark:text-slate-400" />
          )}
          <time>{formatTime(timeLeft)}</time>
        </div>

        {/* Question Counter & Controls */}
        <div className="flex items-center gap-3">
          <div className="text-sm text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
            <span className="text-primary dark:text-primary-light font-bold text-base">{currentQuestion}</span>
            <span className="mx-1">/</span>
            <span>{totalQuestions}</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-200"
              aria-label="Toggle dark mode"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Navigator Toggle Button */}
            <button
              id="btn-toggle-navigator"
              onClick={onToggleNavigator}
              className="relative flex items-center justify-center w-10 h-10 rounded-xl
                         bg-primary-50 dark:bg-primary/20 text-primary dark:text-primary-light hover:bg-primary/10
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
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-slate-100 dark:bg-slate-800">
        <div
          className="h-full bg-gradient-to-r from-primary to-secondary rounded-r-full transition-all duration-500 ease-out"
          style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
        />
      </div>
    </header>
  );
}
