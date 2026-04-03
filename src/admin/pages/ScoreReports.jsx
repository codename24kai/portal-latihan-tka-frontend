import { Download, Filter, Search } from 'lucide-react';
import DataTable from '../components/DataTable';
import mockStudents from '../../data/mockStudents';

/**
 * Score reports page showing student exam results.
 */
export default function ScoreReports() {
  // Extended mock data with per-subject scores
  const reportData = mockStudents.map((s) => ({
    ...s,
    matematika: Math.round(s.avgScore + (Math.random() * 10 - 5)),
    bahasa: Math.round(s.avgScore + (Math.random() * 10 - 5)),
    ipa: Math.round(s.avgScore + (Math.random() * 10 - 5)),
    ips: Math.round(s.avgScore + (Math.random() * 10 - 5)),
  }));

  const scoreCell = (value) => (
    <span className={`font-bold ${
      value >= 80 ? 'text-correct' : value >= 60 ? 'text-warning' : 'text-incorrect'
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
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-xs font-bold">
            {row.avatar}
          </div>
          <div>
            <p className="font-semibold text-dark dark:text-white">{value}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500">Kelas {row.class}</p>
          </div>
        </div>
      ),
    },
    { key: 'matematika', label: 'MTK', render: scoreCell },
    { key: 'bahasa', label: 'B.Indo', render: scoreCell },
    { key: 'ipa', label: 'IPA', render: scoreCell },
    { key: 'ips', label: 'IPS', render: scoreCell },
    {
      key: 'avgScore',
      label: 'Rata-rata',
      render: (value) => (
        <div className="flex items-center gap-2">
          <div className="w-12 h-2 bg-gray-100 dark:bg-dark-border rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${
                value >= 80 ? 'bg-correct' : value >= 60 ? 'bg-warning' : 'bg-incorrect'
              }`}
              style={{ width: `${value}%` }}
            />
          </div>
          <span className={`font-bold text-sm ${
            value >= 80 ? 'text-correct' : value >= 60 ? 'text-warning' : 'text-incorrect'
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
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Rekapitulasi nilai siswa per mata pelajaran</p>
        </div>
        <button className="btn-ghost flex items-center gap-2">
          <Download size={16} />
          Export
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <input
            type="text"
            placeholder="Cari siswa..."
            className="w-full h-10 pl-10 pr-4 bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border rounded-xl text-sm text-dark dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
          />
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
        </div>
        <select className="h-10 px-4 bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border rounded-xl text-sm text-gray-600 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all">
          <option>Semua Kelas</option>
          <option>Kelas 6A</option>
          <option>Kelas 6B</option>
        </select>
        <button className="btn-ghost flex items-center justify-center gap-2 min-h-[40px] text-sm">
          <Filter size={16} />
          Filter
        </button>
      </div>

      <DataTable columns={columns} data={reportData} />
    </div>
  );
}
