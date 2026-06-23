import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Heart,
  Globe,
  Settings,
  ShieldCheck,
  Zap,
  Search,
  CheckCircle2,
  FileText,
  Shuffle
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/utilitas/api';
import { mockSurveyDefinitions } from '@/data/mockSurvei';
import Dropdown from '@/komponen/ui/Dropdown';
import Badge from '@/komponen/ui/Badge';

// Mock Data Bank Soal Survei (Diperbanyak agar simulasi acak berjalan lancar)
const mockBankSoalSurvei = [
  { id: 'sq-1', text: 'Saya merasa nyaman saat berdiskusi dan bekerja sama dengan teman kelompok.', category: 'Karakter' },
  { id: 'sq-2', text: 'Saya selalu mengecek kembali pekerjaan atau tugas sebelum dikumpulkan ke guru.', category: 'Karakter' },
  { id: 'sq-3', text: 'Fasilitas di sekolah sangat mendukung kelancaran proses belajar saya setiap hari.', category: 'Sulingjar' },
  { id: 'sq-4', text: 'Guru memberikan kesempatan seluas-luasnya untuk bertanya jika ada materi yang belum dipahami.', category: 'Sulingjar' },
  { id: 'sq-5', text: 'Saya suka membantu teman yang kesulitan memahami pelajaran tanpa mengharapkan imbalan.', category: 'Karakter' },
  { id: 'sq-6', text: 'Lingkungan sekitar sekolah terasa aman dan bebas dari gangguan dari luar.', category: 'Sulingjar' },
  { id: 'sq-7', text: 'Saya berani mengakui kesalahan dan meminta maaf jika saya melanggar aturan.', category: 'Karakter' },
  { id: 'sq-8', text: 'Saya dapat membagi waktu antara belajar dan bermain dengan baik.', category: 'Karakter' },
  { id: 'sq-9', text: 'Koleksi buku di perpustakaan sekolah sangat lengkap dan menarik untuk dibaca.', category: 'Sulingjar' },
  { id: 'sq-10', text: 'Kegiatan ekstrakurikuler di sekolah sangat mendukung saya dalam mengembangkan bakat.', category: 'Sulingjar' },
];

export default function AddEditSurvey() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    id: '',
    title: '',
    description: '',
    type: 'survei_karakter', // 'survei_karakter' | 'sulingjar'
    color: 'from-rose-400 to-pink-600',
    icon: 'Heart',
    status: 'draft',
    selectionMethod: 'auto', // 'auto' | 'manual'
    questionCount: 5,
    selectedQuestions: []
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [previewQuestions, setPreviewQuestions] = useState([]); // State untuk menampung hasil acakan

  // Reset preview jika tipe survei, metode, atau jumlah soal diubah
  useEffect(() => {
    setPreviewQuestions([]);
  }, [formData.type, formData.selectionMethod, formData.questionCount]);

  // Load data if in edit mode
  useEffect(() => {
    if (isEdit) {
      const survey = mockSurveyDefinitions.find(s => s.id === id);
      if (survey) {
        setFormData({
          id: survey.id,
          title: survey.title,
          description: survey.description || '',
          type: survey.type || 'survei_karakter',
          color: survey.color || 'from-rose-400 to-pink-600',
          icon: survey.icon || 'Heart',
          status: survey.status || 'active',
          selectionMethod: survey.selectionMethod || 'auto',
          questionCount: survey.questionCount || 5,
          selectedQuestions: survey.selectedQuestions ? [...survey.selectedQuestions] : []
        });
      } else {
        toast.error('Data survei tidak ditemukan');
        navigate('/admin/survei');
      }
    }
  }, [id, isEdit, navigate]);

  // Filter bank soal berdasarkan tipe survei dan query pencarian (Untuk Manual)
  const availableQuestions = useMemo(() => {
    const targetCategory = formData.type === 'survei_karakter' ? 'Karakter' : 'Sulingjar';
    return mockBankSoalSurvei
      .filter(q => q.category === targetCategory)
      .filter(q => q.text.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [formData.type, searchQuery]);

  // Handle Generate Preview (Untuk Mode Acak Otomatis)
  const handleGeneratePreview = () => {
    const targetCategory = formData.type === 'survei_karakter' ? 'Karakter' : 'Sulingjar';
    const available = mockBankSoalSurvei.filter(q => q.category === targetCategory);

    if (formData.questionCount > available.length) {
      toast.error(`Gagal! Bank Soal ${targetCategory} saat ini hanya memiliki ${available.length} soal.`);
      return;
    }

    // Algoritma Acak Fisher-Yates (Sederhana)
    const shuffled = [...available].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, formData.questionCount);

    setPreviewQuestions(selected);
    toast.success('Berhasil mengacak soal! Silakan cek preview di bawah.');
  };

  // Handle Toggle Selection in Manual Mode
  const handleToggleQuestion = (qId) => {
    setFormData(prev => {
      const isSelected = prev.selectedQuestions.includes(qId);
      if (isSelected) {
        return { ...prev, selectedQuestions: prev.selectedQuestions.filter(id => id !== qId) };
      } else {
        return { ...prev, selectedQuestions: [...prev.selectedQuestions, qId] };
      }
    });
  };

  const handleSave = (status) => {
    if (!formData.title) {
      toast.error('Judul survei wajib diisi!');
      return;
    }

    if (formData.selectionMethod === 'auto' && (!formData.questionCount || formData.questionCount < 1)) {
      toast.error('Jumlah soal untuk acak otomatis minimal 1!');
      return;
    }
    if (formData.selectionMethod === 'manual' && formData.selectedQuestions.length === 0) {
      toast.error('Harap pilih minimal 1 soal secara manual!');
      return;
    }

    const pertanyaan = (formData.selectionMethod === 'auto' ? previewQuestions : availableQuestions.filter(q => formData.selectedQuestions.includes(q.id)))
      .map((q, index) => ({
        teks: q.text,
        jenis: 'pilihan_ganda',
        opsi: [
          { teks: 'Sangat Sesuai' },
          { teks: 'Sesuai' },
          { teks: 'Tidak Sesuai' },
          { teks: 'Sangat Tidak Sesuai' }
        ],
        urutan: index + 1
      }));

    const payload = {
      judul: formData.title,
      deskripsi: formData.description,
      status: status === 'active' ? 'aktif' : 'draft',
      pertanyaan: pertanyaan.length > 0 ? pertanyaan : [
        {
          teks: 'Contoh pernyataan survei',
          jenis: 'pilihan_ganda',
          opsi: [
            { teks: 'Sangat Sesuai' },
            { teks: 'Sesuai' },
            { teks: 'Tidak Sesuai' },
            { teks: 'Sangat Tidak Sesuai' }
          ],
          urutan: 1
        }
      ]
    };

    const request = isEdit
      ? api.put(`/admin/survei/${id}`, payload)
      : api.post('/admin/survei', payload);

    request
      .then(() => {
        toast.success(isEdit ? 'Survei berhasil diperbarui!' : 'Survei berhasil disimpan!');
        setTimeout(() => navigate('/admin/survei'), 1200);
      })
      .catch((error) => {
        console.error('Gagal menyimpan survei:', error);
        toast.error('Gagal menyimpan survei');
      });
  };

  return (
    <div className="animate-in fade-in zoom-in duration-500 space-y-8 pb-32 max-w-5xl mx-auto">
      {/* HEADER */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/admin/survei')}
          className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-all shadow-sm"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic">
            {isEdit ? 'Edit' : 'Tambah'} <span className="text-indigo-600">Survei TKA</span>
          </h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
            {isEdit ? `Memperbarui instrumen survei ID: #${id}` : 'Rancang survei dari Bank Soal'}
          </p>
        </div>
      </div>

      {/* VERTICAL FORM FLOW */}
      <div className="space-y-8">

        {/* CARD 1: INFORMASI DASAR */}
        <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-10 border border-slate-100 dark:border-slate-700 space-y-8 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600">
              <Settings size={20} />
            </div>
            <div>
              <span className="text-[9px] font-black uppercase text-indigo-500 tracking-wider">Langkah 1 dari 2</span>
              <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-widest">Informasi Dasar</h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Judul Survei</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="E.g. Survei Karakter Kemandirian & Toleransi"
                className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl text-xs font-bold outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all dark:text-white"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Deskripsi / Petunjuk Pengisian</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Tulis instruksi atau deskripsi singkat survei..."
                rows={3}
                className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl text-xs font-bold outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all dark:text-white resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tipe Instrumen</label>
              <Dropdown
                value={formData.type}
                onChange={(val) => setFormData(prev => ({
                  ...prev,
                  type: val,
                  icon: val === 'survei_karakter' ? 'Heart' : 'Globe',
                  color: val === 'survei_karakter' ? 'from-rose-400 to-pink-600' : 'from-emerald-400 to-teal-600',
                  selectedQuestions: [] // Reset selection saat ganti tipe
                }))}
                options={[
                  { value: 'survei_karakter', label: 'Survei Karakter' },
                  { value: 'sulingjar', label: 'Survei Lingkungan Belajar (Sulingjar)' }
                ]}
                fullWidth
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tema Visual Banner</label>
              <Dropdown
                value={formData.color}
                onChange={(val) => setFormData(prev => ({ ...prev, color: val }))}
                options={[
                  { value: 'from-rose-400 to-pink-600', label: 'Merah Muda & Rose Gradient' },
                  { value: 'from-emerald-400 to-teal-600', label: 'Hijau & Teal Sulingjar' },
                  { value: 'from-blue-400 to-indigo-600', label: 'Biru & Indigo' },
                  { value: 'from-amber-400 to-orange-600', label: 'Orange & Amber' }
                ]}
                fullWidth
              />
            </div>
          </div>
        </div>

        {/* CARD 2: PENGATURAN SOAL (VIA BANK SOAL) */}
        <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-10 border border-slate-100 dark:border-slate-700 space-y-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-50 dark:border-slate-700/50 pb-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center text-emerald-600">
                <ShieldCheck size={20} />
              </div>
              <div>
                <span className="text-[9px] font-black uppercase text-emerald-500 tracking-wider">Langkah 2 dari 2</span>
                <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-widest">Pengaturan Soal Survei</h3>
              </div>
            </div>

            {/* Toggle Metode Seleksi */}
            <div className="flex bg-slate-100 dark:bg-slate-900/50 p-1 rounded-2xl border border-slate-200 dark:border-slate-700">
              {['auto', 'manual'].map(method => (
                <button
                  key={method}
                  onClick={() => setFormData({ ...formData, selectionMethod: method })}
                  className={`px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${formData.selectionMethod === method
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                      : 'text-slate-400 hover:text-slate-600'
                    }`}
                >
                  {method === 'auto' ? 'Acak Otomatis' : 'Pilih Manual'}
                </button>
              ))}
            </div>
          </div>

          {/* KONTEN BERDASARKAN METODE */}
          {formData.selectionMethod === 'auto' ? (
            <div className="bg-slate-50 dark:bg-slate-900/50 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 space-y-6">
              <div className="flex flex-col items-center justify-center pt-4 text-center">
                <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center text-indigo-500 mb-4 shadow-inner">
                  <Zap size={32} />
                </div>
                <h4 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight">
                  Distribusi Acak Otomatis
                </h4>
                <p className="text-xs font-bold text-slate-400 mt-2 max-w-md leading-relaxed mb-8">
                  Sistem akan secara otomatis memilih soal dari Bank Soal sesuai dengan tipe instrumen (<span className="text-indigo-500">{formData.type === 'survei_karakter' ? 'Karakter' : 'Sulingjar'}</span>).
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="flex items-center gap-4 bg-white dark:bg-slate-800 p-2 pl-6 rounded-3xl border border-slate-200 dark:border-slate-700 w-full max-w-xs mx-auto shadow-sm">
                    <input
                      type="number"
                      min="1"
                      value={formData.questionCount}
                      onChange={e => setFormData({ ...formData, questionCount: parseInt(e.target.value) || 0 })}
                      className="w-full bg-transparent text-2xl font-black text-center text-slate-800 dark:text-white outline-none"
                    />
                    <span className="text-[10px] font-black uppercase text-slate-400 pr-4">Butir</span>
                  </div>

                  {/* Tombol Acak Preview */}
                  <button
                    type="button"
                    onClick={handleGeneratePreview}
                    className="px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-indigo-600/20 whitespace-nowrap"
                  >
                    <Shuffle size={16} /> Acak Soal Sekarang
                  </button>
                </div>
              </div>

              {/* Area Preview Soal */}
              {previewQuestions.length > 0 && (
                <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-700/50 space-y-4 animate-in fade-in slide-in-from-bottom-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Hasil Preview Soal</span>
                    <Badge text="Otomatis" variant="Success" className="text-[8px]" />
                  </div>
                  <div className="space-y-3 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                    {previewQuestions.map((q, idx) => (
                      <div key={q.id} className="flex gap-4 p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
                        <span className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 flex items-center justify-center text-[11px] font-black shrink-0">{idx + 1}</span>
                        <div className="flex-1">
                          <p className="text-xs font-bold text-slate-700 dark:text-slate-300 leading-relaxed">{q.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-2xl border-2 bg-slate-50/50 border-slate-100 dark:bg-slate-900/50 dark:border-slate-800">
                <span className="text-xs font-black uppercase tracking-wide">
                  Soal Terpilih: <span className="text-indigo-600 dark:text-indigo-400">{formData.selectedQuestions.length} Butir</span>
                </span>
              </div>

              <div className="relative">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                <input
                  type="text"
                  placeholder={`Cari soal Bank ${formData.type === 'survei_karakter' ? 'Karakter' : 'Sulingjar'}...`}
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-14 pr-5 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl text-xs font-bold outline-none focus:border-indigo-500 transition-colors dark:text-white"
                />
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                {availableQuestions.length === 0 ? (
                  <div className="text-center py-10 opacity-50">
                    <FileText size={32} className="mx-auto mb-2 text-slate-400" />
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Tidak ada soal yang cocok.</p>
                  </div>
                ) : (
                  availableQuestions.map(q => (
                    <div
                      key={q.id}
                      onClick={() => handleToggleQuestion(q.id)}
                      className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${formData.selectedQuestions.includes(q.id)
                          ? 'bg-indigo-50/50 border-indigo-200 dark:bg-indigo-900/20 dark:border-indigo-800'
                          : 'bg-white border-slate-100 dark:bg-slate-800 dark:border-slate-700 hover:border-indigo-100 dark:hover:border-indigo-800'
                        }`}
                    >
                      <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all ${formData.selectedQuestions.includes(q.id)
                          ? 'bg-indigo-600 border-indigo-600 text-white'
                          : 'border-slate-300 dark:border-slate-600'
                        }`}>
                        {formData.selectedQuestions.includes(q.id) && <CheckCircle2 size={12} />}
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-bold text-slate-700 dark:text-slate-300 leading-relaxed">{q.text}</p>
                      </div>
                      <Badge text={q.category} variant="Neutral" className="text-[9px] shrink-0" />
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SUMMARY BAR */}
      <div className="w-full">
        <div className="bg-slate-900 rounded-[2.5rem] p-8 md:p-12 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 border-t-4 border-indigo-500 relative overflow-hidden">
          <div className="flex flex-wrap gap-12 relative z-10">
            <div>
              <span className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Total Soal</span>
              <div className="flex items-end gap-2 text-white">
                <span className="text-5xl font-black italic leading-none">
                  {formData.selectionMethod === 'auto' ? formData.questionCount : formData.selectedQuestions.length}
                </span>
                <span className="text-[10px] font-black uppercase text-slate-500 mb-1">Butir</span>
              </div>
            </div>
            <div>
              <span className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1">Tipe Survei</span>
              <Badge text={formData.type === 'survei_karakter' ? 'Karakter' : 'Sulingjar'} variant="Info" className="px-6 py-2 uppercase" />
            </div>
            <div>
              <span className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1">Banner</span>
              <div className="flex items-center gap-2">
                <div className={`w-4 h-4 bg-gradient-to-r ${formData.color} rounded-md`} />
                <span className="text-[10px] font-black uppercase text-white italic">Gradient</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6 relative z-10 w-full md:w-auto">
            <button onClick={() => navigate('/admin/survei')} className="text-slate-500 hover:text-white font-black text-xs uppercase tracking-widest px-6 transition-all">Batal</button>
            <div className="flex gap-4 w-full md:w-auto">
              <button onClick={() => handleSave('draft')} className="flex-1 md:flex-none px-10 py-5 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg transition-all border border-white/5">Draft</button>
              <button
                onClick={() => handleSave('active')}
                className="flex-1 md:flex-none px-12 py-5 bg-white text-slate-900 hover:bg-slate-50 rounded-2xl text-xs font-black uppercase tracking-widest shadow-2xl transition-all active:scale-95"
              >
                {isEdit ? 'Perbarui & Rilis' : 'Simpan & Rilis'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
