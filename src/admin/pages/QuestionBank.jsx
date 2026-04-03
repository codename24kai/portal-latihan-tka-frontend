import { useState } from 'react';
import { Plus, Search, Filter, BookOpen, Trash2, Edit3 } from 'lucide-react';
import DataTable from '../components/DataTable';
import QuestionForm from '../components/QuestionForm';

// Mock question bank data
const mockQuestionBank = [
  { id: 1, subject: 'Matematika', text: 'Hasil dari 2.456 + 3.789 − 1.234 adalah …', difficulty: 'Mudah', createdAt: '2026-03-20' },
  { id: 2, subject: 'Matematika', text: 'Sebuah persegi panjang memiliki panjang 12 cm dan lebar 8 cm...', difficulty: 'Sedang', createdAt: '2026-03-20' },
  { id: 3, subject: 'Bahasa Indonesia', text: 'Ide pokok dari paragraf di atas adalah…', difficulty: 'Mudah', createdAt: '2026-03-21' },
  { id: 4, subject: 'IPA', text: 'Proses fotosintesis menghasilkan…', difficulty: 'Sedang', createdAt: '2026-03-22' },
  { id: 5, subject: 'Matematika', text: 'Nilai dari 3/4 + 2/5 adalah …', difficulty: 'Mudah', createdAt: '2026-03-22' },
  { id: 6, subject: 'IPS', text: 'Proklamasi kemerdekaan Indonesia dibacakan pada…', difficulty: 'Mudah', createdAt: '2026-03-23' },
  { id: 7, subject: 'Bahasa Inggris', text: 'Choose the correct form: She ___ to school every day.', difficulty: 'Sedang', createdAt: '2026-03-24' },
  { id: 8, subject: 'IPA', text: 'Planet terbesar dalam tata surya kita adalah…', difficulty: 'Mudah', createdAt: '2026-03-25' },
];

export default function QuestionBank() {
  const [showForm, setShowForm] = useState(false);

  const difficultyColors = {
    Mudah: 'bg-correct/10 text-correct',
    Sedang: 'bg-warning/10 text-warning',
    Sulit: 'bg-incorrect/10 text-incorrect',
  };

  const columns = [
    {
      key: 'subject',
      label: 'Mapel',
      render: (value) => (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-primary-50 text-primary rounded-lg text-xs font-semibold">
          <BookOpen size={12} />
          {value}
        </span>
      ),
    },
    {
      key: 'text',
      label: 'Pertanyaan',
      render: (value) => (
        <p className="text-gray-700 dark:text-gray-300 truncate max-w-[200px] sm:max-w-md">{value}</p>
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
      render: (value) => <span className="text-gray-400 dark:text-gray-500">{value}</span>,
    },
    {
      key: 'id',
      label: 'Aksi',
      render: () => (
        <div className="flex items-center gap-2">
          <button className="w-8 h-8 rounded-lg bg-primary-50 dark:bg-primary/20 text-primary hover:bg-primary/10 dark:hover:bg-primary/30 flex items-center justify-center transition-colors">
            <Edit3 size={14} />
          </button>
          <button className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-500/10 text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 flex items-center justify-center transition-colors">
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div id="question-bank" className="animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-dark dark:text-white">Bank Soal</h1>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">{mockQuestionBank.length} soal tersedia</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={18} />
          Tambah Soal
        </button>
      </div>

      {/* Form toggle */}
      {showForm && (
        <div className="mb-6">
          <QuestionForm onClose={() => setShowForm(false)} />
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <input
            type="text"
            placeholder="Cari soal..."
            className="w-full h-10 pl-10 pr-4 bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border rounded-xl text-sm text-dark dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
          />
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
        </div>
        <button className="btn-ghost flex items-center justify-center gap-2 min-h-[40px] text-sm">
          <Filter size={16} />
          Filter
        </button>
      </div>

      <DataTable columns={columns} data={mockQuestionBank} />
    </div>
  );
}
