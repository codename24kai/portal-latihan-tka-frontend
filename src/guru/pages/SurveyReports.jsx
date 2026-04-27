import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  Users, 
  BarChart3, 
  Search, 
  Download, 
  Filter,
  CheckCircle2,
  Clock,
  LayoutGrid,
  ChevronRight
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { useDarkMode } from '../../hooks/useDarkMode';
import mockSurveyDefinitions from '../../data/mockSurveys';
import mockSurveyResponses from '../../data/mockSurveyResponses';
import mockStudents from '../../data/mockStudents';
import DataTable from '../../components/ui/DataTable';
import Badge from '../../components/ui/Badge';
import Dropdown from '../../components/ui/Dropdown';

const COLORS = ['#0d9488', '#0891b2', '#0284c7', '#4f46e5', '#7c3aed', '#db2777'];

export default function SurveyReports() {
  const { isDark } = useDarkMode();
  const assignedClass = localStorage.getItem('assignedClass') ?? '';
  
  const [selectedSurveyId, setSelectedSurveyId] = useState(mockSurveyDefinitions[0]?.id);
  const [searchQuery, setSearchQuery] = useState('');

  const selectedSurvey = useMemo(() => 
    (mockSurveyDefinitions || []).find(s => s?.id === selectedSurveyId),
  [selectedSurveyId]);

  const classResponses = useMemo(() => 
    (mockSurveyResponses || []).filter(r => r?.student_class === assignedClass && r?.survey_id === selectedSurveyId),
  [assignedClass, selectedSurveyId]);

  const totalStudentsInClass = (mockStudents || []).filter(s => s?.class === assignedClass).length;
  const completionRate = Math.round((classResponses?.length / (totalStudentsInClass || 1)) * 100) || 0;

  // Aggregate data for charts
  const chartData = useMemo(() => {
    if (!selectedSurvey || !selectedSurvey?.questions) return [];
    
    return (selectedSurvey?.questions || []).map(q => {
      const distribution = (q?.options || []).reduce((acc, opt) => {
        if (opt?.label) acc[opt.label] = 0;
        return acc;
      }, {});

      (classResponses || []).forEach(r => {
        const answer = r?.answers?.[q?.id];
        if (answer && distribution[answer] !== undefined) distribution[answer]++;
      });

      return {
        questionId: q?.id,
        questionText: q?.text,
        data: (q?.options || []).map(opt => ({
          name: opt?.text?.length > 20 ? opt.text.substring(0, 20) + '...' : opt?.text,
          fullText: opt?.text,
          value: distribution[opt?.label] || 0,
          label: opt?.label
        }))
      };
    });
  }, [selectedSurvey, classResponses]);

  // Data for table
  const tableData = useMemo(() => {
    return classResponses.map(r => ({
      id: r.student_id,
      name: r.student_name,
      class: r.student_class,
      submittedAt: new Date(r.submitted_at).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      status: 'Selesai',
      ...r.answers // Flatten answers for dynamic columns if needed
    }));
  }, [classResponses]);

  const tableColumns = [
    { key: 'name', label: 'Nama Siswa', sortable: true },
    { key: 'submittedAt', label: 'Waktu Pengisian', sortable: true },
    { 
      key: 'status', 
      label: 'Status', 
      render: (val) => <Badge variant="success">{val}</Badge>
    },
    {
      key: 'actions',
      label: 'Aksi',
      render: (_, row) => (
        <button className="text-teal-600 hover:text-teal-700 font-bold text-[10px] uppercase tracking-widest flex items-center gap-1 group">
          Lihat Detail <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </button>
      )
    }
  ];

  return (
    <div className="animate-fade-in space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight italic">
            Laporan <span className="text-teal-600">Survei</span> Non-Kognitif
          </h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 italic">
            Pantau respons karakter & lingkungan belajar siswa Kelas {assignedClass}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Dropdown
            value={selectedSurveyId}
            onChange={setSelectedSurveyId}
            options={(mockSurveyDefinitions || []).map(s => ({ value: s?.id, label: s?.title }))}
          />
          <button className="p-4 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-slate-400 hover:text-teal-600 transition-colors shadow-sm">
            <Download size={20} />
          </button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800 flex items-center gap-6 group hover:border-teal-400 transition-colors">
          <div className="w-14 h-14 bg-teal-50 dark:bg-teal-900/20 rounded-2xl flex items-center justify-center text-teal-600">
            <Users size={28} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Responden</p>
            <h3 className="text-2xl font-black text-slate-800 dark:text-white leading-none">
              {classResponses.length} <span className="text-sm text-slate-300">/ {totalStudentsInClass} Siswa</span>
            </h3>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800 flex items-center gap-6 group hover:border-emerald-400 transition-colors">
          <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl flex items-center justify-center text-emerald-600">
            <CheckCircle2 size={28} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Tingkat Pengisian</p>
            <h3 className="text-2xl font-black text-slate-800 dark:text-white leading-none">{completionRate}%</h3>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800 flex items-center gap-6 group hover:border-indigo-400 transition-colors">
          <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl flex items-center justify-center text-indigo-600">
            <Clock size={28} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Pembaruan Terakhir</p>
            <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-tight">27 April 2026</h3>
          </div>
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 gap-8">
        <div className="bg-white dark:bg-slate-800 p-8 md:p-10 rounded-[3rem] shadow-sm border border-slate-100 dark:border-slate-700 space-y-10">
          <div className="flex items-center justify-between border-b border-slate-50 dark:border-slate-700 pb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-teal-50 dark:bg-teal-900/30 rounded-xl flex items-center justify-center text-teal-600">
                <BarChart3 size={20} />
              </div>
              <h2 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight italic">Distribusi Jawaban Agregat</h2>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <LayoutGrid size={14} className="text-teal-600" />
              Tampilan: <span className="text-slate-800 dark:text-white">Chart Dinamis</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {(chartData || []).map((q, idx) => (
              <div key={q?.questionId || idx} className="space-y-6">
                <div className="space-y-2">
                  <div className="inline-flex px-2 py-0.5 bg-slate-50 dark:bg-slate-900 text-[9px] font-black text-slate-400 rounded-md uppercase tracking-widest border border-slate-100 dark:border-slate-800">
                    Soal {idx + 1}
                  </div>
                  <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 leading-tight">
                    {q?.questionText}
                  </h4>
                </div>
                
                <div style={{ height: 300, width: '100%' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={q?.data || []}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={isDark ? '#334155' : '#f1f5f9'} />
                      <XAxis type="number" hide />
                      <YAxis 
                        dataKey="label" 
                        type="category" 
                        tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 12, fontWeight: 'bold' }} 
                        width={30}
                      />
                      <Tooltip 
                        cursor={{ fill: isDark ? '#1e293b' : '#f8fafc' }}
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-100 dark:border-slate-700 shadow-xl">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{payload[0]?.payload?.label}</p>
                                <p className="text-xs font-bold text-slate-700 dark:text-slate-200 mb-2">{payload[0]?.payload?.fullText}</p>
                                <div className="flex items-center gap-2">
                                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: payload[0]?.color }} />
                                  <p className="text-sm font-black text-teal-600">{payload[0]?.value} Siswa</p>
                                </div>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={32}>
                        {(q?.data || []).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Table */}
        <div className="bg-white dark:bg-slate-800 rounded-[3rem] shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
          <div className="p-8 md:p-10 border-b border-slate-50 dark:border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h2 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight italic">Detail Respon Siswa</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 italic">Daftar lengkap jawaban setiap siswa</p>
            </div>
            <div className="relative max-w-xs w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Cari nama siswa..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-6 py-3.5 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-teal-500/20 transition-all"
              />
            </div>
          </div>
          
          <DataTable
            columns={tableColumns}
            data={tableData.filter(d => d.name.toLowerCase().includes(searchQuery.toLowerCase()))}
            pagination={true}
            rowsPerPage={5}
          />
        </div>
      </div>
    </div>
  );
}
