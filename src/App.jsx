import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

/* --- Auth Imports --- */
import Login from '@/autentikasi/Masuk';
import LupaPassword from '@/autentikasi/LupaPassword';

/* --- Student Imports --- */
import StudentLayout from '@/siswa/tata-letak/LayoutSiswa';
import StudentDashboard from '@/siswa/halaman/DashboardSiswa';
import StudentTest from '@/siswa/halaman/TesSiswa';
import StudentModul from '@/siswa/halaman/ModulSiswa';
import StudentSetting from '@/siswa/halaman/PengaturanSiswa';
import ModuleQuiz from '@/siswa/halaman/KuisModul';
import ExamExecution from '@/siswa/halaman/EksekusiUjian';
import ExamResult from '@/siswa/halaman/HasilUjian';
import PreSimulation from '@/siswa/halaman/PraSimulasi';
import HelpCenter from '@/siswa/halaman/PusatBantuan';

/* --- Admin Imports --- */
import AdminLayout from '@/admin/layouts/AdminLayout';
import AdminDashboard from '@/admin/halaman/DashboardAdmin';
import QuestionBank from '@/admin/halaman/BankSoal';
import TryoutManagement from '@/admin/halaman/ManajemenTryout';
import ScoreReports from '@/admin/halaman/LaporanNilai';
import UserManagement from '@/admin/halaman/ManajemenPengguna';
import ModuleManagement from '@/admin/halaman/ManajemenModul';
import AddTryout from '@/admin/halaman/TambahTryout';
import AddModule from '@/admin/halaman/TambahModul';
import AddUser from '@/admin/halaman/TambahPengguna';
import AddQuestion from '@/admin/halaman/TambahSoal';

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
import SurveyExecution from '@/siswa/halaman/EksekusiSurvei';
import SurveyComplete from '@/siswa/halaman/SurveiSelesai';
import SurveyReports from '@/guru/halaman/LaporanSurvei';
import AdminSurveyReports from '@/admin/halaman/LaporanSurveiAdmin';

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
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<LupaPassword />} />

        {/* Student Routes (with layout) */}
        <Route element={<RequireAuth allowedRoles={['student']}><StudentLayout /></RequireAuth>}>
          <Route path="/" element={<StudentDashboard />} />
          <Route path="/test" element={<StudentTest />} />
          <Route path="/modules" element={<StudentModul />} />
          <Route path="/settings" element={<StudentSetting />} />
          <Route path="/help" element={<HelpCenter />} />
        </Route>

        {/* Exam & Quiz Routes (no layout — distraction-free) */}
        <Route path="/modules/quiz/:moduleId" element={<RequireAuth allowedRoles={['student']}><ModuleQuiz /></RequireAuth>} />
        <Route path="/exam/:examId/prepare" element={<RequireAuth allowedRoles={['student']}><PreSimulation /></RequireAuth>} />
        <Route path="/exam/:examId" element={<RequireAuth allowedRoles={['student']}><ExamExecution /></RequireAuth>} />
        <Route path="/exam/:examId/result" element={<RequireAuth allowedRoles={['student']}><ExamResult /></RequireAuth>} />
        
        {/* Survey Execution (no layout) */}
        <Route path="/survey/:surveyId" element={<RequireAuth allowedRoles={['student']}><SurveyExecution /></RequireAuth>} />
        <Route path="/survey/:surveyId/complete" element={<RequireAuth allowedRoles={['student']}><SurveyComplete /></RequireAuth>} />

        {/* Guru / Teacher Routes (with GuruLayout) */}
        <Route path="/guru" element={<RequireAuth allowedRoles={['guru']}><GuruLayout /></RequireAuth>}>
          <Route index element={<GuruDashboard />} />
          <Route path="agenda" element={<GuruAgendaKelas />} />
          <Route path="students" element={<GuruStudentList />} />
          <Route path="reports" element={<GuruScoreReports />} />
          <Route path="modules" element={<GuruManageModules />} />
          <Route path="modules/add" element={<GuruAddModule />} />
          <Route path="modules/edit/:id" element={<GuruAddModule />} />
          <Route path="quizzes" element={<GuruManageQuizzes />} />
          <Route path="quizzes/add" element={<GuruAddQuiz />} />
          <Route path="quizzes/edit/:id" element={<GuruAddQuiz />} />
          <Route path="reports/survey" element={<SurveyReports />} />
        </Route>

        {/* Administrator Routes (with layout) */}
        <Route path="/admin" element={<RequireAuth allowedRoles={['admin']}><AdminLayout /></RequireAuth>}>
          <Route index element={<AdminDashboard />} />
          
          {/* User Management restricted to Admin Only */}
          <Route path="users" element={<RequireAuth allowedRoles={['admin']}><UserManagement /></RequireAuth>} />
          <Route path="users/add" element={<RequireAuth allowedRoles={['admin']}><AddUser /></RequireAuth>} />
          <Route path="users/edit/:id" element={<RequireAuth allowedRoles={['admin']}><AddUser /></RequireAuth>} />
          
          <Route path="question-bank" element={<QuestionBank />} />
          <Route path="question-bank/add" element={<AddQuestion />} />
          <Route path="question-bank/edit/:id" element={<AddQuestion />} />
          <Route path="tryout" element={<TryoutManagement />} />
          <Route path="tryout/add" element={<AddTryout />} />
          <Route path="tryout/edit/:id" element={<AddTryout />} />
          <Route path="reports" element={<ScoreReports />} />
          <Route path="reports/survey" element={<AdminSurveyReports />} />
          <Route path="modules" element={<ModuleManagement />} />
          <Route path="modules/add" element={<AddModule />} />
          <Route path="modules/edit/:id" element={<AddModule />} />
        </Route>
      </Routes>
      </UserProvider>
    </BrowserRouter>
  );
}
