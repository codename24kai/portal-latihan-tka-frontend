import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
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
  MoreVertical
} from 'lucide-react';
import toast from 'react-hot-toast';

// UI Components
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import Dropdown from '@/components/ui/Dropdown';
import Badge from '@/components/ui/Badge';
import DataTable from '@/components/ui/DataTable';

// Shared Data
import { mockQuestionBank } from '@/data/mockQuestions';
import { SUBJECTS } from '@/constants/subjects';

// Sub Components
import AnswerDropdown from '@/admin/components/QuestionBank/AnswerDropdown';
import PreviewModal from '@/admin/components/QuestionBank/PreviewModal';
import ImportModal from '@/admin/components/QuestionBank/ImportModal';

export default function QuestionBank() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState(mockQuestionBank);
  const [activeTab, setActiveTab] = useState('Semua'); 
  const [difficultyFilter, setDifficultyFilter] = useState('Semua');
  const [subjectFilter, setSubjectFilter] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [previewQuestion, setPreviewQuestion] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });

  // Import States
  const [importData, setImportData] = useState([]);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

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
      const matchCategory = activeTab === 'Semua' ||
        (activeTab === 'Akademik' && q.category === 'Akademik') ||
        (activeTab === 'Survei' && q.category === 'Non-Akademik');
      const matchDifficulty = difficultyFilter === 'Semua' || q.difficulty === difficultyFilter;
      const matchSubject = subjectFilter === 'Semua' || q.subject === subjectFilter;
      const matchSearch = q.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.subject.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchDifficulty && matchSubject && matchSearch;
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
  }, [questions, activeTab, difficultyFilter, subjectFilter, searchQuery, sortConfig]);

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
    if (deleteConfirmId === 'bulk') {
      setQuestions(prev => prev?.filter(q => !selectedIds.includes(q?.id)));
      toast.success(`${selectedIds.length} soal berhasil dihapus`);
      setSelectedIds([]);
    } else {
      setQuestions(prev => prev?.filter(q => q?.id !== deleteConfirmId));
      toast.success('Soal berhasil dihapus');
    }
    setDeleteConfirmId(null);
  };

  const handleImportTrigger = () => {
    document.getElementById('csv-import-input').click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    toast.loading('Menganalisa file...', { duration: 1000 });
    
    setTimeout(() => {
      const mockImported = [
        { id: Date.now() + 1, subject: 'Matematika', category: 'Akademik', text: 'Hasil dari 125 x 8 adalah...', difficulty: 'Mudah', correctAnswer: 'A', createdAt: new Date().toISOString() },
        { id: Date.now() + 2, subject: 'Bahasa Indonesia', category: 'Akademik', text: 'Apa yang dimaksud dengan antonim?', difficulty: 'Sedang', correctAnswer: 'C', createdAt: new Date().toISOString() },
        { id: Date.now() + 3, subject: 'Survei Karakter', category: 'Non-Akademik', text: 'Apa yang anda lakukan jika melihat sampah?', difficulty: 'Mudah', correctAnswer: 'D', createdAt: new Date().toISOString() },
      ];
      setImportData(mockImported);
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
    if (sortConfig.key !== column) return <MoreVertical size={12} className="opacity-20" />;
    return sortConfig.direction === 'asc' ? <ChevronUp size={12} className="text-indigo-600" /> : <ChevronDown size={12} className="text-indigo-600" />;
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
    <div className="animate-fade-in space-y-6 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight">Bank Soal</h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
             Kelola {questions.length} standar butir soal akademik & survei
          </p>
        </div>
        <div className="flex items-center gap-3">
          <input type="file" id="csv-import-input" className="hidden" accept=".csv" onChange={handleFileChange} />
          <button 
            onClick={handleImportTrigger}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition-all active:scale-95"
          >
            <Upload size={16} /> Csv Import
          </button>
          <button
            onClick={() => navigate('/admin/question-bank/add')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-indigo-600/20 active:scale-95 flex items-center gap-2"
          >
            <PlusCircle size={18} /> Tambah Soal
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
        <div className="flex items-center gap-8 px-10 py-5 border-b border-slate-50 dark:border-slate-700">
          {['Semua', 'Akademik', 'Survei'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative py-2 text-[10px] font-black uppercase tracking-[0.15em] transition-all ${activeTab === tab ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
            >
              {tab}
              {activeTab === tab && <div className="absolute -bottom-5 left-0 right-0 h-1 bg-indigo-600 rounded-t-full" />}
            </button>
          ))}
        </div>

        <div className="p-8 border-b border-slate-50 dark:border-slate-700 flex flex-col lg:flex-row gap-4 items-center bg-slate-50/30 dark:bg-slate-900/10">
          <div className="relative flex-1 w-full lg:max-w-md">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari teks soal atau mata pelajaran..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-bold focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all dark:text-white"
            />
          </div>
          
          <Dropdown
            value={subjectFilter}
            onChange={setSubjectFilter}
            options={[
              { value: 'Semua', label: 'Semua Mata Pelajaran' },
              ...SUBJECTS.map(s => ({ value: s.name, label: s.name }))
            ]}
          />

          <Dropdown
            value={difficultyFilter}
            onChange={setDifficultyFilter}
            options={[
              { value: 'Semua', label: 'Tingkat Kesulitan' },
              { value: 'Mudah', label: 'Mudah' },
              { value: 'Sedang', label: 'Sedang' },
              { value: 'Sulit', label: 'Sulit' }
            ]}
          />

          {selectedIds.length > 0 && (
            <div className="flex-1 flex justify-end animate-fade-in">
              <button
                onClick={() => setDeleteConfirmId('bulk')}
                className="flex items-center gap-2 px-6 py-3 bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-100 transition-all"
              >
                <Trash2 size={14} /> Hapus Terpilih ({selectedIds.length})
              </button>
            </div>
          )}
        </div>

        <DataTable
          headers={[
            { label: (
              <div className="flex items-center gap-4">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 rounded border-slate-300 accent-indigo-600 cursor-pointer"
                  checked={selectedIds.length === filteredData.length && filteredData.length > 0}
                  onChange={toggleSelectAll}
                />
                <button onClick={() => handleSort('text')} className="flex items-center gap-2 uppercase">Pertanyaan & Materi <SortIndicator column="text" /></button>
              </div>
            )},
            { label: <button onClick={() => handleSort('subject')} className="flex items-center gap-2 uppercase mx-auto">Mata Pelajaran <SortIndicator column="subject" /></button>, align: 'center' },
            { label: 'Pratinjau', align: 'center' },
            { label: <button onClick={() => handleSort('difficulty')} className="flex items-center gap-2 uppercase mx-auto">Kesulitan <SortIndicator column="difficulty" /></button>, align: 'center' },
            { label: 'Aksi', align: 'right' }
          ]}
          data={filteredData}
          rowsPerPage={10}
          renderRow={(q) => (
            <tr key={q.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-all cursor-pointer" onClick={() => setPreviewQuestion(q)}>
              <td className="py-6 px-8">
                <div className="flex items-start gap-4" onClick={(e) => e.stopPropagation()}>
                  <input type="checkbox" className="w-4 h-4 mt-1 rounded border-slate-200 accent-indigo-600 cursor-pointer" checked={selectedIds.includes(q.id)} onChange={() => toggleSelect(q.id)} />
                  <div className="flex flex-col gap-1.5 max-w-lg">
                    <div className="flex items-center gap-2">
                       {activeTab === 'Semua' && <Badge text={q.category === 'Akademik' ? 'Akademik' : 'Survei'} variant="Neutral" className="!text-[7px] py-[2px] opacity-70" />}
                       <span className="text-[9px] font-bold text-slate-300 uppercase italic">ID: #{q.id}</span>
                    </div>
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-200 line-clamp-1 group-hover:line-clamp-none transition-all duration-300">{q.text}</p>
                  </div>
                </div>
              </td>
              <td className="py-6 px-4 text-center">{getSubjectBadge(q.subject)}</td>
              <td className="py-6 px-4 text-center"><AnswerDropdown question={q} /></td>
              <td className="py-6 px-4 text-center"><Badge text={q.difficulty} variant={q.difficulty === 'Mudah' ? 'Success' : q.difficulty === 'Sedang' ? 'Warning' : 'Danger'} /></td>
              <td className="py-6 px-8 text-right" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-end items-center gap-2">
                   <button onClick={() => setPreviewQuestion(q)} className="px-3 py-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-xl transition-all font-black text-[10px] uppercase flex items-center gap-1.5"><Plus size={14} /> View</button>
                   <button onClick={() => navigate(`/admin/question-bank/edit/${q.id}`)} className="px-3 py-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-xl transition-all font-black text-[10px] uppercase flex items-center gap-1.5"><Edit2 size={14} /> Edit</button>
                   <button onClick={() => setDeleteConfirmId(q.id)} className="px-3 py-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-all font-black text-[10px] uppercase flex items-center gap-1.5"><Trash2 size={14} /> Hapus</button>
                </div>
              </td>
            </tr>
          )}
        />
      </div>

      <PreviewModal question={previewQuestion} onClose={() => setPreviewQuestion(null)} />
      <ImportModal isOpen={isImportModalOpen} importData={importData} onClose={() => setIsImportModalOpen(false)} onConfirm={confirmImport} />

      <div className="max-w-md bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-900/50 rounded-2xl p-5 flex gap-4">
        <AlertCircle className="text-indigo-500 shrink-0" size={24} />
        <div>
          <p className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.1em] mb-1">Informasi</p>
          <p className="text-[11px] font-medium text-slate-600 dark:text-slate-400 leading-relaxed">Klik pada baris soal untuk melihat pratinjau cepat. Gunakan checkbox di sebelah kiri untuk penghapusan masal.</p>
        </div>
      </div>

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

