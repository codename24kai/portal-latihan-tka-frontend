import { Check } from 'lucide-react';

/**
 * Single answer option card (A, B, C, or D).
 * Large tappable target with clear selected state.
 */
export default function OptionCard({ label, text, isSelected, onSelect }) {
  return (
    <button
      id={`option-${label}`}
      onClick={onSelect}
      aria-pressed={isSelected}
      className={`option-card group flex items-start gap-3 ${isSelected ? 'selected' : ''}`}
    >
      {/* Option label circle */}
      <span
        className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center
                     text-sm font-bold transition-all duration-200 ${
                       isSelected
                         ? 'bg-primary text-white shadow-glow scale-110'
                         : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200'
                     }`}
      >
        {isSelected ? <Check size={18} strokeWidth={3} /> : label}
      </span>

      {/* Option text */}
      <span
        className={`flex-1 pt-2 text-base sm:text-lg leading-snug transition-colors duration-200 ${
          isSelected ? 'text-primary font-semibold' : 'text-gray-700'
        }`}
      >
        {text}
      </span>
    </button>
  );
}
