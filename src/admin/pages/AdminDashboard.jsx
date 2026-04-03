import { Users, ClipboardCheck, TrendingUp, BookOpen } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import StatCard from '../components/StatCard';
import DataTable from '../components/DataTable';
import mockStudents from '../../data/mockStudents';

/**
 * Admin dashboard — overview with stats and student progress table.
 */
export default function AdminDashboard() {
  const stats = [
    { icon: Users, label: 'Total Siswa', value: '48', trend: 12, color: 'primary' },
    { icon: ClipboardCheck, label: 'Tryout Aktif', value: '5', trend: null, color: 'secondary' },
    { icon: TrendingUp, label: 'Rata-rata Nilai', value: '76.4', trend: 8, color: 'correct' },
    { icon: BookOpen, label: 'Bank Soal', value: '320', trend: 15, color: 'accent' },
  ];
  
  // Mock data for the chart
  const weeklyScores = [
    { name: 'Senin', nilai: 65 },
    { name: 'Selasa', nilai: 70 },
    { name: 'Rabu', nilai: 75 },
    { name: 'Kamis', nilai: 82 },
    { name: 'Jumat', nilai: 85 }
  ];

  const columns = [
    {
      key: 'name',
      label: 'Nama Siswa',
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
    {
      key: 'examsCompleted',
      label: 'Ujian Selesai',
      render: (value) => (
        <div className="flex items-center gap-2">
          <div className="w-16 h-2 bg-gray-100 dark:bg-dark-border rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
              style={{ width: `${(value / 5) * 100}%` }}
            />
          </div>
          <span className="text-gray-600 dark:text-gray-400 font-medium">{value}/5</span>
        </div>
      ),
    },
    {
      key: 'avgScore',
      label: 'Rata-rata',
      render: (value) => (
        <span className={`font-bold ${
          value >= 80 ? 'text-correct' : value >= 60 ? 'text-warning' : 'text-incorrect'
        }`}>
          {value}
        </span>
      ),
    },
    {
      key: 'lastActive',
      label: 'Terakhir Aktif',
      render: (value) => (
        <span className="text-gray-400 dark:text-gray-500">{value}</span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${
          value === 'active'
            ? 'bg-correct/10 text-correct'
            : 'bg-gray-100 dark:bg-dark-border text-gray-400 dark:text-gray-500'
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${
            value === 'active' ? 'bg-correct' : 'bg-gray-300 dark:bg-gray-600'
          }`} />
          {value === 'active' ? 'Aktif' : 'Tidak Aktif'}
        </span>
      ),
    },
  ];

  return (
    <div id="admin-dashboard" className="animate-fade-in">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-dark dark:text-white">Dashboard</h1>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Ringkasan data portal tryout</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>

      {/* Analytical Chart */}
      <div className="bg-white dark:bg-dark-surface rounded-2xl shadow-card dark:shadow-none border border-transparent dark:border-dark-border p-6 mb-8 mt-2">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-dark dark:text-white">Trend Rata-rata Nilai Tryout</h2>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Perkembangan nilai siswa dalam 5 hari terakhir</p>
        </div>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyScores} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#3D3D55" opacity={0.2} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#A0A0B8' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#A0A0B8' }} />
              <Tooltip 
                cursor={{ fill: '#6C5CE7', opacity: 0.1 }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}
              />
              <Bar dataKey="nilai" fill="#6C5CE7" radius={[6, 6, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Student Progress Table */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-dark dark:text-white">Progress Siswa</h2>
        <button className="text-sm text-primary font-medium hover:underline">
          Lihat Semua
        </button>
      </div>

      <DataTable columns={columns} data={mockStudents} />
    </div>
  );
}
