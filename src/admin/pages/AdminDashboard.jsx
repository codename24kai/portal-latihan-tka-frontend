import React from 'react';
import { Users, ClipboardCheck, TrendingUp, BookOpen, Crown, Zap } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  PieChart, Pie, Cell
} from 'recharts';
import StatCard from '../components/StatCard';

/**
 * Admin dashboard — advanced analytics overview.
 * Updated with "Tinted & Soft" Light Mode aesthetic.
 */
export default function AdminDashboard() {
  const stats = [
    { icon: Users, label: 'Total Siswa', value: '48', trend: 12, color: 'primary' },
    { icon: ClipboardCheck, label: 'Tryout Aktif', value: '5', trend: null, color: 'secondary' },
    { icon: TrendingUp, label: 'Rata-rata Nilai', value: '76.4', trend: 8, color: 'correct' },
    { icon: BookOpen, label: 'Bank Soal', value: '320', trend: 15, color: 'accent' },
  ];

  // Mock data: Class Comparison (Bar Chart)
  const classComparisonData = [
    { subject: 'Bahasa Indonesia', classA: 85, classB: 88 },
    { subject: 'Matematika', classA: 78, classB: 72 },
    { subject: 'Survei Lingkungan', classA: 82, classB: 79 },
    { subject: 'Survei Karakter', classA: 75, classB: 80 },
  ];

  // Mock data: Subject Averages (Pie Chart)
  const subjectAverageData = [
    { subject: 'Bahasa Indonesia', score: 86, fullMark: 100 },
    { subject: 'Matematika', score: 75, fullMark: 100 },
    { subject: 'Survei Lingkungan', score: 80, fullMark: 100 },
    { subject: 'Survei Karakter', score: 77, fullMark: 100 },
  ];

  // Colors: Indigo (Akademik 1), Blue (Akademik 2), Emerald (Non-Akad 1), Teal (Non-Akad 2)
  const PIE_COLORS = ['#6366F1', '#3B82F6', '#10B981', '#14B8A6'];

  // Mock data: Top Scoring Students
  const topStudents = [
    { id: 1, name: 'Budi Santoso', class: '6A', score: 95, avatar: 'BS' },
    { id: 2, name: 'Siti Aminah', class: '6B', score: 93, avatar: 'SA' },
    { id: 3, name: 'Agus Pratama', class: '6A', score: 91, avatar: 'AP' },
    { id: 4, name: 'Dewi Lestari', class: '6C', score: 89, avatar: 'DL' },
    { id: 5, name: 'Andi Wijaya', class: '6B', score: 88, avatar: 'AW' },
  ];

  // Mock data: Most Active Users
  const activeUsers = [
    { id: 1, name: 'Rina Melati', class: '6B', exams: 12, avatar: 'RM' },
    { id: 2, name: 'Budi Santoso', class: '6A', exams: 10, avatar: 'BS' },
    { id: 3, name: 'Siti Aminah', class: '6B', exams: 9, avatar: 'SA' },
    { id: 4, name: 'Fajar Hidayat', class: '6C', exams: 8, avatar: 'FH' },
    { id: 5, name: 'Dewi Lestari', class: '6C', exams: 7, avatar: 'DL' },
  ];

  // Custom Tooltip for Bar Chart
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-900 p-3 rounded-xl shadow-xl shadow-indigo-100/50 dark:shadow-none border border-indigo-50 dark:border-slate-800">
          <p className="font-bold text-slate-700 dark:text-white mb-2">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-300">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
              <span>{entry.name === 'classA' ? 'Kelas 6A' : entry.name === 'classB' ? 'Kelas 6B' : entry.name}:</span>
              <span className="font-bold">{entry.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-6 md:p-8 space-y-6 animate-fade-in pb-12">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-700 dark:text-white">Dashboard Analytics</h1>
        <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">Analisis performa siswa dan wawasan tryout</p>
      </div>

      {/* Stat Cards - Preserving StatCard internals but ensuring Grid is clean */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>

      {/* Analytical Charts Row - Tinted & Soft styling */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-2">
        {/* Bar Chart: Class Comparison */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-indigo-50 dark:border-slate-800 shadow-sm shadow-indigo-100/50 dark:shadow-none p-6 flex flex-col transition-all">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-slate-700 dark:text-white">Perbandingan Kelas (6A vs 6B)</h2>
            <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">Rata-rata nilai berdasarkan mata pelajaran</p>
          </div>
          <div className="h-72 w-full mt-auto">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={classComparisonData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#A0A0B8" opacity={0.1} />
                <XAxis dataKey="subject" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#A0A0B8' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#A0A0B8' }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ paddingTop: '10px' }}
                  payload={[
                    { value: 'Kelas 6A', type: 'rect', color: '#6366F1' },
                    { value: 'Kelas 6B', type: 'rect', color: '#10B981' }
                  ]}
                />
                <Bar dataKey="classA" name="Kelas 6A" fill="#6366F1" radius={[4, 4, 0, 0]} maxBarSize={30} />
                <Bar dataKey="classB" name="Kelas 6B" fill="#10B981" radius={[4, 4, 0, 0]} maxBarSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart: Subject Performance */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-indigo-50 dark:border-slate-800 shadow-sm shadow-indigo-100/50 dark:shadow-none p-6 flex flex-col transition-all">
          <div className="mb-2">
            <h2 className="text-lg font-bold text-slate-700 dark:text-white">Pemetaan Kemampuan Siswa</h2>
            <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">Agregasi nilai rata-rata tiap subjek</p>
          </div>
          <div className="h-72 w-full mt-auto">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={subjectAverageData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="score"
                  nameKey="subject"
                >
                  {subjectAverageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: '12px',
                    border: 'none',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                    backgroundColor: 'rgba(30, 41, 59, 0.95)',
                    color: '#F8FAFC'
                  }}
                  itemStyle={{ color: '#F1F5F9', fontWeight: 'bold' }}
                />
                <Legend
                  layout="horizontal"
                  verticalAlign="bottom"
                  align="center"
                  wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Leaderboard Row - Tinted cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Scoring Students */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-indigo-50 dark:border-slate-800 shadow-sm shadow-indigo-100/50 dark:shadow-none p-6 transition-all">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-orange-500/10 flex items-center justify-center text-amber-600">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-700 dark:text-white">Top Scorer</h2>
              <p className="text-xs text-slate-500 dark:text-slate-500">Nilai rata-rata tertinggi tingkat 6</p>
            </div>
          </div>
          <div className="space-y-4">
            {topStudents.map((student, idx) => (
              <div key={student.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-indigo-50/50 dark:hover:bg-slate-800 transition-colors cursor-default group">
                <div className="flex items-center gap-3">
                  <div className={`font-bold w-6 text-center ${idx < 3 ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`}>
                    #{idx + 1}
                  </div>
                  <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-slate-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-xs font-bold shrink-0">
                    {student.avatar}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-700 dark:text-white text-sm group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{student.name}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-500">Kelas {student.class}</p>
                  </div>
                </div>
                <div className="font-bold text-emerald-600 dark:text-emerald-400">
                  {student.score}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Most Active Users */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-indigo-50 dark:border-slate-800 shadow-sm shadow-indigo-100/50 dark:shadow-none p-6 transition-all">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center text-blue-600">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-700 dark:text-white">Siswa Teraktif</h2>
              <p className="text-xs text-slate-500 dark:text-slate-500">Tryout yang paling sering diselesaikan</p>
            </div>
          </div>
          <div className="space-y-4">
            {activeUsers.map((user, idx) => (
              <div key={user.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-indigo-50/50 dark:hover:bg-slate-800 transition-colors cursor-default group">
                <div className="flex items-center gap-3">
                  <div className={`font-bold w-6 text-center text-slate-400`}>
                    #{idx + 1}
                  </div>
                  <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 text-xs font-bold shrink-0">
                    {user.avatar}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-700 dark:text-white text-sm group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{user.name}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-500">Kelas {user.class}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-bold text-slate-700 dark:text-white">{user.exams}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-500">tryout</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
