import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Download, 
  FileText, 
  Table as TableIcon, 
  Calendar, 
  Search,
  TrendingUp,
  ChevronRight,
  HelpCircle,
  Filter,
  History,
  X,
  Info
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import toast from 'react-hot-toast';
import { useDarkMode } from '@/hooks/useModGelap';
import DataTable from '@/komponen/ui/TabelData';
import Badge from '@/komponen/ui/Badge';
import ProgressBar from '@/komponen/ui/BarProgres';
import Dropdown from '@/komponen/ui/Dropdown';
import ExportOptions from '@/komponen/guru/ExportOptions';
import mockStudents from '@/data/mockSiswa';

export default function GuruScoreReports() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('Semua Mapel');
  const [selectedChartFilter, setSelectedChartFilter] = useState('Semua Tipe');
  const [selectedSessionId, setSelectedSessionId] = useState('');
  
  // T2: Custom Export States
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState('PDF'); // 'PDF' | 'Excel'
  const [exportScope, setExportScope] = useState('Semua'); // 'Semua' | 'Lulus' | 'Remedial'
  const [exportColumns, setExportColumns] = useState({
    matematika: true,
    bahasa: true,
    progress: true
  });
  const [isExporting, setIsExporting] = useState(false);

  const { isDark } = useDarkMode();
  const assignedClass = localStorage.getItem('assignedClass') ?? '';

  // Mock data for Historical Exams
  const historicalExams = useMemo(() => [
    { name: 'Simulasi TKA #1', type: 'Simulasi TKA', date: '12 Jan 2026', avgScore: 74.5 },
    { name: 'Latihan Mandiri', type: 'Latihan Mandiri', date: '25 Jan 2026', avgScore: 78.2 },
    { name: 'Kuis Harian Aljabar', type: 'Latihan Mandiri', date: '08 Feb 2026', avgScore: 71.8 },
    { name: 'Simulasi TKA #2', type: 'Simulasi TKA', date: '22 Feb 2026', avgScore: 80.5 },
    { name: 'Latihan Volume', type: 'Latihan Mandiri', date: '10 Mar 2026', avgScore: 83.0 },
    { name: 'Simulasi TKA Akbar', type: 'Simulasi TKA', date: '05 Apr 2026', avgScore: 85.4 },
  ], []);

  const filteredChartData = useMemo(() => {
    if (selectedChartFilter === 'Semua Tipe') return historicalExams;
    return (historicalExams ?? []).filter(exam => exam?.type === selectedChartFilter);
  }, [historicalExams, selectedChartFilter]);

  const historyHeaders = [
    { label: 'Nama Latihan/Tryout' },
    { label: 'Jenis', align: 'center' },
    { label: 'Tanggal Pelaksanaan', align: 'center' },
    { label: 'Rata-rata Nilai Kelas', align: 'center' },
  ];

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
        return true; 
      });
  }, [assignedClass, searchQuery, subjectFilter]);

  const sessionStudentScores = useMemo(() => {
    if (!selectedSessionId) return [];
    return (filteredData ?? []).map((student) => {
      const seed = (student.id ?? 0) + (selectedSessionId?.length ?? 0) * 3;
      const score = 55 + (seed % 41);
      const status = score >= 70 ? 'Lulus' : 'Remedial';
      return {
        id: student.id,
        name: student.name,
        avatar: student.avatar,
        score,
        status
      };
    });
  }, [filteredData, selectedSessionId]);

  const sessionHeaders = [
    { label: 'No', align: 'center' },
    { label: 'Nama Siswa' },
    { label: 'Nilai', align: 'center' },
    { label: 'Status', align: 'center' },
  ];

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

  const renderHistoryRow = (exam) => (
    <tr key={exam?.name} className="hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors group">
      <td className="py-6 px-8">
        <p className="font-black text-slate-800 dark:text-white text-sm uppercase tracking-tight group-hover:text-orange-600 transition-colors">
          {exam?.name}
        </p>
      </td>
      <td className="py-6 px-4 text-center">
        <Badge 
          text={exam?.type} 
          variant={exam?.type === 'Simulasi TKA' ? 'Success' : 'Warning'} 
        />
      </td>
      <td className="py-6 px-4 text-center text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-wider">
        {exam?.date}
      </td>
      <td className="py-6 px-4 text-center">
        <Badge text={(exam?.avgScore ?? 0).toFixed(1)} variant={scoreBadgeVariant(exam?.avgScore)} />
      </td>
    </tr>
  );

  const renderSessionRow = (studentScore, index) => (
    <tr key={studentScore?.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors group">
      <td className="py-6 px-4 text-center font-bold text-slate-400 dark:text-slate-500 text-xs">
        {index + 1}
      </td>
      <td className="py-6 px-8">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-700 flex items-center justify-center text-slate-400 font-black text-xs border border-slate-100 dark:border-slate-600 uppercase">
            {studentScore?.avatar ?? studentScore?.name?.charAt(0)}
          </div>
          <div>
            <p className="font-black text-slate-800 dark:text-white text-sm uppercase tracking-tight group-hover:text-orange-600 transition-colors">
              {studentScore?.name}
            </p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
              Siswa Kelas {assignedClass}
            </p>
          </div>
        </div>
      </td>
      <td className="py-6 px-4 text-center">
        <Badge text={(studentScore?.score ?? 0).toString()} variant={scoreBadgeVariant(studentScore?.score)} />
      </td>
      <td className="py-6 px-4 text-center">
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
          studentScore?.status === 'Lulus' 
            ? 'bg-teal-50 text-teal-600 dark:bg-teal-950/30 dark:text-teal-400' 
            : 'bg-rose-50 text-rose-600 dark:bg-rose-950/30 dark:text-rose-400'
        }`}>
          {studentScore?.status}
        </span>
      </td>
    </tr>
  );

  const handleStartExport = (e) => {
    e.preventDefault();
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      setExportModalOpen(false);
      toast.success(`Laporan berhasil diekspor ke format ${exportFormat}!`, {
        duration: 3000,
        style: {
          borderRadius: '1rem',
          background: '#0d9488',
          color: '#fff',
          fontSize: '12px',
          fontWeight: 'bold',
          textTransform: 'uppercase'
        }
      });
    }, 1500);
  };

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
            onClick={() => { setExportFormat('PDF'); setExportModalOpen(true); }}
            className="h-12 px-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:shadow-lg transition-all active:scale-95"
          >
            <FileText size={18} className="text-rose-500" /> Export PDF
          </button>
          <button 
            onClick={() => { setExportFormat('Excel'); setExportModalOpen(true); }}
            className="h-12 px-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:shadow-lg transition-all active:scale-95"
          >
            <TableIcon size={18} className="text-teal-600" /> Export Excel
          </button>
        </div>
      </div>

      {/* Historical Performance Line Chart */}
      <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp size={16} className="text-orange-500" />
              <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-widest">Tren Performa Kelas</h3>
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Perkembangan Rata-rata Nilai Kelas dari Waktu ke Waktu</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 mr-2">
              <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Rata-rata Kelas</span>
            </div>
            
            <select
              value={selectedChartFilter}
              onChange={(e) => setSelectedChartFilter(e.target.value)}
              className="h-10 px-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all cursor-pointer shadow-sm min-w-[150px]"
            >
              <option value="Semua Tipe">Semua Tipe</option>
              <option value="Latihan Mandiri">Latihan Mandiri</option>
              <option value="Simulasi TKA">Simulasi TKA</option>
            </select>
          </div>
        </div>
        
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={filteredChartData ?? []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: tickColor, fontWeight: 'bold' }} 
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: tickColor, fontWeight: 'bold' }} 
                domain={[0, 100]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="avgScore" 
                name="Rata-rata Kelas"
                stroke="#F97316" 
                strokeWidth={4}
                activeDot={{ r: 8 }}
                dot={{ r: 4, strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detail Nilai Siswa Per Sesi */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-widest flex items-center gap-2">
              <History size={18} className="text-orange-500" /> Detail Nilai Siswa Per Sesi
            </h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
              Lihat nilai lengkap siswa untuk setiap sesi ujian/latihan
            </p>
          </div>
          
          <select
            value={selectedSessionId}
            onChange={(e) => setSelectedSessionId(e.target.value)}
            className="h-12 px-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all cursor-pointer shadow-sm min-w-[240px]"
          >
            <option value="">-- Pilih Sesi Ujian --</option>
            {historicalExams.map((exam) => (
              <option key={exam.name} value={exam.name}>
                {exam.name} ({exam.type})
              </option>
            ))}
          </select>
        </div>

        {selectedSessionId ? (
          <DataTable
            headers={sessionHeaders}
            data={sessionStudentScores}
            rowsPerPage={5}
            renderRow={renderSessionRow}
          />
        ) : (
          <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-slate-800 border border-dashed border-slate-200 dark:border-slate-700 rounded-[2rem] text-center shadow-sm">
            <div className="w-16 h-16 bg-orange-50 dark:bg-orange-950/30 rounded-full flex items-center justify-center text-orange-500 mb-4 animate-pulse">
              <History size={28} />
            </div>
            <p className="font-black text-slate-700 dark:text-slate-200 text-sm uppercase tracking-wider mb-1">
              Belum Ada Sesi Terpilih
            </p>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">
              Silakan pilih sesi dari menu di atas untuk melihat detail nilai siswa
            </p>
          </div>
        )}
      </div>

      {/* Riwayat Pengerjaan Section */}
      <div className="space-y-4">
        <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-widest flex items-center gap-2">
          <History size={18} className="text-orange-500" /> Riwayat Pengerjaan Latihan/Tryout
        </h3>
        <DataTable
          headers={historyHeaders}
          data={historicalExams}
          rowsPerPage={5}
          renderRow={renderHistoryRow}
        />
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
                  { value: 'Bahasa Indonesia', label: 'Bahasa Indonesia' }
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

      {exportModalOpen && (
  <ExportOptions
    isOpen={exportModalOpen}
    onClose={() => setExportModalOpen(false)}
    exportFormat={exportFormat}
    setExportFormat={setExportFormat}
    exportScope={exportScope}
    setExportScope={setExportScope}
    exportColumns={exportColumns}
    setExportColumns={setExportColumns}
    isExporting={isExporting}
    setIsExporting={setIsExporting}
    onExport={handleStartExport}
  />
      )}
    </div>
  );
}
