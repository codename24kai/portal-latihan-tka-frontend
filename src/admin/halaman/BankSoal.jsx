import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/utilitas/api';
import {
  Plus,
  Search,
  PlusCircle,
  AlertCircle,
  Edit2,
  Trash2,
  ChevronUp,
  ChevronDown,
  Upload,
  MoreVertical,
  FileText,
  BookOpen,
  Layers,
  Database,
  CheckSquare,
  Square,
  Eye,
  Activity,
  Trash
} from 'lucide-react';
import toast from 'react-hot-toast';

// UI Components
import ConfirmDialog from '@/komponen/ui/DialogKonfirmasi';
import Dropdown from '@/komponen/ui/Dropdown';
import Badge from '@/komponen/ui/Badge';
import DataTable from '@/komponen/ui/TabelData';

// Shared Data
import { SUBJECTS } from '@/konstanta/mataPelajaran';

// Sub Components
import AnswerDropdown from '@/komponen/admin/BankSoal/DropdownJawaban';
import PreviewModal from '@/komponen/admin/BankSoal/ModalPratinjau';
import ImportModal from '@/komponen/admin/BankSoal/ModalImpor';

export default function QuestionBank() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [activeTab, setActiveTab] = useState('Akademik');
  const [subjectFilter, setSubjectFilter] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [previewQuestion, setPreviewQuestion] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });

  // Import States
  const [importData, setImportData] = useState([]);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  const fetchQuestions = useCallback(async () => {
    try {
      const res = await api.get('/soal', { params: { per_page: 100 } });
      const payload = res.data?.data || res.data || {};
      const items = payload.data || payload;

      const mapped = Array.isArray(items)
        ? items.map((item) => ({
            id: item.id_soal ?? item.id,
            text: item.isi_soal ?? item.text ?? '',
            subject: item.mataPelajaran?.nama_mapel || item.mata_pelajaran?.nama_mapel || item.subject || '-',
            category: item.mataPelajaran?.kategori === 'non-akademik' ? 'Non-Akademik' : 'Akademik',
            usedIn: item.usedIn || '',
          }))
        : [];

      setQuestions(mapped);
    } catch (error) {
      toast.error('Gagal memuat bank soal');
      console.error(error);
    }
  }, []);

  // Reset filters when activeTab changes
  useEffect(() => {
    setSubjectFilter('Semua');
  }, [activeTab]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  // Calculate statistics dynamically
  const stats = useMemo(() => {
    const total = questions.length;
    const akademik = questions.filter(q => q.category === 'Akademik').length;
    const survei = questions.filter(q => q.category === 'Non-Akademik').length;
    const digunakan = questions.filter(q => q.usedIn && q.usedIn.trim().length > 0).length;
    return { total, akademik, survei, digunakan };
  }, [questions]);

  // Subject options based on active tab
  const subjectOptions = useMemo(() => {
    if (activeTab === 'Akademik') {
      return [
        { value: 'Semua', label: 'Semua Mata Pelajaran' },
        ...SUBJECTS.filter(s => s.category === 'Akademik').map(s => ({ value: s.name, label: s.name }))
      ];
    }
    if (activeTab === 'Survei') {
      return [
        { value: 'Semua', label: 'Semua Jenis Survei' },
        ...SUBJECTS.filter(s => s.category === 'Non-Akademik').map(s => ({ value: s.name, label: s.name }))
      ];
    }
    return [
      { value: 'Semua', label: 'Semua Kategori/Mapel' },
      ...SUBJECTS.map(s => ({ value: s.name, label: s.name }))
    ];
  }, [activeTab]);

  // Sorting logic
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredData = useMemo(() => {
    if (!questions) return [];
    let result = questions.filter((q) => {
      const matchCategory = (activeTab === 'Akademik' && q.category === 'Akademik') ||
        (activeTab === 'Survei' && q.category === 'Non-Akademik');
      const matchSubject = subjectFilter === 'Semua' || q.subject === subjectFilter;
      const matchSearch = q.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.subject.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSubject && matchSearch;
    });

    if (sortConfig.key) {
      result.sort((a, b) => {
        const valA = a[sortConfig.key] || '';
        const valB = b[sortConfig.key] || '';
        if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [questions, activeTab, subjectFilter, searchQuery, sortConfig]);

  const toggleSelect = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(qId => qId !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredData.length && filteredData.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredData.map(q => q.id));
    }
  };

  const handleDelete = () => {
    const runDelete = async () => {
      try {
        if (deleteConfirmId === 'bulk') {
          await Promise.all(selectedIds.map((id) => api.delete(`/soal/${id}`)));
          toast.success(`${selectedIds.length} soal berhasil dihapus`);
          setSelectedIds([]);
        } else {
          await api.delete(`/soal/${deleteConfirmId}`);
          toast.success('Soal berhasil dihapus');
        }
        await fetchQuestions();
      } catch (error) {
        toast.error('Gagal menghapus soal');
      } finally {
        setDeleteConfirmId(null);
      }
    };
    runDelete();
  };

  const handleImportTrigger = () => {
    document.getElementById('csv-import-input').click();
  };

  const handlePdfImportTrigger = () => {
    document.getElementById('pdf-import-input').click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    toast.loading('Menganalisa file...', { duration: 1000 });

    setTimeout(() => {
      setImportData([]);
      setIsImportModalOpen(true);
      e.target.value = '';
    }, 1200);
  };

  const confirmImport = () => {
    setQuestions(prev => [...prev, ...importData]);
    toast.success(`${importData.length} soal berhasil diimpor ke Bank Soal`);
    setIsImportModalOpen(false);
    setImportData([]);
  };

  const getSubjectBadge = (subject) => {
    if (subject === 'Matematika') return <Badge text={subject} variant="Blue" />;
    if (subject === 'Bahasa Indonesia') return <Badge text={subject} variant="Green" />;
    return <Badge text={subject} variant="Neutral" />;
  };

  const SortIndicator = ({ column }) => {
    if (sortConfig.key !== column) return <MoreVertical size={12} className="opacity-20 ml-1 inline-block" />;
    return sortConfig.direction === 'asc' ? <ChevronUp size={12} className="text-indigo-600 inline-block ml-1" /> : <ChevronDown size={12} className="text-indigo-600 inline-block ml-1" />;
  };

  if (!questions) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        <span className="text-slate-500 font-black tracking-widest text-xs uppercase animate-pulse">Memuat Data Bank Soal...</span>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-8 pb-32">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic">
            Bank <span className="text-indigo-600">Soal</span>
          </h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
            Kelola standar butir soal akademik & survei
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <input type="file" id="pdf-import-input" className="hidden" accept=".pdf" onChange={handleFileChange} />
          <button
            onClick={handlePdfImportTrigger}
            className="flex items-center justify-center gap-2 px-5 py-3.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/20 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900/40 rounded-2xl text-[9px] font-black uppercase tracking-widest text-rose-600 dark:text-rose-400 transition-all active:scale-95 shadow-sm"
          >
            <FileText size={14} /> Pdf Import
          </button>
          <input type="file" id="csv-import-input" className="hidden" accept=".csv" onChange={handleFileChange} />
          <button
            onClick={handleImportTrigger}
            className="flex items-center justify-center gap-2 px-5 py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-[9px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all active:scale-95 shadow-sm"
          >
            <Upload size={14} /> Csv Import
          </button>
          <button
            onClick={() => navigate('/admin/bank-soal/tambah')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-7 py-4 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all shadow-xl shadow-indigo-600/20 active:scale-95 flex items-center gap-2"
          >
            <PlusCircle size={15} /> Tambah Soal
          </button>
        </div>
      </div>

      {/* STATISTICS WIDGET GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Total Bank Soal', value: stats.total, icon: Database, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50/50 dark:bg-indigo-950/10 border-indigo-100 dark:border-indigo-900/30' },
          { title: 'Soal Akademik', value: stats.akademik, icon: BookOpen, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50/50 dark:bg-emerald-950/10 border-emerald-100 dark:border-emerald-900/30' },
          { title: 'Soal Survei', value: stats.survei, icon: Layers, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50/50 dark:bg-amber-950/10 border-amber-100 dark:border-amber-900/30' },
          { title: 'Aktif Digunakan', value: stats.digunakan, icon: Activity, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50/50 dark:bg-blue-950/10 border-blue-100 dark:border-blue-900/30' }
        ].map((item, index) => (
          <div key={index} className={`p-6 rounded-[2rem] border flex items-center justify-between ${item.bg} shadow-sm transition-all hover:translate-y-[-2px]`}>
            <div className="space-y-1">
              <span className="block text-[9px] font-black text-slate-400 uppercase tracking-widest">{item.title}</span>
              <span className="block text-3xl font-black text-slate-800 dark:text-white leading-none italic">{item.value} <span className="text-xs font-bold text-slate-400">butir</span></span>
            </div>
            <div className={`w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center ${item.color} shadow-sm shrink-0`}>
              <item.icon size={22} />
            </div>
          </div>
        ))}
      </div>

      {/* FILTER & TABLE SHELL */}
      <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">

        {/* TABS SELECTOR (Hanya Akademik & Survei) */}
        <div className="flex items-center gap-6 px-8 py-5 border-b border-slate-100 dark:border-slate-700 bg-slate-50/20 dark:bg-slate-900/10">
          {['Akademik', 'Survei'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative py-2 px-3 text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab
                  ? 'text-indigo-600 dark:text-indigo-400'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                }`}
            >
              {tab}
              {activeTab === tab && (
                <span className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 dark:bg-indigo-500 rounded-full animate-fade-in" />
              )}
            </button>
          ))}
        </div>

        {/* INPUT FILTERS */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 w-full max-w-lg">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari teks soal atau mata pelajaran..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-bold focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all dark:text-white"
            />
          </div>

          <div className="w-full md:w-auto shrink-0">
            <Dropdown
              value={subjectFilter}
              onChange={setSubjectFilter}
              options={subjectOptions}
              fullWidth
            />
          </div>
        </div>

        {/* DATA TABLE VIEW */}
        {filteredData.length > 0 ? (
        <DataTable
          headers={[
            {
              label: (
                <div className="flex items-center gap-3">
                  <button
                    onClick={toggleSelectAll}
                    className="text-slate-400 hover:text-indigo-600 transition-colors"
                  >
                    {selectedIds.length === filteredData.length && filteredData.length > 0 ? (
                      <CheckSquare size={16} className="text-indigo-600" />
                    ) : (
                      <Square size={16} />
                    )}
                  </button>
                  <button onClick={() => handleSort('text')} className="flex items-center uppercase text-[10px] font-black tracking-widest text-slate-400">Pertanyaan & Materi <SortIndicator column="text" /></button>
                </div>
              )
            },
            { label: <button onClick={() => handleSort('subject')} className="flex items-center uppercase text-[10px] font-black tracking-widest text-slate-400 mx-auto">Mata Pelajaran <SortIndicator column="subject" /></button>, align: 'center' },
            { label: 'Kunci Jawaban', align: 'center' },
            { label: 'Penggunaan', align: 'center' },
            { label: 'Aksi', align: 'right' }
          ]}
          data={filteredData}
          rowsPerPage={10}
          renderRow={(q) => {
            const places = q.usedIn ? q.usedIn.split(',').map(s => s.trim()) : [];
            const useCount = places.length;
            const isSelected = selectedIds.includes(q.id);

            return (
              <tr
                key={q.id}
                className={`group hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-all cursor-pointer ${isSelected ? 'bg-indigo-50/30 dark:bg-indigo-900/10' : ''
                  }`}
                onClick={() => setPreviewQuestion(q)}
              >
                <td className="py-5 px-6">
                  <div className="flex items-start gap-4" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => toggleSelect(q.id)}
                      className="mt-1 text-slate-400 hover:text-indigo-600 transition-colors shrink-0"
                    >
                      {isSelected ? (
                        <CheckSquare size={17} className="text-indigo-600" />
                      ) : (
                        <Square size={17} />
                      )}
                    </button>
                    <div className="flex flex-col gap-1 max-w-xl">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-black text-slate-300 dark:text-slate-650 uppercase italic tracking-wider">ID: #{q.id}</span>
                      </div>
                      <p className="text-sm font-bold text-slate-700 dark:text-slate-200 line-clamp-1 group-hover:line-clamp-none transition-all duration-300">
                        {q.text}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="py-5 px-4 text-center">{getSubjectBadge(q.subject)}</td>

                {/* Kolom Kunci Jawaban */}
                <td className="py-5 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                  <AnswerDropdown question={q} />
                </td>

                {/* Kolom Status Penggunaan */}
                <td className="py-5 px-4 text-center">
                  {useCount > 0 ? (
                    <div className="flex flex-col items-center gap-1.5" title={`Digunakan di: ${places.join(', ')}`}>
                      <Badge
                        text={`${useCount}x Dipakai`}
                        variant={useCount > 1 ? 'Warning' : 'Success'}
                        className="!text-[8px] py-[2px] px-2 shadow-sm"
                      />
                      <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 max-w-[100px] truncate">
                        {places[0]} {useCount > 1 && `(+${useCount - 1})`}
                      </span>
                    </div>
                  ) : (
                    <span className="text-[10px] font-black text-slate-300 dark:text-slate-600">-</span>
                  )}
                </td>

                {/* Kolom Aksi */}
                <td className="py-5 px-6 text-right" onClick={(e) => e.stopPropagation()}>
                  <div className="flex justify-end items-center gap-1">
                    <button
                      onClick={() => setPreviewQuestion(q)}
                      className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-xl transition-all"
                      title="Lihat Pratinjau"
                    >
                      <Eye size={15} />
                    </button>
                    <button
                      onClick={() => navigate(`/admin/bank-soal/edit/${q.id}`)}
                      className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 rounded-xl transition-all"
                      title="Edit Soal"
                    >
                      <Edit2 size={15} />
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(q.id)}
                      className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-xl transition-all"
                      title="Hapus Soal"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          }}
        />
        ) : (
          <div className="py-16 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">
            Belum ada soal di bank soal backend
          </div>
        )}
      </div>

      {/* FOOTER INFO */}
      <div className="max-w-md bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/30 rounded-2xl p-5 flex gap-4">
        <AlertCircle className="text-indigo-500 shrink-0" size={24} />
        <div>
          <p className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-1">Panduan Pengelolaan</p>
          <p className="text-[11px] font-medium text-slate-600 dark:text-slate-400 leading-relaxed">
            Klik baris mana saja pada tabel untuk membuka pratinjau soal secara instan. Gunakan pilihan tombol checkbox di sisi kiri soal untuk mengaktifkan pengelolaan masal.
          </p>
        </div>
      </div>

      {/* FLOATING ACTION BAR FOR BULK ACTIONS */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-indigo-100 dark:border-slate-800 shadow-2xl px-6 py-4 rounded-full flex items-center gap-6 animate-in slide-in-from-bottom-5 duration-300">
          <span className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-white">
            Terpilih <span className="text-indigo-600 dark:text-indigo-400">{selectedIds.length}</span> Soal
          </span>
          <div className="w-[1px] h-6 bg-slate-200 dark:bg-slate-700" />
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedIds([])}
              className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-700 dark:hover:text-slate-350 transition-colors"
            >
              Batal
            </button>
            <button
              onClick={() => setDeleteConfirmId('bulk')}
              className="flex items-center gap-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-md shadow-rose-500/10 active:scale-95"
            >
              <Trash size={12} /> Hapus Terpilih
            </button>
          </div>
        </div>
      )}

      {/* MODAL & DIALOG WINDOWS */}
      <PreviewModal question={previewQuestion} onClose={() => setPreviewQuestion(null)} />
      <ImportModal isOpen={isImportModalOpen} importData={importData} onClose={() => setIsImportModalOpen(false)} onConfirm={confirmImport} />

      <ConfirmDialog
        isOpen={deleteConfirmId !== null}
        variant="danger"
        title={deleteConfirmId === 'bulk' ? 'Hapus Masal Soal?' : 'Hapus Soal Permanen?'}
        message={deleteConfirmId === 'bulk' ? `Sistem akan menghapus ${selectedIds.length} soal terpilih secara permanen.` : 'Soal ini akan dihapus dari bank soal dan tidak akan tersedia lagi.'}
        confirmLabel="Ya, Hapus Data"
        onConfirm={handleDelete}
        onCancel={() => setDeleteConfirmId(null)}
      />
    </div>
  );
}
