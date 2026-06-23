# Checklist Data Minimal Setelah Migrasi

Dokumen ini dipakai sebagai checklist agar frontend langsung hidup setelah backend dimigrasikan.

## 1. Akun Dan Akses

- [ ] Ada minimal 1 akun `admin`
- [ ] Ada minimal 1 akun `guru`
- [ ] Ada minimal 3 akun `siswa`
- [ ] Role terisi benar di tabel `pengguna`
- [ ] Setiap akun punya data profil di tabel `guru` atau `siswa`
- [ ] Setiap akun bisa login

## 2. Kelas Dan Profil

- [ ] Ada minimal 2 kelas aktif
- [ ] Siswa sudah punya `kelas_id`
- [ ] Guru punya data profil di tabel `guru`
- [ ] Profil siswa menampilkan nama dan kelas
- [ ] Profil guru dan admin bisa dibaca dari endpoint profil

## 3. Data Akademik Dasar

- [ ] Ada beberapa mata pelajaran aktif
- [ ] Ada minimal 1 topik per mapel yang dipakai testing
- [ ] Ada minimal 3 modul di tabel `modul_belajar`
- [ ] Setiap modul punya minimal 1 konten di tabel `konten_modul`
- [ ] Setiap materi punya konten yang bisa dirender frontend

## 4. Bank Soal Dan Kuis

- [ ] Ada data di tabel `soal`
- [ ] Soal punya relasi ke `mata_pelajaran`
- [ ] Soal punya relasi ke `topik` jika backend memakainya
- [ ] Opsi jawaban tersedia untuk soal pilihan ganda
- [ ] Ada pembahasan atau kunci jawaban
- [ ] Ada minimal 1 kuis di tabel `kuis_modul`
- [ ] Ada relasi `soal_kuis`

## 5. Sesi Latihan

- [ ] Ada minimal 2 sesi di tabel `sesi_latihan`
- [ ] Setiap sesi punya judul yang jelas
- [ ] Setiap sesi punya `tipe` valid
- [ ] Setiap sesi punya `durasi_menit`
- [ ] Setiap sesi punya status
- [ ] Setiap sesi punya relasi ke soal di `sesi_latihan_soal`
- [ ] Frontend bisa membaca `total_sesi_latihan`
- [ ] Frontend bisa membaca `sesi_latihan_terdekat`

## 6. Riwayat Pengerjaan

- [ ] Ada minimal 2 riwayat di tabel `pengerjaan_latihan`
- [ ] Riwayat punya relasi ke siswa
- [ ] Riwayat punya relasi ke sesi latihan
- [ ] Riwayat punya nilai akhir
- [ ] Riwayat punya waktu mulai atau selesai
- [ ] Frontend bisa menampilkan riwayat di dashboard dan halaman hasil

## 7. Survei

- [ ] Ada minimal 1 survei aktif
- [ ] Survei punya pertanyaan di tabel `pertanyaan_survei`
- [ ] Pertanyaan punya opsi jika diperlukan di tabel `opsi_survei`
- [ ] Ada minimal 1 jawaban survei
- [ ] Halaman hasil sesi bisa lanjut ke survei

## 8. Pesan Dan Notifikasi

- [ ] Ada minimal beberapa pesan masuk di tabel `pesan`
- [ ] Tabel `pesan_penerima` terisi
- [ ] Ada status baca
- [ ] Panel inbox dan notifikasi tidak kosong

## 9. Dashboard

- [ ] Dashboard siswa mengembalikan statistik utama
- [ ] Dashboard siswa menampilkan sesi terdekat
- [ ] Dashboard guru mengembalikan ringkasan yang valid
- [ ] Dashboard admin mengembalikan metrik utama
- [ ] Response siswa punya `total_sesi_latihan`
- [ ] Response siswa punya `sesi_latihan_terdekat`

## 10. Laporan Dan Aktivitas

- [ ] Laporan nilai guru/admin menampilkan data
- [ ] Log aktivitas admin terisi
- [ ] Riwayat siswa dapat dipakai untuk grafik atau tabel

## 11. Kriteria Minimum Supaya Frontend Siap

Frontend dianggap siap setelah migrate kalau semua poin ini terpenuhi:

- [ ] Login berhasil untuk admin, guru, dan siswa
- [ ] Dashboard siswa terbuka tanpa error
- [ ] Daftar sesi latihan siswa tampil
- [ ] Detail sesi latihan tampil
- [ ] Halaman pengerjaan sesi bisa dibuka
- [ ] Halaman hasil sesi bisa dibuka
- [ ] Dashboard guru terbuka
- [ ] Halaman sesi latihan guru/admin bisa dibuka
- [ ] Laporan nilai tampil
- [ ] Data modul dan materi tampil
- [ ] Survei bisa dibuka
- [ ] Pesan dan notifikasi bisa dibaca
- [ ] Admin bisa membuat soal baru dengan `soal` dan `opsi_jawaban`

## 12. Prioritas Data Yang Paling Penting

Kalau waktu migrasi terbatas, prioritas minimalnya:

1. `pengguna`
2. `guru`
3. `kelas`
4. `siswa`
5. `mata_pelajaran`
6. `topik`
7. `soal`
8. `opsi_jawaban`
9. `modul_belajar`
10. `konten_modul`
11. `sesi_latihan`
12. `sesi_latihan_soal`
13. `pengerjaan_latihan`
14. `survei`
15. `pesan`
