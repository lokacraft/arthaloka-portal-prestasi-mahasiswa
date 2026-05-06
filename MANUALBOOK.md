# 📘 Manual Book — Portal Data Prestasi Mahasiswa
**S1 Teknik Industri | Versi 1.0**

---

## Daftar Isi

1. [Gambaran Umum Sistem](#1-gambaran-umum-sistem)
2. [Teknologi & Infrastruktur](#2-teknologi--infrastruktur)
3. [Struktur Database (Schema)](#3-struktur-database-schema)
4. [Role & Hak Akses](#4-role--hak-akses)
5. [Struktur Routing Aplikasi](#5-struktur-routing-aplikasi)
6. [Modul Mahasiswa](#6-modul-mahasiswa)
7. [Modul Admin](#7-modul-admin)
8. [Modul Akreditasi](#8-modul-akreditasi)
9. [Modul Wakil Dekan (WD)](#9-modul-wakil-dekan-wd)
10. [Sistem Notifikasi](#10-sistem-notifikasi)
11. [Sistem Upload File (Cloudflare R2)](#11-sistem-upload-file-cloudflare-r2)
12. [Alur Kerja Lengkap (End-to-End)](#12-alur-kerja-lengkap-end-to-end)
13. [Enum & Konstanta Sistem](#13-enum--konstanta-sistem)
14. [Panduan Deploy & Environment Variables](#14-panduan-deploy--environment-variables)

---

## 1. Gambaran Umum Sistem

**Portal Data Prestasi Mahasiswa** adalah aplikasi web manajemen pencatatan, verifikasi, dan pelaporan prestasi mahasiswa di Program Studi S1 Teknik Industri. Sistem ini menghubungkan empat jenis pengguna dalam satu platform terpadu:

| Peran | Fungsi Utama |
|---|---|
| **Mahasiswa** | Melaporkan dan memantau status pengajuan prestasi |
| **Admin** | Memverifikasi data prestasi yang masuk |
| **Akreditasi** | Menganalisis data rekap untuk keperluan akreditasi LAM Teknik |
| **Wakil Dekan (WD)** | Melihat ringkasan eksekutif dan tren prestasi |

### Fitur Utama
- Pengajuan prestasi multi-file (sertifikat & bukti pendukung, maks. 10 file/jenis)
- Verifikasi dua arah dengan sistem notifikasi otomatis
- Dashboard indikator akreditasi berbasis rentang 5 tahun
- Ekspor data ke Excel (.xlsx) dengan filter lengkap
- Manajemen data NM(TS) dan target rasio akreditasi
- Sistem notifikasi real-time

---

## 2. Teknologi & Infrastruktur

| Komponen | Teknologi |
|---|---|
| **Framework** | Next.js 16 (App Router, Turbopack) |
| **Bahasa** | TypeScript |
| **Database** | PostgreSQL (via Supabase) |
| **ORM** | Prisma 7 |
| **Autentikasi** | better-auth |
| **UI Library** | Shadcn UI + Base UI |
| **Styling** | Tailwind CSS v4 |
| **File Storage** | Cloudflare R2 |
| **Deployment** | Vercel |
| **Chart** | Recharts |
| **Excel Export** | SheetJS (xlsx) |
| **Date Utility** | date-fns (locale: id-ID) |
| **Toast Notif** | Sonner |

---

## 3. Struktur Database (Schema)

### Model Utama

#### `User`
Tabel pengguna inti dari better-auth. Setiap user dapat memiliki role ganda via `UserRole`.

| Field | Tipe | Keterangan |
|---|---|---|
| `id` | String | Primary key |
| `name` | String | Nama lengkap |
| `email` | String | Unik, login credential |
| `emailVerified` | Boolean | Status verifikasi email |
| `image` | String? | URL foto profil |

#### `Mahasiswa`
Profil tambahan untuk pengguna ber-role MAHASISWA.

| Field | Tipe | Keterangan |
|---|---|---|
| `nim` | String | Nomor Induk Mahasiswa (unik) |
| `tempatLahir` | String? | — |
| `tanggalLahir` | DateTime? | — |
| `jenisKelamin` | Enum | LAKI_LAKI / PEREMPUAN |
| `programStudiId` | String? | Relasi ke ProgramStudi |

#### `Prestasi` *(Model Utama Transaksi)*

| Field | Tipe | Keterangan |
|---|---|---|
| `angkatan` | Int | Angkatan mahasiswa saat kegiatan |
| `tahun` | Int | Tahun pelaksanaan |
| `semester` | Enum | GANJIL / GENAP |
| `namaPrestasi` | String | Nama kegiatan/lomba |
| `jenisLomba` | Enum | BELMAWA / MANDIRI |
| `namaPenyelenggara` | String | Penyelenggara kegiatan |
| `tanggalMulai` | DateTime | Tanggal mulai kegiatan |
| `tanggalSelesai` | DateTime | Tanggal selesai kegiatan |
| `hasilCapaian` | String | Juara 1, Juara 2, dll |
| `provinsi` | String? | Lokasi provinsi |
| `kota` | String? | Lokasi kota |
| `namaLokasi` | String? | Nama venue spesifik |
| `tipePartisipasi` | Enum | INDIVIDU / TIM |
| `anggotaTim` | Json? | Array `{nim, nama, angkatan}` |
| `sertifikatUrls` | Json? | Array URL sertifikat (maks 10) |
| `buktiBuktiUrls` | Json? | Array URL bukti (maks 10) |
| `keterangan` | String? | Catatan tambahan |
| `statusValidasi` | Enum | PENDING / APPROVED / REJECTED |
| `validatorId` | String? | ID admin yang memvalidasi |
| `catatanValidasi` | String? | Catatan dari admin |
| `tanggalValidasi` | DateTime? | Tanggal divalidasi |

#### `NmTs`
Data jumlah mahasiswa aktif per tahun sasaran, untuk perhitungan rasio akreditasi.

| Field | Tipe |
|---|---|
| `tahun` | Int (unik) |
| `jumlahMahasiswa` | Int |

#### `TargetAkreditasi`
Target rasio prestasi untuk indikator LAM Teknik.

| Kode | Nama | Default |
|---|---|---|
| `RI` | Target Rasio Internasional | 0.2% |
| `RN` | Target Rasio Nasional | 2.0% |
| `RW` | Target Rasio Wilayah/Lokal | 4.0% |

#### `Notification`
Notifikasi sistem untuk semua pengguna.

| Field | Tipe | Keterangan |
|---|---|---|
| `type` | String | INFO / SUCCESS / WARNING / ERROR |
| `isRead` | Boolean | Status baca |
| `linkUrl` | String? | URL navigasi saat diklik |

---

## 4. Role & Hak Akses

Sistem menggunakan tabel `Role` dan `UserRole` untuk manajemen hak akses. Satu pengguna bisa memiliki lebih dari satu role.

### Daftar Role

| Role | Nama DB | Deskripsi |
|---|---|---|
| **Mahasiswa** | `MAHASISWA` | Pengguna umum, hanya bisa melihat & mengelola datanya sendiri |
| **Admin** | `ADMIN` | Dapat memverifikasi, mengoreksi, dan menyetujui/menolak prestasi |
| **Akreditasi** | `AKREDITASI` | Akses baca ke seluruh data rekap dan fitur ekspor |
| **Wakil Dekan** | `WD` | Akses read-only ke dashboard eksekutif |

### Matriks Hak Akses

| Fitur | Mahasiswa | Admin | Akreditasi | WD |
|---|:---:|:---:|:---:|:---:|
| Laporkan Prestasi | ✅ | ❌ | ❌ | ❌ |
| Lihat Riwayat Sendiri | ✅ | ❌ | ❌ | ❌ |
| Hapus Pengajuan (PENDING) | ✅ | ❌ | ❌ | ❌ |
| Antrean Verifikasi | ❌ | ✅ | ❌ | ❌ |
| Setujui/Tolak Prestasi | ❌ | ✅ | ❌ | ❌ |
| Koreksi Data Prestasi | ❌ | ✅ | ❌ | ❌ |
| Kelola NM(TS) | ❌ | ✅ | ❌ | ❌ |
| Indikator Akreditasi | ❌ | ✅ | ✅ | ❌ |
| Rekap 5 Tahun | ❌ | ❌ | ✅ | ❌ |
| Ekspor Excel | ❌ | ✅ | ✅ | ❌ |
| Dashboard Eksekutif | ❌ | ❌ | ❌ | ✅ |
| Lihat Notifikasi | ✅ | ✅ | ❌ | ❌ |

---

## 5. Struktur Routing Aplikasi

Aplikasi menggunakan Next.js App Router dengan Route Groups untuk memisahkan layout per-role.

```
src/app/
├── page.tsx                    → Halaman landing / redirect
├── (auth)/
│   ├── sign-in/                → /sign-in
│   └── sign-up/                → /sign-up
│
├── (mahasiswa)/                → Layout Mahasiswa
│   ├── dashboard/              → /dashboard
│   ├── lapor/                  → /lapor
│   ├── riwayat/                → /riwayat
│   ├── detail/[id]/            → /detail/:id
│   ├── notifikasi/             → /notifikasi
│   └── pengaturan/             → /pengaturan
│
├── (admin)/                    → Layout Admin
│   └── admin/
│       ├── dashboard/          → /admin/dashboard
│       ├── verifikasi/         → /admin/verifikasi
│       │   └── [id]/           → /admin/verifikasi/:id
│       ├── nmts/               → /admin/nmts
│       ├── indikator/          → /admin/indikator
│       └── notifikasi/         → /admin/notifikasi
│
├── (akreditasi)/               → Layout Akreditasi
│   └── akreditasi/
│       ├── dashboard/          → /akreditasi/dashboard
│       ├── rekap/              → /akreditasi/rekap
│       └── notifikasi/         → /akreditasi/notifikasi
│
└── (wd)/                       → Layout WD
    └── wd1/
        ├── dashboard/          → /wd1/dashboard
        └── notifikasi/         → /wd1/notifikasi
```

---

## 6. Modul Mahasiswa

### 6.1 Dashboard (`/dashboard`)
Halaman utama setelah login. Menampilkan:
- **Statistik Pengajuan**: Kartu ringkasan jumlah prestasi PENDING, APPROVED, dan REJECTED
- **Tabel Riwayat Terkini**: 10 prestasi terbaru dengan status badge berwarna
- **Pagination**: Navigasi halaman data

**Data yang ditampilkan per baris:**
- Nama Prestasi
- Kategori & Tingkat
- Tahun Kegiatan
- Tanggal Mulai (diformat: d MMMM yyyy)
- Status Validasi (badge warna: abu=pending, hijau=approved, merah=rejected)

### 6.2 Laporkan Prestasi (`/lapor`)
Form pengajuan prestasi baru dengan validasi lengkap. 

#### Alur Pengisian Form:
**Bagian 1 — Identitas**
- **NIM** (auto-fill dari data mahasiswa login, tidak bisa diubah)
- **Angkatan** (dropdown pilih tahun, 7 tahun terakhir)
- **Tahun Kegiatan** (dropdown, 10 tahun terakhir)
- **Semester** (Radio: Ganjil / Genap)

**Bagian 2 — Detail Kegiatan**
- **Kategori Prestasi** (Radio dari data master `KategoriPrestasi`)
- **Jenis Lomba** (Radio: BELMAWA / MANDIRI)
- **Tingkat / Level** (Radio dari data master `TingkatPrestasi`)
- **Nama Kegiatan/Lomba** (text input)
- **Nama Penyelenggara** (text input)
- **Hasil / Capaian** (Dropdown: Juara 1, Juara 2, Juara 3, Lainnya + input custom jika Lainnya)

**Bagian 3 — Waktu & Tempat**
- **Tanggal Mulai** (date picker kalender)
- **Tanggal Selesai** (date picker kalender)
- **Provinsi** (dropdown dari API wilayah Indonesia)
- **Kota/Kabupaten** (dropdown dinamis berdasarkan provinsi)
- **Nama Lokasi** (opsional, nama venue spesifik)

**Bagian 4 — Tipe Partisipasi**
- **Tipe**: Toggle Individu / Tim
- Jika **Tim**: Tabel input anggota (NIM, Nama, Angkatan) — bisa tambah/hapus baris

**Bagian 5 — Berkas**
- **Sertifikat**: Upload hingga 10 file (PDF/gambar)
- **Bukti Pendukung**: Upload hingga 10 file (PDF/gambar)

**Bagian 6 — Keterangan** (opsional)

> **Setelah submit:** Muncul dialog konfirmasi sebelum data dikirim. Jika dikonfirmasi, data disimpan dengan status `PENDING` dan notifikasi dikirim ke seluruh admin.

### 6.3 Riwayat Pengajuan (`/riwayat`)
Daftar semua prestasi yang pernah diajukan.

**Fitur Filter:**
- Pencarian by nama prestasi
- Filter by tahun
- Filter by status (Semua / Pending / Disetujui / Ditolak)

**Aksi per item:**
- **Lihat Detail**: Navigasi ke `/detail/:id`
- **Hapus**: Hanya bisa untuk prestasi ber-status PENDING

### 6.4 Detail Pengajuan (`/detail/:id`)
Halaman detail read-only satu rekam prestasi.

**Informasi yang ditampilkan:**
- Header: Nama prestasi, penyelenggara, badge status
- Detail: Angkatan, tahun, semester, kategori, jenis lomba, tingkat, capaian, tanggal pelaksanaan, tempat, tipe partisipasi
- Side panel: Daftar link sertifikat, daftar link bukti pendukung, daftar anggota tim (jika ada)
- Catatan Validator (jika sudah diverifikasi)

### 6.5 Pengaturan Akun (`/pengaturan`)
Halaman profil pengguna untuk mengubah nama dan foto profil.

---

## 7. Modul Admin

### 7.1 Dashboard Admin (`/admin/dashboard`)
Ringkasan statistik keseluruhan sistem.

**Kartu Statistik:**
- Total prestasi terdaftar
- Prestasi PENDING (menunggu verifikasi)
- Prestasi APPROVED
- Prestasi REJECTED

**Tabel Aktivitas Terkini:**
Daftar pengajuan terbaru lintas semua mahasiswa.

### 7.2 Antrean Verifikasi (`/admin/verifikasi`)
Daftar semua prestasi ber-status PENDING.

**Informasi per card:**
- Nama kegiatan/lomba
- Status badge
- Nama mahasiswa, NIM, Angkatan
- Badge Jenis Lomba (BELMAWA/MANDIRI) — warna oranye
- Kategori, Tingkat, Tahun-Semester
- Tombol "Periksa" → navigasi ke detail verifikasi

### 7.3 Detail Verifikasi (`/admin/verifikasi/:id`)
Halaman full-detail untuk memverifikasi satu pengajuan.

**Panel Informasi:**
- Semua data identitas dan detail prestasi
- Preview/link ke semua file sertifikat & bukti pendukung
- Data anggota tim (jika ada)

**Aksi Admin:**

| Aksi | Hasil |
|---|---|
| **Setujui** | Status → APPROVED, notifikasi dikirim ke mahasiswa |
| **Tolak** | Status → REJECTED, input wajib catatan alasan, notifikasi dikirim |
| **Koreksi Data** | Form inline untuk mengubah data tanpa mengubah status |

> **Catatan:** Setelah divalidasi (APPROVED/REJECTED), data tidak bisa dihapus oleh mahasiswa.

### 7.4 Kelola NM(TS) (`/admin/nmts`)
Manajemen data jumlah mahasiswa aktif per tahun sasaran (NM(TS) = Number of Mahasiswa Tahun Sasaran), digunakan sebagai penyebut dalam perhitungan rasio akreditasi.

**Fitur:**
- Tambah/edit data jumlah mahasiswa per tahun
- Lihat histori data NM(TS)

### 7.5 Indikator Akreditasi (`/admin/indikator`)
Dashboard kalkulasi indikator LAM Teknik berbasis data prestasi.

**Filter:**
- Tahun Sasaran (dropdown)
- Rentang Analisis: 5 Tahun Terakhir (tetap)
- Kategori Prestasi (Semua / Akademik / Non-Akademik)

**Kartu Indikator:**

| Indikator | Formula | Target Default |
|---|---|---|
| **RI** (Rasio Internasional) | NI / NM(TS) × 100% | ≥ 0.2% |
| **RN** (Rasio Nasional) | NN / NM(TS) × 100% | ≥ 2.0% |
| **RW** (Rasio Wilayah) | NW / NM(TS) × 100% | ≥ 4.0% |

- NI = jumlah prestasi tingkat Internasional
- NN = jumlah prestasi tingkat Nasional  
- NW = jumlah prestasi tingkat Wilayah/Lokal/Provinsi

**Fitur Tambahan:**
- Edit target RI/RN/RW (disimpan ke database)
- Grafik distribusi prestasi per kategori (bar chart)
- **Ekspor Excel** dengan kolom: ID, Tahun, Angkatan, NIM, Nama Kegiatan, Jenis Lomba, Kategori, Tingkat, Capaian, Tanggal Mulai, Tanggal Selesai, URL Sertifikat

---

## 8. Modul Akreditasi

### 8.1 Dashboard Akreditasi (`/akreditasi/dashboard`)
Analisis indikator akreditasi dari sudut pandang tim akreditasi.

**Filter:**
- Tahun Sasaran
- Rentang: 5 Tahun Terakhir
- Kategori (Semua / Akademik / Non-Akademik)
- Level/Tingkat

**Visualisasi:**
- Kartu rasio RI/RN/RW dengan indikator status (Memenuhi / Belum Memenuhi)
- **Grafik Tren (Line Chart)**: Tren jumlah prestasi per tahun, dipecah per level (Internasional, Nasional, Wilayah)

### 8.2 Rekap 5 Tahun (`/akreditasi/rekap`)
Tabel data lengkap seluruh prestasi yang telah APPROVED.

**Filter:**
- Tahun (spesifik satu tahun)
- Rentang tahun (start year - end year)
- Kategori
- Level/Tingkat
- Angkatan mahasiswa

**Kolom Tabel:**
No | Tahun | Semester | Nama Kegiatan | Jenis Lomba | Penyelenggara | Mahasiswa (NIM) | Angkatan | Kategori | Level | Aksi (Lihat Detail)

**Ekspor Excel** dengan kolom lengkap termasuk:
- Jenis Lomba, Angkatan
- Tanggal Mulai & Tanggal Selesai
- URL Sertifikat (array digabung dengan koma)

---

## 9. Modul Wakil Dekan (WD)

### 9.1 Dashboard Executive (`/wd1/dashboard`)
Ringkasan eksekutif untuk pimpinan.

**Filter:**
- Tahun Sasaran
- Rentang Waktu: 5 Tahun Terakhir

**Konten:**
- Kartu KPI utama: Total prestasi, Rasio indikator akreditasi
- Grafik tren prestasi (line/bar chart)
- Highlight pencapaian terbaik

> Dashboard ini bersifat **read-only**, tidak ada aksi modifikasi data.

---

## 10. Sistem Notifikasi

### Alur Notifikasi Otomatis

| Trigger | Penerima | Tipe | Pesan |
|---|---|---|---|
| Mahasiswa submit pengajuan baru | Semua Admin | INFO | "Ada pengajuan baru dari [Nama] — [Nama Prestasi]" |
| Admin menyetujui prestasi | Mahasiswa | SUCCESS | "Prestasi '[Nama]' telah disetujui" |
| Admin menolak prestasi | Mahasiswa | ERROR | "Prestasi '[Nama]' ditolak. Catatan: [catatan]" |
| Admin menyetujui (log) | Admin yang validasi | INFO | "Anda telah menyetujui prestasi '[Nama]'" |
| Admin menolak (log) | Admin yang validasi | WARNING | "Anda telah menolak prestasi '[Nama]'" |

### Komponen Notifikasi di Topbar
- Icon lonceng dengan **badge merah** jumlah notifikasi belum dibaca
- Popover menampilkan 5 notifikasi terbaru
- Klik notifikasi → navigasi ke `linkUrl` + tandai dibaca
- Link "Lihat Semua Notifikasi" → halaman `/notifikasi`

### Tipe Notifikasi
| Tipe | Ikon | Warna |
|---|---|---|
| `SUCCESS` | CheckCircle | Hijau |
| `ERROR` | XCircle | Merah |
| `WARNING` | AlertCircle | Kuning |
| `INFO` | Bell | Biru |

---

## 11. Sistem Upload File (Cloudflare R2)

### Konfigurasi
File disimpan di Cloudflare R2 Object Storage. Setiap file diberi nama unik berbasis timestamp + random string.

### Folder Struktur di R2
```
bucket/
├── sertifikat/    → File sertifikat prestasi
└── bukti/         → File bukti pendukung
```

### Batasan Upload
| Parameter | Nilai |
|---|---|
| Maks file per jenis | 10 file |
| Format yang didukung | PDF, JPG, PNG, dan format gambar umum |

### Environment Variables yang Dibutuhkan
```env
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=
R2_PUBLIC_URL=
```

---

## 12. Alur Kerja Lengkap (End-to-End)

```
[Mahasiswa]
    │
    ▼
Isi Form Prestasi → Upload Sertifikat/Bukti → Konfirmasi Submit
    │
    ▼
Database: Prestasi [PENDING] ← ─ ─ Notifikasi ke semua Admin
    │
    ▼
[Admin] Buka Antrean Verifikasi
    │
    ├── Koreksi Data (jika ada kesalahan) → Data diperbarui
    │
    ├── SETUJUI ──► Prestasi [APPROVED] ─► Notifikasi SUCCESS ke Mahasiswa
    │                                    ─► Data masuk ke Rekap Akreditasi
    │
    └── TOLAK ───► Prestasi [REJECTED] ─► Notifikasi ERROR ke Mahasiswa
                                        ─► Mahasiswa bisa lapor ulang
    │
    ▼
[Akreditasi/WD] Membaca data rekap & dashboard
```

---

## 13. Enum & Konstanta Sistem

### `StatusValidasi`
| Nilai | Deskripsi | Badge Warna |
|---|---|---|
| `PENDING` | Menunggu verifikasi admin | Kuning |
| `APPROVED` | Disetujui | Hijau |
| `REJECTED` | Ditolak | Merah |

### `Semester`
| Nilai | Deskripsi |
|---|---|
| `GANJIL` | Semester 1, 3, 5, 7 |
| `GENAP` | Semester 2, 4, 6, 8 |

### `TipePartisipasi`
| Nilai | Deskripsi |
|---|---|
| `INDIVIDU` | Lomba perorangan |
| `TIM` | Lomba berkelompok (wajib isi anggota tim) |

### `JenisLomba`
| Nilai | Deskripsi |
|---|---|
| `BELMAWA` | Lomba yang diselenggarakan/difasilitasi Belmawa Kemendikbud |
| `MANDIRI` | Lomba yang diikuti atas inisiatif sendiri/prodi |

### `JenisKelamin`
| Nilai | Deskripsi |
|---|---|
| `LAKI_LAKI` | Laki-laki |
| `PEREMPUAN` | Perempuan |

### Hasil/Capaian (Default Options)
- Juara 1
- Juara 2
- Juara 3
- Lainnya (input manual)

---

## 14. Panduan Deploy & Environment Variables

### Environment Variables Lengkap

```env
# Database (Supabase PostgreSQL)
DATABASE_URL="postgresql://..."

# Better Auth
BETTER_AUTH_SECRET="your-secret-key"
BETTER_AUTH_URL="https://your-domain.vercel.app"

# Cloudflare R2
R2_ACCOUNT_ID="your-account-id"
R2_ACCESS_KEY_ID="your-access-key"
R2_SECRET_ACCESS_KEY="your-secret-key"
R2_BUCKET_NAME="your-bucket-name"
R2_PUBLIC_URL="https://pub-xxx.r2.dev"
```

### Perintah Deployment

```bash
# 1. Generate Prisma Client
npx prisma generate

# 2. Sync database schema
npx prisma db push

# 3. Build production
npm run build

# 4. (Otomatis di Vercel) Start server
npm start
```

### Checklist Sebelum Deploy
- [ ] Semua env variables sudah diisi di Vercel dashboard
- [ ] Database (Supabase) sudah bisa diakses dari Vercel (non-pooling URL)
- [ ] Cloudflare R2 CORS sudah dikonfigurasi untuk domain Vercel
- [ ] `npx prisma generate` dijalankan sebelum build
- [ ] `npm run build` berhasil tanpa error TypeScript

---

## Catatan Teknis Penting

### Navigasi Sidebar per Role
| Role | Menu |
|---|---|
| Mahasiswa | Dashboard, Laporkan Prestasi, Riwayat Pengajuan |
| Admin | Dashboard Admin, Antrean Verifikasi, Kelola NM(TS), Indikator Akreditasi |
| Akreditasi | Dashboard Akreditasi, Rekap 5 Tahun |
| WD | Dashboard Executive |

### Pola Autentikasi Layout
Setiap Route Group memiliki `layout.tsx` server component yang:
1. Mengambil session dari `better-auth`
2. Mengecek role via `prisma.userRole`
3. Redirect ke `/sign-in` jika tidak login
4. Redirect ke `/dashboard` jika role tidak sesuai

### Komponen UI Utama
- **Topbar**: Menampilkan nama & email user, notifikasi bell, dropdown profil + logout
- **AppSidebar**: Navigasi utama per role, highlight menu aktif
- **LaporForm**: Form pengajuan prestasi (Client Component)
- **DetailVerifikasiContent**: Panel verifikasi admin (Client Component)

---

*Dokumen ini dibuat otomatis berdasarkan analisis codebase. Versi: 1.0 | Tanggal: April 2026*
