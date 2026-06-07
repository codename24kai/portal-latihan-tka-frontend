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
  ChevronRight,
  Shuffle
} from 'lucide-react';
import toast from 'react-hot-toast';
import { mockQuestionBank } from '@/data/mockSoal';
import { mockSurveyDefinitions } from '@/data/mockSurvei';
import Dropdown from '@/komponen/ui/Dropdown';
import Badge from '@/komponen/ui/Badge';
import DataTable from '@/komponen/ui/TabelData';
import ConfirmDialog from '@/komponen/ui/DialogKonfirmasi';
import MathRenderer from '@/komponen/ui/RendererMatematika';

/**
 * AddTryout Page — Advanced Session Creator
 * Refactored for vertical flow, auto-randomization, and used/unused status indicators.
 */
export default function AddTryout() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    title: '',
    type: 'simulasi tka',
    subject: 'Matematika',
    duration: '90',
    startDate: '',
    endDate: '',
    questionCount: '30',
    selectionMethod: 'auto', // 'auto' | 'manual'
    attachedSurveyId: 'none'
  });

  // Master confirmed config
  const [confirmedConfig, setConfirmedConfig] = useState({
    type: 'simulasi tka',
    subject: 'Matematika',
    questionCount: 30,
    duration: 90,
    selectionMethod: 'auto'
  });

  const surveyOptions = useMemo(() => {
    const list = [{ value: 'none', label: 'Tidak Ada Survei' }];
    (mockSurveyDefinitions || []).forEach(s => {
      list.push({ value: s.id, label: s.title });
    });
    return list;
  }, [mockSurveyDefinitions.length]);

  // Manual Selection filter (difficulty filter removed)
  const [manualFilters, setManualFilters] = useState({ search: '' });
  const [selectedQuestionIds, setSelectedQuestionIds] = useState([]);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

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
      type: formData?.type,
      subject: formData?.subject,
      questionCount: qCount,
      duration: dur,
      selectionMethod: formData?.selectionMethod
    });

    // Reset selected questions when config is applied/re-applied
    setSelectedQuestionIds([]);
    toast.success('Konfigurasi diterapkan!');
  };

  // Reset selection when confirmed subject or selection method changes
  useEffect(() => {
    setSelectedQuestionIds([]);
  }, [confirmedConfig?.subject, confirmedConfig?.selectionMethod]);

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

  // Auto Randomize Handler
  const handleAutoRandomize = () => {
    const targetCount = confirmedConfig?.questionCount;
    if (!targetCount || targetCount <= 0) {
      toast.error('Terapkan konfigurasi terlebih dahulu!');
      return;
    }

    if (availableQuestions.length < targetCount) {
      toast.error(`Stok Bank Soal tidak mencukupi! Hanya tersedia ${availableQuestions.length} soal.`);
      return;
    }

    // Shuffle and pick targetCount questions
    const shuffled = [...availableQuestions].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, targetCount).map(q => q.id);
    setSelectedQuestionIds(selected);
    toast.success(`Berhasil mengacak ${targetCount} soal secara otomatis!`);
  };

  // Validation Logic
  const currentTotalDistribution = selectedQuestionIds.length;
  const isValid = currentTotalDistribution === confirmedConfig?.questionCount;
  const isOver = currentTotalDistribution > confirmedConfig?.questionCount;
  const isShort = currentTotalDistribution < confirmedConfig?.questionCount;

  const handleSave = (status) => {
    if (!formData?.title) return toast.error('Judul simulasi harus diisi!');
    if (!isValid) return toast.error('Jumlah soal belum sesuai dengan target!');
    if (!formData?.startDate || !formData?.endDate) return toast.error('Jadwal harus diisi!');

    if (isEdit) {
      toast.success('Data simulasi berhasil diperbarui!');
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
    toast.success(`Simulasi TKA berhasil disimpan sebagai ${status === 'draft' ? 'Draft' : 'Rilisan'}`);
    setIsConfirmOpen(false);
    setTimeout(() => navigate('/admin/tryout'), 1500);
  };

  // Get details of randomized questions
  const randomizedQuestionsList = useMemo(() => {
    return availableQuestions.filter(q => selectedQuestionIds.includes(q.id));
  }, [availableQuestions, selectedQuestionIds]);

  return (
    <div className="animate-fade-in space-y-8 pb-32 max-w-5xl mx-auto">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/admin/tryout')} className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:text-indigo-600 shadow-sm transition-all">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic">
              {isEdit ? 'Edit' : 'Buat Sesi'} <span className="text-indigo-600">Simulasi TKA</span>
            </h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
              {isEdit ? `Memperbarui sesi ID: #${id}` : 'Latihan akademik berstandar nasional'}
            </p>
          </div>
        </div>
      </div>

      {/* VERTICAL FLOW FORM */}
      <div className="space-y-8">

        {/* STEP 1: INFORMASI DASAR */}
        <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-10 border border-slate-100 dark:border-slate-700 space-y-8 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Settings size={60} />
          </div>

          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600">
              <Layers size={20} />
            </div>
            <div>
              <span className="text-[9px] font-black uppercase text-indigo-500 tracking-wider">Langkah 1 dari 3</span>
              <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-widest">Informasi Dasar & Konfigurasi</h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nama Simulasi TKA</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Contoh: Simulasi TKA Nasional 1"
                className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl text-xs font-bold outline-none focus:ring-4 focus:ring-indigo-500/10 dark:text-white transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Filter Materi (Mata Pelajaran)</label>
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

            <div className="space-y-2 md:col-span-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Integrasi Survei Pendukung</label>
              <Dropdown
                value={formData.attachedSurveyId || 'none'}
                onChange={(val) => setFormData({ ...formData, attachedSurveyId: val })}
                options={surveyOptions}
                fullWidth
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Target Soal (Butir)</label>
              <input
                type="number"
                value={formData.questionCount}
                onChange={(e) => setFormData({ ...formData, questionCount: e.target.value })}
                className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl text-sm font-black outline-none dark:text-white"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 text-slate-400">Durasi (Menit)</label>
              <input
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl text-sm font-black outline-none dark:text-white"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mulai Ujian</label>
              <input type="datetime-local" value={formData.startDate} onChange={e => setFormData({ ...formData, startDate: e.target.value })} className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl text-[10px] font-bold outline-none dark:text-white" />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Selesai Ujian</label>
              <input type="datetime-local" value={formData.endDate} onChange={e => setFormData({ ...formData, endDate: e.target.value })} className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl text-[10px] font-bold outline-none dark:text-white" />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              onClick={handleApplyConfig}
              className="py-4 px-8 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl flex items-center justify-center gap-3 transition-all shadow-xl shadow-indigo-600/20 active:scale-95 group"
            >
              <span className="text-xs font-black uppercase tracking-[0.2em]">Terapkan Konfigurasi</span>
              <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* STEP 2: METODE PENGAMBILAN SOAL */}
        <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-10 border border-slate-100 dark:border-slate-700 space-y-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center text-emerald-600">
                <ShieldCheck size={20} />
              </div>
              <div>
                <span className="text-[9px] font-black uppercase text-emerald-500 tracking-wider">Langkah 2 dari 3</span>
                <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-widest">Metode Pengambilan Soal</h3>
              </div>
            </div>

            <div className="flex bg-slate-100 dark:bg-slate-900/50 p-1 rounded-2xl border border-slate-200 dark:border-slate-700 self-start md:self-auto">
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
        </div>

        {/* STEP 3: KONFIGURASI SOAL */}
        <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-10 border border-slate-100 dark:border-slate-700 space-y-8 shadow-sm min-h-[400px]">
          <div className="flex items-center gap-4 border-b border-slate-50 dark:border-slate-700/50 pb-6">
            <div className="w-10 h-10 bg-amber-50 dark:bg-amber-900/30 rounded-xl flex items-center justify-center text-amber-600">
              <FileText size={20} />
            </div>
            <div>
              <span className="text-[9px] font-black uppercase text-amber-500 tracking-wider">Langkah 3 dari 3</span>
              <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-widest">Daftar & Pemilihan Soal</h3>
            </div>
          </div>

          {formData?.selectionMethod === 'auto' ? (
            <div className="space-y-8 animate-fade-in">
              <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                  <h4 className="text-xs font-black uppercase tracking-widest text-slate-700 dark:text-slate-300">Pengacakan Soal Otomatis</h4>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Sistem akan memilih secara acak dari total {availableQuestions.length} stok soal {confirmedConfig.subject}.</p>
                </div>
                <button
                  onClick={handleAutoRandomize}
                  className="px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md shadow-indigo-600/10 text-xs font-black uppercase tracking-wider"
                >
                  <Shuffle size={16} /> Acak Soal Otomatis
                </button>
              </div>

              {/* VALIDATION STATUS */}
              <div className={`p-6 rounded-3xl border-2 flex items-center justify-between transition-all ${isValid ? 'bg-emerald-50/50 border-emerald-100 text-emerald-600' :
                isOver ? 'bg-rose-50/50 border-rose-100 text-rose-600' :
                  'bg-amber-50/50 border-amber-100 text-amber-600'
                }`}>
                <div className="flex items-center gap-4">
                  {isValid ? <CheckCircle2 size={24} /> : <AlertTriangle size={24} />}
                  <span className="text-sm font-black uppercase tracking-tight">
                    {isValid ? 'Acak otomatis berhasil & jumlah sesuai!' :
                      isOver ? `Terlalu banyak (${currentTotalDistribution}/${confirmedConfig.questionCount})` :
                        `Soal belum diacak atau belum cukup (${currentTotalDistribution}/${confirmedConfig.questionCount})`}
                  </span>
                </div>
                <div className="text-[10px] font-black uppercase opacity-60 italic">Target: {confirmedConfig.questionCount} Butir</div>
              </div>

              {randomizedQuestionsList.length > 0 && (
                <div className="space-y-4">
                  <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Pratinjau Soal Hasil Acakan:</h5>
                  <DataTable
                    headers={[{ label: 'No', align: 'center' }, { label: 'Deskripsi Soal' }, { label: 'Level', align: 'center' }]}
                    data={randomizedQuestionsList}
                    rowsPerPage={5}
                    renderRow={(q, idx) => (
                      <tr key={q.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-4 text-center text-xs font-bold text-slate-500">{idx + 1}</td>
                        <td className="py-4 text-xs font-bold text-slate-700"><MathRenderer text={q.text} /></td>
                        <td className="py-4 text-center"><Badge text={q.difficulty} variant={q.difficulty === 'Mudah' ? 'Success' : 'Danger'} /></td>
                      </tr>
                    )}
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6 animate-fade-in">
              <div className={`p-4 rounded-2xl border-2 flex items-center justify-between ${isValid ? 'bg-emerald-50/50 border-emerald-100 text-emerald-600' : 'bg-amber-50/50 border-amber-100 text-amber-600'
                }`}>
                <span className="text-xs font-black uppercase">Pilih Manual Soal ({selectedQuestionIds.length}/{confirmedConfig.questionCount})</span>
              </div>

              <div className="flex gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                  <input type="text" placeholder="Cari soal..." value={manualFilters.search} onChange={e => setManualFilters({ ...manualFilters, search: e.target.value })} className="w-full pl-14 pr-5 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl text-xs font-bold outline-none" />
                </div>
              </div>

              <DataTable
                headers={[
                  { label: 'Pilih', align: 'center' },
                  { label: 'Deskripsi Soal' },
                  { label: 'Status Penggunaan', align: 'center' },
                  { label: 'Level', align: 'center' }
                ]}
                data={availableQuestions?.filter(q =>
                  q.text.toLowerCase().includes(manualFilters.search.toLowerCase())
                )}
                rowsPerPage={5}
                renderRow={q => (
                  <tr key={q.id} onClick={() => setSelectedQuestionIds(prev => prev.includes(q.id) ? prev.filter(id => id !== q.id) : [...prev, q.id])} className={`cursor-pointer transition-colors ${selectedQuestionIds.includes(q.id) ? 'bg-indigo-50/50' : 'hover:bg-slate-50'}`}>
                    <td className="py-4 text-center">
                      <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all ${selectedQuestionIds.includes(q.id) ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-200'}`}>
                        {selectedQuestionIds.includes(q.id) && <CheckCircle2 size={12} />}
                      </div>
                    </td>
                    <td className="py-4 text-xs font-bold text-slate-700"><MathRenderer text={q.text} /></td>
                    <td className="py-4 text-center">
                      <Badge
                        text={q.usedIn ? 'Sudah Pernah Digunakan' : 'Belum Pernah Digunakan'}
                        variant={q.usedIn ? 'Neutral' : 'Success'}
                      />
                    </td>
                    <td className="py-4 text-center"><Badge text={q.difficulty} variant={q.difficulty === 'Mudah' ? 'Success' : 'Danger'} /></td>
                  </tr>
                )}
              />
            </div>
          )}
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
            <div>
              <span className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1">Jenis Latihan</span>
              <Badge text={confirmedConfig?.type} variant="Success" className="px-6 py-2 uppercase" />
            </div>
          </div>

          <div className="flex items-center gap-6 relative z-10 w-full md:w-auto">
            <button onClick={() => navigate('/admin/simulasi')} className="text-slate-500 hover:text-white font-black text-xs uppercase tracking-widest px-6 transition-all">Batal</button>
            <div className="flex gap-4 w-full md:w-auto">
              <button onClick={() => handleSave('draft')} className="flex-1 md:flex-none px-10 py-5 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg transition-all border border-white/5">Draft</button>
              <button
                disabled={!isValid}
                onClick={() => handleSave('active')}
                className={`flex-1 md:flex-none px-12 py-5 rounded-2xl text-xs font-black uppercase tracking-widest shadow-2xl transition-all ${isValid
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
        title="Publikasikan Simulasi TKA?"
        message="Siswa akan melihat sesi ini di dashboard mereka. Pastikan data sudah benar."
        confirmLabel="Ya, Rilis Sekarang"
        cancelLabel="Cek Kembali"
        onConfirm={() => executeSave('active')}
        onCancel={() => setIsConfirmOpen(false)}
      />
    </div>
  );
}
