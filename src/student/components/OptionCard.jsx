import { Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import MathRenderer from '../../components/ui/MathRenderer';

/**
 * Single answer option card (A, B, C, or D).
 * Enhanced with instant animated feedback for correctness.
 */
export default function OptionCard({ label, text, isSelected, onSelect, disabled, isCorrect, isWrong }) {
  return (
    <button
      id={`option-${label}`}
      onClick={onSelect}
      disabled={disabled}
      aria-pressed={isSelected}
      className={`option-card group relative flex items-center gap-6 p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border-2 transition-all duration-300 ease-out select-none active:scale-[0.98] ${
        isSelected
          ? isCorrect
            ? 'bg-emerald-600 border-emerald-600 shadow-xl shadow-emerald-600/20 text-white'
            : isWrong
              ? 'bg-rose-600 border-rose-600 shadow-xl shadow-rose-600/20 text-white'
              : 'bg-indigo-600 border-indigo-600 shadow-xl shadow-indigo-600/20 text-white transform -translate-y-1'
          : isCorrect && disabled // Highlight correct even if not picked
            ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-500 dark:border-emerald-500/50 text-emerald-600 dark:text-emerald-400'
            : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-indigo-500/30 hover:bg-white dark:hover:bg-slate-700/30 shadow-sm dark:shadow-none'
      } ${disabled && !isSelected && !isCorrect ? 'opacity-40 grayscale-[0.8] cursor-not-allowed border-slate-50 dark:border-slate-800' : ''}`}
    >
      {/* Option label circle */}
      <span
        className={`flex-shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center
                     text-xl font-black transition-all duration-300 ${
                       isSelected
                         ? 'bg-white text-indigo-600 scale-110 shadow-lg'
                         : isCorrect && disabled
                           ? 'bg-emerald-500 text-white shadow-lg'
                           : 'bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-300 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900 group-hover:text-indigo-600'
                     }`}
      >
        <AnimatePresence mode="wait">
          {isCorrect && isSelected ? (
            <motion.div
              key="check"
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              className="text-emerald-600"
            >
              <Check size={32} strokeWidth={4} />
            </motion.div>
          ) : isWrong && isSelected ? (
            <motion.div
              key="cross"
              initial={{ scale: 0, rotate: 45 }}
              animate={{ scale: 1, rotate: 0 }}
              className="text-rose-600"
            >
              <X size={32} strokeWidth={4} />
            </motion.div>
          ) : (
            <motion.span key="label">{label}</motion.span>
          )}
        </AnimatePresence>
      </span>

      {/* Option text content */}
      <span
        className={`flex-1 text-lg md:text-xl font-black text-left transition-colors duration-300 ${
          isSelected 
            ? 'italic tracking-tight text-white' 
            : isCorrect && disabled
              ? 'text-emerald-600 dark:text-emerald-400'
              : 'text-slate-700 dark:text-slate-200'
        }`}
      >
        <MathRenderer text={text} />
      </span>

      {/* Feedback Popups for students */}
      <AnimatePresence>
        {isSelected && (isCorrect || isWrong) && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: -45, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className={`absolute top-0 left-1/2 -translate-x-1/2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-white shadow-xl ${
              isCorrect ? 'bg-emerald-500' : 'bg-rose-500'
            }`}
          >
            {isCorrect ? 'Mantap!' : 'Coba Lagi!'}
            <div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 ${
              isCorrect ? 'bg-emerald-500' : 'bg-rose-500'
            }`} />
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
}
