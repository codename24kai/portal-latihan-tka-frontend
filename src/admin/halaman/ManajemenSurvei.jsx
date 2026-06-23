import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Search,
  FileText,
  Edit,
  Trash2,
  Heart,
  Globe,
  Settings
} from 'lucide-react';
import toast from 'react-hot-toast';
import DataTable from '@/komponen/ui/TabelData';
import Badge from '@/komponen/ui/Badge';
import ConfirmDialog from '@/komponen/ui/DialogKonfirmasi';

export default function SurveyManagement() {
  const navigate = useNavigate();
  const [surveys, setSurveys] = useState([]);
  const [search, setSearch] = useState('');
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const filteredSurveys = useMemo(() => {
    return surveys.filter(s => 
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase())
    );
  }, [surveys, search]);

  const handleDeleteClick = (id, e) => {
    e.stopPropagation();
    setSelectedId(id);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    setSurveys(prev => prev.filter(s => s.id !== selectedId));
    toast.success('Survei berhasil dihapus!');
    setIsDeleteOpen(false);
  };

  return (
    <div className="animate-fade-in space-y-8 pb-32">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic">
            Manajemen <span className="text-indigo-600">Survei TKA</span>
          </h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
            Kelola instrumen evaluasi karakter dan lingkungan belajar siswa
          </p>
        </div>

        <button
          onClick={() => navigate('/admin/survei/tambah')}
          className="px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-indigo-600/20 flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus size={16} /> Tambah Survei
        </button>
      </div>

      {/* FILTER & SEARCH */}
      <div className="bg-white dark:bg-slate-800 rounded-[2rem] p-6 border border-slate-100 dark:border-slate-700 shadow-sm flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari survei berdasarkan judul atau deskripsi..."
            className="w-full pl-14 pr-5 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl text-xs font-bold outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all dark:text-white"
          />
        </div>
      </div>

      {/* DATA TABLE */}
      <div className="bg-white dark:bg-slate-800 rounded-[3rem] p-10 border border-slate-100 dark:border-slate-700 shadow-sm">
        {filteredSurveys.length > 0 ? (
          <DataTable
            headers={[
              { label: 'Judul Survei' },
              { label: 'Tipe', align: 'center' },
              { label: 'Jumlah Pertanyaan', align: 'center' },
              { label: 'Status', align: 'center' },
              { label: 'Aksi', align: 'center' }
            ]}
            data={filteredSurveys}
            rowsPerPage={5}
            renderRow={s => (
            <tr 
              key={s.id}
              onClick={() => navigate(`/admin/survei/edit/${s.id}`)}
              className="hover:bg-slate-50 dark:hover:bg-slate-900/30 cursor-pointer transition-colors"
            >
              <td className="py-5">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${s.color || 'from-indigo-500 to-purple-600'} rounded-2xl flex items-center justify-center text-white shrink-0 shadow-md`}>
                    {s.type === 'survei_karakter' ? <Heart size={20} fill="currentColor" /> : <Globe size={20} />}
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-tight">{s.title}</h4>
                    <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase mt-0.5 line-clamp-1 max-w-md">{s.description}</p>
                  </div>
                </div>
              </td>
              <td className="py-5 text-center">
                <Badge 
                  text={s.type === 'survei_karakter' ? 'Survei Karakter' : 'Sulingjar'} 
                  variant={s.type === 'survei_karakter' ? 'Danger' : 'Success'} 
                  className="uppercase text-[8px]" 
                />
              </td>
              <td className="py-5 text-center text-xs font-black text-slate-800 dark:text-white italic">
                {s.questions?.length || 0} Butir
              </td>
              <td className="py-5 text-center">
                <Badge 
                  text={s.status === 'draft' ? 'Draft' : 'Aktif'} 
                  variant={s.status === 'draft' ? 'Neutral' : 'Info'} 
                  className="uppercase text-[8px]" 
                />
              </td>
              <td className="py-5 text-center">
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/admin/survei/edit/${s.id}`);
                    }}
                    className="p-3 bg-slate-50 dark:bg-slate-900 hover:bg-indigo-50 hover:text-indigo-600 text-slate-400 rounded-xl transition-all shadow-sm"
                  >
                    <Edit size={14} />
                  </button>
                  <button
                    onClick={(e) => handleDeleteClick(s.id, e)}
                    className="p-3 bg-slate-50 dark:bg-slate-900 hover:bg-rose-50 hover:text-rose-600 text-slate-400 rounded-xl transition-all shadow-sm"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </td>
            </tr>
            )}
          />
        ) : (
          <div className="py-16 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">
            Belum ada survei dari backend
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={isDeleteOpen}
        title="Hapus Survei?"
        message="Survei ini akan dihapus secara permanen dan tidak dapat dipulihkan."
        confirmLabel="Ya, Hapus"
        cancelLabel="Batal"
        variant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteOpen(false)}
      />
    </div>
  );
}
