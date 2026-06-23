import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  User,
  Fingerprint,
  Lock,
  CheckCircle2,
  Info,
  Layers,
  ShieldCheck
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/utilitas/api';
import Dropdown from '@/komponen/ui/Dropdown';
import Badge from '@/komponen/ui/Badge';
import { importPenggunaCsvAdmin, createPenggunaAdmin, getPenggunaAdmin, updatePenggunaAdmin } from '@/utilitas/apiAdmin';

const mockUsersLookup = [
  { id: 1, name: 'Ahmad Rafiq', role: 'student', gender: 'Laki-laki', idNumber: '0012345678', class: '6A', status: 'active' },
  { id: 2, name: 'Budi Santoso', role: 'student', gender: 'Laki-laki', idNumber: '0012345679', class: '6B', status: 'active' },
  { id: 3, name: 'Citra Kirana', role: 'student', gender: 'Perempuan', idNumber: '0012345680', class: '6A', status: 'active' },
  { id: 4, name: 'Dewi Lestari', role: 'admin', gender: 'Perempuan', idNumber: '19870321', class: 'N/A', status: 'active' },
];

/**
 * AddUser Page
 * refactored to vertical linear flow matching TambahTryout.jsx style.
 */
export default function AddUser() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  // Form States
  const [formData, setFormData] = useState({
    name: '',
    role: 'student',
    gender: 'Laki-laki',
    idNumber: '', // NISN/NIP
    password: '',
    class: '',
    status: 'active'
  });
  const [csvFile, setCsvFile] = useState(null);
  const [kelasOptions, setKelasOptions] = useState([
    { value: '6A', label: 'Kelas 6A' },
    { value: '6B', label: 'Kelas 6B' },
    { value: '6C', label: 'Kelas 6C' }
  ]);

  // Load user data if edit mode
  useEffect(() => {
    api.get('/admin/kelas')
      .then((res) => {
      const options = (res.data.data || []).map((item) => ({
        value: item.id_kelas,
        label: item.nama_kelas
      }));
        if (options.length) setKelasOptions(options);
      })
      .catch(() => {});

    if (isEdit) {
      getPenggunaAdmin(id)
        .then((data) => {
          const role = data?.role === 'siswa' ? 'student' : data?.role || 'admin';
          const profile = data?.siswa || data?.guru || {};
          setFormData({
            name: profile?.nama_lengkap || '',
            role,
            gender: profile?.gender || 'Laki-laki',
            idNumber: profile?.nisn || profile?.nip || '',
            password: '',
            class: profile?.kelas_id || '',
            status: data?.status || 'aktif'
          });
        })
        .catch(() => {
          toast.error('Data pengguna tidak ditemukan');
          navigate('/admin/pengguna');
        });
    }
  }, [id, isEdit, navigate]);

  const handleSave = async () => {
    if (!formData?.name || !formData?.idNumber) {
      toast.error('Nama dan Nomor Identitas wajib diisi!');
      return;
    }
    const payload = {
      username: formData.idNumber,
      password: formData.password || '12345678',
      role: formData.role === 'student' ? 'siswa' : formData.role === 'guru' ? 'guru' : 'admin',
      status: formData.status === 'active' ? 'aktif' : 'nonaktif',
      nama_lengkap: formData.name,
      gender: formData.gender,
      kelas_id: formData.role === 'student' ? Number(formData.class) || formData.class : undefined,
      nisn: formData.role === 'student' ? formData.idNumber : undefined,
      nip: formData.role === 'guru' ? formData.idNumber : undefined,
    };

    try {
      if (isEdit) {
        await updatePenggunaAdmin(id, payload);
      } else {
        await createPenggunaAdmin(payload);
      }
      toast.success(isEdit ? 'Data pengguna berhasil diperbarui' : 'Pengguna berhasil didaftarkan');
      setTimeout(() => navigate('/admin/pengguna'), 1200);
    } catch (error) {
      toast.error('Gagal menyimpan pengguna');
    }
  };

  const handleGeneratePassword = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let generated = '';
    for (let i = 0; i < 10; i++) {
      generated += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData(prev => ({ ...prev, password: generated }));
    toast.success('Password acak berhasil dibuat!');
  };

  const handleImportCsv = async () => {
    if (!csvFile) {
      toast.error('Pilih file CSV terlebih dahulu');
      return;
    }
    try {
      const result = await importPenggunaCsvAdmin(csvFile);
      toast.success(`Import selesai: ${result?.data?.total_created || 0} data berhasil`);
    } catch (error) {
      toast.error('Gagal import CSV pengguna');
    }
  };

  if (!formData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        <span className="text-slate-500 font-black tracking-widest text-xs uppercase animate-pulse">Memuat Data Pengguna...</span>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-8 pb-32 max-w-5xl mx-auto">
      {/* HEADER */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/admin/pengguna')}
          className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-all shadow-sm"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic">
            {isEdit ? 'Edit' : 'Tambah'} <span className="text-indigo-600">Pengguna</span>
          </h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
            {isEdit ? `Memperbarui informasi akun ID: #${id}` : 'Daftarkan akun admin, guru, atau siswa ke dalam sistem'}
          </p>
        </div>
      </div>

      {/* VERTICAL FORM FLOW */}
      <div className="space-y-8">
        <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-10 border border-slate-100 dark:border-slate-700 space-y-4 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-teal-50 dark:bg-teal-900/30 rounded-xl flex items-center justify-center text-teal-600">
              <Layers size={20} />
            </div>
            <div>
              <span className="text-[9px] font-black uppercase text-teal-500 tracking-wider">Import CSV</span>
              <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-widest">Upload Pengguna Massal</h3>
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <input
              type="file"
              accept=".csv,text/csv"
              onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
              className="block w-full text-sm text-slate-500 file:mr-4 file:py-3 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-black file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
            />
            <button
              onClick={handleImportCsv}
              className="px-5 py-3 rounded-2xl bg-teal-600 text-white text-[10px] font-black uppercase tracking-widest"
            >
              Import CSV
            </button>
          </div>
        </div>
        
        {/* CARD 1: IDENTITAS PENGGUNA */}
        <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-10 border border-slate-100 dark:border-slate-700 space-y-8 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600">
              <User size={20} />
            </div>
            <div>
              <span className="text-[9px] font-black uppercase text-indigo-500 tracking-wider">Langkah 1 dari 3</span>
              <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-widest">Identitas Pengguna</h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nama Lengkap</label>
              <div className="relative group">
                <User size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="E.g. Ahmad Fauzi"
                  className="w-full pl-14 pr-5 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl text-xs font-bold outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all dark:text-white"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nomor Identitas (NISN/NIP)</label>
              <div className="relative group">
                <Fingerprint size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                <input
                  type="text"
                  value={formData.idNumber}
                  onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
                  placeholder="Nomor identitas unik..."
                  className="w-full pl-14 pr-5 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl text-xs font-bold outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all dark:text-white"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Gender</label>
              <Dropdown
                value={formData.gender}
                onChange={(val) => setFormData({ ...formData, gender: val })}
                options={[
                  { value: 'Laki-laki', label: 'Laki-laki' },
                  { value: 'Perempuan', label: 'Perempuan' }
                ]}
                fullWidth
              />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Peran / Role</label>
              <Dropdown
                value={formData?.role}
                onChange={(val) => setFormData({ ...formData, role: val })}
                options={[
                  { value: 'student', label: 'Siswa' },
                  { value: 'guru', label: 'Guru (Wali Kelas)' },
                  { value: 'admin', label: 'Administrator' }
                ]}
                fullWidth
              />
            </div>

            {formData?.role === 'student' && (
              <div className="space-y-3 animate-in zoom-in-95 md:col-span-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Pilih Kelas</label>
                <Dropdown
                  value={formData.class}
                  onChange={(val) => setFormData({ ...formData, class: val })}
                  options={kelasOptions}
                  fullWidth
                />
              </div>
            )}
          </div>
        </div>

        {/* CARD 2: KEAMANAN & STATUS */}
        <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-10 border border-slate-100 dark:border-slate-700 space-y-8 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-amber-50 dark:bg-amber-900/30 rounded-xl flex items-center justify-center text-amber-600">
              <Lock size={20} />
            </div>
            <div>
              <span className="text-[9px] font-black uppercase text-amber-500 tracking-wider">Langkah 2 dari 3</span>
              <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-widest">Keamanan & Status</h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
                <button 
                  onClick={handleGeneratePassword}
                  className="text-[8px] font-black text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 px-2.5 py-1 rounded-lg uppercase tracking-widest transition-all hover:bg-indigo-100"
                >
                  Acak
                </button>
              </div>
              <div className="relative group">
                <Lock size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full pl-14 pr-5 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl text-xs font-bold outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all dark:text-white"
                />
              </div>
            </div>

            <div className="p-5 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-700 flex flex-col justify-center">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${formData.status === 'active' ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                  <span className="text-[10px] font-black text-slate-700 dark:text-white uppercase tracking-widest">Status Akun</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={formData.status === 'active'} onChange={() => setFormData({ ...formData, status: formData.status === 'active' ? 'inactive' : 'active' })} />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.05em] leading-relaxed">Saat akun aktif, pengguna bisa langsung mengakses portal setelah disimpan.</p>
            </div>
          </div>
        </div>

        {/* CARD 3: VERIFIKASI */}
        <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-10 border border-slate-100 dark:border-slate-700 space-y-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-purple-50 dark:bg-purple-900/30 rounded-xl flex items-center justify-center text-purple-600">
              <CheckCircle2 size={20} />
            </div>
            <div>
              <span className="text-[9px] font-black uppercase text-purple-500 tracking-wider">Langkah 3 dari 3</span>
              <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-widest">Verifikasi Identitas</h3>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-2xl border border-indigo-100 dark:border-indigo-900/30">
              <Info size={16} className="text-indigo-500 mt-1 shrink-0" />
              <p className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tight leading-relaxed">
                Nomor identitas (NISN / NIP) bersifat unik dan tidak dapat diubah di kemudian hari. Pastikan data yang dimasukkan telah sesuai dengan data dapodik.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* SUMMARY BAR */}
      <div className="w-full">
        <div className="bg-slate-900 border-t-4 border-indigo-500 rounded-[2.5rem] px-8 md:px-12 py-8 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 overflow-hidden relative">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-8 md:gap-14">
            <div className="flex flex-col items-center md:items-start min-w-[120px]">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1 shadow-sm">Peran Pengguna</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
                <span className="text-xl font-black text-white italic tracking-tighter leading-none uppercase">
                  {formData.role === 'student' ? 'Siswa' : formData.role === 'guru' ? 'Guru' : 'Administrator'}
                </span>
              </div>
            </div>

            <div className="hidden sm:flex flex-col">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Nomor Identitas</span>
              <Badge text={formData.idNumber || 'Belum diisi'} variant={formData.idNumber ? 'Success' : 'Neutral'} className="px-5 py-1" />
            </div>

            <div className="hidden lg:flex flex-col">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Kesiapan Data</span>
              <div className="flex items-center gap-2">
                <span className={`text-sm font-black italic tracking-wide ${formData.name && formData.idNumber ? 'text-emerald-400' : 'text-slate-600'}`}>
                  {formData.name && formData.idNumber ? 'Data Lengkap' : 'Lengkapi Field Wajib'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4 w-full md:w-auto justify-center md:justify-end">
            <button
              onClick={() => navigate('/admin/pengguna')}
              className="px-6 py-4 text-slate-400 hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors mr-2 md:mr-6"
            >
              Batal
            </button>
            <button
              onClick={handleSave}
              className="bg-white text-slate-900 px-12 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all active:scale-95 shadow-xl shadow-white/10"
            >
              {isEdit ? 'Perbarui Pengguna' : 'Simpan Pengguna'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
