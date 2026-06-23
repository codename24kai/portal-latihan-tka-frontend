import React from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AttentionStudents({ attentionStudents }) {
  const navigate = useNavigate();

  return (
    <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] border-2 border-rose-100 dark:border-rose-900/30 overflow-hidden shadow-xl shadow-rose-500/5">
      <div className="p-8 border-b border-rose-50 dark:border-rose-900/20 bg-rose-50/30 dark:bg-rose-900/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AlertCircle size={20} className="text-rose-500" />
          <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-widest">Siswa Perlu Perhatian</h3>
        </div>
        <span className="px-3 py-1 rounded-full bg-rose-500 text-white text-[10px] font-black uppercase">
          {attentionStudents.length}
        </span>
      </div>
      <div className="p-4">
        <div className="space-y-3">
          {attentionStudents.length > 0 ? attentionStudents.map((student) => (
            <div key={student?.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 flex items-center justify-between border border-transparent hover:border-rose-200 transition-all cursor-pointer group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center text-[10px] font-black text-rose-600 uppercase">
                  {student?.avatar ?? student?.name?.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-200 uppercase tracking-tight">{student?.name}</p>
                  <p className="text-[10px] font-bold text-rose-500 uppercase tracking-tighter">
                    {student?.status === 'inactive' ? 'Belum Login > 3 Hari' : `Skor Rendah: ${student?.avgScore}`}
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigate(`/guru/students?id=${student.id}`)}
                className="h-10 px-4 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-rose-500 hover:border-rose-500 transition-all"
              >
                Intervensi
              </button>
            </div>
          )) : (
            <div className="py-10 text-center">
              <CheckCircle2 size={32} className="text-teal-500 mx-auto mb-3" />
              <p className="text-xs font-bold text-slate-400 uppercase">Semua siswa dalam kondisi baik</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
