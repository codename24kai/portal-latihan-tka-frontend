import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

/* --- Auth Imports --- */
import Login from './auth/Login';

/* --- Student Imports --- */
import StudentLayout from './student/layouts/StudentLayout';
import StudentDashboard from './student/pages/StudentDashboard';
import StudentTest from './student/pages/StudentTest';
import StudentModul from './student/pages/StudentModul';
import StudentSetting from './student/pages/StudentSetting';
import ModuleQuiz from './student/pages/ModuleQuiz';
import ExamExecution from './student/pages/ExamExecution';
import ExamResult from './student/pages/ExamResult';

/* --- Admin Imports --- */
import AdminLayout from './admin/layouts/AdminLayout';
import AdminDashboard from './admin/pages/AdminDashboard';
import QuestionBank from './admin/pages/QuestionBank';
import TryoutManagement from './admin/pages/TryoutManagement';
import ScoreReports from './admin/pages/ScoreReports';
import UserManagement from './admin/pages/UserManagement';
import ModuleManagement from './admin/pages/ModuleManagement';
import AddTryout from './admin/pages/AddTryout';
import AddModule from './admin/pages/AddModule';
import AddUser from './admin/pages/AddUser';
import AddQuestion from './admin/pages/AddQuestion';
import ToastProvider from './components/ui/ToastProvider';

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
    // Redirect to their respective dashboard if unauthorized
    if (role === 'admin' || role === 'teacher') return <Navigate to={`/${role}`} replace />;
    return <Navigate to="/" replace />; // fallback to student dashboard
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
      <ToastProvider />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />

        {/* Student Routes (with layout) */}
        <Route element={<RequireAuth allowedRoles={['student']}><StudentLayout /></RequireAuth>}>
          <Route path="/" element={<StudentDashboard />} />
          <Route path="/test" element={<StudentTest />} />
          <Route path="/modules" element={<StudentModul />} />
          <Route path="/settings" element={<StudentSetting />} />
        </Route>

        {/* Exam & Quiz Routes (no layout — distraction-free) */}
        <Route path="/modules/quiz/:moduleId" element={<RequireAuth allowedRoles={['student']}><ModuleQuiz /></RequireAuth>} />
        <Route path="/exam/:examId" element={<RequireAuth allowedRoles={['student']}><ExamExecution /></RequireAuth>} />
        <Route path="/exam/:examId/result" element={<RequireAuth allowedRoles={['student']}><ExamResult /></RequireAuth>} />

        {/* Super Admin Routes (with layout) */}
        <Route path="/admin" element={<RequireAuth allowedRoles={['admin']}><AdminLayout /></RequireAuth>}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="users/add" element={<AddUser />} />
          <Route path="users/edit/:id" element={<AddUser />} />
          <Route path="question-bank" element={<QuestionBank />} />
          <Route path="question-bank/add" element={<AddQuestion />} />
          <Route path="tryout" element={<TryoutManagement />} />
          <Route path="tryout/add" element={<AddTryout />} />
          <Route path="tryout/edit/:id" element={<AddTryout />} />
          <Route path="reports" element={<ScoreReports />} />
          <Route path="modules" element={<ModuleManagement />} />
          <Route path="modules/add" element={<AddModule />} />
          <Route path="modules/edit/:id" element={<AddModule />} />
        </Route>

        {/* Teacher Routes (with layout - identical to admin for now, but role is 'teacher') */}
        <Route path="/teacher" element={<RequireAuth allowedRoles={['teacher']}><AdminLayout /></RequireAuth>}>
          <Route index element={<AdminDashboard />} />
          <Route path="question-bank" element={<QuestionBank />} />
          <Route path="question-bank/add" element={<AddQuestion />} />
          <Route path="tryout" element={<TryoutManagement />} />
          <Route path="tryout/add" element={<AddTryout />} />
          <Route path="tryout/edit/:id" element={<AddTryout />} />
          <Route path="reports" element={<ScoreReports />} />
          <Route path="modules" element={<ModuleManagement />} />
          <Route path="modules/add" element={<AddModule />} />
          <Route path="modules/edit/:id" element={<AddModule />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
