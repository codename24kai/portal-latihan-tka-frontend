import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Download, 
  FileText, 
  Table as TableIcon, 
  Calendar, 
  Search,
  TrendingUp,
  AlertCircle,
  ChevronRight,
  HelpCircle,
  Filter
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import toast from 'react-hot-toast';
import { useDarkMode } from '../../hooks/useDarkMode';
import DataTable from '../../components/ui/DataTable';
import Badge from '../../components/ui/Badge';
import ProgressBar from '../../components/ui/ProgressBar';
import Dropdown from '../../components/ui/Dropdown';
import mockStudents from '../../data/mockStudents';

export default function GuruScoreReports() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('Semua Mapel');
  const { isDark } = useDarkMode();
  const assignedClass = localStorage.getItem('assignedClass') ?? '';

  // Mock data for Trend Chart
  const performanceTrend = [
    { month: 'Jan', matematika: 72, bahasa: 78 },
    { month: 'Feb', matematika: 68, bahasa: 80 },
    { month: 'Mar', matematika: 75, bahasa: 82 },
    { month: 'Apr', matematika: 80, bahasa: 85 },
  ];

  // Mock data for Item Analysis (Most failed questions)
  const itemAnalysis = [
    { id: 'M-01', subject: 'Matematika', topic: 'Pecahan Campuran', rate: 45 },
    { id: 'M-07', subject: 'Matematika', topic: 'Aljabar Dasar', rate: 38 },
    { id: 'B-12', subject: 'B. Indonesia', topic: 'Teks Eksplanasi', rate: 52 },
    { id: 'M-15', subject: 'Matematika', topic: 'Volume Bangun Ruang', rate: 60 },
    { id: 'B-03', subject: 'B. Indonesia', topic: 'Struktur Puisi', rate: 70 },
  ].sort((a, b) => a.rate - b.rate);

  const filteredData = useMemo(() => {
    const processed = (mockStudents ?? [])
      .filter(s => s?.class === assignedClass)
      .map(s => ({
        ...s,
        matematika: Math.max(0, Math.min(100, Math.round((s?.avgScore ?? 0) + (s?.id % 2 === 0 ? 5 : -5)))),
        bahasa: Math.max(0, Math.min(100, Math.round((s?.avgScore ?? 0) + (s?.id % 3 === 0 ? 3 : -2)))),
      }));

    return processed
      .filter(s => (s?.name ?? '').toLowerCase().includes(searchQuery.toLowerCase()))
      .filter(s => {
        if (subjectFilter === 'Semua Mapel') return true;
        // Logic: if filtering by Math, show only those with math scores in focus
        // For now, since table shows both, we'll just return true or filter based on a threshold
        return true; 
      });
  }, [assignedClass, searchQuery, subjectFilter]);

  const headers = [
    { label: 'Siswa' },
    { label: 'Matematika', align: 'center' },
    { label: 'B. Indonesia', align: 'center' },
    { label: 'Progress', align: 'center' },
  ];

  const scoreBadgeVariant = (value) => {
    if (value >= 80) return "Success";
    if (value >= 65) return "Warning";
    return "Danger";
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-900 px-4 py-3 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800">
          <p className="font-black text-slate-800 dark:text-white mb-2 text-xs uppercase tracking-widest">{label}</p>
          <div className="space-y-1.5">
            {payload.map((entry, index) => (
              <div key={index} className="flex items-center gap-3 text-sm">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                <span className="text-slate-500 dark:text-slate-400 font-medium lowercase first-letter:uppercase">{entry.name}:</span>
                <span className="font-black text-slate-800 dark:text-white">{entry.value}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  const renderRow = (student) => (
    <tr key={student?.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors group">
      <td className="py-6 px-8">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-700 flex items-center justify-center text-slate-400 font-black text-xs border border-slate-100 dark:border-slate-600 uppercase">
            {student?.avatar ?? student?.name?.charAt(0)}
          </div>
          <div>
            <p className="font-black text-slate-800 dark:text-white text-sm uppercase tracking-tight group-hover:text-orange-600 transition-colors">{student?.name}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Siswa Kelas {assignedClass}</p>
          </div>
        </div>
      </td>
      <td className={`py-6 px-4 text-center transition-opacity ${subjectFilter === 'Bahasa Indonesia' ? 'opacity-30' : 'opacity-100'}`}>
        <Badge text={(student?.matematika ?? 0).toString()} variant={scoreBadgeVariant(student?.matematika)} />
      </td>
      <td className={`py-6 px-4 text-center transition-opacity ${subjectFilter === 'Matematika' ? 'opacity-30' : 'opacity-100'}`}>
        <Badge text={(student?.bahasa ?? 0).toString()} variant={scoreBadgeVariant(student?.bahasa)} />
      </td>
      <td className="py-6 px-8 min-w-[200px]">
        <ProgressBar 
          progress={student?.avgScore ?? 0} 
          color={(student?.avgScore ?? 0) >= 80 ? "bg-teal-500" : (student?.avgScore ?? 0) >= 65 ? "bg-amber-500" : "bg-rose-500"} 
        />
      </td>
    </tr>
  );

  const gridColor = isDark ? '#1E293B' : '#F1F5F9';
  const tickColor = isDark ? '#64748B' : '#94A3B8';

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      {/* Header */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-black text-orange-600 uppercase tracking-[0.2em] mb-2">
            <Calendar size={14} /> Statistik Akademik Kelas {assignedClass}
          </div>
          <h1 className="text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tight leading-none">Laporan Nilai Siswa</h1>
          <p className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-widest italic">Monitoring hasil tryout dan perkembangan akademik</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={() => toast.success('Mengekspor laporan PDF...')}
            className="h-12 px-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:shadow-lg transition-all active:scale-95"
          >
            <FileText size={18} className="text-rose-500" /> Export PDF
          </button>
          <button 
            onClick={() => toast.success('Mengekspor data Excel...')}
            className="h-12 px-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:shadow-lg transition-all active:scale-95"
          >
            <TableIcon size={18} className="text-teal-600" /> Export Excel
          </button>
        </div>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Trend Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-widest">Tren Performa Kelas</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Perbandingan Matematika vs Bahasa Indonesia</p>
            </div>
            <div className="flex items-center gap-4">
               <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-teal-500" />
                 <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">MTK</span>
               </div>
               <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-orange-500" />
                 <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">B.INDO</span>
               </div>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorMtk" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#14B8A6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorIndo" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: tickColor, fontWeight: 'bold' }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: tickColor, fontWeight: 'bold' }} 
                />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="matematika" 
                  name="Matematika"
                  stroke="#14B8A6" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorMtk)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="bahasa" 
                  name="Bahasa Indonesia"
                  stroke="#F59E0B" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorIndo)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Item Analysis Widget */}
        <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-widest">Soal Paling Sulit</h3>
            <AlertCircle size={20} className="text-rose-500" />
          </div>
          <div className="space-y-5">
            {itemAnalysis.map((item) => (
              <div key={item.id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.id}</span>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200 tracking-tight uppercase">{item.topic}</span>
                  </div>
                  <span className={`text-[10px] font-black ${item.rate < 50 ? 'text-rose-600' : 'text-amber-600'}`}>{item.rate}%</span>
                </div>
                <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${item.rate < 50 ? 'bg-rose-500' : 'bg-amber-500'}`} 
                    style={{ width: `${item.rate}%` }} 
                  />
                </div>
              </div>
            ))}
          </div>
          <button 
            onClick={() => navigate('/guru/reports?view=detailed')}
            className="w-full mt-8 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-orange-600 transition-colors flex items-center justify-center gap-2"
          >
            Lihat Analisis Detail <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
           <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-widest flex items-center gap-2">
             <TrendingUp size={18} className="text-teal-600" /> Rincian Nilai Per Siswa
           </h3>
           <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="relative min-w-[240px]">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari nama siswa..."
                  className="w-full h-12 pl-12 pr-6 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl text-xs font-bold placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all dark:text-white shadow-sm"
                />
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
              <Dropdown 
                value={subjectFilter}
                onChange={setSubjectFilter}
                options={[
                  { value: 'Semua Mapel', label: 'Semua Mapel' },
                  { value: 'Matematika', label: 'Matematika' },
                  { value: 'Bahasa Indonesia', label: 'B. Indonesia' }
                ]}
                className="min-w-[160px]"
              />
           </div>
        </div>

        <DataTable
          headers={headers}
          data={filteredData}
          rowsPerPage={10}
          renderRow={renderRow}
        />
      </div>
    </div>
  );
}
