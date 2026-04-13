import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  Send,
  Plus,
  Trash2,
  Clock,
  Calendar,
  Layers,
  Search,
  CheckCircle2,
  AlertTriangle,
  FileText,
  AlertCircle,
  Settings,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import toast from 'react-hot-toast';
import { mockQuestionBank } from './QuestionBank';
import Dropdown from '../../components/ui/Dropdown';
import Badge from '../../components/ui/Badge';
import DataTable from '../../components/ui/DataTable';
import ConfirmDialog from '../../components/ui/ConfirmDialog';

/**
 * AddTryout Page — Advanced Session Creator
 * Refactored for Explicit Sync & Validation to ensure stability and UX clarity.
 */
export default function AddTryout() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  // 1. DRAFT STATE (Left Panel)
  const [formData, setFormData] = useState({
    title: '',
    subject: 'Matematika',
    duration: '90',
    startDate: '',
    endDate: '',
    questionCount: '30',
    selectionMethod: 'auto' // 'auto' | 'manual'
  });

  // 2. CONFIRMED CONFIG (Master state for the whole page)
  const [confirmedConfig, setConfirmedConfig] = useState({
    subject: 'Matematika',
    questionCount: 30,
    duration: 90,
    selectionMethod: 'auto'
  });

  // 3. DISTRIBUTION STATE (Right Panel - Stored as strings for safer typing)
  const [autoDistribution, setAutoDistribution] = useState({
    Mudah: '10',
    Sedang: '10',
    Sulit: '10'
  });

  // Manual Selection
  const [manualFilters, setManualFilters] = useState({ search: '', difficulty: 'Semua' });
  const [selectedQuestionIds, setSelectedQuestionIds] = useState([]);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  // Sync selection method draft to confirmed immediately? 
  // No, let's keep it in Draft too for consistency.
  
  const handleApplyConfig = () => {
    const qCount = parseInt(formData?.questionCount) || 0;
    const dur = parseInt(formData?.duration) || 0;
    
    if (qCount < 1) {
       toast.error('Jumlah soal minimal 1!');
       return;
    }
    if (dur < 30) {
       toast.error('Durasi minimal 30 menit!');
       return;
    }

    setConfirmedConfig({
      subject: formData?.subject,
      questionCount: qCount,
      duration: dur,
      selectionMethod: formData?.selectionMethod
    });

    // Auto-redistribute on apply if in auto mode
    if (formData?.selectionMethod === 'auto') {
      const ideal = Math.floor(qCount / 3);
      const rem = qCount % 3;
      setAutoDistribution({
        Mudah: String(ideal + (rem > 0 ? 1 : 0)),
        Sedang: String(ideal + (rem > 1 ? 1 : 0)),
        Sulit: String(ideal)
      });
    }

    toast.success('Konfigurasi diterapkan!');
  };

  // Reset selection when confirmed subject changes
  useEffect(() => {
    setSelectedQuestionIds([]);
  }, [confirmedConfig?.subject]);

  // Available Bank Questions calculation
  const availableQuestions = useMemo(() => {
    return mockQuestionBank?.filter(q => 
      q?.subject === confirmedConfig?.subject && 
      q?.category === 'Akademik'
    ) || [];
  }, [confirmedConfig?.subject]);

  const difficultyStock = useMemo(() => {
    const counts = { Mudah: 0, Sedang: 0, Sulit: 0 };
    availableQuestions.forEach(q => {
      if (counts[q?.difficulty] !== undefined) counts[q?.difficulty]++;
    });
    return counts;
  }, [availableQuestions]);

  const totalStock = useMemo(() => 
    Object.values(difficultyStock).reduce((a, b) => a + b, 0), [difficultyStock]
  );

  // Validation Logic
  const currentTotalDistribution = useMemo(() => {
    if (confirmedConfig?.selectionMethod === 'auto') {
      return Object.values(autoDistribution).reduce((a, b) => a + (parseInt(b) || 0), 0);
    }
    return selectedQuestionIds.length;
  }, [autoDistribution, selectedQuestionIds, confirmedConfig?.selectionMethod]);

  const isValid = currentTotalDistribution === confirmedConfig?.questionCount;
  const isOver = currentTotalDistribution > confirmedConfig?.questionCount;
  const isShort = currentTotalDistribution < confirmedConfig?.questionCount;

  const handleSave = (status) => {
    if (!formData?.title) return toast.error('Judul tryout harus diisi!');
    if (!isValid) return toast.error('Jumlah soal belum sesuai dengan target!');
    if (!formData?.startDate || !formData?.endDate) return toast.error('Jadwal harus diisi!');
    
    // Check stock for auto mode
    if (confirmedConfig?.selectionMethod === 'auto') {
       const oos = Object.entries(autoDistribution).some(([lvl, val]) => (parseInt(val) || 0) > difficultyStock[lvl]);
       if (oos) return toast.error('Stok Bank Soal tidak mencukupi!');
    }

    if (isEdit) {
       toast.success('Data tryout berhasil diperbarui!');
       setTimeout(() => navigate('/admin/tryout'), 1500);
       return;
    }

    if (status === 'active') {
      setIsConfirmOpen(true);
      return;
    }
    executeSave('draft');
  };

  const executeSave = (status) => {
    toast.success(`Tryout berhasil disimpan sebagai ${status === 'draft' ? 'Draft' : 'Rilisan'}`);
    setIsConfirmOpen(false);
    setTimeout(() => navigate('/admin/tryout'), 1500);
  };

  return (
    <div className="animate-fade-in space-y-8 pb-32">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/admin/tryout')} className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:text-indigo-600 shadow-sm transition-all">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic">
              {isEdit ? 'Edit' : 'Create'} <span className="text-indigo-600">Tryout</span> Session
            </h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
              {isEdit ? `Memperbarui sesi ID: #${id}` : 'Latihan akademik berstandar nasional'}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT PANEL: CONFIGURATION */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-10 border border-slate-100 dark:border-slate-700 space-y-8 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Settings size={60} />
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600">
                <Layers size={20} />
              </div>
              <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-widest">Informasi Dasar</h3>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nama Tryout</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Contoh: Tryout Nasional 1"
                  className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl text-xs font-bold outline-none focus:ring-4 focus:ring-indigo-500/10 dark:text-white transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Filter Materi</label>
                <Dropdown
                  value={formData.subject}
                  onChange={(val) => setFormData({ ...formData, subject: val })}
                  options={[
                    { value: 'Matematika', label: 'Matematika' },
                    { value: 'Bahasa Indonesia', label: 'Bahasa Indonesia' }
                  ]}
                  fullWidth
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Target Soal</label>
                  <input
                    type="number"
                    value={formData.questionCount}
                    onChange={(e) => setFormData({ ...formData, questionCount: e.target.value })}
                    className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl text-sm font-black outline-none dark:text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 text-slate-400">Durasi (m)</label>
                  <input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl text-sm font-black outline-none dark:text-white"
                  />
                </div>
              </div>

              {/* APPLY BUTTON */}
              <button
                onClick={handleApplyConfig}
                className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl flex items-center justify-center gap-3 transition-all shadow-xl shadow-indigo-600/20 active:scale-95 group"
              >
                <span className="text-xs font-black uppercase tracking-[0.2em]">Terapkan Konfigurasi</span>
                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>

              {/* DATE FIELDS */}
              <div className="pt-6 border-t border-slate-50 dark:border-slate-700/50 space-y-4">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mulai Ujian</label>
                    <input type="datetime-local" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl text-[10px] font-bold outline-none dark:text-white" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Selesai Ujian</label>
                    <input type="datetime-local" value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl text-[10px] font-bold outline-none dark:text-white" />
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: DISTRIBUTION */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white dark:bg-slate-800 rounded-[3rem] p-10 border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col gap-10 min-h-[700px]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center text-emerald-600">
                  <ShieldCheck size={20} />
                </div>
                <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-widest">Pengaturan Soal</h3>
              </div>

              <div className="flex bg-slate-100 dark:bg-slate-900/50 p-1 rounded-2xl border border-slate-200 dark:border-slate-700">
                {['auto', 'manual'].map(method => (
                  <button
                    key={method}
                    onClick={() => setFormData({ ...formData, selectionMethod: method })}
                    className={`px-8 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${formData.selectionMethod === method
                      ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20'
                      : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    {method === 'auto' ? 'Acak Otomatis' : 'Pilih Manual'}
                  </button>
                ))}
              </div>
            </div>

            {formData?.selectionMethod === 'auto' ? (
              <div className="flex-1 space-y-10">
                {/* VALIDATION STATUS */}
                <div className={`p-6 rounded-3xl border-2 flex items-center justify-between transition-all ${
                  isValid ? 'bg-emerald-50/50 border-emerald-100 text-emerald-600' : 
                  isOver ? 'bg-rose-50/50 border-rose-100 text-rose-600' : 
                  'bg-amber-50/50 border-amber-100 text-amber-600'
                }`}>
                   <div className="flex items-center gap-4">
                      {isValid ? <CheckCircle2 size={24} /> : <AlertTriangle size={24} />}
                      <span className="text-sm font-black uppercase tracking-tight">
                         {isValid ? 'Distribusi soal sudah sesuai!' : 
                          isOver ? `Terlalu banyak (${currentTotalDistribution}/${confirmedConfig.questionCount})` : 
                          `Belum cukup (${currentTotalDistribution}/${confirmedConfig.questionCount})`}
                      </span>
                   </div>
                   <div className="text-[10px] font-black uppercase opacity-60 italic">Target: {confirmedConfig.questionCount} Butir</div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {['Mudah', 'Sedang', 'Sulit'].map(level => (
                    <div key={level} className="bg-slate-50 dark:bg-slate-900/50 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 space-y-6 group hover:border-indigo-200 transition-all">
                       <div className="flex justify-between items-center">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{level}</span>
                          <Badge text={`Stok: ${difficultyStock[level]}`} variant="Neutral" className="text-[8px] opacity-60" />
                       </div>
                       <input
                         type="number"
                         value={autoDistribution[level]}
                         onChange={e => setAutoDistribution({...autoDistribution, [level]: e.target.value})}
                         className="w-full bg-transparent text-4xl font-black text-slate-800 dark:text-white outline-none italic"
                       />
                       <p className="text-[9px] font-bold text-slate-400 uppercase italic">Assign otomatis</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
                <div className="flex-1 space-y-6">
                  <div className={`p-4 rounded-2xl border-2 flex items-center justify-between ${
                    isValid ? 'bg-emerald-50/50 border-emerald-100 text-emerald-600' : 'bg-amber-50/50 border-amber-100 text-amber-600'
                  }`}>
                    <span className="text-xs font-black uppercase">Pilih Manual Soal ({selectedQuestionIds.length}/{confirmedConfig.questionCount})</span>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                      <input type="text" placeholder="Cari soal..." value={manualFilters.search} onChange={e => setManualFilters({...manualFilters, search: e.target.value})} className="w-full pl-14 pr-5 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl text-xs font-bold outline-none" />
                    </div>
                  </div>

                  <DataTable
                    headers={[{ label: 'Pilih', align: 'center' }, { label: 'Deskripsi Soal' }, { label: 'Level', align: 'center' }]}
                    data={availableQuestions?.filter(q => q.text.toLowerCase().includes(manualFilters.search.toLowerCase()))}
                    rowsPerPage={5}
                    renderRow={q => (
                      <tr key={q.id} onClick={() => setSelectedQuestionIds(prev => prev.includes(q.id) ? prev.filter(id => id !== q.id) : [...prev, q.id])} className={`cursor-pointer transition-colors ${selectedQuestionIds.includes(q.id) ? 'bg-indigo-50/50' : 'hover:bg-slate-50'}`}>
                        <td className="py-4 text-center">
                           <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all ${selectedQuestionIds.includes(q.id) ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-200'}`}>
                              {selectedQuestionIds.includes(q.id) && <CheckCircle2 size={12} />}
                           </div>
                        </td>
                        <td className="py-4 text-xs font-bold text-slate-700">{q.text}</td>
                        <td className="py-4 text-center"><Badge text={q.difficulty} variant={q.difficulty === 'Mudah' ? 'Success' : 'Danger'} /></td>
                      </tr>
                    )}
                  />
                </div>
            )}
          </div>
        </div>
      </div>

      {/* SUMMARY BAR */}
      <div className="w-full">
         <div className="bg-slate-900 rounded-[2.5rem] p-8 md:p-12 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 border-t-4 border-indigo-500 relative overflow-hidden">
            <div className="flex flex-wrap gap-12 relative z-10">
               <div>
                  <span className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Target Soal</span>
                  <div className="flex items-end gap-2 text-white">
                    <span className="text-5xl font-black italic leading-none">{confirmedConfig?.questionCount || 0}</span>
                    <span className="text-[10px] font-black uppercase text-slate-500 mb-1">Butir</span>
                  </div>
               </div>
               <div>
                  <span className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1">Mata Pelajaran</span>
                  <Badge text={confirmedConfig?.subject} variant="Info" className="px-6 py-2" />
               </div>
            </div>

            <div className="flex items-center gap-6 relative z-10 w-full md:w-auto">
               <button onClick={() => navigate('/admin/tryout')} className="text-slate-500 hover:text-white font-black text-xs uppercase tracking-widest px-6 transition-all">Batal</button>
               <div className="flex gap-4 w-full md:w-auto">
                 <button onClick={() => handleSave('draft')} className="flex-1 md:flex-none px-10 py-5 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg transition-all border border-white/5">Draft</button>
                 <button 
                   disabled={!isValid}
                   onClick={() => handleSave('active')} 
                   className={`flex-1 md:flex-none px-12 py-5 rounded-2xl text-xs font-black uppercase tracking-widest shadow-2xl transition-all ${
                     isValid 
                     ? 'bg-white text-slate-900 hover:bg-slate-50 active:scale-95' 
                     : 'bg-slate-800 text-slate-600 cursor-not-allowed opacity-50'
                   }`}
                 >
                   {isEdit ? 'Perbarui Sesi' : 'Simpan & Rilis'}
                 </button>
               </div>
            </div>
         </div>
      </div>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        variant="warning"
        title="Publikasikan Tryout?"
        message="Siswa akan melihat sesi ini di dashboard mereka. Pastikan data sudah benar."
        confirmLabel="Ya, Rilis Sekarang"
        cancelLabel="Cek Kembali"
        onConfirm={() => executeSave('active')}
        onCancel={() => setIsConfirmOpen(false)}
      />
    </div>
  );
}
