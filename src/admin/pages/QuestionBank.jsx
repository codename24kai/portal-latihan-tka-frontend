import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Search,
  Filter,
  Upload,
  PlusCircle,
  AlertCircle,
  Edit2,
  Trash2,
  X,
  Eye,
  ChevronUp,
  ChevronDown,
  CheckCircle,
  HelpCircle,
  MoreVertical
} from 'lucide-react';
import toast from 'react-hot-toast';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import Dropdown from '../../components/ui/Dropdown';
import Badge from '../../components/ui/Badge';
import DataTable from '../../components/ui/DataTable';
import { SUBJECT_CATEGORIES, SUBJECTS } from '../../constants/subjects';

// Mock question bank data
export const mockQuestionBank = [
  { id: 1, subject: 'Matematika', category: 'Akademik', text: 'Hasil dari 2.456 + 3.789 − 1.234 adalah …', options: { A: '5.011', B: '5.111', C: '5.211', D: '5.311' }, explanation: 'Hitung penjumlahan terlebih dahulu baru pengurangan.', correctAnswer: 'A', difficulty: 'Mudah', usedIn: 'Tryout Mandiri 1', createdAt: '2026-03-20' },
  { id: 2, subject: 'Bahasa Indonesia', category: 'Akademik', text: 'Ide pokok dari paragraf di atas adalah…', options: { A: 'Kegemukan pada anak', B: 'Pentingnya sayuran', C: 'Olahraga rutin', D: 'Pola tidur sehat' }, explanation: 'Ide pokok biasanya terletak di awal paragraf (deduktif).', correctAnswer: 'B', difficulty: 'Sedang', usedIn: null, createdAt: '2026-03-21' },
  { id: 3, subject: 'Survei Lingkungan Belajar', category: 'Non-Akademik', text: 'Bagaimana kondisi fasilitas belajar di rumah Anda?', options: { A: 'Sangat Memadai', B: 'Memadai', C: 'Kurang Memadai', D: 'Tidak Ada' }, explanation: 'Ini adalah soal survei, tidak ada jawaban benar/salah secara mutlak.', correctAnswer: 'A', difficulty: 'Mudah', usedIn: 'Survei Akhir 2025', createdAt: '2026-03-22' },
  { id: 4, subject: 'Survei Karakter', category: 'Non-Akademik', text: 'Bagaimana sikap Anda jika melihat teman sedang diejek?', options: { A: 'Ikut mengejek', B: 'Diam saja', C: 'Melaporkan ke guru', D: 'Membela teman tersebut' }, explanation: 'Menunjukkan sikap empati dan tanggung jawab sosial.', correctAnswer: 'D', difficulty: 'Sedang', usedIn: null, createdAt: '2026-03-22' },
  { id: 5, subject: 'Matematika', category: 'Akademik', text: 'Nilai dari 3/4 + 2/5 adalah …', options: { A: '1 3/20', B: '1 4/20', C: '1 5/20', D: '1 6/20' }, explanation: 'Samakan penyebut menjadi 20.', correctAnswer: 'A', difficulty: 'Sulit', usedIn: 'Tryout Mandiri 2', createdAt: '2026-03-22' },
  { id: 6, subject: 'Bahasa Indonesia', category: 'Akademik', text: 'Sinonim dari kata "Cerdik" adalah...', options: { A: 'Pintar', B: 'Licik', C: 'Malas', D: 'Lambat' }, explanation: 'Cerdik berarti tajam pikiran atau pandai.', correctAnswer: 'A', difficulty: 'Mudah', usedIn: null, createdAt: '2026-03-23' },
  { id: 7, subject: 'Matematika', category: 'Akademik', text: 'Berapa luas lingkaran dengan jari-jari 7cm?', options: { A: '154', B: '44', C: '49', D: '22' }, explanation: 'Gunakan rumus L = π × r² dengan π = 22/7.', correctAnswer: 'A', difficulty: 'Sedang', usedIn: null, createdAt: '2026-03-23' },
];

// Sub-component for in-row answer pratinjau
const AnswerDropdown = ({ question }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block text-left" onClick={(e) => e.stopPropagation()}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border ${
          isOpen 
          ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-600/20' 
          : 'bg-indigo-50 text-indigo-600 border-indigo-100 hover:bg-indigo-100 dark:bg-indigo-900/20 dark:text-indigo-400 dark:border-indigo-900/40'
        }`}
      >
        <span>Kunci: {question.correctAnswer}</span>
        <ChevronDown size={12} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-[60]" onClick={() => setIsOpen(false)} />
          <div className="absolute left-0 mt-2 w-56 p-3 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl shadow-2xl z-[70] animate-in fade-in slide-in-from-top-2 duration-200">
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Pilihan Jawaban</p>
            <div className="space-y-1">
              {Object.entries(question.options).map(([key, val]) => (
                <div 
                  key={key} 
                  className={`flex items-center gap-3 p-2.5 rounded-xl transition-colors ${
                    question.correctAnswer === key 
                    ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400' 
                    : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900'
                  }`}
                >
                  <span className={`w-6 h-6 rounded flex items-center justify-center text-[10px] font-black shrink-0 ${
                    question.correctAnswer === key 
                    ? 'bg-emerald-500 text-white shadow-sm' 
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-400'
                  }`}>
                    {key}
                  </span>
                  <p className="text-[10px] font-bold truncate" title={val}>{val}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default function QuestionBank() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState(mockQuestionBank);
  const [activeTab, setActiveTab] = useState('Semua'); 
  const [difficultyFilter, setDifficultyFilter] = useState('Semua');
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
    let result = questions.filter((q) => {
      const matchCategory = activeTab === 'Semua' ||
        (activeTab === 'Akademik' && q.category === 'Akademik') ||
        (activeTab === 'Survei' && q.category === 'Non-Akademik');
      const matchDifficulty = difficultyFilter === 'Semua' || q.difficulty === difficultyFilter;
      const matchSearch = q.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.subject.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchDifficulty && matchSearch;
    });

    // Apply Sorting
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
  }, [questions, activeTab, difficultyFilter, searchQuery, sortConfig]);

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

  // Import Logic
  const handleImportTrigger = () => {
    document.getElementById('csv-import-input').click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Simulate Parsing CSV
    toast.loading('Menganalisa file...', { duration: 1000 });
    
    setTimeout(() => {
      const mockImported = [
        { id: Date.now() + 1, subject: 'Matematika', category: 'Akademik', text: 'Hasil dari 125 x 8 adalah...', difficulty: 'Mudah', correctAnswer: 'A', createdAt: new Date().toISOString() },
        { id: Date.now() + 2, subject: 'Bahasa Indonesia', category: 'Akademik', text: 'Apa yang dimaksud dengan antonim?', difficulty: 'Sedang', correctAnswer: 'C', createdAt: new Date().toISOString() },
        { id: Date.now() + 3, subject: 'Survei Karakter', category: 'Non-Akademik', text: 'Apa yang anda lakukan jika melihat sampah?', difficulty: 'Mudah', correctAnswer: 'D', createdAt: new Date().toISOString() },
      ];
      setImportData(mockImported);
      setIsImportModalOpen(true);
      e.target.value = ''; // Reset input
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

  return (
    <div className="animate-fade-in space-y-6 pb-20">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight">Bank Soal</h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
             Kelola {questions.length} standar butir soal akademik & survei
          </p>
        </div>
        <div className="flex items-center gap-3">
          <input 
            type="file" 
            id="csv-import-input" 
            className="hidden" 
            accept=".csv" 
            onChange={handleFileChange}
          />
          <button 
            onClick={handleImportTrigger}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition-all active:scale-95"
          >
            <Upload size={16} />
            Csv Import
          </button>
          <button
            onClick={() => navigate('/admin/question-bank/add')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-indigo-600/20 active:scale-95 flex items-center gap-2"
          >
            <PlusCircle size={18} />
            Tambah Soal
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
        {/* Navigation Tabs */}
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

        {/* Filters & Search */}
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
            value={difficultyFilter}
            onChange={setDifficultyFilter}
            options={[
              { value: 'Semua', label: 'Tingkat Kesulitan' },
              { value: 'Mudah', label: 'Mudah' },
              { value: 'Sedang', label: 'Sedang' },
              { value: 'Sulit', label: 'Sulit' }
            ]}
            className="min-w-[200px] w-full lg:w-auto"
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

        {/* Data Table */}
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
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 mt-1 rounded border-slate-200 accent-indigo-600 cursor-pointer" 
                    checked={selectedIds.includes(q.id)}
                    onChange={() => toggleSelect(q.id)}
                  />
                  <div className="flex flex-col gap-1.5 max-w-lg">
                    <div className="flex items-center gap-2">
                       {activeTab === 'Semua' && (
                         <Badge 
                           text={q.category === 'Akademik' ? 'Akademik' : 'Survei'} 
                           variant="Neutral" 
                           className="!text-[7px] py-[2px] opacity-70" 
                         />
                       )}
                       <span className="text-[9px] font-bold text-slate-300 uppercase italic">ID: #{q.id}</span>
                    </div>
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-200 line-clamp-1 group-hover:line-clamp-none transition-all duration-300">
                      {q.text}
                    </p>
                  </div>
                </div>
              </td>
              <td className="py-6 px-4 text-center">
                {getSubjectBadge(q.subject)}
              </td>
              <td className="py-6 px-4 text-center">
                <AnswerDropdown question={q} />
              </td>
              <td className="py-6 px-4 text-center">
                <Badge
                  text={q.difficulty}
                  variant={q.difficulty === 'Mudah' ? 'Success' : q.difficulty === 'Sedang' ? 'Warning' : 'Danger'}
                />
              </td>
              <td className="py-6 px-8 text-right" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-end items-center gap-2">
                   <button 
                     onClick={() => setPreviewQuestion(q)}
                     className="px-3 py-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-xl transition-all font-black text-[10px] uppercase flex items-center gap-1.5"
                   >
                     <Eye size={14} /> View
                   </button>
                   <button className="px-3 py-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-xl transition-all font-black text-[10px] uppercase flex items-center gap-1.5">
                     <Edit2 size={14} /> Edit
                   </button>
                   <button
                    onClick={() => setDeleteConfirmId(q.id)}
                    className="px-3 py-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-all font-black text-[10px] uppercase flex items-center gap-1.5"
                   >
                    <Trash2 size={14} /> Hapus
                  </button>
                </div>
              </td>
            </tr>
          )}
        />
      </div>

      {/* QUICK PREVIEW MODAL */}
      {previewQuestion && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setPreviewQuestion(null)} />
          <div className="relative w-full max-w-2xl bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-700 overflow-hidden animate-in zoom-in-95 duration-200">
             <div className="px-10 py-6 border-b border-slate-50 dark:border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600">
                      <Eye size={20} />
                   </div>
                   <div>
                      <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-widest">Pratinjau Soal</h3>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">ID #{previewQuestion.id} • {previewQuestion.subject}</p>
                   </div>
                </div>
                <button onClick={() => setPreviewQuestion(null)} className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-rose-500 transition-all">
                   <X size={20} />
                </button>
             </div>
             <div className="p-10 space-y-8 max-h-[70vh] overflow-y-auto">
                <div className="space-y-3">
                   <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Pertanyaan</label>
                   <p className="text-lg font-bold text-slate-800 dark:text-white leading-relaxed">{previewQuestion.text}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {Object.entries(previewQuestion.options).map(([key, val]) => (
                     <div key={key} className={`p-4 rounded-2xl border flex items-center gap-4 ${previewQuestion.correctAnswer === key ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500' : 'bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-700'}`}>
                        <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black ${previewQuestion.correctAnswer === key ? 'bg-emerald-500 text-white' : 'bg-white dark:bg-slate-800 text-slate-400'}`}>{key}</span>
                        <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300">{val}</p>
                        {previewQuestion.correctAnswer === key && <CheckCircle size={16} className="text-emerald-500 ml-auto" />}
                     </div>
                   ))}
                </div>
                {previewQuestion.explanation && (
                  <div className="p-6 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-2xl border border-indigo-100 dark:border-indigo-900/30 space-y-2">
                     <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-widest">
                        <HelpCircle size={14} /> Pembahasan
                     </div>
                     <p className="text-xs font-medium text-slate-600 dark:text-slate-400 italic font-medium leading-relaxed">{previewQuestion.explanation}</p>
                  </div>
                )}
             </div>
             <div className="p-8 bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-50 dark:border-slate-700 flex justify-end">
                <button onClick={() => setPreviewQuestion(null)} className="px-8 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition-all">
                   Tutup Panel
                </button>
             </div>
          </div>
        </div>
      )}

      {/* Accuracy Hint */}
      <div className="max-w-md bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-900/50 rounded-2xl p-5 flex gap-4">
        <AlertCircle className="text-indigo-500 shrink-0" size={24} />
        <div>
          <p className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.1em] mb-1">Informasi</p>
          <p className="text-[11px] font-medium text-slate-600 dark:text-slate-400 leading-relaxed">
            Klik pada baris soal untuk melihat pratinjau cepat. Gunakan checkbox di sebelah kiri untuk penghapusan masal.
          </p>
        </div>
      </div>

      {/* DELETE CONFIRMATION */}
      <ConfirmDialog
        isOpen={deleteConfirmId !== null}
        variant="danger"
        title={deleteConfirmId === 'bulk' ? 'Hapus Masal Soal?' : 'Hapus Soal Permanen?'}
        message={deleteConfirmId === 'bulk'
          ? `Sistem akan menghapus ${selectedIds.length} soal terpilih secara permanen. Tindakan ini tidak dapat dibatalkan.`
          : 'Soal ini akan dihapus dari bank soal dan tidak akan tersedia lagi untuk tryout mendatang.'}
        confirmLabel="Ya, Hapus Data"
        cancelLabel="Batal"
        onConfirm={handleDelete}
        onCancel={() => setDeleteConfirmId(null)}
      />

      {/* IMPORT PREVIEW MODAL */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setIsImportModalOpen(false)} />
          <div className="relative w-full max-w-4xl bg-white dark:bg-slate-800 rounded-[3rem] shadow-2xl border border-slate-100 dark:border-slate-700 overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
             <div className="px-10 py-8 border-b border-slate-50 dark:border-slate-700 flex items-center justify-between bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl shrink-0">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-600/20">
                      <Upload size={24} />
                   </div>
                   <div>
                      <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight">Pratinjau Impor Soal</h3>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Ditemukan {importData?.length} baris data siap diimpor</p>
                   </div>
                </div>
                <button onClick={() => setIsImportModalOpen(false)} className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-400 hover:text-rose-500 transition-all">
                   <X size={24} />
                </button>
             </div>

             <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                <div className="bg-slate-50/50 dark:bg-slate-900/30 rounded-[2rem] border border-slate-100 dark:border-slate-700 overflow-hidden">
                   <DataTable 
                    headers={[
                      { label: 'No', align: 'center' },
                      { label: 'Pertanyaan' },
                      { label: 'Mata Pelajaran', align: 'center' },
                      { label: 'Kesulitan', align: 'center' }
                    ]}
                    data={importData}
                    rowsPerPage={50}
                    renderRow={(item, idx) => (
                      <tr key={item?.id} className="border-b border-slate-100/50 dark:border-slate-700/50">
                        <td className="py-4 px-6 text-center text-[10px] font-black text-slate-300">{(idx + 1).toString().padStart(2, '0')}</td>
                        <td className="py-4 px-6">
                           <p className="text-xs font-bold text-slate-700 dark:text-slate-200 line-clamp-1">{item?.text}</p>
                        </td>
                        <td className="py-4 px-6 text-center">
                           <Badge text={item?.subject} variant="Info" className="!text-[8px]" />
                        </td>
                        <td className="py-4 px-6 text-center">
                           <Badge 
                            text={item?.difficulty} 
                            variant={item?.difficulty === 'Mudah' ? 'Success' : 'Warning'} 
                            className="!text-[8px]"
                           />
                        </td>
                      </tr>
                    )}
                   />
                </div>
             </div>

             <div className="p-10 bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                   <AlertCircle size={20} className="text-indigo-500" />
                   <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Mohon periksa kembali data sebelum menyimpan ke database.</p>
                </div>
                <div className="flex items-center gap-4">
                   <button 
                    onClick={() => setIsImportModalOpen(false)}
                    className="px-8 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 transition-all hover:bg-slate-50"
                   >
                    Batalkan
                   </button>
                   <button 
                    onClick={confirmImport}
                    className="px-10 py-4 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 transition-all active:scale-95"
                   >
                    Konfirmasi & Simpan
                   </button>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
