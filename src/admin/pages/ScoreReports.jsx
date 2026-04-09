import { useState, useMemo } from 'react';
import { Download, Filter, Search } from 'lucide-react';
import DataTable from '../components/DataTable';
import mockStudents from '../../data/mockStudents';

/**
 * Score reports page showing student exam results.
 */
export default function ScoreReports() {
  const [selectedClass, setSelectedClass] = useState('Semua Kelas');
  const [searchQuery, setSearchQuery] = useState('');

  const classes = ['Semua Kelas', 'Kelas 6A', 'Kelas 6B', 'Kelas 6C'];

  // Extended mock data with per-subject scores
  const reportData = useMemo(() => {
    return mockStudents
      .map((s) => ({
        ...s,
        matematika: Math.round(s.avgScore + (Math.random() * 10 - 5)),
        bahasa: Math.round(s.avgScore + (Math.random() * 10 - 5)),
        slb: Math.round(s.avgScore + (Math.random() * 10 - 5)),
        sk: Math.round(s.avgScore + (Math.random() * 10 - 5)),
      }))
      .filter((s) => {
        const matchClass = selectedClass === 'Semua Kelas' || s.class === selectedClass.replace('Kelas ', '');
        const matchSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchClass && matchSearch;
      });
  }, [selectedClass, searchQuery]);

  const scoreCell = (value) => (
    <span className={`font-bold ${
      value >= 80 ? 'text-emerald-600 dark:text-emerald-400' : value >= 60 ? 'text-amber-600 dark:text-amber-400' : 'text-rose-600 dark:text-rose-400'
    }`}>
      {value}
    </span>
  );

  const columns = [
    {
      key: 'name',
      label: 'Nama',
      render: (value, row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
            {row.avatar}
          </div>
          <div>
            <p className="font-semibold text-dark dark:text-slate-200">{value}</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 transition-colors group-hover:text-slate-500">Kelas {row.class}</p>
          </div>
        </div>
      ),
    },
    { key: 'matematika', label: 'MTK', render: scoreCell },
    { key: 'bahasa', label: 'B.Indo', render: scoreCell },
    { key: 'slb', label: 'SLB', render: scoreCell },
    { key: 'sk', label: 'SK', render: scoreCell },
    {
      key: 'avgScore',
      label: 'Rata-rata',
      render: (value) => (
        <div className="flex items-center gap-2">
          <div className="w-12 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                value >= 80 ? 'bg-emerald-500' : value >= 60 ? 'bg-amber-500' : 'bg-rose-500'
              }`}
              style={{ width: `${value}%` }}
            />
          </div>
          <span className={`font-bold text-sm ${
            value >= 80 ? 'text-emerald-600 dark:text-emerald-400' : value >= 60 ? 'text-amber-600 dark:text-amber-400' : 'text-rose-600 dark:text-rose-400'
          }`}>
            {value}
          </span>
        </div>
      ),
    },
  ];

  return (
    <div id="score-reports" className="animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-dark dark:text-white">Laporan Nilai</h1>
          <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Rekapitulasi nilai siswa per mata pelajaran</p>
        </div>
        {/* Export Data Button - Styled to match ModuleManagement.jsx 'Tambah materi' button */}
        <button className="bg-primary hover:bg-primary-dark text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2 shadow-lg shadow-primary/20">
          <Download size={16} />
          Export Data
        </button>
      </div>

      {/* Class Filter Bar */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        {classes.map((cls) => (
          <button
            key={cls}
            onClick={() => setSelectedClass(cls)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
              selectedClass === cls
                ? 'bg-indigo-600 text-white border-indigo-600 dark:bg-indigo-900 dark:text-indigo-200 dark:border-indigo-700'
                : 'bg-slate-100 text-slate-600 border-transparent hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-700'
            }`}
          >
            {cls}
          </button>
        ))}
      </div>

      {/* Search & Meta Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari siswa..."
            className="w-full h-10 pl-10 pr-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-dark dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 dark:focus:ring-indigo-900/50 focus:border-indigo-500 transition-all"
          />
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
        </div>
        <button className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-transparent dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl flex items-center justify-center gap-2 min-h-[40px] text-sm transition-all">
          <Filter size={16} />
          Filter Lanjut
        </button>
      </div>

      <DataTable columns={columns} data={reportData} />
    </div>
  );
}
