import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Search,
  Plus,
  Edit2,
  Trash2,
  ShieldCheck,
  GraduationCap,
  FileSpreadsheet,
  X,
  User,
  Shield,
  Fingerprint,
  Lock,
  ChevronDown
} from 'lucide-react';
import toast from 'react-hot-toast';
import DataTable from '../../components/ui/DataTable';
import Badge from '../../components/ui/Badge';
import ConfirmDialog from '../../components/ui/ConfirmDialog';

const initialUsers = [
  { id: 1, name: 'Ahmad Rafiq', username: 'student1', role: 'student', class: '6A', status: 'active', gender: 'Laki-laki', nidn: '0012345678' },
  { id: 2, name: 'Budi Santoso', username: 'student2', role: 'student', class: '6B', status: 'active', gender: 'Laki-laki', nidn: '0012345679' },
  { id: 3, name: 'Citra Kirana', username: 'student3', role: 'student', class: '6A', status: 'active', gender: 'Perempuan', nidn: '0012345680' },
  { id: 4, name: 'Dewi Lestari', username: 'teacher1', role: 'teacher', class: 'N/A', status: 'active', gender: 'Perempuan', nidn: '19870321' },
];

export default function UserManagement() {
  const navigate = useNavigate();
  const [users, setUsers] = useState(initialUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Import States
  const [importData, setImportData] = useState([]);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // Filtering mock logic
  const filteredUsers = users?.filter(user => {
    const matchesSearch = user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user?.username?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' ? true : user?.role === filterRole;
    return matchesSearch && matchesRole;
  }) || [];

  const handleEdit = (id) => navigate(`edit/${id}`);

  const handleDelete = () => {
    toast.success('Pengguna berhasil dihapus');
    setUsers(users?.filter(u => u?.id !== deleteConfirmId));
    setDeleteConfirmId(null);
  };

  // Import Logic
  const handleImportTrigger = () => {
    document.getElementById('excel-import-input').click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    toast.loading('Membaca file Excel...', { duration: 1000 });

    setTimeout(() => {
      const mockImported = [
        { id: Date.now() + 1, name: 'Siti Aminah', username: 'siti88', role: 'student', class: '6C', gender: 'Perempuan', status: 'active' },
        { id: Date.now() + 2, name: 'Bambang Pamungkas', username: 'bp20', role: 'student', class: '6B', gender: 'Laki-laki', status: 'active' },
        { id: Date.now() + 3, name: 'Ibu Guru Ani', username: 'ani_guru', role: 'teacher', class: 'N/A', gender: 'Perempuan', status: 'active' },
      ];
      setImportData(mockImported);
      setIsImportModalOpen(true);
      e.target.value = '';
    }, 1200);
  };

  const confirmImport = () => {
    setUsers(prev => [...prev, ...importData]);
    toast.success(`${importData.length} pengguna baru berhasil diimpor`);
    setIsImportModalOpen(false);
    setImportData([]);
  };

  const headers = [
    { label: 'Pengguna' },
    { label: 'Username' },
    { label: 'Peran', align: 'center' },
    { label: 'Kelas', align: 'center' },
    { label: 'Aksi', align: 'right' }
  ];

  const renderRow = (user) => (
    <tr key={user.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors group">
      <td className="py-5 px-8">
        <div className="flex items-center gap-4">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shadow-sm ${user.gender === 'Perempuan'
              ? 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400'
              : 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400'
            }`}>
            {user.name.charAt(0)}
          </div>
          <div>
            <p className="font-black text-slate-800 dark:text-white text-sm uppercase tracking-tight group-hover:text-indigo-600 transition-colors">{user.name}</p>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{user.gender || 'Laki-laki'}</span>
          </div>
        </div>
      </td>
      <td className="py-5 px-8">
        <code className="text-[10px] font-black bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded text-slate-600 dark:text-slate-400 uppercase tracking-wider">
          {user.username}
        </code>
      </td>
      <td className="py-5 px-8 text-center">
        <Badge 
          text={user.role === 'teacher' ? 'Guru' : 'Siswa'} 
          variant={user.role === 'teacher' ? 'Info' : 'Success'} 
        />
      </td>
      <td className="py-5 px-8 text-center">
        <span className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">
          {user.class}
        </span>
      </td>
      <td className="py-5 px-8 text-right">
        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={() => handleEdit(user?.id)}
            className="flex items-center gap-2 px-3 py-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-xl transition-all font-black text-[10px] uppercase"
          >
            <Edit2 size={14} /> Edit
          </button>
          <button
            onClick={() => setDeleteConfirmId(user.id)}
            className="flex items-center gap-2 px-3 py-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-all font-black text-[10px] uppercase"
          >
            <Trash2 size={14} /> Hapus
          </button>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-3 uppercase tracking-tight">
            <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600">
              <Users size={24} />
            </div>
            Manajemen Pengguna
          </h1>
          <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">
            Kelola akun guru dan siswa secara menyeluruh
          </p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <input 
            type="file" 
            id="excel-import-input" 
            className="hidden" 
            accept=".xlsx,.xls" 
            onChange={handleFileChange}
          />
          <button 
            onClick={handleImportTrigger}
            className="flex-1 sm:flex-none flex items-center justify-center gap-3 px-6 py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 hover:shadow-lg transition-all active:scale-95"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
            Import Excel
          </button>
          <button
            onClick={() => navigate('/admin/users/add')}
            className="flex-1 sm:flex-none bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-indigo-600/20 active:scale-95 flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Tambah Pengguna
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white dark:bg-slate-800 p-5 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 h-full">
          <Search className="w-4 h-4 absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nama atau username..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-14 pr-4 py-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all dark:text-white"
          />
        </div>
        <div className="relative group min-w-[200px]">
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="w-full pl-5 pr-12 py-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl text-sm font-bold text-slate-700 dark:text-slate-200 outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all appearance-none cursor-pointer"
          >
            <option value="all">Semua Peran</option>
            <option value="student">Siswa</option>
            <option value="teacher">Guru</option>
          </select>
          <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-indigo-600 transition-colors" size={18} />
        </div>
      </div>

      {/* Table */}
      <DataTable 
        headers={headers}
        data={filteredUsers}
        rowsPerPage={10}
        renderRow={renderRow}
      />


      {/* DELETE CONFIRMATION */}
      <ConfirmDialog
        isOpen={deleteConfirmId !== null}
        variant="danger"
        title="Hapus Pengguna?"
        message="Akun pengguna ini akan dihapus secara permanen. Pengguna tidak akan bisa login kembali ke dalam portal."
        confirmLabel="Ya, Hapus Permanen"
        cancelLabel="Batal"
        onConfirm={handleDelete}
        onCancel={() => setDeleteConfirmId(null)}
      />

      {/* IMPORT PREVIEW MODAL */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setIsImportModalOpen(false)} />
          <div className="relative w-full max-w-4xl bg-white dark:bg-slate-800 rounded-[3rem] shadow-2xl border border-slate-100 dark:border-slate-700 overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
             <div className="px-10 py-8 border-b border-slate-50 dark:border-slate-700 flex items-center justify-between bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl shrink-0">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                      <FileSpreadsheet size={24} />
                   </div>
                   <div>
                      <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight">Pratinjau Impor Pengguna</h3>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Siap mendaftarkan {importData?.length} akun baru</p>
                   </div>
                </div>
                <button onClick={() => setIsImportModalOpen(false)} className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-400 hover:text-rose-500 transition-all">
                   <X size={24} />
                </button>
             </div>

             <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                <div className="bg-slate-50/50 dark:bg-slate-900/30 rounded-[2rem] border border-slate-100 dark:border-slate-700 overflow-hidden">
                   <DataTable 
                    headers={[
                      { label: 'No', align: 'center' },
                      { label: 'Pengguna' },
                      { label: 'Username', align: 'center' },
                      { label: 'Peran', align: 'center' },
                      { label: 'Kelas', align: 'center' }
                    ]}
                    data={importData}
                    rowsPerPage={50}
                    renderRow={(item, idx) => (
                      <tr key={item?.id} className="border-b border-slate-100/50 dark:border-slate-700/50">
                        <td className="py-4 px-6 text-center text-[10px] font-black text-slate-300">{(idx + 1).toString().padStart(2, '0')}</td>
                        <td className="py-4 px-6">
                           <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 font-black text-[10px]">
                                {item?.name?.charAt(0)}
                              </div>
                              <p className="text-xs font-bold text-slate-700 dark:text-slate-200">{item?.name}</p>
                           </div>
                        </td>
                        <td className="py-4 px-6 text-center">
                           <code className="text-[9px] font-black bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded text-slate-500">{item?.username}</code>
                        </td>
                        <td className="py-4 px-6 text-center">
                           <Badge text={item?.role === 'teacher' ? 'Guru' : 'Siswa'} variant={item?.role === 'teacher' ? 'Info' : 'Success'} className="!text-[8px]" />
                        </td>
                        <td className="py-4 px-6 text-center">
                           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item?.class}</span>
                        </td>
                      </tr>
                    )}
                   />
                </div>
             </div>

             <div className="p-10 bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                   <ShieldCheck size={20} className="text-emerald-500" />
                   <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Data akan diproses dan akun akan langsung aktif.</p>
                </div>
                <div className="flex items-center gap-4">
                   <button 
                    onClick={() => setIsImportModalOpen(false)}
                    className="px-8 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 transition-all hover:bg-slate-50"
                   >
                    Batalkan
                   </button>
                   <button 
                    onClick={confirmImport}
                    className="px-10 py-4 bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-emerald-600/20 hover:bg-emerald-700 transition-all active:scale-95"
                   >
                    Konfirmasi & Impor Akun
                   </button>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
