import React, { useState, useEffect } from 'react';
import api from '@/utilitas/api';
import AdminHeader from '@/komponen/admin/dashboard/HeaderAdmin';
import StatCards from '@/komponen/admin/dashboard/KartuStatistik';
import AlertSection from '@/komponen/admin/dashboard/SeksiPeringatan';
import { PerformanceTrendChart, ClassComparisonChart } from '@/komponen/admin/dashboard/GrafikDashboard';
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

  const [dashboardData, setDashboardData] = useState({
    metrics: {
      totalSiswa: '0',
      activeTryouts: '0',
      avgScore: '0',
      totalQuestions: '0',
      trends: { siswa: 0, tryouts: 0, score: 0, questions: 0 }
    },
    performanceTrend: [],
    classComparison: [],
    activeTryouts: [],
    attentionStudents: [],
    activities: [],
    questionBank: []
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await api.get('/admin/dashboard');
        const result = response.data.data;

        // Memperbarui state dashboardData yang bentuknya objek bersarang (nested object)
        setDashboardData(prev => ({
          ...prev,
          metrics: {
            ...prev.metrics,
            totalSiswa: result.statistik?.total_pengguna?.toString() || '0',
            totalQuestions: result.statistik?.total_soal?.toString() || '0',
            activeTryouts: result.statistik?.total_sesi_latihan?.toString()
              || result.statistik?.total_simulasi?.toString()
              || '0',
            // Atribut yang belum disuplai backend tetap memakai nilai nol
          },
          performanceTrend: result.grafik_tren ? result.grafik_tren.map(item => ({
            name: item.tanggal,
            jumlah: item.jumlah
          })) : prev.performanceTrend
        }));

      } catch (error) {
        console.error('Error fetching admin dashboard:', error);
      } finally {
        // PENTING: Mematikan loading skeleton setelah data ditarik
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const scopedData = dashboardData;

  const handleDismissAlert = (index) => {
    console.log('Dismissing alert', index);
  };

  return (
    <div className="min-h-screen p-6 md:p-8 lg:p-10 space-y-8 lg:space-y-10 animate-fade-in pb-20 bg-slate-50 dark:bg-slate-900">

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
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8 items-stretch">
        <div className="lg:col-span-3 flex flex-col min-h-[400px]">
          {isLoading ? (
            <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm h-full flex flex-col justify-between">
              <div className="flex justify-between items-center mb-6">
                <LoadingSkeleton className="w-48 h-6" />
                <LoadingSkeleton className="w-24 h-8 rounded-xl" />
              </div>
              <div className="flex-1 flex items-end gap-4 px-2">
                {[40, 60, 45, 80, 55, 90, 70, 85].map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                    <LoadingSkeleton className="w-full rounded-t-lg" style={{ height: `${h}%` }} />
                    <LoadingSkeleton className="w-8 h-3 mt-2" />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-full w-full">
              <PerformanceTrendChart data={scopedData?.performanceTrend} />
            </div>
          )}
        </div>

        <div className="lg:col-span-2 flex flex-col min-h-[400px]">
          {isLoading ? (
            <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm h-full flex flex-col">
              <LoadingSkeleton className="w-48 h-6 mb-8" />
              <div className="space-y-5 flex-1">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex justify-between items-center p-4 border border-slate-50 dark:border-slate-700/50 rounded-2xl">
                    <div className="space-y-3">
                      <LoadingSkeleton className="w-32 h-4" />
                      <LoadingSkeleton className="w-20 h-3" />
                    </div>
                    <LoadingSkeleton className="w-16 h-8 rounded-full" />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-full w-full">
              <TryoutStatus data={scopedData?.activeTryouts} />
            </div>
          )}
        </div>
      </div>

      {/* ROW 5: Mixed Grid (Bar Chart & Siswa Perlu Perhatian) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-stretch">
        <div className="flex flex-col min-h-[400px]">
          {isLoading ? (
            <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm h-full flex flex-col justify-between">
              <div className="flex justify-between items-center mb-8">
                <LoadingSkeleton className="w-48 h-6" />
                <div className="flex gap-3">
                  <LoadingSkeleton className="w-16 h-5 rounded-md" />
                  <LoadingSkeleton className="w-16 h-5 rounded-md" />
                </div>
              </div>
              <div className="flex-1 flex items-end gap-6 px-4 h-full">
                {[65, 80, 50, 75].map((h, i) => (
                  <div key={i} className="flex-1 flex items-end gap-2 h-full justify-center">
                    <LoadingSkeleton className="w-full max-w-[40px] bg-indigo-100 dark:bg-indigo-900/50 rounded-t-lg" style={{ height: `${h}%` }} />
                    <LoadingSkeleton className="w-full max-w-[40px] bg-teal-100 dark:bg-teal-900/50 rounded-t-lg" style={{ height: `${Math.max(10, h - 15)}%` }} />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-full w-full">
              <ClassComparisonChart data={scopedData?.classComparison} />
            </div>
          )}
        </div>

        <div className="flex flex-col min-h-[400px]">
          {isLoading ? (
            <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm h-full flex flex-col">
              <div className="flex justify-between items-center mb-8">
                <LoadingSkeleton className="w-48 h-6" />
                <LoadingSkeleton className="w-24 h-4" />
              </div>
              <div className="space-y-6 flex-1">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="flex items-center gap-5">
                    <LoadingSkeleton className="w-10 h-10 rounded-full shrink-0" />
                    <div className="flex-1 space-y-3">
                      <LoadingSkeleton className="w-1/3 h-4" />
                      <LoadingSkeleton className="w-1/4 h-3" />
                    </div>
                    <LoadingSkeleton className="w-14 h-8 rounded-xl shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-full w-full">
              <SiswaPerhatianTable data={scopedData?.attentionStudents} />
            </div>
          )}
        </div>
      </div>

      {/* ROW 6: Vertical Stack (Recent Activity & Question Bank) */}
      <div className="grid grid-cols-1 gap-6 lg:gap-8">
        <div className="flex flex-col min-h-[400px]">
          {isLoading ? (
            <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm h-full flex flex-col">
              <LoadingSkeleton className="w-48 h-6 mb-8" />
              <div className="space-y-8 flex-1">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex gap-5">
                    <LoadingSkeleton className="w-3 h-3 rounded-full mt-1.5 shrink-0" />
                    <div className="flex-1 space-y-3">
                      <LoadingSkeleton className="w-3/4 h-4" />
                      <LoadingSkeleton className="w-1/4 h-3" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-full w-full">
              <ActivityLog activities={scopedData?.activities} />
            </div>
          )}
        </div>

        <div className="flex flex-col min-h-[400px]">
          {isLoading ? (
            <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm h-full flex flex-col">
              <LoadingSkeleton className="w-48 h-6 mb-8" />
              <div className="space-y-6 flex-1">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="space-y-3">
                    <div className="flex justify-between items-end">
                      <LoadingSkeleton className="w-24 h-4" />
                      <LoadingSkeleton className="w-12 h-3" />
                    </div>
                    <LoadingSkeleton className="w-full h-3 rounded-full" />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-full w-full">
              <QuestionBankSummary data={scopedData?.questionBank} />
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
