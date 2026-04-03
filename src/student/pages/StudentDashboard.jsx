import { Target, Flame, Award, TrendingUp } from 'lucide-react';
import mockExams from '../../data/mockExams';
import MissionCard from '../components/MissionCard';

/**
 * Student Dashboard — "Misi Minggu Ini" (This Week's Missions) view.
 * Shows progress stats and exam mission cards.
 */
export default function StudentDashboard() {
  const completedCount = mockExams.filter((e) => e.status === 'completed').length;
  const totalCount = mockExams.length;
  const avgScore = Math.round(
    mockExams
      .filter((e) => e.score !== null)
      .reduce((sum, e) => sum + e.score, 0) /
      (completedCount || 1)
  );
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  return (
    <div id="student-dashboard" className="px-4 py-6 pb-10">
      {/* Motivational Banner */}
      <div className="bg-gradient-to-br from-primary via-primary-dark to-secondary rounded-3xl p-5 mb-6 text-white relative overflow-hidden animate-fade-in">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Flame size={20} className="text-warning" />
            <span className="text-sm font-medium text-white/80">Semangat Belajar!</span>
          </div>
          <h2 className="text-xl font-bold mb-1">Misi Minggu Ini</h2>
          <p className="text-white/60 text-sm mb-4">
            Selesaikan semua tryout untuk meraih nilai terbaik!
          </p>

          {/* Progress bar */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-3 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all duration-700 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-sm font-bold text-white/90">{completedCount}/{totalCount}</span>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-white rounded-2xl shadow-card p-3.5 text-center animate-slide-up" style={{ animationDelay: '100ms' }}>
          <div className="w-9 h-9 rounded-lg bg-primary-50 flex items-center justify-center mx-auto mb-2">
            <Target size={16} className="text-primary" />
          </div>
          <p className="text-xl font-bold text-dark">{totalCount}</p>
          <p className="text-[11px] text-gray-400 mt-0.5">Total Misi</p>
        </div>

        <div className="bg-white rounded-2xl shadow-card p-3.5 text-center animate-slide-up" style={{ animationDelay: '200ms' }}>
          <div className="w-9 h-9 rounded-lg bg-correct/10 flex items-center justify-center mx-auto mb-2">
            <Award size={16} className="text-correct" />
          </div>
          <p className="text-xl font-bold text-correct">{completedCount}</p>
          <p className="text-[11px] text-gray-400 mt-0.5">Selesai</p>
        </div>

        <div className="bg-white rounded-2xl shadow-card p-3.5 text-center animate-slide-up" style={{ animationDelay: '300ms' }}>
          <div className="w-9 h-9 rounded-lg bg-warning/10 flex items-center justify-center mx-auto mb-2">
            <TrendingUp size={16} className="text-warning" />
          </div>
          <p className="text-xl font-bold text-dark">{avgScore}</p>
          <p className="text-[11px] text-gray-400 mt-0.5">Rata-rata</p>
        </div>
      </div>

      {/* Section Title */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-dark">Daftar Ujian</h3>
        <span className="text-xs text-gray-400 font-medium">
          {totalCount - completedCount} tersisa
        </span>
      </div>

      {/* Mission Cards */}
      <div className="flex flex-col gap-4">
        {mockExams.map((exam) => (
          <MissionCard key={exam.id} exam={exam} />
        ))}
      </div>
    </div>
  );
}
