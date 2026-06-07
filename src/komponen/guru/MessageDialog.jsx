import React from 'react';
import { Mail, Send, X, Info } from 'lucide-react';
import toast from 'react-hot-toast';

/**
 * Reusable modal dialog for sending a direct message to a student.
 * Props:
 * - student: object with at least `id` and `name`.
 * - isOpen: boolean to control visibility.
 * - onClose: () => void to close the modal.
 * - onSend: async (payload) => Promise<void> handler for sending the message.
 * - messageType, setMessageType, messageText, setMessageText, isSending
 */
export default function MessageDialog({
  student,
  isOpen,
  onClose,
  onSend,
  messageType,
  setMessageType,
  messageText,
  setMessageText,
  isSending,
}) {
  if (!isOpen || !student) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    await onSend({
      to: student.id,
      name: student.name,
      type: messageType,
      body: messageText,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-2xl max-w-lg w-full flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 border border-white/20 dark:border-slate-700">
        <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
          <div>
            <span className="text-[9px] font-black text-orange-600 dark:text-orange-400 uppercase tracking-widest">Kirim Pesan Langsung</span>
            <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight">Hubungi {student.name}</h3>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 hover:text-rose-500 transition-colors font-black text-sm">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Kategori Pesan</label>
            <div className="flex gap-2">
              {['Motivasi', 'Peringatan', 'Evaluasi'].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setMessageType(type)}
                  className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${messageType === type
                    ? 'bg-orange-600 text-white border-transparent shadow-md'
                    : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-700 text-slate-400 hover:bg-slate-50'}
                  `}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Isi Pesan</label>
            <textarea
              required
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder={`Tulis pesan ${messageType.toLowerCase()} untuk ${student.name}...`}
              className="w-full h-32 p-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all dark:text-white resize-none"
            />
          </div>
          <div className="flex items-center gap-3 p-4 bg-teal-50 dark:bg-teal-900/10 rounded-2xl border border-teal-100 dark:border-teal-900/30">
            <Info size={16} className="text-teal-600 shrink-0" />
            <p className="text-[10px] font-bold text-teal-700 dark:text-teal-400 uppercase leading-relaxed">
              Pesan langsung terkirim dan memicu push notification di dasbor siswa.
            </p>
          </div>
          <div className="flex gap-4 border-t border-slate-100 dark:border-slate-700 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-4 bg-slate-100 dark:bg-slate-700 text-slate-400 font-black uppercase tracking-widest text-[11px] rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSending || !messageText.trim()}
              className="flex-1 py-4 bg-orange-600 text-white font-black uppercase tracking-widest text-[11px] rounded-2xl shadow-lg shadow-orange-600/20 hover:bg-orange-700 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
            >
              {isSending ? 'Mengirim...' : 'Kirim Pesan'} <Send size={14} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
