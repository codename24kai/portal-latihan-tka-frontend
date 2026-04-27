import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Mail, 
  Eye, 
  ChevronDown,
  TrendingUp,
  AlertCircle,
  Users,
  CheckCircle2
} from 'lucide-react';
import toast from 'react-hot-toast';
import DataTable from '../../components/ui/DataTable';
import Badge from '../../components/ui/Badge';
import Dropdown from '../../components/ui/Dropdown';
import ProgressBar from '../../components/ui/ProgressBar';
import mockStudents from '../../data/mockStudents';

export default function GuruStudentList() {
  const navigate = useNavigate();
  const [students, setStudents] = useState(mockStudents);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua Status');
  const [expandedId, setExpandedId] = useState(null);
  const assignedClass = localStorage.getItem('assignedClass') ?? '';

  const classStudents = useMemo(() => {
    return (students ?? [])
      .filter(s => s?.class === assignedClass)
      .filter(s => (s?.name ?? '').toLowerCase().includes(searchQuery.toLowerCase()))
      .filter(s => {
        if (statusFilter === 'Semua Status') return true;
        return s?.status === (statusFilter === 'Aktif' ? 'active' : 'inactive');
      });
  }, [students, assignedClass, searchQuery, statusFilter]);

  const stats = useMemo(() => {
    const total = classStudents.length;
    const active = classStudents.filter(s => s.status === 'active').length;
    const attention = classStudents.filter(s => (s.avgScore ?? 0) < 65).length;
    return { total, active, attention };
  }, [classStudents]);

  const getDaysSinceLogin = (lastActiveDate) => {
    if (!lastActiveDate) return null;
    const last = new Date(lastActiveDate);
    const now = new Date();
    const diffTime = Math.abs(now - last);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const headers = [
    { label: 'Siswa' },
    { label: 'Login Terakhir', align: 'center' },
    { label: 'Ujian Selesai', align: 'center' },
    { label: 'Status', align: 'center' },
    { label: 'Aksi', align: 'center' },
  ];

  const renderRow = (student) => {
    const isExpanded = expandedId === student.id;
    const days = getDaysSinceLogin(student?.lastActive);
    
    return (
      <React.Fragment key={student?.id}>
        <tr className={`hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors group ${isExpanded ? 'bg-orange-50/50 dark:bg-orange-950/10' : ''}`}>
          <td className="py-6 px-8">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-700 flex items-center justify-center text-orange-600 font-black text-xs border border-slate-100 dark:border-slate-600 shadow-sm uppercase group-hover:scale-110 transition-transform">
                {student?.avatar ?? student?.name?.charAt(0)}
              </div>
              <div>
                <p className="font-black text-slate-800 dark:text-white text-sm group-hover:text-orange-600 transition-colors uppercase tracking-tight">
                  {student?.name}
                </p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">ID: STU-{student?.id.toString().substring(0, 4)}</p>
              </div>
            </div>
          </td>
          <td className="py-6 px-4 text-center">
            {days === 0 ? (
              <Badge text="Hari Ini" variant="Success" />
            ) : days <= 2 ? (
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{days} Hari Lalu</span>
            ) : (
              <Badge text={`${days} Hari Lalu`} variant="Danger" />
            )}
          </td>
          <td className="py-6 px-4 text-center">
            <div className="flex flex-col items-center gap-1">
              <span className="text-sm font-black text-slate-700 dark:text-slate-300">{student?.examsCompleted}</span>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Selesai</span>
            </div>
          </td>
          <td className="py-6 px-4 text-center">
            <Badge 
              text={student?.status === 'active' ? 'AKTIF' : 'NONAKTIF'} 
              variant={student?.status === 'active' ? 'Success' : 'Danger'} 
            />
          </td>
          <td className="py-6 px-8 text-center">
            <div className="flex items-center justify-center gap-2">
              <button 
                onClick={() => setExpandedId(isExpanded ? null : student.id)}
                className={`p-2 rounded-lg transition-all ${isExpanded ? 'bg-orange-600 text-white' : 'bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-orange-600'}`}
                title="Lihat Progress"
              >
                <Eye size={16} />
              </button>
              <button 
                onClick={() => toast.success('Pesan dikirim ke ' + student.name)}
                className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-teal-600 transition-colors" 
                title="Hubungi"
              >
                <Mail size={16} />
              </button>
            </div>
          </td>
        </tr>
        
        {/* Expandable Progress Drawer */}
        {isExpanded && (
          <tr className="bg-white dark:bg-slate-900 border-x-4 border-orange-500/20 animate-fade-in">
            <td colSpan={5} className="py-8 px-12 border-b border-slate-100 dark:border-slate-800">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <TrendingUp size={14} className="text-orange-500" /> Performa Akademik
                  </h4>
                  <div className="space-y-4">
                    <ProgressBar 
                      progress={student?.avgScore ?? 0} 
                      label="Rata-rata Global" 
                      color={(student?.avgScore ?? 0) >= 80 ? "bg-teal-500" : (student?.avgScore ?? 0) >= 65 ? "bg-amber-500" : "bg-rose-500"} 
                    />
                    <div className="flex justify-between items-end">
                       <p className="text-[11px] font-black text-slate-700 dark:text-slate-300 uppercase">Skor Akhir</p>
                       <p className={`text-xl font-black ${(student?.avgScore ?? 0) >= 80 ? "text-teal-600" : "text-rose-600"}`}>{student?.avgScore}</p>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6 bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl border border-slate-100 dark:border-slate-700">
                   <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Matematika</p>
                      <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                         <div className="h-full bg-teal-500" style={{ width: `${Math.max(0, (student?.avgScore ?? 0) - 5)}%` }} />
                      </div>
                      <p className="text-[10px] font-bold text-slate-500 mt-2 uppercase tracking-tighter">Estimasi: {Math.max(0, (student?.avgScore ?? 0) - 5)} Poin</p>
                   </div>
                   <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">B. Indonesia</p>
                      <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                         <div className="h-full bg-orange-500" style={{ width: `${Math.min(100, (student?.avgScore ?? 0) + 4)}%` }} />
                      </div>
                      <p className="text-[10px] font-bold text-slate-500 mt-2 uppercase tracking-tighter">Estimasi: {Math.min(100, (student?.avgScore ?? 0) + 4)} Poin</p>
                   </div>
                </div>
              </div>
            </td>
          </tr>
        )}
      </React.Fragment>
    );
  };

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight">Daftar Siswa Kelas {assignedClass}</h1>
          <p className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-widest italic">Monitoring data dan monitoring aktivitas siswa</p>
        </div>
      </div>

      {/* Summary Pills */}
      <div className="flex flex-wrap gap-4">
        {[
          { label: 'Total Siswa', val: stats.total, color: 'bg-slate-100 text-slate-600', icon: Users },
          { label: 'Aktif', val: stats.active, color: 'bg-emerald-50 text-emerald-600', icon: CheckCircle2 },
          { label: 'Perlu Perhatian', val: stats.attention, color: 'bg-rose-50 text-rose-600', icon: AlertCircle },
        ].map((stat, i) => (
          <div key={i} className={`px-5 py-3 rounded-2xl ${stat.color} flex items-center gap-3 border border-transparent hover:border-current/10 transition-colors`}>
             <stat.icon size={18} />
             <div>
               <p className="text-[10px] font-black uppercase tracking-widest leading-none mb-1 opacity-70">{stat.label}</p>
               <p className="text-lg font-black leading-none">{stat.val}</p>
             </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
          <input
            type="text"
            placeholder="Cari nama siswa..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-14 pl-14 pr-6 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all dark:text-white"
          />
        </div>
        <div className="flex flex-wrap gap-4">
          <Dropdown 
            value={statusFilter}
            onChange={setStatusFilter}
            options={[
              { value: 'Semua Status', label: 'Semua Status' },
              { value: 'Aktif', label: 'Aktif' },
              { value: 'Nonaktif', label: 'Nonaktif' }
            ]}
            className="min-w-[180px]"
          />
        </div>
      </div>

      {/* Table */}
      <DataTable
        headers={headers}
        data={classStudents}
        rowsPerPage={10}
        renderRow={renderRow}
      />
    </div>
  );
}
