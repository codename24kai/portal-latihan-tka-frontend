import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

/* --- Auth Imports --- */
import Login from '@/autentikasi/Masuk';
import LupaPassword from '@/autentikasi/LupaPassword';

/* --- Student Imports --- */
import StudentLayout from '@/siswa/tata-letak/LayoutSiswa';
import StudentDashboard from '@/siswa/halaman/DashboardSiswa';
import StudentTest from '@/siswa/halaman/LatihanSiswa';
import StudentModul from '@/siswa/halaman/ModulSiswa';
import StudentSetting from '@/siswa/halaman/PengaturanSiswa';
import ModuleQuiz from '@/komponen/siswa/latihan/KuisModul';
import ExamExecution from '@/komponen/siswa/latihan/EksekusiSimulasi';
import ExamResult from '@/komponen/siswa/latihan/HasilSimulasi';
import HasilLatihan from '@/komponen/siswa/latihan/HasilLatihan';
import PreSimulation from '@/komponen/siswa/latihan/PraSimulasi';
import LearningViewer from '@/komponen/siswa/LearningViewer';

import NotifikasiHalaman from '@/komponen/ui/NotifikasiHalaman';
import HelpCenter from '@/siswa/halaman/PusatBantuan';

/* --- Admin Imports --- */
import AdminLayout from '@/admin/layouts/AdminLayout';
import AdminDashboard from '@/admin/halaman/DashboardAdmin';
import QuestionBank from '@/admin/halaman/BankSoal';
import TryoutManagement from '@/admin/halaman/ManajemenSimulasi';
import ScoreReports from '@/admin/halaman/LaporanNilai';
import UserManagement from '@/admin/halaman/ManajemenPengguna';
import ModuleManagement from '@/admin/halaman/ManajemenModul';
import AddTryout from '@/admin/halaman/TambahTryout';
import AddModule from '@/admin/halaman/TambahModul';
import AddUser from '@/admin/halaman/TambahPengguna';
import AddQuestion from '@/admin/halaman/TambahSoal';
import LogAktivitasAdmin from '@/admin/halaman/LogAktivitasAdmin';

/* --- Guru Imports --- */
import GuruLayout from '@/guru/tata-letak/TataLetakGuru';
import GuruDashboard from '@/guru/halaman/DashboardGuru';
import GuruStudentList from '@/guru/halaman/DaftarSiswaGuru';
import GuruScoreReports from '@/guru/halaman/LaporanNilaiGuru';
import GuruManageModules from '@/guru/halaman/KelolaModulGuru';
import GuruAddModule from '@/guru/halaman/TambahModulGuru';
import GuruManageQuizzes from '@/guru/halaman/KelolaKuisGuru';
import GuruAddQuiz from '@/guru/halaman/TambahKuisGuru';
import GuruAgendaKelas from '@/guru/halaman/AgendaKelas';

/* --- NEW: Survey Imports --- */
import SurveyExecution from '@/komponen/siswa/Survei/EksekusiSurvei';
import SurveyComplete from '@/komponen/siswa/Survei/SurveiSelesai';
import SurveyReports from '@/guru/halaman/LaporanSurvei';
import AdminSurveyReports from '@/admin/halaman/LaporanSurveiAdmin';
import ManajemenSurvei from '@/admin/halaman/ManajemenSurvei';
import TambahSurvei from '@/admin/halaman/TambahSurvei';


import ToastProvider from '@/komponen/ui/PenyediaToast';
import { UserProvider } from '@/konteks/KonteksPengguna';


/**
 * Mock Auth Guard: Protects routes and acts as the router entry logic.
 * If userRole is not set, meaning they haven't logged in, redirect them to /login.
 */
const RequireAuth = ({ children, allowedRoles }) => {
  const role = localStorage.getItem('userRole');
  if (!role) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    // Prevent redirect loops by checking if the user is already at their default page
    if (role === 'admin') return <Navigate to="/admin" replace />;
    if (role === 'guru') return <Navigate to="/guru" replace />;
    // Students or others fallback to home
    return <Navigate to="/" replace />;
  }

  return children;
};

/**
 * Root application component.
 * Sets up routing for Student, Teacher, and Admin interfaces.
 */
export default function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <ToastProvider />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<LupaPassword />} />

          {/* Student Routes (with layout) */}
          <Route element={<RequireAuth allowedRoles={['student']}><StudentLayout /></RequireAuth>}>
            <Route path="/beranda" element={<StudentDashboard />} />
            <Route path="/ujian" element={<StudentTest />} />
            <Route path="/modul" element={<StudentModul />} />
            <Route path="/pengaturan" element={<StudentSetting />} />
            <Route path="/bantuan" element={<HelpCenter />} />
            <Route path="/notifikasi" element={<NotifikasiHalaman />} />
          </Route>

          {/* Exam & Quiz Routes (no layout — distraction-free) */}
          <Route path="/modul/materi/:materiId" element={<RequireAuth allowedRoles={['student']}><LearningViewer /></RequireAuth>} />
          <Route path="/modul/kuis/:modulId" element={<RequireAuth allowedRoles={['student']}><ModuleQuiz /></RequireAuth>} />
          <Route path="/ujian/:ujianId/persiapan" element={<RequireAuth allowedRoles={['student']}><PreSimulation /></RequireAuth>} />
          <Route path="/ujian/:ujianId" element={<RequireAuth allowedRoles={['student']}><ExamExecution /></RequireAuth>} />
          <Route path="/ujian/:ujianId/hasil" element={<RequireAuth allowedRoles={['student']}><ExamResult /></RequireAuth>} />
          <Route path="/latihan/:ujianId/hasil" element={<RequireAuth allowedRoles={['student']}><HasilLatihan /></RequireAuth>} />


          {/* Survey Execution (no layout) */}
          <Route path="/survey/:surveyId" element={<RequireAuth allowedRoles={['student']}><SurveyExecution /></RequireAuth>} />
          <Route path="/survey/:surveyId/selesai" element={<RequireAuth allowedRoles={['student']}><SurveyComplete /></RequireAuth>} />

          {/* Guru / Teacher Routes (with GuruLayout) */}
          <Route path="/guru" element={<RequireAuth allowedRoles={['guru']}><GuruLayout /></RequireAuth>}>
            <Route index element={<GuruDashboard />} />
            <Route path="agenda" element={<GuruAgendaKelas />} />
            <Route path="siswa" element={<GuruStudentList />} />
            <Route path="laporan" element={<GuruScoreReports />} />
            <Route path="modul" element={<GuruManageModules />} />
            <Route path="modul/tambah" element={<GuruAddModule />} />
            <Route path="modul/edit/:id" element={<GuruAddModule />} />
            <Route path="kuis" element={<GuruManageQuizzes />} />
            <Route path="kuis/tambah" element={<GuruAddQuiz />} />
            <Route path="kuis/edit/:id" element={<GuruAddQuiz />} />
            <Route path="laporan/survey" element={<SurveyReports />} />
            <Route path="notifikasi" element={<NotifikasiHalaman />} />
          </Route>

          {/* Administrator Routes (with layout) */}
          <Route path="/admin" element={<RequireAuth allowedRoles={['admin']}><AdminLayout /></RequireAuth>}>
            <Route index element={<AdminDashboard />} />

            {/* User Management restricted to Admin Only */}
            <Route path="pengguna" element={<RequireAuth allowedRoles={['admin']}><UserManagement /></RequireAuth>} />
            <Route path="pengguna/tambah" element={<RequireAuth allowedRoles={['admin']}><AddUser /></RequireAuth>} />
            <Route path="pengguna/edit/:id" element={<RequireAuth allowedRoles={['admin']}><AddUser /></RequireAuth>} />

            <Route path="bank-soal" element={<QuestionBank />} />
            <Route path="bank-soal/tambah" element={<AddQuestion />} />
            <Route path="bank-soal/edit/:id" element={<AddQuestion />} />
            <Route path="simulasi" element={<TryoutManagement />} />
            <Route path="simulasi/tambah" element={<AddTryout />} />
            <Route path="simulasi/edit/:id" element={<AddTryout />} />
            <Route path="laporan" element={<ScoreReports />} />
            <Route path="laporan/survey" element={<AdminSurveyReports />} />
            <Route path="modul" element={<ModuleManagement />} />
            <Route path="modul/tambah" element={<AddModule />} />
            <Route path="modul/edit/:id" element={<AddModule />} />
            <Route path="notifikasi" element={<NotifikasiHalaman />} />
            <Route path="log-aktivitas" element={<LogAktivitasAdmin />} />
            <Route path="survei" element={<ManajemenSurvei />} />
            <Route path="survei/tambah" element={<TambahSurvei />} />
            <Route path="survei/edit/:id" element={<TambahSurvei />} />
          </Route>
        </Routes>
      </UserProvider>
    </BrowserRouter>
  );
}
