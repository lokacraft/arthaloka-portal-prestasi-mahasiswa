# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: admin.spec.ts >> 🛡️ Skenario Admin >> Dashboard Admin >> Admin dapat mengakses semua menu navigasi utama
- Location: e2e\admin.spec.ts:39:9

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('link', { name: /notifikasi/i }).first()
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByRole('link', { name: /notifikasi/i }).first()

```

```yaml
- heading "Portal Data Prestasi" [level=2]
- text: S1 Teknik Industri
- list:
  - listitem:
    - link "Dashboard Admin":
      - /url: /admin/dashboard
  - listitem:
    - link "Antrean Verifikasi":
      - /url: /admin/verifikasi
  - listitem:
    - link "Kelola NM(TS)":
      - /url: /admin/nmts
  - listitem:
    - link "Indikator Akreditasi":
      - /url: /admin/indikator
- list:
  - listitem:
    - button "Logout"
- main:
  - button "Toggle Sidebar":
    - img
    - text: Toggle Sidebar
  - button "7"
  - button "admin test admin.test@telkomuniversity.ac.id"
  - main:
    - heading "Dashboard Admin" [level=1]
    - paragraph: Kelola dan verifikasi prestasi mahasiswa S1 Teknik Industri
    - text: Antrean Pending
    - heading "1" [level=3]
    - text: Menunggu verifikasi Total Diverifikasi Bulan Ini
    - heading "3" [level=3]
    - text: Bulan Mei Total Ditolak
    - heading "0" [level=3]
    - text: Seluruh waktu
    - link "Mulai Verifikasi 1 pengajuan menunggu verifikasi Anda":
      - /url: /admin/verifikasi
      - heading "Mulai Verifikasi" [level=3]
      - paragraph: 1 pengajuan menunggu verifikasi Anda
    - heading "Kelola Mahasiswa" [level=3]
    - paragraph: Fitur manajemen data master mahasiswa
    - heading "Aktivitas Terkini" [level=2]
    - paragraph: Verifikasi yang baru saja Anda lakukan (24 jam terakhir)
    - text: Valid
    - heading "test 3" [level=4]
    - paragraph: "Mahasiswa: mahasiswa-test"
    - text: 2 menit yang lalu Valid
    - heading "test 2" [level=4]
    - paragraph: "Mahasiswa: ahadan fauzan"
    - text: 4 menit yang lalu Valid
    - heading "test 1" [level=4]
    - paragraph: "Mahasiswa: ahadan fauzan"
    - text: 5 menit yang lalu
    - heading "Info Sistem" [level=4]
    - paragraph: Sistem sinkron dengan database terbaru. Gunakan menu Verifikasi untuk memproses pengajuan yang masuk.
- region "Notifications alt+T"
- alert
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | import { loginAs } from './helpers';
  3   | 
  4   | /**
  5   |  * UAT - Skenario Admin
  6   |  *
  7   |  * Mencakup:
  8   |  * - Skenario 2: Validasi Admin (Approval)
  9   |  * - UAT Case 4: Persetujuan prestasi dengan poin
  10  |  * - Skenario Reject: Penolakan pengajuan dengan catatan
  11  |  * - Koreksi Data administratif
  12  |  * - Skenario 4 (lanjutan): Admin cek data tim pada detail verifikasi
  13  |  * - Manajemen data master (navigasi)
  14  |  * - Dashboard admin menampilkan statistik
  15  |  * - Notifikasi admin saat ada pengajuan baru
  16  |  */
  17  | 
  18  | test.describe('🛡️ Skenario Admin', () => {
  19  | 
  20  |   test.beforeEach(async ({ page }) => {
  21  |     await loginAs(page, 'admin');
  22  |   });
  23  | 
  24  |   // ──────────────────────────────────────────────────────────────────────────
  25  |   // Dashboard Admin
  26  |   // ──────────────────────────────────────────────────────────────────────────
  27  | 
  28  |   test.describe('Dashboard Admin', () => {
  29  | 
  30  |     test('Dashboard admin ter-render dengan elemen statistik utama', async ({ page }) => {
  31  |       await expect(page).toHaveURL(/\/admin\/dashboard/);
  32  |       await expect(page.locator('h1')).toBeVisible();
  33  | 
  34  |       // Dashboard harus memuat tanpa error 500 atau loading terus-menerus
  35  |       await page.waitForLoadState('networkidle');
  36  |       await expect(page.locator('body')).not.toContainText(/internal server error|500/i);
  37  |     });
  38  | 
  39  |     test('Admin dapat mengakses semua menu navigasi utama', async ({ page }) => {
  40  |       // Menu Verifikasi
  41  |       const verifikasiLink = page.getByRole('link', { name: /verifikasi/i }).first();
  42  |       await expect(verifikasiLink).toBeVisible();
  43  | 
  44  |       // Menu Notifikasi
  45  |       const notifLink = page.getByRole('link', { name: /notifikasi/i }).first();
> 46  |       await expect(notifLink).toBeVisible();
      |                               ^ Error: expect(locator).toBeVisible() failed
  47  |     });
  48  | 
  49  |   });
  50  | 
  51  |   // ──────────────────────────────────────────────────────────────────────────
  52  |   // Skenario 2 + UAT Case 4: Validasi Admin (Approval)
  53  |   // ──────────────────────────────────────────────────────────────────────────
  54  | 
  55  |   test.describe('Skenario 2 + UAT Case 4 - Validasi Admin (Approval)', () => {
  56  | 
  57  |     test('Halaman antrean verifikasi memuat daftar pengajuan PENDING', async ({ page }) => {
  58  |       await page.goto('/admin/verifikasi');
  59  |       await expect(page.getByText('Antrean Verifikasi')).toBeVisible();
  60  |       await expect(page.getByText(/Pengajuan Pending/i)).toBeVisible();
  61  | 
  62  |       // Halaman harus memuat tanpa error
  63  |       await page.waitForLoadState('networkidle');
  64  |       await expect(page.locator('body')).not.toContainText(/error|500/i);
  65  |     });
  66  | 
  67  |     test('Admin dapat membuka detail pengajuan PENDING dari antrean', async ({ page }) => {
  68  |       await page.goto('/admin/verifikasi');
  69  |       await page.waitForLoadState('networkidle');
  70  | 
  71  |       // Klik link pengajuan pertama (jika ada)
  72  |       const firstItem = page.locator('a[href*="/admin/verifikasi/"]').first();
  73  |       if (await firstItem.isVisible()) {
  74  |         await firstItem.click();
  75  |         await expect(page).toHaveURL(/\/admin\/verifikasi\/.+/);
  76  |         await expect(page.getByText('Detail Verifikasi Prestasi')).toBeVisible();
  77  |       }
  78  |     });
  79  | 
  80  |     test('Admin dapat menyetujui (VALID) pengajuan PENDING dengan catatan (UAT Case 4)', async ({ page }) => {
  81  |       await page.goto('/admin/verifikasi');
  82  |       await page.waitForLoadState('networkidle');
  83  | 
  84  |       const firstItem = page.locator('a[href*="/admin/verifikasi/"]').first();
  85  |       if (!(await firstItem.isVisible())) {
  86  |         test.skip(true, 'Tidak ada pengajuan PENDING untuk divalidasi');
  87  |         return;
  88  |       }
  89  | 
  90  |       await firstItem.click();
  91  |       await expect(page.getByText('Detail Verifikasi Prestasi')).toBeVisible();
  92  | 
  93  |       // Tombol VALID harus terlihat untuk pengajuan PENDING
  94  |       const validBtn = page.getByRole('button', { name: /valid/i }).first();
  95  |       await expect(validBtn).toBeVisible({ timeout: 5000 });
  96  |       await validBtn.click();
  97  | 
  98  |       // Dialog konfirmasi validasi muncul
  99  |       await expect(page.getByText('Konfirmasi Validasi')).toBeVisible({ timeout: 5000 });
  100 | 
  101 |       // Isi catatan (opsional)
  102 |       const catatanTextarea = page.locator('textarea[placeholder*="catatan"]');
  103 |       if (await catatanTextarea.isVisible()) {
  104 |         await catatanTextarea.fill('Prestasi telah diverifikasi dan disetujui oleh admin - E2E Test');
  105 |       }
  106 | 
  107 |       // Klik Setujui
  108 |       await page.getByRole('button', { name: /setujui/i }).click();
  109 | 
  110 |       // Toast sukses harus muncul
  111 |       const successToast = page.locator('[data-sonner-toast]').filter({
  112 |         hasText: /berhasil divalidasi|berhasil/i,
  113 |       });
  114 |       await expect(successToast).toBeVisible({ timeout: 15000 });
  115 |     });
  116 | 
  117 |     test('Admin dapat menolak (DITOLAK) pengajuan PENDING dengan alasan wajib', async ({ page }) => {
  118 |       await page.goto('/admin/verifikasi');
  119 |       await page.waitForLoadState('networkidle');
  120 | 
  121 |       const firstItem = page.locator('a[href*="/admin/verifikasi/"]').first();
  122 |       if (!(await firstItem.isVisible())) {
  123 |         test.skip(true, 'Tidak ada pengajuan PENDING untuk ditolak');
  124 |         return;
  125 |       }
  126 | 
  127 |       await firstItem.click();
  128 |       await expect(page.getByText('Detail Verifikasi Prestasi')).toBeVisible();
  129 | 
  130 |       // Klik DITOLAK
  131 |       const rejectBtn = page.getByRole('button', { name: /ditolak/i }).first();
  132 |       await expect(rejectBtn).toBeVisible({ timeout: 5000 });
  133 |       await rejectBtn.click();
  134 | 
  135 |       // Dialog alasan penolakan muncul
  136 |       await expect(page.getByText('Alasan Penolakan')).toBeVisible({ timeout: 5000 });
  137 | 
  138 |       // Coba submit tanpa mengisi alasan → harus error
  139 |       await page.getByRole('button', { name: /tolak pengajuan/i }).click();
  140 |       const errorToast = page.locator('[data-sonner-toast]');
  141 |       await expect(errorToast).toBeVisible({ timeout: 5000 });
  142 |       await expect(errorToast).toContainText(/alasan|harus diisi/i);
  143 | 
  144 |       // Isi alasan penolakan
  145 |       const alasanTextarea = page.locator('textarea[placeholder*="Bukti"]').or(
  146 |         page.locator('textarea').last()
```