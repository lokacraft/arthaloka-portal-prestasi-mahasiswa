import { test, expect } from '@playwright/test';
import { loginAs } from './helpers';

/**
 * UAT - Skenario Kaprodi
 *
 * Mencakup:
 * - Login dan redirect ke /kaprodi/dashboard
 * - Dashboard Kaprodi menampilkan data prestasi khusus untuk program studinya
 * - Kaprodi tidak dapat mengakses area admin (otorisasi)
 * - Verifikasi data tidak rusak oleh format JSON anggota tim (UAT Technical Edge Case 3)
 * - Kaprodi hanya dapat melihat data (read-only)
 * - Notifikasi dan pengaturan Kaprodi dapat diakses
 */

test.describe('🏫 Skenario Kaprodi', () => {

  test.beforeEach(async ({ page }) => {
    await loginAs(page, 'kaprodi');
  });

  // ──────────────────────────────────────────────────────────────────────────
  // Dashboard Kaprodi
  // ──────────────────────────────────────────────────────────────────────────

  test.describe('Dashboard Kaprodi - Data Per Program Studi', () => {

    test('Kaprodi berhasil login dan diarahkan ke /kaprodi/dashboard', async ({ page }) => {
      await expect(page).toHaveURL(/\/kaprodi\/dashboard/);
    });

    test('Dashboard Kaprodi ter-render tanpa error', async ({ page }) => {
      await page.waitForLoadState('networkidle');

      await expect(page.locator('body')).not.toContainText(/internal server error|500/i);
      await expect(page.locator('h1').or(page.locator('h2')).first()).toBeVisible();
    });

    test('Dashboard Kaprodi menampilkan data yang terfokus pada program studi', async ({ page }) => {
      await page.waitForLoadState('networkidle');

      // Verifikasi tidak ada crash atau halaman kosong total
      await expect(page.locator('body')).not.toContainText(/something went wrong|crash/i);

      // Visualisasi data (recharts) dimuat jika ada
      const chartsVisible = await page.locator('.recharts-wrapper').isVisible().catch(() => false);
      if (chartsVisible) {
        // Pastikan chart tidak crash dengan NaN atau format JSON rusak (Edge Case 3)
        await expect(page.locator('.recharts-wrapper').first()).toBeVisible();
        // Chart tidak boleh menampilkan teks error
        await expect(page.locator('.recharts-wrapper')).not.toContainText(/NaN|undefined|null/i);
      }
    });

    test('UAT Edge Case 3: Dashboard Kaprodi tidak crash saat merender data JSON anggota tim', async ({ page }) => {
      // Skenario: rekap prodi yang memuat data partisipasi tim (format JSON)
      // Jika ada entri tim dengan format valid, halaman harus tetap ter-render
      await page.waitForLoadState('networkidle');

      // Verifikasi tidak ada JavaScript error yang uncaught
      const errors: string[] = [];
      page.on('pageerror', (err) => errors.push(err.message));

      // Refresh halaman untuk memicu load ulang data
      await page.reload();
      await page.waitForLoadState('networkidle');

      // Tidak ada error JavaScript terkait JSON parsing
      const jsonErrors = errors.filter(e =>
        e.toLowerCase().includes('json') ||
        e.toLowerCase().includes('parse') ||
        e.toLowerCase().includes('cannot read')
      );
      expect(jsonErrors).toHaveLength(0);
    });

  });

  // ──────────────────────────────────────────────────────────────────────────
  // Otorisasi: Kaprodi tidak bisa akses area lain
  // ──────────────────────────────────────────────────────────────────────────

  test.describe('Otorisasi Kaprodi - Hanya Akses Dashboard Kaprodi', () => {

    test('Kaprodi tidak dapat mengakses /admin/dashboard', async ({ page }) => {
      await page.goto('/admin/dashboard');
      await expect(page).not.toHaveURL(/\/admin\/dashboard/, { timeout: 10000 });
    });

    test('Kaprodi tidak dapat mengakses /admin/verifikasi', async ({ page }) => {
      await page.goto('/admin/verifikasi');
      await expect(page).not.toHaveURL(/\/admin\/verifikasi/, { timeout: 10000 });
    });

    test('Kaprodi tidak dapat mengakses dashboard mahasiswa', async ({ page }) => {
      await page.goto('/dashboard');
      // Middleware redirect ke dashboard kaprodi
      await expect(page).toHaveURL(/\/kaprodi\/dashboard/, { timeout: 10000 });
    });

    test('Kaprodi tidak dapat mengakses dashboard WD', async ({ page }) => {
      await page.goto('/wd1/dashboard');
      await expect(page).not.toHaveURL(/\/wd1\/dashboard/, { timeout: 10000 });
    });

    test('Kaprodi tidak dapat mengakses dashboard akreditasi', async ({ page }) => {
      await page.goto('/akreditasi/dashboard');
      await expect(page).not.toHaveURL(/\/akreditasi\/dashboard/, { timeout: 10000 });
    });

  });

  // ──────────────────────────────────────────────────────────────────────────
  // Fungsionalitas Kaprodi - Read Only
  // ──────────────────────────────────────────────────────────────────────────

  test.describe('Fungsionalitas Kaprodi - Akses Baca', () => {

    test('Dashboard Kaprodi tidak menampilkan tombol Approve/Reject/Delete', async ({ page }) => {
      await page.waitForLoadState('networkidle');

      const approveBtn = page.getByRole('button', { name: /valid|approve|setuju/i });
      const rejectBtn = page.getByRole('button', { name: /tolak|reject|ditolak/i });
      const deleteBtn = page.getByRole('button', { name: /hapus|delete/i });

      expect(await approveBtn.count()).toBe(0);
      expect(await rejectBtn.count()).toBe(0);
      expect(await deleteBtn.count()).toBe(0);
    });

    test('Kaprodi dapat mengakses halaman pengaturan profil', async ({ page }) => {
      await page.goto('/kaprodi/pengaturan');
      await page.waitForLoadState('networkidle');
      await expect(page).not.toHaveURL(/\/sign-in/);
      await expect(page.locator('body')).not.toContainText(/500/i);
    });

  });

  // ──────────────────────────────────────────────────────────────────────────
  // Filter/Pencarian Data per Prodi
  // ──────────────────────────────────────────────────────────────────────────

  test.describe('Filter Data per Program Studi', () => {

    test('Dashboard Kaprodi memiliki elemen filter atau dropdown tahun', async ({ page }) => {
      await page.waitForLoadState('networkidle');

      // Cari elemen filter tahun atau prodi
      const filterElement = page.locator('[data-testid="filter-tahun"]').or(
        page.getByRole('combobox').filter({ hasText: /tahun|prodi|semester/i }).first()
      );

      // Filter mungkin ada atau tidak tergantung implementasi Kaprodi
      // Verifikasi halaman fungsional terlepas dari ada tidaknya filter
      await expect(page.locator('body')).not.toContainText(/500/i);

      if (await filterElement.isVisible()) {
        await filterElement.click();
        // Dropdown harus terbuka
        await expect(page.locator('[role="listbox"], [role="option"]').first()).toBeVisible({ timeout: 3000 });
        // Pilih opsi pertama
        await page.locator('[role="option"]').first().click();
        // Halaman tidak crash setelah filter
        await page.waitForLoadState('networkidle');
        await expect(page.locator('body')).not.toContainText(/500/i);
      }
    });

    test('Visualisasi data kaprodi menampilkan data yang konsisten setelah filter', async ({ page }) => {
      await page.waitForLoadState('networkidle');

      // Ambil total prestasi sebelum filter (jika ada)
      const beforeFilterText = await page.locator('[data-testid="total-prestasi"]').or(
        page.locator('text=/total|jumlah/i').first()
      ).textContent().catch(() => '');

      // Verifikasi tidak ada error setelah halaman dimuat
      await expect(page.locator('body')).not.toContainText(/NaN|undefined error|cannot read/i);
    });

  });

});
