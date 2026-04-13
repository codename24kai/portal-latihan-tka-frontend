import React from 'react';
import {
  Users,
  ClipboardCheck,
  TrendingUp,
  BookOpen,
  Crown,
  Zap,
  AlertTriangle,
  ChevronDown,
  Download,
  Search,
  ArrowRight,
  MoreHorizontal
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import StatCard from '../components/StatCard';
import Badge from '../../components/ui/Badge';
import ProgressBar from '../../components/ui/ProgressBar';

/**
 * Admin dashboard — advanced analytics overview.
 * Overhauled for professional clarity and actionability.
 */
export default function AdminDashboard() {
  const stats = [
    { icon: Users, label: 'Total Siswa', value: '48', trend: 12, color: 'indigo' },
    { icon: ClipboardCheck, label: 'Tryout Aktif', value: '5', trend: null, color: 'teal' },
    { icon: TrendingUp, label: 'Rata-rata Nilai', value: '76.4', trend: 8, color: 'orange' },
    { icon: BookOpen, label: 'Bank Soal', value: '320', trend: 15, color: 'yellow' },
  ];

  // Separated Data: Academic Subjects
  const academicComparisonData = [
    { subject: 'B. Indonesia', classA: 85, classB: 88 },
    { subject: 'Matematika', classA: 78, classB: 72 },
  ];

  // Separated Data: Survey Data
  const surveyComparisonData = [
    { subject: 'Lingkungan', classA: 82, classB: 79 },
    { subject: 'Karakter', classA: 75, classB: 80 },
  ];

  // Mock data: Subject Competency (Radar Chart)
  const radarData = [
    { subject: 'Matematika', score: 75, fullMark: 100 },
    { subject: 'B. Indonesia', score: 86, fullMark: 100 },
    { subject: 'S. Lingkungan', score: 80, fullMark: 100 },
    { subject: 'S. Karakter', score: 77, fullMark: 100 },
  ];

  const attentionStudents = [
    { id: 1, name: 'Andi Wijaya', class: '6B', score: 58, subject: 'Matematika' },
    { id: 2, name: 'Siti Aminah', class: '6A', score: 55, subject: 'B. Indonesia' },
    { id: 3, name: 'Fajar Hidayat', class: '6C', score: 52, subject: 'Matematika' },
  ];

  const topStudents = [
    { id: 1, name: 'Budi Santoso', class: '6A', score: 95, avatar: 'BS' },
    { id: 2, name: 'Siti Aminah', class: '6B', score: 93, avatar: 'SA' },
    { id: 3, name: 'Agus Pratama', class: '6A', score: 91, avatar: 'AP' },
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-900 px-4 py-3 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800">
          <p className="font-black text-slate-800 dark:text-white mb-2 text-xs uppercase tracking-widest">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="text-slate-500 dark:text-slate-400">{entry.name}:</span>
              <span className="font-black text-slate-800 dark:text-white">{entry.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const ChartHeader = ({ title, subtitle }) => (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <div>
        <h2 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight">{title}</h2>
        <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">{subtitle}</p>
      </div>
      <div className="flex items-center gap-2">
        <button className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-teal-600 transition-colors">
          Minggu Ini <ChevronDown size={14} />
        </button>
      </div>
    </div>
  );

  return (
    <div className="p-6 md:p-8 space-y-8 animate-fade-in pb-12">

      {/* 1. ALERT BANNER */}
      <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-900/50 rounded-2xl p-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-100 dark:bg-orange-500/20 rounded-xl flex items-center justify-center text-orange-600">
            <AlertTriangle size={20} />
          </div>
          <div>
            <h4 className="text-sm font-black text-orange-800 dark:text-orange-400 uppercase tracking-tight">Perhatian Ujian</h4>
            <p className="text-xs font-bold text-orange-700/60 dark:text-orange-300/60">Ada 5 siswa yang belum mengerjakan Tryout MATEMATIKA minggu ini.</p>
          </div>
        </div>
        <button className="px-4 py-2 bg-orange-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-orange-700 transition-colors shrink-0">
          Lihat Daftar
        </button>
      </div>

      {/* 2. PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight italic">Dashboard <span className="text-teal-600 text-not-italic">Analytics</span></h1>
          <p className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-widest">Wawasan komprehensif performa akademik siswa</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-black uppercase tracking-[0.2em] text-slate-600 dark:text-slate-300 hover:shadow-lg transition-all active:scale-95">
          <Download size={16} className="text-teal-600 dark:text-teal-400" /> Export Laporan
        </button>
      </div>

      {/* 3. STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>

      {/* 4. MAIN ANALYTICS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Academic Comparison - 2/3 Width */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-800 shadow-sm">
          <ChartHeader title="Analisis Performa Kelas" subtitle="Perbandingan Nilai Akademik (6A vs 6B)" />

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={academicComparisonData} margin={{ top: 0, right: 0, left: -25, bottom: 0 }} barGap={12}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.5} />
                <XAxis dataKey="subject" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94A3B8', fontWeight: 'bold' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94A3B8', fontWeight: 'bold' }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em' }} />
                <Bar dataKey="classA" name="Kelas 6A" fill="#14B8A6" radius={[6, 6, 0, 0]} maxBarSize={40} />
                <Bar dataKey="classB" name="Kelas 6B" fill="#F59E0B" radius={[6, 6, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Competency Radar - 1/3 Width */}
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col">
          <ChartHeader title="Kompetensi" subtitle="Pemetaan Kekuatan Siswa" />

          <div className="h-80 w-full mt-auto">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="#E2E8F0" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 9, fill: '#94A3B8', fontWeight: 'bold' }} />
                <Radar name="Siswa" dataKey="score" stroke="#14B8A6" fill="#14B8A6" fillOpacity={0.6} />
                <Tooltip content={<CustomTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 5. SECONDARY ROW: SURVEYS & ATTENTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Survey Data Section */}
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-800 shadow-inner">
          <ChartHeader title="Survei Karakter & Lingkungan" subtitle="Metrik Non-Akademik Siswa" />
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={surveyComparisonData} layout="vertical" margin={{ top: 0, right: 30, left: 40, bottom: 0 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="subject" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94A3B8', fontWeight: 'bold' }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="classA" name="Kelas 6A" fill="#14B8A6" radius={[0, 4, 4, 0]} barSize={12} />
                <Bar dataKey="classB" name="Kelas 6B" fill="#F59E0B" radius={[0, 4, 4, 0]} barSize={12} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Siswa Perlu Perhatian Widget */}
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight">Siswa Perlu Perhatian</h2>
              <p className="text-xs font-bold text-rose-500 mt-1 uppercase tracking-widest italic">Di bawah rata-rata ({"<"}60)</p>
            </div>
            <button className="text-slate-400 hover:text-teal-600 transition-colors">
              <MoreHorizontal size={20} />
            </button>
          </div>

          <div className="space-y-4">
            {attentionStudents.map((s) => (
              <div key={s.id} className="group flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl hover:bg-rose-50 dark:hover:bg-rose-900/10 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-700 flex items-center justify-center text-xs font-black text-rose-500 shadow-sm border border-rose-100 dark:border-rose-900/30">
                    {s.score}
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-800 dark:text-white group-hover:text-rose-600 transition-colors">{s.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge text={s.class} variant="Neutral" className="text-[8px]" />
                      <Badge text={s.subject} variant="Info" className="text-[8px]" />
                    </div>
                  </div>
                </div>
                <button className="w-8 h-8 rounded-full bg-white dark:bg-slate-700 flex items-center justify-center text-slate-400 group-hover:bg-rose-500 group-hover:text-white transition-all shadow-sm">
                  <ArrowRight size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
