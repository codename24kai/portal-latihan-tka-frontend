# Daftar Endpoint API dan Panduan Testing Postman

Dokumen ini merangkum endpoint API yang dipakai frontend saat ini, sekaligus urutan testing di Postman dan saran urutan seeding data sebelum migrasi.

## Catatan Umum

- Base URL sesuaikan dengan backend Anda, misalnya `http://localhost:8000/api`.
- Header umum yang disarankan:
  - `Accept: application/json`
  - `Content-Type: application/json`
- Jika backend memakai autentikasi token:
  - `Authorization: Bearer <token>`

## 1. Endpoint Siswa

- `GET /api/siswa/dashboard`
- `GET /api/siswa/sesi-latihan`
- `GET /api/siswa/sesi-latihan/{id}`
- `GET /api/siswa/sesi-latihan/{id_riwayat}/hasil`
- `GET /api/siswa/latihan`
- `GET /api/siswa/latihan/{id}`
- `GET /api/siswa/latihan/{id_riwayat}/hasil`
- `GET /api/siswa/survei/{id}`
- `POST /api/siswa/survei/{id}/submit`
- `GET /api/siswa/modul`
- `GET /api/siswa/modul/{modul_id}/materi/{materi_id}`
- `POST /api/siswa/modul/{modul_id}/materi/{materi_id}/selesai`
- `PUT /api/siswa/profil`
- `POST /api/siswa/ganti-password`
- `POST /api/siswa/pesan/kirim`

## 2. Endpoint Guru

- `GET /api/guru/dashboard`
- `GET /api/guru/siswa`
- `GET /api/guru/sesi-latihan`
- `POST /api/guru/sesi-latihan`
- `GET /api/guru/sesi-latihan/{id}`
- `PUT /api/guru/sesi-latihan/{id}`
- `DELETE /api/guru/sesi-latihan/{id}`
- `GET /api/guru/laporan/nilai`
- `GET /api/guru/laporan/export`
- `GET /api/guru/modul`
- `POST /api/guru/modul`
- `POST /api/guru/modul/{id}/cover`
- `POST /api/guru/modul/{id}/materi`
- `GET /api/guru/kuis`
- `POST /api/guru/kuis`
- `POST /api/guru/kuis/{id}/soal`
- `GET /api/guru/pesan`
- `POST /api/pesan/broadcast`

## 3. Endpoint Admin

- `GET /api/admin/dashboard`
- `GET /api/admin/sesi-latihan`
- `POST /api/admin/sesi-latihan`
- `GET /api/admin/sesi-latihan/{id}`
- `PUT /api/admin/sesi-latihan/{id}`
- `DELETE /api/admin/sesi-latihan/{id}`
- `GET /api/admin/modul`
- `GET /api/admin/modul/{id}`
- `POST /api/admin/modul`
- `PUT /api/admin/modul/{id}`
- `DELETE /api/admin/modul/{id}`
- `GET /api/admin/soal`
- `GET /api/admin/log-aktivitas`
- `GET /api/admin/laporan/nilai`
- `GET /api/admin/survei`
- `POST /api/admin/survei`
- `PUT /api/admin/survei/{id}`
- `DELETE /api/admin/survei/{id}`

## 4. Cara Testing Di Postman

### A. Setup Awal

1. Buat environment Postman dengan variabel:
   - `base_url`
   - `token`
2. Isi `base_url` dengan alamat backend, misalnya:
   - `http://localhost:8000/api`
3. Tambahkan header default:
   - `Accept: application/json`
   - `Content-Type: application/json`
4. Jika perlu autentikasi:
   - `Authorization: Bearer {{token}}`

### B. Urutan Testing yang Disarankan

1. Test login atau auth lebih dulu, jika ada.
2. Test endpoint read/list untuk memastikan data keluar.
3. Test endpoint detail untuk memastikan relasi dan mapping field benar.
4. Test endpoint create.
5. Test endpoint update.
6. Test endpoint delete.
7. Test endpoint hasil dan riwayat terakhir.

### C. Contoh Testing Cepat

#### 1. Dashboard siswa

- Method: `GET`
- URL: `{{base_url}}/siswa/dashboard`
- Tujuan: cek ringkasan statistik dan sesi terdekat.

#### 2. Daftar sesi latihan siswa

- Method: `GET`
- URL: `{{base_url}}/siswa/sesi-latihan`
- Tujuan: cek daftar sesi yang tampil di frontend.

#### 3. Detail sesi latihan siswa

- Method: `GET`
- URL: `{{base_url}}/siswa/sesi-latihan/1`
- Tujuan: cek detail sesi dan struktur soal.

#### 4. Submit survei siswa

- Method: `POST`
- URL: `{{base_url}}/siswa/survei/1/submit`
- Body contoh:

```json
{
  "jawaban": [
    {
      "id_pertanyaan": 1,
      "jawaban": "A"
    }
  ]
}
```

#### 5. Buat sesi latihan admin

- Method: `POST`
- URL: `{{base_url}}/admin/sesi-latihan`
- Body sesuaikan field backend.

#### 6. Update sesi latihan admin

- Method: `PUT`
- URL: `{{base_url}}/admin/sesi-latihan/1`
- Body sesuaikan field backend.

#### 7. Hapus sesi latihan admin

- Method: `DELETE`
- URL: `{{base_url}}/admin/sesi-latihan/1`

## 5. Urutan Seeding Data

Kalau Anda ingin isi semua data seeder dulu sebelum migrasi manual, urutan aman yang disarankan:

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
18. `pengerjaan_kuis`
19. `jawaban_kuis`
20. `survei`
21. `pertanyaan_survei`
22. `opsi_survei`
23. `pengisian_survei`
24. `jawaban_survei`
25. `pesan`
26. `pesan_penerima`
27. `log_aktivitas`

## 6. Field Penting Yang Perlu Konsisten

Supaya frontend langsung jalan setelah migrasi, pastikan response backend tetap menyediakan field berikut:

- `total_sesi_latihan`
- `sesi_latihan_terdekat`
- `id_sesi_latihan`
- `judul_sesi_latihan`
- `resource`

## 7. Checklist Cepat

- Endpoint list bisa diakses dengan status `200`.
- Endpoint detail mengembalikan `data` yang lengkap.
- Endpoint create menghasilkan `201` atau `200`.
- Endpoint update sukses menyimpan perubahan.
- Endpoint delete menghapus data yang benar.
- Response dashboard siswa punya `total_sesi_latihan` dan `sesi_latihan_terdekat`.
- Untuk pembuatan soal admin, pastikan sudah ada:
  - minimal 1 `pengguna` role `admin`
  - minimal 1 `pengguna` role `guru` atau `siswa` yang valid sebagai pembuat soal
  - minimal 1 `mata_pelajaran`
  - minimal 1 `topik` untuk mapel terkait, jika backend mewajibkan relasi topik
  - minimal 1 soal dengan `jenis_soal` valid: `pilihan_ganda`, `benar_salah`, atau `pilihan_ganda_kompleks`
  - opsi jawaban terisi untuk soal pilihan ganda
