import { Plus, Calendar, Users, Clock, MoreVertical, Play, Pause } from 'lucide-react';

// Mock tryout data
const mockTryouts = [
  { id: 1, name: 'Tryout Minggu ke-1', subject: 'Matematika', status: 'active', students: 42, questions: 40, duration: '90 menit', startDate: '2026-03-31', endDate: '2026-04-07' },
  { id: 2, name: 'Tryout Minggu ke-1', subject: 'Bahasa Indonesia', status: 'active', students: 38, questions: 35, duration: '70 menit', startDate: '2026-03-31', endDate: '2026-04-07' },
  { id: 3, name: 'Tryout Minggu ke-1', subject: 'IPA', status: 'active', students: 45, questions: 30, duration: '60 menit', startDate: '2026-03-31', endDate: '2026-04-07' },
  { id: 4, name: 'Pra-Ujian Semester', subject: 'Semua Mapel', status: 'draft', students: 0, questions: 120, duration: '180 menit', startDate: '2026-04-14', endDate: '2026-04-21' },
  { id: 5, name: 'Latihan Harian', subject: 'Matematika', status: 'ended', students: 48, questions: 20, duration: '30 menit', startDate: '2026-03-24', endDate: '2026-03-28' },
];

const statusConfig = {
  active: { label: 'Aktif', color: 'bg-correct/10 text-correct', dot: 'bg-correct' },
  draft: { label: 'Draft', color: 'bg-slate-100 dark:bg-dark-border text-slate-500 dark:text-slate-400', dot: 'bg-slate-400 dark:bg-slate-500' },
  ended: { label: 'Selesai', color: 'bg-primary-50 dark:bg-primary/20 text-primary dark:text-primary-light', dot: 'bg-primary' },
};

export default function TryoutManagement() {
  return (
    <div id="tryout-management" className="animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-dark dark:text-white">Manajemen Tryout</h1>
          <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Kelola sesi tryout dan ujian</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus size={18} />
          Buat Tryout
        </button>
      </div>

      {/* Tryout Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {mockTryouts.map((tryout) => {
          const status = statusConfig[tryout.status];
          return (
            <div
              key={tryout.id}
              className="bg-white dark:bg-dark-surface rounded-2xl shadow-card dark:shadow-none border border-transparent dark:border-dark-border p-5 hover:shadow-card-hover dark:hover:border-primary/50 transition-all duration-300 group"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-dark dark:text-white">{tryout.name}</h3>
                  <p className="text-sm text-slate-400 dark:text-slate-500 mt-0.5">{tryout.subject}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${status.color}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                    {status.label}
                  </span>
                  <button className="w-8 h-8 rounded-lg hover:bg-slate-100 dark:hover:bg-dark-border flex items-center justify-center transition-colors opacity-100 md:opacity-0 group-hover:opacity-100">
                    <MoreVertical size={16} className="text-slate-400 dark:text-slate-500" />
                  </button>
                </div>
              </div>

              {/* Info grid */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 flex-col sm:flex-row items-start sm:items-center">
                  <Users size={14} className="text-slate-400 dark:text-slate-500" />
                  <span>{tryout.students} siswa</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 flex-col sm:flex-row items-start sm:items-center">
                  <Clock size={14} className="text-slate-400 dark:text-slate-500" />
                  <span>{tryout.duration}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 flex-col sm:flex-row items-start sm:items-center">
                  <Calendar size={14} className="text-slate-400 dark:text-slate-500" />
                  <span>{tryout.questions} soal</span>
                </div>
              </div>

              {/* Date range */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-dark-border">
                <span className="text-xs text-slate-400 dark:text-slate-500">
                  {tryout.startDate} — {tryout.endDate}
                </span>
                {tryout.status === 'active' && (
                  <button className="flex items-center gap-1.5 text-xs font-medium text-warning hover:text-warning/80 transition-colors">
                    <Pause size={12} />
                    Pause
                  </button>
                )}
                {tryout.status === 'draft' && (
                  <button className="flex items-center gap-1.5 text-xs font-medium text-correct hover:text-correct/80 transition-colors">
                    <Play size={12} />
                    Mulai
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
