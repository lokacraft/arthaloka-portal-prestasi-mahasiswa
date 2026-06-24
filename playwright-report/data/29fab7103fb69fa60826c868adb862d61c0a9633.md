# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: admin.spec.ts >> 🛡️ Skenario Admin >> Skenario 2 + UAT Case 4 - Validasi Admin (Approval) >> Halaman antrean verifikasi memuat daftar pengajuan PENDING
- Location: e2e\admin.spec.ts:57:9

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('Antrean Verifikasi')
Expected: visible
Error: strict mode violation: getByText('Antrean Verifikasi') resolved to 2 elements:
    1) <span class="font-medium">Antrean Verifikasi</span> aka getByRole('link', { name: 'Antrean Verifikasi' })
    2) <h1 class="text-[28px] font-bold text-[#1a1a1a] tracking-tight">Antrean Verifikasi</h1> aka getByRole('heading', { name: 'Antrean Verifikasi' })

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByText('Antrean Verifikasi')

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - generic [ref=e5]:
      - generic [ref=e7]:
        - heading "Portal Data Prestasi" [level=2] [ref=e8]:
          - text: Portal Data
          - text: Prestasi
        - generic [ref=e9]: S1 Teknik Industri
      - list [ref=e13]:
        - listitem [ref=e14]:
          - link "Dashboard Admin" [ref=e15] [cursor=pointer]:
            - /url: /admin/dashboard
            - img [ref=e16]
            - generic [ref=e19]: Dashboard Admin
        - listitem [ref=e20]:
          - link "Antrean Verifikasi" [ref=e21] [cursor=pointer]:
            - /url: /admin/verifikasi
            - img [ref=e22]
            - generic [ref=e26]: Antrean Verifikasi
        - listitem [ref=e27]:
          - link "Kelola NM(TS)" [ref=e28] [cursor=pointer]:
            - /url: /admin/nmts
            - img [ref=e29]
            - generic [ref=e31]: Kelola NM(TS)
        - listitem [ref=e32]:
          - link "Indikator Akreditasi" [ref=e33] [cursor=pointer]:
            - /url: /admin/indikator
            - img [ref=e34]
            - generic [ref=e36]: Indikator Akreditasi
      - list [ref=e38]:
        - listitem [ref=e39]:
          - button "Logout" [ref=e40] [cursor=pointer]:
            - img [ref=e41]
            - generic [ref=e44]: Logout
    - main [ref=e45]:
      - generic [ref=e46]:
        - button "Toggle Sidebar" [ref=e48] [cursor=pointer]:
          - img
          - generic [ref=e49]: Toggle Sidebar
        - generic [ref=e50]:
          - button [ref=e51] [cursor=pointer]:
            - img [ref=e52]
          - button "admin test admin.test@telkomuniversity.ac.id" [ref=e55] [cursor=pointer]:
            - generic [ref=e56]:
              - generic [ref=e57]:
                - generic [ref=e58]: admin test
                - generic [ref=e59]: admin.test@telkomuniversity.ac.id
              - img [ref=e62]
              - img [ref=e65]
      - main [ref=e67]:
        - generic [ref=e68]:
          - generic [ref=e69]:
            - heading "Antrean Verifikasi" [level=1] [ref=e70]
            - paragraph [ref=e71]: Klik pengajuan untuk melihat detail dan melakukan verifikasi
          - generic [ref=e72]:
            - generic [ref=e73]:
              - heading "Pengajuan Pending" [level=2] [ref=e74]
              - generic [ref=e75]: 1 Menunggu Verifikasi
            - link "Juara 1 Lomba Coding Nasional - E2E Test mahasiswa-test (282316 ) • Angkatan 2026 MANDIRI Akademik Internasional 2026 - Semester GENAP 29 Mei 2026" [ref=e77] [cursor=pointer]:
              - /url: /admin/verifikasi/cmpr0l0u00000ykw7ih8rlu9k
              - generic [ref=e78]:
                - generic [ref=e79]:
                  - heading "Juara 1 Lomba Coding Nasional - E2E Test" [level=3] [ref=e81]
                  - paragraph [ref=e82]: mahasiswa-test (282316 ) • Angkatan 2026
                  - generic [ref=e83]:
                    - generic [ref=e84]: MANDIRI
                    - generic [ref=e85]: Akademik
                    - generic [ref=e86]: Internasional
                    - generic [ref=e87]: 2026 - Semester GENAP
                - generic [ref=e88]: 29 Mei 2026
  - region "Notifications alt+T"
  - button "Open Next.js Dev Tools" [ref=e94] [cursor=pointer]:
    - img [ref=e95]
  - alert [ref=e98]
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
  46  |       await expect(notifLink).toBeVisible();
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
> 59  |       await expect(page.getByText('Antrean Verifikasi')).toBeVisible();
      |                                                          ^ Error: expect(locator).toBeVisible() failed
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
  147 |       );
  148 |       await alasanTextarea.fill('Bukti yang dilampirkan tidak sesuai dengan ketentuan - E2E Test');
  149 | 
  150 |       // Submit penolakan
  151 |       await page.getByRole('button', { name: /tolak pengajuan/i }).click();
  152 | 
  153 |       // Toast sukses penolakan
  154 |       const rejectToast = page.locator('[data-sonner-toast]').filter({
  155 |         hasText: /ditolak|berhasil/i,
  156 |       });
  157 |       await expect(rejectToast).toBeVisible({ timeout: 15000 });
  158 |     });
  159 | 
```