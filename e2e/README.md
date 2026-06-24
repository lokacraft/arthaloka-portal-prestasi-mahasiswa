# E2E Testing - Arthaloka Portal Prestasi Mahasiswa

Script pengujian end-to-end menggunakan **Playwright** dan **TypeScript**, mencakup seluruh skenario UAT.

## 📁 Struktur File

```
e2e/
├── helpers.ts              # Utility: login, file creation, toast assertions
├── auth-guards.spec.ts     # Login semua role + Middleware authorization (UAT Case 5)
├── mahasiswa.spec.ts       # Skenario 1, 4 + UAT Case 1, 2, 3
├── admin.spec.ts           # Skenario 2 + UAT Case 4 (Approval, Rejection, Correction)
├── wd.spec.ts              # Dashboard WD - Rekapitulasi Fakultas
├── kaprodi.spec.ts         # Dashboard Kaprodi - Data Per Program Studi
├── akreditasi.spec.ts      # Skenario 5 - Dashboard & Filter Tahun Akademik
├── edge-cases.spec.ts      # UAT Section 6 - Technical & Destructive Edge Cases
└── fixtures/               # File dummy untuk testing (auto-generated)
playwright.config.ts        # Konfigurasi Playwright
```

## ⚙️ Prerequisites

1. Install Playwright:
```bash
npm install --save-dev @playwright/test
npx playwright install chromium
```

2. Pastikan aplikasi berjalan:
```bash
npm run dev
```

3. Buat file `.env.test` di root project (atau set environment variables):
```env
# Base URL aplikasi
E2E_BASE_URL=http://localhost:3000

# Akun test untuk setiap role (sesuaikan dengan DB test Anda)
E2E_MAHASISWA_EMAIL=mahasiswa.test@telkomuniversity.ac.id
E2E_MAHASISWA_PASSWORD=TestPassword123!

E2E_ADMIN_EMAIL=admin.test@telkomuniversity.ac.id
E2E_ADMIN_PASSWORD=TestPassword123!

E2E_WD_EMAIL=wd.test@telkomuniversity.ac.id
E2E_WD_PASSWORD=TestPassword123!

E2E_KAPRODI_EMAIL=kaprodi.test@telkomuniversity.ac.id
E2E_KAPRODI_PASSWORD=TestPassword123!

E2E_AKREDITASI_EMAIL=akreditasi.test@telkomuniversity.ac.id
E2E_AKREDITASI_PASSWORD=TestPassword123!

# Jika akun menggunakan 2FA (TOTP)
# E2E_ADMIN_TOTP=123456  # Hanya untuk static TOTP di test env
```

## 🚀 Cara Menjalankan

```bash
# Jalankan semua test
npx playwright test

# Jalankan dengan UI mode (interaktif)
npx playwright test --ui

# Jalankan satu file saja
npx playwright test e2e/mahasiswa.spec.ts

# Jalankan dengan headed (tampilkan browser)
npx playwright test --headed

# Debug mode
npx playwright test --debug

# Lihat HTML report
npx playwright show-report
```

## 📋 Cakupan Skenario UAT

| File | Skenario | Kasus |
|------|----------|-------|
| `auth-guards.spec.ts` | Login semua role | UAT Case 5, Login gagal, Middleware |
| `mahasiswa.spec.ts` | Skenario 1, 4 | UAT Case 1 (>20MB), Case 2 (Locked Delete), Case 3 (Semester Auto) |
| `admin.spec.ts` | Skenario 2 | UAT Case 4 (Approval+Poin), Reject, Koreksi, Notifikasi |
| `wd.spec.ts` | Dashboard WD | Rekapitulasi Fakultas, Read-only, Otorisasi |
| `kaprodi.spec.ts` | Dashboard Kaprodi | Data per Prodi, Edge Case 3 (JSON), Otorisasi |
| `akreditasi.spec.ts` | Skenario 5 | Filter Tahun, Rekap, Integritas Angka, Otorisasi |
| `edge-cases.spec.ts` | UAT Section 6 | Edge Case 1-5, Date Inconsistency, 404 Handling |

## ⚠️ Catatan Penting

### Data-testid
Script ini menggunakan selector `data-testid` untuk elemen kritis. Jika selector tidak ditemukan,
script fallback ke selector berbasis teks/role. Pastikan elemen berikut memiliki `data-testid`:
- `switch-tim` — Toggle switch Tim/Individu di form Lapor
- `btn-notification` — Tombol notifikasi di navbar
- `notification-dropdown` — Dropdown notifikasi
- `filter-tahun-akademik` — Filter tahun di dashboard Akreditasi
- `total-prestasi` — Counter total prestasi
- `anggota-tim-item` — Item anggota tim di detail verifikasi

### Environment Test
> ⚠️ **PENTING**: Jalankan test HANYA di environment/database test yang terpisah dari production.
> Test ini akan membuat data (prestasi, notifikasi) di database yang terhubung ke aplikasi.

### Upload File
File dummy untuk testing di-generate otomatis di `e2e/fixtures/`. Folder ini sudah di-exclude dari Git via `.gitignore`.
