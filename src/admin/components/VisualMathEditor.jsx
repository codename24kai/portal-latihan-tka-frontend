import React, { useEffect, useRef, useState } from 'react';
import { X, Check, Calculator } from 'lucide-react';
import "mathlive";

/**
 * Visual Math Editor using MathLive.
 * Allows teachers to construct formulas visually.
 */
export default function VisualMathEditor({ isOpen, onCancel, onInsert }) {
    const mfRef = useRef(null);
    const [latex, setLatex] = useState('');

    useEffect(() => {
        // MathLive registers the <math-field> custom element on import.
        // We can interact with it via its DOM API.
        if (mfRef.current) {
            mfRef.current.addEventListener('input', (e) => {
                setLatex(e.target.value);
            });
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleInsert = () => {
        if (latex) {
            onInsert(latex);
        }
        onCancel();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-fade-in"
                onClick={onCancel}
            />

            <div className="relative w-full max-w-lg bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-2xl border border-white/20 dark:border-slate-700 animate-in zoom-in-95 duration-200 overflow-hidden">
                {/* Header */}
                <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600">
                            <Calculator size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight leading-none">Editor Rumus</h3>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Visual Equation Builder</p>
                        </div>
                    </div>
                    <button
                        onClick={onCancel}
                        className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-rose-500 transition-all"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-8 space-y-6">
                    {/* Visual Editor Area */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Ketik atau Pilih Rumus</label>
                        <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border-2 border-indigo-100 dark:border-indigo-900/50 min-h-[120px] flex items-center justify-center focus-within:ring-4 focus-within:ring-indigo-500/10 transition-all">
                            <math-field
                                ref={mfRef}
                                style={{
                                    fontSize: '24px',
                                    padding: '12px',
                                    width: '100%',
                                    border: 'none',
                                    background: 'transparent',
                                    color: 'inherit',
                                    '--keyboard-zindex': '10000'
                                }}
                            >
                                {latex}
                            </math-field>
                        </div>
                    </div>

                    {/* LaTeX Preview */}
                    <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Preview LaTeX Code</p>
                        <code className="text-xs font-mono text-indigo-600 dark:text-indigo-400 break-all">
                            {latex ? `$${latex}$` : '(Kosong)'}
                        </code>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                        <button
                            onClick={handleInsert}
                            disabled={!latex}
                            className="flex-1 py-4 bg-indigo-600 disabled:opacity-50 text-white rounded-[1.25rem] font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 active:scale-95 transition-all flex items-center justify-center gap-2"
                        >
                            <Check size={18} /> Sisipkan ke Teks
                        </button>
                        <button
                            onClick={onCancel}
                            className="px-8 py-4 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 rounded-[1.25rem] font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all"
                        >
                            Batal
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
