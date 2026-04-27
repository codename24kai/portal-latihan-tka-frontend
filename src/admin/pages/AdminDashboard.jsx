import React, { useState, useEffect, useMemo } from 'react';
import AdminHeader from '../components/dashboard/AdminHeader';
import StatCards from '../components/dashboard/StatCards';
import AlertSection from '../components/dashboard/AlertSection';
import { PerformanceTrendChart, ClassComparisonChart } from '../components/dashboard/DashboardCharts';
import TryoutStatus from '../components/dashboard/TryoutStatus';
import SiswaPerhatianTable from '../components/dashboard/SiswaPerhatianTable';
import ActivityLog from '../components/dashboard/ActivityLog';
import QuestionBankSummary from '../components/dashboard/QuestionBankSummary';
import DashboardCalendar from '../components/dashboard/DashboardCalendar';


export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(true);

  const adminData = {
    name: 'Administrator System',
    role: 'Super Admin',
  };

  // Mock Dashboard Data
  const dashboardData = {
    metrics: {
      totalSiswa: '1,284',
      activeTryouts: '12',
      avgScore: '78.5',
      totalQuestions: '4,520',
      trends: { siswa: 12, tryouts: 5, score: -2, questions: 8 }
    },
    alerts: [
      {
        id: 1,
        type: 'warning',
        title: 'Siswa Belum Selesai',
        message: '8 siswa belum menyelesaikan Tryout Matematika Batch B yang berakhir hari ini.',
        action: true,
        actionText: 'Ingatkan Siswa',
        onAction: () => console.log('Reminding students...')
      }
    ],
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
    ],
    events: [
      {
        title: 'Tryout Akbar Matematika Batch A',
        time: '08:00 - 10:00',
        description: 'Evaluasi kompetensi numerasi dasar untuk seluruh siswa kelas 6.',
        location: 'Online Portal',
        status: 'completed',
        completed: 40,
        total: 40,
        topSiswa: [
          { name: 'Budi Santoso', score: 98 },
          { name: 'Siti Aminah', score: 95 },
          { name: 'Agus Pratama', score: 92 },
          { name: 'Rina Saputri', score: 90 },
          { name: 'Dewi Lestari', score: 88 }
        ],
        bottomSiswa: [
          { name: 'Andi Wijaya', score: 45 },
          { name: 'Fajar Hidayat', score: 48 },
          { name: 'Tono Subagyo', score: 52 },
          { name: 'Lia Ananda', score: 55 },
          { name: 'Rudi Hermawan', score: 58 }
        ]
      },
      {
        title: 'Kuis Literasi Bahasa Indonesia',
        time: '11:00 - 12:00',
        description: 'Pemahaman teks narasi dan deskripsi materi semester 2.',
        location: 'Lab Komputer',
        status: 'active',
        completed: 25,
        total: 40,
      },
      {
        title: 'Pembahasan Soal Sains',
        time: '14:00 - 15:30',
        description: 'Sesi tanya jawab interaktif materi energi dan perubahannya.',
        location: 'Zoom Meeting',
        status: 'waiting',
        completed: 0,
        total: 40,
      },
    ]
  };

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const scopedData = dashboardData;

  const handleDismissAlert = (index) => {
    // Logical placeholder for dismissing alerts
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
        <div className="lg:col-span-6 h-full">
          <PerformanceTrendChart data={scopedData?.performanceTrend} />
        </div>
        <div className="lg:col-span-4 h-full">
          <TryoutStatus data={scopedData?.activeTryouts} />
        </div>
      </div>

      {/* ROW 5: Mixed Grid (Bar Chart & Siswa Perlu Perhatian) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="h-full">
          <ClassComparisonChart data={scopedData?.classComparison} />
        </div>
        <div className="h-full">
          <SiswaPerhatianTable data={scopedData?.attentionStudents} />
        </div>
      </div>

      {/* ROW 6: Mixed Grid (Recent Activity & Question Bank) */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-8">
        <div className="lg:col-span-6 h-full">
          <ActivityLog activities={scopedData?.activities} />
        </div>
        <div className="lg:col-span-4 h-full">
          <QuestionBankSummary data={scopedData?.questionBank} />
        </div>
      </div>

      {/* ROW 7: Calendar / Schedule Section */}
      <div className="w-full">
        <DashboardCalendar events={scopedData?.events} />
      </div>

    </div>
  );
}
