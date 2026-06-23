# Urutan Seeder Per Tabel

Dokumen ini menjabarkan urutan seeding data secara lebih detail agar relasi antar tabel aman saat backend dimigrasikan dan frontend langsung bisa membaca data.

## Prinsip Urutan

1. Seed tabel master/referensi dulu.
2. Lanjut ke tabel konten.
3. Lanjut ke tabel transaksi dan relasi.
4. Terakhir isi tabel riwayat, hasil, dan log.

## Tahap 1 - Master Pengguna

### 1. `pengguna`

Isi akun dasar terlebih dulu:
- 1 admin
- 1 guru
- 3 siswa

Pastikan field yang terisi:
- `username`
- `password`
- `role`
- `status`

### 2. `guru`

Isi profil guru:
- `pengguna_id`
- `nama_lengkap`
- `nip`

### 3. `kelas`

Isi minimal 2 kelas aktif, misalnya:
- `6A`
- `6B`

Field penting:
- `nama_kelas`
- `tahun_ajaran`
- `wali_kelas_id` bila ada
- `is_aktif`

### 4. `siswa`

Isi minimal 3 siswa:
- `pengguna_id`
- `kelas_id`
- `nama_lengkap`
- `nisn`

## Tahap 2 - Struktur Akademik

### 5. `mata_pelajaran`

Isi mapel utama:
- `Matematika`
- `Bahasa Indonesia`
- `IPA`
- `IPS`

### 6. `topik`

Isi topik per mapel, misalnya:
- `Bilangan`
- `Pecahan`
- `Bangun Datar`

Topik ini penting karena tabel `soal` dan `sesi_latihan` sudah mendukung relasi ke `topik`.

## Tahap 3 - Bank Soal

### 7. `soal`

Isi minimal beberapa soal aktif untuk admin dan sesi latihan.

Field penting:
- `mapel_id`
- `topik_id` jika backend mewajibkan
- `dibuat_oleh_id`
- `jenis_soal`
- `isi_soal`
- `status`
- `batas_penggunaan_simulasi`

Jenis soal yang valid:
- `pilihan_ganda`
- `benar_salah`
- `pilihan_ganda_kompleks`

### 8. `opsi_jawaban`

Isi untuk soal yang butuh opsi:
- `soal_id`
- `label`
- `teks_opsi`
- `is_benar`
- `urutan`

Minimal 4 opsi untuk pilihan ganda biasa.

## Tahap 4 - Modul Belajar

### 9. `modul_belajar`

Isi minimal 3 modul aktif.

Field penting:
- `mapel_id`
- `topik_id` jika dipakai
- `dibuat_oleh_id`
- `judul`
- `status`

### 10. `konten_modul`

Isi materi untuk setiap modul.

Field penting:
- `modul_id`
- `judul`
- `urutan`
- `konten`
- `tipe_konten`

### 11. `kuis_modul`

Isi minimal 1 kuis yang terhubung ke modul.

Field penting:
- `modul_id`
- `judul`
- `nilai_minimum`

### 12. `soal_kuis`

Isi soal kuis milik modul.

### 13. `opsi_soal_kuis`

Isi opsi jawaban untuk soal kuis yang bersifat pilihan ganda.

## Tahap 5 - Sesi Latihan

### 14. `sesi_latihan`

Isi minimal 2 sesi:
- 1 `simulasi_tka`
- 1 `latihan_mandiri`

Field penting:
- `dibuat_oleh_id`
- `mapel_id`
- `topik_id`
- `judul`
- `tipe`
- `durasi_menit`
- `acak_soal`
- `status`

### 15. `sesi_latihan_soal`

Hubungkan tiap sesi dengan soal.

Field penting:
- `sesi_latihan_id`
- `soal_id`
- `urutan`
- `bobot_nilai`

### 16. `pengerjaan_latihan`

Isi riwayat pengerjaan minimal untuk 2 siswa.

### 17. `jawaban_siswa`

Isi jawaban per soal pada riwayat latihan.

### 18. `pengerjaan_kuis`

Isi kalau kuis modul ingin dites.

### 19. `jawaban_kuis`

Isi jawaban per soal kuis.

## Tahap 6 - Survei

### 20. `survei`

Isi minimal 1 survei aktif.

### 21. `pertanyaan_survei`

Isi pertanyaan untuk survei tersebut.

### 22. `opsi_survei`

Isi opsi jika pertanyaan bertipe pilihan.

### 23. `pengisian_survei`

Isi minimal 1 pengisian survei oleh siswa.

### 24. `jawaban_survei`

Isi jawaban survei per pertanyaan.

## Tahap 7 - Pesan Dan Log

### 25. `pesan`

Isi pesan bantuan dan pengumuman.

### 26. `pesan_penerima`

Isi penerima pesan untuk tiap pesan.

### 27. `log_aktivitas`

Isi minimal log:
- login
- buka modul
- mulai sesi
- submit jawaban
- kirim pesan

## Urutan Praktis Paling Aman

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
11. `kuis_modul`
12. `soal_kuis`
13. `opsi_soal_kuis`
14. `sesi_latihan`
15. `sesi_latihan_soal`
16. `pengerjaan_latihan`
17. `jawaban_siswa`
18. `survei`
19. `pesan`
20. `log_aktivitas`

## Catatan Penting Untuk Admin Soal

Kalau proses pembuatan soal di admin masih gagal, seed minimal ini harus sudah ada:

- 1 user `admin`
- 1 user `guru` atau `admin` yang dipakai sebagai `dibuat_oleh_id`
- minimal 1 `mata_pelajaran`
- minimal 1 `topik` yang terhubung ke mapel
- minimal 1 soal dengan `jenis_soal` valid
- untuk soal pilihan ganda, minimal 4 `opsi_jawaban`
- setiap `soal` harus punya `mapel_id`, `dibuat_oleh_id`, `isi_soal`, dan `status`
