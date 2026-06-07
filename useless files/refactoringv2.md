
### Dokumen Pembaruan Fungsionalitas Aplikasi Latihan TKA

**1. Konfigurasi Global**

* **Halaman Khusus Notifikasi:** Pembuatan halaman tersendiri (di luar  *sidebar* ) untuk menampilkan seluruh notifikasi ketika pengguna menekan tombol "Lihat Semua".
* **Animasi Pemuatan:** Penggantian indikator *loading* konvensional menjadi *loading skeleton* agar antarmuka terasa lebih responsif.
* **Preview Import/Export Data:** Penambahan halaman *preview* sebelum aksi eksekusi. Pada *import* soal, sistem akan menampilkan rincian jenis soal, jawaban, dan gambar. Pada  *export* , sistem menampilkan *preview* laporan nilai sebelum diunduh.
* **WYSIWYG Editor untuk Soal:** Pembaruan *form* input pertanyaan dan jawaban menjadi editor teks yang lebih luas dan komprehensif, menyerupai Microsoft Word.
* **Lokalisasi Routing:** *Refactoring* penamaan URL/routing menggunakan bahasa Indonesia.

**2. Modul Admin**

* **Filter Bank Soal:** Penghapusan opsi filter "Semua" pada bank soal, sehingga hanya menyisakan opsi "Akademik" dan "Survei".
* **Filter Laporan Nilai:** Penghapusan opsi "Survei" dari laporan nilai.
* **Optimalisasi UI Laporan Survei:** Pengecilan ukuran tampilan agregat pilihan jawaban siswa, serta perbaikan tabel siswa agar lebih informatif (termasuk perbaikan fungsi tombol aksi).
* **Perbaikan Tombol Dashboard:** Perbaikan fungsi tombol pada *card* "Siswa Perlu Perhatian" dan *card* "Log Aktivitas" di *dashboard* agar dapat mengarahkan admin ke halaman yang sesuai.
* **Integrasi Sulingjar & Survei Karakter:** Penambahan halaman pembuatan instrumen Survei Karakter dan Survei Lingkungan Belajar (Sulingjar) sebagai komponen evaluasi tambahan yang terintegrasi dengan simulasi TKA.
* **Penyederhanaan Mode Ujian:** Penghapusan fitur "Latihan Mandiri" dari akses admin. Admin hanya akan mengelola operasi "Simulasi TKA".
* **Filter Periode Simulasi:** Penyesuaian *dropdown* periode pada laporan nilai agar hanya menampilkan daftar Simulasi TKA yang sudah selesai.
* **Pembaruan Nomenklatur:** Perubahan nama halaman dan menu di *sidebar* dari "Manajemen Tryout" menjadi "Manajemen Simulasi TKA".

**3. Modul Guru**

* **Integrasi Pesan Langsung:** Modifikasi tombol "Hubungi" di halaman daftar siswa agar langsung terhubung dengan fitur kirim pesan bawaan, bukan sekadar memunculkan *popup* notifikasi.
* **Opsi Export Laporan:** Penambahan berbagai opsi *customization* pada fitur *export* laporan ke format PDF dan Excel.
* **Ringkasan Ujian (Scoped Access):** Penambahan tampilan ringkasan ujian mendatang yang disesuaikan dengan hak akses guru terkait.

**4. Modul Siswa**

* **Visibilitas Password:** Penambahan ikon *eye open/closed* pada *form* ganti *password* di halaman pengaturan.
* **Sistem Reminder Dashboard:** Penambahan notifikasi berukuran besar di *dashboard* sebagai  *reminder* , dilengkapi tombol interaktif untuk menutup/menghilangkan notifikasi tersebut.
* **Agenda Mendatang:** Penambahan daftar agenda jadwal simulasi atau latihan mendatang di bagian  *dashboard* .
* **Fleksibilitas Akses Modul Dokumen:** Penyediaan dua opsi untuk modul berformat dokumen: membaca langsung melalui *browser* (dokumen di-render ke HTML) atau mengunduh dokumen dalam format PDF untuk akses  *offline* .
* **Fleksibilitas Akses Modul Video:** Penyediaan sistem pemutar video ganda: *video player* internal untuk file yang diunggah langsung, atau *redirect/iframe* ke YouTube jika guru menyematkan tautan.
* **Pembaruan UI Hasil Ujian:** Pembuatan *layout* hasil ujian yang berbeda dan spesifik untuk setiap jenis aktivitas (Simulasi TKA, Latihan Mandiri, dan Kuis).
* **Revisi UI Simulasi:** Dilakukan perbaikan pada desain *layout* pengerjaan soal, khususnya untuk tipe soal pilihan ganda kompleks/multi jawaban. Sistem juga akan menampilkan informasi atau penanda bahwa soal termasuk kategori pilihan ganda kompleks agar siswa tidak mengalami kebingungan saat menjawab dan dapat memahami bahwa lebih dari satu jawaban dapat dipilih.
* **Progress Bar Pembelajaran:** Perubahan *dashboard* statistik siswa dari metrik "Kemampuan Akademik" menjadi "Progres Aktivitas Belajar". Menggunakan *bar meter* (contoh: 10/14 Simulasi, 11/12 Modul) untuk melacak penyelesaian Latihan Mandiri, Simulasi TKA, dan Modul.

### Masukan Teknis & Strategi Implementasi

Sebagai PWA yang dirancang khusus untuk siswa kelas 6 SD, menjaga antarmuka tetap interaktif dan tidak membingungkan adalah kunci utamanya. Berikut adalah beberapa pendekatan teknis yang bisa diterapkan:

* **Implementasi Editor & Skeleton (Global):** Untuk menciptakan *loading skeleton* yang mulus, manfaatkan *utility class* dari Tailwind CSS seperti `animate-pulse` pada komponen kotak kosong, sehingga Anda tidak perlu memuat aset *loading* tambahan. Untuk kebutuhan *form* input soal yang menyerupai Word, Anda bisa mengintegrasikan *library* WYSIWYG seperti Quill.js atau TinyMCE yang sangat bersahabat dengan ekosistem JavaScript dan mudah ditangkap nilainya saat dikirim ke *backend* PHP.
* **Preview Data & Export/Import:** Saat pengguna melakukan *import* soal via Excel/CSV, gunakan file reader API pada JavaScript untuk mem-parsing data di sisi klien terlebih dahulu. Ini memungkinkan Anda menampilkan tabel *preview* di layar sebelum data benar-benar di-*insert* ke MySQL. Untuk kebutuhan *export* di sisi Guru, *library* PHP seperti DomPDF (untuk PDF) dan PhpSpreadsheet (untuk Excel) sangat stabil untuk mengatur tata letak  *output* .
* **Render PDF di Sisi Klien (Siswa):** Mengonversi file PDF murni ke HTML yang sempurna di *server* seringkali merusak format asli dokumen. Cara yang jauh lebih aman dan ringan adalah menggunakan  **PDF.js** . *Library* ini akan me-render file PDF langsung ke dalam elemen Canvas/HTML di *browser* siswa, memberikan pengalaman membaca yang mulus tanpa harus mengunduh file jika mereka tidak mau.
* **Skema Survei & TKA (Admin):** Karena Anda memisahkan entitas "Akademik" dan "Survei", pastikan struktur *database* Anda mendukung polimorfisme atau memiliki tabel relasi terpisah. Survei Karakter (seperti Sulingjar) biasanya tidak memiliki konsep "Benar/Salah" melainkan menggunakan skala Likert, sehingga *logic* perhitungan skor di MySQL dan *backend* harus dipisahkan dari fungsi penilaian otomatis simulasi TKA.

Dari keempat modul di atas (Global, Admin, Guru, Siswa), bagian mana yang ingin Anda prioritaskan untuk dieksekusi terlebih dahulu pada siklus pengembangan minggu ini?
