import React, { useState, useEffect } from 'react';
import AdminHeader from '@/komponen/admin/dashboard/HeaderAdmin';
import StatCards from '@/komponen/admin/dashboard/KartuStatistik';
import AlertSection from '@/komponen/admin/dashboard/SeksiPeringatan';
import { PerformanceTrendChart, ClassComparisonChart } from '@/komponen/admin/dashboard/GrafikDasbor';
import TryoutStatus from '@/komponen/admin/dashboard/StatusTryout';
import SiswaPerhatianTable from '@/komponen/admin/dashboard/TabelSiswaPerhatian';
import ActivityLog from '@/komponen/admin/dashboard/LogAktivitas';
import QuestionBankSummary from '@/komponen/admin/dashboard/RingkasanBankSoal';
import LoadingSkeleton from '@/komponen/ui/SkeletonMemuat';

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(true);

  const adminData = {
    name: 'Administrator System',
    role: 'Super Admin',
  };

  const dashboardData = {
    metrics: {
      totalSiswa: '1,284',
      activeTryouts: '12',
      avgScore: '78.5',
      totalQuestions: '4,520',
      trends: { siswa: 12, tryouts: 5, score: -2, questions: 8 }
    },
    performanceTrend: [
      { name: 'Jan', value: 65 },
      { name: 'Feb', value: 68 },
      { name: 'Mar', value: 75 },
      { name: 'Apr', value: 72 },
      { name: 'Mei', value: 80 },
      { name: 'Jun', value: 78 },
    ],
    classComparison: [
      { subject: 'Matematika', classA: 85, classB: 78 },
      { subject: 'B. Indonesia', classA: 88, classB: 92 },
      { subject: 'S. Karakter', classA: 75, classB: 70 },
      { subject: 'S. Lingkungan', classA: 82, classB: 85 },
    ],
    activeTryouts: [
      { title: 'Simulasi AKM SD 2026', category: 'Matematika', participants: 42, status: 'Berlangsung', timeLeft: '2j 15m' },
      { title: 'Kuis Mingguan Ke-4', category: 'B. Indonesia', participants: 28, status: 'Berlangsung', timeLeft: '5j 30m' },
      { title: 'Tryout Mandiri', category: 'Sains', participants: 15, status: 'Persiapan', timeLeft: '1h' },
    ],
    attentionStudents: [
      { id: 1, name: 'Andi Wijaya', class: '6B', score: 58.5, subject: 'Matematika' },
      { id: 2, name: 'Siti Aminah', class: '6A', score: 55.2, subject: 'B. Indonesia' },
      { id: 3, name: 'Fajar Hidayat', class: '6C', score: 52.8, subject: 'Matematika' },
      { id: 4, name: 'Budi Santoso', class: '6B', score: 59.1, subject: 'Sains' },
      { id: 5, name: 'Dewi Lestari', class: '6A', score: 57.4, subject: 'Matematika' },
    ],
    activities: [
      { id: 1, user: 'Rina Saputri', type: 'finish', description: 'Menyelesaikan Tryout Matematika', subject: 'Matematika', class: '6A', time: '2 Menit Lalu' },
      { id: 2, user: 'Ahmad Faisal', type: 'start', description: 'Memulai Kuis B. Indonesia', subject: 'B. Indonesia', class: '6B', time: '5 Menit Lalu' },
      { id: 3, user: 'Admin System', type: 'login', description: 'Melakukan Update Bank Soal', subject: 'System', class: 'Main', time: '15 Menit Lalu' },
      { id: 4, user: 'Toni Kroos', type: 'finish', description: 'Menyelesaikan Simulasi AKM', subject: 'Multi', class: '6C', time: '30 Menit Lalu' },
    ],
    questionBank: [
      { subject: 'Matematika', easy: 450, medium: 320, hard: 120, total: 890 },
      { subject: 'B. Indonesia', easy: 520, medium: 280, hard: 95, total: 895 },
      { subject: 'S. Karakter', easy: 210, medium: 150, hard: 45, total: 405 },
    ]
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const scopedData = dashboardData;

  const handleDismissAlert = (index) => {
    console.log('Dismissing alert', index);
  };

  return (
    <div className="min-h-screen p-6 md:p-10 space-y-10 animate-fade-in pb-20 bg-slate-45 dark:bg-slate-900">

      {/* ROW 1: Admin Header */}
      <AdminHeader admin={adminData} />

      {/* ROW 2: Stat Cards */}
      <StatCards data={scopedData?.metrics} isLoading={isLoading} />

      {/* ROW 3: Alert & Notification Section */}
      <AlertSection
        alerts={scopedData?.alerts}
        onDismiss={handleDismissAlert}
      />

      {/* ROW 4: Mixed Grid (Line Chart & Active Tryouts) */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-8">
        <div className="lg:col-span-6 h-[400px]">
          {isLoading ? (
            <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm h-full flex flex-col justify-between">
              <div className="flex justify-between items-center mb-6">
                <LoadingSkeleton className="w-48 h-6" />
                <LoadingSkeleton className="w-24 h-8" />
              </div>
              <div className="flex-1 flex items-end gap-4 px-2">
                {[40, 60, 45, 80, 55, 90, 70, 85].map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2">
                    <LoadingSkeleton className="w-full rounded-t-lg" style={{ height: `${h}%` }} />
                    <LoadingSkeleton className="w-8 h-3" />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <PerformanceTrendChart data={scopedData?.performanceTrend} />
          )}
        </div>
        <div className="lg:col-span-4 h-[400px]">
          {isLoading ? (
            <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm h-full flex flex-col">
              <LoadingSkeleton className="w-48 h-6 mb-6" />
              <div className="space-y-4 flex-1 overflow-hidden">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex justify-between items-center p-4 border border-slate-50 dark:border-slate-800 rounded-2xl">
                    <div className="space-y-2">
                      <LoadingSkeleton className="w-32 h-4" />
                      <LoadingSkeleton className="w-20 h-3" />
                    </div>
                    <LoadingSkeleton className="w-16 h-6 rounded-full" />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <TryoutStatus data={scopedData?.activeTryouts} />
          )}
        </div>
      </div>

      {/* ROW 5: Mixed Grid (Bar Chart & Siswa Perlu Perhatian) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="h-[400px]">
          {isLoading ? (
            <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm h-full flex flex-col justify-between">
              <div className="flex justify-between items-center mb-6">
                <LoadingSkeleton className="w-48 h-6" />
                <div className="flex gap-2">
                  <LoadingSkeleton className="w-16 h-4" />
                  <LoadingSkeleton className="w-16 h-4" />
                </div>
              </div>
              <div className="flex-1 flex items-end gap-8 px-4">
                {[65, 80, 50, 75].map((h, i) => (
                  <div key={i} className="flex-1 flex items-end gap-2 h-full">
                    <LoadingSkeleton className="w-1/2 bg-indigo-200 dark:bg-indigo-950 rounded-t-lg" style={{ height: `${h}%` }} />
                    <LoadingSkeleton className="w-1/2 bg-teal-200 dark:bg-teal-950 rounded-t-lg" style={{ height: `${h - 15}%` }} />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <ClassComparisonChart data={scopedData?.classComparison} />
          )}
        </div>
        <div className="h-[400px]">
          {isLoading ? (
            <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm h-full flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <LoadingSkeleton className="w-48 h-6" />
                <LoadingSkeleton className="w-24 h-4" />
              </div>
              <div className="space-y-4 flex-1">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="flex items-center gap-4">
                    <LoadingSkeleton className="w-8 h-8 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <LoadingSkeleton className="w-1/3 h-4" />
                      <LoadingSkeleton className="w-1/4 h-3" />
                    </div>
                    <LoadingSkeleton className="w-12 h-6" />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <SiswaPerhatianTable data={scopedData?.attentionStudents} />
          )}
        </div>
      </div>

      {/* ROW 6: Mixed Grid (Recent Activity & Question Bank) */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-8">
        <div className="lg:col-span-6 h-[400px]">
          {isLoading ? (
            <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm h-full flex flex-col">
              <LoadingSkeleton className="w-48 h-6 mb-6" />
              <div className="space-y-6 flex-1">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex gap-4">
                    <LoadingSkeleton className="w-3 h-3 rounded-full mt-1.5" />
                    <div className="flex-1 space-y-2">
                      <LoadingSkeleton className="w-2/3 h-4" />
                      <LoadingSkeleton className="w-20 h-3" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <ActivityLog activities={scopedData?.activities} />
          )}
        </div>
        <div className="lg:col-span-4 h-[400px]">
          {isLoading ? (
            <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm h-full flex flex-col">
              <LoadingSkeleton className="w-48 h-6 mb-6" />
              <div className="space-y-4 flex-1">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="space-y-2">
                    <div className="flex justify-between">
                      <LoadingSkeleton className="w-24 h-4" />
                      <LoadingSkeleton className="w-12 h-4" />
                    </div>
                    <LoadingSkeleton className="w-full h-3 rounded-full" />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <QuestionBankSummary data={scopedData?.questionBank} />
          )}
        </div>
      </div>

    </div>
  );
}
