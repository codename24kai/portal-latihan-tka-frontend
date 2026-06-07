> **Peran:** Bertindaklah sebagai Senior Backend Architect dan Full-Stack Tech Lead.
>
> **Konteks Proyek:** Saya sedang mengembangkan aplikasi Progressive Web App (PWA) untuk pelatihan Tes Kemampuan Akademik (TKA) dan Survei Lingkungan Belajar (Sulingjar) yang ditargetkan untuk siswa kelas 6 SD. Saat ini, sisi *frontend* (React + Vite + Tailwind CSS) sudah memiliki struktur antarmuka dan komponen yang berjalan menggunakan  *mock data* . Saya baru saja menginisialisasi kerangka kerja *backend* menggunakan Laravel (PHP) dan MySQL.
>
> **Tujuan:** Buatlah sebuah "Rencana Arsitektur Backend & Spesifikasi API" yang diturunkan  **secara ketat dari kebutuhan frontend** . Proses perancangan harus dimulai dengan membedah alur sisi klien terlebih dahulu.
>
> **Instruksi Analisis & Perencanaan:**
>
> Lakukan analisis dan berikan *output* dengan struktur berikut:
>
> **TAHAP 1: Analisis Kebutuhan Frontend (Reverse-Engineering)**
>
> Bedah struktur *frontend* (berdasarkan dokumen/kode yang akan saya lampirkan nanti) untuk mengidentifikasi:
>
> * **Aktor & Otorisasi:** Siapa saja pengguna sistem ini (misal: Admin, Guru, Siswa) dan batasan akses mereka ( *Role-Based Access Control* ).
> * **Alur Data Utama:** Fitur apa saja yang membutuhkan pertukaran data dinamis (misal: pengerjaan soal PG kompleks, penilaian otomatis, baca modul PDF/Video, manajemen notifikasi, dan *export* laporan).
> * **Struktur State/Mock Data:** Format objek JSON seperti apa yang saat ini diantisipasi oleh komponen React di  *frontend* .
>
> **TAHAP 2: Perancangan Skema Database (MySQL)**
>
> Berdasarkan analisis TAHAP 1, buatkan rancangan Entity Relationship Diagram (ERD) konseptual. Pastikan Anda menyelesaikan tantangan teknis ini:
>
> * Pemisahan logika dan struktur tabel antara **Bank Soal Akademik** (pilihan ganda murni/kompleks dengan skor benar/salah) dan **Instrumen Survei/Sulingjar** (skala Likert tanpa nilai benar/salah). Gunakan pendekatan polimorfik atau relasi tabel yang paling efisien di Laravel.
> * Struktur pelacakan progres belajar siswa (metrik bar aktivitas).
>
> **TAHAP 3: Spesifikasi REST API & Payload**
>
> Buat tabel spesifikasi API yang mencakup:
>
> * **Endpoint & Method:** (Contoh: `GET /api/v1/simulasi/{id}`).
> * **Controller & Action:** Nama *controller* Laravel yang bertugas.
> * **Request Payload (Expected):** Struktur data yang harus dikirim oleh Vite.
> * **Response Payload (Expected):** Struktur JSON balasan dari Laravel (harus cocok dengan kebutuhan komponen React).
>
> **TAHAP 4: Strategi Autentikasi & Keamanan**
>
> * Rekomendasi implementasi keamanan menggunakan Laravel Sanctum untuk SPA/PWA.
> * Penanganan perlindungan CORS dan CSRF antara URL *frontend* dan  *backend* .
>
> **[DATA FRONTEND]:**
>
> *(Di bawah ini adalah rincian komponen, struktur folder, atau contoh mock data dari frontend saya):*
>
> portal-latihan-tka-frontend
> ├── README.md
> ├── Rencana_Refactoring.md
> ├── backend-config.md
> ├── eslint.config.js
> ├── image
> │   ├── notes
> │   │   ├── 1775454160336.png
> │   │   ├── 1775454178885.png
> │   │   ├── 1775454413050.png
> │   │   └── 1775454463243.png
> │   ├── plan
> │   │   ├── 1777906279308.png
> │   │   └── 1777906388228.png
> │   └── prompt
> │       ├── 1775148074943.png
> │       └── 1775148206410.png
> ├── implementation_plan.md
> ├── implementation_planv2.md
> ├── index.html
> ├── jsconfig.json
> ├── logo-sd-1.svg
> ├── logo-sd.jpg
> ├── logo-sd.png
> ├── package-lock.json
> ├── package.json
> ├── plan.md
> ├── postcss.config.js
> ├── project_report.md
> ├── public
> │   ├── assets
> │   │   ├── hero
> │   │   │   ├── bahasa-background-hero-2.jpg
> │   │   │   ├── bahasa-background-hero.jpg
> │   │   │   ├── exam-photos.jpg
> │   │   │   ├── exam-photos.png
> │   │   │   ├── kids-school.jpg
> │   │   │   ├── kids-school.png
> │   │   │   ├── math-background-hero-2.jpg
> │   │   │   ├── math-background-hero-3.jpg
> │   │   │   ├── math-background-hero-3.png
> │   │   │   ├── math-background-hero-4.jpg
> │   │   │   ├── math-background-hero.jpg
> │   │   │   ├── passionate-kids-1.png
> │   │   │   └── passionate-kids.png
> │   │   ├── profile
> │   │   │   ├── sdn-mcl-2-1.jpg
> │   │   │   ├── sdn-mcl-2-2.jpg
> │   │   │   ├── sdn-mcl-2-3.jpeg
> │   │   │   └── sdn-mcl-2.jpg
> │   │   └── quiz
> │   │       ├── cat-wrong-1.gif
> │   │       ├── correct-1.gif
> │   │       ├── correct-10.gif
> │   │       ├── correct-11.gif
> │   │       ├── correct-2.gif
> │   │       ├── correct-3.gif
> │   │       ├── correct-4.gif
> │   │       ├── correct-5.gif
> │   │       ├── correct-6.gif
> │   │       ├── correct-7.gif
> │   │       ├── correct-8.gif
> │   │       ├── correct-9.gif
> │   │       ├── joe-wrong-1.gif
> │   │       ├── joe-wrong-2.gif
> │   │       ├── joe-wrong-3.gif
> │   │       ├── joe-wrong-4.gif
> │   │       ├── wrong-answer-1.gif
> │   │       ├── wrong-answer-2.gif
> │   │       ├── wrong-answer-3.gif
> │   │       ├── wrong-answer-4.gif
> │   │       ├── wrong-answer-5.gif
> │   │       └── wrong-answer-6.gif
> │   ├── avatar
> │   │   ├── avatar-boy-1.svg
> │   │   ├── avatar-boy-2.svg
> │   │   ├── avatar-boy-3.svg
> │   │   ├── avatar-girl-1.svg
> │   │   └── avatar-girl-2.svg
> │   ├── favicon.svg
> │   ├── icons.svg
> │   ├── logo-sd-1.svg
> │   └── logo-sd.png
> ├── refactoringv2.md
> ├── src
> │   ├── App.jsx
> │   ├── admin
> │   │   ├── halaman
> │   │   │   ├── BankSoal.jsx
> │   │   │   ├── DashboardAdmin.jsx
> │   │   │   ├── LaporanNilai.jsx
> │   │   │   ├── LaporanSurveiAdmin.jsx
> │   │   │   ├── ManajemenModul.jsx
> │   │   │   ├── ManajemenPengguna.jsx
> │   │   │   ├── ManajemenTryout.jsx
> │   │   │   ├── TambahModul.jsx
> │   │   │   ├── TambahPengguna.jsx
> │   │   │   ├── TambahSoal.jsx
> │   │   │   └── TambahTryout.jsx
> │   │   └── layouts
> │   │       └── AdminLayout.jsx
> │   ├── aset
> │   │   └── hero.png
> │   ├── autentikasi
> │   │   ├── LupaPassword.jsx
> │   │   └── Masuk.jsx
> │   ├── data
> │   │   ├── mockResponSurvei.js
> │   │   ├── mockSiswa.js
> │   │   ├── mockSoal.js
> │   │   ├── mockSoalV2.js
> │   │   ├── mockSurvei.js
> │   │   └── mockUjian.js
> │   ├── guru
> │   │   ├── halaman
> │   │   │   ├── AgendaKelas.jsx
> │   │   │   ├── DaftarSiswaGuru.jsx
> │   │   │   ├── DashboardGuru.jsx
> │   │   │   ├── KelolaKuisGuru.jsx
> │   │   │   ├── KelolaModulGuru.jsx
> │   │   │   ├── LaporanNilaiGuru.jsx
> │   │   │   ├── LaporanSurvei.jsx
> │   │   │   ├── TambahKuisGuru.jsx
> │   │   │   └── TambahModulGuru.jsx
> │   │   └── tata-letak
> │   │       └── TataLetakGuru.jsx
> │   ├── hooks
> │   │   ├── useHitungMundur.js
> │   │   ├── useModGelap.js
> │   │   └── useStatusJaringan.js
> │   ├── index.css
> │   ├── komponen
> │   │   ├── IndikatorJaringan.jsx
> │   │   ├── admin
> │   │   │   ├── BankSoal
> │   │   │   │   ├── DropdownJawaban.jsx
> │   │   │   │   ├── ModalImpor.jsx
> │   │   │   │   └── ModalPratinjau.jsx
> │   │   │   ├── EditorMatematikaVisual.jsx
> │   │   │   ├── FormSoal.jsx
> │   │   │   ├── FormTryout.jsx
> │   │   │   ├── KartuStatistik.jsx
> │   │   │   ├── ManajemenModul
> │   │   │   │   └── PembuatKuis.jsx
> │   │   │   ├── PembuatSoal
> │   │   │   │   ├── EditorBatangSoal.jsx
> │   │   │   │   ├── PanelMetaSoal.jsx
> │   │   │   │   ├── PanelPenjelasan.jsx
> │   │   │   │   ├── PratinjauSoal.jsx
> │   │   │   │   └── strategi
> │   │   │   │       ├── EditorBenarSalah.jsx
> │   │   │   │       ├── EditorEsai.jsx
> │   │   │   │       ├── EditorPilihanGanda.jsx
> │   │   │   │       └── EditorPilihanTunggal.jsx
> │   │   │   ├── SidebarAdmin.jsx
> │   │   │   ├── TabelData.jsx
> │   │   │   └── dasbor
> │   │   │       ├── GrafikDasbor.jsx
> │   │   │       ├── HeaderAdmin.jsx
> │   │   │       ├── KalenderDasbor.jsx
> │   │   │       ├── KartuStatistik.jsx
> │   │   │       ├── LogAktivitas.jsx
> │   │   │       ├── RingkasanBankSoal.jsx
> │   │   │       ├── SeksiPeringatan.jsx
> │   │   │       ├── StatusTryout.jsx
> │   │   │       └── TabelSiswaPerhatian.jsx
> │   │   ├── guru
> │   │   │   ├── EditorMatematikaVisualGuru.jsx
> │   │   │   ├── ManajemenModul
> │   │   │   │   └── PembuatKuisGuru.jsx
> │   │   │   └── SidebarGuru.jsx
> │   │   ├── siswa
> │   │   │   ├── Dasbor
> │   │   │   │   ├── PenghitungWaktu.jsx
> │   │   │   │   └── WidgetProgres.jsx
> │   │   │   ├── DropdownNotifikasi.jsx
> │   │   │   ├── FallbackUjian.jsx
> │   │   │   ├── HasilKuis.jsx
> │   │   │   ├── HeaderProfil.jsx
> │   │   │   ├── HeaderUjian.jsx
> │   │   │   ├── KartuMisi.jsx
> │   │   │   ├── KartuOpsi.jsx
> │   │   │   ├── KontenSoal.jsx
> │   │   │   ├── ModalFotoProfil.jsx
> │   │   │   ├── ModalKuisModul.jsx
> │   │   │   ├── ModalPanduanKuis.jsx
> │   │   │   ├── ModalStreakLogin.jsx
> │   │   │   ├── NavBarUjian.jsx
> │   │   │   ├── NavigatorSoal.jsx
> │   │   │   ├── PanduanMelayang.jsx
> │   │   │   ├── RendererSoal
> │   │   │   │   ├── RendererBenarSalah.jsx
> │   │   │   │   ├── RendererEsai.jsx
> │   │   │   │   ├── RendererPilihanGanda.jsx
> │   │   │   │   └── RendererPilihanTunggal.jsx
> │   │   │   ├── SidebarSiswa.jsx
> │   │   │   └── Survei
> │   │   │       ├── HeaderSurvei.jsx
> │   │   │       └── KartuOpsiSurvei.jsx
> │   │   └── ui
> │   │       ├── Badge.jsx
> │   │       ├── BarProgres.jsx
> │   │       ├── DialogKonfirmasi.jsx
> │   │       ├── Dropdown.jsx
> │   │       ├── PenyediaToast.jsx
> │   │       ├── RendererMatematika.jsx
> │   │       ├── SkeletonMemuat.jsx
> │   │       ├── StatusKosong.jsx
> │   │       ├── TabelData.jsx
> │   │       └── UnggahPratinjauFile.jsx
> │   ├── konstanta
> │   │   ├── mataPelajaran.js
> │   │   └── soal.js
> │   ├── konteks
> │   │   ├── KonteksPengguna.jsx
> │   │   └── KonteksTema.jsx
> │   ├── main.jsx
> │   ├── siswa
> │   │   ├── halaman
> │   │   │   ├── DashboardSiswa.jsx
> │   │   │   ├── EksekusiSurvei.jsx
> │   │   │   ├── EksekusiUjian.jsx
> │   │   │   ├── HasilUjian.jsx
> │   │   │   ├── KuisModul.jsx
> │   │   │   ├── ModulSiswa.jsx
> │   │   │   ├── PengaturanSiswa.jsx
> │   │   │   ├── PraSimulasi.jsx
> │   │   │   ├── PusatBantuan.jsx
> │   │   │   ├── SurveiSelesai.jsx
> │   │   │   └── TesSiswa.jsx
> │   │   ├── tata-letak
> │   │   │   └── LayoutSiswa.jsx
> │   │   └── utilitas
> │   │       ├── kontenPanduan.js
> │   │       └── penyimpananProfil.js
> │   └── utilitas
> │       ├── formatWaktu.js
> │       └── mesinPenilaian.js
> ├── tailwind.config.js
> ├── task.md
> ├── vercel.json
> ├── vite.config.js
> ├── walkthrough.md
> └── walkthroughv2.md
>
> Berdasarkan instruksi dan data *frontend* di atas, silakan hasilkan dokumen perencanaannya sekarang.
