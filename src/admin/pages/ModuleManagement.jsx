import React, { useState } from 'react';
import { 
  Layers, 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  Video, 
  FileText, 
  Link as LinkIcon 
} from 'lucide-react';

const mockModules = [
  { id: 1, title: 'Matematika: Pengenalan Aljabar Dasar', type: 'video', subject: 'Matematika', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', status: 'published' },
  { id: 2, title: 'Bahasa Indonesia: Teks Prosedur', type: 'text', subject: 'Bahasa Indonesia', url: '#', status: 'published' },
  { id: 3, title: 'Survei Lingkungan Belajar: Peningkatan Kualitas Pembelajaran', type: 'pdf', subject: 'Survei Lingkungan Belajar', url: '#', status: 'draft' },
  { id: 4, title: 'Survei Karakter: Pembentukan Profil Pelajar Pancasila', type: 'video', subject: 'Survei Karakter', url: '#', status: 'published' },
];

export default function ModuleManagement() {
  const [modules, setModules] = useState(mockModules);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredModules = modules.filter(m => 
    m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getIcon = (type) => {
    switch (type) {
      case 'video': return <Video className="w-4 h-4 text-primary" />;
      case 'pdf': return <FileText className="w-4 h-4 text-red-500" />;
      default: return <LinkIcon className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-6 h-6 text-primary" />
            Manajemen Materi Belajar
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Unggah dan kelola video, PDF, dan teks untuk siswa.
          </p>
        </div>
        <button className="bg-primary hover:bg-primary-dark text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Tambah Materi
        </button>
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-dark-surface p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input 
            type="text"
            placeholder="Cari judul materi atau mata pelajaran..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-[#1E1E2E] border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all dark:text-white"
          />
        </div>
      </div>

      {/* Table grid */}
      <div className="bg-white dark:bg-dark-surface rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-[#1E1E2E]/50 border-b border-slate-100 dark:border-slate-800">
                <th className="py-4 px-6 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Judul Materi</th>
                <th className="py-4 px-6 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Mata Pelajaran</th>
                <th className="py-4 px-6 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Tipe</th>
                <th className="py-4 px-6 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                <th className="py-4 px-6 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredModules.map((module) => (
                <tr key={module.id} className="hover:bg-slate-50/50 dark:hover:bg-[#1E1E2E]/50 transition-colors">
                  <td className="py-4 px-6">
                    <p className="font-medium text-slate-900 dark:text-white text-sm">{module.title}</p>
                  </td>
                  <td className="py-4 px-6 text-sm text-slate-600 dark:text-slate-300">
                    <span className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-xs font-medium">
                      {module.subject}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800">
                        {getIcon(module.type)}
                      </div>
                      <span className="text-sm font-medium text-slate-600 dark:text-slate-300 capitalize">{module.type}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                      module.status === 'published' 
                        ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20'
                        : 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-500/10 dark:text-yellow-400 dark:border-yellow-500/20'
                    }`}>
                      {module.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
