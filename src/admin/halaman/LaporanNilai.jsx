import React, { useState, useMemo, useEffect } from 'react';
import {
  Download,
  Filter,
  Search,
  FileText,
  Table as TableIcon,
  ChevronDown,
  Calendar,
  AlertCircle
} from 'lucide-react';
import DataTable from '@/komponen/ui/TabelData';
import Badge from '@/komponen/ui/Badge';
import ProgressBar from '@/komponen/ui/BarProgres';
import Dropdown from '@/komponen/ui/Dropdown';
import api from '@/utilitas/api';
import toast from 'react-hot-toast';
// Data will be fetched from API; mock data removed

/**
 * Score reports page showing student exam results.
 * Overhauled for professional school administration and Design System consistency.
 */
export default function ScoreReports() {
  const [activeTab, setActiveTab] = useState('academic'); // 'academic' | 'survey'
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data from backend
  useEffect(() => {
    api.get('/admin/laporan/nilai')
      .then((res) => {
        setStudents(res.data.data || []);
      })
      .catch((err) => {
        console.error('Failed to fetch laporan nilai:', err);
      })
      .finally(() => setLoading(false));
  }, []);
  const [selectedClass, setSelectedClass] = useState('Semua Kelas');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('Simulasi TKA Tahap 1');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(true);

  // Export States
  const [exportConfig, setExportConfig] = useState(null); // { type: 'PDF' | 'Excel' }

  const classes = ['Semua Kelas', '6A', '6B', '6C'];
  const periods = ['Simulasi TKA Tahap 1', 'Simulasi TKA Tahap 2'];

  // Generate counts for class tabs
  const classCounts = useMemo(() => {
    const counts = { 'Semua Kelas': students.length };
    classes.filter(c => c !== 'Semua Kelas').forEach(cls => {
      counts[cls] = students.filter(s => s.class === cls).length;
    });
    return counts;
  }, [students]);

  // Process & Filter Data
  const filteredData = useMemo(() => {
    const userRole = localStorage.getItem('userRole');
    const userClass = localStorage.getItem('assignedClass');

    const processed = students.map(s => ({
      ...s,
      matematika: s.matematika ?? 0,
      bahasa: s.bahasa ?? 0,
      slb: s.slb ?? 0,
      sk: s.sk ?? 0,
    }));

    return processed.filter((s) => {
      const matchesScope = userRole === 'admin' ? true : s.class === (userClass ?? '');
      const matchClass = selectedClass === 'Semua Kelas' || s.class === selectedClass;
      const matchSearch = (s.name ?? '').toLowerCase().includes((searchQuery ?? '').toLowerCase());
      return matchesScope && matchClass && matchSearch;
    });
  }, [selectedClass, searchQuery, students]);

  const handleExportClick = (type) => {
    setExportConfig({ type });
  };

  const confirmExport = async () => {
    try {
      const type = exportConfig.type === 'Excel' ? 'xlsx' : 'pdf';
      const response = await api.get(`/admin/laporan/export?type=${type}`, { responseType: 'blob' });
      const blob = new Blob([response.data], { type: response.headers['content-type'] || 'application/octet-stream' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `laporan-nilai-admin.${type === 'xlsx' ? 'xlsx' : 'pdf'}`;
      link.click();
      window.URL.revokeObjectURL(url);
      toast.success('Laporan berhasil diunduh');
      setExportConfig(null);
    } catch (error) {
      toast.error('Gagal mengekspor laporan');
    }
  };

  const scoreBadgeVariant = (value) => {
    if (value >= 80) return "Success";
    if (value >= 60) return "Warning";
    return "Danger";
  };

  const headers = [
    { label: 'Siswa' },
    { label: 'Matematika', align: 'center' },
    { label: 'B. Indonesia', align: 'center' },
    { label: 'Rata-rata', align: 'center' }
  ];

  const renderRow = (student) => (
    <tr key={student.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors group">
      <td className="py-6 px-8">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-700 flex items-center justify-center text-slate-400 font-black text-xs border border-slate-100 dark:border-slate-600 uppercase">
            {student.avatar || student.name.charAt(0)}
          </div>
          <div>
            <p className="font-black text-slate-800 dark:text-white text-sm group-hover:text-teal-600 transition-colors uppercase tracking-tight">{student.name}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Kelas {student.class}</p>
          </div>
        </div>
      </td>
      <td className="py-6 px-4 text-center">
        <Badge text={(student?.avgScore ?? 0).toString()} variant={scoreBadgeVariant(student?.avgScore ?? 0)} />
      </td>
      <td className="py-6 px-4 text-center">
        <Badge text={(student?.bahasa ?? 0).toString()} variant={scoreBadgeVariant(student?.bahasa ?? 0)} />
      </td>
      <td className="py-6 px-4">
        <div className="min-w-[140px] px-4">
          <ProgressBar
            progress={student.avgScore ?? 0}
            color={(student.avgScore ?? 0) >= 80 ? "bg-teal-500" : (student.avgScore ?? 0) >= 60 ? "bg-amber-500" : "bg-rose-500"}
          />
        </div>
      </td>
    </tr>
  );

  if (loading) return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-xl">Memuat data...</p>
    </div>
  );

  return (
    <div id="score-reports" className="animate-fade-in space-y-8 pb-12">
      {/* HEADER & META INFO */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-black text-teal-600 uppercase tracking-[0.2em] mb-2">
            <Calendar size={14} /> Data diambil pada: {new Date().toLocaleDateString('id-ID')}
          </div>
          <h1 className="text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tight">Laporan Nilai Siswa</h1>
          <p className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-widest italic">Rekapitulasi komprehensif hasil tryout dan survei</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => handleExportClick('PDF')}
            className="h-12 px-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-[1.25rem] text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:shadow-lg transition-all active:scale-95"
          >
            <FileText size={18} className="text-rose-500" /> Export PDF
          </button>
          <button
            onClick={() => handleExportClick('Excel')}
            className="h-12 px-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-[1.25rem] text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:shadow-lg transition-all active:scale-95"
          >
            <TableIcon size={18} className="text-teal-600" /> Export Excel
          </button>
        </div>
      </div>

      {/* NAVIGATION & TABS */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-slate-100 dark:border-slate-800 pb-2">
        <div className="flex items-center gap-8">
          <h2 className="pb-4 text-sm font-black uppercase tracking-widest text-teal-600 relative">
            Skor Akademik
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-teal-600 rounded-t-full" />
          </h2>
        </div>

        <div className="flex items-center gap-3 mb-2 lg:mb-0">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Periode:</span>
          <Dropdown
            value={selectedPeriod}
            onChange={setSelectedPeriod}
            options={periods.map(p => ({ value: p, label: p }))}
          />
        </div>
      </div>

      {/* FILTERS BAR */}
      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center bg-slate-50 dark:bg-slate-900/50 p-1.5 rounded-[1.5rem] gap-1 border border-slate-100 dark:border-slate-800">
            {classes
              .filter(cls => {
                const userRole = localStorage.getItem('userRole');
                const userClass = localStorage.getItem('assignedClass') ?? '';
                if (userRole === 'admin') return true;
                return cls === 'Semua Kelas' || cls === userClass;
              })
              .map((cls) => (
                <button
                  key={cls}
                  onClick={() => setSelectedClass(cls)}
                  className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${selectedClass === cls
                    ? 'bg-white dark:bg-slate-800 text-teal-600 shadow-md'
                    : 'text-slate-400 dark:text-slate-500 hover:text-slate-600'
                    }`}
                >
                  {cls === 'Semua Kelas' ? cls : `Kelas ${cls}`} ({classCounts[cls]})
                </button>
              ))}
          </div>

          <div className="relative flex-1 min-w-[240px]">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama siswa..."
              className="w-full h-12 pl-12 pr-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-[1.25rem] text-sm font-bold placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all dark:text-white"
            />
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>
        </div>

        {showAdvancedFilters && (
          <div className="flex flex-wrap items-center gap-4 bg-white dark:bg-slate-900/50 p-6 rounded-[2rem] border border-dashed border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 rounded-xl">
              <AlertCircle size={14} className="text-rose-500" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Nilai Di Bawah 60</span>
            </div>
            <div className="flex items-center gap-6 ml-auto">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-teal-500" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">80-100: Baik</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">60-79: Cukup</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{"<"}60: Perhatian</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* DATA TABLE */}
      <DataTable
        headers={headers}
        data={filteredData}
        rowsPerPage={10}
        renderRow={renderRow}
      />

      {/* EXPORT SUMMARY MODAL */}
      {exportConfig && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setExportConfig(null)} />
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-700 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-8 py-6 border-b border-slate-50 dark:border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-teal-50 dark:bg-teal-900/30 rounded-xl flex items-center justify-center text-teal-600">
                  <Download size={20} />
                </div>
                <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-widest">Konfirmasi Ekspor</h3>
              </div>
              <button onClick={() => setExportConfig(null)} className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-rose-500 transition-all">
                <Download size={20} className="rotate-180" /> {/* Just a placeholder X-like action */}
              </button>
            </div>

            <div className="p-8 space-y-6">
              <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 space-y-4">
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <span>Periode</span>
                  <span className="text-slate-800 dark:text-teal-400">{selectedPeriod}</span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <span>Kelas</span>
                  <span className="text-slate-800 dark:text-teal-400">{selectedClass}</span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <span>Format File</span>
                  <Badge text={exportConfig.type} variant={exportConfig.type === 'Excel' ? 'Success' : 'Danger'} />
                </div>
                <div className="h-px bg-slate-200 dark:bg-slate-700" />
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Jumlah Siswa</span>
                  <span className="text-lg font-black text-slate-800 dark:text-white">{filteredData?.length}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 rounded-xl">
                <AlertCircle size={20} className="text-amber-500 shrink-0" />
                <p className="text-[10px] font-bold text-amber-600 dark:text-amber-400 leading-relaxed uppercase tracking-tight">
                  Pastikan filter sudah sesuai. Data yang diekspor akan mengikuti tampilan tabel saat ini.
                </p>
              </div>
            </div>

            <div className="p-8 bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-700 flex gap-3">
              <button
                onClick={() => setExportConfig(null)}
                className="flex-1 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 transition-all hover:bg-slate-50"
              >
                Batal
              </button>
              <button
                onClick={confirmExport}
                className="flex-1 py-4 bg-teal-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-teal-600/20 hover:bg-teal-700 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <Download size={14} /> Unduh Sekarang
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
