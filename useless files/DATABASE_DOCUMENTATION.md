# Database Portal Latihan TKA

## Struktur Tabel

### users
Tabel menyimpan data pengguna sistem (guru, admin, dsb.).

#### Kolom
| Nama Kolom | Tipe Data | Nullable | Default | Keterangan |
|------------|-----------|----------|----------|------------|
| id | **bigIncrements** | No | — | Primary Key |
| name | **string** (255) | No | — | Nama lengkap pengguna |
| email | **string** (255) | No | — | Email unik, digunakan untuk login |
| password | **string** (255) | No | — | Password hash |
| role_id | **unsignedBigInteger** | No | — | Foreign key ke `roles.id` |
| email_verified_at | **timestamp** | Yes | NULL | Waktu verifikasi email |
| created_at | **timestamp** | Yes | NULL | Timestamp pembuatan |
| updated_at | **timestamp** | Yes | NULL | Timestamp pembaruan |

#### Relasi
- **Foreign Key** `role_id` → `roles.id` **onDelete cascade**, **onUpdate cascade**.

#### Migration Laravel (excerpt)
```php
public function up()
{
    Schema::create('users', function (Blueprint $table) {
        $table->bigIncrements('id');
        $table->string('name');
        $table->string('email')->unique();
        $table->string('password');
        $table->unsignedBigInteger('role_id');
        $table->timestamp('email_verified_at')->nullable();
        $table->timestamps();

        $table->foreign('role_id')
              ->references('id')->on('roles')
              ->onDelete('cascade')
              ->onUpdate('cascade');
    });
}

public function down()
{
    Schema::dropIfExists('users');
}
```

---

### roles
Menyimpan jenis peran (role) dalam sistem.

#### Kolom
| Nama Kolom | Tipe Data | Nullable | Default | Keterangan |
|------------|-----------|----------|----------|------------|
| id | **bigIncrements** | No | — | Primary Key |
| name | **string** (100) | No | — | Nama role (contoh: admin, guru) |
| created_at | **timestamp** | Yes | NULL |
| updated_at | **timestamp** | Yes | NULL |

#### Relasi
- Tidak memiliki foreign key.

#### Migration Laravel (excerpt)
```php
public function up()
{
    Schema::create('roles', function (Blueprint $table) {
        $table->bigIncrements('id');
        $table->string('name', 100);
        $table->timestamps();
    });
}

public function down()
{
    Schema::dropIfExists('roles');
}
```

---

### students
Data murid yang mengikuti tryout.

#### Kolom
| Nama Kolom | Tipe Data | Nullable | Default | Keterangan |
|------------|-----------|----------|----------|------------|
| id | **bigIncrements** | No | — | Primary Key |
| name | **string** (255) | No | — | Nama lengkap murid |
| email | **string** (255) | No | — | Email unik |
| class | **string** (50) | No | — | Kelas / jurusan |
| avatar | **string** (255) | Yes | NULL | Path foto profil |
| created_at | **timestamp** | Yes | NULL |
| updated_at | **timestamp** | Yes | NULL |

#### Relasi
- Tidak ada foreign key, tetapi akan direferensikan oleh tabel lain (scores, messages).

---

### exam_sessions
Menyimpan tiap sesi ujian / tryout yang dapat diikuti murid.

#### Kolom
| Nama Kolom | Tipe Data | Nullable | Default | Keterangan |
|------------|-----------|----------|----------|------------|
| id | **bigIncrements** | No | — | Primary Key |
| name | **string** (255) | No | — | Nama sesi (contoh: Simulasi TKA #1) |
| type | **enum** ('simulasi','latihan') | No | 'latihan' |
| start_date | **date** | No | — |
| end_date | **date** | No | — |
| created_at | **timestamp** | Yes | NULL |
| updated_at | **timestamp** | Yes | NULL |

---

### scores
Menyimpan nilai murid per sesi dan mata pelajaran.

#### Kolom
| Nama Kolom | Tipe Data | Nullable | Default | Keterangan |
|------------|-----------|----------|----------|------------|
| id | **bigIncrements** | No | — |
| student_id | **unsignedBigInteger** | No | — |
| exam_session_id | **unsignedBigInteger** | No | — |
| subject | **enum** ('matematika','bahasa') | No | — |
| score | **decimal** (5,2) | No | 0 |
| created_at | **timestamp** | Yes | NULL |
| updated_at | **timestamp** | Yes | NULL |

#### Relasi
- `student_id` → `students.id` **onDelete cascade**
- `exam_session_id` → `exam_sessions.id` **onDelete cascade**

#### Migration Laravel (excerpt)
```php
public function up()
{
    Schema::create('scores', function (Blueprint $table) {
        $table->bigIncrements('id');
        $table->unsignedBigInteger('student_id');
        $table->unsignedBigInteger('exam_session_id');
        $table->enum('subject', ['matematika','bahasa']);
        $table->decimal('score', 5, 2)->default(0);
        $table->timestamps();

        $table->foreign('student_id')
              ->references('id')->on('students')
              ->onDelete('cascade');
        $table->foreign('exam_session_id')
              ->references('id')->on('exam_sessions')
              ->onDelete('cascade');
    });
}

public function down()
{
    Schema::dropIfExists('scores');
}
```

---

### messages
Menyimpan pesan guru → murid (untuk modul messaging).

#### Kolom
| Nama Kolom | Tipe Data | Nullable | Default | Keterangan |
|------------|-----------|----------|----------|------------|
| id | **bigIncrements** | No | — |
| sender_id | **unsignedBigInteger** | No | — | ID guru (users.id) |
| receiver_id | **unsignedBigInteger** | No | — | ID murid (students.id) |
| content | **text** | No | — |
| sent_at | **timestamp** | No | CURRENT_TIMESTAMP |
| created_at | **timestamp** | Yes | NULL |
| updated_at | **timestamp** | Yes | NULL |

#### Relasi
- `sender_id` → `users.id` **onDelete cascade**
- `receiver_id` → `students.id` **onDelete cascade**

---

## Urutan Pembuatan Migration
1. **create_roles_table** – karena `users` membutuhkan foreign key ke `roles`.
2. **create_users_table** – setelah `roles` ada.
3. **create_students_table** – tidak tergantung tabel lain.
4. **create_exam_sessions_table** – independen.
5. **create_scores_table** – membutuhkan `students` & `exam_sessions`.
6. **create_messages_table** – membutuhkan `users` & `students`.

Pastikan setiap migration menggunakan `php artisan migrate` secara berurutan atau gunakan timestamp pada nama file migration agar Laravel mengeksekusi dalam urutan yang tepat.

## Daftar File Migration (contoh nama file)
- `2024_01_01_000000_create_roles_table.php`
- `2024_01_01_010000_create_users_table.php`
- `2024_01_01_020000_create_students_table.php`
- `2024_01_01_030000_create_exam_sessions_table.php`
- `2024_01_01_040000_create_scores_table.php`
- `2024_01_01_050000_create_messages_table.php`

## Catatan Implementasi
- **Indexing & Unique**:
  - `users.email` – unique index (Laravel `->unique()`).
  - `students.email` – unique index.
  - `scores` – composite unique index on (`student_id`, `exam_session_id`, `subject`) untuk mencegah duplikasi nilai per mata pelajaran.
  - `messages` – index pada `sender_id` dan `receiver_id` untuk pencarian cepat.
- **Foreign Keys**:
  - Selalu gunakan `unsignedBigInteger` untuk kolom referensi.
  - Tentukan `onDelete cascade` pada hubungan yang harus bersifat **dependent** (nilai akan dihapus bila murid atau sesi dihapus).
- **Soft Deletes**:
  - Jika diperlukan, tambahkan `$table->softDeletes();` pada tabel yang mungkin di‑restore (misalnya `users`, `students`).
- **Enum vs. Lookup Table**:
  - Untuk `exam_sessions.type` dan `scores.subject` enum sudah cukup, tapi bila aplikasi memerlukan extensibility, pertimbangkan tabel lookup.
- **Timestamps**:
  - Laravel otomatis menambah `created_at` dan `updated_at` dengan `$table->timestamps();`.
- **Naming Conventions**:
  - Gunakan snake_case untuk nama kolom dan tabel.
  - Primary key selalu `id` (bigIncrements).
  - Foreign key berakhiran `_id`.

---

> **Catatan**: Dokumentasi ini bersifat generik. Sesuaikan dengan kebutuhan spesifik proyek seperti tambahan tabel `announcements`, `attendance`, atau `exam_results` bila diperlukan.
