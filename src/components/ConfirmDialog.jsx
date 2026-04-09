import { AlertTriangle, X } from 'lucide-react';

/**
 * Reusable confirmation modal/dialog.
 * Used for exam submission confirmation.
 */
export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = 'Ya, Kumpulkan',
  cancelLabel = 'Kembali',
  variant = 'warning', // 'warning' | 'danger'
  onConfirm,
  onCancel,
  children,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-dark/50 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Dialog */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-scale-in">
        {/* Close button */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-slate-100
                     flex items-center justify-center hover:bg-slate-200 transition-colors"
        >
          <X size={16} className="text-slate-400" />
        </button>

        <div className="p-6 text-center">
          {/* Icon */}
          <div
            className={`w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center ${
              variant === 'danger'
                ? 'bg-red-50 text-red-400'
                : 'bg-warning/20 text-warning'
            }`}
          >
            <AlertTriangle size={28} />
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-dark mb-2">{title}</h3>

          {/* Message */}
          <p className="text-slate-500 text-sm leading-relaxed mb-2">{message}</p>

          {/* Extra content (e.g., unanswered count) */}
          {children}
        </div>

        {/* Actions */}
        <div className="flex gap-3 p-5 pt-0">
          <button
            id="btn-dialog-cancel"
            onClick={onCancel}
            className="btn-ghost flex-1"
          >
            {cancelLabel}
          </button>
          <button
            id="btn-dialog-confirm"
            onClick={onConfirm}
            className={`btn-touch flex-1 text-white ${
              variant === 'danger'
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-primary hover:bg-primary-dark hover:shadow-glow'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
