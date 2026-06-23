import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom';

/* --- Auth Imports --- */
import Login from '@/autentikasi/Login';
import LupaPassword from '@/autentikasi/LupaPassword';

/* --- Student Imports --- */
import LayoutSiswa from '@/siswa/tata-letak/LayoutSiswa';
import DashboardSiswa from '@/siswa/halaman/DashboardSiswa';
import LatihanSiswa from '@/siswa/halaman/LatihanSiswa';
import ModulSiswa from '@/siswa/halaman/ModulSiswa';
import PengaturanSiswa from '@/siswa/halaman/PengaturanSiswa';
import KuisModul from '@/komponen/siswa/latihan/KuisModul';
import SimulasiTKA from '@/komponen/siswa/latihan/EksekusiSimulasiTKA';
import HasilSimulasi from '@/komponen/siswa/latihan/HasilSimulasiTKA';
import LatihanMandiri from '@/komponen/siswa/latihan/PraLatihanMandiri';
import EksekusiLatihanMandiri from '@/komponen/siswa/latihan/EksekusiLatihanMandiri';
import HasilLatihanMandiri from '@/komponen/siswa/latihan/HasilLatihanMandiri';
import PraSimulasiTKA from '@/komponen/siswa/latihan/PraSimulasiTKA';
import LearningViewer from '@/komponen/siswa/LearningViewer';
import EksekusiSurveiSiswa from '@/komponen/siswa/latihan/EksekusiSurveiSiswa';
import SurveiSelesaiSiswa from '@/komponen/siswa/latihan/SurveiSelesaiSiswa';
import PraSurvei from '@/komponen/siswa/latihan/PraSurvei';
import NotifikasiHalaman from '@/komponen/ui/NotifikasiHalaman';
import PusatBantuan from '@/siswa/halaman/PusatBantuan';

/* --- Admin Imports --- */
import AdminLayout from '@/admin/layouts/AdminLayout';
import AdminDashboard from '@/admin/halaman/DashboardAdmin';
import QuestionBank from '@/admin/halaman/BankSoal';
import TryoutManagement from '@/admin/halaman/ManajemenSimulasi';
import ScoreReports from '@/admin/halaman/LaporanNilai';
import UserManagement from '@/admin/halaman/ManajemenPengguna';
import ModuleManagement from '@/admin/halaman/ManajemenModul';
import AddTryout from '@/komponen/admin/crud/TambahSimulasi';
import AddModule from '@/komponen/admin/crud/TambahModul';
import AddUser from '@/komponen/admin/crud/TambahPengguna';
import AddQuestion from '@/komponen/admin/crud/TambahSoal';
import LogAktivitasAdmin from '@/admin/halaman/LogAktivitasAdmin';
import ProfilAdmin from '@/admin/halaman/ProfilAdmin';

/* --- Guru Imports --- */
import GuruLayout from '@/guru/tata-letak/LayoutGuru';
import GuruDashboard from '@/guru/halaman/DashboardGuru';
import DaftarSiswaGuru from '@/guru/halaman/DaftarSiswaGuru';
import LaporanNilaiGuru from '@/guru/halaman/LaporanNilaiGuru';
import KelolaModulGuru from '@/guru/halaman/KelolaModulGuru';
import TambahModulGuru from '@/guru/halaman/TambahModulGuru';
import KelolaKuisGuru from '@/guru/halaman/KelolaKuisGuru';
import TambahKuisGuru from '@/guru/halaman/TambahKuisGuru';
import GuruAgendaKelas from '@/guru/halaman/AgendaKelas';
import ProfilGuru from '@/guru/halaman/ProfilGuru';

/* --- NEW: Survey Imports --- */
import LaporanSurvei from '@/guru/halaman/LaporanSurvei';
import LaporanSurveiAdmin from '@/admin/halaman/LaporanSurveiAdmin';
import ManajemenSurvei from '@/admin/halaman/ManajemenSurvei';
import TambahSurvei from '@/komponen/admin/crud/TambahSurvei';

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
 * Helper component to redirect dynamically by preserving path parameters.
 */
const RouteRedirect = ({ to }) => {
  const params = useParams();
  let target = to;
  Object.keys(params).forEach(key => {
    target = target.replace(`:${key}`, params[key]);
  });
  return <Navigate to={target} replace />;
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
          <Route element={<RequireAuth allowedRoles={['siswa']}><LayoutSiswa /></RequireAuth>}>
            <Route path="/beranda" element={<DashboardSiswa />} />
            <Route path="/latihan" element={<LatihanSiswa />} />
            <Route path="/modul" element={<ModulSiswa />} />
            <Route path="/pengaturan" element={<PengaturanSiswa />} />
            <Route path="/bantuan" element={<PusatBantuan />} />
            <Route path="/notifikasi" element={<NotifikasiHalaman />} />
          </Route>

          {/* Exam & Quiz Routes (no layout — distraction-free) */}
          <Route path="/modul/materi/:materiId" element={<RequireAuth allowedRoles={['siswa']}><LearningViewer /></RequireAuth>} />

          {/* Standardized Student Routes */}
          <Route path="/siswa/sesi-latihan/:simulasiId/pra" element={<RequireAuth allowedRoles={['siswa']}><PraSimulasiTKA /></RequireAuth>} />
          <Route path="/siswa/sesi-latihan/:simulasiId/kerjakan" element={<RequireAuth allowedRoles={['siswa']}><SimulasiTKA /></RequireAuth>} />
          <Route path="/siswa/sesi-latihan/:simulasiId/hasil" element={<RequireAuth allowedRoles={['siswa']}><HasilSimulasi /></RequireAuth>} />

          <Route path="/siswa/latihan/:latihanId/pra" element={<RequireAuth allowedRoles={['siswa']}><LatihanMandiri /></RequireAuth>} />
          <Route path="/siswa/latihan/:latihanId/kerjakan" element={<RequireAuth allowedRoles={['siswa']}><EksekusiLatihanMandiri /></RequireAuth>} />
          <Route path="/siswa/latihan/:latihanId/hasil" element={<RequireAuth allowedRoles={['siswa']}><HasilLatihanMandiri /></RequireAuth>} />

          <Route path="/siswa/kuis/:modulId/kerjakan" element={<RequireAuth allowedRoles={['siswa']}><KuisModul /></RequireAuth>} />

          <Route path="/siswa/pra-survei/:surveiId" element={<RequireAuth allowedRoles={['siswa']}><PraSurvei /></RequireAuth>} />
          <Route path="/siswa/survei/:surveiId" element={<RequireAuth allowedRoles={['siswa']}><EksekusiSurveiSiswa /></RequireAuth>} />
          <Route path="/siswa/survei/:surveiId/selesai" element={<RequireAuth allowedRoles={['siswa']}><SurveiSelesaiSiswa /></RequireAuth>} />

          {/* Backward Compatibility Redirects */}
          <Route path="/siswa/:simulasiId/pra-simulasi" element={<RouteRedirect to="/siswa/sesi-latihan/:simulasiId/pra" />} />
          <Route path="/siswa/simulasi-tka/:simulasiId" element={<RouteRedirect to="/siswa/sesi-latihan/:simulasiId/kerjakan" />} />
          <Route path="/siswa/simulasi-tka/:simulasiId/hasil" element={<RouteRedirect to="/siswa/sesi-latihan/:simulasiId/hasil" />} />
          <Route path="/siswa/latihan-mandiri/:latihanId" element={<RouteRedirect to="/siswa/latihan/:latihanId/pra" />} />
          <Route path="/siswa/latihan-mandiri/:latihanId/hasil" element={<RouteRedirect to="/siswa/latihan/:latihanId/hasil" />} />
          <Route path="/modul/kuis/:modulId" element={<RouteRedirect to="/siswa/kuis/:modulId/kerjakan" />} />
          <Route path="/guru/agenda" element={<RouteRedirect to="/guru/sesi-latihan" />} />
          <Route path="/admin/simulasi" element={<RouteRedirect to="/admin/sesi-latihan" />} />
          <Route path="/admin/simulasi/tambah" element={<RouteRedirect to="/admin/sesi-latihan/tambah" />} />
          <Route path="/admin/simulasi/edit/:id" element={<RouteRedirect to="/admin/sesi-latihan/edit/:id" />} />

          {/* Guru / Teacher Routes (with GuruLayout) */}
          <Route path="/guru" element={<RequireAuth allowedRoles={['guru']}><GuruLayout /></RequireAuth>}>
            <Route index element={<GuruDashboard />} />
            <Route path="sesi-latihan" element={<GuruAgendaKelas />} />
            <Route path="siswa" element={<DaftarSiswaGuru />} />
            <Route path="laporan" element={<LaporanNilaiGuru />} />
            <Route path="modul" element={<KelolaModulGuru />} />
            <Route path="modul/tambah" element={<TambahModulGuru />} />
            <Route path="modul/edit/:id" element={<TambahModulGuru />} />
            <Route path="kuis" element={<KelolaKuisGuru />} />
            <Route path="kuis/tambah" element={<TambahKuisGuru />} />
            <Route path="kuis/edit/:id" element={<TambahKuisGuru />} />
            <Route path="laporan/survei" element={<LaporanSurvei />} />
            <Route path="notifikasi" element={<NotifikasiHalaman />} />
            <Route path="profil" element={<ProfilGuru />} />
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
            <Route path="sesi-latihan" element={<TryoutManagement />} />
            <Route path="sesi-latihan/tambah" element={<AddTryout />} />
            <Route path="sesi-latihan/edit/:id" element={<AddTryout />} />
            <Route path="laporan" element={<ScoreReports />} />
            <Route path="laporan/survei" element={<LaporanSurveiAdmin />} />
            <Route path="modul" element={<ModuleManagement />} />
            <Route path="modul/tambah" element={<AddModule />} />
            <Route path="modul/edit/:id" element={<AddModule />} />
            <Route path="notifikasi" element={<NotifikasiHalaman />} />
            <Route path="log-aktivitas" element={<LogAktivitasAdmin />} />
            <Route path="survei" element={<ManajemenSurvei />} />
            <Route path="survei/tambah" element={<TambahSurvei />} />
            <Route path="survei/edit/:id" element={<TambahSurvei />} />
            <Route path="profil" element={<ProfilAdmin />} />
          </Route>
        </Routes>
      </UserProvider>
    </BrowserRouter>
  );
}
