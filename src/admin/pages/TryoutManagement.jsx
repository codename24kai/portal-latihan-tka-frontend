import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Calendar,
  Users,
  Clock,
  Pause,
  X,
  FileText,
  Zap,
  Edit2,
  Trash2,
  Filter,
  Globe,
  Search
} from 'lucide-react';
import toast from 'react-hot-toast';
import { SUBJECTS } from '@/constants/subjects';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import Dropdown from '@/components/ui/Dropdown';
import Badge from '@/components/ui/Badge';
import DataTable from '@/components/ui/DataTable';
import ProgressBar from '@/components/ui/ProgressBar';

// Mock tryout data
const mockTryouts = [
  { id: 1, name: 'Tryout Matematika Minggu 1', subject: 'Matematika', status: 'active', studentsFinished: 32, totalStudents: 42, questions: 40, duration: '90 menit', startDate: '2026-03-31T08:00', endDate: '2026-04-07T23:59' },
  { id: 2, name: 'Tryout B. Indonesia Minggu 1', subject: 'Bahasa Indonesia', status: 'active', studentsFinished: 15, totalStudents: 38, questions: 35, duration: '70 menit', startDate: '2026-03-31T08:00', endDate: '2026-04-07T23:59' },
  { id: 3, name: 'Latihan Ujian Akhir', subject: 'Matematika', status: 'draft', studentsFinished: 0, totalStudents: 45, questions: 60, duration: '120 menit', startDate: '2026-04-14T10:00', endDate: '2026-04-14T12:00' },
  { id: 4, name: 'Simulasi Tryout Nasional', subject: 'Matematika', status: 'ended', studentsFinished: 48, totalStudents: 48, questions: 40, duration: '90 menit', startDate: '2026-03-24T08:00', endDate: '2026-03-25T17:00' },
  { id: 5, name: 'Evaluasi Mingguan 2', subject: 'Bahasa Indonesia', status: 'ended', studentsFinished: 35, totalStudents: 40, questions: 20, duration: '45 menit', startDate: '2026-03-20T08:00', endDate: '2026-03-21T18:00' },
];

export default function TryoutManagement() {
  const navigate = useNavigate();
  const [tryouts, setTryouts] = useState(mockTryouts);
  const [statusFilter, setStatusFilter] = useState('Semua');
  const [subjectFilter, setSubjectFilter] = useState('Semua');
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const filteredTryouts = useMemo(() => {
    return tryouts?.filter(t => {
      const matchStatus = statusFilter === 'Semua' || t?.status === statusFilter.toLowerCase();
      const matchSubject = subjectFilter === 'Semua' || t?.subject === subjectFilter;
      return matchStatus && matchSubject;
    }) || [];
  }, [tryouts, statusFilter, subjectFilter]);

  const handleEdit = (id) => navigate(`edit/${id}`);

  const handleDelete = () => {
    setTryouts(prev => prev?.filter(t => t?.id !== deleteConfirmId));
    setDeleteConfirmId(null);
  };

  return (
  <div id="tryout-management" className="animate-fade-in space-y-8 pb-10">
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Manajemen Tryout</h1>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 italic">Atur jadwal dan materi simulasi ujian siswa</p>
      </div>
      <button
        onClick={() => navigate('add')}
        className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-indigo-600/20 active:scale-95 flex items-center justify-center gap-2 group"
      >
        <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center group-hover:rotate-90 transition-transform">
          <Plus size={16} strokeWidth={3} />
        </div>
        Buat Sesi Tryout
      </button>
    </div>

    {/* Advanced Filters */}
    <div className="bg-white dark:bg-slate-800 p-6 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-700 flex flex-wrap gap-4 items-center">
      <div className="flex flex-wrap gap-4">
        <Dropdown
          value={statusFilter}
          onChange={setStatusFilter}
          options={[
            { value: 'Semua', label: 'Semua Status' },
            { value: 'Aktif', label: 'Aktif' },
            { value: 'Draft', label: 'Draft' },
            { value: 'Selesai', label: 'Selesai' }
          ]}
          className="min-w-[180px]"
        />
        <Dropdown
          value={subjectFilter}
          onChange={setSubjectFilter}
          options={[
            { value: 'Semua', label: 'Semua Mapel' },
            { value: 'Matematika', label: 'Matematika' },
            { value: 'Bahasa Indonesia', label: 'Bahasa Indonesia' }
          ]}
          className="min-w-[200px]"
        />
      </div>

      <div className="flex-1 min-w-[200px] relative h-full">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
        <input
          type="text"
          placeholder="Cari nama tryout..."
          className="w-full pl-14 pr-5 py-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 outline-none text-xs font-bold transition-all dark:text-white"
        />
      </div>
    </div>

    {/* Data Table View */}
    <DataTable
      headers={[
        { label: 'Informasi Tryout' },
        { label: 'Progres Siswa', align: 'center' },
        { label: 'Jadwal & Durasi', align: 'center' },
        { label: 'Status', align: 'center' },
        { label: 'Aksi', align: 'right' }
      ]}
      data={filteredTryouts}
      rowsPerPage={5}
      renderRow={(tryout) => {
        const isEnded = tryout.status === 'ended' || new Date(tryout.endDate) < new Date();
        const progressValue = (tryout.studentsFinished / tryout.totalStudents) * 100;

        return (
          <tr key={tryout.id} className={`group hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors ${isEnded ? 'opacity-60' : ''}`}>
            <td className="py-6 px-8">
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <Badge text={tryout.subject} variant="Info" />
                  <span className="text-[9px] font-bold text-slate-300 uppercase">#{tryout.id}</span>
                </div>
                <h4 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-tight group-hover:text-indigo-600 transition-colors">
                  {tryout.name}
                </h4>
                <div className="flex items-center gap-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                  <span>{tryout.questions} Soal</span>
                </div>
              </div>
            </td>
            <td className="py-6 px-4">
              <div className="flex flex-col gap-2 min-w-[150px]">
                <ProgressBar
                  progress={Math.round(progressValue)}
                  label={`${tryout.studentsFinished}/${tryout.totalStudents} Siswa`}
                  color={isEnded ? "bg-slate-400" : "bg-teal-500"}
                />
              </div>
            </td>
            <td className="py-6 px-4 text-center">
              <div className="flex flex-col items-center gap-1">
                <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-600 dark:text-slate-200 uppercase tracking-tighter">
                  <Clock size={12} className="text-slate-400" /> {tryout.duration}
                </div>
                <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                  {new Date(tryout.startDate).toLocaleDateString()}
                </div>
              </div>
            </td>
            <td className="py-6 px-4 text-center">
              <Badge
                text={isEnded ? 'Selesai' : tryout.status === 'active' ? 'Aktif' : 'Draft'}
                variant={isEnded ? 'Neutral' : tryout.status === 'active' ? 'Success' : 'Warning'}
              />
            </td>
            <td className="py-6 px-8 text-right">
              <div className="flex justify-end gap-2 opacity-100">
                <button
                  onClick={() => handleEdit(tryout?.id)}
                  className="flex items-center gap-2 px-3 py-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-xl transition-all font-black text-[10px] uppercase"
                >
                  <Edit2 size={14} /> Edit
                </button>
                <button
                  onClick={() => setDeleteConfirmId(tryout.id)}
                  className="flex items-center gap-2 px-3 py-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-all font-black text-[10px] uppercase"
                >
                  <Trash2 size={14} /> Hapus
                </button>
              </div>
            </td>
          </tr>
        );
      }}
    />

    {/* DELETE CONFIRMATION */}
    <ConfirmDialog
      isOpen={deleteConfirmId !== null}
      variant="danger"
      title="Hapus Sesi Tryout?"
      message="Menghapus sesi ini akan menghilangkan seluruh data progres siswa yang sedang berjalan. Tindakan ini tidak dapat dibatalkan."
      confirmLabel="Ya, Hapus Permanen"
      cancelLabel="Batal"
      onConfirm={handleDelete}
      onCancel={() => setDeleteConfirmId(null)}
    />
  </div>
  );
}