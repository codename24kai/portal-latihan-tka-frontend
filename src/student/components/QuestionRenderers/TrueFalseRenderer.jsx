import React from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

/**
 * TrueFalseRenderer — AKM-Style Complex True/False (Benar/Salah Majemuk)
 * 
 * Renders a matrix of statements where the student evaluates each as Benar/Salah.
 * 
 * State shape: selected = { s1: true, s2: false, ... }
 * Each statement answer is independently tracked.
 * 
 * Backward Compatible: Falls back to legacy single Benar/Salah if payload uses
 * old `correct_value` format (no `statements` array).
 */
export default function TrueFalseRenderer({ payload, selected, onSelect }) {
  const statements = payload?.statements;
  const isLegacy = !statements && payload?.correct_value !== undefined;

  // ═══════════════════════════════════════════════════
  // LEGACY FALLBACK: Old single true/false format
  // ═══════════════════════════════════════════════════
  if (isLegacy) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <button
          onClick={() => onSelect(true)}
          className={`group relative p-10 rounded-[2.5rem] border-2 transition-all flex flex-col items-center gap-6 ${
            selected === true 
              ? 'bg-emerald-50 border-emerald-500 text-emerald-600 dark:bg-emerald-900/20 shadow-xl shadow-emerald-500/10' 
              : 'bg-white border-slate-100 text-slate-400 dark:bg-slate-800 dark:border-slate-700 hover:border-emerald-200'
          }`}
        >
          <div className={`w-20 h-20 rounded-3xl flex items-center justify-center transition-all ${
            selected === true ? 'bg-emerald-500 text-white shadow-lg' : 'bg-slate-50 dark:bg-slate-900 text-slate-200'
          }`}>
            <CheckCircle2 size={48} />
          </div>
          <span className="text-lg font-black uppercase tracking-[0.2em]">Benar</span>
        </button>

        <button
          onClick={() => onSelect(false)}
          className={`group relative p-10 rounded-[2.5rem] border-2 transition-all flex flex-col items-center gap-6 ${
            selected === false 
              ? 'bg-rose-50 border-rose-500 text-rose-600 dark:bg-rose-900/20 shadow-xl shadow-rose-500/10' 
              : 'bg-white border-slate-100 text-slate-400 dark:bg-slate-800 dark:border-slate-700 hover:border-rose-200'
          }`}
        >
          <div className={`w-20 h-20 rounded-3xl flex items-center justify-center transition-all ${
            selected === false ? 'bg-rose-500 text-white shadow-lg' : 'bg-slate-50 dark:bg-slate-900 text-slate-200'
          }`}>
            <XCircle size={48} />
          </div>
          <span className="text-lg font-black uppercase tracking-[0.2em]">Salah</span>
        </button>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════
  // NEW: AKM-style Complex True/False (Matrix)
  // ═══════════════════════════════════════════════════
  const currentAnswers = (typeof selected === 'object' && selected !== null && !Array.isArray(selected))
    ? selected 
    : {};

  const handleStatementSelect = (statementId, value) => {
    onSelect({
      ...currentAnswers,
      [statementId]: value
    });
  };

  return (
    <div className="space-y-4">
      {/* Header Row */}
      <div className="hidden sm:grid sm:grid-cols-[1fr_auto] items-center gap-4 px-5 py-3">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Pernyataan</span>
        <div className="flex items-center gap-6">
          <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] w-16 text-center">Benar</span>
          <span className="text-[10px] font-black text-rose-500 uppercase tracking-[0.2em] w-16 text-center">Salah</span>
        </div>
      </div>

      {/* Statements */}
      {(statements || []).map((statement, idx) => {
        const answer = currentAnswers[statement.id];
        const isAnswered = answer !== undefined;

        return (
          <div 
            key={statement.id}
            className={`
              relative rounded-[2rem] border-2 transition-all overflow-hidden
              ${isAnswered 
                ? 'border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800' 
                : 'border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800'
              }
            `}
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-5">
              {/* Statement Number + Text */}
              <div className="flex items-start gap-4 flex-1 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-[10px] font-black text-slate-500 shrink-0 border border-slate-100 dark:border-slate-700 mt-0.5">
                  {idx + 1}
                </div>
                <p className="text-sm sm:text-base font-semibold text-slate-700 dark:text-slate-200 leading-relaxed pt-1">
                  {statement.text}
                </p>
              </div>

              {/* Benar / Salah Buttons */}
              <div className="flex items-center gap-3 sm:gap-4 ml-12 sm:ml-0 shrink-0">
                <button
                  onClick={() => handleStatementSelect(statement.id, true)}
                  className={`
                    flex items-center justify-center gap-2 px-4 py-3 sm:px-5 sm:py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider transition-all active:scale-95 w-[88px]
                    ${answer === true 
                      ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 scale-[1.02]' 
                      : 'bg-slate-50 dark:bg-slate-900 text-slate-400 border border-slate-100 dark:border-slate-700 hover:border-emerald-300 hover:text-emerald-500'
                    }
                  `}
                >
                  <CheckCircle2 size={16} />
                  <span className="hidden sm:inline">Benar</span>
                  <span className="sm:hidden">B</span>
                </button>

                <button
                  onClick={() => handleStatementSelect(statement.id, false)}
                  className={`
                    flex items-center justify-center gap-2 px-4 py-3 sm:px-5 sm:py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider transition-all active:scale-95 w-[88px]
                    ${answer === false 
                      ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20 scale-[1.02]' 
                      : 'bg-slate-50 dark:bg-slate-900 text-slate-400 border border-slate-100 dark:border-slate-700 hover:border-rose-300 hover:text-rose-500'
                    }
                  `}
                >
                  <XCircle size={16} />
                  <span className="hidden sm:inline">Salah</span>
                  <span className="sm:hidden">S</span>
                </button>
              </div>
            </div>

            {/* Answered indicator */}
            {isAnswered && (
              <div className={`h-1 w-full ${answer === true ? 'bg-emerald-500' : 'bg-rose-500'}`} />
            )}
          </div>
        );
      })}

      {/* Progress indicator */}
      {statements && statements.length > 0 && (
        <div className="flex items-center justify-center gap-3 pt-4">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            {Object.keys(currentAnswers).length} / {statements.length} dijawab
          </span>
          <div className="w-24 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-teal-500 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${(Object.keys(currentAnswers).length / statements.length) * 100}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
