export const SUBJECT_CATEGORIES = {
  AKADEMIK: 'Akademik',
  NON_AKADEMIK: 'Non-Akademik',
};

export const SUBJECTS = [
  { 
    name: 'Bahasa Indonesia', 
    category: SUBJECT_CATEGORIES.AKADEMIK, 
    icon: 'Book',
    color: 'from-blue-500 to-indigo-600',
    bgLight: 'bg-blue-50',
    textColor: 'text-blue-600'
  },
  { 
    name: 'Matematika', 
    category: SUBJECT_CATEGORIES.AKADEMIK, 
    icon: 'Calculator',
    color: 'from-indigo-500 to-primary-dark',
    bgLight: 'bg-indigo-50',
    textColor: 'text-indigo-600'
  },
  { 
    name: 'Survei Lingkungan Belajar', 
    category: SUBJECT_CATEGORIES.NON_AKADEMIK, 
    icon: 'Globe',
    color: 'from-emerald-500 to-teal-600',
    bgLight: 'bg-emerald-50',
    textColor: 'text-emerald-600'
  },
  { 
    name: 'Survei Karakter', 
    category: SUBJECT_CATEGORIES.NON_AKADEMIK, 
    icon: 'Heart',
    color: 'from-teal-500 to-emerald-600',
    bgLight: 'bg-teal-50',
    textColor: 'text-teal-600'
  },
];
