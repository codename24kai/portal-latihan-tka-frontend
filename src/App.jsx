import { BrowserRouter, Routes, Route } from 'react-router-dom';

/* --- Student Imports --- */
import StudentLayout from './student/layouts/StudentLayout';
import StudentDashboard from './student/pages/StudentDashboard';
import ExamExecution from './student/pages/ExamExecution';
import ExamResult from './student/pages/ExamResult';

/* --- Admin Imports --- */
import AdminLayout from './admin/layouts/AdminLayout';
import AdminDashboard from './admin/pages/AdminDashboard';
import QuestionBank from './admin/pages/QuestionBank';
import TryoutManagement from './admin/pages/TryoutManagement';
import ScoreReports from './admin/pages/ScoreReports';

/**
 * Root application component.
 * Sets up routing for Student and Admin interfaces.
 */
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Student Routes (with layout) */}
        <Route element={<StudentLayout />}>
          <Route path="/" element={<StudentDashboard />} />
        </Route>

        {/* Exam Routes (no layout — distraction-free) */}
        <Route path="/exam/:examId" element={<ExamExecution />} />
        <Route path="/exam/:examId/result" element={<ExamResult />} />

        {/* Admin Routes (with layout) */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="question-bank" element={<QuestionBank />} />
          <Route path="tryout" element={<TryoutManagement />} />
          <Route path="reports" element={<ScoreReports />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
