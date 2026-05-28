/**
 * Question Bank V2 Constants
 */

export const QUESTION_TYPES = {
  SINGLE_CHOICE: 'single_choice',
  MULTI_CHOICE: 'multi_choice',
  TRUE_FALSE: 'true_false',
  ESSAY: 'essay',
};

export const QUESTION_TYPE_LABELS = {
  [QUESTION_TYPES.SINGLE_CHOICE]: 'Pilihan Ganda',
  [QUESTION_TYPES.MULTI_CHOICE]: 'Pilihan Ganda Kompleks',
  [QUESTION_TYPES.TRUE_FALSE]: 'Benar / Salah Majemuk',
  [QUESTION_TYPES.ESSAY]: 'Esai',
};

export const COGNITIVE_LEVELS = [
  { value: 'C1', label: 'C1 — Mengingat' },
  { value: 'C2', label: 'C2 — Memahami' },
  { value: 'C3', label: 'C3 — Menerapkan' },
  { value: 'C4', label: 'C4 — Menganalisis' },
  { value: 'C5', label: 'C5 — Mengevaluasi' },
  { value: 'C6', label: 'C6 — Mencipta' },
];

export const DIFFICULTY_LEVELS = [
  { value: 'easy', label: 'Mudah', variant: 'Success' },
  { value: 'medium', label: 'Sedang', variant: 'Warning' },
  { value: 'hard', label: 'Sulit', variant: 'Danger' },
];

export const SCORING_MODES = {
  BINARY: 'binary',
  PARTIAL: 'partial',
};
