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
  ChevronRight,
  School
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { useDarkMode } from '../../hooks/useDarkMode';
import mockSurveyDefinitions from '../../data/mockSurveys';
import mockSurveyResponses from '../../data/mockSurveyResponses';
import mockStudents from '../../data/mockStudents';
import DataTable from '../../components/ui/DataTable';
import Badge from '../../components/ui/Badge';
import Dropdown from '../../components/ui/Dropdown';

const COLORS = ['#4f46e5', '#6366f1', '#818cf8', '#a5b4fc', '#c7d2fe', '#e0e7ff'];

export default function AdminSurveyReports() {
  const { isDark } = useDarkMode();
  
  const [selectedSurveyId, setSelectedSurveyId] = useState(mockSurveyDefinitions[0]?.id);
  const [classFilter, setClassFilter] = useState('Semua Kelas');
  const [searchQuery, setSearchQuery] = useState('');

  const selectedSurvey = useMemo(() => 
    (mockSurveyDefinitions || []).find(s => s?.id === selectedSurveyId),
  [selectedSurveyId]);

  const filteredResponses = useMemo(() => {
    let res = (mockSurveyResponses || []).filter(r => r?.survey_id === selectedSurveyId);
    if (classFilter !== 'Semua Kelas') {
      res = res.filter(r => r?.student_class === classFilter);
    }
    return res;
  }, [selectedSurveyId, classFilter]);

  const totalStudents = classFilter === 'Semua Kelas' 
    ? (mockStudents || []).length 
    : (mockStudents || []).filter(s => s?.class === classFilter).length;
    
  const completionRate = Math.round((filteredResponses?.length / (totalStudents || 1)) * 100) || 0;

  // Unique classes for filter
  const classes = useMemo(() => {
    const uniqueClasses = [...new Set((mockStudents || []).map(s => s?.class))].sort();
    return ['Semua Kelas', ...uniqueClasses];
  }, []);

  // Aggregate data for charts
  const chartData = useMemo(() => {
    if (!selectedSurvey || !selectedSurvey?.questions) return [];
    
    return (selectedSurvey?.questions || []).map(q => {
      const distribution = (q?.options || []).reduce((acc, opt) => {
        if (opt?.label) acc[opt.label] = 0;
        return acc;
      }, {});

      (filteredResponses || []).forEach(r => {
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
  }, [selectedSurvey, filteredResponses]);

  const tableData = useMemo(() => {
    return filteredResponses.map(r => ({
      id: r.student_id,
      name: r.student_name,
      class: r.student_class,
      submittedAt: new Date(r.submitted_at).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }),
      status: 'Selesai'
    }));
  }, [filteredResponses]);

  const tableColumns = [
    { key: 'name', label: 'Nama Siswa', sortable: true },
    { key: 'class', label: 'Kelas', sortable: true },
    { key: 'submittedAt', label: 'Tanggal', sortable: true },
    { 
      key: 'status', 
      label: 'Status', 
      render: (val) => <Badge variant="success">{val}</Badge>
    },
    {
      key: 'actions',
      label: 'Detail',
      render: () => <button className="text-indigo-600 hover:text-indigo-700 font-bold text-[10px] uppercase">Lihat</button>
    }
  ];

  return (
    <div className="animate-fade-in space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
            Laporan Survei <span className="text-indigo-600">Nasional</span>
          </h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 italic">
            Monitoring instrumen non-kognitif tingkat sekolah
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Dropdown
            value={selectedSurveyId}
            onChange={setSelectedSurveyId}
            options={(mockSurveyDefinitions || []).map(s => ({ value: s?.id, label: s?.title }))}
          />
          <Dropdown
            value={classFilter}
            onChange={setClassFilter}
            options={(classes || []).map(c => ({ value: c, label: c }))}
          />
          <button className="p-4 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-slate-400 hover:text-indigo-600 transition-colors shadow-sm">
            <Download size={20} />
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800 flex items-center gap-6">
          <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl flex items-center justify-center text-indigo-600">
            <School size={28} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Cakupan Kelas</p>
            <h3 className="text-2xl font-black text-slate-800 dark:text-white leading-none">
              {classFilter === 'Semua Kelas' ? classes.length - 1 : 1} Kelas
            </h3>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800 flex items-center gap-6">
          <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center text-blue-600">
            <Users size={28} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Partisipasi Siswa</p>
            <h3 className="text-2xl font-black text-slate-800 dark:text-white leading-none">
              {filteredResponses.length} <span className="text-sm text-slate-300">/ {totalStudents}</span>
            </h3>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800 flex items-center gap-6">
          <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl flex items-center justify-center text-emerald-600">
            <CheckCircle2 size={28} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Selesai</p>
            <h3 className="text-2xl font-black text-slate-800 dark:text-white leading-none">{completionRate}%</h3>
          </div>
        </div>
      </div>

      {/* Analytics */}
      <div className="bg-white dark:bg-slate-800 p-8 md:p-10 rounded-[3rem] shadow-sm border border-slate-100 dark:border-slate-700">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {(chartData || []).map((q, idx) => (
            <div key={q?.questionId || idx} className="space-y-6">
              <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 leading-tight">
                <span className="text-indigo-600 mr-2">Q{idx+1}.</span> {q?.questionText}
              </h4>
              <div style={{ height: 300, width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={q?.data || []} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={isDark ? '#334155' : '#f1f5f9'} />
                    <XAxis type="number" hide />
                    <YAxis dataKey="label" type="category" width={30} tick={{fontSize: 12, fontWeight: 'bold'}} />
                    <Tooltip cursor={{fill: 'transparent'}} />
                    <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={24}>
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

      {/* Master Table */}
      <div className="bg-white dark:bg-slate-800 rounded-[3rem] shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
        <DataTable
          columns={tableColumns}
          data={tableData}
          pagination={true}
          rowsPerPage={10}
        />
      </div>
    </div>
  );
}
