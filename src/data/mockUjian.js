// Mock exams / missions data for Student Dashboard
const mockExams = [
  {
    id: 1,
    subject: 'Matematika',
    icon: 'Calculator', // Key for icon mapping in MissionCard
    color: 'from-indigo-500 to-primary-dark',
    bgLight: 'bg-indigo-50',
    textColor: 'text-indigo-600',
    totalQuestions: 40,
    duration: 5400, // 90 minutes in seconds
    status: 'available', // 'available' | 'in-progress' | 'completed'
    score: null,
    deadline: '2026-04-15',
    type: 'tryout'
  },
  {
    id: 2,
    subject: 'Bahasa Indonesia',
    icon: 'Book',
    color: 'from-blue-500 to-indigo-600',
    bgLight: 'bg-blue-50',
    textColor: 'text-blue-600',
    totalQuestions: 35,
    duration: 4200, // 70 minutes
    status: 'available',
    score: null,
    deadline: '2026-04-15',
    type: 'tryout'
  },
];

export default mockExams;
