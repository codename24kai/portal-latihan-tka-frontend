// Mock questions for Matematika exam (40 questions)
const mockQuestions = [
  {
    id: 1,
    text: 'Hasil dari 2.456 + 3.789 − 1.234 adalah …',
    image: null,
    options: [
      { label: 'A', text: '5.011' },
      { label: 'B', text: '5.111' },
      { label: 'C', text: '4.011' },
      { label: 'D', text: '5.001' },
    ],
    correctAnswer: 'A',
  },
  {
    id: 2,
    text: 'Sebuah persegi panjang memiliki panjang 12 cm dan lebar 8 cm. Berapakah luas persegi panjang tersebut?',
    image: null,
    options: [
      { label: 'A', text: '86 cm²' },
      { label: 'B', text: '96 cm²' },
      { label: 'C', text: '106 cm²' },
      { label: 'D', text: '76 cm²' },
    ],
    correctAnswer: 'B',
  },
  {
    id: 3,
    text: 'Perhatikan gambar berikut! Berapakah volume balok pada gambar di bawah ini jika panjangnya adalah $12cm$?',
    imageUrl: 'https://placehold.co/600x400?text=Gambar+Balok',
    options: [
      { label: 'A', text: '$120 cm^3$' },
      { label: 'B', text: '$150 cm^3$' },
      { label: 'C', text: '$180 cm^3$' },
      { label: 'D', text: '$200 cm^3$' },
    ],
    correctAnswer: 'C',
  },
  {
    id: 4,
    text: 'Nilai dari $\\frac{3}{4} + \\frac{2}{5}$ adalah …',
    imageUrl: null,
    options: [
      { label: 'A', text: '$\\frac{5}{9}$' },
      { label: 'B', text: '$\\frac{23}{20}$' },
      { label: 'C', text: '$1 \\frac{3}{20}$' },
      { label: 'D', text: '$\\frac{11}{20}$' },
    ],
    correctAnswer: 'B',
  },
  {
    id: 5,
    text: 'Sebuah mobil menempuh jarak 240 km dalam waktu 3 jam. Berapakah kecepatan rata-rata mobil tersebut?',
    image: null,
    options: [
      { label: 'A', text: '60 km/jam' },
      { label: 'B', text: '70 km/jam' },
      { label: 'C', text: '80 km/jam' },
      { label: 'D', text: '90 km/jam' },
    ],
    correctAnswer: 'C',
  },
  {
    id: 6,
    text: 'Faktor prima dari 60 adalah …',
    image: null,
    options: [
      { label: 'A', text: '2, 3, 5' },
      { label: 'B', text: '2, 3, 10' },
      { label: 'C', text: '2, 5, 6' },
      { label: 'D', text: '3, 4, 5' },
    ],
    correctAnswer: 'A',
  },
  {
    id: 7,
    text: 'Jika suhu di puncak gunung adalah -5°C dan di kaki gunung 28°C, maka selisih suhu keduanya adalah …',
    image: null,
    options: [
      { label: 'A', text: '23°C' },
      { label: 'B', text: '33°C' },
      { label: 'C', text: '28°C' },
      { label: 'D', text: '38°C' },
    ],
    correctAnswer: 'B',
  },
  {
    id: 8,
    text: 'Sebuah lingkaran memiliki jari-jari 14 cm. Berapakah keliling lingkaran tersebut? (π = 22/7)',
    image: null,
    options: [
      { label: 'A', text: '88 cm' },
      { label: 'B', text: '44 cm' },
      { label: 'C', text: '616 cm' },
      { label: 'D', text: '176 cm' },
    ],
    correctAnswer: 'A',
  },
  {
    id: 9,
    text: 'Hasil dari 15% × 400 adalah …',
    image: null,
    options: [
      { label: 'A', text: '40' },
      { label: 'B', text: '50' },
      { label: 'C', text: '60' },
      { label: 'D', text: '80' },
    ],
    correctAnswer: 'C',
  },
  {
    id: 10,
    text: 'Urutan bilangan dari yang terkecil ke terbesar adalah …',
    image: null,
    options: [
      { label: 'A', text: '0,5 ; 1/3 ; 0,25 ; 3/8' },
      { label: 'B', text: '0,25 ; 1/3 ; 3/8 ; 0,5' },
      { label: 'C', text: '1/3 ; 0,25 ; 3/8 ; 0,5' },
      { label: 'D', text: '0,25 ; 3/8 ; 1/3 ; 0,5' },
    ],
    correctAnswer: 'B',
  },
];

// Duplicate to make 40 questions with unique IDs
const fullQuestions = [];
for (let i = 0; i < 4; i++) {
  mockQuestions.forEach((q, index) => {
    fullQuestions.push({
      ...q,
      id: i * 10 + index + 1,
      text: i === 0 ? q.text : `(${i * 10 + index + 1}) ${q.text}`,
    });
  });
}

export default fullQuestions;
