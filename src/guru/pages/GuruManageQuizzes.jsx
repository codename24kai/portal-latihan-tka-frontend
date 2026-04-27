import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Clock,
  Edit2,
  Trash2,
  Zap,
  Search,
  CheckCircle2,
  AlertCircle,
  X,
  Save,
  HelpCircle,
  Layers,
  ShieldCheck,
  ArrowLeft
} from 'lucide-react';
import toast from 'react-hot-toast';
import { SUBJECTS } from '../../constants/subjects';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import Dropdown from '../../components/ui/Dropdown';
import Badge from '../../components/ui/Badge';
import DataTable from '../../components/ui/DataTable';
import ProgressBar from '../../components/ui/ProgressBar';

const initialQuizzes = [
  { id: 201, name: 'Latihan Harian: Penjumlahan Pecahan', subject: 'Matematika', status: 'active', studentsFinished: 12, totalStudents: 16, questions: 10, duration: '20 menit', target_class: '6A' },
  { id: 202, name: 'Kuis Literasi: Puisi Rakyat', subject: 'Bahasa Indonesia', status: 'active', studentsFinished: 8, totalStudents: 16, questions: 15, duration: '30 menit', target_class: '6A' },
  { id: 203, name: 'Latihan Mandiri: Keliling Lingkaran', subject: 'Matematika', status: 'draft', studentsFinished: 0, totalStudents: 16, questions: 20, duration: '45 menit', target_class: '6A' },
];

export default function GuruManageQuizzes() {
  const navigate = useNavigate();
  const assignedClass = localStorage.getItem('assignedClass') ?? '';
  const [quizzes, setQuizzes] = useState(initialQuizzes);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua');
  const [subjectFilter, setSubjectFilter] = useState('Semua');
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const filteredQuizzes = useMemo(() => {
    return (quizzes ?? [])
      .filter(q => q?.target_class === assignedClass)
      .filter(q => {
        const matchesSearch = (q?.name ?? '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'Semua' || q?.status === statusFilter.toLowerCase();
        const matchesSubject = subjectFilter === 'Semua' || q?.subject === subjectFilter;
        return matchesSearch && matchesStatus && matchesSubject;
      });
  }, [quizzes, assignedClass, searchTerm, statusFilter, subjectFilter]);

  const handleEdit = (quiz) => {
    navigate(`edit/${quiz.id}`);
  };

  const handleAdd = () => {
    navigate('add');
  };

  const handleDelete = () => {
    setQuizzes(prev => prev.filter(q => q.id !== deleteConfirmId));
    toast.success('Latihan mandiri berhasil dihapus');
    setDeleteConfirmId(null);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-50 dark:bg-teal-900/30 rounded-xl flex items-center justify-center text-teal-600 font-bold">
              <Zap size={24} />
            </div>
            Manajemen Latihan Mandiri
          </h1>
          <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest italic">
            Kuis dan latihan harian khusus Kelas {assignedClass}
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-teal-600/20 active:scale-95 flex items-center justify-center gap-2 group"
        >
          <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center group-hover:rotate-90 transition-transform">
            <Plus size={16} strokeWidth={3} />
          </div>
          Buat Latihan Baru
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
              { value: 'active', label: 'Aktif' },
              { value: 'draft', label: 'Draft' }
            ]}
            className="min-w-[180px]"
          />
          <Dropdown
            value={subjectFilter}
            onChange={setSubjectFilter}
            options={[
              { value: 'Semua', label: 'Semua Mapel' },
              ...SUBJECTS.filter(s => s.category === 'Akademik').map(s => ({ value: s.name, label: s.name }))
            ]}
            className="min-w-[200px]"
          />
        </div>

        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
          <input
            type="text"
            placeholder="Cari nama latihan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-14 pr-5 py-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-teal-500/10 outline-none text-xs font-bold transition-all dark:text-white"
          />
        </div>
      </div>

      {/* EMPTY STATE */}
      {filteredQuizzes.length === 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-dashed border-slate-200 dark:border-slate-700 p-20 text-center">
          <div className="w-20 h-20 bg-slate-50 dark:bg-slate-900 rounded-3xl flex items-center justify-center text-slate-300 mx-auto mb-6">
            <Zap size={40} />
          </div>
          <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight mb-2">Belum ada latihan mandiri</h3>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest max-w-sm mx-auto">
            Buat latihan tambahan untuk memperkuat pemahaman siswa di Kelas {assignedClass}.
          </p>
        </div>
      )}

      {/* Table */}
      {filteredQuizzes.length > 0 && (
        <DataTable
          headers={[
            { label: 'Informasi Latihan' },
            { label: 'Progres Siswa', align: 'center' },
            { label: 'Jadwal & Durasi', align: 'center' },
            { label: 'Status', align: 'center' },
            { label: 'Aksi', align: 'right' }
          ]}
          data={filteredQuizzes}
          rowsPerPage={10}
          renderRow={(quiz) => {
            const isEnded = quiz.status === 'ended' || (quiz.endDate && new Date(quiz.endDate) < new Date());
            const progressValue = (quiz.studentsFinished / quiz.totalStudents) * 100;
            return (
              <tr key={quiz.id} className={`group hover:bg-teal-50/30 dark:hover:bg-slate-900/30 transition-colors ${isEnded ? 'opacity-60' : ''}`}>
                <td className="py-6 px-8">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2">
                      <Badge text={quiz.subject} variant="Info" />
                      <span className="text-[9px] font-bold text-slate-300 uppercase">#{quiz.id.toString().slice(-4)}</span>
                    </div>
                    <h4 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-tight group-hover:text-teal-600 transition-colors">
                      {quiz.name}
                    </h4>
                    <div className="flex items-center gap-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                      <span>{quiz.questions} Soal</span>
                    </div>
                  </div>
                </td>
                <td className="py-6 px-4">
                  <div className="flex flex-col gap-2 min-w-[150px]">
                    <ProgressBar
                      progress={Math.round(progressValue)}
                      label={`${quiz.studentsFinished}/${quiz.totalStudents} Siswa`}
                      color={isEnded ? "bg-slate-400" : "bg-teal-500"}
                    />
                  </div>
                </td>
                <td className="py-6 px-4 text-center">
                  <div className="flex flex-col items-center gap-1">
                    <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-600 dark:text-slate-200 uppercase tracking-tighter">
                      <Clock size={12} className="text-slate-400" /> {quiz.duration}
                    </div>
                    <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                      {quiz.startDate ? new Date(quiz.startDate).toLocaleDateString() : 'Belum Terjadwal'}
                    </div>
                  </div>
                </td>
                <td className="py-6 px-4 text-center">
                  <Badge
                    text={quiz.status === 'active' ? 'Aktif' : 'Draft'}
                    variant={quiz.status === 'active' ? 'Success' : 'Warning'}
                  />
                </td>
                <td className="py-6 px-8 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => handleEdit(quiz)}
                      className="flex items-center gap-2 px-3 py-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-xl transition-all font-black text-[10px] uppercase"
                    >
                      <Edit2 size={14} /> Edit
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(quiz.id)}
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
      )}

      {/* DELETE CONFIRMATION */}
      <ConfirmDialog
        isOpen={deleteConfirmId !== null}
        variant="danger"
        title="Hapus Latihan?"
        message="Data progres siswa pada latihan ini akan hilang secara permanen."
        confirmLabel="Ya, Hapus"
        cancelLabel="Batal"
        onConfirm={handleDelete}
        onCancel={() => setDeleteConfirmId(null)}
      />
    </div>
  );
}
