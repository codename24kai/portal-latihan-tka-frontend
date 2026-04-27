import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Video,
  FileText,
  Layers,
  Filter
} from 'lucide-react';
import toast from 'react-hot-toast';
import { SUBJECTS } from '../../constants/subjects';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import Dropdown from '../../components/ui/Dropdown';
import Badge from '../../components/ui/Badge';
import DataTable from '../../components/ui/DataTable';

// Mock data adapted for Guru
const initialModules = [
  { id: 101, title: 'Matematika: Aljabar Dasar Kelas 6A', type: 'video', subject: 'Matematika', category: 'Harian', status: 'published', target_class: '6A', hasQuiz: true, questionCount: 5 },
  { id: 102, title: 'Bahasa Indonesia: Teks Eksplanasi', type: 'pdf', subject: 'Bahasa Indonesia', category: 'Harian', status: 'published', target_class: '6A', hasQuiz: false },
  { id: 103, title: 'Matematika: Bangun Ruang', type: 'video', subject: 'Matematika', category: 'Mandiri', status: 'draft', target_class: '6A', hasQuiz: true, questionCount: 10 },
];

export default function GuruManageModules() {
  const navigate = useNavigate();
  const assignedClass = localStorage.getItem('assignedClass') ?? '';
  const [modules, setModules] = useState(initialModules);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSubject, setFilterSubject] = useState('Semua');
  const [filterStatus, setFilterStatus] = useState('Semua');
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Scoped filtering
  const filteredModules = useMemo(() => {
    return (modules ?? [])
      .filter(m => m?.target_class === assignedClass)
      .filter(m => {
        const matchesSearch = (m?.title ?? '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSubject = filterSubject === 'Semua' || m?.subject === filterSubject;
        const matchesStatus = filterStatus === 'Semua' || m?.status === filterStatus.toLowerCase();
        return matchesSearch && matchesSubject && matchesStatus;
      });
  }, [modules, assignedClass, searchTerm, filterSubject, filterStatus]);

  const handleDelete = () => {
    setModules(prev => prev.filter(m => m.id !== deleteConfirmId));
    toast.success('Modul berhasil dihapus permanen');
    setDeleteConfirmId(null);
  };

  const getIcon = (type) => {
    switch (type) {
      case 'video': return <Video className="w-4 h-4 text-orange-500" />;
      case 'pdf': return <FileText className="w-4 h-4 text-teal-500" />;
      default: return <Layers className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-50 dark:bg-orange-950/30 rounded-xl flex items-center justify-center text-orange-600 font-bold">
              <Layers size={24} />
            </div>
            Kelola Modul Pembelajaran
          </h1>
          <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest italic flex items-center gap-2">
            <span>{filteredModules.length} Modul Terdaftar</span>
            <span className="w-1 h-1 bg-slate-200 rounded-full" />
            <span>{filteredModules.filter(m => m.status === 'published').length} Dipublikasi</span>
            <span className="w-1 h-1 bg-slate-200 rounded-full" />
            <span>Kelas {assignedClass}</span>
          </p>
        </div>
        <button
          onClick={() => navigate('add')}
          className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all shadow-xl shadow-orange-600/20 active:scale-95 flex items-center gap-2"
        >
          <Plus size={18} /> Tambah Modul
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-700 space-y-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
            <input
              type="text"
              placeholder="Cari judul modul..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-6 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-orange-500/10 outline-none transition-all dark:text-white shadow-sm"
            />
          </div>
          <div className="flex flex-wrap gap-4">
            <Dropdown
              value={filterSubject}
              onChange={setFilterSubject}
              options={[
                { value: 'Semua', label: 'Semua Mapel' }, 
                ...SUBJECTS.filter(s => s.category === 'Akademik').map(s => ({ value: s.name, label: s.name }))
              ]}
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
        rowsPerPage={10}
        renderRow={(module) => (
          <tr key={module.id} className="hover:bg-orange-50/30 dark:hover:bg-slate-900/30 transition-colors group">
            <td className="py-6 px-8">
              <div className="flex flex-col">
                <p className="font-black text-slate-800 dark:text-white text-sm group-hover:text-orange-600 transition-colors uppercase tracking-tight">
                  {module.title}
                </p>
                <div className="flex items-center gap-2 mt-1.5">
                  <Badge text={module.subject} variant="Info" />
                  <span className="w-1 h-1 rounded-full bg-slate-200 dark:bg-slate-700" />
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
                  <span className="text-[9px] font-black text-slate-400 uppercase">{module.questionCount} Soal</span>
                </div>
              ) : (
                <Badge text="Kosong" variant="Neutral" />
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
                  onClick={() => navigate(`edit/${module.id}`)}
                  className="flex items-center gap-2 px-4 py-2 text-slate-400 hover:text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-900/20 rounded-xl transition-all font-black text-[10px] uppercase"
                >
                  <Edit2 size={14} /> Edit
                </button>
                <button
                  onClick={() => setDeleteConfirmId(module.id)}
                  className="flex items-center gap-2 px-4 py-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-all font-black text-[10px] uppercase"
                >
                  <Trash2 size={14} /> Hapus
                </button>
              </div>
            </td>
          </tr>
        )}
      />

      {/* EMPTY STATE */}
      {filteredModules.length === 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-dashed border-slate-200 dark:border-slate-700 p-20 text-center">
           <div className="w-20 h-20 bg-slate-50 dark:bg-slate-900 rounded-3xl flex items-center justify-center text-slate-300 mx-auto mb-6">
              <Layers size={40} />
           </div>
           <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight mb-2">Belum ada modul khusus</h3>
           <p className="text-sm font-bold text-slate-400 uppercase tracking-widest max-w-sm mx-auto">
             Mulai buat modul pembelajaran harian pertama Anda untuk Kelas {assignedClass}.
           </p>
        </div>
      )}

      {/* DELETE CONFIRMATION */}
      <ConfirmDialog
        isOpen={deleteConfirmId !== null}
        variant="danger"
        title="Hapus Modul?"
        message="Menghapus modul ini akan menghilangkan akses bagi siswa Anda. Data tidak dapat dikembalikan."
        confirmLabel="Ya, Hapus"
        cancelLabel="Batal"
        onConfirm={handleDelete}
        onCancel={() => setDeleteConfirmId(null)}
      />
    </div>
  );
}
