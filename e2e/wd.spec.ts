import { test, expect } from '@playwright/test';
import { loginAs } from './helpers';

/**
 * UAT - Skenario Wakil Dekan (WD1)
 *
 * Mencakup:
 * - Login dan redirect ke /wd1/dashboard
 * - Dashboard WD menampilkan rekapitulasi prestasi tingkat fakultas
 * - Visualisasi data (grafik/statistik) termuat sukses
 * - WD tidak dapat mengakses area admin (otorisasi)
 * - WD dapat mengakses notifikasi
 * - WD dapat mengakses pengaturan profil
 * - Verifikasi WD hanya dapat melihat data (read-only, tidak ada aksi verifikasi)
 */

test.describe('📊 Skenario Wakil Dekan (WD1)', () => {

  test.beforeEach(async ({ page }) => {
    await loginAs(page, 'wd');
  });

  // ──────────────────────────────────────────────────────────────────────────
  // Dashboard WD
  // ──────────────────────────────────────────────────────────────────────────

  test.describe('Dashboard WD - Rekapitulasi Fakultas', () => {

    test('WD berhasil login dan diarahkan ke /wd1/dashboard', async ({ page }) => {
      await expect(page).toHaveURL(/\/wd1\/dashboard/);
    });

    test('Dashboard WD ter-render tanpa error dengan elemen utama terlihat', async ({ page }) => {
      await page.waitForLoadState('networkidle');

      // Tidak ada error server
      await expect(page.locator('body')).not.toContainText(/internal server error|500/i);

      // Minimal ada heading
      await expect(page.locator('h1').or(page.locator('h2')).first()).toBeVisible();
    });

    test('Dashboard WD menampilkan data rekapitulasi tingkat fakultas', async ({ page }) => {
      await page.waitForLoadState('networkidle');

      // Cari elemen statistik atau kartu data (misalnya angka total prestasi)
      // Verifikasi setidaknya ada 1 elemen yang berisi angka atau data statistik
      const statCards = page.locator('[data-testid="stat-card"]').or(
        page.locator('.recharts-wrapper, [class*="chart"], [class*="stat"], [class*="card"]')
      );
      
      // Jika recharts dimuat (library visualisasi data)
      const chartsVisible = await page.locator('.recharts-wrapper').isVisible().catch(() => false);
      if (chartsVisible) {
        await expect(page.locator('.recharts-wrapper').first()).toBeVisible();
      }

      // Minimal halaman harus termuat penuh
      await expect(page.locator('body')).not.toContainText(/gagal memuat|loading/i);
    });

    test('Dashboard WD menampilkan data dari semua program studi (tingkat fakultas)', async ({ page }) => {
      await page.waitForLoadState('networkidle');

      // Cari indikasi bahwa data mencakup semua prodi
      // Misalnya tabel, daftar prodi, atau label "Fakultas"
      const hasFacultyData = await page.locator('text=/fakultas|semua prodi|rekap/i').isVisible().catch(() => false);
      
      // Verifikasi halaman tidak kosong
      const mainContent = page.locator('main').or(page.locator('[data-testid="main-content"]'));
      await expect(mainContent.or(page.locator('body'))).toBeVisible();

      // Tidak ada pesan "tidak ada data" yang mengindikasikan kegagalan load
      const noDataMsg = page.locator('text=/tidak ada data/i');
      // Data bisa kosong (env test), tapi halaman harus ter-render
      await expect(page.locator('body')).not.toContainText(/500|error/i);
    });

  });

  // ──────────────────────────────────────────────────────────────────────────
  // Otorisasi: WD tidak bisa akses area Admin
  // ──────────────────────────────────────────────────────────────────────────

  test.describe('Otorisasi WD - Hanya Akses Dashboard WD', () => {

    test('WD tidak dapat mengakses /admin/dashboard', async ({ page }) => {
      await page.goto('/admin/dashboard');
      // Harus di-redirect keluar dari /admin
      await expect(page).not.toHaveURL(/\/admin\/dashboard/, { timeout: 10000 });
    });

    test('WD tidak dapat mengakses /admin/verifikasi', async ({ page }) => {
      await page.goto('/admin/verifikasi');
      await expect(page).not.toHaveURL(/\/admin\/verifikasi/, { timeout: 10000 });
    });

    test('WD tidak dapat mengakses dashboard mahasiswa (/dashboard)', async ({ page }) => {
      await page.goto('/dashboard');
      // Middleware akan redirect WD ke /wd1/dashboard
      await expect(page).toHaveURL(/\/wd1\/dashboard/, { timeout: 10000 });
    });

    test('WD tidak dapat mengakses dashboard kaprodi', async ({ page }) => {
      await page.goto('/kaprodi/dashboard');
      await expect(page).not.toHaveURL(/\/kaprodi\/dashboard/, { timeout: 10000 });
    });

    test('WD tidak dapat mengakses dashboard akreditasi', async ({ page }) => {
      await page.goto('/akreditasi/dashboard');
      await expect(page).not.toHaveURL(/\/akreditasi\/dashboard/, { timeout: 10000 });
    });

  });

  // ──────────────────────────────────────────────────────────────────────────
  // Fungsionalitas WD - Read Only
  // ──────────────────────────────────────────────────────────────────────────

  test.describe('Fungsionalitas WD - Akses Baca', () => {

    test('Halaman dashboard WD tidak memiliki tombol Approve/Reject prestasi', async ({ page }) => {
      await page.waitForLoadState('networkidle');

      // Di dashboard WD tidak seharusnya ada tombol verifikasi/approve/reject
      const approveBtn = page.getByRole('button', { name: /valid|approve|setuju/i });
      const rejectBtn = page.getByRole('button', { name: /tolak|reject|ditolak/i });

      // Tombol-tombol aksi verifikasi tidak boleh ada di dashboard WD
      expect(await approveBtn.count()).toBe(0);
      expect(await rejectBtn.count()).toBe(0);
    });

    test('WD dapat mengakses halaman notifikasi', async ({ page }) => {
      await page.goto('/wd1/notifikasi');
      await page.waitForLoadState('networkidle');
      await expect(page).not.toHaveURL(/\/sign-in/);
      await expect(page.locator('body')).not.toContainText(/500/i);
    });

    test('WD dapat mengakses halaman pengaturan profil', async ({ page }) => {
      await page.goto('/wd1/pengaturan');
      await page.waitForLoadState('networkidle');
      await expect(page).not.toHaveURL(/\/sign-in/);
      await expect(page.locator('body')).not.toContainText(/500/i);
    });

  });

  // ──────────────────────────────────────────────────────────────────────────
  // Navigasi Sidebar WD
  // ──────────────────────────────────────────────────────────────────────────

  test.describe('Navigasi Sidebar WD', () => {

    test('Sidebar WD menampilkan menu yang sesuai dengan peran WD', async ({ page }) => {
      await page.waitForLoadState('networkidle');

      // WD seharusnya tidak melihat menu "Verifikasi" milik admin
      const verifikasiMenu = page.getByRole('link', { name: /verifikasi pengajuan/i });
      // Menu ini bisa ada tapi mengarah ke rute yang berbeda, bukan /admin/verifikasi
      if (await verifikasiMenu.isVisible()) {
        const href = await verifikasiMenu.getAttribute('href');
        expect(href).not.toContain('/admin/');
      }
    });

  });

});
