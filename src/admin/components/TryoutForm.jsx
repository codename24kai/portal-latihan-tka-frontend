import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  FileText, 
  BookOpen, 
  Settings, 
  Save, 
  X, 
  ChevronRight, 
  ChevronLeft,
  CheckCircle,
  AlertTriangle,
  Info,
  Globe,
  Shuffle,
  Eye
} from 'lucide-react';
import { SUBJECTS } from '../../constants/subjects';
import ConfirmDialog from '../../components/ConfirmDialog';

export default function TryoutForm({ onClose, onSave }) {
  const [step, setStep] = useState(1);
  const [isDirty, setIsDirty] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    subject: 'Matematika',
    duration: 90,
    questionCount: 40,
    startDate: '',
    endDate: '',
    instructions: '',
    randomize: true,
    showAnalysis: true,
    selectionMethod: 'auto' // 'auto' | 'manual'
  });

  const [errors, setErrors] = useState({});

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Nama tryout wajib diisi';
    if (formData.duration < 5 || formData.duration > 300) newErrors.duration = 'Durasi harus 5 - 300 menit';
    if (formData.questionCount < 1 || formData.questionCount > 100) newErrors.questionCount = 'Jumlah soal harus 1 - 100';
    if (!formData.startDate) newErrors.startDate = 'Jadwal mulai wajib diisi';
    if (!formData.endDate) newErrors.endDate = 'Jadwal berakhir wajib diisi';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep1()) setStep(2);
  };

  const handleBack = () => setStep(1);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }));
  };

  const handleCancelClick = () => {
    if (isDirty) {
      setShowCancelConfirm(true);
    } else {
      onClose();
    }
  };

  const handleSubmit = (status) => {
    // status: 'active' | 'draft'
    onSave({ ...formData, status });
  };

  return (
    <div className="relative">
      {/* Progress Tracker */}
      <div className="flex items-center justify-between mb-8 px-4">
         <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all ${step === 1 ? 'bg-indigo-600 text-white shadow-glow-sm' : 'bg-emerald-500 text-white'}`}>
               {step > 1 ? <CheckCircle size={16} /> : '1'}
            </div>
            <span className={`text-[10px] font-black uppercase tracking-widest ${step === 1 ? 'text-slate-800 dark:text-white' : 'text-slate-400'}`}>Konfigurasi Dasar</span>
         </div>
         <div className="flex-1 h-px bg-slate-100 dark:bg-slate-700 mx-4" />
         <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all ${step === 2 ? 'bg-indigo-600 text-white shadow-glow-sm' : 'bg-slate-100 dark:bg-slate-700 text-slate-400'}`}>
               2
            </div>
            <span className={`text-[10px] font-black uppercase tracking-widest ${step === 2 ? 'text-slate-800 dark:text-white' : 'text-slate-400'}`}>Pengaturan & Soal</span>
         </div>
      </div>

      <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
        {step === 1 ? (
          <div className="animate-in slide-in-from-left-4 duration-300 space-y-5">
            {/* Name */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nama Tryout <span className="text-rose-500">*</span></label>
              <div className="relative group">
                <BookOpen size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                <input 
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="Contoh: Tryout Matematika Tahap 1"
                  className={`w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-900 border ${errors.name ? 'border-rose-300' : 'border-slate-100 dark:border-slate-700'} rounded-2xl focus:ring-4 focus:ring-indigo-500/10 outline-none font-bold text-sm dark:text-white transition-all`}
                />
              </div>
              {errors.name && <p className="text-[9px] font-bold text-rose-500 ml-1 uppercase">{errors.name}</p>}
            </div>

            {/* Subject */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mata Pelajaran</label>
              <div className="grid grid-cols-2 gap-3">
                {SUBJECTS.filter(s => s.name !== 'Semua Mapel').map(sub => (
                  <button
                    key={sub.name}
                    type="button"
                    onClick={() => handleChange('subject', sub.name)}
                    className={`flex items-center gap-3 p-3 rounded-2xl border transition-all ${formData.subject === sub.name ? 'bg-indigo-50 border-indigo-200 dark:bg-indigo-900/30 dark:border-indigo-500/30' : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-700 hover:border-slate-200'}`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${formData.subject === sub.name ? 'bg-indigo-600 text-white' : 'bg-slate-50 dark:bg-slate-800 text-slate-400'}`}>
                       <Globe size={16} />
                    </div>
                    <span className={`text-[10px] font-black uppercase tracking-tight ${formData.subject === sub.name ? 'text-indigo-700 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400'}`}>{sub.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Duration & Questions */}
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Durasi (Menit)</label>
                  <div className="relative">
                    <Clock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      type="number"
                      value={formData.duration}
                      onChange={(e) => handleChange('duration', parseInt(e.target.value))}
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 outline-none font-bold text-sm dark:text-white"
                    />
                  </div>
                  {errors.duration && <p className="text-[9px] font-bold text-rose-500 ml-1 uppercase">{errors.duration}</p>}
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Jumlah Soal</label>
                  <div className="relative">
                    <FileText size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      type="number"
                      value={formData.questionCount}
                      onChange={(e) => handleChange('questionCount', parseInt(e.target.value))}
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 outline-none font-bold text-sm dark:text-white"
                    />
                  </div>
                  {errors.questionCount && <p className="text-[9px] font-bold text-rose-500 ml-1 uppercase">{errors.questionCount}</p>}
               </div>
            </div>

            {/* Schedule */}
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1">
                    Jadwal Mulai <span className="text-rose-500">*</span>
                  </label>
                  <input 
                    type="datetime-local"
                    value={formData.startDate}
                    onChange={(e) => handleChange('startDate', e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 outline-none font-bold text-xs dark:text-white"
                  />
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1">
                    Jadwal Berakhir <span className="text-rose-500">*</span>
                  </label>
                  <input 
                    type="datetime-local"
                    value={formData.endDate}
                    onChange={(e) => handleChange('endDate', e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 outline-none font-bold text-xs dark:text-white"
                  />
               </div>
            </div>

            {/* Instructions */}
            <div className="space-y-2">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Instruksi Untuk Siswa</label>
               <textarea 
                  value={formData.instructions}
                  onChange={(e) => handleChange('instructions', e.target.value)}
                  placeholder="Instruksi ini akan dibaca siswa sebelum mulai..."
                  rows={3}
                  className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 outline-none font-bold text-xs dark:text-white resize-none"
               />
            </div>
          </div>
        ) : (
          <div className="animate-in slide-in-from-right-4 duration-300 space-y-6">
            <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-100 dark:border-slate-700 space-y-4">
               <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-800 dark:text-white uppercase tracking-widest">Acak Urutan Soal</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">Posisi soal berbeda untuk tiap siswa</p>
                  </div>
                  <button 
                    type="button"
                    onClick={() => handleChange('randomize', !formData.randomize)}
                    className={`w-12 h-6 rounded-full p-1 transition-all ${formData.randomize ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700'}`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-all ${formData.randomize ? 'translate-x-6' : 'translate-x-0'}`} />
                  </button>
               </div>

               <div className="h-px bg-slate-100 dark:bg-slate-700" />

               <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-800 dark:text-white uppercase tracking-widest">Siswa Lihat Pembahasan</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">Izinkan evaluasi mandiri setelah selesai</p>
                  </div>
                  <button 
                    type="button"
                    onClick={() => handleChange('showAnalysis', !formData.showAnalysis)}
                    className={`w-12 h-6 rounded-full p-1 transition-all ${formData.showAnalysis ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700'}`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-all ${formData.showAnalysis ? 'translate-x-6' : 'translate-x-0'}`} />
                  </button>
               </div>
            </div>

            <div className="space-y-3">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Metode Pengambilan Soal</label>
               <div className="grid grid-cols-1 gap-3">
                  <button 
                    type="button"
                    onClick={() => handleChange('selectionMethod', 'auto')}
                    className={`p-4 rounded-2xl border flex items-center justify-between group transition-all ${formData.selectionMethod === 'auto' ? 'bg-indigo-50 border-indigo-200 dark:bg-indigo-900/30 dark:border-indigo-500/30' : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700'}`}
                  >
                    <div className="flex items-center gap-4">
                       <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${formData.selectionMethod === 'auto' ? 'bg-indigo-600 text-white shadow-glow-sm' : 'bg-slate-50 dark:bg-slate-900 text-slate-400'}`}>
                          <Shuffle size={18} />
                       </div>
                       <div className="text-left">
                          <p className={`text-[11px] font-black uppercase tracking-widest ${formData.selectionMethod === 'auto' ? 'text-indigo-700 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-300'}`}>Pilih Acak Otomatis</p>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight mt-0.5">Sistem akan memilih soal terbaik</p>
                       </div>
                    </div>
                    {formData.selectionMethod === 'auto' && <CheckCircle size={18} className="text-indigo-600 dark:text-indigo-400" />}
                  </button>

                  <button 
                    type="button"
                    onClick={() => handleChange('selectionMethod', 'manual')}
                    className={`p-4 rounded-2xl border flex items-center justify-between group transition-all ${formData.selectionMethod === 'manual' ? 'bg-indigo-50 border-indigo-200 dark:bg-indigo-900/30 dark:border-indigo-500/30' : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700'}`}
                  >
                    <div className="flex items-center gap-4">
                       <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${formData.selectionMethod === 'manual' ? 'bg-indigo-600 text-white shadow-glow-sm' : 'bg-slate-50 dark:bg-slate-900 text-slate-400'}`}>
                          <Settings size={18} />
                       </div>
                       <div className="text-left">
                          <p className={`text-[11px] font-black uppercase tracking-widest ${formData.selectionMethod === 'manual' ? 'text-indigo-700 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-300'}`}>Pilih Soal Manual</p>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight mt-0.5">Tentukan soal spesifik dari bank soal</p>
                       </div>
                    </div>
                    {formData.selectionMethod === 'manual' && <CheckCircle size={18} className="text-indigo-600 dark:text-indigo-400" />}
                  </button>
               </div>
            </div>

            <div className="bg-indigo-50/50 dark:bg-indigo-900/10 p-4 rounded-2xl flex gap-3">
               <Info size={16} className="text-indigo-600 shrink-0" />
               <p className="text-[9px] font-medium text-indigo-700 dark:text-indigo-300 leading-relaxed italic">
                  Dengan metode "Otomatis", sistem akan menarik {formData.questionCount} soal {formData.subject} secara acak yang tersedia di Bank Soal.
               </p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-4 pt-10 border-t border-slate-50 dark:border-slate-700">
          <button 
            type="button"
            onClick={handleCancelClick}
            className="px-6 py-4 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-slate-600 transition-all outline-none"
          >
            Batal
          </button>
          
          <div className="flex-1" />

          {step === 2 && (
            <button 
              type="button"
              onClick={() => handleSubmit('draft')}
              className="px-8 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-700 transition-all active:scale-95 outline-none shadow-sm flex items-center gap-2"
            >
              Simpan Draft
            </button>
          )}

          {step === 1 ? (
             <button 
               type="button"
               onClick={handleNext}
               className="px-10 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-indigo-600/20 active:scale-95 transition-all outline-none flex items-center gap-2"
             >
               Lanjut <ChevronRight size={16} />
             </button>
          ) : (
            <div className="flex items-center gap-2">
               <button 
                 type="button"
                 onClick={handleBack}
                 className="p-4 text-slate-400 hover:text-indigo-600 transition-colors"
               >
                 <ChevronLeft size={18} />
               </button>
               <button 
                 type="button"
                 onClick={() => handleSubmit('active')}
                 className="px-10 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-emerald-600/20 active:scale-95 transition-all outline-none flex items-center gap-2"
               >
                 <Save size={16} /> Rilis Tryout
               </button>
            </div>
          )}
        </div>
      </form>

      <ConfirmDialog 
        isOpen={showCancelConfirm}
        title="Batalkan Perubahan?"
        message="Anda memiliki perubahan yang belum disimpan. Yakin ingin keluar?"
        confirmLabel="Ya, Batalkan"
        cancelLabel="Kembali"
        variant="warning"
        onConfirm={onClose}
        onCancel={() => setShowCancelConfirm(false)}
      />
    </div>
  );
}
