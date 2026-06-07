import React, { useState, useMemo } from 'react';
import toast from 'react-hot-toast';
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
  School,
  Eye
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
import { useDarkMode } from '@/hooks/useModGelap';
import mockSurveyDefinitions from '@/data/mockSurvei';
import mockSurveyResponses from '@/data/mockResponSurvei';
import mockStudents from '@/data/mockSiswa';
import DataTable from '@/komponen/ui/TabelData';
import Badge from '@/komponen/ui/Badge';
import Dropdown from '@/komponen/ui/Dropdown';

const COLORS = ['#4f46e5', '#6366f1', '#818cf8', '#a5b4fc', '#c7d2fe', '#e0e7ff'];

export default function AdminSurveyReports() {
  const { isDark } = useDarkMode();

  const [selectedSurveyId, setSelectedSurveyId] = useState(mockSurveyDefinitions[0]?.id);
  const [classFilter, setClassFilter] = useState('Semua Kelas');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedResponseDetail, setSelectedResponseDetail] = useState(null);

  // State baru untuk pratinjau grafik/soal yang diklik
  const [selectedQuestionPreview, setSelectedQuestionPreview] = useState(null);

  const selectedSurvey = useMemo(() =>
    (mockSurveyDefinitions || []).find(s => s?.id === selectedSurveyId),
    [selectedSurveyId]);

  const handleDownload = () => {
    toast.success(`Berhasil mengunduh laporan survei "${selectedSurvey?.title || 'Survei'}" untuk "${classFilter}"`);
  };

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
        totalResponses: filteredResponses.length,
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
      status: 'Selesai',
      rawResponse: r
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
      render: (val, row) => (
        <button
          onClick={() => setSelectedResponseDetail(row?.rawResponse || row)}
          className="text-indigo-600 hover:text-indigo-750 font-black text-[10px] uppercase bg-indigo-50 dark:bg-indigo-900/20 px-4 py-2 rounded-xl hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors shadow-sm"
        >
          Lihat
        </button>
      )
    }
  ];

  return (
    <div className="animate-in fade-in duration-500 space-y-8 pb-10">
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
          <button
            onClick={handleDownload}
            className="p-4 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-slate-400 hover:text-indigo-600 transition-colors shadow-sm"
          >
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

      {/* Analytics (DIUBAH MENJADI VERTIKAL & DAPAT DIKLIK) */}
      <div className="bg-white dark:bg-slate-800 p-8 md:p-10 rounded-[3rem] shadow-sm border border-slate-100 dark:border-slate-700">
        <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-widest mb-6 flex items-center gap-2">
          <BarChart3 size={18} className="text-indigo-500" /> Distribusi Jawaban
        </h3>

        <div className="flex flex-col gap-5">
          {(chartData || []).map((q, idx) => (
            <div
              key={q?.questionId || idx}
              onClick={() => setSelectedQuestionPreview({ ...q, index: idx + 1 })}
              className="group flex flex-col md:flex-row items-center gap-6 p-6 bg-slate-50/50 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-800 rounded-3xl hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-md transition-all cursor-pointer"
            >
              <div className="flex-1 w-full space-y-3">
                <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 leading-relaxed group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  <span className="text-indigo-600 dark:text-indigo-400 mr-1.5">Q{idx + 1}.</span> {q?.questionText}
                </h4>
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-[9px] font-black uppercase tracking-widest text-slate-500 group-hover:text-indigo-500 transition-colors">
                  <Eye size={12} /> Klik untuk lihat detail
                </div>
              </div>

              <div className="w-full md:w-[40%] shrink-0" style={{ height: 120 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={q?.data || []} layout="vertical" margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <XAxis type="number" hide />
                    <YAxis dataKey="label" type="category" width={40} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: isDark ? '#94a3b8' : '#64748b', fontWeight: 'bold' }} />
                    <Tooltip cursor={{ fill: isDark ? '#1e293b' : '#f1f5f9' }} contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={16}>
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

      {/* ============================================== */}
      {/* MODAL 1: PREVIEW GRAFIK & DETAIL SOAL (BARU)   */}
      {/* ============================================== */}
      {selectedQuestionPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedQuestionPreview(null)} />
          <div className="relative w-full max-w-2xl bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-700 overflow-hidden animate-in zoom-in-95 duration-200">

            <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center font-black text-lg">
                  Q{selectedQuestionPreview.index}
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-widest">Detail Distribusi Jawaban</h3>
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase mt-1">
                    Berdasarkan {selectedQuestionPreview.totalResponses} Responden
                  </p>
                </div>
              </div>
              <button onClick={() => setSelectedQuestionPreview(null)} className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-rose-500 transition-all font-black text-xs">
                ✕
              </button>
            </div>

            <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <p className="text-lg font-bold text-slate-800 dark:text-white leading-relaxed text-center">
                "{selectedQuestionPreview.questionText}"
              </p>

              {/* Grafik versi agak besar di dalam modal */}
              <div className="w-full bg-slate-50 dark:bg-slate-900/30 p-6 rounded-3xl border border-slate-100 dark:border-slate-800" style={{ height: 250 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={selectedQuestionPreview.data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#334155' : '#e2e8f0'} />
                    <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 12, fontWeight: 'bold', fill: isDark ? '#94a3b8' : '#64748b' }} />
                    <YAxis hide />
                    <Tooltip cursor={{ fill: isDark ? '#1e293b' : '#f1f5f9' }} contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={40}>
                      {selectedQuestionPreview.data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Detail Angka per Opsi */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Rincian Persentase</h4>
                {selectedQuestionPreview.data.map((opt, i) => {
                  const percentage = selectedQuestionPreview.totalResponses > 0
                    ? Math.round((opt.value / selectedQuestionPreview.totalResponses) * 100)
                    : 0;
                  return (
                    <div key={opt.label} className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black text-white" style={{ backgroundColor: COLORS[i % COLORS.length] }}>
                          {opt.label}
                        </div>
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{opt.fullText}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-black text-slate-800 dark:text-white">{opt.value} Suara</div>
                        <div className="text-[10px] font-bold text-slate-400">{percentage}%</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================= */}
      {/* MODAL 2: RESPONSE DETAIL PER SISWA        */}
      {/* ========================================= */}
      {selectedResponseDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedResponseDetail(null)} />
          <div className="relative w-full max-w-2xl bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-700 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
              <div>
                <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-widest">Detail Respon Survei</h3>
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase mt-0.5">{selectedSurvey?.title}</p>
              </div>
              <button onClick={() => setSelectedResponseDetail(null)} className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-rose-500 transition-all font-black text-xs">
                ✕
              </button>
            </div>

            <div className="p-8 space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
              <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400">
                <div>Siswa: <span className="text-slate-950 dark:text-white uppercase font-black">{selectedResponseDetail.name}</span></div>
                <div>Kelas: <span className="text-slate-950 dark:text-white font-black">{selectedResponseDetail.class}</span></div>
              </div>

              <div className="space-y-6">
                {(selectedSurvey?.questions || []).map((q, idx) => {
                  const studentAnswerLabel = selectedResponseDetail.rawResponse?.answers?.[q.id] || selectedResponseDetail.answers?.[q.id];
                  return (
                    <div key={q.id} className="space-y-3">
                      <p className="text-xs font-black text-slate-800 dark:text-white leading-tight">
                        <span className="text-indigo-600">Q{idx + 1}.</span> {q.text}
                      </p>
                      <div className="grid grid-cols-1 gap-2">
                        {q.options.map((opt) => {
                          const isSelected = opt.label === studentAnswerLabel;
                          return (
                            <div
                              key={opt.label}
                              className={`p-3.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-3 ${isSelected
                                  ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/50 text-emerald-700 dark:text-emerald-400 shadow-sm'
                                  : 'bg-white dark:bg-slate-900/50 border-slate-100 dark:border-slate-800/80 text-slate-500'
                                }`}
                            >
                              <div className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-black ${isSelected
                                  ? 'bg-emerald-500 text-white'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                                }`}>
                                {opt.label}
                              </div>
                              <span>{opt.text}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}