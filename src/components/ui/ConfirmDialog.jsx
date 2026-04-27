import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

/**
 * ConfirmDialog: A universal modal for destructive actions.
 * Follows the 'Tinted & Soft' design system with strict dark mode support.
 */
const ConfirmDialog = ({
  isOpen,
  title = "Konfirmasi Tindakan",
  message = "Apakah Anda yakin ingin melakukan tindakan ini? Data yang dihapus tidak dapat dikembalikan.",
  confirmLabel = "Ya, Hapus",
  cancelLabel = "Batal",
  onConfirm,
  onCancel,
  variant = "danger" // 'danger' | 'warning' | 'info'
}) => {
  if (!isOpen) return null;

  const themes = {
    danger: {
      icon: <AlertTriangle className="text-rose-500" size={28} />,
      button: "bg-rose-600 hover:bg-rose-700 shadow-rose-600/20",
      bg: "bg-rose-50 dark:bg-rose-900/20",
      border: "border-rose-100 dark:border-rose-800/50"
    },
    warning: {
      icon: <AlertTriangle className="text-amber-500" size={28} />,
      button: "bg-amber-500 hover:bg-amber-600 shadow-amber-500/20",
      bg: "bg-amber-50 dark:bg-amber-900/20",
      border: "border-amber-100 dark:border-amber-800/50"
    },
    info: {
      icon: <AlertTriangle className="text-indigo-500" size={28} />,
      button: "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/20",
      bg: "bg-indigo-50 dark:bg-indigo-900/20",
      border: "border-indigo-100 dark:border-indigo-800/50"
    }
  };

  const theme = themes[variant] || themes.danger;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
        onClick={onCancel}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-2xl border border-white/20 dark:border-slate-700 overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-8 pt-8 pb-4 flex flex-col items-center text-center">
          <div className={`w-16 h-16 ${theme.bg} ${theme.border} border-2 rounded-3xl flex items-center justify-center mb-6`}>
            {theme.icon}
          </div>

          <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight mb-2">
            {title}
          </h3>
          <p className="text-sm font-bold text-slate-500 dark:text-slate-400 leading-relaxed">
            {message}
          </p>
        </div>

        <div className="p-8 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="py-4 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-slate-600 transition-all outline-none"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`py-4 ${theme.button} text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg active:scale-95 transition-all outline-none`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
