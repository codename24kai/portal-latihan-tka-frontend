import React from 'react';
import { CheckCircle2, XCircle, Plus, Trash2 } from 'lucide-react';

/**
 * TrueFalseEditor — AKM-Style Complex True/False (Benar/Salah Majemuk)
 * 
 * Supports an array of statements, each with its own correct_answer (true/false).
 * Teachers write a main instruction (stem) and add multiple statements.
 * 
 * Backward Compatible: If old `correct_value` format is detected, it auto-migrates
 * to the new statements array on first interaction.
 */
export default function TrueFalseEditor({ payload, onChange }) {
  // Normalize: support old `correct_value` format by migrating to statements
  const statements = payload.statements || [];
  const isLegacy = !payload.statements && payload.correct_value !== undefined;

  const handleAddStatement = () => {
    const newId = `s${Date.now()}`;
    const newStatements = [...statements, { id: newId, text: '', correct_answer: true }];
    onChange({ ...payload, statements: newStatements });
  };

  const handleRemoveStatement = (id) => {
    const newStatements = statements.filter(s => s.id !== id);
    onChange({ ...payload, statements: newStatements });
  };

  const handleStatementTextChange = (id, text) => {
    const newStatements = statements.map(s => 
      s.id === id ? { ...s, text } : s
    );
    onChange({ ...payload, statements: newStatements });
  };

  const handleStatementAnswerChange = (id, correct_answer) => {
    const newStatements = statements.map(s => 
      s.id === id ? { ...s, correct_answer } : s
    );
    onChange({ ...payload, statements: newStatements });
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-10 border border-slate-100 dark:border-slate-700 space-y-8 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Benar / Salah Majemuk</span>
          <div className="h-px flex-1 bg-slate-50 dark:bg-slate-800" />
        </div>
        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400 px-3 py-1 rounded-full">
          {statements.length} Pernyataan
        </span>
      </div>

      {/* Legacy migration notice */}
      {isLegacy && (
        <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded-2xl">
          <p className="text-xs font-bold text-amber-700 dark:text-amber-400">
            ⚠️ Format lama terdeteksi. Klik "Tambah Pernyataan" untuk beralih ke format AKM Majemuk.
          </p>
        </div>
      )}

      {/* Statements List */}
      <div className="space-y-4">
        {statements.map((statement, index) => (
          <div 
            key={statement.id} 
            className="group relative p-5 rounded-2xl border border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/30 hover:border-slate-200 dark:hover:border-slate-600 transition-all"
          >
            {/* Statement Number Badge */}
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center text-[10px] font-black text-slate-500 shrink-0 mt-1 shadow-sm">
                {index + 1}
              </div>

              <div className="flex-1 space-y-3">
                {/* Statement Text Input */}
                <textarea
                  value={statement.text}
                  onChange={(e) => handleStatementTextChange(statement.id, e.target.value)}
                  placeholder={`Tuliskan pernyataan ${index + 1}...`}
                  rows={2}
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all dark:text-white resize-none placeholder:text-slate-300"
                />

                {/* Benar / Salah Toggle */}
                <div className="flex items-center gap-3">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Kunci:</span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleStatementAnswerChange(statement.id, true)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                        statement.correct_answer === true 
                          ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                          : 'bg-white dark:bg-slate-800 text-slate-400 border border-slate-100 dark:border-slate-700 hover:border-emerald-300'
                      }`}
                    >
                      <CheckCircle2 size={14} />
                      Benar
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStatementAnswerChange(statement.id, false)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                        statement.correct_answer === false 
                          ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20' 
                          : 'bg-white dark:bg-slate-800 text-slate-400 border border-slate-100 dark:border-slate-700 hover:border-rose-300'
                      }`}
                    >
                      <XCircle size={14} />
                      Salah
                    </button>
                  </div>
                </div>
              </div>

              {/* Delete Button */}
              {statements.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveStatement(statement.id)}
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-300 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all opacity-0 group-hover:opacity-100 shrink-0 mt-1"
                  title="Hapus pernyataan"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Statement Button */}
      <button
        type="button"
        onClick={handleAddStatement}
        className="w-full flex items-center justify-center gap-3 py-4 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl text-slate-400 hover:text-teal-600 hover:border-teal-300 dark:hover:border-teal-800 transition-all group"
      >
        <Plus size={18} className="group-hover:rotate-90 transition-transform" />
        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Tambah Pernyataan</span>
      </button>
    </div>
  );
}
