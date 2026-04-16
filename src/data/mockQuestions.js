// Mock questions for Matematika exam (40 questions)
const mockQuestions = [
  {
    id: 1,
    text: 'Hasil dari $2.456 + 3.789 - 1.234$ adalah …',
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
    text: 'Sebuah persegi panjang memiliki panjang $12 \\text{ cm}$ dan lebar $8 \\text{ cm}$. Berapakah luas persegi panjang tersebut?',
    image: null,
    options: [
      { label: 'A', text: '$86 \\text{ cm}^2$' },
      { label: 'B', text: '$96 \\text{ cm}^2$' },
      { label: 'C', text: '$106 \\text{ cm}^2$' },
      { label: 'D', text: '$76 \\text{ cm}^2$' },
    ],
    correctAnswer: 'B',
  },
  {
    id: 3,
    text: 'Perhatikan gambar berikut! Berapakah volume balok pada gambar di bawah ini jika panjangnya adalah $12 \\text{ cm}$?',
    imageUrl: 'https://placehold.co/600x400?text=Gambar+Balok',
    options: [
      { label: 'A', text: '$120 \\text{ cm}^3$' },
      { label: 'B', text: '$150 \\text{ cm}^3$' },
      { label: 'C', text: '$180 \\text{ cm}^3$' },
      { label: 'D', text: '$200 \\text{ cm}^3$' },
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
    text: 'Sebuah mobil menempuh jarak $240 \\text{ km}$ dalam waktu $3 \\text{ jam}$. Berapakah kecepatan rata-rata mobil tersebut?',
    image: null,
    options: [
      { label: 'A', text: '$60 \\text{ km/jam}$' },
      { label: 'B', text: '$70 \\text{ km/jam}$' },
      { label: 'C', text: '$80 \\text{ km/jam}$' },
      { label: 'D', text: '$90 \\text{ km/jam}$' },
    ],
    correctAnswer: 'C',
  },
  {
    id: 6,
    text: 'Faktor prima dari $60$ adalah …',
    image: null,
    options: [
      { label: 'A', text: '$2, 3, 5$' },
      { label: 'B', text: '$2, 3, 10$' },
      { label: 'C', text: '$2, 5, 6$' },
      { label: 'D', text: '$3, 4, 5$' },
    ],
    correctAnswer: 'A',
  },
  {
    id: 7,
    text: 'Jika suhu di puncak gunung adalah $-5^\\circ\\text{C}$ dan di kaki gunung $28^\\circ\\text{C}$, maka selisih suhu keduanya adalah …',
    image: null,
    options: [
      { label: 'A', text: '$23^\\circ\\text{C}$' },
      { label: 'B', text: '$33^\\circ\\text{C}$' },
      { label: 'C', text: '$28^\\circ\\text{C}$' },
      { label: 'D', text: '$38^\\circ\\text{C}$' },
    ],
    correctAnswer: 'B',
  },
  {
    id: 8,
    text: 'Sebuah lingkaran memiliki jari-jari $14 \\text{ cm}$. Berapakah keliling lingkaran tersebut? ($\\pi = 22/7$)',
    image: null,
    options: [
      { label: 'A', text: '$88 \\text{ cm}$' },
      { label: 'B', text: '$44 \\text{ cm}$' },
      { label: 'C', text: '$616 \\text{ cm}$' },
      { label: 'D', text: '$176 \\text{ cm}$' },
    ],
    correctAnswer: 'A',
  },
  {
    id: 9,
    text: 'Hasil dari $15\\% \\times 400$ adalah …',
    image: null,
    options: [
      { label: 'A', text: '$60$' },
      { label: 'B', text: '$50$' },
      { label: 'C', text: '$60$' },
      { label: 'D', text: '$80$' },
    ],
    correctAnswer: 'C',
  },
  {
    id: 10,
    text: 'Urutan bilangan dari yang terkecil ke terbesar adalah …',
    image: null,
    options: [
      { label: 'A', text: '$0,5 ; \\frac{1}{3} ; 0,25 ; \\frac{3}{8}$' },
      { label: 'B', text: '$0,25 ; \\frac{1}{3} ; \\frac{3}{8} ; 0,5$' },
      { label: 'C', text: '$\\frac{1}{3} ; 0,25 ; \\frac{3}{8} ; 0,5$' },
      { label: 'D', text: '$0,25 ; \\frac{3}{8} ; \\frac{1}{3} ; 0,5$' },
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
