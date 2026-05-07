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
import PreSimulation from './student/pages/PreSimulation';
import HelpCenter from './student/pages/HelpCenter';

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

/* --- Guru Imports --- */
import GuruLayout from './guru/layouts/GuruLayout';
import GuruDashboard from './guru/pages/GuruDashboard';
import GuruStudentList from './guru/pages/GuruStudentList';
import GuruScoreReports from './guru/pages/GuruScoreReports';
import GuruAgenda from './guru/pages/GuruAgenda';
import GuruManageModules from './guru/pages/GuruManageModules';
import GuruAddModule from './guru/pages/GuruAddModule';
import GuruManageQuizzes from './guru/pages/GuruManageQuizzes';
import GuruAddQuiz from './guru/pages/GuruAddQuiz';

/* --- NEW: Survey Imports --- */
import SurveyExecution from './student/pages/SurveyExecution';
import SurveyComplete from './student/pages/SurveyComplete';
import SurveyReports from './guru/pages/SurveyReports';
import AdminSurveyReports from './admin/pages/AdminSurveyReports';

import ToastProvider from './components/ui/ToastProvider';
import { UserProvider } from './context/UserContext';


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
          <Route path="students" element={<GuruStudentList />} />
          <Route path="reports" element={<GuruScoreReports />} />
          <Route path="agenda" element={<GuruAgenda />} />
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
