import React from 'react';
import { Megaphone, Send, Info } from 'lucide-react';

export default function AnnouncementModal({
  isOpen,
  onClose,
  targetType,
  setTargetType,
  selectedStudentIds,
  setSelectedStudentIds,
  classStudents,
  selectAllStudents,
  clearAllStudents,
  toggleStudentSelection,
  priority,
  setPriority,
  announcementText,
  setAnnouncementText,
  handleSendAnnouncement,
  assignedClass,
  getPriorityColor
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl max-h-[92vh] md:max-h-[90vh] bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-700 p-8 sm:p-10 animate-in zoom-in-95 duration-200 flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6 shrink-0">
          <div className="w-12 h-12 bg-orange-50 dark:bg-orange-900/30 rounded-2xl flex items-center justify-center text-orange-600 shrink-0">
            <Megaphone size={24} />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight leading-none">Kirim Pengumuman</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Broadcast pesan ke siswa kelas anda</p>
          </div>
        </div>

        {/* Scrollable Container */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-6">
          {/* Target Type Selector */}
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Target Penerima</label>
            <div className="flex gap-2">
              {[
                { id: 'Semua', label: 'Semua Siswa' },
                { id: 'Spesifik', label: 'Siswa Spesifik' }
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    setTargetType(t.id);
                    if (t.id === 'Semua') {
                      setSelectedStudentIds([]);
                    }
                  }}
                  className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${targetType === t.id
                      ? 'bg-orange-600 text-white border-transparent shadow-lg'
                      : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-700 text-slate-400'
                    }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Specific Student Selector Grid */}
          {targetType === 'Spesifik' && (
            <div className="space-y-3">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Pilih Murid ({selectedStudentIds.length} Terpilih)
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={selectAllStudents}
                    className="text-[9px] font-black text-orange-600 dark:text-orange-500 uppercase hover:underline"
                  >
                    Pilih Semua
                  </button>
                  <span className="text-[9px] text-slate-300 dark:text-slate-700">|</span>
                  <button
                    type="button"
                    onClick={clearAllStudents}
                    className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase hover:underline"
                  >
                    Bersihkan
                  </button>
                </div>
              </div>
              <div className="max-h-48 overflow-y-auto p-3 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl grid grid-cols-1 sm:grid-cols-2 gap-2">
                {classStudents.map((s) => {
                  const isSelected = selectedStudentIds.includes(s.id);
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => toggleStudentSelection(s.id)}
                      className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${isSelected
                          ? 'bg-orange-500 text-white border-transparent shadow-md'
                          : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-200'
                        }`}
                    >
                      <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${isSelected ? 'bg-white border-white text-orange-500' : 'border-slate-300 dark:border-slate-600 bg-transparent'
                        }`}>
                        {isSelected && <span className="text-[10px] font-black leading-none">✓</span>}
                      </div>
                      <div className="truncate">
                        <p className="text-xs font-bold truncate">{s.name}</p>
                        <p className={`text-[9px] ${isSelected ? 'text-white/80' : 'text-slate-400'}`}>Skor: {s.avgScore}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Recipient Preview */}
          <div className="flex flex-col px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl">
            <div className="flex items-center gap-2">
              <Send size={14} className="text-orange-500" />
              <span className="text-[10px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest">
                Dikirim ke: <span className="text-orange-600 font-black">
                  {targetType === 'Spesifik'
                    ? `${selectedStudentIds.length} Siswa Terpilih`
                    : `Seluruh Siswa Kelas ${assignedClass} (${classStudents.length} Siswa)`}
                </span>
              </span>
            </div>
            {targetType === 'Spesifik' && selectedStudentIds.length > 0 && (
              <p className="text-[10px] text-slate-400 font-semibold mt-2 border-t border-slate-200 dark:border-slate-800 pt-2 leading-relaxed">
                Nama: {classStudents.filter(s => selectedStudentIds.includes(s.id)).map(s => s.name).join(', ')}
              </p>
            )}
          </div>

          {/* Priority Selector */}
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Prioritas Pesan</label>
            <div className="flex gap-2">
              {['Biasa', 'Penting', 'Urgent'].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${priority === p
                      ? getPriorityColor(p) + ' border-transparent shadow-lg'
                      : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-700 text-slate-400'
                    }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Textarea */}
          <div className="relative">
            <textarea
              value={announcementText}
              onChange={(e) => setAnnouncementText(e.target.value.slice(0, 500))}
              placeholder="Tulis pesan pengumuman di sini..."
              className="w-full h-32 p-5 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all dark:text-white resize-none"
            />
            <div className={`absolute bottom-4 right-6 text-[10px] font-black tracking-widest ${announcementText.length >= 450 ? 'text-rose-500' : 'text-slate-300'}`}>
              {announcementText.length} / 500
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-teal-50 dark:bg-teal-900/10 rounded-2xl border border-teal-100 dark:border-teal-900/30">
            <Info size={16} className="text-teal-600 shrink-0" />
            <p className="text-[10px] font-bold text-teal-700 dark:text-teal-400 uppercase leading-relaxed">
              Pesan akan muncul di notifikasi dashboard siswa segera setelah dikirim.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 shrink-0 mt-6 border-t border-slate-100 dark:border-slate-700 pt-6">
          <button
            onClick={onClose}
            className="flex-1 py-4 bg-slate-100 dark:bg-slate-700 text-slate-400 font-black uppercase tracking-widest text-[11px] rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={handleSendAnnouncement}
            disabled={!announcementText.trim() || (targetType === 'Spesifik' && selectedStudentIds.length === 0)}
            className="flex-1 py-4 bg-orange-600 text-white font-black uppercase tracking-widest text-[11px] rounded-2xl shadow-lg shadow-orange-600/20 hover:bg-orange-700 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
          >
            Kirim Sekarang <Send size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
