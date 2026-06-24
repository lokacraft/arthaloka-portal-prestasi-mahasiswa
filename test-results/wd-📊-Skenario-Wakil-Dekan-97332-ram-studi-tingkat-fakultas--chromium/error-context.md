# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: wd.spec.ts >> 📊 Skenario Wakil Dekan (WD1) >> Dashboard WD - Rekapitulasi Fakultas >> Dashboard WD menampilkan data dari semua program studi (tingkat fakultas)
- Location: e2e\wd.spec.ts:62:9

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('main').or(locator('[data-testid="main-content"]')).or(locator('body'))
Expected: visible
Error: strict mode violation: locator('main').or(locator('[data-testid="main-content"]')).or(locator('body')) resolved to 3 elements:
    1) <body class="min-h-full flex flex-col">…</body> aka locator('body')
    2) <main data-slot="sidebar-inset" class="relative w-full flex-1 md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow-sm md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ml-2 bg-gray-50 flex flex-col min-h-screen">…</main> aka getByText('Toggle Sidebarwd testwd.test@telkomuniversity.ac.idExecutive DashboardRingkasan')
    3) <main class="flex-1 p-6 overflow-auto">…</main> aka getByRole('main').filter({ hasText: 'Toggle Sidebarwd testwd.test@' }).getByRole('main')

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('main').or(locator('[data-testid="main-content"]')).or(locator('body'))

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
          - link "Dashboard Executive" [ref=e15] [cursor=pointer]:
            - /url: /wd1/dashboard
            - img [ref=e16]
            - generic [ref=e19]: Dashboard Executive
      - list [ref=e21]:
        - listitem [ref=e22]:
          - button "Logout" [ref=e23] [cursor=pointer]:
            - img [ref=e24]
            - generic [ref=e27]: Logout
    - main [ref=e28]:
      - generic [ref=e29]:
        - button "Toggle Sidebar" [ref=e31] [cursor=pointer]:
          - img
          - generic [ref=e32]: Toggle Sidebar
        - button "wd test wd.test@telkomuniversity.ac.id" [ref=e34] [cursor=pointer]:
          - generic [ref=e35]:
            - generic [ref=e36]:
              - generic [ref=e37]: wd test
              - generic [ref=e38]: wd.test@telkomuniversity.ac.id
            - img [ref=e41]
            - img [ref=e44]
      - main [ref=e46]:
        - generic [ref=e47]:
          - img [ref=e49]
          - generic [ref=e51]:
            - heading "Executive Dashboard" [level=1] [ref=e52]
            - paragraph [ref=e53]: Ringkasan prestasi mahasiswa tingkat pimpinan fakultas
          - generic [ref=e54]:
            - generic [ref=e55]:
              - paragraph [ref=e56]: Total Prestasi Mahasiswa
              - heading "0 Prestasi" [level=2] [ref=e58]
              - paragraph [ref=e59]: Periode 5 Tahun Terakhir (2022-2026)
            - button "Filter Rentang Waktu" [ref=e60] [cursor=pointer]
          - generic [ref=e61]:
            - generic [ref=e62]:
              - generic [ref=e63]:
                - paragraph [ref=e64]: Total Prestasi Valid
                - img [ref=e66]
              - paragraph [ref=e69]: "0"
            - generic [ref=e70]:
              - generic [ref=e71]:
                - paragraph [ref=e72]: Mahasiswa Berprestasi
                - img [ref=e74]
              - paragraph [ref=e79]: "0"
            - generic [ref=e80]:
              - generic [ref=e81]:
                - paragraph [ref=e82]: Pencapaian Target LAM TEKNIK
                - img [ref=e84]
              - paragraph [ref=e88]: 0%
          - generic [ref=e89]:
            - generic [ref=e90]:
              - paragraph [ref=e91]: Prestasi Internasional
              - generic [ref=e93]: "0"
            - generic [ref=e94]:
              - paragraph [ref=e95]: Prestasi Nasional
              - generic [ref=e97]: "0"
            - generic [ref=e98]:
              - paragraph [ref=e99]: Prestasi Wilayah
              - generic [ref=e101]: "0"
          - generic [ref=e102]:
            - generic [ref=e103]:
              - heading "Tren Prestasi 5 Tahun" [level=2] [ref=e104]:
                - img [ref=e105]
                - text: Tren Prestasi 5 Tahun
              - application [ref=e112]
              - generic [ref=e116]:
                - generic [ref=e119]: Internasional
                - generic [ref=e122]: Nasional
                - generic [ref=e125]: Wilayah
            - generic [ref=e126]:
              - heading "Distribusi Kategori" [level=2] [ref=e127]
              - application [ref=e132]
          - generic [ref=e136]:
            - heading "Scorecard Indikator Akreditasi" [level=2] [ref=e137]
            - paragraph [ref=e138]: "Catatan: Nilai NM(TS) belum diatur. Silakan atur di Master Data untuk menampilkan Rasio aktual."
            - generic [ref=e139]:
              - generic [ref=e140]:
                - paragraph [ref=e141]: Capaian Internasional (NI)
                - text: "0"
              - generic [ref=e142]:
                - paragraph [ref=e143]: Capaian Nasional (NN)
                - text: "0"
              - generic [ref=e144]:
                - paragraph [ref=e145]: Capaian Wilayah/Lokal (NW)
                - text: "0"
              - generic [ref=e146]:
                - paragraph [ref=e147]: "Rasio Internasional (Target: 0.05%)"
                - text: 0.00%
              - generic [ref=e148]:
                - paragraph [ref=e149]: "Rasio Nasional (Target: 0.5%)"
                - text: 0.00%
              - generic [ref=e150]:
                - paragraph [ref=e151]: "Rasio Wilayah (Target: 1.5%)"
                - text: 0.00%
  - region "Notifications alt+T"
  - button "Open Next.js Dev Tools" [ref=e157] [cursor=pointer]:
    - generic [ref=e160]:
      - text: Compiling
      - generic [ref=e161]:
        - generic [ref=e162]: .
        - generic [ref=e163]: .
        - generic [ref=e164]: .
  - alert [ref=e165]
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | import { loginAs } from './helpers';
  3   | 
  4   | /**
  5   |  * UAT - Skenario Wakil Dekan (WD1)
  6   |  *
  7   |  * Mencakup:
  8   |  * - Login dan redirect ke /wd1/dashboard
  9   |  * - Dashboard WD menampilkan rekapitulasi prestasi tingkat fakultas
  10  |  * - Visualisasi data (grafik/statistik) termuat sukses
  11  |  * - WD tidak dapat mengakses area admin (otorisasi)
  12  |  * - WD dapat mengakses notifikasi
  13  |  * - WD dapat mengakses pengaturan profil
  14  |  * - Verifikasi WD hanya dapat melihat data (read-only, tidak ada aksi verifikasi)
  15  |  */
  16  | 
  17  | test.describe('📊 Skenario Wakil Dekan (WD1)', () => {
  18  | 
  19  |   test.beforeEach(async ({ page }) => {
  20  |     await loginAs(page, 'wd');
  21  |   });
  22  | 
  23  |   // ──────────────────────────────────────────────────────────────────────────
  24  |   // Dashboard WD
  25  |   // ──────────────────────────────────────────────────────────────────────────
  26  | 
  27  |   test.describe('Dashboard WD - Rekapitulasi Fakultas', () => {
  28  | 
  29  |     test('WD berhasil login dan diarahkan ke /wd1/dashboard', async ({ page }) => {
  30  |       await expect(page).toHaveURL(/\/wd1\/dashboard/);
  31  |     });
  32  | 
  33  |     test('Dashboard WD ter-render tanpa error dengan elemen utama terlihat', async ({ page }) => {
  34  |       await page.waitForLoadState('networkidle');
  35  | 
  36  |       // Tidak ada error server
  37  |       await expect(page.locator('body')).not.toContainText(/internal server error|500/i);
  38  | 
  39  |       // Minimal ada heading
  40  |       await expect(page.locator('h1').or(page.locator('h2')).first()).toBeVisible();
  41  |     });
  42  | 
  43  |     test('Dashboard WD menampilkan data rekapitulasi tingkat fakultas', async ({ page }) => {
  44  |       await page.waitForLoadState('networkidle');
  45  | 
  46  |       // Cari elemen statistik atau kartu data (misalnya angka total prestasi)
  47  |       // Verifikasi setidaknya ada 1 elemen yang berisi angka atau data statistik
  48  |       const statCards = page.locator('[data-testid="stat-card"]').or(
  49  |         page.locator('.recharts-wrapper, [class*="chart"], [class*="stat"], [class*="card"]')
  50  |       );
  51  |       
  52  |       // Jika recharts dimuat (library visualisasi data)
  53  |       const chartsVisible = await page.locator('.recharts-wrapper').isVisible().catch(() => false);
  54  |       if (chartsVisible) {
  55  |         await expect(page.locator('.recharts-wrapper').first()).toBeVisible();
  56  |       }
  57  | 
  58  |       // Minimal halaman harus termuat penuh
  59  |       await expect(page.locator('body')).not.toContainText(/gagal memuat|loading/i);
  60  |     });
  61  | 
  62  |     test('Dashboard WD menampilkan data dari semua program studi (tingkat fakultas)', async ({ page }) => {
  63  |       await page.waitForLoadState('networkidle');
  64  | 
  65  |       // Cari indikasi bahwa data mencakup semua prodi
  66  |       // Misalnya tabel, daftar prodi, atau label "Fakultas"
  67  |       const hasFacultyData = await page.locator('text=/fakultas|semua prodi|rekap/i').isVisible().catch(() => false);
  68  |       
  69  |       // Verifikasi halaman tidak kosong
  70  |       const mainContent = page.locator('main').or(page.locator('[data-testid="main-content"]'));
> 71  |       await expect(mainContent.or(page.locator('body'))).toBeVisible();
      |                                                          ^ Error: expect(locator).toBeVisible() failed
  72  | 
  73  |       // Tidak ada pesan "tidak ada data" yang mengindikasikan kegagalan load
  74  |       const noDataMsg = page.locator('text=/tidak ada data/i');
  75  |       // Data bisa kosong (env test), tapi halaman harus ter-render
  76  |       await expect(page.locator('body')).not.toContainText(/500|error/i);
  77  |     });
  78  | 
  79  |   });
  80  | 
  81  |   // ──────────────────────────────────────────────────────────────────────────
  82  |   // Otorisasi: WD tidak bisa akses area Admin
  83  |   // ──────────────────────────────────────────────────────────────────────────
  84  | 
  85  |   test.describe('Otorisasi WD - Hanya Akses Dashboard WD', () => {
  86  | 
  87  |     test('WD tidak dapat mengakses /admin/dashboard', async ({ page }) => {
  88  |       await page.goto('/admin/dashboard');
  89  |       // Harus di-redirect keluar dari /admin
  90  |       await expect(page).not.toHaveURL(/\/admin\/dashboard/, { timeout: 10000 });
  91  |     });
  92  | 
  93  |     test('WD tidak dapat mengakses /admin/verifikasi', async ({ page }) => {
  94  |       await page.goto('/admin/verifikasi');
  95  |       await expect(page).not.toHaveURL(/\/admin\/verifikasi/, { timeout: 10000 });
  96  |     });
  97  | 
  98  |     test('WD tidak dapat mengakses dashboard mahasiswa (/dashboard)', async ({ page }) => {
  99  |       await page.goto('/dashboard');
  100 |       // Middleware akan redirect WD ke /wd1/dashboard
  101 |       await expect(page).toHaveURL(/\/wd1\/dashboard/, { timeout: 10000 });
  102 |     });
  103 | 
  104 |     test('WD tidak dapat mengakses dashboard kaprodi', async ({ page }) => {
  105 |       await page.goto('/kaprodi/dashboard');
  106 |       await expect(page).not.toHaveURL(/\/kaprodi\/dashboard/, { timeout: 10000 });
  107 |     });
  108 | 
  109 |     test('WD tidak dapat mengakses dashboard akreditasi', async ({ page }) => {
  110 |       await page.goto('/akreditasi/dashboard');
  111 |       await expect(page).not.toHaveURL(/\/akreditasi\/dashboard/, { timeout: 10000 });
  112 |     });
  113 | 
  114 |   });
  115 | 
  116 |   // ──────────────────────────────────────────────────────────────────────────
  117 |   // Fungsionalitas WD - Read Only
  118 |   // ──────────────────────────────────────────────────────────────────────────
  119 | 
  120 |   test.describe('Fungsionalitas WD - Akses Baca', () => {
  121 | 
  122 |     test('Halaman dashboard WD tidak memiliki tombol Approve/Reject prestasi', async ({ page }) => {
  123 |       await page.waitForLoadState('networkidle');
  124 | 
  125 |       // Di dashboard WD tidak seharusnya ada tombol verifikasi/approve/reject
  126 |       const approveBtn = page.getByRole('button', { name: /valid|approve|setuju/i });
  127 |       const rejectBtn = page.getByRole('button', { name: /tolak|reject|ditolak/i });
  128 | 
  129 |       // Tombol-tombol aksi verifikasi tidak boleh ada di dashboard WD
  130 |       expect(await approveBtn.count()).toBe(0);
  131 |       expect(await rejectBtn.count()).toBe(0);
  132 |     });
  133 | 
  134 |     test('WD dapat mengakses halaman notifikasi', async ({ page }) => {
  135 |       await page.goto('/wd1/notifikasi');
  136 |       await page.waitForLoadState('networkidle');
  137 |       await expect(page).not.toHaveURL(/\/sign-in/);
  138 |       await expect(page.locator('body')).not.toContainText(/500/i);
  139 |     });
  140 | 
  141 |     test('WD dapat mengakses halaman pengaturan profil', async ({ page }) => {
  142 |       await page.goto('/wd1/pengaturan');
  143 |       await page.waitForLoadState('networkidle');
  144 |       await expect(page).not.toHaveURL(/\/sign-in/);
  145 |       await expect(page.locator('body')).not.toContainText(/500/i);
  146 |     });
  147 | 
  148 |   });
  149 | 
  150 |   // ──────────────────────────────────────────────────────────────────────────
  151 |   // Navigasi Sidebar WD
  152 |   // ──────────────────────────────────────────────────────────────────────────
  153 | 
  154 |   test.describe('Navigasi Sidebar WD', () => {
  155 | 
  156 |     test('Sidebar WD menampilkan menu yang sesuai dengan peran WD', async ({ page }) => {
  157 |       await page.waitForLoadState('networkidle');
  158 | 
  159 |       // WD seharusnya tidak melihat menu "Verifikasi" milik admin
  160 |       const verifikasiMenu = page.getByRole('link', { name: /verifikasi pengajuan/i });
  161 |       // Menu ini bisa ada tapi mengarah ke rute yang berbeda, bukan /admin/verifikasi
  162 |       if (await verifikasiMenu.isVisible()) {
  163 |         const href = await verifikasiMenu.getAttribute('href');
  164 |         expect(href).not.toContain('/admin/');
  165 |       }
  166 |     });
  167 | 
  168 |   });
  169 | 
  170 | });
  171 | 
```