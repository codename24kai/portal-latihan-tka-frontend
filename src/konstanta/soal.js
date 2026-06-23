/**
 * Question Bank V2 Constants
 */

export const QUESTION_TYPES = {
  SINGLE_CHOICE: 'single_choice',
  MULTI_CHOICE: 'multi_choice',
  TRUE_FALSE: 'true_false',
};

export const QUESTION_TYPE_LABELS = {
  [QUESTION_TYPES.SINGLE_CHOICE]: 'Pilihan Ganda',
  [QUESTION_TYPES.MULTI_CHOICE]: 'Pilihan Ganda Kompleks',
  [QUESTION_TYPES.TRUE_FALSE]: 'Benar / Salah Majemuk',
};

export const SCORING_MODES = {
  BINARY: 'binary',
  PARTIAL: 'partial',
};
