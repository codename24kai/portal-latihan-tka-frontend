import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Plus, Trash2, Clock, BookOpen, Layers, Search, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/utilitas/api';
import Dropdown from '@/komponen/ui/Dropdown';
import Badge from '@/komponen/ui/Badge';
import DataTable from '@/komponen/ui/TabelData';
import ConfirmDialog from '@/komponen/ui/DialogKonfirmasi';

export default function TambahLatihanGuru() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const assignedClass = localStorage.getItem('assignedClass') ?? '6A';

  const [formData, setFormData] = useState({
    title: '',
    subject: 'Matematika Pecahan',
    duration: '60',
    description: '',
    totalQuestions: '5'
  });

  const [selectedQuestionIds, setSelectedQuestionIds] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [availableQuestions, setAvailableQuestions] = useState([]);

  // Load Latihan Mandiri if editing
  useEffect(() => {
    if (isEdit) {
      toast.error('Data latihan belum tersedia dari backend');
      navigate('/guru/latihan');
    }
  }, [id, isEdit, navigate]);

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const res = await api.get('/soal', { params: { per_page: 500 } });
        const items = Array.isArray(res.data?.data) ? res.data.data : [];
        const mapped = items.map(q => ({
          id: q.id_soal ?? q.id,
          subject: q.mataPelajaran?.nama_mapel || q.mata_pelajaran?.nama_mapel || q.subject || '-',
          text: q.isi_soal || q.text || '',
        }));
        setAvailableQuestions(mapped);
      } catch (err) {
        console.error('Gagal memuat bank soal latihan', err);
      }
    };
    loadQuestions();
  }, []);

  // Filter bank soal based on subject
  const filteredQuestions = useMemo(() => {
    return availableQuestions.filter(q => {
      const matchesSubject = !formData.subject || q.subject === formData.subject;
      const matchesSearch = (q.text || '').toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSubject && matchesSearch;
    });
  }, [availableQuestions, formData.subject, searchQuery]);

  const handleToggleQuestion = (qId) => {
    setSelectedQuestionIds(prev => {
      if (prev.includes(qId)) {
        return prev.filter(id => id !== qId);
      } else {
        return [...prev, qId];
      }
    });
  };

  const handleSave = async () => {
    if (!formData.title) {
      toast.error('Judul latihan wajib diisi!');
      return;
    }

    if (selectedQuestionIds.length === 0) {
      toast.error('Pilih minimal 1 soal dari Bank Soal!');
      return;
    }

    try {
      const payload = {
        title: formData.title,
        type: 'latihan_mandiri',
        subject: formData.subject,
        duration: parseInt(formData.duration, 10),
        soal_ids: selectedQuestionIds
      };

      if (isEdit) {
        await api.put(`/guru/sesi-latihan/${id}`, payload);
      } else {
        await api.post('/guru/sesi-latihan', payload);
      }

      toast.success(isEdit ? 'Latihan mandiri berhasil diperbarui' : 'Latihan mandiri berhasil disimpan');
      setTimeout(() => navigate('/guru/latihan'), 1500);
    } catch (err) {
      console.error(err);
      toast.error('Gagal menyimpan latihan mandiri');
    }
  };

  return (
    <div className="animate-fade-in space-y-8 pb-32 max-w-5xl mx-auto">
      {/* HEADER */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/guru/latihan')}
          className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:text-teal-600 transition-all shadow-sm"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-black text-slate-808 dark:text-white uppercase tracking-tight italic">
            {isEdit ? 'Edit' : 'Tambah'} <span className="text-teal-600">Latihan Mandiri</span>
          </h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
            {isEdit ? `Memperbarui paket latihan ID: #${id}` : `Buat kuis latihan mandiri baru untuk Kelas ${assignedClass}`}
          </p>
        </div>
      </div>

      {/* FORM FLOW */}
      <div className="space-y-8">
        
        {/* CARD 1: INFORMASI DASAR */}
        <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-10 border border-slate-100 dark:border-slate-700 space-y-8 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-teal-50 dark:bg-teal-900/30 rounded-xl flex items-center justify-center text-teal-600">
              <Layers size={20} />
            </div>
            <div>
              <span className="text-[9px] font-black uppercase text-teal-500 tracking-wider">Langkah 1 dari 2</span>
              <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-widest">Informasi Dasar</h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2 md:col-span-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Judul Latihan</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="E.g. Latihan Pecahan Campuran Kelas 6"
                className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl text-xs font-bold outline-none focus:ring-4 focus:ring-teal-500/10 transition-all dark:text-white"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Durasi Target (Menit)</label>
              <input
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl text-xs font-bold outline-none focus:ring-4 focus:ring-teal-500/10 transition-all dark:text-white"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mata Pelajaran</label>
              <Dropdown
                value={formData.subject}
                onChange={(val) => setFormData({ ...formData, subject: val, selectedQuestionIds: [] })}
                options={[
                  { value: 'Matematika Pecahan', label: 'Matematika Pecahan' },
                  { value: 'IPA Gaya', label: 'IPA Gaya' },
                  { value: 'Matematika', label: 'Matematika Umum' },
                  { value: 'Bahasa Indonesia', label: 'Bahasa Indonesia' }
                ]}
                fullWidth
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Deskripsi & Instruksi</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Petunjuk pengerjaan bagi siswa..."
                rows={3}
                className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl text-xs font-bold outline-none focus:ring-4 focus:ring-teal-500/10 transition-all dark:text-white resize-none"
              />
            </div>
          </div>
        </div>

        {/* CARD 2: PILIH SOAL DARI BANK SOAL */}
        <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-10 border border-slate-100 dark:border-slate-700 space-y-8 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-teal-50 dark:bg-teal-900/30 rounded-xl flex items-center justify-center text-teal-600">
              <BookOpen size={20} />
            </div>
            <div>
              <span className="text-[9px] font-black uppercase text-teal-500 tracking-wider">Langkah 2 dari 2</span>
              <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-widest">Pilih Soal Latihan</h3>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-2xl border-2 bg-slate-50/50 border-slate-100 dark:bg-slate-900/50 dark:border-slate-800">
              <span className="text-xs font-black uppercase tracking-wide">
                Soal Terpilih: <span className="text-teal-600 dark:text-teal-400">{selectedQuestionIds.length} Butir</span>
              </span>
            </div>

            <div className="relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Cari teks soal..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-5 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl text-xs font-bold outline-none focus:border-teal-500 transition-all dark:text-white"
              />
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
              {filteredQuestions.length === 0 ? (
                <div className="text-center py-10 opacity-50">
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Tidak ada soal yang cocok dengan mata pelajaran/pencarian ini.</p>
                </div>
              ) : (
                filteredQuestions.map(q => (
                  <div
                    key={q.id}
                    onClick={() => handleToggleQuestion(q.id)}
                    className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      selectedQuestionIds.includes(q.id)
                        ? 'bg-teal-50/50 border-teal-200 dark:bg-teal-900/20 dark:border-teal-800'
                        : 'bg-white border-slate-100 dark:bg-slate-800 dark:border-slate-700 hover:border-teal-100 dark:hover:border-teal-800'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all ${
                      selectedQuestionIds.includes(q.id)
                        ? 'bg-teal-600 border-teal-600 text-white'
                        : 'border-slate-300 dark:border-slate-600'
                    }`}>
                      {selectedQuestionIds.includes(q.id) && <CheckCircle2 size={12} />}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-slate-700 dark:text-slate-300 leading-relaxed">{q.text}</p>
                    </div>
                    <Badge text={q.subject} variant="Info" className="text-[9px] shrink-0" />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>

      {/* FOOTER BAR */}
      <div className="w-full">
        <div className="bg-slate-900 border-t-4 border-teal-500 rounded-[2.5rem] px-8 md:px-12 py-8 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 overflow-hidden relative">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-8 md:gap-14">
            <div className="flex flex-col items-center md:items-start min-w-[120px]">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1 shadow-sm">Total Soal</span>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black text-white italic tracking-tighter leading-none uppercase">
                  {selectedQuestionIds.length} Butir
                </span>
              </div>
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Mata Pelajaran</span>
              <Badge text={formData.subject} variant="Info" className="px-5 py-1" />
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4 w-full md:w-auto justify-center md:justify-end">
            <button
              onClick={() => navigate('/guru/latihan')}
              className="px-6 py-4 text-slate-400 hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors mr-2 md:mr-6"
            >
              Batal
            </button>
              <button
                onClick={handleSave}
                className="bg-white text-slate-900 px-12 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all active:scale-95 shadow-xl shadow-white/10"
              >
              {isEdit ? 'Perbarui Latihan' : 'Simpan Latihan'}
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
