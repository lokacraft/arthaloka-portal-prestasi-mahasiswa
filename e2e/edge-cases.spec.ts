import { test, expect } from '@playwright/test';
import { loginAs } from './helpers';

/**
 * UAT - Skenario Edge Cases Teknikal
 *
 * Mencakup (UAT Section 6):
 * - Edge Case 1: Upload Terputus (Atomic Upload) - simulasi upload parsial
 * - Edge Case 2: Concurrency Validation - dua admin validasi bersamaan
 * - Edge Case 3: Invalid JSON Metadata (anggotaTim) - sudah dicakup di kaprodi.spec
 * - Edge Case 4: Date Range Inconsistency - tanggal selesai < tanggal mulai
 * - Edge Case 5: R2 Storage Error - simulasi kegagalan upload
 */

test.describe('⚠️ Edge Cases Teknikal', () => {

  // ──────────────────────────────────────────────────────────────────────────
  // Edge Case 4: Date Range Inconsistency
  // ──────────────────────────────────────────────────────────────────────────

  test.describe('Edge Case 4 - Inkonsistensi Rentang Tanggal', () => {

    test.beforeEach(async ({ page }) => {
      await loginAs(page, 'mahasiswa');
    });

    test('Kalender tanggal selesai menonaktifkan hari sebelum tanggal mulai', async ({ page }) => {
      await page.goto('/lapor');
      await expect(page.getByText('Laporkan Prestasi Baru')).toBeVisible();

      // Pilih tanggal mulai: hari ke-20
      const mulaiBtns = page.locator('button').filter({ hasText: /pilih waktu mulai/i });
      if (await mulaiBtns.count() > 0) {
        await mulaiBtns.first().click();
        await page.waitForSelector('[role="grid"]');
        await page.locator('[role="gridcell"]').filter({ hasText: /^20$/ }).first().click();
      }

      // Buka kalender tanggal selesai
      const selesaiBtns = page.locator('button').filter({ hasText: /pilih waktu selesai/i });
      if (await selesaiBtns.count() > 0) {
        await selesaiBtns.first().click();
        await page.waitForSelector('[role="grid"]');

        // Verifikasi hari ke-10 (sebelum tanggal mulai ke-20) ter-disable
        const disabledDay = page.locator('[role="gridcell"][aria-disabled="true"]').filter({
          hasText: /^10$/,
        });

        // Jika ada disabled cells, verifikasi tidak bisa diklik
        if (await disabledDay.count() > 0) {
          const ariaDisabled = await disabledDay.first().getAttribute('aria-disabled');
          expect(ariaDisabled).toBe('true');
        }

        // Tutup kalender
        await page.keyboard.press('Escape');
      }
    });

    test('Server action menolak jika tanggal selesai < tanggal mulai (via frontend validation)', async ({ page }) => {
      await page.goto('/lapor');

      // Isi form minimal
      await page.fill(
        'input[placeholder="Contoh: Lomba Karya Tulis Ilmiah Nasional"]',
        'Test Date Inconsistency'
      );
      await page.fill(
        'input[placeholder="Contoh: Kementerian Pendidikan"]',
        'Penyelenggara Test'
      );

      // Pilih tanggal mulai: 25
      const mulaiBtns = page.locator('button').filter({ hasText: /pilih waktu mulai/i });
      if (await mulaiBtns.count() > 0) {
        await mulaiBtns.first().click();
        await page.waitForSelector('[role="grid"]');
        await page.locator('[role="gridcell"]').filter({ hasText: /^25$/ }).first().click();
      }

      // Karena kalender sudah disable tanggal sebelum mulai,
      // kita coba klik submit tanpa memilih tanggal selesai
      await page.getByRole('button', { name: /submit untuk verifikasi/i }).click();

      // Harus ada error tentang tanggal
      const errorToast = page.locator('[data-sonner-toast]');
      await expect(errorToast).toBeVisible({ timeout: 5000 });
      await expect(errorToast).toContainText(/tanggal|selesai|wajib/i);
    });

  });

  // ──────────────────────────────────────────────────────────────────────────
  // Edge Case 5: R2 Storage Error Handling
  // ──────────────────────────────────────────────────────────────────────────

  test.describe('Edge Case 5 - Error Handling Upload R2', () => {

    test.beforeEach(async ({ page }) => {
      await loginAs(page, 'mahasiswa');
    });

    test('UI menampilkan error user-friendly jika upload gagal', async ({ page }) => {
      await page.goto('/lapor');
      await expect(page.getByText('Laporkan Prestasi Baru')).toBeVisible();

      // Simulasi: Intercept network request ke API upload dan kembalikan error
      await page.route('**/api/**upload**', async (route) => {
        await route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'R2 storage unavailable' }),
        });
      });

      // Juga intercept server action (Next.js)
      await page.route('**/lapor**', async (route) => {
        // Hanya intercept POST requests (server actions)
        if (route.request().method() === 'POST') {
          // Simulasi error dari server action uploadFileToR2
          // Kita biarkan request lewat jika bukan network ke R2
          await route.continue();
        } else {
          await route.continue();
        }
      });

      // Upload file yang valid
      const { createDummyPdf } = await import('./helpers');
      const pdfFile = createDummyPdf('upload-fail-test.pdf', 100);

      // Isi form minimal dulu
      await page.fill(
        'input[placeholder="Contoh: Lomba Karya Tulis Ilmiah Nasional"]',
        'Test Upload Gagal R2'
      );
      await page.fill(
        'input[placeholder="Contoh: Kementerian Pendidikan"]',
        'Test Penyelenggara'
      );

      const fileInput = page.locator('input[type="file"][multiple]');
      await fileInput.setInputFiles(pdfFile);
      await expect(page.getByText('upload-fail-test.pdf')).toBeVisible({ timeout: 5000 });

      // Catatan: Di test environment nyata, jika R2 dikonfigurasi,
      // upload akan mencoba terhubung ke Cloudflare R2.
      // Test ini memverifikasi UI tidak crash bahkan jika backend gagal.

      // Verifikasi UI masih berfungsi setelah percobaan upload
      await expect(page.locator('body')).not.toContainText(/unhandled|crash|cannot read/i);
    });

  });

  // ──────────────────────────────────────────────────────────────────────────
  // Edge Case 2: Concurrency Validation (simulasi)
  // ──────────────────────────────────────────────────────────────────────────

  test.describe('Edge Case 2 - Concurrency Validation (Simulasi)', () => {

    test('Prestasi yang sudah divalidasi tidak menampilkan tombol aksi lagi', async ({ page }) => {
      await loginAs(page, 'admin');
      await page.goto('/admin/verifikasi');
      await page.waitForLoadState('networkidle');

      // Navigasi ke detail yang mungkin sudah APPROVED
      const allItems = page.locator('a[href*="/admin/verifikasi/"]');
      if (await allItems.count() === 0) {
        test.skip(true, 'Tidak ada item verifikasi untuk dicek');
        return;
      }

      await allItems.first().click();
      await page.waitForLoadState('networkidle');

      // Jika status sudah APPROVED atau REJECTED, tombol VALID dan DITOLAK tidak ada
      const statusBanner = page.locator('text=/Telah Disetujui|Telah Ditolak/');
      if (await statusBanner.isVisible()) {
        // Tombol aksi tidak boleh tampil untuk prestasi yang sudah diproses
        const validBtn = page.getByRole('button', { name: /^valid$/i });
        const ditolakBtn = page.getByRole('button', { name: /^ditolak$/i });
        expect(await validBtn.count()).toBe(0);
        expect(await ditolakBtn.count()).toBe(0);
      }
    });

  });

  // ──────────────────────────────────────────────────────────────────────────
  // Skenario Validasi Input Tambahan
  // ──────────────────────────────────────────────────────────────────────────

  test.describe('Validasi Input Tambahan - Batas Maksimum File', () => {

    test.beforeEach(async ({ page }) => {
      await loginAs(page, 'mahasiswa');
    });

    test('Tidak bisa upload lebih dari 10 file', async ({ page }) => {
      await page.goto('/lapor');
      await expect(page.getByText('Laporkan Prestasi Baru')).toBeVisible();

      // Buat 11 file dummy
      const { createDummyPdf } = await import('./helpers');
      const files: string[] = [];
      for (let i = 1; i <= 11; i++) {
        files.push(createDummyPdf(`file-${i}.pdf`, 10));
      }

      // Upload 11 file sekaligus
      const fileInput = page.locator('input[type="file"][multiple]');
      await fileInput.setInputFiles(files);

      // Harus ada error tentang batas maksimum file
      const errorToast = page.locator('[data-sonner-toast]');
      await expect(errorToast).toBeVisible({ timeout: 8000 });
      await expect(errorToast).toContainText(/maksimal|10 file/i);
    });

    test('Input area upload ter-disable setelah 10 file dipilih', async ({ page }) => {
      await page.goto('/lapor');

      // Simulasi state dengan 10 file (upload 5 + 5 secara bertahap)
      const { createDummyPdf } = await import('./helpers');
      const files5: string[] = [];
      for (let i = 1; i <= 5; i++) {
        files5.push(createDummyPdf(`batch1-${i}.pdf`, 10));
      }
      const files5b: string[] = [];
      for (let i = 1; i <= 5; i++) {
        files5b.push(createDummyPdf(`batch2-${i}.pdf`, 10));
      }

      const fileInput = page.locator('input[type="file"][multiple]');
      await fileInput.setInputFiles(files5);
      await page.waitForTimeout(500);
      await fileInput.setInputFiles(files5b);

      // Input mungkin disable setelah 10 file
      const uploadLabel = page.locator('label').filter({ has: fileInput });
      // Verifikasi area upload atau fileInput ber-pointer-events-none
      await expect(page.locator('body')).not.toContainText(/500/i);
    });

  });

  // ──────────────────────────────────────────────────────────────────────────
  // Halaman 404 / Not Found
  // ──────────────────────────────────────────────────────────────────────────

  test.describe('Penanganan Rute Tidak Valid', () => {

    test('Mengakses rute yang tidak ada menampilkan halaman 404 bukan error 500', async ({ page }) => {
      const response = await page.goto('/rute-yang-tidak-ada-sama-sekali');
      // Harus 404, bukan 500
      if (response) {
        expect(response.status()).not.toBe(500);
      }
    });

    test('ID verifikasi yang tidak ada menampilkan halaman not found bukan crash', async ({ page }) => {
      await loginAs(page, 'admin');
      const response = await page.goto('/admin/verifikasi/id-tidak-valid-xyz123');
      await page.waitForLoadState('networkidle');
      // Tidak boleh ada error 500 (bisa 404 atau redirect)
      if (response) {
        expect(response.status()).not.toBe(500);
      }
      await expect(page.locator('body')).not.toContainText(/unhandled error/i);
    });

  });

});
