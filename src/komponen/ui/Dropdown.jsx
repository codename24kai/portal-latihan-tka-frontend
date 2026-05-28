import React from 'react';
import { ChevronDown } from 'lucide-react';

/**
 * Dropdown: A styled reusable select component.
 * Follows the 'Teal' theme for focus and provides clean interaction cues.
 */
const Dropdown = ({ 
  label, 
  options = [], 
  value, 
  onChange, 
  placeholder = "Pilih opsi...",
  className = ""
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
          {label}
        </label>
      )}
      <div className="relative group">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-5 pr-12 py-3.5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl text-sm font-bold text-slate-700 dark:text-slate-200 outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all appearance-none cursor-pointer"
        >
          <option value="" disabled className="text-slate-400">
            {placeholder}
          </option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-teal-600 transition-colors">
          <ChevronDown size={18} />
        </div>
      </div>
    </div>
  );
};

export default Dropdown;
