import { Check } from 'lucide-react';

/**
 * Single answer option card (A, B, C, or D).
 * Large tappable target with clear selected state.
 * Audited for deep Dark Mode support.
 */
export default function OptionCard({ label, text, isSelected, onSelect }) {
  return (
    <button
      id={`option-${label}`}
      onClick={onSelect}
      aria-pressed={isSelected}
      className={`option-card group flex items-start gap-4 p-5 rounded-2xl border-2 transition-all duration-300 ease-out select-none active:scale-[0.98] ${
        isSelected
          ? 'bg-primary/5 dark:bg-indigo-900 border-primary dark:border-indigo-500 shadow-glow dark:shadow-black/50 ring-2 ring-primary/20 dark:ring-indigo-500/20'
          : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:bg-slate-800 dark:hover:border-slate-700 shadow-sm dark:shadow-none'
      }`}
    >
      {/* Option label circle: Modern, High contrast */}
      <span
        className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center
                     text-lg font-bold transition-all duration-300 ${
                       isSelected
                         ? 'bg-primary text-white scale-110 shadow-glow dark:shadow-none'
                         : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-300 group-hover:bg-slate-200 dark:group-hover:bg-slate-700'
                     }`}
      >
        {isSelected ? <Check size={24} strokeWidth={3} /> : label}
      </span>

      {/* Option text content */}
      <span
        className={`flex-1 pt-2.5 text-base sm:text-lg leading-relaxed text-left transition-colors duration-300 ${
          isSelected 
            ? 'text-primary dark:text-indigo-100 font-bold' 
            : 'text-slate-700 dark:text-slate-300'
        }`}
      >
        {text}
      </span>
    </button>
  );
}
