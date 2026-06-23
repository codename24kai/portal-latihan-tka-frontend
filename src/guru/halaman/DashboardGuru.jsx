import React, { useState, useEffect, useMemo } from 'react';
import toast from 'react-hot-toast';
import { getDashboardGuru, getDaftarSiswaGuru, broadcastPesanGuru } from '@/utilitas/apiGuru';

// Splitted components
import CountdownTKA from '@/komponen/guru/dashboard/CountdownTKA';
import HeroSection from '@/komponen/guru/dashboard/HeroSection';
import StatCards from '@/komponen/guru/dashboard/StatCards';
import ProgressTKA from '@/komponen/guru/dashboard/ProgressTKA';
import AttentionStudents from '@/komponen/guru/dashboard/SiswaPerhatian';
import PerformanceSummary from '@/komponen/guru/dashboard/RingkasanPerforma';
import UpcomingAgenda from '@/komponen/guru/dashboard/AgendaMendatang';
import QuickAnnouncementBanner from '@/komponen/guru/dashboard/PengumumanSingkat';
import AnnouncementModal from '@/komponen/guru/dashboard/PengumumanModal';

export default function GuruDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [showAnnounceModal, setShowAnnounceModal] = useState(false);
  const [announcementText, setAnnouncementText] = useState('');
  const [priority, setPriority] = useState('Biasa');
  const [targetType, setTargetType] = useState('Semua');
  const [selectedStudentIds, setSelectedStudentIds] = useState([]);

  const [dashboardData, setDashboardData] = useState({ metrics: {}, siswa_perhatian: [] });
  const [classStudents, setClassStudents] = useState([]);

  const assignedClass = localStorage.getItem('assignedClass') ?? '6A';

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [dashData, studentsData] = await Promise.all([
          getDashboardGuru(),
          getDaftarSiswaGuru()
        ]);
        setDashboardData(dashData);
        // Filter students based on assigned class (or map it as needed)
        setClassStudents(studentsData || []);
      } catch (err) {
        toast.error('Gagal memuat data dashboard.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const metrics = useMemo(() => {
    if (!dashboardData.metrics || Object.keys(dashboardData.metrics).length === 0) {
      return { totalSiswa: 0, avgMath: 0, avgIndo: 0, participation: '0%' };
    }
    return {
      totalSiswa: dashboardData.metrics.total_siswa ?? 0,
      avgMath: dashboardData.metrics.rata_matematika ?? 0,
      avgIndo: dashboardData.metrics.rata_bahasa ?? 0,
      participation: dashboardData.metrics.partisipasi ?? '0%'
    };
  }, [dashboardData]);

  const attentionStudents = useMemo(() => {
    return (dashboardData.siswa_perhatian || []).map(s => ({
      id: s.id,
      name: s.nama,
      class: s.kelas,
      avgScore: s.skor_rata,
      status: s.status
    })) || [];
  }, [dashboardData]);

  const handleSendAnnouncement = async () => {
    if (!announcementText.trim()) return;

    if (targetType === 'Spesifik' && selectedStudentIds.length === 0) {
      toast.error('Silakan pilih minimal satu murid terlebih dahulu', {
        duration: 3000,
        style: { borderRadius: '1rem', background: '#f43f5e', color: '#fff', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase' }
      });
      return;
    }

    try {
      await broadcastPesanGuru({
        judul: `Pengumuman ${priority}`,
        isi_pesan: announcementText,
        target_type: targetType,
        target_ids: selectedStudentIds
      });

      if (targetType === 'Spesifik') {
        const selectedNames = classStudents
          .filter(s => selectedStudentIds.includes(s.id))
          .map(s => s.name);

        toast.success(`Pengumuman dikirim ke ${selectedNames.length} siswa: ${selectedNames.join(', ')}`, {
          duration: 5000,
          icon: '📨',
          style: { borderRadius: '1rem', background: '#334155', color: '#fff', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase' },
        });
      } else {
        toast.success(`Pengumuman berhasil dikirim ke ${classStudents.length} siswa Kelas ${assignedClass}`, {
          duration: 4000,
          icon: '📨',
          style: { borderRadius: '1rem', background: '#334155', color: '#fff', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase' },
        });
      }

      setAnnouncementText('');
      setPriority('Biasa');
      setTargetType('Semua');
      setSelectedStudentIds([]);
      setShowAnnounceModal(false);
    } catch (err) {
      toast.error('Gagal mengirim pengumuman.');
    }
  };

  const toggleStudentSelection = (id) => {
    setSelectedStudentIds(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const selectAllStudents = () => {
    setSelectedStudentIds(classStudents.map(s => s.id));
  };

  const clearAllStudents = () => {
    setSelectedStudentIds([]);
  };

  const getPriorityColor = (p) => {
    switch (p) {
      case 'Urgent': return 'bg-rose-500 text-white';
      case 'Penting': return 'bg-amber-500 text-white';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400';
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      {/* TKA Countdown Banner */}
      <CountdownTKA />

      {/* Header & Quick Action */}
      <HeroSection
        assignedClass={assignedClass}
        onOpenAnnounceModal={() => setShowAnnounceModal(true)}
      />

      {/* Stats Grid */}
      <StatCards metrics={metrics} isLoading={isLoading} />

      {/* Active Tryout Progress */}
      <ProgressTKA />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Siswa Perlu Perhatian */}
        <AttentionStudents attentionStudents={attentionStudents} />

        {/* Performa Siswa (Alphabetical Summary) */}
        <PerformanceSummary classStudents={classStudents} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Jadwal Preview */}
        <UpcomingAgenda />

        {/* Quick Info Announcement Banner */}
        <QuickAnnouncementBanner
          assignedClass={assignedClass}
          onOpenAnnounceModal={() => setShowAnnounceModal(true)}
        />
      </div>

      {/* Announcement Modal */}
      <AnnouncementModal
        isOpen={showAnnounceModal}
        onClose={() => {
          setShowAnnounceModal(false);
          setAnnouncementText('');
          setTargetType('Semua');
          setSelectedStudentIds([]);
        }}
        targetType={targetType}
        setTargetType={setTargetType}
        selectedStudentIds={selectedStudentIds}
        setSelectedStudentIds={setSelectedStudentIds}
        classStudents={classStudents}
        selectAllStudents={selectAllStudents}
        clearAllStudents={clearAllStudents}
        toggleStudentSelection={toggleStudentSelection}
        priority={priority}
        setPriority={setPriority}
        announcementText={announcementText}
        setAnnouncementText={setAnnouncementText}
        handleSendAnnouncement={handleSendAnnouncement}
        assignedClass={assignedClass}
        getPriorityColor={getPriorityColor}
      />
    </div>
  );
}
