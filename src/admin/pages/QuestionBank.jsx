import { useState, useMemo } from 'react';
import { Plus, Search, Filter, BookOpen, Trash2, Edit3, Upload } from 'lucide-react';
import DataTable from '../components/DataTable';
import QuestionForm from '../components/QuestionForm';
import { SUBJECT_CATEGORIES } from '../../constants/subjects';

// Mock question bank data - Updated with new subjects
const mockQuestionBank = [
  { id: 1, subject: 'Matematika', text: 'Hasil dari 2.456 + 3.789 − 1.234 adalah …', difficulty: 'Mudah', createdAt: '2026-03-20' },
  { id: 2, subject: 'Bahasa Indonesia', text: 'Ide pokok dari paragraf di atas adalah…', difficulty: 'Sedang', createdAt: '2026-03-21' },
  { id: 3, subject: 'Survei Lingkungan Belajar', text: 'Bagaimana kondisi fasilitas belajar di rumah Anda?', difficulty: 'Mudah', createdAt: '2026-03-22' },
  { id: 4, subject: 'Survei Karakter', text: 'Bagaimana sikap Anda jika melihat teman sedang diejek?', difficulty: 'Sedang', createdAt: '2026-03-22' },
  { id: 5, subject: 'Matematika', text: 'Nilai dari 3/4 + 2/5 adalah …', difficulty: 'Mudah', createdAt: '2026-03-22' },
];

const filters = [
  { label: 'Semua', category: 'all' },
  { label: 'Matematika', category: SUBJECT_CATEGORIES.AKADEMIK },
  { label: 'Bahasa Indonesia', category: SUBJECT_CATEGORIES.AKADEMIK },
  { label: 'Survei Lingkungan Belajar', category: SUBJECT_CATEGORIES.NON_AKADEMIK },
  { label: 'Survei Karakter', category: SUBJECT_CATEGORIES.NON_AKADEMIK },
];

export default function QuestionBank() {
  const [showForm, setShowForm] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredData = useMemo(() => {
    return mockQuestionBank.filter((q) => {
      const matchSubject = selectedSubject === 'Semua' || q.subject === selectedSubject;
      const matchSearch = q.text.toLowerCase().includes(searchQuery.toLowerCase());
      return matchSubject && matchSearch;
    });
  }, [selectedSubject, searchQuery]);

  const difficultyColors = {
    Mudah: 'bg-correct/10 text-correct dark:bg-correct/20',
    Sedang: 'bg-warning/10 text-warning dark:bg-warning/20',
    Sulit: 'bg-incorrect/10 text-incorrect dark:bg-incorrect/20',
  };

  const columns = [
    {
      key: 'subject',
      label: 'Mapel',
      render: (value) => {
        const isAcademic = value === 'Matematika' || value === 'Bahasa Indonesia';
        const badgeColor = isAcademic 
          ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300' 
          : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300';
        
        return (
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${badgeColor}`}>
            <BookOpen size={12} />
            {value}
          </span>
        );
      },
    },
    {
      key: 'text',
      label: 'Pertanyaan',
      render: (value) => (
        <p className="text-slate-700 dark:text-slate-300 truncate max-w-[200px] sm:max-w-md">{value}</p>
      ),
    },
    {
      key: 'difficulty',
      label: 'Tingkat',
      render: (value) => (
        <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${difficultyColors[value] || ''}`}>
          {value}
        </span>
      ),
    },
    {
      key: 'createdAt',
      label: 'Dibuat',
      render: (value) => <span className="text-slate-400 dark:text-slate-500">{value}</span>,
    },
    {
      key: 'id',
      label: 'Aksi',
      render: () => (
        <div className="flex items-center gap-2">
          <button className="w-8 h-8 rounded-lg bg-primary-50 dark:bg-slate-800 text-primary dark:text-slate-300 border border-transparent dark:border-slate-700 hover:bg-primary-100 dark:hover:bg-slate-700 flex items-center justify-center transition-colors">
            <Edit3 size={14} />
          </button>
          <button className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-500/10 text-red-500 dark:text-red-400 border border-transparent dark:border-red-500/20 hover:bg-red-100 dark:hover:bg-red-500/20 flex items-center justify-center transition-colors">
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div id="question-bank" className="animate-fade-in text-dark dark:text-white">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-dark dark:text-white">Bank Soal</h1>
          <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">{mockQuestionBank.length} soal tersedia</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => alert('Fitur Import Soal akan segera tersedia!')}
            className="btn-ghost flex items-center gap-2 bg-white dark:bg-slate-800 border-2 border-primary-50 dark:border-slate-700 text-primary dark:text-white"
          >
            <Upload size={18} />
            Import Soal
          </button>
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={18} />
            Tambah Soal
          </button>
        </div>
      </div>

      {/* Form toggle */}
      {showForm && (
        <div className="mb-6">
          <QuestionForm onClose={() => setShowForm(false)} />
        </div>
      )}

      {/* Subject Filter Bar - Grouped Colors */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        {filters.map((f) => {
          const isActive = selectedSubject === f.label;
          let colorClass = '';
          
          if (isActive) {
            if (f.category === SUBJECT_CATEGORIES.AKADEMIK) {
              colorClass = 'bg-primary text-white border-primary shadow-lg shadow-primary/30';
            } else if (f.category === SUBJECT_CATEGORIES.NON_AKADEMIK) {
              colorClass = 'bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-600/30';
            } else {
              colorClass = 'bg-slate-800 text-white border-slate-800 dark:bg-white dark:text-slate-900';
            }
          } else {
            colorClass = 'bg-slate-100 text-slate-600 border-transparent hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700';
          }
          
          return (
            <button
              key={f.label}
              onClick={() => setSelectedSubject(f.label)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${colorClass}`}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari soal..."
            className="w-full h-10 pl-10 pr-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-dark dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
          />
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
        </div>
        <button className="px-4 py-2 bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 border border-transparent dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl flex items-center justify-center gap-2 min-h-[40px] text-sm transition-all">
          <Filter size={16} />
          Filter Lanjut
        </button>
      </div>

      <DataTable columns={columns} data={filteredData} />
    </div>
  );
}
