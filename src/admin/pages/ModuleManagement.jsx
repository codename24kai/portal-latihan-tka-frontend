import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Video,
  FileText,
  Layers
} from 'lucide-react';
import toast from 'react-hot-toast';
import { SUBJECTS } from '@/constants/subjects';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import Dropdown from '@/components/ui/Dropdown';
import Badge from '@/components/ui/Badge';
import DataTable from '@/components/ui/DataTable';

const mockModules = [
  { id: 1, title: 'Matematika: Pengenalan Aljabar Dasar', type: 'video', subject: 'Matematika', category: 'Akademik', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', status: 'published', hasQuiz: true, questionCount: 5, quizLocked: true, prerequisite: 'video', description: 'Materi ini membahas dasar-dasar aljabar untuk siswa kelas 6.' },
  { id: 3, title: 'Survei Lingkungan Belajar', type: 'pdf', subject: 'Survei Lingkungan Belajar', category: 'Non-Akademik', url: '#', status: 'draft', hasQuiz: true, questionCount: 10, quizLocked: true, prerequisite: 'download', description: 'Survei untuk mengukur kualitas lingkungan belajar di sekolah.' },
];

export default function ModuleManagement() {
  const navigate = useNavigate();
  const [modules, setModules] = useState(mockModules);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSubject, setFilterSubject] = useState('Semua');
  const [filterStatus, setFilterStatus] = useState('Semua');
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const filteredModules = modules?.filter(m => {
    const matchesSearch = m?.title?.toLowerCase().includes(searchTerm.toLowerCase()) || m?.subject?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = filterSubject === 'Semua' || m?.subject === filterSubject;
    const matchesStatus = filterStatus === 'Semua' || m?.status === filterStatus.toLowerCase();
    return matchesSearch && matchesSubject && matchesStatus;
  }) || [];

  const handleEdit = (id) => navigate(`edit/${id}`);

  const getIcon = (type) => {
    switch (type) {
      case 'video': return <Video className="w-4 h-4 text-indigo-500" />;
      case 'pdf': return <FileText className="w-4 h-4 text-rose-500" />;
      default: return <Layers className="w-4 h-4 text-slate-400" />;
    }
  };

  const handleDelete = () => {
    toast.success('Materi berhasil dihapus permanen');
    setModules(modules?.filter(m => m?.id !== deleteConfirmId));
    setDeleteConfirmId(null);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-3 uppercase tracking-tight">
            <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600">
              <Layers size={24} />
            </div>
            Manajemen Materi
          </h1>
          <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest flex items-center gap-2">
            <span>{modules.length} Materi Terdaftar</span>
            <span className="w-1 h-1 bg-slate-200 rounded-full" />
            <span>{modules.filter(m => m.status === 'published').length} Dipublikasi</span>
          </p>
        </div>
        <button
          onClick={() => navigate('/admin/modules/add')}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-indigo-600/20 active:scale-95 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Tambah Materi
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white dark:bg-slate-800 p-5 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-700 space-y-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari materi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all dark:text-white"
            />
          </div>
          <div className="flex flex-wrap gap-4">
            <Dropdown
              value={filterSubject}
              onChange={setFilterSubject}
              options={[{ value: 'Semua', label: 'Semua Pelajaran' }, ...SUBJECTS.filter(s => s.category === 'Akademik').map(s => ({ value: s.name, label: s.name }))]}
              className="min-w-[200px]"
            />
            <Dropdown
              value={filterStatus}
              onChange={setFilterStatus}
              options={[
                { value: 'Semua', label: 'Semua Status' },
                { value: 'Published', label: 'Published' },
                { value: 'Draft', label: 'Draft' }
              ]}
              className="min-w-[180px]"
            />
          </div>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        headers={[
          { label: 'Konten & Detail' },
          { label: 'Tipe', align: 'center' },
          { label: 'Evaluasi Kuis', align: 'center' },
          { label: 'Status', align: 'center' },
          { label: 'Aksi', align: 'right' }
        ]}
        data={filteredModules}
        rowsPerPage={5}
        renderRow={(module) => (
          <tr key={module.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors group">
            <td className="py-6 px-8">
              <div className="flex flex-col">
                <p className="font-black text-slate-800 dark:text-white text-sm group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{module.title}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <Badge text={module.subject} variant="Info" />
                  <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
                  <Badge text={module.category} variant="Neutral" />
                </div>
              </div>
            </td>
            <td className="py-6 px-4">
              <div className="flex flex-col items-center gap-1">
                <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-700 flex items-center justify-center border border-slate-100 dark:border-slate-700 transition-transform group-hover:scale-110 shadow-sm">
                  {getIcon(module.type)}
                </div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-tight">{module.type}</span>
              </div>
            </td>
            <td className="py-6 px-4 text-center">
              {module.hasQuiz ? (
                <div className="flex flex-col items-center gap-1">
                  <Badge text="Aktif" variant="Success" />
                  <span className="text-[9px] font-black opacity-60 uppercase">{module.questionCount} Soal</span>
                </div>
              ) : (
                <Badge text="Tidak Ada" variant="Neutral" className="italic opacity-50" />
              )}
            </td>
            <td className="py-6 px-4 text-center">
              <Badge
                text={module.status}
                variant={module.status === 'published' ? 'Success' : 'Warning'}
              />
            </td>
            <td className="py-6 px-8 text-right">
              <div className="flex justify-end gap-2 opacity-100">
                <button 
                  onClick={() => handleEdit(module?.id)}
                  className="flex items-center gap-2 px-3 py-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-xl transition-all font-black text-[10px] uppercase"
                >
                  <Edit2 size={14} /> Edit
                </button>
                <button
                  onClick={() => setDeleteConfirmId(module.id)}
                  className="flex items-center gap-2 px-3 py-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-all font-black text-[10px] uppercase"
                >
                  <Trash2 size={14} /> Hapus
                </button>
              </div>
            </td>
          </tr>
        )}
      />

      {/* DELETE CONFIRMATION */}
      <ConfirmDialog
        isOpen={deleteConfirmId !== null}
        variant="danger"
        title="Hapus Materi?"
        message="Materi yang sudah dihapus tidak dapat dikembalikan. Kuis yang terhubung juga akan ikut terhapus."
        confirmLabel="Ya, Hapus Permanen"
        cancelLabel="Batal"
        onConfirm={handleDelete}
        onCancel={() => setDeleteConfirmId(null)}
      />
    </div>
  );
}
