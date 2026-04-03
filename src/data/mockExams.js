// Mock exams / missions data for Student Dashboard
const mockExams = [
  {
    id: 1,
    subject: 'Matematika',
    icon: '📐',
    color: 'from-primary to-primary-dark',
    bgLight: 'bg-primary-50',
    textColor: 'text-primary',
    totalQuestions: 40,
    duration: 5400, // 90 minutes in seconds
    status: 'available', // 'available' | 'in-progress' | 'completed'
    score: null,
    deadline: '2026-04-07',
  },
  {
    id: 2,
    subject: 'Bahasa Indonesia',
    icon: '📖',
    color: 'from-secondary to-secondary-dark',
    bgLight: 'bg-secondary/10',
    textColor: 'text-secondary-dark',
    totalQuestions: 35,
    duration: 4200, // 70 minutes
    status: 'available',
    score: null,
    deadline: '2026-04-07',
  },
  {
    id: 3,
    subject: 'IPA (Sains)',
    icon: '🔬',
    color: 'from-correct to-secondary',
    bgLight: 'bg-correct/10',
    textColor: 'text-correct',
    totalQuestions: 30,
    duration: 3600, // 60 minutes
    status: 'completed',
    score: 85,
    deadline: '2026-04-07',
  },
  {
    id: 4,
    subject: 'IPS',
    icon: '🌍',
    color: 'from-warning to-accent',
    bgLight: 'bg-warning/10',
    textColor: 'text-warning',
    totalQuestions: 30,
    duration: 3600, // 60 minutes
    status: 'available',
    score: null,
    deadline: '2026-04-07',
  },
  {
    id: 5,
    subject: 'Bahasa Inggris',
    icon: '🇬🇧',
    color: 'from-accent to-accent-dark',
    bgLight: 'bg-accent/10',
    textColor: 'text-accent-dark',
    totalQuestions: 25,
    duration: 3000, // 50 minutes
    status: 'completed',
    score: 72,
    deadline: '2026-04-07',
  },
];

export default mockExams;
