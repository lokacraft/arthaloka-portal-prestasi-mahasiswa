# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth-guards.spec.ts >> 🔐 Autentikasi - Login & Otorisasi >> Login Gagal >> Submit dengan email format tidak valid menampilkan toast error
- Location: e2e\auth-guards.spec.ts:88:9

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('[data-sonner-toast]')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('[data-sonner-toast]')

```

```yaml
- heading "Portal Prestasi" [level=1]
- heading "Mahasiswa" [level=2]
- paragraph: Platform terpadu untuk melaporkan pencapaian akademik dan non-akademik, verifikasi admin, dan analitik akreditasi institusi.
- text: Prestasi Valid Menunggu Verifikasi
- heading "Selamat Datang" [level=2]
- paragraph: Masuk ke akun Anda untuk melanjutkan
- text: Email Institusi
- textbox "Masukkan Email": bukan-email
- text: Password
- textbox "Masukkan password": Password123!
- button
- link "Lupa Password?":
  - /url: /forgot-password
- button "Masuk"
- text: Belum punya akun?
- link "Registrasi":
  - /url: /sign-up
- region "Notifications alt+T"
- alert
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | import { loginAs, logout, TEST_USERS } from './helpers';
  3   | 
  4   | /**
  5   |  * UAT - Skenario Autentikasi & Otorisasi (Case 5)
  6   |  *
  7   |  * Mencakup:
  8   |  * - Login valid untuk semua role
  9   |  * - Login dengan kredensial salah
  10  |  * - Proteksi rute: MAHASISWA tidak bisa akses /admin/dashboard
  11  |  * - Proteksi rute: WD tidak bisa akses /admin/dashboard
  12  |  * - Proteksi rute: KAPRODI tidak bisa akses /admin/dashboard
  13  |  * - Proteksi rute: AKREDITASI tidak bisa akses /admin/dashboard
  14  |  * - Redirect otomatis ke dashboard masing-masing jika sudah login dan akses /sign-in
  15  |  */
  16  | 
  17  | test.describe('🔐 Autentikasi - Login & Otorisasi', () => {
  18  | 
  19  |   // ─────────────────────────────────────────────────────────────────────────
  20  |   // GROUP 1: Login berhasil untuk setiap role
  21  |   // ─────────────────────────────────────────────────────────────────────────
  22  | 
  23  |   test.describe('Login Berhasil per Role', () => {
  24  | 
  25  |     test('MAHASISWA dapat login dan diarahkan ke /dashboard', async ({ page }) => {
  26  |       await loginAs(page, 'mahasiswa');
  27  |       await expect(page).toHaveURL(/\/dashboard/);
  28  |       // Verifikasi elemen dashboard mahasiswa ada
  29  |       await expect(page.locator('h1')).toBeVisible();
  30  |     });
  31  | 
  32  |     test('ADMIN dapat login dan diarahkan ke /admin/dashboard', async ({ page }) => {
  33  |       await loginAs(page, 'admin');
  34  |       await expect(page).toHaveURL(/\/admin\/dashboard/);
  35  |       await expect(page.locator('h1')).toBeVisible();
  36  |     });
  37  | 
  38  |     test('WD dapat login dan diarahkan ke /wd1/dashboard', async ({ page }) => {
  39  |       await loginAs(page, 'wd');
  40  |       await expect(page).toHaveURL(/\/wd1\/dashboard/);
  41  |       await expect(page.locator('h1')).toBeVisible();
  42  |     });
  43  | 
  44  |     test('KAPRODI dapat login dan diarahkan ke /kaprodi/dashboard', async ({ page }) => {
  45  |       await loginAs(page, 'kaprodi');
  46  |       await expect(page).toHaveURL(/\/kaprodi\/dashboard/);
  47  |       await expect(page.locator('h1')).toBeVisible();
  48  |     });
  49  | 
  50  |     test('AKREDITASI dapat login dan diarahkan ke /akreditasi/dashboard', async ({ page }) => {
  51  |       await loginAs(page, 'akreditasi');
  52  |       await expect(page).toHaveURL(/\/akreditasi\/dashboard/);
  53  |       await expect(page.locator('h1')).toBeVisible();
  54  |     });
  55  | 
  56  |   });
  57  | 
  58  |   // ─────────────────────────────────────────────────────────────────────────
  59  |   // GROUP 2: Login gagal
  60  |   // ─────────────────────────────────────────────────────────────────────────
  61  | 
  62  |   test.describe('Login Gagal', () => {
  63  | 
  64  |     test('Login dengan password salah menampilkan pesan error', async ({ page }) => {
  65  |       await page.goto('/sign-in');
  66  |       await page.fill('input[name="email"]', TEST_USERS.mahasiswa.email);
  67  |       await page.fill('input[name="password"]', 'passwordSalahBanget!');
  68  |       await page.click('button[type="submit"]');
  69  | 
  70  |       // Harus tetap di halaman sign-in
  71  |       await expect(page).toHaveURL(/\/sign-in/);
  72  |       // Toast error muncul
  73  |       const toast = page.locator('[data-sonner-toast]');
  74  |       await expect(toast).toBeVisible({ timeout: 10000 });
  75  |     });
  76  | 
  77  |     test('Login dengan email tidak terdaftar menampilkan error', async ({ page }) => {
  78  |       await page.goto('/sign-in');
  79  |       await page.fill('input[name="email"]', 'tidakterdaftar@example.com');
  80  |       await page.fill('input[name="password"]', 'Password123!');
  81  |       await page.click('button[type="submit"]');
  82  | 
  83  |       await expect(page).toHaveURL(/\/sign-in/);
  84  |       const toast = page.locator('[data-sonner-toast]');
  85  |       await expect(toast).toBeVisible({ timeout: 10000 });
  86  |     });
  87  | 
  88  |     test('Submit dengan email format tidak valid menampilkan toast error', async ({ page }) => {
  89  |       await page.goto('/sign-in');
  90  |       await page.fill('input[name="email"]', 'bukan-email');
  91  |       await page.fill('input[name="password"]', 'Password123!');
  92  |       await page.click('button[type="submit"]');
  93  | 
  94  |       // Toast harus muncul dengan pesan format email
  95  |       const toast = page.locator('[data-sonner-toast]');
> 96  |       await expect(toast).toBeVisible({ timeout: 5000 });
      |                           ^ Error: expect(locator).toBeVisible() failed
  97  |     });
  98  | 
  99  |   });
  100 | 
  101 |   // ─────────────────────────────────────────────────────────────────────────
  102 |   // GROUP 3: UAT Case 5 - Proteksi rute (Akses Ilegal)
  103 |   // ─────────────────────────────────────────────────────────────────────────
  104 | 
  105 |   test.describe('UAT Case 5 - Akses Ilegal (Middleware Authorization)', () => {
  106 | 
  107 |     test('MAHASISWA yang akses /admin/dashboard di-redirect ke /dashboard', async ({ page }) => {
  108 |       await loginAs(page, 'mahasiswa');
  109 |       await page.goto('/admin/dashboard');
  110 |       // Middleware harus redirect
  111 |       await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 });
  112 |       await expect(page).not.toHaveURL(/\/admin/);
  113 |     });
  114 | 
  115 |     test('MAHASISWA yang akses /wd1/dashboard di-redirect ke /dashboard', async ({ page }) => {
  116 |       await loginAs(page, 'mahasiswa');
  117 |       await page.goto('/wd1/dashboard');
  118 |       await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 });
  119 |     });
  120 | 
  121 |     test('MAHASISWA yang akses /kaprodi/dashboard di-redirect ke /dashboard', async ({ page }) => {
  122 |       await loginAs(page, 'mahasiswa');
  123 |       await page.goto('/kaprodi/dashboard');
  124 |       await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 });
  125 |     });
  126 | 
  127 |     test('MAHASISWA yang akses /akreditasi/dashboard di-redirect ke /dashboard', async ({ page }) => {
  128 |       await loginAs(page, 'mahasiswa');
  129 |       await page.goto('/akreditasi/dashboard');
  130 |       await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 });
  131 |     });
  132 | 
  133 |     test('WD yang akses /admin/dashboard di-redirect', async ({ page }) => {
  134 |       await loginAs(page, 'wd');
  135 |       await page.goto('/admin/dashboard');
  136 |       // WD tidak boleh akses admin, harus redirect ke dashboard-nya
  137 |       await expect(page).not.toHaveURL(/\/admin\/dashboard/, { timeout: 10000 });
  138 |     });
  139 | 
  140 |     test('KAPRODI yang akses /admin/verifikasi di-redirect', async ({ page }) => {
  141 |       await loginAs(page, 'kaprodi');
  142 |       await page.goto('/admin/verifikasi');
  143 |       await expect(page).not.toHaveURL(/\/admin\/verifikasi/, { timeout: 10000 });
  144 |     });
  145 | 
  146 |     test('AKREDITASI yang akses /admin/verifikasi di-redirect', async ({ page }) => {
  147 |       await loginAs(page, 'akreditasi');
  148 |       await page.goto('/admin/verifikasi');
  149 |       await expect(page).not.toHaveURL(/\/admin\/verifikasi/, { timeout: 10000 });
  150 |     });
  151 | 
  152 |     test('User sudah login tidak bisa akses /sign-in (redirect ke dashboard)', async ({ page }) => {
  153 |       await loginAs(page, 'mahasiswa');
  154 |       await page.goto('/sign-in');
  155 |       // Middleware redirect user yang sudah login ke dashboard mereka
  156 |       await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 });
  157 |     });
  158 | 
  159 |     test('User tidak login yang akses /dashboard diarahkan ke sign-in atau menampilkan konten terlindungi', async ({ page }) => {
  160 |       // Pastikan tidak ada sesi aktif
  161 |       await page.context().clearCookies();
  162 |       await page.goto('/dashboard');
  163 |       // Harus redirect ke sign-in atau menampilkan halaman login
  164 |       await expect(page).toHaveURL(/\/sign-in|\//, { timeout: 10000 });
  165 |     });
  166 | 
  167 |   });
  168 | 
  169 | });
  170 | 
```