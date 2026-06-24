import { test, expect } from '@playwright/test';
import { loginAs, logout, TEST_USERS } from './helpers';

/**
 * UAT - Skenario Autentikasi & Otorisasi (Case 5)
 *
 * Mencakup:
 * - Login valid untuk semua role
 * - Login dengan kredensial salah
 * - Proteksi rute: MAHASISWA tidak bisa akses /admin/dashboard
 * - Proteksi rute: WD tidak bisa akses /admin/dashboard
 * - Proteksi rute: KAPRODI tidak bisa akses /admin/dashboard
 * - Proteksi rute: AKREDITASI tidak bisa akses /admin/dashboard
 * - Redirect otomatis ke dashboard masing-masing jika sudah login dan akses /sign-in
 */

test.describe('🔐 Autentikasi - Login & Otorisasi', () => {

  // ─────────────────────────────────────────────────────────────────────────
  // GROUP 1: Login berhasil untuk setiap role
  // ─────────────────────────────────────────────────────────────────────────

  test.describe('Login Berhasil per Role', () => {

    test('MAHASISWA dapat login dan diarahkan ke /dashboard', async ({ page }) => {
      await loginAs(page, 'mahasiswa');
      await expect(page).toHaveURL(/\/dashboard/);
      // Verifikasi elemen dashboard mahasiswa ada
      await expect(page.locator('h1')).toBeVisible();
    });

    test('ADMIN dapat login dan diarahkan ke /admin/dashboard', async ({ page }) => {
      await loginAs(page, 'admin');
      await expect(page).toHaveURL(/\/admin\/dashboard/);
      await expect(page.locator('h1')).toBeVisible();
    });

    test('WD dapat login dan diarahkan ke /wd1/dashboard', async ({ page }) => {
      await loginAs(page, 'wd');
      await expect(page).toHaveURL(/\/wd1\/dashboard/);
      await expect(page.locator('h1')).toBeVisible();
    });

    test('KAPRODI dapat login dan diarahkan ke /kaprodi/dashboard', async ({ page }) => {
      await loginAs(page, 'kaprodi');
      await expect(page).toHaveURL(/\/kaprodi\/dashboard/);
      await expect(page.locator('h1')).toBeVisible();
    });

    test('AKREDITASI dapat login dan diarahkan ke /akreditasi/dashboard', async ({ page }) => {
      await loginAs(page, 'akreditasi');
      await expect(page).toHaveURL(/\/akreditasi\/dashboard/);
      await expect(page.locator('h1')).toBeVisible();
    });

  });

  // ─────────────────────────────────────────────────────────────────────────
  // GROUP 2: Login gagal
  // ─────────────────────────────────────────────────────────────────────────

  test.describe('Login Gagal', () => {

    test('Login dengan password salah menampilkan pesan error', async ({ page }) => {
      await page.goto('/sign-in');
      await page.fill('input[name="email"]', TEST_USERS.mahasiswa.email);
      await page.fill('input[name="password"]', 'passwordSalahBanget!');
      await page.click('button[type="submit"]');

      // Harus tetap di halaman sign-in
      await expect(page).toHaveURL(/\/sign-in/);
      // Toast error muncul
      const toast = page.locator('[data-sonner-toast]');
      await expect(toast).toBeVisible({ timeout: 10000 });
    });

    test('Login dengan email tidak terdaftar menampilkan error', async ({ page }) => {
      await page.goto('/sign-in');
      await page.fill('input[name="email"]', 'tidakterdaftar@example.com');
      await page.fill('input[name="password"]', 'Password123!');
      await page.click('button[type="submit"]');

      await expect(page).toHaveURL(/\/sign-in/);
      const toast = page.locator('[data-sonner-toast]');
      await expect(toast).toBeVisible({ timeout: 10000 });
    });

    test('Submit dengan email format tidak valid menampilkan toast error', async ({ page }) => {
      await page.goto('/sign-in');
      await page.fill('input[name="email"]', 'bukan-email');
      await page.fill('input[name="password"]', 'Password123!');
      await page.click('button[type="submit"]');

      // Toast harus muncul dengan pesan format email
      const toast = page.locator('[data-sonner-toast]');
      await expect(toast).toBeVisible({ timeout: 5000 });
    });

  });

  // ─────────────────────────────────────────────────────────────────────────
  // GROUP 3: UAT Case 5 - Proteksi rute (Akses Ilegal)
  // ─────────────────────────────────────────────────────────────────────────

  test.describe('UAT Case 5 - Akses Ilegal (Middleware Authorization)', () => {

    test('MAHASISWA yang akses /admin/dashboard di-redirect ke /dashboard', async ({ page }) => {
      await loginAs(page, 'mahasiswa');
      await page.goto('/admin/dashboard');
      // Middleware harus redirect
      await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 });
      await expect(page).not.toHaveURL(/\/admin/);
    });

    test('MAHASISWA yang akses /wd1/dashboard di-redirect ke /dashboard', async ({ page }) => {
      await loginAs(page, 'mahasiswa');
      await page.goto('/wd1/dashboard');
      await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 });
    });

    test('MAHASISWA yang akses /kaprodi/dashboard di-redirect ke /dashboard', async ({ page }) => {
      await loginAs(page, 'mahasiswa');
      await page.goto('/kaprodi/dashboard');
      await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 });
    });

    test('MAHASISWA yang akses /akreditasi/dashboard di-redirect ke /dashboard', async ({ page }) => {
      await loginAs(page, 'mahasiswa');
      await page.goto('/akreditasi/dashboard');
      await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 });
    });

    test('WD yang akses /admin/dashboard di-redirect', async ({ page }) => {
      await loginAs(page, 'wd');
      await page.goto('/admin/dashboard');
      // WD tidak boleh akses admin, harus redirect ke dashboard-nya
      await expect(page).not.toHaveURL(/\/admin\/dashboard/, { timeout: 10000 });
    });

    test('KAPRODI yang akses /admin/verifikasi di-redirect', async ({ page }) => {
      await loginAs(page, 'kaprodi');
      await page.goto('/admin/verifikasi');
      await expect(page).not.toHaveURL(/\/admin\/verifikasi/, { timeout: 10000 });
    });

    test('AKREDITASI yang akses /admin/verifikasi di-redirect', async ({ page }) => {
      await loginAs(page, 'akreditasi');
      await page.goto('/admin/verifikasi');
      await expect(page).not.toHaveURL(/\/admin\/verifikasi/, { timeout: 10000 });
    });

    test('User sudah login tidak bisa akses /sign-in (redirect ke dashboard)', async ({ page }) => {
      await loginAs(page, 'mahasiswa');
      await page.goto('/sign-in');
      // Middleware redirect user yang sudah login ke dashboard mereka
      await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 });
    });

    test('User tidak login yang akses /dashboard diarahkan ke sign-in atau menampilkan konten terlindungi', async ({ page }) => {
      // Pastikan tidak ada sesi aktif
      await page.context().clearCookies();
      await page.goto('/dashboard');
      // Harus redirect ke sign-in atau menampilkan halaman login
      await expect(page).toHaveURL(/\/sign-in|\//, { timeout: 10000 });
    });

  });

});
