# UAT Strategy - Sistem Prestasi Mahasiswa

## 1. System Overview & Scope
Sistem Prestasi Mahasiswa adalah platform web berbasis Next.js (App Router) yang dirancang untuk mengelola, mencatat, dan memvalidasi capaian prestasi mahasiswa di lingkungan universitas. Sistem ini mengintegrasikan alur pelaporan mandiri oleh mahasiswa dengan proses verifikasi berjenjang oleh Admin. 

**Fitur Utama:**
- **Autentikasi & Otorisasi:** Menggunakan Better Auth dengan dukungan MFA (Two-Factor Authentication).
- **Pelaporan Prestasi:** Formulir dinamis dengan deteksi otomatis semester (Pola Tel-U), validasi file bukti pendukung, dan dukungan partisipasi Individu/Tim.
- **Verifikasi Admin:** Workflow persetujuan (Approve) dengan pemberian poin atau penolakan (Reject) dengan catatan.
- **Dashboard & Statistik:** Visualisasi data prestasi per mahasiswa, per program studi, dan untuk kebutuhan akreditasi (LAM TEKNIK).
- **Penyimpanan Berkas:** Integrasi Cloudflare R2 untuk penyimpanan sertifikat dan dokumen bukti yang aman.
- **Notifikasi Real-time:** Pemberitahuan otomatis kepada mahasiswa dan admin terkait status pengajuan.

## 2. Actors & Permissions
Berdasarkan implementasi pada `middleware.ts` dan schema database, berikut adalah role yang tersedia:

| Role | Deskripsi Hak Akses |
| :--- | :--- |
| **MAHASISWA** | Akses ke Dashboard Mahasiswa, Riwayat Prestasi, Form Lapor Prestasi, dan Pengaturan Profil. |
| **ADMIN** | Hak akses penuh. Dapat mengakses seluruh dashboard (Admin, WD, Kaprodi, Akreditasi), memverifikasi prestasi, mengelola data master (Kategori, Tingkat, Prodi), dan mengoreksi data prestasi. |
| **WD (WD1)** | Akses ke Dashboard Wakil Dekan untuk melihat rekapitulasi prestasi tingkat fakultas. |
| **KAPRODI** | Akses ke Dashboard Kaprodi untuk memantau capaian prestasi mahasiswa di Program Studinya. |
| **AKREDITASI** | Akses khusus untuk melihat data rekapitulasi prestasi yang difilter untuk kebutuhan dokumen akreditasi. |

## 3. Database & Backend Validation Points
Titik-titik kritis yang harus divalidasi pada level database dan server actions:

- **Relasi Entitas (`schema.prisma`):**
    - Pastikan penghapusan user (`User`) akan menghapus data `Mahasiswa` dan `Session` secara bertahap (`onDelete: Cascade`).
    - Pastikan data `Prestasi` tidak dapat dihapus jika statusnya sudah `APPROVED` atau `REJECTED`.
- **Integritas Data:**
    - `mahasiswaId`, `kategoriId`, dan `tingkatId` harus valid dan merujuk pada tabel master yang ada.
    - Poin prestasi (`poin`) hanya boleh diisi/diperbarui oleh role `ADMIN` melalui server action `validateAchievement`.
- **Penyimpanan Berkas (R2):**
    - Validasi tipe file di backend (`uploadFileToR2`): Memastikan hanya file yang diizinkan yang tersimpan di bucket.
    - Integritas URL: URL yang disimpan di kolom `buktiBuktiUrls` harus berupa array JSON yang dapat diakses secara publik (jika konfigurasi R2_PUBLIC_URL benar).
- **Notifikasi:**
    - Setiap `createPrestasi` harus men-trigger pembuatan record `Notification` untuk seluruh user ber-role `ADMIN`.

## 4. End-to-End (E2E) Test Scenarios
Skenario pengujian dari sisi pengguna (Black-box testing):

1.  **Skenario Pelaporan Mandiri:**
    - Mahasiswa login -> Masuk menu "Lapor" -> Mengisi detail prestasi -> Mengunggah 2 file bukti -> Submit -> Cek status di Riwayat (Status harus PENDING).
2.  **Skenario Validasi Admin (Approval):**
    - Admin login -> Masuk menu "Verifikasi" -> Memilih pengajuan PENDING -> Memberikan catatan dan 10 poin -> Klik Setuju -> Cek status prestasi (Status berubah APPROVED).
3.  **Skenario Notifikasi Balikan:**
    - Setelah Admin menyetujui, Mahasiswa login -> Cek dropdown notifikasi -> Klik notifikasi "Prestasi Disetujui" -> Dialihkan ke detail prestasi yang bersangkutan.
4.  **Skenario Partisipasi Tim:**
    - Mahasiswa lapor prestasi -> Aktifkan switch "Tim" -> Tambah 2 anggota tim (isi NIM & Nama) -> Submit -> Admin cek detail (Data tim harus muncul dengan benar).
5.  **Skenario Dashboard Akreditasi:**
    - User Akreditasi login -> Pilih tahun akademik -> Pastikan angka jumlah prestasi yang muncul sesuai dengan total prestasi `APPROVED` di database untuk periode tersebut.

## 5. Detailed Test Cases (Gherkin Syntax)

### Case 1: Validasi Input File di Form Lapor
**Given** Mahasiswa berada di halaman form "Laporkan Prestasi"
**When** Mahasiswa mengunggah file dengan total ukuran melebihi 20MB
**Then** Sistem harus menampilkan pesan error "Total ukuran file dokumen tidak boleh melebihi 20MB"
**And** Tombol submit tetap non-aktif atau mencegah proses upload ke R2

### Case 2: Penghapusan Prestasi Terkunci (Security)
**Given** Mahasiswa memiliki prestasi dengan status `APPROVED`
**When** Mahasiswa mencoba memicu fungsi `deletePrestasi` melalui API atau UI
**Then** Server action harus mengembalikan error "Prestasi yang sudah divalidasi tidak dapat dihapus"
**And** Data prestasi tetap ada di database

### Case 3: Deteksi Otomatis Semester
**Given** Mahasiswa memilih tanggal mulai "15 September 2024"
**When** Input tanggal selesai diisi "20 September 2024"
**Then** Field Semester harus otomatis berubah menjadi "GANJIL" (sesuai logika pola Tel-U di kode)

### Case 4: Persetujuan Prestasi oleh Admin
**Given** Terdapat data prestasi "Juara 1 Lomba Coding" dengan status `PENDING`
**When** Admin memanggil server action `validateAchievement` dengan poin `15`
**Then** Kolom `statusValidasi` di database berubah menjadi `APPROVED`
**And** Kolom `poin` di database terisi nilai `15`
**And** Mahasiswa pemilik prestasi menerima notifikasi "SUCCESS"

### Case 5: Akses Ilegal (Authorization)
**Given** Seorang user dengan role `MAHASISWA` sudah login
**When** User tersebut mencoba mengakses URL `/admin/dashboard` secara manual
**Then** Middleware harus mendeteksi ketidaksesuaian role
**And** User di-redirect kembali ke halaman `/dashboard` mahasiswa

## 6. Technical & Destructive Edge Cases
Identifikasi potensi kegagalan teknis dan skenario ekstrem:

1.  **Upload Terputus (Atomic Upload):**
    - Apa yang terjadi jika file ke-1 sukses diupload ke R2, tapi file ke-2 gagal?
    - *Analisis Kode:* Saat ini `createPrestasi` dipanggil setelah seluruh loop upload selesai. Jika salah satu gagal, `createPrestasi` tidak terpanggil. Namun, file yang sudah terlanjur di R2 akan menjadi "orphan file".
2.  **Concurrency Validation:**
    - Dua admin mencoba memvalidasi data prestasi yang sama di waktu yang hampir bersamaan.
    - *Rekomendasi UAT:* Pastikan admin kedua mendapatkan pesan error jika data sudah di-update oleh admin pertama (Optimistic Lock).
3.  **Invalid JSON Metadata:**
    - Mengirimkan payload `anggotaTim` yang bukan format array object melalui bypass frontend.
    - *Analisis Kode:* Prisma menggunakan tipe `Json?`. Perlu pengujian apakah query dashboard (rekap prodi) akan crash jika format JSON rusak.
4.  **Date Range Inconsistency:**
    - Memilih tanggal selesai yang lebih awal dari tanggal mulai.
    - *Analisis Kode:* Frontend sudah memblokir lewat `disabled` di kalender, namun Server Action perlu memvalidasi ulang untuk mencegah bypass via postman/script.
5.  **Exhausting R2 Storage:**
    - Simulasi jika storage bucket penuh atau API Key R2 dideaktivasi.
    - *Hasil yang diharapkan:* Sistem harus memberikan error yang user-friendly ("Gagal mengunggah file. Coba lagi") dan tidak membiarkan record database tersimpan tanpa bukti fisik.
