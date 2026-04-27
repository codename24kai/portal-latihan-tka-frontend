import { QUESTION_TYPES } from '../constants/questions';

export const mockQuestionBankV2 = [
  { 
    id: 1, 
    question_type: QUESTION_TYPES.SINGLE_CHOICE,
    category: 'akademik',
    subject: 'Matematika', 
    difficulty: 'easy', 
    cognitive_level: 'C1',
    payload: {
      stem: 'Hasil dari 2.456 + 3.789 − 1.234 adalah …', 
      stem_image: null,
      options: [
        { key: 'A', text: '5.011', image: null },
        { key: 'B', text: '5.111', image: null },
        { key: 'C', text: '5.211', image: null },
        { key: 'D', text: '5.311', image: null }
      ], 
      correct_keys: ['A']
    },
    explanation: 'Hitung penjumlahan terlebih dahulu baru pengurangan.', 
    max_points: 1,
    is_active: true,
    createdAt: '2026-03-20' 
  },
  { 
    id: 2, 
    question_type: QUESTION_TYPES.MULTI_CHOICE,
    category: 'akademik',
    subject: 'Matematika', 
    difficulty: 'medium', 
    cognitive_level: 'C2',
    payload: {
      stem: 'Manakah dari bilangan berikut yang merupakan bilangan prima?', 
      stem_image: null,
      options: [
        { key: 'A', text: '2', image: null },
        { key: 'B', text: '4', image: null },
        { key: 'C', text: '7', image: null },
        { key: 'D', text: '9', image: null },
        { key: 'E', text: '11', image: null }
      ], 
      correct_keys: ['A', 'C', 'E'],
      penalty_for_wrong: true
    },
    explanation: 'Bilangan prima adalah bilangan yang hanya memiliki dua faktor, yaitu 1 dan bilangan itu sendiri.', 
    max_points: 3,
    is_active: true,
    createdAt: '2026-03-21' 
  },
  { 
    id: 3, 
    question_type: QUESTION_TYPES.TRUE_FALSE,
    category: 'akademik',
    subject: 'Bahasa Indonesia', 
    difficulty: 'easy', 
    cognitive_level: 'C1',
    payload: {
      stem: 'Tentukan Benar atau Salah untuk setiap pernyataan berikut tentang antonim dan sinonim.', 
      stem_image: null,
      statements: [
        { id: 's1', text: 'Antonim dari kata "Cerdas" adalah "Bodoh"', correct_answer: true },
        { id: 's2', text: '"Pintar" adalah sinonim dari "Cerdas"', correct_answer: true },
        { id: 's3', text: 'Antonim dari kata "Cerdas" adalah "Pintar"', correct_answer: false },
        { id: 's4', text: '"Dungu" merupakan lawan kata dari "Cerdas"', correct_answer: true },
      ]
    },
    explanation: 'Antonim adalah lawan kata. Lawan kata "Cerdas" bisa "Bodoh" atau "Dungu". "Pintar" adalah sinonim, bukan antonim.', 
    max_points: 4,
    is_active: true,
    createdAt: '2026-03-22' 
  },
  { 
    id: 4, 
    question_type: QUESTION_TYPES.ESSAY,
    category: 'akademik',
    subject: 'Bahasa Indonesia', 
    difficulty: 'hard', 
    cognitive_level: 'C4',
    payload: {
      stem: 'Jelaskan apa yang dimaksud dengan ide pokok paragraf dan berikan langkah-langkah untuk menemukannya dalam sebuah teks eksplanasi.', 
      stem_image: null,
      word_limit: 500,
      rubric: [
        { criterion: 'Definisi ide pokok benar', max_points: 2 },
        { criterion: 'Langkah-langkah sistematis', max_points: 3 }
      ]
    },
    explanation: 'Ide pokok adalah inti pembicaraan dalam sebuah paragraf.', 
    max_points: 5,
    is_active: true,
    createdAt: '2026-03-23' 
  }
];

export default mockQuestionBankV2;
