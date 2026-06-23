# Perencanaan Integrasi Endpoint API ke Frontend Portal Latihan TKA

Dokumen ini menjadi rencana kerja untuk menyambungkan halaman frontend `portal-latihan-tka-frontend` ke endpoint backend yang sudah diselaraskan dengan tabel database.

## Ringkasan Arah Integrasi

Backend aktif saat ini sudah mengarah ke:
- `GET /api/siswa/sesi-latihan`
- `GET /api/siswa/sesi-latihan/{id}`
- `POST /api/siswa/sesi-latihan/mulai`
- `POST /api/siswa/sesi-latihan/{id_riwayat}/jawab`
- `POST /api/siswa/sesi-latihan/submit`
- `GET /api/siswa/sesi-latihan/{id_riwayat}/hasil`
- `GET /api/admin/sesi-latihan`
- `POST /api/admin/sesi-latihan`
- `GET /api/admin/sesi-latihan/{id}`
- `PUT /api/admin/sesi-latihan/{id}`
- `DELETE /api/admin/sesi-latihan/{id}`
- `PATCH /api/admin/sesi-latihan/{id}/status`
- `GET /api/guru/sesi-latihan`
- `POST /api/guru/sesi-latihan`
- `GET /api/guru/sesi-latihan/{id}`
- `PUT /api/guru/sesi-latihan/{id}`
- `DELETE /api/guru/sesi-latihan/{id}`

Tujuan integrasi:
- mengganti akses data dummy/statis ke data backend
- menyamakan nama field frontend dengan payload backend baru
- menjaga kompatibilitas UX saat transisi dari istilah lama `simulasi` dan `agenda` ke `sesi-latihan`

## Fase Integrasi

### Fase 1 - Penyesuaian Lapisan API

Status: pending

File target:
- [src/utilitas/apiSiswa.js](D:/laragon/www/portal-latihan-tka-frontend/src/utilitas/apiSiswa.js)
- [src/utilitas/apiGuru.js](D:/laragon/www/portal-latihan-tka-frontend/src/utilitas/apiGuru.js)

Langkah:
- ubah endpoint siswa dari `/siswa/simulasi` menjadi `/siswa/sesi-latihan`
- ubah endpoint guru dari `/guru/agenda` menjadi `/guru/sesi-latihan`
- sesuaikan mapping response ke nama field baru:
  - `total_sesi_latihan`
  - `sesi_latihan_terdekat`
  - `id_sesi_latihan`
  - `judul_sesi_latihan`
  - `resource`
- pertahankan fallback mapping untuk payload lama selama masa transisi jika masih dibutuhkan oleh komponen yang belum dimigrasi

Output yang diharapkan:
- satu sumber data resmi untuk setiap role
- tidak ada request frontend yang masih mengarah ke endpoint lama `simulasi`/`agenda`

### Fase 2 - Dashboard Siswa

Status: pending

File target:
- [src/siswa/halaman/DashboardSiswa.jsx](D:/laragon/www/portal-latihan-tka-frontend/src/siswa/halaman/DashboardSiswa.jsx)
- komponen dashboard terkait di `src/komponen/siswa/Dashboard/`

Endpoint yang dipakai:
- `GET /api/siswa/dashboard`
- `GET /api/siswa/sesi-latihan`
- `GET /api/siswa/pesan`

Langkah:
- tampilkan ringkasan statistik dari `total_sesi_latihan`, `rata_rata_nilai`, dan `modul_selesai`
- ganti widget "Simulasi Terdekat" menjadi "Sesi Latihan Terdekat" atau label netral lain yang konsisten
- pastikan daftar pesan/notifikasi tetap mengambil `pesan_penerima`
- sesuaikan label kartu dan tooltip agar tidak lagi mengacu ke endpoint lama

Catatan UX:
- istilah visual boleh tetap memakai "Tryout" atau "Simulasi TKA" jika memang konteksnya adalah domain ujian, tetapi akses data harus tetap lewat `sesi-latihan`

### Fase 3 - Halaman Latihan Siswa

Status: pending

File target:
- [src/siswa/halaman/LatihanSiswa.jsx](D:/laragon/www/portal-latihan-tka-frontend/src/siswa/halaman/LatihanSiswa.jsx)
- [src/komponen/siswa/latihan/PraLatihanMandiri.jsx](D:/laragon/www/portal-latihan-tka-frontend/src/komponen/siswa/latihan/PraLatihanMandiri.jsx)
- [src/komponen/siswa/latihan/EksekusiLatihanMandiri.jsx](D:/laragon/www/portal-latihan-tka-frontend/src/komponen/siswa/latihan/EksekusiLatihanMandiri.jsx)
- [src/komponen/siswa/latihan/HasilLatihanMandiri.jsx](D:/laragon/www/portal-latihan-tka-frontend/src/komponen/siswa/latihan/HasilLatihanMandiri.jsx)
- [src/komponen/siswa/latihan/PraSimulasiTKA.jsx](D:/laragon/www/portal-latihan-tka-frontend/src/komponen/siswa/latihan/PraSimulasiTKA.jsx)
- [src/komponen/siswa/latihan/EksekusiSimulasiTKA.jsx](D:/laragon/www/portal-latihan-tka-frontend/src/komponen/siswa/latihan/EksekusiSimulasiTKA.jsx)
- [src/komponen/siswa/latihan/HasilSimulasiTKA.jsx](D:/laragon/www/portal-latihan-tka-frontend/src/komponen/siswa/latihan/HasilSimulasiTKA.jsx)

Endpoint yang dipakai:
- `GET /api/siswa/latihan`
- `GET /api/siswa/sesi-latihan`
- `GET /api/siswa/latihan/{id}`
- `GET /api/siswa/sesi-latihan/{id}`
- `POST /api/siswa/sesi-latihan/mulai`
- `POST /api/siswa/sesi-latihan/{id_riwayat}/jawab`
- `POST /api/siswa/sesi-latihan/submit`
- `GET /api/siswa/latihan/{id_riwayat}/hasil`
- `GET /api/siswa/sesi-latihan/{id_riwayat}/hasil`

Langkah:
- ubah tab daftar menjadi sumber data backend, bukan `mockLatihanMandiri` / `mockSimulasiTka`
- gunakan response seragam untuk item latihan dan sesi latihan
- pastikan halaman pra, kerjakan, dan hasil membaca field `judul_sesi_latihan`, `durasi_menit`, `resource`, dan `status`
- sambungkan auto-save jawaban ke endpoint `POST /api/siswa/sesi-latihan/{id_riwayat}/jawab`
- sambungkan submit akhir ke endpoint `POST /api/siswa/sesi-latihan/submit`

Risiko:
- komponen frontend masih memakai nama route/label lama seperti `simulasiId`, `judul_simulasi`, atau `simulasi_terdekat`
- perlu normalisasi bertahap agar tidak mematahkan state dan props yang sudah ada

### Fase 4 - Modul dan Materi

Status: pending

File target:
- [src/siswa/halaman/ModulSiswa.jsx](D:/laragon/www/portal-latihan-tka-frontend/src/siswa/halaman/ModulSiswa.jsx)
- [src/komponen/siswa/LearningViewer.jsx](D:/laragon/www/portal-latihan-tka-frontend/src/komponen/siswa/LearningViewer.jsx)
- [src/utilitas/apiSiswa.js](D:/laragon/www/portal-latihan-tka-frontend/src/utilitas/apiSiswa.js)

Endpoint yang dipakai:
- `GET /api/siswa/modul`
- `GET /api/siswa/modul/:modul_id/materi/:materi_id`
- `POST /api/siswa/modul/:modul_id/materi/:materi_id/selesai`

Langkah:
- pastikan list modul membaca response backend nyata
- sambungkan viewer materi ke konten dari `konten_modul`
- tandai materi selesai dan update progress setelah aksi pengguna
- pertahankan alur ke kuis modul bila semua materi sudah selesai

### Fase 5 - Survei dan Pesan

Status: pending

File target:
- [src/komponen/siswa/latihan/PraSurvei.jsx](D:/laragon/www/portal-latihan-tka-frontend/src/komponen/siswa/latihan/PraSurvei.jsx)
- [src/komponen/siswa/latihan/EksekusiSurveiSiswa.jsx](D:/laragon/www/portal-latihan-tka-frontend/src/komponen/siswa/latihan/EksekusiSurveiSiswa.jsx)
- [src/komponen/siswa/latihan/SurveiSelesaiSiswa.jsx](D:/laragon/www/portal-latihan-tka-frontend/src/komponen/siswa/latihan/SurveiSelesaiSiswa.jsx)
- [src/komponen/siswa/PusatBantuan.jsx](D:/laragon/www/portal-latihan-tka-frontend/src/siswa/halaman/PusatBantuan.jsx)
- [src/utilitas/apiSiswa.js](D:/laragon/www/portal-latihan-tka-frontend/src/utilitas/apiSiswa.js)

Endpoint yang dipakai:
- `GET /api/siswa/survei/:id`
- `POST /api/siswa/survei/:id/submit`
- `GET /api/siswa/pesan`
- `PATCH /api/siswa/pesan/:id_pesan_penerima/baca`
- `POST /api/siswa/pesan/kirim`

Langkah:
- pastikan survei detail dan submit mengikuti struktur response backend terbaru
- sambungkan inbox pesan ke tabel `pesan_penerima`
- tandai pesan dibaca saat detail dibuka

### Fase 6 - Admin dan Guru

Status: pending

File target:
- [src/admin/halaman/DashboardAdmin.jsx](D:/laragon/www/portal-latihan-tka-frontend/src/admin/halaman/DashboardAdmin.jsx)
- [src/admin/halaman/ManajemenSimulasi.jsx](D:/laragon/www/portal-latihan-tka-frontend/src/admin/halaman/ManajemenSimulasi.jsx)
- [src/admin/halaman/ManajemenPengguna.jsx](D:/laragon/www/portal-latihan-tka-frontend/src/admin/halaman/ManajemenPengguna.jsx)
- [src/guru/halaman/DashboardGuru.jsx](D:/laragon/www/portal-latihan-tka-frontend/src/guru/halaman/DashboardGuru.jsx)
- [src/guru/halaman/AgendaKelas.jsx](D:/laragon/www/portal-latihan-tka-frontend/src/guru/halaman/AgendaKelas.jsx)
- [src/guru/halaman/KelolaLatihanGuru.jsx](D:/laragon/www/portal-latihan-tka-frontend/src/guru/halaman/KelolaLatihanGuru.jsx)
- [src/utilitas/apiGuru.js](D:/laragon/www/portal-latihan-tka-frontend/src/utilitas/apiGuru.js)

Endpoint yang dipakai:
- `GET /api/admin/dashboard`
- `GET /api/admin/sesi-latihan`
- `POST /api/admin/sesi-latihan`
- `GET /api/admin/sesi-latihan/{id}`
- `PUT /api/admin/sesi-latihan/{id}`
- `DELETE /api/admin/sesi-latihan/{id}`
- `PATCH /api/admin/sesi-latihan/{id}/status`
- `GET /api/guru/dashboard`
- `GET /api/guru/sesi-latihan`
- `POST /api/guru/sesi-latihan`
- `GET /api/guru/sesi-latihan/{id}`
- `PUT /api/guru/sesi-latihan/{id}`
- `DELETE /api/guru/sesi-latihan/{id}`
- `GET /api/guru/kuis`
- `POST /api/guru/kuis`
- `POST /api/guru/kuis/{id}/soal`
- `GET /api/guru/pesan`

Langkah:
- ganti semua referensi UI `agenda` ke `sesi latihan` atau istilah tampilan yang netral
- sambungkan dashboard admin dan guru ke response backend yang sudah diseragamkan
- pastikan manajemen simulasi/latihan guru memakai route `sesi-latihan`

## Prioritas Implementasi

1. Perbarui `src/utilitas/apiSiswa.js` dan `src/utilitas/apiGuru.js`
2. Sambungkan dashboard siswa ke response `total_sesi_latihan` dan `sesi_latihan_terdekat`
3. Migrasikan halaman latihan siswa dari mock data ke backend
4. Ubah halaman admin dan guru ke route `sesi-latihan`
5. Bersihkan label dan route lama di UI secara bertahap

## Catatan Migrasi

- Istilah `simulasi_tka` masih dipakai di database dan boleh tetap tampil sebagai istilah domain
- Endpoint publik yang harus dipakai frontend sekarang adalah `sesi-latihan`, bukan `simulasi`
- Untuk komponen yang belum dimigrasi penuh, boleh dipakai adapter sementara di utilitas API agar transisi lebih aman

