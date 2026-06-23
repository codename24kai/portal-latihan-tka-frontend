import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Edit2, Trash2, Dumbbell, Calendar, Clock, BookOpen, Layers } from 'lucide-react';
import toast from 'react-hot-toast';
import ConfirmDialog from '@/komponen/ui/DialogKonfirmasi';
import Dropdown from '@/komponen/ui/Dropdown';
import Badge from '@/komponen/ui/Badge';
import DataTable from '@/komponen/ui/TabelData';

export default function KelolaLatihanGuru() {
  const navigate = useNavigate();
  const assignedClass = localStorage.getItem('assignedClass') ?? '6A';

  const [latihans, setLatihans] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const filteredLatihans = latihans.filter(item => {
    return item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
           item.subject.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleDelete = () => {
    setLatihans(prev => prev.filter(l => l.id !== deleteConfirmId));
    toast.success('Latihan mandiri berhasil dihapus');
    setDeleteConfirmId(null);
  };

  const headers = [
    { label: 'Detail Latihan' },
    { label: 'Total Soal', align: 'center' },
    { label: 'Target Waktu', align: 'center' },
    { label: 'Aksi', align: 'right' }
  ];

  const renderRow = (latihan) => (
    <tr key={latihan.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors group">
      <td className="py-6 px-8">
        <div className="flex flex-col">
          <p className="font-black text-slate-805 dark:text-white text-sm group-hover:text-teal-650 transition-colors uppercase tracking-tight">{latihan.title}</p>
          <div className="flex items-center gap-2 mt-1.5">
            <Badge text={latihan.subject} variant="Info" />
            <span className="w-1 h-1 rounded-full bg-slate-300" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Kelas {assignedClass}</span>
          </div>
        </div>
      </td>
      <td className="py-6 px-4 text-center">
        <span className="text-xs font-black text-slate-700 dark:text-slate-205">{latihan.totalQuestions} Soal</span>
      </td>
      <td className="py-6 px-4 text-center">
        <span className="text-xs font-black text-slate-700 dark:text-slate-205">{Math.round(latihan.duration / 60)} Menit</span>
      </td>
      <td className="py-6 px-8 text-right">
        <div className="flex justify-end gap-2">
          <button
            onClick={() => navigate(`/guru/latihan/edit/${latihan.id}`)}
            className="flex items-center gap-2 px-3 py-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 rounded-xl transition-all font-black text-[10px] uppercase"
          >
            <Edit2 size={14} /> Edit
          </button>
          <button
            onClick={() => setDeleteConfirmId(latihan.id)}
            className="flex items-center gap-2 px-3 py-2 text-slate-400 hover:text-rose-505 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl transition-all font-black text-[10px] uppercase"
          >
            <Trash2 size={14} /> Hapus
          </button>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-808 dark:text-white flex items-center gap-3 uppercase tracking-tight italic">
            <div className="w-10 h-10 bg-teal-50 dark:bg-teal-900/30 rounded-xl flex items-center justify-center text-teal-600">
              <Dumbbell size={24} />
            </div>
            Kelola <span className="text-teal-600 italic-none not-italic">Latihan Mandiri</span>
          </h1>
          <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">
            Atur paket kuis latihan mandiri untuk siswa Kelas {assignedClass}
          </p>
        </div>
        <button
          onClick={() => navigate('/guru/latihan/tambah')}
          className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-teal-600/20 active:scale-95 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Tambah Paket Latihan
        </button>
      </div>

      {/* Filter & Search */}
      <div className="bg-white dark:bg-slate-800 p-5 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari judul latihan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-teal-500/10 outline-none transition-all dark:text-white"
          />
        </div>
      </div>

      {/* Data Table */}
      {filteredLatihans.length > 0 ? (
        <DataTable
          headers={headers}
          data={filteredLatihans}
          rowsPerPage={10}
          renderRow={renderRow}
        />
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-100 dark:border-slate-700 p-12 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">
          Belum ada latihan mandiri dari backend
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteConfirmId !== null}
        variant="danger"
        title="Hapus Latihan Mandiri?"
        message="Paket latihan ini akan dihapus secara permanen. Siswa tidak akan bisa mengakses latihan ini lagi."
        confirmLabel="Ya, Hapus Permanen"
        cancelLabel="Batal"
        onConfirm={handleDelete}
        onCancel={() => setDeleteConfirmId(null)}
      />

    </div>
  );
}
